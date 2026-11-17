'use strict';
const assert=require('node:assert/strict');
const {CurlSpringPhysics,createMesh,VERTEX_SHADER,FRAGMENT_SHADER,snapshotSources}=
 require('../app/src/main/assets/lingua-curl-v2.js');
const front={side:'front'},back={side:'back'};
assert.deepEqual(snapshotSources(front,null),[front],
 'portrait has no duplicate verso and only needs one cached printed face');
assert.deepEqual(snapshotSources(front,back),[front,back],
 'landscape preserves two different printed sides');
assert.deepEqual(snapshotSources(front,front),[front],
 'duplicate source does not trigger a second screenshot');
const source=require('node:fs').readFileSync(
 require('node:path').join(__dirname,'../app/src/main/assets/reader-experience.js'),'utf8');
assert.match(source,/const beneathIndex=spread===2\?\(delta>0\?target\+1:target\):target;/,
 'portrait must expose actual destination under the held paper');
assert.match(VERTEX_SHADER,/#version 300 es/);
assert.match(VERTEX_SHADER,/uCanvasOffset/,'facing-page projection has an offset');
assert.match(VERTEX_SHADER,/oriented-grip/,'crease anchored to the held Y');
assert.match(VERTEX_SHADER,/0\.48/,'point-grip steering has bounded twist');
assert.match(VERTEX_SHADER,/localProgress/,'sheet bend changes with Y, not one uniform cylinder');
assert.match(VERTEX_SHADER,/taper=sin/,'far edge lag vanishes at full turn and at rest');
assert.match(FRAGMENT_SHADER,/gl_FrontFacing/);
assert.match(FRAGMENT_SHADER,/fwidth/,'page-edge antialiasing');
const mesh=createMesh(96,48);
assert.equal(mesh.uv.length,97*49*2);
assert.equal(mesh.indices.length,96*48*6);
assert.ok(Math.max(...mesh.indices)<65536);
assert.ok(mesh.uv.every(Number.isFinite));
for(const hz of [30,60,90,120,144]){
 const spring=new CurlSpringPhysics();
 spring.drag(.21,.7,.18);spring.release(1);
 let done=false;
 for(let i=0;i<hz*3;i++)done=spring.update(1/hz)||done;
 assert.ok(done,'spring forward should settle at '+hz+' Hz');
 assert.equal(spring.progress,1);assert.equal(spring.velocity,0);
 spring.drag(.83,.3,-.15);spring.release(0);
 done=false;
 for(let i=0;i<hz*3;i++)done=spring.update(1/hz)||done;
 assert.ok(done,'spring cancel should settle at '+hz+' Hz');
 assert.equal(spring.progress,0);
}
const held=new CurlSpringPhysics();
held.drag(.33,.91);assert.equal(held.update(.016),false);
assert.equal(held.progress,.33);assert.equal(held.grabY,.91);
console.log('PASS: WebGL2 mesh, shader and bounded paper springs at 30–144Hz');
