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

test.describe('Exploratory - Use Case Testing', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('EXP-02: Medical imaging system - Low power, compact, high performance', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Exploratory Testing');
    await feature('Use Case Scenarios');
    await story('Medical Imaging System');
    await severity(Severity.NORMAL);
    await tag('Exploratory');
    await tag('Medical');
    await tag('Low-Power');
    await tag('Compact');
    await owner('QA Team');
    
    const searchPrompt = "We are designing a medical imaging system that needs a compact, low-power computing module with strong graphics processing for real-time image analysis. What COM modules would work?";
    const maxProducts = 10;
    const expectedCategories = ['COM-HPC', 'COM Express'];
    
    await description([
      '**Test Objective:** Test BoardBot understanding of medical use case requirements',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Expected Characteristics:**',
      '- Compact form factor (COM modules)',
      '- Low power consumption',
      '- Integrated GPU or graphics capability',
      '- Real-time processing capability',
      '- Medical-grade reliability mentioned'
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'Exploratory_EXP02');
    });
    
    await test.step('Verify results match use case', async () => {
      console.log(`\n🏥 Medical Use Case Validation:\n`);
      
      let hasGPU = 0;
      let hasLowPower = 0;
      let comModules = 0;
      
      products.forEach((p, i) => {
        const desc = (p.productName + ' ' + p.category + ' ' + p.subcategory).toLowerCase();
        
        if (desc.includes('gpu') || desc.includes('graphics') || desc.includes('video')) {
          hasGPU++;
          console.log(`   ✅ Product ${i+1}: Has GPU/Graphics capability`);
        }
        
        if (desc.includes('low power') || desc.includes('efficient') || desc.includes('tdp')) {
          hasLowPower++;
          console.log(`   ⚡ Product ${i+1}: Low power mentioned`);
        }
        
        if (p.category.toLowerCase().includes('com')) {
          comModules++;
        }
      });
      
      await parameter('Products with GPU', hasGPU.toString());
      await parameter('Products mentioning Low Power', hasLowPower.toString());
      await parameter('COM Modules', comModules.toString());
      
      expect(products.length).toBeGreaterThan(0);
    });
  });
  
});
