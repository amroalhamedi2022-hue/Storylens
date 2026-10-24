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
assert.ok(window.LinguaShell.themeNames.includes('solar-atelier'));
assert.equal(window.LinguaShell.applyTheme('solar-atelier'),true);
assert.equal(state.uiTheme,'solar-atelier');
assert.equal(store.get('uiTheme'),'solar-atelier');
assert.ok(added.includes('theme-solar-atelier'));
assert.ok(removed.includes('theme-aurora'));
assert.equal(window.LinguaShell.applyTheme('remote-url'),false);
assert.equal(state.uiTheme,'solar-atelier');
for(const selector of [
 'body.theme-solar-atelier',
 '.theme-solar-atelier .library .storylens-hero',
 '.theme-solar-atelier .library .shelf .card',
 '.theme-solar-atelier .lt-drawer',
 '.theme-solar-atelier .reader:not(.dark)',
 '.lt-theme-solar-atelier .lt-theme-swatch'
]) assert.ok(css.includes(selector),'missing theme surface '+selector);
assert.ok(!/https?:\/\//.test(css.slice(css.indexOf('/* LT-13 Solar Atelier:'))),
 'new theme cannot fetch remote images or fonts');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(css.slice(css.indexOf('/* LT-13 Solar Atelier:'))),
 'new theme must not introduce infinite animation');
console.log('PASS Solar Atelier: production theme persistence, input guard, six themed surfaces, offline CSS');
