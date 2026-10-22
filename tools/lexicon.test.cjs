// StoryLens regression checks: run with node tools/lexicon.test.cjs
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'app/src/main/assets/lexicon-extra.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/liquid-aurora.css'),'utf8');
const match=html.match(/<script id="libraryData" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'embedded library catalog found');
const catalog=JSON.parse(match[1]);
const context={window:{}};
vm.runInNewContext(js,context,{filename:'lexicon-extra.js',timeout:2000});
const lex=context.window.StoryLexicon;
assert.ok(lex,'supplementary offline lexicon registered');
assert.ok(lex.size>=200,'supplementary lexicon has substantial curated breadth');
assert.match(lex.resolve('through').literal,/عبر|خلال/);
assert.match(lex.resolve('Noor').literal,/اسم علم/);
assert.match(lex.resolve('envelopes').literal,/ظرف/);
assert.equal(lex.resolve('madeupwordqqq'),null,'unknown word is NOT given a fabricated gloss');
assert.ok(html.includes('src="lexicon-extra.js"'),'lexicon referenced by reader');
assert.ok(html.includes('href="liquid-aurora.css"'),'new design loaded by WebView');
assert.ok(html.includes('window.StoryLexicon.resolve(selected)'),'word click calls supplemental lookup');
assert.ok(!html.includes('لم نضف المعنى المعجمي لهذه الكلمة بعد إلى نسخة المعاينة'),'obsolete user-facing error removed');
for(const theme of ['aurora','aqua','nebula'])assert.ok(css.includes('body.theme-'+theme),'theme '+theme+' implemented');
assert.ok(css.includes('prefers-reduced-motion'),'motion safety');
assert.ok(css.includes('body:has(.reader)::before'),'reader deliberately free of bubbles');
assert.equal(catalog.genres.length,6,'six genres');
assert.ok(catalog.stories.length>=12,'existing stories preserved');
let chapters=0,paragraphs=0,missing=0,unique=new Set();
const entries=new Set([...catalog.dictionary,...catalog.stories.flatMap(s=>s.terms)].map(t=>t.term.toLowerCase()));
for(const story of catalog.stories) {
 assert.ok(story.chapters.length>=1,story.id+' has chapters');
 for(const chapter of story.chapters) {
  chapters++;
  for(const p of chapter.paragraphs){
   paragraphs++;
   assert.ok(p.en?.trim() && p.ar?.trim(),story.id+' paragraph needs English and human-readable Arabic');
   for(const word of p.en.match(/[a-z]+(?:['’\-][a-z]+)*/gi)||[])unique.add(word.toLowerCase());
  }
 }
}
let supplement=0;
for(const word of unique)if(!entries.has(word)&&lex.resolve(word))supplement++;
assert.ok(supplement>=100,'supplemental dictionary adds real previously missing coverage');
assert.ok(chapters>=30&&paragraphs>=270,'all original curated content preserved');
console.log(JSON.stringify({result:'PASS',genres:catalog.genres.length,stories:catalog.stories.length,chapters,paragraphs,existingHeadwords:entries.size,supplementalNewSurfaceForms:supplement,extraLexiconHeadwords:lex.size,uniqueRawStoryWords:unique.size},null,2));
