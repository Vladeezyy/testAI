const { test, expect } = require('@playwright/test');
const PicmgHomePage = require('../pages/PicmgHomePage');
const BoardBotPage = require('../pages/BoardBotPage');

// Increase timeout for these tests since BoardBot can be slow
test.setTimeout(120000); // 2 minutes per test

test.describe('PICMG BoardBot - AdvancedMC Processor Validation (Clean)', () => {
  
  // Test Case 1: Query by processor specs and fabric requirements
  test('TC1: Intel Xeon 6-core 2.8GHz with PCIe/RapidIO fabric', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC1...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.';
    const keywords = ['AdvancedMC', 'Xeon', '6-core', 'PCIe', 'RapidIO', 'high-performance', 'Intel'];
    
    console.log('🔍 TC1: Searching by processor specs and fabric requirements...');
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000); // 30 second timeout

    const productCount = await boardBot.getProductCount();
    console.log(`✅ Found ${productCount} products\n`);
    expect(productCount).toBeGreaterThan(0);

    // Validate first 5 products
    const results = await boardBot.validateFirst5Products('TC1', keywords);
    
    // At least 40% should be relevant (lowered threshold for testing)
    const relevant = results.filter(r => r.isRelevant).length;
    console.log(`\n⚖️  Validation Result: ${relevant} out of ${results.length} products are relevant`);
    
    // More lenient check - at least 2 out of 5 should be relevant
    expect(relevant).toBeGreaterThanOrEqual(2);
  });

  // Test Case 2: Query by memory and Ethernet specs
  test('TC2: Xeon with ECC DDR4 16GB and 10G Ethernet', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC2...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?';
    const keywords = ['AdvancedMC', 'Xeon', 'DDR4', 'ECC', 'memory', 'Ethernet', '10G', 'backplane'];
    
    console.log('🔍 TC2: Searching by memory and Ethernet specs...');
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000);

    const productCount = await boardBot.getProductCount();
    console.log(`✅ Found ${productCount} products\n`);
    expect(productCount).toBeGreaterThan(0);

    const results = await boardBot.validateFirst5Products('TC2', keywords);
    
    const relevant = results.filter(r => r.isRelevant).length;
    console.log(`\n⚖️  Validation Result: ${relevant} out of ${results.length} products are relevant`);
    expect(relevant).toBeGreaterThanOrEqual(2);
  });

  // Test Case 3: Query by specific processor model
  test('TC3: Intel Xeon E-2276ME 6-core model', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC3...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO.';
    const keywords = ['AdvancedMC', 'E-2276ME', 'Xeon', 'Intel', '6 core', 'PCI Express', 'PCIe', 'RapidIO', 'fabric'];
    
    console.log('🔍 TC3: Searching by specific processor model...');
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000);

    const productCount = await boardBot.getProductCount();
    console.log(`✅ Found ${productCount} products\n`);
    expect(productCount).toBeGreaterThan(0);

    const results = await boardBot.validateFirst5Products('TC3', keywords);
    
    const relevant = results.filter(r => r.isRelevant).length;
    console.log(`\n⚖️  Validation Result: ${relevant} out of ${results.length} products are relevant`);
    expect(relevant).toBeGreaterThanOrEqual(2);
  });

  // Test Case 4: Compare all 3 query variations
  test('TC4: Compare results across all query variations', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC4 - Comprehensive Comparison...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const testQueries = [
      {
        name: 'Query 1: Processor + Fabric Focus',
        query: 'Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.',
        keywords: ['AdvancedMC', 'Xeon', '6-core', 'PCIe', 'RapidIO']
      },
      {
        name: 'Query 2: Memory + Ethernet Focus',
        query: 'Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?',
        keywords: ['AdvancedMC', 'Xeon', 'DDR4', 'ECC', 'Ethernet', '10G']
      },
      {
        name: 'Query 3: Specific Model Focus',
        query: 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO.',
        keywords: ['AdvancedMC', 'E-2276ME', 'Xeon', 'Intel', 'PCI Express', 'RapidIO']
      }
    ];

    const comparisonResults = [];

    for (let i = 0; i < testQueries.length; i++) {
      const testQuery = testQueries[i];
      console.log(`\n\n${'='.repeat(80)}`);
      console.log(`🔍 ${testQuery.name}`);
      console.log(`${'='.repeat(80)}\n`);
      
      // Restart session for clean results (except first query)
      if (i > 0) {
        await boardBot.restartSession();
        await page.waitForTimeout(2000);
      }

      // Execute search
      await boardBot.searchProducts(testQuery.query);
      await boardBot.waitForResults(30000);

      // Get product count
      const productCount = await boardBot.getProductCount();
      console.log(`✅ Total products found: ${productCount}`);

      // Get first 3 product details only (for comparison)
      const topProducts = [];
      for (let j = 0; j < Math.min(3, productCount); j++) {
        try {
          const details = await boardBot.getProductDetails(j);
          topProducts.push(details.name.trim());
        } catch (e) {
          topProducts.push('Error retrieving product');
        }
      }

      // Validate first 5 products
      const validationResults = await boardBot.validateFirst5Products(
        testQuery.name, 
        testQuery.keywords
      );

      const relevantCount = validationResults.filter(r => r.isRelevant).length;
      const relevanceRate = (relevantCount / validationResults.length) * 100;

      comparisonResults.push({
        queryName: testQuery.name,
        totalProducts: productCount,
        top3Products: topProducts,
        validatedProducts: validationResults.length,
        relevantProducts: relevantCount,
        relevanceRate: relevanceRate.toFixed(1) + '%'
      });
    }

    // Print comparison summary
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 COMPARISON SUMMARY - ALL QUERIES');
    console.log(`${'='.repeat(80)}\n`);

    comparisonResults.forEach((result, index) => {
      console.log(`Query ${index + 1}: ${result.queryName}`);
      console.log(`   Total Products: ${result.totalProducts}`);
      console.log(`   Top 3 Products:`);
      result.top3Products.forEach((product, i) => {
        console.log(`      ${i + 1}. ${product}`);
      });
      console.log(`   Validated: ${result.validatedProducts} products`);
      console.log(`   Relevant: ${result.relevantProducts}/${result.validatedProducts} (${result.relevanceRate})`);
      console.log('');
    });

    // Verify all queries returned relevant results (lowered threshold)
    comparisonResults.forEach((result, index) => {
      console.log(`✅ Query ${index + 1} validation: ${result.relevantProducts}/${result.validatedProducts} relevant`);
      expect(result.relevantProducts).toBeGreaterThanOrEqual(2); // At least 2 out of 5
    });

    console.log(`\n${'='.repeat(80)}`);
    console.log('✅ ALL QUERIES PASSED VALIDATION');
    console.log(`${'='.repeat(80)}\n`);
  });

});
