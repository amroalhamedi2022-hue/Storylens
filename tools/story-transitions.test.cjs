'use strict';
// LT-02: exercise the exact production navigation gate, not a reimplementation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/lingua-shell.js'), 'utf8');
const begin = source.indexOf('(function installStoryTransitions(){');
const end = source.indexOf('\n})();', begin);
assert.ok(begin >= 0 && end > begin, 'production navigation IIFE exists');
const code = source.slice(begin, end + 5);
const timers = new Map(), store = new Map(), scrolls = [];
let timerId = 0, backs = 0, cardFocus = 0, headingFocus = 0, reduced = false;
const state = {page: 'library', story: null, chapter: 0};
const story = {id: 'book', chapters: [{title: 'First', paragraphs: [{en: 'First paragraph.'}, {en: 'Second paragraph.'}]}]};
const card = {
 getAttribute(name) { return name === 'onclick' ? "openStory('book')" : null; },
 setAttribute(name, value) { assert.equal(name, 'tabindex'); assert.equal(value, '-1'); },
 focus(options) { assert.equal(options.preventScroll, true); cardFocus++; }
};
const heading = {setAttribute() {}, focus(options) {assert.equal(options.preventScroll, true); headingFocus++;}};
const reader = {classList: {add(name) {assert.match(name, /^lt-reader-(enter|exit)$/);}}};
let sentenceNodes=[];
const document = {
 querySelector(selector) {
  if(selector === '.reader')return reader;
  if(selector === '.reader h2')return heading;
  if(!selector.startsWith('.reader .sentence[')||!selector.endsWith(']'))return null;
  const marker=selector.indexOf('data-i="');
  if(marker<0)return null;
  const value=selector.slice(marker+8,-2);
  return sentenceNodes.find(node=>node.getAttribute('data-i')===value)||null;
 },
 querySelectorAll(selector) {
  if(selector === '.library .card')return [card];
  if(selector === '.reader .sentence[data-i]')return sentenceNodes;
  return [];
 },
 getElementById() {return {childElementCount: 0};}
};
const window = {
 scrollY: 0,
 innerHeight: 800,
 scrollTo(x, y) {assert.equal(x, 0); this.scrollY = y; scrolls.push(y);},
 requestAnimationFrame(callback) {callback();},
 matchMedia() {return {matches: reduced};},
 setTimeout(callback) {const id = ++timerId; timers.set(id, callback); return id;},
 clearTimeout(id) {timers.delete(id);},
 addEventListener(name, callback) {this[name] = callback;},
 history: {state: {page: 'reader'}, back() {backs++; window.popstate();}}
};
const sandbox = {
 window, global: window, state, document,
 get: (key, fallback) => store.has(key) ? store.get(key) : fallback,
 put: (key, value) => store.set(key, value),
 openStory(id) {if (id !== 'book') return; state.story = story; state.page = 'reader'; state.chapter = 0;},
 libraryBack() {state.page = 'library'; window.scrollTo(0, 0);},
 fullTranslation() {state.page = 'translation'; window.scrollTo(0, 0);},
 backToReader() {state.page = 'reader'; window.scrollTo(0, 0);},
 closeSheet() {}, console
};
vm.runInNewContext(code, sandbox, {timeout: 5000});
function flush() {
 for (let pass = 0; pass < 4 && timers.size; pass++) {
  const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach(fn => fn());
 }
 assert.equal(timers.size, 0, 'no stranded timers');
}
for (let i = 0; i < 20; i++) {
 window.scrollY = 250 + i;
 sandbox.openStory('book');
 assert.equal(state.page, 'reader');
 if (i) assert.equal(window.scrollY, 109 + i, 'resume previous chapter position');
 else assert.equal(window.scrollY, 0, 'new chapter starts at top');
 window.scrollY = 110 + i;
 sandbox.libraryBack();
 sandbox.libraryBack(); // repeated Back must not start a second close
 flush();
 assert.equal(state.page, 'library');
 assert.equal(window.scrollY, 250 + i, 'restore exact library scroll');
 assert.equal(store.get('scroll_book_0'), 110 + i, 'save reading position');
}
assert.equal(backs, 20, 'one history navigation per cycle');
assert.equal(cardFocus, 20, 'return keyboard focus to rebuilt story card');
assert.equal(headingFocus, 20, 'focus reader heading without scrolling');
window.scrollY = 150;
sandbox.openStory('book');
assert.equal(window.scrollY, 129, 'saved chapter scroll restored');
window.scrollY = 317;
sandbox.fullTranslation();
assert.equal(state.page, 'translation');
assert.equal(store.get('scroll_book_0'), 317, 'translation remembers reading position');
sandbox.backToReader();
assert.equal(window.scrollY, 317, 'toolbar/Android Back restores reading position');
sandbox.libraryBack(); flush();

// Semantic progress survives font reflow: preserve the first visible paragraph
// and its viewport offset, while keeping the legacy pixel position as fallback.
store.set('reading_anchor_book_0', null);
store.set('scroll_book_0', 0);
const paragraph=(index,top,bottom)=>({
 getAttribute(name){return name==='data-i'?String(index):null;},
 getBoundingClientRect(){return {top,bottom};}
});
sentenceNodes=[paragraph(0,-420,-220),paragraph(1,-25,55)];
window.scrollY=400;
sandbox.openStory('book');
assert.equal(window.scrollY, 0, 'legacy fallback applies before any semantic anchor exists');
window.scrollY=510;
sandbox.libraryBack(); flush();
const savedAnchor=store.get('reading_anchor_book_0');
assert.equal(savedAnchor?.index,1,'save the visible paragraph index');
assert.equal(savedAnchor?.top,-25,'preserve the signed viewport offset');
assert.equal(store.get('scroll_book_0'),510,'retain pixel fallback for older clients');

sentenceNodes=[paragraph(0,-300,-80),paragraph(1,100,180)]; // reflow moved the paragraph
window.scrollY=400;
sandbox.openStory('book');
assert.equal(window.scrollY,525,'restore the same paragraph to its previous viewport offset');
sandbox.libraryBack(); flush();
store.set('reading_anchor_book_0', null);
store.set('scroll_book_0', Infinity);
reduced = true;
window.scrollY = 25;
sandbox.openStory('book');
assert.equal(window.scrollY, 0, 'corrupt scroll is clamped');
sandbox.libraryBack(); flush();
assert.equal(state.page, 'library');
assert.equal(window.scrollY, 25);
assert.equal(backs, 24);
console.log('PASS: LT-02 production navigation: 20 cycles, rapid Back, scroll, focus, translation and reduced motion');
