const { test, expect } = require('@playwright/test');
const PicmgHomePage = require('../pages/PicmgHomePage');
const BoardBotPage = require('../pages/BoardBotPage');
const AIValidator = require('../utils/AIValidator');

test.setTimeout(180000); // 3 minutes per test (AI calls take time)

test.describe('PICMG BoardBot - AI-Powered Validation', () => {
  
  let aiValidator;

  test.beforeAll(() => {
    aiValidator = new AIValidator();
    
    // Check if AI validation is enabled
    if (process.env.USE_AI_VALIDATION === 'true') {
      console.log('🤖 AI Validation: ENABLED');
      if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  Warning: ANTHROPIC_API_KEY not set. AI validation will fallback to keyword matching.');
      }
    } else {
      console.log('🔤 Keyword Validation: ENABLED');
      console.log('💡 Tip: Set USE_AI_VALIDATION=true to enable AI validation');
    }
  });

  test('TC1-AI: Intel Xeon 6-core with PCIe/RapidIO - AI Validated', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC1 with AI Validation...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.';
    const keywords = ['AdvancedMC', 'Xeon', '6-core', 'PCIe', 'RapidIO', 'high-performance', 'Intel'];
    
    console.log('🔍 Searching...');
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000);

    const productCount = await boardBot.getProductCount();
    console.log(`✅ Found ${productCount} products\n`);
    expect(productCount).toBeGreaterThan(0);

    // Validate with AI
    const results = await boardBot.validateFirst5Products('TC1-AI', keywords, query);
    
    // If AI validation enabled, use AI to judge overall results
    if (process.env.USE_AI_VALIDATION === 'true' && process.env.ANTHROPIC_API_KEY) {
      console.log('\n🤖 Asking AI to judge overall test results...');
      const aiJudgment = await aiValidator.validateTestResults(
        'TC1: Intel Xeon 6-core with PCIe/RapidIO',
        results,
        'At least 2 out of 5 products should be relevant to an AdvancedMC processor board with Intel Xeon 6-core'
      );
      
      if (aiJudgment) {
        console.log(`\n🤖 AI Overall Assessment:`);
        console.log(`   Passed: ${aiJudgment.passed ? '✅ YES' : '❌ NO'}`);
        console.log(`   Confidence: ${aiJudgment.confidence}%`);
        console.log(`   Issues: ${aiJudgment.issues.join(', ') || 'None'}`);
        console.log(`   Recommendation: ${aiJudgment.recommendation}`);
        
        expect(aiJudgment.passed).toBe(true);
      } else {
        // Fallback to simple check
        const relevant = results.filter(r => r.isRelevant).length;
        expect(relevant).toBeGreaterThanOrEqual(2);
      }
    } else {
      // Keyword-based validation
      const relevant = results.filter(r => r.isRelevant).length;
      expect(relevant).toBeGreaterThanOrEqual(2);
    }
  });

  test('TC2-AI: Xeon with ECC DDR4 and 10G Ethernet - AI Validated', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Starting TC2 with AI Validation...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?';
    const keywords = ['AdvancedMC', 'Xeon', 'DDR4', 'ECC', 'memory', 'Ethernet', '10G', 'backplane'];
    
    console.log('🔍 Searching...');
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000);

    const productCount = await boardBot.getProductCount();
    console.log(`✅ Found ${productCount} products\n`);
    expect(productCount).toBeGreaterThan(0);

    const results = await boardBot.validateFirst5Products('TC2-AI', keywords, query);
    
    if (process.env.USE_AI_VALIDATION === 'true' && process.env.ANTHROPIC_API_KEY) {
      console.log('\n🤖 Asking AI to judge overall test results...');
      const aiJudgment = await aiValidator.validateTestResults(
        'TC2: Xeon with ECC DDR4 and 10G Ethernet',
        results,
        'At least 2 out of 5 products should be relevant'
      );
      
      if (aiJudgment) {
        console.log(`\n🤖 AI Overall Assessment:`);
        console.log(`   Passed: ${aiJudgment.passed ? '✅ YES' : '❌ NO'}`);
        console.log(`   Confidence: ${aiJudgment.confidence}%`);
        console.log(`   Recommendation: ${aiJudgment.recommendation}`);
        
        expect(aiJudgment.passed).toBe(true);
      } else {
        const relevant = results.filter(r => r.isRelevant).length;
        expect(relevant).toBeGreaterThanOrEqual(2);
      }
    } else {
      const relevant = results.filter(r => r.isRelevant).length;
      expect(relevant).toBeGreaterThanOrEqual(2);
    }
  });

  test('Generate AI-Powered Test Report', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    console.log('\n🚀 Running test and generating AI report...');
    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    const query = 'Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores).';
    const keywords = ['AdvancedMC', 'E-2276ME', 'Xeon', 'Intel'];
    
    await boardBot.searchProducts(query);
    await boardBot.waitForResults(30000);

    const productCount = await boardBot.getProductCount();
    const results = await boardBot.validateFirst5Products('Report Test', keywords, query);
    
    // Generate comprehensive AI report
    if (process.env.USE_AI_VALIDATION === 'true' && process.env.ANTHROPIC_API_KEY) {
      console.log('\n🤖 Generating AI-powered test report...\n');
      
      const report = await aiValidator.generateTestReport({
        testName: 'AdvancedMC Processor Search',
        query: query,
        totalProducts: productCount,
        validatedProducts: results,
        timestamp: new Date().toISOString()
      });
      
      console.log('📊 AI-GENERATED REPORT:');
      console.log('='.repeat(80));
      console.log(report);
      console.log('='.repeat(80));
    } else {
      console.log('💡 Set USE_AI_VALIDATION=true and ANTHROPIC_API_KEY to generate AI reports');
    }
    
    // Basic validation
    const relevant = results.filter(r => r.isRelevant).length;
    expect(relevant).toBeGreaterThanOrEqual(1);
  });

});
