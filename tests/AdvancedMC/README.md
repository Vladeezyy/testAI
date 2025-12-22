# AdvancedMC Test Suite

## Overview
Automated tests for AdvancedMC product search functionality using BoardBot on PICMG website.

## Structure
```
tests/AdvancedMC/
  └── search.spec.ts          # Main search tests

pages/AdvancedMC/
  └── BoardBotPage.ts         # Page Object for BoardBot interactions

utils/
  └── ReportGenerator.ts      # Report generation utilities

test-results/reports/         # Generated test reports (Markdown format)
```

## Test Case 1: AdvancedMC Processor Board Search

**Prompt:** 
> Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon (around 2.8GHz base) for high-performance applications. Prefer something that can work with PCIe or RapidIO fabrics.

**Steps:**
1. Navigate to PICMG homepage
2. Click Member Products
3. Accept cookies
4. Submit search query to BoardBot
5. Wait for results (max 12 seconds)
6. Extract first 5 products (or less if fewer available)
7. Validate categories (should all be AdvancedMC)
8. Generate detailed report

**Expected Results:**
- All products should have category: "AdvancedMC"
- Each product should have: Name, Manufacturer, Category, Subcategory, URL
- Report shows suitable vs unsuitable products
- Warnings displayed for any non-AdvancedMC products

## Running the Tests

### Run all AdvancedMC tests:
```bash
npm test tests/AdvancedMC
```

### Run specific test:
```bash
npm test tests/AdvancedMC/search.spec.ts
```

### Run in headed mode (see browser):
```bash
npm run test:headed tests/AdvancedMC
```

### Run in debug mode:
```bash
npm run test:debug tests/AdvancedMC
```

### Run in UI mode:
```bash
npm run test:ui
```

## Reports

Reports are automatically generated in `test-results/reports/` directory.

Each report includes:
- Search prompt
- Total results found
- Number of suitable vs unsuitable products
- Detailed table with all product information
- Warnings for any products not matching expected category

## Adding New Tests

To add a new test case with different search criteria:

```typescript
test('TC2: Your test name', async ({ page }) => {
  const searchPrompt = 'Your search query here';
  const maxProducts = 5;
  const expectedCategory = 'AdvancedMC';
  
  // Follow the same pattern as TC1
  // ...
});
```

## Notes

- Wait time for results: Maximum 12 seconds
- Products extracted: First 5 (or fewer if less available)
- Category validation: Strict check for "AdvancedMC"
- Reports: Markdown format with timestamp
