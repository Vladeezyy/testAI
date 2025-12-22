# Allure Report Setup Guide

## 🎯 What is Allure?

Allure is a beautiful, interactive test reporting framework that creates detailed HTML reports with:
- 📊 Charts and graphs
- 📸 Screenshots
- 📝 Test steps and logs
- 🏷️ Categories and tags
- 📈 Historical trends
- 🌐 GitHub Pages compatible

## 📦 Installation

Run this command to install Allure dependencies:

```bash
npm install
```

This will install:
- `allure-playwright` - Playwright integration
- `allure-commandline` - CLI tool to generate reports

## 🚀 Usage

### 1. Run Tests (Generates Allure Data)
```bash
npm test tests/AdvancedMC/search.spec.ts
```

This creates raw data in `allure-results/` folder.

### 2. Generate and Open Allure Report
```bash
npm run report:allure
```

This will:
1. Generate HTML report from `allure-results/`
2. Save to `allure-report/` folder
3. Open the report in your browser automatically

### Alternative Commands:

**Just generate (don't open):**
```bash
npm run report:allure:generate
```

**Open existing report:**
```bash
npm run report:allure:open
```

## 📊 What You'll See in Allure Report

### Overview Dashboard
- Total tests run
- Pass/Fail statistics
- Duration charts
- Trend graphs

### Detailed Test View
- Step-by-step execution
- Screenshots at each step
- Product data extracted
- Category validation results
- Warnings for unsuitable products

### Attachments
- Full page screenshots
- Markdown reports
- Product details
- Console logs

### Categories
- Epic: Product Search
- Feature: BoardBot Search
- Story: AdvancedMC Processor Board Search
- Tags: AdvancedMC, BoardBot, Search

## 🌐 Publishing to GitHub Pages

### Option 1: Manual Publish

1. **Generate report:**
   ```bash
   npm run report:allure:generate
   ```

2. **Copy to docs folder:**
   ```bash
   mkdir docs
   xcopy /E /I allure-report docs
   ```

3. **Commit and push:**
   ```bash
   git add docs/
   git commit -m "Add Allure report"
   git push
   ```

4. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: /docs
   - Save

5. **Access report:**
   ```
   https://vladeezyy.github.io/testAI/
   ```

### Option 2: Automated with GitHub Actions (Recommended)

I can set this up for you - it will automatically publish reports after each test run!

## 📁 Folder Structure

```
testAI/
├── allure-results/      # Raw test data (generated during test run)
├── allure-report/       # HTML report (generated from allure-results)
├── test-results/
│   └── reports/         # Custom markdown reports (still generated)
└── docs/                # Published to GitHub Pages (optional)
```

## 🎨 Allure Features in Your Tests

Your tests now include:

- **Epic/Feature/Story** - Organizes tests hierarchically
- **Severity** - Marks test importance (critical, normal, minor)
- **Tags** - For filtering and grouping
- **Parameters** - Shows test inputs (search query, max products, etc.)
- **Steps** - Detailed execution flow
- **Attachments** - Screenshots, reports, product data
- **Warnings** - Category mismatches shown as issues

## 🔧 Customization

### Change Environment Info
Edit `playwright.config.ts`:
```typescript
environmentInfo: {
  'Test Environment': 'Production',
  'Browser': 'Chromium',
  'OS': 'Windows'
}
```

### Add More Metadata
In your tests:
```typescript
await allure.tag('YourTag');
await allure.severity('blocker'); // blocker, critical, normal, minor, trivial
await allure.owner('Your Name');
await allure.link('https://jira.example.com/TASK-123', 'Related Ticket');
```

## 📸 Screenshots

Allure automatically captures:
- Full page screenshot after search
- Screenshots on test failure
- Custom attachments you add

## 🆚 Comparison: Markdown vs Allure

### Markdown Reports (still generated)
✅ Simple text files
✅ Easy to read in any editor
✅ Good for quick checks
✅ Stored in `test-results/reports/`

### Allure Reports (new!)
✅ Beautiful interactive UI
✅ Charts and visualizations
✅ Historical trends
✅ Screenshots embedded
✅ Better for presentations
✅ GitHub Pages compatible

**Both are generated automatically!** Use whichever suits your needs.

## 🐛 Troubleshooting

**Issue: Command 'allure' not found**
```bash
npm install
```

**Issue: Report doesn't open**
```bash
# Generate first
npm run report:allure:generate

# Then open
npm run report:allure:open
```

**Issue: Old data in report**
```bash
# Clear results and regenerate
rmdir /S /Q allure-results
npm test
npm run report:allure
```

## 📚 Learn More

- [Allure Documentation](https://docs.qameta.io/allure/)
- [Allure Playwright Integration](https://www.npmjs.com/package/allure-playwright)
- [Example Reports](https://demo.qameta.io/allure/)
