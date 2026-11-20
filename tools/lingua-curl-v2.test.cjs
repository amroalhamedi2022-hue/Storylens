'use strict';
const assert=require('node:assert/strict');
const {CurlSpringPhysics,createMesh,VERTEX_SHADER,FRAGMENT_SHADER,snapshotSources}=
 require('../app/src/main/assets/lingua-curl-v2.js');
const front={side:'front'},back={side:'back'};
assert.deepEqual(snapshotSources(front,null),[front],
 'an unprinted boundary needs only one cached printed face');
assert.deepEqual(snapshotSources(front,back),[front,back],
 'a physical leaf preserves two different printed sides');
assert.deepEqual(snapshotSources(front,front),[front],
 'duplicate source does not trigger a second screenshot');
assert.match(VERTEX_SHADER,/#version 300 es/);
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
