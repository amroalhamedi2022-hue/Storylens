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

/* LT-06: interface locale is independent of the English stories and Arabic
 * learning translations. Never change legacy storage prefixes on rebrand. */
const localeChoices=['ar','en'];
function loadLocale(){
 const saved=typeof get==='function'?get('uiLocale','ar'):'ar';
 const lang=localeChoices.includes(saved)?saved:'ar';
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='ar'?'rtl':'ltr';
}
function applyLocale(lang,rerender=true){
 if(!localeChoices.includes(lang))return false;
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 put('uiLocale',lang);
 if(rerender&&state.page==='library'){
  const scroll=Math.max(0,global.scrollY||0);
  // Switching locale inside Settings must not dismiss the dialog. Rebuild it
  // in the newly selected language, then return keyboard focus to the selector.
  const settingsWasOpen=!!document.querySelector('.lt-settings-overlay');
  closeSheet();
  library();
  if(typeof global.scrollTo==='function')global.scrollTo(0,scroll);
  if(settingsWasOpen){
   openSettings();
   document.querySelector('.lt-locale-setting select')?.focus();
  }
 }
 return true;
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
 const languageHeading=document.createElement('h3');
 languageHeading.textContent=rtl()?'لغة الواجهة':'Interface language';
 sheet.appendChild(languageHeading);
 const languageLabel=document.createElement('label');
 languageLabel.className='lt-font-setting lt-locale-setting';
 const languageTitle=document.createElement('span');
 languageTitle.textContent=rtl()?'اللغة':'Language';
 languageLabel.appendChild(languageTitle);
 const languageSelect=document.createElement('select');
 languageSelect.setAttribute('aria-label',languageHeading.textContent);
 for(const choice of [{id:'ar',name:'العربية'},{id:'en',name:'English'}]){
  const option=document.createElement('option');
  option.value=choice.id;option.textContent=choice.name;
  languageSelect.appendChild(option);
 }
 languageSelect.value=rtl()?'ar':'en';
 languageSelect.addEventListener('change',()=>applyLocale(languageSelect.value));
 languageLabel.appendChild(languageSelect);
 sheet.appendChild(languageLabel);
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
 note.textContent=rtl()?'ترجمة بقية عناصر الواجهة قيد التطوير.':'Full localization of the remaining interface is in progress.';
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
 const searchLabel=section.querySelector('.search-label');
 if(searchLabel){
  const textNode=Array.from(searchLabel.childNodes).find(node=>node.nodeType===3);
  if(textNode)textNode.textContent=rtl()?'بحث في المكتبة':'Search the library';
  const input=searchLabel.querySelector('input');
  if(input){
   input.setAttribute('aria-label',rtl()?'بحث عن قصة':'Search stories');
   input.placeholder=rtl()?'عنوان القصة أو موضوعها…':'Story title or topic…';
  }
 }
 const words=actions?.querySelector('button[onclick="showWords()"]');
 if(words)words.textContent=rtl()?'مفرداتي ◀':'My words';
 const review=actions?.querySelector('button[onclick="showReview()"]');
 if(review)review.textContent=(rtl()?'مراجعة اليوم · ':'Due today · ')+state.cards.filter(c=>c.dueAt<=Date.now()).length;
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
global.LinguaShell={applyTheme,applyFont,applyLocale,fontChoices,localeChoices:[...localeChoices],openDrawer,closeDrawer,openSettings,moveDiscovery,menuSide,validTheme,
 isDrawerOpen:()=>opened,themeNames:[...themeNames]};
/* LT-09/06 accessibility: a visible modal must own keyboard focus.
 * Trap Tab/Shift+Tab in Settings or the genre drawer; Escape dismisses the
 * topmost dialog. No extra listeners are installed on each library rerender. */
function handleDialogKeyboard(event){
 const settings=document.querySelector('.lt-settings-overlay .lt-settings-sheet');
 const dialog=settings||(opened?document.getElementById('lt-drawer'):null);
 if(!dialog)return;
 if(event.key==='Escape'){
  event.preventDefault();event.stopImmediatePropagation();
  if(settings){
   closeSheet();
   document.getElementById('lt-menu-toggle')?.focus();
  }else closeDrawer();
  return;
 }
 if(event.key!=='Tab')return;
 const nodes=Array.from(dialog.querySelectorAll(
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
 )).filter(node=>!node.hidden&&node.getAttribute?.('aria-hidden')!=='true');
 if(!nodes.length){event.preventDefault();dialog.focus?.();return;}
 const first=nodes[0],last=nodes[nodes.length-1],active=document.activeElement;
 const inside=typeof dialog.contains==='function'&&dialog.contains(active);
 if(event.shiftKey&&(active===first||!inside)){
  event.preventDefault();last.focus();
 }else if(!event.shiftKey&&(active===last||!inside)){
  event.preventDefault();first.focus();
 }
}
window.addEventListener('keydown',handleDialogKeyboard,true);
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
loadLocale();
loadFonts();
library();
})(window);
