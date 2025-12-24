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

test.describe('COM Express Product Search - Suite 2.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC2.3: Search for MSC C6C-SLU COM Express Type 6 with 6th Gen Intel and triple 4K display', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('MSC C6C-SLU COM Express - 6th Gen Intel');
    await severity(Severity.CRITICAL);
    await tag('COM-Express');
    await tag('BoardBot');
    await tag('MSC-C6C-SLU');
    await tag('Type-6');
    await tag('6th-Gen-Intel');
    await tag('Gen9-HD-Graphics');
    await tag('Triple-Display');
    await tag('4K');
    await tag('DDR4');
    await tag('TPM');
    await owner('Vladyslav');
    
    const searchPrompt = "Looking for the MSC C6C-SLU COM Express Type 6 module based on Intel 6th Gen Core U-series dual-core CPUs (~15W TDP) with Intel Gen9 HD graphics, triple independent display support up to 4K, up to 32GB dual-channel DDR4, multiple USB 3.0/2.0, SATA 6Gb/s, PCIe x1 lanes, and optional TCG/TPM security.";
    const maxProducts = 5;
    const expectedCategories = ['COM EXPRESS', 'COM Express'];
    const originalProductUrl = 'msc-c6c-slu-2';
    
    await description([
      '**Test Objective:** TC2.3: Search for MSC C6C-SLU COM Express Type 6 with 6th Gen Intel and triple 4K display',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- MSC C6C-SLU COM Express Type 6\n- Intel 6th Gen Core U-series dual-core (~15W TDP)\n- Intel Gen9 HD graphics\n- Triple independent display support (up to 4K)\n- Up to 32GB dual-channel DDR4\n- Multiple USB 3.0/2.0\n- SATA 6Gb/s, PCIe x1\n- Optional TCG/TPM security',
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
    
    await test.step('Validate categories and generate report', async () => {
      // Custom validation for multiple acceptable categories
      for (const [index, product] of products.entries()) {
        const categoryLower = product.category.toLowerCase();
        const isMatch = expectedCategories.some((cat: string) => 
          categoryLower.includes(cat.toLowerCase())
        );
        
        const status = isMatch ? '✅ SUITABLE' : '❌ UNSUITABLE';
        const matchedCategory = isMatch 
          ? expectedCategories.find((cat: string) => categoryLower.includes(cat.toLowerCase())) || 'Category match'
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
        return expectedCategories.some((cat: string) => catLower.includes(cat.toLowerCase()));
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
