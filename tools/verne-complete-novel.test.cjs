'use strict';
/* Integrated acceptance for the complete offline Towle novel.
 * Per-chapter tests verify exact source digests; this test verifies that the
 * real WebView script order composes those chapters into one continuous book. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const read=name=>fs.readFileSync(path.join(assets,name),'utf8');
const html=read('index.html');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["'](classic-verne-towle-ch\d+\.js)["']/g)].map(m=>m[1]);
const expected=[
  ...Array.from({length:31},(_,i)=>'classic-verne-towle-ch'+String(i+1).padStart(2,'0')+'.js'),
  ...[33,34,35,36,37].map(n=>'classic-verne-towle-ch'+String(n).padStart(2,'0')+'.js')
];
assert.deepEqual(scripts,expected,'the WebView must load every pinned chapter script once and in order; chapter XXXII is paired in the XXXI script');
assert.ok(html.indexOf(scripts[scripts.length-1])<html.indexOf('editorial-art.js'),'all source chapters load before illustration registration');
const sandbox={window:{},encodeURIComponent};
for(const file of scripts) vm.runInNewContext(read(file),sandbox,{filename:file,timeout:5000});
const stories=sandbox.window.StoryLensEditorialStories||[];
assert.equal(stories.length,1,'the classic novel must be one continuous offline story');
const story=stories[0];
assert.equal(story.id,'around-the-world-in-eighty-days-towle');
assert.equal(story.totalChapters,37);
assert.equal(story.chapters.length,37,'script composition must yield all 37 numbered chapters');
assert.match(story.editorialStatus,/37 of 37 chapters/);
let paragraphs=0,words=0;
for(let i=0;i<37;i++){
 const chapter=story.chapters[i];
 assert.ok(chapter.title?.trim(), 'missing English title for chapter '+(i+1));
 assert.ok(chapter.titleAr?.trim(), 'missing Arabic title for chapter '+(i+1));
 assert.ok(Array.isArray(chapter.paragraphs)&&chapter.paragraphs.length>0,'missing paragraphs for chapter '+(i+1));
 for(const [j,p] of chapter.paragraphs.entries()){
  assert.ok(typeof p.en==='string'&&p.en.trim().length>0,'missing English text at '+(i+1)+':'+(j+1));
  assert.ok(typeof p.ar==='string'&&p.ar.trim().length>0&&/[ء-ي]/.test(p.ar),'missing Arabic companion draft at '+(i+1)+':'+(j+1));
  paragraphs++;
 }
 words+=(chapter.paragraphs.map(p=>p.en).join(' ').match(/[\p{L}\p{N}’'-]+/gu)||[]).length;
}
assert.ok(paragraphs>900,'the complete book must be full prose, not chapter summaries');
assert.ok(words>30000,'the complete book must remain a long-form novel, not a short excerpt');
assert.ok(story.provenance.includes('Standard Ebooks'),'literary source provenance must remain visible');
console.log(JSON.stringify({result:'PASS',chapterScripts:scripts.length,chapters:story.chapters.length,bilingualParagraphs:paragraphs,englishWords:words,source:'Standard Ebooks Towle transcription',arabicLiteraryReview:'NOT TESTED',territoryRights:'NOT TESTED',physicalDevice:'NOT TESTED'},null,2));
