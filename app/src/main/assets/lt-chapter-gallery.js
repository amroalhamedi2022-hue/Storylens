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
function validatedArt(entry){
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
 const inlineReady=entry.verifiedArchive===true &&
    entry.sourceParagraphExact===true &&
    entry.distributionReviewApproved===true &&
    entry.editoriallyApproved===true;
 if(!ready&&!inlineReady)return null;
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
 const explicit=chapter.chapterThumbnail||story.chapterThumbnails?.[index]||record?.primaryImage;
 const direct=validatedArt(explicit);
 if(direct)return direct;
 // Reuse already-approved in-prose art only if its original source and
 // exact passage check passed. Never borrow a picture from another chapter.
 const inline=Array.isArray(chapter.inlineArt)?chapter.inlineArt:[];
 for(const candidate of inline){
  const result=validatedArt(candidate);
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
 if(!story||!Number.isSafeInteger(index)||index<0||index>=available(story))return false;
 // Existing per-story progress key and reader pipeline are preserved.
 // A selected chapter starts/resumes at its saved scroll/page semantic anchor.
 if(typeof put==='function')put('chapter_'+story.id,index);
 lastReaderBook=id;
 close(false);
 return originalOpen.call(global,id);
}
function renderCards(entry,story){
 if(!active||active!==entry||!entry.track?.isConnected)return;
 entry.track.replaceChildren();
 const chapters=story.chapters||[];
 const resume=typeof get==='function'?Number(get('chapter_'+story.id,0)):0;
 for(let i=0;i<chapters.length;i++){
  const chapter=chapters[i];
  const card=document.createElement('button');
  card.type='button';
  card.className='lt-chapter-tile';
  card.dataset.chapterIndex=String(i);
  if(i===resume)card.classList.add('lt-chapter-resume');
  card.setAttribute('aria-label',locale('اقرأ الفصل ','Read chapter ')+(i+1)+' · '+titleFor(chapter,i));
  const cover=document.createElement('span');cover.className='lt-chapter-tile-visual';
  const source=chapterImage(story,i);
  if(source){
   const img=document.createElement('img');
   img.src=source.src;
   img.alt=source.alt;
   img.loading='lazy';
   img.decoding='async';
   img.setAttribute('draggable','false');
   img.addEventListener('error',()=>{
    // An unavailable packaged image does not hide an otherwise readable chapter.
    img.remove();
    cover.classList.add('lt-chapter-image-missing');
    addText(cover,'span','lt-chapter-tile-number',String(i+1).padStart(2,'0'));
    card.classList.add('lt-chapter-art-unavailable');
   },{once:true});
   cover.appendChild(img);
   card.dataset.thumbnailState=source.kind;
  }else{
   cover.classList.add('lt-chapter-image-missing');
   addText(cover,'span','lt-chapter-tile-number',String(i+1).padStart(2,'0'));
   card.dataset.thumbnailState='missing-or-pending-approval';
  }
  const figLabel=addText(cover,'span','lt-chapter-tile-kicker',
    locale('الفصل '+(i+1),'CHAPTER '+(i+1)));
  if(i===resume)addText(cover,'span','lt-chapter-tile-continue',
    locale('موضع القراءة','Resume'));
  card.appendChild(cover);
  addText(card,'strong','lt-chapter-tile-heading',titleFor(chapter,i));
  if(!source)addText(card,'small','lt-chapter-tile-pending',
    locale('الصورة لم تُعتمد بعد','Image pending approval'));
  card.addEventListener('click',()=>openSelected(story.id,i));
  entry.track.appendChild(card);
 }
 const total=declared(story);
 entry.count.textContent=total===chapters.length
  ?locale(chapters.length+' فصلًا متاحًا',chapters.length+' available chapters')
  :locale(chapters.length+' من '+total+' فصلًا متاحًا',
    chapters.length+' of '+total+' chapters available');
 entry.title.textContent=bookTitle(story);
 const missing=chapters.filter((_,i)=>!chapterImage(story,i)).length;
 entry.missing.textContent=missing?locale(
  'صور الفصول قيد الاستكمال: '+missing+' من '+chapters.length,
  'Chapter images pending: '+missing+' of '+chapters.length
 ) : locale('جميع الفصول لها صور متاحة','Every chapter has an available image');
 entry.track.setAttribute('aria-busy','false');
}
async function prepare(id,entry){
 const token=entry.token;
 const story=storyById(id);
 if(!story)return;
 // Only the previously installed offline loader may provide lazy chapters and
 // existing art; no new network request, API or literature import is added.
 try{
  if(story.lazyBook===true&&global.LinguaContentLoader?.ensureStory)
   await global.LinguaContentLoader.ensureStory(id);
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
 head.appendChild(copy);
 const dismiss=document.createElement('button');
 dismiss.type='button';dismiss.className='lt-chapter-gallery-close';
 dismiss.textContent=locale('إغلاق ×','Close ×');
 dismiss.setAttribute('aria-label',locale('العودة للمكتبة','Back to library'));
 dismiss.addEventListener('click',()=>close(true));
 head.appendChild(dismiss);
 sheet.appendChild(head);
 const track=document.createElement('div');track.className='lt-chapter-gallery-track';
 track.setAttribute('role','group');
 track.setAttribute('aria-label',locale('الفصول بالترتيب','Chapters in order'));
 track.setAttribute('aria-busy','true');
 addText(track,'p','lt-chapter-gallery-loading',locale('جارٍ تجهيز الفصول المحلية…','Loading offline chapters…'));
 sheet.appendChild(track);
 const footer=document.createElement('footer');footer.className='lt-chapter-gallery-footer';
 const missing=addText(footer,'span','lt-chapter-gallery-status','');
 sheet.appendChild(footer);
 dialog.appendChild(sheet);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close(true);});
 dialog.addEventListener('click',event=>{if(event.target===dialog)close(true);});
 document.body.appendChild(dialog);
 const entry={dialog,track,title,count,missing,restoreFocus,token:++serial,id};
 active=entry;
 if(historyEntry&&global.history?.pushState)
  global.history.pushState({page:'chapter-gallery',storyId:id},'','#chapters-'+encodeURIComponent(id));
 try{dialog.showModal();}catch(_){dialog.setAttribute('open','');}
 prepare(id,entry);
 return true;
}
global.openStory=function(id,...args){
 const story=storyById(id);
 if(hasChapters(story)){show(id);return;}
 return originalOpen.apply(this,[id,...args]);
};
 // Provide an always-accessible way back to chapter thumbnails from inside
 // the reader. The existing paging/selection/page-fold renderer is untouched.
const baseRender=global.renderReader;
if(typeof baseRender==='function'){
 global.renderReader=function(...args){
  const result=baseRender.apply(this,args);
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
  global.setTimeout?.(()=>{
   if(!active&&state.page==='library'&&storyById(id))
    show(id,{historyEntry:false});
  },270);
 }
});
})(window);
