'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base='app/src/main/assets';
const context={window:{},encodeURIComponent};
const files=['novella-salt-meridian.js','novella-ninth-ledger.js','novella-quiet-frequency.js','novella-floor-between.js','editorial-art.js'];
for(const f of files)vm.runInNewContext(fs.readFileSync(path.join(base,f),'utf8'),context,{filename:f,timeout:6000});
const stories=context.window.StoryLensEditorialStories;
const expected=['the-salt-meridian','the-ninth-ledger','the-quiet-frequency','the-floor-between'];
const illustrations=context.window.StoryLensMakeEditorialArt(stories);
const images=[];
for(const id of expected){
 const story=stories.find(s=>s.id===id);
 assert.ok(story&&story.chapters.length>1,id+' is a complete multi-chapter novella');
 const first=illustrations[id+'_0'];
 assert.ok(first?.startsWith('data:image/svg+xml;charset=utf-8,%3Csvg'),id+' has offline first-scene art');
 const svg=decodeURIComponent(first);
 assert.ok(svg.includes('data-scene="'+id+'"'),'art is authored for this novella specifically');
 assert.ok(svg.includes(story.title),'original narrative title in approved graphic');
 assert.ok(svg.includes('viewBox="0 0 1000 620"'));
 assert.ok(illustrations[id+'_1']?.startsWith('data:image/svg+xml'),'later-chapter art is unchanged');
 images.push(first);
}
assert.equal(new Set(images).size,4,'covers are four different illustrations, not repeated genre imagery');
const bad=illustrations['the-floor-between_0'];
assert.doesNotMatch(decodeURIComponent(bad),/<image\b|<use\b|(?:xlink:)?href\s*=\s*["']https?:/i,'no externally linked image or SVG reference');
console.log('PASS: four novella-specific illustrated covers and existing chapter art stay offline');
