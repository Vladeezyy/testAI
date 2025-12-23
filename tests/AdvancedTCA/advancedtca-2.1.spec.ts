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

test.describe('AdvancedTCA Product Search - Suite 2.1', () => {
  
  test.beforeAll(async () => {
    const fs = require('fs');
    const path = require('path');
    const reportsDir = path.join(__dirname, '../../test-results/reports');
    
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
  });
  
  test('TC2.1: Search for carrier-grade ATCA for network workloads and packet processing', async ({ page }, testInfo) => {
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('Carrier-Grade ATCA for Network Workloads');
    await severity(Severity.CRITICAL);
    await tag('AdvancedTCA');
    await tag('BoardBot');
    await tag('Carrier-Grade');
    await tag('Network-Security');
    await tag('DPI');
    await owner('QA Team');
    
    const searchPrompt = 'Hey, I am looking for a carrier-grade ATCA system that can handle really heavy network workloads — like security and deep packet processing — and scale way beyond normal rack servers. What systems do you have?';
    const maxProducts = 5;
    const expectedCategory = 'AdvancedTCA';
    const originalProductUrl = 'netarium-14-14-slot-19-wide-13u-high-advancedtca-shelf-fully-integrated-reference-system';
    
    await description(`
**Test Objective:** Search for carrier-grade ATCA systems for heavy network workloads

**Search Query:**
${searchPrompt}

**Requirements:**
- Carrier-grade ATCA system
- Heavy network workload handling
- Security and deep packet processing (DPI)
- Scalability beyond normal rack servers

**Validation:**
- Extract up to ${maxProducts} products
- Verify category matches: ${expectedCategory}
- Generate detailed report with warnings for non-matching categories
    `);
    
    await parameter('Search Query (Short)', searchPrompt.substring(0, 100) + '...');
    await parameter('Max Products', maxProducts.toString());
    await parameter('Expected Category', expectedCategory);
    await attachment('Full Search Query', searchPrompt, { contentType: 'text/plain' });
    
    const boardBotPage = new BoardBotPage(page);
    
    await test.step('Navigate to PICMG homepage', async () => {
      await allureStep('Opening PICMG website', async () => {
        await page.goto('/');
        await expect(page).toHaveTitle(/PICMG/i);
        await attachment('Homepage URL', page.url(), { contentType: 'text/plain' });
      });
    });
    
    await test.step('Accept cookies', async () => {
      await allureStep('Accepting cookie consent', async () => {
        await boardBotPage.acceptCookies();
      });
    });
    
    await test.step('Click on Member Products', async () => {
      await allureStep('Navigating to Member Products section', async () => {
        await boardBotPage.navigateToMemberProducts();
        await page.waitForTimeout(2000);
      });
    });
    
    let startTime = 0;
    await test.step('Submit search query to BoardBot', async () => {
      await allureStep(`Submitting query: "${searchPrompt.substring(0, 50)}..."`, async () => {
        await boardBotPage.askBoardBot(searchPrompt);
        startTime = Date.now();
        console.log('⏱️  Timer started - measuring response time...');
      });
    });
    
    let responseLatency = 0;
    await test.step('Wait for search results and measure latency', async () => {
      await allureStep('Waiting for BoardBot response', async () => {
        await boardBotPage.waitForResults(20000);
        const endTime = Date.now();
        
        responseLatency = (endTime - startTime) / 1000;
        
        console.log(`\n⏱️  Response Latency: ${responseLatency.toFixed(2)} seconds\n`);
        
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
    
    await test.step('Capture results screenshot', async () => {
      const screenshot = await page.screenshot({ fullPage: true });
      await attachment('Search Results Page', screenshot, { contentType: 'image/png' });
    });
    
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
    
    await test.step('Validate categories and generate report', async () => {
      await allureStep('Validating product categories and generating report', async () => {
        const report = ReportGenerator.generateReport(
          searchPrompt,
          products,
          expectedCategory,
          originalProductUrl
        );
        
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
        const reportsDir = path.join(__dirname, '../../test-results/reports');
        
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const reportPath = path.join(reportsDir, `AdvancedTCA_TC2.1_${timestamp}.md`);
        
        fs.writeFileSync(reportPath, ReportGenerator.formatReportAsMarkdown(report));
        console.log(`\n📄 Report saved to: ${reportPath}\n`);
        
        await parameter('Total Products', report.totalResults.toString());
        await parameter('Suitable Products', report.suitableProducts.toString());
        await parameter('Unsuitable Products', report.unsuitableProducts.toString());
        await parameter('Original Product Found', report.originalProduct >= 0 ? `Yes (#${report.originalProduct + 1})` : 'No');
        
        const summaryReport = `
# 📈 TEST RESULTS SUMMARY - TC2.1

## ⏱️ Performance Metrics
- **Response Latency:** ${responseLatency.toFixed(2)} seconds ${responseLatency < 8 ? '⚡ (Fast)' : responseLatency < 15 ? '✅ (Normal)' : '⚠️ (Slow)'}

## 📝 Search Query
\`\`\`
${searchPrompt}
\`\`\`

## 🎯 Search Requirements
- **Type:** Carrier-grade ATCA system
- **Workloads:** Heavy network processing
- **Features:** Security, deep packet processing (DPI)
- **Scalability:** Beyond normal rack servers

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
          console.log(`✅ Suitable (AdvancedTCA): ${report.suitableProducts}`);
          
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
