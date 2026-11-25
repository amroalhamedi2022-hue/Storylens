/* Lingua Tales — compact bilingual-aware library shell, LT-05/09/10/13.
 * Offline, no new permissions, no per-frame animation work. */
(function(global){
'use strict';
const themeNames=['liquid-27','aurora','aqua','nebula','paper-atlas','midnight-library','botanical-folio','rain-glass','solar-atelier','ink-workshop','velvet-theatre','celestial-atlas','harbor-ledger','circuit-notebook','terracotta-gallery','monochrome-zine','moonlit-margins','saffron-archive','bauhaus-studio','mosaic-courtyard','saville-clockwork','station-tickets','reform-club-brass','midnight-platform','exchange-gazette','suez-quays','consular-ledger','red-sea-dispatch','monsoon-meridian','deccan-timetable','kholby-crossing','vindhya-passage','dawn-escape','ganges-panorama','calcutta-ledger','rangoon-passage','singapore-lantern','typhoon-timetable','victoria-harbour-dispatch','shanghai-wind-ledger','typhoon-signal','yokohama-lantern','paper-lantern-circus','pacific-meridian','civic-panorama','prairie-signal','salt-lake-dispatch','medicine-bow-crossing','plum-creek-signal','snowbound-telegraph','prairie-sails','hudson-ledger','atlantic-passage', 'last-five-minutes','westminster-vows','reform-club-countdown','meridian-epilogue','stained-glass'];
const selectableThemeNames=['liquid-27','aurora','aqua','nebula','paper-atlas','midnight-library'];
const themeLabels={'liquid-27':'Liquid Glass 27',aurora:'Liquid Aurora',aqua:'Aqua Glass',nebula:'Nebula Flow','paper-atlas':'Paper Atlas','midnight-library':'Midnight Library','botanical-folio':'Botanical Folio','rain-glass':'Rain Glass','solar-atelier':'Solar Atelier','ink-workshop':'Ink Workshop','velvet-theatre':'Velvet Theatre','celestial-atlas':'Celestial Atlas','harbor-ledger':'Harbor Ledger','circuit-notebook':'Circuit Notebook','terracotta-gallery':'Terracotta Gallery','monochrome-zine':'Monochrome Zine','moonlit-margins':'Moonlit Margins','saffron-archive':'Saffron Archive','bauhaus-studio':'Bauhaus Studio','mosaic-courtyard':'Mosaic Courtyard','saville-clockwork':'Saville Clockwork','station-tickets':'Station Tickets','reform-club-brass':'Reform Club Brass','midnight-platform':'Midnight Platform','exchange-gazette':'Exchange Gazette','suez-quays':'Suez Quays','consular-ledger':'Consular Ledger','red-sea-dispatch':'Red Sea Dispatch','monsoon-meridian':'Monsoon Meridian','deccan-timetable':'Deccan Timetable','kholby-crossing':'Kholby Crossing','vindhya-passage':'Vindhya Passage','dawn-escape':'Dawn Escape','ganges-panorama':'Ganges Panorama','calcutta-ledger':'Calcutta Ledger','rangoon-passage':'Rangoon Passage','singapore-lantern':'Singapore Lantern','typhoon-timetable':'Typhoon Timetable','victoria-harbour-dispatch':'Victoria Harbour Dispatch','shanghai-wind-ledger':'Shanghai Wind Ledger','typhoon-signal':'Typhoon Signal','yokohama-lantern':'Yokohama Lantern','paper-lantern-circus':'Paper Lantern Circus','pacific-meridian':'Pacific Meridian','civic-panorama':'Civic Panorama','prairie-signal':'Prairie Signal','salt-lake-dispatch':'Salt Lake Dispatch','medicine-bow-crossing':'Medicine Bow Crossing','plum-creek-signal':'Plum Creek Signal','snowbound-telegraph':'Snowbound Telegraph','prairie-sails':'Prairie Sails','hudson-ledger':'Hudson Ledger','atlantic-passage':'Atlantic Passage','last-five-minutes':'The Last Five Minutes','westminster-vows':'Westminster Vows','reform-club-countdown':'Reform Club Countdown','meridian-epilogue':'Meridian Epilogue','stained-glass':'Stained Glass'};
const themeLabelsAr={
 'liquid-27':"زجاج سائل 27",
 'aurora':"الشفق السائل",
 'aqua':"الزجاج المائي",
 'nebula':"تدفّق السديم",
 'paper-atlas':"أطلس الورق",
 'midnight-library':"مكتبة منتصف الليل",
 'botanical-folio':"دفتر نباتي",
 'rain-glass':"زجاج المطر",
 'solar-atelier':"مرسم شمسي",
 'ink-workshop':"ورشة الحبر",
 'velvet-theatre':"مسرح المخمل",
 'celestial-atlas':"أطلس سماوي",
 'harbor-ledger':"سجل الميناء",
 'circuit-notebook':"دفتر الدوائر",
 'terracotta-gallery':"معرض الفخار",
 'monochrome-zine':"مجلة أحادية اللون",
 'moonlit-margins':"هوامش ضوء القمر",
 'saffron-archive':"أرشيف الزعفران",
 'bauhaus-studio':"مرسم باوهاوس",
 'mosaic-courtyard':"فناء الفسيفساء",
 'saville-clockwork':"ساعة سافيل",
 'station-tickets':"تذاكر المحطة",
 'reform-club-brass':"نحاس نادي الإصلاح",
 'midnight-platform':"رصيف منتصف الليل",
 'exchange-gazette':"جريدة البورصة",
 'suez-quays':"أرصفة السويس",
 'consular-ledger':"سجل القنصلية",
 'red-sea-dispatch':"برقية البحر الأحمر",
 'monsoon-meridian':"خط الزوال الموسمي",
 'deccan-timetable':"جدول دكن",
 'kholby-crossing':"معبر خولبي",
 'vindhya-passage':"ممر فينديا",
 'dawn-escape':"هروب الفجر",
 'ganges-panorama':"بانوراما الغانج",
 'calcutta-ledger':"سجل كلكتا",
 'rangoon-passage':"ممر رانغون",
 'singapore-lantern':"فانوس سنغافورة",
 'typhoon-timetable':"جدول الإعصار",
 'victoria-harbour-dispatch':"برقية ميناء فيكتوريا",
 'shanghai-wind-ledger':"سجل رياح شنغهاي",
 'typhoon-signal':"إشارة الإعصار",
 'yokohama-lantern':"فانوس يوكوهاما",
 'paper-lantern-circus':"سيرك الفوانيس الورقية",
 'pacific-meridian':"خط الزوال الهادئ",
 'civic-panorama':"بانوراما المدينة",
 'prairie-signal':"إشارة البراري",
 'salt-lake-dispatch':"برقية البحيرة المالحة",
 'medicine-bow-crossing':"معبر ميديسن بو",
 'plum-creek-signal':"إشارة بلَم كريك",
 'snowbound-telegraph':"تلغراف الثلوج",
 'prairie-sails':"أشرعة البراري",
 'hudson-ledger':"سجل هدسون",
 'atlantic-passage':"عبور الأطلسي",
 'last-five-minutes':"الدقائق الخمس الأخيرة",
 'westminster-vows':"عهود وستمنستر",
 'reform-club-countdown':"العد التنازلي لنادي الإصلاح",
 'meridian-epilogue':"خاتمة خط الزوال",
 'stained-glass':"زجاج معشّق"
};
const themeLabelFor=name=>rtl()?themeLabelsAr[name]:themeLabels[name];
/* LT-12: separate, offline typography preferences. System font stacks avoid
 * font downloads and extra memory. Unsupported values never reach CSS. */
const readerMaterialChoices=['book','fibre','white','cream','comfort','night'];
function applyReaderMaterial(name){
 if(!readerMaterialChoices.includes(name))return false;
 document.documentElement.dataset.ltReaderMaterial=name;
 put('ltReaderMaterial',name);return true;
}
function loadReaderMaterial(){
 const saved=typeof get==='function'?get('ltReaderMaterial','book'):'book';
 document.documentElement.dataset.ltReaderMaterial=
  readerMaterialChoices.includes(saved)?saved:'book';
}
const fontChoices={ar:['sans','naskh','ruqaa','kufi','hand','lateef','katibeh'],en:['serif','sans','humanist','mono','hand','caveat','kalam']};
const fontDefaults={ar:'sans',en:'serif'};
const fontKeys={ar:'fontArabic',en:'fontEnglish'};
function safeOffset(value){
 const number=Number(value);
 return Number.isFinite(number)?Math.max(0,Math.min(number,10000000)):0;
}
function captureReaderAnchor(){
 const viewport=Number.isFinite(global.innerHeight)?global.innerHeight:
  (document.documentElement.clientHeight||800);
 for(const node of document.querySelectorAll('.reader .sentence')){
  const paragraph=Number(node.dataset?.i);
  const box=node.getBoundingClientRect?.();
  if(!Number.isInteger(paragraph)||paragraph<0||!box||
     !Number.isFinite(box.top)||!Number.isFinite(box.bottom)||
     box.bottom<=52||box.top>=viewport)continue;
  return {paragraph,viewportOffset:Math.max(-4096,Math.min(4096,box.top))};
 }
 return null;
}
function preserveReaderPosition(change){
 const active=state.page==='reader'&&state.story;
 const storyId=active?state.story.id:null;
 const chapterIndex=state.chapter;
 const fallback=safeOffset(global.scrollY||0);
 const anchor=active?captureReaderAnchor():null;
 if(active)put('scroll_'+storyId+'_'+chapterIndex,fallback);
 change();
 if(!active)return;
 const restore=()=>{
  if(state.page!=='reader'||state.story?.id!==storyId||state.chapter!==chapterIndex)return;
  let y=fallback;
  if(anchor&&Array.isArray(state.story.chapters?.[chapterIndex]?.paragraphs)&&
     anchor.paragraph<state.story.chapters[chapterIndex].paragraphs.length){
   const node=Array.from(document.querySelectorAll('.reader .sentence'))
    .find(el=>Number(el.dataset?.i)===anchor.paragraph);
   const top=node?.getBoundingClientRect?.().top;
   const current=Number.isFinite(global.scrollY)?global.scrollY:0;
   const candidate=current+top-anchor.viewportOffset;
   if(Number.isFinite(top)&&Number.isFinite(candidate))y=safeOffset(candidate);
  }
  if(typeof global.scrollTo==='function')global.scrollTo(0,y);
  // After CSS profile changes, rebuild actual paper groups at the new glyph
  // width. The enhanced reader restores the same visible paragraph afterward.
  if(typeof global.LinguaReflowReader==='function')global.LinguaReflowReader(anchor);
 };
 if(typeof global.requestAnimationFrame==='function')global.requestAnimationFrame(restore);
 else if(typeof global.setTimeout==='function')global.setTimeout(restore,0);
 else restore();
}
function applyFont(lang,name){
 if(!Object.prototype.hasOwnProperty.call(fontChoices,lang)||!fontChoices[lang].includes(name))return false;
 preserveReaderPosition(()=>{
  document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']=name;
  put(fontKeys[lang],name);
 });
 return true;
}
function loadFonts(){
 for(const lang of ['ar','en']){
  const saved=typeof get==='function'?get(fontKeys[lang],fontDefaults[lang]):fontDefaults[lang];
  const safe=fontChoices[lang].includes(saved)?saved:fontDefaults[lang];
  document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']=safe;
 }
}

/* LT-12: independent reading-size profiles. Arabic keeps natural shaping
 * (no added letter spacing); English gets a small spacing increase only in
 * the large profile. All preferences are local and validated. */
const readingSizeChoices={ar:['compact','comfortable','large'],en:['compact','comfortable','large']};
const readingSizeDefaults={ar:'comfortable',en:'comfortable'};
const readingSizeKeys={ar:'readingSizeArabic',en:'readingSizeEnglish'};
function applyReadingSize(lang,name){
 if(!Object.prototype.hasOwnProperty.call(readingSizeChoices,lang)||!readingSizeChoices[lang].includes(name))return false;
 preserveReaderPosition(()=>{
  document.documentElement.dataset[lang==='ar'?'ltArabicSize':'ltEnglishSize']=name;
  put(readingSizeKeys[lang],name);
 });
 return true;
}
function loadReadingSizes(){
 for(const lang of ['ar','en']){
  const saved=typeof get==='function'?get(readingSizeKeys[lang],readingSizeDefaults[lang]):readingSizeDefaults[lang];
  const safe=readingSizeChoices[lang].includes(saved)?saved:readingSizeDefaults[lang];
  document.documentElement.dataset[lang==='ar'?'ltArabicSize':'ltEnglishSize']=safe;
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
const validTheme=name=>selectableThemeNames.includes(name);
function applyTheme(name){
 if(!validTheme(name))return false;
 const old=validTheme(state.uiTheme)?state.uiTheme:'aurora';
 document.body.classList.remove('theme-'+old);
 state.uiTheme=name;
 document.body.classList.add('theme-'+name);
 put('uiTheme',name);
 applyCustomThemeColors();
 document.querySelectorAll('.lt-theme-choice').forEach(button=>{
  const selected=button.dataset.theme===name;
  button.classList.toggle('selected',selected);
  button.setAttribute('aria-pressed',String(selected));
 });
 return true;
}
// Theme source definitions are immutable APK assets; deleting one at runtime
// safely hides it from the gallery. User palettes remain local and portable.
const themeColorKeys=['a','b','c','d'];
const isThemeHex=value=>typeof value==='string'&&/^#[a-f0-9]{6}$/i.test(value);
function hiddenThemeNames(){const saved=get('ltHiddenThemes',[]);return Array.isArray(saved)?saved.filter(validTheme):[];}
function customThemeColors(){const value=get('ltThemeCustomColors',{});return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}
function applyCustomThemeColors(){
 const body=document.body;
 if(!body?.style||typeof body.style.removeProperty!=='function')return false;
 for(const name of ['--lt-glass-a','--lt-glass-b','--lt-glass-c','--lt-glass-d','--lt-theme-angle','--accent'])body.style.removeProperty(name);
 const colors=customThemeColors()[state.uiTheme];
 const customOn=!!(colors&&typeof colors==='object'&&themeColorKeys.some(key=>isThemeHex(colors[key])));
 body.classList?.toggle('lt-has-custom-gradient',customOn);
 if(!customOn)return;
 for(const key of themeColorKeys)if(isThemeHex(colors[key]))body.style.setProperty('--lt-glass-'+key,colors[key]);
 if(isThemeHex(colors.a))body.style.setProperty('--accent',colors.a);
 if(Number.isInteger(colors.angle)&&colors.angle>=0&&colors.angle<=360)body.style.setProperty('--lt-theme-angle',colors.angle+'deg');
}
function openThemeEditor(name,origin){
 const sheet=document.querySelector('.lt-settings-sheet');
 if(!sheet||!validTheme(name))return;
 sheet.querySelector('.lt-theme-editor')?.remove();
 const panel=document.createElement('section');panel.className='lt-theme-editor';
 panel.setAttribute('aria-label',rtl()?'تخصيص الثيم':'Customize theme');
 const title=document.createElement('h4');title.textContent=(rtl()?'تخصيص: ':'Customize: ')+themeLabelFor(name);panel.appendChild(title);
 const preview=document.createElement('div');preview.className='lt-theme-live-preview';
 preview.setAttribute('role','img');
 preview.setAttribute('aria-label',rtl()?'معاينة التدرج':'Gradient preview');
 panel.appendChild(preview);
 function syncPreview(){
  const c=customThemeColors()[name]||{},angle=Number.isInteger(c.angle)?c.angle:135;
  const palette=['a','b','c','d'].map((key,i)=>isThemeHex(c[key])?c[key]:['#6e77ec','#c078e8','#6bd8ea','#e2c2f7'][i]);
  const background='linear-gradient('+angle+'deg,'+palette.join(',')+')';
  preview.style.background=background;
  const swatch=origin?.querySelector('.lt-theme-swatch');
  if(swatch)swatch.style.background=background;
 }
 syncPreview();
 const saved=customThemeColors()[name]||{};
 for(const [key,defaultHex,labelAr,labelEn] of [
  ['a','#6e77ec','اللون الأساسي','Primary color'],
  ['b','#c078e8','لون الانعكاس','Reflection color'],
  ['c','#6bd8ea','لون الإضاءة','Highlight color'],
   ['d','#e2c2f7','اللون الرابع','Fourth gradient color']
 ]){
  const label=document.createElement('label');label.className='lt-theme-color-setting';
  label.textContent=rtl()?labelAr:labelEn;
  const input=document.createElement('input');input.type='color';input.value=isThemeHex(saved[key])?saved[key]:defaultHex;
  input.setAttribute('aria-label',label.textContent);
  input.addEventListener('input',()=>{
   const updated=customThemeColors();
   updated[name]={...(updated[name]||{}),[key]:input.value};
   put('ltThemeCustomColors',updated);applyTheme(name);
   syncPreview();
  });
  label.appendChild(input);panel.appendChild(label);
 }
 const angleLabel=document.createElement('label');angleLabel.className='lt-theme-color-setting';
 angleLabel.textContent=rtl()?'زاوية التدرج':'Gradient angle';
 const angleInput=document.createElement('input');angleInput.type='range';angleInput.min='0';
 angleInput.max='360';angleInput.step='5';angleInput.value=Number.isInteger(saved.angle)?String(saved.angle):'135';
 angleInput.setAttribute('aria-label',angleLabel.textContent);
 angleInput.addEventListener('input',()=>{
  const updated=customThemeColors();
  updated[name]={...(updated[name]||{}),angle:Number(angleInput.value)};
  put('ltThemeCustomColors',updated);applyTheme(name);syncPreview();
 });
 angleLabel.appendChild(angleInput);panel.appendChild(angleLabel);
 const presetRow=document.createElement('div');presetRow.className='lt-theme-presets';
 const presets=[
 ['sapphire','#1768ff','#6b4dff','#28d9ff','#a0caff'],
 ['sunset','#ff6c47','#ed4494','#ffbd59','#fce8b2'],
 ['mint','#008d85','#52beaa','#a8f0c6','#dffbea'],
 ['noir','#273a50','#687989','#ad9ba6','#eff2fa'],
 ['rose','#f63c89','#ac4ce1','#ffc1cd','#ecbcff'],
 ['sand','#786147','#bc9770','#e6c89a','#f7edda'],
 ['lagoon','#044f70','#149cac','#75d4cf','#d8fcf2'],
 ['amethyst','#42316e','#8065c9','#bf95f8','#ead4ff'],
 ['forest','#183e35','#4b8c6c','#a1d9b1','#e7f3d9'],
 ['peach','#8c4e6d','#d7809b','#ffc3aa','#fff1d8'],
 ['ice','#1c577a','#6d95c5','#b0e6ee','#f0fbff'],
 ['ember','#682f31','#b95139','#e9a756','#ffe0a4'],
 ['Royal Gold','#221c19','#715128','#d3ae68','#f4e0ae','ذهب ملكي'],
 ['Imperial Gold','#171a21','#54442d','#bd9452','#e9c889','ذهب إمبراطوري'],
 ['Champagne','#6d5d53','#bda487','#f3dfbc','#fff7e8','شامبانيا'],
 ['Orange & Sage','#9b613f','#eeaa80','#80bca5','#e9f6e6','برتقالي وأخضر'],
 ['Orchid & Rose','#483369','#a367be','#eaa4c8','#f6dbec','أرجواني ووردي']];
 for(const [id,a,b,c,d,arabicLabel] of presets){
  const label=rtl()?(arabicLabel||id):id;
  const button=addButton(presetRow,label,()=>{
   const updated=customThemeColors();
   updated[name]={a,b,c,d,angle:Number(angleInput.value)};
   put('ltThemeCustomColors',updated);applyTheme(name);
   panel.querySelectorAll('input[type="color"]').forEach((input,index)=>input.value=[a,b,c,d][index]);
   syncPreview();
  },'lt-theme-preset');
  button.style.background='linear-gradient(135deg,'+[a,b,c,d].join(',')+')';
  button.setAttribute('aria-label',rtl()?'تدرج '+label:'Gradient '+label);
 }
 panel.appendChild(presetRow);
 const actions=document.createElement('div');actions.className='lt-theme-editor-actions';
 addButton(actions,rtl()?'تطبيق الثيم':'Use theme',()=>{applyTheme(name);},'secondary');
 addButton(actions,rtl()?'إعادة الألوان الأصلية':'Reset colors',()=>{
  const custom=customThemeColors();delete custom[name];put('ltThemeCustomColors',custom);
  applyCustomThemeColors();openThemeEditor(name,origin);
 },'secondary');
 panel.appendChild(actions);sheet.querySelector('.lt-theme-gallery')?.after(panel);
 panel.querySelector('input')?.focus();
}
let settingsModalActive=false;
let settingsReturnFocus=null;
let settingsRootWasInert=false;
function beginSettingsModal(){
 const root=document.getElementById('root');
 const active=document.activeElement;
 const toggle=document.getElementById('lt-menu-toggle');
 settingsReturnFocus=active&&active!==document.body&&!active.closest?.('#lt-drawer')?active:toggle;
 settingsRootWasInert=!!root?.inert;
 if(root)root.inert=true;
 settingsModalActive=true;
 return true;
}
function releaseSettingsModal(){
 if(!settingsModalActive||document.querySelector('.lt-settings-overlay'))return false;
 settingsModalActive=false;
 const root=document.getElementById('root');
 if(root)root.inert=settingsRootWasInert;
 const target=settingsReturnFocus;
 settingsReturnFocus=null;
 settingsRootWasInert=false;
 if(target?.isConnected)target.focus?.();
 else document.getElementById('lt-menu-toggle')?.focus?.();
 return true;
}
const originalCloseSheet=closeSheet;
closeSheet=function(e){
 originalCloseSheet(e);
 releaseSettingsModal();
};
function closeDrawer(restoreFocus=true){
 const drawer=document.getElementById('lt-drawer');
 const backdrop=document.getElementById('lt-drawer-backdrop');
 const toggle=document.getElementById('lt-menu-toggle');
 if(!drawer)return false;
 opened=false;
 drawer.classList.remove('open');
 drawer.setAttribute('aria-hidden','true');
 drawer.inert=true;
 const dock=document.querySelector('.lt-library-dock');if(dock)dock.inert=false;
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
 const dock=document.querySelector('.lt-library-dock');if(dock)dock.inert=true;
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
 const host=document.getElementById('modals');
 if(!host)return;
 beginSettingsModal();
 closeDrawer(false);
 host.innerHTML='';
 const overlay=document.createElement('div');
 overlay.className='overlay lt-settings-overlay';
 overlay.addEventListener('click',event=>{if(event.target===overlay)closeSheet();});
 const sheet=document.createElement('section');
 sheet.className='sheet lt-settings-sheet';sheet.setAttribute('role','dialog');
 sheet.setAttribute('aria-modal','true');
 sheet.setAttribute('aria-label',settingsText());
 const heading=document.createElement('h2');
 const header=document.createElement('header');
 header.className='lt-settings-heading';
 heading.textContent=settingsText();header.appendChild(heading);
 const closeButton=addButton(header,rtl()?'إغلاق':'Close',()=>closeSheet(),'secondary');
 sheet.appendChild(header);
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
 for(const name of selectableThemeNames){
  // Exactly the six approved designs are always visible, including after old backups.
  let longPressTimer=null,longPressed=false,startX=0,startY=0;
  const b=addButton(gallery,themeLabelFor(name),()=>{
   if(longPressed){longPressed=false;return;}
   applyTheme(name);
  },'lt-theme-choice lt-theme-'+name);
  b.setAttribute('aria-label',themeLabelFor(name)+(rtl()?'؛ اضغط مطوّلًا للتخصيص':' — long press to customize'));
  b.addEventListener('pointerdown',event=>{
   if(event.button!==0)return;
   longPressed=false;startX=event.clientX;startY=event.clientY;
   longPressTimer=global.setTimeout(()=>{
    longPressTimer=null;longPressed=true;openThemeEditor(name,b);
   },560);
  });
  const cancel=()=>{if(longPressTimer!==null){global.clearTimeout(longPressTimer);longPressTimer=null;}};
  b.addEventListener('pointermove',event=>{
   if(Math.abs(event.clientX-startX)>11||Math.abs(event.clientY-startY)>11)cancel();
  });
  b.addEventListener('pointerup',cancel);
  b.addEventListener('pointercancel',cancel);
  b.addEventListener('contextmenu',event=>{event.preventDefault();cancel();longPressed=true;openThemeEditor(name,b);});
  b.addEventListener('keydown',event=>{
   if((event.key==='F10'&&event.shiftKey)||event.key==='ContextMenu'){
    event.preventDefault();openThemeEditor(name,b);
   }
  });
  b.dataset.theme=name;
  b.setAttribute('aria-pressed',String(state.uiTheme===name));
  b.classList.toggle('selected',state.uiTheme===name);
  const swatch=document.createElement('span');swatch.className='lt-theme-swatch';
  swatch.setAttribute('aria-hidden','true');b.prepend(swatch);
 }
 sheet.appendChild(gallery);
 const themeHint=document.createElement('p');themeHint.className='quiet';
 themeHint.textContent=rtl()?'اضغط مطوّلًا لتعديل الألوان.':'Hold to adjust colours.';
 sheet.appendChild(themeHint);
 // Materials change paper, not the six app themes nor physical curl.
 const materialLabel=document.createElement('label');
 materialLabel.className='lt-font-setting lt-paper-material-setting';
 const materialTitle=document.createElement('span');
 materialTitle.textContent=rtl()?'شكل صفحة القراءة':'Reading paper';
 materialLabel.appendChild(materialTitle);
 const materialSelect=document.createElement('select');
 materialSelect.id='lt-reader-material-select';
 materialSelect.setAttribute('aria-label',materialTitle.textContent);
 const materialText={
  book:['كتاب طبيعي','Bound book'],fibre:['ورق حقيقي','Textured paper'],
  white:['ورقة بيضاء','Clean white'],cream:['ورقة صفراء','Warm cream'],
  comfort:['رمادي مريح للعين','Soft grey'],night:['ليلي مريح للعين','Low-glare night']
 };
 for(const id of readerMaterialChoices){
  const item=document.createElement('option');item.value=id;
  item.textContent=materialText[id][rtl()?0:1];materialSelect.appendChild(item);
 }
 materialSelect.value=document.documentElement.dataset.ltReaderMaterial||'book';
 materialSelect.addEventListener('change',()=>applyReaderMaterial(materialSelect.value));
 const typography=document.createElement('section');
 typography.className='lt-reading-preferences';
 materialLabel.appendChild(materialSelect);typography.appendChild(materialLabel);
 const specimen=document.createElement('figure');
 specimen.className='lt-type-specimen';
 const caption=document.createElement('figcaption');
 caption.textContent=rtl()?'معاينة خط القراءة':'Reading type preview';
 specimen.appendChild(caption);
 for(const [lang,dir,text] of [['ar','rtl','حول العالم في ثمانين يومًا'],
  ['en','ltr','Around the World in Eighty Days']]){
  const line=document.createElement('p');
  line.lang=lang;line.dir=dir;line.textContent=text;specimen.appendChild(line);
 }
 typography.appendChild(specimen);sheet.appendChild(typography);
 const fontsHeading=document.createElement('h3');
 fontsHeading.textContent=rtl()?'خطوط القراءة':'Reading fonts';
 typography.appendChild(fontsHeading);
 for(const lang of ['ar','en']){
  const label=document.createElement('label');label.className='lt-font-setting';
  const title=document.createElement('span');
  title.textContent=lang==='ar'?(rtl()?'الخط العربي':'Arabic font'):(rtl()?'الخط الإنجليزي':'English font');
  label.appendChild(title);
  const select=document.createElement('select');
  select.setAttribute('aria-label',title.textContent);
  const options=lang==='ar'?
   [{value:'sans',ar:'نسخ عصري',en:'Modern Arabic'},{value:'naskh',ar:'نسخ تقليدي',en:'Classic Naskh'},
    {value:'ruqaa',ar:'رقعة',en:'Ruqaa'},{value:'kufi',ar:'كوفي',en:'Kufi'},
    {value:'hand',ar:'خط يدوي',en:'Handwriting'},
    {value:'lateef',ar:'لطيف ـ نسخ مخطوط',en:'Lateef manuscript'},
    {value:'katibeh',ar:'كاتبة ـ خط أصيل',en:'Katibeh calligraphy'}]:
   [{value:'serif',ar:'أدبي',en:'Literary serif'},{value:'sans',ar:'عصري',en:'Modern sans'},
    {value:'humanist',ar:'إنساني',en:'Humanist'},{value:'mono',ar:'آلة كاتبة',en:'Monospace'},
    {value:'hand',ar:'خط يدوي',en:'Handwriting'},
    {value:'caveat',ar:'كافيات ـ خط يدوي',en:'Caveat handwriting'},
    {value:'kalam',ar:'قلم ـ كتابة باليد',en:'Kalam handwritten'}];
  for(const option of options){
   const item=document.createElement('option');
   item.value=option.value;item.textContent=rtl()?option.ar:option.en;
   select.appendChild(item);
  }
  select.value=document.documentElement.dataset[lang==='ar'?'ltArabicFont':'ltEnglishFont']||fontDefaults[lang];
  select.addEventListener('change',()=>applyFont(lang,select.value));
  label.appendChild(select);typography.appendChild(label);
 }
 const sizeHeading=document.createElement('h3');
 sizeHeading.textContent=rtl()?'حجم النص وتباعد السطور':'Text size & line spacing';
 typography.appendChild(sizeHeading);
 for(const lang of ['ar','en']){
  const label=document.createElement('label');label.className='lt-font-setting lt-reading-size-setting';
  const title=document.createElement('span');
  title.textContent=lang==='ar'?(rtl()?'حجم النص العربي':'Arabic reading size'):(rtl()?'حجم النص الإنجليزي':'English reading size');
  label.appendChild(title);
  const select=document.createElement('select');
  select.setAttribute('aria-label',title.textContent);
  const options=[
   {value:'compact',ar:'مضغوط',en:'Compact'},
   {value:'comfortable',ar:'مريح',en:'Comfortable'},
   {value:'large',ar:'كبير ومسافات أوسع',en:'Large · wider spacing'}
  ];
  for(const option of options){
   const item=document.createElement('option');
   item.value=option.value;item.textContent=rtl()?option.ar:option.en;
   select.appendChild(item);
  }
  const key=lang==='ar'?'ltArabicSize':'ltEnglishSize';
  select.value=document.documentElement.dataset[key]||readingSizeDefaults[lang];
  select.addEventListener('change',()=>applyReadingSize(lang,select.value));
  label.appendChild(select);typography.appendChild(label);
 }
 // One primary licensed-audio panel; the extra synthesized presets are
 // available on demand rather than duplicating a giant settings form.
 if(global.LinguaAmbience){
  const extras=document.createElement('details');extras.className='lt-generated-audio-extras';
  const summary=document.createElement('summary');
  summary.textContent=rtl()?'أجواء إلكترونية إضافية (اختياري)':'Extra synthesized ambience (optional)';
  extras.appendChild(summary);
  global.LinguaAmbience.controls(extras,rtl());
  sheet.appendChild(extras);
 }
 if(global.LinguaLicensedAudio)global.LinguaLicensedAudio.controls(sheet,rtl());
 overlay.appendChild(sheet);host.appendChild(overlay);
 closeButton.focus({preventScroll:true});
}
/* LT-07/03: search actual bilingual passages of all offline chapters, not
 * only card titles. Index only when the user opens search, cap result count,
 * and never invent dictionary meanings or replace a book's original text. */
let chapterSearchCache=new WeakMap();
function invalidateChapterSearch(){
 chapterSearchCache=new WeakMap();
}
// Search folds common Arabic spelling variants and vowel marks without
// changing the original bilingual text displayed to readers. Do not
// normalize source paragraphs in the catalog itself.
function foldChapterSearch(value){
 return String(value).normalize('NFKC').toLocaleLowerCase()
  .replace(/[\u064b-\u065f\u0670\u0640]/gu,'')
  .replace(/[أإآٱ]/gu,'ا').replace(/ى/gu,'ي')
  .replace(/ؤ/gu,'و').replace(/ئ/gu,'ي').replace(/ة/gu,'ه')
  .replace(/[’‘]/gu,"'").replace(/\s+/gu,' ').trim();
}
// Lazy per-paragraph normalization keeps a cold mobile search interruptible.
function *passages(query,novelsOnly){
 for(const story of catalog.stories){
  if(novelsOnly&&!isFullLengthNovel(story))continue;
  for(const [chapter,item] of story.chapters.entries()){
   for(const [paragraph,p] of item.paragraphs.entries()){
    if(typeof p?.en!=='string'||typeof p.ar!=='string')continue;
    let row=chapterSearchCache.get(p);
    if(!row||row.en!==p.en||row.ar!==p.ar){
     row={en:p.en,ar:p.ar,enFold:foldChapterSearch(p.en),arFold:foldChapterSearch(p.ar)};
     chapterSearchCache.set(p,row);
    }
    const enIndex=row.enFold.indexOf(query),arIndex=row.arFold.indexOf(query);
    yield enIndex<0&&arIndex<0?null:{storyId:story.id,storyTitle:(rtl()?story.titleAr:story.titleEn)||story.title,
     chapter,chapterTitle:(rtl()?item.titleAr:item.titleEn)||item.title,paragraph,en:p.en,ar:p.ar,enIndex,arIndex};
   }
  }
 }
}
function searchChapters(query,limit=40,novelsOnly=false){
 const q=foldChapterSearch(query||'');
 if(String(query||'').length>80||q.length<2)return [];
 const hits=[],cap=Math.max(1,Math.min(40,Number.isInteger(limit)?limit:40));
 for(const hit of passages(q,novelsOnly)){
  if(hit)hits.push(hit);
  if(hits.length===cap)break;
 }
 return hits;
}
function passageRange(text,index,length){
 // Resolve folded UTF-16 positions back into the unmodified source. Arabic
 // tashkeel, repeated whitespace and compatibility ligatures change offsets.
 if(index<0)return null;
 const boundary=n=>{
  let lo=0,hi=text.length;
  while(lo<hi){
   const mid=(lo+hi)>>>1;
   if(foldChapterSearch(text.slice(0,mid)).length<n)lo=mid+1;else hi=mid;
  }
  return lo;
 };
 let start=Math.max(0,boundary(index+1)-1),end=boundary(index+length);
 while(end<text.length&&/[\p{M}]/u.test(text[end]))end++;
 return {start,end};
}
function excerpt(node,text,range){
 if(!range){node.textContent=text.length>125?text.slice(0,124)+'…':text;return;}
 const before=Math.max(0,range.start-55),after=Math.min(text.length,range.end+85);
 const mark=document.createElement('mark');mark.textContent=text.slice(range.start,range.end);
 node.append((before?'…':'')+text.slice(before,range.start),mark,text.slice(range.end,after)+(after<text.length?'…':''));
}
let chapterSearchTimer=null;
function closeChapterSearch(){
 if(chapterSearchTimer!==null){global.clearTimeout(chapterSearchTimer);chapterSearchTimer=null;}
 const root=document.getElementById('root');
 if(root)root.inert=false;
 closeSheet();
}
function focusPassage(hit,offset){
 const candidates=Array.from(document.querySelectorAll('.reader .sentence')).filter(node=>
  Number(node.dataset?.i)===hit.paragraph&&!node.closest?.('[aria-hidden="true"],.lt-curl-stage'));
 const node=candidates.find(n=>(Number(n.dataset.ltFragmentStart)||0)<=offset&&
  (Number(n.dataset.ltFragmentEnd)||Infinity)>offset)||candidates[0];
 if(!node)return;
 node.classList?.add?.('lt-search-target');node.setAttribute?.('tabindex','-1');
 node.scrollIntoView?.({block:'center',behavior:'instant'});node.focus?.({preventScroll:true});
 global.setTimeout?.(()=>node.classList?.remove?.('lt-search-target'),2600);
}
function jumpToChapterHit(hit){
 const story=catalog.stories.find(s=>s.id===hit?.storyId);
 if(!story||!Number.isInteger(hit.chapter)||!Number.isInteger(hit.paragraph)||
    !story.chapters[hit.chapter]?.paragraphs[hit.paragraph])return false;
 closeChapterSearch();
 openStory(hit.storyId,{passage:hit});
 return true;
}
function openChapterSearch(){
 if(state.page!=='library')return false;
 closeDrawer(false);
 const host=document.getElementById('modals');
 if(!host)return false;
 host.innerHTML='';
 const overlay=document.createElement('div');
 overlay.className='overlay lt-search-overlay';
 const sheet=document.createElement('section');
 sheet.className='sheet lt-chapter-search';
 sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');
 sheet.setAttribute('aria-label',rtl()?'بحث في نصوص الروايات':'Search inside novels');
 const heading=document.createElement('h2');
 heading.textContent=rtl()?'ابحث في النصوص الإنجليزية والعربية':'Search English and Arabic passages';
 sheet.appendChild(heading);
 const hint=document.createElement('p');hint.className='quiet';
 hint.textContent=rtl()?'نتائج من فصول الروايات الموجودة على الجهاز.':'Results from offline novel chapters.';
 sheet.appendChild(hint);
 const input=document.createElement('input');input.type='search';input.maxLength=80;
 input.className='lt-chapter-query';
 input.setAttribute('aria-label',rtl()?'كلمة أو عبارة من القصة':'Word or phrase in a story');
 input.placeholder=rtl()?'اكتب حرفين أو أكثر…':'Type at least two characters…';
 sheet.appendChild(input);
 const status=document.createElement('p');status.className='quiet';
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 sheet.appendChild(status);
 const results=document.createElement('div');results.className='lt-chapter-results';
 sheet.appendChild(results);
 const footer=document.createElement('footer');
 addButton(footer,rtl()?'إغلاق':'Close',()=>{
  closeChapterSearch();document.getElementById('lt-menu-toggle')?.focus();
 },'secondary');
 sheet.appendChild(footer);
 overlay.addEventListener('click',event=>{
  if(event.target===overlay){closeChapterSearch();document.getElementById('lt-menu-toggle')?.focus();}
 });
 overlay.appendChild(sheet);host.appendChild(overlay);
 const root=document.getElementById('root');
 if(root)root.inert=true; // keep background controls outside modal focus order
 let generation=0;
 const render=async()=>{
  const ticket=++generation;
  chapterSearchTimer=null;results.replaceChildren();
  const q=foldChapterSearch(input.value);
  const current=()=>ticket===generation&&sheet.isConnected&&q===foldChapterSearch(input.value);
  if(q.length<2){status.textContent=rtl()?'اكتب حرفين على الأقل.':'Enter at least two characters.';return;}
  status.textContent=rtl()?'جارٍ البحث في الفصول المحلية…':'Searching offline chapters…';
  const hits=[];
  let incomplete=false;
  try{
   for(const story of catalog.stories.filter(s=>s.lazyBook&&isFullLengthNovel(s))){
    await global.LinguaContentLoader.ensureStory(story.id);
    if(!current())return;
   }
  }catch(_){incomplete=true;}
  if(!current())return;
  let sliceStart=performance.now();
  for(const hit of passages(q,true)){
   if(hit)hits.push(hit);
   if(hits.length===40)break;
   if(performance.now()-sliceStart>7){
    await new Promise(resolve=>global.setTimeout(resolve,0));
    if(!current())return;
    sliceStart=performance.now();
   }
  }
  status.textContent=(rtl()?'نتائج مطابقة: ':'Matches: ')+hits.length+
   (hits.length===40?(rtl()?' (أول 40)':' (first 40)'):'');
  if(incomplete)status.textContent+=rtl()?' · تعذّر فتح بعض الفصول المحلية.':' · Some offline chapters could not be loaded.';
  if(!hits.length)return;
  for(const hit of hits){
   const button=addButton(results,'',()=>jumpToChapterHit(hit),'lt-chapter-hit');
   const title=document.createElement('strong');
   title.textContent=hit.storyTitle+' · '+hit.chapterTitle+' · '+
    (rtl()?'فقرة ':'Paragraph ')+(hit.paragraph+1);
   button.appendChild(title);
   const en=document.createElement('span');en.lang='en';en.dir='ltr';
   hit.enRange=passageRange(hit.en,hit.enIndex,q.length);
   excerpt(en,hit.en,hit.enRange);button.appendChild(en);
   const ar=document.createElement('span');ar.lang='ar';ar.dir='rtl';
   hit.arRange=passageRange(hit.ar,hit.arIndex,q.length);
   excerpt(ar,hit.ar,hit.arRange);button.appendChild(ar);
  }
 };
 input.addEventListener('input',()=>{
  generation++;results.replaceChildren();
  if(chapterSearchTimer!==null)global.clearTimeout(chapterSearchTimer);
  chapterSearchTimer=global.setTimeout(render,170);
 });
 render();input.focus();return true;
}
function removeLegacyGenreFilters(section){
 const filters=section.querySelector('.filters');
 if(!filters)return false;
 filters.remove();
 return true;
}

/* Editorial promise: the primary library is NOVELS, never two-page stories.
 * The complete source catalog stays in memory/storage for old reading progress,
 * saved words and backups. The 37-chapter licensed classic is lazy metadata. */
function isFullLengthNovel(story){
 if(!story||typeof story!=='object')return false;
 const loaded=Array.isArray(story.chapters)?story.chapters.length:0;
 const declared=Number.isInteger(story.totalChapters)?story.totalChapters:0;
 const chapters=Math.max(loaded,declared);
 // A twelve-part micro-story still isn't a full adult book when verified
 // word count proves it is short.
 const words=Number(story.fullWordCount);
 if(story.fullWordCount!=null&&(!Number.isInteger(words)||words<25000))return false;
 // Complete Arabic heritage volumes contain nested fables and belong
 // beside novels, not under the false label of police fiction.
 if(story.workType==='heritage-volume'){
  return chapters>=1&&Number.isInteger(words)&&words>=25000&&
   story.completeEdition===true&&story.companionComplete===true&&
   story.editorialApproved===true&&story.rightsReviewed===true;
 }
 return chapters>=12;
}
// Keep live novel counts and empty-state accurate after favorite/level/sort filtering.
// The legacy source catalog, bookmarks and saved words must not be touched.
function refreshNovelShelf(section){
 const shelf=section?.querySelector('.shelf.lt-novel-shelf');
 if(!shelf)return;
 const cards=[...shelf.querySelectorAll('.lt-novel-card')];
 const visible=cards.filter(card=>!card.hidden).length;
 const onlyFavorites=global.StoryLensExtras?.discoveryState().favoritesOnly===true;
 for(const button of section.querySelectorAll('.lt-collection-choice')){
  button.setAttribute('aria-pressed',String(button.dataset.favorites===String(onlyFavorites)));
 }
 const counter=section.querySelector('.stl-visible-count');
 if(counter)counter.textContent=(rtl()?'الكتب الظاهرة: ':'Visible books: ')+visible+' / '+cards.length;
 section.querySelector('.lt-novel-empty')?.remove();
 if(visible)return;
 const empty=document.createElement('p');
 empty.className='lt-novel-empty';
 empty.textContent=rtl()
  ?'لا توجد كتب كلاسيكية مطابقة للبحث أو مستوى اللغة أو المفضلة حاليًا. غيّر الفلاتر لعرض الكتب المتاحة.'
  :'No complete classic book matches this search, level, or favorites. Adjust filters to view available books.';
 shelf.parentNode.insertBefore(empty,shelf.nextSibling);
}
function decorateNovelShelf(section){
 const shelf=section?.querySelector('.shelf');
 if(!shelf)return;
 shelf.classList.add('lt-novel-shelf');
 const cards=Array.from(shelf.querySelectorAll('.card'));

 for(const card of cards){
  const cover=card.querySelector('[data-lt-cover-story]');
  const id=cover?.getAttribute('data-lt-cover-story');
  const story=catalog.stories.find(item=>item.id===id);
  if(!isFullLengthNovel(story)){
   // Remove only library DOM nodes. Never delete source/catalog/saved data.
   card.remove();
   continue;
  }
  card.classList.add('lt-novel-card');
  card.setAttribute('role','button');
  card.setAttribute('tabindex','0');
  card.setAttribute('aria-label',(rtl()?'افتح كتاب ':'Open book ')+story.title);
  card.addEventListener('keydown',event=>{
   if(event.target!==card||(event.key!=='Enter'&&event.key!==' '))return;
   event.preventDefault();card.click();
  });
  if(cover){
   cover.classList.add('lt-book-cover');
   const title=document.createElement('span');
   title.className='lt-book-cover-title';
   title.textContent=story.title;
   title.lang=story.sourceLanguage==='ar'?'ar':'en';
   title.dir=story.sourceLanguage==='ar'?'rtl':'ltr';
   cover.replaceChildren(title);
  }
  const content=card.querySelector('.card-content');
  if(content){
   const name=content.querySelector('h2');
   if(name){name.dir='auto';name.textContent=(rtl()?story.titleAr:story.titleEn)||story.title;}
   const description=content.querySelector('.desc');
   if(description)description.dir='auto';
   const count=Math.max(story.chapters?.length||0,story.totalChapters||0);
   const detail=document.createElement('span');
   detail.className='lt-novel-volume';
   const heritage=story.workType==='heritage-volume';
   detail.textContent=heritage
    ?(rtl()?count+' بابًا · كتاب تراثي كامل':count+' sections · Complete heritage volume')
    :(rtl()?count+' فصلًا · رواية طويلة':count+' chapters · Full-length novel');
   content.appendChild(detail);
  }
 }
 section.querySelector('.stl-empty-shelf')?.remove();
 const heading=document.createElement('div');
 heading.className='lt-novel-shelf-heading';
 const title=document.createElement('h2');
 title.textContent=rtl()?'المكتبة الكلاسيكية':'The Classics Library';
 const subtitle=document.createElement('p');
 subtitle.textContent=rtl()?'روايات طويلة ومجلدات تراثية كاملة':'Complete novels and heritage volumes';
 heading.append(title,subtitle);
 const collection=document.createElement('div');
 collection.className='lt-collection-selector';
 collection.setAttribute('role','group');
 collection.setAttribute('aria-label',rtl()?'مجموعة الكتب':'Book collection');
 for(const [favorite,ar,en] of [[false,'كل الكتب','All books'],[true,'المفضّلة','Favorites']]){
  const button=addButton(collection,rtl()?ar:en,()=>{
   if(global.StoryLensExtras.discoveryState().favoritesOnly===favorite)return;
   section.querySelector('.stl-discovery-controls .stl-choice')?.click();
  },'lt-collection-choice');
  button.dataset.favorites=String(favorite);
 }
 heading.appendChild(collection);
 shelf.parentNode.insertBefore(heading,shelf);
 refreshNovelShelf(section);
}

// Use the same saved story and reader entry point as the library. A first
// visit opens the chapter chooser without manufacturing reading progress.
function decorateEditionFeature(section){
 if(state.genre!=='all'||state.query)return;
 const hero=document.createElement('section');
 hero.className='storylens-hero';
 hero.setAttribute('aria-label',rtl()?'كتاب من مكتبتك':'Book from your library');
 const last=catalog.stories.find(s=>s.id===get('last_story',''));
 const book=last||catalog.stories.find(isFullLengthNovel);
 if(!book)return;
 const resume=Boolean(last);
 const total=book.totalChapters||book.chapters.length;
 const stored=get('chapter_'+book.id,0);
 const current=Number.isInteger(stored)?Math.max(0,Math.min(total-1,stored)):0;
 const copy=document.createElement('div');
 copy.className='lt-edition-copy';
 const label=document.createElement('small');
 label.textContent=resume?(rtl()?'أكمل القراءة':'Continue reading'):(rtl()?'من المكتبة':'From the library');
 const title=document.createElement('h2');
 title.textContent=rtl()?(book.titleAr||book.title):(book.titleEn||book.title);
 title.dir='auto';
 const location=document.createElement('p');
 location.textContent=resume?(rtl()?'الفصل ':'Chapter ')+(current+1)+' / '+total:
  total+(rtl()?' فصلًا':' chapters');
 const action=document.createElement('button');
 action.type='button';action.className='lt-edition-open';
 action.textContent=resume?(rtl()?'متابعة القراءة':'Resume reading'):(rtl()?'تصفّح الفصول':'Browse chapters');
 action.addEventListener('click',()=>{
  if(resume||!global.LinguaChapterGallery?.open(book.id))global.openStory(book.id);
 });
 const actions=document.createElement('div');
 actions.className='lt-edition-actions';
 actions.appendChild(action);
 if(resume&&global.LinguaChapterGallery?.hasChapters(book)){
  const contents=document.createElement('button');
  contents.type='button';contents.className='lt-edition-contents';
  contents.textContent=rtl()?'الفهرس':'Contents';
  contents.addEventListener('click',()=>global.LinguaChapterGallery.open(book.id));
  actions.appendChild(contents);
 }
 copy.append(label,title,location,actions);
 const plate=document.createElement('div');
 plate.className='lt-edition-plate';
 plate.setAttribute('aria-hidden','true');
 plate.setAttribute('data-lt-cover-story',book.id);
 if(book.id==='around-the-world-in-eighty-days-towle')plate.classList.add('lt-verne-atlas');
 hero.classList.add('lt-edition-feature');
 hero.replaceChildren(copy,plate);
 section.insertBefore(hero,section.querySelector('.search-label'));
 global.LinguaHydrateStoryCovers?.();
}
function decorateLibrary(){
 const section=document.querySelector('.library');
 if(!section||state.page!=='library')return;
 removeLegacyGenreFilters(section);
 opened=false;
 section.querySelector('.header .brand')?.replaceChildren(document.createTextNode('LINGUA TALES'));
 const headerTitle=section.querySelector('.header h1');
 if(headerTitle){
 const category=state.genre==='all'?null:state.genre==='arabic-originals'?{ar:'كتب أصلها عربي',en:'Arabic Originals'}:
  state.genre==='heritage'?{ar:'التراث العربي',en:'Arabic Heritage'}:catalog.genres.find(g=>g.id===state.genre);
 headerTitle.textContent=category?(rtl()?category.ar:category.en):(rtl()?'الصفحة الرئيسية':'Home');
 headerTitle.classList.add('lt-location-title');
}
 section.querySelector('.header .quiet')?.remove();
 decorateEditionFeature(section);
 section.querySelector('.stl-discovery-title')?.remove();
 section.querySelectorAll(':scope > p.quiet').forEach(p=>p.remove());
 section.querySelectorAll('.shelf .card .sub').forEach(p=>p.remove());
 decorateNovelShelf(section);
 section.querySelectorAll('.shelf [data-lt-cover-story]').forEach(cover=>{
  const item=catalog.stories.find(story=>story.id===cover.getAttribute('data-lt-cover-story'));
  if(item?.sourceLanguage==='ar'){
   const title=cover.closest('.card')?.querySelector('h2');
   title?.setAttribute('lang','ar');title?.setAttribute('dir','rtl');
  }
 });
 section.querySelector('.library-actions [aria-label="تغيير تصميم الواجهة"]')?.remove();
 const actions=section.querySelector('.library-actions');
 const searchLabel=section.querySelector('.search-label');
 if(searchLabel){
  const textNode=Array.from(searchLabel.childNodes).find(node=>node.nodeType===3);
  if(textNode)textNode.textContent=rtl()?'بحث في المكتبة':'Search the library';
  const input=searchLabel.querySelector('input');
  if(input){
   input.setAttribute('aria-label',rtl()?'بحث عن كتاب':'Search books');
   input.placeholder=rtl()?'عنوان الكتاب أو موضوعه…':'Book title or topic…';
  }
 }
 const words=actions?.querySelector('button[onclick="showWords()"]');
 if(words)words.textContent=rtl()?'مفرداتي ◀':'My words';
 const review=actions?.querySelector('button[onclick="showReview()"]');
 if(review)review.textContent=(rtl()?'مراجعة اليوم · ':'Due today · ')+state.cards.filter(c=>c.dueAt<=Date.now()).length;
 if(actions)addButton(actions,settingsText(),openSettings,'secondary lt-settings-open');
 // Full-text chapter search is intentionally opt-in: never scan the complete
 // English/Arabic corpus while rendering the library or typing a title.
 const chapterSearchLabel=section.querySelector('.search-label');
 if(chapterSearchLabel){
  // Keep the button OUTSIDE the <label> containing the title-search input.
  // Nested interactive controls inside a label break mobile focus and a11y.
  const searchButton=addButton(section,rtl()?'⌕ ابحث داخل الكتب':'⌕ Search inside books',
    openChapterSearch,'secondary lt-chapter-search-open');
  chapterSearchLabel.after(searchButton);
 }
 const header=section.querySelector('.header');
 if(!header)return;
 const toggle=addButton(header,'',()=>opened?closeDrawer():openDrawer(),'secondary lt-menu-toggle');
 // The menu is a real graphic, not selectable text under Android long-press.
 const menuGlyph=document.createElement('span');
 menuGlyph.className='lt-menu-glyph';
 menuGlyph.setAttribute('aria-hidden','true');
 toggle.replaceChildren(menuGlyph);
 toggle.type='button';
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
 genres.className='lt-genre-list';genres.setAttribute('aria-label',rtl()?'تصنيفات الكتب':'Book categories');
 // Only offer categories containing a genuine long-form work. Other stories
 // remain in the source for prior bookmarks, backups and saved vocabulary.
 const novels=catalog.stories.filter(isFullLengthNovel);
 const genresWithNovels=new Set(novels.map(story=>story.genre));
 const hasArabicNovel=novels.some(story=>story.sourceLanguage==='ar');
 const hasHeritageVolume=novels.some(story=>story.workType==='heritage-volume'&&story.genre==='heritage');
 const list=[{id:'all',ar:'جميع الكتب',en:'All books'},
  ...(hasArabicNovel?[{id:'arabic-originals',ar:'كتب عربية أصيلة',en:'Arabic Originals'}]:[]),
  ...(hasHeritageVolume?[{id:'heritage',ar:'التراث العربي',en:'Arabic Heritage'}]:[]),
  ...catalog.genres.filter(genre=>genresWithNovels.has(genre.id))];
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
 // Keep title search on the shelf. Full-text chapter search remains in the drawer.
 const titleSearch=section.querySelector('.search-label');
 const chapterSearch=section.querySelector('.lt-chapter-search-open');
 const shelfHeading=section.querySelector('.lt-novel-shelf-heading');
 if(titleSearch&&shelfHeading){
  titleSearch.classList.add('lt-shelf-search');
  shelfHeading.appendChild(titleSearch);
 }
 if(chapterSearch)drawer.appendChild(chapterSearch);
 if(actions){actions.classList.add('lt-drawer-actions');drawer.appendChild(actions);}

}
function mountSavedPlaces(section){
 if(!section||state.genre!=='all'||state.query)return;
 const marks=get('bookmarks',{})||{};
 const books=catalog.stories.filter(book=>{
  const chapter=marks[book.id]?.chapter;
  return Number.isInteger(chapter)&&chapter>=0&&chapter<(book.totalChapters||book.chapters?.length||0);
 });
 if(!books.length)return;
 books.sort((a,b)=>(Number(marks[b.id].updatedAt)||0)-(Number(marks[a.id].updatedAt)||0));
 const places=document.createElement('details');places.className='lt-saved-places';
 const summary=document.createElement('summary');
 summary.textContent=(rtl()?'إشارات القراءة':'Reading bookmarks')+' ('+books.length+')';
 places.appendChild(summary);
 const list=document.createElement('ul');
 for(const book of books){
  const index=marks[book.id].chapter;
  const row=document.createElement('li');
  const button=document.createElement('button');button.type='button';
  button.dataset.bookmarkBook=book.id;
  const title=document.createElement('strong');title.dir='auto';
  title.textContent=(rtl()?book.titleAr:book.titleEn)||book.title;
  const location=document.createElement('span');location.dir='auto';
  const chapter=book.chapters?.[index];
  const name=rtl()?chapter?.titleAr||chapter?.title:chapter?.title||chapter?.titleAr;
  location.textContent=(rtl()?'الفصل ':'Chapter ')+(index+1)+(name?' · '+name:'');
  button.append(title,location);
  button.addEventListener('click',()=>global.openStory(book.id,{bookmark:true}));
  row.appendChild(button);list.appendChild(row);
 }
 places.appendChild(list);
 section.querySelector('.lt-novel-shelf-heading')?.before(places);
}
// The three library destinations share one navigation model. Reader and
// translation keep their own Back handling and unobstructed paper viewport.
function mountLibraryNavigation(screen,route,entering){
 if(!screen)return;
 screen.classList.add('lt-library-destination');
 if(entering)screen.classList.add('lt-destination-enter');
 const nav=document.createElement('nav');
 nav.className='lt-library-dock';
 nav.setAttribute('aria-label',rtl()?'التنقل في المكتبة':'Library navigation');
 const items=[
  ['library','المكتبة','Library','M3 4h4v16H3z M9 4h4v16H9z M15 5l3-1 4 15-3 1z',()=>libraryBack()],
  ['words','مفرداتي','My words','M5 3h14v18l-7-4-7 4z',()=>showWords()],
  ['review','المراجعة','Review','M4 12a8 8 0 1 1 2 5 M4 6v6h6 M9 12l2 2 4-5',()=>showReview()]
 ];
 for(const [id,ar,en,path,open] of items){
  const button=document.createElement('button');
  button.type='button';button.className='lt-dock-link';button.dataset.route=id;
  if(id===route)button.setAttribute('aria-current','page');
  const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');
  icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');
  const line=document.createElementNS(icon.namespaceURI,'path');
  line.setAttribute('d',path);icon.appendChild(line);
  button.append(icon,document.createTextNode(rtl()?ar:en));
  button.addEventListener('click',()=>{
   if(id===route)return;
   open();
   global.scrollTo(0,0);
   const heading=document.querySelector('#root h1');
   if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  });
  nav.appendChild(button);
 }
 screen.appendChild(nav);
}
library=function(){
 const entering=!document.querySelector('#root > .library');
 originalLibrary();decorateLibrary();
 mountSavedPlaces(document.querySelector('#root > .library'));
 mountLibraryNavigation(document.querySelector('#root > .library'),'library',entering);
};
// Show the surrounding printed passage in place, without leaving study or
// updating reading progress. Older cards retain their saved sentence.
function mountStudyPassage(host,card){
 const origin=card?.origin;
 if(!origin||!Number.isSafeInteger(origin.chapter)||origin.chapter<0||
    !Number.isSafeInteger(origin.paragraph)||origin.paragraph<0)return;
 const story=catalog.stories.find(item=>item.id===origin.storyId);
 if(!story)return;
 const details=document.createElement('details');details.className='lt-study-passage';
 const summary=document.createElement('summary');
 summary.textContent=rtl()?'اقرأ سياق المقطع':'Read the surrounding passage';
 const content=document.createElement('div');
 details.append(summary,content);host.appendChild(details);
 let loaded=false,loading=false;
 async function show(){
  if(!details.open||loaded||loading)return;
  loading=true;
  content.setAttribute('aria-busy','true');
  content.textContent=rtl()?'جارٍ فتح الفصل…':'Opening chapter…';
  try{
   if(story.lazyBook)await global.LinguaContentLoader.ensureStory(story.id);
   if(!details.isConnected)return;
   const chapter=story.chapters[origin.chapter],paragraphs=chapter?.paragraphs;
   const source=paragraphs?.[origin.paragraph];
   if(!source||source.en!==card.sentence||source.ar!==card.translation){
    content.textContent=rtl()?'تغيّر موضع النص في هذه الطبعة. الجملة المحفوظة معروضة في بطاقتك.':
     'The saved passage no longer matches this edition. Your card retains the original sentence.';
    loaded=true;return;
   }
   const title=document.createElement('strong');
   title.textContent=[(rtl()?story.titleAr:story.titleEn)||story.title,
    (rtl()?chapter.titleAr:chapter.titleEn)||chapter.title].filter(Boolean).join(' · ');
   title.dir='auto';content.replaceChildren(title);
   const order=story.sourceLanguage==='ar'?['ar','en']:['en','ar'];
   for(let i=Math.max(0,origin.paragraph-1);i<=Math.min(paragraphs.length-1,origin.paragraph+1);i++){
    const row=document.createElement('div');
    if(i===origin.paragraph){
     row.className='lt-study-current';
     const label=document.createElement('small');
     label.textContent=rtl()?'موضع التعبير المحفوظ':'Saved expression';row.appendChild(label);
    }
    for(const lang of order){
     const line=document.createElement('p');line.lang=lang;line.dir=lang==='ar'?'rtl':'ltr';
     const text=paragraphs[i][lang],offset=origin.offset,surface=card.surface;
     if(i===origin.paragraph&&lang==='en'&&surface&&Number.isSafeInteger(offset)&&offset>=0&&
        text.slice(offset,offset+surface.length)===surface){
      const mark=document.createElement('mark');mark.textContent=surface;
      line.append(text.slice(0,offset),mark,text.slice(offset+surface.length));
     }else line.textContent=text;
     row.appendChild(line);
    }
    content.appendChild(row);
   }
   loaded=true;
  }catch(_){
   if(!details.isConnected)return;
   content.replaceChildren();
   addButton(content,rtl()?'تعذّر فتح الفصل · أعد المحاولة':'Could not open chapter · Retry',show,'secondary');
  }finally{
   loading=false;content.removeAttribute('aria-busy');
  }
 }
 details.addEventListener('toggle',show);
}
const renderWordsScreen=showWords;
showWords=function(){
 const entering=!document.querySelector('#root > .vocab:not(.review)');
 const previous=document.querySelector('.lt-word-filter');
 const query=previous?.value||'';
 if(opened)closeDrawer(false);
 renderWordsScreen();
 const screen=document.querySelector('#root > .vocab');
 if(!screen)return;
 const cards=Array.from(screen.querySelectorAll('.vitem'));
 if(cards.length){
  const search=document.createElement('input');search.type='search';search.className='lt-word-filter';
  search.placeholder=rtl()?'ابحث في الكلمة أو معناها':'Search words or meanings';
  search.setAttribute('aria-label',search.placeholder);search.value=query;
  const status=document.createElement('p');status.className='lt-word-filter-status';
  status.setAttribute('role','status');
  cards[0].before(search,status);
  const normalize=value=>value.normalize('NFKC').toLocaleLowerCase().trim();
  const entries=cards.map(card=>[card,normalize(Array.from(card.querySelectorAll('h3,p')).map(n=>n.textContent).join(' '))]);
  const savedCards=new Map(state.cards.map(card=>[card.term.toLowerCase(),card]));
  for(const node of cards)mountStudyPassage(node,savedCards.get(node.dataset.wordKey));
  function filter(){
   const needle=normalize(search.value);let count=0;
   for(const [card,text] of entries){card.hidden=!text.includes(needle);if(!card.hidden)count++;}
   status.textContent=needle?(rtl()?'عدد النتائج: ':'Results: ')+count:'';
  }
  search.addEventListener('input',filter);filter();
 }
 mountLibraryNavigation(screen,'words',entering);
};
const renderReviewScreen=renderReview;
renderReview=function(revealed){
 const entering=!document.querySelector('#root > .review');
 if(opened)closeDrawer(false);
 renderReviewScreen(revealed);
 const screen=document.querySelector('#root > .review');
 mountLibraryNavigation(screen,'review',entering);
 if(revealed){
  const node=screen?.querySelector('.review-card');
  if(node){
   node.classList.add('lt-answer-revealed');
   mountStudyPassage(node,state.cards.find(card=>card.term.toLowerCase()===node.dataset.wordKey));
  }
 }
};
// Resolve the foreground surface in one WebView task so Android Back cannot
// observe one overlay and subsequently dismiss a different one.
function handleAndroidBack(){
 if(global.LinguaReaderCurl?.cancelIfActive?.()||global.LinguaTalesArtInspection?.closeIfOpen?.())return true;
 if(global.LinguaChapterGallery?.isOpen)return global.LinguaChapterGallery.close();
 if(document.getElementById('lt-content-load-status')){global.LinguaContentLoader?.cancel();return true;}
 if(document.querySelector('.lt-search-overlay')){
  closeChapterSearch();document.getElementById('lt-menu-toggle')?.focus();return true;
 }
 if(document.getElementById('modals')?.firstElementChild){closeSheet();return true;}
 if(opened){closeDrawer();return true;}
 if(state.page==='library')return false;
 if(state.page==='translation')backToReader();else libraryBack();
 return true;
}
global.LinguaShell={handleAndroidBack,refreshNovelShelf,applyTheme,applyReaderMaterial,readerMaterialChoices:[...readerMaterialChoices],applyFont,applyReadingSize,applyLocale,fontChoices,readingSizeChoices,localeChoices:[...localeChoices],openDrawer,closeDrawer,openSettings,moveDiscovery,menuSide,validTheme,isFullLengthNovel,
 isDrawerOpen:()=>opened,themeNames:[...themeNames],searchChapters,invalidateChapterSearch,openChapterSearch,jumpToChapterHit};
/* LT-09/06 accessibility: a visible modal must own keyboard focus.
 * Trap Tab/Shift+Tab in Settings or the genre drawer; Escape dismisses the
 * topmost dialog. No extra listeners are installed on each library rerender. */
function handleDialogKeyboard(event){
 const settings=document.querySelector('.lt-settings-overlay .lt-settings-sheet');
 const search=document.querySelector('.lt-search-overlay .lt-chapter-search');
 const word=document.querySelector('.lt-word-sheet');
 const dialog=settings||search||word||(opened?document.getElementById('lt-drawer'):null);
 if(!dialog)return;
 if(event.key==='Escape'){
  event.preventDefault();event.stopImmediatePropagation();
  if(settings){
   closeSheet();
   document.getElementById('lt-menu-toggle')?.focus();
  }else if(search){
   closeChapterSearch();
   document.getElementById('lt-menu-toggle')?.focus();
  }else if(word)closeSheet();
  else closeDrawer();
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
// Finger-following drawer, with vertical-scroll intent gating.
function ltFinishDrawerDrag(targetOpen){
 const drawer=document.getElementById('lt-drawer'),shade=document.getElementById('lt-drawer-backdrop');
 if(!drawer)return;
 drawer.style.removeProperty('transition');shade?.style.removeProperty('transition');
 if(targetOpen)openDrawer();else closeDrawer(false);
 drawer.style.removeProperty('transform');
 shade?.style.removeProperty('opacity');shade?.style.removeProperty('visibility');
}
document.addEventListener('touchstart',event=>{
 if(state.page!=='library'||event.touches.length!==1){touch=null;return;}
 const p=event.touches[0],width=global.innerWidth||document.documentElement.clientWidth;
 if(!opened&&(rtl()?p.clientX<width-32:p.clientX>32)){touch=null;return;}
 touch={x:p.clientX,y:p.clientY,baseOpen:opened,progress:opened?1:0,drag:false,cancelled:false};
},{passive:true});
document.addEventListener('touchmove',event=>{
 if(!touch||state.page!=='library'||event.touches.length!==1)return;
 const p=event.touches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y;
 if(!touch.drag){
  if(Math.abs(dy)>Math.abs(dx)*1.2&&Math.abs(dy)>10){touch.cancelled=true;return;}
  if(touch.cancelled||Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)*1.2)return;
  touch.drag=true;
 }
 const drawer=document.getElementById('lt-drawer'),shade=document.getElementById('lt-drawer-backdrop');
 if(!drawer)return;
 const width=Math.max(1,drawer.getBoundingClientRect().width);
 const progress=Math.max(0,Math.min(1,(touch.baseOpen?1:0)+(rtl()?-dx:dx)/width));
 touch.progress=progress;
 drawer.style.transition='none';
 drawer.style.transform='translate3d('+((rtl()?1:-1)*(1-progress)*width)+'px,0,0)';
 drawer.inert=progress<.12;
 if(shade){shade.classList.add('open');shade.style.transition='none';
  shade.style.opacity=String(progress*.78);shade.style.visibility='visible';}
},{passive:true});
document.addEventListener('touchend',()=>{
 if(!touch)return;const current=touch;touch=null;
 if(current.drag&&state.page==='library')ltFinishDrawerDrag(current.progress>.45);
},{passive:true});
document.addEventListener('touchcancel',()=>{
 if(touch?.drag)ltFinishDrawerDrag(touch.baseOpen);touch=null;
},{passive:true});
document.addEventListener('click',event=>{
 if(!opened||state.page!=='library'||event.target?.closest?.('#lt-drawer,#lt-menu-toggle'))return;
 event.preventDefault();event.stopImmediatePropagation();closeDrawer(false);
},true);
/* LT-02: a single, cancellable story navigation gate. The original openStory
 * still owns history and the reader pipeline; no second state store is created. */
(function installStoryTransitions(){
 if(typeof openStory!=='function'||typeof libraryBack!=='function')return;
 const baseOpen=openStory,baseBack=libraryBack;
 let closing=false,waitingPop=false,closeTimer=null,historyFallback=null;
 let returnY=0,returnStoryId=null,returnToBookmark=false,translationScroll=0;
 const safeOffset=value=>typeof value==='number'&&Number.isFinite(value)
  ?Math.max(0,Math.min(value,10000000)):0;
 const focusWithoutScroll=node=>{
  if(!node)return;
  node.setAttribute?.('tabindex','-1');
  if(typeof node.focus==='function')node.focus({preventScroll:true});
 };
 const motionOff=()=>!!global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const nextFrame=callback=>typeof global.requestAnimationFrame==='function'
  ?global.requestAnimationFrame(callback):callback();
 function captureSemanticAnchor(){
  const nodes=Array.from(document.querySelectorAll('.reader .sentence[data-i]')||[]);
  const viewport=Number.isFinite(global.innerHeight)&&global.innerHeight>0?global.innerHeight:2000;
  for(const node of nodes){
   const index=Number(node.getAttribute?.('data-i'));
   const rect=node.getBoundingClientRect?.();
   if(!Number.isInteger(index)||index<0||!rect||
      !Number.isFinite(rect.top)||!Number.isFinite(rect.bottom))continue;
   // Save only a paragraph intersecting the viewport, not an off-screen
   // future paragraph or a stale DOM node left by a previous chapter.
   if(rect.bottom>0&&rect.top<viewport)
    return {index,top:Math.round(Math.max(-2000,Math.min(2000,rect.top)))};
  }
  return null;
 }
 function restoreReadingPosition(storyId,chapterIndex,fallback){
  const chapter=state.story?.chapters?.[chapterIndex];
  const anchor=get('reading_anchor_'+storyId+'_'+chapterIndex,null);
  if(anchor&&Number.isInteger(anchor.index)&&anchor.index>=0&&
     Array.isArray(chapter?.paragraphs)&&anchor.index<chapter.paragraphs.length&&
     typeof anchor.top==='number'&&Number.isFinite(anchor.top)&&anchor.top>=-2000&&anchor.top<=2000){
   const target=document.querySelector('.reader .sentence[data-i="'+anchor.index+'"]');
   const rect=target?.getBoundingClientRect?.();
   if(rect&&Number.isFinite(rect.top)){
    // Keep the same paragraph at the same viewport offset after font/theme
    // reflow. Pixel scroll remains the fallback for old/corrupt backups.
    global.scrollTo(0,safeOffset((global.scrollY||0)+rect.top-anchor.top));
    return true;
   }
  }
  global.scrollTo(0,fallback);
  return false;
 }
 function savePosition(){
  if(state.story&&state.page==='reader'){
   const key=state.story.id+'_'+state.chapter;
   put('scroll_'+key,safeOffset(global.scrollY||0)); // backward-compatible fallback
   put('reading_anchor_'+key,captureSemanticAnchor());
  }
 }
 function finishClose(){
  if(closeTimer!==null){global.clearTimeout(closeTimer);closeTimer=null;}
  closing=false;waitingPop=false;
  if(state.page!=='reader')return;
  baseBack();
  nextFrame(()=>{
   if(state.page!=='library')return;
   global.scrollTo(0,returnY);
   // Rebuilt library cards replace their previous DOM nodes.
   const card=Array.from(document.querySelectorAll('.library .card')).find(node=>
    node.getAttribute?.('onclick')==="openStory('"+returnStoryId+"')");
   if(returnToBookmark){
    const button=Array.from(document.querySelectorAll('.lt-saved-places button'))
     .find(node=>node.dataset.bookmarkBook===returnStoryId);
    if(button){button.closest('details').open=true;button.focus({preventScroll:true});return;}
   }
   focusWithoutScroll(card);
  });
 }
 function closeReader(){
  if(closing||state.page!=='reader')return;
  closing=true;savePosition();
  if(!motionOff())document.querySelector('.reader')?.classList.add('lt-reader-exit');
  closeTimer=global.setTimeout(finishClose,motionOff()?0:190);
 }
 openStory=function(id,options){
  const book=catalog.stories.find(item=>item.id===id);
  const bookmark=book&&options?.bookmark?global.LinguaBookmarkNavigation?.prepare(book):null;
  const passage=options?.passage;
  const validPassage=passage?.storyId===id&&Number.isInteger(passage.chapter)&&Number.isInteger(passage.paragraph)&&
   !!book?.chapters[passage.chapter]?.paragraphs[passage.paragraph];
  const offset=validPassage?(global.LinguaPassageNavigation?.prepare(book,passage)||0):0;
  if(validPassage)put('chapter_'+id,passage.chapter);
  if(state.page==='library'){
   returnToBookmark=Boolean(bookmark);
   returnY=safeOffset(global.scrollY);
   put('libraryScroll',returnY);
  }
  if(closeTimer!==null){global.clearTimeout(closeTimer);closeTimer=null;}
  if(historyFallback!==null){global.clearTimeout(historyFallback);historyFallback=null;}
  closing=false;waitingPop=false;
  baseOpen(id);
  if(state.page==='reader'){
   returnStoryId=state.story?.id||id;
   if(!motionOff())document.querySelector('.reader')?.classList.add('lt-reader-enter');
   // Resume the saved chapter position; a fresh chapter starts at the top.
   const storyId=returnStoryId;
   const chapterIndex=state.chapter;
   const saved=safeOffset(get('scroll_'+storyId+'_'+chapterIndex,0));
   nextFrame(()=>{
    if(state.page!=='reader'||state.story?.id!==storyId||state.chapter!==chapterIndex)return;
    if(validPassage)focusPassage(passage,offset);
    else{
     focusWithoutScroll(document.querySelector('.reader h2'));
     if(bookmark)bookmark.restoreScroll();
     else restoreReadingPosition(storyId,chapterIndex,saved);
    }
   });
  }
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
 // Full Arabic translation is a separate page: preserve the English
 // reader's position on toolbar Back and Android system Back.
 if(typeof fullTranslation==='function'&&typeof backToReader==='function'){
  const baseTranslation=fullTranslation,baseReaderReturn=backToReader;
  fullTranslation=function(...args){
   if(state.page==='reader'){
    translationScroll=safeOffset(global.scrollY);
    savePosition();
   }
   return baseTranslation.apply(this,args);
  };
  backToReader=function(target){
   const story=state.story;
   const explicit=state.page==='translation'&&Number.isInteger(target?.chapter)&&Number.isInteger(target?.paragraph)&&
    !!story?.chapters[target.chapter]?.paragraphs[target.paragraph];
   if(explicit){
    state.chapter=target.chapter;put('chapter_'+story.id,target.chapter);
    global.LinguaPassageNavigation?.prepare(story,target);
   }
   const chapter=state.chapter;
   const result=baseReaderReturn();
   nextFrame(()=>{
    if(state.page!=='reader'||state.story!==story||state.chapter!==chapter)return;
    if(explicit)focusPassage(target,0);else global.scrollTo(0,translationScroll);
   });
   return result;
  };
 }
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
// RDR-07: old installed users can carry a removed theme in localStorage.
 // Migrate ONLY the selected theme without touching bookmarks/reader progress,
 // backup data or independent custom palettes. Old styles can remain as
 // compatibility code but never surface as selectable application themes.
 if(!validTheme(state.uiTheme)){
  const legacy=state.uiTheme;
  document.body.classList.remove('theme-'+legacy);
  state.uiTheme='aurora';
  document.body.classList.add('theme-aurora');
  put('uiTheme','aurora');
 }
/* RDR-04 — Keep prose as live, accessible HTML for the built-in dictionary
 * while suppressing Android/WebView's generic selection/copy context menu.
 * This does not prevent external camera/screenshot OCR. */
function ltEditableTextTarget(node){
 const el=node?.nodeType===3?node.parentElement:node;
 return !!(el?.isContentEditable||el?.closest?.(
  'input,textarea,[contenteditable="true"],[role="textbox"]'));
}
function ltReaderTextTarget(node){
 const el=node?.nodeType===3?node.parentElement:node;
 return !!el?.closest?.('.reader');
}
function installReaderTextGuards(){
 const paperDoc=global.document;
 if(!paperDoc?.addEventListener||paperDoc.__ltReaderTextGuardsInstalled)return;
 paperDoc.__ltReaderTextGuardsInstalled=true;
 function guard(event){
  const anchor=global.getSelection?.()?.anchorNode;
  const paper=ltReaderTextTarget(event.target)||ltReaderTextTarget(anchor);
  if(!paper||ltEditableTextTarget(event.target)||ltEditableTextTarget(anchor))return;
  event.preventDefault?.();
 }
 for(const name of ['selectstart','contextmenu','copy','cut','dragstart'])
  paperDoc.addEventListener(name,guard,true);
}

loadLocale();
loadFonts();
loadReadingSizes();
loadReaderMaterial();
installReaderTextGuards();
applyCustomThemeColors();
})(window);
