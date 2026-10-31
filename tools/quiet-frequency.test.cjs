'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assets=path.resolve(__dirname,'../app/src/main/assets');
const read=name=>fs.readFileSync(path.join(assets,name),'utf8');
const html=read('index.html');
const files=['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js',
 'novella-salt-meridian.js','novella-ninth-ledger.js','novella-quiet-frequency.js','editorial-art.js'];
const ctx={window:{},encodeURIComponent};
for(const name of files){
 assert.ok(html.includes('src="'+name+'"'),'HTML registers offline content '+name);
 vm.runInNewContext(read(name),ctx,{filename:name,timeout:6000});
}
const stories=ctx.window.StoryLensEditorialStories;
const story=stories.find(s=>s.id==='the-quiet-frequency');
assert.ok(story,'complete original mystery is present');
assert.equal(stories.filter(s=>s.id===story.id).length,1,'not registered twice');
assert.equal(story.genre,'mystery');
assert.equal(story.level,'C1');
assert.match(story.provenance,/Original English fiction/);
assert.match(story.editorialStatus,/review pending/,'human review is not falsely certified');
assert.equal(story.chapters.length,6,'complete six-chapter investigation, not a teaser');
const paragraphs=story.chapters.flatMap(c=>c.paragraphs);
assert.equal(paragraphs.length,48,'all bilingual pairs are included');
const english=paragraphs.map(p=>p.en).join(' ');
const words=english.trim().split(/\s+/).length;
assert.ok(words>=2400,'long-form prose rather than a list of short summaries');
const unique=new Set();
for(const chapter of story.chapters){
 assert.equal(chapter.paragraphs.length,8);
 assert.ok(/[A-Za-z]/.test(chapter.title));
 assert.ok(/[\u0600-\u06FF]/.test(chapter.titleAr));
 for(const paragraph of chapter.paragraphs){
  assert.ok(paragraph.en.trim().split(/\s+/).length>=28,'English passage is developed');
  assert.ok(paragraph.ar.length>=75&&/[\u0600-\u06FF]/.test(paragraph.ar),'paired Arabic draft is substantial');
  assert.ok(!unique.has(paragraph.en),'passages do not repeat');
  unique.add(paragraph.en);
  assert.ok(!/<script|<iframe|https?:\/\//i.test(paragraph.en+paragraph.ar),
   'fiction cannot inject remote resources or markup');
 }
}
const body=english.toLowerCase();
assert.equal(story.terms.length,12);
for(const term of story.terms){
 assert.ok(body.includes(term.term.toLowerCase()),'context term appears verbatim in English: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'glossary has Arabic and explanatory context');
}
const art=ctx.window.StoryLensMakeEditorialArt([story]);
for(let i=0;i<6;i++){
 const image=art[story.id+'_'+i];
 assert.ok(image?.startsWith('data:image/svg+xml'),'chapter '+i+' has an offline original illustration');
 assert.ok(decodeURIComponent(image).includes('<svg'),'image is a real local vector scene');
}
assert.ok(html.indexOf('novella-quiet-frequency.js')<html.indexOf('editorial-art.js'),
 'story must register before generated art');
console.log(JSON.stringify({result:'PASS',originalNovel:story.title,chapters:6,pairedParagraphs:48,
 englishWords:words,offlineScenes:6,glossaryTerms:story.terms.length,editorialReview:'NOT TESTED'}));
