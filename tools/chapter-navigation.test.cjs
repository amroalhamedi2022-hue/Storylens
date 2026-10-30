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
 insertBefore(node,reference){const i=this.children.indexOf(reference);if(i<0)this.children.push(node);else this.children.splice(i,0,node);return node},
 setAttribute(key,value){this.attrs[key]=value},
 addEventListener(key,cb){this['on'+key]=cb},
 querySelector(){return null}
});
function run({locale='en',total=37,count=2,index=1}={}){
 const heading=createElement('div');heading.textContent='The End';
 const primary=createElement('button');primary.textContent='Return to library';
 const end=createElement('section');
 end.children.push(heading,primary);
 end.querySelector=selector=>selector==='div'?heading:selector==='button.primary'?primary:
  selector==='.lt-chapter-nav'?end.children.find(x=>x.className==='lt-chapter-nav')||null:null;
 const label=createElement('div');
 const doc={documentElement:{lang:locale},createElement,
  querySelector:selector=>selector==='.reader .chapter-end'?end:
   selector==='.reader .reader-label'?label:null};
 const calls=[],story={chapters:Array.from({length:count},()=>({})),totalChapters:total};
 const sandbox={window:{stlChapter:n=>calls.push(n)},document:doc,
  state:{page:'reader',story,chapter:index},renderReader:()=>{calls.push('base')}};
 vm.runInNewContext(source,sandbox,{filename:'lingua-chapter-navigation.js'});
 sandbox.renderReader();
 return {end,label,heading,primary,calls,story,sandbox,decorate:sandbox.window.LinguaChapterNavigation.decorate};
}
const incomplete=run();
assert.equal(incomplete.calls[0],'base');
assert.match(incomplete.heading.textContent,/To be continued/);
assert.equal(incomplete.primary.textContent,'Back to library');
assert.equal(incomplete.label.children.length,0,'availability must not duplicate the current-chapter label');
const availableEn=incomplete.end.children.find(x=>x.className==='lt-serial-progress');
assert.ok(availableEn);assert.match(availableEn.textContent,/2 of 37 chapters available/);assert.equal(availableEn.attrs.dir,'ltr');
const nav=incomplete.end.children[0];
assert.equal(nav.attrs['aria-label'],'Chapter navigation');
assert.equal(nav.children[0].disabled,false);
assert.equal(nav.children[1].disabled,true);
nav.children[0].onclick();
assert.equal(incomplete.calls[1],0,'previous chapter uses existing navigation pipeline');
incomplete.decorate();
assert.equal(incomplete.end.children.filter(x=>x.className==='lt-chapter-nav').length,1,'repeated decoration must not duplicate chapter controls');
assert.equal(incomplete.end.children.filter(x=>x.className==='lt-serial-progress').length,1,'repeated decoration must not duplicate availability notes');
assert.equal(incomplete.label.children.length,0);
// Old controls must not navigate after leaving the reader or switching chapters.
incomplete.sandbox.state.page='library';
nav.children[0].onclick();
assert.equal(incomplete.calls.length,2,'stale previous button is inert after leaving reader');
incomplete.sandbox.state.page='reader';
incomplete.sandbox.state.chapter=0;
nav.children[0].onclick();
assert.equal(incomplete.calls.length,2,'stale button cannot navigate a different chapter');
incomplete.sandbox.state.chapter=1;
const middle=run({index:0});
assert.equal(middle.end.children[0].children[0].disabled,true);
middle.end.children[0].children[1].onclick();
assert.equal(middle.calls[1],1);
const arabic=run({locale:'ar'});
assert.match(arabic.heading.textContent,/يتبع/);
assert.equal(arabic.end.children[0].children[0].textContent,'الفصل السابق →');
assert.equal(arabic.end.children[0].children[1].textContent,'← الفصل التالي');
const availableAr=arabic.end.children.find(x=>x.className==='lt-serial-progress');
assert.ok(availableAr);assert.match(availableAr.textContent,/المتاح 2 من 37 فصلًا/);assert.equal(availableAr.attrs.dir,'rtl');
assert.equal(arabic.label.children.length,0);
const selector=nav.children[2];
assert.equal(selector.tagName,'label');
assert.equal(selector.children[1].tagName,'select');
assert.equal(selector.children[1].children.length,2,'only locally available chapters appear');
assert.equal(selector.children[1].children[1].selected,true);
selector.children[1].value='0';
selector.children[1].onchange();
assert.equal(incomplete.calls[2],0,'direct chapter jump uses the installed reader navigation');
incomplete.sandbox.state.page='library';
selector.children[1].value='0';selector.children[1].onchange();
assert.equal(incomplete.calls.length,3,'stale chapter picker cannot navigate after reader closes');
incomplete.sandbox.state.page='reader';
incomplete.sandbox.state.chapter=0;
selector.children[1].onchange();
assert.equal(incomplete.calls.length,3,'stale picker cannot override newer chapter');
incomplete.sandbox.state.chapter=1;
selector.children[1].value='36';
selector.children[1].onchange();
assert.equal(incomplete.calls.length,3,'unpublished chapter cannot be selected');
assert.equal(selector.children[1].value,'1','invalid chapter resets picker to current chapter');
selector.children[1].value='1e0';selector.children[1].onchange();
assert.equal(incomplete.calls.length,3,'scientific notation is not a valid chapter index');
assert.equal(selector.children[1].value,'1','malformed chapter index restores picker');
incomplete.sandbox.state.page='library';
selector.children[1].value='0';selector.children[1].onchange();
assert.equal(selector.children[1].value,'1','stale picker reverts displayed selection');
incomplete.sandbox.state.page='reader';
assert.equal(arabic.end.children[0].children[2].children[0].textContent,'انتقل إلى فصل');
const complete=run({total:2});
assert.equal(complete.heading.textContent,'The End','finished books retain truthful ending');
assert.equal(complete.label.children.length,0);
const legacy=run({total:null});
assert.equal(legacy.label.children.length,0);
console.log('PASS chapter navigation: ongoing book, Arabic/English, legacy and complete stories');
