import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set to mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  
  console.log('Testing mobile layout...');
  
  try {
    await page.goto('http://localhost:5174/rollet-games/', { timeout: 8000 });
    await page.waitForTimeout(2000);
    
    // Take mobile screenshot
    await page.screenshot({ path: 'mobile-debug.png', fullPage: true });
    console.log('Mobile screenshot saved');
    
    // Check for horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 375;
    console.log('Horizontal overflow check:', {
      bodyWidth,
      viewportWidth,
      overflow: bodyWidth > viewportWidth ? 'YES - PROBLEM!' : 'NO - OK'
    });
    
    // Check button sizes
    const buttons = await page.locator('button').all();
    console.log('\n=== BUTTON SIZE CHECK ===');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const box = await button.boundingBox();
      
      if (box) {
        const tooSmall = box.width < 44 || box.height < 44;
        console.log(`Button ${i + 1}: "${text?.slice(0, 15)}" - ${Math.round(box.width)}x${Math.round(box.height)} ${tooSmall ? '⚠️  TOO SMALL' : '✅'}`);
      }
    }
    
    // Check text readability
    console.log('\n=== TEXT READABILITY CHECK ===');
    const textElements = [
      { selector: 'h1', name: 'Main title' },
      { selector: '.instructions p', name: 'Instructions header' },
      { selector: '.instructions li', name: 'Instruction item' },
      { selector: '.setting-item', name: 'Setting item' }
    ];
    
    for (const element of textElements) {
      try {
        const locator = page.locator(element.selector).first();
        const isVisible = await locator.isVisible();
        const text = await locator.textContent();
        const color = await locator.evaluate(el => getComputedStyle(el).color);
        
        console.log(`${element.name}:`, {
          visible: isVisible,
          hasText: !!text,
          textLength: text?.length || 0,
          color: color,
          sample: text?.slice(0, 30)
        });
      } catch (e) {
        console.log(`${element.name}: ERROR -`, e.message);
      }
    }
    
    // Test modal interaction
    console.log('\n=== MODAL TEST ===');
    const presetBtn = page.locator('button:has-text("프리셋")');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(1000);
      
      const modal = page.locator('.preset-picker-modal');
      const modalVisible = await modal.isVisible();
      console.log('Modal opened:', modalVisible);
      
      if (modalVisible) {
        const modalBox = await modal.boundingBox();
        const modalText = await modal.textContent();
        
        console.log('Modal details:', {
          size: modalBox ? `${Math.round(modalBox.width)}x${Math.round(modalBox.height)}` : 'null',
          hasText: !!modalText,
          fitsInViewport: modalBox ? modalBox.width <= 375 : 'unknown'
        });
        
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
    
  } catch (error) {
    console.log('Test error:', error.message);
  }
  
  console.log('\nKeeping browser open for 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
})();