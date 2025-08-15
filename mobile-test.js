import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  
  // Desktop test
  console.log('=== DESKTOP TEST ===');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1920, height: 1080 });
  
  // Mobile test
  console.log('=== MOBILE TEST ===');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 }); // iPhone X
  
  // Tablet test
  console.log('=== TABLET TEST ===');
  const tabletPage = await browser.newPage();
  await tabletPage.setViewportSize({ width: 768, height: 1024 }); // iPad
  
  const devices = [
    { page: desktopPage, name: 'Desktop', width: 1920, height: 1080 },
    { page: mobilePage, name: 'Mobile', width: 375, height: 812 },
    { page: tabletPage, name: 'Tablet', width: 768, height: 1024 }
  ];
  
  for (const device of devices) {
    console.log(`\n--- Testing ${device.name} (${device.width}x${device.height}) ---`);
    
    // Listen for console errors
    device.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`${device.name} ERROR:`, msg.text());
      }
    });
    
    try {
      await device.page.goto('http://localhost:5173/', { timeout: 10000 });
      await device.page.waitForTimeout(2000);
      
      // Take screenshot
      await device.page.screenshot({ 
        path: `screenshot-${device.name.toLowerCase()}.png`,
        fullPage: true 
      });
      console.log(`${device.name} screenshot saved`);
      
      // Check text visibility
      const title = await device.page.textContent('h1');
      console.log(`${device.name} title visible:`, !!title);
      
      // Check button visibility and accessibility
      const buttons = await device.page.locator('button').all();
      console.log(`${device.name} buttons found:`, buttons.length);
      
      for (let i = 0; i < Math.min(buttons.length, 5); i++) {
        const button = buttons[i];
        const text = await button.textContent();
        const isVisible = await button.isVisible();
        const boundingBox = await button.boundingBox();
        
        console.log(`${device.name} Button ${i + 1}:`, {
          text: text?.substring(0, 20),
          visible: isVisible,
          size: boundingBox ? `${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)}` : 'null'
        });
        
        // Check if button is too small for mobile
        if (device.name === 'Mobile' && boundingBox) {
          if (boundingBox.width < 44 || boundingBox.height < 44) {
            console.log(`${device.name} WARNING: Button too small for mobile (${Math.round(boundingBox.width)}x${Math.round(boundingBox.height)})`);
          }
        }
      }
      
      // Check settings controls visibility
      const settingsControls = await device.page.locator('.setting-item').all();
      console.log(`${device.name} settings controls:`, settingsControls.length);
      
      for (const control of settingsControls) {
        const text = await control.textContent();
        const isVisible = await control.isVisible();
        console.log(`${device.name} Setting:`, { text: text?.substring(0, 15), visible: isVisible });
      }
      
      // Check if content overflows on mobile
      if (device.name === 'Mobile') {
        const body = await device.page.locator('body').boundingBox();
        const app = await device.page.locator('.app').boundingBox();
        
        if (app && body) {
          console.log(`${device.name} Layout:`, {
            bodyWidth: body.width,
            appWidth: app.width,
            overflow: app.width > body.width ? 'YES - PROBLEM' : 'NO - OK'
          });
        }
      }
      
      // Check instructions visibility
      const instructions = await device.page.locator('.instructions li').all();
      console.log(`${device.name} instruction items:`, instructions.length);
      
      for (const instruction of instructions.slice(0, 3)) {
        const text = await instruction.textContent();
        const isVisible = await instruction.isVisible();
        console.log(`${device.name} Instruction:`, { text: text?.substring(0, 25), visible: isVisible });
      }
      
      // Test modal by clicking preset button
      const presetButton = device.page.locator('button:has-text("프리셋")');
      if (await presetButton.isVisible()) {
        await presetButton.click();
        await device.page.waitForTimeout(1000);
        
        const modal = device.page.locator('.preset-picker-modal');
        const modalVisible = await modal.isVisible();
        console.log(`${device.name} Preset modal visible:`, modalVisible);
        
        if (modalVisible) {
          const modalBox = await modal.boundingBox();
          console.log(`${device.name} Modal size:`, modalBox ? `${Math.round(modalBox.width)}x${Math.round(modalBox.height)}` : 'null');
          
          // Check modal text visibility
          const modalText = await modal.textContent();
          console.log(`${device.name} Modal has text:`, !!modalText && modalText.length > 10);
        }
        
        // Close modal by clicking overlay
        await device.page.locator('.preset-picker-overlay').click({ position: { x: 50, y: 50 } });
        await device.page.waitForTimeout(500);
      }
      
    } catch (error) {
      console.log(`${device.name} Test Error:`, error.message);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('Screenshots saved:');
  console.log('- screenshot-desktop.png');
  console.log('- screenshot-mobile.png');
  console.log('- screenshot-tablet.png');
  console.log('\nKeeping browser open for 10 seconds for manual inspection...');
  
  await new Promise(resolve => setTimeout(resolve, 10000));
  await browser.close();
})();