'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');
const source=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-content-loader.js'),'utf8');

const tags=[...html.matchAll(/<script\b([^>]*)><\/script>/g)].map(m=>{
 const attrs=m[1],src=attrs.match(/\bsrc="([^"]+)"/)?.[1],group=attrs.match(/\bdata-lt-lazy="([^"]+)"/)?.[1];
 return {attrs,src,group};
}).filter(x=>x.group);
const bookAssets=tags.filter(x=>x.group==='book').map(x=>x.src);
const dictionaryAssets=tags.filter(x=>x.group==='dictionary').map(x=>x.src);
assert.equal(bookAssets.length,40,'all 36 chapter files and four art scripts are declared lazy');
assert.equal(dictionaryAssets.length,1,'the generated FreeDict pack is declared lazy');
assert.equal(bookAssets.filter(x=>/^classic-verne-towle-ch\d+\.js$/.test(x)).length,36);
assert.deepEqual(bookAssets.slice(0,3),['classic-verne-towle-ch01.js','classic-verne-towle-ch02.js','classic-verne-towle-ch03.js']);
assert.ok(bookAssets.indexOf('classic-verne-towle-ch31.js')<bookAssets.indexOf('classic-verne-towle-ch33.js'));
assert.ok(bookAssets.indexOf('classic-verne-towle-ch37.js')<bookAssets.indexOf('editorial-art.js'));
assert.ok(bookAssets.indexOf('editorial-art.js')<bookAssets.indexOf('editorial-art-ch35.js'));
assert.ok(tags.every(x=>/\btype="application\/x-lingua-lazy"/.test(x.attrs)),'lazy payload tags must not execute as JavaScript during startup');
assert.ok(html.includes('<script src="lingua-content-loader.js"></script>'));
assert.ok(html.includes('window.LinguaAttachEditorialArt=function'));
assert.ok(html.includes('src="freedict-en-ar.js"'),'dictionary remains a packaged local asset');
assert.ok(!/<script\b(?![^>]*data-lt-lazy)[^>]*\bsrc="(?:classic-verne-towle-ch\d+\.js|editorial-art(?:-ch(?:35|36|37))?\.js|freedict-en-ar\.js)"/.test(html),
 'long-book and dictionary assets must not be eager executable scripts');

function makeHarness({failOnce=null,lang='ar'}={}) {
 const attempted=[], successful=[], removed=[], opened=[], sheetEntries=[];
 let failed=false, headingText=null, artAttached=0;
 const story={id:'around-the-world-in-eighty-days-towle',totalChapters:37,chapters:[]};
 const rootNode={inert:false,attrs:{},setAttribute(k,v){this.attrs[k]=String(v);},removeAttribute(k){delete this.attrs[k];}};
 const bodyChildren=[];
 function node(tag){
  const listeners={};
  return {tagName:String(tag).toUpperCase(),dataset:{},attrs:{},children:[],textContent:'',type:'',src:'',
   setAttribute(k,v){this.attrs[k]=String(v);},removeAttribute(k){delete this.attrs[k];},
   appendChild(child){this.children.push(child);return child;},
   replaceChildren(...children){this.children=[...children];},
   addEventListener(name,callback){listeners[name]=callback;},
   remove(){this.removed=true;},
   click(){listeners.click?.();},
   get text(){return this.textContent+this.children.map(x=>x.text||x.textContent||'').join('');}
  };
 }
 const manifestNodes=tags.map(item=>({
  getAttribute(name){return name==='src'?item.src:name==='data-lt-lazy'?item.group:null;},
  remove(){removed.push(item.src);}
 }));
 const window={
  StoryLensEditorialStories:[story],
  LinguaAttachEditorialArt(){artAttached++;return true;},
  openStory(id){opened.push(id);},
  wordSheet(payload){headingText=payload.display;sheetEntries.push(payload);},
 };
 const document={
  documentElement:{lang,dir:lang==='en'?'ltr':'rtl'},
  querySelectorAll(selector){return selector==='script[data-lt-lazy]'?manifestNodes:[];},
  getElementById(id){if(id==='root')return rootNode;return null;},
  querySelector(selector){if(selector==='#modals .sheet h2'&&headingText!==null)return {textContent:headingText};return null;},
  createElement(tag){return node(tag);},
  body:{appendChild(n){bodyChildren.push(n);return n;}},
  head:{appendChild(n){
   if(n.tagName!=='SCRIPT')return n;
   attempted.push(n.src);
   if(failOnce===n.src&&!failed){failed=true;Promise.resolve().then(()=>n.onerror?.());return n;}
   if(n.src==='freedict-en-ar.js'){
    window.FreeDictEnglishArabic={resolve(value){return value.toLowerCase()==='dog'?{term:'dog',literal:'كلب',meanings:['كلب'],context:'',type:'dictionary'}:null;}};
   } else if(/^classic-verne-towle-ch\d+\.js$/.test(n.src)){
    const number=Number(n.src.match(/ch(\d+)\.js$/)[1]);
    const amount=number===31?2:1;
    for(let i=0;i<amount;i++)story.chapters.push({title:'Chapter',paragraphs:[{en:'An English sentence.',ar:'جملة إنجليزية.'}]});
   } else if(n.src==='editorial-art.js') window.StoryLensMakeEditorialArt=()=>({});
   successful.push(n.src);
   Promise.resolve().then(()=>n.onload?.());
   return n;
  }}
 };
 vm.runInNewContext(source,{window,document,Promise,Set,Array,Error,console},{filename:'lingua-content-loader.js',timeout:5000});
 return {window,document,rootNode,story,attempted,successful,removed,opened,sheetEntries,bodyChildren,get artAttached(){return artAttached;},get statusText(){return bodyChildren.map(x=>x.text||x.textContent||'').join(' ');}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const h=makeHarness();
 assert.equal(h.window.LinguaContentLoader.bookAssetCount,40);
 assert.equal(h.window.LinguaContentLoader.dictionaryAssetCount,1);
 assert.equal(h.removed.length,41,'inert manifest nodes are removed after their paths are captured');
 h.window.openStory('the-salt-meridian');
 assert.deepEqual(h.opened,['the-salt-meridian'],'unrelated short stories still open synchronously');
 assert.equal(h.attempted.length,0,'neither payload is loaded during startup or unrelated story opens');
 h.window.openStory('around-the-world-in-eighty-days-towle');
 assert.equal(h.rootNode.inert,true,'library controls are inert during the local chapter load');
 await h.window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');
 await tick();
 assert.equal(h.story.chapters.length,37,'chapter XXXI script contributes chapters XXXI and XXXII in order');
 assert.equal(h.opened[1],'around-the-world-in-eighty-days-towle','reader opens only after the bilingual book is ready');
 assert.equal(h.rootNode.inert,false,'library becomes interactive after load');
 assert.equal(h.artAttached,1,'contextual offline illustrations attach after all chapter data');
 assert.equal(h.window.FreeDictEnglishArabic,undefined,'opening the book does not force-load the separate dictionary');
 assert.deepEqual(h.successful,bookAssets,'book chapters and art load sequentially in declared order');

 const d=makeHarness();
 await d.window.LinguaContentLoader.ensureDictionary();
 assert.ok(d.window.FreeDictEnglishArabic.resolve('dog'),'first dictionary request loads the local FreeDict pack');
 assert.equal(d.story.chapters.length,0,'dictionary-only lookup does not load the long book');
 assert.deepEqual(d.successful,['freedict-en-ar.js'],'dictionary load remains independent from book loading');

 const w=makeHarness();
 w.window.wordSheet({entry:null,display:'dog',source:{en:'A dog waited.',ar:'انتظر كلب.'}});
 assert.equal(w.sheetEntries.length,1,'word sheet opens immediately with its honest context fallback');
 await w.window.LinguaContentLoader.ensureDictionary();
 await tick();
 assert.equal(w.sheetEntries.length,2,'same still-open unknown word refreshes when dictionary is ready');
 assert.equal(w.sheetEntries[1].entry.term,'dog');

 const cancel=makeHarness();
 cancel.window.openStory('around-the-world-in-eighty-days-towle');
 cancel.window.openStory('the-salt-meridian');
 await cancel.window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');
 await tick();
 assert.deepEqual(cancel.opened,['the-salt-meridian'],'stale async open cannot steal navigation from a later story');

 const retry=makeHarness({failOnce:'classic-verne-towle-ch05.js'});
 retry.window.openStory('around-the-world-in-eighty-days-towle');
 await assert.rejects(retry.window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle'));
 await tick();
 assert.equal(retry.rootNode.inert,false,'failed local asset load restores interaction');
 assert.match(retry.statusText,/تعذّر تجهيز الكتاب/,'failure is announced in the selected UI language');
 retry.window.openStory('around-the-world-in-eighty-days-towle');
 await retry.window.LinguaContentLoader.ensureStory('around-the-world-in-eighty-days-towle');
 await tick();
 assert.equal(retry.story.chapters.length,37,'retry resumes after already loaded chapters without duplication');
 assert.ok(retry.opened.includes('around-the-world-in-eighty-days-towle'));
 console.log('PASS: LT-03 deferred local payload, ordered chapter loading, dictionary-on-demand, cancellation and retry');
})().catch(error=>{console.error(error);process.exitCode=1;});
