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
const chapterIndex=s=>Math.max(0,Math.min(s.chapters.length-1,Number(get('chapter_'+s.id,0))||0));
const escapeText=value=>esc(value);

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
 hero.setAttribute('aria-label','المكتبة والعودة للقراءة');
 hero.innerHTML='<div class="hero-content"><div class="hero-eyebrow">STORYLENS · IMMERSIVE READING</div>'+
  '<h2>Lose yourself in a good story.</h2>'+
  '<p>قصص ناضجة، أسرار تستحق الاكتشاف، وإنجليزي تتعلمه من الأحداث نفسها.</p>'+
  '<div class="hero-metrics"><span>'+catalog.stories.length+' STORIES</span><span>'+catalog.genres.length+' GENRES</span><span>100% OFFLINE</span></div>'+
  (last?'<button class="hero-continue" type="button" onclick="openStory(\''+escapeText(last.id)+'\')">تابع: '+escapeText(last.title)+' · '+(chapter+1)+' / '+last.chapters.length+' ←</button>':
   '<div class="hero-invitation">اختر عالمك التالي من المكتبة بالأسفل ↓</div>')+'</div>'+
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
   badge.innerHTML='<span>الفصل '+(ix+1)+' من '+story.chapters.length+'</span><div class="story-progress-track"><i style="width:'+percent+'%"></i></div>';
   content.appendChild(badge);
  }
 });
};
renderReader=function(){
 originalReader();
 if(!state.story || state.page!=='reader')return;
 put('has_read_'+state.story.id,true);
 const marks=get(bookmarkKey(),{});
 const current=marks[state.story.id];
 const label=document.querySelector('.reader-label');
 if(label && current && current.chapter===state.chapter) {
  const marker=document.createElement('span');
  marker.className='reader-bookmark-indicator';
  marker.textContent=' · 🔖';
  marker.setAttribute('title','يوجد علامة محفوظة في هذا الفصل');
  label.appendChild(marker);
 }
 document.querySelectorAll('.reader .sentence').forEach(p=>{
  p.setAttribute('tabindex','0');
  p.setAttribute('aria-label','الجملة الإنجليزية. انقر كلمة لمعناها، أو اضغط مطولًا لعرض الترجمة.');
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
 bar.innerHTML='<h3>أدوات القراءة</h3><div class="reader-nav-actions">'+
 '<button class="secondary" type="button" onclick="stlBookmark()">🔖 احفظ موضعك</button>'+
 (current?'<button class="secondary" type="button" onclick="stlJumpBookmark()">↪ ارجع للعلامة</button>':'')+
 '</div><div class="chapter-picker">'+state.story.chapters.map((c,i)=>
 '<button type="button" class="'+(i===state.chapter?'selected':'')+'" onclick="stlChapter('+i+')">'+(i+1)+'. '+escapeText(c.title)+'</button>').join('')+'</div>'+
 '<p class="quiet">اضغط مطولًا على أي جملة لإظهار ترجمتها فقط. الترجمة لا تحتاج اتصالًا بالإنترنت.</p>';
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
 const mark=get(bookmarkKey(),{})[state.story?.id];
 if(!mark)return;
 state.chapter=Math.max(0,Math.min(state.story.chapters.length-1,mark.chapter));
 put(chapterKey(),state.chapter);
 closeSheet();state.toolbar=false;
 originalReader();
 window.scrollTo(0,mark.scroll||0);
};
window.stlChapter=function(i){
 if(!state.story||i<0||i>=state.story.chapters.length)return;
 snapshot();
 state.chapter=i;
 put(chapterKey(),state.chapter);
 closeSheet();state.toolbar=false;
 originalReader();
 window.scrollTo(0,get('scroll_'+state.story.id+'_'+state.chapter,0));
};
theme=function(){snapshot();originalTheme()};
inlineTranslate=function(){snapshot();originalInlineTranslate()};
library(); // Re-render once after installing enhancements.
})();