import { test as base } from '@playwright/test';
import { attachment } from 'allure-js-commons';

/**
 * Extended test fixture that automatically captures screenshots and videos on failure
 * and attaches them to the Allure report
 */
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    // Use the page
    await use(page);
    
    // After test completes, check if it failed
    if (testInfo.status !== testInfo.expectedStatus) {
      // Test failed - capture screenshot
      try {
        const screenshot = await page.screenshot({ 
          fullPage: true,
          type: 'png'
        });
        await attachment('💥 Failure Screenshot', screenshot, { 
          contentType: 'image/png',
          fileExtension: '.png'
        });
        console.log('📸 Failure screenshot captured and attached to report');
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      }
      
      // Attach video if available
      const video = page.video();
      if (video) {
        try {
          const videoPath = await video.path();
          console.log('🎥 Video recorded at:', videoPath);
          
          // The video will be automatically attached by Playwright's Allure reporter
          // We just log the path for debugging
        } catch (error) {
          console.error('Failed to get video path:', error);
        }
      }
      
      // Attach page HTML for debugging
      try {
        const html = await page.content();
        await attachment('💥 Failure Page HTML', html, { 
          contentType: 'text/html',
          fileExtension: '.html'
        });
      } catch (error) {
        console.error('Failed to capture HTML:', error);
      }
      
      // Attach console logs
      try {
        const logs = testInfo.attachments
          .filter(a => a.name.includes('log') || a.name.includes('console'))
          .map(a => a.name)
          .join('\n');
        if (logs) {
          await attachment('💥 Console Logs', logs, { 
            contentType: 'text/plain'
          });
        }
      } catch (error) {
        console.error('Failed to attach console logs:', error);
      }
    }
  },
});

export { expect } from '@playwright/test';
