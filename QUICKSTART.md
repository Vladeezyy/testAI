# 🚀 Quick Start Guide - Enable Screenshots & Videos

## ✅ What Has Been Done

All the necessary files have been created and updated:

1. ✅ **playwright.config.ts** - Updated with video and trace settings
2. ✅ **tests/common/fixtures.ts** - NEW file with automatic failure capture
3. ✅ **tests/common/TestBase.ts** - Enhanced screenshot handling
4. ✅ **.github/workflows/playwright-allure.yml** - Updated for artifacts
5. ✅ **docs/SCREENSHOTS_VIDEOS.md** - Complete documentation
6. ✅ **utils/updateTestFixtures.js** - Script to update test files
7. ✅ **package.json** - Added `update:fixtures` command
8. ✅ **tests/AdvancedMC/advancedmc-1.1.spec.ts** - Already updated as example

## 🎯 What You Need to Do

### Option 1: Manual Update (Recommended for Understanding)

Update the first line of each test file from:
```typescript
import { test, expect } from '@playwright/test';
```

To:
```typescript
import { test, expect } from '../common/fixtures';
```

**Files to update (38 remaining):**
- tests/AdvancedMC/advancedmc-1.2.spec.ts
- tests/AdvancedMC/advancedmc-1.3.spec.ts
- tests/AdvancedMC/advancedmc-2.1.spec.ts
- tests/AdvancedMC/advancedmc-2.2.spec.ts
- tests/AdvancedMC/advancedmc-2.3.spec.ts
- tests/AdvancedMC/advancedmc-3.1.spec.ts
- tests/AdvancedMC/advancedmc-3.2.spec.ts
- tests/AdvancedMC/advancedmc-3.3.spec.ts
- tests/AdvancedTCA/advancedtca-1.1.spec.ts through advancedtca-3.3.spec.ts (9 files)
- tests/COM-HPC/com-hpc-1.1.spec.ts through com-hpc-1.3.spec.ts (3 files)
- tests/CompactPCI/compactpci-1.1.spec.ts through compactpci-3.3.spec.ts (9 files)
- tests/MicroTCA/microtca-1.1.spec.ts through microtca-3.3.spec.ts (9 files)

### Option 2: Automated Update

Run this command in your terminal:
```bash
npm run update:fixtures
```

This will automatically update all test files.

### Option 3: Use Find & Replace in VS Code

1. Open VS Code
2. Press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows/Linux)
3. **Find:** `import { test, expect } from '@playwright/test';`
4. **Replace:** `import { test, expect } from '../common/fixtures';`
5. **Files to include:** `tests/**/*.spec.ts`
6. Click "Replace All"

## 🧪 Test It Works

### 1. Run a Single Test
```bash
npx playwright test tests/AdvancedMC/advancedmc-1.1.spec.ts
```

### 2. Check for Artifacts
If test failed, check:
```bash
ls -la test-results/
find test-results -name "*.png"
find test-results -name "*.webm"
```

### 3. Generate Allure Report
```bash
npm run report:allure:generate
npm run report:allure:open
```

Look for these in the report:
- 📸 "💥 Failure Screenshot" attachment
- 🎥 Video attachment
- 📄 "💥 Failure Page HTML" attachment

## 📋 Verification Checklist

Run through this checklist:

- [ ] Update all test files (manually or with script)
- [ ] Run tests: `npm test`
- [ ] Check test-results folder exists
- [ ] Generate Allure report: `npm run report:allure:generate`
- [ ] Open Allure report: `npm run report:allure:open`
- [ ] Verify screenshots appear in report
- [ ] Verify videos appear in report (if tests failed)
- [ ] Commit changes: `git add . && git commit -m "Add screenshots and videos for failed tests"`
- [ ] Push to GitHub: `git push`
- [ ] Check GitHub Actions artifacts after next run

## 🎬 What Happens Now

### On Every Test Run:
- Tests execute normally
- Screenshots taken at specific test steps (already working)

### On Test Failure:
- 📸 **Automatic screenshot** captured
- 🎥 **Video** of entire test recorded
- 🔍 **Trace file** created with timeline
- 📄 **HTML snapshot** saved
- 📋 **Console logs** captured
- ✨ **All attached to Allure report**

### In GitHub Actions:
- Full test results uploaded
- Separate failure artifacts uploaded (if tests fail)
- Allure report deployed to GitHub Pages with all attachments

## 📚 Documentation

Full documentation available in:
- `docs/SCREENSHOTS_VIDEOS.md` - Complete guide
- `SCREENSHOTS_IMPLEMENTATION.md` - Implementation summary

## ❓ FAQ

**Q: Do I need to update all test files?**
A: Yes, all test files need to use the new fixtures to get automatic screenshot/video capture.

**Q: Will this slow down my tests?**
A: Videos only recorded for failed tests, so minimal impact on successful runs (~5-10 seconds per failure).

**Q: How much storage will this use?**
A: Videos are compressed WebM (~1-5MB each). Only failed tests keep videos. GitHub Actions cleans after 30 days.

**Q: Can I see screenshots for passing tests?**
A: Yes! Screenshots taken during test steps (like "Search Results Page") are still captured and in the report.

**Q: How do I view trace files?**
A: Run `npx playwright show-trace test-results/[test-name]/trace.zip`

**Q: Where are screenshots saved locally?**
A: In `test-results/artifacts/[test-name]/` directory

**Q: Will this work in GitHub Actions?**
A: Yes! The workflow is already updated to upload all artifacts.

## 🐛 Troubleshooting

**No screenshots appearing?**
1. Make sure test files use new fixtures
2. Check test actually failed
3. Verify `test-results/` directory exists
4. Regenerate Allure report

**No videos appearing?**
1. Videos only for failed tests
2. Check `video: 'retain-on-failure'` in playwright.config.ts
3. Look for .webm files in test-results

**Script won't run?**
```bash
# Make script executable
chmod +x utils/updateTestFixtures.js

# Run directly with node
node utils/updateTestFixtures.js
```

## ✅ Summary

You're all set! Just:
1. Update test files (one of the 3 options above)
2. Run tests to verify
3. Commit and push

Everything else is already configured and ready to go! 🎉

---

**Need help?** Check `docs/SCREENSHOTS_VIDEOS.md` for detailed documentation.
