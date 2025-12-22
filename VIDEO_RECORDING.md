# 🎥 Video Recording for Tests

## ✅ Video Recording Enabled!

All tests now record full video of the entire test execution!

## 📹 Configuration

### Playwright Config
```typescript
video: 'on'  // Records video for ALL tests
```

### Options Available:
- `'on'` - Record video for all tests ✅ **(Current)**
- `'off'` - No video recording
- `'retain-on-failure'` - Only keep videos for failed tests
- `'on-first-retry'` - Only record on retry attempts

## 📁 Video Location

Videos are saved in:
```
test-results/artifacts/
└── <test-name>-<browser>/
    └── video.webm
```

Example:
```
test-results/artifacts/
└── AdvancedMC-search-chromium/
    └── video.webm
```

## 🎬 What Gets Recorded

✅ **Entire test execution:**
- Page navigation
- Cookie acceptance
- Clicking Member Products
- Typing search query (slow, human-like)
- Waiting for results
- Results appearing
- Product extraction
- Everything!

✅ **Full HD Quality:**
- 1920x1080 resolution
- WebM format (widely supported)
- Smooth playback

## 📊 Allure Report Integration

Videos are **automatically attached** to the Allure report!

### In Allure Report:
1. Open test details
2. Scroll to "Attachments" section
3. Click "Test Execution Video"
4. Watch the full test execution!

### What You'll See:
- 🎥 Video player embedded in report
- ⏯️ Play/pause controls
- ⏩ Seek through timeline
- 🔊 No audio (just visual)
- 📱 Works in any browser

## 💾 File Size

**Approximate sizes:**
- Short test (30 seconds): ~2-5 MB
- Medium test (1-2 minutes): ~5-10 MB
- Long test (5+ minutes): ~15-30 MB

**Note:** Videos are compressed WebM format for efficiency.

## 🚀 Usage

### Run Test with Video
```bash
npm test tests/AdvancedMC/search.spec.ts
```

### View Video in Allure Report
```bash
npm run report:allure
```

### Access Video Directly
Navigate to:
```
test-results/artifacts/<test-folder>/video.webm
```

Open with any video player or browser.

## 🌐 GitHub Pages

Videos are **included in published reports!**

When you publish to GitHub Pages:
- ✅ Videos are embedded in Allure report
- ✅ Playable directly in browser
- ✅ No external hosting needed
- ✅ Shareable with team

## 🎯 Benefits

### For Debugging:
- 🔍 See exactly what happened
- 🐛 Identify where tests fail
- ⏱️ Check timing issues
- 🤖 Verify bot detection bypassed

### For Documentation:
- 📚 Show how features work
- 👥 Train team members
- 📊 Present to stakeholders
- ✅ Prove test coverage

### For CI/CD:
- 🔄 Debug remote test failures
- 📈 Track test behavior over time
- 🚨 Review failed test runs
- ✅ Verify environment issues

## ⚙️ Customization

### Change Video Quality
Edit `playwright.config.ts`:
```typescript
use: {
  video: {
    mode: 'on',
    size: { width: 1920, height: 1080 }  // Full HD
  }
}
```

### Different Sizes:
```typescript
// HD
size: { width: 1280, height: 720 }

// Full HD (current)
size: { width: 1920, height: 1080 }

// 4K (large files!)
size: { width: 3840, height: 2160 }
```

### Record Only Failures
Edit `playwright.config.ts`:
```typescript
video: 'retain-on-failure'
```

## 🗑️ Cleanup

Videos are stored in `test-results/artifacts/` which is:
- ✅ Gitignored (not committed)
- ✅ Cleaned by Playwright automatically
- ✅ Kept for 30 days in GitHub Actions

### Manual Cleanup:
```bash
# Delete all test artifacts including videos
rmdir /S /Q test-results
```

## 🔧 Troubleshooting

### Issue: Video not appearing in Allure
**Solution:** Make sure test completes fully. Video is saved at the end.

### Issue: Video file is huge
**Solution:** 
1. Reduce test duration
2. Use lower resolution
3. Use `retain-on-failure` mode

### Issue: Can't play video
**Solution:** 
- Use Chrome, Firefox, or Edge browser
- WebM format is widely supported
- Alternatively, download and use VLC player

## 📸 Screenshots vs Video

### Screenshots (Still Images):
- ✅ Smaller file size
- ✅ Quick to review
- ✅ Good for specific moments
- ❌ No motion/animation

### Videos (Full Recording):
- ✅ Complete execution flow
- ✅ Shows timing and behavior
- ✅ Better for debugging
- ❌ Larger file size

**Current Setup:** Both are generated! 
- Screenshots: On failure
- Videos: Always recorded

## 🎬 Video Recording Flow

```
Test Starts
    ↓
Recording Begins (video starts)
    ↓
Test Executes (all steps recorded)
    ↓
Test Completes
    ↓
Video Saved to artifacts folder
    ↓
Video Attached to Allure Report
    ↓
View in Browser! 🎉
```

## 📊 What's in the Video

Your AdvancedMC test video shows:

1. **Homepage Loading** (0:00-0:02)
2. **Cookie Banner Acceptance** (0:02-0:04)
3. **Member Products Click** (0:04-0:06)
4. **Slow Typing of Query** (0:06-0:16) ⏱️
5. **Click Ask Button** (0:16-0:17)
6. **Waiting for Results** (0:17-0:37)
7. **Results Appearing** (0:37-0:40)
8. **Product Extraction** (0:40-0:45)

**Total Duration:** ~45 seconds - 1 minute

## 🌟 Pro Tips

1. **Watch at 2x speed** in video player for quick review
2. **Pause at key moments** to analyze specific steps
3. **Share timestamp links** to point out specific issues
4. **Compare videos** between test runs to spot differences
5. **Use for training** - shows exactly how tests work!

---

**Your tests now have full video recording! 🎥**

Run a test and check it out:
```bash
npm test tests/AdvancedMC/search.spec.ts
npm run report:allure
```

Look for "Test Execution Video" in the attachments! 🎬
