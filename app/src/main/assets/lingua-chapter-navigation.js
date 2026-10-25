/* Lingua Tales — truthful serial-book progress and accessible chapter navigation.
 * This decorates the fully installed reader pipeline without changing legacy
 * chapter/progress storage, and never claims an unfinished book is complete. */
(function(global){
'use strict';
const baseRender=renderReader;
const localized=(ar,en)=>document.documentElement.lang==='en'?en:ar;
function decorate(){
 if(state.page!=='reader'||!state.story)return;
 const story=state.story,chapters=story.chapters||[],index=state.chapter;
 if(!Number.isInteger(index)||index<0||index>=chapters.length)return;
 const end=document.querySelector('.reader .chapter-end');
 if(!end)return;
 const incomplete=Number.isInteger(story.totalChapters)&&story.totalChapters>chapters.length;
 const nav=document.createElement('nav');
 nav.className='lt-chapter-nav';
 nav.setAttribute('aria-label',localized('التنقل بين الفصول','Chapter navigation'));
 const button=(label,target,enabled)=>{
  const control=document.createElement('button');
  control.type='button';control.className='secondary lt-chapter-button';
  control.textContent=label;control.disabled=!enabled;
  control.addEventListener('click',()=>{
   if(enabled&&typeof global.stlChapter==='function')global.stlChapter(target);
  });
  nav.appendChild(control);
 };
 button(localized('← الفصل السابق','← Previous chapter'),index-1,index>0);
 button(localized('الفصل التالي →','Next chapter →'),index+1,index<chapters.length-1);
 // Long books need direct chapter access without opening the settings sheet.
 // Only offline/published chapters are selectable; never imply future chapters exist.
 if(chapters.length>1){
  const picker=document.createElement('label');
  picker.className='lt-chapter-picker';
  const caption=document.createElement('span');
  caption.textContent=localized('انتقل إلى فصل','Jump to chapter');
  const select=document.createElement('select');
  select.setAttribute('aria-label',caption.textContent);
  select.setAttribute('dir',document.documentElement.lang==='en'?'ltr':'rtl');
  chapters.forEach((chapter,i)=>{
   const option=document.createElement('option');
   option.value=String(i);
   option.selected=i===index;
   option.textContent=(i+1)+' · '+(document.documentElement.lang==='en'
    ?(chapter.title||chapter.titleAr||'Chapter')
    :(chapter.titleAr||chapter.title||'فصل'));
   select.appendChild(option);
  });
  select.value=String(index);
  select.addEventListener('change',()=>{
   const target=Number(select.value);
   if(Number.isInteger(target)&&target>=0&&target<chapters.length&&target!==index
      &&typeof global.stlChapter==='function')global.stlChapter(target);
  });
  picker.appendChild(caption);picker.appendChild(select);nav.appendChild(picker);
 }
 end.prepend(nav);
 if(!incomplete)return;
 const label=document.querySelector('.reader .reader-label');
 if(label){
  const progress=document.createElement('small');
  progress.className='lt-serial-progress';
  progress.textContent=localized(
   ' · المتاح '+chapters.length+' من '+story.totalChapters+' فصلًا',
   ' · '+chapters.length+' of '+story.totalChapters+' chapters available');
  label.appendChild(progress);
 }
 if(index===chapters.length-1){
  const heading=end.querySelector('div');
  if(heading)heading.textContent=localized(
   'يتبع — لم تكتمل الرواية بعد','To be continued — more chapters are coming');
  const primary=end.querySelector('button.primary');
  if(primary)primary.textContent=localized('العودة للمكتبة','Back to library');
 }
}
renderReader=function(){baseRender();decorate();};
global.LinguaChapterNavigation=Object.freeze({decorate});
})(window);
