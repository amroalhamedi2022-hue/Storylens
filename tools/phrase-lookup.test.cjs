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
assert.equal(hit('plain',3,'A plain answer.').entry.term,'plain','no phrase outside matching span');
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
assert.equal(boundary.entry,null,'never match phrase inside larger words');
assert.ok(html.indexOf('src="lingua-lookup.js"') < html.indexOf('src="reader-experience.js"'),
 'load indexed resolver before reader interception');
assert.match(readerJs,/addEventListener\('click',event=>[\s\S]*?window\.LinguaLookup\.lookup\(/,
 'production reader uses resolver in a click capture handler');
assert.match(readerJs,/event\.stopImmediatePropagation\(\);\s*wordSheet\(/,
 'one word tap opens exactly one existing sheet');

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

console.log('PASS: indexed idioms, repeated matches, inflections, punctuation, unknowns, offline fallbacks and reader integration');
