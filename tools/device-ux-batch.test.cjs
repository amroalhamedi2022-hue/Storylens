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
