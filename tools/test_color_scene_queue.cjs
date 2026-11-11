#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {verify,run}=require('./prepare_color_scene_queue.cjs');
const doc=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/art-generation/visual-bibles/colored-victorian/next-scene-briefs.json'),'utf8'));
const q=verify(doc);
assert.equal(q.queueCount,6);
assert.deepEqual(Array.from(q.queue,x=>[x.chapterOneBased,x.afterParagraph]),[[1,0],[1,19],[2,8],[3,58],[4,18],[4,20]]);
assert.equal(new Set(q.queue.map(x=>x.sourceParagraphSha256)).size,6);
assert.ok(q.queue.every(x=>x.status==='PROMPT_READY_NOT_GENERATED'&&!x.generated&&!x.releaseApproved));
assert.ok(q.queue.every(x=>x.altAr.length>=15&&x.altEn.length>=15));
assert.ok(q.queue.every(x=>x.prompt.includes('SINGLE-FRAME')&&x.prompt.includes('ORIGINAL TEXT GROUNDING')&&x.sourceTextAr.length>15));
assert.ok(q.queue.some(x=>x.chapterOneBased===3&&x.prompt.includes('twenty thousand pounds')));
assert.ok(q.queue.some(x=>x.chapterOneBased===4&&x.prompt.includes('Passepartout')));
function reject(mutator){const m=JSON.parse(JSON.stringify(doc));mutator(m);assert.throws(()=>verify(m));}
reject(m=>m.scenes[3].chapterOneBased=1); // wager is Chapter III
reject(m=>m.scenes[3].afterParagraph=19);
reject(m=>m.scenes[0].sourceExcerpt='Invented giant hot air balloon');
reject(m=>m.scenes[0].altAr='');
reject(m=>m.scenes[0].altEn='');
reject(m=>m.scenes[0].generated=true);
reject(m=>m.scenes[0].editoriallyApproved=true);
reject(m=>m.scenes[0].releaseApproved=true);
reject(m=>m.scenes[0].id=m.scenes[1].id);
reject(m=>m.scenes[1].afterParagraph=0);
reject(m=>m.scenes[2].afterParagraph=999);
reject(m=>m.characters.phileasFogg='dark-haired clean shaven man');
reject(m=>m.scenes.pop());
reject(m=>m.scenes[3].description='too short');
const a=run(['--check']);assert.equal(a.queueCount,6);
console.log('PASS: 6 original chapter I-IV anchors and 12 fail-closed source/approval/identity tests');