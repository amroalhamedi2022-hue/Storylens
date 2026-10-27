'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../app/src/main/assets/reader-experience.js'),'utf8');
const store=new Map();
const story={id:'novel',chapters:[{title:'One',paragraphs:[
 {en:'The opening paragraph is a real English sentence.',ar:'الفقرة الأولى.'},
 {en:'The second paragraph has a different location.',ar:'الفقرة الثانية.'}
]}]};
let top=100,rendered=0;
const node={dataset:{i:'1'},nextElementSibling:null,
 getBoundingClientRect(){return {top,bottom:top+80};},
 addEventListener(){},setAttribute(){},insertAdjacentElement(){}};
const window={innerHeight:700,scrollY:500,scrollTo(x,y){this.lastScroll=[x,y];}};
const document={documentElement:{lang:'ar'},querySelector(){return null;},
 querySelectorAll(selector){return selector==='.reader .sentence'?[node]:[];}};
const sandbox={window,document,state:{story,page:'reader',chapter:0,toolbar:false},
 catalog:{stories:[story],genres:[]},
 get:(k,f)=>store.has(k)?store.get(k):f,
 put:(k,v)=>store.set(k,v),
 esc:String,Date,library(){},openStory(){},settings(){},theme(){},inlineTranslate(){},
 wordSheet(){},renderReader(){rendered++;},closeSheet(){}};
vm.runInNewContext(source,sandbox,{timeout:5000});
window.stlBookmark();
const saved=store.get('bookmarks').novel;
assert.equal(saved.chapter,0);
assert.equal(saved.scroll,500);
assert.equal(saved.paragraph,1);
assert.equal(saved.viewportOffset,100);
top=180;window.scrollY=0;
window.stlJumpBookmark();
assert.equal(rendered,1);
assert.equal(window.lastScroll[1],80,'new font layout uses paragraph anchor, not stale 500px');
store.get('bookmarks').novel={chapter:0,scroll:400,paragraph:999,viewportOffset:100};
window.stlJumpBookmark();
assert.equal(window.lastScroll[1],400,'invalid paragraph falls back to legacy pixel scroll');
store.get('bookmarks').novel={chapter:0,scroll:320};
window.stlJumpBookmark();
assert.equal(window.lastScroll[1],320,'old backup remains readable');
store.get('bookmarks').novel={chapter:0,scroll:250,paragraph:1,viewportOffset:Infinity};
window.stlJumpBookmark();
assert.equal(window.lastScroll[1],250,'corrupt offsets do not enter scroll calculation');
console.log('PASS semantic bookmark geometry, legacy restore, invalid anchor fallback');
