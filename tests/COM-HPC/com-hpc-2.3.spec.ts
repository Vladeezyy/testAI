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

test.describe('COM-HPC Product Search - Suite 2.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC2.3: Search for 4U COM-HPC Ampere Altra 128-core with SOAFEE and Autoware', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for AI validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('4U COM-HPC Ampere Altra 128-Core Platform');
    await severity(Severity.CRITICAL);
    await tag('COM-HPC');
    await tag('BoardBot');
    await tag('Ampere-Altra');
    await tag('128-Core');
    await tag('SOAFEE');
    await tag('Autoware');
    await tag('UEFI');
    await tag('10GbE');
    await tag('DDR4-ECC');
    await tag('PCIe-Gen4');
    await tag('Liquid-Cooling');
    await owner('QA Team');
    
    const searchPrompt = "Looking for a rugged 4U rackmount ARM server platform based on a COM-HPC Ampere Altra 128-core SoC module, hosting SOAFEE and compatible with Autoware Open AD Kit, with UEFI/EDKII boot for stock AArch64 Linux ISOs, 4×10GbE, DDR4 ECC, 1TB NVMe M.2, and extensive PCIe Gen4 lane availability, plus liquid cooling and ~750W PSU.";
    const maxProducts = 5;
    const expectedCategories = ['COM-HPC'];
    const originalProductUrl = 'ampere-altra-developer-rugged';
    
    await description([
      '**Test Objective:** TC2.3: Search for 4U COM-HPC Ampere Altra 128-core with SOAFEE and Autoware',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- 4U rackmount ARM server platform\n- COM-HPC Ampere Altra 128-core SoC\n- SOAFEE hosting\n- Autoware Open AD Kit compatible\n- UEFI/EDKII boot for AArch64 Linux\n- 4×10GbE, DDR4 ECC, 1TB NVMe M.2\n- Extensive PCIe Gen4 lanes\n- Liquid cooling, ~750W PSU',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'COM-HPC_TC2.3');
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
