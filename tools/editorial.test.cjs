'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
const match=html.match(/<script id="libraryData" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'catalog present in index.html');
const core=JSON.parse(match[1]);
const context={window:{},encodeURIComponent};
for(const file of ['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js','novella-salt-meridian.js','novella-ninth-ledger.js','novella-quiet-frequency.js','editorial-art.js']){
 assert.ok(html.includes('src="'+file+'"'),file+' loaded before the primary app');
 vm.runInNewContext(fs.readFileSync(path.join(assets,file),'utf8'),context,{filename:file,timeout:2000});
}
const stories=context.window.StoryLensEditorialStories;
assert.equal(stories.length,21,'eighteen editorial stories plus three complete bilingual novellas');
const all=[...core.stories,...stories],ids=new Set(),genres=new Map();
let paragraphs=0,chapters=0,artCount=0;
const art=context.window.StoryLensMakeEditorialArt(stories);
for(const story of all){
 assert.ok(!ids.has(story.id),'unique ID: '+story.id);
 ids.add(story.id);
 genres.set(story.genre,(genres.get(story.genre)||0)+1);
 assert.ok(story.title&&story.description&&story.level,'metadata: '+story.id);
 for(let c=0;c<story.chapters.length;c++){
  const ch=story.chapters[c];chapters++;
  assert.ok(ch.title&&ch.titleAr&&ch.paragraphs.length>=(stories.includes(story)?5:1),'chapter completeness: '+story.id);
  if(stories.includes(story)){
   const scene=art[story.id+'_'+c];
   assert.ok(scene?.startsWith('data:image/svg+xml'),'new illustration bundled: '+story.id);
   assert.ok(decodeURIComponent(scene).includes('<svg'),'valid SVG payload: '+story.id);
   artCount++;
  }
  for(const p of ch.paragraphs){
   paragraphs++;
   assert.ok(p.en.length>15&&p.ar.length>15,'complete paired literary lines: '+story.id);
   assert.ok(/[A-Za-z]/.test(p.en)&&/[\u0600-\u06FF]/.test(p.ar),'English and Arabic languages: '+story.id);
  }
 }
 if(stories.includes(story))assert.ok(story.terms.length>=6,'context terms: '+story.id);
}
assert.equal(all.length,46,'core library, lazy classic, eighteen editorial stories and three novellas remain discoverable');
const lazyClassic=all.filter(story=>story.id==='around-the-world-in-eighty-days-towle');
assert.equal(lazyClassic.length,1,'the long classic placeholder is registered exactly once');
assert.equal(lazyClassic[0].lazyBook,true,'the classic remains a lazy entry in the startup catalog');
assert.equal(lazyClassic[0].totalChapters,37,'the classic advertises its full chapter count without eager payload');
assert.equal(lazyClassic[0].chapters.length,0,'the full-length chapter payload stays deferred until open');
for(const [genre,count] of genres)assert.equal(count,genre==='historical'?9:genre==='mystery'?9:7,genre+' count includes the current core, both novellas and the classic');
assert.ok(paragraphs>=640 && chapters>=90,'original core, eighteen editorial stories and the novella retained');
assert.equal(artCount,stories.reduce((sum,story)=>sum+story.chapters.length,0),'every editorial and novella chapter has a local illustration');
assert.ok(html.includes('catalog.stories.push(...window.StoryLensEditorialStories)'),'stories registered before library render');
assert.ok(html.includes('Object.assign(art,window.StoryLensMakeEditorialArt'),'art registered');
console.log(JSON.stringify({result:'PASS',totalStories:all.length,totalChapters:chapters,totalBilingualParagraphs:paragraphs,illustratedNewChapters:artCount,perGenre:Object.fromEntries(genres)},null,2));
