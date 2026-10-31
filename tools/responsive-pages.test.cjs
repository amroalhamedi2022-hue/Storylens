'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const start=source.indexOf('function ltPageStarts(');
const end=source.indexOf('// Do not let page gestures',start);
assert.ok(start>0&&end>start,'production adaptive page functions are extractable');
const env={LT_PAGE_PARAGRAPHS:4};
vm.runInNewContext(source.slice(start,end)+'\nglobalThis.starts=ltPageStarts;globalThis.forParagraph=ltPageForParagraph;',env);
const starts=env.starts,locate=env.forParagraph;
const short=Array(12).fill(60),long=Array(12).fill(330);
const phone=Array.from(starts(long,720,320,24));
const tablet=Array.from(starts(long,1150,850,18));
assert.equal(phone[0],0);
assert.equal(tablet[0],0);
assert.ok(phone.length>tablet.length,'large type and narrow phones create shorter pages');
assert.ok(phone.every((p,i)=>i===0||p>phone[i-1]),'page boundaries increase strictly');
assert.ok(tablet.every((p,i)=>i===0||p>tablet[i-1]));
assert.ok(Array.from(starts(short,900,880,18)).length>=3,'never exceed the four-paragraph cap');
assert.deepEqual(Array.from(starts([],720,320,24)),[],'empty chapters cannot fabricate pages');
assert.deepEqual(Array.from(starts([100],720,320,24)),[0],'single paragraph fits a dedicated page');
assert.deepEqual(Array.from(starts([4000,60,4000],640,300,32)),[0,1,2],
 'very long paragraphs remain whole and do not swallow neighboring passages');
for(let paragraph=0;paragraph<long.length;paragraph++){
 const page=locate(phone,paragraph);
 assert.ok(phone[page]<=paragraph,'semantic anchor never jumps forward');
 assert.ok(page===phone.length-1||phone[page+1]>paragraph,
  'semantic anchor never returns to an earlier sheet');
}
assert.equal(locate(phone,NaN),0,'corrupt imported anchors are safe');
assert.equal(locate(phone,-1),0,'negative anchors are safe');
assert.equal(locate(phone,99999),phone.length-1,'out-of-range old progress clamps to last page');
assert.deepEqual(Array.from(starts([120,360,80,900,150],NaN,NaN,NaN)).slice(0,2),[0,2],
 'bad WebView geometry falls back to deterministic safe bounds');
assert.match(source,/const anchorKey='readpage_anchor_'/,'semantic progress key used');
assert.match(source,/put\(anchorKey,starts\[current\]\|\|0\)/,'per-turn anchor persisted');
assert.match(source,/savedReaderPage\*LT_PAGE_PARAGRAPHS/,'older bookmark backup remains restorable');
assert.match(source,/Math\.max\(0,length-1\)/,'cross-chapter reverse navigation starts at last paragraph');
const backup=fs.readFileSync('app/src/main/assets/data-backup.js','utf8');
assert.match(backup,/readpage_anchor\|reading_anchor/,'semantic page anchors included in backups');
assert.match(backup,/tail\.startsWith\('readpage_anchor_'\)/,'anchors validated on import');
console.log('PASS: phone/tablet adaptive page groups, semantic anchors, old bookmarks and portable backups');
