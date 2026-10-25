'use strict';
// Keyboard dictionary: execute the actual reader wrapper against a tiny DOM
// fixture. The same source-bound lookup is used by mouse/touch and Enter.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const reader=fs.readFileSync(path.join(root,'app/src/main/assets/reader-experience.js'),'utf8');
const resolver=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-lookup.js'),'utf8');
const tokens=['She','went','on'].map(textContent=>({
 textContent,attributes:{},handlers:{},matches:s=>s==='.tok',
 setAttribute(k,v){this.attributes[k]=v;},
 focus(){document.activeElement=this;}
}));
const sentence={dataset:{i:'0'},nextElementSibling:null,handlers:{},attributes:{},
 querySelectorAll:s=>s==='.tok'?tokens:[],
 addEventListener(k,fn){(this.handlers[k]||=[]).push(fn);},
 setAttribute(k,v){this.attributes[k]=v;},
 focus(){document.activeElement=this;}
};
const document={activeElement:null,documentElement:{lang:'en'},
 querySelectorAll:s=>s==='.reader .sentence'?[sentence]:[],
 querySelector:()=>null,createRange:()=>({selectNodeContents(){},setEndBefore(token){this.token=token;},
 toString(){return ['','She ','She went '][tokens.indexOf(this.token)]||'';}})};
const story={id:'test',title:'Test',terms:[{term:'go on',type:'idiom',context:'تابع'}],
 chapters:[{title:'Start',paragraphs:[{en:'She went on',ar:'تابعت.'}]}]};
const store=new Map(),global={};
vm.runInNewContext(resolver,{window:global},{timeout:5000});
let opened=[],rendered=0;
const state={page:'reader',story,chapter:0,toolbar:false};
const sandbox={window:global,document,state,catalog:{stories:[story],dictionary:[]},
 get:(k,f)=>store.has(k)?store.get(k):f,put:(k,v)=>store.set(k,v),
 library(){},openStory(){},libraryBack(){},settings(){},theme(){},
 inlineTranslate(){},renderReader(){rendered++;},closeSheet(){},
 wordSheet:value=>opened.push(value),esc:String,lemmas:w=>w==='went'?['went','go']:[w],Date,console};
global.scrollY=0;global.scrollTo=()=>{};
vm.runInNewContext(reader,sandbox,{timeout:5000});
sandbox.renderReader();
assert.equal(rendered,1);
assert.ok(tokens.every(t=>t.attributes.role==='button'&&t.attributes.tabindex==='-1'));
assert.equal(sentence.attributes.tabindex,'0');
function key(key,target){
 const event={key,target,prevented:false,stopped:false,
 preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};
 for(const fn of sentence.handlers.keydown||[])fn(event);
 return event;
}
let e=key('ArrowRight',sentence);
assert.ok(e.prevented&&e.stopped);
assert.equal(document.activeElement,tokens[0]);
e=key('ArrowRight',tokens[0]);
assert.equal(document.activeElement,tokens[1]);
assert.equal(tokens[1].attributes.tabindex,'0');
e=key('Enter',tokens[1]);
assert.ok(e.prevented&&e.stopped);
assert.equal(opened.at(-1).entry.term,'go on');
assert.equal(opened.at(-1).display,'went on');
assert.equal(opened.at(-1).source.ar,'تابعت.');
e=key('ArrowRight',tokens[1]);
assert.equal(document.activeElement,tokens[2]);
e=key(' ',tokens[2]);
assert.equal(opened.at(-1).entry.term,'go on');
e=key('Escape',tokens[2]);
assert.equal(document.activeElement,sentence);
e=key('Tab',sentence);
assert.equal(e.prevented,false);
const before=opened.length;
const click={target:tokens[1],stopImmediatePropagation(){this.stopped=true;}};
sentence.handlers.click[0](click);
assert.equal(opened.length,before+1);
assert.ok(click.stopped);
console.log('PASS: paragraph roving keyboard focus, idiom lookup, translation, touch parity and Tab safety');
