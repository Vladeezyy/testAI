# ⏱️ Response Latency Tracking

## ✅ Latency Tracking Implemented!

Your tests now track **exactly how long** it takes for BoardBot to respond!

## 📊 What Gets Tracked

### Response Latency
Measures the time from:
- ⏰ **Start:** When "Ask" button is clicked
- ⏰ **End:** When results appear in the table

```
Click "Ask" → [MEASURING...] → Results Appear
     ↓                              ↓
  Start Time                    End Time
                ↓
         Latency = End - Start
```

## 🎯 How It's Displayed

### 1. **Console Output**
```
⏱️  Response Latency: 12.45 seconds
```

### 2. **Allure Parameters** (Quick View)
```
Response Latency: 12.45s
```

### 3. **Performance Label** (For Filtering)
- ⚡ `fast` - Under 5 seconds
- ✅ `normal` - 5-10 seconds  
- ⚠️ `slow` - Over 10 seconds

### 4. **Highlighted Summary Report**
```markdown
# 📈 TEST RESULTS SUMMARY

## ⏱️ Performance Metrics
- Response Latency: 12.45 seconds ✅ (Normal)

## 📝 Search Query
Hi, I need an AdvancedMC processor board...

## 📊 Results Breakdown
- Total Products Found: 3
- ✅ Suitable Products (AdvancedMC): 1
- ⚠️ Unsuitable Products: 2

## ⚠️ Warnings
- Product #1 "CONGA-B7XD" has category "COM Express®"
- Product #3 "MIC-5342" has category "AdvancedTCA"

## 📦 Product Details
### 1. CONGA-B7XD
- Manufacturer: CONGATEC
- Category: COM Express® ⚠️
- Subcategory: COM Express - Type 7, Basic

### 2. AM5030
- Manufacturer: KONTRON
- Category: AdvancedMC ✅
- Subcategory: —

### 3. MIC-5342
- Manufacturer: ADVANTECH
- Category: AdvancedTCA ⚠️
- Subcategory: ATCA Boards - Processors
```

## 📋 Key Metrics Highlighted

All important values are now prominently displayed:

### ✅ **1. Latency (Response Time)**
- Shows performance of BoardBot API
- Helps identify slow responses
- Can track trends over time

### ✅ **2. Used Prompt (Full Query)**
- Complete search query displayed
- Easy to copy and reference
- Formatted for readability

### ✅ **3. Suitable Results**
- Count of correct category matches
- Green checkmark ✅ indicator
- Shows validation success rate

### ✅ **4. Unsuitable Results**
- Count of incorrect categories
- Warning ⚠️ indicator
- Lists specific mismatches

## 🎨 Visual Indicators

### Performance Badges
- ⚡ **Fast** - Response under 5s (excellent!)
- ✅ **Normal** - Response 5-10s (good)
- ⚠️ **Slow** - Response over 10s (needs attention)

### Category Validation
- ✅ **Green check** - Matches expected category
- ⚠️ **Warning** - Different category found

### Emoji Legend
- ⏱️ Performance metrics
- 📝 Search query
- 📊 Results breakdown
- 📦 Product details
- ⚠️ Warnings/issues
- ✅ Success/correct
- ⚡ Fast response

## 📁 Where to Find in Allure

### Main Test View
1. **Parameters Section**
   - `Response Latency: XX.XXs`
   - `Total Products: X`
   - `Suitable Products: X`
   - `Unsuitable Products: X`

2. **Labels Section**
   - `response_speed: fast/normal/slow`

3. **Attachments Section**
   - `📊 Test Results Summary` ← **Main highlight document**
   - Click to view formatted report

### Dashboard View
- Filter by `response_speed` label
- Compare latencies across runs
- Track performance trends

## 📊 Example Reports

### Fast Response (Good!)
```
⏱️ Response Latency: 4.23 seconds ⚡ (Fast)
✅ Suitable Products: 5
⚠️ Unsuitable Products: 0
```

### Normal Response (Expected)
```
⏱️ Response Latency: 8.56 seconds ✅ (Normal)
✅ Suitable Products: 3
⚠️ Unsuitable Products: 2
```

### Slow Response (Attention Needed)
```
⏱️ Response Latency: 15.78 seconds ⚠️ (Slow)
✅ Suitable Products: 2
⚠️ Unsuitable Products: 1
```

## 🔍 Using Latency Data

### Performance Monitoring
Track response times to identify:
- Server slowdowns
- Network issues
- API performance degradation
- Peak usage times

### Filtering in Allure
```
Filter by: response_speed = slow
Result: Shows all slow test runs
Action: Investigate why responses were slow
```

### Trend Analysis
Compare latency across:
- Different times of day
- Different environments
- Before/after changes
- Over weeks/months

## 📈 Benefits

### For QA:
- ✅ Track API performance
- ✅ Identify bottlenecks
- ✅ Compare test runs
- ✅ Set performance baselines

### For Developers:
- ✅ See actual user experience
- ✅ Measure optimization impact
- ✅ Debug slow responses
- ✅ Performance regression detection

### For Managers:
- ✅ Clear performance metrics
- ✅ Visual indicators (colors/emojis)
- ✅ Easy to understand reports
- ✅ Track improvements over time

## 🎯 Summary

Now every test report includes:

1. ⏱️ **Response Latency** - Exact timing with visual indicator
2. 📝 **Used Prompt** - Full search query formatted nicely
3. ✅ **Suitable Results** - Count with green checkmarks
4. ⚠️ **Unsuitable Results** - Count with warnings
5. 📊 **Highlighted Summary** - All metrics in one place
6. 📦 **Product Details** - With category validation indicators

All key information is **prominently displayed** and **easy to find**! 🎉

## 🚀 Try It Now

```bash
npm test tests/AdvancedMC/search.spec.ts
npm run report:allure
```

Look for:
- Parameters: Response Latency value
- Attachments: 📊 Test Results Summary
- Check the visual indicators!

**Everything you need to know about the test run is now highlighted!** ✨
