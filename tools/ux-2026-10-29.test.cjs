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
assert.match(reader,/\bfinishPaperDrag\(true,event\)/,'commit paper release with actual hit-test coordinates');
assert.match(reader,/Math\.abs\(dy\)>15/,'vertical scroll must not turn paper');
assert.ok(reader.includes("if(!pageSwipeAllowed(event.target,window.getSelection?.()?.toString()||''))return;"),'dictionary selection and interactive start controls protected');
assert.match(reader,/pageFoldReleaseAllowed\(held\.target,endTarget/,'captured release checks actual landing surface');
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
 closest:selector=>selector==='button,.lt-theme-choice'?target:null,querySelectorAll:()=>[],appendChild(node){childNodes.push(node);},
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
listeners.pointerdown({isPrimary:true,pointerType:'mouse',button:2,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'right-click does not create a tap bubble');
listeners.keydown({key:'Enter',repeat:true,target});
assert.equal(childNodes.length,1,'repeated keyboard activation does not create a tap bubble');
listeners.keydown({key:'Enter',altKey:true,target});
assert.equal(childNodes.length,1,'Alt+Enter shortcut does not animate a button');
listeners.keydown({key:' ',ctrlKey:true,target});
assert.equal(childNodes.length,1,'Ctrl+Space shortcut does not animate a button');
target.isConnected=false;
listeners.pointerdown({isPrimary:true,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'detached buttons do not receive animation nodes');
target.isConnected=true;
const originalRect=target.getBoundingClientRect;
target.getBoundingClientRect=()=>({left:10,top:20,width:0,height:50});
listeners.pointerdown({isPrimary:true,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'zero-width controls never animate');
target.getBoundingClientRect=()=>({left:10,top:20,width:90,height:0});
listeners.pointerdown({isPrimary:true,target,clientX:55,clientY:45});
assert.equal(childNodes.length,1,'zero-height controls never animate');
target.getBoundingClientRect=originalRect;
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
assert.equal(foldGeometry(0,'right',0).top,'0.00%','no curve at rest');
assert.ok(parseFloat(foldGeometry(.5,'right',0).belly)>0,'half-pulled sheet bows inward');
assert.ok(parseFloat(foldGeometry(.5,'right',160).bottom)>
 parseFloat(foldGeometry(.5,'right',160).top),'drag height skews the curve toward the finger');
assert.ok(parseFloat(foldGeometry(.5,'left',-160).top)>
 parseFloat(foldGeometry(.5,'left',-160).bottom),'opposite vertical pull mirrors the curve');
assert.equal(foldGeometry(NaN,'right',Infinity).cut,'0.00%','invalid drag input is clamped');
assert.equal(foldGeometry(Infinity,'left',NaN).cut,'0.00%','nonfinite gesture never clips text');
assert.equal(foldGeometry(3,'left',0).cut,'48.00%','overscroll does not exceed the paper');
assert.equal(foldGeometry(.5,'right',0).rotation,'-26.00deg','right reverse face tilts inward');
assert.equal(foldGeometry(.5,'left',0).rotation,'26.00deg','left reverse face mirrors tilt');
assert.match(css,/clip-path:polygon\(0 0,/,'right page has a curved contour');
assert.match(css,/calc\(var\(--lt-fold-cut\) \+ var\(--lt-curl-belly\)\)/,'left curl reaches into sheet');
assert.match(css,/\.lt-paper-grabbing:before\{/,'moving shadow accompanies the fold');
assert.match(css,/--lt-flap-rotation/,'folded paper back has perspective');
assert.match(reader,/sentenceBox\.style\.setProperty\('--lt-curl-belly',geometry\.belly\)/,
 'production pointer frame installs curved geometry');
assert.match(reader,/--lt-fold-shadow'\]/,'fold cleanup resets dynamic shading');
assert.match(reader,/underneath\?\.classList\.add\('lt-paper-underlay'\)/,'real neighboring page is revealed');
assert.match(reader,/pages\.forEach\(item=>\{[\s\S]*?item\.classList\.remove\('lt-paper-underlay','lt-paper-grabbed'\)/,'cancel/release restores both old and current paper sheets');
assert.match(reader,/sentenceBox\.releasePointerCapture\?\.\(held\.id\)/,'pointer capture is released');
assert.match(css,/\.lt-book-page\.lt-paper-underlay\{display:block!important;position:absolute/);
assert.match(css,/clip-path:inset\(0 var\(--lt-fold-right,0%\) 0 var\(--lt-fold-left,0%\)\)/);
assert.match(css,/\.lt-paper-grabbing\[data-lt-fold-edge="right"\]:after/);
assert.match(css,/\.lt-paper-grabbing\[data-lt-fold-edge="left"\]:after/);
assert.match(css,/\.lt-paper-reverse-ink/,'the fold back carries mirrored paper ink');
assert.match(css,/@keyframes ltPaperSnapRight/,'right sheet returns toward its edge');
assert.match(css,/@keyframes ltPaperSnapLeft/,'left sheet returns toward its edge');
assert.match(css,/\.lt-paper-snapback\{[\s\S]*?pointer-events:none/,'recoil never captures controls');
assert.match(css,/\.lt-paper-reverse\{[\s\S]*?pointer-events:none/,'reverse face never steals taps');
assert.match(css,/\.lt-paper-reverse-ink\{[\s\S]*?scaleX\(-1\)/,'ink is mirrored on the back');
assert.match(css,/prefers-reduced-motion:reduce/);
// Execute the installed pointer handlers against a two-page DOM. A second
// finger's cancellation/lost capture must not release the primary held sheet.
const dragStart=reader.indexOf(' const installedStory=state.story,installedChapter=state.chapter;');
const dragEnd=reader.indexOf(" renderPage('next',false);",dragStart);
const helperStart=reader.indexOf('function pageSwipeAllowed(');
const helperEnd=reader.indexOf('\n// A timeout',helperStart);
assert.ok(dragStart>0&&dragEnd>dragStart&&helperStart>0&&helperEnd>helperStart,
 'real production drag handlers and geometry are extractable');
const dragSource=reader.slice(helperStart,helperEnd)+reader.slice(dragStart,dragEnd);
function testPointerOwnership(){
 const events={},turns=[],foldClasses=new Set();
 let frame=null,selected='',endSurface,paneWidth=400;
 const plainTarget={nodeType:1,closest:()=>null};
 const controlTarget={nodeType:1,closest:selector=>
  selector.includes('.tok')?null:{tagName:'BUTTON'}};
 const tokenTarget={nodeType:1,closest:selector=>
  selector.includes('.tok')||selector.includes('[role="button"]')?{className:'tok'}:null};
 const outsideTarget={nodeType:1,closest:()=>null};
 const outsideToken={nodeType:1,closest:selector=>
  selector.includes('.tok')?{className:'tok'}:null};
 endSurface=plainTarget;
 const classList=store=>({
  add(...names){names.forEach(name=>store.add(name));},
  remove(...names){names.forEach(name=>store.delete(name));},
  contains(name){return store.has(name);}
 });
 const style=()=>({values:{},setProperty(name,value){this.values[name]=value;},
  removeProperty(name){delete this.values[name];}});
 const page=()=>({classList:classList(new Set()),style:style(),
  querySelectorAll:()=>[{textContent:'English detective ink. '.repeat(40)}]});
 const fakeElement=()=>({attributes:{},children:[],style:style(),
  setAttribute(k,v){this.attributes[k]=v;},
  appendChild(node){this.children.push(node);},
  addEventListener(k,fn){this[k]=fn;},
  remove(){this.wasRemoved=true;}});

 const sheet={
  dataset:{},classList:classList(foldClasses),style:style(),children:[],
  appendChild(node){this.children.push(node);},

  getBoundingClientRect(){return {left:0,width:paneWidth};},
  contains(node){return node!==outsideTarget&&node!==outsideToken&&node!==null;}, 
  addEventListener(name,handler){events[name]=handler;},
  setPointerCapture(){},releasePointerCapture(){}
 };
 const sandbox={sentenceBox:sheet,pages:[page(),page()],current:0,
  state:{page:'reader',chapter:1},document:{documentElement:{dir:'ltr'},
   createElement:fakeElement,
   elementFromPoint:()=>endSurface},
  move:delta=>turns.push(delta),
  window:{
   matchMedia:()=>({matches:false}),
   getSelection:()=>({toString:()=>selected}),
   requestAnimationFrame:cb=>{frame=cb;return 1;},
   cancelAnimationFrame:()=>{frame=null;}
  }};
 vm.runInNewContext(dragSource,sandbox,{filename:'production-pointer-fold.js'});
 const down=(id,target=plainTarget)=>events.pointerdown({pointerId:id,isPrimary:true,button:0,
  clientX:395,clientY:50,target});
 const drag=id=>events.pointermove({pointerId:id,clientX:210,clientY:52,
  cancelable:true,preventDefault(){}});
 const up=id=>events.pointerup({pointerId:id,clientX:210,clientY:52,target:sheet});
 down(7);drag(7);
 events.pointercancel({pointerId:99});
 events.lostpointercapture({pointerId:99});
 assert.equal(typeof frame,'function','unrelated pointer must not cancel fold preview');
 // A scheduled frame must not paint a fold after navigation replaces its book.
 const staleFrame=frame;
 sandbox.state.chapter=2;
 staleFrame();
 assert.equal(foldClasses.has('lt-paper-grabbing'),false,
  'queued frame from a previous chapter must not paint stale paper');
 sandbox.state.chapter=1;
 // Stale frames now cancel their owning pointer immediately, so the next
 // valid gesture must start fresh instead of reusing the cancelled capture.
 down(7);drag(7);
 frame();
 assert.ok(foldClasses.has('lt-paper-grabbing'),'primary finger retains visible fold');
 assert.equal(sheet.children.length,1,'one inert paper back is allocated for this held drag');
 const back=sheet.children[0];
 assert.equal(back.className,'lt-paper-reverse','mirrored reverse of the real paper is visible');
 assert.equal(back.inert,true,'reverse cannot receive pointer or keyboard interaction');
 assert.equal(back.attributes['aria-hidden'],'true','reverse is not announced twice');
 assert.equal(back.children[0].children[0].textContent.length,420,'ink is bounded for long chapters');
 assert.equal(back.children[0].children[0].innerHTML,undefined,'no HTML/word buttons are copied');
 drag(7);frame();
 assert.equal(sheet.children.length,1,'repeated animation frames allocate no extra DOM');

 up(7);
 assert.deepEqual(turns,[1],'primary release still commits a forward turn');
 assert.ok(!foldClasses.has('lt-paper-grabbing'),'release cleans the fold');
 assert.equal(back.wasRemoved,true,'releasing the paper removes its temporary reverse');

 down(8);drag(8);
 events.pointercancel({pointerId:8});
 up(8);
 assert.deepEqual(turns,[1],'own pointercancel cancels without a page turn');
 down(9);drag(9);
 events.lostpointercapture({pointerId:9});
 up(9);
 assert.deepEqual(turns,[1],'own capture loss cancels without a page turn');
 // Captured pointerup targets the sheet, but the real release may land on a
 // dictionary word, an accessible control, or outside the visible viewport.
 down(10);drag(10);endSurface=controlTarget;up(10);
 assert.deepEqual(turns,[1],'release over a dictionary/control target cancels the turn');
 assert.ok(!foldClasses.has('lt-paper-grabbing'),'rejected release cleans the fold');
 down(11);drag(11);endSurface=null;up(11);
 assert.deepEqual(turns,[1],'release outside the viewport cannot navigate');
 // Releasing over a noninteractive surface elsewhere on screen must not
 // turn a page merely because it is inside the viewport and allowed by type.
 endSurface=outsideTarget;down(18);drag(18);up(18);
 assert.deepEqual(turns,[1],'release outside the reader sheet cancels the fold');
 endSurface=outsideToken;down(19);drag(19);up(19);
 assert.deepEqual(turns,[1],'foreign dictionary token cannot trigger a page turn');
 endSurface=plainTarget;
 down(12);drag(12);selected='selected phrase';up(12);selected='';
 assert.deepEqual(turns,[1],'selection created during the hold cancels navigation');
 down(13,controlTarget);drag(13);up(13);
 assert.deepEqual(turns,[1],'a gesture starting on a control cannot navigate');
 selected='already selected';down(14);drag(14);up(14);selected='';
 assert.deepEqual(turns,[1],'existing selection prevents a paper grab');
 down(15);drag(15);endSurface=tokenTarget;up(15);
 assert.deepEqual(turns,[1,1],'a page drag may naturally end over dictionary text');
 endSurface=plainTarget;
 down(16);drag(16);up(16);
 assert.deepEqual(turns,[1,1,1],'a subsequent valid gesture still turns the page');
 // Narrow panes have overlapping edge zones: the leftmost touch must be
 // interpreted as a left-edge grab, not incorrectly forced to the right.
 paneWidth=100;sandbox.state.chapter=1;
 events.pointerdown({pointerId:17,isPrimary:true,button:0,clientX:5,clientY:50,target:plainTarget});
 events.pointermove({pointerId:17,clientX:90,clientY:50,cancelable:true,preventDefault(){}});
 events.pointerup({pointerId:17,clientX:90,clientY:50,target:sheet});
 assert.deepEqual(turns,[1,1,1,-1],'narrow reader left-edge grab turns backward');
 // A held fold belongs only to the chapter/story/reader that started it.
 paneWidth=400;
 down(20);drag(20);sandbox.state.page='library';up(20);
 assert.deepEqual(turns,[1,1,1,-1],'leaving the reader cancels the old held fold');
 sandbox.state.page='reader';
 down(21);drag(21);sandbox.state.chapter=2;up(21);
 assert.deepEqual(turns,[1,1,1,-1],'switching chapters mid-drag cannot turn a stale page');
 down(22);drag(22);up(22);
 assert.deepEqual(turns,[1,1,1,-1],'old page refuses new gestures after chapter changes');
 sandbox.state.chapter=1;
 down(23);drag(23);sandbox.state.story={id:'other'};up(23);
 assert.deepEqual(turns,[1,1,1,-1],'switching stories mid-drag cancels the old turn');
 sandbox.state.story=undefined;
 sheet.isConnected=false;down(24);drag(24);up(24);
 assert.deepEqual(turns,[1,1,1,-1],'detached reading sheets cannot start a new fold');
 sheet.isConnected=true;
 down(25);drag(25);up(25);
 assert.deepEqual(turns,[1,1,1,-1,1],'valid page fold still works after stale-gesture cancellation');
 down(26);drag(26);
 sandbox.current=1;
 const changedPageFrame=frame;
 changedPageFrame();
 assert.equal(foldClasses.has('lt-paper-grabbing'),false,
  'a queued fold preview cannot draw on another page in the same chapter');
 up(26);
 assert.deepEqual(turns,[1,1,1,-1,1],
  'a held fold cannot turn a different page after page-index navigation');
 sandbox.current=0;
 // If another navigation occurs after the fold was already painted, cleanup
 // must remove the fold from the *old* page, not only the new active page.
 down(27);drag(27);frame();
 assert.equal(sandbox.pages[0].classList.contains('lt-paper-grabbed'),true,
  'old page receives fold preview before navigation');
 sandbox.current=1;up(27);
 assert.equal(sandbox.pages[0].classList.contains('lt-paper-grabbed'),false,
  'stale page fold class is removed after page navigation');
 assert.equal(sandbox.pages[0].style.values['--lt-fold-right'],undefined,
  'stale page fold clip is removed after page navigation');
 assert.deepEqual(turns,[1,1,1,-1,1],
  'cleanup after a page switch does not commit the stale fold');
 sandbox.current=0;
 // A dragged sheet that returns to its starting edge must not turn merely
 // because the earlier preview had already passed the commit threshold.
 down(28);drag(28);
 events.pointermove({pointerId:28,clientX:391,clientY:52,cancelable:true,preventDefault(){}});
 events.pointerup({pointerId:28,clientX:391,clientY:52,target:sheet});
 assert.deepEqual(turns,[1,1,1,-1,1],'returned-to-edge fold cancels instead of turning');
 // Page switches during pointermove must clean the original page immediately.
 down(29);drag(29);frame();
 sandbox.current=1;
 events.pointermove({pointerId:29,clientX:200,clientY:52,cancelable:true,preventDefault(){}});
 assert.equal(sandbox.pages[0].classList.contains('lt-paper-grabbed'),false,
  'stale preview is cleared immediately when pointer moves after page change');
 assert.equal(foldClasses.has('lt-paper-grabbing'),false,
  'reader no longer remains in grabbing state after page change');
 sandbox.current=0;
 // A partially turned sheet should visually settle back after cancellation,
 // without blocking the real paper or committing a navigation.
 down(30);drag(30);frame();
 const beforeRecoil=sheet.children.length;
 events.pointercancel({pointerId:30});
 assert.equal(sheet.children.length,beforeRecoil+1,'one paper recoil afterimage is created');
 const recoil=sheet.children.at(-1);
 assert.equal(recoil.className,'lt-paper-snapback');
 assert.equal(recoil.attributes['aria-hidden'],'true','animation is absent from accessibility tree');
 assert.equal(recoil.inert,true,'paper afterimage cannot steal taps');
 assert.ok(parseFloat(recoil.style.values['--lt-snap-width'])>0,'recoil starts at the held fold width');
 recoil.animationend();
 assert.equal(recoil.wasRemoved,true,'finished recoil removes its temporary node');
 assert.deepEqual(turns,[1,1,1,-1,1],'cancelled paper spring does not turn a page');

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
