const { test, expect } = require('@playwright/test');

test.describe('PICMG BoardBot Tests', () => {
  
  test('Access BoardBot and ask about AMD motherboards', async ({ page }) => {
    // Navigate to PICMG website
    await page.goto('https://www.picmg.org/');
    
    // Accept cookies
    await page.getByRole('button', { name: 'Accept All' }).click();
    
    // Click on Member Products tab
    await page.getByRole('link', { name: 'Member Products' }).click();
    
    // Verify BoardBot interface is visible
    await expect(page.getByRole('textbox', { name: 'Ask about products based on' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask' })).toBeVisible();
    
    // Type the question about AMD motherboards
    await page.getByRole('textbox', { name: 'Ask about products based on' })
      .fill('Show me please amd supported motherboards for my server?');
    
    // Click Ask button
    await page.getByRole('button', { name: 'Ask' }).click();
    
    // Wait for loading to complete (up to 15 seconds)
    await page.waitForSelector('img[alt="Loading"]', { state: 'visible', timeout: 2000 })
      .catch(() => console.log('Loading indicator appeared briefly or not at all'));
    
    // Wait for results to appear
    await page.waitForSelector('table', { state: 'visible', timeout: 15000 });
    
    // Verify chat response appears
    await expect(page.locator('text=When looking for AMD-supported motherboards').first()).toBeVisible({ timeout: 15000 });
    
    // Verify results table is displayed
    const resultsTable = page.locator('table');
    await expect(resultsTable).toBeVisible();
    
    // Verify we have product results
    const productRows = page.locator('tbody tr');
    const rowCount = await productRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    // Verify table headers
    await expect(page.locator('th', { hasText: 'Product' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Manufacturer' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Category' })).toBeVisible();
    
    // Verify primary results tab is present
    await expect(page.locator('text=Primary Results')).toBeVisible();
    
    // Log the number of results found
    console.log(`Found ${rowCount} product results for AMD motherboards`);
  });

  test('Verify BoardBot interface elements', async ({ page }) => {
    // Navigate to PICMG website
    await page.goto('https://www.picmg.org/');
    
    // Accept cookies
    await page.getByRole('button', { name: 'Accept All' }).click();
    
    // Click on Member Products tab
    await page.getByRole('link', { name: 'Member Products' }).click();
    
    // Verify all BoardBot interface elements
    await expect(page.getByText('Use the text input field to search')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Ask about products based on' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask' })).toBeVisible();
    
    // Verify filter options are present
    await expect(page.locator('text=Spec Family')).toBeVisible();
    await expect(page.locator('text=Form Factor')).toBeVisible();
    await expect(page.locator('text=Pinout')).toBeVisible();
    await expect(page.locator('text=CPU Manufacturer')).toBeVisible();
    
    // Verify control buttons
    await expect(page.locator('text=Clear search parameters')).toBeVisible();
    await expect(page.locator('text=Restart session')).toBeVisible();
    await expect(page.locator('text=Feedback')).toBeVisible();
    
    // Verify disclaimer is present
    await expect(page.locator('text=BoardBot is in beta')).toBeVisible();
  });

});
