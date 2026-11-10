#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {verifyAndBuild,sourceChapters}=require('./story_art_pilot.cjs');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/art-generation/verne-pilot-scenes.json'),'utf8'));
const ok=verifyAndBuild(data);
assert.equal(ok.queueCount,5);
const book=sourceChapters(2);
assert.equal(book.chapters[0].paragraphs.length,29);
assert.equal(book.chapters[1].paragraphs.length,11);
assert.deepEqual(ok.queue.map(x=>[x.chapterOneBased,x.afterParagraph]),[[1,0],[1,11],[1,19],[2,7],[2,8]]);
assert.ok(ok.queue.every(x=>x.status==='PROMPT_READY_NOT_GENERATED'&&!x.editoriallyApproved));
assert.ok(ok.queue.every(x=>x.prompt.includes('NOT a storyboard')&&x.prompt.includes('modern AI-created art')));
assert.equal(new Set(ok.queue.map(x=>x.sourceParagraphSha256)).size,5);
function reject(modify,reason){
 const copy=JSON.parse(JSON.stringify(data));modify(copy);
 assert.throws(()=>verifyAndBuild(copy),undefined,reason);
}
reject(m=>m.scenes[0].anchorExcerpt='A meeting of the Reform Club to make a wager','invented passage');
reject(m=>m.scenes[0].paragraphZeroBased=19,'wrong paragraph');
reject(m=>m.scenes[3].chapterOneBased=1,'wrong chapter');
reject(m=>m.scenes[3].people=['phantom-actor'],'unknown person');
reject(m=>m.scenes[1].id=m.scenes[0].id,'duplicate ID');
reject(m=>m.scenes[1].paragraphZeroBased=0,'duplicate anchor');
reject(m=>m.releaseApproved=true,'premature release');
reject(m=>m.images=[{generated:true}],'premature image');
reject(m=>m.scenes[0].altAr='','missing Arabic alt');
reject(m=>m.scenes[0].paragraphZeroBased=999,'out of bounds');
console.log('PASS: 5 exact scene+chapter+paragraph anchors, bilingual text, stable character bible, and 10 rejection gates');
