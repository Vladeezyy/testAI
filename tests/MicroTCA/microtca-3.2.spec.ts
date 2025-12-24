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

test.describe('MicroTCA Product Search - Suite 3.2', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.2: Search for µTCA.4 AMC data acquisition card', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('µTCA.4 AMC Data Acquisition Card');
    await severity(Severity.CRITICAL);
    await tag('MicroTCA');
    await tag('BoardBot');
    await tag('Data-Acquisition');
    await tag('FPGA-Buffering');
    await tag('Fiber-Ports');
    await owner('QA Team');
    
    const searchPrompt = "We need a µTCA.4 AMC card for high-speed data acquisition, with FPGA-based buffering/processing and some fast fiber ports on the front. What options do you have?";
    const maxProducts = 5;
    const expectedCategory = 'MicroTCA';
    const originalProductUrl = 'amc523';
    
    await description([
      '**Test Objective:** TC3.2: Search for µTCA.4 AMC data acquisition card',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- µTCA.4 AMC data acquisition card\n- FPGA-based buffering/processing\n- Fast fiber ports on front',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategory, 'MicroTCA_TC3.2');
    });

    await test.step('Validate categories and generate report', async () => {
      await TestBase.validateAndGenerateReport(
        products,
        searchPrompt,
        expectedCategory,
        originalProductUrl,
        responseLatency,
        __dirname,
        'MicroTCA_TC3.2'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
