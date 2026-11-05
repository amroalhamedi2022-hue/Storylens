'use strict';
const assert=require('node:assert/strict');
const {geometry,shouldCommit,edgeDelta,spreadStart}=require('../app/src/main/assets/physical-page-curl.js');
function area(poly){return Math.abs(poly.reduce((a,p,i)=>{const q=poly[(i+1)%poly.length];return a+p.x*q.y-q.x*p.y},0))/2;}
function transform(f,p){const m=f.matrix;return [m[0]*p.x+m[4]*p.y+m[12],m[1]*p.x+m[5]*p.y+m[13],m[2]*p.x+m[6]*p.y+m[14]];}
for(const w of [240,510,800])for(const h of [400,850])for(const d of [0,8,w*.3,w,w*1.8,2*w])for(const y of [0,h/2,h])for(const dy of [-180,0,180]){
 const a=geometry(w,h,d,dy,y,'right'),b=geometry(w,h,d,dy,y,'left');
 assert.equal(a.facets.length,22);
 assert.ok(Math.abs(a.facets.reduce((s,f)=>s+area(f.polygon),0)-w*h)<.001,'facets partition the whole HTML sheet, without holes');
 a.facets.forEach((f,i)=>{
  assert.ok(f.matrix.every(Number.isFinite),'no singular matrix at corners or rest');
  f.polygon.forEach((p,j)=>{
   const q=b.facets[i].polygon[j];assert.ok(Math.abs(q.x-(w-p.x))<1e-7);
   const A=transform(f,p),B=transform(b.facets[i],q);
   assert.ok(Math.abs(B[0]-(w-A[0]))<1e-5&&Math.abs(B[1]-A[1])<1e-5,'mirrored RTL/LTR physical coordinates');
  });
 });
}
const half=geometry(600,800,320,80,60);
assert.ok(new Set(half.facets.filter(f=>f.polygon.length).map(f=>f.matrix[0].toFixed(3))).size>8,'many distinct local tangents, not one rotating card');
assert.ok(half.facets.at(-1).polygon.length>=3,'broad reverse face exists');
assert.equal(edgeDelta('right',false),1);assert.equal(edgeDelta('left',true),1);
assert.equal(edgeDelta('left',false),-1);assert.equal(edgeDelta('right',true),-1);
assert.deepEqual([0,1,2,3,4].map(p=>spreadStart(p,2)),[0,0,2,2,4]);
assert.equal(spreadStart(3,1),3);
assert.equal(shouldCommit(350,600,0),true);
assert.equal(shouldCommit(100,600,0),false);
assert.equal(shouldCommit(100,600,.8),true);
assert.equal(shouldCommit(350,600,-.8),false,'reversed fast release cancels');
assert.equal(shouldCommit(10,600,2),false,'tiny accidental flick does not turn');
console.log('PASS: 972 geometric configurations, complete sheet coverage, finite corner matrices, mirror binding, spreads and release intent');
