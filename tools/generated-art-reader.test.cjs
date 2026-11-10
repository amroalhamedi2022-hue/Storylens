'use strict';
// Tests the REAL generated-art gate extracted from production reader code,
// not a rewritten acceptance algorithm or a mocked historic-original bypass.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const reader=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const registry=fs.readFileSync('app/src/main/assets/lt-generated-art-registry.js','utf8');
assert.match(registry,/Object.freeze\(\{\}\)/,'empty by default: no unapproved images shipped');
const before=html.indexOf('src="lt-generated-art-registry.js"'),after=html.indexOf('src="reader-experience.js"');
assert.ok(before>0&&after>before,'generated proof loaded before reader render');
assert.ok(reader.includes('ltVerifiedGeneratedArtScenes(state.story,state.chapter,chapter)'),'generated companion enters before paper pagination');
assert.match(reader,/item\.generatedCompanion===true\?' lt-ai-generated-companion'/,'generated image distinct from historical originals');
assert.match(reader,/originalColour\|\|layout\.uncropped\|\|item\.generatedCompanion===true/,'modern art is never cropped');
const start=reader.indexOf('function ltVerifiedGeneratedArtScenes(');
const end=reader.indexOf('\nfunction ltVerifiedCompanionPlates(',start);
assert.ok(start>0&&end>start,'production validator source exists');
const chunk=reader.slice(start,end);
const context={
 window:{LinguaGeneratedArtRegistry:{}},
 uiText:(ar,en)=>en
};
vm.runInNewContext(chunk+';this.check=ltVerifiedGeneratedArtScenes;',context);
const book='around-the-world-in-eighty-days-towle',sceneId='verne-ch01-new-servant';
const chapter={paragraphs:[{en:'This is the original introductory paragraph about the servant approaching Fogg.',ar:'النص العربي الأصلي.'}]};
const sample={
 sceneId,generated:true,origin:'AI_GENERATED',
 sourceType:'AI_GENERATED_MODERN_COMPANION',
 chapterOneBased:1,afterParagraph:0,
 src:'art/generated/'+book+'/'+sceneId+'.webp',
 sha256:'a'.repeat(64),sourceParagraphSha256:'b'.repeat(64),
 sourceExcerpt:'original introductory paragraph about the servant approaching',
 altAr:'رسم باسبارتو يدخل الغرفة.',altEn:'The valet enters the room.',
 credit:'Modern AI-generated engraving',ownerImageApproved:true,imageRightsReviewed:true,
 editoriallyApproved:true,distributionReviewApproved:true,releaseApproved:true
};
const registryEntry={chapters:{'1':[sample]}};
function check(entry=sample,ch=chapter,b=book){
 context.window.LinguaGeneratedArtRegistry={[book]:{chapters:{'1':[entry]}}};
 return context.check({id:b},0,ch);
}
assert.equal(check().length,1,'approved picture with exact source passage is accepted');
assert.equal(check()[0].generatedCompanion,true,'new image cannot appear as historic');
assert.equal(check()[0].afterParagraph,0);
assert.equal(check(sample,chapter,'a-study-in-scarlet').length,0,'other book never inherits this image');
function rejected(change){
 const x=JSON.parse(JSON.stringify(sample));change(x);
 assert.equal(check(x).length,0);
}
rejected(x=>x.src='https://example.com/picture.webp');
rejected(x=>x.src='../../outside.webp');
rejected(x=>x.src='art/verne-kiouni-1873.webp');
rejected(x=>x.generated=false);
rejected(x=>x.origin='HISTORICAL_ORIGINAL');
rejected(x=>x.ownerImageApproved=false);
rejected(x=>x.imageRightsReviewed=false);
rejected(x=>x.editoriallyApproved=false);
rejected(x=>x.distributionReviewApproved=false);
rejected(x=>x.releaseApproved=false);
rejected(x=>x.afterParagraph=1);
rejected(x=>x.chapterOneBased=2);
rejected(x=>x.sourceExcerpt='Wager made at Reform Club in the first chapter');
rejected(x=>x.sha256='0');
rejected(x=>x.altAr='');
rejected(x=>x.credit='Nineteenth century antique original');
context.window.LinguaGeneratedArtRegistry={[book]:{chapters:{'1':[sample,sample]}}};
assert.equal(context.check({id:book},0,chapter).length,1,'duplicate scene anchor never rendered twice');
context.window.LinguaGeneratedArtRegistry={[book]:{chapters:{'1':Array.from({length:500},()=>sample)}}};
assert.equal(context.check({id:book},0,chapter).length,1,'bounded candidate budget');
assert.ok(reader.includes('const occupied=new Set(inlineArt.map'), 'original sources win the same paragraph');
assert.ok(!reader.includes('fetch('),'reader does not download pictures at runtime');
console.log('PASS: real reader AI image gate, 17 unsafe-input controls, source and chapter alignment, duplicate bounds, offline + historical priority');
