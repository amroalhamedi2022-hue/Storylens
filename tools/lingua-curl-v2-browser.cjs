/* GPU real reader tests: NODE_PATH=<playwright>/node_modules node tools/lingua-curl-v2-browser.cjs */
'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assets=path.resolve('app/src/main/assets'),out=process.env.CURL_SCREENSHOTS||'qa-screenshots';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.resolve(assets,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(assets+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.ttf':'font/ttf','.woff2':'font/woff2'};
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/chromium',
  headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
   '--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const url='http://127.0.0.1:'+server.address().port+'/index.html';
 try{
  for(const rtl of [false,true]){
   const page=await browser.newPage({viewport:rtl?{width:1200,height:800}:{width:460,height:860}});
   await page.addInitScript(()=>{window.__LT_CURL_V2_TEST__=true;});
   await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.evaluate(rtl=>{
    window.turnEvents=[];for(const name of ['start','commit','cancel'])
     document.addEventListener('lingua:turn'+name,e=>turnEvents.push({name,...e.detail}));
    const id=rtl?'thirteenth-bell-arabic':'last-passenger';
    put('chapter_'+id,0);put('readpage_'+id+'_0',0);openStory(id);
   },rtl);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(350);
   await page.evaluate(rtl=>{
    const host=document.querySelector('#sentences');host.scrollIntoView({block:'start',behavior:'instant'});
    const box=host.getBoundingClientRect();
    const active=[...host.children].filter(n=>n.classList.contains('is-active'));
    const w=active[0].getBoundingClientRect().width,x=rtl?box.left+12:box.right-12;
    const y=box.top+Math.min(100,box.height/3),d=(rtl?1:-1)*w*.65;
    const dispatch=(type,x,y)=>host.dispatchEvent(new PointerEvent(type,{
     bubbles:true,cancelable:true,pointerType:'touch',pointerId:81,isPrimary:true,
     buttons:1,button:0,clientX:x,clientY:y
    }));
    dispatch('pointerdown',x,y);dispatch('pointermove',x+d,y+45);
    window.webglRelease=()=>dispatch('pointerup',x+d,y+45);
   },rtl);
   await page.waitForFunction(()=>document.querySelector('.lt-curl-webgl-ready')||
    window.LinguaCurlV2?.lastFailure,{},{timeout:15000});
   const report=await page.evaluate(()=>({
    failure:window.LinguaCurlV2.lastFailure,
    ready:!!document.querySelector('.lt-curl-webgl-ready'),
    canvases:document.querySelectorAll('.lt-curl-webgl:not([hidden])').length,
    fallbackVisible:[...document.querySelectorAll('.lt-curl-facet')].some(
     node=>getComputedStyle(node).display!=='none')
   }));
   assert.ok(report.ready,'WebGL2 texture capture failed: '+JSON.stringify(report));
   assert.equal(report.canvases,1,'one continuous canvas');
   assert.equal(report.fallbackVisible,false,'old DOM facets must be hidden after GPU preparation');
   await page.screenshot({path:path.join(out,'gpu-curl-'+(rtl?'rtl-spread':'ltr-portrait')+'.png')});
   await page.evaluate(()=>webglRelease());
   await page.waitForFunction(()=>!window.LinguaReaderCurl?.active,{},{timeout:5000});
   const counts=await page.evaluate(()=>({
    commits:turnEvents.filter(x=>x.name==='commit').length,
    liveInk:document.querySelectorAll('#sentences > .is-active .sentence').length,
    staging:document.querySelectorAll('.lt-curl-snapshot-page').length,
    activeStage:document.querySelectorAll('.lt-curl-stage').length
   }));
   assert.equal(counts.commits,1,'exactly one turn event');
   assert.ok(counts.liveInk>0,'interactive source ink remains');
   assert.equal(counts.staging,0,'temporary snapshots cleaned');
   assert.equal(counts.activeStage,0,'WebGL and DOM sheets cleaned');
   assert.deepEqual(errors,[],'no page JS errors');
   console.log('PASS GPU curl '+(rtl?'RTL landscape':'LTR portrait'),report);
   await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
