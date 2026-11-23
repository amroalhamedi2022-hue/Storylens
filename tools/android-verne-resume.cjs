'use strict';
const {_android}=require('playwright'), fs=require('node:fs'), assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const pkg='com.storylens.reader.preview', out='android-sheet-evidence/';
const capture=name=>fs.writeFileSync(out+name+'.png',execFileSync('adb',['exec-out','screencap','-p'],{maxBuffer:16<<20}));
async function connect(device){const view=await device.webView({pkg});return view.page();}
async function mark(page){return page.evaluate(()=>{
 const p=document.querySelector('#sentences>.is-active');return {book:state.story.id,chapter:state.chapter,total:state.story.chapters.length,paragraph:p.dataset.ltStartParagraph,offset:p.dataset.ltStartOffset,text:p.textContent.trim().slice(0,140)};
});}
(async()=>{

 let [device]=await _android.devices();
 try{
 await device.shell('am force-stop '+pkg);
 await device.shell('settings put system user_rotation 0');
 await device.shell('wm size 460x860');
 await device.shell('am start -W -n '+pkg+'/com.storylens.reader.MainActivity');
 let page=await connect(device);
 await page.locator(".library .card[onclick*='around-the-world-in-eighty-days-towle']").first().click();
 await page.locator('.lt-chapter-gallery-search').fill('32');
 await page.locator('.lt-chapter-tile[data-chapter-index="31"]').click();
 await page.waitForFunction(()=>state.chapter===31&&document.querySelector('#sentences>.is-active'));
 await page.evaluate(()=>document.fonts.ready);
 let last=await mark(page);assert.equal(last.total,37);
 for(let i=0;i<2;i++){
 await page.locator('.lt-page-next').click();
 await page.waitForFunction(before=>{const p=document.querySelector('#sentences>.is-active');return p&&!window.LinguaReaderCurl.active&&(p.dataset.ltStartParagraph!==before.paragraph||p.dataset.ltStartOffset!==before.offset);},last);
 last=await mark(page);
 }

 capture('before-stop');fs.writeFileSync(out+'before.json',JSON.stringify(last));
 await device.close();
 execFileSync('adb',['shell','am','force-stop',pkg]);
 [device]=await _android.devices();
 await device.shell('am start -W -n '+pkg+'/com.storylens.reader.MainActivity');
 await new Promise(r=>setTimeout(r,3000));page=await connect(device);
 await page.locator('.lt-edition-open').waitFor();
 await page.locator('.lt-edition-open').click();
 await page.waitForFunction(()=>state.chapter===31&&document.querySelector('#sentences>.is-active'));
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 fs.writeFileSync(out+'breaks.json',JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('#sentences>.lt-paginated-sheet')].filter(e=>!e.classList.contains('lt-curl-snapshot-page')).map(e=>[e.dataset.ltStartParagraph,e.dataset.ltStartOffset]))));
 capture('after-resume');const after=await mark(page);fs.writeFileSync(out+'after.json',JSON.stringify(after));assert.deepEqual(after,last);
 console.log('PASS chapter 32 survives process death at the same paragraph, offset and text');
 }finally{await device.close();}
})().catch(e=>{console.error(e);process.exitCode=1});