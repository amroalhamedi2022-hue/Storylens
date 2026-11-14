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
   // Regression: an earlier GPU upload flipped EVERY printed line vertically
   // despite all gesture and transaction tests passing. Check actual shader
   // pixels: the TOP of the paper must retain its TOP source texels.
   assert.ok(await page.evaluate(()=>{
    const mod=window.LinguaCurlV2,host=document.createElement('div');
    host.style.cssText='position:absolute;left:0;top:0;pointer-events:none';
    document.body.append(host);
    let renderer;
    try{
     renderer=mod.createRenderer(window,host,120,160);
     const paper=document.createElement('canvas');
     paper.width=120;paper.height=160;
     const ctx=paper.getContext('2d');
     ctx.fillStyle='#ff0000';ctx.fillRect(0,0,120,60);
     ctx.fillStyle='#0000ff';ctx.fillRect(0,60,120,100);
     renderer.install(paper,paper);renderer.draw(0,.5,'right');
     const gl=renderer.canvas.getContext('webgl2'),top=new Uint8Array(4),
      bottom=new Uint8Array(4);
     gl.readPixels(60,140,1,1,gl.RGBA,gl.UNSIGNED_BYTE,top);
     gl.readPixels(60,20,1,1,gl.RGBA,gl.UNSIGNED_BYTE,bottom);
     const orientation=top[0]>top[2]*1.5&&bottom[2]>bottom[0]*1.5;
     // Both textures must actually appear. A green verso cannot be replaced
     // by a mirrored red front or a blank strip with a passing gesture test.
     const makeInk=color=>{
      const sheet=document.createElement('canvas');
      sheet.width=120;sheet.height=160;
      const pen=sheet.getContext('2d');pen.fillStyle=color;
      pen.fillRect(0,0,120,160);return sheet;
     };
     renderer.install(makeInk('#eb2222'),makeInk('#18eb18'));
     const countFaces=edge=>{
      renderer.draw(.72,.5,edge);
      const pixels=new Uint8Array(120*160*4);
      gl.readPixels(0,0,120,160,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      let front=0,verso=0;
      for(let i=0;i<pixels.length;i+=4){
       const red=pixels[i],green=pixels[i+1],blue=pixels[i+2],alpha=pixels[i+3];
       if(alpha<80)continue;
       if(red>green*1.7&&red>blue*1.7)front++;
       if(green>red*1.7&&green>blue*1.7)verso++;
      }
      return {front,verso};
     };
     const right=countFaces('right'),left=countFaces('left');
     window.gpuVersoEvidence={right,left};
     return orientation&&[right,left].every(face=>face.front>100&&face.verso>50);
    }finally{renderer?.destroy();host.remove();}
   }),'GPU shader must NOT vertically invert printed pages');

   await page.waitForTimeout(350);
   // The visible sheet is mutable (font, translation, colors, inline art).
   // Verify cached GPU screenshots refresh rather than reusing stale ink.
   const freshness=await page.evaluate(async()=>{
    const v2=window.LinguaCurlV2,host=document.querySelector('#sentences');
    const pages=[...host.querySelectorAll(':scope > .lt-book-page')]
     .filter(node=>!node.classList.contains('lt-curl-snapshot-page'));
    const front=pages.find(node=>node.classList.contains('is-active'));
    const next=pages[pages.indexOf(front)+1];
    if(!front||!next)throw new Error('No adjacent source page for texture QA');
    const rect=front.getBoundingClientRect(),options={
     win:window,host,page:front,back:next,width:rect.width,height:rect.height
    };
    const first=await v2.prime(options),before=v2.cacheStats();
    const sentence=front.querySelector('.sentence');
    if(!sentence)throw new Error('Missing real text for cache freshness QA');
    const qaStamp=document.createElement('span');
    qaStamp.textContent=' GPU snapshot freshness QA';
    sentence.appendChild(qaStamp);
    const second=await v2.prime(options),changed=v2.cacheStats();
    qaStamp.remove();
    const restored=await v2.prime(options),after=v2.cacheStats();
    // Test computed CSS changes with !important, rather than setting a
    // lower-priority inline color that existing author !important overrides.
    const beforeStyle=v2.snapshotSignature(window,front);
    const oldColor=front.style.getPropertyValue('color');
    const oldPriority=front.style.getPropertyPriority('color');
    front.style.setProperty('color','rgb(19, 86, 141)','important');
    const styleChanged=v2.snapshotSignature(window,front)!==beforeStyle;
    if(oldColor)front.style.setProperty('color',oldColor,oldPriority);
    else front.style.removeProperty('color');
    const freed=v2.clearCache(),empty=v2.cacheStats();
    return {first,second,restored,styleChanged,
     before:before.snapshots,changed:changed.snapshots,after:after.snapshots,
     bytes:after.estimatedBytes,freed,remaining:empty.pages};
   });
   assert.equal(freshness.first,true,'offline warmup must capture real pages');
   assert.equal(freshness.second,true,'changing visible page ink must recapture');
   assert.equal(freshness.restored,true,'restoring the original text must recapture');
   assert.ok(freshness.changed>freshness.before,'stale text cache must invalidate');
   assert.equal(freshness.styleChanged,true,'computed theme changes must invalidate cache keys');
   assert.ok(freshness.after>freshness.changed,'restored page texture must refresh');
   assert.ok(freshness.bytes<=24*1024*1024,'bound idle snapshot memory');
   assert.equal(freshness.remaining,0,'temporary GPU cache must be releasable');
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
