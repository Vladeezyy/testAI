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

test.describe('MicroTCA Product Search - Suite 1.1', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.1: Search for MicroTCA edge connectors with hot-swap capability', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for AI validation // 2 minutes
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('MicroTCA Edge Connectors with Hot-Swap');
    await severity(Severity.CRITICAL);
    await tag('MicroTCA');
    await tag('BoardBot');
    await tag('Edge-Connectors');
    await tag('Hot-Swap');
    await tag('High-Speed');
    await owner('Vladyslav');
    
    const searchPrompt = "Hey, we're building a MicroTCA system and need the edge connectors for the cards. Do you have ones that handle hot-swap and high-speed links?";
    const maxProducts = 5;
    const expectedCategory = 'MicroTCA';
    const originalProductUrl = 'samtec-microtca-connectors';
    
    await description([
      '**Test Objective:** TC1.1: Search for MicroTCA edge connectors with hot-swap capability',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- MicroTCA system edge connectors\n- Hot-swap capability\n- High-speed links support',
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategory, 'MicroTCA_TC1.1');
    });

    await test.step('Validate categories and generate report', async () => {
      await TestBase.validateAndGenerateReport(
        products,
        searchPrompt,
        expectedCategory,
        originalProductUrl,
        responseLatency,
        __dirname,
        'MicroTCA_TC1.1'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
