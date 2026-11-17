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
  for(const [rtl,landscape] of [[false,false],[true,false],[false,true],[true,true]]){
   const page=await browser.newPage({viewport:landscape?{width:1200,height:800}:{width:460,height:860}});
   await page.addInitScript(()=>{window.__LT_CURL_V2_TEST__=true;});
   await page.route('**/*',r=>r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.evaluate(rtl=>{
    window.__paperCaptures=[];
    const capture=window.html2canvas;
    window.html2canvas=async(...args)=>{
     const canvas=await capture(...args);window.__paperCaptures.push(canvas);return canvas;
    };
    window.turnEvents=[];for(const name of ['start','progress','commit','cancel'])
     document.addEventListener('lingua:turn'+name,e=>turnEvents.push({name,...e.detail}));
    const id=rtl?'thirteenth-bell-arabic':'last-passenger';
    put('chapter_'+id,0);put('readpage_'+id+'_0',0);openStory(id);
   },rtl);
   await page.evaluate(()=>document.fonts.ready);
   // No html2canvas capture is permitted on a gesture. Idle-prime real faces.
   const primeLiveTurn=delta=>page.evaluate(async delta=>{
    const gpu=window.LinguaCurlV2,host=document.querySelector('#sentences');
    const papers=[...host.querySelectorAll(':scope > .lt-book-page')]
     .filter(node=>!node.classList.contains('lt-curl-snapshot-page'));
    const spread=Number(host.dataset.spread)||1;
    const current=papers.findIndex(node=>node.classList.contains('is-active'));
    const front=papers[delta>0?Math.min(current+spread-1,papers.length-1):current];
    const back=papers[delta>0?current+spread:current-1];
    if(!front||!back)throw new Error('Missing real paper sides for idle priming');
    const rect=front.getBoundingClientRect();
    const options={win:window,host,page:front,back,
     under:papers[delta>0?current+spread+1:current-2]||null,
     stationary:papers[delta>0?(spread===2?current:current-1):current+1]||null,
     width:rect.width,height:rect.height};
    const prepared=await gpu.prime(options);
    return {prepared,ready:gpu.isReady(options)};
   },delta);
   // Exercise the production idle scheduler before any explicit test priming.
   await page.waitForFunction(()=>{
    const host=document.querySelector('#sentences'),papers=[...host.children].filter(n=>n.classList.contains('lt-book-page')&&!n.classList.contains('lt-curl-snapshot-page'));
    const spread=Number(host.dataset.spread)||1,i=papers.findIndex(n=>n.classList.contains('is-active'));
    const front=papers[i+spread-1],r=front?.getBoundingClientRect();
    return front&&LinguaCurlV2.isReady({win:window,host,page:front,back:papers[i+spread],under:papers[i+spread+1],stationary:papers[spread===2?i:i-1],width:r.width,height:r.height});
   },null,{timeout:20000});
   const paperSeam=await page.evaluate(()=>{
    let maxJump=0,worst=null;
    for(const c of __paperCaptures){
     const x=Math.min(12,c.width-2),a=c.getContext('2d').getImageData(x,0,6,c.height).data;
     let previous=null;
     for(let y=20;y<c.height-20;y++){
      let sum=0;for(let x=0;x<6;x++){const i=(y*6+x)*4;sum+=a[i]+a[i+1]+a[i+2];}
      const mean=sum/18;if(previous!==null&&Math.abs(mean-previous)>maxJump){maxJump=Math.abs(mean-previous);worst={y,mean,previous,width:c.width,height:c.height,index:__paperCaptures.indexOf(c)};}previous=mean;
     }
    }
    return {maxJump,worst,captures:__paperCaptures.length};
   });
   for(const [i,data] of (await page.evaluate(()=>__paperCaptures.map(c=>c.toDataURL()))).entries())
    fs.writeFileSync(path.join(out,'paper-capture-'+i+'.png'),Buffer.from(data.split(',')[1],'base64'));
   await page.locator('#sentences').screenshot({path:path.join(out,'paper-before-turn.png')});
   assert.ok(paperSeam.captures>0&&paperSeam.maxJump<12,'horizontal paper raster seam: '+JSON.stringify(paperSeam));
   await page.locator('#sentences').screenshot({path:path.join(out,'gpu-idle-'+(rtl?'rtl':'ltr')+'-'+(landscape?'spread':'portrait')+'.png')});
   // Regression: an earlier GPU upload flipped EVERY printed line vertically
   // despite all gesture and transaction tests passing. Check actual shader
   // pixels: the TOP of the paper must retain its TOP source texels.
   const faceProbe=await page.evaluate(()=>{
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
     const countFaces=(edge,progress)=>{
      renderer.draw(progress,.5,edge);
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
     const phases=[.25,.38,.72];
     const right=phases.map(progress=>({progress,...countFaces('right',progress)}));
     const left=phases.map(progress=>({progress,...countFaces('left',progress)}));
     window.gpuVersoEvidence={right,left};
     return {orientation,right,left};
    }finally{renderer?.destroy();host.remove();}
   });
   assert.ok(faceProbe.orientation,'GPU source texture is vertically inverted: '+JSON.stringify(faceProbe));
   assert.ok([faceProbe.right,faceProbe.left].every(phases=>
    phases.some(face=>face.front>100)&&
    phases.some(face=>face.verso>50)&&
    phases.some(face=>face.front>100&&face.verso>50)),
    'GPU must expose front, verso and a partly folded phase for BOTH edges: '+JSON.stringify(faceProbe));

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
   assert.ok(freshness.bytes<=48*1024*1024,'bound idle snapshot memory');
   assert.equal(freshness.remaining,0,'temporary GPU cache must be releasable');
   const forwardPrime=await primeLiveTurn(1);
   assert.ok(forwardPrime.prepared&&forwardPrime.ready,
    'forward GPU page must be primed BEFORE touch: '+JSON.stringify(forwardPrime));
   // Owner request: grab paper from the interior, hold it indefinitely,
   // steer its diagonal crease up and down, then release it back to rest.
   const residentBefore=await page.evaluate(()=>LinguaCurlV2.cacheStats());
   const freeGrab=await page.evaluate(rtl=>{
    const host=document.querySelector('#sentences');
    host.scrollIntoView({block:'start',behavior:'instant'});
    const box=host.getBoundingClientRect();
    const leaf=host.querySelector(':scope > .lt-book-page.is-active');
    const width=leaf.getBoundingClientRect().width;
    const x=box.left+box.width*.51,y=box.top+Math.min(120,box.height*.24);
    const d=(rtl?1:-1)*Math.min(width*.34,210);
    const send=(type,id,dx=0,dy=0)=>host.dispatchEvent(new PointerEvent(type,{
     bubbles:true,cancelable:true,pointerType:'touch',pointerId:id,isPrimary:true,
     button:0,buttons:type==='pointerup'?0:1,clientX:x+dx,clientY:y+dy
    }));
    const commits=turnEvents.filter(e=>e.name==='commit').length;
    send('pointerdown',77);send('pointerup',77);
    const tapSafe=!LinguaReaderCurl.active&&
     turnEvents.filter(e=>e.name==='commit').length===commits&&
     !host.querySelector('.lt-curl-stage');
    send('pointerdown',78);send('pointermove',78,d,20);
    window.ltFreeGrab={send,d,commits};
    return {tapSafe,d,width};
   },rtl);
   assert.ok(freeGrab.tapSafe,'a stationary interior tap must not turn paper');
   await page.waitForFunction(()=>document.querySelector('.lt-curl-webgl-ready')||
    window.LinguaCurlV2?.lastFailure,{},{timeout:7000});
   assert.equal(await page.locator('.lt-curl-webgl-ready').count(),1,
    'interior horizontal paper hold must use an already-primed GPU sheet');
   await page.waitForTimeout(550); // A true hold never auto-commits on idle.
   const firstHold=await page.evaluate(()=>{
    const progress=turnEvents.filter(e=>e.name==='progress').at(-1);
    return {active:LinguaReaderCurl.active,progress,
     commits:turnEvents.filter(e=>e.name==='commit').length};
   });
   assert.ok(firstHold.active,'the finger-held sheet must remain live while stationary');
   assert.equal(firstHold.commits,0,'holding the paper must not navigate');
   await page.screenshot({path:path.join(out,
    'gpu-curl-free-hold-'+((rtl?'rtl':'ltr')+(landscape?'-spread':'-phone'))+'-first.png')});
   await page.evaluate(()=>window.ltFreeGrab.send('pointermove',78,window.ltFreeGrab.d,205));
   await page.waitForTimeout(120);
   const raisedHold=await page.evaluate(()=>{
    const progress=turnEvents.filter(e=>e.name==='progress').at(-1);
    return {active:LinguaReaderCurl.active,progress,
     staging:document.querySelectorAll('.lt-curl-snapshot-page').length};
   });
   assert.ok(raisedHold.active,'vertical steering must NOT release the held paper');
   assert.ok(raisedHold.progress.grabY>firstHold.progress.grabY+.09,
    'corner grip must track the current finger Y: '+JSON.stringify({firstHold,raisedHold}));
   assert.ok(raisedHold.progress.pullY>firstHold.progress.pullY+.09,
    'diagonal crease must follow actual vertical pull: '+JSON.stringify({firstHold,raisedHold}));
   assert.equal(raisedHold.staging,0,'held movement must not rasterize a new page');
   const residentAfter=await page.evaluate(()=>LinguaCurlV2.cacheStats());
   assert.equal(residentAfter.snapshots,residentBefore.snapshots,'NO capture on touch or drag');
   assert.equal(residentAfter.uploads,residentBefore.uploads,'NO texture upload on touch or drag');
   assert.equal(residentAfter.contexts,residentBefore.contexts,'NO GL context creation on touch or drag');
   await page.screenshot({path:path.join(out,
    'gpu-curl-free-hold-'+((rtl?'rtl':'ltr')+(landscape?'-spread':'-phone'))+'-raised.png')});
   await page.evaluate(()=>{
    const {send,d}=window.ltFreeGrab;
    send('pointermove',78,d*.3,180);
    send('pointerup',78,d*.3,180);
    delete window.ltFreeGrab;
   });
   await page.waitForFunction(()=>!window.LinguaReaderCurl?.active,{},{timeout:5000});
   assert.equal(await page.evaluate(()=>turnEvents.filter(e=>e.name==='commit').length),0,
    'pulling a held sheet back must cancel without changing reading position');
   assert.equal(await page.locator('.lt-curl-stage').count(),0,
    'releasing an interior hold must clean temporary GPU and fallback surfaces');
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
   if(landscape){
    const layout=await page.evaluate(()=>{
     const rect=document.querySelector('#sentences').getBoundingClientRect();
     const nav=document.querySelector('.lt-chapter-nav');
     const nr=nav?.getBoundingClientRect();
     return {left:rect.left,right:rect.right,viewport:innerWidth,
      scrollX:window.scrollX,navTop:nr?.top,bookBottom:rect.bottom};
    });
    assert.ok(layout.left>=-2&&layout.right<=layout.viewport+2,
     'RTL landscape spread clips beyond screen edges: '+JSON.stringify(layout));
    if(Number.isFinite(layout.navTop))
     assert.ok(layout.navTop>=layout.bookBottom-2,
      'Chapter navigation must be below the physical paper: '+JSON.stringify(layout));
   }
   assert.equal(report.canvases,1,'one continuous canvas');
   assert.equal(report.fallbackVisible,false,'old DOM facets must be hidden after GPU preparation');
   await page.screenshot({path:path.join(out,'gpu-curl-'+((rtl?'rtl':'ltr')+(landscape?'-spread':'-portrait'))+'.png')});
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
   // The previous spread's REAL source is display:none when moving backward.
   // Verify that our html2canvas technique still captures its words; otherwise
   // the GPU would curl a blank verso even though the renderer itself works.
   const hiddenInk=await page.evaluate(async()=>{
    const host=document.querySelector('#sentences');
    const hidden=[...host.querySelectorAll(':scope>.lt-book-page')]
     .filter(node=>!node.classList.contains('is-active')&&
      (node.textContent||'').trim().length>150).at(-1);
    const active=host.querySelector(':scope>.lt-book-page.is-active');
    if(!hidden||!active)throw new Error('No substantive inactive page for verso test');
    const rect=active.getBoundingClientRect(),style=getComputedStyle(hidden);
    let serial=0;
    async function snap(withInk){
     const stage=hidden.cloneNode(true),marker='qa-inactive-verso-'+(++serial);
     stage.id=marker;stage.classList.add('lt-curl-snapshot-page');
     stage.classList.remove('is-active','lt-curl-under','lt-pagination-probe');
     stage.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
     stage.querySelectorAll('.tok').forEach(node=>
      node.replaceWith(document.createTextNode(node.textContent)));
     if(!withInk)stage.replaceChildren();
     stage.inert=true;stage.setAttribute('aria-hidden','true');
     for(const key of ['padding','font','color','direction','backgroundColor',
       'backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat']){
      if(style[key])stage.style[key]=style[key];
     }
     for(const [key,value] of Object.entries({
      position:'absolute',left:'0px',top:'0px',display:'block',
      width:rect.width+'px',height:rect.height+'px',
      'min-height':rect.height+'px','max-height':rect.height+'px',
      visibility:'hidden','pointer-events':'none'
     }))stage.style.setProperty(key,value,'important');
     host.appendChild(stage);
     try{
      return await html2canvas(stage,{backgroundColor:null,scale:1,
       logging:false,useCORS:false,allowTaint:false,imageTimeout:3500,
       windowWidth:Math.max(document.documentElement.clientWidth,Math.ceil(rect.width)),
       windowHeight:Math.max(document.documentElement.clientHeight,Math.ceil(rect.height)),
       scrollX:0,scrollY:0,onclone(doc){
        doc.getElementById(marker).style.setProperty('visibility','visible','important');
       }});
     }finally{stage.remove();}
    }
    const ink=await snap(true),empty=await snap(false);
    if(ink.width!==empty.width||ink.height!==empty.height)
     throw new Error('Verso baseline geometry mismatch');
    const a=ink.getContext('2d').getImageData(0,0,ink.width,ink.height).data;
    const b=empty.getContext('2d').getImageData(0,0,empty.width,empty.height).data;
    let difference=0,darker=0;
    for(let i=0;i<a.length;i+=4){
     const delta=Math.max(Math.abs(a[i]-b[i]),Math.abs(a[i+1]-b[i+1]),
      Math.abs(a[i+2]-b[i+2]));
     if(delta>55&&a[i+3]>100)difference++;
     if(a[i]+a[i+1]+a[i+2]<b[i]+b[i+1]+b[i+2]-150)darker++;
    }
    return {words:hidden.textContent.trim().length,
     imageSize:[ink.width,ink.height],difference,darker};
   });
   assert.ok(hiddenInk.difference>350&&hiddenInk.darker>200,
    'inactive real verso must NOT rasterize as blank paper: '+JSON.stringify(hiddenInk));
   const reversePrime=await primeLiveTurn(-1);
   assert.ok(reversePrime.prepared&&reversePrime.ready,
    'reverse GPU paper must be primed BEFORE touch: '+JSON.stringify(reversePrime));
   // Actually drag the other book edge backwards with the GPU renderer:
   // both the page index and underlying live dictionary DOM must survive.
   await page.evaluate(rtl=>{
    const host=document.querySelector('#sentences');
    host.scrollIntoView({block:'start',behavior:'instant'});
    const rect=host.getBoundingClientRect();
    const active=[...host.children].find(n=>n.classList.contains('is-active'));
    const width=active.getBoundingClientRect().width;
    const x=rtl?rect.right-12:rect.left+12;
    const y=rect.top+Math.min(100,rect.height/3);
    const end=x+(rtl?-1:1)*width*.72;
    const fire=(type,px)=>host.dispatchEvent(new PointerEvent(type,{
     bubbles:true,cancelable:true,pointerType:'touch',pointerId:83,isPrimary:true,
     buttons:1,button:0,clientX:px,clientY:y+30
    }));
    fire('pointerdown',x);fire('pointermove',end);
    window.backwardRelease=()=>fire('pointerup',end);
   },rtl);
   await page.waitForFunction(()=>document.querySelector('.lt-curl-webgl-ready')||
    window.LinguaCurlV2?.lastFailure,{},{timeout:15000});
   assert.equal(await page.locator('.lt-curl-webgl-ready').count(),1,
    'backward gesture must use continuous GPU mesh, not just CSS fallback');
   await page.screenshot({path:path.join(out,'gpu-curl-'+
    ((rtl?'rtl':'ltr')+(landscape?'-spread':'-portrait'))+'-reverse.png')});
   await page.evaluate(()=>backwardRelease());
   await page.waitForFunction(()=>!window.LinguaReaderCurl?.active,{},{timeout:5000});
   assert.equal(await page.evaluate(()=>turnEvents.filter(x=>x.name==='commit').length),2,
    'one forward and one backward GPU paper turn');
   assert.equal(await page.locator('.lt-curl-stage').count(),0,
    'reverse gesture must dispose the GPU surface');

   const cancelPrime=await primeLiveTurn(1);
   assert.ok(cancelPrime.prepared&&cancelPrime.ready,
    'cancel acceptance must begin with a warmed real GPU sheet');
   // A short, slow pull must spring back and NOT mutate saved reading position.
   await page.evaluate(rtl=>{
    const host=document.querySelector('#sentences');
    const rect=host.getBoundingClientRect();
    const active=[...host.children].find(n=>n.classList.contains('is-active'));
    const width=active.getBoundingClientRect().width;
    const x=rtl?rect.left+12:rect.right-12;
    const y=rect.top+Math.min(90,rect.height/3);
    const end=x+(rtl?1:-1)*width*.18;
    const fire=(type,px)=>host.dispatchEvent(new PointerEvent(type,{
     bubbles:true,cancelable:true,pointerType:'touch',pointerId:85,isPrimary:true,
     buttons:1,button:0,clientX:px,clientY:y
    }));
    fire('pointerdown',x);fire('pointermove',end);
    window.smallPullRelease=()=>fire('pointerup',end);
   },rtl);
   await page.waitForTimeout(180);
   await page.evaluate(()=>smallPullRelease());
   // The integration job runs this after legacy browser/large-book rendering,
   // which can heavily throttle compositor frames. Still insist on actual
   // spring-back, no navigation and zero orphaned GPU surfaces.
   try{
    await page.waitForFunction(()=>!window.LinguaReaderCurl?.active,{},
     {timeout:12000,polling:100});
   }catch(e){
    const state=await page.evaluate(()=>({
     active:window.LinguaReaderCurl?.active,
     events:window.turnEvents?.map(x=>x.name),
     stages:document.querySelectorAll('.lt-curl-stage').length,
     gpuReady:!!document.querySelector('.lt-curl-webgl-ready'),
     gpuFailure:window.LinguaCurlV2?.lastFailure,
     documentHidden:document.hidden
    }));
    throw new Error('GPU slow cancel did not settle under loaded Chromium: '+
     JSON.stringify(state)+'; '+e.message);
   }
   assert.equal(await page.evaluate(()=>turnEvents.filter(x=>x.name==='commit').length),2,
    'slow incomplete fold must cancel instead of moving to next page');
   assert.equal(await page.locator('.lt-curl-stage').count(),0,
    'cancel must free temporary GPU and HTML paper');

   // Android WebViews sometimes suspend requestAnimationFrame while the
   // document remains visible. A turn must still complete or be cancelable,
   // restoring the original clickable paper instead of getting stuck.
   const starvedPrime=await primeLiveTurn(1);
    assert.ok(starvedPrime.prepared&&starvedPrime.ready,
     'RAF starvation acceptance needs a warmed GPU sheet');
    const priorCommits=await page.evaluate(()=>turnEvents.filter(x=>x.name==='commit').length);
   assert.equal(await page.evaluate(()=>{
    window.__originalRaf=window.requestAnimationFrame;
    window.requestAnimationFrame=()=>0; // Simulated stalled compositor.
    return LinguaReaderCurl.turn(1,'gpu-raf-starved');
   }),true,'RAF-starvation QA requires an actual new forward turn');
   await page.waitForFunction(()=>!window.LinguaReaderCurl?.active,{},
    {timeout:4500,polling:100});
   assert.equal(await page.evaluate(()=>turnEvents.filter(x=>x.name==='commit').length),
    priorCommits+1,'watchdog commits exactly once with zero RAF frames');
   assert.equal(await page.locator('.lt-curl-stage').count(),0,
    'RAF starvation watchdog must restore the interactive source DOM');
   assert.equal(await page.evaluate(()=>LinguaReaderCurl.turn(-1,'watchdog-back')),true);
   assert.equal(await page.evaluate(()=>LinguaReaderCurl.cancelIfActive()),true,
    'native Back cancels the pending watchdog transaction');
   await page.waitForTimeout(1800);
   assert.equal(await page.evaluate(()=>turnEvents.filter(x=>x.name==='commit').length),
    priorCommits+1,'cancelled watchdog must never navigate after a timer fires');
   assert.equal(await page.locator('.lt-curl-stage').count(),0,
    'cancelled watchdog must not retain a GPU canvas');
   await page.evaluate(()=>{window.requestAnimationFrame=window.__originalRaf;delete window.__originalRaf});

   assert.deepEqual(errors,[],'no page JS errors');
   console.log('PASS GPU forward/backward/cancel '+((rtl?'RTL':'LTR')+' '+(landscape?'landscape':'portrait')),report);
   await page.close();
  }
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
