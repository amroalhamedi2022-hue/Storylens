'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const root='app/src/main/assets/';
const css=fs.readFileSync(root+'lt-reader-comfort-v2.css','utf8');
const html=fs.readFileSync(root+'index.html','utf8');
const shell=fs.readFileSync(root+'lingua-shell.js','utf8');
const qa=fs.readFileSync(root+'qa-reader-comfort-v2.html','utf8');
const wen=fs.readFileSync(root+'lt-wen-glass-engine.js','utf8');
const six=['liquid-27','aurora','aqua','nebula','paper-atlas','midnight-library'];
const match=shell.match(/const selectableThemeNames=\[([^\]]+)\]/);
assert.ok(match,'six-theme gallery exists');
assert.deepEqual([...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1]),six);
assert.doesNotMatch(shell,/if\(hiddenThemeNames\(\)\.includes\(name\)\)continue/);
assert.doesNotMatch(shell,/'Hide theme'/);
for(const name of ['royal-gold','imperial-gold','champagne','orange-sage','orchid-rose'])
 assert.ok(shell.includes("'"+name+"'"),'Wen visual preset '+name);
assert.equal((html.match(/href="lt-reader-comfort-v2.css"/g)||[]).length,1);
assert.ok(html.indexOf('href="lt-reader-comfort-v2.css"')>
 html.indexOf('href="lt-chapter-gallery.css"'),'style must cascade after gallery');
for(const material of ['book','fibre','white','cream','comfort','night']){
 assert.ok(css.includes('html[data-lt-reader-material="'+material+'"]'),
  'reader contrast for '+material);
 assert.ok(qa.includes("'"+material+"'"),'browser tests material '+material);
}
assert.match(css,/\.lt-book-page \.sentence/, 'overrides legacy fixed ink');
assert.match(css,/object-fit:contain!important/, 'primary historic art never cropped');
assert.match(css,/filter:none!important/, 'original art colours never modified');
assert.match(wen,/const FOLLOW=\.60, RELEASE_MS=265/, 'Wen gestures still owned by existing engine');
assert.match(css,/pointer-events:none!important/, 'optical lens never intercepts real clicks');
for(const rule of ['prefers-reduced-motion:reduce','prefers-reduced-transparency:reduce','forced-colors:active'])
 assert.ok(css.includes(rule),'safe accessibility fallback '+rule);
assert.doesNotMatch(css,/@keyframes|requestAnimationFrame|setInterval/,'no idle animation loops');
assert.match(qa,/lt-novel-card/,'novel cover remains part of browser QA');
console.log('PASS six stable app themes, five Wen palettes, six paper contrasts and untinted full-frame artwork');
