#!/usr/bin/env node
/* Strict visual STYLE reference batch: checks real bytes + rejection flags. */
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../docs/art-generation/visual-bibles/colored-victorian/batch-20261111');
const d=JSON.parse(fs.readFileSync(path.join(ROOT,'manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(ROOT,'review.html'),'utf8');
assert.equal(d.schemaVersion,1);
assert.equal(d.releaseApproved,false);
assert.equal(d.forReader,false);
assert.equal(d.images.length,2);
assert.ok(!/fetch\s*\(|https?:\/\/|XMLHttpRequest/i.test(html),'the review must be fully offline');
const seen=new Set();
for(const image of d.images){
 assert.equal(image.kind,'AI_GENERATED_COLORED_MOODBOARD_ONLY');
 assert.equal(image.sourceAccurate,false);
 for(const flag of ['editoriallyApproved','ownerImageApproved','imageRightsReviewed','distributionReviewApproved','releaseApproved'])
  assert.equal(image[flag],false,'approval prohibited for style-only art');
 assert.match(image.filename,/^[a-z-]+\.webp$/);
 assert.ok(image.warning.length>100,'record specific source mismatch');
 assert.equal(image.width,1536);assert.equal(image.height,1024);
 const f=path.join(ROOT,image.filename);
 const bytes=fs.readFileSync(f);
 assert.equal(bytes.length,image.bytes);
 assert.equal(bytes.toString('ascii',0,4),'RIFF');
 assert.equal(bytes.toString('ascii',8,12),'WEBP');
 assert.equal(bytes.readUInt32LE(4)+8,bytes.length);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),image.sha256);
 assert.ok(!seen.has(image.sha256));seen.add(image.sha256);
 assert.ok(html.includes(image.filename),'offline review HTML references real packaged file');
}
const registry=fs.readFileSync(path.resolve(__dirname,'../app/src/main/assets/lt-generated-art-registry.js'),'utf8');
assert.ok(registry.includes('Object.freeze({})'),'style references are never visible in user reading flow');
console.log('PASS 2 REAL full-res WebPs, SHA+RIFF, 10 explicit no-publish flags and offline gallery');
