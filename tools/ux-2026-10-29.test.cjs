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
console.log('PASS: English titles, compact library, interactive paper guards, Liquid 27 customization and actual touch bubble handler');
