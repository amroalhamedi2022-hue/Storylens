'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root='app/src/main/assets/';
const read=name=>fs.readFileSync(root+name,'utf8');
const html=read('index.html');
assert.ok(html.includes('src="novella-floor-between.js"'),'complete story loaded offline');
assert.ok(html.indexOf('novella-floor-between.js')<html.indexOf('editorial-art.js'),
 'book registration precedes local illustrations');
const ctx={window:{},encodeURIComponent};
vm.runInNewContext(read('novella-floor-between.js'),ctx,{timeout:6000});
const stories=ctx.window.StoryLensEditorialStories;
assert.equal(stories.length,1,'new mystery is not registered twice');
const book=stories[0];
assert.equal(book.id,'the-floor-between');
assert.equal(book.genre,'mystery');
assert.equal(book.level,'C1');
assert.match(book.provenance,/Original English fiction/);
assert.match(book.editorialStatus,/review pending/,'not falsely certified without human editors');
assert.equal(book.chapters.length,6,'complete novel has a beginning, investigation and ending');
const pairs=book.chapters.flatMap(c=>c.paragraphs);
assert.equal(pairs.length,48,'all 48 English-Arabic paired passages shipped');
const english=pairs.map(p=>p.en).join(' ');
const words=english.trim().split(/\s+/).length;
assert.ok(words>=2700,'developed long-form mystery; not a teaser or list of summaries');
const unique=new Set();
for(const chapter of book.chapters){
 assert.equal(chapter.paragraphs.length,8,'every chapter is a complete reading unit');
 assert.match(chapter.title,/[A-Za-z]/);
 assert.match(chapter.titleAr,/[\u0600-\u06FF]/);
 for(const paragraph of chapter.paragraphs){
  assert.ok(paragraph.en.trim().split(/\s+/).length>=28,'English prose has developed scenes');
  assert.ok(paragraph.ar.length>=85&&/[\u0600-\u06FF]/.test(paragraph.ar),
   'each English scene has substantial paired Arabic draft');
  assert.ok(!unique.has(paragraph.en),'no repeated filler paragraphs');
  unique.add(paragraph.en);
  assert.ok(!/<script|<iframe|https?:\/\//i.test(paragraph.en+paragraph.ar),
   'no remote resources or injected HTML in fiction');
 }
}
assert.equal(book.terms.length,12);
for(const term of book.terms){
 assert.ok(english.toLowerCase().includes(term.term.toLowerCase()),
  'term appears literally in original English prose: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'glossary entry is bilingual and contextual');
}
vm.runInNewContext(read('editorial-art.js'),ctx,{timeout:6000});
const art=ctx.window.StoryLensMakeEditorialArt([book]);
for(let i=0;i<6;i++){
 const image=art[book.id+'_'+i];
 assert.ok(image?.startsWith('data:image/svg+xml'),'offline illustration for chapter '+(i+1));
 assert.ok(decodeURIComponent(image).includes('<svg'),'chapter art is actual SVG');
}
console.log(JSON.stringify({result:'PASS',title:book.title,chapters:6,pairedParagraphs:48,
 englishWords:words,glossaryTerms:12,offlineIllustrations:6,editorialReview:'NOT TESTED'}));
