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
assert.ok(window.LinguaShell.themeNames.includes('monochrome-zine'));
assert.equal(window.LinguaShell.applyTheme('monochrome-zine'),true);
assert.equal(state.uiTheme,'monochrome-zine');
assert.equal(store.get('uiTheme'),'monochrome-zine');
assert.ok(classes.includes('+theme-monochrome-zine'));
for(const selector of ['body.theme-monochrome-zine','.theme-monochrome-zine .storylens-hero',
 '.theme-monochrome-zine .shelf .card','.theme-monochrome-zine .shelf .card .cover',
 '.theme-monochrome-zine .lt-drawer','.theme-monochrome-zine .reader:not(.dark)',
 '.theme-monochrome-zine .reader.dark','.lt-theme-monochrome-zine .lt-theme-swatch'])
 assert.ok(css.includes(selector),'missing zine theme surface '+selector);
const own=css.slice(css.indexOf('/* LT-13: Monochrome Zine'));
assert.ok(own.includes('text-transform:uppercase')&&own.includes('box-shadow:8px 8px 0'),
 'zine needs distinct collage/print geometry');
assert.ok(!/https?:\/\//.test(own),'must remain offline');
assert.ok(backup.includes("'monochrome-zine'"),'backup must preserve selected theme');
console.log('PASS: Monochrome Zine theme, distinct offline geometry and backup persistence');
