'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const shell=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const backup=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
const chapters=[
 {title:'The Map',paragraphs:[
  {en:'The captain opened the secret map at sunrise.',ar:'فتح القبطان الخريطة السرية عند شروق الشمس.'},
  {en:'She found a hidden harbor.',ar:'عثرت على ميناء مخفي.'}]},
 {title:'The Return',paragraphs:[
  {en:'The captain returned to the harbor.',ar:'عاد القبطان إلى الميناء.'}]}
];
const story={id:'sea-story',title:'The Sea Story',chapters};
const catalog={stories:[story]};
const saved=new Map(),classes=[];
const paragraphNode={dataset:{i:'1'},scrollIntoView:opts=>{saved.set('jump',opts.block);}};
const document={
 documentElement:{lang:'en',dir:'ltr',dataset:{}},
 body:{classList:{add:x=>classes.push('+'+x),remove:x=>classes.push('-'+x)}},
 querySelectorAll:selector=>selector==='.reader .sentence'?[paragraphNode]:[],
 querySelector:()=>null,getElementById:()=>null,addEventListener:()=>{}
};
const window={addEventListener:()=>{},innerWidth:1000,scrollY:0,
 matchMedia:()=>({matches:true}),scrollTo:()=>{},requestAnimationFrame:fn=>fn(),
 setTimeout:fn=>{fn();return 1},clearTimeout:()=>{}};
const state={page:'library',story:null,chapter:0,uiTheme:'aurora'};
const context={window,document,state,catalog,Date,console,
 library(){},openStory(id){state.story=catalog.stories.find(s=>s.id===id);state.page='reader';},
 renderReader(){},libraryBack(){},closeSheet(){},
 get:(key,fallback)=>saved.has(key)?saved.get(key):fallback,
 put:(key,value)=>saved.set(key,value)};
vm.runInNewContext(shell,context,{timeout:5000});
const search=window.LinguaShell.searchChapters;
assert.equal(search('').length,0); // no results without user query
assert.equal(search('x').length,0);
assert.equal(search('x'.repeat(81)).length,0);
assert.equal(search('captain').length,2);
assert.equal(search('الخريطة').length,1);
assert.equal(search('HARBOR').length,2);
assert.equal(search('harbor',1).length,1);
assert.equal(search('harbor',999).length,2);
assert.equal(search('harbor')[0].chapter,0);
assert.equal(search('harbor')[1].chapter,1);
assert.equal(search('captain')[0].en,chapters[0].paragraphs[0].en);
assert.equal(search('الخريطة')[0].ar,chapters[0].paragraphs[0].ar);
assert.equal(window.LinguaShell.jumpToChapterHit({storyId:'unknown',chapter:0,paragraph:0}),false);
assert.equal(window.LinguaShell.jumpToChapterHit({storyId:'sea-story',chapter:9,paragraph:0}),false);
assert.equal(window.LinguaShell.jumpToChapterHit({storyId:'sea-story',chapter:0,paragraph:99}),false);
assert.equal(window.LinguaShell.jumpToChapterHit({storyId:'sea-story',chapter:0,paragraph:1}),true);
assert.equal(state.page,'reader');
assert.equal(state.chapter,0);
assert.equal(saved.get('chapter_sea-story'),0);
assert.equal(saved.get('jump'),'center');
assert.equal(window.LinguaShell.themeNames.includes('moonlit-margins'),true);
assert.equal(window.LinguaShell.applyTheme('moonlit-margins'),true);
assert.equal(saved.get('uiTheme'),'moonlit-margins');
assert.ok(classes.includes('+theme-moonlit-margins'));
for(const selector of ['body.theme-moonlit-margins','.theme-moonlit-margins .storylens-hero',
 '.theme-moonlit-margins .shelf .card','.theme-moonlit-margins .reader.dark',
 '.lt-chapter-results','.lt-chapter-hit'])assert.ok(css.includes(selector),selector);
assert.ok(backup.includes("'moonlit-margins'"));
assert.ok(!/https?:\/\//.test(css.slice(css.indexOf('/* LT-13: Moonlit Margins'))));
assert.equal(chapters[0].paragraphs[0].ar,'فتح القبطان الخريطة السرية عند شروق الشمس.');
console.log('PASS: bilingual offline full-text search, bounded results, source-preserving paragraph jump, Moonlit theme');
