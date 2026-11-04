'use strict';
/* Wen Glass source-to-WebView port: DOM/gesture regression and packaging gate. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const script=fs.readFileSync('app/src/main/assets/lt-wen-glass-engine.js','utf8');
const css=fs.readFileSync('app/src/main/assets/lt-wen-glass-engine.css','utf8');
const index=fs.readFileSync('app/src/main/assets/index.html','utf8');
new vm.Script(script,{filename:'lt-wen-glass-engine.js'});
assert.match(index,/<link rel="stylesheet" href="lt-wen-glass-engine.css">/);
assert.match(index,/<script src="lt-wen-glass-engine.js"><\/script>/);
assert.equal((index.match(/<script src="lt-wen-glass-engine.js"><\/script>/g)||[]).length,1);
assert.match(script,/FOLLOW=\.60, RELEASE_MS=265, SLOP=8/);
assert.match(css,/--lt-wen-release:265ms/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css,/@media\(prefers-reduced-transparency:reduce\)/);
assert.match(css,/pointer-events:none!important/);
assert.match(css,/\.reader :is\(\.sentence,\.tok,\.reading-width,\.lt-book-page/);
assert.doesNotMatch(script,/localStorage|indexedDB|openStory\(|saveWord\(|sendSMS|fetch\(/);
assert.match(fs.readFileSync('app/src/main/assets/qa-wen-glass.html','utf8'),
 /data\.ltWenGlassQa/,'Browser acceptance checks actual pointer UI');

function classes(initial=[]){
 const s=new Set(initial);
 return {add:(...xs)=>xs.forEach(v=>s.add(v)),remove:(...xs)=>xs.forEach(v=>s.delete(v)),
   contains:x=>s.has(x),toggle:(x,val)=>{if(val)s.add(x);else s.delete(x)}};
}
function style(){
 const props=new Map();
 return {setProperty:(k,v)=>props.set(k,v),removeProperty:k=>props.delete(k),
   getPropertyValue:k=>props.get(k)||''};
}
const listeners=new Map();
const body={classList:classes(),style:style()};
let lensCount=0;
const track={classList:classes(),style:style(),children:[],querySelector:()=>track.children[0]||null,
 appendChild(e){this.children.push(e);e.isConnected=true;lensCount++},getBoundingClientRect:()=>({left:0,top:0,width:500,height:150})};
const el={classList:classes(),style:style(),disabled:false,isConnected:true,
 matches:()=>false,
 closest:(sel)=>sel.includes('button')?el:sel.includes('.lt-genre-list')?track:null,
 getBoundingClientRect:()=>({left:50,top:32,width:140,height:50})
};
const doc={
 body,hidden:false,
 addEventListener(type,handler){const a=listeners.get(type)||[];a.push(handler);listeners.set(type,a)},
 createElement(){return {classList:classes(),style:style(),setAttribute(){},isConnected:true}},
 querySelectorAll(){return []}
};
const rafs=[];
const win={document:doc,matchMedia:()=>({matches:false}),addEventListener(){},
 requestAnimationFrame(cb){rafs.push(cb);return rafs.length},
 cancelAnimationFrame(){},
 performance:{now:()=>100}};
vm.runInNewContext(script,{window:win});
function emit(type,props={}){
 const event={pointerId:5,pointerType:'touch',isPrimary:true,button:0,clientX:75,clientY:51,
   target:el,...props};
 for(const fn of listeners.get(type)||[])fn(event);
}
assert.equal(body.classList.contains('lt-wen-optics'),true,'glass engine installed');
emit('pointerdown');
assert.equal(win.LinguaWenGlass.activePointers,1);
assert.equal(el.classList.contains('lt-wen-pressed'),true);
assert.equal(lensCount,1,'only one nav lens, not one per button');
emit('pointermove',{clientX:125,clientY:72});
assert.equal(el.classList.contains('lt-wen-moving'),true);
while(rafs.length)rafs.shift()();
assert.ok(track.children[0].style.getPropertyValue('--lt-wen-lens-x'));
assert.equal(track.children[0].classList.contains('lt-wen-lens-live'),true);
emit('pointerup');
emit('lostpointercapture');
assert.equal(win.LinguaWenGlass.activePointers,0);
assert.equal(el.classList.contains('lt-wen-pressed'),false);
assert.equal(track.children[0].classList.contains('lt-wen-lens-live'),false);
emit('pointerdown');
assert.equal(lensCount,1,'reuses existing single lens');
emit('pointercancel');
assert.equal(win.LinguaWenGlass.activePointers,0);
emit('keydown',{key:'Enter',repeat:false});
assert.equal(el.classList.contains('lt-wen-keyboard'),true);
emit('keyup',{key:'Enter'});
assert.equal(el.classList.contains('lt-wen-keyboard'),false);
win.LinguaWenGlass.clear();
assert.equal(win.LinguaWenGlass.activePointers,0);
console.log('PASS: Wen Glass port has one shared lens, follows touch, cancels cleanly and leaves app native events/data untouched');
