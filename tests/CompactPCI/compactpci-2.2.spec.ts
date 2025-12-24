import { test, expect } from '@playwright/test';
import { BoardBotPage, ProductInfo } from '../../pages/AdvancedMC/BoardBotPage';
import { TestBase } from '../../lib/common/TestBase';
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

test.describe('CompactPCI Product Search - Suite 2.2', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC2.2: Search for rugged CompactPCI Serial M.2 NVMe storage board', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for AI validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('Rugged CompactPCI Serial M.2 NVMe Storage');
    await severity(Severity.CRITICAL);
    await tag('CompactPCI');
    await tag('BoardBot');
    await tag('Storage');
    await tag('M.2-NVMe');
    await tag('Rugged');
    await tag('Transportation');
    await tag('Rail');
    await owner('Vladyslav');
    
    const searchPrompt = "We need a CompactPCI Serial storage expansion board for multiple M.2 NVMe drives — ideally something rugged enough for transportation or rail-type environments. Any options?";
    const maxProducts = 5;
    const expectedCategories = ['CompactPCI', 'CompactPCI PlusIO', 'CompactPCI Serial'];
    const originalProductUrl = 'mic-3821';
    
    await description([
      '**Test Objective:** TC2.2: Search for rugged CompactPCI Serial M.2 NVMe storage board',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- CompactPCI Serial storage expansion board\n- Multiple M.2 NVMe drives\n- Rugged design for transportation/rail environments',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'CompactPCI_TC2.2');
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
