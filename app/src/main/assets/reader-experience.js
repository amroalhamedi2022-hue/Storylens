/* StoryLens v0.5 — reading comfort, chapter/bookmark navigation and editorial library.
 * All enhancements are offline; original story and review stores are preserved.
 */
(function(){
'use strict';
const originalLibrary=library;
const originalOpenStory=openStory;
const originalReader=renderReader;
const originalSettings=settings;
const originalTheme=theme;
const originalInlineTranslate=inlineTranslate;

const originalWordSheet=wordSheet;
// Offline font gallery: use Android's installed font families so the APK stays light.
// Families are deliberately split by language to preserve correct Arabic shaping.
const ltGlassPalettes=[
 {id:'sapphire',ar:'ياقوتي',en:'Sapphire',a:'#1768ff',b:'#6b4dff',c:'#28d9ff'},
 {id:'violet',ar:'بنفسجي',en:'Violet',a:'#5428d9',b:'#a34cff',c:'#f16acb'},
 {id:'rose',ar:'وردي',en:'Rose',a:'#f33e8e',b:'#a744e8',c:'#ff9dba'},
 {id:'sunset',ar:'غروب',en:'Sunset',a:'#ff6c47',b:'#f43f83',c:'#ffbd59'},
 {id:'ocean',ar:'محيطي',en:'Ocean',a:'#006fba',b:'#00a9b7',c:'#5b80ff'},
 {id:'mint',ar:'نعناعي',en:'Mint',a:'#00a98e',b:'#50c7b5',c:'#b0f1c6'},
 {id:'lavender',ar:'لافندر',en:'Lavender',a:'#9381ff',b:'#d3a3ff',c:'#f7b9df'},
 {id:'graphite',ar:'جرافيت',en:'Graphite',a:'#26364d',b:'#69788d',c:'#9a8da9'},
 {id:'pearl',ar:'لؤلؤي',en:'Pearl',a:'#b4c9ff',b:'#e1baff',c:'#ffc9df'},
 {id:'rainbow',ar:'طيف',en:'Spectrum',a:'#ff5d9e',b:'#7b61ff',c:'#ffad57'}
];
function ltApplyGlass(){
 const palette=ltGlassPalettes.find(item=>item.id===get('lt_glass_palette','sapphire'))||ltGlassPalettes[0];
 const raw=Number(get('lt_glass_tint',42));
 const tint=Number.isFinite(raw)?Math.max(0,Math.min(100,raw)):42;
 document.body.dataset.ltPalette=palette.id;
 document.documentElement.style.setProperty('--lt-glass-opacity',String(.08+tint/100*.52));
 document.documentElement.style.setProperty('--lt-glass-mix',Math.round(8+tint*.42)+'%');
 document.documentElement.style.setProperty('--lt-glass-blur',(7+tint*.3)+'px');
 document.documentElement.style.setProperty('--lt-glass-sheen',String(.12+tint/100*.48));
 document.documentElement.style.setProperty('--lt-glass-preview-alpha',String(tint/100*.65));
 document.documentElement.style.setProperty('--lt-glass-a',palette.a);
 document.documentElement.style.setProperty('--lt-glass-b',palette.b);
 document.documentElement.style.setProperty('--lt-glass-c',palette.c);
 document.body.classList.toggle('lt-reduce-transparency',!!get('lt_reduce_transparency',false));
 document.body.classList.toggle('lt-high-contrast',!!get('lt_high_contrast',false));
}
const ltFontChoices=[
 {id:'system',labelAr:'النظام الافتراضي',labelEn:'System default',ar:'system-ui, sans-serif',en:'Georgia, serif'},
 {id:'naskh',labelAr:'نسخ كلاسيكي',labelEn:'Classic Naskh',ar:'"Noto Naskh Arabic", "Noto Serif Arabic", serif',en:'Georgia, "Noto Serif", serif'},
 {id:'sans',labelAr:'حديث واضح',labelEn:'Modern sans',ar:'"Noto Sans Arabic", "Noto Sans", sans-serif',en:'Arial, sans-serif'},
 {id:'serif',labelAr:'سيريف أدبي',labelEn:'Literary serif',ar:'"Noto Naskh Arabic", serif',en:'Georgia, "Times New Roman", serif'},
 {id:'rounded',labelAr:'مستدير وودود',labelEn:'Rounded friendly',ar:'"Noto Sans Arabic", "Arial Rounded MT Bold", sans-serif',en:'"Trebuchet MS", Arial, sans-serif'},
 {id:'humanist',labelAr:'إنساني مريح',labelEn:'Humanist',ar:'"Noto Sans Arabic", sans-serif',en:'"Trebuchet MS", "Gill Sans", sans-serif'},
 {id:'classic',labelAr:'كلاسيكي مطبوع',labelEn:'Classic print',ar:'"Noto Naskh Arabic", serif',en:'"Times New Roman", Georgia, serif'},
 {id:'mono',labelAr:'أحادي المسافة',labelEn:'Monospace',ar:'monospace',en:'ui-monospace, monospace'},
 {id:'handwritten',labelAr:'كتابة يد ناعمة',labelEn:'Soft handwriting',ar:'"Aref Ruqaa Ink", "Aref Ruqaa", "Segoe Print", cursive',en:'"Segoe Print", "Bradley Hand", "Comic Sans MS", cursive'},
 {id:'casual-hand',labelAr:'كتابة يدوية مرحة',labelEn:'Casual handwritten',ar:'"Aref Ruqaa", "Noto Naskh Arabic", cursive',en:'"Comic Sans MS", "Chalkboard", "Trebuchet MS", cursive'},
 {id:'calligraphy',labelAr:'خط عربي انسيابي',labelEn:'Flowing calligraphy',ar:'"Aref Ruqaa Ink", "Aref Ruqaa", "Noto Naskh Arabic", cursive',en:'"Bradley Hand", "Segoe Print", cursive'}
];
function ltApplyFonts(){
 const choice=ltFontChoices.find(item=>item.id===get('lt_font_choice','system'))||ltFontChoices[0];
 document.querySelectorAll('.reader .sentence,.reader .reader-hero,.reader .chapter-end,.reader .inline-ar').forEach(node=>{
  const arabic=node.matches('.inline-ar')||node.closest('[lang="ar"]')||/[\\u0600-\\u06FF]/.test(node.textContent||'');
  node.style.fontFamily=arabic?choice.ar:choice.en;
 });
 const rootStyle=document.documentElement?.style;
 // Inline font-family remains usable even in a partial/early WebView host that
 // does not expose CSSStyleDeclaration yet; real Android browsers take this path.
 if(rootStyle&&typeof rootStyle.setProperty==='function'){
  rootStyle.setProperty('--lt-font-en',choice.en);
  rootStyle.setProperty('--lt-font-ar',choice.ar);
 }
}


// Choose a contextual Arabic gloss only from the actual dictionary senses and
// the aligned Arabic sentence. This is a transparent heuristic, not an AI claim.
function contextualMeaning(entry, source, story){
 // Historical glossaries use `context` for an English source excerpt in some entries.
 // Only an explicitly Arabic context may be presented as an Arabic contextual gloss.
 const authoredContext=typeof entry?.context==='string'?entry.context.trim():'';
 const authored=Array.isArray(story?.terms)&&story.terms.includes(entry)&&
  authoredContext&&/[\u0600-\u06FF]/.test(authoredContext);
 if(authored)return {label:'المعنى السياقي داخل القصة',text:entry.context.trim(),kind:'editorial'};
 const senses=Array.isArray(entry?.meanings)?entry.meanings.filter(x=>typeof x==='string'&&x.trim()):[];
 if(!senses.length&&typeof entry?.literal==='string'&&entry.literal.trim())senses.push(entry.literal.trim());
 const fold=s=>String(s||'').normalize('NFC').replace(/[\u064B-\u065F\u0670\u0640]/g,'')
  .replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').toLowerCase();
 const stop=new Set(['في','من','على','الى','إلى','عن','ان','أن','كان','كانت','هو','هي','هذا','هذه','ذلك','ثم','مع','قد','لم','لن','لا','ما','و','ف','ب','ل','الذي','التي']);
 const contextTokens=new Set((fold(source?.ar).match(/[\u0621-\u064A]{3,}/g)||[]).filter(x=>!stop.has(x)));
 let best=null,bestScore=0,bestOverlap=0,ambiguous=false;
 for(const sense of senses){
  // Count distinct content words only; duplicate words must not inflate evidence.
  const words=Array.from(new Set((fold(sense).match(/[\u0621-\u064A]{3,}/g)||[]).filter(x=>!stop.has(x))));
  const overlap=words.filter(x=>contextTokens.has(x)).length;
  const score=overlap/(Math.max(1,Math.min(words.length,contextTokens.size)));
  const sameScore=Math.abs(score-bestScore)<1e-9;
  if(score>bestScore+1e-9||(sameScore&&overlap>bestOverlap)){
   best=sense;bestScore=score;bestOverlap=overlap;ambiguous=false;
  }else if(score>0&&sameScore&&overlap===bestOverlap&&best&&fold(sense)!==fold(best)){
   // Two different senses with identical sentence evidence are not distinguishable.
   // Prefer the honest fallback over an arbitrary first-item "contextual" meaning.
   ambiguous=true;
  }
 }
 if(best&&bestScore>0&&!ambiguous)return {label:'أقرب معنى بحسب ترجمة الجملة',text:best,kind:'inferred'};
 return {label:'السياق من القصة',text:'لم يُعثر على معنى مفرد موثّق لهذه الكلمة في هذه الجملة بعد. اقرأ ترجمة الجملة أدناه؛ ولن نخترع تعريفًا غير مؤكد.',kind:'sentence'};
}
wordSheet=function(args){
 originalWordSheet(args);
 const sheet=document.querySelector('#modals .sheet');
 if(!sheet)return;
 const labels=Array.from(sheet.querySelectorAll('label'));
 const contextLabel=labels.find(node=>/المعنى داخل القصة|المعنى في الجملة/.test(node.textContent||''));
 if(!contextLabel)return;
 const contextNode=contextLabel.nextElementSibling;
 if(!contextNode)return;
 const result=contextualMeaning(args?.entry,args?.source,state.story);
 contextLabel.textContent=result.label;
 contextNode.textContent=result.text;
 contextNode.classList.toggle('lt-context-inferred',result.kind==='inferred');
 contextNode.classList.toggle('lt-context-editorial',result.kind==='editorial');
 contextNode.classList.toggle('lt-context-missing',result.kind==='sentence');
};

// Each chapter becomes a sequence of readable pages. Four paragraphs is a
// conservative starting point; translations and illustrations travel with
// their source paragraph. The current page is persisted per story/chapter.
const LT_PAGE_PARAGRAPHS=4;
const ltPageIndices=new Map();
// Do not let page gestures steal taps, text selection, or accessibility controls.
function pageSwipeAllowed(target,selectionText=''){
 if(typeof selectionText==='string'&&selectionText.trim())return false;
 const element=target?.nodeType===1?target:target?.parentElement;
 if(!element||typeof element.closest!=='function')return true;
 return !element.closest('button,a,input,textarea,select,summary,[role="button"],[contenteditable="true"]');
}
function pageSwipeGestureAllowed(startTarget,endTarget,selectionText=''){
 return pageSwipeAllowed(startTarget,selectionText)&&pageSwipeAllowed(endTarget,selectionText);
}

// A timeout from an earlier turn must never clear a newer animation on the
// same page. WebView timers can already be queued when clearTimeout is called,
// so the callback also verifies that it still owns the page's current timer.
const pageTurnTimers=new WeakMap();
function animatePageTurn(active,direction){
 const previous=pageTurnTimers.get(active);
 if(previous!==undefined)window.clearTimeout(previous);
 // Invalidate ownership before the reduced-motion early return: a callback
 // already queued by WebView must not regain authority after a turn is skipped.
 pageTurnTimers.delete(active);
 active.classList.remove('lt-turn-forward','lt-turn-back');
 // CSS already suppresses the animation, but skipping the forced layout and
 // timer here also avoids unnecessary work on reduced-motion devices.
 if(typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 void active.offsetWidth;
 active.classList.add(direction==='back'?'lt-turn-back':'lt-turn-forward');
 const timer=window.setTimeout(()=>{
  if(pageTurnTimers.get(active)!==timer)return;
  active.classList.remove('lt-turn-forward','lt-turn-back');
  pageTurnTimers.delete(active);
 },420);
 pageTurnTimers.set(active,timer);
}
function pageGroupLabel(index,total){
 return uiText('صفحة '+(index+1)+' من '+total,'Page '+(index+1)+' of '+total);
}
function installPageTurn(){
 const reader=document.querySelector('.reader');
 const width=reader?.querySelector('.reading-width');
 const sentenceBox=width?.querySelector('#sentences');
 if(!reader||!width||!sentenceBox||width.dataset.ltPaged==='1')return;
 const sentences=Array.from(sentenceBox.querySelectorAll(':scope > .sentence'));
 if(!sentences.length)return;
 width.dataset.ltPaged='1';
 const chapterEnd=width.querySelector('.chapter-end');
 if(chapterEnd)chapterEnd.hidden=true;
 const originalNodes=Array.from(sentenceBox.childNodes);
 const pages=[];
 let page=null,count=0;
 for(const node of originalNodes){
  if(node.nodeType===1&&node.classList.contains('sentence')){
   if(!page||count>=LT_PAGE_PARAGRAPHS){
    page=document.createElement('section');
    page.className='lt-book-page';
    page.setAttribute('role','group');
    pages.push(page);count=0;
   }
   count++;
  }
  if(!page){page=document.createElement('section');page.className='lt-book-page';page.setAttribute('role','group');pages.push(page)}
  page.appendChild(node);
 }
 sentenceBox.replaceChildren(...pages);
 const pageControls=document.createElement('nav');
 pageControls.className='lt-page-controls';
 pageControls.setAttribute('aria-label',uiText('التنقل بين صفحات القصة','Story page navigation'));
 pageControls.innerHTML='<button type="button" class="secondary lt-page-prev">'+uiText('السابق','Previous')+'</button><span class="lt-page-count" aria-live="polite" aria-atomic="true"></span><button type="button" class="primary lt-page-next">'+uiText('الصفحة التالية','Next page')+'</button>';
 sentenceBox.insertAdjacentElement('afterend',pageControls);
 const key='readpage_'+state.story.id+'_'+state.chapter;
 const initial=Number(get(key,0));
 let current=Number.isInteger(initial)?Math.max(0,Math.min(pages.length-1,initial)):0;
 const prev=pageControls.querySelector('.lt-page-prev');
 const next=pageControls.querySelector('.lt-page-next');
 const countLabel=pageControls.querySelector('.lt-page-count');
 function renderPage(direction,animate){
  current=Math.max(0,Math.min(pages.length-1,current));
  pages.forEach((item,index)=>{
   item.classList.toggle('is-active',index===current);
   item.setAttribute('aria-label',pageGroupLabel(index,pages.length));
   item.setAttribute('aria-roledescription',uiText('صفحة من القصة','story page'));
   item.setAttribute('aria-hidden',index===current?'false':'true');
   item.inert=index!==current;
  });
  prev.disabled=current===0&&state.chapter===0;
  next.textContent=current===pages.length-1
   ?(state.chapter<state.story.chapters.length-1?uiText('الفصل التالي','Next chapter'):uiText('العودة للمكتبة','Back to library'))
   :uiText('الصفحة التالية','Next page');
  countLabel.textContent=uiText('الصفحة '+(current+1)+' من '+pages.length,'Page '+(current+1)+' of '+pages.length);
  put(key,current);
  if(chapterEnd)chapterEnd.hidden=current!==pages.length-1;
  if(animate&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   animatePageTurn(pages[current],direction);
  }
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 }
 function move(delta){
  if(delta>0&&current===pages.length-1){
   if(state.chapter<state.story.chapters.length-1)nextChapter();
   else libraryBack();
   return;
  }
  if(delta<0&&current===0){
   if(state.chapter===0)return;
   // Backwards page-turn crosses chapter boundaries, preserving the last
   // visible page of the preceding chapter, not chapter one's first page.
   const previous=state.chapter-1;
   const length=state.story.chapters[previous].paragraphs.length;
   const lastPage=Math.max(0,Math.ceil(length/LT_PAGE_PARAGRAPHS)-1);
   state.chapter=previous;
   put('chapter_'+state.story.id,previous);
   put('readpage_'+state.story.id+'_'+previous,lastPage);
   renderReader();window.scrollTo(0,0);
   return;
  }
  current+=delta;renderPage(delta>0?'next':'back',true);
 }
 prev.addEventListener('click',()=>move(-1));
 next.addEventListener('click',()=>move(1));
 let startX=null,startY=null,startTarget=null;
 const resetTouch=()=>{startX=null;startY=null;startTarget=null;};
 sentenceBox.addEventListener('touchstart',event=>{
  if(window.PointerEvent)return; // interactive paper drag owns modern touch gestures
  if(event.touches?.length!==1){resetTouch();return;}
  const target=event.target;
  const selected=window.getSelection?.()?.toString()||'';
  if(!pageSwipeAllowed(target,selected)){resetTouch();return;}
  startTarget=target;
  startX=event.touches[0].clientX;startY=event.touches[0].clientY;
 },{passive:true});
 sentenceBox.addEventListener('touchend',event=>{
  if(event.changedTouches?.length!==1||startX===null||startY===null){resetTouch();return;}
  const dx=event.changedTouches[0].clientX-startX;
  const dy=event.changedTouches[0].clientY-startY;
  const selected=window.getSelection?.()?.toString()||'';
  // The gesture must start and finish on reading surfaces; crossing onto a
  // control must not turn a button tap into a page change.
  const endTarget=document.elementFromPoint?.(
   event.changedTouches[0].clientX,event.changedTouches[0].clientY
  )||event.target;
  const allowed=pageSwipeGestureAllowed(startTarget,endTarget,selected);
  resetTouch();
  if(!allowed||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.25)return;
  const rtl=document.documentElement.dir==='rtl';
  move((rtl?dx>0:dx<0)?1:-1);
 },{passive:true});
 sentenceBox.addEventListener('touchcancel',resetTouch,{passive:true});
 // Physical edge-hold interaction: keep a live fold aligned to the user's
 // finger, commit only after crossing the middle, spring back on release.
 // Do not steal vertical scrolling, text selection or dictionary word taps.
 let drag=null,foldRaf=null;
 function clearFold(){
  if(foldRaf!==null){window.cancelAnimationFrame?.(foldRaf);foldRaf=null;}
  const active=pages[current];
  if(active){
   active.classList.remove('lt-paper-grabbed');
   for(const name of ['--lt-fold-origin','--lt-fold-angle','--lt-fold-shade-angle','--lt-fold-shadow'])
    active.style.removeProperty(name);
  }
 }
 function previewFold(){
  foldRaf=null;
  if(!drag)return;
  const active=pages[current];
  const amount=drag.progress;
  active.classList.add('lt-paper-grabbed');
  active.style.setProperty('--lt-fold-origin',drag.edge);
  active.style.setProperty('--lt-fold-angle',(drag.edge==='right'?-1:1)*Math.min(145,amount*145)+'deg');
  active.style.setProperty('--lt-fold-shade-angle',drag.edge==='right'?'90deg':'270deg');
  active.style.setProperty('--lt-fold-shadow','0 15px '+Math.round(20+amount*45)+'px rgba(15,17,44,'+(0.17+amount*.25)+')');
 }
 function finishPaperDrag(commit){
  if(!drag)return;
  const delta=drag.edge==='right'?1:-1;
  const turn=commit&&drag.progress>=.34;
  drag=null;clearFold();
  if(turn)move(delta);
 }
 sentenceBox.addEventListener('pointerdown',event=>{
  if(event.isPrimary===false||event.button!==0||drag||state.page!=='reader')return;
  if(event.target.closest?.('.tok,button,a,input,select,textarea,[role="button"]'))return;
  if(window.getSelection?.()?.toString())return;
  const box=sentenceBox.getBoundingClientRect();
  const x=event.clientX-box.left;
  const edge=x>=box.width-66?'right':x<=66?'left':null;
  if(!edge||(edge==='left'&&current===0&&state.chapter===0))return;
  drag={id:event.pointerId,edge,startX:event.clientX,startY:event.clientY,
   width:Math.max(1,box.width),progress:0,locked:false};
  try{sentenceBox.setPointerCapture?.(event.pointerId);}catch(_){}
 },{passive:true});
 sentenceBox.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  const horizontal=drag.edge==='right'?drag.startX-event.clientX:event.clientX-drag.startX;
  const dy=event.clientY-drag.startY;
  if(!drag.locked){
   if(Math.abs(dy)>15&&Math.abs(dy)>Math.abs(horizontal)*1.1){finishPaperDrag(false);return;}
   if(horizontal<9)return;
   drag.locked=true;
  }
  drag.progress=Math.max(0,Math.min(1,horizontal/Math.max(115,drag.width*.68)));
  if(foldRaf===null){
   if(typeof window.requestAnimationFrame==='function')foldRaf=window.requestAnimationFrame(previewFold);
   else previewFold();
  }
  if(event.cancelable)event.preventDefault();
 },{passive:false});
 sentenceBox.addEventListener('pointerup',event=>{
  if(drag&&event.pointerId===drag.id)finishPaperDrag(true);
 });
 sentenceBox.addEventListener('pointercancel',()=>finishPaperDrag(false));
 sentenceBox.addEventListener('lostpointercapture',()=>finishPaperDrag(false));
 renderPage('next',false);
}
const chapterKey=()=> 'chapter_'+state.story.id;
const bookmarkKey=()=> 'bookmarks';
// Semantic paragraph anchors survive font, theme and tablet-width changes;
// retain legacy pixel scroll for old backups and readers without DOM geometry.
function captureParagraphAnchor(){
 const viewport=Number.isFinite(window.innerHeight)?window.innerHeight:800;
 for(const node of document.querySelectorAll('.reader .sentence')){
  const paragraph=Number(node.dataset?.i);
  const box=node.getBoundingClientRect?.();
  if(!Number.isInteger(paragraph)||paragraph<0||!box||
     !Number.isFinite(box.top)||!Number.isFinite(box.bottom)||
     box.bottom<=52||box.top>=viewport)continue;
  return {paragraph,viewportOffset:Math.max(-4096,Math.min(4096,box.top))};
 }
 return {};
}
function bookmarkPosition(mark){
 const fallback=typeof mark.scroll==='number'&&Number.isFinite(mark.scroll)
  ?Math.max(0,Math.min(mark.scroll,10000000)):0;
 const paragraphs=state.story?.chapters[state.chapter]?.paragraphs;
 if(!Number.isInteger(mark.paragraph)||mark.paragraph<0||
    mark.paragraph>=(paragraphs?.length??0)||
    typeof mark.viewportOffset!=='number'||!Number.isFinite(mark.viewportOffset)||
    Math.abs(mark.viewportOffset)>4096)return fallback;
 const node=Array.from(document.querySelectorAll('.reader .sentence'))
  .find(el=>Number(el.dataset?.i)===mark.paragraph);
 const top=node?.getBoundingClientRect?.().top;
 const y=window.scrollY+top-mark.viewportOffset;
 return Number.isFinite(top)&&Number.isFinite(y)
  ?Math.max(0,Math.min(y,10000000)):fallback;
}
// Keep reader-only sentence reveals through theme/font/locale re-renders and
// chapter navigation. Do not write per-tap state to synchronous localStorage;
// reveals are ephemeral and never modify the English or Arabic book content.
const revealedByChapter=new Map();
const revealKey=()=>state.story.id+'\u0000'+state.chapter;
function revealSet(key){
 if(!revealedByChapter.has(key)){
  if(revealedByChapter.size>=40)revealedByChapter.delete(revealedByChapter.keys().next().value);
  revealedByChapter.set(key,new Set());
 }
 return revealedByChapter.get(key);
}
const snapshot=()=>state.story&&state.page==='reader'&&put('scroll_'+state.story.id+'_'+state.chapter,window.scrollY);
const storyById=id=>catalog.stories.find(s=>s.id===id);
const chapterIndex=s=>{
 const value=Number(get('chapter_'+s.id,0));
 // Imported/legacy progress can contain fractions, NaN or nonnumeric strings.
 // Never use such values to index chapters or calculate progress percentages.
 return Number.isInteger(value)&&Number.isFinite(value)
  ?Math.max(0,Math.min(s.chapters.length-1,value)):0;
};
const escapeText=value=>esc(value);
// Interface strings follow the UI locale; story English and translations remain untouched.
const uiText=(ar,en)=>document.documentElement.lang==='en'?en:ar;

openStory=function(id){
 const story=storyById(id);
 if(!story)return;
 // A damaged/old backup must not make the base reader index an absent chapter.
 // Keep the original progress key and clamp before invoking the base renderer.
 put('chapter_'+id,chapterIndex(story));
 put('last_story',id);
 originalOpenStory(id);
};
library=function(){
 originalLibrary();
 const section=document.querySelector('.library');
 if(!section)return;
 const last=storyById(get('last_story',''));
 const chapter=last?chapterIndex(last):0;
 const hero=document.createElement('section');
 hero.className='storylens-hero';
 hero.setAttribute('aria-label',uiText('المكتبة والعودة للقراءة','Library and continue reading'));
 hero.innerHTML='<div class="hero-content"><div class="hero-eyebrow">LINGUA TALES · IMMERSIVE READING</div>'+
  '<h2>Lose yourself in a good story.</h2>'+
  '<p>قصص ناضجة، أسرار تستحق الاكتشاف، وإنجليزي تتعلمه من الأحداث نفسها.</p>'+
  '<div class="hero-metrics"><span>'+catalog.stories.length+' STORIES</span><span>'+catalog.genres.length+' GENRES</span><span>100% OFFLINE</span></div>'+
  (last?'<button class="hero-continue" type="button" onclick="openStory(\''+escapeText(last.id)+'\')">'+uiText('تابع: ','Continue: ')+escapeText(last.title)+' · '+(chapter+1)+' / '+last.chapters.length+uiText(' ←',' →')+'</button>':
   '<div class="hero-invitation">'+uiText('اختر عالمك التالي من المكتبة بالأسفل ↓','Choose a story from the library below ↓')+'</div>')+'</div>'+
  '<div class="hero-orb" aria-hidden="true"><div class="hero-orb-core"></div></div>';
 const filters=section.querySelector('.filters');
 section.insertBefore(hero,section.querySelector('.search-label'));
 const header=section.querySelector('.header');
 if(header)header.classList.add('storylens-header');
 for(const button of section.querySelectorAll('.filters .pill')){
  const onclick=button.getAttribute('onclick')||'';
  const id=(onclick.match(/filterGenre\('([^']+)'\)/)||[])[1];
  if(!id||id==='all')continue;
  const count=catalog.stories.filter(s=>s.genre===id).length;
  button.insertAdjacentHTML('beforeend',' <span class="genre-count">'+count+'</span>');
 }
 section.querySelectorAll('.card').forEach(card=>{
  const id=(card.getAttribute('onclick')||'').match(/openStory\('([^']+)'\)/)?.[1];
  const story=storyById(id);if(!story)return;
  const ix=chapterIndex(story);
  const hasRead=!!get('has_read_'+id,false)||get('last_story','')===id||ix>0;
  if(hasRead){
   const content=card.querySelector('.card-content');if(!content)return;
   const badge=document.createElement('div');badge.className='story-progress';
   // A serialized classic is not 100% finished after its last published chapter.
   // Use the verified total chapter count, while showing how many are offline now.
   const total=Number.isInteger(story.totalChapters)&&story.totalChapters>=story.chapters.length
    ?story.totalChapters:story.chapters.length;
   const available=story.chapters.length;
   const percent=total>0?Math.round(100*(ix+1)/total):0;
   const label=uiText('الفصل '+(ix+1)+' من '+total+(total>available?' · المتاح '+available:''),
    'Chapter '+(ix+1)+' of '+total+(total>available?' · '+available+' available':''));
   badge.innerHTML='<span>'+label+'</span><div class="story-progress-track"><i style="width:'+percent+'%"></i></div>';
   content.appendChild(badge);
  }
 });
};
renderReader=function(){
 originalReader();
 if(!state.story || state.page!=='reader')return;
 ltApplyFonts();
 // UI language must not change pronunciation of English source paragraphs.
 document.querySelector('.reader h2')?.setAttribute('lang','en');
 document.querySelectorAll('.reader .inline-ar').forEach(node=>node.setAttribute('lang','ar'));
 put('has_read_'+state.story.id,true);
 // LT-08: render only editorially approved, packaged images anchored to a
 // specific paragraph. No remote URLs, HTML injection, or network fallback.
 // An absent inlineArt catalog does nothing to existing books.
 const chapter=state.story.chapters[state.chapter];
 const art=Array.isArray(chapter?.inlineArt)?chapter.inlineArt:[];
 const sentences=Array.from(document.querySelectorAll('.reader .sentence'));
 const usedAnchors=new Set();
 const safeArtPath=/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i;
 // Ignore invalid catalog entries without allowing them to consume the 12-image budget.
 // Bound candidate scanning so a corrupt chapter cannot stall the reader.
 for(const item of art.slice(0,64)){
  if(usedAnchors.size>=12)break;
  if(!item||!Number.isInteger(item.afterParagraph)||item.afterParagraph<0||
     usedAnchors.has(item.afterParagraph)||!safeArtPath.test(item.src||'')||
     typeof item.alt!=='string'||!item.alt.trim()||item.alt.length>240)continue;
  const anchor=sentences.find(node=>Number(node.dataset.i)===item.afterParagraph);
  if(!anchor||typeof anchor.insertAdjacentElement!=='function')continue;
  const position=['wide','edge-start','edge-end'].includes(item.position)?item.position:'wide';
  const figure=document.createElement('figure');
  figure.className='lt-inline-illustration lt-inline-'+position;
  const picture=document.createElement('img');
  picture.src=item.src;picture.alt=item.alt.trim();
  picture.loading='lazy';picture.decoding='async';
  // Reserve editorial image geometry before decode on long chapters. The
  // optional crop/focal data is bounded: invalid metadata cannot break layout.
  if(picture.style && typeof item.aspectRatio==='number' &&
     Number.isFinite(item.aspectRatio) && item.aspectRatio>=0.5 && item.aspectRatio<=3.5){
   picture.style.aspectRatio=String(item.aspectRatio);
  }
  if(picture.style && item.crop==='cover'){
   picture.style.objectFit='cover';
   if(Number.isFinite(item.focalX)&&Number.isFinite(item.focalY)&&
      item.focalX>=0&&item.focalX<=100&&item.focalY>=0&&item.focalY<=100){
    picture.style.objectPosition=item.focalX+'% '+item.focalY+'%';
   }
  }
  // A missing local image must never leave a broken-image icon or an empty
  // figure in the reading flow. No network fallback or remote hotlink.
  picture.onerror=()=>figure.remove?.();
  figure.appendChild(picture);
  if(typeof item.credit==='string'&&item.credit.trim()&&item.credit.length<=160){
   const caption=document.createElement('figcaption');
   caption.textContent=item.credit.trim();
   figure.appendChild(caption);
  }
  anchor.insertAdjacentElement('afterend',figure);
  usedAnchors.add(item.afterParagraph);
 }
 const marks=get(bookmarkKey(),{});
 const current=marks[state.story.id];
 const label=document.querySelector('.reader-label');
 if(label && current && current.chapter===state.chapter) {
  const marker=document.createElement('span');
  marker.className='reader-bookmark-indicator';
  marker.textContent=' · 🔖';
  marker.setAttribute('title',uiText('يوجد علامة محفوظة في هذا الفصل','Bookmark saved in this chapter'));
  label.appendChild(marker);
 }
 document.querySelectorAll('.reader .sentence').forEach(p=>{
  // Capture word taps before the legacy per-tap scan of every phrase. The
  // optimized index preserves longest edited idiom, inflected-word fallback,
  // and the existing source-grounded word sheet/SRS persistence.
  // One lookup path for touch, mouse, keyboard and assistive switches.
  // The exact DOM token offset is still checked against the original English
  // sentence, so keyboard focus cannot resolve an unrelated occurrence.
  const lookupToken=token=>{
   if(!token?.matches?.('.tok') || !window.LinguaLookup ||
      typeof document.createRange!=='function' || typeof wordSheet!=='function')return false;
   const source=state.story.chapters[state.chapter]?.paragraphs?.[Number(p.dataset.i)];
   if(!source)return false;
   const range=document.createRange();
   range.selectNodeContents(p);
   range.setEndBefore(token);
   const hit=window.LinguaLookup.lookup({
    story:state.story,dictionary:catalog.dictionary,sentence:source.en,
    selected:token.textContent,offset:range.toString().length,
    lemmas,lexicon:window.StoryLexicon,freeDict:window.FreeDictEnglishArabic
   });
   if(!hit)return false;
   wordSheet({...hit,source});
   return true;
  };
  p.addEventListener('click',event=>{
   if(lookupToken(event.target))event.stopImmediatePropagation();
  },true);
  // A paragraph is one Tab stop; ArrowRight enters word navigation, and
  // ArrowLeft/Right/Home/End move within it. Avoid hundreds of Tab stops on
  // long chapters, while making the dictionary operable without touch.
  const wordTokens=Array.from(p.querySelectorAll?.('.tok')||[]);
  wordTokens.forEach(token=>{
   token.setAttribute('role','button');
   token.setAttribute('tabindex','-1');
  });
  p.addEventListener('keydown',event=>{
   const current=wordTokens.indexOf(event.target);
   const fromParagraph=event.target===p;
   let target=-1;
   if(fromParagraph&&event.key==='ArrowRight')target=0;
   else if(current>=0){
    if(event.key==='ArrowRight')target=Math.min(wordTokens.length-1,current+1);
    else if(event.key==='ArrowLeft'){
     if(current===0){
      event.preventDefault();event.stopImmediatePropagation();p.focus?.();return;
     }
     target=current-1;
    }else if(event.key==='Home')target=0;
    else if(event.key==='End')target=wordTokens.length-1;
    else if(event.key==='Escape'){
     event.preventDefault();event.stopImmediatePropagation();p.focus?.();return;
    }else if(event.key==='Enter'||event.key===' '){
     event.preventDefault();event.stopImmediatePropagation();
     lookupToken(event.target);return;
    }
   }
   if(target<0||!wordTokens.length)return;
   event.preventDefault();event.stopImmediatePropagation();
   wordTokens.forEach((token,i)=>token.setAttribute('tabindex',i===target?'0':'-1'));
   wordTokens[target].focus?.();
  },true);
  // One chapter-level Tab entry rather than hundreds of Tab stops in a
  // full-length book. Up/Down moves between English paragraphs; the existing
  // Right/Left controls still move among individual words for dictionary lookup.
  p.setAttribute('tabindex',p===sentences[0]?'0':'-1');
  p.addEventListener('focusin',()=>{
   sentences.forEach(node=>node.setAttribute('tabindex',node===p?'0':'-1'));
  });
  p.addEventListener('keydown',event=>{
   if(event.target!==p||!['ArrowUp','ArrowDown'].includes(event.key))return;
   const index=sentences.indexOf(p);
   const next=sentences[index+(event.key==='ArrowDown'?1:-1)];
   if(!next)return; // let the browser handle the boundary naturally
   event.preventDefault();event.stopImmediatePropagation();
   sentences.forEach(node=>node.setAttribute('tabindex',node===next?'0':'-1'));
   next.focus?.();
  },true);
  p.setAttribute('lang','en');
  p.setAttribute('dir','ltr');
  // Preserve the actual English sentence for screen readers: aria-label would
  // replace the sentence with generic instructions and hide its learning text.
  p.setAttribute('aria-description',uiText('انقر كلمة لمعناها، أو اضغط مطولًا أو اضغط Enter أو Space لعرض الترجمة.','Tap a word for its meaning, or long-press, Enter or Space for Arabic translation.'));
  const sentenceIndex=Number(p.dataset.i);
  const source=state.story.chapters[state.chapter]?.paragraphs?.[sentenceIndex];
  const key=revealKey();
  const showTranslation=()=>{
   if(!source||p.nextElementSibling?.classList?.contains('stl-sentence-translation'))return;
   const translation=document.createElement('p');
   translation.className='stl-sentence-translation';
   translation.setAttribute('dir','rtl');
   translation.setAttribute('lang','ar');
   translation.textContent=source.ar;
   p.insertAdjacentElement('afterend',translation);
  };
  const toggleSentenceTranslation=event=>{
   event.preventDefault();
   event.stopImmediatePropagation();
   if(!source)return;
   const old=p.nextElementSibling;
   if(old?.classList?.contains('stl-sentence-translation')){
    old.remove();
    revealedByChapter.get(key)?.delete(sentenceIndex);
    return;
   }
   // Prevent unbounded retained sentence state on very large imported books.
   const shown=revealSet(key);
   if(shown.size>=200)shown.delete(shown.values().next().value);
   shown.add(sentenceIndex);
   showTranslation();
  };
  p.addEventListener('contextmenu',toggleSentenceTranslation,true);
  // A focusable sentence must also be operable without a mouse or long-press.
  // Do not hijack key events from interactive descendants such as word buttons.
  p.addEventListener('keydown',event=>{
   if(event.target!==p||(event.key!=='Enter'&&event.key!==' '))return;
   toggleSentenceTranslation(event);
  });
  if(revealedByChapter.get(key)?.has(sentenceIndex))showTranslation();
 });
 installPageTurn();
};
settings=function(){
 originalSettings();
 const sheet=document.querySelector('#modals .sheet');
 if(!sheet||!state.story)return;
 const marks=get(bookmarkKey(),{});
 const current=marks[state.story.id];
 const bar=document.createElement('section');
 bar.className='reader-nav-panel';
 bar.innerHTML='<h3>'+uiText('أدوات القراءة','Reading tools')+'</h3><div class="reader-nav-actions">'+
 '<button class="secondary" type="button" onclick="stlBookmark()">'+uiText('🔖 احفظ موضعك','🔖 Save bookmark')+'</button>'+
 (current?'<button class="secondary" type="button" onclick="stlJumpBookmark()">'+uiText('↪ ارجع للعلامة','↪ Jump to bookmark')+'</button>':'')+
 '</div><div class="chapter-picker">'+state.story.chapters.map((c,i)=>
 '<button type="button" class="'+(i===state.chapter?'selected':'')+'" onclick="stlChapter('+i+')">'+(i+1)+'. '+escapeText(c.title)+'</button>').join('')+'</div>'+
 '<p class="quiet">'+uiText('اضغط مطولًا على أي جملة لإظهار ترجمتها فقط. الترجمة لا تحتاج اتصالًا بالإنترنت.','Long-press a sentence to reveal its Arabic translation. Works offline.')+'</p>';
 const glassPanel=document.createElement('section');
 glassPanel.className='lt-glass-panel';
 const palette=get('lt_glass_palette','sapphire');
 const tintRaw=Number(get('lt_glass_tint',42));
 const tint=Number.isFinite(tintRaw)?Math.max(0,Math.min(100,tintRaw)):42;
 glassPanel.innerHTML='<h3>'+uiText('ألوان Liquid Glass','Liquid Glass colors')+'</h3>'+
 '<p class="quiet">'+uiText('اختر لونًا متعدد التدرجات مثل واجهة الآيفون، ثم اضبط شفافية الزجاج من الشفاف إلى الملوّن.','Choose an iPhone-inspired multicolor tint, then tune the glass from clear to richly tinted.')+'</p>'+
 '<div class="lt-glass-palette-grid" role="group" aria-label="'+uiText('لوحة الألوان','Color palette')+'">'+ltGlassPalettes.map(item=>'<button type="button" class="lt-glass-swatch" data-lt-palette-choice="'+item.id+'" aria-pressed="'+(item.id===palette)+'" style="--sw-a:'+item.a+';--sw-b:'+item.b+';--sw-c:'+item.c+'">'+uiText(item.ar,item.en)+'</button>').join('')+'</div>'+
 '<div class="lt-glass-slider"><label for="lt-glass-tint"><span>'+uiText('شفافية الزجاج','Glass transparency')+'</span><output id="lt-glass-tint-value">'+tint+'%</output></label><input id="lt-glass-tint" type="range" min="0" max="100" step="1" value="'+tint+'" aria-label="'+uiText('شفافية الزجاج','Glass transparency')+'"><div class="lt-glass-preview" aria-hidden="true"></div></div>'+
 '<label class="lt-glass-check"><input id="lt-glass-reduce" type="checkbox" '+(get('lt_reduce_transparency',false)?'checked':'')+'> '+uiText('تقليل الشفافية لأولوية القراءة','Reduce transparency for readability')+'</label>'+
 '<label class="lt-glass-check"><input id="lt-glass-contrast" type="checkbox" '+(get('lt_high_contrast',false)?'checked':'')+'> '+uiText('تباين أعلى وحدود أوضح','Higher contrast and clearer borders')+'</label>';
 bar.appendChild(glassPanel);
 glassPanel.querySelectorAll('[data-lt-palette-choice]').forEach(button=>button.addEventListener('click',()=>{
  put('lt_glass_palette',button.dataset.ltPaletteChoice);
  glassPanel.querySelectorAll('[data-lt-palette-choice]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  ltApplyGlass();
 }));
 const tintSlider=glassPanel.querySelector('#lt-glass-tint');
 tintSlider?.addEventListener('input',event=>{
  put('lt_glass_tint',Number(event.target.value));
  glassPanel.querySelector('#lt-glass-tint-value').textContent=event.target.value+'%';
  ltApplyGlass();
 });
 glassPanel.querySelector('#lt-glass-reduce')?.addEventListener('change',event=>{put('lt_reduce_transparency',event.target.checked);ltApplyGlass()});
 glassPanel.querySelector('#lt-glass-contrast')?.addEventListener('change',event=>{put('lt_high_contrast',event.target.checked);ltApplyGlass()});
 ltApplyGlass();
 const fontPanel=document.createElement('div');
 fontPanel.className='lt-font-panel';
 const chosen=get('lt_font_choice','system');
 fontPanel.innerHTML='<h3>'+uiText('أنواع الخطوط','Font styles')+'</h3><p class="quiet">'+uiText('اختَر أسلوبًا للنص العربي والإنجليزي. الخيارات تستخدم الخطوط المتاحة على جهازك وتعمل دون إنترنت.','Choose a style for Arabic and English. Options use fonts available on your device and work offline.')+'</p><label class="lt-font-label">'+uiText('الخط','Typeface')+'<select id="lt-font-choice" aria-label="'+uiText('اختيار الخط','Choose font')+'">'+ltFontChoices.map(item=>'<option value="'+item.id+'" '+(item.id===chosen?'selected':'')+'>'+uiText(item.labelAr,item.labelEn)+'</option>').join('')+'</select></label>';
 bar.appendChild(fontPanel);
 const footer=sheet.querySelector('footer');
 if(footer)footer.insertAdjacentElement('beforebegin',bar);else sheet.appendChild(bar);
 const fontSelect=sheet.querySelector('#lt-font-choice');
 fontSelect?.addEventListener('change',event=>{put('lt_font_choice',event.target.value);ltApplyFonts();});

};
window.stlBookmark=function(){
 if(!state.story)return;
 const marks=get(bookmarkKey(),{});
 const pageKey='readpage_'+state.story.id+'_'+state.chapter;
 const currentPage=get(pageKey,0);
 marks[state.story.id]={chapter:state.chapter,scroll:window.scrollY,
  readerPage:Number.isInteger(currentPage)&&currentPage>=0?currentPage:0,
  ...captureParagraphAnchor(),updatedAt:Date.now()};
 put(bookmarkKey(),marks);
 closeSheet();settings();
};
window.stlJumpBookmark=function(){
 if(!state.story)return;
 const mark=get(bookmarkKey(),{})[state.story.id];
 // Backups and old local storage can contain corrupt bookmark values.
 // Never let NaN or a non-integer chapter reach the reader renderer.
 if(!mark||!Number.isInteger(mark.chapter)||mark.chapter<0)return;
 const chapter=Math.min(mark.chapter,state.story.chapters.length-1);
 if(chapter<0)return;
 // Page-turn mode hides non-active pages. Restore the saved page before the
 // reader pipeline renders, so the paragraph anchor is measured in a visible page.
 const savedReaderPage=Number.isInteger(mark.readerPage)&&mark.readerPage>=0
  ?mark.readerPage
  :Number.isInteger(mark.paragraph)&&mark.paragraph>=0
   ?Math.floor(mark.paragraph/LT_PAGE_PARAGRAPHS):null;
 if(savedReaderPage!==null)put('readpage_'+state.story.id+'_'+chapter,savedReaderPage);

 state.chapter=chapter;
 put(chapterKey(),state.chapter);
 closeSheet();state.toolbar=false;
 // Run the currently installed reader pipeline (accessibility, bookmarks and preferences).
 // Calling the captured base renderer here skips every later enhancement wrapper.
 renderReader();
 window.scrollTo(0,bookmarkPosition(mark));
};
window.stlChapter=function(i){
 if(!state.story||!Number.isInteger(i)||i<0||i>=state.story.chapters.length)return;
 snapshot();
 state.chapter=i;
 put(chapterKey(),state.chapter);
 closeSheet();state.toolbar=false;
 // Run the currently installed reader pipeline (accessibility, bookmarks and preferences).
 // Calling the captured base renderer here skips every later enhancement wrapper.
 renderReader();
 const savedScroll=get('scroll_'+state.story.id+'_'+state.chapter,0);
 // Treat imported scroll offsets as untrusted, just like bookmark offsets.
 const safeScroll=typeof savedScroll==='number'&&Number.isFinite(savedScroll)
  ?Math.max(0,Math.min(savedScroll,10000000)):0;
 window.scrollTo(0,safeScroll);
};
theme=function(){snapshot();originalTheme()};
inlineTranslate=function(){snapshot();originalInlineTranslate();document.querySelector('.arabic-page')?.setAttribute('lang','ar');};
library(); // Re-render once after installing enhancements.
})();