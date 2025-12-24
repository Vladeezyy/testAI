import { test, expect } from '@playwright/test';
import { BoardBotPage, ProductInfo } from '../../pages/AdvancedMC/BoardBotPage';
import { TestBase } from '../common/TestBase';
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
  attachment
} from 'allure-js-commons';

test.describe('COM-HPC Product Search - Suite 1.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.3: Search for ADLINK COM-HPC-mMTL with Intel Core Ultra Meteor Lake', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('ADLINK COM-HPC-mMTL - Intel Core Ultra');
    await severity(Severity.CRITICAL);
    await tag('COM-HPC');
    await tag('BoardBot');
    await tag('ADLINK');
    await tag('Intel-Core-Ultra');
    await tag('Meteor-Lake');
    await tag('Xe-GPU');
    await tag('NPU');
    await tag('LPDDR5X');
    await tag('USB4');
    await tag('2.5GbE');
    await owner('QA Team');
    
    const searchPrompt = "Looking for the ADLINK COM-HPC-mMTL module (95×70mm) based on Intel Core Ultra / Meteor Lake, offering up to 14 CPU cores with integrated Xe GPU + NPU, up to 64GB LPDDR5X, ~16 PCIe lanes, USB4/DDI, 2× 2.5GbE, and media/AI acceleration suited for space-limited, battery-powered high-performance edge applications.";
    const maxProducts = 5;
    const expectedCategories = ['COM-HPC'];
    const originalProductUrl = 'com-hpc-mmtl-com-hpc-mini-type-module-with-intel-core-ultra-processor';
    
    await description([
      '**Test Objective:** TC1.3: Search for ADLINK COM-HPC-mMTL with Intel Core Ultra Meteor Lake',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- ADLINK COM-HPC-mMTL module (95×70mm)\n- Intel Core Ultra / Meteor Lake\n- Up to 14 CPU cores with Xe GPU + NPU\n- Up to 64GB LPDDR5X\n- ~16 PCIe lanes\n- USB4/DDI, 2× 2.5GbE\n- Media/AI acceleration\n- Space-limited, battery-powered edge applications',
      '',
      '**Validation:**',
      '- Extract up to ' + maxProducts + ' products',
      '- Verify category matches one of: ' + expectedCategories.join(', '),
      '- Generate detailed report with warnings for non-matching categories'
    ].join('\n'));
    
    await parameter('Search Query (Short)', searchPrompt.substring(0, 100) + '...');
    await parameter('Max Products', maxProducts.toString());
    await parameter('Expected Categories', expectedCategories.join(', '));
    await attachment('Full Search Query', searchPrompt, { contentType: 'text/plain' });
    
    const boardBotPage = new BoardBotPage(page);
    
    await test.step('Navigate to PICMG and setup', async () => {
      await page.goto('https://www.picmg.org/');
      await expect(page).toHaveTitle(/PICMG/i);
      await boardBotPage.acceptCookies();
      await boardBotPage.navigateToMemberProducts();
      await page.waitForTimeout(2000);
    });
    
    let responseLatency = 0;
    await test.step('Submit search query and measure latency', async () => {
      responseLatency = await TestBase.submitSearchAndMeasureLatency(page, boardBotPage, searchPrompt);
    });
    
    let products: ProductInfo[] = [];
    await test.step('Extract product information and capture screenshot', async () => {
      products = await TestBase.extractProducts(page, boardBotPage, maxProducts);
    });    
    await test.step('AI Product Validation', async () => {
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'COM-HPC_TC1.3');
    });

    await test.step('Validate categories and generate report', async () => {
      // Custom validation for multiple acceptable categories
      for (const [index, product] of products.entries()) {
        const categoryLower = product.category.toLowerCase();
        const isMatch = expectedCategories.some((cat: string) => 
          categoryLower.includes(cat.toLowerCase())
        ) || categoryLower.includes('cpci serial');
        
        const status = isMatch ? '✅ SUITABLE' : '❌ UNSUITABLE';
        const matchedCategory = isMatch 
          ? expectedCategories.find((cat: string) => categoryLower.includes(cat.toLowerCase())) || 'CompactPCI variant'
          : 'None';
        
        console.log('Product ' + (index + 1) + ': ' + product.productName);
        console.log('  Category: ' + product.category + ' - ' + status);
        console.log('  Matched: ' + matchedCategory);
        
        await parameter('Product ' + (index + 1), product.productName + ' | ' + status + ' | Category: ' + product.category);
        
        if (product.moreInfoUrl && product.moreInfoUrl.startsWith('http')) {
          await parameter('  └─ URL ' + (index + 1), product.moreInfoUrl);
        }
      }
      
      // Generate summary
      const suitableCount = products.filter((p: ProductInfo) => {
        const catLower = p.category.toLowerCase();
        return expectedCategories.some((cat: string) => catLower.includes(cat.toLowerCase())) ||
               catLower.includes('cpci serial');
      }).length;
      
      await parameter('Total Products', products.length.toString());
      await parameter('Suitable Products', suitableCount.toString());
      await parameter('Unsuitable Products', (products.length - suitableCount).toString());
      
      console.log('\n✅ Suitable products: ' + suitableCount + '/' + products.length);
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
