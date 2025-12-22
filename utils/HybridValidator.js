class HybridValidator {
  constructor() {
    this.aiValidator = new AIValidator();
    this.aiUsageCount = 0;
    this.keywordUsageCount = 0;
  }

  async validateProduct(description, keywords, searchQuery, productName, options = {}) {
    const {
      isFirstProduct = false,      // Always use AI for first product
      isLastProduct = false,        // Always use AI for last product
      isRandomSample = false,       // Randomly sample products
      useAIThreshold = 0.3,         // Use AI for 30% of products
      forceKeyword = false          // Force keyword validation
    } = options;

    // Force keyword if specified
    if (forceKeyword) {
      this.keywordUsageCount++;
      return this.keywordValidation(description, keywords);
    }

    // Always use AI for first and last products
    if (isFirstProduct || isLastProduct) {
      this.aiUsageCount++;
      return await this.aiValidator.validateProductRelevance(
        description, 
        searchQuery, 
        productName
      );
    }

    // Random sampling approach
    if (isRandomSample && Math.random() < useAIThreshold) {
      this.aiUsageCount++;
      return await this.aiValidator.validateProductRelevance(
        description, 
        searchQuery, 
        productName
      );
    }

    // Default to keyword validation
    this.keywordUsageCount++;
    return this.keywordValidation(description, keywords);
  }

  keywordValidation(description, keywords) {
    const lowerDesc = description.toLowerCase();
    const foundKeywords = keywords.filter(keyword => 
      lowerDesc.includes(keyword.toLowerCase())
    );
    
    return {
      isRelevant: foundKeywords.length >= 2,
      foundKeywords: foundKeywords,
      confidence: (foundKeywords.length / keywords.length) * 100,
      aiValidation: false
    };
  }

  getUsageStats() {
    const total = this.aiUsageCount + this.keywordUsageCount;
    return {
      aiUsed: this.aiUsageCount,
      keywordUsed: this.keywordUsageCount,
      total: total,
      aiPercentage: ((this.aiUsageCount / total) * 100).toFixed(1),
      estimatedCost: (this.aiUsageCount * 0.01).toFixed(2)
    };
  }

  resetStats() {
    this.aiUsageCount = 0;
    this.keywordUsageCount = 0;
  }
}

module.exports = HybridValidator;
