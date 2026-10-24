'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const classes=[],store=new Map();
const document={documentElement:{lang:'ar',dir:'rtl',dataset:{}},
 body:{classList:{add:x=>classes.push('+'+x),remove:x=>classes.push('-'+x)}},
 querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null,addEventListener:()=>{}};
const state={page:'reader',uiTheme:'aurora'};
const window={addEventListener:()=>{},innerWidth:1000,scrollY:0,matchMedia:()=>({matches:false})};
vm.runInNewContext(script,{window,document,state,library:()=>{},openStory:()=>{},libraryBack:()=>{},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),
 closeSheet:()=>{},Date,console},{timeout:5000});
assert.ok(window.LinguaShell.themeNames.includes('ink-workshop'));
assert.equal(window.LinguaShell.applyTheme('ink-workshop'),true);
assert.equal(state.uiTheme,'ink-workshop');
assert.equal(store.get('uiTheme'),'ink-workshop');
assert.ok(classes.includes('+theme-ink-workshop'));
assert.ok(classes.includes('-theme-aurora'));
assert.equal(window.LinguaShell.applyTheme('https://untrusted'),false);
for(const selector of ['body.theme-ink-workshop','.theme-ink-workshop .library .storylens-hero',
 '.theme-ink-workshop .library .shelf .card','.theme-ink-workshop .lt-drawer',
 '.theme-ink-workshop .reader:not(.dark)','.lt-theme-ink-workshop .lt-theme-swatch'])
 assert.ok(css.includes(selector),'missing themed surface '+selector);
const fragment=css.slice(css.indexOf('/* LT-13 Ink Workshop:'));
assert.ok(!/https?:\/\//.test(fragment),'offline assets only');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(fragment),'no infinite animations');
assert.ok(fragment.includes('grid-template-columns:105px minmax(0,1fr)'),'unique magazine card geometry');
console.log('PASS Ink Workshop: distinct layout, reader, drawer, persistence, offline safety');
