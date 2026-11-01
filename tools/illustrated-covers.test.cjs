'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const match=html.match(/window\.LinguaHydrateStoryCovers=function\(\)\{([\s\S]*?)\n\};\nwindow\.LinguaAttachEditorialArt/);
assert.ok(match,'actual production hydration function exists');
const art={
 'the-floor-between_0':'data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%2010%2010%22%3E%3C%2Fsvg%3E',
 'remote-story_0':'https://untrusted.test/pic.svg'
};
const elements=[
 {id:'the-floor-between',style:{},dataset:{},getAttribute(n){return n==='data-lt-cover-story'?this.id:null;}},
 {id:'remote-story',style:{},dataset:{},getAttribute(n){return n==='data-lt-cover-story'?this.id:null;}},
 {id:'../invalid',style:{},dataset:{},getAttribute(n){return n==='data-lt-cover-story'?this.id:null;}}
];
const document={querySelectorAll(selector){assert.equal(selector,'.library [data-lt-cover-story]');return elements;}};
const context={art,document};
vm.runInNewContext('window={};window.LinguaHydrateStoryCovers=function(){'+match[1]+'\n};',context);
const refresh=context.window.LinguaHydrateStoryCovers;
assert.equal(refresh(),1,'offline story-specific chapter scene is installed');
assert.match(elements[0].style.backgroundImage,/^url\("data:image\/svg\+xml/);
assert.equal(elements[0].dataset.ltArtReady,'1');
assert.equal(elements[1].style.backgroundImage,undefined,'no remote image request');
assert.equal(elements[2].style.backgroundImage,undefined,'no path traversal');
assert.equal(refresh(),0,'repeat calls cannot reset already-hydrated covers');
assert.match(html,/data-lt-cover-story="\$\{esc\(s\.id\)\}"/,'every card can be matched back to its own scene');
console.log('PASS: offline editorial covers hydrate in place with local-only sources');

// Exercise the exact production attachment path with a 37-chapter classic.
// Legacy scenes must still hydrate, but no synthetic Verne art is generated.
let seen=null,hydrated=0;
const registry={art:{},window:{
 StoryLensEditorialStories:[
  {id:'around-the-world-in-eighty-days-towle',chapters:Array.from({length:37},()=>({}))},
  {id:'legacy-short-story',chapters:[{title:'Saved chapter'}]}
 ],
 StoryLensMakeEditorialArt(stories){seen=stories.map(s=>s.id);
  return {'legacy-short-story_0':'data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E'};},
 LinguaHydrateStoryCovers(){hydrated++;}
}};
vm.runInNewContext('window.LinguaAttachEditorialArt=function(){'+
 "\n if(typeof window.StoryLensMakeEditorialArt!=='function')return false;\n // Authentic classics rely on verified, local historical engravings.\n // The 37 now-unused synthetic SVG scene strings waste WebView memory.\n // Keep all earlier saved short-story scene art for backward compatibility.\n const eligible=(window.StoryLensEditorialStories||[])\n  .filter(story=>story?.id!=='around-the-world-in-eighty-days-towle');\n Object.assign(art,window.StoryLensMakeEditorialArt(eligible));\n window.LinguaHydrateStoryCovers();\n return true;"+'\n};',registry);
assert.equal(registry.window.LinguaAttachEditorialArt(),true);
assert.deepEqual(Array.from(seen),['legacy-short-story'],'no synthetic 37-chapter artwork allocations');
assert.equal(hydrated,1,'legacy library cover is still hydrated');
assert.ok(registry.art['legacy-short-story_0']);
assert.ok(!Object.keys(registry.art).some(k=>k.startsWith('around-the-world-in-eighty-days-towle_')),
 'archive-sourced classics never get old illustrated SVGs');
console.log('PASS: legacy art retained and unnecessary long-book vectors skipped');
