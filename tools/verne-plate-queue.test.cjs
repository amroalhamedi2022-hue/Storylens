'use strict';
/* Validate genuine 1873 print art research against the complete published 37-chapter source. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'app/src/main/assets');
const queue=JSON.parse(fs.readFileSync(path.join(root,'docs/literature/VERNE_FOUR_ADDITIONAL_PLATES_QUEUE.json'),'utf8'));
const shipped=JSON.parse(fs.readFileSync(path.join(root,'docs/literature/HISTORIC_VERNES_ASSETS.json'),'utf8'));
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script\b[^>]*\bsrc=["'](classic-verne-towle-ch\d+\.js)["']/g)].map(x=>x[1]);
assert.equal(srcs.length,36,'Chapter 32 is included in chapter 31 script, all other 36 scripts remain');
const sandbox={window:{},encodeURIComponent};
for(const file of srcs)vm.runInNewContext(fs.readFileSync(path.join(assets,file),'utf8'),sandbox,{filename:file,timeout:5000});
const stories=sandbox.window.StoryLensEditorialStories||[];
const story=stories.find(x=>x.id==='around-the-world-in-eighty-days-towle');
assert.ok(story);assert.equal(story.chapters.length,37);
assert.match(story.editorialStatus,/Arabic draft pending independent review/i,'Unreviewed companion must not be declared editorially complete');
assert.equal(shipped.length,9,'Do not reimport existing local historic prints');
assert.equal(queue.queue.length,4,'Four additional period source leads are documented');
const scenes=new Set();
for(const plate of queue.queue){
 assert.match(plate.sourcePage,/^https:\/\/www\.oldbookillustrations\.com\/illustrations\/[\w-]+\//);
 assert.equal(plate.year,1873);assert.equal(plate.rights,'PENDING');
 assert.equal(plate.scanStatus,'NOT_DOWNLOADED');
 assert.ok(!shipped.some(x=>x.id===plate.id),'Period illustration intake must not duplicate shipped archive');
 assert.ok(plate.chapterOneBased>=1 && plate.chapterOneBased<=37,'Invalid original novel chapter');
 const original=story.chapters[plate.chapterOneBased-1];
 const matches=original.paragraphs.filter(p=>p.en.toLowerCase().includes(plate.englishTextNeedle.toLowerCase()));
 assert.ok(matches.length>=1,'Historical plate event has no source-prose anchor: '+plate.id);
 assert.ok(matches[0].ar&&/[ء-ي]/.test(matches[0].ar),'Companion AR must exist at image insertion target');
 assert.ok(plate.altAr&&/[ء-ي]/.test(plate.altAr)&&plate.altEn,'Bilingual alt prose for archived period illustration');
 scenes.add(plate.chapterOneBased);
}
assert.equal(scenes.size,4,'Source-only leads must target four distinct novel chapters');
assert.match(queue.colourPolicy,/Historically coloured originals may be in full authentic original palette/);
console.log('PASS: full 37-chapter published Towle source remains bilingual-draft, nine local prints retained, four additional real 1873 scene/art leads source-anchored and NOT falsely packaged');
