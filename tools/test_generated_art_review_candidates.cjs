#!/usr/bin/env node
/* Real image binaries committed to Git: validate against actual source prose
 * and immutable real WebP checksums. No fake/generated placeholder counts.
 */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {sourceChapters}=require('./story_art_pilot.cjs');
const repo=path.resolve(__dirname,'..');
const m=JSON.parse(fs.readFileSync(path.join(repo,'docs/art-generation/review/2026-11-10/candidate-manifest.json'),'utf8'));
const plan=JSON.parse(fs.readFileSync(path.join(repo,'docs/art-generation/verne-pilot-scenes.json'),'utf8'));
const chapters=sourceChapters(1).chapters;
assert.equal(m.schemaVersion,1);
assert.equal(m.releaseApproved,false);
assert.equal(m.images.length,2,'Two actual independent single-frame files expected');
assert.equal(plan.scenes.length,5,'New verified Fogg reading scene must exist in production prompt plan');
const ids=new Set(),files=new Set();
function safeFile(f){
 assert.match(f.path,/^docs\/art-generation\/review\/2026-11-10\/verne-ch01-[a-z-]+-(?:full|mobile)\.webp$/);
 const target=path.resolve(repo,f.path);
 assert.ok(target.startsWith(path.join(repo,'docs/art-generation/review/2026-11-10')+path.sep));
 assert.ok(!fs.lstatSync(target).isSymbolicLink());
 const data=fs.readFileSync(target);
 assert.equal(data.length,f.bytes);
 assert.equal(data.subarray(0,4).toString('ascii'),'RIFF','WebP RIFF');
 assert.equal(data.subarray(8,12).toString('ascii'),'WEBP','WebP signature');
 assert.equal(data.readUInt32LE(4)+8,data.length,'Real WebP RIFF length');
 assert.match(data.subarray(12,16).toString('ascii'),/^VP8 |^VP8L|^VP8X/,'WebP frame chunk');
 assert.equal(crypto.createHash('sha256').update(data).digest('hex'),f.sha256);
 assert.ok(f.width>=960&&f.height>=640);
 assert.ok(data.length>120000,'No tiny placeholder or empty image bytes');
 assert.ok(!files.has(f.path),'Duplicate filename');
 files.add(f.path);
 return data;
}
for(const s of m.images){
 assert.equal(s.chapterOneBased,1);
 assert.ok(s.generated===true&&s.editoriallyApproved===false&&
           s.ownerImageApproved===false&&s.imageRightsReviewed===false&&
           s.distributionReviewApproved===false&&s.releaseApproved===false);
 assert.ok(!ids.has(s.sceneId));ids.add(s.sceneId);
 const scene=plan.scenes.find(item=>item.id===s.sceneId);
 assert.ok(scene,'Each generated image scene has an actual verifiable prompt plan');
 assert.equal(scene.paragraphZeroBased,s.afterParagraph);
 const original=chapters[0].paragraphs[s.afterParagraph].en;
 assert.ok(original.includes(s.sourceExcerpt),'Full original source paragraph must support scene');
 assert.equal(crypto.createHash('sha256').update(original,'utf8').digest('hex'),s.sourceParagraphSha256);
 assert.ok(s.altAr&&s.altEn&&s.imageRightsNote);
 assert.ok(s.reviewStatus&&s.reviewStatus!=='READY_FOR_UI'&&s.reviewStatus!=='APPROVED');
 const a=safeFile(s.full),b=safeFile(s.mobile);
 assert.notEqual(crypto.createHash('sha256').update(a).digest('hex'),crypto.createHash('sha256').update(b).digest('hex'));
}
assert.equal(files.size,4,'Four actual nonduplicate WebP image binaries in Git');
assert.equal(m.images.find(x=>x.sceneId==='verne-ch01-fogg-reading').reviewStatus,'REQUIRES_REGENERATION','Do not accept visual character mismatch');
const approved=JSON.parse(fs.readFileSync(path.join(repo,'docs/art-generation/approved/generated-art-release.json'),'utf8'));
assert.equal(approved.releaseApproved,false);assert.equal(approved.images.length,0,'NO unapproved previews shipped');
console.log('PASS: 4 REAL Git-backed WebPs, two authentic source/paragraph SHA anchors, 5-scene plan, explicit no-release and character rejection');
