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
const ltFontLoadingPairs=new Set();
function ltApplyFonts(){
 const legacy=ltFontChoices.find(item=>item.id===get('lt_font_choice','system'))||ltFontChoices[0];
 const arabic={
  sans:'"LT Arabic Modern","Noto Sans Arabic",Tahoma,sans-serif',
  naskh:'"LT Arabic Naskh","Noto Naskh Arabic",serif',
  ruqaa:'"LT Arabic Ruqaa","Aref Ruqaa",serif',
  kufi:'"LT Arabic Kufi","Noto Kufi Arabic",sans-serif',
  hand:'"LT Arabic Hand","Reem Kufi Ink",cursive'
 };
 const english={
  serif:'"LT English Serif",Georgia,serif',
  sans:'"LT English Sans",system-ui,sans-serif',
  humanist:'"LT English Humanist","Trebuchet MS",sans-serif',
  mono:'"LT English Mono",ui-monospace,monospace',
  hand:'"LT English Hand",cursive'
 };
 const ar=arabic[get('fontArabic','sans')]||legacy.ar;
 const en=english[get('fontEnglish','serif')]||legacy.en;
 document.querySelectorAll('.reader .sentence,.reader .reader-hero,.reader .chapter-end,.reader .inline-ar,.reader .inline-en,.reader .stl-sentence-translation').forEach(node=>{
  const sourceIsArabic=state.story?.sourceLanguage==='ar';
  node.style.fontFamily=(node.matches('.inline-ar')||(sourceIsArabic&&node.matches('.sentence'))||(node.matches('.stl-sentence-translation')&&!sourceIsArabic))?ar:en;
 });
 const rootStyle=document.documentElement?.style;
 if(rootStyle&&typeof rootStyle.setProperty==='function'){
  rootStyle.setProperty('--lt-font-en',en);rootStyle.setProperty('--lt-font-ar',ar);
 }
 // Offline TTF faces may resolve after the first pagination. Reflow exactly
 // once per selected pair, retaining its semantic paragraph anchor.
 const pair=ar+'|'+en;
 if(!ltFontLoadingPairs.has(pair)&&document.fonts?.load){
  ltFontLoadingPairs.add(pair);
  const storyId=state.story?.id,chapter=state.chapter;
  Promise.all([document.fonts.load('20px '+ar.split(',')[0]),
   document.fonts.load('20px '+en.split(',')[0])]).then(()=>{
   if(state.page!=='reader'||state.story?.id!==storyId||state.chapter!==chapter)return;
   const selected=arabic[get('fontArabic','sans')]+'|'+english[get('fontEnglish','serif')];
   if(selected!==pair)return;
   if(typeof window.LinguaReflowReader==='function')
    window.LinguaReflowReader(captureParagraphAnchor());
  }).catch(()=>{}); // existing installed fallbacks remain readable
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
// Keep small phone pages readable instead of forcing four long passages onto
// one oversized sheet. This is a bounded, deterministic layout estimate; each
// authored paragraph, its bilingual translation and illustration remain intact.
function ltPageStarts(lengths,viewportHeight,readerWidth,fontSize,illustrationHeights=[],firstPaperInset=0){
 const height=Number(viewportHeight),width=Number(readerWidth),size=Number(fontSize);
 const vh=Number.isFinite(height)&&height>=320?height:800;
 const rw=Number.isFinite(width)&&width>=220?width:420;
 const px=Number.isFinite(size)&&size>=12&&size<=42?size:20;
 const charactersPerLine=Math.max(16,Math.floor((Math.min(920,rw)-82)/(px*.56)));
 const budget=Math.max(210,Math.min(800,vh*.77)-80);
 const inset=Number(firstPaperInset);
 const firstReserve=Number.isFinite(inset)?Math.max(0,Math.min(budget-60,inset)):0;
 const starts=[];let used=firstReserve,count=0;
 for(let i=0;i<lengths.length;i++){
  const raw=Number(lengths[i]);
  const chars=Number.isFinite(raw)?Math.max(0,Math.min(20000,raw)):0;
  const additional=Number(illustrationHeights[i]);
  const imageCost=Number.isFinite(additional)?Math.max(0,Math.min(320,additional)):0;
  const cost=Math.max(1,Math.ceil(chars/charactersPerLine))*px*1.65+38+imageCost;
  if(count===0||count>=LT_PAGE_PARAGRAPHS||used+cost>budget){
   starts.push(i);used=i===0?firstReserve:0;count=0;
  }
  used+=cost;count++;
 }
 return starts;
}
// Prefer actual laid-out paragraph and illustration heights to character
// estimates. This operates only on one chapter's initially visible DOM; all
// reads are grouped before any page nodes are created or styles modified.
function ltMeasuredParagraphHeights(sentences){
 const heights=[];
 for(const sentence of sentences){
  let node=sentence,total=0,parts=0;
  while(node&&parts<16){
   if(node!==sentence&&node.classList?.contains('sentence'))break;
   const rectangle=node.getBoundingClientRect?.();
   const style=window.getComputedStyle?.(node);
   const height=Number(rectangle?.height);
   if(!Number.isFinite(height)||height<1||!style)return null;
   const top=Number.parseFloat(style.marginTop)||0;
   const bottom=Number.parseFloat(style.marginBottom)||0;
   total+=height+Math.max(0,top)+Math.max(0,bottom);
   parts++;
   node=node.nextElementSibling;
  }
  if(parts===16||!Number.isFinite(total)||total<=0)return null;
  heights.push(total);
 }
 return heights;
}
function ltMeasuredPageStarts(heights,viewportHeight,firstPaperInset=0){
 const vh=Number(viewportHeight);
 const height=Number.isFinite(vh)&&vh>=320?vh:800;
 const budget=Math.max(210,Math.min(800,height*.77)-80);
 const inset=Number(firstPaperInset);
 const firstReserve=Number.isFinite(inset)?Math.max(0,Math.min(budget-60,inset)):0;
 const starts=[];let used=firstReserve,count=0;
 for(let i=0;i<heights.length;i++){
  const raw=Number(heights[i]);
  if(!Number.isFinite(raw)||raw<=0)return null;
  // A single oversized paragraph remains intact and scrollable; never
  // cut bilingual text, dictionary words or an illustration across sheets.
  if(count===0||count>=LT_PAGE_PARAGRAPHS||used+raw>budget){
   starts.push(i);used=i===0?firstReserve:0;count=0;
  }
  used+=raw;count++;
 }
 return starts;
}
function ltPageForParagraph(starts,paragraph){
 const target=Number.isInteger(paragraph)&&paragraph>=0?paragraph:0;
 let found=0;
 for(let i=1;i<starts.length;i++){
  if(starts[i]>target)break;
  found=i;
 }
 return found;
}
// Do not let page gestures steal taps, text selection, or accessibility controls.
function pageSwipeAllowed(target,selectionText=''){
 if(typeof selectionText==='string'&&selectionText.trim())return false;
 const element=target?.nodeType===1?target:target?.parentElement;
 if(!element||typeof element.closest!=='function')return true;
 return !element.closest('button,a,input,textarea,select,summary,[role="button"],[contenteditable="true"]');
}
// A dictionary word at the paper's edge is still ink on the page. Start a
// potential hold there without consuming an ordinary tap: pointer capture
// begins only after a real horizontal drag is established.
function pageFoldStartAllowed(target,selectionText=''){
 if(typeof selectionText==='string'&&selectionText.trim())return false;
 if(pageSwipeAllowed(target,selectionText))return true;
 const element=target?.nodeType===1?target:target?.parentElement;
 if(!element?.closest?.('.tok'))return false;
 return !element.closest('button,a,input,textarea,select,summary,[contenteditable="true"]');
}
function pageSwipeGestureAllowed(startTarget,endTarget,selectionText=''){
 return pageSwipeAllowed(startTarget,selectionText)&&pageSwipeAllowed(endTarget,selectionText);
}
// A held page may be dragged over ordinary story words, which are themselves
// dictionary buttons. Allow that landing surface, but never steal an active
// selection or release onto a toolbar/control outside the reading text.
function pageFoldReleaseAllowed(startTarget,endTarget,selectionText=''){
 if(!endTarget||!pageFoldStartAllowed(startTarget,selectionText))return false;
 if(typeof selectionText==='string'&&selectionText.trim())return false;
 const element=endTarget.nodeType===1?endTarget:endTarget.parentElement;
 if(element?.closest?.('.tok'))return true;
 return pageSwipeAllowed(endTarget,selectionText);
}
// The book binding follows the interface direction. The fallback touch swipe
// already does this; pointer-held paper must agree with it in Arabic UI.
function pageEdgeDelta(edge,rtl){return (edge==='right')!==rtl?1:-1;}
// Tablet/keyboard navigation mirrors the real book binding, never a swipe on
// the ink or a dictionary token. Keep the mapping pure for regression tests.
function pageKeyboardDelta(key,rtl){
 if(key==='PageDown')return 1;
 if(key==='PageUp')return -1;
 if(key===(rtl?'ArrowLeft':'ArrowRight'))return 1;
 if(key===(rtl?'ArrowRight':'ArrowLeft'))return -1;
 return 0;
}
// A page bends at its crease: only the moving edge is uncovered. Keep the
// geometry pure so LTR/RTL and slow finger movement can be regression-tested.
function pageFoldGeometry(progress,edge,vertical){
 const input=Number(progress),pull=Number(vertical);
 const amount=Number.isFinite(input)?Math.max(0,Math.min(1,input)):0;
 const verticalShift=Number.isFinite(pull)?Math.max(-1,Math.min(1,pull/170)):0;
 const cut=(amount*48).toFixed(2)+'%';
 const tilt=Math.max(-7,Math.min(7,(Number.isFinite(pull)?pull:0)/22))*(edge==='right'?-1:1);
 // A bounded nine-segment silhouette approaches a continuous curved fold:
 // corners, two outer arcs, shoulders, two inner arcs and an inward belly.
 // Height asymmetry follows the held finger. One CSS polygon is updated per
 // requestAnimationFrame; this does NOT yet fake a fully textured 3D mesh.
 const arch=6.2*amount*(1-.16*amount);
 const top=(arch*(1-.55*verticalShift)).toFixed(2)+'%';
 const bottom=(arch*(1+.55*verticalShift)).toFixed(2)+'%';
 const belly=(arch*.83).toFixed(2)+'%';
 const shoulder=(arch*.18).toFixed(2)+'%';
 const eighthTop=(arch*(.65-.30*verticalShift)).toFixed(2)+'%';
 const eighthBottom=(arch*(.65+.30*verticalShift)).toFixed(2)+'%';
 const quarterTop=(arch*(.40-.22*verticalShift)).toFixed(2)+'%';
 const quarterBottom=(arch*(.40+.22*verticalShift)).toFixed(2)+'%';
 const rotation=((edge==='right'?-1:1)*(12+28*amount)).toFixed(2)+'deg';
 const shadow=(.13+.28*amount).toFixed(2);
 return {cut,flap:cut,skew:tilt.toFixed(2)+'deg',top,bottom,belly,shoulder,
  eighthTop,eighthBottom,quarterTop,quarterBottom,rotation,shadow};
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
 const spread=window.LinguaPageCurl&&window.innerWidth>=700&&window.innerWidth>window.innerHeight?2:1;
 const bindingRtl=state.story?.sourceLanguage==='ar';
 if(window.LinguaPageCurl){
  sentenceBox.classList.add('lt-curl-book');sentenceBox.dataset.spread=String(spread);
  // Measure at final sheet width, before moving the original interactive nodes.
  sentenceBox.style.display='block';
  sentenceBox.style.width=(100/spread)+'%';
 }
 const chapterEnd=width.querySelector('.chapter-end');
 if(chapterEnd)chapterEnd.hidden=true;
 // An actual book's chapter heading and number belong on its FIRST paper,
 // not in a fixed slab above every turning page. Reserve their real measured
 // height before reparenting; do not clone or split editable dictionary text.
 const heading=width.querySelector(':scope > h2');
 const caption=width.querySelector(':scope > .reader-label');
 const headingHeight=heading?.getBoundingClientRect?.().height||0;
 const captionHeight=caption?.getBoundingClientRect?.().height||0;
 const firstPaperInset=heading?Math.max(0,headingHeight)+Math.max(0,captionHeight)+48:0;
 const originalNodes=Array.from(sentenceBox.childNodes);
 const pages=[];
 const bounds=width.getBoundingClientRect?.();
 // Use the actual post-theme English font size. The legacy 'size' preference
 // does not reflect the independent compact/comfortable/large reader profiles.
 const computedSize=Number.parseFloat(window.getComputedStyle?.(sentences[0])?.fontSize||'');
 const preferredSize={compact:17,comfortable:19,large:22}[get('readingSizeEnglish','comfortable')]||Number(get('size',20));
 // Keep the figure on the same paper as its source paragraph. Reserve
 // enough space to prevent image-heavy pages from overrunning the sheet.
 const illustrationHeights=sentences.map(node=>{
  const after=node.nextElementSibling;
  const adjacent=(after?.classList?.contains('inline-ar')||after?.classList?.contains('inline-en'))?after.nextElementSibling:after;
  return adjacent?.classList?.contains('lt-inline-illustration')
   ?Math.min(260,Math.max(140,window.innerHeight*.26)):0;
 });
 const paragraphLengths=sentences.map(node=>{
  const translated=node.nextElementSibling;
  const companion=(translated?.classList?.contains('inline-ar')||translated?.classList?.contains('inline-en'))?(translated.textContent||'').length:0;
  return (node.textContent||'').length+companion;
 });
 // Prefer real text metrics after the final fonts, translations and scene
 // figures have entered the DOM. Fall back to safe length estimates in
 // partial/older WebViews that cannot measure laid-out content.
 const measured=ltMeasuredParagraphHeights(sentences);
 const starts=(measured&&ltMeasuredPageStarts(measured,window.innerHeight,firstPaperInset))||
  ltPageStarts(paragraphLengths,window.innerHeight,bounds?.width||window.innerWidth,
   Number.isFinite(computedSize)?computedSize:preferredSize,illustrationHeights,firstPaperInset);
 const boundaries=new Set(starts);
 let page=null,paragraph=0;
 for(const node of originalNodes){
  if(node.nodeType===1&&node.classList.contains('sentence')){
   // Leading illustrations or decorative nodes belong on the first paper.
   if(!page||(paragraph>0&&boundaries.has(paragraph))){
    page=document.createElement('section');
    page.className='lt-book-page';
    page.setAttribute('role','group');
    pages.push(page);
   }
   paragraph++;
  }
  if(!page){page=document.createElement('section');page.className='lt-book-page';page.setAttribute('role','group');pages.push(page)}
  page.appendChild(node);
 }
 // Keep all chapter metadata inside the paper that actually folds. The
 // semantic heading remains the same original DOM node for focus/Back/AT.
 if(pages.length&&heading){
  heading.classList.add('lt-chapter-paper-heading');
  if(caption){caption.classList.add('lt-chapter-paper-caption');pages[0].prepend(caption,heading);}
  else pages[0].prepend(heading);
 }
 sentenceBox.replaceChildren(...pages);
 if(window.LinguaPageCurl){sentenceBox.style.removeProperty('display');sentenceBox.style.removeProperty('width');}
 const pageControls=document.createElement('nav');
 pageControls.className='lt-page-controls';
 pageControls.setAttribute('aria-label',uiText('التنقل بين صفحات القصة','Story page navigation'));
 pageControls.innerHTML='<button type="button" class="secondary lt-page-prev">'+uiText('السابق','Previous')+'</button><span class="lt-page-count" aria-live="polite" aria-atomic="true"></span><button type="button" class="primary lt-page-next">'+uiText('الصفحة التالية','Next page')+'</button>';
 sentenceBox.insertAdjacentElement('afterend',pageControls);
 const key='readpage_'+state.story.id+'_'+state.chapter;
 const anchorKey='readpage_anchor_'+state.story.id+'_'+state.chapter;
 const initial=Number(get(key,0));
 // Old backups only had a page number (four paragraphs per page); new
 // backups retain the first paragraph so changing font/phone width cannot
 // skip, duplicate or reset progress.
 const savedAnchor=Number(get(anchorKey,-1));
 const legacyParagraph=Number.isInteger(initial)&&initial>=0
  ?initial*LT_PAGE_PARAGRAPHS:0;
 const firstParagraph=Number.isInteger(savedAnchor)&&savedAnchor>=0&&
  savedAnchor<sentences.length?savedAnchor:legacyParagraph;
 let current=ltPageForParagraph(starts,firstParagraph);
 current=Math.floor(current/spread)*spread;
 let curl=null;
 const prev=pageControls.querySelector('.lt-page-prev');
 const next=pageControls.querySelector('.lt-page-next');
 const countLabel=pageControls.querySelector('.lt-page-count');
 function renderPage(direction,animate){
  current=Math.max(0,Math.min(pages.length-1,current));
  // Preserve the authentic source-art hero on the first spread. Only after
  // turning past the opening page should landscape enter chrome-free reading.
  // Earlier hiding the hero unconditionally failed the historical art ratio QA.
  if(sentenceBox?.dataset)sentenceBox.dataset.ltReadingStarted=String(spread===2&&current>0);
  pages.forEach((item,index)=>{
   const visible=index>=current&&index<current+spread;
   item.classList.toggle('is-active',visible);
   item.style.setProperty('--lt-page-column',String(bindingRtl?spread-(index-current):index-current+1));
   item.setAttribute('aria-label',pageGroupLabel(index,pages.length));
   item.setAttribute('aria-roledescription',uiText('صفحة من القصة','story page'));
   item.setAttribute('aria-hidden',visible?'false':'true');
   item.inert=!visible;
  });
  prev.disabled=current===0&&state.chapter===0;
  next.textContent=current+spread>=pages.length
   ?(state.chapter<state.story.chapters.length-1?uiText('الفصل التالي','Next chapter'):uiText('العودة للمكتبة','Back to library'))
   :uiText('الصفحة التالية','Next page');
  countLabel.textContent=spread===2
   ?uiText('الصفحتان '+(current+1)+'–'+Math.min(current+spread,pages.length)+' من '+pages.length,
     'Pages '+(current+1)+'–'+Math.min(current+spread,pages.length)+' of '+pages.length)
   :uiText('الصفحة '+(current+1)+' من '+pages.length,'Page '+(current+1)+' of '+pages.length);
  put(key,current);
  put(anchorKey,starts[current]||0);
  if(chapterEnd)chapterEnd.hidden=current+spread<pages.length;
  if(animate&&!window.LinguaPageCurl&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
   animatePageTurn(pages[current],direction);
  }
  // Show the new paper after a turn, rather than scrolling back to the cover
  // and chapter illustration. Never race smooth-scroll against sheet animation
  // on high-refresh-rate devices. A new chapter still opens at its artwork.
  if(animate&&typeof sentenceBox.scrollIntoView==='function'){
   sentenceBox.scrollIntoView({block:'start',behavior:'auto'});
  }else{
   window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
 }
 // Synchronize the already-packaged, licensed page-turn recording with
 // an ACTUAL committed page change (button, swipe or held-paper release).
 // No autoplay, no sound on cancelled drags, no overlapping fast taps.
 let ltLastPaperSfxAt=-Infinity;
 function ltPlayPageTurnSfx(){
  try{
   const player=window.LinguaLicensedAudio;
   if(!player||typeof player.playSfx!=='function'||
      typeof player.prefs!=='function'||player.prefs().sfxEnabled!==true)return false;
   const now=Date.now();
   if(now-ltLastPaperSfxAt<280)return false;
   ltLastPaperSfxAt=now;
   const playback=player.playSfx('page-turn');
   playback?.catch?.(()=>{}); // Android decoder failures remain non-fatal to reading
   return true;
  }catch(_){return false;}
 }
 function move(delta,source='control'){
  if(delta>0&&current+spread>=pages.length){
   if(state.chapter<state.story.chapters.length-1){ltPlayPageTurnSfx();nextChapter();}
   // A casual edge swipe at The End must not discard the reading view.
   // The explicit chapter-end and keyboard-accessible Back buttons still exit.
   else if(source==='control')libraryBack();
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
   put('readpage_anchor_'+state.story.id+'_'+previous,Math.max(0,length-1));
   ltPlayPageTurnSfx();renderReader();window.scrollTo(0,0);
   return;
  }
  delta*=spread;
  current+=delta;ltPlayPageTurnSfx();renderPage(delta>0?'next':'back',true);
 }
 function requestMove(delta,source='control'){
  if(curl){
   if(!curl.turn(delta,source)&&source==='control'&&delta>0&&current+spread>=pages.length&&state.chapter===state.story.chapters.length-1)libraryBack();
  }else move(delta,source);
 }
 prev.addEventListener('click',()=>requestMove(-1));
 next.addEventListener('click',()=>requestMove(1));
 // Focus the PAPER, not its tokens. Bluetooth keyboards on tablets can turn
 // pages using arrows/PageUp/PageDown without overriding word selection,
 // search inputs, modal shortcuts or actual click handlers.
 sentenceBox.setAttribute('tabindex','0');
 sentenceBox.setAttribute('aria-keyshortcuts','PageDown PageUp ArrowLeft ArrowRight');
 sentenceBox.addEventListener('keydown',event=>{
  if(event.target!==sentenceBox||event.defaultPrevented||event.repeat||
     event.isComposing||event.altKey||event.ctrlKey||event.metaKey||
     event.shiftKey||window.getSelection?.()?.toString()?.trim())return;
  const delta=pageKeyboardDelta(event.key,bindingRtl);
  if(!delta)return;
  event.preventDefault();
  // 'keyboard' never exits the book on its final page; only the explicit
  // Back-to-library button may do so. All progress persistence stays in move().
  requestMove(delta,'keyboard');
 });
 // The engine owns gestures and animations when available. The legacy path
 // below is only a compatibility fallback; never install both sets of handlers.
 if(window.LinguaPageCurl){
  const curlStory=state.story,curlChapter=state.chapter;
  let boundaryPreview=null;
  function boundaryPage(delta){
   boundaryPreview?.remove();
   const chapter=state.story.chapters[state.chapter+delta];
   if(!chapter)return null;
   const preview=document.createElement('section');preview.className='lt-book-page';
   preview.inert=true;preview.setAttribute('aria-hidden','true');
   const from=delta>0?0:Math.max(0,chapter.paragraphs.length-1);
   // Bounded preview from real source, never a fabricated or full-novel snapshot.
   for(const paragraph of chapter.paragraphs.slice(from,from+1)){
    const p=document.createElement('p');p.className='sentence';
    p.dir=bindingRtl?'rtl':'ltr';p.lang=bindingRtl?'ar':'en';
    p.textContent=bindingRtl?paragraph.ar:paragraph.en;preview.appendChild(p);
   }
   sentenceBox.appendChild(preview);boundaryPreview=preview;return preview;
  }
  curl=window.LinguaPageCurl.mount({host:sentenceBox,rtl:bindingRtl,
   allowed:target=>pageFoldStartAllowed(target,window.getSelection?.()?.toString()||''),
   getTurn(delta){
    const target=current+delta*spread;
    const boundary=target<0||target>=pages.length;
    if(boundary&&!state.story.chapters[state.chapter+delta])return null;
    const moving=delta>0?Math.min(current+spread-1,pages.length-1):current;
    // In a single-sheet view the next page is already the exposed UNDER-page.
    // Rendering that SAME ink again on the flap's rear caused the doubled text
    // observed on Android. A blank reverse is safer than counterfeit ink.
    // Facing spreads retain a different real reverse where it is available.
    const under=boundary?boundaryPage(delta):
     pages[target+(delta>0?Math.min(spread-1,pages.length-1-target):0)];
    const candidateBack=boundary?null:pages[target+(spread===2&&delta<0?1:0)];
    return {page:pages[moving],under,
     back:candidateBack===under?null:candidateBack,
     info:{storyId:curlStory.id,chapter:curlChapter,fromPage:current,toPage:boundary?null:target,spread}};
   },
   commit(delta,source){
    if(state.page!=='reader'||state.story!==curlStory||state.chapter!==curlChapter||!sentenceBox.isConnected)return false;
    move(delta,source);boundaryPreview?.remove();boundaryPreview=null;return true;
   }
  });
  sentenceBox.addEventListener('lingua:turncancel',()=>{boundaryPreview?.remove();boundaryPreview=null;});
  // Public bridge for native Back and immersive shell integration.
  window.LinguaReaderCurl=curl;
  if(spread===2){
   // Quiet landscape: no permanent navigation strip over the paper. Tapping
   // blank parchment reveals the same real controls; word taps, illustrations
   // and active paper-fold gestures retain their original semantics.
   let controlsTimer=null;
   function revealPageControls(){
    reader.classList.add('lt-reader-controls-visible');
    if(controlsTimer!==null)window.clearTimeout(controlsTimer);
    controlsTimer=window.setTimeout(()=>{
     if(!pageControls.contains(document.activeElement)){
      reader.classList.remove('lt-reader-controls-visible');
     }
     controlsTimer=null;
    },3500);
   }
   sentenceBox.addEventListener('click',event=>{
    const target=event.target;
    if(target?.closest?.('.sentence,.tok,button,a,input,textarea,.lt-inline-illustration'))return;
    revealPageControls();
   });
   pageControls.addEventListener('focusin',revealPageControls);
  }
  renderPage('next',false);return;
 }
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
  // A touch can end on a completely different part of the screen. Do not
  // fall back to event.target when hit-testing returns null: touchend's
  // target often remains the *original* sheet despite an off-sheet release.
  const endTarget=typeof document.elementFromPoint==='function'
   ?document.elementFromPoint(event.changedTouches[0].clientX,event.changedTouches[0].clientY)
   :event.target;
  const allowed=!!endTarget&&sentenceBox.contains(endTarget)&&
   pageSwipeGestureAllowed(startTarget,endTarget,selected);
  resetTouch();
  if(!allowed||Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.25)return;
  const rtl=document.documentElement.dir==='rtl';
  move((rtl?dx>0:dx<0)?1:-1,'gesture');
 },{passive:true});
 sentenceBox.addEventListener('touchcancel',resetTouch,{passive:true});
 // Physical edge-hold interaction: keep a live fold aligned to the user's
 // finger, commit only after crossing the middle, spring back on release.
 // Do not steal vertical scrolling, text selection or dictionary word taps.
 const installedStory=state.story,installedChapter=state.chapter;
 let drag=null,foldRaf=null,reverseSheet=null;
 // A reverse face is built once per fold, never per animation frame. Copy
 // only bounded plain ink, not DOM buttons/ids or dictionary event handlers.
 // It remains inert and hidden from assistive technology throughout the hold.
 function showReverseFace(active){
  if(reverseSheet||typeof document.createElement!=='function'||!active?.querySelectorAll)return;
  const face=document.createElement('div');
  face.className='lt-paper-reverse';
  face.setAttribute('aria-hidden','true');
  face.inert=true;
  const ink=document.createElement('div');
  ink.className='lt-paper-reverse-ink';
  // Do not force Latin bidi direction onto Arabic source text. The back is
  // inert ink (NOT cloned interactive tokens), and each line determines its
  // direction from the original characters without reversing word order.
  const paragraphs=active.querySelectorAll('.sentence');
  for(const source of Array.from(paragraphs).slice(0,4)){
   const line=document.createElement('p');
   line.setAttribute('dir','auto');
   line.textContent=String(source.textContent||'').slice(0,420);
   ink.appendChild(line);
  }
  face.appendChild(ink);
  sentenceBox.appendChild(face);
  reverseSheet=face;
 }

 // A cancelled edge hold springs toward the paper's original edge, while
 // actual pages, translations and word controls are restored immediately.
 // The afterimage is inert and owned by its own one-shot timeout; an old
 // animation can never remove a newer fold or page.
 function recoilPaper(held,completed=false){
  if(!held.locked||held.progress<.06||
     !sentenceBox.classList.contains('lt-paper-grabbing')||
     sentenceBox.isConnected===false||
     window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||
     typeof document.createElement!=='function')return;
  const echo=document.createElement('div');
  if(!echo?.style?.setProperty)return;
  const g=pageFoldGeometry(held.progress,held.edge,held.lastY-held.startY);
  echo.className=completed?'lt-paper-complete':'lt-paper-snapback';
  echo.setAttribute('data-lt-edge',held.edge);
  echo.setAttribute('aria-hidden','true');
  echo.inert=true;
  echo.style.setProperty('--lt-snap-cut',g.cut);
  echo.style.setProperty('--lt-snap-width',g.flap);
  echo.style.setProperty('--lt-snap-skew',g.skew);
  echo.style.setProperty('--lt-snap-rotation',g.rotation);
  sentenceBox.appendChild(echo);
  let timeout=null;
  const remove=()=>{
   if(timeout!==null)window.clearTimeout?.(timeout);
   echo.remove?.();
  };
  echo.addEventListener?.('animationend',remove,{once:true});
  timeout=window.setTimeout?.(remove,360)??null;
 }

 function clearFold(){
  if(reverseSheet){reverseSheet.remove?.();reverseSheet=null;}
  if(foldRaf!==null){window.cancelAnimationFrame?.(foldRaf);foldRaf=null;}
  sentenceBox.classList.remove('lt-paper-grabbing');
  delete sentenceBox.dataset.ltFoldEdge;
  for(const name of ['--lt-fold-cut','--lt-flap-width','--lt-flap-skew',
   '--lt-curl-top','--lt-curl-bottom','--lt-curl-belly','--lt-curl-shoulder',
   '--lt-curl-eighth-top','--lt-curl-eighth-bottom',
   '--lt-curl-quarter-top','--lt-curl-quarter-bottom',
   '--lt-flap-rotation','--lt-fold-shadow'])
   sentenceBox.style.removeProperty(name);
  // A page can change while a fold is held (keyboard, chapter controls,
  // accessibility navigation). Clean the originally folded sheet too.
  pages.forEach(item=>{
   item.classList.remove('lt-paper-underlay','lt-paper-grabbed');
   item.style.removeProperty('--lt-fold-left');
   item.style.removeProperty('--lt-fold-right');
  });
 }
 function previewFold(){
  foldRaf=null;
  // A queued animation frame can run after the chapter was replaced. It must
  // never paint a detached sheet or a fold belonging to another book.
  if(!drag)return;
  if(state.page!=='reader'||state.story!==installedStory||
     state.chapter!==installedChapter||sentenceBox.isConnected===false||
     window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
   finishPaperDrag(false);return;
  }
  const active=pages[current];
  // The frame can arrive after a separate page navigation within this chapter.
  // A fold is valid only for the page that received pointerdown.
  if(current!==drag.page){finishPaperDrag(false);return;}
  const geometry=pageFoldGeometry(drag.progress,drag.edge,drag.lastY-drag.startY);
  showReverseFace(active);
  const underneath=pages[current+pageEdgeDelta(drag.edge,document.documentElement.dir==='rtl')];
  // The neighboring page is visually revealed but remains inert and hidden
  // from assistive technology until the turn is actually committed.
  underneath?.classList.add('lt-paper-underlay');
  sentenceBox.classList.add('lt-paper-grabbing');
  sentenceBox.dataset.ltFoldEdge=drag.edge;
  sentenceBox.style.setProperty('--lt-fold-cut',geometry.cut);
  sentenceBox.style.setProperty('--lt-flap-width',geometry.flap);
  sentenceBox.style.setProperty('--lt-flap-skew',geometry.skew);
  sentenceBox.style.setProperty('--lt-curl-top',geometry.top);
  sentenceBox.style.setProperty('--lt-curl-bottom',geometry.bottom);
  sentenceBox.style.setProperty('--lt-curl-belly',geometry.belly);
  sentenceBox.style.setProperty('--lt-curl-shoulder',geometry.shoulder);
  sentenceBox.style.setProperty('--lt-curl-eighth-top',geometry.eighthTop);
  sentenceBox.style.setProperty('--lt-curl-eighth-bottom',geometry.eighthBottom);
  sentenceBox.style.setProperty('--lt-curl-quarter-top',geometry.quarterTop);
  sentenceBox.style.setProperty('--lt-curl-quarter-bottom',geometry.quarterBottom);
  sentenceBox.style.setProperty('--lt-flap-rotation',geometry.rotation);
  sentenceBox.style.setProperty('--lt-fold-shadow',geometry.shadow);
  active.classList.add('lt-paper-grabbed');
  active.style.setProperty('--lt-fold-left',drag.edge==='left'?geometry.cut:'0%');
  active.style.setProperty('--lt-fold-right',drag.edge==='right'?geometry.cut:'0%');
 }
 function finishPaperDrag(commit,event){
  if(!drag)return;
  const held=drag;
  const delta=pageEdgeDelta(held.edge,document.documentElement.dir==='rtl');
  // Pointer capture retargets pointerup to the page container. Hit-test the
  // actual release coordinates so releasing over a word/control, outside the
  // viewport, or after selecting text cannot unexpectedly turn the page.
  const endTarget=commit&&Number.isFinite(event?.clientX)&&Number.isFinite(event?.clientY)
   ?(typeof document.elementFromPoint==='function'
     ?document.elementFromPoint(event.clientX,event.clientY):event.target)
   :null;
  // A captured pointerup can land on an unrelated page element within the
  // viewport. Never turn the paper unless the finger actually ends on this
  // reader sheet; this also rejects dictionary tokens in other overlays.
  const stillCurrent=state.page==='reader'&&state.story===installedStory&&
   state.chapter===installedChapter&&sentenceBox.isConnected!==false&&current===held.page;
  // A touch that was dragged backward toward its starting edge should not
  // commit a turn merely because it crossed the threshold earlier.
  const releasePull=commit
   ?(held.edge==='right'?held.startX-event.clientX:event.clientX-held.startX)
   :0;
  const turn=commit&&stillCurrent&&held.progress>=.34&&releasePull>=Math.max(35,held.width*.16)&&!!endTarget&&
   sentenceBox.contains(endTarget)&&
   pageFoldReleaseAllowed(held.target,endTarget,window.getSelection?.()?.toString()||'');
  // Keep a non-interactive crease for the final few frames of a successful
  // turn, or spring it back when the reader cancels. The incoming page is
  // immediately usable; the afterimage never captures pointer events.
  if(turn||(stillCurrent&&!(window.getSelection?.()?.toString()||'').trim())){
   recoilPaper(held,turn);
  }
  drag=null;clearFold();
  try{sentenceBox.releasePointerCapture?.(held.id);}catch(_){}
  if(turn)move(delta,'gesture');
 }
 sentenceBox.addEventListener('pointerdown',event=>{
  // A second contact invalidates a one-finger paper hold immediately.
  // Some Android WebViews do not dispatch pointercancel for the first finger.
  if(drag&&event.pointerId!==drag.id){finishPaperDrag(false);return;}
  if(event.isPrimary===false||event.button!==0||drag||state.page!=='reader'||
     state.story!==installedStory||state.chapter!==installedChapter||
     sentenceBox.isConnected===false)return;
  if(!pageFoldStartAllowed(event.target,window.getSelection?.()?.toString()||''))return;
  const box=sentenceBox.getBoundingClientRect();
  const x=event.clientX-box.left;
  // When the reading pane is narrow, the two 66px edge zones overlap.
  // Resolve the gesture to the physically nearer edge instead of always right.
  const edge=x<0||x>box.width?null:
   x<=66&&x<=box.width-x?'left':
   box.width-x<=66?'right':null;
  const delta=edge?pageEdgeDelta(edge,document.documentElement.dir==='rtl'):0;
  if(!edge||(delta<0&&current===0&&state.chapter===0)||
     (delta>0&&current===pages.length-1&&state.chapter===state.story.chapters.length-1))return;
  drag={id:event.pointerId,edge,target:event.target,startX:event.clientX,startY:event.clientY,
   width:Math.max(1,box.width),progress:0,locked:false,lastY:event.clientY,page:current};
  // Capturing on pointerdown would retarget a normal dictionary click to the
  // book container on some WebViews. Keep the tap untouched until drag lock.
 },{passive:true});
 sentenceBox.addEventListener('pointermove',event=>{
  if(!drag||event.pointerId!==drag.id)return;
  // A page or chapter may be changed by keyboard/buttons during a held
  // gesture. Tear down immediately instead of waiting for pointerup.
  if(state.page!=='reader'||state.story!==installedStory||
     state.chapter!==installedChapter||sentenceBox.isConnected===false||
     current!==drag.page){finishPaperDrag(false);return;}
  const horizontal=drag.edge==='right'?drag.startX-event.clientX:event.clientX-drag.startX;
  const dy=event.clientY-drag.startY;
  if(!drag.locked){
   if(Math.abs(dy)>15&&Math.abs(dy)>Math.abs(horizontal)*1.1){finishPaperDrag(false);return;}
   if(horizontal<9)return;
   drag.locked=true;
   try{sentenceBox.setPointerCapture?.(event.pointerId);}catch(_){}
  }
  drag.progress=Math.max(0,Math.min(1,horizontal/Math.max(115,drag.width*.68)));
  drag.lastY=event.clientY;
  // Paint the first locked fold immediately. A suspended WebView animation
  // frame must not show flat paper while the user's finger is already dragging.
  // Subsequent frames remain requestAnimationFrame-coalesced.
  if(!drag.firstPaint){drag.firstPaint=true;previewFold();}
  if(foldRaf===null){
   if(typeof window.requestAnimationFrame==='function')foldRaf=window.requestAnimationFrame(previewFold);
   else previewFold();
  }
  if(event.cancelable)event.preventDefault();
 },{passive:false});
 // Before pointer capture is established, leaving the sheet can otherwise
 // strand an inactive hold and reject all subsequent gestures until a lost up.
 // After capture, leaving the bounds is expected: keep the held fold alive.
 sentenceBox.addEventListener('pointerleave',event=>{
  if(drag&&!drag.locked&&event.pointerId===drag.id)finishPaperDrag(false);
 });
 sentenceBox.addEventListener('pointerup',event=>{
  if(drag&&event.pointerId===drag.id)finishPaperDrag(true,event);
 });
 // A secondary finger can be cancelled while the primary edge-hold remains active.
 // Only the pointer that owns the fold may end it.
 sentenceBox.addEventListener('pointercancel',event=>{
  if(drag&&event.pointerId===drag.id)finishPaperDrag(false);
 });
 sentenceBox.addEventListener('lostpointercapture',event=>{
  if(drag&&event.pointerId===drag.id)finishPaperDrag(false);
 });
 renderPage('next',false);
}
const chapterKey=()=> 'chapter_'+state.story.id;
const bookmarkKey=()=> 'bookmarks';
// Semantic paragraph anchors survive font, theme and tablet-width changes;
// retain legacy pixel scroll for old backups and readers without DOM geometry.
function captureParagraphAnchor(){
 const viewport=Number.isFinite(window.innerHeight)?window.innerHeight:800;
 for(const node of document.querySelectorAll('.reader .sentence')){
  if(node.closest?.('[aria-hidden="true"],.lt-curl-stage'))continue;
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
// The existing offline editorial registry is chapter-specific, yet the old
// reader showed its scene only in the hero/cover. Bring it into the prose.
// Explicit approved image placements remain authoritative. Never hotlink.
// UX04: inspect a genuine locally packaged engraving at native phone width.
// Never open a remote URL, render untrusted HTML or attach a scroll listener.
// The overlay is created on demand (one image), not for each long-book page.
let ltCloseActiveArtInspection=null;
// Android's hardware/gesture Back must dismiss a full-screen historical
// plate BEFORE closing a word sheet, opening the shelf or leaving the app.
// Returning true also tells the host to consume only this one Back event.
window.LinguaTalesArtInspection=Object.freeze({
 closeIfOpen(){
  if(typeof ltCloseActiveArtInspection!=='function')return false;
  ltCloseActiveArtInspection();
  return true;
 }
});
// The image can be narrower than its viewport (portrait book engravings).
// Clamp based on the UNTRANSFORMED bitmap dimensions, not a synthetic full-
// width canvas, or a drag can reveal large empty margins during a pinch.
function ltArtPanRange(viewportSize,imageSize,zoom){
 const frame=Number(viewportSize),raster=Number(imageSize),z=Number(zoom);
 if(!Number.isFinite(frame)||frame<=0)return 0;
 const intrinsic=Number.isFinite(raster)&&raster>0?raster:frame;
 const factor=Number.isFinite(z)?Math.max(1,Math.min(4,z)):1;
 return Math.max(0,(intrinsic*factor-frame)/2);
}
// A held two-finger pinch must magnify the actual pixel under the fingers,
// not jump the entire archival painting toward the screen's center.
function ltArtPinchFrame(start,next,width,height,imageWidth=width,imageHeight=height){
 const initial=Math.max(1,Math.min(4,Number(start?.zoom)||1));
 const distance=Math.max(1,Number(start?.distance)||1);
 const measured=Math.max(1,Number(next?.distance)||1);
 const zoom=Math.max(1,Math.min(4,initial*measured/distance));
 const ratio=zoom/initial;
 const projectedX=(Number(next?.x)||0)-((Number(start?.x)||0)-(Number(start?.panX)||0))*ratio;
 // Always derive y from the original midpoint and image displacement.
 const transformedY=(Number(next?.y)||0)-((Number(start?.y)||0)-(Number(start?.panY)||0))*ratio;
 const w=Number.isFinite(width)&&width>0?width:400;
 const h=Number.isFinite(height)&&height>0?height:600;
 const maxX=ltArtPanRange(w,imageWidth,zoom);
 const maxY=ltArtPanRange(h,imageHeight,zoom);
 return {zoom,
  panX:maxX>0?Math.max(-maxX,Math.min(maxX,projectedX)):0,
  panY:maxY>0?Math.max(-maxY,Math.min(maxY,transformedY)):0};
}
function ltOpenArtInspection(picture){
 const src=picture?.getAttribute?.('src')||picture?.src||'';
 const safe=/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i;
 const body=document.body;
 if(!safe.test(src)||!body?.appendChild)return false;
 if(ltCloseActiveArtInspection)ltCloseActiveArtInspection();
 const arabic=document.documentElement?.lang==='ar';
 const backdrop=document.createElement('div');
 backdrop.className='lt-art-inspection-backdrop';
 const dialog=document.createElement('section');
 dialog.className='lt-art-inspection-dialog';
 dialog.setAttribute('role','dialog');
 dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label',arabic?'تفاصيل النقش الأصلي':'Original illustration details');
 const heading=document.createElement('h2');
 heading.textContent=arabic?'من صفحات الكتاب الأصلية':'From the original illustrated edition';
 const dismiss=document.createElement('button');
 dismiss.type='button';dismiss.className='lt-art-inspection-close';
 dismiss.textContent=arabic?'إغلاق ×':'Close ×';
 dismiss.setAttribute('aria-label',arabic?'إغلاق الصورة والعودة للقراءة':'Close image and return to reading');
 const frame=document.createElement('figure');
 const originalColour=String(picture?.closest?.('figure')?.className||'')
  .split(/\s+/).includes('lt-archive-colour-original');
 if(originalColour)dialog.className+=' lt-archive-colour-original';
 const viewport=document.createElement('div');
 viewport.className='lt-art-inspection-viewport';
 const image=document.createElement('img');
 image.src=src;image.alt=picture.alt||'';
 image.loading='eager';image.decoding='async';image.draggable=false;
 viewport.appendChild(image);frame.appendChild(viewport);
 // Preserve the one genuine local bitmap; zoom and pan never mutate
 // chapters, change art URLs or create more image elements.
 let zoom=1,panX=0,panY=0;
 const contacts=new Map();
 let startPinch=null;
 // Native Android touch double-tap complements desktop dblclick: two short,
 // stationary releases zoom at the finger, not at the image centre.
 let lastTouchTap=null,hadMultipleTouch=false,suppressDblclickUntil=0;
 function applyZoom(){
  const w=Number(viewport.clientWidth)||Number(image.clientWidth)||400;
  const h=Number(viewport.clientHeight)||Number(image.clientHeight)||600;
  const xLimit=ltArtPanRange(w,Number(image.clientWidth)||w,zoom);
  const yLimit=ltArtPanRange(h,Number(image.clientHeight)||h,zoom);
  panX=xLimit>0?Math.max(-xLimit,Math.min(xLimit,panX)):0;
  panY=yLimit>0?Math.max(-yLimit,Math.min(yLimit,panY)):0;
  image.style.transform='translate3d('+panX.toFixed(2)+'px,'+panY.toFixed(2)+'px,0) scale('+zoom.toFixed(3)+')';
 }
 function setZoom(next){
  zoom=Math.max(1,Math.min(4,Number(next)||1));
  if(zoom===1){panX=0;panY=0;}
  applyZoom();
 }
 const controls=document.createElement('div');
 controls.className='lt-art-zoom-controls';
 function zoomButton(symbol,en,ar,action){
  const button=document.createElement('button');
  button.type='button';button.className='lt-art-zoom-button';
  button.textContent=symbol;
  button.setAttribute('aria-label',document.documentElement?.lang==='ar'?ar:en);
  button.addEventListener('click',action);controls.appendChild(button);
  return button;
 }
 const zoomOut=zoomButton('−','Zoom out','تصغير الصورة',()=>setZoom(zoom/1.5));
 const zoomIn=zoomButton('+','Zoom in','تكبير الصورة',()=>setZoom(zoom*1.5));
 const zoomReset=zoomButton('1:1','Reset zoom','الحجم الأصلي',()=>setZoom(1));
 function fingerPair(){
  const points=Array.from(contacts.values());
  const rect=viewport.getBoundingClientRect?.();
  const width=Number(rect?.width)||Number(viewport.clientWidth)||400;
  const height=Number(rect?.height)||Number(viewport.clientHeight)||600;
  const mx=(points[0].x+points[1].x)/2;
  const my=(points[0].y+points[1].y)/2;
  return {distance:Math.max(1,Math.hypot(points[0].x-points[1].x,
    points[0].y-points[1].y)),
   x:mx-(Number(rect?.left)||0)-width/2,
   y:my-(Number(rect?.top)||0)-height/2,width,height};
 }
 viewport.addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse'&&event.button!==0)return;
  // Third contacts are ignored; they cannot multiply zoom beyond the 4x
  // archival bounds or leave a ghost-held gesture behind.
  if(contacts.size>=2)return;
  contacts.set(event.pointerId,{x:event.clientX,y:event.clientY,
   startX:event.clientX,startY:event.clientY,startedAt:Date.now()});
  if(contacts.size===2){
   hadMultipleTouch=true;lastTouchTap=null;
   const pair=fingerPair();
   startPinch={...pair,zoom,panX,panY};
  }
  try{viewport.setPointerCapture?.(event.pointerId);}catch(_){}
 });
 viewport.addEventListener('pointermove',event=>{
  const previous=contacts.get(event.pointerId);
  if(!previous)return;
  contacts.set(event.pointerId,{...previous,x:event.clientX,y:event.clientY});
  if(contacts.size===2&&startPinch){
   const pair=fingerPair();
   const frame=ltArtPinchFrame(startPinch,pair,pair.width,pair.height,
    Number(image.clientWidth)||pair.width,Number(image.clientHeight)||pair.height);
   zoom=frame.zoom;panX=frame.panX;panY=frame.panY;applyZoom();
  }else if(contacts.size===1&&zoom>1){
   panX+=event.clientX-previous.x;panY+=event.clientY-previous.y;
   applyZoom();
  }
  if(event.cancelable)event.preventDefault();
 });
 const endContact=event=>{
  const held=contacts.get(event.pointerId);
  // Pointer capture automatically emits lostpointercapture after pointerup;
  // a stale callback must not clear the first recognized short touch.
  if(!held)return;
  const duration=Date.now()-held.startedAt;
  const tap=duration>=0&&duration<=280&&
   event.type==='pointerup'&&event.pointerType==='touch'&&
   contacts.size===1&&!hadMultipleTouch&&held&&
   Math.hypot(event.clientX-held.startX,event.clientY-held.startY)<14;
  if(tap){
   const now=Date.now();
   if(lastTouchTap&&now-lastTouchTap.at<=330&&
      Math.hypot(event.clientX-lastTouchTap.x,
       event.clientY-lastTouchTap.y)<=38){
    if(zoom===1){
     const rect=viewport.getBoundingClientRect?.();
     const w=Number(rect?.width)||Number(viewport.clientWidth)||400;
     const h=Number(rect?.height)||Number(viewport.clientHeight)||600;
     const x=event.clientX-(Number(rect?.left)||0)-w/2;
     const y=event.clientY-(Number(rect?.top)||0)-h/2;
     const frame=ltArtPinchFrame({zoom:1,distance:1,x,y,panX,panY},
      {distance:2,x,y},w,h,Number(image.clientWidth)||w,
      Number(image.clientHeight)||h);
     zoom=frame.zoom;panX=frame.panX;panY=frame.panY;applyZoom();
    }else setZoom(1);
    lastTouchTap=null;
    // Android WebView can synthesize dblclick after the touch pair.
    suppressDblclickUntil=now+400;
   }else lastTouchTap={at:now,x:event.clientX,y:event.clientY};
  }else lastTouchTap=null;
  contacts.delete(event.pointerId);
  if(contacts.size<2)startPinch=null;
  if(!contacts.size)hadMultipleTouch=false;
 };
 for(const name of ['pointerup','pointercancel','lostpointercapture'])
  viewport.addEventListener(name,endContact);
 viewport.addEventListener('dblclick',event=>{
  event.preventDefault();
  if(Date.now()<suppressDblclickUntil)return;
  setZoom(zoom===1?2:1);
 });
 // Native orientation/viewport changes must not strand an already zoomed
 // folio outside the readable view. One passive listener per open viewer.
 const reflowArt=()=>applyZoom();
 window.addEventListener?.('resize',reflowArt,{passive:true});
 image.onload=applyZoom;
 const credit=picture.closest?.('figure')?.querySelector?.('figcaption')?.textContent||'';
 if(credit.trim()){
  const caption=document.createElement('figcaption');
  caption.textContent=credit.trim();frame.appendChild(caption);
 }
 dialog.appendChild(heading);dialog.appendChild(dismiss);dialog.appendChild(frame);
 dialog.appendChild(controls);backdrop.appendChild(dialog);
 const priorOverflow=body.style?.overflow||'';
 const close=()=>{
  if(ltCloseActiveArtInspection!==close)return;
  ltCloseActiveArtInspection=null;
  contacts.clear();
  window.removeEventListener?.('resize',reflowArt);
  backdrop.remove?.();
  body.classList?.remove('lt-art-inspection-open');
  if(body.style)body.style.overflow=priorOverflow;
  if(picture.isConnected!==false)picture.focus?.({preventScroll:true});
 };
 ltCloseActiveArtInspection=close;
 dismiss.addEventListener('click',close);
 image.onerror=close;
 backdrop.addEventListener('click',event=>{if(event.target===backdrop)close();});
 backdrop.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
   event.preventDefault();event.stopPropagation();close();
  }else if(event.key==='+'||event.key==='='){
   event.preventDefault();setZoom(zoom*1.5);
  }else if(event.key==='-'||event.key==='_'){
   event.preventDefault();setZoom(zoom/1.5);
  }else if(event.key==='0'){
   event.preventDefault();setZoom(1);
  }else if(event.key==='Tab'){
   const stops=[dismiss,zoomOut,zoomIn,zoomReset];
   const current=stops.indexOf(document.activeElement);
   const next=event.shiftKey?(current<=0?3:current-1):
    (current<0||current===3?0:current+1);
   event.preventDefault();stops[next].focus?.();
  }
 });
 if(body.style)body.style.overflow='hidden';
 body.classList?.add('lt-art-inspection-open');
 body.appendChild(backdrop);
 dismiss.focus?.();
 return true;
}
function ltEnableArtInspection(picture){
 const src=picture?.getAttribute?.('src')||picture?.src||'';
 if(!/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i.test(src)||
    typeof picture.addEventListener!=='function')return;
 const arabic=document.documentElement?.lang==='ar';
 picture.setAttribute('role','button');
 picture.setAttribute('tabindex','0');
 picture.setAttribute('aria-label',(picture.alt||'')+
  (arabic?'، اضغط لعرض الصورة بحجم أكبر':', press to inspect the image'));
 picture.addEventListener('click',event=>{
  event.stopPropagation?.();ltOpenArtInspection(picture);
 });
 picture.addEventListener('keydown',event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  event.preventDefault();event.stopPropagation();
  ltOpenArtInspection(picture);
 });
}
function ltBuiltInChapterScene(chapter,sentenceCount){
 if(!sentenceCount||!chapter||!state.story||typeof art==='undefined'||!art)return null;
 const src=art[state.story.id+'_'+state.chapter];
 if(typeof src!=='string'||src.length>280000)return null;
 const trustedRaster=/^data:image\/(?:webp|png|jpeg);base64,[a-z0-9+/=]+$/i.test(src);
 const trustedSvg=src.startsWith('data:image/svg+xml;charset=utf-8,%3Csvg');
 if(!trustedRaster&&!trustedSvg)return null;
 return {afterParagraph:Math.min(2,sentenceCount-1),src,
  alt:('Chapter illustration: '+(state.story.title||'Story')+' — '+(chapter.title||'Chapter')).slice(0,240),
  position:'edge-start',aspectRatio:1000/620,crop:'cover'};
}
// PERF01 / LANG01: reading a 37-chapter companion must not render a whole
// novel into one enormous WebView DOM. All chapters remain accessible via the
// chapter selector and Previous/Next; only the selected chapter is mounted.
// Source text, original chapter progress and saved words are never mutated.
let ltTranslationBook=null,ltTranslationIndex=0;
// The legacy Verne plate list is independently checksum pinned. Editorial
// additions from completed books must be scene-verified, rights-reviewed,
// offline, attributable and anchored to the same original paragraph index.
// Never infer those checks from a pretty filename or from colour alone.
// A placement contract for new period images delivered by the separate
// literature/art workflow. Legacy bundled pictures keep their established
// positions. Newly declared archival items must carry scene+rights proof.
function ltApprovedArchiveSceneLayout(item){
 if(!item||typeof item!=='object')return null;
 const claimedArchive=item.verifiedArchive!==undefined||
  item.sourceParagraphExact!==undefined||
  item.distributionReviewApproved!==undefined||
  item.archiveSource!==undefined;
 const requested=['wide','edge-start','edge-end'].includes(item.position)
  ?item.position:'wide';
 if(!claimedArchive)return {position:requested,uncropped:false,archival:false};
 if(item.verifiedArchive!==true||item.sourceParagraphExact!==true||
    item.distributionReviewApproved!==true||
    typeof item.archiveSource!=='string'||
    !/^https:\/\/(?:commons\.wikimedia\.org|www\.metmuseum\.org|www\.loc\.gov|gallica\.bnf\.fr|www\.gutenberg\.org|archive\.org)\//i.test(item.archiveSource)||
    typeof item.credit!=='string'||!item.credit.trim()||
    !Number.isFinite(item.aspectRatio)||item.aspectRatio<.5||
    item.aspectRatio>3.5)return null;
 // Editorial preference wins. When no layout was chosen, portrait folios
 // sit beside the exact passage on tablets and stack on smaller screens.
 const position=['wide','edge-start','edge-end'].includes(item.position)
  ?item.position:item.aspectRatio<.86?'edge-start':'wide';
 return {position,uncropped:true,archival:true};
}
function ltVerifiedCompanionPlates(chapter,periodPlate){
 const paragraphs=Array.isArray(chapter?.paragraphs)?chapter.paragraphs:[];
 const validSrc=/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i;
 const plates=[],seen=new Set();
 function push(plate){
  if(!plate||!Number.isInteger(plate.index)||plate.index<0||
   plate.index>=paragraphs.length||!validSrc.test(plate.src||'')||
   typeof plate.alt!=='string'||!plate.alt.trim()||plate.alt.length>240||
   typeof plate.credit!=='string'||!plate.credit.trim()||plate.credit.length>160||
   !Number.isFinite(plate.ratio)||plate.ratio<.5||plate.ratio>3.5||
   seen.has(plate.index)||plates.length>=12)return;
  seen.add(plate.index);
  plates.push({
   index:plate.index,src:plate.src,alt:plate.alt.trim(),
   credit:plate.credit.trim(),ratio:plate.ratio,
   visualTreatment:plate.visualTreatment==='original-colour'?'original-colour':'period-original'
  });
 }
 // Known original Verne source scans are already pinned by SHA-256 and
 // verified exact-scene paragraph tests; keep their current positions.
 push(periodPlate);
 const extras=Array.isArray(chapter?.inlineArt)?chapter.inlineArt:[];
 for(const item of extras.slice(0,64)){
  if(!item||item.verifiedArchive!==true||
   item.sourceParagraphExact!==true||item.distributionReviewApproved!==true||
   typeof item.archiveSource!=='string'||
   !/^https:\/\/(?:commons\.wikimedia\.org|www\.metmuseum\.org|www\.loc\.gov|gallica\.bnf\.fr|www\.gutenberg\.org|archive\.org)\//i.test(item.archiveSource))continue;
  push({
   index:item.afterParagraph,src:item.src,
   alt:item.alt,credit:item.credit,ratio:item.aspectRatio,
   visualTreatment:item.visualTreatment
  });
 }
 return plates.sort((a,b)=>a.index-b.index);
}
function ltRenderTranslationChapter(){
 const story=ltTranslationBook;
 if(!story||state.page!=='translation'||state.story!==story)return;
 const chapter=story.chapters[ltTranslationIndex];
 if(!chapter||!Array.isArray(chapter.paragraphs))return;
 const sourceArabic=story.sourceLanguage==='ar';
 const sourceLang=sourceArabic?'en':'ar';
 const direction=sourceArabic?'ltr':'rtl';
 const heading=sourceArabic
  ?uiText('الترجمة الإنجليزية الكاملة','Complete English companion')
  :uiText('الترجمة العربية الكاملة','Complete Arabic companion');
 const disclosure=(story.id==='around-the-world-in-eighty-days-towle' &&
  !sourceArabic && /Arabic draft pending independent review/i.test(story.editorialStatus||''))
  ?uiText('النص الإنجليزي ترجمة جورج ماكيبيس تاول (١٨٧٣) عن الأصل الفرنسي. الترجمة العربية مسودة لم تخضع بعد لمراجعة أدبية مستقلة.',
   'The English reading text is George Makepeace Towle’s 1873 translation from French. The Arabic companion remains an editorial draft awaiting independent review.')
  :'';
 const returnLabel=sourceArabic
  ?uiText('← العودة للقصة العربية','← Back to Arabic story')
  :uiText('← العودة للقصة الإنجليزية','← Back to English story');
 const previousLabel=uiText('الفصل السابق','Previous chapter');
 const nextLabel=uiText('الفصل التالي','Next chapter');
 const selectLabel=uiText('اختر فصل الترجمة','Choose companion chapter');
 const count=uiText('الفصل '+(ltTranslationIndex+1)+' من '+story.chapters.length,
  'Chapter '+(ltTranslationIndex+1)+' of '+story.chapters.length);
 const options=story.chapters.map((item,index)=>'<option value="'+index+'"'+
  (index===ltTranslationIndex?' selected':'')+'>'+
  escapeText((index+1)+'. '+(sourceArabic?(item.titleEn||item.title):(item.titleAr||item.title)))+
  '</option>').join('');
 // Genuine historical imagery belongs inside the translated reading
 // experience too. These are the SAME licensed local scans that the source
 // reader anchors to identical paragraph indices, not generic generated art.
 const plate=story.id==='around-the-world-in-eighty-days-towle'
  ?({
    2:{index:27,src:'art/verne-route-map-1872.webp',ratio:800/650,
      alt:uiText('خريطة قديمة لمسار رحلة فيلياس فوغ حول العالم.',
       'Historical printed route map of Phileas Fogg’s world journey.'),
      credit:uiText('نوفيل وبنيت، ١٨٧٢ · خريطة المسار الأصلية',
       'Neuville / Benett, 1872 · Original route map')},
    4:{index:1,src:'art/verne-news-readers-1873.webp',ratio:620/898,
      alt:uiText('قراء في لندن يتابعون الأخبار والمراهنات على رحلة فيلياس فوغ.',
       'London readers following newspaper reports about Fogg’s wager.'),
      credit:uiText('رسم أصلي من طبعة أوسغود، ١٨٧٣ · أرشيف نيويورك',
       '1873 Osgood illustrated edition · NYPL archive')},
    5:{index:25,src:'art/verne-fix-watch-1873.webp',ratio:620/902,
      alt:uiText('المحقق فيكس يتابع المسافرين بترقب شديد.',
       'Detective Fix watching travellers with intense suspicion.'),
      credit:uiText('نقش من طبعة أوسغود، ١٨٧٣ · أرشيف نيويورك',
       '1873 Osgood original detective engraving · NYPL archive')},
    10:{index:43,src:'art/verne-kiouni-1873.webp',ratio:630/921,
      alt:uiText('فوغ وباسبارتو في مشهد الفيل كِيوني في الهند.',
       'Phileas Fogg and Passepartout with Kiouni the elephant in India.'),
      credit:uiText('طبعة أوسغود التاريخية المصوّرة، ١٨٧٣',
       'Illustrated Osgood edition, 1873')},
    14:{index:19,src:'art/verne-calcutta-court-1873.webp',ratio:620/812,
      alt:uiText('محكمة كلكتا تعرض حذاء باسبارتو دليلًا في قضية المعبد.',
       'The Calcutta court displays Passepartout’s shoes as evidence.'),
      credit:uiText('نقش أصلي من طبعة أوسغود، ١٨٧٣ · أرشيف نيويورك',
       'Original 1873 Osgood engraving · NYPL archive')},
    16:{index:7,src:'art/verne-singapore-carriage-1873.webp',ratio:620/895,
      alt:uiText('فوغ وأودا في عربة تجرّها الخيول بين حدائق سنغافورة.',
       'Phileas Fogg and Aouda ride a horse-drawn carriage in Singapore.'),
      credit:uiText('طبعة أوسغود المصوّرة، ١٨٧٣ · أرشيف نيويورك',
       '1873 Osgood illustrated edition · NYPL archive')},
    19:{index:66,src:'art/verne-tankadere-cabin-1873.webp',ratio:620/902,
      alt:uiText('فوغ وأودا وفيكس يتحدثون داخل مقصورة السفينة تانكادير.',
       'Fogg, Aouda and Fix talking in the Tankadere cabin.'),
      credit:uiText('نقش من طبعة أوسغود التاريخية، ١٨٧٣',
       '1873 Osgood illustrated edition · Historic cabin engraving')},
    20:{index:34,src:'art/verne-tankadere-1872.webp',ratio:640/931,
      alt:uiText('السفينة تانكادير تصارع العاصفة في عرض البحر.',
       'The Tankadere sailing through a heavy ocean storm.'),
      credit:uiText('نوفيل وبنيت، ١٨٧٢ · نقش بحري تاريخي',
       'Neuville / Benett, 1872 · Historic sea engraving')},
    28:{index:64,src:'art/verne-passepartout-train-1873.webp',ratio:620/904,
      alt:uiText('باسبارتو يتدلّى من القاطرة أثناء محاولته فصل عربات القطار وإنقاذ الركاب.',
       'Passepartout hanging from the train as he works to uncouple its carriages.'),
      credit:uiText('طبعة أوسغود المصوّرة الأصلية، ١٨٧٣ · أرشيف نيويورك',
       '1873 J. R. Osgood illustrated edition · NYPL archive')}
   }[ltTranslationIndex]||null):null;
 const plates=ltVerifiedCompanionPlates(chapter,plate);
 const platesByParagraph=new Map(plates.map(item=>[item.index,item]));
 const translated=chapter.paragraphs.map((paragraph,index)=>{
  const prose=sourceArabic
   ?'<p lang="en" dir="ltr">'+escapeText(paragraph.en)+'</p>'
   :'<p lang="ar" dir="rtl">'+escapeText(paragraph.ar)+'</p>';
  const item=platesByParagraph.get(index);
  if(!item)return prose;
  return prose+'<figure class="lt-companion-plate'+
   (item.visualTreatment==='original-colour'?' lt-archive-colour-original':'')+'">'+
   '<img src="'+item.src+'" loading="lazy" decoding="async" alt="'+
   escapeText(item.alt)+'" style="aspect-ratio:'+item.ratio+';object-fit:contain">'+
   '<figcaption>'+escapeText(item.credit)+'</figcaption></figure>';
 }).join('');
 const title=sourceArabic?(story.titleEn||story.title):(story.titleAr||story.title);
 const chapterTitle=sourceArabic?(chapter.titleEn||chapter.title):(chapter.titleAr||chapter.title);
 const root=$('root');
 root.innerHTML='<section class="arabic-page '+(state.dark?'dark ':'')+
  (sourceArabic?'lt-english-companion':'lt-arabic-companion')+'"><div class="arabic-inner">'+
  '<button type="button" class="secondary" onclick="backToReader()">'+returnLabel+'</button>'+
  '<h1 lang="'+sourceLang+'" dir="'+direction+'">'+escapeText(title)+'</h1>'+
  '<p class="quiet">'+heading+'</p>'+
  (disclosure?'<aside class="lt-literary-disclosure" role="note">'+escapeText(disclosure)+'</aside>':'')+
  '<nav class="lt-translation-nav" aria-label="'+selectLabel+'">'+
  '<button type="button" class="secondary" onclick="ltTranslationChapter('+(ltTranslationIndex-1)+')"'+
  (ltTranslationIndex===0?' disabled':'')+'>'+previousLabel+'</button>'+
  '<label for="lt-translation-chapter">'+count+'</label>'+
  '<select id="lt-translation-chapter" aria-label="'+selectLabel+
   '" onchange="ltTranslationChapter(this.value)">'+options+'</select>'+
  '<button type="button" class="secondary" onclick="ltTranslationChapter('+(ltTranslationIndex+1)+')"'+
  (ltTranslationIndex===story.chapters.length-1?' disabled':'')+'>'+nextLabel+'</button>'+
  '</nav>'+
  '<h2 id="lt-translation-chapter-title" tabindex="-1" lang="'+sourceLang+'" dir="'+direction+'">'+escapeText(chapterTitle)+'</h2>'+
  translated+
  '<nav class="lt-translation-bottom" aria-label="'+selectLabel+'">'+
  '<button type="button" class="secondary" onclick="ltTranslationChapter('+(ltTranslationIndex-1)+')"'+
  (ltTranslationIndex===0?' disabled':'')+'>'+previousLabel+'</button>'+
  '<span role="status">'+count+'</span>'+
  '<button type="button" class="primary" onclick="ltTranslationChapter('+(ltTranslationIndex+1)+')"'+
  (ltTranslationIndex===story.chapters.length-1?' disabled':'')+'>'+nextLabel+'</button>'+
  '</nav></div></section>';
 // The old select/Next button is destroyed by this rerender; move the
 // reading cursor to the NEW chapter heading for keyboard and TalkBack users.
 root.querySelectorAll?.('.lt-companion-plate img')?.forEach(ltEnableArtInspection);
 root.querySelector?.('#lt-translation-chapter-title')?.focus({preventScroll:true});
 window.scrollTo(0,0);
}
window.ltTranslationChapter=function(index){
 if(state.page!=='translation'||!ltTranslationBook||state.story!==ltTranslationBook)return;
 if(typeof index==='string'&&!/^(0|[1-9][0-9]*)$/.test(index))return;
 if(typeof index!=='string'&&typeof index!=='number')return;
 const chapter=Number(index);
 if(!Number.isSafeInteger(chapter)||chapter<0||
    chapter>=ltTranslationBook.chapters.length||chapter===ltTranslationIndex)return;
 ltTranslationIndex=chapter;
 ltRenderTranslationChapter();
};
if(typeof fullTranslation==='function'){
 const originalFullTranslation=fullTranslation;
 window.fullTranslation=function(){
  if(!state.story?.chapters?.length)return originalFullTranslation();
  closeSheet();
  ltTranslationBook=state.story;
  ltTranslationIndex=Number.isInteger(state.chapter)
   ?Math.max(0,Math.min(state.chapter,state.story.chapters.length-1)):0;
  state.page='translation';
  ltRenderTranslationChapter();
 };
}

renderReader=function(){
 if(ltCloseActiveArtInspection)ltCloseActiveArtInspection();
 originalReader();
 if(!state.story || state.page!=='reader')return;
 if(state.story.sourceLanguage==='ar'){
  const chapter=state.story.chapters[state.chapter],root=document.querySelector('.reader');
  root?.setAttribute('data-lt-source','ar');
  root?.querySelector('.reader-label bdi:first-of-type')?.setAttribute('dir','rtl');
  const title=root?.querySelector('h2');
  title?.setAttribute('lang','ar');title?.setAttribute('dir','rtl');
  document.querySelectorAll('.reader .sentence').forEach(node=>{
   const paragraph=chapter.paragraphs[Number(node.dataset.i)];
   if(!paragraph)return;
   node.textContent=paragraph.ar; // discard lookup tokens from secondary English
   node.classList.add('lt-arabic-source');
   node.setAttribute('lang','ar');node.setAttribute('dir','rtl');
   const next=node.nextElementSibling;
   if(next?.classList.contains('inline-ar')){
    next.textContent=paragraph.en;next.classList.replace('inline-ar','inline-en');
    next.setAttribute('lang','en');next.setAttribute('dir','ltr');
   }
  });
 }
 ltApplyFonts();
 // UI language must not change pronunciation of English source paragraphs.
 document.querySelector('.reader h2')?.setAttribute('lang',state.story?.sourceLanguage==='ar'?'ar':'en');
 document.querySelectorAll('.reader .inline-ar').forEach(node=>node.setAttribute('lang','ar'));
 document.querySelectorAll('.reader .inline-en').forEach(node=>node.setAttribute('lang','en'));
 put('has_read_'+state.story.id,true);
 // LT-08: render only editorially approved, packaged images anchored to a
 // specific paragraph. No remote URLs, HTML injection, or network fallback.
 // An absent inlineArt catalog does nothing to existing books.
 const chapter=state.story.chapters[state.chapter];
 const sentences=Array.from(document.querySelectorAll('.reader .sentence'));
 const safeArtPath=/^art\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.(?:webp|png|jpe?g)$/i;
 const curatedArt=Array.isArray(chapter?.inlineArt)?chapter.inlineArt:[];
 // UX04: historical plates are the REAL 1872/1873 engravings from the book,
 // not gradients, generated illustrations, or unmatched decorative scenes.
 // Paragraph indices are traced to George Makepeace Towle's packaged source.
 // The source arrays/bookmarks stay byte-for-byte unchanged.
 const periodArt=state.story.id==='around-the-world-in-eighty-days-towle'
  ?({
    2:[{afterParagraph:27,src:'art/verne-route-map-1872.webp',
      alt:uiText('خريطة أصلية من طبعة القرن التاسع عشر توضح مسار الرحلة حول العالم.',
        'Historical 1872 engraving of the complete route around the world.'),
      credit:uiText('نوفيل وبنيت، ١٨٧٢ · خريطة الرحلة التاريخية','Neuville / Benett, 1872 · Historical journey map'),
      aspectRatio:800/650,position:'wide'}],
    4:[{afterParagraph:1,src:'art/verne-news-readers-1873.webp',
      alt:uiText('قراء لندن يطالعون التقارير الصحفية عن مغامرة فوغ والرهان.',
        'London crowds reading news reports about Phileas Fogg’s journey.'),
      credit:uiText('طبعة أوسغود، ١٨٧٣ · أرشيف مكتبة نيويورك العامة',
        '1873 Osgood book engraving · NYPL archive'),
      aspectRatio:620/898,position:'wide'}],
    5:[{afterParagraph:25,src:'art/verne-fix-watch-1873.webp',
      alt:uiText('المحقق فيكس يراقب المسافرين بحثًا عن الرجل المشتبه به.',
       'Detective Fix closely watches travellers in search of his suspect.'),
      credit:uiText('نقش من طبعة أوسغود الأصلية، ١٨٧٣ · أرشيف مكتبة نيويورك العامة',
       '1873 J. R. Osgood illustrated edition · NYPL archive'),
      aspectRatio:620/902,position:'wide'}],
    10:[{afterParagraph:43,src:'art/verne-kiouni-1873.webp',
      alt:uiText('فيلياس فوغ وباسبارتو أمام الفيل كِيوني ومالكه في الهند.',
        'Phileas Fogg and Passepartout meeting Kiouni the elephant in India.'),
      credit:uiText('طبعة أوسغود المصوّرة، ١٨٧٣ · أرشيف مكتبة نيويورك العامة','1873 J. R. Osgood illustrated edition · NYPL archive'),
      aspectRatio:630/921,position:'wide'}],
    14:[{afterParagraph:19,src:'art/verne-calcutta-court-1873.webp',
      alt:uiText('جلسة في محكمة كلكتا يُعرض خلالها حذاء باسبارتو دليلًا.',
       'Calcutta courtroom where Passepartout’s abandoned shoes are presented as evidence.'),
      credit:uiText('طبعة أوسغود التاريخية، ١٨٧٣ · أرشيف مكتبة نيويورك العامة',
       '1873 Osgood original courtroom engraving · NYPL archive'),
      aspectRatio:620/812,position:'wide'}],
    16:[{afterParagraph:7,src:'art/verne-singapore-carriage-1873.webp',
      alt:uiText('فيلياس فوغ وأودا يعبران حدائق سنغافورة بعربة تجرّها الخيول.',
       'Phileas Fogg and Aouda ride through Singapore gardens by horse-drawn carriage.'),
      credit:uiText('طبعة أوسغود المصوّرة، ١٨٧٣ · أرشيف نيويورك',
       '1873 Osgood original Singapore engraving · NYPL archive'),
      aspectRatio:620/895,position:'wide'}],
    19:[{afterParagraph:66,src:'art/verne-tankadere-cabin-1873.webp',
      alt:uiText('فيلياس فوغ وأودا والمحقق فيكس داخل مقصورة تانكادير.',
        'Phileas Fogg, Aouda and detective Fix in the Tankadere cabin.'),
      credit:uiText('نقش من طبعة أوسغود التاريخية، ١٨٧٣',
        '1873 Osgood original cabin engraving'),
      aspectRatio:620/902,position:'wide'}],
    20:[{afterParagraph:34,src:'art/verne-tankadere-1872.webp',
      alt:uiText('السفينة تانكادير تتقاذفها الأمواج العالية وسط العاصفة.',
        'The Tankadere tossed on towering waves during the storm.'),
      credit:uiText('نوفيل وبنيت، ١٨٧٢ · نقش تاريخي من الرواية','Neuville / Benett, 1872 · Historic engraved scene'),
      aspectRatio:640/931,position:'wide'}],
    28:[{afterParagraph:64,src:'art/verne-passepartout-train-1873.webp',
      alt:uiText('باسبارتو يتعلّق بيد واحدة بين عربة الأمتعة ومؤخرة القاطرة ليحرر وصلات القطار.',
       'Passepartout hangs by one hand between the baggage car and tender, loosening the train connection.'),
      credit:uiText('نقش أصلي من طبعة أوسغود، ١٨٧٣ · أرشيف مكتبة نيويورك العامة',
       '1873 J. R. Osgood original train engraving · NYPL archive'),
      aspectRatio:620/904,position:'wide'}]
   }[state.chapter]||[]):[];
 // UX04: a historical novel's top-of-chapter banner must also use a
 // REAL source-era scan. Old decorative SVG cards are never suitable here.
 // When no archive scene is verified, remove the false visual instead.
 if(state.story.id==='around-the-world-in-eighty-days-towle'){
  const hero=document.querySelector('.reader .reader-hero');
  if(hero){
   const verified=periodArt[0];
   if(verified){
    hero.style.backgroundImage='url("'+verified.src+'")';
    hero.style.aspectRatio=String(verified.aspectRatio);
    hero.classList.add('lt-historic-hero');
    hero.classList.toggle('lt-historic-landscape',verified.aspectRatio>1);
    // The passage figure has the meaningful alt/caption; the repeated
    // decorative chapter frontispiece should not be read twice by TalkBack.
    hero.setAttribute('aria-hidden','true');
    hero.removeAttribute('aria-label');
   }else{
    hero.style.backgroundImage='none';
    hero.classList.add('lt-no-period-hero');
   }
  }
 }
 const approvedArt=periodArt.length>0||curatedArt.some(item=>item&&safeArtPath.test(item.src||'')&&
  typeof item.alt==='string'&&!!item.alt.trim());
 // A sourced historical novel must never silently fall back to the
 // geometric/modern SVG art catalog when that chapter lacks a verified plate.
 // Preserve those older illustrations for legacy saved short stories only.
 const chapterScene=(approvedArt||
   state.story.id==='around-the-world-in-eighty-days-towle')
  ?null:ltBuiltInChapterScene(chapter,sentences.length);
 const inlineArt=chapterScene?[chapterScene,...periodArt,...curatedArt]:[...periodArt,...curatedArt];
 const usedAnchors=new Set();
 // Ignore invalid catalog entries without allowing them to consume the 12-image budget.
 // Bound candidate scanning so a corrupt chapter cannot stall the reader.
 for(const item of inlineArt.slice(0,64)){
  if(usedAnchors.size>=12)break;
  if(!item||!Number.isInteger(item.afterParagraph)||item.afterParagraph<0||
     usedAnchors.has(item.afterParagraph)||!(item===chapterScene||safeArtPath.test(item.src||''))||
     typeof item.alt!=='string'||!item.alt.trim()||item.alt.length>240)continue;
  const anchor=sentences.find(node=>Number(node.dataset.i)===item.afterParagraph);
  if(!anchor||typeof anchor.insertAdjacentElement!=='function')continue;
  const layout=ltApprovedArchiveSceneLayout(item);
  if(!layout)continue;
  const position=layout.position;
  const figure=document.createElement('figure');
  const originalColour=item.visualTreatment==='original-colour'&&
    item!==chapterScene&&safeArtPath.test(item.src||'')&&
    typeof item.credit==='string'&&!!item.credit.trim();
  figure.className='lt-inline-illustration lt-inline-'+position+
   (item===chapterScene?' lt-inline-chapter-scene':'')+
   (originalColour?' lt-archive-colour-original':'')+
   (layout.archival?' lt-archive-source-approved':'');
  const picture=document.createElement('img');
  picture.src=item.src;picture.alt=item.alt.trim();
  picture.loading='lazy';picture.decoding='async';
  // Reserve editorial image geometry before decode on long chapters. The
  // optional crop/focal data is bounded: invalid metadata cannot break layout.
  if(picture.style && typeof item.aspectRatio==='number' &&
     Number.isFinite(item.aspectRatio) && item.aspectRatio>=0.5 && item.aspectRatio<=3.5){
   picture.style.aspectRatio=String(item.aspectRatio);
  }
  if(picture.style && (originalColour||layout.uncropped)){
   // Authentic pigment, manuscript margins and engraving frame are immutable.
   // Full frame wins over any stray legacy crop request.
   picture.style.objectFit='contain';
  }
  if(picture.style && item.crop==='cover'&&!layout.uncropped&&!originalColour){
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
  ltEnableArtInspection(picture);
  if(typeof item.credit==='string'&&item.credit.trim()&&item.credit.length<=160){
   const caption=document.createElement('figcaption');
   caption.textContent=item.credit.trim();
   figure.appendChild(caption);
  }
  // Keep a visible Arabic translation immediately beside its English source.
  // The illustration follows the bilingual pair, not between both languages.
  const translated=anchor.nextElementSibling;
  if((translated?.classList?.contains('inline-ar')||translated?.classList?.contains('inline-en'))&&typeof translated.insertAdjacentElement==='function')
   translated.insertAdjacentElement('afterend',figure);
  else anchor.insertAdjacentElement('afterend',figure);
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
  p.setAttribute('lang',state.story?.sourceLanguage==='ar'?'ar':'en');
  p.setAttribute('dir',state.story?.sourceLanguage==='ar'?'rtl':'ltr');
  // Preserve the actual English sentence for screen readers: aria-label would
  // replace the sentence with generic instructions and hide its learning text.
  p.setAttribute('aria-description',state.story?.sourceLanguage==='ar'?uiText('اضغط مطولًا أو Enter أو Space لعرض المعنى بالإنجليزية.','Long press, Enter or Space to show contextual English.'):uiText('انقر كلمة لمعناها، أو اضغط مطولًا أو اضغط Enter أو Space لعرض الترجمة.','Tap a word for its meaning, or long-press, Enter or Space for Arabic translation.'));
  const sentenceIndex=Number(p.dataset.i);
  const source=state.story.chapters[state.chapter]?.paragraphs?.[sentenceIndex];
  const key=revealKey();
  // A revealed companion can enlarge the source paragraph after the sheet was
  // measured. Reflow only on actual user toggle, not every frame or scroll;
  // keep the same paragraph under the eye and its illustration together.
  const repaginateRevealedText=()=>{
   if(document.querySelector('.reader .reading-width')?.dataset?.ltPaged!=='1')return;
   const offset=p.getBoundingClientRect?.()?.top;
   if(!Number.isInteger(sentenceIndex)||sentenceIndex<0||
      !Number.isFinite(offset)||typeof window.LinguaReflowReader!=='function')return;
   window.LinguaReflowReader({paragraph:sentenceIndex,
    viewportOffset:Math.max(-4096,Math.min(4096,offset))});
  };
  const showTranslation=()=>{
   if(!source||p.nextElementSibling?.classList?.contains('stl-sentence-translation'))return;
   const translation=document.createElement('p');
   translation.className='stl-sentence-translation';
   translation.setAttribute('dir',state.story?.sourceLanguage==='ar'?'ltr':'rtl');
   translation.setAttribute('lang',state.story?.sourceLanguage==='ar'?'en':'ar');
   translation.textContent=state.story?.sourceLanguage==='ar'?source.en:source.ar;
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
    repaginateRevealedText();
    return;
   }
   // Prevent unbounded retained sentence state on very large imported books.
   const shown=revealSet(key);
   if(shown.size>=200)shown.delete(shown.values().next().value);
   shown.add(sentenceIndex);
   showTranslation();
   repaginateRevealedText();
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
 fontSelect?.addEventListener('change',event=>{
  const anchor=captureParagraphAnchor();
  put('lt_font_choice',event.target.value);
  if(typeof window.LinguaReflowReader==='function')window.LinguaReflowReader(anchor);
  else ltApplyFonts();
 });

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
 if(savedReaderPage!==null){
  put('readpage_'+state.story.id+'_'+chapter,savedReaderPage);
  // Prefer the semantic bookmark; an old page number remains compatible.
  const target=Number.isInteger(mark.paragraph)&&mark.paragraph>=0
   ?mark.paragraph:savedReaderPage*LT_PAGE_PARAGRAPHS;
  put('readpage_anchor_'+state.story.id+'_'+chapter,target);
 }

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
// Reader typography controls apply font/size without changing chapters. Reflow
// the actual paper pages after font changes, preserving the paragraph visible
// at the same viewport offset. This also protects a mid-chapter bookmark from
// shifting when an Android font has different character metrics.
window.LinguaReflowReader=function(anchor){
 if(state.page!=='reader'||!state.story)return;
 const id=state.story.id,chapter=state.chapter;
 const valid=anchor&&Number.isInteger(anchor.paragraph)&&anchor.paragraph>=0&&
  Number.isFinite(anchor.viewportOffset)&&Math.abs(anchor.viewportOffset)<=4096;
 if(valid)put('readpage_anchor_'+id+'_'+chapter,anchor.paragraph);
 renderReader();
 if(!valid||state.page!=='reader'||state.story?.id!==id||state.chapter!==chapter)return;
 const target=Array.from(document.querySelectorAll('.reader .sentence'))
  .find(node=>Number(node.dataset?.i)===anchor.paragraph);
 const top=target?.getBoundingClientRect?.()?.top;
 if(!Number.isFinite(top))return;
 const y=window.scrollY+top-anchor.viewportOffset;
 if(Number.isFinite(y))window.scrollTo(0,Math.max(0,y));
};
// Adaptive paper grouping must also respond when the device rotates or
// Android multi-window changes width. Rebuild only on material width changes,
// never for keyboard-height-only resize notifications. The semantic first-
// paragraph anchor already saved by renderPage() survives this remount.
let ltLastLayoutWidth=Number(window.innerWidth),ltResizeTimer=null;
function ltRefreshPagesOnResize(){
 const latest=Number(window.innerWidth);
 if(!Number.isFinite(latest)||latest<240)return;
 if(!Number.isFinite(ltLastLayoutWidth)){ltLastLayoutWidth=latest;return;}
 if(Math.abs(latest-ltLastLayoutWidth)<48)return;
 ltLastLayoutWidth=latest;
 if(ltResizeTimer!==null)window.clearTimeout?.(ltResizeTimer);
 if(typeof window.setTimeout!=='function')return;
 ltResizeTimer=window.setTimeout(()=>{
  ltResizeTimer=null;
  if(state.page!=='reader'||!state.story)return;
  const paper=document.querySelector('.reader #sentences');
  if(!paper||paper.isConnected===false)return;
  const top=paper.getBoundingClientRect?.()?.top;
  const hadPaperVisible=Number.isFinite(top)&&
   top<=(Number.isFinite(window.innerHeight)?window.innerHeight:800);
  // Keep the *visible paragraph*, not just its containing page, after
  // rotation or split-screen resizing. The same semantic bridge handles font
  // changes, so the user stays at the exact reading position when possible.
  const anchor=hadPaperVisible&&typeof captureParagraphAnchor==='function'
   ?captureParagraphAnchor():null;
  if(Number.isInteger(anchor?.paragraph)&&
     typeof window.LinguaReflowReader==='function'){
   window.LinguaReflowReader(anchor);
   return;
  }
  // No semantic anchor (e.g. reader is at its cover): keep the legacy fallback.
  // Recreate inert paper pages and dictionary handlers through the main reader.
  renderReader();
  if(hadPaperVisible)document.querySelector('.reader #sentences')?.
   scrollIntoView?.({block:'start',behavior:'auto'});
 },180);
}
window.addEventListener?.('resize',ltRefreshPagesOnResize);
library(); // Re-render once after installing enhancements.
})();