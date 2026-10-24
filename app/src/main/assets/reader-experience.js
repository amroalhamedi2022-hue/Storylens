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
const chapterKey=()=> 'chapter_'+state.story.id;
const bookmarkKey=()=> 'bookmarks';
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
 if(!storyById(id)) return;
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
   const percent=Math.round(100*(ix+1)/story.chapters.length);
   badge.innerHTML='<span>'+uiText('الفصل '+(ix+1)+' من '+story.chapters.length,'Chapter '+(ix+1)+' of '+story.chapters.length)+'</span><div class="story-progress-track"><i style="width:'+percent+'%"></i></div>';
   content.appendChild(badge);
  }
 });
};
renderReader=function(){
 originalReader();
 if(!state.story || state.page!=='reader')return;
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
  p.setAttribute('tabindex','0');
  p.setAttribute('lang','en');
  p.setAttribute('dir','ltr');
  // Preserve the actual English sentence for screen readers: aria-label would
  // replace the sentence with generic instructions and hide its learning text.
  p.setAttribute('aria-description',uiText('انقر كلمة لمعناها، أو اضغط مطولًا لعرض الترجمة.','Tap a word for its meaning, or long-press for Arabic translation.'));
  p.addEventListener('contextmenu',event=>{
   event.preventDefault();
   event.stopImmediatePropagation();
   const i=Number(p.dataset.i);
   const source=state.story.chapters[state.chapter]?.paragraphs?.[i];
   if(!source)return;
   const old=p.nextElementSibling;
   if(old?.classList?.contains('stl-sentence-translation')){old.remove();return}
   const translation=document.createElement('p');
   translation.className='stl-sentence-translation';
   translation.setAttribute('dir','rtl');
   translation.setAttribute('lang','ar');
   translation.textContent=source.ar;
   p.insertAdjacentElement('afterend',translation);
  },true);
 });
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
 const footer=sheet.querySelector('footer');
 if(footer)footer.insertAdjacentElement('beforebegin',bar);else sheet.appendChild(bar);
};
window.stlBookmark=function(){
 if(!state.story)return;
 const marks=get(bookmarkKey(),{});
 marks[state.story.id]={chapter:state.chapter,scroll:window.scrollY,updatedAt:Date.now()};
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
 const scroll=typeof mark.scroll==='number'&&Number.isFinite(mark.scroll)
  ?Math.max(0,Math.min(mark.scroll,10000000)):0;
 state.chapter=chapter;
 put(chapterKey(),state.chapter);
 closeSheet();state.toolbar=false;
 // Run the currently installed reader pipeline (accessibility, bookmarks and preferences).
 // Calling the captured base renderer here skips every later enhancement wrapper.
 renderReader();
 window.scrollTo(0,scroll);
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