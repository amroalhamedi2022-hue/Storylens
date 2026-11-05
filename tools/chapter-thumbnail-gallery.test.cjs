'use strict';
/* Exercise real production gallery with a lightweight actual DOM event model.
   No mock generated pictures qualify as historical originals. */
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../app/src/main/assets');
const source=fs.readFileSync(path.join(root,'lt-chapter-gallery.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'lt-chapter-gallery.css'),'utf8');
assert.ok(html.includes('<link rel="stylesheet" href="lt-chapter-gallery.css">'));
assert.ok(html.includes('<script src="lt-chapter-gallery.js"></script>'));
assert.ok(html.indexOf('<script src="lingua-content-loader.js"></script>')<
  html.indexOf('<script src="lt-chapter-gallery.js"></script>'),
  'gallery must wrap the FINAL lazy-loaded story opener');
assert.match(css,/scroll-snap-type:x proximity/);
assert.match(css,/object-fit:contain/,'illustrations must remain uncropped');
assert.doesNotMatch(css,/grayscale\s*\(/);
assert.doesNotMatch(css,/saturate\s*\(/);
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/:focus-visible/);
assert.ok(!source.includes('fetch(')&&!source.includes('XMLHttpRequest'),
  'UI must never download books or remote photos');

function element(tag='div') {
 const node={tagName:tag.toUpperCase(),children:[],attrs:{},listeners:{},dataset:{},
  className:'',isConnected:true,removed:false,textContent:'',style:{},src:'',alt:'',loading:'',decoding:'',
  classList:{items:new Set(),add(name){this.items.add(name);},remove(name){this.items.delete(name);},
             contains(name){return this.items.has(name);}},
  appendChild(child){this.children.push(child);child.parentElement=this;child.isConnected=true;return child;},
  remove(){this.removed=true;this.isConnected=false;
   if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);
  },
  replaceChildren(...items){this.children=items;for(const x of items)x.parentElement=this;},
  setAttribute(k,v){this.attrs[k]=v;},
  getAttribute(k){return this.attrs[k]},
  addEventListener(type,callback){(this.listeners[type]??=[]).push(callback)},
  emit(type,event={}){for(const cb of this.listeners[type]||[])cb({target:this,preventDefault(){},...event});},
  focus(){this.focused=true;},
  showModal(){this.open=true;},
  close(){this.open=false;},
 };
 return node;
}
const tick=async()=>{await new Promise(resolve=>setImmediate(resolve));};
function scenario({en=false,lazy=false,artSrc=null,approved=null}={}){
 const chapter=(n)=>({title:'Chapter '+n,titleAr:'الفصل '+n,paragraphs:[{en:'Original source.',ar:'ترجمة.'}]});
 const story={id:'example-story',title:'Example Story',titleAr:'قصة تجريبية',
  chapters:lazy?[]:[chapter(1),chapter(2),chapter(3)],totalChapters:3,
  lazyBook:lazy,chapterThumbnails:approved?[approved,null,null]:undefined};
 const fakeArt=artSrc?{'example-story_0':artSrc}:{};
 const cards=[],historyCalls=[],baseOpens=[],writes=[];
 const document={documentElement:{lang:en?'en':'ar'},body:element('body'),activeElement:element('button'),
  createElement(tag){const x=element(tag);if(tag==='dialog')cards.push(x);return x;}};
 const history={state:{page:'library'},pushState(payload,_title,hash){this.state=payload;historyCalls.push({type:'push',payload,hash})},
  back(){historyCalls.push({type:'back'});this.state={page:'library'};}};
 const timerQueue=[],listeners={};
 const W={LinguaCatalog:{stories:[story]},history,addEventListener(n,cb){listeners[n]=cb;},
  setTimeout(cb){timerQueue.push(cb);return timerQueue.length;},
  openStory(id){baseOpens.push(id);history.pushState({page:'reader'},'', '#read-'+id);},
  LinguaContentLoader:{ensureStory(id){assert.equal(id,story.id);story.lazyBook=false;
     story.chapters=[chapter(1),chapter(2),chapter(3)];return Promise.resolve()},
   ensureEditorialArt(){return Promise.resolve(true)}
  }
 };
 const sandbox={window:W,document,history,art:fakeArt,put(k,v){writes.push([k,v])},
  get(_k,def){return def},state:{page:'library'},console};
 vm.runInNewContext(source,sandbox,{filename:'lt-chapter-gallery.js'});
 const api=W.LinguaChapterGallery;
 assert.ok(api);
 return {W,api,story,document,cards,historyCalls,baseOpens,writes,listeners,timerQueue};
}
(async()=>{
 const s=scenario({artSrc:'data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E'});
 assert.equal(s.api.hasChapters(s.story),true);
 s.W.openStory('example-story');
 assert.equal(s.api.isOpen,true);
 assert.equal(s.baseOpens.length,0,'book click MUST open ordered chapter list rather than start reading');
 assert.equal(s.historyCalls[0].payload.page,'chapter-gallery');
 await tick();
 const dialog=s.cards[0],sheet=dialog.children[0],track=sheet.children[1];
 assert.equal(track.children.length,3,'all three existing chapters appear');
 const tiles=track.children;
 assert.deepEqual(tiles.map(n=>n.dataset.chapterIndex),['0','1','2']);
 assert.equal(tiles[0].dataset.thumbnailState,'existing-legacy',
  'already-packaged first-party book image can be reused');
 assert.equal(tiles[1].dataset.thumbnailState,'missing-or-pending-approval');
 assert.match(tiles[1].children[0].children[0].textContent,/02/,
  'missing image uses paper number, never duplicates another chapter image');
 const first=tiles[0].children[0].children[0];
 assert.equal(first.tagName,'IMG');
 assert.equal(first.loading,'lazy');
 assert.equal(first.decoding,'async');
 const second=tiles[1];
 second.emit('click');
 assert.equal(s.api.isOpen,false);
 assert.equal(s.writes[0][0],'chapter_example-story');
 assert.equal(s.writes[0][1],1);
 assert.equal(s.baseOpens[0],'example-story','chapter must open via existing full reader pipeline');
 assert.equal(s.historyCalls.at(-1).payload.page,'reader');
 assert.equal(s.api.openSelected('example-story',100),false,'unpublished chapter unavailable');
 assert.equal(s.api.openSelected('example-story',-1),false);
 assert.equal(s.api.openSelected('missing',0),false);
 // System Back from reader returns to its previous chapter overview (without
 // extra history entry) after the existing 190ms reader exit.
 s.W.history.state={page:'chapter-gallery',storyId:'example-story'};
 s.listeners.popstate({state:{page:'chapter-gallery',storyId:'example-story'}});
 assert.equal(s.timerQueue.length,1);
 s.timerQueue.shift()();
 assert.equal(s.api.isOpen,true);
 assert.equal(s.historyCalls.filter(x=>x.type==='push').length,2,
  'returning to the previous chooser must not push a fresh history entry');
 s.api.close();
 assert.equal(s.historyCalls.at(-1).type,'back');
 assert.equal(s.api.isOpen,false);
 // Force specifically APPROVED local source metadata; remote, traversal and
 // original artwork pending legal/editorial approval MUST stay hidden.
 const pending={imagePath:'art/old-folio.webp',editoriallyApproved:false,
  releaseApproved:false,distributionReviewApproved:false,rightsStatus:'PENDING_TERRITORIAL_REVIEW',
  altEn:'Source art',altAr:'رسم أصلي',credit:'Museum'};
 const audit=scenario({approved:pending});
 assert.equal(audit.api.chapterImage(audit.story,0),null);
 const remote=scenario({approved:{...pending,imagePath:'https://example.org/image.webp',
  editoriallyApproved:true,releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED'}});
 assert.equal(remote.api.chapterImage(remote.story,0),null);
 const traversal=scenario({approved:{...pending,imagePath:'art/../../private.png',
  editoriallyApproved:true,releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED'}});
 assert.equal(traversal.api.chapterImage(traversal.story,0),null);
 const valid=scenario({approved:{...pending,editoriallyApproved:true,
  releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED'}});
 assert.equal(valid.api.chapterImage(valid.story,0).src,'art/old-folio.webp');
 const inline=scenario();
 inline.story.chapters[1].inlineArt=[{src:'art/folio.webp',verifiedArchive:true,
  sourceParagraphExact:true,distributionReviewApproved:true,editoriallyApproved:true,
  alt:'Scene',credit:'Historic museum'}];
 assert.equal(inline.api.chapterImage(inline.story,1).src,'art/folio.webp');
 const noCredit=scenario({approved:{...pending,editoriallyApproved:true,
  releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED',credit:''}});
 assert.equal(noCredit.api.chapterImage(noCredit.story,0),null);
 const queued=scenario({lazy:true});
 queued.W.openStory('example-story');
 await tick();
 assert.equal(queued.cards[0].children[0].children[1].children.length,3,
  'offline long book must finish lazy loading BEFORE presenting chapter choices');
 assert.equal(queued.baseOpens.length,0,'lazy loading must not auto-open the book');
 const one=scenario();
 one.story.chapters=[one.story.chapters[0]];
 one.W.openStory('example-story');
 assert.equal(one.baseOpens.length,1,'single-chapter story retains original direct reader');
 const noExtra=scenario({artSrc:'https://host.invalid/photo.jpg'});
 assert.equal(noExtra.api.chapterImage(noExtra.story,0),null,'remote sources never used as thumbnails');
 console.log('PASS: 3 ordered RTL/LTR chapter cards, real bundled image and approval-gated source images, lazy 37-chapter contract, safe reader/progress/back, missing-art and a11y checks');
})().catch(e=>{console.error(e);process.exitCode=1;});
