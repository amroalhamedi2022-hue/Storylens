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


// Execute the actual reader's word sheet and saved-word renderer in an isolated DOM.
// This catches the regression where FreeDict/StoryLexicon glosses disappeared
// from "My Words" after save, despite the flashcard having the original context.
const take=(from,to)=>{
 const start=html.indexOf(from),end=html.indexOf(to,start+from.length);
 assert.ok(start>=0&&end>start,'found reader function: '+from);
 return html.slice(start,end);
};
const sandbox={
 state:{
  page:'reader',saved:['through','rareword'],
  cards:[
   {term:'through',meaning:'عبر',sentence:'He walked through the door.',translation:'مر عبر الباب.',dueAt:0},
   {term:'rareword',meaning:'معنى مُراجع',sentence:'A rareword appears.',translation:'ظهرت كلمة.',dueAt:0}
  ],
  story:{terms:[{term:'in plain sight',literal:'على مرأى',context:'في مكان ظاهر',type:'idiom',note:'تعبير سياقي محرر'}]}
 },
 catalog:{stories:[],dictionary:[]},
 window:{StoryLexicon:lex,FreeDictEnglishArabic:{resolve:()=>null}},
 dom:{},
 $:id=>sandbox.dom[id]||(sandbox.dom[id]={innerHTML:''}),
 safeKey:encodeURIComponent,
 esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 activeWord:null,Date
};
vm.runInNewContext(
 take('function showWords(){','function removeWord(')+
 take('function wordSheet({','function saveTerm(')+
 '\nshowWords();',sandbox,{filename:'reader-vocab-functions.js',timeout:2000});
assert.match(sandbox.dom.root.innerHTML,/عبر/,'saved supplemental dictionary meaning remains visible');
assert.match(sandbox.dom.root.innerHTML,/معنى مُراجع/,'saved word retains its recorded meaning');
assert.match(sandbox.dom.root.innerHTML,/He walked through the door/,'saved word retains source sentence');
assert.match(sandbox.dom.root.innerHTML,/مر عبر الباب/,'saved word retains sentence translation');
vm.runInNewContext("wordSheet({entry:{term:'through',literal:'عبر؛ من خلال',context:'عبر',type:'word',note:'معنى عام'},display:'through',source:{en:'He walked through the door.',ar:'مر عبر الباب.'}})",sandbox,{timeout:2000});
assert.match(sandbox.dom.modals.innerHTML,/معنيين متاحين/,'dictionary sense label is explicit');
assert.match(sandbox.dom.modals.innerHTML,/معانٍ معجمية عامة/,'dictionary does not claim unedited context');
assert.ok(!sandbox.dom.modals.innerHTML.includes('المعنى داخل القصة (محرّر)'),'generic entry is not falsely called curated');
vm.runInNewContext("wordSheet({entry:state.story.terms[0],display:'in plain sight',source:{en:'The clue was in plain sight.',ar:'كان الدليل ظاهرًا للجميع.'}})",sandbox,{timeout:2000});
assert.match(sandbox.dom.modals.innerHTML,/المعنى داخل القصة \(محرّر\)/,'editorially annotated phrase is distinguished');
assert.match(sandbox.dom.modals.innerHTML,/في مكان ظاهر/,'curated context shown');
vm.runInNewContext("wordSheet({entry:null,display:'unlistedxyz',source:{en:'An unlistedxyz appears.',ar:'ظهرت كلمة مجهولة.'}})",sandbox,{timeout:2000});
assert.match(sandbox.dom.modals.innerHTML,/ليست تعريفًا مؤكدًا/,'unknown meaning is not fabricated');
console.log('PASS: saved-word offline gloss/context recovery, two-sense labeling, editorial vs generic vs unknown word sheet');
