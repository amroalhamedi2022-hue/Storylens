'use strict';
// LT-03/LT-07: exercise the exact production lookup module, not a duplicate resolver.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const lookupJs = fs.readFileSync(path.join(root, 'app/src/main/assets/lingua-lookup.js'), 'utf8');
const readerJs = fs.readFileSync(path.join(root, 'app/src/main/assets/reader-experience.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'app/src/main/assets/index.html'), 'utf8');
const context = {window: {}};
vm.runInNewContext(lookupJs, context, {filename:'lingua-lookup.js',timeout:5000});
const lookup = context.window.LinguaLookup.lookup;
const edited = {term:'in plain sight',type:'idiom',context:'واضح للعيان'};
const story = {terms:[edited,{term:'plain sight',type:'phrase'},{term:'take',type:'verb'}]};
const dictionary = [{term:'sight',type:'word'},{term:'plain',type:'word'}];
const sentence = 'It was in plain sight, then in plain sight again.';
const options = {story,dictionary,lemmas:w=>w==='took'?['took','take']:[w.toLowerCase()]};
function hit(selected, offset, text=sentence, extra={}) {
 return lookup({...options,sentence:text,selected,offset,...extra});
}
assert.equal(hit('plain',sentence.indexOf('plain')).entry,edited,'longest edited phrase wins');
assert.equal(hit('sight',sentence.lastIndexOf('sight')).entry,edited,'second occurrence resolves');
assert.equal(hit('plain',sentence.lastIndexOf('plain')).display,'in plain sight');
assert.equal(hit('took',4,'She took it.').entry.term,'take','inflected headword');
assert.equal(hit('unknown',3,'An unknown word.').entry,null,'no invented gloss');
assert.equal(hit('sight',0,'sight.').entry.term,'sight','single word lookup');
assert.equal(hit('plain',2,'A plain answer.').entry.term,'plain','no phrase outside matching span');
assert.equal(hit('plain',-1),null,'reject negative offset');
assert.equal(hit('plain',10000),null,'reject out-of-bounds offset');
assert.equal(hit('plain',0,'',{}),null,'reject empty source');
const lex={resolve:word=>word==='orphan'?{term:'orphan',literal:'يتيم'}:null};
assert.equal(hit('orphan',3,'An orphan.',{lexicon:lex}).entry.literal,'يتيم','supplemental lexicon fallback');
const free={resolve:word=>word==='luminous'?{term:'luminous',literal:'مضيء'}:null};
assert.equal(hit('luminous',2,'A luminous.',{freeDict:free}).entry.literal,'مضيء','FreeDict fallback');
assert.equal(hit('orphan',3,'An orphan.',{lexicon:{resolve:()=>null}}).entry,null,'no fake fallback');
const regexStory={terms:[{term:'a (rare) phrase',type:'idiom'}]};
const punct=lookup({story:regexStory,dictionary:[],sentence:'It is a (rare) phrase.',selected:'rare',offset:9});
assert.equal(punct.entry.term,'a (rare) phrase','escape punctuation in phrase regex');
const boundary=lookup({story:{terms:[{term:'at sea'}]},dictionary:[],sentence:'The cat seafood.',selected:'sea',offset:8});
assert.equal(boundary,null,'never resolve a partial token inside a larger word');
assert.ok(html.indexOf('src="lingua-lookup.js"') < html.indexOf('src="reader-experience.js"'),
 'load indexed resolver before reader interception');
assert.match(readerJs,/const lookupToken=token=>[\s\S]*?window\.LinguaLookup\.lookup\(/,
 'production token handler uses the source-bound resolver');
assert.match(readerJs,/addEventListener\('click',event=>\{\s*if\(lookupToken\(event\.target\)\)event\.stopImmediatePropagation\(\)/,
 'click capture delegates to the same keyboard-accessible lookup');
assert.match(readerJs,/wordSheet\(\{\.\.\.hit,source\}\)/,
 'one resolved word opens the existing dictionary sheet');

// Inflected idioms must resolve from either the changed verb or a later word,
// while preserving the exact clicked occurrence and rejecting punctuation gaps.
const goOn={term:'go on',type:'idiom',context:'تابع'};
const takeOff={term:'take off',type:'idiom',context:'أقلع'};
const inflectedStory={terms:[goOn,takeOff]};
const inflectedLemmas=w=>({went:['went','go'],going:['going','go'],
 took:['took','take']}[w.toLowerCase()]||[w.toLowerCase()]);
function inflected(sentence,selected,offset) {
 return lookup({story:inflectedStory,dictionary:[],sentence,selected,offset,
  lemmas:inflectedLemmas});
}
assert.equal(inflected('She went on, then went on.','went',4).entry,goOn);
assert.equal(inflected('She went on, then went on.','on',9).entry,goOn);
assert.equal(inflected('She went on, then went on.','went',18).entry,goOn);
assert.equal(inflected('She went on, then went on.','on',23).entry,goOn);
assert.equal(inflected('The plane took off.','took',10).entry,takeOff);
assert.equal(inflected('The plane took off.','off',15).entry,takeOff);
assert.equal(inflected('She went   on.','went',4).display,'went   on');
assert.equal(inflected('She went, on.','went',4).entry,null,
 'do not span punctuation as if it were whitespace');
assert.equal(inflected('She went on.','went',0),null,
 'forged DOM offset must not resolve another word');
assert.equal(inflected('She went on.','went',5),null,
 'a click inside a token is not an exact word start');


const appended={terms:[{term:'take off',type:'idiom',context:'أقلع'}]};
const appendedDict=[{term:'book',literal:'كتاب'}];
const call=(sentence,selected,offset)=>lookup({story:appended,dictionary:appendedDict,sentence,selected,offset,lemmas:w=>[w]});
assert.equal(call('At dawn.', 'dawn', 3).entry,null,'unknown before append');
appended.terms.push({term:'at dawn',type:'phrase',context:'عند الفجر'});
assert.equal(call('At dawn.', 'dawn', 3).entry.term,'at dawn','rebuild lazy index when same terms array grows');
assert.equal(call('She reads.', 'reads', 4).entry,null);
appendedDict.push({term:'reads',literal:'يقرأ'});
assert.equal(call('She reads.', 'reads', 4).entry.literal,'يقرأ','rebuild when same dictionary array grows');
assert.equal(call('A cat.', 'at', 3),null,'no suffix lookup inside longer word');
assert.equal(call("I can't.", 'can', 2),null,'no partial contraction lookup');
assert.equal(call('A café.', 'café', 2).entry,null,'complete accented word remains selectable');
const shell=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.js'),'utf8');
const css=fs.readFileSync(path.join(root,'app/src/main/assets/lingua-shell.css'),'utf8');
const backup=fs.readFileSync(path.join(root,'app/src/main/assets/data-backup.js'),'utf8');
assert.ok(shell.includes("'mosaic-courtyard':'Mosaic Courtyard'"),'theme selectable in Settings');
assert.match(css,/body\.theme-mosaic-courtyard[\s\S]*?border-radius:46%/,'courtyard has distinct arched layout');
assert.ok(backup.includes("'mosaic-courtyard'].includes(val)"),'theme survives backup validation');

// Editorial corrections can replace a term without changing array length.
// An explicit revision or invalidation must refresh the cached phrase meaning
// without an O(dictionary-size) scan on every word tap.
const editedBatch={terms:[{term:'go on',context:'original'}],lexiconRevision:1};
const editorialDict=[{term:'harbor',literal:'ميناء'}];
const editorialLookup=(text,selected,offset)=>lookup({story:editedBatch,
 dictionary:editorialDict,sentence:text,selected,offset,lemmas:w=>[w]});
assert.equal(editorialLookup('We go on.','go',3).entry.context,'original');
editedBatch.terms[0]={term:'go on',context:'revised'};
editedBatch.lexiconRevision++;
assert.equal(editorialLookup('We go on.','go',3).entry.context,'revised',
 'same-length phrase correction must invalidate the index');
editedBatch.terms[0]={term:'go on',context:'final'};
context.window.LinguaLookup.invalidate(editedBatch);
assert.equal(editorialLookup('We go on.','go',3).entry.context,'final',
 'explicit invalidation supports importers without revision counters');
editorialDict[0]={term:'harbor',literal:'مرفأ'};
editorialDict.lexiconRevision=1;
assert.equal(editorialLookup('A harbor.','harbor',2).entry.literal,'مرفأ',
 'dictionary revision must refresh a same-length replacement');

console.log('PASS: indexed idioms, repeated matches, inflections, punctuation, unknowns, offline fallbacks and reader integration');
