import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
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
      environmentInfo: {
        'Test Environment': 'Production',
        'Browser': 'Chromium',
        'OS': 'Windows'
      }
    }]
  ],

  use: {
    baseURL:'https://www.picmg.org/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',  // Record video for ALL tests
    headless: false,
    viewport: { width: 1920, height: 1080 },
    
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
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        
        // Launch options to avoid detection
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        },
      } 
    },
   // { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    //{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
