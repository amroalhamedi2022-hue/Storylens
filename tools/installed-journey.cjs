'use strict';
const { _android } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const out = 'android-sheet-evidence/';
(async () => {
  const [device] = await _android.devices();
  try {
    const view = await device.webView({pkg:'com.storylens.reader.preview'});
    const page = await view.page();
    async function capture(name, selector) {
      await page.locator(selector).first().waitFor({timeout:45000});
      await page.evaluate(() => document.fonts.ready);
      fs.writeFileSync(out + name + '.png', execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:16<<20}));
    }
    await capture('01-library','.library .lt-novel-card');
    await page.locator(".library .card[onclick*='around-the-world-in-eighty-days-towle']").first().click();
    await capture('02-chapters','dialog[open] .lt-chapter-tile');
    await page.locator('dialog .lt-chapter-tile').first().click();
    const words = '.reader .is-active .sentence .tok';
    await capture('03-reader',words);
    await page.locator(words).first().click();
    await capture('04-meaning','#modals .sheet');
    fs.writeFileSync(out+'lookup.json',JSON.stringify(await page.evaluate(()=>{
      const sheet=document.querySelector('#modals .sheet');
      return {className:sheet.className,style:sheet.getAttribute('style'),scroll:sheet.scrollTop,height:sheet.clientHeight,viewport:[innerWidth,innerHeight],title:sheet.querySelector('h2')?.textContent,labels:[...sheet.querySelectorAll('label')].map(n=>n.textContent),bounds:sheet.getBoundingClientRect().toJSON(),focus:document.activeElement?.textContent?.slice(0,35)};
    }),null,2));
  } finally { await device.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
