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
assert.ok(html.includes('<script src="lt-chapter-thumbnail-registry.js"></script>'));
assert.ok(html.indexOf('lt-chapter-thumbnail-registry.js')<html.indexOf('lt-chapter-gallery.js'));

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
function scenario({en=false,lazy=false,artSrc=null,approved=null,count=3,resume=null}={}){
 const chapter=(n)=>({title:'Chapter '+n,titleAr:'الفصل '+n,paragraphs:[{en:'Original source.',ar:'ترجمة.'}]});
 const story={id:'example-story',title:'Example Story',titleAr:'قصة تجريبية',
  chapters:lazy?[]:Array.from({length:count},(_,i)=>chapter(i+1)),totalChapters:count,
  lazyBook:lazy,chapterThumbnails:approved?[approved,null,null]:undefined};
 const fakeArt=artSrc?{'example-story_0':artSrc}:{};
 const cards=[],historyCalls=[],baseOpens=[],writes=[];
 const document={documentElement:{lang:en?'en':'ar'},body:element('body'),activeElement:element('button'),
  clickListeners:[],
  addEventListener(type,fn,capture){if(type==='click'){assert.equal(capture,true);this.clickListeners.push(fn);}},
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
  get(k,def){return k==='chapter_example-story'&&resume!==null?resume:def},
  state:{page:'library'},console};
 vm.runInNewContext(source,sandbox,{filename:'lt-chapter-gallery.js'});
 const api=W.LinguaChapterGallery;
 assert.ok(api);
 const clickBook=(id=story.id,{favorite=false}={})=>{
  const card={getAttribute(name){return name==='onclick'?"openStory('"+id+"')":null;}};
  const target={nodeType:1,closest(selector){
   if(selector.startsWith('.stl-favorite'))return favorite?{}:null;
   if(selector.startsWith('.library .card'))return card;
   return null;
  }};
  const event={target,defaultPrevented:false,
   prevented:false,stopped:false,
   preventDefault(){this.prevented=true;},
   stopPropagation(){this.stopped=true;}
  };
  for(const listener of document.clickListeners)listener(event);
  return event;
 };
 return {W,api,story,document,cards,historyCalls,baseOpens,writes,listeners,timerQueue,clickBook};
}
(async()=>{
 const s=scenario({artSrc:'data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E'});
 assert.equal(s.api.hasChapters(s.story),true);
 const activated=s.clickBook();
 assert.equal(activated.prevented,true);
 assert.equal(activated.stopped,true);
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
 const duplicateImage={...pending,editoriallyApproved:true,
  releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED'};
 const dup=scenario({approved:duplicateImage});
 dup.story.chapterThumbnails[1]=duplicateImage;
 dup.clickBook();
 await tick();
 const dupTiles=dup.cards[0].children[0].children[1].children;
 assert.equal(dupTiles[0].dataset.thumbnailState,'approved');
 assert.equal(dupTiles[1].dataset.thumbnailState,'missing-or-pending-approval',
  'identical source image cannot be presented as unique chapter II art');
 const inline=scenario();
 inline.story.chapters[1].inlineArt=[{src:'art/folio.webp',verifiedArchive:true,
  sourceParagraphExact:true,distributionReviewApproved:true,editoriallyApproved:true,
  archiveSource:'https://commons.wikimedia.org/wiki/File:Archive_Folio.jpg',
  afterParagraph:0,aspectRatio:.75,
  alt:'Scene',credit:'Historic museum'}];
 assert.equal(inline.api.chapterImage(inline.story,1).src,'art/folio.webp');
 const wrongSource=scenario();
 wrongSource.story.chapters[1].inlineArt=[{...inline.story.chapters[1].inlineArt[0],
   archiveSource:'https://untrusted.example/unknown.jpg'}];
 assert.equal(wrongSource.api.chapterImage(wrongSource.story,1),null,
  'untrusted historic image source must never qualify as chapter thumbnail');
 const wrongParagraph=scenario();
 wrongParagraph.story.chapters[1].inlineArt=[{...inline.story.chapters[1].inlineArt[0],
  afterParagraph:52}];
 assert.equal(wrongParagraph.api.chapterImage(wrongParagraph.story,1),null,
  'misaligned paragraph cannot be used as chapter thumbnail');
 assert.equal(s.api.openSelected('example-story',0),false,
  'after closing the gallery old external callers must not overwrite progress');

 const noCredit=scenario({approved:{...pending,editoriallyApproved:true,
  releaseApproved:true,distributionReviewApproved:true,rightsStatus:'APPROVED',credit:''}});
 assert.equal(noCredit.api.chapterImage(noCredit.story,0),null);
 const queued=scenario({lazy:true});
 queued.clickBook();
 await tick();
 assert.equal(queued.cards[0].children[0].children[1].children.length,3,
  'offline long book must finish lazy loading BEFORE presenting chapter choices');
 assert.equal(queued.baseOpens.length,0,'lazy loading must not auto-open the book');
 const one=scenario();
 one.story.chapters=[one.story.chapters[0]];
 assert.equal(one.clickBook().prevented,false,'one-chapter click falls through to old handler');
 one.W.openStory('example-story');
 assert.equal(one.baseOpens.length,1,'single-chapter story retains original direct reader');
 const direct=scenario();
 direct.W.openStory('example-story');
 assert.equal(direct.baseOpens.length,1,'programmatic deep links MUST retain original reading route');
 assert.equal(direct.api.isOpen,false,'programmatic source/translation QA must not open a gallery');
 const favorite=scenario();
 assert.equal(favorite.clickBook('example-story',{favorite:true}).prevented,false,
  'nested favorite action must not be hijacked by book gallery');
 // Real full-book navigation cannot allocate 1,001 heavy image cards at once.
 const huge=scenario({count:85,en:true,resume:70});
 huge.clickBook();
 await tick();
 const rail=huge.cards[0].children[0].children[1];
 assert.equal(rail.children.length,37,'initial large edition renders 36 tiles and one more button');
 assert.equal(rail.children[35].dataset.chapterIndex,'35');
 assert.equal(rail.children[36].className,'lt-chapter-gallery-more');
 rail.children[36].emit('click');
 assert.equal(rail.children.length,73,'next 36 append, preserving original order');
 assert.equal(rail.children[71].dataset.chapterIndex,'71');
 rail.children[72].emit('click');
 assert.equal(rail.children.length,85,'last 13 chapters append without an extra button');
 assert.equal(rail.children[84].dataset.chapterIndex,'84');
 const copy=huge.cards[0].children[0].children[0].children[0];
 const tools=copy.children.find(x=>x.className==='lt-chapter-gallery-tools');
 assert.ok(tools,'gallery header has chapter search and resume');
 const search=tools.children[0].children[0];
 assert.equal(search.disabled,false);
 search.value='85';search.emit('input');
 assert.equal(rail.children.length,1,'search across all unrendered 85 chapters');
 assert.equal(rail.children[0].dataset.chapterIndex,'84');
 search.value='NONSENSE';search.emit('input');
 assert.equal(rail.children.length,1);
 assert.equal(rail.children[0].className,'lt-chapter-gallery-empty','nonexistent chapter produces accurate empty state');
 search.value='الفصل 72';search.emit('input');
 assert.equal(rail.children.length,1,'Arabic title search works in English UI');
 assert.equal(rail.children[0].dataset.chapterIndex,'71');
 search.value='';search.emit('input');
 assert.equal(rail.children.length,37,'clearing filter returns to first page with no stale appended cards');
 const resumeButton=tools.children[1];
 assert.match(resumeButton.textContent,/Resume reading at chapter 71/);
 resumeButton.onclick();
 assert.equal(huge.writes[0][1],70,'resume launches saved chapter, not first tile or last searched');
 assert.equal(huge.api.isOpen,false);
 // Cancelling search does not mutate the existing saved chapter or story data.
 const untouched=scenario({count:42,resume:40});
 untouched.clickBook();await tick();
 const input=untouched.cards[0].children[0].children[0].children[0].children
  .find(x=>x.className==='lt-chapter-gallery-tools').children[0].children[0];
 input.value='0';input.emit('input');
 assert.equal(untouched.writes.length,0,'chapter search never writes to reading progress');
 assert.equal(untouched.story.chapters.length,42,'chapter ordering/data remains intact');
 const closeButton=untouched.cards[0].children[0].children[0].children[1];
 closeButton.emit('click');
 assert.equal(untouched.api.isOpen,false,'cancel is safe');
 assert.equal(untouched.writes.length,0,'closing gallery never updates chapter progress');

 const noExtra=scenario({artSrc:'https://host.invalid/photo.jpg'});
 assert.equal(noExtra.api.chapterImage(noExtra.story,0),null,'remote sources never used as thumbnails');
 console.log('PASS: offline RTL/LTR chapter gallery, genuine art approval, 85-chapter lazy batches/title+number search, resume, and no progress mutations while browsing');
})().catch(e=>{console.error(e);process.exitCode=1;});
