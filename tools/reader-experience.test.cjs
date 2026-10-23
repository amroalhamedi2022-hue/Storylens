'use strict';
// Regression: navigation must re-run the enhanced reader, not the captured base renderer.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const js = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/reader-experience.js'), 'utf8');
const store = new Map();
const story = {
 id: 'book-one', title: 'Book One',
 chapters: [
  {title: 'Chapter One', paragraphs: [{en: 'First sentence.', ar: 'الجملة الأولى.'}]},
  {title: 'Chapter Two', paragraphs: [{en: 'Second sentence.', ar: 'الجملة الثانية.'}]}
 ]
};
let originalRenderCalls = 0, accessibleSentences = 0, contextMenuHandlers = 0, scrollTarget = null;
const sentenceLabels = [], readerPanels = [];
const footer = {insertAdjacentElement(position, panel) {assert.equal(position, 'beforebegin'); readerPanels.push(panel.innerHTML);}};
const sheet = {querySelector(selector) {return selector === 'footer' ? footer : null;}, appendChild(panel) {readerPanels.push(panel.innerHTML);}};
const sentence = {
 dataset: {i: '0'},
 setAttribute(name, value) {if (name === 'tabindex') accessibleSentences++; if (name === 'aria-label') sentenceLabels.push(value);},
 addEventListener(name) {if (name === 'contextmenu') contextMenuHandlers++;}
};
const document = {
 documentElement: {lang: 'ar'},
 querySelector(selector) {
  if (selector === '#modals .sheet') return sheet;
  if (selector === '.reader-label') return {appendChild() {}};
  return null; // No library view while testing reader navigation.
 },
 querySelectorAll(selector) {return selector === '.reader .sentence' ? [sentence] : [];},
 createElement() {return {setAttribute() {}, textContent: ''};}
};
const state = {story, page: 'reader', chapter: 0, toolbar: true};
const sandbox = {
 window: {scrollY: 175, scrollTo(x, y) {scrollTarget = [x, y];}},
 document, state, catalog: {stories: [story]},
 get: (key, fallback) => store.has(key) ? store.get(key) : fallback,
 put: (key, value) => store.set(key, value),
 library() {}, openStory() {}, settings() {}, theme() {}, inlineTranslate() {},
 renderReader() {originalRenderCalls++;},
 closeSheet() {}, esc: String, console, Date
};
vm.runInNewContext(js, sandbox, {filename: 'reader-experience.js', timeout: 5000});

sandbox.window.stlChapter(1);
assert.equal(state.chapter, 1, 'chapter picker changes chapter');
assert.equal(originalRenderCalls, 1, 'base renderer runs once');
assert.equal(accessibleSentences, 1, 'enhanced reader sets sentence keyboard focus');
assert.equal(contextMenuHandlers, 1, 'enhanced reader rebinds translation context menu');
assert.equal(store.get('has_read_book-one'), true, 'chapter navigation persists reading progress');
assert.equal(store.get('scroll_book-one_0'), 175, 'prior chapter scroll is saved');
assert.equal(store.get('chapter_book-one'), 1, 'selected chapter is saved');
assert.deepEqual(scrollTarget, [0, 0], 'new chapter scroll resets');

store.delete('has_read_book-one');
store.set('bookmarks', {'book-one': {chapter: 0, scroll: 88}});
sandbox.window.stlJumpBookmark();
assert.equal(state.chapter, 0, 'bookmark restores chapter');
assert.equal(originalRenderCalls, 2, 'bookmark re-renders once');
assert.equal(accessibleSentences, 2, 'bookmark keeps accessibility annotations');
assert.equal(contextMenuHandlers, 2, 'bookmark keeps translation interaction');
assert.equal(store.get('has_read_book-one'), true, 'bookmark re-establishes reading progress');
assert.deepEqual(scrollTarget, [0, 88], 'bookmark restores scroll position');
assert.ok(sentenceLabels.at(-1).includes('الجملة الإنجليزية'), 'Arabic reader controls remain accessible');
document.documentElement.lang = 'en';
sandbox.renderReader();
assert.ok(sentenceLabels.at(-1).includes('English sentence'), 'English reader accessibility labels are translated');
sandbox.settings();
assert.match(readerPanels.at(-1), /Reading tools/, 'reader navigation panel uses English');
assert.match(readerPanels.at(-1), /Save bookmark/, 'bookmark action uses English');
assert.match(readerPanels.at(-1), /Jump to bookmark/, 'jump action uses English');
assert.match(readerPanels.at(-1), /Arabic translation/, 'English UI still explains Arabic translation');
document.documentElement.lang = 'ar';
sandbox.settings();
assert.match(readerPanels.at(-1), /أدوات القراءة/, 'reader panel restores Arabic without losing state');
assert.equal(story.chapters[0].paragraphs[0].ar, 'الجملة الأولى.', 'learning translation remains Arabic');
console.log('PASS: chapter and bookmark navigation preserve enhanced reader accessibility, translation and progress');
