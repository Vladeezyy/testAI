# 📸 Screenshots & Videos Guide

## Overview
This project automatically captures screenshots and videos for failed tests and attaches them to the Allure report.

## Configuration

### Playwright Config (`playwright.config.ts`)
```typescript
use: {
  trace: 'retain-on-failure',      // Keep traces for failed tests
  screenshot: 'only-on-failure',   // Screenshots on failure
  video: 'retain-on-failure',      // Keep videos only for failed tests
}
```

### What Gets Captured

#### On Test Failure:
1. **📸 Screenshots**
   - Full page screenshot automatically captured
   - Attached to Allure report as "💥 Failure Screenshot"
   - Saved in `test-results/` directory

2. **🎥 Videos**
   - Full test execution video
   - Only kept for failed tests (saves space)
   - Automatically attached to Allure report
   - Format: WebM
   - Saved in `test-results/` directory

3. **🔍 Trace Files**
   - Playwright trace with timeline, network, console
   - Can be opened with `npx playwright show-trace trace.zip`
   - Saved in `test-results/` directory

4. **📄 HTML Snapshot**
   - Complete page HTML at time of failure
   - Attached to Allure report
   - Useful for debugging dynamic content

5. **📋 Console Logs**
   - Browser console output
   - Attached to Allure report

#### On Test Success:
- Screenshots taken during test steps (e.g., "Search Results Page")
- No failure artifacts saved (keeps storage clean)

## How It Works

### Automatic Failure Capture
The `fixtures.ts` file extends Playwright's test fixture to automatically capture artifacts on failure:

```typescript
// tests/common/fixtures.ts
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);
    
    if (testInfo.status !== testInfo.expectedStatus) {
      // Capture screenshot
      // Capture video path
      // Capture HTML
      // Capture console logs
    }
  },
});
```

### Manual Screenshots in Tests
You can also take screenshots manually during test execution:

```typescript
// In test
const screenshot = await page.screenshot({ 
  fullPage: true,
  type: 'png'
});
await attachment('Custom Screenshot', screenshot, { 
  contentType: 'image/png',
  fileExtension: '.png'
});
```

## Viewing Artifacts

### Locally
1. After test run, check `test-results/` directory
2. View Allure report: `npm run report:allure`
3. View Playwright trace: `npx playwright show-trace test-results/[test-name]/trace.zip`

### In GitHub Actions
1. Go to Actions tab in GitHub
2. Click on the workflow run
3. Download artifacts:
   - `test-results-[run-number]` - Full test results
   - `failure-artifacts-[run-number]` - Screenshots, videos, traces (only if tests failed)
4. View in Allure report deployed to GitHub Pages

## File Locations

```
test-results/
├── artifacts/                    # Test artifacts
│   └── [test-name]/
│       ├── video.webm           # Video recording
│       ├── trace.zip            # Playwright trace
│       └── screenshot-*.png     # Screenshots
├── reports/                      # Generated reports
│   └── [timestamp].md
└── html-report/                  # Playwright HTML report

allure-results/                   # Allure raw data
├── [test-uuid]-attachment.png   # Screenshots
├── [test-uuid]-attachment.webm  # Videos
└── [test-uuid]-result.json      # Test results
```

## Best Practices

1. **Storage Management**
   - Videos are only kept for failed tests
   - Old reports are automatically cleaned (keeps last 100)
   - GitHub Actions retains artifacts for 30 days

2. **Screenshot Quality**
   - Full HD viewport (1920x1080) for consistency
   - Full page screenshots capture scrollable content
   - PNG format for lossless quality

3. **Video Performance**
   - Videos add ~5-10 seconds per test
   - Only recorded for failed tests to save time
   - WebM format for good compression

4. **Debugging Failed Tests**
   - First check screenshot to see what was visible
   - Watch video to see interaction flow
   - Open trace file for detailed timeline
   - Check HTML snapshot for DOM state
   - Review console logs for errors

## Troubleshooting

### No screenshots appearing?
- Check that test actually failed
- Verify `screenshot: 'only-on-failure'` in config
- Check `test-results/` directory exists
- Ensure Allure report is generated after tests

### No videos appearing?
- Verify `video: 'retain-on-failure'` in config
- Videos only saved for failed tests
- Check `test-results/[test-name]/video.webm`
- Ensure browser supports video recording

### Videos not in Allure report?
- Allure-Playwright automatically attaches videos
- Make sure you're using allure-playwright reporter
- Check `allure-results/` for video attachments
- Regenerate Allure report: `npm run report:allure:generate`

### Large artifact sizes in GitHub?
- Videos are compressed (WebM format)
- Only failed tests keep videos
- 30-day retention automatically cleans old artifacts
- Consider reducing viewport size if still too large

## Custom Configuration

### Enable videos for all tests (not recommended):
```typescript
// playwright.config.ts
video: 'on'  // or 'retain-on-failure'
```

### Enable screenshots for all tests:
```typescript
// playwright.config.ts
screenshot: 'on'  // or 'only-on-failure'
```

### Change video size/quality:
```typescript
// playwright.config.ts
use: {
  video: {
    mode: 'retain-on-failure',
    size: { width: 1280, height: 720 }  // Smaller = faster/smaller files
  }
}
```

## Related Documentation
- [Playwright Screenshots](https://playwright.dev/docs/screenshots)
- [Playwright Videos](https://playwright.dev/docs/videos)
- [Playwright Traces](https://playwright.dev/docs/trace-viewer)
- [Allure Attachments](https://docs.qameta.io/allure-report/)
