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
 {afterParagraph: 0, src: 'art/verne/station.webp', alt: 'Railway station', credit: 'CC0 illustration', position: 'edge-start'},
 {afterParagraph: 1, src: 'https://example.org/remote.png', alt: 'Remote asset'},
 {afterParagraph: 1, src: 'art/../traversal.png', alt: 'Traversal asset'},
 {afterParagraph: 2, src: 'art/verne/map.png', alt: 'Historic map', position: 'wide'},
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
 createElement(tag) {return {tag, children: [], appendChild(child) {this.children.push(child);}, setAttribute() {}};}
};
const state = {story, page: 'reader', chapter: 0};
const sandbox = {
 window: {scrollY: 0}, document, state, catalog: {stories: [story]},
 get: (_, fallback) => fallback, put() {}, esc: String, closeSheet() {},
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
assert.equal(added[1].figure.children[0].src, 'art/verne/map.png');
assert.equal(added[1].figure.children.length, 1);
assert.equal(chapter.paragraphs[0].ar, 'محطة.', 'Arabic learning text unchanged');
console.log('PASS: inline art anchors, offline allowlist, alt, lazy decode and translation integrity');
