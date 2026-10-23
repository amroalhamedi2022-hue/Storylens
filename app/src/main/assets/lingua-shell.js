/* Lingua Tales — compact bilingual-aware library shell, LT-05/09/10/13.
 * Offline, no new permissions, no per-frame animation work. */
(function(global){
'use strict';
const themeNames=['aurora','aqua','nebula','paper-atlas'];
const themeLabels={aurora:'Liquid Aurora',aqua:'Aqua Glass',nebula:'Nebula Flow','paper-atlas':'Paper Atlas'};
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
 const note=document.createElement('p');note.className='quiet';
 note.textContent=rtl()?'اللغة والخطوط والأصوات ستُضاف هنا ضمن المراحل المعتمدة.':'Language, fonts and audio controls are planned for this settings page.';
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
 addButton(drawer,settingsText(),openSettings,'secondary lt-drawer-settings');
 section.appendChild(drawer);
}
library=function(){originalLibrary();decorateLibrary();};
global.LinguaShell={applyTheme,openDrawer,closeDrawer,openSettings,menuSide,validTheme,
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
library();
})(window);
