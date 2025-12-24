import { Page } from '@playwright/test';
import { AIValidator } from '../../utils/AIValidator';
import { BoardBotPage, ProductInfo } from '../../pages/AdvancedMC/BoardBotPage';
import { ReportGenerator } from '../../utils/ReportGenerator';
import {
  parameter,
  attachment,
  step as allureStep,
  label,
  issue
} from 'allure-js-commons';

export class TestBase {
  /**
   * Clean up old reports, keeping last 100
   */
  static async setupReportCleanup(testDir: string): Promise<void> {
    const fs = require('fs');
    const path = require('path');
    const reportsDir = path.join(testDir, '../../test-results/reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const files = fs.readdirSync(reportsDir)
      .filter((file: string) => file.endsWith('.md') || file.endsWith('.json'))
      .map((file: string) => ({
        name: file,
        time: fs.statSync(path.join(reportsDir, file)).mtime.getTime()
      }))
      .sort((a: any, b: any) => b.time - a.time);
    
    if (files.length > 100) {
      console.log(`\n🗑️  Keeping latest 100 reports, removing ${files.length - 100} old reports\n`);
      files.slice(100).forEach((file: any) => {
        fs.unlinkSync(path.join(reportsDir, file.name));
        console.log(`   Deleted: ${file.name}`);
      });
    } else {
      console.log(`\n📁  Current reports: ${files.length} (will keep up to 100)\n`);
    }
  }

  /**
   * Navigate to PICMG, accept cookies, click Member Products
   */
  static async navigateAndSetup(page: Page, boardBotPage: BoardBotPage): Promise<void> {
    await allureStep('Opening PICMG website', async () => {
      await page.goto('/');
      await attachment('Homepage URL', page.url(), { contentType: 'text/plain' });
    });

    await allureStep('Accepting cookie consent', async () => {
      await boardBotPage.acceptCookies();
    });

    await allureStep('Navigating to Member Products section', async () => {
      await boardBotPage.navigateToMemberProducts();
      await page.waitForTimeout(2000);
    });
  }

  /**
   * Submit search query and measure response latency
   */
  static async submitSearchAndMeasureLatency(
    page: Page,
    boardBotPage: BoardBotPage,
    searchPrompt: string
  ): Promise<number> {
    
    await allureStep(`Submitting query: "${searchPrompt.substring(0, 50)}..."`, async () => {
      await boardBotPage.askBoardBot(searchPrompt);
    });

    // Start timer AFTER submitting query, BEFORE waiting for results
    const startTime = Date.now();
    console.log('⏱️  Timer started - measuring response time...');

    await allureStep('Waiting for BoardBot response', async () => {
      await boardBotPage.waitForResults(20000);
    });

    // End timer IMMEDIATELY after results appear
    const endTime = Date.now();
    const responseLatency = (endTime - startTime) / 1000;
    
    console.log(`\n⏱️  Response Latency: ${responseLatency.toFixed(2)} seconds\n`);
    
    await parameter('Response Latency', `${responseLatency.toFixed(2)}s`);
    
    if (responseLatency < 8) {
      await label('response_speed', 'fast');
    } else if (responseLatency < 15) {
      await label('response_speed', 'normal');
    } else {
      await label('response_speed', 'slow');
    }

    return responseLatency;
  }

  /**
   * Extract products and take screenshot
   */
  static async extractProducts(
    page: Page,
    boardBotPage: BoardBotPage,
    maxProducts: number
  ): Promise<ProductInfo[]> {
    // Take screenshot and attach to Allure
    const screenshot = await page.screenshot({ 
      fullPage: true,
      type: 'png'
    });
    await attachment('Search Results Page (Full)', screenshot, { 
      contentType: 'image/png',
      fileExtension: '.png'
    });

    const products = await boardBotPage.extractProductInfo(maxProducts);
    await parameter('Products Found', products.length.toString());
    
    if (products.length > 0) {
      console.log(`\n✅ Extracted ${products.length} products\n`);
    } else {
      console.log(`\n⚠️  No products extracted\n`);
    }

    return products;
  }

  /**
   * Validate categories and generate comprehensive report
   * Fails the test if no products found or all products have wrong category
   */
  static async validateAndGenerateReport(
    products: ProductInfo[],
    searchPrompt: string,
    expectedCategory: string,
    originalProductUrl: string,
    responseLatency: number,
    testDir: string,
    testId: string
  ): Promise<void> {
    // Generate report first
    const report = ReportGenerator.generateReport(
      searchPrompt,
      products,
      expectedCategory,
      originalProductUrl
    );
    
    // Check if test should fail
    const shouldFail = products.length === 0 || report.suitableProducts === 0;
    
    if (shouldFail) {
      if (products.length === 0) {
        console.error('\n❌ TEST FAILED: No products found in results\n');
      } else {
        console.error(`\n❌ TEST FAILED: No suitable products found (0/${products.length} match expected category: ${expectedCategory})\n`);
      }
    }
    
    const originalIndex = report.originalProduct;
    if (originalIndex >= 0) {
      const p = products[originalIndex];
      const isMatch = p.category.toLowerCase().includes(expectedCategory.toLowerCase());
      await parameter(
        '⭐ ORIGINAL PRODUCT',
        `${p.productName} | ${isMatch ? '✅ SUITABLE' : '❌ UNSUITABLE'} | Category: ${p.category} ${isMatch ? '(Match!)' : `(Expected: ${expectedCategory})`} | ${p.moreInfoUrl}`
      );
    }
    
    for (const [index, product] of products.entries()) {
      const isOriginal = index === originalIndex;
      const isMatch = product.category.toLowerCase().includes(expectedCategory.toLowerCase());
      const status = isMatch ? '✅ SUITABLE' : '❌ UNSUITABLE';
      const reason = isMatch 
        ? `Category matches (${expectedCategory})` 
        : `Wrong category: ${product.category} (Expected: ${expectedCategory})`;
      
      const productLabel = isOriginal ? `Product ${index + 1} ⭐ ORIGINAL` : `Product ${index + 1}`;
      const productInfo = `${product.productName} | ${status} | ${reason}`;
      
      await parameter(productLabel, productInfo);
      
      if (product.moreInfoUrl && product.moreInfoUrl.startsWith('http')) {
        await parameter(`  └─ URL ${index + 1}`, product.moreInfoUrl);
      }
    }
    
    await attachment('Test Report (Markdown)', 
      ReportGenerator.formatReportAsMarkdown(report), 
      { contentType: 'text/markdown' }
    );
    
    await attachment('Test Report (Table)', 
      ReportGenerator.formatReportAsTable(report), 
      { contentType: 'text/plain' }
    );
    
    console.log(ReportGenerator.formatReportAsTable(report));
    
    const fs = require('fs');
    const path = require('path');
    const reportsDir = path.join(testDir, '../../test-results/reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportsDir, `${testId}_${timestamp}.md`);
    
    fs.writeFileSync(reportPath, ReportGenerator.formatReportAsMarkdown(report));
    console.log(`\n📄 Report saved to: ${reportPath}\n`);
    
    await parameter('Total Products', report.totalResults.toString());
    await parameter('Suitable Products', report.suitableProducts.toString());
    await parameter('Unsuitable Products', report.unsuitableProducts.toString());
    await parameter('Original Product Found', report.originalProduct >= 0 ? `Yes (#${report.originalProduct + 1})` : 'No');
    
    const summaryReport = `
# 📈 TEST RESULTS SUMMARY - ${testId}

## ⏱️ Performance Metrics
- **Response Latency:** ${responseLatency.toFixed(2)} seconds ${responseLatency < 8 ? '⚡ (Fast)' : responseLatency < 15 ? '✅ (Normal)' : '⚠️ (Slow)'}

## 📝 Search Query
\`\`\`
${searchPrompt}
\`\`\`

## 📊 Results Breakdown
- **Total Products Found:** ${report.totalResults}
- **✅ Suitable Products (${expectedCategory}):** ${report.suitableProducts}
- **⚠️ Unsuitable Products:** ${report.unsuitableProducts}
- **⭐ Original Product Found:** ${report.originalProduct >= 0 ? `Yes (Product #${report.originalProduct + 1})` : 'No'}

${report.unsuitableProducts > 0 ? '## ⚠️ Warnings\n' + report.warnings.map(w => `- ${w}`).join('\n') : ''}

## 📦 Product Details
${report.products.map((p, i) => `
### ${i + 1}. ${i === report.originalProduct ? '⭐ ' : ''}${p.productName}${i === report.originalProduct ? ' (Original Product)' : ''}
- **Manufacturer:** ${p.manufacturer}
- **Category:** ${p.category} ${p.category.toLowerCase().includes(expectedCategory.toLowerCase()) ? '✅' : '⚠️'}
- **Subcategory:** ${p.subcategory}
- **Product Link:** ${p.moreInfoUrl && p.moreInfoUrl.startsWith('http') ? `[🔗 View Product Page](${p.moreInfoUrl})` : p.moreInfoUrl}
`).join('\n')}
${report.originalProduct >= 0 ? '\n⭐ = Original product that inspired this search' : ''}
    `.trim();
    
    await attachment('📊 Test Results Summary', summaryReport, { contentType: 'text/markdown' });
    
    if (report.totalResults > 0) {
      console.log(`✅ Found ${report.totalResults} total products`);
      console.log(`✅ Suitable (${expectedCategory}): ${report.suitableProducts}`);
      
      if (report.unsuitableProducts > 0) {
        console.warn(`⚠️  Unsuitable products: ${report.unsuitableProducts}`);
        
        report.warnings.forEach(warning => {
          issue('Category Mismatch', warning);
        });
      }
    } else {
      console.log(`⚠️  No products found in results`);
    }
    
    // Throw error to fail the test if needed
    if (shouldFail) {
      if (products.length === 0) {
        throw new Error(`❌ TEST FAILED: No products found in search results`);
      } else {
        throw new Error(`❌ TEST FAILED: No suitable products found - 0/${products.length} products match expected category "${expectedCategory}". All products: ${products.map(p => `${p.productName} (${p.category})`).join(', ')}`);
      }
    }
  }

  /**
   * Verify product data completeness
   */
  static async verifyProductData(products: ProductInfo[]): Promise<void> {
    if (products.length > 0) {
      products.forEach((product: ProductInfo, index: number) => {
        allureStep(`Product ${index + 1}: ${product.productName}`, async () => {
          console.log(`Product ${index + 1}: ${product.productName}`);
          console.log(`  - Manufacturer: ${product.manufacturer}`);
          console.log(`  - Category: ${product.category}`);
          console.log(`  - Subcategory: ${product.subcategory}`);
          console.log(`  - URL: ${product.moreInfoUrl}`);
          
          const productDetails = `
Product: ${product.productName}
Manufacturer: ${product.manufacturer}
Category: ${product.category}
Subcategory: ${product.subcategory}
More Info: ${product.moreInfoUrl}
          `.trim();
          
          attachment(`Product ${index + 1} Details`, productDetails, { contentType: 'text/plain' });
        });
      });
    } else {
      console.log('⚠️  No products to validate');
    }
  }

  /**
   * Validate products using AI by reading actual product descriptions
   * Opens each product's More Info page and validates against search query
   */
  static async validateWithAI(
  page: Page,
  boardBotPage: BoardBotPage,
  products: ProductInfo[],
  searchPrompt: string,
  expectedCategory: string,
  testId: string
): Promise<void> {
  const useAI = process.env.USE_AI_VALIDATION === 'true';
  
  if (!useAI) {
    console.log('ℹ️  AI validation disabled (set USE_AI_VALIDATION=true to enable)');
    return;
  }

  if (products.length === 0) {
    console.log('ℹ️  No products to validate with AI');
    return;
  }

  console.log('\n🤖 AI VALIDATION ENABLED\n');
  
  const aiValidator = new AIValidator();
  
  // Check if Ollama is available
  const available = await aiValidator.checkAvailability();
  if (!available) {
    console.log('⚠️  Ollama not available - skipping AI validation');
    console.log('   Make sure Ollama is running: ollama serve');
    return;
  }

  const suiteNumber = AIValidator.getSuiteNumber(testId);
  console.log(`📍 Suite: ${suiteNumber} | Category: ${expectedCategory}`);
  
  // Limit to max 5 products
  const productsToValidate = Math.min(products.length, 5);
  console.log(`📦 Validating ${productsToValidate} products with AI...\n`);

  let relevantCount = 0;
  const aiResults: Array<{index: number, isRelevant: boolean, confidence: number, reasoning: string}> = [];

  for (let i = 0; i < productsToValidate; i++) {
    const product = products[i];
    console.log(`\n🤖 AI validating Product ${i + 1}: ${product.productName}`);
    
    // Get product description from More Info page
    const description = await boardBotPage.getProductDescription(i);
    
    if (!description || description.length < 50) {
      console.log(`   ⚠️  Description too short or not found, skipping AI validation`);
      await parameter(
        `🤖 AI Product ${i + 1}`,
        `⚠️ Skipped - No description available`
      );
      continue;
    }
    
    // Validate with AI
    const aiResult = await aiValidator.validateProductRelevance(
      product.productName,
      product.category,
      description,
      searchPrompt,
      expectedCategory,
      suiteNumber
    );

    const emoji = aiResult.isRelevant ? '✅' : '❌';
    console.log(`   ${emoji} AI says: ${aiResult.isRelevant ? 'RELEVANT' : 'NOT RELEVANT'}`);
    console.log(`   📊 Confidence: ${aiResult.confidence}%`);
    console.log(`   💭 Reasoning: ${aiResult.reasoning}`);
    
    // Track results
    if (aiResult.isRelevant) {
      relevantCount++;
    }
    aiResults.push({
      index: i,
      isRelevant: aiResult.isRelevant,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning
    });
    
    await parameter(
      `🤖 AI Product ${i + 1}`,
      `${aiResult.isRelevant ? '✅' : '❌'} ${aiResult.confidence}% - ${aiResult.reasoning}`
    );
    
    // Add to Allure report
    const aiSummary = `
**Product:** ${product.productName}
**AI Verdict:** ${aiResult.isRelevant ? '✅ RELEVANT' : '❌ NOT RELEVANT'}
**Confidence:** ${aiResult.confidence}%
**Reasoning:** ${aiResult.reasoning}
**Original Product:** ${aiResult.originalProduct || 'Unknown'}
    `.trim();
    
    await attachment(
      `🤖 AI Analysis - Product ${i + 1}`,
      aiSummary,
      { contentType: 'text/plain' }
    );
  }
  
  console.log('\n✨ AI validation complete\n');
  console.log(`📊 AI Results: ${relevantCount}/${productsToValidate} products marked as RELEVANT\n`);
  
  // Add summary to Allure
  await parameter('🤖 AI Summary', `${relevantCount}/${productsToValidate} relevant products`);
  
  // Fail test if NO products are relevant according to AI
  if (relevantCount === 0) {
    const errorMsg = `❌ AI VALIDATION FAILED: None of the ${productsToValidate} products are relevant according to AI analysis.\n\nAI Verdicts:\n${aiResults.map(r => `  Product ${r.index + 1}: ${r.isRelevant ? '✅' : '❌'} (${r.confidence}%) - ${r.reasoning}`).join('\n')}`;
    console.error(`\n${errorMsg}\n`);
    throw new Error(errorMsg);
  } else {
    console.log(`✅ AI validation passed: Found ${relevantCount} relevant product(s)\n`);
  }
}
}