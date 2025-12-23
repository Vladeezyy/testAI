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

test.describe('AdvancedTCA Product Search - Suite 1.2', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.2: Search for ATCA chassis with strong cooling', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('ATCA Chassis with Strong Cooling');
    await severity(Severity.CRITICAL);
    await tag('AdvancedTCA');
    await tag('BoardBot');
    await tag('Cooling');
    await tag('Hot-Swap');
    await tag('Redundant');
    await owner('Vladyslav');
    
    const searchPrompt = "We're building a telecom system that needs a full-size AdvancedTCA chassis with strong cooling—ideally hot-swap fans—and redundant power. Can you suggest something?";
    const maxProducts = 5;
    const expectedCategory = 'AdvancedTCA';
    const originalProductUrl = 'atca-co2-ac-dc-2-slot-3u';
    
    await description([
      '**Test Objective:** TC1.2: Search for ATCA chassis with strong cooling',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- Full-size AdvancedTCA chassis\n- Strong cooling with hot-swap fans\n- Redundant power supply',
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
        'AdvancedTCA_TC1.2'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
