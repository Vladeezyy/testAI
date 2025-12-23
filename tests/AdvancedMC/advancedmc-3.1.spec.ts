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

test.describe('AdvancedMC Product Search - Suite 3.1', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.1: Search for AMC with FPGA and zQSFP+ 100G ports', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('AMC with FPGA and zQSFP+ 100G Ports');
    await severity(Severity.CRITICAL);
    await tag('AdvancedMC');
    await tag('BoardBot');
    await tag('FPGA');
    await tag('zQSFP+');
    await tag('100G');
    await owner('QA Team');
    
    const searchPrompt = "Hey, I'm looking for an AdvancedMC module with an FPGA (like a Xilinx Ultrascale) and front-panel zQSFP+ ports for 100G networking. Ideally supports PCIe Gen3/4 to the backplane.";
    const maxProducts = 5;
    const expectedCategory = 'AdvancedMC';
    const originalProductUrl = 'amc583';
    
    await description([
      '**Test Objective:** TC3.1: Search for AMC with FPGA and zQSFP+ 100G ports',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- AdvancedMC module with FPGA (Xilinx Ultrascale)\n- Front-panel zQSFP+ ports for 100G\n- PCIe Gen3/4 to backplane',
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
        'AdvancedMC_TC3.1'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
