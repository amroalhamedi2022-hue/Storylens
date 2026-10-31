'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const js = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/reader-experience.js'), 'utf8');
const added = [];
const chapter = {title: 'Chapter', paragraphs: [
 {en: 'A station.', ar: 'محطة.'}, {en: 'A train.', ar: 'قطار.'}, {en: 'A map.', ar: 'خريطة.'}
], inlineArt: [
 // Invalid entries must not crowd out later valid editorial art.
 ...Array.from({length: 14}, (_, i) => ({afterParagraph: i, src: 'https://example.org/blocked.png', alt: 'Blocked'})),
 {afterParagraph: 0, src: 'art/verne/station.webp', alt: 'Railway station', credit: 'CC0 illustration', position: 'edge-start', aspectRatio: 1.5, crop: 'cover', focalX: 35, focalY: 60},
 {afterParagraph: 1, src: 'https://example.org/remote.png', alt: 'Remote asset'},
 {afterParagraph: 1, src: 'art/../traversal.png', alt: 'Traversal asset'},
 {afterParagraph: 2, src: 'art/verne/map.png', alt: 'Historic map', position: 'wide', aspectRatio: -2, crop: 'cover', focalX: 500, focalY: 50},
 {afterParagraph: 0, src: 'art/verne/duplicate.png', alt: 'Duplicate anchor'},
 {afterParagraph: 1, src: 'art/verne/empty.png', alt: ''}
]};
const story = {id: 'book', chapters: [chapter]};
const sentences = [0, 1, 2].map(i => ({
 dataset: {i: String(i)}, setAttribute() {}, addEventListener() {},
 insertAdjacentElement(where, figure) {assert.equal(where, 'afterend'); added.push({i, figure});}
}));
const document = {
 documentElement: {lang: 'en'},
 querySelector() {return null;},
 querySelectorAll(selector) {return selector === '.reader .sentence' ? sentences : [];},
 createElement(tag) {return {tag, style: {}, children: [], removed: false,
  appendChild(child) {this.children.push(child);}, setAttribute() {}, remove() {this.removed=true;}};}
};
const state = {story, page: 'reader', chapter: 0};
const sandbox = {
 window: {scrollY: 0}, document, state, catalog: {stories: [story]},
 get: (_, fallback) => fallback, put() {}, esc: String, closeSheet() {},
 // The production reader decorates the base word-sheet function. This isolated
 // illustration test supplies the documented host-script dependency explicitly.
 wordSheet() {},
 library() {}, openStory() {}, renderReader() {}, settings() {}, theme() {}, inlineTranslate() {},
 Date
};
vm.runInNewContext(js, sandbox, {timeout: 5000});
sandbox.renderReader();
assert.equal(added.length, 2, 'only two safe, distinct anchored illustrations render');
assert.deepEqual(added.map(x => x.i), [0, 2]);
assert.equal(added[0].figure.children[0].src, 'art/verne/station.webp');
assert.equal(added[0].figure.children[0].alt, 'Railway station');
assert.equal(added[0].figure.children[0].loading, 'lazy');
assert.equal(added[0].figure.children[0].decoding, 'async');
assert.equal(added[0].figure.children[1].textContent, 'CC0 illustration');
assert.equal(added[0].figure.children[0].style.aspectRatio, '1.5', 'layout space reserved');
assert.equal(added[0].figure.children[0].style.objectFit, 'cover', 'opt-in crop');
assert.equal(added[0].figure.children[0].style.objectPosition, '35% 60%', 'bounded focal point');
assert.equal(added[1].figure.children[0].style.aspectRatio, undefined, 'invalid ratio ignored');
assert.equal(added[1].figure.children[0].style.objectPosition, undefined, 'unsafe focal point ignored');
assert.equal(added[0].figure.removed, false);
added[0].figure.children[0].onerror();
assert.equal(added[0].figure.removed, true, 'missing offline image removed without remote fallback');
assert.equal(added[1].figure.children[0].src, 'art/verne/map.png');
assert.equal(added[1].figure.children.length, 1);
assert.equal(chapter.paragraphs[0].ar, 'محطة.', 'Arabic learning text unchanged');
// Existing offline chapter art should appear even when no inlineArt is authored.
chapter.inlineArt=[];
added.length=0;
sandbox.art={'book_0':'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E'};
sandbox.renderReader();
assert.equal(added.length,1,'packaged story scene inserted in actual reading flow');
assert.equal(added[0].i,2,'illustration is anchored after the opening prose');
assert.match(added[0].figure.className,/lt-inline-chapter-scene/);
assert.match(added[0].figure.children[0].src,/^data:image\/svg\+xml/);
assert.match(added[0].figure.children[0].alt,/book — Chapter/);
assert.equal(added[0].figure.children[0].style.aspectRatio,String(1000/620));
added.length=0;
sandbox.art.book_0='https://example.org/remote.svg';
sandbox.renderReader();
assert.equal(added.length,0,'untrusted remote image is never fetched');
added.length=0;delete sandbox.art.book_0;
sandbox.renderReader();
assert.equal(added.length,0,'missing chapter art does not insert a broken image');
console.log('PASS: inline art anchors, chapter-specific offline scenes, safe fallback and translations');
