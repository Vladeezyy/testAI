# Quick Start Guide - AdvancedMC Tests

## ✅ What We Built

1. **Structured Test Suite**
   - `tests/AdvancedMC/search.spec.ts` - Main test file
   - Organized by feature (AdvancedMC)

2. **Page Object Model**
   - `pages/AdvancedMC/BoardBotPage.ts` - Reusable BoardBot interactions
   - Clean separation of test logic and page interactions

3. **Smart Reporting**
   - `utils/ReportGenerator.ts` - Generates formatted reports
   - Validates product categories
   - Highlights warnings for unsuitable products

4. **Automatic Reports**
   - Saved to `test-results/reports/`
   - Markdown format with tables
   - Includes warnings and summary

## 🚀 Running Your First Test

```bash
# Run the test
npm test tests/AdvancedMC/search.spec.ts

# Or run in headed mode to see the browser
npm run test:headed tests/AdvancedMC/search.spec.ts

# Or run in UI mode for interactive testing
npm run test:ui
```

## 📊 What the Test Does

1. Goes to PICMG homepage
2. Clicks "Member Products"
3. Accepts cookies
4. Asks BoardBot your specific query
5. Waits up to 12 seconds for results
6. Extracts first 5 products with:
   - Product Name
   - Manufacturer
   - Category
   - Subcategory
   - More Info URL
7. Validates all products are "AdvancedMC" category
8. Generates a detailed report with warnings

## 📝 Sample Report Output

```
═══════════════════════════════════════════════════════════════
                        TEST REPORT
═══════════════════════════════════════════════════════════════

📝 Prompt: Hi, I need an AdvancedMC processor board...

📊 Summary:
   • Total Results: 5
   • ✅ Suitable Products (AdvancedMC): 5
   • ⚠️  Unsuitable Products: 0

📦 Product Details:
────────────────────────────────────────────────────────────────
| # | Product Name | Manufacturer | Category | Subcategory |...
────────────────────────────────────────────────────────────────
| 1 | CONGA-TC97   | Kontron      | Advanced... | Processor  |...
...
```

## 🔧 Next Steps

### To add more test cases:

Open `tests/AdvancedMC/search.spec.ts` and add:

```typescript
test('TC2: Different search query', async ({ page }) => {
  const searchPrompt = 'Your new search query';
  // ... follow same pattern
});
```

### To adjust selectors:

If product extraction fails, update selectors in:
`pages/AdvancedMC/BoardBotPage.ts` → `extractProductInfo()` method

## ⚠️ Important Notes

- **First run**: The test might need selector adjustments based on actual HTML
- **Reports**: Check `test-results/reports/` folder after each run
- **Warnings**: Any non-AdvancedMC products will be highlighted
- **Debug**: Use `npm run test:debug` to step through the test

## 🐛 Troubleshooting

**Issue**: Test can't find products
- Run in headed mode to see what's happening
- Check console output for extraction attempts
- Update selectors in BoardBotPage.ts

**Issue**: Category validation fails
- Check the report for actual category values
- Verify expected category name matches the site

**Issue**: Timeout waiting for results
- Increase timeout in `waitForResults(12000)` call
- Check if BoardBot responds differently
