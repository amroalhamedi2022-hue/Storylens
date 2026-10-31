'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const reader=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const css=fs.readFileSync('app/src/main/assets/lt-product-polish.css','utf8');
assert.match(css,/\.reader #sentences\{[^}]*scroll-margin-top:/,
 'paper starts below the fixed reader toolbar');
const start=reader.indexOf(' function renderPage(direction,animate){');
const end=reader.indexOf('\n function move(delta',start);
assert.ok(start>0&&end>start,'production page renderer can be exercised');
const scrolls=[],turns=[],saved=[];
const sheet={scrollIntoView(options){scrolls.push(['paper',options]);}};
const makePage=()=>({classList:{toggle(){}},setAttribute(){},inert:false});
const pages=[makePage(),makePage()];
const env={
 current:0,pages,sentenceBox:sheet,
 prev:{},next:{},countLabel:{},chapterEnd:{},key:'readpage_test_0',
 anchorKey:'readpage_anchor_test_0',starts:[0,1],
 state:{chapter:0,story:{chapters:[{paragraphs:[{},{}]}]}},
 pageGroupLabel:(i,n)=>'Page '+(i+1)+' of '+n,
 uiText:(ar,en)=>en,put:(key,index)=>saved.push([key,index]),
 animatePageTurn:(page,dir)=>turns.push(dir),
 window:{matchMedia:()=>({matches:false}),scrollTo:arg=>scrolls.push(['window',arg])}
};
vm.runInNewContext(reader.slice(start,end)+'\nglobalThis.testRenderPage=renderPage;',env);
env.testRenderPage('next',true);
assert.equal(scrolls.length,1);
assert.equal(scrolls[0][0],'paper','a real page turn brings the book, not its cover, into view');
assert.equal(scrolls[0][1].block,'start');
assert.equal(scrolls[0][1].behavior,'auto','no competing smooth scroll during paper animation');
assert.equal(turns.length,1);
assert.equal(saved.at(-1)[1],0,'saving first paragraph anchor remains intact');
assert.equal(saved.at(-2)[1],0,'saving legacy page progress remains intact');
env.testRenderPage('next',false);
assert.equal(scrolls.at(-1)[0],'window','initial chapter render may show its illustration');
delete sheet.scrollIntoView;
env.testRenderPage('back',true);
assert.equal(scrolls.at(-1)[0],'window','older WebViews without scrollIntoView stay supported');
env.window.matchMedia=()=>({matches:true});
const before=turns.length;
env.testRenderPage('next',true);
assert.equal(turns.length,before,'reduced-motion avoids page transition animation');
assert.equal(scrolls.at(-1)[1].behavior,'auto');
console.log('PASS: reading page scrolls below toolbar on turns, cover stays on chapter open, old/reduced-motion fallbacks');
