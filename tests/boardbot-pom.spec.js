const { test, expect } = require('@playwright/test');
const PicmgHomePage = require('../pages/PicmgHomePage');
const BoardBotPage = require('../pages/BoardBotPage');

test.describe('PICMG BoardBot Tests with POM', () => {
  
  test('Search for AMD motherboards using Page Object Model', async ({ page }) => {
    // Initialize page objects
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    // Navigate and accept cookies
    await homePage.goto();
    await homePage.acceptCookies();

    // Go to Member Products section
    await homePage.goToMemberProducts();

    // Verify BoardBot interface is visible
    await expect(boardBot.searchInput).toBeVisible();
    await expect(boardBot.askButton).toBeVisible();

    // Search for AMD motherboards
    await boardBot.searchProducts('Show me please amd supported motherboards for my server?');

    // Wait for results
    await boardBot.waitForResults();

    // Verify results are displayed
    await expect(boardBot.resultsTable).toBeVisible();
    await expect(boardBot.primaryResultsTab).toBeVisible();

    // Get and verify product count
    const productCount = await boardBot.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    
    console.log(`Found ${productCount} AMD motherboard products`);
  });

  test('Verify BoardBot interface using POM', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    // Verify all interface elements
    await boardBot.verifyInterfaceElements();

    // Verify disclaimer
    await expect(boardBot.disclaimer).toBeVisible();
  });

  test('Search for different product types', async ({ page }) => {
    const homePage = new PicmgHomePage(page);
    const boardBot = new BoardBotPage(page);

    await homePage.goto();
    await homePage.acceptCookies();
    await homePage.goToMemberProducts();

    // Search for Intel products
    await boardBot.searchProducts('Show me Intel processor modules');
    await boardBot.waitForResults();
    
    const intelProducts = await boardBot.getProductCount();
    expect(intelProducts).toBeGreaterThan(0);
    console.log(`Found ${intelProducts} Intel products`);
  });

});
