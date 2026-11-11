#!/usr/bin/env node
// Source-authentic paragraph proof and byte-exact unapproved scene crops.
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {sourceChapters}=require('./story_art_pilot.cjs');
const dir=path.resolve(__dirname,'../docs/art-generation/review/single-scene-crops-20261111');
const m=JSON.parse(fs.readFileSync(path.join(dir,'candidate-manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(dir,'review.html'),'utf8');
const novel=sourceChapters(3);
assert.equal(m.schemaVersion,1);
assert.equal(m.purpose,'UNAPPROVED_SINGLE_SCENE_CANDIDATES');
assert.equal(m.releaseApproved,false);
assert.equal(m.bookId,'around-the-world-in-eighty-days-towle');
assert.equal(m.files.length,2);
assert.ok(!/https?:\/\/|fetch\s*\(|XMLHttpRequest/i.test(html),'review must run without remote image fetches');
const ids=new Set(),hashes=new Set();
for(const c of m.files){
 assert.ok(!ids.has(c.id));ids.add(c.id);
 assert.equal(c.status,'REJECTED_FOR_RELEASE','cropped montage not ready for reading app');
 assert.equal(c.croppedFromMontage,true);
 assert.equal(c.reprocessRequired,true);
 assert.equal(c.releaseApproved,false);
 assert.equal(c.ownerImageApproved,false);
 assert.equal(c.editoriallyApproved,false);
 assert.equal(c.imageRightsReviewed,false);
 assert.equal(c.distributionReviewApproved,false);
 assert.ok(Array.isArray(c.issues)&&c.issues.length>=3);
 assert.match(c.filename,/^ch0[13]-[a-z0-9-]+\.webp$/);
 assert.ok(Number.isInteger(c.chapter)&&Number.isInteger(c.paragraphZeroBased));
 const source=novel.chapters[c.chapter-1]?.paragraphs?.[c.paragraphZeroBased];
 assert.ok(source?.en&&source?.ar,'original bilingual source must exist');
 assert.equal(c.sourceParagraphEn,source.en,'exact unmodified English paragraph from real shipped novel');
 assert.ok(source.en.includes(c.sourceExcerpt));
 assert.equal(c.sourceParagraphSha256,crypto.createHash('sha256').update(source.en).digest('hex'));
 assert.ok(c.width>=450&&c.width<600&&c.height>=200&&c.height<350,'native panel crop, NOT falsely described as full resolution');
 const im=fs.readFileSync(path.join(dir,c.filename));
 assert.equal(im.length,c.bytes);
 assert.equal(im.toString('ascii',0,4),'RIFF');
 assert.equal(im.toString('ascii',8,12),'WEBP');
 assert.equal(im.readUInt32LE(4)+8,im.length,'WebP RIFF full length must match');
 const hash=crypto.createHash('sha256').update(im).digest('hex');
 assert.equal(hash,c.sha256);
 assert.ok(!hashes.has(hash));hashes.add(hash);
 assert.ok(html.includes(c.filename),'offline review links to checked real image');
}
const registry=fs.readFileSync(path.resolve(__dirname,'../app/src/main/assets/lt-generated-art-registry.js'),'utf8');
assert.match(registry,/Object\.freeze\(\{\}\)/,'rejected crops must not ship as Android reader art');
console.log('PASS: two genuine cropped image files, byte SHA256+RIFF, exact Ch I/III source quotes, bilingual prose, rejected in app');
