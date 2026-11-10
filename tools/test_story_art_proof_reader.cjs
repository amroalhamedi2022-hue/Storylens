#!/usr/bin/env node
/* Execute source/exact-image proof on actual local artifacts, not mocks. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {sourceChapters}=require('./story_art_pilot.cjs');
const ROOT=path.resolve(__dirname,'..');
const DIR=path.join(ROOT,'docs/art-generation/review/2026-11-10');
const html=fs.readFileSync(path.join(DIR,'scene-proof-reader.html'),'utf8');
const match=html.match(/<script id="scene-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'real reader evidence embeds transparent candidate evidence');
const scenes=JSON.parse(match[1]);
const prose=sourceChapters(1).chapters[0].paragraphs;
const sourceManifest=JSON.parse(fs.readFileSync(path.join(DIR,'candidate-manifest.json'),'utf8'));
assert.equal(scenes.length,2);
assert.equal(sourceManifest.images.length,scenes.length);
assert.ok(html.includes('NOT IN RELEASE'));
assert.ok(html.includes('releaseApproved:false'));
assert.ok(!/https?:\/\/|fetch\s*\(|XMLHttpRequest|<iframe/i.test(html),'review page never fetches remote data');
assert.match(html,/data-language="ar"/);
assert.match(html,/data-language="en"/);
assert.match(html,/data-language="both"/);
assert.match(html,/Export review JSON/);
const encountered=new Set();
for(const scene of scenes){
 assert.ok(!encountered.has(scene.id));encountered.add(scene.id);
 assert.ok(Number.isInteger(scene.paragraph)&&scene.paragraph>=1&&scene.paragraph<=prose.length);
 const source=prose[scene.paragraph-1];
 assert.equal(scene.english,source.en,'reader preview embeds exact actual English paragraph');
 assert.equal(scene.arabic,source.ar,'reader preview embeds exact actual Arabic paragraph');
 assert.equal(crypto.createHash('sha256').update(source.en).digest('hex'),scene.sourceSha256);
 assert.match(scene.img,/^verne-ch01-(?:saville-house|fogg-reading)-full\.webp$/);
 const image=fs.readFileSync(path.join(DIR,scene.img));
 assert.equal(image.subarray(0,4).toString('ascii'),'RIFF');
 assert.equal(image.subarray(8,12).toString('ascii'),'WEBP');
 assert.equal(crypto.createHash('sha256').update(image).digest('hex'),scene.imageSha256);
 const original=sourceManifest.images.find(x=>x.sceneId===scene.id);
 assert.ok(original&&original.releaseApproved===false&&original.editoriallyApproved===false);
 assert.equal(original.full.sha256,scene.imageSha256);
 assert.equal(original.afterParagraph,scene.paragraph-1);
 assert.equal(scene.sourceSupported,true);
}
const rejected=scenes.find(x=>x.id==='verne-ch01-fogg-reading');
assert.ok(rejected.status.startsWith('REJECTED'),'Fogg character mismatch remains rejected');
assert.ok(rejected.summary.includes('beard'),'specific visual mismatch described');
console.log('PASS: 2 actual image files, 4 source-exact bilingual paragraphs, correct SHA256, true browser review only; no remote URLs/release claims');
