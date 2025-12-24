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

test.describe('CompactPCI Product Search - Suite 1.1', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.1: Search for CompactPCI Serial backplane for Comtel 9-slot chassis', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('CompactPCI Serial Backplane for Comtel Chassis');
    await severity(Severity.CRITICAL);
    await tag('CompactPCI');
    await tag('BoardBot');
    await tag('Backplane');
    await tag('9-Slot');
    await tag('4U');
    await owner('Vladyslav');
    
    const searchPrompt = "Hi, I need a backplane for a CompactPCI Serial chassis — the Comtel 9-slot 4U one. Do you have the matching backplane for that system?";
    const maxProducts = 5;
    const expectedCategories = ['CompactPCI', 'CompactPCI PlusIO', 'CompactPCI Serial'];
    const originalProductUrl = 'compactpci-serial-9-slots-3u-backplane-front-and-rtm-slots';
    
    await description([
      '**Test Objective:** TC1.1: Search for CompactPCI Serial backplane for Comtel 9-slot chassis',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- Backplane for CompactPCI Serial chassis\n- Comtel 9-slot 4U\n- Matching system compatibility',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'CompactPCI_TC1.1');
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
