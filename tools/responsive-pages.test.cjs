'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const start=source.indexOf('function ltPageStarts(');
const end=source.indexOf('// Do not let page gestures',start);
assert.ok(start>0&&end>start,'production adaptive page functions are extractable');
const env={LT_PAGE_PARAGRAPHS:4};
vm.runInNewContext(source.slice(start,end)+'\nglobalThis.starts=ltPageStarts;globalThis.forParagraph=ltPageForParagraph;',env);
const starts=env.starts,locate=env.forParagraph;
const short=Array(12).fill(60),long=Array(12).fill(330);
const phone=Array.from(starts(long,720,320,24));
const tablet=Array.from(starts(long,1150,850,18));
assert.equal(phone[0],0);
assert.equal(tablet[0],0);
assert.ok(phone.length>tablet.length,'large type and narrow phones create shorter pages');
assert.ok(phone.every((p,i)=>i===0||p>phone[i-1]),'page boundaries increase strictly');
assert.ok(tablet.every((p,i)=>i===0||p>tablet[i-1]));
assert.ok(Array.from(starts(short,900,880,18)).length>=3,'never exceed the four-paragraph cap');
assert.deepEqual(Array.from(starts([],720,320,24)),[],'empty chapters cannot fabricate pages');
assert.deepEqual(Array.from(starts([100],720,320,24)),[0],'single paragraph fits a dedicated page');
assert.deepEqual(Array.from(starts([4000,60,4000],640,300,32)),[0,1,2],
 'very long paragraphs remain whole and do not swallow neighboring passages');
for(let paragraph=0;paragraph<long.length;paragraph++){
 const page=locate(phone,paragraph);
 assert.ok(phone[page]<=paragraph,'semantic anchor never jumps forward');
 assert.ok(page===phone.length-1||phone[page+1]>paragraph,
  'semantic anchor never returns to an earlier sheet');
}
assert.equal(locate(phone,NaN),0,'corrupt imported anchors are safe');
assert.equal(locate(phone,-1),0,'negative anchors are safe');
assert.equal(locate(phone,99999),phone.length-1,'out-of-range old progress clamps to last page');
assert.deepEqual(Array.from(starts([120,360,80,900,150],NaN,NaN,NaN)).slice(0,2),[0,1],
 'bad WebView geometry falls back to deterministic safe bounds');
assert.match(source,/const anchorKey='readpage_anchor_'/,'semantic progress key used');
assert.match(source,/put\(anchorKey,starts\[current\]\|\|0\)/,'per-turn anchor persisted');
assert.match(source,/savedReaderPage\*LT_PAGE_PARAGRAPHS/,'older bookmark backup remains restorable');
assert.match(source,/Math\.max\(0,length-1\)/,'cross-chapter reverse navigation starts at last paragraph');
const backup=fs.readFileSync('app/src/main/assets/data-backup.js','utf8');
assert.match(backup,/readpage_anchor\|reading_anchor/,'semantic page anchors included in backups');
assert.match(backup,/tail\.startsWith\('readpage_anchor_'\)/,'anchors validated on import');
console.log('PASS: phone/tablet adaptive page groups, semantic anchors, old bookmarks and portable backups');

/* Execute the production width-change handler with queued WebView resize
 * events. Height-only keyboard changes must preserve focus and reading page. */
const resizeStart=source.indexOf('let ltLastLayoutWidth=');
const resizeEnd=source.indexOf('library(); // Re-render once',resizeStart);
assert.ok(resizeStart>0&&resizeEnd>resizeStart,'orientation resizer exists in production');
const callbacks={};let pending=null,rerenders=0,cancelled=0,scrolls=0;
const sheet={isConnected:true,getBoundingClientRect:()=>({top:18})};
const env2={
 state:{page:'reader',story:{id:'book'}},
 document:{querySelector:()=>sheet},
 renderReader:()=>{rerenders++;},
 window:{
  innerWidth:360,innerHeight:800,
  addEventListener:(name,fn)=>{callbacks[name]=fn;},
  setTimeout:fn=>{pending=fn;return 17;},
  clearTimeout:()=>{cancelled++;}
 }
};
sheet.scrollIntoView=()=>{scrolls++;};
vm.runInNewContext(source.slice(resizeStart,resizeEnd),env2);
assert.equal(typeof callbacks.resize,'function','resize is registered once');
env2.window.innerWidth=360;callbacks.resize();
assert.equal(pending,null,'unchanged viewport does not rerender');
env2.window.innerHeight=450;callbacks.resize();
assert.equal(pending,null,'keyboard resize without width change is ignored');
env2.window.innerWidth=405;callbacks.resize();
assert.equal(pending,null,'tiny width jitter does not rerender');
env2.window.innerWidth=720;callbacks.resize();
assert.equal(typeof pending,'function','rotation schedules one batched rerender');
env2.window.innerWidth=780;callbacks.resize();
assert.equal(cancelled,1,'rapid width changes debounce previous remount');
const rotate=pending;rotate();
assert.equal(rerenders,1,'orientation recomputes pages once');
assert.equal(scrolls,1,'after rotation book stays visible');
env2.state.page='library';env2.window.innerWidth=360;callbacks.resize();
const afterLibrary=pending;afterLibrary();
assert.equal(rerenders,1,'resizing in library never remounts the old reader');
env2.state.page='reader';env2.window.innerWidth=700;callbacks.resize();
sheet.isConnected=false;pending();
assert.equal(rerenders,1,'detached old sheets cannot be rerendered');
// With a visible paragraph, orientation uses the same position-preserving
// reflow as typography, not a hard jump to the start of the paper.
sheet.isConnected=true;
const semantic=[];
env2.captureParagraphAnchor=()=>({paragraph:6,viewportOffset:93});
env2.window.LinguaReflowReader=anchor=>{semantic.push(anchor);};
env2.window.innerWidth=1040;callbacks.resize();
pending();
assert.equal(semantic.length,1,'width change invokes one semantic reflow');
assert.equal(semantic[0].paragraph,6,'same paragraph remains visible after rotation');
assert.equal(semantic[0].viewportOffset,93,'exact viewport offset is preserved');
assert.equal(rerenders,1,'semantic reflow replaces legacy hard-scroll behavior');
console.log('PASS: orientation/multi-window repagination, keyboard resize safety and semantic reading position');

/* Test the source reflow bridge with a visible semantic paragraph. */
assert.match(source,/const computedSize=Number\.parseFloat\(window\.getComputedStyle/,
 'paper grouping uses actual CSS font size after theme/typography changes');
const typoStart=source.indexOf('window.LinguaReflowReader=function(anchor){');
const typoEnd=source.indexOf('\n};\n// Adaptive paper grouping',typoStart);
assert.ok(typoStart>0&&typoEnd>typoStart,'production typography reflow bridge exists');
let renderCount=0;const stored=[],scrollRestored=[];
const visibleParagraph={dataset:{i:'3'},getBoundingClientRect(){return {top:180};}};
const typoEnv={
 state:{page:'reader',chapter:0,story:{id:'book'}},
 put:(key,value)=>stored.push([key,value]),renderReader:()=>{renderCount++;},
 document:{querySelectorAll:()=>[visibleParagraph]},
 window:{scrollY:400,scrollTo:(x,y)=>scrollRestored.push([x,y])}
};
vm.runInNewContext(source.slice(typoStart,typoEnd+3),typoEnv);
typoEnv.window.LinguaReflowReader({paragraph:3,viewportOffset:100});
assert.equal(renderCount,1,'changing reading typography rebuilds the paper');
assert.deepEqual(stored,[['readpage_anchor_book_0',3]],
 'visible paragraph is retained across font and size changes');
assert.deepEqual(scrollRestored,[[0,480]],
 'same paragraph keeps its viewport position after repagination');
typoEnv.state.page='library';
typoEnv.window.LinguaReflowReader({paragraph:2,viewportOffset:100});
assert.equal(renderCount,1,'font settings in the library do not open a book');
console.log('PASS: typography changes repaginate at real font metrics without jumping paragraphs');
