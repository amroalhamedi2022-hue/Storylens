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
assert.ok(window.LinguaShell.themeNames.includes('rain-glass'),
 'legacy style remains available for safe backup imports');
assert.equal(window.LinguaShell.applyTheme('rain-glass'),false,
 'retired theme cannot be selected after the six-theme redesign');
assert.equal(state.uiTheme,'aurora','existing active theme is preserved');
assert.notEqual(store.get('uiTheme'),'rain-glass',
 'removed styles must not be saved as an active preference');
assert.equal(window.LinguaShell.applyTheme('https://untrusted'),false);
for(const selector of [
 'body.theme-rain-glass',
 '.theme-rain-glass .library .storylens-hero',
 '.theme-rain-glass .library .shelf .card',
 '.theme-rain-glass .lt-drawer',
 '.theme-rain-glass .reader:not(.dark)',
 '.lt-theme-rain-glass .lt-theme-swatch'
]) assert.ok(css.includes(selector),'missing theme surface '+selector);
assert.ok(!/https?:\/\//.test(css.slice(css.indexOf('/* LT-13 Rain Glass:'))),
 'new theme cannot fetch remote images or fonts');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(css.slice(css.indexOf('/* LT-13 Rain Glass:'))),
 'new theme must not introduce infinite animation');
console.log('PASS Rain Glass: production theme persistence, input guard, six themed surfaces, offline CSS');
