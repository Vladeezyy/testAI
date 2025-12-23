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

test.describe('MicroTCA Product Search - Suite 3.3', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('TC3.3: Search for MTCA.4 AMC dual-DAC with FPGA and µRTM', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Product Search');
    await feature('BoardBot Search');
    await story('MTCA.4 AMC Dual-DAC with FPGA and µRTM');
    await severity(Severity.CRITICAL);
    await tag('MicroTCA');
    await tag('BoardBot');
    await tag('Dual-DAC');
    await tag('DDR3-Buffering');
    await tag('Quad-SFP-Plus');
    await owner('QA Team');
    
    const searchPrompt = "Looking for a MicroTCA.4-compliant AMC dual-DAC module with an on-board reconfigurable FPGA tied to GbE and PCIe, receiving multiple ADC LVDS channels via a µRTM (MRT523), with DDR3 FPGA buffering, flexible internal/external clocking & trigger in/out, and front-panel I/O including quad SFP+, JTAG, clock/trigger connectors, and optional RS-232 console.";
    const maxProducts = 5;
    const expectedCategory = 'MicroTCA';
    const originalProductUrl = 'amc523';
    
    await description([
      '**Test Objective:** TC3.3: Search for MTCA.4 AMC dual-DAC with FPGA and µRTM',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Requirements:**',
      '- MicroTCA.4 AMC dual-DAC with FPGA\n- DDR3 FPGA buffering with µRTM support\n- Quad SFP+, JTAG, clock/trigger I/O',
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
        'MicroTCA_TC3.3'
      );
    });
    
    await test.step('Verify product data completeness', async () => {
      await TestBase.verifyProductData(products);
    });
  });
  
});
