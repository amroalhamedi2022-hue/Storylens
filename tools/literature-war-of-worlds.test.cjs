'use strict';
/* Do not confuse exact-source original acquisition with a finished bilingual Android book. */
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/literature/staging/the-war-of-the-worlds');
const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const art=JSON.parse(fs.readFileSync(path.join(dir,'HISTORIC_PLATE_QUEUE.json'),'utf8'));
assert.equal(m.id,'wells-war-of-the-worlds-1898');assert.equal(m.source.upstreamCommit,'7c2c332ce1ce8025d07ec982b02dad293dc63671');
assert.equal(m.originalLanguage,'en');assert.equal(m.originalPublicationYear,1898);
assert.equal(m.completeOriginalSource,true);assert.equal(m.publishable,false);assert.equal(m.status,'SOURCE_STAGED_EDITORIAL_HOLD');
for(const gate of ['completeArabicCompanion','naturalArabicEditorialReview','historicInChapterArtCleared','territoryRightsReviewed','offlineDeviceVerified'])assert.equal(m.acceptance[gate],false);
assert.equal(m.originalChapters.length,27);assert.equal(m.structuralParts.length,4);
assert.deepEqual(m.originalChapters.filter(c=>c.book===1).map(c=>c.number),Array.from({length:17},(_,i)=>i+1));
assert.deepEqual(m.originalChapters.filter(c=>c.book===2).map(c=>c.number),Array.from({length:10},(_,i)=>i+1));
let total=0,words=0;
for(const item of [...m.originalChapters,...m.structuralParts]){
 const b=fs.readFileSync(path.join(dir,item.file));assert.equal(b.length,item.bytes,'Source size changed '+item.file);
 const sha=crypto.createHash('sha1').update(Buffer.from('blob '+b.length)).update(Buffer.from([0])).update(b).digest('hex');
 assert.equal(sha,item.upstreamGitBlobSha,'Source Git blob changed '+item.file);
 const txt=b.toString('utf8');assert.ok(txt.includes('<html ')&&txt.includes('</html>'),'Truncated XHTML: '+item.file);
 if('book' in item){assert.match(txt,/<p>/);words+=(txt.replace(/<[^>]+>/g,' ').match(/\b[\w’'-]+\b/g)||[]).length;}
 total+=b.length;
}
assert.equal(total,m.totalSourceBytes);assert.ok(total>370000,'Original edition suspiciously truncated');assert.ok(words>45000,'Unabridged narrative word count suspiciously small');
const licence=fs.readFileSync(path.join(dir,'SOURCE_LICENSE.md'));
assert.equal(crypto.createHash('sha1').update(Buffer.from('blob '+licence.length)).update(Buffer.from([0])).update(licence).digest('hex'),m.source.upstreamLicenseGitBlobSha);
assert.match(licence.toString('utf8'),/CC0 1\.0/);
assert.equal(art.candidatePlates.length,3);
for(const p of art.candidatePlates){assert.equal(p.localFile,null);assert.equal(p.imageSHA256,null);assert.equal(p.chapterMatch,'RESEARCH_LEAD_NOT_YET_TEXT_LOCKED');}
const app=fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8');assert.ok(!app.includes(m.id),'Staged original must not be in Android product');
console.log('PASS: all 27 genuine Wells original chapters plus 4 original frontmatter/section documents, SHA pinned, not published or falsely illustrated');
