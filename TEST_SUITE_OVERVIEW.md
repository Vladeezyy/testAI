# 📋 Test Suite Overview - 3 AdvancedMC Tests

## ✅ Created 3 Separate Test Files

Your test suite now has **3 different test cases**, each with unique search prompts, all expecting **AdvancedMC category** products.

---

## 📁 Test Files

### **Test 1:** `advancedmc-test1.spec.ts`
**File:** `tests/AdvancedMC/advancedmc-test1.spec.ts`

**Test Case:** TC1: Search for AdvancedMC processor board with 6-core Intel Xeon

**Search Prompt:**
```
Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon 
(around 2.8GHz base) for high-performance applications. Prefer something 
that can work with PCIe or RapidIO fabrics.
```

**Requirements:**
- 6-core Intel Xeon processor
- ~2.8GHz base frequency
- PCIe or RapidIO fabric support

**Original Product:**
- URL slug: `am-c8x-msd-amc-processor`
- Tracks if this specific product is found
- **Same for all 3 tests** ⭐

---

### **Test 2:** `advancedmc-test2.spec.ts`
**File:** `tests/AdvancedMC/advancedmc-test2.spec.ts`

**Test Case:** TC2: Search for AdvancedMC Xeon-based CPU board with ECC DDR4 and 10G Ethernet

**Search Prompt:**
```
Do you have an AdvancedMC Xeon-based CPU board for high-performance 
workloads, with ECC DDR4 memory (about 16GB) and improved Ethernet 
via 10G backplane support?
```

**Requirements:**
- Xeon-based CPU
- ECC DDR4 memory (~16GB)
- 10G backplane Ethernet support

**Original Product:**
- URL slug: `am-c8x-msd-amc-processor` ⭐
- **Same as Test 1**

**Tags:**
- `Xeon`, `ECC-DDR4`, `10G-Ethernet`

---

### **Test 3:** `advancedmc-test3.spec.ts`
**File:** `tests/AdvancedMC/advancedmc-test3.spec.ts`

**Test Case:** TC3: Search for AdvancedMC board with Intel Xeon E-2276ME and flexible fabric options

**Search Prompt:**
```
Looking for an AdvancedMC board built on Intel Xeon E-2276ME (6 cores). 
It should be suitable for high-performance computing and offer flexible 
fabric options like PCI Express or RapidIO.
```

**Requirements:**
- Intel Xeon E-2276ME (6 cores)
- High-performance computing
- Flexible fabric: PCIe or RapidIO

**Original Product:**
- URL slug: `am-c8x-msd-amc-processor` ⭐
- **Same as Test 1**

**Tags:**
- `Xeon-E-2276ME`, `PCIe`, `RapidIO`

---

## 🎯 Common Features

All 3 tests share:

### ✅ **Same Test Flow:**
1. Navigate to PICMG homepage
2. Accept cookies
3. Click Member Products
4. Submit search query
5. Measure response latency
6. Take screenshot
7. Extract product info (with URL scraping)
8. Generate reports
9. Validate categories
10. Attach video

### ✅ **Same Expected Category:**
- All expect: `AdvancedMC`
- Unsuitable products flagged with warnings

### ✅ **Same Features:**
- ⏱️ Response latency tracking
- 🔗 Automatic URL extraction
- 📊 Highlighted summaries
- ⭐ Original product tracking (Test 1 only)
- 📝 Markdown & table reports
- 🎥 Video recordings
- 📸 Screenshots

### ✅ **Same Report Structure:**
- Performance metrics
- Search query
- Requirements breakdown
- Results summary
- Product details with links
- Warnings for unsuitable products

---

## 🗂️ File Structure

```
tests/AdvancedMC/
├── advancedmc-test1.spec.ts  ← Test 1 (6-core Xeon)
├── advancedmc-test2.spec.ts  ← Test 2 (ECC DDR4 + 10G Ethernet)
└── advancedmc-test3.spec.ts  ← Test 3 (Xeon E-2276ME)
```

---

## 🚀 Running Tests

### **Run All 3 Tests:**
```bash
npm test tests/AdvancedMC/
```

### **Run Individual Tests:**
```bash
# Test 1
npm test tests/AdvancedMC/advancedmc-test1.spec.ts

# Test 2
npm test tests/AdvancedMC/advancedmc-test2.spec.ts

# Test 3
npm test tests/AdvancedMC/advancedmc-test3.spec.ts
```

### **Generate Reports:**
```bash
npm run report:allure
```

---

## 📊 Report Examples

### **Test 1 Report:**
```markdown
# TEST RESULTS SUMMARY - TC1

## ⏱️ Performance Metrics
- Response Latency: 10.45s ✅ (Normal)

## 📝 Search Query
Hi, I need an AdvancedMC processor board with a 6-core Intel Xeon...

## 📊 Results Breakdown
- Total Products Found: 3
- ✅ Suitable Products (AdvancedMC): 1
- ⚠️ Unsuitable Products: 2
- ⭐ Original Product Found: Yes (Product #2)
```

### **Test 2 Report:**
```markdown
# TEST RESULTS SUMMARY - TC2

## 🎯 Search Requirements
- CPU: Xeon-based
- Memory: ECC DDR4 (~16GB)
- Networking: 10G backplane Ethernet

## 📊 Results Breakdown
- Total Products Found: 2
- ✅ Suitable Products (AdvancedMC): 2
- ⚠️ Unsuitable Products: 0
```

### **Test 3 Report:**
```markdown
# TEST RESULTS SUMMARY - TC3

## 🎯 Search Requirements
- Processor: Intel Xeon E-2276ME (6 cores)
- Purpose: High-performance computing
- Fabric Options: PCI Express or RapidIO

## 📊 Results Breakdown
- Total Products Found: 3
- ✅ Suitable Products (AdvancedMC): 3
- ⚠️ Unsuitable Products: 0
```

---

## 🏷️ Allure Tags

Each test has unique tags for filtering:

### **Test 1:**
- `AdvancedMC`, `BoardBot`, `Search`

### **Test 2:**
- `AdvancedMC`, `BoardBot`, `Search`
- `Xeon`, `ECC-DDR4`, `10G-Ethernet`

### **Test 3:**
- `AdvancedMC`, `BoardBot`, `Search`
- `Xeon-E-2276ME`, `PCIe`, `RapidIO`

**Filter in Allure by tag:**
```
tag:ECC-DDR4  → Shows Test 2
tag:RapidIO   → Shows Test 1 & 3
tag:Xeon      → Shows all 3
```

---

## 📈 Test Comparison

| Feature | Test 1 | Test 2 | Test 3 |
|---------|--------|--------|--------|
| **Focus** | 6-core Xeon | ECC DDR4 + 10G Ethernet | Xeon E-2276ME |
| **Original Product** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Original URL** | am-c8x-msd-amc-processor | am-c8x-msd-amc-processor | am-c8x-msd-amc-processor |
| **Memory Req** | - | ECC DDR4 (~16GB) | - |
| **Network Req** | - | 10G Ethernet | - |
| **Processor Req** | 6-core Xeon (~2.8GHz) | Xeon-based | Xeon E-2276ME (6 cores) |
| **Fabric Options** | PCIe/RapidIO | - | PCIe/RapidIO |

---

## 💡 Use Cases

### **Test 1:** Specific Product Search
- Looking for exact processor specs
- Has original product to compare against
- Validates BoardBot finds the right product
- **Tests if AM-C8X is found** ⭐

### **Test 2:** Requirements-Based Search
- Focuses on memory and networking
- Tests BoardBot's understanding of technical specs
- **Also tracks if AM-C8X is found** ⭐
- Validates ECC DDR4 and 10G Ethernet matching

### **Test 3:** Processor Model Search
- Specific CPU model (E-2276ME)
- Tests exact model matching
- **Also tracks if AM-C8X is found** ⭐
- Validates fabric options understanding

---

## 🎯 All Tests Validate

1. ✅ **Category:** All products must be AdvancedMC
2. ✅ **Latency:** Response time tracking
3. ✅ **URLs:** Real product links extracted
4. ✅ **Reports:** Complete documentation
5. ✅ **Warnings:** Unsuitable products flagged

---

## 📦 Generated Reports

Each test creates:

```
test-results/reports/
├── AdvancedMC_TC1_2024-12-22T17-20-00.md
├── AdvancedMC_TC2_2024-12-22T17-25-00.md
└── AdvancedMC_TC3_2024-12-22T17-30-00.md
```

**Plus Allure report with:**
- All 3 tests organized by suite
- Filterable by tags
- Complete with videos, screenshots
- Clickable product links

---

## 🎨 Visual Test Flow

```
╔═══════════════════════════════════════╗
║        Test Suite Structure           ║
╠═══════════════════════════════════════╣
║                                       ║
║  📁 AdvancedMC/                      ║
║   ├── Test 1: 6-core Xeon           ║
║   │   └── Prompt 1 → Results        ║
║   │                                  ║
║   ├── Test 2: ECC DDR4 + 10G        ║
║   │   └── Prompt 2 → Results        ║
║   │                                  ║
║   └── Test 3: Xeon E-2276ME         ║
║       └── Prompt 3 → Results        ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## ✅ Summary

You now have:
- ✅ **3 separate test files**
- ✅ **3 unique search prompts**
- ✅ **All expect AdvancedMC category**
- ✅ **Complete test coverage**
- ✅ **Individual & combined execution**
- ✅ **Comprehensive reports**
- ✅ **Allure integration**

**Run all 3 tests to validate BoardBot's AdvancedMC search accuracy across different query types!** 🎉

---

## 🚀 Quick Start

```bash
# Run all 3 tests
npm test tests/AdvancedMC/

# View results
npm run report:allure
```

**Your AdvancedMC test suite is complete!** ✨
