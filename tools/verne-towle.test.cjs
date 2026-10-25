'use strict';
/* Source-bound literary regression. Real public-domain 1873 Towle chapter I,
 * not an AI-written substitute, abridgement or complete 37-chapter book. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,'app/src/main/assets');
const read=name=>fs.readFileSync(path.join(assets,name),'utf8');
const html=read('index.html');
const script='classic-verne-towle-ch01.js';
const second='classic-verne-towle-ch02.js';
const third='classic-verne-towle-ch03.js';
assert.ok(html.includes('src="'+script+'"'),'chapter is packaged and registered');
assert.ok(html.includes('src="'+second+'"'),'chapter II is packaged and registered');
assert.ok(html.indexOf(script)<html.indexOf(second),'chapters load in order');
assert.ok(html.includes('src="'+third+'"'));
assert.ok(html.indexOf(second)<html.indexOf(third));
assert.ok(html.indexOf(third)<html.indexOf('editorial-art.js'),'all chapters precede offline art');
const context={window:{},encodeURIComponent};
for(const file of [script,second,third,'editorial-art.js'])
 vm.runInNewContext(read(file),context,{filename:file,timeout:5000});
const stories=context.window.StoryLensEditorialStories;
assert.equal(stories.length,1);
const story=stories[0];
assert.equal(story.id,'around-the-world-in-eighty-days-towle');
assert.equal(story.chapters.length,3,'first three chapters, not full novel');
assert.match(story.provenance,/1873/);
assert.match(story.provenance,/Towle/);
assert.match(story.editorialStatus,/review/);
const passages=story.chapters[0].paragraphs;
assert.equal(passages.length,29,'all 29 continuous English/Arabic passage groups');
const english=passages.map(p=>p.en).join(' ');
const words=english.trim().split(/\s+/).length;
assert.ok(words>=1400,'substantial authentic chapter, not a synopsis');
assert.ok(english.startsWith('Mr. Phileas Fogg lived, in 1872'));
assert.ok(english.endsWith('Passepartout remained alone in the house in Saville Row.'));
assert.ok(english.includes('He was, in short, the least communicative of men.'));
assert.ok(english.includes('He must have travelled everywhere, at least in the spirit.'));
assert.ok(english.includes('He breakfasted and dined at the club'));
assert.ok(english.includes('I have come to Monsieur in the hope of living with him a tranquil life'));
assert.ok(english.includes('twenty-nine minutes after eleven'));
for(const p of passages){
 assert.ok(p.en.length>35 && p.ar.length>35,'both languages are substantive');
 assert.match(p.ar,/[\u0621-\u064A]/,'Arabic translation included');
 assert.ok(!/[\u200B\u200C\u200D]/.test(p.en),'source page breaks removed');
}
const chapter2=story.chapters[1].paragraphs;
assert.equal(chapter2.length,11,'complete chapter II in 11 aligned source paragraphs');
const chapter3=story.chapters[2].paragraphs;
assert.equal(chapter3.length,66,'all 65 prose paragraphs and itinerary, no abridgement');
const english3=chapter3.map(p=>p.en).join(' ');
assert.ok(english3.split(/\\s+/).length>=1950);
assert.ok(english3.includes('From Yokohama to San Francisco'));
assert.ok(english3.includes('Total: 80 days'));
assert.ok(english3.includes('Diamonds are trumps'));
assert.ok(chapter3.every(p=>p.en.length>1&&p.ar.length>1&&/[\\u0621-\\u064A]/.test(p.ar)));
const english2=chapter2.map(p=>p.en).join(' ');
const words2=english2.trim().split(/\s+/).length;
assert.ok(words2>=1100,'authentic chapter II, not an outline');
assert.ok(english2.startsWith('“Faith,” muttered Passepartout'));
assert.ok(english2.endsWith('I don’t mind serving a machine.”'));
assert.ok(english2.includes('tea and toast at twenty-three minutes past eight'));
assert.ok(english2.includes('a programme of the daily routine of the house'));
assert.ok(english2.includes('from cellar to garret'));
for(const p of chapter2){
 assert.ok(p.en.length>=50 && p.ar.length>=55,'full bilingual paragraph');
 assert.match(p.ar,/[\u0621-\u064A]/);
}
assert.ok(story.editorialStatus.includes('3 of 37'));
assert.ok(story.terms.length>=28);
for(const term of story.terms){
 assert.ok((english+' '+english2+' '+english3).toLowerCase().includes(term.term.toLowerCase()),'term really occurs: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'edited literal/context/note');
}
const scene=context.window.StoryLensMakeEditorialArt(stories)[story.id+'_0'];
assert.ok(scene?.startsWith('data:image/svg+xml;charset=utf-8,'));
assert.match(decodeURIComponent(scene),/Victorian London street/);
assert.match(decodeURIComponent(scene),/<svg/);
const secondScene=context.window.StoryLensMakeEditorialArt(stories)[story.id+'_1'];
assert.ok(secondScene?.startsWith('data:image/svg+xml;charset=utf-8,'));
assert.match(decodeURIComponent(secondScene),/Victorian Saville Row interior/);
assert.notEqual(scene,secondScene,'new chapter must have its own contextual illustration');
const thirdScene=context.window.StoryLensMakeEditorialArt(stories)[story.id+'_2'];
assert.ok(thirdScene?.startsWith('data:image/svg+xml;charset=utf-8,'));
assert.match(decodeURIComponent(thirdScene),/Victorian Reform Club card table/);
assert.notEqual(thirdScene,secondScene);
const shell=read('lingua-shell.js'),css=read('lingua-shell.css'),backup=read('data-backup.js');
assert.ok(shell.includes("'saville-clockwork'"));
assert.ok(css.includes('body.theme-saville-clockwork'));
assert.ok(backup.includes("'saville-clockwork'"));
assert.ok(shell.includes("'station-tickets'"));
assert.ok(css.includes('body.theme-station-tickets'));
assert.ok(backup.includes("'station-tickets'"));
assert.ok(shell.includes("'reform-club-brass'"));
assert.ok(css.includes('body.theme-reform-club-brass'));
assert.ok(backup.includes("'reform-club-brass'"));
console.log(JSON.stringify({result:'PASS',chapters:3,passages:passages.length+chapter2.length+chapter3.length,englishWords:words+words2+english3.split(/\\s+/).length,contextualTerms:story.terms.length,illustrations:3,editorialReview:'NOT TESTED',device:'NOT TESTED'},null,2));
