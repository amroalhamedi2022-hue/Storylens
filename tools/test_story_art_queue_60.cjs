#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {verified,next,status,imageSize,record,reject,retry,main}=require('./story_art_queue_60.cjs');
const v=verified();
const counts=status(v);
assert.equal(counts.total,60);
assert.equal(counts.sourceVerified,7);
assert.equal(counts.existingReview,1);
assert.equal(counts.ready,6);
assert.equal(counts.needsSource,33);
assert.equal(counts.needsSegmentation,20);
assert.equal(counts.generatedCandidate,0);
assert.equal(counts.readerIntegrated,0);
assert.equal(v.q.items.length,new Set(v.q.items.map(x=>x.queueId)).size);
for(const item of v.q.items.slice(7)){
 assert.equal(item.sceneId,null);
 assert.equal(item.sourceExcerpt,null);
 assert.equal(item.paragraphZeroBased,null);
}
for(const scene of v.q.items.slice(0,6)) {
 const original=v.colorMap.get(scene.sceneId);
 assert.ok(original);
 assert.equal(original.chapterOneBased,scene.chapterOneBased);
 assert.equal(original.afterParagraph,scene.paragraphZeroBased);
 assert.equal(original.sourceExcerpt,scene.sourceExcerpt);
 assert.ok(original.prompt.includes('ORIGINAL TEXT GROUNDING'));
}
const seventh=v.q.items[6];
assert.equal(seventh.queueId,'verne-007');
assert.equal(seventh.chapterOneBased,5);
assert.equal(seventh.paragraphZeroBased,8);
assert.equal(v.colorMap.get(seventh.sceneId).sourceExcerpt,seventh.sourceExcerpt);
assert.equal(v.colorMap.get(seventh.sceneId).chapterOneBased,5);
assert.equal(v.colorMap.get(seventh.sceneId).status,'PROMPT_READY_NOT_GENERATED');
const decision=next(v);
assert.equal(decision.ready,true);
assert.equal(decision.queueId,'verne-007');
assert.equal(decision.sceneId,'verne-ch05-color-telegram-arrives');
assert.deepEqual(decision.charactersPresent,[]);
assert.equal(decision.chapter,5);
assert.throws(()=>imageSize(Buffer.from('image-but-not-webp')),/not substantial WebP/);
assert.throws(()=>reject(v,'verne-003','invalid lowercase'),/UPPERCASE_FAILURE_REASON/);
assert.throws(()=>reject(v,'nonexistent-000','SCENE_MISMATCH'),/unverified\/unknown/);
const rejectedCopy=structuredClone(v);
rejectedCopy.s.attempts['verne-002']={status:'rejected',count:2,reason:'IMAGE_ADAPTER_FAILED'};
assert.equal(next(rejectedCopy).blocks.some(x=>x.queueId==='verne-002'),false);
assert.equal(next(rejectedCopy).ready,false);
// Negative tests must not mutate the real state.
assert.throws(()=>retry(v,'verne-002'),/must be explicitly rejected/);
const mocked={...v,s:{...v.s,attempts:{'verne-002':{status:'rejected',count:2}}}};
assert.throws(()=>retry(mocked,'verne-002'),/attempt budget exhausted/);
const mockedOnce={...v,s:{...v.s,attempts:{'verne-002':{status:'rejected',count:1}}}};
assert.throws(()=>retry(mockedOnce,'verne-002'),/CHARACTER_REFERENCE_NOT_APPROVED/);
assert.throws(()=>record(v,'verne-002','docs/art-generation/review/wrong-dir/file.webp'),/ENOENT|canonical scene path/);
const old=process.env.STORY_ART_AUTOGEN_APPROVED;
delete process.env.STORY_ART_AUTOGEN_APPROVED;
assert.throws(()=>main(['--produce']),/not explicitly authorized/);
if(old!==undefined)process.env.STORY_ART_AUTOGEN_APPROVED=old;
console.log('PASS: 60 unique queue slots, 7 source-verified prompts incl. original chapter V, one unblocked environment scene, safety gates remain');
