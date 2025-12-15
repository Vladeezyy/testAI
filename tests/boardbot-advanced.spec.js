const { test, expect } = require('@playwright/test');
const PicmgHomePage = require('../pages/PicmgHomePage');
const BoardBotPage = require('../pages/BoardBotPage');

test.describe('PICMG BoardBot - AdvancedMC Processor Validation', () => {
  
  // Test Case 1: Query by processor specs and fabric requirements
  test('TC1: Search by Intel Xeon 6-core 2.8GHz with PCIe/RapidIO fabric', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    // Query 1
    const query1 = 'Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.';
    
    console.log('🔍 Test Case 1: Searching with query about processor specs and fabric...');
    await boardBot.searchProducts(query1);
    await boardBot.waitForResults();

    // Verify results appeared
    const productCount = await boardBot.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`✅ Found ${productCount} products`);

    // Check first 5 results
    await validateFirst5Products(page, 'TC1', [
      'AdvancedMC',
      'Xeon',
      '6-core',
      'PCIe',
      'RapidIO',
      'high-performance'
    ]);
  });

  // Test Case 2: Query by memory and Ethernet specs
  test('TC2: Search by Xeon with ECC DDR4 16GB and 10G Ethernet', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    // Query 2
    const query2 = 'Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?';
    
    console.log('🔍 Test Case 2: Searching with query about memory and Ethernet...');
    await boardBot.searchProducts(query2);
    await boardBot.waitForResults();

    const productCount = await boardBot.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`✅ Found ${productCount} products`);

    // Check first 5 results
    await validateFirst5Products(page, 'TC2', [
      'AdvancedMC',
      'Xeon',
      'DDR4',
      'ECC',
      'Ethernet',
      '10G'
    ]);
  });

  // Test Case 3: Query by specific processor model
  test('TC3: Search by Intel Xeon E-2276ME 6-core model', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    // Query 3
    const query3 = 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO.';
    
    console.log('🔍 Test Case 3: Searching with specific processor model...');
    await boardBot.searchProducts(query3);
    await boardBot.waitForResults();

    const productCount = await boardBot.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    console.log(`✅ Found ${productCount} products`);

    // Check first 5 results
    await validateFirst5Products(page, 'TC3', [
      'AdvancedMC',
      'E-2276ME',
      'Xeon',
      'Intel',
      'PCI Express',
      'PCIe'
    ]);
  });

  // Combined test: Run all 3 queries in sequence and compare results
  test('TC4: Compare results across all 3 query variations', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const queries = [
      {
        id: 'Query 1 (Processor + Fabric)',
        text: 'Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.'
      },
      {
        id: 'Query 2 (Memory + Ethernet)',
        text: 'Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?'
      },
      {
        id: 'Query 3 (Specific Model)',
        text: 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO.'
      }
    ];

    const allResults = [];

    for (const query of queries) {
      console.log(`\n🔍 Testing: ${query.id}`);
      
      // Restart session for clean results
      await page.locator('text=Restart session').click();
      await page.waitForTimeout(1000);

      await boardBot.searchProducts(query.text);
      await boardBot.waitForResults();

      const productCount = await boardBot.getProductCount();
      console.log(`   Found ${productCount} products`);

      // Get first product name from each query
      const firstProductName = await page.locator('tbody tr').first()
        .locator('td').nth(2).textContent();
      
      allResults.push({
        query: query.id,
        count: productCount,
        firstProduct: firstProductName.trim()
      });
    }

    // Log comparison
    console.log('\n📊 Results Comparison:');
    allResults.forEach(result => {
      console.log(`   ${result.query}:`);
      console.log(`      - Product Count: ${result.count}`);
      console.log(`      - First Result: ${result.firstProduct}`);
    });

    // Verify all queries returned results
    allResults.forEach(result => {
      expect(result.count).toBeGreaterThan(0);
    });
  });

});

// Helper function to validate first 5 products
async function validateFirst5Products(page, testCase, keywords) {
  console.log(`\n📋 Validating first 5 products for ${testCase}...`);
  
  const productRows = page.locator('tbody tr');
  const totalProducts = await productRows.count();
  const productsToCheck = Math.min(5, totalProducts);

  const validationResults = [];

  for (let i = 0; i < productsToCheck; i++) {
    console.log(`\n   🔍 Checking Product ${i + 1}...`);
    
    // Get product name
    const productName = await productRows.nth(i).locator('td').nth(2).textContent();
    const manufacturer = await productRows.nth(i).locator('td').nth(3).textContent();
    const category = await productRows.nth(i).locator('td').nth(4).textContent();
    
    console.log(`      Name: ${productName.trim()}`);
    console.log(`      Manufacturer: ${manufacturer.trim()}`);
    console.log(`      Category: ${category.trim()}`);

    // Click "More Info" button
    const moreInfoButton = productRows.nth(i).locator('button', { hasText: 'More Info' });
    await moreInfoButton.click();
    
    // Wait for modal/popup to appear
    await page.waitForTimeout(2000);

    // Try to get description from modal
    let description = '';
    let isRelevant = false;
    
    try {
      // Look for description in various possible locations
      const descriptionSelectors = [
        'text=Description',
        '.product-description',
        'p:has-text("processor")',
        'p:has-text("Intel")',
        'p:has-text("Xeon")',
        'div:has-text("specifications")',
        'div:has-text("features")'
      ];

      // Try to capture any text from the modal
      const modalContent = await page.locator('div[role="dialog"], .modal, .popup').first();
      if (await modalContent.isVisible({ timeout: 2000 })) {
        description = await modalContent.textContent();
      } else {
        // Fallback: try to get any new text that appeared
        description = await page.locator('body').textContent();
      }

      // Check if description contains relevant keywords
      const lowerDesc = description.toLowerCase();
      const foundKeywords = keywords.filter(keyword => 
        lowerDesc.includes(keyword.toLowerCase())
      );

      isRelevant = foundKeywords.length >= 2; // At least 2 keywords match

      console.log(`      ✓ Found keywords: ${foundKeywords.join(', ') || 'None'}`);
      console.log(`      ${isRelevant ? '✅ RELEVANT' : '⚠️  POSSIBLY NOT RELEVANT'}`);

      validationResults.push({
        index: i + 1,
        name: productName.trim(),
        manufacturer: manufacturer.trim(),
        category: category.trim(),
        foundKeywords: foundKeywords,
        isRelevant: isRelevant
      });

    } catch (error) {
      console.log(`      ⚠️  Could not validate description: ${error.message}`);
      validationResults.push({
        index: i + 1,
        name: productName.trim(),
        manufacturer: manufacturer.trim(),
        category: category.trim(),
        foundKeywords: [],
        isRelevant: false,
        error: error.message
      });
    }

    // Close modal (try multiple methods)
    try {
      // Try ESC key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Try clicking close button
      const closeButton = page.locator('button:has-text("Close"), button[aria-label="Close"], .close-button');
      if (await closeButton.isVisible({ timeout: 1000 })) {
        await closeButton.click();
      }
    } catch (e) {
      // Modal might have closed already
    }

    await page.waitForTimeout(1000);
  }

  // Summary
  console.log(`\n   📊 ${testCase} Validation Summary:`);
  console.log(`      Total checked: ${validationResults.length}`);
  const relevant = validationResults.filter(r => r.isRelevant).length;
  console.log(`      Relevant products: ${relevant}/${validationResults.length}`);
  console.log(`      Relevance rate: ${((relevant/validationResults.length) * 100).toFixed(1)}%`);

  // At least 60% of products should be relevant
  expect(relevant).toBeGreaterThanOrEqual(Math.ceil(validationResults.length * 0.6));

  return validationResults;
}
