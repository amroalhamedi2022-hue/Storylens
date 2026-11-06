/* Lingua Tales CHG-01 — image-backed chapter selection, separate from source intake.
 * Content conversation sources text/images, supplies provenanced chapter maps.
 * This UI uses only existing packaged first-party art or explicitly release-approved,
 * scene-matched LOCAL thumbnail metadata. Nothing is downloaded or fabricated here.
 * We do not edit page curls, reader data, signing, database or library records.
 */
(function (global) {
'use strict';
const locale=(ar,en)=>document.documentElement.lang==='en'?en:ar;
const VALID_IMAGE=/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i;
const VALID_DATA=/^data:image\/(?:webp|png|jpeg);base64,[a-z0-9+/=]+$/i;
const VALID_SVG_PREFIX='data:image/svg+xml;charset=utf-8,%3Csvg';
const galleryKey='lt-chapter-gallery';
const originalOpen=global.openStory;
if(typeof originalOpen!=='function')return;
let active=null,serial=0,lastReaderBook=null;

const stories=()=>Array.isArray(global.LinguaCatalog?.stories)?global.LinguaCatalog.stories:[];
const storyById=id=>stories().find(item=>item?.id===id);
const legacyArt=(story,index)=>{
 // Legacy authored short-story art was already bundled. This backward
 // compatibility is not a policy for new classic books or image invention.
 if(story.lazyBook||story.totalChapters>15||story.fullWordCount>=25000||
    story.sourceEdition||story.originalEdition||story.sourceUrl||
    story.id==='around-the-world-in-eighty-days-towle')return null;
 const registry=(typeof art==='object'&&art!==null)?art:null;
 const src=registry?.[story.id+'_'+index];
 if(typeof src!=='string'||src.length>280000)return null;
 return VALID_DATA.test(src)||src.startsWith(VALID_SVG_PREFIX)?{
  src,alt:locale('رسم الفصل الموجود في المكتبة','Existing chapter illustration'),
  credited:true,kind:'existing-legacy'
 }:null;
};
const VALID_ARCHIVE=/^https:\/\/(?:commons\.wikimedia\.org|www\.metmuseum\.org|www\.loc\.gov|gallica\.bnf\.fr|www\.gutenberg\.org|archive\.org)\//i;
function validatedArt(entry,{inline=false,paragraphCount=0}={}){
 if(!entry||typeof entry!=='object')return null;
 const src=entry.src||entry.imagePath;
 if(typeof src!=='string')return null;
 // Local asset paths are intentionally relative to app/src/main/assets, NEVER
 // docs/literature/staging. Those files aren't part of the Android APK.
 if(!VALID_IMAGE.test(src))return null;
 // Approval is separate from source provenance and SHA verification.
 // A story may supply an explicitly approved scene-ready chapter thumbnail,
 // or reuse a provenanced inline reader image that passed the existing gate.
 const ready=entry.editoriallyApproved===true &&
    entry.releaseApproved===true &&
    entry.distributionReviewApproved===true &&
    (entry.rightsStatus==='APPROVED'||entry.rightsStatus==='CLEARED');
 const inlineReady=inline&&entry.verifiedArchive===true &&
    entry.sourceParagraphExact===true &&
    entry.distributionReviewApproved===true &&
    entry.editoriallyApproved===true &&
    typeof entry.archiveSource==='string'&&VALID_ARCHIVE.test(entry.archiveSource)&&
    Number.isInteger(entry.afterParagraph)&&entry.afterParagraph>=0&&
    entry.afterParagraph<paragraphCount&&
    Number.isFinite(entry.aspectRatio)&&entry.aspectRatio>=.5&&entry.aspectRatio<=3.5;
 // An inline figure cannot bypass its exact passage proof by also carrying
 // chapter-level release flags. The two approval classes are NOT interchangeable.
 if(inline?!inlineReady:!ready)return null;
 const alt=locale(entry.altAr||entry.alt||'',entry.altEn||entry.alt||'');
 if(typeof alt!=='string'||!alt.trim())return null;
 if(typeof entry.credit!=='string'||!entry.credit.trim())return null;
 return {src,alt:alt.slice(0,240),credit:entry.credit.slice(0,160),kind:'approved'};
}
function chapterImage(story,index){
 const chapter=story.chapters?.[index];
 if(!chapter)return null;
 const map=global.LinguaChapterThumbnailRegistry?.[story.id];
 const record=map?.chapters?.[index];
 // SOURCE-VERIFIED packaged art gets priority, then in-app approved metadata.
 // A rejected old candidate must never mask a later approved replacement.
 for(const candidate of [
  record?.primaryImage,chapter.chapterThumbnail,story.chapterThumbnails?.[index]
 ]){
  const direct=validatedArt(candidate);
  if(direct)return direct;
 }
 // Reuse already-approved in-prose art only if its original source and
 // exact passage check passed. Never borrow a picture from another chapter.
 const inline=Array.isArray(chapter.inlineArt)?chapter.inlineArt:[];
 for(const candidate of inline){
  const result=validatedArt(candidate,{
   inline:true,
   paragraphCount:Array.isArray(chapter.paragraphs)?chapter.paragraphs.length:0
  });
  if(result)return result;
 }
 // For released legacy short fiction, only existing bundled art is eligible.
 return legacyArt(story,index);
}
function hasChapters(story){
 return !!story && (story.lazyBook===true ||
  (Array.isArray(story.chapters)&&story.chapters.length>1));
}
function available(story){
 return Array.isArray(story.chapters)?story.chapters.length:0;
}
function declared(story){
 const count=Number.isInteger(story.totalChapters)&&story.totalChapters>0?story.totalChapters:available(story);
 return Math.max(count,available(story));
}
function titleFor(chapter,index){
 const t=document.documentElement.lang==='en'?
  (chapter?.titleEn||chapter?.title||chapter?.titleAr):
  (chapter?.titleAr||chapter?.title||chapter?.titleEn);
 return typeof t==='string'&&t.trim()?t.trim():locale('الفصل '+(index+1),'Chapter '+(index+1));
}
function bookTitle(story){
 const t=document.documentElement.lang==='en'?
  (story.titleEn||story.title||story.titleAr):
  (story.titleAr||story.title||story.titleEn);
 return String(t||'').slice(0,180);
}
function addText(parent,tag,cls,text){
 const node=document.createElement(tag);
 if(cls)node.className=cls;
 node.textContent=text;
 parent.appendChild(node);
 return node;
}
function close(pushBack=true){
 const current=active;
 if(!current)return false;
 current.moreObserver?.disconnect?.();
 current.moreObserver=null;
 // A big offline novel is loaded sequentially. Closing the chooser before
 // completion must stop future local script loads, not burn battery/RAM on
 // a book the reader abandoned. The loader's own cancellation generation
 // prevents a late resolve from re-opening or mutating the reader.
 if(current.loadingLongBook&&!current.fromReader){
  global.LinguaContentLoader?.cancel?.();
 }
 ++serial;
 active=null;
 current.dialog?.close?.();
 current.dialog?.remove?.();
 if(current.restoreFocus&&current.restoreFocus.isConnected&&typeof current.restoreFocus.focus==='function'){
  current.restoreFocus.focus({preventScroll:true});
 }
 if(pushBack&&global.history?.state?.page==='chapter-gallery')global.history.back?.();
 return true;
}
function openSelected(id,index){
 const story=storyById(id);
 // A stale gallery tile, unresolved lazy load or external caller must never
 // overwrite chapter progress or open a different book.
 if(!active||active.id!==id||!story||
    !Number.isSafeInteger(index)||index<0||index>=available(story))return false;
 // When already reading this very book, navigate through the EXISTING chapter
 // system. Re-opening the same reader with openStory() would append a second
 // history entry, disturb the saved paragraph and strand Android Back.
 const inSameReader=state.page==='reader'&&state.story?.id===id &&
    typeof global.stlChapter==='function';
 lastReaderBook=id;
 close(false);
 if(inSameReader){
  global.stlChapter(index);
  // The old modal opener may have been destroyed by the new chapter render.
  // Make the destination heading available to keyboard/TalkBack without
  // scrolling away from a saved semantic reading position.
  const heading=document.querySelector?.('.reader h2');
  if(heading){
   heading.setAttribute('tabindex','-1');
   heading.focus?.({preventScroll:true});
  }
  return true;
 }
 // Coming from the library: the current source reader resumes the selected
 // chapter's existing semantic page/scroll anchors, with no fake completion.
 if(typeof put==='function')put('chapter_'+story.id,index);
 return originalOpen.call(global,id);
}
function distinctChapterImages(story){
 // The same artwork must NEVER appear as a distinct chapter thumbnail twice,
 // even when a future source map accidentally repeats a file.
 const seen=new Set();
 return (story.chapters||[]).map((_,index)=>{
  const item=chapterImage(story,index);
  if(!item||seen.has(item.src))return null;
  seen.add(item.src);
  return item;
 });
}
// A large historical anthology can have hundreds of real sections. Render
// only a few dozen cards per slice, with a chapter-title/number search across
// ALL available chapters. More cards append without resetting scroll/focus.
const CHAPTER_BATCH_SIZE=36;
const CHAPTER_FILTERS=Object.freeze(['all','illustrated','pending','started']);
function normalizedQuery(value){
 return String(value||'').toLocaleLowerCase()
  .normalize('NFKD')
  .replace(/[\u064b-\u065f\u0670\u0640]/g,'')
  .replace(/[أإآ]/g,'ا').replace(/ى/g,'ي')
  // Normalize Arabic-Indic and Eastern-Arabic chapter numerals for search.
  // A reader typing ٣٤ or ۳۴ must reach the same source chapter as "34".
  .replace(/[\u0660-\u0669\u06f0-\u06f9]/g,ch=>
    String(ch.charCodeAt(0)-(ch.charCodeAt(0)<=0x0669?0x0660:0x06f0)))
  .replace(/\s+/g,' ').trim().slice(0,100);
}
function hasChapterReadingStart(story,index){
 if(typeof get!=='function')return false;
 const lastPage=get('readpage_'+story.id+'_'+index,0);
 const lastScroll=get('scroll_'+story.id+'_'+index,0);
 return (Number.isInteger(lastPage)&&lastPage>0)||
  (typeof lastScroll==='number'&&Number.isFinite(lastScroll)&&lastScroll>80);
}
function startedInEntry(entry,index){
 // A very long anthology may have 1001+ chapter positions. Cache the actual
 // saved-source state once per gallery, rather than scanning local storage on
 // every title-filter keystroke, swipe or re-render.
 if(!entry.readingStartedCache)entry.readingStartedCache=new Map();
 if(entry.readingStartedCache.has(index))return entry.readingStartedCache.get(index);
 const value=hasChapterReadingStart(entry.story,index);
 entry.readingStartedCache.set(index,value);
 return value;
}
function artAvailability(entry){
 const shown=entry.images.filter(Boolean).length;
 const count=entry.images.length;
 return {shown,pending:count-shown,count};
}
function updateArtStatus(entry){
 const coverage=artAvailability(entry);
 entry.missing.textContent=coverage.pending?
  locale('صور الفصول المعتمدة متاحة: '+coverage.shown+' من '+coverage.count+
         ' · المتبقي دون صورة: '+coverage.pending,
         'Available chapter images: '+coverage.shown+' of '+coverage.count+
         ' · Missing: '+coverage.pending):
  locale('جميع الفصول لها صور متاحة','Every chapter has an available image');
}
function setChapterLayout(entry,mode,{save=false}={}){
 if(!active||active!==entry)return;
 const next=mode==='list'?'list':'rail';
 entry.layout=next;
 entry.track.classList.remove('lt-chapter-gallery-list-view');
 if(next==='list')entry.track.classList.add('lt-chapter-gallery-list-view');
 entry.layoutButton.textContent=next==='list'?
  locale('العرض الأفقي','Horizontal cards'):locale('عرض قائمة','List view');
 entry.layoutButton.setAttribute('aria-pressed',next==='list'?'true':'false');
 entry.track.setAttribute('aria-label',next==='list'?
  locale('الفصول كقائمة مرتبة','Chapters as ordered list'):
  locale('الفصول بالترتيب','Chapters in order'));
 if(save&&typeof put==='function')put('lt_chapter_gallery_layout',next);
}
function buildChapterCard(entry,story,i){
 const chapter=story.chapters[i];
 const card=document.createElement('button');
 card.type='button';
 card.className='lt-chapter-tile';
 card.dataset.chapterIndex=String(i);
 if(i===entry.resume&&entry.hasProgress)card.classList.add('lt-chapter-resume');
 card.setAttribute('aria-label',locale('اقرأ الفصل ','Read chapter ')+(i+1)+' · '+titleFor(chapter,i));
 const cover=document.createElement('span');cover.className='lt-chapter-tile-visual';
 const source=entry.images[i];
 if(source){
  const img=document.createElement('img');
  img.src=source.src;img.alt=source.alt;
  img.loading='lazy';img.decoding='async';
  img.setAttribute('draggable','false');
  img.addEventListener('error',()=>{
   // Real APK file missing/corrupt: treat this image as unavailable in BOTH
   // the card and coverage filters for the rest of this gallery session.
   if(active!==entry||entry.images[i]===null)return;
   img.remove();
   cover.classList.add('lt-chapter-image-missing');
   addText(cover,'span','lt-chapter-tile-number',String(i+1).padStart(2,'0'));
   card.classList.add('lt-chapter-art-unavailable');
   card.dataset.thumbnailState='missing-file';
   entry.images[i]=null;
   const creditNode=card.querySelector?.('.lt-chapter-tile-credit');
   if(creditNode)creditNode.textContent=locale('الصورة غير متوفرة على الجهاز',
     'Image unavailable on device');
   else addText(card,'small','lt-chapter-tile-pending',
     locale('الصورة غير متوفرة على الجهاز','Image unavailable on device'));
   updateArtStatus(entry);
   if(entry.filter?.value==='illustrated')updateChapterFilter(entry);
  },{once:true});
  cover.appendChild(img);
  card.dataset.thumbnailState=source.kind;
 }else{
  cover.classList.add('lt-chapter-image-missing');
  addText(cover,'span','lt-chapter-tile-number',String(i+1).padStart(2,'0'));
  card.dataset.thumbnailState='missing-or-pending-approval';
 }
 addText(cover,'span','lt-chapter-tile-kicker',locale('الفصل '+(i+1),'CHAPTER '+(i+1)));
 if(i===entry.resume)addText(cover,'span','lt-chapter-tile-continue',
  entry.hasProgress?locale('موضع القراءة','Resume'):locale('ابدأ هنا','Start here'));
 card.appendChild(cover);
 addText(card,'strong','lt-chapter-tile-heading',titleFor(chapter,i));
 if(!source)addText(card,'small','lt-chapter-tile-pending',
  locale('الصورة لم تُعتمد بعد','Image pending approval'));
 else if(source.kind==='approved'&&source.credit)
  addText(card,'small','lt-chapter-tile-credit',source.credit);
 // Stored reader position means reading started, NOT that a chapter was finished.
 if(startedInEntry(entry,i))
  addText(card,'span','lt-chapter-tile-visited',
   locale('سبق أن قرأت من هذا الفصل','Reading started'));
 card.addEventListener('click',()=>openSelected(story.id,i));
 return card;
}
function appendChapterBatch(entry){
 if(!active||active!==entry||!entry.story||entry.isAppending)return;
 entry.isAppending=true;
 try{
  // One observer for one optional sentinel, never one per chapter/card.
  entry.moreObserver?.disconnect?.();
  entry.moreObserver=null;
  if(entry.more?.remove)entry.more.remove();
  entry.more=null;
  const until=Math.min(entry.visible.length,entry.rendered+CHAPTER_BATCH_SIZE);
  for(let j=entry.rendered;j<until;j++){
   const index=entry.visible[j];
   entry.track.appendChild(buildChapterCard(entry,entry.story,index));
  }
  entry.rendered=until;
  if(entry.rendered<entry.visible.length){
   const more=document.createElement('button');
   more.type='button';more.className='lt-chapter-gallery-more';
   const remaining=entry.visible.length-entry.rendered;
   more.textContent=locale('عرض المزيد من الفصول · '+remaining,
    'Show more chapters · '+remaining);
   more.addEventListener('click',()=>{
    appendChapterBatch(entry);
    // Native keyboard users keep their place when a sentinel is replaced.
    const tiles=entry.track.querySelectorAll?.('.lt-chapter-tile')||[];
    tiles[until]?.focus?.({preventScroll:true});
   });
   entry.more=more;
   entry.track.appendChild(more);
   // Smooth touch/trackpad scrolling through long books. A manual 'More'
   // button ALWAYS remains available for older WebViews/no observer support.
   // The image count stays bounded: only one 36-card batch per intersection.
   if(typeof global.IntersectionObserver==='function'){
    const observer=new global.IntersectionObserver(records=>{
     if(active!==entry||entry.more!==more||
        !records.some(item=>item.isIntersecting))return;
     appendChapterBatch(entry);
    },{root:entry.track,rootMargin:'0px 180px 0px 180px',threshold:.01});
    entry.moreObserver=observer;
    observer.observe(more);
   }
  }
 }finally{
  entry.isAppending=false;
 }
}
// Keyboard arrows follow the actual book direction. Focus advances without
// selecting a chapter; Enter/Space on the focused tile is still a native
// button activation. This is independent of the reader's paper-fold engine.
function focusChapterByArrow(entry,event){
 const current=event.target?.closest?.('.lt-chapter-tile');
 if(!current||!active||active!==entry)return;
 const key=event.key,rtl=entry.dialog.dir==='rtl';
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(key))return;
 const rendered=Array.from(entry.track.querySelectorAll?.('.lt-chapter-tile')||[]);
 const index=rendered.indexOf(current);
 if(index<0)return;
 let target;
 if(key==='Home')target=0;
 else if(key==='End')target=rendered.length-1;
 else target=index+((key==='ArrowLeft')==rtl?1:-1);
 if(target<0||target>=entry.visible.length)return;
 event.preventDefault?.();
 // A keyboard user can reach the final chapter even if it was not in the
 // first DOM batch; append only the necessary next slice(s).
 while(target>=entry.rendered&&entry.more)appendChapterBatch(entry);
 const tiles=Array.from(entry.track.querySelectorAll?.('.lt-chapter-tile')||[]);
 tiles[target]?.focus?.({preventScroll:true});
 tiles[target]?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'auto'});
}
function decorateLibraryChapterAccess(){
 // Legacy cards are clickable <article>s; they are NOT keyboard focusable.
 // Add a genuine button for keyboard/TalkBack, revealed visually on focus,
 // while leaving the full existing card tap and favorites untouched.
 document.querySelectorAll?.('.library .card[onclick]').forEach(card=>{
  if(card.querySelector?.('.lt-chapter-card-access'))return;
  const handler=card.getAttribute?.('onclick')||'';
  const id=handler.match(/^openStory\('([a-z0-9-]{1,95})'\);?$/)?.[1];
  const story=id&&storyById(id);
  if(!hasChapters(story))return;
  const button=document.createElement('button');
  button.className='lt-chapter-card-access';button.type='button';
  button.textContent=locale('عرض الفصول','Show chapters');
  button.setAttribute('aria-label',locale('عرض فصول ','Show chapters of ')+bookTitle(story));
  card.appendChild(button);
 });
}
const baseLibrary=global.library;
if(typeof baseLibrary==='function'){
 global.library=function(...args){
  const result=baseLibrary.apply(this,args);
  decorateLibraryChapterAccess();
  return result;
 };
}
decorateLibraryChapterAccess();

function updateChapterFilter(entry){
 if(!active||active!==entry||!entry.story)return;
 const query=normalizedQuery(entry.search?.value);
 const mode=CHAPTER_FILTERS.includes(entry.filter?.value)?entry.filter.value:'all';
 entry.visible=[];
 for(let i=0;i<entry.story.chapters.length;i++){
  const chapter=entry.story.chapters[i];
  const titles=normalizedQuery([chapter.title,chapter.titleAr,chapter.titleEn]
   .filter(Boolean).join(' '));
  const matchesQuery=!query||titles.includes(query)||String(i+1)===query;
  const matchesFilter=mode==='all'||
   (mode==='illustrated'&&Boolean(entry.images[i]))||
   (mode==='pending'&&!entry.images[i])||
   (mode==='started'&&startedInEntry(entry,i));
  if(matchesQuery&&matchesFilter)entry.visible.push(i);
 }
 entry.moreObserver?.disconnect?.();
 entry.moreObserver=null;
 entry.rendered=0;entry.more=null;
 entry.track.replaceChildren();
 if(!entry.visible.length){
  addText(entry.track,'p','lt-chapter-gallery-empty',
   locale('لا توجد فصول مطابقة لهذا البحث أو الفلتر.',
          'No chapters match this search and filter.'));
 }else appendChapterBatch(entry);
 entry.searchSummary.textContent=(query||mode!=='all')?
  locale('الفصول المعروضة: '+entry.visible.length+' من '+entry.story.chapters.length,
         'Visible chapters: '+entry.visible.length+' of '+entry.story.chapters.length):
  locale('الفصول مرتبة بحسب النسخة الأصلية',
         'Chapters follow the original edition order');
 entry.track.setAttribute('aria-busy','false');
}
function renderCards(entry,story){
 if(!active||active!==entry||!entry.track?.isConnected)return;
 if(!Array.isArray(story.chapters))return;
 entry.story=story;
 entry.readingStartedCache=new Map();
 entry.images=distinctChapterImages(story);
 const count=story.chapters.length;
 const raw=typeof get==='function'?get('chapter_'+story.id,null):null;
 entry.hasProgress=Number.isSafeInteger(raw)&&raw>=0&&raw<count;
 entry.resume=entry.hasProgress?raw:0;
 entry.search.disabled=false;
 entry.continue.disabled=count===0;
 entry.continue.textContent=!entry.hasProgress?
  locale('ابدأ القراءة من الفصل الأول','Start from chapter 1'):
  locale('متابعة القراءة من الفصل '+(entry.resume+1),
         'Resume reading at chapter '+(entry.resume+1));
 entry.continue.onclick=()=>{
  if(active===entry)openSelected(story.id,entry.resume);
 };
 entry.locate.disabled=!entry.hasProgress;
 entry.locate.textContent=entry.hasProgress?
  locale('حدّد الفصل '+(entry.resume+1),'Find chapter '+(entry.resume+1)):
  locale('لا يوجد موضع قراءة محفوظ','No saved reading position');
 entry.title.textContent=bookTitle(story);
 const total=declared(story);
 entry.count.textContent=total===count
  ?locale(count+' فصلًا متاحًا',count+' available chapters')
  :locale(count+' من '+total+' فصلًا متاحًا',
    count+' of '+total+' chapters available');
 updateArtStatus(entry);
 entry.filter.disabled=false;
 entry.layoutButton.disabled=false;
 setChapterLayout(entry,entry.layout);
 updateChapterFilter(entry);
}
async function prepare(id,entry){
 const token=entry.token;
 const story=storyById(id);
 if(!story)return;
 // Only the previously installed offline loader may provide lazy chapters and
 // existing art; no new network request, API or literature import is added.
 try{
  if(story.lazyBook===true&&global.LinguaContentLoader?.ensureStory){
   entry.loadingLongBook=true;
   try{
    await global.LinguaContentLoader.ensureStory(id);
   }finally{
    entry.loadingLongBook=false;
   }
  }
  // For legacy packaged scenes, reuse the existing idle art renderer on demand.
  const refreshed=storyById(id);
  const classic=refreshed?.lazyBook||refreshed?.fullWordCount>=25000||
    refreshed?.totalChapters>15||refreshed?.id==='around-the-world-in-eighty-days-towle';
  if(!classic&&global.LinguaContentLoader?.ensureEditorialArt)
   await global.LinguaContentLoader.ensureEditorialArt().catch(()=>{});
  if(!active||active!==entry||entry.token!==token)return;
  renderCards(entry,storyById(id)||story);
 }catch(_){
  if(active!==entry||entry.token!==token)return;
  // Never advertise a partial/lazy book as complete on an error. Its available
  // chapter placeholders may be shown, but reading will not invent chapters.
  const loadedStory=storyById(id);
  if(available(loadedStory)>0)renderCards(entry,loadedStory);
  else{
   entry.track.replaceChildren();
   entry.track.setAttribute('aria-busy','false');
   addText(entry.track,'p','lt-chapter-gallery-error',
    locale('تعذّر تجهيز فصول هذا الكتاب دون إنترنت. حاول مرة أخرى.',
      'Could not prepare this book offline. Please try again.'));
   const retry=document.createElement('button');retry.type='button';
   retry.className='secondary';retry.textContent=locale('إعادة المحاولة','Retry');
   retry.addEventListener('click',()=>prepare(id,entry));
   entry.track.appendChild(retry);
  }
 }
}
function show(id,{historyEntry=true}={}){
 const story=storyById(id);
 if(!hasChapters(story))return false;
 const current=active;
 if(current)close(false);
 // A reader-opened chapter chooser is a modal reader control, not a new
 // top-level history page. This preserves in-reader Close/Android Back.
 const fromReader=state.page==='reader';
 const restoreFocus=document.activeElement;
 const dialog=document.createElement('dialog');
 dialog.className='lt-chapter-gallery';
 dialog.id=galleryKey;
 dialog.setAttribute('aria-label',locale('فصول '+bookTitle(story),'Chapters of '+bookTitle(story)));
 dialog.dir=document.documentElement.lang==='en'?'ltr':'rtl';
 const sheet=document.createElement('div');sheet.className='lt-chapter-gallery-sheet';
 const head=document.createElement('header');head.className='lt-chapter-gallery-header';
 const copy=document.createElement('div');copy.className='lt-chapter-gallery-copy';
 addText(copy,'span','lt-chapter-gallery-eyebrow',locale('مكتبة الفصول','CHAPTER LIBRARY'));
 const title=addText(copy,'h2','lt-chapter-gallery-title',bookTitle(story));
 const count=addText(copy,'p','lt-chapter-gallery-subtitle',locale('جارٍ ترتيب الفصول…','Preparing chapters…'));
 const tools=document.createElement('div');tools.className='lt-chapter-gallery-tools';
 const searchLabel=document.createElement('label');searchLabel.className='lt-chapter-gallery-search-label';
 searchLabel.textContent=locale('ابحث عن فصل','Find a chapter');
 const search=document.createElement('input');
 search.className='lt-chapter-gallery-search';
 search.type='search';search.value='';search.maxLength=100;
 search.autocomplete='off';search.spellcheck=false;search.disabled=true;
 search.placeholder=locale('رقم الفصل أو عنوانه…','Chapter number or title…');
 search.setAttribute('aria-label',locale('البحث في عناوين جميع الفصول',
                                     'Search every chapter title and number'));
 search.setAttribute('aria-controls','lt-chapter-gallery-track');
 searchLabel.appendChild(search);tools.appendChild(searchLabel);
 const continueButton=document.createElement('button');
 continueButton.type='button';continueButton.disabled=true;
 continueButton.className='lt-chapter-gallery-continue';
 continueButton.textContent=locale('متابعة القراءة','Resume reading');
 tools.appendChild(continueButton);
 // Filters preserve the original narrative order, and never approve sources.
 const filterLabel=document.createElement('label');
 filterLabel.className='lt-chapter-gallery-filter-label';
 filterLabel.textContent=locale('عرض الفصول حسب','Show chapters by');
 const filter=document.createElement('select');
 filter.className='lt-chapter-gallery-filter';
 filter.disabled=true;filter.value='all';
 filter.setAttribute('aria-label',locale('تصفية حسب الصورة وحالة القراءة',
  'Filter chapters by image and reading status'));
 for(const [value,ar,en] of [
  ['all','كل الفصول','All chapters'],
  ['illustrated','لها صورة متاحة','Available images'],
  ['pending','تحتاج صورة','Images missing'],
  ['started','بدأت قراءتها','Reading started']
 ]){
  const option=document.createElement('option');
  option.value=value;option.textContent=locale(ar,en);
  filter.appendChild(option);
 }
 filterLabel.appendChild(filter);
 tools.appendChild(filterLabel);
 const layoutButton=document.createElement('button');
 layoutButton.type='button';layoutButton.disabled=true;
 layoutButton.className='lt-chapter-gallery-layout';
 layoutButton.textContent=locale('عرض قائمة','List view');
 layoutButton.setAttribute('aria-label',locale('تغيير عرض الفصول',
  'Switch horizontal cards or list layout'));
 layoutButton.setAttribute('aria-pressed','false');
 tools.appendChild(layoutButton);
 copy.appendChild(tools);
 const searchSummary=addText(copy,'small','lt-chapter-gallery-results','');
 searchSummary.setAttribute('role','status');
 searchSummary.setAttribute('aria-live','polite');
 head.appendChild(copy);
 const dismiss=document.createElement('button');
 dismiss.type='button';dismiss.className='lt-chapter-gallery-close';
 dismiss.textContent=locale('إغلاق ×','Close ×');
 dismiss.setAttribute('aria-label',locale('العودة للمكتبة','Back to library'));
 dismiss.addEventListener('click',()=>close(true));
 head.appendChild(dismiss);
 sheet.appendChild(head);
 const track=document.createElement('div');track.className='lt-chapter-gallery-track';
 track.id='lt-chapter-gallery-track';
 track.setAttribute('role','group');
 track.setAttribute('aria-label',locale('الفصول بالترتيب','Chapters in order'));
 track.setAttribute('aria-busy','true');
 track.setAttribute('aria-keyshortcuts','ArrowLeft ArrowRight Home End');
 track.addEventListener('keydown',event=>{if(active)focusChapterByArrow(active,event)});
 addText(track,'p','lt-chapter-gallery-loading',locale('جارٍ تجهيز الفصول المحلية…','Loading offline chapters…'));
 sheet.appendChild(track);
 const footer=document.createElement('footer');footer.className='lt-chapter-gallery-footer';
 const missing=addText(footer,'span','lt-chapter-gallery-status','');
 const locate=document.createElement('button');
 locate.type='button';locate.disabled=true;
 locate.className='lt-chapter-gallery-locate';
 locate.textContent=locale('حدّد موضع القراءة','Find saved chapter');
 locate.setAttribute('aria-label',locale('اعرض بطاقة الفصل الذي توقفت عنده',
   'Locate the chapter where you stopped reading'));
 footer.appendChild(locate);
 sheet.appendChild(footer);
 dialog.appendChild(sheet);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close(true);});
 dialog.addEventListener('click',event=>{if(event.target===dialog)close(true);});
 document.body.appendChild(dialog);
 const storedLayout=typeof get==='function'?
  get('lt_chapter_gallery_layout','rail'):'rail';
 const entry={dialog,track,title,count,missing,locate,search,filter,layoutButton,
  layout:storedLayout==='list'?'list':'rail',
  continue:continueButton,searchSummary,restoreFocus,
  token:++serial,id,rendered:0,more:null,fromReader,loadingLongBook:false};
 locate.addEventListener('click',()=>{
  if(active!==entry||!entry.story||!entry.hasProgress)return;
  // Locate without selecting or changing reading progress. On a 1000-chapter
  // anthology only the bookmarked card mounts, not 1000 heavy images.
  entry.filter.value='all';
  entry.search.value=String(entry.resume+1);
  updateChapterFilter(entry);
  const card=entry.track.querySelector?.('.lt-chapter-tile');
  card?.focus?.({preventScroll:true});
  card?.scrollIntoView?.({block:'nearest',inline:'center',behavior:'auto'});
 });
 search.addEventListener('input',()=>updateChapterFilter(entry));
 filter.addEventListener('change',()=>updateChapterFilter(entry));
 layoutButton.addEventListener('click',()=>{
  if(active!==entry||layoutButton.disabled)return;
  setChapterLayout(entry,entry.layout==='list'?'rail':'list',{save:true});
 });
 active=entry;
 if(historyEntry&&!fromReader&&global.history?.pushState)
  global.history.pushState({page:'chapter-gallery',storyId:id},'','#chapters-'+encodeURIComponent(id));
 try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
 prepare(id,entry);
 return true;
}
// IMPORTANT: direct openStory(id) is intentionally left alone. Deep-link,
// automated bilingual-translation journeys, bookmark restore, study exercises
// and previously installed integrations call it to enter the reader directly.
// Intercept only REAL click activation of a library book card/Continue button.
// This preserves the old programmatic API without conflicting with the UX.
function activateBookCard(event){
 if(event.defaultPrevented)return;
 const target=event.target?.nodeType===1?event.target:event.target?.parentElement;
 if(!target?.closest)return;
 // The favorite, discovery dropdown and other nested library controls must
 // never be mistaken for the book cover.
 if(target.closest('.stl-favorite,.stl-discovery button,input,select,textarea,a'))return;
 const card=target.closest('.library .card[onclick],.library .hero-continue[onclick]');
 if(!card)return;
 const handler=card.getAttribute?.('onclick')||'';
 const match=handler.match(/^openStory\('([a-z0-9-]{1,95})'\);?$/);
 const id=match?.[1];
 if(!id||!hasChapters(storyById(id)))return;
 event.preventDefault?.();
 event.stopPropagation?.();
 show(id);
}
document.addEventListener?.('click',activateBookCard,true);
// A per-chapter approved picture is visible INSIDE the actual book chapter,
// not just as a thumbnail in the chapter chooser. We use the EXISTING hero
// surface to avoid reflowing the paper page grid and Codex-owned page curl.
// Artwork already anchored inside prose is not duplicated in a second place.
function attachApprovedChapterHero(){
 if(state.page!=='reader'||!state.story)return;
 const approved=chapterImage(state.story,state.chapter);
 if(!approved||approved.kind!=='approved')return;
 const reader=document.querySelector('.reader');
 const hero=reader?.querySelector?.('.reader-hero');
 if(!hero||hero.querySelector?.('.lt-approved-chapter-figure'))return;
 // Avoid a duplicate if this approved historical print is already used by the
 // in-prose chapter art system, with its own exact paragraph placement.
 const images=Array.from(reader.querySelectorAll?.('img[src]')||[]);
 if(images.some(img=>img.getAttribute?.('src')===approved.src))return;
 const figure=document.createElement('figure');
 figure.className='lt-approved-chapter-figure';
 const img=document.createElement('img');
 img.className='lt-approved-chapter-picture';
 img.alt=approved.alt;
 img.loading='eager';img.decoding='async';
 img.setAttribute('draggable','false');
 const credit=document.createElement('figcaption');
 credit.className='lt-approved-chapter-credit';
 credit.textContent=locale('صورة الفصل · ','Chapter illustration · ')+approved.credit;
 img.addEventListener('error',()=>{
  figure.remove();
  hero.classList.remove('lt-chapter-primary-hero');
  hero.style.backgroundImage=hero.dataset.ltOriginalHeroBg||'';
  delete hero.dataset.ltOriginalHeroBg;
 },{once:true});
 figure.appendChild(img);figure.appendChild(credit);
 hero.dataset.ltOriginalHeroBg=hero.style.backgroundImage||'';
 hero.classList.add('lt-chapter-primary-hero');
 hero.style.backgroundImage='none';
 hero.appendChild(figure);
 img.src=approved.src;
}
// Provide an always-accessible way back to chapter thumbnails from inside
// the reader. The existing paging/selection/page-fold renderer is untouched.
const baseRender=global.renderReader;
if(typeof baseRender==='function'){
 global.renderReader=function(...args){
  const result=baseRender.apply(this,args);
  attachApprovedChapterHero();
  if(state.page!=='reader'||!hasChapters(state.story))return result;
  const nav=document.querySelector('.reader .lt-chapter-nav')||
   document.querySelector('.reader .toolbar');
  if(!nav||nav.querySelector('.lt-open-chapter-gallery'))return result;
  const button=document.createElement('button');
  button.type='button';
  button.className='secondary lt-open-chapter-gallery';
  button.textContent=locale('▦ الفصول المصوّرة','▦ Illustrated chapters');
  button.setAttribute('aria-label',locale('عرض جميع فصول القصة وصورها','Show story chapters and their images'));
  button.addEventListener('click',()=>{
   if(state.page==='reader'&&state.story)show(state.story.id);
  });
  nav.appendChild(button);
  return result;
 };
}

// Reader stays untouched. A book icon in the existing reader's chapter nav
// can open exactly this image-backed gallery without discarding its scroll.
global.LinguaChapterGallery=Object.freeze({
 open:show,close,openSelected,chapterImage,hasChapters,
 get isOpen(){return !!active;}
});
global.addEventListener?.('popstate',event=>{
 if(active){
  if(event.state?.page!=='chapter-gallery')close(false);
  return;
 }
 // Android/system Back from a chapter reader goes through the existing
 // animated library close. Restore the prior chapter chooser on that
 // history entry, only when the reader really has returned to library.
 if(event.state?.page==='chapter-gallery'&&lastReaderBook===event.state.storyId){
  const id=lastReaderBook;
  // The existing animated reader close can take 190ms; older Android
  // WebViews may instead use the shell's 480ms history fallback. Poll for
  // the actual library state, never force an early second reader/overlay.
  const recover=(attempt)=>{
   if(active||lastReaderBook!==id||!storyById(id)||
      global.history?.state?.page!=='chapter-gallery'||
      global.history?.state?.storyId!==id)return;
   if(state.page==='library'){
    show(id,{historyEntry:false});
    return;
   }
   if(attempt<12)global.setTimeout?.(()=>recover(attempt+1),120);
  };
  global.setTimeout?.(()=>recover(0),270);
 }
});
})(window);
