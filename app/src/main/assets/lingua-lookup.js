/* Lingua Tales — indexed, source-bound phrase and dictionary lookup.
 * Exact edited phrase matches take priority; never invent a contextual gloss.
 * One index per story object, built lazily and reused across word taps. */
(function (global) {
'use strict';
const indexes = new WeakMap();
const tokens = value => (String(value).toLowerCase().match(/[\p{L}]+(?:['’\-][\p{L}]+)*/gu) || []);
const escapeRegex = value => value.replace(/[.*+?^{}()|[\]\\$]/g, '\\$&');
function createIndex(story, dictionary) {
 const terms = (story.terms || []).concat(dictionary || []);
 const single = new Map(), phrases = new Map();
 for (const entry of terms) {
  if (!entry || typeof entry.term !== 'string') continue;
  const term = entry.term.trim();
  if (!term || term.length > 160) continue;
  if (!/\s/u.test(term)) {
   const key = term.toLowerCase();
   if (!single.has(key)) single.set(key, entry); // edited story term wins
   continue;
  }
  const item = {entry, term, regex: new RegExp('(^|[^\\p{L}])(' + escapeRegex(term) + ')(?=$|[^\\p{L}])', 'giu')};
  for (const word of new Set(tokens(term))) {
   const bucket = phrases.get(word) || [];
   bucket.push(item);
   phrases.set(word, bucket);
  }
 }
 for (const bucket of phrases.values()) bucket.sort((a,b) => b.term.length-a.term.length);
 return {single, phrases};
}
function indexFor(story, dictionary) {
 const previous = indexes.get(story);
 if (previous && previous.terms === story.terms && previous.dictionary === dictionary) return previous.index;
 const index = createIndex(story, dictionary);
 indexes.set(story, {terms: story.terms, dictionary, index});
 return index;
}
function lookup({story, dictionary, sentence, selected, offset, lemmas, lexicon, freeDict}) {
 if (!story || typeof sentence !== 'string' || typeof selected !== 'string' ||
     !selected || !Number.isInteger(offset) || offset < 0 || offset + selected.length > sentence.length)
  return null;
 const index = indexFor(story, dictionary);
 // Index by the clicked surface form, not every phrase in every story.
 const candidates = index.phrases.get(selected.toLowerCase()) || [];
 for (const item of candidates) {
  item.regex.lastIndex = 0;
  let match;
  while ((match = item.regex.exec(sentence)) !== null) {
   const start = match.index + match[1].length;
   const end = start + match[2].length;
   if (offset >= start && offset + selected.length <= end)
    return {entry:item.entry, display:match[2]};
  }
 }
 const roots = typeof lemmas === 'function' ? lemmas(selected) : [selected.toLowerCase()];
 let entry = null;
 for (const root of roots) {
  entry = index.single.get(String(root).toLowerCase()) || null;
  if (entry) break;
 }
 if (!entry && lexicon && typeof lexicon.resolve === 'function') entry = lexicon.resolve(selected);
 if (!entry && freeDict && typeof freeDict.resolve === 'function') entry = freeDict.resolve(selected);
 return {entry:entry || null, display:selected};
}
global.LinguaLookup = Object.freeze({lookup});
})(window);
