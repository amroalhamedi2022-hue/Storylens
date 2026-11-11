/* Run: NODE_PATH=<playwright install>/node_modules node tools/physical-page-curl-browser.cjs
 * Hosts the real offline app locally. Network requests outside localhost fail. */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assets=path.resolve('app/src/main/assets'),out=process.env.CURL_SCREENSHOTS||'qa-screenshots';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const f=path.resolve(assets,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!f.startsWith(assets+path.sep)||!fs.existsSync(f)){res.writeHead(404);res.end();return;}
 const types={'.js':'text/javascript','.css':'text/css','.html':'text/html','.webp':'image/webp','.ttf':'font/ttf'};
 res.setHeader('Content-Type',types[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const url='http://127.0.0.1:'+server.address().port+'/index.html';
 try{
  for(const rtl of [false,true])for(const landscape of [false,true]){
   const page=await browser.newPage({viewport:landscape?{width:1280,height:840}:{width:460,height:860}});
   await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url);
   await page.evaluate(rtl=>{
    window.testEvents=[];for(const event of ['start','progress','commit','cancel'])document.addEventListener('lingua:turn'+event,e=>testEvents.push({event,...e.detail}));
    const id=rtl?'thirteenth-bell-arabic':'last-passenger';
    put('chapter_'+id,0);put('readpage_anchor_'+id+'_0',0);openStory(id);
   },rtl);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(400);
   const spread=landscape?2:1;
   assert.equal(await page.locator('#sentences').getAttribute('data-spread'),String(spread));
   assert.equal(await page.locator('#sentences > .is-active').count(),spread);
   const initial=await page.locator('#sentences > .is-active .sentence').first().getAttribute('data-i');
   async function gesture(distance,vertical=0,ending='pointerup',holdOnly=false){
    await page.evaluate(({rtl,distance,vertical,ending,holdOnly})=>{
     const box=document.querySelector('#sentences');box.scrollIntoView({block:'start',behavior:'instant'});
     const r=box.getBoundingClientRect(),active=[...box.children].find(p=>p.classList.contains('is-active'));
     const w=active.getBoundingClientRect().width,x=rtl?r.left+12:r.right-12,y=r.top+60;
     const send=(type,atX,atY,id=81)=>box.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:id===81,button:0,buttons:1,clientX:atX,clientY:atY}));
     send('pointerdown',x,y);send('pointermove',x+(rtl?1:-1)*w*distance,y+vertical);
     window.endCurl=()=>send(ending,x+(rtl?1:-1)*w*distance,y+vertical);
     if(!holdOnly)window.setTimeout(window.endCurl,150); // remove artificial synthetic velocity
    },{rtl,distance,vertical,ending,holdOnly});
   }
   // Slow partial fold springs back and produces no commit.
   await gesture(.22,35);await page.waitForTimeout(1400);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),0);
   assert.equal(await page.locator('#sentences > .is-active .sentence').first().getAttribute('data-i'),initial);
   // Actual held mesh, source HTML, real underpage; save visual evidence.
   await gesture(.75,80,'pointerup',true);await page.waitForTimeout(80);
   assert.equal(await page.locator('.lt-curl-facet').count(),22);
   assert.equal(await page.locator('.lt-curl-facet > :is(.lt-curl-front,.lt-curl-back)').count(),22,
    'each geometric facet mounts only its visible face');
   assert.ok(await page.evaluate(()=>{
    const r=document.querySelector('#sentences').getBoundingClientRect();
    return r.left>=-1&&r.right<=innerWidth+1&&Math.abs(scrollX)<1;
   }),'holding either edge must not expand horizontal scroll or shift the reader off screen');
   assert.equal(await page.locator('.lt-curl-under').count(),1);
   assert.equal(await page.locator('.lt-curl-stage .tok').count(),0,'no duplicate dictionary buttons');
   assert.equal(await page.locator('.lt-curl-stage [id]').count(),0,'no duplicate DOM identities');
   assert.ok(await page.evaluate(()=>{
    const ink=document.querySelector('.lt-curl-facet:last-child .lt-curl-back .lt-curl-ink');
    const style=getComputedStyle(ink),width=ink.getBoundingClientRect().width;
    return ink.textContent.trim().length>10&&style.backfaceVisibility==='visible'&&parseFloat(style.transformOrigin)>0&&width>0;
   }),'reverse ink remains visible and reflected about the centre, not moved off paper');
   await page.screenshot({path:path.join(out,`curl-${rtl?'rtl':'ltr'}-${landscape?'spread':'portrait'}-held.png`)});
   await page.evaluate(()=>endCurl());await page.waitForFunction(()=>!LinguaReaderCurl.active,{},{timeout:5000});
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),1);
   assert.equal(await page.locator('.lt-curl-stage').count(),0);
   await page.screenshot({path:path.join(out,`curl-${rtl?'rtl':'ltr'}-${landscape?'spread':'portrait'}-landed.png`)});
   // A second contact on DOCUMENT (outside the paper) must cancel a locked hold.
   await gesture(.6,20,'pointerup',true);await page.waitForTimeout(50);
   await page.evaluate(()=>document.body.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:82,isPrimary:false,button:0})));
   await page.evaluate(()=>endCurl());await page.waitForTimeout(200);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),1);
   assert.equal(await page.locator('.lt-curl-stage').count(),0);
   // Back bridge consumes a held fold without navigating or committing.
   await gesture(.6,40,'pointerup',true);await page.waitForTimeout(50);
   assert.equal(await page.evaluate(()=>LinguaReaderCurl.cancelIfActive()),true);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),1);
   // Rotate/reflow and font rebuild keep the paragraph actually under the eye.
   const anchor=await page.evaluate(()=>{const n=document.querySelector('#sentences > .is-active .sentence');n.scrollIntoView({block:'start',behavior:'instant'});return Number(n.dataset.i)});
   await page.setViewportSize(landscape?{width:700,height:1000}:{width:1280,height:840});await page.waitForTimeout(700);
   assert.equal(await page.evaluate(a=>[...document.querySelectorAll('#sentences > .is-active .sentence')].some(n=>Number(n.dataset.i)===a),anchor),true,'rotation preserves semantic paragraph');
   await page.evaluate(a=>LinguaReflowReader({paragraph:a,viewportOffset:90}),anchor);await page.waitForTimeout(150);
   assert.equal(await page.evaluate(a=>[...document.querySelectorAll('#sentences > .is-active .sentence')].some(n=>Number(n.dataset.i)===a),anchor),true);
   // Dictionary uses the original handler exactly once after folds/rebuilds.
   if(!rtl){
    await page.evaluate(()=>{window.dictionaryCalls=0;const original=wordSheet;wordSheet=function(a){dictionaryCalls++;return original(a)}});
    await page.locator('#sentences > .is-active .tok').first().click();
    assert.equal(await page.evaluate(()=>dictionaryCalls),1);assert.ok(await page.locator('#modals .sheet').count());
    await page.evaluate(()=>closeSheet());
   }
   // Reduced motion, chapter boundaries, restoration and end-of-book guards.
   await page.emulateMedia({reducedMotion:'reduce'});
   const openLastSheet=chapter=>page.evaluate(({finalChapter})=>{
    state.chapter=finalChapter?state.story.chapters.length-1:0;
    renderReader();
    const pages=[...document.querySelectorAll('#sentences>.lt-paginated-sheet')];
    const sheet=pages.at(-1),key=state.story.id+'_'+state.chapter;
    put('readpage_'+key,pages.length-1);
    put('readpage_anchor_'+key,Number(sheet.dataset.ltStartParagraph));
    put('readpage_offset_'+key,Number(sheet.dataset.ltStartOffset));
    renderReader();testEvents.length=0;
   },{finalChapter:chapter==='last'});
   await openLastSheet('first');
   await gesture(0);
   await page.waitForTimeout(250);
   assert.equal(await page.locator('#sentences > .lt-curl-boundary-preview').count(),0,
    'a tap at the chapter edge leaves no orphaned preview');
   assert.equal(await page.evaluate(()=>testEvents.length),0,'an edge tap does not start a turn');
   await page.evaluate(()=>LinguaReaderCurl.turn(1,'keyboard'));
   assert.equal(await page.evaluate(()=>state.chapter),1);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),1,'cross-chapter commit reaches document even after old DOM removal');
   await page.evaluate(()=>LinguaReaderCurl.turn(-1,'keyboard'));
   assert.equal(await page.evaluate(()=>state.chapter),0);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),2);
   const saved=await page.evaluate(()=>get('readpage_anchor_'+state.story.id+'_0'));
   await page.evaluate(()=>renderReader());
   assert.equal(await page.evaluate(()=>get('readpage_anchor_'+state.story.id+'_0')),saved,'saved progress restores');
   await openLastSheet('last');
   await page.evaluate(()=>LinguaReaderCurl.turn(1,'keyboard'));
   assert.equal(await page.evaluate(()=>testEvents.length),0,'end guard does not start or commit');
   assert.equal(await page.evaluate(()=>state.page),'reader');
   assert.deepEqual(errors,[]);
   console.log('PASS browser',rtl?'RTL':'LTR',landscape?'spread':'portrait');await page.close();
  }
  // Real browser touch dispatch (not only synthetic DOM PointerEvents).
  const touch=await browser.newPage({viewport:{width:460,height:860},hasTouch:true});
  await touch.goto(url);await touch.evaluate(()=>openStory('last-passenger'));
  await touch.evaluate(()=>document.fonts.ready);await touch.waitForTimeout(400);
  await touch.evaluate(()=>{window.realCommits=0;document.addEventListener('lingua:turncommit',()=>realCommits++);document.querySelector('#sentences').scrollIntoView({block:'start',behavior:'instant'})});
  const bounds=await touch.locator('#sentences').boundingBox(),cdp=await touch.context().newCDPSession(touch);
  let x=bounds.x+bounds.width-8,y=Math.max(20,bounds.y+50);
  // Vertical movement from the edge remains native scroll, not a paper turn.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-2,y:y+100}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await touch.evaluate(()=>realCommits),0);
  assert.equal(await touch.evaluate(()=>LinguaReaderCurl.active),false);
  await touch.waitForTimeout(300);
  await touch.evaluate(()=>document.querySelector('#sentences').scrollIntoView({block:'start',behavior:'instant'}));
  const resetBounds=await touch.locator('#sentences').boundingBox();x=resetBounds.x+resetBounds.width-8;y=resetBounds.y+50;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=8;i++){
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-bounds.width*.7*i/8,y:y+4}]});
   await touch.waitForTimeout(20);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await touch.waitForFunction(()=>realCommits===1,{},{timeout:5000});
  assert.equal(await touch.locator('.lt-curl-stage').count(),0);
  // Browser-generated second contact cancels even after capture has transferred.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-90,y,id:0}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-90,y,id:0},{x:x-110,y:y+30,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  assert.equal(await touch.evaluate(()=>LinguaReaderCurl.active),false);
  assert.equal(await touch.evaluate(()=>realCommits),1);
  // Rapid controls: superseded turns cancel, exactly one final intent commits.
  await touch.evaluate(()=>{LinguaReaderCurl.turn(-1,'keyboard');LinguaReaderCurl.turn(-1,'keyboard');LinguaReaderCurl.turn(-1,'keyboard')});
  await touch.waitForFunction(()=>!LinguaReaderCurl.active,{},{timeout:5000});
  assert.equal(await touch.evaluate(()=>realCommits),2);
  // Illustration opens on its original node; a fold never owns its tap.
  await touch.evaluate(()=>{const id='around-the-world-in-eighty-days-towle';put('chapter_'+id,10);put('readpage_anchor_'+id+'_10',43);openStory(id)});
  await touch.waitForFunction(()=>state.story?.id==='around-the-world-in-eighty-days-towle'&&state.page==='reader',{},{timeout:15000});
  const picture=touch.locator('#sentences > .is-active .lt-inline-illustration img[src^="art/"]').first();
  await picture.click();await touch.waitForSelector('.lt-art-inspection-dialog',{timeout:3000});assert.equal(await touch.locator('.lt-art-inspection-dialog').count(),1);
  assert.equal(await touch.evaluate(()=>LinguaReaderCurl.active),false);
  await touch.evaluate(()=>LinguaTalesArtInspection.closeIfOpen());
  await touch.evaluate(()=>openStory('last-passenger'));await touch.evaluate(()=>document.fonts.ready);
  await touch.waitForTimeout(400);
  // Catch a moving sheet without a second start or commit, then cancel it.
  await touch.evaluate(()=>{LinguaReaderCurl.turn(1,'control')});await touch.waitForTimeout(100);
  await touch.evaluate(()=>{
   const box=document.querySelector('#sentences'),r=box.getBoundingClientRect();
   box.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:97,isPrimary:true,button:0,clientX:r.right-15,clientY:r.top+60}));
   LinguaReaderCurl.cancel('catch-test');
  });
  await touch.waitForTimeout(200);assert.equal(await touch.evaluate(()=>realCommits),2);
  await touch.close();console.log('PASS browser real touch, rapid controls, original illustration and catch/cancel');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
