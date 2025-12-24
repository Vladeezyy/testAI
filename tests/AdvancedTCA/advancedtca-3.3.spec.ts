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

test.describe('AdvancedTCA Product Search - Suite 3.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.3: Search for ATCA ARTM with PCIe x8, GbE, and 10GbE ports', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('ATCA ARTM with Advanced I/O Features');
    await severity(Severity.CRITICAL);
    await tag('AdvancedTCA');
    await tag('BoardBot');
    await tag('ARTM');
    await tag('PCIe-x8');
    await tag('10GbE');
    await tag('GbE');
    await tag('IPMI');
    await owner('Vladyslav');
    
    const searchPrompt = "Looking for an ATCA I/O expansion Rear Transition Module (ARTM) compatible with standard ATCA carriers, providing PCIe x8 rear access (iPASS), multiple GbE rear ports (SFP + RJ-45), dual 10GbE via Zone 3 with rear SFP+, and rear management I/O including RS-232 and RTM IPMI.";
    const maxProducts = 5;
    const expectedCategory = 'AdvancedTCA';
    const originalProductUrl = 'art001';
    
    await description([
      '**Test Objective:** TC3.3: Search for ATCA ARTM with PCIe x8, GbE, and 10GbE ports',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- ATCA I/O expansion ARTM\n- Compatible with standard ATCA carriers\n- PCIe x8 rear access (iPASS)\n- Multiple GbE rear ports (SFP + RJ-45)\n- Dual 10GbE via Zone 3 with rear SFP+\n- Rear management I/O (RS-232 and RTM IPMI)',
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
    await test.step('AI Product Validation', async () => {
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategory, 'AdvancedTCA_TC3.3');
    });

    await test.step('Validate categories and generate report', async () => {
      await TestBase.validateAndGenerateReport(
        products,
        searchPrompt,
        expectedCategory,
        originalProductUrl,
        responseLatency,
        __dirname,
        'AdvancedTCA_TC3.3'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
