import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:5174/rollet-games/...');
  
  try {
    await page.goto('http://localhost:5174/rollet-games/', { waitUntil: 'networkidle' });
    
    // Wait a bit for React to render
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('Screenshot saved as debug-screenshot.png');
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for errors in console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for any console errors
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('Console errors found:');
      errors.forEach(error => console.log('ERROR:', error));
    } else {
      console.log('No console errors detected');
    }
    
    // Check if Korean text is visible
    const koreanTitle = await page.textContent('h1').catch(() => null);
    console.log('Korean title found:', koreanTitle);
    
    // Check for main elements
    const spinButton = await page.locator('button:has-text("스핀")').count();
    console.log('Spin button found:', spinButton > 0);
    
    const wheelContainer = await page.locator('.wheel-container').count();
    console.log('Wheel container found:', wheelContainer > 0);
    
    // Check React root content
    const rootContent = await page.locator('#root').innerHTML();
    console.log('Root content length:', rootContent.length);
    
    if (rootContent.length < 100) {
      console.log('Root content appears empty. Full content:', rootContent);
    }
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
  
  // Keep browser open for manual inspection
  console.log('Browser will stay open for 30 seconds for manual inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();