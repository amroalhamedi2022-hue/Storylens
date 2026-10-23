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
