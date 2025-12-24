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

test.describe('COM Express Product Search - Suite 3.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.3: Search for AAEON COM-45SP with Intel GM45 chipset and Core 2 Duo', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('AAEON COM-45SP - Intel GM45 Chipset');
    await severity(Severity.CRITICAL);
    await tag('COM-Express');
    await tag('BoardBot');
    await tag('AAEON-COM-45SP');
    await tag('Intel-GM45');
    await tag('Core-2-Duo');
    await tag('Celeron-M');
    await tag('DDR3');
    await tag('GbE');
    await tag('PCIe-x16');
    await tag('Legacy-PCI');
    await owner('Vladyslav');
    
    const searchPrompt = "Looking for the AAEON COM-45SP COM Express module based on the Intel GM45 chipset, supporting Intel Core 2 Duo / Celeron M Socket-P (45nm, up to 6MB cache, 1067MHz FSB), up to 8GB dual-channel DDR3 via 2× SODIMM, providing GbE, multiple USB 2.0 ports, PCIe x16 plus additional PCIe x1 lanes, legacy PCI/LPC/SMBus/I2C, and a wide 8.5–19V DC input range.";
    const maxProducts = 5;
    const expectedCategories = ['COM EXPRESS', 'COM Express'];
    const originalProductUrl = 'com-45sp';
    
    await description([
      '**Test Objective:** TC3.3: Search for AAEON COM-45SP with Intel GM45 chipset and Core 2 Duo',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- AAEON COM-45SP COM Express module\n- Intel GM45 chipset\n- Intel Core 2 Duo / Celeron M Socket-P (45nm)\n- Up to 6MB cache, 1067MHz FSB\n- Up to 8GB dual-channel DDR3 (2× SODIMM)\n- GbE, multiple USB 2.0 ports\n- PCIe x16 + PCIe x1 lanes\n- Legacy PCI/LPC/SMBus/I2C\n- 8.5–19V DC input range',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'COMExpress_TC3.3');
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
