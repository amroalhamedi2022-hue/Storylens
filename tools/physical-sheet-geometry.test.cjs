'use strict';
const assert=require('node:assert/strict');
const {sheetGeometry,portraitProgress}=require('../app/src/main/assets/lingua-curl-v2.js');
let cases=0,maxVertices=0,maxBindingError=0,maxAreaError=0;
const close=(a,b,t=1e-3)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
for(const [w,h] of [[360,720],[600,800],[760,390]])
 for(const p of [0,.00001,.01,.1,.25,.5,.75,.9,.99,.99999,1])
 for(const y of [0,.25,.5,.75,1])for(const dy of [-.9,-.2,0,.2,.9])for(const edge of ['left','right']){
  const g=sheetGeometry(w,h,p,y,dy,edge);cases++;
  assert.ok(g.vertices.every(Number.isFinite));maxVertices=Math.max(maxVertices,g.vertices.length/8);
  // Integrate triangle areas in MATERIAL coordinates: every source pixel is
  // present once, including extreme near-flat folds and diagonal corner pulls.
  let area=0;
  for(let i=0;i<g.vertices.length;i+=24){
   const a=g.vertices.subarray(i+6,i+8),b=g.vertices.subarray(i+14,i+16),c=g.vertices.subarray(i+22,i+24);
   area+=Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))/2;
  }
  maxAreaError=Math.max(maxAreaError,Math.abs(area-1));close(area,1,1e-5);
  for(const v of [0,h/3,h]){
   const point=g.deform(0,v),binding=edge==='left'?w:0;
   maxBindingError=Math.max(maxBindingError,Math.hypot(point[0]-binding,point[1]-v,point[2]));
   close(point[0],binding);close(point[1],v);close(point[2],0);
  }
  for(const x of [0,w*.3,w])for(const v of [0,h*.7,h]){
   const point=g.deform(x,v);
   close(Math.hypot(...point.slice(3,6)),1);
   if(p===0){close(point[0],edge==='left'?w-x:x);close(point[1],v);close(point[2],0);}
   if(p===1){close(point[0],edge==='left'?w+x:-x);close(point[1],v);close(point[2],0);}
  }
 }
const start=performance.now();for(let i=0;i<1000;i++)sheetGeometry(600,800,(i%999+1)/1000,.3,.1);
console.log(JSON.stringify({cases,maxVertices,maxBindingError,maxAreaError,cpuMeanMs:(performance.now()-start)/1000,
 note:'CPU geometry throughput on build machine, NOT Android FPS'}));

for(let i=0;i<=1000;i++){
 const q=i/1000,p=portraitProgress(q),camera=p*p*(3-2*p);
 close(2*p-camera,q,1e-6); // screen tip is exactly width * (1-q)
}
console.log('PASS portrait camera inversion: 1001 screen-space finger positions');
