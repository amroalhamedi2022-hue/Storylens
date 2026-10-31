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
