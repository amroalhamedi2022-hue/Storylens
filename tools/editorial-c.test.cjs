'use strict';
// Editorial Collections C + D: bilingual completeness, source-occurring vocabulary and local scene art.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const scripts=['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js','editorial-art.js'];
const context={window:{},encodeURIComponent};
for(const file of scripts)vm.runInNewContext(fs.readFileSync(path.join(assets,file),'utf8'),context,{filename:file,timeout:6000});
const stories=context.window.StoryLensEditorialStories;
assert.equal(stories.length,18,'six stories in each of the four original-content batches A, B, C and D');
const collectionC=stories.slice(6,12), collectionD=stories.slice(12);
const expected=['mystery','sci_fi','psychological','historical','contemporary','horror'];
const sorted=a=>[...a].sort();
assert.deepEqual(sorted(collectionC.map(s=>s.genre)),sorted(expected),'Collection C covers all six adult genres');
assert.deepEqual(sorted(collectionD.map(s=>s.genre)),sorted(expected),'Collection D covers all six adult genres');
assert.equal(new Set(stories.map(s=>s.id)).size,stories.length,'all original story IDs are unique across batches A–D');
const known=new Set(),normalizedLines=new Set();
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
function validateCollection(collection,{chaptersPerStory,paragraphsPerChapter,label,brandedScenes=false,originalProvenance=false}) {
 let paragraphs=0,words=0,illustrations=0,annotations=0;
 for(const story of collection){
  assert.ok(!known.has(story.id),'unique story ID '+story.id);known.add(story.id);
  assert.equal(story.chapters.length,chaptersPerStory,label+' chapter count '+story.id);
  assert.ok(story.title.length>8&&story.description.length>40,'complete metadata '+story.id);
  if(originalProvenance){
   assert.match(story.provenance,/Original fiction created for Lingua Tales/,'transparent original-content provenance '+story.id);
   assert.match(story.editorialStatus,/review pending/,'do not imply professional review '+story.id);
  }
  assert.ok(story.terms.length>=8,'at least eight contextual annotations '+story.id);
  const body=[];
  for(const ch of story.chapters){
   assert.ok(ch.title.length>=4&&ch.titleAr.length>=4,'bilingual chapter headings '+story.id);
   assert.equal(ch.paragraphs.length,paragraphsPerChapter,label+' paragraph count '+story.id);
   for(const p of ch.paragraphs){
    assert.ok(p.en.trim().split(/\s+/).length>=11,'complete English sentence '+story.id);
    assert.ok(p.ar.length>=35&&/[\u0621-\u064A]/.test(p.ar),'aligned Arabic companion paragraph '+story.id);
    const normalized=norm(p.en);
    assert.ok(!normalizedLines.has(normalized),'no recycled English paragraph: '+p.en);
    normalizedLines.add(normalized);body.push(normalized);
    paragraphs++;words+=normalized.split(/\s+/).length;
   }
  }
  const full=body.join(' ');
  const covered=story.terms.filter(t=>full.includes(norm(t.term))).length;
  assert.ok(covered>=6,story.id+' must use at least six annotated phrases in its actual prose');
  for(const term of story.terms){
   assert.ok(term.literal&&term.context&&term.type&&term.note,'complete bilingual annotation: '+term.term);
  }
  const scenes=context.window.StoryLensMakeEditorialArt([story]);
  for(let i=0;i<chaptersPerStory;i++){
   const uri=scenes[story.id+'_'+i];
   assert.ok(uri?.startsWith('data:image/svg+xml;charset=utf-8,'),'local illustration for '+story.id+' chapter '+i);
   const svg=decodeURIComponent(uri.slice(uri.indexOf(',')+1));
   if(brandedScenes){
    assert.ok(svg.includes(story.title),'scene includes the story identity');
    assert.ok(svg.includes('LINGUA TALES · ORIGINAL SCENE'),'scene carries accessible local-art provenance');
   }
   assert.doesNotMatch(svg,/<(?:image|use)\b[^>]*href=["']https?:/i,'no remote image dependency');
   assert.doesNotMatch(svg,/@import\s+url\(["']?https?:/i,'no remote font/style dependency');
   illustrations++;
  }
  annotations+=story.terms.length;
 }
 return {stories:collection.length,chapters:collection.length*chaptersPerStory,paragraphs,englishWords:words,illustrations,annotations};
}
const c=validateCollection(collectionC,{chaptersPerStory:2,paragraphsPerChapter:9,label:'Collection C'});
assert.equal(c.paragraphs,108,'Collection C bilingual paragraph count');
assert.ok(c.englishWords>=1900,'Collection C remains substantial prose');
const d=validateCollection(collectionD,{chaptersPerStory:3,paragraphsPerChapter:6,label:'Collection D',brandedScenes:true,originalProvenance:true});
assert.equal(d.paragraphs,108,'Collection D bilingual paragraph count');
assert.ok(d.englishWords>=1800,'Collection D must be substantial prose, not filler');
assert.equal(d.illustrations,18,'each Collection D chapter has its own local illustration');
console.log(JSON.stringify({result:'PASS',collectionC:c,collectionD:d,totalNewStories:c.stories+d.stories,totalBilingualParagraphs:c.paragraphs+d.paragraphs,totalEnglishWords:c.englishWords+d.englishWords},null,2));
