'use strict';
// Editorial Collection C: full story arcs, bilingual review and illustration gates.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const scripts=['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js','editorial-art.js'];
const context={window:{},encodeURIComponent};
for(const file of scripts)vm.runInNewContext(fs.readFileSync(path.join(assets,file),'utf8'),context,{filename:file,timeout:4000});
const stories=context.window.StoryLensEditorialStories;
const collection=stories.slice(-6);
assert.equal(stories.length,12,'twelve editorial stories across three batches');
const expected=['mystery','sci_fi','psychological','historical','contemporary','horror'];
assert.deepEqual([...collection.map(s=>s.genre)].sort(),[...expected].sort(),'one full story in each adult genre');
const known=new Set(),lines=new Set();
let paragraphs=0,words=0;
for(const story of collection){
 assert.ok(!known.has(story.id),'unique story ID '+story.id);known.add(story.id);
 assert.equal(story.chapters.length,2,'two-chapter resolved arc '+story.id);
 assert.ok(story.title.length>8&&story.description.length>40,'complete metadata '+story.id);
 assert.ok(story.terms.length>=8,'at least 8 edited idioms/terms '+story.id);
 const body=[];
 for(const ch of story.chapters){
  assert.ok(ch.title.length>=4&&ch.titleAr.length>=4,'bilingual chapter headings');
  assert.ok(ch.paragraphs.length>=9,'editorially substantial chapter '+story.id);
  for(const p of ch.paragraphs){
   assert.ok(p.en.trim().split(/\s+/).length>=11,'complete English sentences');
   assert.ok(p.ar.length>=35&&/[\u0621-\u064A]/.test(p.ar),'full fluent Arabic pair');
   const normalized=p.en.toLowerCase().replace(/[^a-z]+/g,' ').trim();
   assert.ok(!lines.has(normalized),'not recycled: '+p.en);
   lines.add(normalized);body.push(normalized);
   paragraphs++;words+=normalized.split(/\s+/).length;
  }
 }
 const text=body.join(' ');
 const covered=story.terms.filter(t=>text.includes(t.term.toLowerCase())).length;
 assert.ok(covered>=3,story.id+' must include contextual expressions actually used in the story');
 const scenes=context.window.StoryLensMakeEditorialArt([story]);
 for(const i of [0,1])assert.ok(scenes[story.id+'_'+i]?.startsWith('data:image/svg+xml'),'local scene for both chapters');
}
assert.equal(paragraphs,108,'all English–Arabic paragraphs delivered');
assert.ok(words>=1900,'substantial original English prose, not filler');
console.log(JSON.stringify({result:'PASS',newStories:collection.length,chapters:12,paragraphs,englishWords:words,newIllustrations:12,annotations:collection.reduce((n,s)=>n+s.terms.length,0)},null,2));
