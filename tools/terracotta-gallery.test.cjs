'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const shell=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const backup=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
const store=new Map(),classes=[];
const document={documentElement:{lang:'en',dir:'ltr',dataset:{}},
 body:{classList:{add:x=>classes.push('+'+x),remove:x=>classes.push('-'+x)}},
 querySelectorAll:()=>[],querySelector:()=>null,getElementById:()=>null,addEventListener:()=>{}};
const window={addEventListener:()=>{},innerWidth:1200,scrollY:0,matchMedia:()=>({matches:false})};
const state={page:'reader',uiTheme:'aurora'};
vm.runInNewContext(shell,{window,document,state,library(){},openStory(){},libraryBack(){},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),closeSheet(){},Date,console},{timeout:5000});
assert.ok(window.LinguaShell.themeNames.includes('terracotta-gallery'));
assert.equal(window.LinguaShell.applyTheme('terracotta-gallery'),true);
assert.equal(state.uiTheme,'terracotta-gallery');
assert.equal(store.get('uiTheme'),'terracotta-gallery');
assert.ok(classes.includes('+theme-terracotta-gallery'));
assert.equal(window.LinguaShell.applyTheme('untrusted'),false);
for(const selector of ['body.theme-terracotta-gallery','.theme-terracotta-gallery .storylens-hero',
 '.theme-terracotta-gallery .shelf .card','.theme-terracotta-gallery .shelf .card .cover',
 '.theme-terracotta-gallery .lt-drawer','.theme-terracotta-gallery .reader:not(.dark)',
 '.theme-terracotta-gallery .reader.dark','.lt-theme-terracotta-gallery .lt-theme-swatch'])
 assert.ok(css.includes(selector),'missing theme surface '+selector);
const own=css.slice(css.indexOf('/* LT-13: Terracotta Gallery'));
assert.ok(own.includes('flex-direction:column')&&own.includes('border:8px solid'),'must have distinct framed-card geometry');
assert.ok(!/https?:\/\//.test(own),'theme must be offline');
assert.ok(backup.includes("'terracotta-gallery'"),'backup must preserve selected theme');
console.log('PASS: Terracotta Gallery distinct responsive CSS, shell state and backup allowlist');
