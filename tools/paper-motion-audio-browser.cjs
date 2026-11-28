'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME,headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  const sample='app/src/main/assets/licensed-audio/page-turn.ogg';
  await page.route('https://paper.test/**',route=>{
   if(route.request().url().endsWith('/page-turn.ogg'))return route.fulfill({path:sample,contentType:'audio/ogg'});
   return route.fulfill({contentType:'text/html',body:'<html><body>Paper audio probe</body></html>'});
  });
  await page.goto('https://paper.test/');
  await page.evaluate(()=>{
   window.clock=0;window.decoded=false;
   const ctx=window.offline=new OfflineAudioContext(1,48000,48000);
   // Render the production graph with a repeatable timeline of physical turns.
   window.AudioContext=class {
    get currentTime(){return window.clock;}
    get state(){return 'running';}
    get destination(){return ctx.destination;}
    createBuffer(...args){return ctx.createBuffer(...args);}
    createBufferSource(){window.paperSources=(window.paperSources||0)+1;return ctx.createBufferSource();}
    createGain(){return ctx.createGain();}
    async decodeAudioData(bytes){const b=await ctx.decodeAudioData(bytes);window.decoded=true;return b;}
   };
  });
  await page.addScriptTag({path:'app/src/main/assets/lingua-licensed-audio.js'});
  await page.mouse.click(10,10);
  await page.waitForFunction(()=>window.decoded);
  const levels=await page.evaluate(async()=>{
   const event=(name,progress,time)=>{window.clock=time;document.dispatchEvent(new CustomEvent('lingua:turn'+name,{detail:{id:1,progress,pullY:0}}));};
   event('start',0,0);
   event('progress',.24,.08);event('progress',.45,.18);
   event('progress',.45,.4);
   event('progress',.20,.56);event('cancel',.20,.64);
   event('progress',.6,.84);
   const data=(await offline.startRendering()).getChannelData(0);
   function peak(a,b){return data.subarray(a*48000,b*48000).reduce((n,x)=>Math.max(n,Math.abs(x)),0);}
   return {sources:window.paperSources,forward:peak(.08,.30),hold:peak(.34,.55),reverse:peak(.56,.7),afterCancel:peak(.75,.99)};
  });
  assert.equal(levels.sources,1);
  assert.ok(levels.forward>.001&&levels.reverse>.001);
  assert.equal(levels.hold,0);assert.equal(levels.afterCancel,0);
  console.log('PASS rendered packaged paper audio',levels);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
