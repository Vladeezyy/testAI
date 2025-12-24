import { Page, Locator } from '@playwright/test';

export interface ProductInfo {
  productName: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  moreInfoUrl: string;
}

export class BoardBotPage {
  readonly page: Page;
  readonly memberProductsLink: Locator;
  readonly acceptCookiesButton: Locator;
  readonly chatInput: Locator;
  readonly askButton: Locator;
  readonly minimizeChatButton: Locator;
  readonly resultsTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.memberProductsLink = page.getByRole('link', { name: 'Member Products' });
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept All' });
    this.chatInput = page.getByRole('textbox', { name: /Ask about products/i });
    this.askButton = page.getByRole('button', { name: 'Ask' });
    this.minimizeChatButton = page.getByRole('button', { name: 'Minimize chat' });
    this.resultsTable = page.locator('table').first();
  }

  async navigateToMemberProducts() {
    await this.memberProductsLink.click();
  }

  async acceptCookies() {
    try {
      // Wait a bit before accepting cookies (more human-like)
      await this.page.waitForTimeout(1000);
      await this.acceptCookiesButton.click({ timeout: 5000 });
      // Wait after accepting
      await this.page.waitForTimeout(500);
    } catch {
      // Cookies already accepted or not shown
      console.log('Cookies already accepted or dialog not shown');
    }
  }

  async askBoardBot(query: string) {
    // Add small delay before interacting (more human-like)
    await this.page.waitForTimeout(500);
    
    await this.chatInput.click();
    
    // Add small delay after click
    await this.page.waitForTimeout(300);
    
    // Type slowly like a human (50ms per character)
    await this.chatInput.fill('', { timeout: 100 }); // Clear first
    await this.chatInput.pressSequentially(query, { delay: 50 });
    
    // Add delay before clicking Ask button
    await this.page.waitForTimeout(500);
    
    await this.askButton.click();
    console.log('✅ Query submitted to BoardBot');
  }

  async minimizeChat() {
    try {
      await this.minimizeChatButton.click({ timeout: 2000 });
      console.log('✅ Chat minimized');
    } catch {
      console.log('ℹ️  Chat minimize button not found or already minimized');
    }
  }

  async waitForResults(timeoutMs: number = 15000) {
    // Wait for BoardBot to process and display results
    console.log(`⏳ Waiting up to ${timeoutMs/1000} seconds for results...`);
    
    const startWait = Date.now();
    
    // First, wait for the loading indicator to disappear
    try {
      await this.page.locator('img[alt="Loading"]').waitFor({ state: 'hidden', timeout: timeoutMs });
      const elapsed = ((Date.now() - startWait) / 1000).toFixed(2);
      console.log(`✅ Loading indicator disappeared (${elapsed}s)`);
    } catch {
      console.log('ℹ️  Loading indicator not found or still visible');
    }
    
    // Then wait for the results table to appear
    try {
      await this.resultsTable.waitFor({ state: 'visible', timeout: 5000 });
      const elapsed = ((Date.now() - startWait) / 1000).toFixed(2);
      console.log(`✅ Results table appeared (${elapsed}s)`);
    } catch {
      console.log('⚠️  Results table did not appear');
    }
    
    // Small wait for table to stabilize (reduced from 2000ms to 500ms)
    await this.page.waitForTimeout(500);
    
    const totalElapsed = ((Date.now() - startWait) / 1000).toFixed(2);
    console.log(`✅ Wait complete (total: ${totalElapsed}s)`);
  }

  async extractProductInfo(maxProducts: number = 5): Promise<ProductInfo[]> {
    const products: ProductInfo[] = [];
    
    console.log('\n📊 Extracting product information from results table...\n');
    
    try {
      // Check if table exists
      const tableExists = await this.resultsTable.count() > 0;
      if (!tableExists) {
        console.log('⚠️  No results table found');
        return products;
      }

      // Get all rows in tbody (skip header)
      const rows = this.resultsTable.locator('tbody tr');
      const totalRows = await rows.count();
      
      if (totalRows === 0) {
        console.log('⚠️  Results table is empty');
        return products;
      }

      console.log(`📋 Found ${totalRows} products in table`);
      
      const productsToExtract = Math.min(totalRows, maxProducts);
      console.log(`📦 Extracting ${productsToExtract} products (with URLs)...\n`);

      for (let i = 0; i < productsToExtract; i++) {
        const row = rows.nth(i);
        
        try {
          // Get all cells in the row
          const cells = row.locator('td');
          
          // Extract Product Name (cell index 2)
          const productCell = cells.nth(2);
          const productName = await productCell.textContent() || 'N/A';
          
          // Extract Manufacturer (cell index 3)
          const manufacturer = await cells.nth(3).textContent() || 'N/A';
          
          // Extract Category (cell index 4)
          const category = await cells.nth(4).textContent() || 'N/A';
          
          // Extract Subcategory (cell index 5)
          const subcategory = await cells.nth(5).textContent() || 'N/A';
          
          console.log(`🔍 Product ${i + 1}: ${productName.trim()}`);
          
          // Extract More Info URL by clicking the button
          let moreInfoUrl = 'N/A';
          try {
            // Try different cell indices to find the More Info button
            const cellCount = await cells.count();
            console.log(`   📍 Total cells in row: ${cellCount}`);
            
            let buttonFound = false;
            let buttonCell = null;
            
            // Search through cells to find the button
            for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
              const cell = cells.nth(cellIndex);
              const button = cell.locator('button');
              const btnCount = await button.count();
              
              if (btnCount > 0) {
                const btnText = await button.first().textContent();
                console.log(`   📍 Found button in cell ${cellIndex}: "${btnText?.trim()}"`);
                
                if (btnText?.toLowerCase().includes('more') || btnText?.toLowerCase().includes('info')) {
                  buttonCell = button.first();
                  buttonFound = true;
                  console.log(`   ✅ Found More Info button at cell ${cellIndex}`);
                  break;
                }
              }
            }
            
            if (buttonFound && buttonCell) {
              console.log(`   🔗 Clicking More Info to extract URL...`);
              
              const currentUrl = this.page.url();
              console.log(`   📍 Current URL before click: ${currentUrl}`);
              
              // Listen for new page/tab
              const pagePromise = this.page.context().waitForEvent('page');
              
              // Click the button
              await buttonCell.click();
              console.log(`   ⏳ Waiting for new tab to open...`);
              
              try {
                // Wait for new page to open (with timeout)
                const newPage = await pagePromise.catch(() => null);
                
                if (newPage) {
                  // Wait for the new page to load
                  await newPage.waitForLoadState('domcontentloaded', { timeout: 5000 });
                  await newPage.waitForTimeout(1000);
                  
                  // Get the URL from new tab
                  moreInfoUrl = newPage.url();
                  console.log(`   ✅ URL extracted from new tab: ${moreInfoUrl}`);
                  
                  // Close the new tab
                  await newPage.close();
                  console.log(`   ✅ New tab closed, back at results`);
                } else {
                  console.log(`   ⚠️  No new tab opened`);
                }
              } catch (error) {
                console.log(`   ⚠️  Error extracting URL: ${error}`);
              }
            } else {
              console.log(`   ⚠️  More Info button not found`);
            }
          } catch (error) {
            console.log(`   ⚠️  Error extracting URL: ${error}`);
          }

          products.push({
            productName: productName.trim().replace(/\s+/g, ' '),
            manufacturer: manufacturer.trim(),
            category: category.trim(),
            subcategory: subcategory.trim(),
            moreInfoUrl: moreInfoUrl
          });

          console.log(`   ✅ Product ${i + 1} extracted\n`);

        } catch (error) {
          console.error(`   ❌ Error extracting product ${i + 1}:`, error);
        }
      }

      console.log(`✅ Successfully extracted ${products.length} products with URLs\n`);

    } catch (error) {
      console.error('❌ Error during product extraction:', error);
    }

    return products;
  }

  async getProductCount(): Promise<number> {
    try {
      const rows = this.resultsTable.locator('tbody tr');
      return await rows.count();
    } catch {
      return 0;
    }
  }

  async clickPrimaryResults() {
    try {
      const primaryTab = this.page.getByText('Primary Results');
      await primaryTab.click();
      console.log('✅ Clicked Primary Results tab');
    } catch {
      console.log('ℹ️  Primary Results tab not found or already active');
    }
  }

  async clickSecondaryResults() {
    try {
      const secondaryTab = this.page.getByText('Secondary Results');
      await secondaryTab.click();
      console.log('✅ Clicked Secondary Results tab');
    } catch {
      console.log('ℹ️  Secondary Results tab not found');
    }
  }
/**
 * Get product description by clicking More Info button for a specific product
 * @param productIndex - Zero-based index of the product in results table
 * @returns Product description text or empty string if not found
 */
async getProductDescription(productIndex: number): Promise<string> {
  try {
    console.log(`   📖 Getting description for Product ${productIndex + 1}...`);
    
    const rows = this.resultsTable.locator('tbody tr');
    const row = rows.nth(productIndex);
    const cells = row.locator('td');
    
    // Find and click More Info button
    const cellCount = await cells.count();
    let buttonCell = null;
    
    for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
      const cell = cells.nth(cellIndex);
      const button = cell.locator('button');
      const btnCount = await button.count();
      
      if (btnCount > 0) {
        const btnText = await button.first().textContent();
        if (btnText?.toLowerCase().includes('more') || btnText?.toLowerCase().includes('info')) {
          buttonCell = button.first();
          break;
        }
      }
    }
    
    if (!buttonCell) {
      console.log(`   ⚠️  More Info button not found`);
      return '';
    }
    
    // Listen for new page/tab
    const pagePromise = this.page.context().waitForEvent('page');
    await buttonCell.click();
    
    const newPage = await pagePromise;
    await newPage.waitForLoadState('domcontentloaded', { timeout: 10000 });
    await newPage.waitForTimeout(1500);
    
    // Extract all text content from the page
    const bodyText = await newPage.locator('body').textContent() || '';
    
    // Close the modal/page
    await newPage.close();
    await this.page.waitForTimeout(500);
    
    console.log(`   ✅ Description extracted (${bodyText.length} chars)`);
    return bodyText;
    
  } catch (error) {
    console.log(`   ⚠️  Error getting description: ${error}`);
    return '';
  }
}

}