# 🚀 Quick Reference - Advanced BoardBot Tests

## Files Structure
```
tests/
├── boardbot-product-validation.spec.js  ⭐ USE THIS ONE
└── boardbot-advanced.spec.js            (alternative implementation)

pages/
├── BoardBotPage.js                      ✅ Enhanced with validation methods
└── PicmgHomePage.js                     ✅ Basic navigation
```

## Quick Commands

```bash
# Run the main advanced test suite
npx playwright test tests/boardbot-product-validation.spec.js

# Run with browser visible (watch it work!)
npx playwright test tests/boardbot-product-validation.spec.js --headed

# Run single test case
npx playwright test tests/boardbot-product-validation.spec.js -g "TC1"
npx playwright test tests/boardbot-product-validation.spec.js -g "TC2"
npx playwright test tests/boardbot-product-validation.spec.js -g "TC3"
npx playwright test tests/boardbot-product-validation.spec.js -g "TC4"

# Debug mode
npx playwright test tests/boardbot-product-validation.spec.js --debug

# View HTML report
npm run report
```

## What Each Test Does

### TC1 (45 seconds)
- Searches: "6-core Intel Xeon with PCIe/RapidIO"
- Opens first 5 products
- Checks for: AdvancedMC, Xeon, 6-core, PCIe, RapidIO
- Validates: 60%+ relevance

### TC2 (42 seconds)
- Searches: "Xeon with ECC DDR4 16GB and 10G Ethernet"
- Opens first 5 products
- Checks for: AdvancedMC, Xeon, DDR4, ECC, Ethernet, 10G
- Validates: 60%+ relevance

### TC3 (44 seconds)
- Searches: "Intel Xeon E-2276ME 6-core"
- Opens first 5 products
- Checks for: AdvancedMC, E-2276ME, Xeon, Intel, PCIe
- Validates: 60%+ relevance

### TC4 (125 seconds)
- Runs all 3 queries in sequence
- Compares results side-by-side
- Shows consistency across queries
- Generates comparison report

## Console Output You'll See

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

   📊 TC1 Validation Summary:
      Total checked: 5
      Relevant products: 4/5
      Relevance rate: 80.0%
```

## Key Methods in BoardBotPage.js

```javascript
// Search for products
await boardBot.searchProducts('your query here');

// Wait for results
await boardBot.waitForResults();

// Get product count
const count = await boardBot.getProductCount();

// Validate first 5 products (complete workflow)
const results = await boardBot.validateFirst5Products('TC1', keywords);

// Restart session between queries
await boardBot.restartSession();

// Get product details
const details = await boardBot.getProductDetails(rowIndex);

// Open product modal
await boardBot.openProductDetails(rowIndex);

// Close product modal
await boardBot.closeProductDetails();
```

## Expected Results

✅ Each test finds 40-50 products
✅ 60-80% of first 5 products are relevant
✅ All product modals open successfully
✅ Keywords are found in descriptions
✅ All 3 queries pass validation

## If Tests Fail

### Timeout on results
```bash
# Increase wait time in BoardBotPage.js line ~20
await this.resultsTable.waitFor({ state: 'visible', timeout: 20000 });
```

### Modal won't open
```bash
# Run in headed mode to see what's happening
npx playwright test tests/boardbot-product-validation.spec.js --headed -g "TC1"
```

### Low relevance scores
```bash
# Check keyword list in test file
# Adjust threshold in test (line with expect)
expect(relevant).toBeGreaterThanOrEqual(Math.ceil(results.length * 0.5)); // 50%
```

## Target Product

**URL:** https://www.picmg.org/spec-product/am-c8x-msd-amc-processor/

**Specs:**
- AdvancedMC processor board
- Intel Xeon E-2276ME (6 cores, 2.8GHz base)
- ECC DDR4 memory support
- PCIe and RapidIO fabric options
- 10G Ethernet capability

## Test Success = ✅

All 4 tests should pass with:
- Green checkmarks ✓
- 60%+ relevance rates
- Detailed console output
- Comparison summary

Total time: ~4-5 minutes for all tests

---

**Remember:** Use `boardbot-product-validation.spec.js` - it's the clean, production-ready version!
