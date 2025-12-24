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

test.describe('MicroTCA Product Search - Suite 2.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC2.3: Search for 2U MTCA.4 chassis with µRTM support', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('2U MTCA.4 Chassis with µRTM Support');
    await severity(Severity.CRITICAL);
    await tag('MicroTCA');
    await tag('BoardBot');
    await tag('MTCA4');
    await tag('uRTM');
    await tag('80W-Per-Slot');
    await owner('QA Team');
    
    const searchPrompt = "Looking for a 2U 19\" MicroTCA® chassis with up to 6 AdvancedMC™ slots, including MTCA.4-compliant slots supporting µRTMs, suitable for high-end compute or I/O-dense configurations. Should support AC PSU options (or optional DC input), left-to-right field-replaceable cooling, and be designed for ~80W per slot with hot-swappable fan/dust filter.";
    const maxProducts = 5;
    const expectedCategory = 'MicroTCA';
    const originalProductUrl = 'rackpakm5-1-the-next-step-mtca-4-chassis';
    
    await description([
      '**Test Objective:** TC2.3: Search for 2U MTCA.4 chassis with µRTM support',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- 2U 19 inch MicroTCA chassis\n- MTCA.4-compliant with µRTM support\n- 80W per slot with hot-swappable fan/filter',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategory, 'MicroTCA_TC2.3');
    });

    await test.step('Validate categories and generate report', async () => {
      await TestBase.validateAndGenerateReport(
        products,
        searchPrompt,
        expectedCategory,
        originalProductUrl,
        responseLatency,
        __dirname,
        'MicroTCA_TC2.3'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
