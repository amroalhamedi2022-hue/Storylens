'use strict';
// Exercise the real production shell in a bounded offline DOM fixture.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const backup=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
const classes=[],store=new Map();
const document={
 documentElement:{lang:'ar',dir:'rtl',dataset:{}},
 body:{classList:{add:x=>classes.push('+'+x),remove:x=>classes.push('-'+x)}},
 querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null,addEventListener:()=>{}
};
const state={page:'reader',uiTheme:'aurora'};
const window={addEventListener:()=>{},innerWidth:1000,scrollY:0,matchMedia:()=>({matches:false})};
vm.runInNewContext(script,{window,document,state,library:()=>{},openStory:()=>{},libraryBack:()=>{},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),
 closeSheet:()=>{},Date,console},{timeout:5000});
assert.ok(window.LinguaShell.themeNames.includes('circuit-notebook'));
assert.equal(window.LinguaShell.applyTheme('circuit-notebook'),true);
assert.equal(state.uiTheme,'circuit-notebook');
assert.equal(store.get('uiTheme'),'circuit-notebook');
assert.ok(classes.includes('+theme-circuit-notebook'));
assert.ok(classes.includes('-theme-aurora'));
assert.equal(window.LinguaShell.applyTheme('https://untrusted'),false);
for(const selector of ['body.theme-circuit-notebook',
 '.theme-circuit-notebook .storylens-hero',
 '.theme-circuit-notebook .shelf .card',
 '.theme-circuit-notebook .shelf .card .cover',
 '.theme-circuit-notebook .lt-drawer',
 '.theme-circuit-notebook .reader:not(.dark)',
 '.theme-circuit-notebook .reader.dark',
 '.lt-theme-circuit-notebook .lt-theme-swatch'])
 assert.ok(css.includes(selector),'missing theme surface '+selector);
const own=css.slice(css.indexOf('/* LT-13: Circuit Notebook'));
assert.ok(own.includes('grid-template-columns:94px minmax(0,1fr)'),'not just a palette change');
assert.ok(own.includes('repeating-linear-gradient'),'static architectural paper texture missing');
assert.ok(!/https?:\/\//.test(own),'theme must work offline');
assert.ok(!/\banimation\s*:\s*[^;]*infinite/i.test(own),'no infinite repaints');
assert.ok(backup.includes("'circuit-notebook'"),'backup validation must accept new theme');
console.log('PASS: Circuit Notebook theme layout, bilingual shell, persistence, offline backup');
