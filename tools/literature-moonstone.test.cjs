'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'docs/literature/staging/the-moonstone');
const m=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const art=JSON.parse(fs.readFileSync(path.join(dir,'HISTORIC_PLATE_QUEUE.json'),'utf8'));
assert.equal(m.id,'collins-the-moonstone-1868');assert.equal(m.source.upstreamCommit,'81eafac7022dbdb26f52fa90377fb7bba9996808');
assert.equal(m.originalLanguage,'en');assert.equal(m.originalPublicationYear,1868);assert.equal(m.completeOriginalSource,true);
assert.equal(m.publishable,false);assert.equal(m.status,'SOURCE_STAGED_EDITORIAL_HOLD');
for(const k of ['completeArabicCompanion','contextualArabicEditorialReview','historicChapterArtCleared','territoryRightsReviewed','offlineDeviceVerified'])assert.equal(m.acceptance[k],false);
assert.equal(m.sourceParts.length,56);assert.equal(m.narrativeParts,53);assert.equal(m.structuralParts,3);
assert.equal(m.sourceParts[0].file,'prologue.xhtml');assert.equal(m.sourceParts.at(-1).file,'epilogue-3.xhtml');
let bytes=0,wordCount=0;
for(const item of m.sourceParts){
 const b=fs.readFileSync(path.join(dir,item.file));assert.equal(b.length,item.bytes,item.file+' altered bytes');
 const sh=crypto.createHash('sha1').update(Buffer.from('blob '+b.length)).update(Buffer.from([0])).update(b).digest('hex');
 assert.equal(sh,item.upstreamGitBlobSha,item.file+' source hash mismatch');
 const doc=b.toString('utf8');assert.ok(doc.includes('<html ') && doc.includes('</html>'),item.file+' damaged XHTML');
 if(item.kind==='narrative'){assert.ok(doc.includes('<p>'),item.file+' missing prose');wordCount+=(doc.replace(/<[^>]+>/g,' ').match(/\b[\w’'-]+\b/g)||[]).length;}
 bytes+=b.length;
}
assert.equal(bytes,m.totalSourceBytes);assert.ok(bytes>1200000);assert.ok(wordCount>100000);
const lic=fs.readFileSync(path.join(dir,'SOURCE_LICENSE.md'));
assert.equal(crypto.createHash('sha1').update(Buffer.from('blob '+lic.length)).update(Buffer.from([0])).update(lic).digest('hex'),m.source.upstreamLicenseGitBlobSha);
assert.match(lic.toString('utf8'),/CC0 1\.0/);
assert.equal(art.candidates.length,3);
for(const p of art.candidates){assert.ok(m.sourceParts.some(x=>x.file===p.chapterFile));assert.equal(p.rights,'PENDING');assert.equal(p.binary,'NOT_DOWNLOADED');}
assert.ok(!fs.readFileSync(path.join(root,'app/src/main/assets/index.html'),'utf8').includes(m.id),'Unpublished book must not appear in APK');
console.log('PASS: exact original Moonstone source; 56 verified XHTML files, historical image research staged but not shipped');
