/* Lingua Tales — compact bilingual-aware library shell, LT-05/09/10/13.
 * Offline, no new permissions, no per-frame animation work. */
(function(global){
'use strict';
const themeNames=['aurora','aqua','nebula','paper-atlas','midnight-library'];
const themeLabels={aurora:'Liquid Aurora',aqua:'Aqua Glass',nebula:'Nebula Flow','paper-atlas':'Paper Atlas','midnight-library':'Midnight Library'};
/* LT-12: separate, offline typography preferences. System font stacks avoid
 * font downloads and extra memory. Unsupported values never reach CSS. */
const fontChoices={ar:['sans','naskh'],en:['serif','sans']};
const fontDefaults={ar:'sans',en:'serif'};
const fontKeys={ar:'fontArabic',en:'fontEnglish'};
function applyFont(lang,name){
 if(!Object.prototype.hasOwnProperty.call(fontChoices,lang)||!fontChoices[lang].includes(name))return false;
 document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']=name;
 put(fontKeys[lang],name);
 return true;
}
function loadFonts(){
 for(const lang of ['ar','en']){
  const saved=typeof get==='function'?get(fontKeys[lang],fontDefaults[lang]):fontDefaults[lang];
  const safe=fontChoices[lang].includes(saved)?saved:fontDefaults[lang];
  document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']=safe;
 }
}

const originalLibrary=library;
let opened=false;
let touch=null;
const isArabic=()=>document.documentElement.dir!=='ltr';
const rtl=()=>isArabic();
const menuText=()=>rtl()?'التصنيفات والقائمة':'Categories & menu';
const settingsText=()=>rtl()?'الإعدادات':'Settings';
const menuSide=()=>rtl()?'right':'left';
const validTheme=name=>themeNames.includes(name);
function applyTheme(name){
 if(!validTheme(name))return false;
 const old=validTheme(state.uiTheme)?state.uiTheme:'aurora';
 document.body.classList.remove('theme-'+old);
 state.uiTheme=name;
 document.body.classList.add('theme-'+name);
 put('uiTheme',name);
 document.querySelectorAll('.lt-theme-choice').forEach(button=>{
  const selected=button.dataset.theme===name;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
 return true;
}
function closeDrawer(restoreFocus=true){
 const drawer=document.getElementById('lt-drawer');
 const backdrop=document.getElementById('lt-drawer-backdrop');
 const toggle=document.getElementById('lt-menu-toggle');
 if(!drawer)return false;
 opened=false;
 drawer.classList.remove('open');
 drawer.setAttribute('aria-hidden','true');
 drawer.inert=true;
 backdrop?.classList.remove('open');
 toggle?.setAttribute('aria-expanded','false');
 if(restoreFocus)toggle?.focus();
 return true;
}
function openDrawer(){
 const drawer=document.getElementById('lt-drawer');
 const backdrop=document.getElementById('lt-drawer-backdrop');
 const toggle=document.getElementById('lt-menu-toggle');
 if(!drawer||state.page!=='library')return false;
 opened=true;
 drawer.classList.add('open');
 drawer.setAttribute('aria-hidden','false');
 drawer.inert=false;
 backdrop?.classList.add('open');
 toggle?.setAttribute('aria-expanded','true');
 drawer.querySelector('button')?.focus();
 return true;
}
function moveDiscovery(){
 const section=document.querySelector('.library');
 const drawer=document.getElementById('lt-drawer');
 const discovery=section?.querySelector('.stl-discovery');
 if(!drawer||!discovery||discovery.parentNode===drawer)return false;
 const divider=drawer.querySelector('.lt-drawer-divider');
 if(divider)drawer.insertBefore(discovery,divider);
 else drawer.appendChild(discovery);
 return true;
}
function addButton(parent,label,click,className){
 const button=document.createElement('button');
 button.type='button';button.className=className||'secondary';
 button.textContent=label;button.addEventListener('click',click);
 parent.appendChild(button);return button;
}
function openSettings(){
 closeDrawer(false);
 const host=document.getElementById('modals');
 if(!host)return;
 host.innerHTML='';
 const overlay=document.createElement('div');
 overlay.className='overlay lt-settings-overlay';
 overlay.addEventListener('click',event=>{if(event.target===overlay)closeSheet();});
 const sheet=document.createElement('section');
 sheet.className='sheet lt-settings-sheet';sheet.setAttribute('role','dialog');
 sheet.setAttribute('aria-modal','true');
 sheet.setAttribute('aria-label',settingsText());
 const heading=document.createElement('h2');
 heading.textContent=settingsText();sheet.appendChild(heading);
 const description=document.createElement('p');
 description.className='quiet';
 description.textContent=rtl()?'اختر تصميم القراءة والمكتبة. تبقى بياناتك محفوظة.':'Choose your library appearance. Your reading progress is preserved.';
 sheet.appendChild(description);
 const themeHeading=document.createElement('h3');
 themeHeading.textContent=rtl()?'تصميم الواجهة':'Appearance';
 sheet.appendChild(themeHeading);
 const gallery=document.createElement('div');gallery.className='lt-theme-gallery';
 for(const name of themeNames){
  const b=addButton(gallery,themeLabels[name],()=>applyTheme(name),'lt-theme-choice lt-theme-'+name);
  b.dataset.theme=name;
  b.setAttribute('aria-pressed',String(state.uiTheme===name));
  b.classList.toggle('selected',state.uiTheme===name);
  const swatch=document.createElement('span');swatch.className='lt-theme-swatch';
  swatch.setAttribute('aria-hidden','true');b.prepend(swatch);
 }
 sheet.appendChild(gallery);
 const fontsHeading=document.createElement('h3');
 fontsHeading.textContent=rtl()?'خطوط القراءة':'Reading fonts';
 sheet.appendChild(fontsHeading);
 for(const lang of ['ar','en']){
  const label=document.createElement('label');label.className='lt-font-setting';
  const title=document.createElement('span');
  title.textContent=lang==='ar'?(rtl()?'الخط العربي':'Arabic font'):(rtl()?'الخط الإنجليزي':'English font');
  label.appendChild(title);
  const select=document.createElement('select');
  select.setAttribute('aria-label',title.textContent);
  const options=lang==='ar'?
   [{value:'sans',ar:'عصري',en:'Modern Arabic'},{value:'naskh',ar:'نسخ',en:'Naskh / serif'}]:
   [{value:'serif',ar:'أدبي',en:'Literary serif'},{value:'sans',ar:'عصري',en:'Modern sans'}];
  for(const option of options){
   const item=document.createElement('option');
   item.value=option.value;item.textContent=rtl()?option.ar:option.en;
   select.appendChild(item);
  }
  select.value=document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']||fontDefaults[lang];
  select.addEventListener('change',()=>applyFont(lang,select.value));
  label.appendChild(select);sheet.appendChild(label);
 }
 const note=document.createElement('p');note.className='quiet';
 note.textContent=rtl()?'تبديل لغة الواجهة والأصوات قيد التطوير.':'Interface language and optional audio controls are in development.';
 sheet.appendChild(note);
 const footer=document.createElement('footer');
 addButton(footer,rtl()?'إغلاق':'Close',()=>closeSheet(),'secondary');
 sheet.appendChild(footer);overlay.appendChild(sheet);host.appendChild(overlay);
 sheet.querySelector('.lt-theme-choice.selected')?.focus();
}
function decorateLibrary(){
 const section=document.querySelector('.library');
 if(!section||state.page!=='library')return;
 opened=false;
 section.querySelector('.header .brand')?.replaceChildren(document.createTextNode('LINGUA TALES'));
 const headerTitle=section.querySelector('.header h1');
 if(headerTitle)headerTitle.textContent=rtl()?'قصص تستحق القراءة':'Stories worth reading';
 section.querySelector('.header .quiet')?.remove();
 section.querySelector('.storylens-hero .hero-eyebrow')?.remove();
 section.querySelector('.storylens-hero .hero-metrics')?.remove();
 section.querySelector('.storylens-hero .hero-content > p')?.remove();
 const heroTitle=section.querySelector('.storylens-hero h2');
 if(heroTitle)heroTitle.textContent=rtl()?'قصتك التالية تبدأ هنا':'Your next chapter';
 section.querySelector('.stl-discovery-title')?.remove();
 section.querySelectorAll(':scope > p.quiet').forEach(p=>p.remove());
 section.querySelectorAll('.shelf .card .sub').forEach(p=>p.remove());
 section.querySelector('.library-actions [aria-label="تغيير تصميم الواجهة"]')?.remove();
 const actions=section.querySelector('.library-actions');
 if(actions)addButton(actions,settingsText(),openSettings,'secondary lt-settings-open');
 const header=section.querySelector('.header');
 if(!header)return;
 const toggle=addButton(header,'☰',()=>opened?closeDrawer():openDrawer(),'secondary lt-menu-toggle');
 toggle.id='lt-menu-toggle';toggle.setAttribute('aria-label',menuText());
 toggle.setAttribute('aria-controls','lt-drawer');toggle.setAttribute('aria-expanded','false');
 const backdrop=document.createElement('div');
 backdrop.id='lt-drawer-backdrop';backdrop.className='lt-drawer-backdrop';
 backdrop.setAttribute('aria-hidden','true');
 backdrop.addEventListener('click',()=>closeDrawer());
 section.appendChild(backdrop);
 const drawer=document.createElement('aside');
 drawer.id='lt-drawer';drawer.className='lt-drawer';
 drawer.setAttribute('role','dialog');drawer.setAttribute('aria-modal','true');
 drawer.setAttribute('aria-label',menuText());drawer.setAttribute('aria-hidden','true');
 drawer.inert=true;
 const title=document.createElement('div');title.className='lt-drawer-title';
 const heading=document.createElement('strong');heading.textContent=menuText();
 title.appendChild(heading);
 addButton(title,'×',()=>closeDrawer(),'lt-drawer-close').setAttribute('aria-label',rtl()?'إغلاق القائمة':'Close menu');
 drawer.appendChild(title);
 const genres=document.createElement('nav');
 genres.className='lt-genre-list';genres.setAttribute('aria-label',rtl()?'أنواع القصص':'Story genres');
 const list=[{id:'all',ar:'الكل',en:'All stories'},...catalog.genres];
 for(const genre of list){
  const button=addButton(genres,rtl()?genre.ar:genre.en,()=>{
   closeDrawer(false);
   filterGenre(genre.id);
  },'lt-genre'+(state.genre===genre.id?' selected':''));
  button.setAttribute('aria-current',state.genre===genre.id?'true':'false');
 }
 drawer.appendChild(genres);
 const divider=document.createElement('div');divider.className='lt-drawer-divider';drawer.appendChild(divider);
 section.appendChild(drawer);
 moveDiscovery();
 if(actions){actions.classList.add('lt-drawer-actions');drawer.appendChild(actions);}

}
library=function(){originalLibrary();decorateLibrary();};
global.LinguaShell={applyTheme,applyFont,fontChoices,openDrawer,closeDrawer,openSettings,moveDiscovery,menuSide,validTheme,
 isDrawerOpen:()=>opened,themeNames:[...themeNames]};
window.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&opened){
  event.preventDefault();event.stopImmediatePropagation();closeDrawer();
 }
},true);
document.addEventListener('touchstart',event=>{
 if(state.page!=='library'||event.touches.length!==1){touch=null;return;}
 const p=event.touches[0],width=global.innerWidth||document.documentElement.clientWidth;
 if(!opened && (rtl()?p.clientX<width-28:p.clientX>28)){touch=null;return;}
 touch={x:p.clientX,y:p.clientY,at:Date.now()};
},{passive:true});
document.addEventListener('touchend',event=>{
 if(!touch||state.page!=='library'||event.changedTouches.length!==1)return;
 const p=event.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y;
 const elapsed=Date.now()-touch.at;touch=null;
 if(elapsed>850||Math.abs(dx)<65||Math.abs(dy)>55||Math.abs(dx)<Math.abs(dy)*1.4)return;
 const opening=rtl()?dx<0:dx>0;
 if(opening&&!opened)openDrawer();
 else if(!opening&&opened)closeDrawer(false);
},{passive:true});
document.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
/* LT-02: a single, cancellable story navigation gate. The original openStory
 * still owns history and the reader pipeline; no second state store is created. */
(function installStoryTransitions(){
 if(typeof openStory!=='function'||typeof libraryBack!=='function')return;
 const baseOpen=openStory,baseBack=libraryBack;
 let closing=false,waitingPop=false,closeTimer=null,historyFallback=null;
 let returnY=0;
 const motionOff=()=>!!global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const nextFrame=callback=>typeof global.requestAnimationFrame==='function'
  ?global.requestAnimationFrame(callback):callback();
 function savePosition(){
  if(state.story&&state.page==='reader')
   put('scroll_'+state.story.id+'_'+state.chapter,global.scrollY||0);
 }
 function finishClose(){
  if(closeTimer!==null){global.clearTimeout(closeTimer);closeTimer=null;}
  closing=false;waitingPop=false;
  if(state.page!=='reader')return;
  baseBack();
  nextFrame(()=>{if(state.page==='library')global.scrollTo(0,returnY);});
 }
 function closeReader(){
  if(closing||state.page!=='reader')return;
  closing=true;savePosition();
  if(!motionOff())document.querySelector('.reader')?.classList.add('lt-reader-exit');
  closeTimer=global.setTimeout(finishClose,motionOff()?0:190);
 }
 openStory=function(id){
  if(state.page==='library'){
   returnY=Math.max(0,global.scrollY||0);
   put('libraryScroll',returnY);
  }
  if(closeTimer!==null){global.clearTimeout(closeTimer);closeTimer=null;}
  if(historyFallback!==null){global.clearTimeout(historyFallback);historyFallback=null;}
  closing=false;waitingPop=false;
  baseOpen(id);
  if(state.page==='reader'&&!motionOff())
   document.querySelector('.reader')?.classList.add('lt-reader-enter');
 };
 libraryBack=function(){
  if(state.page!=='reader') {baseBack();return;}
  if(closing||waitingPop)return;
  const historyApi=global.history;
  if(historyApi?.state?.page==='reader'&&typeof historyApi.back==='function'){
   waitingPop=true;
   historyApi.back();
   // Some embedded WebViews do not dispatch popstate reliably. Recover safely.
   historyFallback=global.setTimeout(()=>{
    historyFallback=null;
    if(waitingPop&&state.page==='reader'){waitingPop=false;closeReader();}
   },480);
  }else closeReader();
 };
 global.addEventListener?.('popstate',()=>{
  if(historyFallback!==null){global.clearTimeout(historyFallback);historyFallback=null;}
  waitingPop=false;
  if(state.page==='translation'){
   backToReader();
   // Keep a same-document reader entry so a second Back returns to library.
   if(state.story&&global.history?.pushState)
    global.history.pushState({page:'reader'},'','#read-'+state.story.id);
   return;
  }
  if(state.page==='reader'){
   const modal=document.getElementById('modals');
   if(modal?.childElementCount){closeSheet();
    if(state.story&&global.history?.pushState)
     global.history.pushState({page:'reader'},'','#read-'+state.story.id);
    return;
   }
   closeReader();
  }
 });
 global.LinguaStoryNavigation={isClosing:()=>closing,isWaitingForHistory:()=>waitingPop};
})();
loadFonts();
library();
})(window);
