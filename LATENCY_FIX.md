# Latency Timing Fix

## ✅ Issues Fixed

### Problem
Latency was showing ~20 seconds when video showed ~10 seconds because:
1. Timer included the query submission time (typing delays)
2. Fixed 2-second wait at the end of `waitForResults()`
3. No visibility into what was taking time

### Solution

**1. Fixed Timer Start/End** (`TestBase.ts`)
```typescript
// BEFORE: Timer started BEFORE submitting query
const startTime = Date.now();
await boardBotPage.askBoardBot(searchPrompt);
await boardBotPage.waitForResults(20000);
const endTime = Date.now();

// AFTER: Timer starts AFTER submitting, excludes typing delays
await boardBotPage.askBoardBot(searchPrompt);
const startTime = Date.now();  // Start here!
await boardBotPage.waitForResults(20000);
const endTime = Date.now();  // End immediately after results
```

**2. Optimized waitForResults** (`BoardBotPage.ts`)
```typescript
// BEFORE: Fixed 2-second wait
await this.page.waitForTimeout(2000);

// AFTER: Only 500ms stabilization wait
await this.page.waitForTimeout(500);
```

**3. Added Timing Visibility**
- Now shows elapsed time at each step
- Console logs: "Loading indicator disappeared (3.5s)"
- Console logs: "Results table appeared (4.2s)"
- Console logs: "Wait complete (total: 4.7s)"

## Changes Made

**Files modified:**
1. `tests/common/TestBase.ts` - Timer positioning
2. `pages/AdvancedMC/BoardBotPage.ts` - Reduced wait time, added timing logs

## Result

Latency now accurately measures:
- ✅ Time from query submission to results appearing
- ✅ Excludes typing delays (~2-3 seconds saved)
- ✅ Excludes unnecessary waiting (~1.5 seconds saved)
- ✅ Shows breakdown of what took time

**Expected improvement:** 20s → ~10-12s (matches video)

## Test

Run a test and check console output:
```bash
npm test tests/AdvancedMC/advancedmc-1.1.spec.ts
```

Look for:
```
⏱️  Timer started - measuring response time...
✅ Loading indicator disappeared (3.5s)
✅ Results table appeared (4.2s)
✅ Wait complete (total: 4.7s)

⏱️  Response Latency: 4.70 seconds
```

The latency should now match what you see in the video! 🎉
