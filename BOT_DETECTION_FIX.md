# Bot Detection Issue & Solution

## 🚨 Problem Discovered

The PICMG website uses **CleanTalk Bot Detector** to prevent automated bots from accessing the site.

**Evidence:**
```
API error: 4 - Not stored @ https://fd.cleantalk.org/1.1.58/ct-bot-detector.min.js
```

This anti-bot service was detecting Playwright and **blocking the BoardBot API calls**, which is why results weren't appearing.

## ✅ Solutions Implemented

### 1. **Realistic User Agent**
Added a real Chrome user agent string to appear as a legitimate browser:
```typescript
userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...'
```

### 2. **HTTP Headers**
Added standard browser headers:
```typescript
extraHTTPHeaders: {
  'Accept-Language': 'en-US,en;q=0.9',
}
```

### 3. **Human-Like Typing**
Changed from instant `fill()` to character-by-character typing:
```typescript
await input.pressSequentially(text, { delay: 50 }); // 50ms per character
```

### 4. **Random Delays**
Added delays between actions to simulate human behavior:
- 1000ms before accepting cookies
- 500ms before clicking input
- 300ms after clicking input
- 500ms before submitting query

### 5. **Natural Interaction Flow**
```
Wait → Click → Wait → Type slowly → Wait → Submit
```

## 🎯 Expected Behavior Now

With these changes, Playwright should:
1. ✅ Appear as a real Chrome browser
2. ✅ Type like a human user
3. ✅ Not trigger CleanTalk bot detection
4. ✅ Successfully get BoardBot responses

## 🧪 Testing

Run the test again:
```bash
npm test tests/AdvancedMC/search.spec.ts
```

**Watch for:**
- No more "API error: 4" in console
- Results table appears after query
- Products are extracted successfully

## 📝 Notes

- **Typing is slower** - Query takes ~10 seconds to type (200 characters × 50ms)
- **Total time increased** - More delays = longer test execution
- **More reliable** - Better chance of bypassing bot detection

## 🔧 If Still Blocked

If CleanTalk still detects the bot, we can:
1. Add more random delays
2. Add mouse movement simulation
3. Try different user agents
4. Add browser fingerprinting evasion
5. Consider using slower typing speed (100ms per char)
