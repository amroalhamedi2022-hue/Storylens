'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const first=source.indexOf('function ltVerifiedCompanionPlates(');
const last=source.indexOf('function ltRenderTranslationChapter()',first);
assert.ok(first>=0&&last>first,'pure companion art selector is present in reader');
const context={};
vm.runInNewContext(source.slice(first,last)+
 '\nglobalThis.select=ltVerifiedCompanionPlates;',context,{timeout:2000});
const select=context.select;
const chapter={paragraphs:Array.from({length:9},(_,i)=>({en:'Real English '+i,ar:'النص العربي '+i})),inlineArt:[]};
const primary={index:1,src:'art/verne-source.webp',ratio:1.4,alt:'Historical scene',
 credit:'1873 Osgood engraving'};
const vetted=(index,src,changes={})=>({
 afterParagraph:index,src,aspectRatio:760/1045,alt:'Real folio painting',
 credit:'Metropolitan Museum · 16th century',visualTreatment:'original-colour',
 archiveSource:'https://www.metmuseum.org/art/collection/search/453083',
 verifiedArchive:true,sourceParagraphExact:true,distributionReviewApproved:true,
 ...changes});
chapter.inlineArt=[
 vetted(3,'art/kalila/scene-one.webp'),
 vetted(6,'art/kalila/scene-two.webp'),
 vetted(1,'art/kalila/duplicate-anchor.webp'),
 vetted(4,'https://external.invalid/photo.jpg'),
 vetted(5,'art/../traversal.webp'),
 vetted(7,'art/kalila/unverified.webp',{verifiedArchive:false}),
 vetted(8,'art/kalila/no-rights.webp',{distributionReviewApproved:false}),
 vetted(2,'art/kalila/no-scene.webp',{sourceParagraphExact:false}),
 vetted(5,'art/kalila/untrusted.webp',{archiveSource:'https://example.org/stock'}),
 vetted(3,'art/kalila/repeat.webp')
];
const selected=select(chapter,primary);
const plain=Array.from(selected);
assert.deepEqual(plain.map(p=>p.index),[1,3,6],
 '2 verified colour plates + original source, ordered by paragraph; reject duplicates and unsafe metadata');
assert.equal(plain[0].visualTreatment,'period-original');
assert.equal(plain[1].visualTreatment,'original-colour');
assert.equal(plain[2].src,'art/kalila/scene-two.webp');
assert.equal(plain[1].credit,'Metropolitan Museum · 16th century');
assert.equal(select(chapter,null).length,2,'no legacy source scan needed for verified contextual art');
assert.equal(select({paragraphs:[]},primary).length,0,'no artworks without source paragraphs');
assert.equal(select({paragraphs:chapter.paragraphs,inlineArt:[]},primary).length,1,
 'previous single-scan Verne chapters remain unchanged');
assert.equal(select({paragraphs:chapter.paragraphs,inlineArt:[vetted(99,'art/offscreen.webp')]},null).length,0,
 'cannot place images beyond chapter end');
const malicious=vetted(4,'art/kalila/not-real.webp',{credit:'" onerror="alert(1)',
 archiveSource:'https://example.org/bad'});
assert.equal(select({paragraphs:chapter.paragraphs,inlineArt:[malicious]},null).length,0,
 'untrusted external provenance never authorizes a local picture');
assert.match(source,/const platesByParagraph=new Map\(plates\.map/);
assert.match(source,/const item=platesByParagraph\.get\(index\)/);
assert.match(source,/escapeText\(item\.alt\)/);
assert.match(source,/escapeText\(item\.credit\)/);
assert.match(source,/item\.visualTreatment==='original-colour'/);
assert.match(source,/style="aspect-ratio:'\+item\.ratio\+';object-fit:contain"/,
 'only uncropped original artwork is permitted in the full companion');
assert.match(source,/root\.querySelectorAll\?\.\('\.lt-companion-plate img'\)\?\.forEach\(ltEnableArtInspection\)/,
 'all companion pictures must have the same offline lightbox and Android back behavior');
console.log('PASS: multiple source-verified local plates per complete companion chapter, safe rights/provenance, no content mutations');
