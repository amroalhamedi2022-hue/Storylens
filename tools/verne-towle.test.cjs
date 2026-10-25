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
assert.ok(html.includes('src="'+script+'"'),'chapter is packaged and registered');
assert.ok(html.indexOf(script)<html.indexOf('editorial-art.js'),'book precedes offline art');
const context={window:{},encodeURIComponent};
for(const file of [script,'editorial-art.js'])
 vm.runInNewContext(read(file),context,{filename:file,timeout:5000});
const stories=context.window.StoryLensEditorialStories;
assert.equal(stories.length,1);
const story=stories[0];
assert.equal(story.id,'around-the-world-in-eighty-days-towle');
assert.equal(story.chapters.length,1,'first chapter only, no false complete-book claim');
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
assert.ok(story.terms.length>=12);
for(const term of story.terms){
 assert.ok(english.toLowerCase().includes(term.term.toLowerCase()),'term really occurs: '+term.term);
 assert.ok(term.literal&&term.context&&term.note,'edited literal/context/note');
}
const scene=context.window.StoryLensMakeEditorialArt(stories)[story.id+'_0'];
assert.ok(scene?.startsWith('data:image/svg+xml;charset=utf-8,'));
assert.match(decodeURIComponent(scene),/Victorian London street/);
assert.match(decodeURIComponent(scene),/<svg/);
const shell=read('lingua-shell.js'),css=read('lingua-shell.css'),backup=read('data-backup.js');
assert.ok(shell.includes("'saville-clockwork'"));
assert.ok(css.includes('body.theme-saville-clockwork'));
assert.ok(backup.includes("'saville-clockwork'"));
console.log(JSON.stringify({result:'PASS',chapters:1,passages:passages.length,englishWords:words,contextualTerms:story.terms.length,illustrations:1,editorialReview:'NOT TESTED',device:'NOT TESTED'},null,2));
