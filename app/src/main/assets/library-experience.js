/* StoryLens v0.6 — library discovery, calm reading controls and meaning selection.
 * No network, no permissions, no generated dictionary claims.
 */
(function(global) {
'use strict';
const STORAGE = 'storylens_';
const levels = ['all','A1','A2','B1','B2','C1','C2'];
const validSort = ['editorial','title','level'];
const validSpacing = ['comfortable','airy','compact'];
const validWidth = ['normal','wide'];
const validFonts = ['literary','modern'];
const defaults = {spacing:'comfortable',width:'normal',font:'literary',illustrations:true};
const read = (key,fallback) => {
 try { const value=JSON.parse(localStorage.getItem(STORAGE+key)); return value===null?fallback:value; }
 catch(_) { return fallback; }
};
const write = (key,value) => {try {localStorage.setItem(STORAGE+key,JSON.stringify(value));return true;}catch(_){return false;}};
const favorites = () => {
 const list=read('favorites',[]);
 return Array.isArray(list)?list.filter(id=>typeof id==='string' && catalog.stories.some(story=>story.id===id)):[];
};
function prefs() {
 const stored=read('readerPrefs',{});
 return {
 spacing: validSpacing.includes(stored?.spacing)?stored.spacing:defaults.spacing,
 width: validWidth.includes(stored?.width)?stored.width:defaults.width,
 font: validFonts.includes(stored?.font)?stored.font:defaults.font,
 illustrations: stored?.illustrations !== false
 };
}
function preference(name,value) {
 const choices={spacing:validSpacing,width:validWidth,font:validFonts};
 if(name==='illustrations') {
  if(typeof value!=='boolean')return false;
 }else if(!choices[name]?.includes(value))return false;
 const next={...prefs(),[name]:value};
 write('readerPrefs',next);
 applyPrefs();
 return true;
}
function applyPrefs() {
 const reading=document.querySelector('.reader');
 if(!reading)return;
 const settings=prefs();
 reading.dataset.spacing=settings.spacing;
 reading.dataset.width=settings.width;
 reading.dataset.font=settings.font;
 reading.classList.toggle('stl-hide-illustrations',!settings.illustrations);
}
function toggleFavorite(id) {
 if(!catalog.stories.some(story=>story.id===id))return false;
 const items=new Set(favorites());
 if(items.has(id))items.delete(id);else items.add(id);
 write('favorites',[...items]);
 return items.has(id);
}
function discoveryState() {
 const level=read('discoveryLevel','all');
 const sort=read('discoverySort','editorial');
 return {
  level:levels.includes(level)?level:'all',
  favoritesOnly:read('favoritesOnly',false)===true,
  sort:validSort.includes(sort)?sort:'editorial'
 };
}
const genreName=id=>catalog.genres.find(genre=>genre.id===id)?.ar||id;
function renderDiscovery() {
 const section=document.querySelector('.library');
 const shelf=section?.querySelector('.shelf');
 if(!shelf)return;
 section.querySelector('.stl-discovery')?.remove();
 section.querySelector('.stl-empty-shelf')?.remove();
 const current=discoveryState();
 const choices=document.createElement('section');
 choices.className='stl-discovery';
 choices.setAttribute('aria-label','اكتشاف القصص');
 const heading=document.createElement('div');heading.className='stl-discovery-title';
 heading.innerHTML='<span>استكشف مكتبتك</span><small>قصص منتقاة حسب اهتماماتك ومستواك</small>';
 choices.appendChild(heading);
 const controls=document.createElement('div');controls.className='stl-discovery-controls';
 const fav=document.createElement('button');
 fav.type='button';fav.className='stl-choice'+(current.favoritesOnly?' active':'');
 fav.textContent='★ المفضلة';fav.setAttribute('aria-pressed',String(current.favoritesOnly));
 fav.addEventListener('click',()=>{write('favoritesOnly',!discoveryState().favoritesOnly);renderDiscovery();});
 controls.appendChild(fav);
 const levelLabel=document.createElement('label');levelLabel.className='stl-select';
 levelLabel.append('المستوى ');
 const select=document.createElement('select');select.setAttribute('aria-label','تصفية حسب مستوى اللغة');
 for(const level of levels){const opt=document.createElement('option');opt.value=level;opt.textContent=level==='all'?'كل المستويات':level;select.appendChild(opt);}
 select.value=current.level;
 select.addEventListener('change',()=>{write('discoveryLevel',select.value);renderDiscovery();});
 levelLabel.appendChild(select);controls.appendChild(levelLabel);
 const sortLabel=document.createElement('label');sortLabel.className='stl-select';sortLabel.append('الترتيب ');
 const order=document.createElement('select');order.setAttribute('aria-label','ترتيب القصص');
 for(const [value,name] of [['editorial','المختارة'],['title','العنوان'],['level','المستوى']]){
  const opt=document.createElement('option');opt.value=value;opt.textContent=name;order.appendChild(opt);
 }
 order.value=current.sort;order.addEventListener('change',()=>{write('discoverySort',order.value);renderDiscovery();});
 sortLabel.appendChild(order);controls.appendChild(sortLabel);
 choices.appendChild(controls);
 shelf.parentNode.insertBefore(choices,shelf);
 const favIds=new Set(favorites());
 const shown=[];
 const cards=[...shelf.querySelectorAll('.card')];
 cards.forEach((card,index)=>{
  const id=card.getAttribute('onclick')?.match(/openStory\('([^']+)'\)/)?.[1];
  const story=catalog.stories.find(item=>item.id===id);
  if(!story)return;
  card.dataset.storyId=id;
  const naturalIndex=catalog.stories.findIndex(item=>item.id===id);
  const stableIndex=naturalIndex<0?index:naturalIndex;
  card.dataset.originalIndex=String(stableIndex);
  card.querySelector('.stl-favorite')?.remove();
  const star=document.createElement('button');
  star.type='button';star.className='stl-favorite'+(favIds.has(id)?' active':'');
  star.textContent=favIds.has(id)?'★':'☆';
  star.title=favIds.has(id)?'إزالة من المفضلة':'إضافة للمفضلة';
  star.setAttribute('aria-label',star.title);
  star.setAttribute('aria-pressed',String(favIds.has(id)));
  star.addEventListener('click',event=>{
   event.preventDefault();event.stopPropagation();
   toggleFavorite(id);
   renderDiscovery();
  });
  card.appendChild(star);
  const visible=(current.level==='all'||story.level===current.level)&&(!current.favoritesOnly||favIds.has(id));
  card.hidden=!visible;
  if(visible)shown.push({card,story,index:stableIndex});
 });
 if(current.sort==='title')shown.sort((a,b)=>a.story.title.localeCompare(b.story.title,'en'));
 else if(current.sort==='level')shown.sort((a,b)=>levels.indexOf(a.story.level)-levels.indexOf(b.story.level)||a.index-b.index);
 else shown.sort((a,b)=>a.index-b.index);
 shown.forEach(x=>shelf.appendChild(x.card));
 // Hidden cards are still kept in the shelf to preserve existing search behavior.
 if(!shown.length){
  const empty=document.createElement('p');empty.className='stl-empty-shelf';
  empty.textContent=current.favoritesOnly?'لا يوجد قصص مطابقة في المفضلة. اضغط على النجمة لحفظ قصصك المفضلة.':'لا توجد قصص بهذا المستوى ضمن الفئة المختارة.';
  shelf.parentNode.insertBefore(empty,shelf.nextSibling);
 }
 const count=section.querySelector('.stl-visible-count');
 if(count)count.textContent='القصص الظاهرة: '+shown.length+' / '+cards.length;
 else{
  const counter=document.createElement('p');counter.className='stl-visible-count';
  counter.textContent='القصص الظاهرة: '+shown.length+' / '+cards.length;
  choices.appendChild(counter);
 }
 // Keep the discovery controls in the locale-aware drawer after any
 // favorites/level/sort refresh; this hook is installed by lingua-shell.js.
 if(typeof global.LinguaShell?.moveDiscovery==='function')global.LinguaShell.moveDiscovery();
}
const originalLibrary=library;
library=function(){
 originalLibrary();
 renderDiscovery();
};
const originalReader=renderReader;
renderReader=function(){
 originalReader();
 applyPrefs();
};
const originalSettings=settings;
settings=function(){
 originalSettings();
 const sheet=document.querySelector('#modals .sheet');
 if(!sheet||!state.story)return;
 const section=document.createElement('section');
 section.className='stl-reading-custom';
 const h=document.createElement('h3');h.textContent='راحة القراءة';section.appendChild(h);
 const choices=[
 ['spacing','المسافة بين السطور',[['compact','مضغوط'],['comfortable','مريح'],['airy','واسع']]],
 ['width','عرض النص',[['normal','معتدل'],['wide','واسع']]],
 ['font','نمط الخط',[['literary','أدبي'],['modern','حديث']]]
 ];
 for(const [key,label,options] of choices){
  const row=document.createElement('div');row.className='stl-setting-line';
  const name=document.createElement('span');name.textContent=label;row.appendChild(name);
  const group=document.createElement('div');group.className='stl-setting-buttons';
  options.forEach(([value,text])=>{
   const button=document.createElement('button');button.type='button';
   button.className='secondary'+(prefs()[key]===value?' active':'');
   button.setAttribute('aria-pressed',String(prefs()[key]===value));
   button.textContent=text;
   button.addEventListener('click',()=>{preference(key,value);settings();});
   group.appendChild(button);
  });
  row.appendChild(group);section.appendChild(row);
 }
 const art=document.createElement('button');art.type='button';art.className='secondary stl-art-toggle';
 art.textContent=prefs().illustrations?'إخفاء رسم الفصل':'إظهار رسم الفصل';
 art.addEventListener('click',()=>{preference('illustrations',!prefs().illustrations);settings();});
 section.appendChild(art);
 const footer=sheet.querySelector('footer');
 if(footer)footer.before(section);else sheet.appendChild(section);
};
const originalWordSheet=wordSheet;
wordSheet=function(args) {
 originalWordSheet(args);
 if(args.entry?.type!=='dictionary')return;
 const sheet=document.querySelector('#modals .sheet');
 if(!sheet)return;
 const senses=String(args.entry.literal).split(/\s+\/\s+|؛/).map(x=>x.trim()).filter(Boolean);
 if(senses.length<2)return;
 const storyId=state.story?.id||'';
 const scopedKey=storyId+'\u001f'+state.chapter+'\u001f'+args.source.en+'\u001f'+args.display.toLowerCase();
 const selections=read('wordSenses',{});
 const box=document.createElement('section');box.className='stl-sense-choices';
 const heading=document.createElement('h3');heading.textContent='اختر المعنى الأنسب في هذه الجملة';box.appendChild(heading);
 const sub=document.createElement('p');sub.textContent='معانٍ معجمية محتملة. اختيارك شخصي ومحفوظ في هذه الجملة فقط، وليس ترجمة معتمدة آليًا.';
 box.appendChild(sub);
 const options=document.createElement('div');options.className='stl-sense-options';
 for(const sense of senses.slice(0,6)){
  const button=document.createElement('button');button.type='button';
  button.className='stl-sense-button'+(selections[scopedKey]===sense?' active':'');
  button.textContent=sense;
  button.setAttribute('aria-pressed',String(selections[scopedKey]===sense));
  button.addEventListener('click',()=>{
   const all=read('wordSenses',{});
   all[scopedKey]=sense;
   write('wordSenses',all);
   options.querySelectorAll('button').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-pressed','false');});
   button.classList.add('active');button.setAttribute('aria-pressed','true');
  });
  options.appendChild(button);
 }
 box.appendChild(options);
 const footer=sheet.querySelector('footer');
 if(footer)footer.before(box);else sheet.appendChild(box);
};
global.StoryLensExtras={favorites,toggleFavorite,discoveryState,prefs,preference,applyPrefs};
library();
})(window);
