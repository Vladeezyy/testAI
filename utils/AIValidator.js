class AIValidator {
  constructor() {
    // Note: You'll need to add your API key
    this.apiKey = process.env.ANTHROPIC_API_KEY; // Set in environment
  }

  async validateProductRelevance(productDescription, searchQuery, productName) {
    try {
      const prompt = `You are a product validation expert. 

Search Query: "${searchQuery}"
Product Name: "${productName}"
Product Description: "${productDescription}"

Task: Determine if this product is relevant to the search query.

Respond with ONLY a JSON object in this exact format:
{
  "isRelevant": true or false,
  "confidence": 0-100,
  "reasoning": "brief explanation",
  "matchedFeatures": ["feature1", "feature2"]
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      // Parse AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      }
      
      throw new Error('Could not parse AI response');
      
    } catch (error) {
      console.log(`      ⚠️  AI validation error: ${error.message}`);
      // Fallback to keyword matching
      return null;
    }
  }

  async validateTestResults(testName, results, expectedOutcome) {
    try {
      const prompt = `You are a test validation expert.

Test Name: ${testName}
Results: ${JSON.stringify(results, null, 2)}
Expected: ${expectedOutcome}

Task: Analyze if the test results meet expectations.

Respond with ONLY a JSON object:
{
  "passed": true or false,
  "confidence": 0-100,
  "issues": ["issue1", "issue2"],
  "recommendation": "what to do"
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Could not parse AI response');
      
    } catch (error) {
      console.log(`      ⚠️  AI test validation error: ${error.message}`);
      return null;
    }
  }

  async generateTestReport(allResults) {
    try {
      const prompt = `Generate a comprehensive test report.

Results: ${JSON.stringify(allResults, null, 2)}

Create a detailed summary with:
- Overall assessment
- Pass/fail breakdown
- Key findings
- Recommendations for improvement`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      return data.content[0].text;
      
    } catch (error) {
      console.log(`      ⚠️  AI report generation error: ${error.message}`);
      return 'Report generation failed';
    }
  }
}

module.exports = AIValidator;
