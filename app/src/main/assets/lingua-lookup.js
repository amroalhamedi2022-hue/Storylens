/* Lingua Tales — indexed, source-bound phrase and dictionary lookup.
 * Exact edited phrase matches take priority; never invent a contextual gloss.
 * One index per story object, built lazily and reused across word taps. */
(function (global) {
'use strict';
const indexes = new WeakMap();
const tokens = value => (String(value).toLowerCase().match(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu) || []);
const canonical=value=>String(value).toLowerCase().replaceAll('’',"'");
const tokenSpans=value=>Array.from(String(value).matchAll(/[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu),m=>
 ({word:m[0],start:m.index,end:m.index+m[0].length}));
function rootsFor(word,lemmas){
 const roots=typeof lemmas==='function'?lemmas(word):[word];
 return new Set([canonical(word),...(Array.isArray(roots)?roots:[]).map(canonical)]);
}
const escapeRegex = value => value.replace(/[.*+?^{}()|[\]\\$]/g, '\\$&');
function createIndex(story, dictionary) {
 const terms = (Array.isArray(story.terms)?story.terms:[]).concat(Array.isArray(dictionary)?dictionary:[]);
 const single = new Map(), phrases = new Map();
 for (const entry of terms) {
  if (!entry || typeof entry.term !== 'string') continue;
  const term = entry.term.trim();
  if (!term || term.length > 160) continue;
  if (!/\s/u.test(term)) {
   const key = canonical(term);
   if (!single.has(key)) single.set(key, entry); // edited story term wins
   continue;
  }
  const words=tokens(term).map(canonical);
  if(words.length<2)continue;
  const item = {entry, term, words,
   simple:/^[\p{L}'’\-]+(?:\s+[\p{L}'’\-]+)+$/u.test(term),
   regex: new RegExp('(^|[^\\p{L}])(' + escapeRegex(term) + ')(?=$|[^\\p{L}])', 'giu')};
  for (const word of new Set(words)) {
   const bucket = phrases.get(word) || [];
   bucket.push(item);
   phrases.set(word, bucket);
  }
 }
 for (const bucket of phrases.values()) bucket.sort((a,b) => b.words.length-a.words.length || b.term.length-a.term.length);
 return {single, phrases};
}
function indexFor(story, dictionary) {
 const previous = indexes.get(story);
 // A same-length editorial correction must not reuse a stale phrase index.
 // Content batch loaders may increment lexiconRevision or call invalidate().
 // Revision checks are O(1), avoiding a full dictionary scan on every tap.
 if (previous && previous.terms === story.terms && previous.dictionary === dictionary &&
     previous.termsLength === (story.terms?.length || 0) && previous.dictionaryLength === (dictionary?.length || 0) &&
     previous.revision === story.lexiconRevision &&
     previous.dictionaryRevision === dictionary?.lexiconRevision) return previous.index;
 const index = createIndex(story, dictionary);
 indexes.set(story, {terms: story.terms, dictionary,
  termsLength:story.terms?.length || 0,dictionaryLength:dictionary?.length || 0,
  revision:story.lexiconRevision,dictionaryRevision:dictionary?.lexiconRevision,index});
 return index;
}
function lookup({story, dictionary, sentence, selected, offset, lemmas, lexicon, freeDict}) {
 if (!story || typeof sentence !== 'string' || typeof selected !== 'string' ||
     !selected || !Number.isInteger(offset) || offset < 0 || offset + selected.length > sentence.length ||
     canonical(sentence.slice(offset,offset+selected.length))!==canonical(selected))
  return null;
 // A tapped dictionary word must be a complete source token. Never resolve
 // the suffix of a longer word ("at" inside "cat") or part of a contraction.
 if (!/\s/u.test(selected) && !tokenSpans(sentence).some(span =>
      span.start === offset && span.end === offset + selected.length)) return null;
 const index = indexFor(story, dictionary);
 // Index by the clicked surface form, not every phrase in every story.
 const roots=rootsFor(selected,lemmas);
 const candidates=Array.from(new Set(Array.from(roots).flatMap(root=>index.phrases.get(root)||[])))
  .sort((a,b)=>b.words.length-a.words.length||b.term.length-a.term.length);
 let spans=null;
 for (const item of candidates) {
  item.regex.lastIndex = 0;
  let match;
  while ((match = item.regex.exec(sentence)) !== null) {
   const start = match.index + match[1].length;
   const end = start + match[2].length;
   if (offset >= start && offset + selected.length <= end)
    return {entry:item.entry, display:match[2]};
  }
  // Reuse reader inflections for contiguous multiword idioms, not punctuation.
  // Never generate a gloss: only return a verified story-authored term.
  if(!item.simple)continue;
  if(!spans)spans=tokenSpans(sentence);
  const clicked=spans.findIndex(span=>span.start===offset&&span.end===offset+selected.length);
  if(clicked<0)continue;
  for(let start=Math.max(0,clicked-item.words.length+1);start<=clicked;start++){
   if(start+item.words.length>spans.length)continue;
   let matches=true;
   for(let j=0;j<item.words.length;j++){
    const span=spans[start+j];
    if(!rootsFor(span.word,lemmas).has(item.words[j]) ||
       (j>0&&!/^\s+$/u.test(sentence.slice(spans[start+j-1].end,span.start)))){
     matches=false;break;
    }
   }
   if(matches)return {entry:item.entry,
    display:sentence.slice(spans[start].start,spans[start+item.words.length-1].end)};
  }
 }
 let entry = null;
 for (const root of roots) {
  entry = index.single.get(canonical(root)) || null;
  if (entry) break;
 }
 if (!entry && lexicon && typeof lexicon.resolve === 'function') entry = lexicon.resolve(selected);
 if (!entry && freeDict && typeof freeDict.resolve === 'function') entry = freeDict.resolve(selected);
 return {entry:entry || null, display:selected};
}
global.LinguaLookup = Object.freeze({lookup, invalidate(story) {
 if (story && (typeof story === 'object' || typeof story === 'function')) indexes.delete(story);
}});
})(window);
