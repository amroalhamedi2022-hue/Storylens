'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const added=[],removed=[],store=new Map();
const classes={add:x=>added.push(x),remove:x=>removed.push(x)};
const document={
 documentElement:{lang:'ar',dir:'rtl',dataset:{}},body:{classList:classes},
 querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null,
 addEventListener:()=>{}
};
const state={page:'reader',uiTheme:'aurora'};
const window={addEventListener:()=>{},innerWidth:1000,scrollY:0,matchMedia:()=>({matches:false})};
const sandbox={window,document,state,library:()=>{},openStory:()=>{},libraryBack:()=>{},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),
 closeSheet:()=>{},Date,console};
vm.runInNewContext(script,sandbox,{timeout:5000});
assert.ok(window.LinguaShell.themeNames.includes('botanical-folio'));
assert.equal(window.LinguaShell.applyTheme('botanical-folio'),true);
assert.equal(state.uiTheme,'botanical-folio');
assert.equal(store.get('uiTheme'),'botanical-folio');
assert.ok(added.includes('theme-botanical-folio'));
assert.ok(removed.includes('theme-aurora'));
assert.equal(window.LinguaShell.applyTheme('remote-url'),false);
assert.equal(state.uiTheme,'botanical-folio');
for(const selector of [
 'body.theme-botanical-folio',
 '.theme-botanical-folio .library .storylens-hero',
 '.theme-botanical-folio .library .shelf .card',
 '.theme-botanical-folio .lt-drawer',
 '.theme-botanical-folio .reader:not(.dark)',
 '.lt-theme-botanical-folio .lt-theme-swatch'
]) assert.ok(css.includes(selector),'missing theme surface '+selector);
assert.ok(!/https?:\/\//.test(css.slice(css.indexOf('/* LT-13 Botanical Folio:'))),
 'new theme cannot fetch remote images or fonts');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(css.slice(css.indexOf('/* LT-13 Botanical Folio:'))),
 'new theme must not introduce infinite animation');
console.log('PASS Botanical Folio: production theme persistence, input guard, six themed surfaces, offline CSS');
