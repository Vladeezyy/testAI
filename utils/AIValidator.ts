import * as fs from 'fs';
import * as path from 'path';

interface ProductReference {
  category: string;
  url: string;
  description: string;
}

interface ProductList {
  [category: string]: {
    items: ProductReference[];
  };
}

export class AIValidator {
  private productList: ProductList;
  private ollamaUrl: string;
  private model: string;

  constructor() {
    // Load product reference data
    const listPath = path.join(__dirname, '../products/list.json');
    this.productList = JSON.parse(fs.readFileSync(listPath, 'utf8'));
    
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'picmg-expert';
  }

  /**
   * Get the original product reference based on category and suite number
   * Suite 1 (tests 1.1-1.3) = items[0]
   * Suite 2 (tests 2.1-2.3) = items[1]
   * Suite 3 (tests 3.1-3.3) = items[2]
   */
  getOriginalProduct(category: string, suiteNumber: number): ProductReference | null {
    // Try exact match first
    let categoryData = this.productList[category];
    
    // If not found, try common variations
    if (!categoryData) {
      const categoryKeys = Object.keys(this.productList);
      
      // Normalize for comparison (lowercase, remove spaces/hyphens)
      const normalizeKey = (key: string) => key.toLowerCase().replace(/[\s-]/g, '');
      const normalizedInput = normalizeKey(category);
      
      // Try to find a matching key
      const matchedKey = categoryKeys.find(key => {
        const normalizedKey = normalizeKey(key);
        // Check if either contains the other (handles 'CompactPCI' matching 'CompactPCI Serial')
        return normalizedKey.includes(normalizedInput) || normalizedInput.includes(normalizedKey);
      });
      
      if (matchedKey) {
        console.log(`   ℹ️  Matched category "${category}" to "${matchedKey}" in list.json`);
        categoryData = this.productList[matchedKey];
      }
    }
    
    if (!categoryData) {
      console.log(`⚠️  Category not found in list.json: ${category}`);
      console.log(`   Available categories: ${Object.keys(this.productList).join(', ')}`);
      return null;
    }

    const itemIndex = suiteNumber - 1; // Suite 1 = index 0
    if (itemIndex >= categoryData.items.length) {
      console.log(`⚠️  Suite ${suiteNumber} not found for ${category}`);
      return null;
    }

    return categoryData.items[itemIndex];
  }

  /**
   * Validate if a search result product is relevant to the original product
   */
  async validateProductRelevance(
    resultProductName: string,
    resultProductCategory: string,
    resultProductDescription: string,
    searchQuery: string,
    expectedCategory: string,
    suiteNumber: number
  ): Promise<{
    isRelevant: boolean;
    confidence: number;
    reasoning: string;
    originalProduct?: string;
  }> {
    // Get original product reference
    const originalProduct = this.getOriginalProduct(expectedCategory, suiteNumber);
    
    if (!originalProduct) {
      return {
        isRelevant: true,
        confidence: 0,
        reasoning: 'No original product reference found - skipping AI validation',
        originalProduct: 'Unknown'
      };
    }

    try {
      // Enhanced prompt with reference product context
      const prompt = `You are a PICMG product expert. Analyze if this search result matches what the user wants.

=== REFERENCE PRODUCT (Ground Truth) ===
Name: ${originalProduct.url.split('/').pop()?.replace(/-/g, ' ')}
Category: ${originalProduct.category}
Full Specification:
${originalProduct.description}

=== USER SEARCH QUERY ===
"${searchQuery}"

=== SEARCH RESULT TO EVALUATE ===
Product: ${resultProductName}
Category: ${resultProductCategory}
Description:
${resultProductDescription.substring(0, 1000)}

=== EVALUATION CRITERIA ===
Compare the SEARCH RESULT against the REFERENCE PRODUCT:
1. Category match (exact or compatible subcategory)
2. Key specifications alignment (processor, memory, connectivity, form factor)
3. Feature compatibility (hot-swap, redundancy, cooling)
4. Use case alignment (telecom/industrial/embedded)
5. Query intent satisfaction

=== RESPONSE FORMAT ===
JSON only (no markdown):
{
  "isRelevant": true/false,
  "confidence": 0-100,
  "reasoning": "1-2 sentence technical explanation"
}`;

      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.2, // Very low for consistency
            num_predict: 150, // Faster responses
            top_p: 0.9
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.response);

      return {
        isRelevant: result.isRelevant,
        confidence: result.confidence,
        reasoning: result.reasoning,
        originalProduct: originalProduct.url.split('/').pop() || originalProduct.url || 'Unknown'
      };

    } catch (error) {
      console.log(`⚠️  AI validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isRelevant: true,
        confidence: 0,
        reasoning: `AI validation failed: ${error instanceof Error ? error.message : 'Unknown'}`,
        originalProduct: originalProduct.url.split('/').pop() || originalProduct.url || 'Unknown'
      };
    }
  }

  /**
   * Check if Ollama is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get suite number from test ID
   * e.g., "MicroTCA_TC1.2" -> 1, "COM-HPC_TC3.1" -> 3
   */
  static getSuiteNumber(testId: string): number {
    const match = testId.match(/TC(\d+)\./);
    return match ? parseInt(match[1]) : 1;
  }
}
