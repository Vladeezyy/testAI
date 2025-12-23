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

test.describe('MicroTCA Product Search - Suite 1.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC1.3: Search for Samtec MicroTCA connectors with detailed specifications', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('Samtec MicroTCA Edge Card Connectors');
    await severity(Severity.CRITICAL);
    await tag('MicroTCA');
    await tag('BoardBot');
    await tag('Samtec');
    await tag('12GHz');
    await tag('24Gbps');
    await tag('Hot-Plug');
    await tag('Press-Fit');
    await owner('QA Team');
    
    const searchPrompt = "Need Samtec MicroTCA edge card connectors compliant with MicroTCA architecture, accepting 1.60 mm (.062\") cards, press-fit tails, hot-plug capable, supporting high-speed serial up to 12.0 GHz / 24 Gbps, with up to ~170 I/Os.";
    const maxProducts = 5;
    const expectedCategory = 'MicroTCA';
    const originalProductUrl = 'samtec-microtca-connectors';
    
    await description([
      '**Test Objective:** TC1.3: Search for Samtec MicroTCA connectors with detailed specifications',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- Samtec MicroTCA edge card connectors\n- MicroTCA architecture compliant\n- Card thickness: 1.60 mm\n- Press-fit tails, hot-plug, 12GHz/24Gbps',
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
        'MicroTCA_TC1.3'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
