'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const read=p=>fs.readFileSync(path.join(assets,p),'utf8');
const html=read('index.html');
const scripts=['editorial-stories-a.js','editorial-stories-b.js','editorial-stories-c.js',
 'novella-salt-meridian.js','editorial-art.js'];
const ctx={window:{},encodeURIComponent};
for(const file of scripts){
 assert.ok(html.includes('src="'+file+'"'),'HTML loads '+file);
 vm.runInNewContext(read(file),ctx,{filename:file,timeout:5000});
}
const list=ctx.window.StoryLensEditorialStories;
const story=list.find(s=>s.id==='the-salt-meridian');
assert.ok(story,'novella is included in the production catalog');
assert.equal(story.chapters.length,5,'complete five-chapter arc');
assert.equal(story.genre,'historical');
assert.match(story.provenance,/Original English fiction/);
assert.match(story.editorialStatus,/review pending/);
assert.ok(!/public.domain|gutenberg/i.test(story.provenance),'not falsely labeled as a classic');
const paragraphs=story.chapters.flatMap(c=>c.paragraphs);
assert.equal(paragraphs.length,50,'fifty aligned original English-Arabic passages');
const words=paragraphs.reduce((n,p)=>n+p.en.trim().split(/\s+/).length,0);
assert.ok(words>=1400,'meaningful medium-length prose, not a handful of sentences');
const english=new Set();
for(const chapter of story.chapters){
 assert.ok(chapter.title.length>5&&/[\u0621-\u064A]/.test(chapter.titleAr));
 assert.equal(chapter.paragraphs.length,10);
 for(const p of chapter.paragraphs){
  assert.ok(p.en.trim().split(/\s+/).length>=20,'complete English literary paragraph');
  assert.ok(p.ar.length>=55&&/[\u0621-\u064A]/.test(p.ar),'paired Arabic translation');
  assert.ok(!english.has(p.en),'no recycled passages');
  english.add(p.en);
 }
}
const body=paragraphs.map(p=>p.en.toLowerCase()).join(' ');
assert.ok(story.terms.length>=12,'edited idiom and phrase cards');
for(const term of story.terms){
 assert.ok(body.includes(term.term.toLowerCase()),'term occurs in English source: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'dictionary and contextual meaning');
}
const scenes=ctx.window.StoryLensMakeEditorialArt([story]);
for(let i=0;i<5;i++){
 const uri=scenes[story.id+'_'+i];
 assert.ok(uri?.startsWith('data:image/svg+xml'),'offline chapter artwork '+i);
 assert.ok(decodeURIComponent(uri).includes('<svg'),'valid local SVG scene '+i);
}
assert.ok(html.indexOf('novella-salt-meridian.js')<html.indexOf('editorial-art.js'),
 'book registers before artwork and main reader');
const shell=read('lingua-shell.js'),css=read('lingua-shell.css'),backup=read('data-backup.js');
assert.ok(shell.includes("'harbor-ledger'"),'theme appears in settings gallery');
assert.ok(css.includes('body.theme-harbor-ledger')&&css.includes('.theme-harbor-ledger .reader'),
 'theme has distinct library and reader styling');
assert.ok(backup.includes("'harbor-ledger'"),'offline backup restores theme');
console.log(JSON.stringify({result:'PASS',title:story.title,chapters:5,bilingualParagraphs:50,englishWords:words,
 contextualTerms:story.terms.length,offlineChapterScenes:5,theme:'Harbor Ledger',
 editorialReview:'NOT TESTED'},null,2));
