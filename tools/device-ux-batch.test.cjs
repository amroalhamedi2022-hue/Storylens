'use strict';const a=require('node:assert/strict'),fs=require('node:fs');
const read=f=>fs.readFileSync(f,'utf8');
const shell=read('app/src/main/assets/lingua-shell.js');
const css=read('app/src/main/assets/lt-device-acceptance.css');
a.match(shell,/touchmove/);a.match(shell,/style\.transform='translate3d\('/);
a.match(shell,/lt-location-title/);a.match(css,/user-select:none!important/);
a.match(css,/\.lt-drawer-backdrop\.open\{pointer-events:none/);
a.match(css,/\.reader \.lt-book-page\{\s*min-height:0!important/);
a.match(read('app/src/main/assets/lt-tap-feedback.js'),/--lt-bubble-size/);
a.match(read('app/build.gradle.kts'),/applicationIdSuffix = "\.preview"/);
a.match(read('app/src/main/res/drawable/lingua_icon_foreground.xml'),/lingua_icon_mark/);
console.log('PASS: reader/device UX feedback regression');

const touchCss=require('node:fs').readFileSync('app/src/main/assets/lt-device-acceptance.css','utf8');
require('node:assert/strict').match(touchCss,/\.reader #sentences,\.reader \.lt-book-page\{touch-action:pan-y/);

const motionJs=require('node:fs').readFileSync('app/src/main/assets/lt-tap-feedback.js','utf8');
const sfxJs=require('node:fs').readFileSync('app/src/main/assets/lingua-ambience.js','utf8');
require('node:assert/strict').match(motionJs,/lt-header-concealed/);
require('node:assert/strict').match(sfxJs,/storyBubble=kind==='story'/);
require('node:assert/strict').match(sfxJs,/clickSound\(story\?'story':'button'\)/);

const contrastCss=require('node:fs').readFileSync('app/src/main/assets/lt-device-acceptance.css','utf8');
require('node:assert/strict').match(contrastCss,/\.theme-meridian-epilogue \.reader \.lt-book-page \.sentence\{color:#f7f1e5!important\}/);

/* Regression: the menu control is a real non-selectable graphic. */
const vm = require('node:vm');
const selectorSource = read('app/src/main/assets/lingua-shell.js');
a.match(selectorSource, /const toggle=addButton\(header,'',/);
a.match(selectorSource, /menuGlyph\.setAttribute\('aria-hidden','true'\)/);
a.match(css, /\.lt-menu-toggle \.lt-menu-glyph\{/);

/* Exercise actual production scroll handler: tiny scroll events must add up,
   while upward scroll and opening the drawer bring back the header. */
const handlers = {};
const headerClasses = new Set();
const fakeHeader = {classList:{add(v){headerClasses.add(v);},remove(v){headerClasses.delete(v);}}};
const fakeDoc = {
 addEventListener(){},
 querySelector(q){return q==='.library .header'?fakeHeader:null;}
};
let drawerOpened=false;
const fakeWindow = {
 document:fakeDoc,scrollY:100,
 LinguaShell:{isDrawerOpen:()=>drawerOpened},
 addEventListener(event,callback){handlers[event]=callback;},
 matchMedia(){return {matches:false};},
 requestAnimationFrame(callback){callback();}
};
vm.runInNewContext(read('app/src/main/assets/lt-tap-feedback.js'),
 {window:fakeWindow,Math,Number},{timeout:2000});
const scrollTo = y => {fakeWindow.scrollY=y;handlers.scroll();};
scrollTo(100);
scrollTo(105);scrollTo(110);
a.equal(headerClasses.has('lt-header-concealed'),false);
scrollTo(115);
a.equal(headerClasses.has('lt-header-concealed'),true,'slow downward travel hides header');
scrollTo(110);scrollTo(105);scrollTo(100);
a.equal(headerClasses.has('lt-header-concealed'),false,'slow upward travel reveals header');
scrollTo(125);
a.equal(headerClasses.has('lt-header-concealed'),true);
drawerOpened=true;scrollTo(130);
a.equal(headerClasses.has('lt-header-concealed'),false,'drawer restores header');
scrollTo(70);
a.equal(headerClasses.has('lt-header-concealed'),false,'near top header stays visible');
console.log('PASS: menu icon nonselectable and smooth header slow-scroll hysteresis');


/* Novel-only visual shelf. Existing short fiction stays saved in the catalog,
   but only long-form books appear on the front-facing bookcase. */
const source = read('app/src/main/assets/lingua-shell.js');
const a1 = source.indexOf('function isFullLengthNovel(story){');
const a2 = source.indexOf('\nfunction decorateNovelShelf(section){',a1);
a.ok(a1>=0&&a2>a1,'real novel classifier is implemented');
const novelContext={};
vm.runInNewContext(source.slice(a1,a2)+'\nglobalThis.classify=isFullLengthNovel;',novelContext,{timeout:2000});
a.equal(novelContext.classify({chapters:[{},{}]}),false,'two-chapter story is excluded');
a.equal(novelContext.classify({chapters:[{},{},{},{},{}]}),false,'five-chapter novella is excluded');
a.equal(novelContext.classify({chapters:[],totalChapters:37}),true,'37-chapter lazy novel appears immediately');
a.equal(novelContext.classify({chapters:Array.from({length:20},()=>({}))}),true);
a.equal(novelContext.classify({chapters:[],totalChapters:0}),false,'empty placeholders not promoted');
a.match(source,/decorateNovelShelf\(section\);/,'actual library is decorated');
a.match(source,/card\.remove\(\);/,'short books removed only from the rendered shelf');
a.match(source,/title\.textContent=story\.title/,'cover title uses safe DOM text, not injected HTML');
a.match(source,/cover\.replaceChildren\(title\)/);
a.match(css,/\.library \.shelf\.lt-novel-shelf\{/);
a.match(css,/\.library \.lt-book-cover-title\{/);
a.match(css,/prefers-reduced-motion:reduce/);
const touchSource=read('app/src/main/assets/lt-tap-feedback.js');
a.match(touchSource,/heldPointers=new Map\(\)/,'water press tracks finger id');
a.match(touchSource,/pointercancel',releaseWaterPress/,'cancelled touches clean up');
a.match(touchSource,/Math\.min\(260,Math\.ceil/,'GPU work capped');
a.match(css,/\.lt-novel-card\.lt-water-pressed \.lt-book-cover/,'water press feedback styles the cover');
console.log('PASS: novel-first cover title, short-story exclusion, water-press lifecycle');

// Keep the drawer compact: show only categories with full-length books.
a.match(source,/catalog\.stories\.filter\(isFullLengthNovel\)/);
a.match(source,/catalog\.genres\.filter\(genre=>genresWithNovels\.has\(genre\.id\)\)/);
a.match(source,/searchChapters\(q,40,true\)/,'visible search returns only novels');

// Real novel-discovery filters cannot expose hidden cards through !important flex.
a.match(css,/\.lt-novel-card\[hidden\]\{display:none!important\}/,'hidden book covers remain invisible');
a.match(shell,/function refreshNovelShelf\(section\)\{/,'counter state follows live novel cards');
a.match(read('app/src/main/assets/library-experience.js'),/LinguaShell\?\.refreshNovelShelf/,'level, favorites and sorting update the novel shelf');
console.log('PASS: filtered novels stay hidden, counters and empty states stay synchronized');

// Vintage engraved-plate framing must not depend on heavy CSS filters or
// replace original art; captions and bilingual reading remain selectable.
a.match(css,/LT-UX04: tactile archival book plates/);
a.match(css,/\.reader \.lt-inline-illustration\{/);
a.match(css,/border:3px double #bba787!important/);
a.match(css,/\.lt-inline-illustration figcaption\{/);
a.match(css,/\.library \.lt-book-cover::after\{/);
const vintage=css.slice(css.indexOf('LT-UX04: tactile archival book plates'));
a.ok(!/filter\s*:|backdrop-filter\s*:|animation\s*:/.test(vintage),'avoid expensive GPU image filters and looping effects on long reading pages');
console.log('PASS: low-overhead period book-plate framing for in-text illustrations and covers');
