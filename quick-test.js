import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log(`CONSOLE [${msg.type()}]:`, msg.text());
  });
  
  // Listen for errors
  page.on('pageerror', error => {
    console.log(`PAGE ERROR:`, error.message);
  });
  
  try {
    console.log('Navigating to http://localhost:5174/rollet-games/...');
    await page.goto('http://localhost:5174/rollet-games/', { timeout: 10000 });
    
    // Wait a bit for initial render
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('Screenshot saved');
    
    // Check what's in the DOM
    const rootHTML = await page.locator('#root').innerHTML();
    console.log('Root HTML content:', rootHTML.substring(0, 500) + '...');
    
    // Check for React errors specifically
    const hasError = await page.locator('text=Error').count();
    console.log('Error elements found:', hasError);
    
    // Check if page is completely blank
    const bodyText = await page.locator('body').textContent();
    console.log('Body text content:', bodyText ? bodyText.substring(0, 200) : 'EMPTY');
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
  
  // Keep open for inspection
  console.log('Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();