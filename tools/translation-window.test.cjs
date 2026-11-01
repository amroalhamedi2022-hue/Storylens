'use strict';
// Execute the actual production translation window; no fake literary text is
// accepted as a substitute for the source-bound chapter data.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const begin=source.indexOf('let ltTranslationBook=null,ltTranslationIndex=0;');
const end=source.indexOf('\nrenderReader=function(){',begin);
assert.ok(begin>0&&end>begin,'source-bound companion controller exists');
let closed=0,originalCalls=0;const scrolls=[];
const root={innerHTML:''};
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
assert.match(root.innerHTML,/English chapter 14/);
assert.match(root.innerHTML,/الترجمة العربية 14/);
assert.doesNotMatch(root.innerHTML,/الترجمة العربية 13/);
assert.doesNotMatch(root.innerHTML,/English source 37/);
assert.match(root.innerHTML,/Test &lt;Book&gt;/,'user-visible titles are escaped');
assert.equal((root.innerHTML.match(/<option /g)||[]).length,37,'all 37 chapters stay selectable');
assert.equal((root.innerHTML.match(/<p lang="ar" dir="rtl">/g)||[]).length,1,
 'the complete novel no longer becomes thousands of DOM paragraphs');
assert.match(root.innerHTML,/ltTranslationChapter\(12\)/);
assert.match(root.innerHTML,/ltTranslationChapter\(14\)/);
window.ltTranslationChapter(36);
assert.match(root.innerHTML,/الترجمة العربية 37/);
assert.match(root.innerHTML,/ltTranslationChapter\(37\)" disabled/,'last chapter has no phantom next');
assert.equal(state.chapter,13,'translation browsing cannot overwrite original reading progress');
const unchanged=root.innerHTML;
for(const invalid of [-1,37,99,NaN,Infinity,1.7])window.ltTranslationChapter(invalid);
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
assert.match(css,/@media\(max-width:560px\)/);
console.log('PASS: 37-chapter and Arabic-original companions render one escaped chapter at a time; all chapters available; source progress untouched');
