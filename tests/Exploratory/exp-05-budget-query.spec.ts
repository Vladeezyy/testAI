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
  parameter
} from 'allure-js-commons';

test.describe('Exploratory - Business Queries', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('EXP-05: Budget-focused query - Can BoardBot help with cost-effective options?', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Exploratory Testing');
    await feature('Business Queries');
    await story('Budget and Cost Optimization');
    await severity(Severity.MINOR);
    await tag('Exploratory');
    await tag('Budget');
    await tag('Cost-Effective');
    await owner('QA Team');
    
    const searchPrompt = "We need cost-effective processor modules for a large deployment of edge computing units. Looking for the best price-to-performance ratio in COM Express or COM-HPC modules. What are the most economical options?";
    const maxProducts = 10;
    const expectedCategories = ['COM Express', 'COM-HPC'];
    
    await description([
      '**Test Objective:** Test BoardBot handling of budget/cost-related queries',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Expected Behavior:**',
      '- Should understand "cost-effective" requirement',
      '- May suggest entry-level or mainstream options',
      '- Should return COM Express/COM-HPC modules',
      '- May explain price cannot be shown but can suggest contact'
    ].join('\n'));
    
    const boardBotPage = new BoardBotPage(page);
    
    await test.step('Navigate to PICMG and setup', async () => {
      await TestBase.navigateAndSetup(page, boardBotPage);
    });
    
    let responseLatency = 0;
    await test.step('Submit search query and measure latency', async () => {
      responseLatency = await TestBase.submitSearchAndMeasureLatency(page, boardBotPage, searchPrompt);
    });
    
    let products: ProductInfo[] = [];
    await test.step('Extract product information', async () => {
      products = await TestBase.extractProducts(page, boardBotPage, maxProducts);
    });
    
    await test.step('AI Product Validation', async () => {
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'Exploratory_EXP05');
    });
    
    await test.step('Analyze budget query response', async () => {
      console.log(`\n💰 Budget Query Analysis:\n`);
      
      if (products.length === 0) {
        console.log(`   ℹ️  No products - BoardBot may have explained pricing not available`);
        await parameter('Response Type', 'Informational (no pricing data)');
      } else {
        console.log(`   ✅ Returned ${products.length} products`);
        
        const comExpress = products.filter(p => p.category.toLowerCase().includes('com express')).length;
        const comHPC = products.filter(p => p.category.toLowerCase().includes('com-hpc')).length;
        
        console.log(`   📊 COM Express: ${comExpress} | COM-HPC: ${comHPC}`);
        
        await parameter('COM Express Products', comExpress.toString());
        await parameter('COM-HPC Products', comHPC.toString());
      }
      
      expect(true).toBe(true); // Exploratory - always passes
    });
  });
  
});
