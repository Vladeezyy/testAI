# PICMG BoardBot Test Automation

Automated tests for the PICMG BoardBot AI assistant at https://www.picmg.org/

## What is BoardBot?

BoardBot is an AI-powered assistant on the PICMG website that helps users find the right products based on PICMG specifications. It provides intelligent search capabilities for embedded computing products.

## Project Structure

```
testAI/
├── tests/
│   ├── boardbot.spec.js                      # Basic BoardBot tests (2 scenarios)
│   ├── boardbot-pom.spec.js                  # Tests using Page Object Model (3 scenarios)
│   ├── boardbot-advanced.spec.js             # Advanced validation tests (4 scenarios)
│   └── boardbot-product-validation.spec.js   # Clean product validation suite (4 scenarios)
├── pages/
│   ├── PicmgHomePage.js                      # PICMG home page object
│   └── BoardBotPage.js                       # BoardBot interface (enhanced)
├── playwright.config.js                      # Playwright configuration
└── package.json                              # Project dependencies
```

## Test Suites

### 🔵 Basic Tests (boardbot.spec.js)
Simple tests to verify BoardBot functionality:
- Access BoardBot and search for AMD motherboards
- Verify BoardBot interface elements

### 🟢 Page Object Model Tests (boardbot-pom.spec.js)
Tests using clean POM architecture:
- Search AMD motherboards with POM
- Verify interface with POM
- Search Intel products

### 🟡 Advanced Validation Tests (boardbot-advanced.spec.js)
Comprehensive validation with detailed checks:
- TC1: Intel Xeon 6-core 2.8GHz with PCIe/RapidIO fabric
- TC2: Xeon with ECC DDR4 16GB and 10G Ethernet
- TC3: Intel Xeon E-2276ME 6-core model
- TC4: Compare results across all query variations

### 🔴 Product Validation Suite (boardbot-product-validation.spec.js)
**⭐ RECOMMENDED - Most comprehensive test suite**

Tests the same AdvancedMC processor (Intel Xeon E-2276ME) with 3 different query approaches:

**Target Product:** https://www.picmg.org/spec-product/am-c8x-msd-amc-processor/

**Test Cases:**
1. **TC1: Processor + Fabric Focus**
   - Query: "Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics."
   - Validates: Processor specs, fabric options
   - Checks first 5 results for relevance

2. **TC2: Memory + Ethernet Focus**
   - Query: "Do you have an AdvancedMC Xeon-based CPU board for high-performance workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet via 10G backplane support?"
   - Validates: Memory specs, networking capabilities
   - Checks first 5 results for relevance

3. **TC3: Specific Model Focus**
   - Query: "Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). It should be suitable for high-performance computing and offer flexible fabric options like PCI Express or RapidIO."
   - Validates: Exact processor model, capabilities
   - Checks first 5 results for relevance

4. **TC4: Comprehensive Comparison**
   - Runs all 3 queries sequentially
   - Compares results across different query approaches
   - Validates consistency and relevance

**What Each Test Does:**
- ✅ Submits query to BoardBot
- ✅ Waits for AI response
- ✅ Opens "More Info" for first 5 products
- ✅ Extracts product description/specifications
- ✅ Validates relevance using keyword matching
- ✅ Calculates relevance score
- ✅ Requires at least 60% relevance rate to pass
- ✅ Provides detailed console output with results

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browser
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npx playwright test tests/boardbot-product-validation.spec.js

# Run with browser visible
npm run test:headed

# Run single test case
npx playwright test tests/boardbot-product-validation.spec.js -g "TC1"

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui

# View test report
npm run report
```

## Test Output Example

```
🔍 TC1: Searching by processor specs and fabric requirements...
✅ Found 48 products

📋 Validating first 5 products for TC1...

   🔍 Checking Product 1...
      Name: AM-C8x-MSD
      Manufacturer: Mercury Systems
      Category: AdvancedMC
      ✓ Found keywords: AdvancedMC, Xeon, 6-core, Intel
      Relevance: 57.1%
      ✅ RELEVANT

   🔍 Checking Product 2...
      Name: AMC-XE2-7059M
      Manufacturer: Adlink
      Category: AdvancedMC
      ✓ Found keywords: AdvancedMC, Xeon, PCIe
      Relevance: 42.9%
      ✅ RELEVANT

   ... (continues for 5 products)

   📊 TC1 Validation Summary:
      Total checked: 5
      Relevant products: 4/5
      Relevance rate: 80.0%
```

## Enhanced BoardBotPage Methods

The updated `BoardBotPage.js` includes advanced methods:

```javascript
// Get product details
await boardBot.getProductDetails(rowIndex)

// Open product modal
await boardBot.openProductDetails(rowIndex)

// Close product modal
await boardBot.closeProductDetails()

// Get modal content
await boardBot.getModalContent()

// Validate product relevance
await boardBot.validateProductRelevance(description, keywords)

// Validate first 5 products (complete workflow)
await boardBot.validateFirst5Products(testCaseName, keywords)

// Restart session for clean results
await boardBot.restartSession()
```

## Key Features

### 🎯 Smart Product Validation
- Opens each product's "More Info" modal
- Extracts full product description
- Matches against expected keywords
- Calculates relevance score
- Determines if product is suitable

### 📊 Detailed Reporting
- Console output for each product checked
- Summary statistics
- Relevance percentages
- Comparison across queries

### 🔄 Session Management
- Restarts BoardBot session between tests
- Ensures clean, independent results
- Prevents query context interference

### ⏱️ Proper Wait Handling
- 15-second timeout for AI responses
- Modal loading waits
- Session restart delays
- Smooth modal transitions

## Validation Criteria

**For a product to be considered RELEVANT:**
- Must match at least 2 keywords from the search query
- Keywords checked (case-insensitive):
  - AdvancedMC, Xeon, Intel, 6-core, E-2276ME
  - PCIe, PCI Express, RapidIO, fabric
  - DDR4, ECC, memory, Ethernet, 10G

**Test Success Criteria:**
- At least 60% of first 5 products must be relevant
- All 3 query variations must pass validation
- Product count must be greater than 0

## Configuration

**playwright.config.js:**
- Browser: Chrome/Chromium only
- Headless: true (set to false to watch tests)
- Screenshots: On failure
- Video: Retained on failure
- Retries: 2 (in CI mode)

## Troubleshooting

### Modal Not Opening
If "More Info" modal doesn't open:
```bash
# Run in headed mode to see what's happening
npm run test:headed
```

### Timeout Issues
If tests timeout on product validation:
```javascript
// Increase timeout in BoardBotPage.js
await this.page.waitForTimeout(3000); // Instead of 2000
```

### Low Relevance Scores
If products score low on relevance:
1. Check if keywords need adjustment
2. Verify product descriptions load fully
3. Run in headed mode to inspect modal content

### Session Issues
If queries affect each other:
```javascript
// Ensure restartSession is called between tests
await boardBot.restartSession();
await page.waitForTimeout(2000); // Give it time
```

## Example Test Run

```bash
npx playwright test tests/boardbot-product-validation.spec.js

Running 4 tests using 1 worker

  ✓ TC1: Intel Xeon 6-core 2.8GHz with PCIe/RapidIO fabric (45s)
  ✓ TC2: Xeon with ECC DDR4 16GB and 10G Ethernet (42s)
  ✓ TC3: Intel Xeon E-2276ME 6-core model (44s)
  ✓ TC4: Compare results across all query variations (125s)

  4 passed (4.3m)
```

## CI/CD

GitHub Actions workflow included in `.github/workflows/playwright.yml`

Tests run automatically on:
- Push to main/master
- Pull requests

## Best Practices

1. **Run validation tests individually first**
   ```bash
   npx playwright test tests/boardbot-product-validation.spec.js -g "TC1"
   ```

2. **Use headed mode for debugging**
   ```bash
   npx playwright test tests/boardbot-product-validation.spec.js --headed
   ```

3. **Check console output for detailed results**
   - Product names and manufacturers
   - Keywords found
   - Relevance scores

4. **Monitor relevance rates**
   - Should be consistently above 60%
   - Adjust keywords if needed

## Resources

- PICMG Website: https://www.picmg.org/
- Target Product: https://www.picmg.org/spec-product/am-c8x-msd-amc-processor/
- Playwright Docs: https://playwright.dev/

---

**Total Tests:** 13 scenarios across 4 test suites
**Recommended:** Use `boardbot-product-validation.spec.js` for comprehensive validation
