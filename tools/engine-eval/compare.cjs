'use strict';
/* Reproducible offline browser benchmark for two THIRD-PARTY engines.
 * NEVER loads production reader-experience.js, modifies data, or uses keys.
 * Run after npm packages copied to tools/engine-eval/vendor by workflow.
 */
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..');
const output=path.join(root,'qa-pageflip-eval');
fs.mkdirSync(output,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2'};
const server=http.createServer((req,res)=>{
 let file;
 try{file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));}
 catch(_){res.writeHead(400);res.end();return;}
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){
  res.writeHead(404);res.end();return;
 }
 res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
 fs.createReadStream(file).pipe(res);
});
function sleep(t){return new Promise(resolve=>setTimeout(resolve,t));}
async function measure(page){
 return page.evaluate(async()=>{
  const durations=[];let previous=performance.now();const start=previous;
  while(performance.now()-start<700){
   await new Promise(resolve=>requestAnimationFrame(resolve));
   const now=performance.now();durations.push(now-previous);previous=now;
  }
  durations.sort((a,b)=>a-b);
  const p95=durations[Math.min(durations.length-1,Math.floor(durations.length*.95))];
  return {frames:durations.length,p95FrameMs:Number(p95.toFixed(1)),
   over33ms:durations.filter(n=>n>33.3).length};
 });
}
async function scenario(browser,base,{engine,rtl,width,height}){
 const label=engine+'-'+(rtl?'rtl':'ltr')+'-'+(width<600?'phone':'spread');
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<600});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const report={engine,rtl,viewport:[width,height],label,engineLoaded:false,wordClick:false,
  holdNoCommit:false,flipForward:false,flipBack:false,textSelection:false,
  orientation:null,frameP95Ms:null,destroyRafDelta:null,failures:[],errors};
 try{
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await page.addInitScript(()=>{
   const native=requestAnimationFrame;
   window.__ltRafRequests=0;
   window.requestAnimationFrame=function(...args){window.__ltRafRequests++;return native.apply(window,args);};
  });
  await page.goto(base+'/tools/engine-eval/index.html?engine='+engine+'&rtl='+(rtl?'1':'0'),
   {waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.body.dataset.ready==='yes'||document.body.dataset.ready==='failed',
   null,{timeout:18000});
  if(await page.locator('body').getAttribute('data-ready')!=='yes'){
   throw Error('Engine initialization: '+(await page.evaluate(()=>window.evalError||document.querySelector('#status').textContent)));
  }
  const initial=await page.evaluate(()=>({
   page:window.evalBook.currentPage(),orientation:window.evalBook.orientation(),
   paper:document.querySelectorAll('.paper').length,
   originalLoaded:!!(window.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle'),
   actualText:document.querySelector('.source-text')?.textContent?.includes('Phileas Fogg'),
   pageCount:window.evalBook.engine==='st'?window.evalBook.book.getPageCount():window.evalBook.book.pageCount
  }));
  report.engineLoaded=true;report.orientation=initial.orientation;
  assert.equal(initial.pageCount,8,'8 authentic Chapter I paragraphs, no generated story text');
  assert.ok(initial.originalLoaded,'actual existing bilingual literature loaded');
  assert.ok(initial.actualText||rtl,'English source words present verbatim');
  const expected=width<600?'portrait':'landscape';
  if(initial.orientation!==expected)report.failures.push('orientation '+initial.orientation+' not '+expected);
  await page.screenshot({path:path.join(output,label+'-idle.png')});
  try{
   // Click with a real browser pointer, not element.click(), to catch
   // overlays swallowing dictionary/token interactions.
   const token=page.locator('.token:visible').first();
   await token.click({timeout:3200});
   report.wordClick=await page.evaluate(()=>window.evalBook.wordClicks>0);
   if(!report.wordClick)report.failures.push('dictionary button swallowed');
  }catch(e){report.failures.push('dictionary pointer: '+e.message.slice(0,160));}
  // DOM selection proves words are still selectable after installing the
  // engine; native drag selection needs physical WebView acceptance as well.
  report.textSelection=await page.evaluate(()=>{
   const p=document.querySelector('.paper .source-text');
   const first=p?.firstChild;
   if(!first||first.nodeType!==3||first.length<8)return false;
   const r=document.createRange();r.setStart(first,0);r.setEnd(first,Math.min(8,first.length));
   const sel=getSelection();sel.removeAllRanges();sel.addRange(r);
   const ok=sel.toString().length>0;sel.removeAllRanges();return ok;
  });
  if(!report.textSelection)report.failures.push('source paragraph cannot be selected');
  const box=await page.locator('#book').boundingBox();
  const x=rtl?box.x+16:box.x+box.width-16,y=box.y+Math.min(box.height*.45,200);
  const into=rtl?Math.min(135,box.width*.25):-Math.min(135,box.width*.25);
  const before=await page.evaluate(()=>window.evalBook.currentPage());
  try{
   await page.mouse.move(x,y);await page.mouse.down();
   await page.mouse.move(x+into,y+40,{steps:9});
   await sleep(420);
   const mid=await page.evaluate(()=>({
    page:window.evalBook.currentPage(),state:window.evalBook.engine==='open'?
      window.evalBook.book.state:'state via event only'
   }));
   report.holdNoCommit=(mid.page===before);
   if(!report.holdNoCommit)report.failures.push('page committed before finger release');
   report.frame=(await measure(page));
   await page.screenshot({path:path.join(output,label+'-held.png')});
  }catch(e){report.failures.push('held drag: '+e.message.slice(0,160));}
  await page.mouse.up();
  await sleep(800);
  // Reset after gesture; use real package API for deterministic baseline.
  await page.evaluate(()=>window.evalBook.book&&
   (window.evalBook.engine==='st'?window.evalBook.book.turnToPage(0):window.evalBook.book.turnTo(0)));
  await sleep(150);
  const start=await page.evaluate(()=>window.evalBook.currentPage());
  await page.evaluate(()=>window.evalBook.next());
  await sleep(930);
  const after=await page.evaluate(()=>window.evalBook.currentPage());
  report.flipForward=after>start;
  if(!report.flipForward)report.failures.push('programmatic forward did not advance');
  await page.screenshot({path:path.join(output,label+'-landed.png')});
  await page.evaluate(()=>window.evalBook.previous());
  await sleep(950);
  const prev=await page.evaluate(()=>window.evalBook.currentPage());
  report.flipBack=prev<after;
  if(!report.flipBack)report.failures.push('programmatic back did not reverse');
  const beforeDestroy=await page.evaluate(()=>window.__ltRafRequests);
  await page.evaluate(()=>window.evalBook.destroy());
  await sleep(650);
  const afterDestroy=await page.evaluate(()=>window.__ltRafRequests);
  report.destroyRafDelta=afterDestroy-beforeDestroy;
  if(report.destroyRafDelta>15)report.failures.push('RAF continues after destroy ('+report.destroyRafDelta+')');
  if(errors.length)report.failures.push('browser errors: '+errors.length);
 }catch(e){report.failures.push('fatal: '+String(e.stack||e).slice(0,350));}
 finally{await page.close();}
 report.pass=report.failures.length===0;
 console.log((report.pass?'PASS':'NOT ACCEPTED')+' '+label+' '+JSON.stringify(report));
 return report;
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({
   executablePath:process.env.CHROME||'/usr/bin/chromium',headless:true,
   args:['--no-sandbox','--disable-dev-shm-usage','--enable-webgl',
    '--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const cases=[
   {engine:'st',rtl:false,width:460,height:860},
   {engine:'st',rtl:false,width:1200,height:800},
   {engine:'open',rtl:false,width:460,height:860},
   {engine:'open',rtl:false,width:1200,height:800},
   {engine:'open',rtl:true,width:460,height:860},
   {engine:'open',rtl:true,width:1200,height:800}
  ];
  const results=[];
  for(const c of cases)results.push(await scenario(browser,base,c));
  const summary={
   testDate:new Date().toISOString(),basis:"Lingua Tales authenticated Chapter I bilingual source; Chromium, not actual Android WebView",
   versions:{st:"page-flip@2.0.7",open:"@openpageflip/core@0.7.0"},
   engineResults:results,
   stRtl:"UNSUPPORTED (not tested; library has no native RTL binding option)",
   limitations:[
    "No Android hardware/120Hz and no real user acceptance",
    "Package usability not equivalent to production integration",
    "Button interaction and requestAnimationFrame leak checks are gating candidate metrics",
    "Full app translation/dictionary/page progress integration still must be proven on-device"
   ],
   winner:"NOT SELECTED until all required cases pass and device QA confirms"
  };
  fs.writeFileSync(path.join(output,'comparison.json'),JSON.stringify(summary,null,2));
  const successful=results.filter(x=>x.pass).length;
  console.log('ENGINE COMPARISON: '+successful+'/'+results.length+' scenarios pass; production adoption NOT authorized.');
  if(!results.some(x=>x.engine==='open'&&x.engineLoaded))
   process.exitCode=1;
 }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});