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

test.describe('AdvancedTCA Product Search - Suite 3.1', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.1: Search for ATCA rear module with Ethernet and PCIe', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('ATCA Rear Module with I/O Expansion');
    await severity(Severity.CRITICAL);
    await tag('AdvancedTCA');
    await tag('BoardBot');
    await tag('RTM');
    await tag('Ethernet');
    await tag('PCIe');
    await owner('Vladyslav');
    
    const searchPrompt = "I need a rear module for an ATCA blade that adds a bunch of I/O — like Ethernet ports, maybe some 10G links, plus a PCIe connection to the back. Do you have something like that?";
    const maxProducts = 5;
    const expectedCategory = 'AdvancedTCA';
    const originalProductUrl = 'art001';
    
    await description([
      '**Test Objective:** TC3.1: Search for ATCA rear module with Ethernet and PCIe',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- Rear module for ATCA blade\n- I/O expansion (Ethernet ports)\n- 10G links support\n- PCIe connection to the back',
      '',
      '**Validation:**',
      '- Extract up to ' + maxProducts + ' products',
      '- Verify category matches: ' + expectedCategory,
      '- Generate detailed report with warnings for non-matching categories'
    ].join('\n'));
    
    await parameter('Search Query (Short)', searchPrompt.substring(0, 100) + '...');
    await parameter('Max Products', maxProducts.toString());
    await parameter('Expected Category', expectedCategory);
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
      await TestBase.validateAndGenerateReport(
        products,
        searchPrompt,
        expectedCategory,
        originalProductUrl,
        responseLatency,
        __dirname,
        'AdvancedTCA_TC3.1'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
