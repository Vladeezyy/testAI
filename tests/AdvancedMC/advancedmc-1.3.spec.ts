import { test, expect } from '@playwright/test';
import { BoardBotPage, ProductInfo } from '../../pages/AdvancedMC/BoardBotPage';
import { ReportGenerator } from '../../utils/ReportGenerator';
import { 
  epic, 
  feature, 
  story, 
  severity, 
  Severity,
  tag, 
  owner, 
  description,
  parameter,
  attachment,
  step as allureStep,
  label,
  issue
} from 'allure-js-commons';

test.describe('AdvancedMC Product Search - Suite 1.3', () => {
  
  // Clear old reports but keep last 100
  test.beforeAll(async () => {
    const fs = require('fs');
    const path = require('path');
    const reportsDir = path.join(__dirname, '../../test-results/reports');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Get all report files sorted by modification time (newest first)
    const files = fs.readdirSync(reportsDir)
      .filter((file: string) => file.endsWith('.md') || file.endsWith('.json'))
      .map((file: string) => ({
        name: file,
        time: fs.statSync(path.join(reportsDir, file)).mtime.getTime()
      }))
      .sort((a: any, b: any) => b.time - a.time);
    
    // Keep latest 10, delete the rest
    if (files.length > 100) {
      console.log(`\n🗑️  Keeping latest 100 reports, removing ${files.length - 100} old reports\n`);
      files.slice(100).forEach((file: any) => {
        fs.unlinkSync(path.join(reportsDir, file.name));
        console.log(`   Deleted: ${file.name}`);
      });
    } else {
      console.log(`\n📁  Current reports: ${files.length} (will keep up to 100)\n`);
    }
  });
  
  test('TC3: Search for AdvancedMC board with Intel Xeon E-2276ME and flexible fabric options', async ({ page }, testInfo) => {
    // Allure metadata
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('AdvancedMC Intel Xeon E-2276ME Board');
    await severity(Severity.CRITICAL);
    await tag('AdvancedMC');
    await tag('BoardBot');
    await tag('Search');
    await tag('Xeon-E-2276ME');
    await tag('PCIe');
    await tag('RapidIO');
    await owner('QA Team');
    
    // Test configuration
    const searchPrompt = 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO.';
    const maxProducts = 5;
    const expectedCategory = 'AdvancedMC';
    const originalProductUrl = 'am-c8x-msd-amc-processor'; // URL slug of the original product that inspired the search
    
    // Add test description with full prompt
    await description(`
**Test Objective:** Search for AdvancedMC boards with Intel Xeon E-2276ME processor

**Search Query:**
${searchPrompt}

**Requirements:**
- Intel Xeon E-2276ME processor (6 cores)
- High-performance computing capability
- Flexible fabric options (PCIe or RapidIO)

**Validation:**
- Extract up to ${maxProducts} products
- Verify category matches: ${expectedCategory}
- Generate detailed report with warnings for non-matching categories
    `);
    
    // Add shortened parameter for quick view
    await parameter('Search Query (Short)', searchPrompt.substring(0, 100) + '...');
    await parameter('Max Products', maxProducts.toString());
    await parameter('Expected Category', expectedCategory);
    
    // Attach full prompt as text file for easy access
    await attachment('Full Search Query', searchPrompt, { contentType: 'text/plain' });
    
    const boardBotPage = new BoardBotPage(page);
    
    // Step 1: Navigate to homepage
    await test.step('Navigate to PICMG homepage', async () => {
      await allureStep('Opening PICMG website', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(/PICMG/i);
        await attachment('Homepage URL', page.url(), { contentType: 'text/plain' });
      });
    });
    
    // Step 2: Accept cookies
    await test.step('Accept cookies', async () => {
      await allureStep('Accepting cookie consent', async () => {
        await boardBotPage.acceptCookies();
      });
    });
    
    // Step 3: Navigate to Member Products
    await test.step('Click on Member Products', async () => {
      await allureStep('Navigating to Member Products section', async () => {
        await boardBotPage.navigateToMemberProducts();
        await page.waitForTimeout(2000);
      });
    });
    
    // Step 4: Submit search query and START TIMER
    let startTime = 0;
    await test.step('Submit search query to BoardBot', async () => {
      await allureStep(`Submitting query: "${searchPrompt.substring(0, 50)}..."`, async () => {
        await boardBotPage.askBoardBot(searchPrompt);
        startTime = Date.now();
        console.log('⏱️  Timer started - measuring response time...');
      });
    });
    
    // Step 5: Wait for results and STOP TIMER
    let responseLatency = 0;
    await test.step('Wait for search results and measure latency', async () => {
      await allureStep('Waiting for BoardBot response', async () => {
        await boardBotPage.waitForResults(20000);
        const endTime = Date.now();
        
        responseLatency = (endTime - startTime) / 1000;
        
        console.log(`\n⏱️  Response Latency: ${responseLatency.toFixed(2)} seconds (from clicking Ask to results appearing)\n`);
        
        await parameter('Response Latency', `${responseLatency.toFixed(2)}s`);
        
        if (responseLatency < 8) {
          await label('response_speed', 'fast');
        } else if (responseLatency < 15) {
          await label('response_speed', 'normal');
        } else {
          await label('response_speed', 'slow');
        }
      });
    });
    
    // Step 6: Take screenshot
    await test.step('Capture results screenshot', async () => {
      const screenshot = await page.screenshot({ fullPage: true });
      await attachment('Search Results Page', screenshot, { contentType: 'image/png' });
    });
    
    // Step 7: Extract products
    let products: ProductInfo[] = [];
    await test.step('Extract product information', async () => {
      await allureStep('Extracting product data from results table', async () => {
        products = await boardBotPage.extractProductInfo(maxProducts);
        await parameter('Products Found', products.length.toString());
        
        if (products.length > 0) {
          console.log(`\n✅ Extracted ${products.length} products\n`);
        } else {
          console.log(`\n⚠️  No products extracted\n`);
        }
      });
    });
    
    // Step 8: Generate report
    await test.step('Validate categories and generate report', async () => {
      await allureStep('Validating product categories and generating report', async () => {
        const report = ReportGenerator.generateReport(
          searchPrompt,
          products,
          expectedCategory,
          originalProductUrl
        );
        
        // Add original product first if found
        const originalIndex = report.originalProduct;
        if (originalIndex >= 0) {
          const p = products[originalIndex];
          const isMatch = p.category.toLowerCase().includes(expectedCategory.toLowerCase());
          await parameter(
            '⭐ ORIGINAL PRODUCT',
            `${p.productName} | ${isMatch ? '✅ SUITABLE' : '❌ UNSUITABLE'} | Category: ${p.category} ${isMatch ? '(Match!)' : `(Expected: ${expectedCategory})`} | ${p.moreInfoUrl}`
          );
        }
        
        // Add each product with detailed info
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
        
        // Save markdown report
        const fs = require('fs');
        const path = require('path');
        const reportsDir = path.join(__dirname, '../../test-results/reports');
        
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(reportsDir, `AdvancedMC_TC3_${timestamp}.md`);
        
        fs.writeFileSync(reportPath, ReportGenerator.formatReportAsMarkdown(report));
        console.log(`\n📄 Report saved to: ${reportPath}\n`);
        
        await parameter('Total Products', report.totalResults.toString());
        await parameter('Suitable Products', report.suitableProducts.toString());
        await parameter('Unsuitable Products', report.unsuitableProducts.toString());
        await parameter('Original Product Found', report.originalProduct >= 0 ? `Yes (#${report.originalProduct + 1})` : 'No');
        
        // Create highlighted summary
        const summaryReport = `
# 📈 TEST RESULTS SUMMARY - TC3

## ⏱️ Performance Metrics
- **Response Latency:** ${responseLatency.toFixed(2)} seconds ${responseLatency < 8 ? '⚡ (Fast)' : responseLatency < 15 ? '✅ (Normal)' : '⚠️ (Slow)'}

## 📝 Search Query
\`\`\`
${searchPrompt}
\`\`\`

## 🎯 Search Requirements
- **Processor:** Intel Xeon E-2276ME (6 cores)
- **Purpose:** High-performance computing
- **Fabric Options:** PCI Express or RapidIO

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
          console.log(`✅ Suitable (AdvancedMC): ${report.suitableProducts}`);
          
          if (report.unsuitableProducts > 0) {
            console.warn(`⚠️  Unsuitable products: ${report.unsuitableProducts}`);
            
            report.warnings.forEach(warning => {
              issue('Category Mismatch', warning);
            });
          }
        } else {
          console.log(`⚠️  No products found in results`);
        }
      });
    });
    
    // Step 9: Log product details
    await test.step('Verify product data completeness', async () => {
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
    });
    
    // Step 10: Attach video to Allure report
    await test.step('Attach test execution video', async () => {
      await allureStep('Adding video recording to report', async () => {
        const videoPath = await page.video()?.path();
        
        if (videoPath) {
          console.log(`🎥 Video saved at: ${videoPath}`);
          
          const fs = require('fs');
          const videoBuffer = fs.readFileSync(videoPath);
          
          await attachment('Test Execution Video', videoBuffer, { contentType: 'video/webm' });
          console.log('✅ Video attached to Allure report');
        } else {
          console.log('⚠️  No video available');
        }
      });
    });
  });
  
});
