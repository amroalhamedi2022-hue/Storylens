'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const reader=fs.readFileSync(path.resolve(__dirname,'../app/src/main/assets/reader-experience.js'),'utf8');
const paragraphs=['First English paragraph.','Second English paragraph.','Third English paragraph.'];
let active=null;
const sentences=paragraphs.map((en,i)=>({
 dataset:{i:String(i)},attributes:{},handlers:{},style:{},textContent:en,nextElementSibling:null,matches(){return false},closest(){return null},
 querySelectorAll:()=>[],addEventListener(k,fn){(this.handlers[k]||=[]).push(fn)},
 setAttribute(k,v){this.attributes[k]=v},
 focus(){active=this;for(const f of this.handlers.focusin||[])f({target:this})}
}));
const cssVariables=new Map();
const document={documentElement:{lang:'en',style:{setProperty:(key,value)=>cssVariables.set(key,value)}},
 querySelectorAll:s=>s.includes('.reader .sentence')?sentences:[], querySelector:()=>null};
const story={id:'long',title:'Long',chapters:[{title:'Part',paragraphs:paragraphs.map(en=>({en,ar:'ترجمة'}))}]};
const state={page:'reader',story,chapter:0,toolbar:false};
const store=new Map(),window={scrollY:0,scrollTo(){}};
const sandbox={window,document,state,catalog:{stories:[story],dictionary:[]},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),
 library(){},openStory(){},libraryBack(){},settings(){},theme(){},
 inlineTranslate(){},renderReader(){},closeSheet(){},wordSheet(){},esc:String,
 lemmas:w=>[w],Date,console};
vm.runInNewContext(reader,sandbox,{timeout:5000});
sandbox.renderReader();
assert.ok(cssVariables.get('--lt-font-en'), 'reader render must apply the English font CSS variable');
assert.ok(cssVariables.get('--lt-font-ar'), 'reader render must apply the Arabic font CSS variable');
assert.ok(sentences.every(p=>p.style.fontFamily), 'reader paragraphs must receive the selected font without breaking keyboard navigation');
assert.deepEqual(sentences.map(p=>p.attributes.tabindex),['0','-1','-1']);
function key(p,name){
 const event={target:p,key:name,prevented:false,stopped:false,
 preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};
 for(const f of p.handlers.keydown||[])f(event);
 return event;
}
assert.equal(key(sentences[0],'Tab').prevented,false);
assert.equal(key(sentences[0],'ArrowUp').prevented,false);
assert.equal(key(sentences[0],'ArrowDown').prevented,true);
assert.equal(active,sentences[1]);
assert.deepEqual(sentences.map(p=>p.attributes.tabindex),['-1','0','-1']);
assert.equal(key(sentences[1],'ArrowDown').prevented,true);
assert.equal(active,sentences[2]);
assert.equal(key(sentences[2],'ArrowDown').prevented,false);
assert.equal(key(sentences[2],'ArrowUp').prevented,true);
assert.equal(active,sentences[1]);
console.log('PASS: single Tab stop, Up/Down English paragraph navigation, boundary/Tab safety');
