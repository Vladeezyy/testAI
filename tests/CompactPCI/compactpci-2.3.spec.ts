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

test.describe('CompactPCI Product Search - Suite 2.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC2.3: Search for 3U CompactPCI Serial quad M.2 NVMe board with EN50155 compliance', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('3U CompactPCI Serial Quad M.2 NVMe - EN50155');
    await severity(Severity.CRITICAL);
    await tag('CompactPCI');
    await tag('BoardBot');
    await tag('PICMG-CPCI-S');
    await tag('Quad-M.2');
    await tag('PCIe-NVMe');
    await tag('EN50155');
    await tag('Rugged-Transport');
    await owner('QA Team');
    
    const searchPrompt = "Looking for a 3U CompactPCI Serial peripheral/carrier board compliant with PICMG CPCI-S.0 R2.0 and PCI-SIG M.2 PCIe/NVMe spec, supporting up to quad M.2 PCIe/NVMe SSD modules, and designed to meet EN50155 / EN50121-3-2 / EN50121-4 rugged transport standards.";
    const maxProducts = 5;
    const expectedCategories = ['CompactPCI', 'CompactPCI PlusIO', 'CompactPCI Serial'];
    const originalProductUrl = 'mic-3821';
    
    await description([
      '**Test Objective:** TC2.3: Search for 3U CompactPCI Serial quad M.2 NVMe board with EN50155 compliance',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- 3U CompactPCI Serial peripheral/carrier board\n- PICMG CPCI-S.0 R2.0 compliant\n- PCI-SIG M.2 PCIe/NVMe spec support\n- Up to quad M.2 PCIe/NVMe SSD modules\n- EN50155 / EN50121-3-2 / EN50121-4 compliance',
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
