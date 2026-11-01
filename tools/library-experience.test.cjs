'use strict';
// Pure, deterministic StoryLens v0.6 regression suite (no browser or network required).
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const source=fs.readFileSync(path.join(assets,'library-experience.js'),'utf8');
const css=fs.readFileSync(path.join(assets,'library-experience.css'),'utf8');
const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');
const values=new Map();
const localStorage={
 getItem:key=>values.has(key)?values.get(key):null,
 setItem:(key,val)=>values.set(key,String(val))
};
const stories=[
 {id:'alibi',title:'The Alibi',level:'B2',chapters:[{title:'One',paragraphs:[]}]},
 {id:'midnight',title:'Midnight',level:'C1',chapters:[{title:'Two',paragraphs:[]}]}
];
const sandbox={
 window:{},localStorage,document:{querySelector:()=>null},
 catalog:{stories,genres:[{id:'mystery',ar:'الغموض'}]},
 state:{story:stories[0],page:'library',chapter:0},
 library:()=>{},renderReader:()=>{},settings:()=>{},wordSheet:()=>{},
 get:(key,fallback)=>{try{return JSON.parse(localStorage.getItem('storylens_'+key))??fallback}catch{return fallback}},
 put:(key,value)=>localStorage.setItem('storylens_'+key,JSON.stringify(value)),
 esc:s=>String(s),
 console
};
sandbox.window.window=sandbox.window;
vm.runInNewContext(source,sandbox,{filename:'library-experience.js',timeout:5000});
const extras=sandbox.window.StoryLensExtras;
assert.ok(extras,'public helper for feature integration');

// LT-06: test the production locale label helper in both directions.
// English UI must not translate source stories or overwrite Arabic glosses.
{
 const start=source.indexOf('const uiText=(ar,en)=>');
 const end=source.indexOf(';',start);
 assert.ok(start>=0&&end>start,'library uses a centralized locale label helper');
 const document={documentElement:{lang:'ar'}};
 const context={document};
 vm.runInNewContext(source.slice(start,end+1)+'\nthis.label=uiText;',context,
  {filename:'LT-06 discovery locale',timeout:5000});
 assert.equal(context.label('المفضلة','Favorites'),'المفضلة');
 document.documentElement.lang='en';
 assert.equal(context.label('المفضلة','Favorites'),'Favorites');
 for(const label of ['Discover stories','Favorites','All levels','Recommended',
  'Remove from favorites','Visible stories: ','Reading comfort','Line spacing',
  'Choose the best sense in this sentence']){
  assert.ok(source.includes(label),'English discovery/reader label: '+label);
 }
 assert.match(source,/const senses=String\(args\.entry\.literal\)/,
  'dictionary meaning must remain sourced, not translated by UI locale');
 assert.match(source,/button\.textContent=sense/,
  'selected dictionary gloss must preserve the original Arabic sense');
}

assert.equal(extras.favorites().length,0);
assert.equal(extras.toggleFavorite('missing'),false,'never save non-existent story');
assert.equal(extras.toggleFavorite('alibi'),true);
assert.equal(extras.favorites()[0],'alibi');
assert.equal(extras.toggleFavorite('alibi'),false);
assert.equal(extras.favorites().length,0);
values.set('storylens_favorites','["alibi","nonexistent"]');
assert.equal(extras.favorites().length,1,'discard orphaned story IDs');
assert.equal(extras.prefs().spacing,'comfortable');
assert.equal(extras.prefs().width,'normal');
assert.equal(extras.prefs().font,'literary');
assert.equal(extras.prefs().illustrations,true);
assert.equal(extras.preference('spacing','neon'),false,'reject unsupported reader setting');
assert.equal(extras.preference('spacing','airy'),true);
assert.equal(extras.preference('width','wide'),true);
assert.equal(extras.preference('font','modern'),true);
assert.equal(extras.preference('illustrations',false),true);
assert.equal(extras.prefs().spacing,'airy');
assert.equal(extras.prefs().width,'wide');
assert.equal(extras.prefs().font,'modern');
assert.equal(extras.prefs().illustrations,false);
values.set('storylens_readerPrefs','{broken json');
assert.equal(extras.prefs().spacing,'comfortable','recover from corrupt saved settings');
assert.equal(extras.discoveryState().level,'all');
values.set('storylens_discoveryLevel','"X9"');
values.set('storylens_discoverySort','"unknown"');
assert.equal(extras.discoveryState().level,'all');
assert.equal(extras.discoveryState().sort,'editorial');
for(const cssClass of ['.stl-favorite','.stl-discovery','.stl-sense-choices','.reader[data-spacing=airy]','.reader.stl-hide-illustrations']){
 assert.ok(css.includes(cssClass),'style '+cssClass+' exists');
}
assert.ok(css.includes('prefers-reduced-motion'),'reduced motion respected');
assert.ok(html.includes('src="library-experience.js"'));
assert.ok(html.includes('href="library-experience.css"'));
assert.ok(html.indexOf('src="reader-experience.js"')<html.indexOf('src="library-experience.js"'),'wrappers run in intended sequence');
// LT-03: production CSS must not reallocate a live backdrop blur and entrance
// animation for every card on each filter/search. Retain theme/cover/hero detail.
const liquidCss=fs.readFileSync(path.join(assets,'liquid-aurora.css'),'utf8');
const paintBudget=liquidCss.match(/\/\* LT-03 paint budget:[\s\S]*?(?=\n@media\(max-width:600px\))/);
assert.ok(paintBudget,'documented story-card paint optimization exists');
const optimized=paintBudget[0];
assert.match(optimized,/\.library\s+\.shelf\s+\.card\s*\{/,'only the library shelf cards are optimized');
assert.match(optimized,/-webkit-backdrop-filter\s*:\s*none/,'disable vendor live card backdrop blur');
assert.match(optimized,/backdrop-filter\s*:\s*none/,'disable live card backdrop blur');
assert.match(optimized,/animation\s*:\s*none/,'avoid re-animating every card on library redraw');
assert.match(optimized,/content-visibility\s*:\s*auto/,'skip painting offscreen card contents');
assert.match(optimized,/contain-intrinsic-size\s*:\s*auto\s+192px/,'stable offscreen card geometry');
assert.match(optimized,/background\s*:\s*linear-gradient/,'keep gradient/glass-like card appearance');
assert.match(liquidCss,/\.storylens-hero|\.hero-orb|\.sheet/,'Liquid theme still contains detailed visuals');
assert.match(liquidCss,/\.card\s*\.cover/,'original artwork and covers retained');
assert.match(liquidCss,/prefers-reduced-motion/,'reduced-motion accessibility retained');
assert.ok(!optimized.includes('display:none'),'story cards must remain visible');
console.log('PASS: LT-03 scoped card paint optimization retains Liquid visuals and reduced-motion support');

console.log('PASS: favorite persistence, invalid IDs, reader preferences, input validation, corrupt-store recovery, 2 asset imports, accessibility and style gates');


// LT-05/09/10/13: exercise the real new shell controller in an isolated VM.
const shellJs=fs.readFileSync(path.join(assets,'lingua-shell.js'),'utf8');
const shellCss=fs.readFileSync(path.join(assets,'lingua-shell.css'),'utf8');
assert.ok(html.includes('href="lingua-shell.css"')&&html.includes('src="lingua-shell.js"'),
 'new shell CSS and JS must be loaded by the actual Android WebView HTML');
assert.ok(html.indexOf('src="data-backup.js"')<html.indexOf('src="lingua-shell.js"'),
 'shell wraps final library/backup renderers, not earlier base functions');
const themeClasses=new Set(['theme-nebula']);
const registered={};
const shellStore=new Map();
const fakeDrawer={
 id:'lt-drawer',inert:true,attributes:{},classList:{add(){},remove(){}},
 style:{removeProperty(k){delete this[k];}},getBoundingClientRect(){return {width:300};},
 setAttribute(k,v){this.attributes[k]=v;},querySelector(){return {focus(){}};}
};
const fakeBackdrop={classList:{add(){},remove(){}},style:{removeProperty(k){delete this[k];}}};
const fakeToggle={attributes:{},setAttribute(k,v){this.attributes[k]=v;},focus(){}};
let shellSentenceNodes=[];
const shellDocument={
 documentElement:{dir:'rtl',clientWidth:400,dataset:{}},
 body:{classList:{
  add(k){themeClasses.add(k);},remove(k){themeClasses.delete(k);}
 }},
 querySelector:()=>null,querySelectorAll(selector){return selector==='.reader .sentence'?shellSentenceNodes:[];},
 getElementById(id){return ({'lt-drawer':fakeDrawer,'lt-drawer-backdrop':fakeBackdrop,
  'lt-menu-toggle':fakeToggle})[id]||null;},
 addEventListener(type,listener){registered[type]=listener;}
};
const shellWindow={innerWidth:400,addEventListener(type,listener){registered['window-'+type]=listener;}};
const shellState={page:'library',uiTheme:'nebula'};
const shellSandbox={
 window:shellWindow,document:shellDocument,state:shellState,
 catalog:{genres:[]},library(){},closeSheet(){},filterGenre(){},
 put(k,v){shellStore.set(k,v);},
 safeOffset(value){return Number.isFinite(value)?Math.max(0,Math.min(10000000,value)):0;},Date,console
};
vm.runInNewContext(shellJs,shellSandbox,{filename:'lingua-shell.js',timeout:5000});
const shell=shellWindow.LinguaShell;
assert.ok(shell,'exposes theme, drawer and settings controls');
// LT-06 partial: actual locale preference switches HTML direction without
// changing the source story/translation data or the legacy storage prefix.
assert.equal(shellDocument.documentElement.lang,'ar','first launch uses Arabic UI');
assert.equal(shell.applyLocale('en',false),true);
assert.equal(shellDocument.documentElement.dir,'ltr');
assert.equal(shellDocument.documentElement.lang,'en');
assert.equal(shellStore.get('uiLocale'),'en','locale saved offline');
assert.equal(shell.menuSide(),'left','English menu opens at left');
assert.equal(shell.applyLocale('es',false),false,'unsupported locales rejected');
assert.equal(shellDocument.documentElement.lang,'en','invalid locale preserves selection');
assert.equal(shell.applyLocale('ar',false),true);
assert.equal(shellDocument.documentElement.dir,'rtl');
assert.equal(shell.menuSide(),'right');
assert.match(shellJs,/get\('uiLocale','ar'\)/,'cold start restores locale preference');
assert.match(shellJs,/languageSelect\.addEventListener\('change'/,'settings exposes locale control');

// Exercise the exact production locale handler, not a reimplementation.
// Changing the language while Settings is open must rebuild its labels,
// preserve library scroll and restore focus to the language control.
{
 const begin=shellJs.indexOf('function applyLocale(');
 const end=shellJs.indexOf('\nconst originalLibrary',begin);
 assert.ok(begin>=0&&end>begin,'production locale function is extractable');
 const events=[];
 let dialogOpen=true;
 const doc={
  documentElement:{lang:'ar',dir:'rtl'},
  querySelector(selector){
   if(selector==='.lt-settings-overlay')return dialogOpen?{}:null;
   if(selector==='.lt-locale-setting select')return {focus(){events.push('focus-locale');}};
   return null;
  }
 };
 const context={
  localeChoices:['ar','en'],document:doc,state:{page:'library'},
  global:{scrollY:215,scrollTo(x,y){events.push('scroll:'+y);}},
  put(k,v){events.push('persist:'+k+':'+v);},
  closeSheet(){events.push('close');},
  library(){events.push('library');},
  openSettings(){events.push('reopen-settings');}
 };
 vm.runInNewContext(shellJs.slice(begin,end)+'\nthis.switchLocale=applyLocale;',context,
  {filename:'LT-06 locale handler',timeout:5000});
 assert.equal(context.switchLocale('en'),true);
 assert.equal(doc.documentElement.lang,'en');
 assert.equal(doc.documentElement.dir,'ltr');
 assert.deepEqual(events,['persist:uiLocale:en','close','library','scroll:215',
  'reopen-settings','focus-locale']);
 events.length=0;dialogOpen=false;
 assert.equal(context.switchLocale('ar'),true);
 assert.ok(!events.includes('reopen-settings'),'do not open Settings unexpectedly');
 assert.equal(context.switchLocale('invalid'),false,'unsupported locale rejected');
}

assert.equal(shell.applyFont('ar','naskh'),true);
assert.equal(shellDocument.documentElement.dataset.ltArabicFont,'naskh');
assert.equal(shellStore.get('fontArabic'),'naskh','Arabic font saved offline');
assert.equal(shell.applyFont('en','sans'),true);
assert.equal(shellDocument.documentElement.dataset.ltEnglishFont,'sans');
assert.equal(shellStore.get('fontEnglish'),'sans','English font saved separately');
assert.equal(shell.applyFont('en','url(https://example.com/font)'),false,'reject injected CSS');
assert.equal(shell.applyFont('__proto__','sans'),false,'reject unknown font language');

// LT-12: changing typography while reading must not call missing helpers or
// lose the visible paragraph when its geometry changes after reflow.
{
 const restores=[];
 let geometryRead=0;
 shellWindow.scrollY=240;
 shellWindow.scrollTo=(x,y)=>restores.push(y);
 shellWindow.requestAnimationFrame=callback=>callback();
 shellSentenceNodes=[{
  dataset:{i:'4'},
  getBoundingClientRect(){
   geometryRead++;
   return geometryRead===1?{top:80,bottom:120}:{top:120,bottom:160};
  }
 }];
 shellState.page='reader';
 shellState.story={id:'reader-fixture',chapters:[{paragraphs:Array(10).fill('p')}]};
 shellState.chapter=0;
 assert.equal(shell.applyReadingSize('en','large'),true);
 assert.equal(shellStore.get('scroll_reader-fixture_0'),240,'legacy scroll checkpoint saved');
 assert.deepEqual(restores,[280],'same paragraph is restored to its previous viewport offset');
 shellState.page='library';
 delete shellState.story;
 shellSentenceNodes=[];
 shellWindow.scrollY=0;
}
assert.match(shellCss,/html\[data-lt-arabic-font="naskh"\]/,'Arabic Naskh style exists');
assert.match(shellCss,/html\[data-lt-english-font="sans"\]/,'English sans style exists');
assert.match(shellCss,/\.reader \.sentence/,'reader uses selected English font');
assert.match(shellCss,/\.inline-ar/,'translation uses selected Arabic font');

assert.equal(shell.validTheme('paper-atlas'),true);
assert.equal(shell.validTheme('malicious-theme'),false);
assert.equal(shell.applyTheme('paper-atlas'),true);
assert.equal(shellState.uiTheme,'paper-atlas');
assert.equal(shellStore.get('uiTheme'),'paper-atlas','theme selection persisted offline');
assert.ok(themeClasses.has('theme-paper-atlas')&&!themeClasses.has('theme-nebula'));
assert.equal(shell.applyTheme('malicious-theme'),false,'reject unknown theme values');
assert.equal(shellState.uiTheme,'paper-atlas','invalid theme must not overwrite preference');
assert.equal(shell.menuSide(),'right','Arabic opens the right-edge drawer');
shellDocument.documentElement.dir='ltr';
assert.equal(shell.menuSide(),'left','English opens the left-edge drawer');
shellDocument.documentElement.dir='rtl';
assert.equal(shell.openDrawer(),true);
assert.equal(shell.isDrawerOpen(),true);
assert.equal(fakeDrawer.inert,false);
assert.equal(fakeDrawer.attributes['aria-hidden'],'false');
assert.equal(fakeToggle.attributes['aria-expanded'],'true');
registered['window-keydown']({key:'Escape',preventDefault(){},stopImmediatePropagation(){}});
assert.equal(shell.isDrawerOpen(),false,'Escape closes drawer before base reader navigation');
assert.equal(fakeDrawer.inert,true,'closed drawer cannot be keyboard focused');

// LT-09/06: keyboard users must not Tab out of an open modal. Test the
// production window keydown listener, including Shift+Tab and Settings Escape.
shell.openDrawer();
const keyboardFocus=[];
const firstKey={hidden:false,getAttribute:()=>null,focus(){keyboardFocus.push('first');shellDocument.activeElement=this;}};
const lastKey={hidden:false,getAttribute:()=>null,focus(){keyboardFocus.push('last');shellDocument.activeElement=this;}};
fakeDrawer.querySelectorAll=()=>[firstKey,lastKey];
fakeDrawer.contains=node=>node===firstKey||node===lastKey;
shellDocument.activeElement=lastKey;
let tabPrevented=0;
registered['window-keydown']({key:'Tab',shiftKey:false,preventDefault(){tabPrevented++;}});
assert.equal(tabPrevented,1,'forward Tab is trapped at drawer end');
assert.equal(keyboardFocus.at(-1),'first','forward Tab wraps to first control');
registered['window-keydown']({key:'Tab',shiftKey:true,preventDefault(){tabPrevented++;}});
assert.equal(tabPrevented,2,'reverse Tab is trapped at drawer start');
assert.equal(keyboardFocus.at(-1),'last','Shift+Tab wraps to last control');
shell.closeDrawer();
let settingsClosed=0,menuRefocused=0;
const originalQuerySelector=shellDocument.querySelector;
const originalMenuFocus=fakeToggle.focus;
shellSandbox.closeSheet=()=>{settingsClosed++;};
fakeToggle.focus=()=>{menuRefocused++;};
shellDocument.querySelector=selector=>selector==='.lt-settings-overlay .lt-settings-sheet'
 ?{querySelectorAll:()=>[],contains:()=>false}:originalQuerySelector(selector);
registered['window-keydown']({key:'Escape',preventDefault(){},stopImmediatePropagation(){}});
assert.equal(settingsClosed,1,'Escape dismisses Settings before page navigation');
assert.equal(menuRefocused,1,'Settings Escape restores menu focus');
shellDocument.querySelector=originalQuerySelector;
fakeToggle.focus=originalMenuFocus;
console.log('PASS: keyboard focus trap, reverse Tab and Settings Escape');

// A drag updates the drawer during touchmove, not only on touchend.
registered.touchstart({touches:[{clientX:391,clientY:200}]});
registered.touchmove({touches:[{clientX:205,clientY:210}]});
assert.match(fakeDrawer.style.transform,/translate3d\(/,'finger drag updates actual drawer transform');
registered.touchend({});
assert.equal(shell.isDrawerOpen(),true,'Arabic swipe from right edge opens drawer');
registered.touchstart({touches:[{clientX:180,clientY:200}]});
registered.touchmove({touches:[{clientX:385,clientY:205}]});
registered.touchend({});
assert.equal(shell.isDrawerOpen(),false,'opposite swipe closes drawer');
shellDocument.documentElement.dir='ltr';
registered.touchstart({touches:[{clientX:7,clientY:180}]});
registered.touchmove({touches:[{clientX:197,clientY:186}]});
registered.touchend({});
assert.equal(shell.isDrawerOpen(),true,'English swipe from left edge opens drawer');
shell.closeDrawer();
registered.touchstart({touches:[{clientX:7,clientY:180}]});
registered.touchmove({touches:[{clientX:130,clientY:285}]});
registered.touchend({});
assert.equal(shell.isDrawerOpen(),false,'vertical scrolling must not trigger drawer');
// Existing discovery refreshes must rehome controls in the drawer without rerender loops.
const discovery={parentNode:{}};
let movedDiscovery=false;
shellDocument.querySelector=selector=>selector==='.library'?{querySelector:()=>discovery}:null;
fakeDrawer.querySelector=selector=>selector==='.lt-drawer-divider'?{}:{focus(){}};
fakeDrawer.insertBefore=node=>{node.parentNode=fakeDrawer;movedDiscovery=true;};
assert.equal(shell.moveDiscovery(),true,'discovery controls moved to drawer');
assert.equal(movedDiscovery,true);
assert.equal(shell.moveDiscovery(),false,'already moved controls do not move repeatedly');
assert.match(source,/global\.LinguaShell\?\.moveDiscovery/,'discovery rerenders call shell rehome hook');
assert.match(shellCss,/\.lt-drawer\s+\.stl-discovery-controls/,'drawer discovery layout exists');
assert.match(shellCss,/html\[dir="rtl"\]\s+\.lt-drawer/,'RTL physical drawer side is explicit');
assert.match(shellCss,/\.theme-paper-atlas\s+\.library\s+\.shelf\s+\.card/,'Paper Atlas has a different card composition');
assert.match(shellCss,/\.theme-paper-atlas\s+\.library\s+\.storylens-hero/,'Paper Atlas has a distinct hero composition');
assert.match(shellCss,/prefers-reduced-motion/,'drawer motion has reduced-motion fallback');
const backupJs=fs.readFileSync(path.join(assets,'data-backup.js'),'utf8');
assert.ok(backupJs.includes("'paper-atlas'"),'offline backup validator must retain the new theme');
assert.match(backupJs,/tail==='uiLocale'[^\n]*\['ar','en'\]/,'backup validates both locale values');
assert.match(backupJs,/'fontArabic','fontEnglish','uiLocale'/,'backup exports the locale preference');
console.log('PASS: Lingua Tales shell RTL/LTR swipe, theme persistence, backup and Paper Atlas layout gates');


// LT-02: execute the production navigation gate (not a reimplementation).
const navStart=shellJs.indexOf('/* LT-02: a single, cancellable story navigation gate.');
const navEnd=shellJs.indexOf('\n})();',navStart);
assert.ok(navStart>0&&navEnd>navStart,'production story transition controller exists');
const navSource='(function(global){"use strict";\n'+shellJs.slice(navStart,navEnd+5)+'\n})(window);';
function navigationScenario(reduced=false){
 const calls={open:0,back:0,historyBack:0,scroll:[],saved:new Map(),readerClasses:[]};
 const callbacks=new Map(),listeners={};let timer=0;
 const state={page:'library',story:null,chapter:0};
 const story={id:'classic-1',chapters:[{title:'First',paragraphs:[]}]};
 const history={state:{page:'library'},back(){calls.historyBack++;this.state={page:'library'};listeners.popstate?.();},
  pushState(value){this.state=value;}};
 const window={scrollY:470,history,matchMedia(){return{matches:reduced}},
  setTimeout(fn,delay){const id=++timer;callbacks.set(id,{fn,delay});return id;},
  clearTimeout(id){callbacks.delete(id);},
  requestAnimationFrame(fn){fn();},
  scrollTo(x,y){calls.scroll.push([x,y]);this.scrollY=y;},
  addEventListener(type,fn){listeners[type]=fn;}};
 const reader={classList:{add(k){calls.readerClasses.push(k);}}};
 const modal={childElementCount:0};
 const document={querySelector:sel=>sel==='.reader'?reader:null,
  querySelectorAll:()=>[],
  getElementById:id=>id==='modals'?modal:null};
 const sandbox={window,document,state,
  openStory(id){if(id!==story.id)return;calls.open++;state.story=story;state.page='reader';window.scrollY=120;history.pushState({page:'reader'});},
  libraryBack(){calls.back++;state.page='library';window.scrollTo(0,0);},
  backToReader(){state.page='reader';},closeSheet(){modal.childElementCount=0;},
  get(key,fallback){return calls.saved.has(key)?calls.saved.get(key):fallback;},
  put(key,value){calls.saved.set(key,value);},console};
 vm.runInNewContext(navSource,sandbox,{filename:'LT-02 navigation',timeout:5000});
 const flush=()=>{for(const [id,item] of [...callbacks]){callbacks.delete(id);item.fn();}};
 return {sandbox,window,state,calls,history,modal,listeners,flush};
}
{
 const t=navigationScenario();t.sandbox.openStory('classic-1');
 assert.equal(t.state.page,'reader');assert.equal(t.calls.saved.get('libraryScroll'),470);
 assert.ok(t.calls.readerClasses.includes('lt-reader-enter'));
 t.window.scrollY=283;t.sandbox.libraryBack();t.sandbox.libraryBack();
 assert.equal(t.calls.historyBack,1,'rapid double back must not pop twice');
 assert.equal(t.calls.saved.get('scroll_classic-1_0'),283,'reader position saved');
 assert.ok(t.calls.readerClasses.includes('lt-reader-exit'));
 t.flush();assert.equal(t.calls.back,1);assert.equal(t.state.page,'library');
 assert.deepEqual(t.calls.scroll.at(-1),[0,470],'library scroll restored');
 t.flush();assert.equal(t.calls.back,1,'no duplicate delayed close');
}
{
 const t=navigationScenario(true);t.sandbox.openStory('classic-1');
 assert.equal(t.calls.readerClasses.length,0,'reduced motion disables entrance');
 t.sandbox.libraryBack();t.flush();
 assert.equal(t.calls.back,1);assert.equal(t.calls.readerClasses.length,0,'reduced motion disables exit');
}
{
 const t=navigationScenario();t.sandbox.openStory('classic-1');
 t.modal.childElementCount=1;t.listeners.popstate();
 assert.equal(t.state.page,'reader','system back dismisses reader modal first');
 assert.equal(t.modal.childElementCount,0);assert.equal(t.history.state.page,'reader');
 t.sandbox.libraryBack();t.flush();assert.equal(t.state.page,'library');
}
assert.equal(shell.validTheme('midnight-library'),true,'new Midnight Library theme is selectable');
assert.match(shellCss,/\.theme-midnight-library\s+\.library\s+\.shelf\s+\.card/,
 'Midnight Library uses distinct book-spine card layout');
assert.match(shellCss,/\.theme-midnight-library\s+\.library\s+\.storylens-hero/,
 'Midnight Library uses centered brass library hero');
assert.match(shellCss,/\.reader\.lt-reader-exit/,'exit transition is styled');
assert.match(shellCss,/\.reader\.lt-reader-enter/,'enter transition is styled');
assert.ok(backupJs.includes("'midnight-library'"),'backup permits new theme');
console.log('PASS: LT-02 production navigation enter/exit, rapid back, modal, scroll, reduced-motion and Midnight Library layout');


// LT-01 / LT-09 Android host regression: manifest identity and native system Back.
const manifest=fs.readFileSync(path.join(root,'app/src/main/AndroidManifest.xml'),'utf8');
const gradle=fs.readFileSync(path.join(root,'app/build.gradle.kts'),'utf8');
const nativeHost=fs.readFileSync(path.join(root,'app/src/main/java/com/storylens/reader/MainActivity.kt'),'utf8');
assert.ok(manifest.includes('android:label="${ltAppLabel}"'),
 'launcher label resolves per build variant');
assert.ok(gradle.includes('manifestPlaceholders["ltAppLabel"] = "Lingua Tales"'),
 'production release retains the approved name');
assert.ok(gradle.includes('versionNameSuffix = "-preview"'),
 'side-by-side debug package remains isolated without putting Preview in the launcher');
assert.match(gradle,/applicationId\s*=\s*"com\.storylens\.reader"/,
 'existing installed application identity must remain unchanged');
assert.ok(!/<uses-permission/.test(manifest),'rebrand cannot add network or microphone permission');
assert.ok(nativeHost.includes('exportDocument.launch("LinguaTales-backup.json")'),
 'new backup filename must not change JSON schema or storage keys');
const nativeBack=nativeHost.slice(nativeHost.indexOf('override fun handleOnBackPressed()'));
assert.ok(nativeBack.includes('window.LinguaShell.isDrawerOpen()'),
 'Android Back must check the library drawer before finishing');
assert.ok(nativeBack.includes('window.LinguaShell.closeDrawer();'),
 'Android Back must dismiss the open drawer');
assert.ok(nativeBack.indexOf('window.LinguaShell.closeDrawer();') <
 nativeBack.indexOf('if (page == "\\\"library\\\"") finish()'),
 'drawer close must precede activity finish');
console.log('PASS: LT-01 launcher/backup naming, package continuity and LT-09 native drawer Back contract (source; device NOT TESTED)');

// User product invariant: Lingua Tales has no audio/TTS/microphone feature.
// Settings must not advertise unsupported optional audio in either locale.
assert.doesNotMatch(shellJs,/optional audio|الأصوات الاختيارية/i,
 'settings must not promise audio or speech features');
console.log('PASS: bilingual settings do not promise forbidden audio features');
