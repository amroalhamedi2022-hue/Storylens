'use strict';
// Execute the actual production translation window; no fake literary text is
// accepted as a substitute for the source-bound chapter data.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const begin=source.indexOf('let ltTranslationBook=null,ltTranslationIndex=0;');
const end=source.indexOf('\nrenderReader=function(){',begin);
assert.ok(begin>0&&end>begin,'source-bound companion controller exists');
let closed=0,originalCalls=0;const scrolls=[];
let headingFocuses=0;
const root={innerHTML:'',querySelector(selector){
 assert.equal(selector,'#lt-translation-chapter-title');
 return {focus(options){assert.equal(options.preventScroll,true);headingFocuses++;}};
}};
const chapter=(index)=>({
 title:'English chapter '+(index+1),
 titleAr:'الفصل '+(index+1),
 titleEn:'English chapter '+(index+1),
 paragraphs:[{en:'English source '+(index+1),ar:'الترجمة العربية '+(index+1)}]
});
const english={id:'english',title:'Test <Book>',sourceLanguage:'en',
 chapters:Array.from({length:37},(_,i)=>chapter(i))};
const arabic={id:'arabic',title:'كتاب عربي',titleEn:'Arabic Original',
 sourceLanguage:'ar',chapters:Array.from({length:20},(_,i)=>chapter(i))};
const state={story:english,page:'reader',chapter:13,dark:false};
const window={scrollTo:(x,y)=>scrolls.push([x,y])};
const sandbox={window,state,
 document:{documentElement:{lang:'ar'}},
 uiText:(ar,en)=>ar,
 escapeText:value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
 $:key=>{assert.equal(key,'root');return root;},
 closeSheet:()=>{closed++;},
 fullTranslation:()=>{originalCalls++;},
};
vm.runInNewContext(source.slice(begin,end),sandbox,{filename:'translation-window-production.js',timeout:5000});
window.fullTranslation();
assert.equal(state.page,'translation');
assert.equal(closed,1);
assert.equal(originalCalls,0,'full book is not built by the old renderer');
assert.match(root.innerHTML,/<h2 id="lt-translation-chapter-title" tabindex="-1" lang="ar" dir="rtl">الفصل 14<\/h2>/);
assert.equal(headingFocuses,1,'opening the companion focuses its true chapter heading');
assert.match(root.innerHTML,/الترجمة العربية 14/);
assert.doesNotMatch(root.innerHTML,/الترجمة العربية 13/);
assert.doesNotMatch(root.innerHTML,/English source 37/);
assert.match(root.innerHTML,/Test &lt;Book&gt;/,'user-visible titles are escaped');
assert.equal((root.innerHTML.match(/lt-companion-plate/g)||[]).length,0,
 'chapters without archival scenes do not receive invented illustrations');
assert.equal((root.innerHTML.match(/<option /g)||[]).length,37,'all 37 chapters stay selectable');
assert.equal((root.innerHTML.match(/<p lang="ar" dir="rtl">/g)||[]).length,1,
 'the complete novel no longer becomes thousands of DOM paragraphs');
assert.match(root.innerHTML,/ltTranslationChapter\(12\)/);
assert.match(root.innerHTML,/ltTranslationChapter\(14\)/);
const sameMarkup=root.innerHTML;
window.ltTranslationChapter(13);
assert.equal(root.innerHTML,sameMarkup,'reselecting the same chapter does not remount text');
assert.equal(headingFocuses,1,'no-op chapter selection cannot steal focus');
assert.equal((root.innerHTML.match(/class="lt-translation-bottom"/g)||[]).length,1,
 'one accessible bottom navigation remains after translated paragraphs');
assert.match(root.innerHTML,/<nav class="lt-translation-bottom"[\s\S]*ltTranslationChapter\(14\)/);
window.ltTranslationChapter(36);
assert.match(root.innerHTML,/الترجمة العربية 37/);
assert.equal(headingFocuses,2,'chapter switch moves focus to newly mounted heading');
assert.match(root.innerHTML,/ltTranslationChapter\(37\)" disabled/,'last chapter has no phantom next');
assert.equal(state.chapter,13,'translation browsing cannot overwrite original reading progress');
const unchanged=root.innerHTML;
for(const invalid of [-1,37,99,NaN,Infinity,1.7,'','  ','01',null,false,true])window.ltTranslationChapter(invalid);
assert.equal(root.innerHTML,unchanged,'out-of-range chapter access cannot corrupt the screen');
state.page='reader';
window.ltTranslationChapter(5);
assert.equal(root.innerHTML,unchanged,'stale selector cannot hijack the reader');
state.story=arabic;state.page='reader';state.chapter=0;
window.fullTranslation();
assert.match(root.innerHTML,/lt-english-companion/);
assert.match(root.innerHTML,/English source 1/);
assert.doesNotMatch(root.innerHTML,/الترجمة العربية 1/);
assert.match(root.innerHTML,/<p lang="en" dir="ltr">English source 1<\/p>/);
assert.equal((root.innerHTML.match(/<option /g)||[]).length,20);
assert.match(root.innerHTML,/ltTranslationChapter\(-1\)" disabled/,'first chapter has no previous');
window.ltTranslationChapter('19');
assert.match(root.innerHTML,/English source 20/);
assert.equal(state.chapter,0,'Arabic original bookmark remains in its source chapter');
state.story=english;
window.ltTranslationChapter(0);
assert.match(root.innerHTML,/English source 20/,'old story translation cannot replace new story view');
assert.equal(originalCalls,0);
assert.deepEqual(scrolls.map(v=>Array.from(v)),Array(4).fill([0,0]),
 'each real chapter-view change resets only companion scroll');
const css=fs.readFileSync('app/src/main/assets/reader-experience.css','utf8');
assert.match(css,/\.arabic-page \.lt-translation-nav select/);
assert.match(css,/\.arabic-page \.lt-translation-nav :focus-visible/);
assert.match(css,/\.arabic-page \.lt-translation-bottom :focus-visible/);
assert.match(css,/@media\(max-width:560px\)/);

// Historical chapters in production contain many more paragraph pairs than
// this synthetic tiny fixture; create enough for exact original anchor indices.
english.id='around-the-world-in-eighty-days-towle';
for(const [chapterIndex,lastAnchor,src] of [
 [2,27,'verne-route-map-1872.webp'],
 [10,43,'verne-kiouni-1873.webp'],
 [20,34,'verne-tankadere-1872.webp']
]){
 english.chapters[chapterIndex].paragraphs=Array.from({length:lastAnchor+1},(_,i)=>({
  en:'English source '+(i+1),ar:'الترجمة العربية '+(i+1)
 }));
 state.story=english;state.page='reader';state.chapter=chapterIndex;
 window.fullTranslation();
 assert.match(root.innerHTML,/lt-companion-plate/,'chapter matching antique scan gets a picture');
 assert.ok(root.innerHTML.includes('art/'+src),'the original local archive file is reused');
 assert.equal((root.innerHTML.match(/class="lt-companion-plate"/g)||[]).length,1,
  'one real engraving rather than decorative filler');
 assert.equal((root.innerHTML.match(/<p lang="ar" dir="rtl">/g)||[]).length,lastAnchor+1,
  'all contextual Arabic text survives scene insertion');
}
console.log('PASS: 37-chapter and Arabic-original companions render one escaped chapter at a time; all chapters available; source progress untouched');
