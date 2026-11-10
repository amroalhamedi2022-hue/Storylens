#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const {sourceChapters}=require('./story_art_pilot.cjs');
const root=path.resolve(__dirname,'../docs/art-generation/visual-bibles/colored-victorian');
const book=JSON.parse(fs.readFileSync(path.join(root,'color-art-manifest.json')));
const prompts=JSON.parse(fs.readFileSync(path.join(root,'next-scene-briefs.json')));
const gallery=fs.readFileSync(path.join(root,'review.html'),'utf8');
assert.equal(book.releaseApproved,false);
assert.equal(book.approvedAsChapterArt,false);
assert.equal(book.historicalOriginal,false);
assert.equal(book.images.length,3);
assert.match(prompts.characters.phileasFogg,/BEARDED/);
assert.match(prompts.negative,/hot-air-balloon/);
for(const image of book.images){
 assert.equal(image.releaseApproved,false);
 assert.equal(image.forSceneReferenceOnly,true);
 assert.ok(image.warning.length>50);
 assert.match(image.name,/^[a-z-]+\.webp$/);
 const data=fs.readFileSync(path.join(root,image.name));
 assert.equal(data.length,image.bytes,'real WebP length');
 assert.equal(data.toString('ascii',0,4),'RIFF');
 assert.equal(data.toString('ascii',8,12),'WEBP');
 assert.equal(data.readUInt32LE(4)+8,data.length);
 assert.equal(crypto.createHash('sha256').update(data).digest('hex'),image.sha256);
 assert.ok(gallery.includes(image.name));
}
const chapters=sourceChapters(4).chapters;
const used=new Set();
assert.equal(prompts.scenes.length,6);
for(const s of prompts.scenes){
 assert.equal(s.generated,false);
 assert.equal(s.releaseApproved,false);
 const paragraph=chapters[s.chapterOneBased-1]?.paragraphs?.[s.afterParagraph];
 assert.ok(paragraph?.en?.includes(s.sourceExcerpt),'original English source anchor '+s.id);
 assert.ok(paragraph?.ar?.length>10,'original Arabic companion present');
 const key=s.chapterOneBased+':'+s.afterParagraph;
 assert.ok(!used.has(key));used.add(key);
}
assert.equal(prompts.scenes.find(x=>x.id==='ch03-wager').chapterOneBased,3);
assert.equal(prompts.scenes.find(x=>x.id==='ch04-packing').chapterOneBased,4);
const registry=fs.readFileSync(path.resolve(__dirname,'../app/src/main/assets/lt-generated-art-registry.js'),'utf8');
assert.ok(registry.includes('Object.freeze({})'),'no premature in-app publication');
assert.ok(!gallery.includes('fetch(')&&!gallery.includes('XMLHttpRequest'));
console.log('PASS: 3 real SHA-verified color moodboards, 6 genuine bilingual chapter anchors, zero published images');
