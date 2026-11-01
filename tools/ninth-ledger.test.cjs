'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const read=name=>fs.readFileSync(path.join(assets,name),'utf8');
const html=read('index.html');
const modules=['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js',
 'novella-salt-meridian.js','novella-ninth-ledger.js','editorial-art.js'];
const ctx={window:{},encodeURIComponent};
for(const name of modules){
 assert.ok(html.includes('src="'+name+'"'),'offline HTML references '+name);
 vm.runInNewContext(read(name),ctx,{filename:name,timeout:6000});
}
const stories=ctx.window.StoryLensEditorialStories;
const story=stories.find(s=>s.id==='the-ninth-ledger');
assert.ok(story,'the detective novella is in the production editorial catalog');
assert.equal(story.genre,'mystery');
assert.equal(story.level,'C1');
assert.equal(story.chapters.length,5,'a complete, not open-ended, investigation');
assert.match(story.provenance,/Original English fiction/);
assert.match(story.editorialStatus,/review pending/,'editorial clearance is not fabricated');
const passages=story.chapters.flatMap(ch=>ch.paragraphs);
assert.equal(passages.length,40,'forty paired English/Arabic literary paragraphs');
const words=passages.map(p=>p.en).join(' ').trim().split(/\s+/).length;
assert.ok(words>=1500,'substantial novella rather than title-only or fragmentary content');
const english=new Set();
for(const chapter of story.chapters){
 assert.equal(chapter.paragraphs.length,8,'each chapter advances the complete mystery');
 assert.ok(/[A-Za-z]/.test(chapter.title));
 assert.ok(/[\u0600-\u06FF]/.test(chapter.titleAr));
 for(const paragraph of chapter.paragraphs){
  assert.ok(paragraph.en.trim().split(/\s+/).length>=24,'English paragraph has complete prose');
  assert.ok(paragraph.ar.length>=70&&/[\u0600-\u06FF]/.test(paragraph.ar),'human-readable Arabic companion paragraph');
  assert.ok(!english.has(paragraph.en),'every source paragraph is unique');
  english.add(paragraph.en);
 }
}
const body=passages.map(p=>p.en.toLowerCase()).join(' ');
assert.ok(story.terms.length>=12);
for(const term of story.terms){
 assert.ok(body.includes(term.term.toLowerCase()),'context term must occur in source: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'nonempty bilingual glossary context');
}
const art=ctx.window.StoryLensMakeEditorialArt([story]);
for(let i=0;i<5;i++){
 const image=art[story.id+'_'+i];
 assert.ok(image?.startsWith('data:image/svg+xml'),'offline generated illustration '+i);
 assert.ok(decodeURIComponent(image).includes('<svg'),'SVG chapter scene '+i);
}
assert.ok(html.indexOf('novella-ninth-ledger.js')<html.indexOf('editorial-art.js'),'art registers after story text');
console.log(JSON.stringify({result:'PASS',title:story.title,chapters:5,pairedParagraphs:40,englishWords:words,terms:story.terms.length,localScenes:5,editorialReview:'NOT TESTED'}));
