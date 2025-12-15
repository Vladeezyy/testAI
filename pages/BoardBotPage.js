const AIValidator = require('../utils/AIValidator');

class BoardBotPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Ask about products based on' });
    this.askButton = page.getByRole('button', { name: 'Ask' });
    this.resultsTable = page.locator('table').first();
    this.productRows = page.locator('tbody tr');
    this.loadingIndicator = page.locator('img[alt="Loading"]');
    this.chatResponse = page.locator('generic').filter({ hasText: 'When looking for' }).first();
    this.primaryResultsTab = page.locator('text=Primary Results');
    this.clearSearchButton = page.locator('text=Clear search parameters');
    this.restartSessionButton = page.locator('text=Restart session');
    this.feedbackButton = page.locator('text=Feedback');
    this.disclaimer = page.locator('text=BoardBot is in beta');
    this.moreInfoButtons = page.locator('button:has-text("More Info")');
    this.aiValidator = new AIValidator();
    this.useAI = process.env.USE_AI_VALIDATION === 'true';
  }

  async searchProducts(query) {
    await this.searchInput.fill(query);
    await this.askButton.click();
  }

  async waitForResults(timeout = 30000) {
    try {
      await this.loadingIndicator.waitFor({ state: 'visible', timeout: 2000 });
      console.log('      ⏳ Loading indicator detected...');
    } catch (e) {
      console.log('      ⚡ Loading was too fast or no indicator shown');
    }

    try {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 });
      console.log('      ✓ Loading complete');
    } catch (e) {
      // Loading might have already finished
    }

    console.log('      ⏳ Waiting for results table...');
    await this.resultsTable.waitFor({ state: 'visible', timeout });
    console.log('      ✓ Results table visible');
    
    await this.page.waitForTimeout(2000);
  }

  async getProductCount() {
    await this.waitForResults();
    return await this.productRows.count();
  }

  async clearSearch() {
    await this.clearSearchButton.click();
  }

  async restartSession() {
    console.log('      🔄 Restarting session...');
    await this.restartSessionButton.click();
    await this.page.waitForTimeout(2000);
    console.log('      ✓ Session restarted');
  }

  async verifyInterfaceElements() {
    await this.searchInput.isVisible();
    await this.askButton.isVisible();
    await this.clearSearchButton.isVisible();
    await this.restartSessionButton.isVisible();
    await this.feedbackButton.isVisible();
    await this.disclaimer.isVisible();
  }

  async getProductDetails(rowIndex) {
    const row = this.productRows.nth(rowIndex);
    
    return {
      name: await row.locator('td').nth(2).textContent(),
      manufacturer: await row.locator('td').nth(3).textContent(),
      category: await row.locator('td').nth(4).textContent(),
      subcategory: await row.locator('td').nth(5).textContent()
    };
  }

  async openProductDetails(rowIndex) {
    const moreInfoButton = this.productRows.nth(rowIndex).locator('button:has-text("More Info")');
    
    await moreInfoButton.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    
    await moreInfoButton.click();
    console.log('      ⏳ Waiting for modal to load...');
    
    await this.page.waitForTimeout(3000);
  }

  async closeProductDetails() {
    try {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(500);
      
      const closeSelectors = [
        'button:has-text("Close")',
        'button[aria-label="Close"]',
        '.close-button',
        'button.close',
        '[class*="close"]'
      ];
      
      for (const selector of closeSelectors) {
        try {
          const closeButton = this.page.locator(selector).first();
          if (await closeButton.isVisible({ timeout: 500 })) {
            await closeButton.click();
            await this.page.waitForTimeout(500);
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
    } catch (e) {
      // Modal might have closed already
    }
    await this.page.waitForTimeout(500);
  }

  async getModalContent() {
    console.log('      📄 Extracting modal content...');
    
    const possibleSelectors = [
      'div[role="dialog"]',
      '.modal-content',
      '.modal-body',
      '.popup-content',
      '[class*="modal"]',
      '[class*="dialog"]',
      '[class*="popup"]',
      'div[class*="Modal"]',
      'div[class*="Dialog"]'
    ];

    for (const selector of possibleSelectors) {
      try {
        const modal = this.page.locator(selector).first();
        if (await modal.isVisible({ timeout: 1000 })) {
          const content = await modal.textContent();
          if (content && content.length > 100) {
            console.log(`      ✓ Found content in ${selector} (${content.length} chars)`);
            return content;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    try {
      const expandedRow = this.page.locator('tr.expanded, tr[class*="expand"], td[colspan]').first();
      if (await expandedRow.isVisible({ timeout: 1000 })) {
        const content = await expandedRow.textContent();
        if (content && content.length > 50) {
          console.log(`      ✓ Found expanded row content (${content.length} chars)`);
          return content;
        }
      }
    } catch (e) {
      // Not an expandable row
    }

    try {
      const descriptionPatterns = [
        'text=Description',
        'text=Specifications',
        'text=Features',
        'text=Product Details',
        'text=Overview'
      ];
      
      for (const pattern of descriptionPatterns) {
        try {
          const element = this.page.locator(pattern).first();
          if (await element.isVisible({ timeout: 500 })) {
            const section = element.locator('xpath=ancestor::div[1]').first();
            const content = await section.textContent();
            if (content && content.length > 50) {
              console.log(`      ✓ Found section content (${content.length} chars)`);
              return content;
            }
          }
        } catch (e) {
          // Try next pattern
        }
      }
    } catch (e) {
      // Fallback
    }

    console.log('      ⚠️  Using fallback: getting all page text');
    const pageContent = await this.page.locator('body').textContent();
    return pageContent;
  }

  async validateProductRelevance(description, keywords, searchQuery = '', productName = '') {
    // Use AI validation if enabled
    if (this.useAI && searchQuery && productName) {
      console.log('      🤖 Using AI validation...');
      const aiResult = await this.aiValidator.validateProductRelevance(
        description, 
        searchQuery, 
        productName
      );
      
      if (aiResult) {
        console.log(`      🤖 AI Confidence: ${aiResult.confidence}%`);
        console.log(`      🤖 AI Reasoning: ${aiResult.reasoning}`);
        
        return {
          isRelevant: aiResult.isRelevant,
          foundKeywords: aiResult.matchedFeatures,
          totalKeywords: keywords.length,
          relevanceScore: aiResult.confidence,
          aiValidation: true,
          aiReasoning: aiResult.reasoning
        };
      }
    }

    // Fallback to keyword matching
    const lowerDesc = description.toLowerCase();
    console.log(`      📝 Description preview: ${description.substring(0, 200)}...`);
    
    const foundKeywords = keywords.filter(keyword => 
      lowerDesc.includes(keyword.toLowerCase())
    );
    
    keywords.forEach(keyword => {
      const found = lowerDesc.includes(keyword.toLowerCase());
      if (found) {
        console.log(`         ✓ Found: "${keyword}"`);
      }
    });
    
    return {
      isRelevant: foundKeywords.length >= 2,
      foundKeywords: foundKeywords,
      totalKeywords: keywords.length,
      relevanceScore: (foundKeywords.length / keywords.length) * 100,
      aiValidation: false
    };
  }

  async validateFirst5Products(testCaseName, keywords, searchQuery = '') {
    console.log(`\n📋 Validating first 5 products for ${testCaseName}...`);
    if (this.useAI) {
      console.log('🤖 AI Validation: ENABLED');
    } else {
      console.log('🔤 Keyword Validation: ENABLED (set USE_AI_VALIDATION=true to use AI)');
    }
    
    const totalProducts = await this.getProductCount();
    const productsToCheck = Math.min(5, totalProducts);
    const results = [];

    for (let i = 0; i < productsToCheck; i++) {
      console.log(`\n   🔍 Checking Product ${i + 1}...`);
      
      try {
        const details = await this.getProductDetails(i);
        console.log(`      Name: ${details.name.trim()}`);
        console.log(`      Manufacturer: ${details.manufacturer.trim()}`);
        console.log(`      Category: ${details.category.trim()}`);

        await this.openProductDetails(i);
        
        const description = await this.getModalContent();
        
        const validation = await this.validateProductRelevance(
          description, 
          keywords,
          searchQuery,
          details.name.trim()
        );
        
        console.log(`      ✓ Keywords found: ${validation.foundKeywords.length}/${validation.totalKeywords}`);
        console.log(`      Relevance: ${validation.relevanceScore.toFixed(1)}%`);
        console.log(`      ${validation.isRelevant ? '✅ RELEVANT' : '⚠️  POSSIBLY NOT RELEVANT'}`);

        results.push({
          index: i + 1,
          name: details.name.trim(),
          manufacturer: details.manufacturer.trim(),
          category: details.category.trim(),
          ...validation
        });

        await this.closeProductDetails();
        await this.page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`      ⚠️  Error validating product ${i + 1}: ${error.message}`);
        results.push({
          index: i + 1,
          name: 'Error',
          manufacturer: 'Error',
          category: 'Error',
          isRelevant: false,
          foundKeywords: [],
          totalKeywords: keywords.length,
          relevanceScore: 0,
          error: error.message
        });
      }
    }

    console.log(`\n   📊 ${testCaseName} Validation Summary:`);
    console.log(`      Total checked: ${results.length}`);
    const relevant = results.filter(r => r.isRelevant).length;
    console.log(`      Relevant products: ${relevant}/${results.length}`);
    console.log(`      Relevance rate: ${((relevant/results.length) * 100).toFixed(1)}%`);

    return results;
  }
}

module.exports = BoardBotPage;
