'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const root='app/src/main/assets/';
const read=p=>fs.readFileSync(root+p,'utf8');
const index=read('index.html'),reader=read('reader-experience.js');
const shell=read('lingua-shell.js'),css=read('lt-product-polish.css');
const backup=read('data-backup.js');
const touch=read('lt-tap-feedback.js');

assert.ok(index.includes('href="lt-product-polish.css"'),'compact library CSS loaded');
assert.ok(index.includes('src="lt-tap-feedback.js"'),'liquid touch handler installed');
assert.ok(index.includes("(chapter.title||'')"),'English original chapter heading selected regardless of UI');
assert.ok(!index.includes('chapter.titleAr||chapter.title'),'Arabic heading not substituted for English');
assert.match(css,/-webkit-tap-highlight-color:transparent/,'native blue Android ripple removed');
assert.match(css,/\.lt-tap-bubble/,'real liquid bubble animation exists');
assert.match(css,/prefers-reduced-motion:reduce/,'reduced-motion choice respected');
assert.ok(shell.includes("drawer.appendChild(titleSearch)"),'library search moved to the menu');
assert.ok(shell.includes("drawer.appendChild(chapterSearch)"),'chapter search remains available');
assert.match(css,/\.library \.storylens-hero/,'oversized home hero compacted');
assert.match(css,/content-visibility:auto/,'offscreen book cards defer rendering');
assert.match(css,/backdrop-filter:none!important/,'card and hero blur cost reduced');
assert.match(reader,/sentenceBox\.addEventListener\('pointerdown'/,'press edge of paper');
assert.match(reader,/sentenceBox\.addEventListener\('pointermove'/,'fold follows drag');
assert.match(reader,/sentenceBox\.addEventListener\('pointerup'/,'drag release commits turn');
const edgeSource=reader.match(/function pageEdgeDelta\(edge,rtl\)\{[^}]+\}/);
assert.ok(edgeSource,'production pointer drag exposes RTL-aware binding direction');
const edgeDelta=vm.runInNewContext('('+edgeSource[0]+')');
assert.equal(edgeDelta('right',false),1,'LTR right edge advances');
assert.equal(edgeDelta('left',false),-1,'LTR left edge returns');
assert.equal(edgeDelta('left',true),1,'RTL left edge advances');
assert.equal(edgeDelta('right',true),-1,'RTL right edge returns');
assert.match(reader,/pageEdgeDelta\(drag\.edge,document\.documentElement\.dir==='rtl'\)/,'held release uses locale binding');
assert.match(reader,/const delta=edge\?pageEdgeDelta\(edge,document\.documentElement\.dir==='rtl'\):0/,'edge direction computed once');
assert.match(reader,/delta<0&&current===0&&state\.chapter===0/,'first page protects the correct backward edge');
assert.match(reader,/\bfinishPaperDrag\(true\)/,'commit paper release');
assert.match(reader,/Math\.abs\(dy\)>15/,'vertical scroll must not turn paper');
assert.match(reader,/\.closest\?\.\('\.tok,button/,'dictionary selection/controls protected');
assert.match(reader,/state\.chapter===0\)return;/,'first chapter cannot turn backward');
assert.match(reader,/Math\.ceil\(length\/LT_PAGE_PARAGRAPHS\)-1/,'backward turn opens last page of previous chapter');
assert.match(reader,/prev\.disabled=current===0&&state\.chapter===0/,'previous is available across chapter boundary');
assert.match(css,/\.lt-book-page\.lt-paper-grabbed/,'live paper transform is styled');
assert.match(css,/\.lt-page-controls button:focus-visible/,'keyboard page controls remain operable');
assert.match(css,/body\.theme-liquid-27/,'new Liquid 27 color family');
assert.match(shell,/openThemeEditor\(name,b\)/,'theme long press opens edit mode');
assert.match(shell,/input\.type='color'/,'real color picker available');
assert.match(shell,/ltHiddenThemes/,'hidden themes can be restored');
assert.match(backup,/ltThemeCustomColors/,'theme palettes included in portable backup');
assert.match(backup,/ltHiddenThemes/,'hidden choices included in portable backup');

// Execute actual tap controller in a small mocked DOM: verifies bubble trigger,
// coordinates, cleanup and accessibility/reduced-motion safety.
const listeners={};let reduced=false,created=null;
const bubbleNode=()=>({className:'',attributes:{},styles:{},
 setAttribute(k,v){this.attributes[k]=v;},
 style:{setProperty(k,v){this[k]=v;}},
 addEventListener(k,fn){this[k]=fn;},
 remove(){this.wasRemoved=true;}});
const dom={addEventListener(k,fn){listeners[k]=fn;},createElement(){created=bubbleNode();return created;}};
const childNodes=[];
const target={disabled:false,style:{},matches:()=>false,
 closest:()=>target,querySelectorAll:()=>[],appendChild(node){childNodes.push(node);},
 getBoundingClientRect:()=>({left:10,top:20,width:90,height:50})};
const win={document:dom,matchMedia:()=>({matches:reduced})};
vm.runInNewContext(touch,{window:win},{filename:'lt-tap-feedback.js'});
assert.equal(typeof listeners.pointerdown,'function');
listeners.pointerdown({isPrimary:true,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'one real bubble appended');
assert.equal(created.className,'lt-tap-bubble');
assert.equal(created.style['--lt-tap-x'],'45px');
assert.equal(created.style['--lt-tap-y'],'25px');
created.animationend();assert.equal(created.wasRemoved,true,'animation cleans up node');
reduced=true;
listeners.pointerdown({isPrimary:true,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'reduced-motion does not spawn extra bubble');
// Execute the production fold geometry, not a reimplementation.
const geometrySource=reader.match(/function pageFoldGeometry\(progress,edge,vertical\)\{[\s\S]*?\n\}/);
assert.ok(geometrySource,'continuous paper fold geometry exists');
const foldGeometry=vm.runInNewContext('('+geometrySource[0]+')');
assert.equal(foldGeometry(0,'right',0).cut,'0.00%');
assert.equal(foldGeometry(.5,'right',0).cut,'24.00%');
assert.equal(foldGeometry(1,'left',0).cut,'48.00%');
assert.equal(foldGeometry(10,'right',0).cut,'48.00%','overscroll stays clamped');
assert.equal(foldGeometry(-1,'left',0).cut,'0.00%','negative drag stays clamped');
assert.equal(foldGeometry(.5,'right',220).skew,'-7.00deg');
assert.equal(foldGeometry(.5,'left',220).skew,'7.00deg');
assert.match(reader,/underneath\?\.classList\.add\('lt-paper-underlay'\)/,'real neighboring page is revealed');
assert.match(reader,/pages\.forEach\(item=>item\.classList\.remove\('lt-paper-underlay'\)\)/,'cancel/release restores hidden page');
assert.match(reader,/sentenceBox\.releasePointerCapture\?\.\(held\.id\)/,'pointer capture is released');
assert.match(css,/\.lt-book-page\.lt-paper-underlay\{display:block!important;position:absolute/);
assert.match(css,/clip-path:inset\(0 var\(--lt-fold-right,0%\) 0 var\(--lt-fold-left,0%\)\)/);
assert.match(css,/\.lt-paper-grabbing\[data-lt-fold-edge="right"\]:after/);
assert.match(css,/\.lt-paper-grabbing\[data-lt-fold-edge="left"\]:after/);
assert.match(css,/prefers-reduced-motion:reduce/);
// Execute the installed pointer handlers against a two-page DOM. A second
// finger's cancellation/lost capture must not release the primary held sheet.
const dragStart=reader.indexOf(' let drag=null,foldRaf=null;');
const dragEnd=reader.indexOf(" renderPage('next',false);",dragStart);
const helperStart=reader.indexOf('function pageEdgeDelta(');
const helperEnd=reader.indexOf('\n// A timeout',helperStart);
assert.ok(dragStart>0&&dragEnd>dragStart&&helperStart>0&&helperEnd>helperStart,
 'real production drag handlers and geometry are extractable');
const dragSource=reader.slice(helperStart,helperEnd)+reader.slice(dragStart,dragEnd);
function testPointerOwnership(){
 const events={},turns=[],foldClasses=new Set();
 let frame=null;
 const classList=store=>({
  add(name){store.add(name);},
  remove(name){store.delete(name);}
 });
 const style=()=>({values:{},setProperty(name,value){this.values[name]=value;},
  removeProperty(name){delete this.values[name];}});
 const page=()=>({classList:classList(new Set()),style:style()});
 const sheet={
  dataset:{},classList:classList(foldClasses),style:style(),
  getBoundingClientRect(){return {left:0,width:400};},
  addEventListener(name,handler){events[name]=handler;},
  setPointerCapture(){},releasePointerCapture(){}
 };
 const sandbox={sentenceBox:sheet,pages:[page(),page()],current:0,
  state:{page:'reader'},document:{documentElement:{dir:'ltr'}},
  move:delta=>turns.push(delta),
  window:{
   matchMedia:()=>({matches:false}),
   getSelection:()=>({toString:()=>''}),
   requestAnimationFrame:cb=>{frame=cb;return 1;},
   cancelAnimationFrame:()=>{frame=null;}
  }};
 vm.runInNewContext(dragSource,sandbox,{filename:'production-pointer-fold.js'});
 const down=id=>events.pointerdown({pointerId:id,isPrimary:true,button:0,
  clientX:395,clientY:50,target:{closest:()=>null}});
 const drag=id=>events.pointermove({pointerId:id,clientX:210,clientY:52,
  cancelable:true,preventDefault(){}});
 down(7);drag(7);
 events.pointercancel({pointerId:99});
 events.lostpointercapture({pointerId:99});
 assert.equal(typeof frame,'function','unrelated pointer must not cancel fold preview');
 frame();
 assert.ok(foldClasses.has('lt-paper-grabbing'),'primary finger retains visible fold');
 events.pointerup({pointerId:7});
 assert.deepEqual(turns,[1],'primary release still commits a forward turn');
 assert.ok(!foldClasses.has('lt-paper-grabbing'),'release cleans the fold');
 down(8);drag(8);
 events.pointercancel({pointerId:8});
 events.pointerup({pointerId:8});
 assert.deepEqual(turns,[1],'own pointercancel cancels without a page turn');
 down(9);drag(9);
 events.lostpointercapture({pointerId:9});
 events.pointerup({pointerId:9});
 assert.deepEqual(turns,[1],'own capture loss cancels without a page turn');
}
testPointerOwnership();

/* The last page is not a swipe-to-exit trap. Exercise the production move()
 * closure with both gesture and explicit-control sources, not a copy of its logic. */
const moveStart=reader.indexOf(" function move(delta,source='control'){");
const moveEnd=reader.indexOf(" prev.addEventListener('click'",moveStart);
assert.ok(moveStart>0&&moveEnd>moveStart,'production move handler can be extracted');
const moveSource=reader.slice(moveStart,moveEnd).trim();
let exits=0,advances=0;
const moveState={chapter:0,story:{id:'book',chapters:[{paragraphs:[{en:'End',ar:'النهاية'}]}]}};
const moveContext={current:0,pages:[{}],state:moveState,
 nextChapter:()=>advances++,libraryBack:()=>exits++,
 renderPage(){},renderReader(){},put(){},window:{scrollTo(){}},
 LT_PAGE_PARAGRAPHS:4};
const realMove=vm.runInNewContext('('+moveSource+')',moveContext);
realMove(1,'gesture');
assert.equal(exits,0,'swiping forward on the final page must keep the reader open');
realMove(1);
assert.equal(exits,1,'explicit end-of-book control still returns to library');
moveState.story.chapters.push({paragraphs:[{en:'More',ar:'المزيد'}]});
realMove(1,'gesture');
assert.equal(advances,1,'swiping at an ordinary chapter boundary still advances');
assert.match(reader,/move\(delta,'gesture'\)/,'pointer release is classified as a gesture');
assert.match(reader,/move\(\(rtl\?dx>0:dx<0\)\?1:-1,'gesture'\)/,'touch fallback is classified as a gesture');
assert.match(reader,/delta>0&&current===pages\.length-1&&state\.chapter===state\.story\.chapters\.length-1/,
 'a completed book has no misleading empty page fold');

console.log('PASS: English titles, compact library, live fold, safe final-page gesture, pointer ownership, Liquid 27 and touch feedback');
