'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const js = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/reader-experience.js'), 'utf8');
const story = {id: 'book', chapters: [
  {title: 'One', paragraphs: []}, {title: 'Two', paragraphs: []}
]};
const saved = {bookmarks: {book: {chapter: 'not-a-number', scroll: 99}}};
const scrolls = [];
let renders = 0;
let closes = 0;
const window = {
  scrollY: 0,
  scrollTo(x, y) { scrolls.push([x, y]); }
};
const sandbox = {
  window, state: {story, page: 'reader', chapter: 0, toolbar: true},
  catalog: {stories: [story], genres: []},
  document: {
    documentElement: {lang: 'ar'},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  },
  get: (key, fallback) => Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : fallback,
  put: (key, value) => { saved[key] = value; },
  esc: String,
  closeSheet() { closes++; },
  library() {}, openStory() {}, settings() {}, theme() {}, inlineTranslate() {},
  renderReader() { renders++; },
  Date
};
vm.runInNewContext(js, sandbox, {timeout: 5000});
window.stlJumpBookmark();
assert.equal(sandbox.state.chapter, 0, 'invalid chapter must not reach reader');
assert.equal(renders, 0);
assert.equal(closes, 0);
assert.equal(scrolls.length, 0);

saved.bookmarks.book = {chapter: 1, scroll: Infinity};
window.stlJumpBookmark();
assert.equal(sandbox.state.chapter, 1);
assert.equal(saved.chapter_book, 1);
assert.equal(renders, 1);
assert.equal(scrolls.at(-1)[1], 0, 'invalid scroll must reset safely');

saved.bookmarks.book = {chapter: 9, scroll: -20};
window.stlJumpBookmark();
assert.equal(sandbox.state.chapter, 1, 'removed chapters clamp to last existing chapter');
assert.equal(scrolls.at(-1)[1], 0);

saved.bookmarks.book = {chapter: 0, scroll: 72};
window.stlJumpBookmark();
assert.equal(sandbox.state.chapter, 0);
assert.equal(scrolls.at(-1)[1], 72);

sandbox.state.chapter = 0;
window.stlChapter('1');
window.stlChapter(NaN);
assert.equal(sandbox.state.chapter, 0, 'invalid chapter navigation is ignored');
// Imported chapter progress must never yield fractional or non-finite indexes.
const indexSource = js.match(/const chapterIndex=s=>\{[\s\S]*?\n\};/);
assert.ok(indexSource, 'reader chapter-index implementation is present');
const readIndex = () => vm.runInNewContext(indexSource[0] + '\nchapterIndex(story)', {
 story, get: (key, fallback) => Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : fallback,
 Number, Math
});
saved.chapter_book = 1.5;
assert.equal(readIndex(), 0, 'fractional chapter progress is rejected');
saved.chapter_book = Infinity;
assert.equal(readIndex(), 0, 'non-finite chapter progress is rejected');
saved.chapter_book = 12;
assert.equal(readIndex(), 1, 'removed chapter progress clamps to last chapter');
saved.chapter_book = 1;
assert.equal(readIndex(), 1, 'valid chapter progress is retained');
saved.scroll_book_1 = Infinity;
window.stlChapter(1);
assert.equal(scrolls.at(-1)[1], 0, 'infinite saved chapter scroll resets');
saved.scroll_book_0 = -25;
window.stlChapter(0);
assert.equal(scrolls.at(-1)[1], 0, 'negative saved chapter scroll resets');
saved.scroll_book_1 = 64;
window.stlChapter(1);
assert.equal(scrolls.at(-1)[1], 64, 'valid saved chapter scroll restores');
console.log('PASS: corrupt bookmark and chapter navigation guards');
