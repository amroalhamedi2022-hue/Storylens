/* Installed Android WebView acceptance; run with a connected emulator and debug APK. */
'use strict';
const {_android}=require('playwright'),assert=require('node:assert/strict');
const fs=require('node:fs');
const out='android-sheet-evidence',pkg='com.storylens.reader.preview';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const [device]=await _android.devices();assert.ok(device,'Android emulator must be connected');
 device.setDefaultTimeout(60000);
 const reports=[];
 try{
  for(const landscape of [false,true]){
   await device.shell('am force-stop '+pkg);
   await device.shell('settings put system accelerometer_rotation 0');
   await device.shell('settings put system user_rotation 0');
   await device.shell('wm size '+(landscape?'1280x800':'460x860'));
   await device.shell('wm density 160');
   await device.shell('am start -n '+pkg+'/com.storylens.reader.MainActivity');
   const view=await device.webView({pkg}),page=await view.page();
   page.on('pageerror',e=>console.error('WebView error',e.message));
   try{
    await page.waitForFunction(()=>typeof openStory==='function'&&typeof catalog!=='undefined'&&catalog.stories?.some(s=>s.id==='last-passenger'),null,{timeout:90000});
   }catch(error){
    console.error('Installed WebView startup',await page.evaluate(()=>({
     url:location.href,title:document.title,userAgent:navigator.userAgent,state:document.readyState,
     reader:typeof openStory,catalog:typeof catalog,screen:document.body?.innerText.slice(0,300)
    })));
    await page.screenshot({path:out+'/startup-failure.png',timeout:10000}).catch(()=>{});
    throw error;
   }
   for(const rtl of [false,true]){
    const tag=(rtl?'rtl':'ltr')+'-'+(landscape?'spread':'portrait');
    await page.evaluate(rtl=>{
     const id=rtl?'thirteenth-bell-arabic':'last-passenger';
     state.inline=false;put('chapter_'+id,0);put('readpage_'+id+'_0',0);put('readpage_anchor_'+id+'_0',0);openStory(id);
     window.androidTurns=[];
     if(!window.androidListener){
      for(const n of ['start','progress','commit','cancel'])document.addEventListener('lingua:turn'+n,e=>androidTurns.push({name:n,...e.detail}));
      window.androidListener=true;
     }
    },rtl);
    await page.evaluate(()=>document.fonts.ready);
    const ready=async delta=>{
     await page.waitForFunction(delta=>{
      const host=document.querySelector('#sentences');if(!host)return false;const ps=[...host.children].filter(n=>n.classList.contains('lt-book-page')&&!n.classList.contains('lt-curl-snapshot-page'));
      const s=Number(host.dataset.spread)||1,i=ps.findIndex(n=>n.classList.contains('is-active'));
      const front=ps[delta>0?i+s-1:i],r=front?.getBoundingClientRect();
      return front&&LinguaCurlV2.isReady({win:window,host,page:front,back:ps[delta>0?i+s:i-1],under:ps[delta>0?i+s+1:i-2],stationary:ps[delta>0?(s===2?i:i-1):i+1],width:r.width,height:r.height});
     },delta,{timeout:60000});
    };
    await ready(1); // No manual prime: production idle scheduler must work.
    await page.evaluate(()=>document.querySelector('#sentences').scrollIntoView({block:'start',behavior:'instant'}));
    await page.screenshot({path:out+'/'+tag+'-idle.png'});
    const before=await page.evaluate(()=>LinguaCurlV2.cacheStats());
    // Trusted touch input delivered through Android WebView's input pipeline.
    const cdp=await page.context().newCDPSession(page);
    const points=await page.evaluate(({rtl,landscape})=>{
     const host=document.querySelector('#sentences'),r=host.getBoundingClientRect();
     const w=host.querySelector('.is-active').getBoundingClientRect().width;
     return {x:rtl?r.left+14:r.right-14,y:Math.max(30,r.top+100),w,travel:w*(landscape?2:1)};
    },{rtl,landscape});
    const sign=rtl?1:-1;
    async function touch(type,progress=0,dy=0){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'||type==='touchCancel'?[]:[{x:points.x+sign*points.travel*progress,y:points.y+dy,id:1}]});}
    await touch('touchStart');await touch('touchMove',.18,15);
    await page.waitForSelector('.lt-curl-webgl-ready');
    const held=await page.evaluate(()=>androidTurns.filter(e=>e.name==='commit').length);
    await page.waitForTimeout(800);
    assert.equal(await page.evaluate(()=>androidTurns.filter(e=>e.name==='commit').length),held,'holding must not commit');
    assert.ok(await page.evaluate(()=>LinguaReaderCurl.active),'Android paper must remain held');
    await page.screenshot({path:out+'/'+tag+'-held.png'});
    await touch('touchMove',.22,160);await touch('touchMove',.08,90);
    await page.screenshot({path:out+'/'+tag+'-reversed.png'});
    await touch('touchCancel');
    await page.waitForFunction(()=>!LinguaReaderCurl.active);
    assert.equal(await page.evaluate(()=>androidTurns.filter(e=>e.name==='commit').length),0,'cancel must preserve page');
    const after=await page.evaluate(()=>LinguaCurlV2.cacheStats());
    for(const k of ['snapshots','uploads','contexts'])assert.equal(after[k],before[k],'no '+k+' during Android held gesture');
    await ready(1);
    await touch('touchStart');
    await page.evaluate(()=>{window.frameGaps=[];window.lastFrame=0;window.measureFrames=true;const tick=t=>{if(lastFrame)frameGaps.push(t-lastFrame);lastFrame=t;if(measureFrames)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
    // For a spread, move >W/2 and release quickly; velocity completes the leaf.
    for(let k=1;k<=12;k++)await touch('touchMove',k*(landscape?.035:.065),20);
    await touch('touchEnd');
    await page.waitForFunction(()=>!LinguaReaderCurl.active,null,{timeout:15000});
    assert.equal(await page.evaluate(()=>androidTurns.filter(e=>e.name==='commit').length),1,'complete Android turn');
    await page.screenshot({path:out+'/'+tag+'-landed.png'});
    await ready(-1);
    // Back through the app's accessible control also exercises reverse mapping.
    await page.locator('.lt-page-prev').click();
    await page.waitForFunction(()=>!LinguaReaderCurl.active);
    assert.equal(await page.evaluate(()=>androidTurns.filter(e=>e.name==='commit').length),2,'reverse navigation');
    const report=await page.evaluate(()=>{
     window.measureFrames=false;
     return {origin:location.origin,automaticGpuAllowed:LinguaCurlV2.snapAllowed(window),viewport:[innerWidth,innerHeight],spread:document.querySelector('#sentences').dataset.spread,
      userAgent:navigator.userAgent,frameGaps,cache:LinguaCurlV2.cacheStats(),warmupWarning:LinguaCurlV2.lastWarmupWarning,
      stages:document.querySelectorAll('.lt-curl-stage').length,liveWords:document.querySelector('#sentences .is-active').textContent.length};
    });
    assert.equal(report.stages,0);assert.ok(report.liveWords>30);
    assert.equal(report.spread,landscape?'2':'1');assert.ok(report.automaticGpuAllowed);
    reports.push({tag,...report,hardware120HzClaim:false});
    fs.writeFileSync(out+'/android-report.json',JSON.stringify(reports,null,2));
    console.log('PASS installed Android WebView '+tag);
    await cdp.detach();
   }
  }
 }finally{await device.close();}
})().catch(e=>{console.error(e);process.exit(1);});
