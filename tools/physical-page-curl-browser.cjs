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
   await page.waitForTimeout(500);
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
   assert.equal(await page.locator('.lt-curl-under').count(),1);
   assert.equal(await page.locator('.lt-curl-stage .tok').count(),0,'no duplicate dictionary buttons');
   assert.equal(await page.locator('.lt-curl-stage [id]').count(),0,'no duplicate DOM identities');
   await page.screenshot({path:path.join(out,`curl-${rtl?'rtl':'ltr'}-${landscape?'spread':'portrait'}-held.png`)});
   await page.evaluate(()=>endCurl());await page.waitForTimeout(1400);
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
   await page.evaluate(()=>{state.chapter=0;put('readpage_anchor_'+state.story.id+'_0',state.story.chapters[0].paragraphs.length-1);renderReader();testEvents.length=0;LinguaReaderCurl.turn(1,'keyboard')});
   assert.equal(await page.evaluate(()=>state.chapter),1);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),1,'cross-chapter commit reaches document even after old DOM removal');
   await page.evaluate(()=>LinguaReaderCurl.turn(-1,'keyboard'));
   assert.equal(await page.evaluate(()=>state.chapter),0);
   assert.equal(await page.evaluate(()=>testEvents.filter(e=>e.event==='commit').length),2);
   const saved=await page.evaluate(()=>get('readpage_anchor_'+state.story.id+'_0'));
   await page.evaluate(()=>renderReader());
   assert.equal(await page.evaluate(()=>get('readpage_anchor_'+state.story.id+'_0')),saved,'saved progress restores');
   await page.evaluate(()=>{state.chapter=state.story.chapters.length-1;put('readpage_anchor_'+state.story.id+'_'+state.chapter,state.story.chapters[state.chapter].paragraphs.length-1);renderReader();testEvents.length=0;LinguaReaderCurl.turn(1,'keyboard')});
   assert.equal(await page.evaluate(()=>testEvents.length),0,'end guard does not start or commit');
   assert.equal(await page.evaluate(()=>state.page),'reader');
   assert.deepEqual(errors,[]);
   console.log('PASS browser',rtl?'RTL':'LTR',landscape?'spread':'portrait');await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
