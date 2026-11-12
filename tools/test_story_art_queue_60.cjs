#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const {verified,next,status,imageSize,reject,main}=require('./story_art_queue_60.cjs');
const v=verified();
const counts=status(v);
assert.equal(counts.total,60);
assert.equal(counts.sourceVerified,6);
assert.equal(counts.existingReview,1);
assert.equal(counts.ready,5);
assert.equal(counts.needsSource,34);
assert.equal(counts.needsSegmentation,20);
assert.equal(counts.generatedCandidate,0);
assert.equal(counts.readerIntegrated,0);
assert.equal(v.q.items.length,new Set(v.q.items.map(x=>x.queueId)).size);
for(const item of v.q.items.slice(6)){
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
const decision=next(v);
assert.equal(decision.ready,false);
assert.equal(decision.reason,'PRECONDITIONS_NOT_MET');
assert.ok(decision.blocks.some(x=>x.reason==='SCENE_PROMPT_NOT_BOUND'));
assert.ok(decision.blocks.some(x=>x.reason==='CHARACTER_REFERENCE_NOT_APPROVED'));
assert.throws(()=>imageSize(Buffer.from('image-but-not-webp')),/not substantial WebP/);
assert.throws(()=>reject(v,'verne-003','invalid lowercase'),/UPPERCASE_FAILURE_REASON/);
assert.throws(()=>reject(v,'nonexistent-000','SCENE_MISMATCH'),/unverified\/unknown/);
const old=process.env.STORY_ART_AUTOGEN_APPROVED;
delete process.env.STORY_ART_AUTOGEN_APPROVED;
assert.throws(()=>main(['--produce']),/not explicitly authorized/);
if(old!==undefined)process.env.STORY_ART_AUTOGEN_APPROVED=old;
console.log('PASS: 60 unique queue slots, 6 source-proven prompts, no duplicate candidate, identity guards, blocked unsafe image/paid calls');
