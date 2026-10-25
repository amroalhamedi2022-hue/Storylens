'use strict';
/* Real production chapter-navigation module in a minimal DOM; no device claim. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const assets=path.join(__dirname,'../app/src/main/assets');
const source=fs.readFileSync(path.join(assets,'lingua-chapter-navigation.js'),'utf8');
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
assert.ok(html.includes('<script src="lingua-chapter-navigation.js"></script>'));
assert.ok(html.indexOf('lingua-i18n.js')<html.indexOf('lingua-chapter-navigation.js'));
const createElement=tag=>({
 tagName:tag,children:[],attrs:{},textContent:'',disabled:false,
 appendChild(node){this.children.push(node);return node},
 prepend(node){this.children.unshift(node)},
 setAttribute(key,value){this.attrs[key]=value},
 addEventListener(key,cb){this['on'+key]=cb},
 querySelector(){return null}
});
function run({locale='en',total=37,count=2,index=1}={}){
 const heading=createElement('div');heading.textContent='The End';
 const primary=createElement('button');primary.textContent='Return to library';
 const end=createElement('section');
 end.querySelector=selector=>selector==='div'?heading:selector==='button.primary'?primary:null;
 const label=createElement('div');
 const doc={documentElement:{lang:locale},createElement,
  querySelector:selector=>selector==='.reader .chapter-end'?end:
   selector==='.reader .reader-label'?label:null};
 const calls=[],story={chapters:Array.from({length:count},()=>({})),totalChapters:total};
 const sandbox={window:{stlChapter:n=>calls.push(n)},document:doc,
  state:{page:'reader',story,chapter:index},renderReader:()=>{calls.push('base')}};
 vm.runInNewContext(source,sandbox,{filename:'lingua-chapter-navigation.js'});
 sandbox.renderReader();
 return {end,label,heading,primary,calls};
}
const incomplete=run();
assert.equal(incomplete.calls[0],'base');
assert.match(incomplete.heading.textContent,/To be continued/);
assert.equal(incomplete.primary.textContent,'Back to library');
assert.match(incomplete.label.children[0].textContent,/2 of 37/);
const nav=incomplete.end.children[0];
assert.equal(nav.attrs['aria-label'],'Chapter navigation');
assert.equal(nav.children[0].disabled,false);
assert.equal(nav.children[1].disabled,true);
nav.children[0].onclick();
assert.equal(incomplete.calls[1],0,'previous chapter uses existing navigation pipeline');
const middle=run({index:0});
assert.equal(middle.end.children[0].children[0].disabled,true);
middle.end.children[0].children[1].onclick();
assert.equal(middle.calls[1],1);
const arabic=run({locale:'ar'});
assert.match(arabic.heading.textContent,/يتبع/);
assert.match(arabic.label.children[0].textContent,/37/);
const complete=run({total:2});
assert.equal(complete.heading.textContent,'The End','finished books retain truthful ending');
assert.equal(complete.label.children.length,0);
const legacy=run({total:null});
assert.equal(legacy.label.children.length,0);
console.log('PASS chapter navigation: ongoing book, Arabic/English, legacy and complete stories');
