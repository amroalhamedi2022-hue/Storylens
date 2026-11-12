'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const curl=fs.readFileSync('app/src/main/assets/physical-page-curl.js','utf8');
const reader=fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const css=fs.readFileSync('app/src/main/assets/lt-final-experience.css','utf8');
const curlCss=fs.readFileSync('app/src/main/assets/physical-page-curl.css','utf8');

assert.ok(html.lastIndexOf('lt-final-experience.css')>html.lastIndexOf('lt-antique-book.css'),
 'unified visual finish must load after historical theme layers');
assert.match(curl,/const taper=\.34\*Math\.max\(0,1-p\/\.86\)/,
 'moving leaf remains broad instead of collapsing into the old triangle');
assert.match(curl,/const edgeZone=Math\.min\(112,Math\.max\(64,rect\.width\*\.17\)\)/,
 'physical edge has a forgiving phone/tablet grab zone');
assert.match(curl,/!h\.started&&h\.tapEligible&&e\.timeStamp-h\.downAt<=320/,
 'short outer-margin tap commits a page turn');
assert.match(reader,/tapAllowed:target=>pageSwipeAllowed/,
 'dictionary tokens and controls are excluded from tap-to-turn');
assert.match(reader,/for\(const paragraph of source\)/,
 'chapter-boundary paper is filled with real adjacent source, not one teaser paragraph');
assert.match(reader,/preview\.scrollHeight>maxHeight\+1/,
 'adjacent source is bounded to one physical sheet');
assert.match(curlCss,/perspective:1800px/);
assert.match(curlCss,/striped triangular-fan appearance/);

for(const selector of [
 '.library .header.storylens-header',
 '.library .shelf.lt-novel-shelf .lt-novel-card',
 '.lt-drawer',
 '.reader #sentences.lt-curl-book>.lt-book-page',
 'dialog.lt-chapter-gallery'
])assert.ok(css.includes(selector),'missing final visible surface: '+selector);
assert.match(css,/grid-template-columns:repeat\(auto-fit,minmax\(min\(100%,220px\),1fr\)\)/,
 'library uses a dense responsive cover-first shelf');
assert.match(css,/font-size:clamp\(20px,1\.55vw,26px\)/,
 'reader body is visibly comfortable, not the old undersized text');
assert.match(css,/\.lt-chapter-gallery-sheet\{overflow-y:auto!important/,
 'chapter gallery cannot trap clipped lower cards');
assert.match(css,/@media\(orientation:landscape\) and \(min-width:700px\)/,
 'landscape receives a dedicated full-book layout');
assert.doesNotMatch(css,/(?:lt-inline-illustration|lt-chapter-tile-visual\s+img|lt-art-inspection)[^{]*\{[^}]*\bfilter\s*:/,
 'final layer does not blur or recolour historical pixels');

console.log('PASS: unified visible library, reader, curl, gallery and settings finish');
