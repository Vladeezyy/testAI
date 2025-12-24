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

test.describe('Exploratory - Cross-Category Search', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('EXP-01: Search for high-speed 10GbE interconnects across all categories', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes for AI validation
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Exploratory Testing');
    await feature('Cross-Category Search');
    await story('High-Speed 10GbE Interconnects');
    await severity(Severity.NORMAL);
    await tag('Exploratory');
    await tag('10GbE');
    await tag('High-Speed');
    await owner('QA Team');
    
    const searchPrompt = "I need high-speed 10 Gigabit Ethernet interconnects for telecom applications. What products do you have that support 10GbE?";
    const maxProducts = 10; // Get more products for exploratory testing
    const expectedCategories = ['AdvancedTCA', 'MicroTCA', 'CompactPCI', 'COM-HPC'];
    
    await description([
      '**Test Objective:** Explore BoardBot ability to find 10GbE products across multiple categories',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Expected Results:**',
      '- Should return products from AdvancedTCA, MicroTCA, CompactPCI, or COM-HPC',
      '- Products should mention 10GbE, 10GBASE, or similar high-speed Ethernet',
      '- At least 5 relevant products expected'
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'Exploratory_EXP01');
    });
    
    await test.step('Analyze cross-category results', async () => {
      console.log(`\n📊 Cross-Category Analysis:\n`);
      
      const categoryCounts: { [key: string]: number } = {};
      products.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });
      
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} products`);
        parameter(`Category: ${category}`, `${count} products`);
      });
      
      // Check if we got products from multiple categories
      const categoryCount = Object.keys(categoryCounts).length;
      console.log(`\n✅ Found products from ${categoryCount} different categories`);
      parameter('Categories Found', categoryCount.toString());
      
      expect(products.length).toBeGreaterThan(0);
    });
  });
  
});
