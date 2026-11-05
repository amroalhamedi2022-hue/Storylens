'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root='app/src/main/assets';
const css=fs.readFileSync(path.join(root,'lt-wen-reader-sanctuary.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const fixture=fs.readFileSync(path.join(root,'qa-wen-reader-sanctuary.html'),'utf8');
const wen=fs.readFileSync(path.join(root,'lt-wen-glass-engine.js'),'utf8');
const names=['liquid-27','aurora','aqua','nebula','paper-atlas','midnight-library'];
a.equal((html.match(/href="lt-wen-reader-sanctuary.css"/g)||[]).length,1);
a.ok(html.indexOf('href="lt-wen-reader-sanctuary.css"')>html.indexOf('href="lt-custom-gradient.css"'));
for(const name of names){
 a.ok(css.includes('body.theme-'+name+'{'),'Wen atmosphere must exist for '+name);
 a.ok(fixture.includes("'"+name+"'"),'Chromium QA exercises theme '+name);
}
a.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))!important'));
a.ok(css.includes('@media(max-width:849px)'));
a.match(css,/\.lt-wen-follow-lens/);
a.match(wen,/const FOLLOW=\.60, RELEASE_MS=265/);
a.match(css,/pointer-events:none!important/);
a.match(css,/object-fit:contain!important/);
a.match(css,/filter:none!important;mix-blend-mode:normal!important/);
a.match(css,/\.reader :is\(\.reading-width,.lt-book-page,.sentence,.tok/);
a.doesNotMatch(css,/@keyframes|setInterval|requestAnimationFrame/,
 'no idle visual loops or frame-driving scripts');
a.match(css,/prefers-reduced-motion:reduce/);
a.match(css,/prefers-reduced-transparency:reduce/);
a.match(fixture,/data-lt-reader-material="cream"/);
console.log('PASS Wen Glass six palettes, tablet shelf, original-colour art, quiet ink and reduced effects');
