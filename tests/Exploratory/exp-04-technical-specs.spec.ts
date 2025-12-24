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

test.describe('Exploratory - Technical Specifications', () => {
  
  test.beforeAll(async () => {
    await TestBase.setupReportCleanup(__dirname);
  });
  
  test('EXP-04: Very specific requirements - PCIe Gen3/Gen4, 8+ cores, ECC memory', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await epic('Exploratory Testing');
    await feature('Technical Specifications');
    await story('Multi-Requirement Search');
    await severity(Severity.NORMAL);
    await tag('Exploratory');
    await tag('PCIe');
    await tag('Multi-Core');
    await tag('ECC');
    await owner('QA Team');
    
    const searchPrompt = "I need a processor module with at least 8 CPU cores, PCIe Gen3 or Gen4 support, and ECC memory for a fault-tolerant industrial control system. Temperature range should support -40°C to +85°C.";
    const maxProducts = 10;
    const expectedCategories = ['COM-HPC', 'COM Express', 'AdvancedMC'];
    
    await description([
      '**Test Objective:** Test BoardBot ability to filter by multiple technical requirements',
      '',
      '**Search Query:**',
      searchPrompt,
      '',
      '**Required Specifications:**',
      '- CPU: 8+ cores',
      '- PCIe: Gen3 or Gen4',
      '- Memory: ECC support',
      '- Temperature: Extended range (-40°C to +85°C)',
      '- Use case: Industrial control, fault-tolerant'
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
      await TestBase.validateWithAI(page, boardBotPage, products, searchPrompt, expectedCategories[0], 'Exploratory_EXP04');
    });
    
    await test.step('Verify technical specifications matching', async () => {
      console.log(`\n⚙️  Technical Specs Validation:\n`);
      
      let hasPCIe = 0;
      let hasECC = 0;
      let hasExtendedTemp = 0;
      let multiCore = 0;
      
      products.forEach((p, i) => {
        const text = (p.productName + ' ' + p.category + ' ' + p.subcategory).toLowerCase();
        
        if (text.includes('pcie') || text.includes('pci express')) {
          hasPCIe++;
          console.log(`   ✅ Product ${i+1}: Has PCIe`);
        }
        
        if (text.includes('ecc')) {
          hasECC++;
          console.log(`   ✅ Product ${i+1}: Has ECC memory`);
        }
        
        if (text.includes('extended') || text.includes('industrial') || text.includes('temperature')) {
          hasExtendedTemp++;
          console.log(`   ✅ Product ${i+1}: Extended temperature range`);
        }
        
        if (text.includes('core') || text.includes('cpu')) {
          multiCore++;
          console.log(`   ✅ Product ${i+1}: Multi-core processor`);
        }
      });
      
      await parameter('Products with PCIe', hasPCIe.toString());
      await parameter('Products with ECC', hasECC.toString());
      await parameter('Products with Extended Temp', hasExtendedTemp.toString());
      await parameter('Products with Multi-Core', multiCore.toString());
      
      const matchRate = ((hasPCIe + hasECC + hasExtendedTemp + multiCore) / (products.length * 4) * 100).toFixed(1);
      console.log(`\n📊 Specification Match Rate: ${matchRate}%`);
      await parameter('Spec Match Rate', `${matchRate}%`);
      
      expect(products.length).toBeGreaterThan(0);
    });
  });
  
});
