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
assert.ok(window.LinguaShell.themeNames.includes('celestial-atlas'));
assert.equal(window.LinguaShell.applyTheme('celestial-atlas'),true);
assert.equal(state.uiTheme,'celestial-atlas');
assert.equal(store.get('uiTheme'),'celestial-atlas');
assert.ok(classes.includes('+theme-celestial-atlas'));
assert.ok(classes.includes('-theme-aurora'));
assert.equal(window.LinguaShell.applyTheme('https://untrusted'),false);
for(const selector of ['body.theme-celestial-atlas','.theme-celestial-atlas .library .storylens-hero',
 '.theme-celestial-atlas .library .shelf .card','.theme-celestial-atlas .lt-drawer',
 '.theme-celestial-atlas .reader:not(.dark)','.lt-theme-celestial-atlas .lt-theme-swatch'])
 assert.ok(css.includes(selector),'missing themed surface '+selector);
const fragment=css.slice(css.indexOf('/* LT-13 Celestial Atlas —'));
assert.ok(!/https?:\/\//.test(fragment),'offline assets only');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(fragment),'no infinite animations');
assert.ok(fragment.includes('grid-template-columns:68px minmax(0,1fr)'),'unique observatory book-spine geometry');
const backup=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
assert.ok(backup.includes("'celestial-atlas'"),'backup accepts new theme without losing preferences');
console.log('PASS Celestial Atlas: distinct layout, reader, drawer, persistence, offline safety');
