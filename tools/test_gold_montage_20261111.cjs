#!/usr/bin/env node
/* Check an ACTUAL Git-backed image, not a claimed new chapter illustration. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'../docs/art-generation/visual-bibles/colored-victorian/gold-montage-20261111');
const data=JSON.parse(fs.readFileSync(path.join(base,'manifest.json'),'utf8'));
const html=fs.readFileSync(path.join(base,'review.html'),'utf8');
assert.equal(data.schemaVersion,1);
assert.equal(data.assetClass,'AI_GENERATED_VICTORIAN_COLOR_STYLE_REFERENCE_ONLY');
assert.equal(data.forReader,false);
assert.equal(data.sourceAccurate,false);
assert.equal(data.releaseApproved,false);
assert.equal(data.historicalOriginal,false);
assert.equal(data.approvedAsChapterArt,false);
for(const flag of ['editoriallyApproved','ownerImageApproved','distributionReviewApproved','imageRightsReviewed','releaseApproved'])
 assert.equal(data.review[flag],false,'no premature promotion');
assert.ok(data.notes.some(s=>s.includes('hot-air balloon')));
assert.ok(data.notes.some(s=>s.includes('Chapter III')));
const image=fs.readFileSync(path.join(base,data.image.filename));
assert.equal(image.length,data.image.bytes);
assert.equal(image.toString('ascii',0,4),'RIFF');
assert.equal(image.toString('ascii',8,12),'WEBP');
assert.equal(image.readUInt32LE(4)+8,image.length);
assert.match(image.toString('ascii',12,16),/^VP8 |^VP8L|^VP8X/);
assert.equal(crypto.createHash('sha256').update(image).digest('hex'),data.image.sha256);
assert.match(html,/verne-victorian-gold-journey-collage\.webp/);
assert.ok(!html.includes('fetch(')&&!html.includes('XMLHttpRequest')&&!/https?:\/\//.test(html));
const registry=fs.readFileSync(path.resolve(__dirname,'../app/src/main/assets/lt-generated-art-registry.js'),'utf8');
assert.ok(registry.includes('Object.freeze({})'),'unapproved style study must not be installed');
console.log('PASS actual new WebP byte SHA256, RIFF, offline gallery, rejection notes and zero chapter release');
