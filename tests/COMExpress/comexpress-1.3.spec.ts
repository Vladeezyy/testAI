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

test.describe('COM Express Product Search - Suite 1.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.3: Search for MSC C6B-TLH COM Express with 11th Gen Intel Core and ECC support', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for AI validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('MSC C6B-TLH COM Express - 11th Gen Intel');
    await severity(Severity.CRITICAL);
    await tag('COM-Express');
    await tag('BoardBot');
    await tag('MSC-C6B-TLH');
    await tag('11th-Gen-Intel');
    await tag('Intel-vPro');
    await tag('Xeon-W-11000E');
    await tag('PCIe-Gen3');
    await tag('i225-TSN');
    await tag('ECC-Support');
    await tag('Extended-Temp');
    await owner('Vladyslav');
    
    const searchPrompt = "Looking for the MSC C6B-TLH COM Express module supporting 11th Gen Intel Core vPro / Xeon W-11000E / Celeron (2–8 cores, 25–45/35W TDP variants), with 8× PCIe Gen3 + PEG PCIe Gen3/4, Intel i225 1GbE/2.5GbE TSN, optional ECC SO-DIMM support, configurable 8–64GB memory via 2 SO-DIMMs, and extended-temperature 24/7 operation plus long-term availability.";
    const maxProducts = 5;
    const expectedCategories = ['COM EXPRESS', 'COM Express'];
    const originalProductUrl = 'msc-c6b-tlh-2';
    
    await description([
      '**Test Objective:** TC1.3: Search for MSC C6B-TLH COM Express with 11th Gen Intel Core and ECC support',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- MSC C6B-TLH COM Express module\n- 11th Gen Intel Core vPro / Xeon W-11000E / Celeron\n- 2–8 cores, 25–45/35W TDP variants\n- 8× PCIe Gen3 + PEG PCIe Gen3/4\n- Intel i225 1GbE/2.5GbE TSN\n- Optional ECC SO-DIMM support\n- 8–64GB memory via 2 SO-DIMMs\n- Extended-temperature 24/7 operation\n- Long-term availability',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'COMExpress_TC1.3');
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
