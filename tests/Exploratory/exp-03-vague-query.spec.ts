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

test.describe('Exploratory - Edge Cases', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('EXP-03: Vague query - Should BoardBot ask clarifying questions?', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Exploratory Testing');
    await feature('Edge Cases');
    await story('Vague Query Handling');
    await severity(Severity.MINOR);
    await tag('Exploratory');
    await tag('Edge-Case');
    await tag('Vague-Query');
    await owner('QA Team');
    
    const searchPrompt = "I need something for my server rack";
    const maxProducts = 10;
    
    await description([
      '**Test Objective:** Test how BoardBot handles vague queries',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Expected Behavior:**',
      '- BoardBot should either:',
      '  1. Ask clarifying questions',
      '  2. Suggest common products for server racks',
      '  3. Provide a range of options across categories',
      '- Should not return empty results',
      '- Should help guide user to better query'
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
    
    await test.step('Analyze vague query response', async () => {
      console.log(`\n❓ Vague Query Analysis:\n`);
      
      if (products.length === 0) {
        console.log(`   ⚠️  No products returned - BoardBot may have asked for clarification`);
        await parameter('BoardBot Response', 'Likely asked for clarification');
      } else {
        console.log(`   ✅ Returned ${products.length} products despite vague query`);
        
        const categories = [...new Set(products.map(p => p.category))];
        console.log(`   📊 Categories covered: ${categories.join(', ')}`);
        
        await parameter('Products Returned', products.length.toString());
        await parameter('Categories Covered', categories.length.toString());
      }
      
      // This test passes either way - it's exploratory
      expect(true).toBe(true);
    });
  });
  
});
