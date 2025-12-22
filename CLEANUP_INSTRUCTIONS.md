# CLEANUP INSTRUCTIONS

## Files to Delete Manually:

### Test Files (in /tests):
- ❌ saucedemo.spec.js
- ❌ saucedemo-pom.spec.js
- ❌ test.js

### Page Objects (in /pages):
- ❌ LoginPage.js
- ❌ InventoryPage.js
- ❌ CartPage.js
- ❌ CheckoutPage.js

### Utils (in /utils):
- ❌ testData.js

### Documentation:
- ❌ TEST_SUMMARY.md (optional)
- ❌ QUICK_START.md (optional)
- ❌ README.md (optional - you may want to keep and update)

## Commands to Delete All SauceDemo Files:

```bash
# Navigate to project directory
cd /Users/vladyslavbilous/Desktop/testAI

# Remove test files
rm tests/saucedemo.spec.js
rm tests/saucedemo-pom.spec.js
rm tests/test.js

# Remove page objects
rm pages/LoginPage.js
rm pages/InventoryPage.js
rm pages/CartPage.js
rm pages/CheckoutPage.js

# Remove utils
rm utils/testData.js

# Optional - remove documentation
rm TEST_SUMMARY.md
rm QUICK_START.md
# rm README.md  # Keep if you want to update it
```

## What's Left:
- ✅ playwright.config.js (updated, baseURL removed)
- ✅ package.json
- ✅ .gitignore
- ✅ .github/workflows/playwright.yml
- ✅ Empty tests/ folder
- ✅ Empty pages/ folder
- ✅ Empty utils/ folder

Ready for new site automation! 🚀
