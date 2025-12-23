import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,  // 2 minutes per test
  expect: { timeout: 10_000 },
  
  // Clear output directories before running tests
  outputDir: 'test-results/artifacts',
  
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true,
      categories: [
        {
          name: 'No Products Found',
          matchedStatuses: ['failed'],
          messageRegex: '.*No products found.*'
        },
        {
          name: 'Wrong Category',
          matchedStatuses: ['failed'],
          messageRegex: '.*No suitable products.*'
        },
        {
          name: 'Bot Detection',
          matchedStatuses: ['failed'],
          messageRegex: '.*bot.*detection.*'
        }
      ],
      environmentInfo: {
        'Test Environment': 'Production',
        'Browser': 'Chromium',
        'OS': process.platform,
        'Node Version': process.version,
        'Base URL': 'https://www.picmg.org/'
      }
    }]
  ],

  use: {
    baseURL: 'https://www.picmg.org/',
    trace: 'retain-on-failure',  // Keep traces for failed tests
    screenshot: 'off',  // Disabled - using custom full-page screenshots in fixtures
    video: 'retain-on-failure',  // Keep videos only for failed tests
    headless: true,
    viewport: { width: 1920, height: 1080 },  // Full HD for all tests
    
    // Add more human-like behavior to avoid bot detection
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    
    // Additional anti-detection measures
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  projects: [
    { 
      name: 'chromium', 
      use: { 
        // Launch options to avoid detection
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
            '--window-size=1920,1080',
          ],
        },
      } 
    },
  ],
});
