'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const out=process.env.CURL_SCREENSHOTS||'qa-screenshots';fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/chromium',headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1000,height:700}});
  await page.setContent('<body style="margin:0;background:#53504b"><div id="book"></div></body>');
  await page.addScriptTag({path:'app/src/main/assets/lingua-curl-v2.js'});
  const result=await page.evaluate(()=>{
   const host=document.querySelector('#book'),w=400,h=600;
   const colors=['#e42b25','#1ab731','#2458dc','#e6bd22'];
   function texture(name){const c=document.createElement('canvas');c.width=w;c.height=h;
    const ctx=c.getContext('2d');for(let i=0;i<4;i++){ctx.fillStyle=colors[i];ctx.fillRect(i%2*w/2,Math.floor(i/2)*h/2,w/2,h/2);}
    ctx.fillStyle='white';ctx.font='28px serif';ctx.fillText(name,30,100);return c;}
   const engine=LinguaCurlV2.createRenderer(window,host,w,h),front=texture('FRONT 12 →'),back=texture('BACK 13 →');
   engine.prepare('front',front);engine.prepare('back',back);
   engine.prepare('under',texture('UNDER 14 →'));engine.prepare('stationary',texture('STATIONARY 11 →'));
   const gl=engine.canvas.getContext('webgl2');
   let meshUploads=0;
   const upload=gl.bufferSubData.bind(gl);
   gl.bufferSubData=(...args)=>{meshUploads++;return upload(...args);};
   function sample(x,y){const data=new Uint8Array(4);gl.readPixels(x,engine.canvas.height-1-y,1,1,gl.RGBA,gl.UNSIGNED_BYTE,data);return Array.from(data);}
   const report=[];
   for(const edge of ['left','right'])for(const portrait of [false,true]){
    engine.use({page:'front',back:'back',under:'under',stationary:'stationary',portrait});
    engine.viewport(portrait?w:w*2,h,portrait?0:edge==='right'?w:0,0);
    const startUploads=meshUploads;
    engine.draw(0,.5,edge);
    const origin=portrait?0:edge==='right'?w:0;
    const before=[sample(origin+100,150),sample(origin+300,150),sample(origin+100,450),sample(origin+300,450)];
    engine.draw(1,.9,edge,.4);
    const dest=portrait?0:edge==='right'?0:w;
    const after=[sample(dest+100,150),sample(dest+300,150),sample(dest+100,450),sample(dest+300,450)];
    report.push({edge,portrait,before,after,meshUploads:meshUploads-startUploads});
   }
   window.probe={engine,w,h};return report;
  });
  for(const row of result)assert.equal(row.meshUploads,2,'one dynamic mesh upload per frame across all shadow passes');
  for(const row of result)assert.deepEqual(row.after,row.before,'verso must land exactly upright, unmirrored, full-width: '+JSON.stringify(row));
  for(const portrait of [false,true])for(const edge of ['left','right'])for(const progress of [0,.1,.25,.5,.75,.99,1]){
   await page.evaluate(({portrait,edge,progress})=>{
    const {engine,w,h}=probe;engine.use({page:'front',back:'back',under:'under',stationary:'stationary',portrait});
    engine.viewport(portrait?w:w*2,h,portrait?0:edge==='right'?w:0,0);
    engine.draw(progress,.25,edge,.13);
   },{portrait,edge,progress});
   await page.screenshot({path:path.join(out,`sheet-${portrait?'portrait':'spread'}-${edge}-${progress}.png`)});
  }
  fs.writeFileSync(path.join(out,'sheet-pixel-evidence.json'),JSON.stringify(result,null,2));
  console.log('PASS exact front/verso color and orientation at flat endpoints: both edges, both layouts');
  await page.evaluate(()=>probe.engine.destroy());
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
