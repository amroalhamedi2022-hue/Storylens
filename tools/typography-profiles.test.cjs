/* Exercise LT-12 typography settings from the production shell code. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const shell = fs.readFileSync('app/src/main/assets/lingua-shell.js', 'utf8');
const css = fs.readFileSync('app/src/main/assets/lingua-shell.css', 'utf8');
const start = shell.indexOf('const fontChoices=');
const end = shell.indexOf('/* LT-06:', start);
assert.ok(start >= 0 && end > start, 'production typography functions must remain before locale functions');
const source = shell.slice(start, end) + '\nglobalThis.__api={fontChoices,fontDefaults,fontKeys,applyFont,loadFonts,readingSizeChoices,readingSizeDefaults,readingSizeKeys,applyReadingSize,loadReadingSizes};';

function harness(saved = {}) {
  const storage = {...saved};
  const document = {documentElement:{dataset:{}}};
  const calls = {saved:0,restored:[]};
  const context = {
    document,
    state:{page:'library',story:null,chapter:0},
    global:{scrollY:0},
    calls,
    safeOffset(value){return value;},
    savePosition(){calls.saved++;},
    nextFrame(callback){callback();},
    restoreReadingPosition(...args){calls.restored.push(args);},
    get(key, fallback) { return Object.prototype.hasOwnProperty.call(storage,key) ? storage[key] : fallback; },
    put(key,value) { storage[key] = value; },
    storage
  };
  vm.createContext(context);
  vm.runInContext(source, context, {filename:'lingua-shell.js#typography',timeout:2000});
  return {...context, api:context.__api, document, storage};
}

{
  const h = harness();
  h.api.loadFonts();
  h.api.loadReadingSizes();
  assert.equal(h.document.documentElement.dataset.ltArabicFont, 'sans');
  assert.equal(h.document.documentElement.dataset.ltEnglishFont, 'serif');
  assert.equal(h.document.documentElement.dataset.ltArabicSize, 'comfortable');
  assert.equal(h.document.documentElement.dataset.ltEnglishSize, 'comfortable');
}
{
  const h = harness();
  assert.equal(h.api.applyReadingSize('ar','large'), true);
  assert.equal(h.storage.readingSizeArabic, 'large');
  assert.equal(h.document.documentElement.dataset.ltArabicSize, 'large');
  assert.equal(h.document.documentElement.dataset.ltEnglishSize, undefined, 'Arabic preference must not mutate English');
  assert.equal(h.api.applyReadingSize('en','compact'), true);
  assert.equal(h.storage.readingSizeEnglish, 'compact');
  assert.equal(h.document.documentElement.dataset.ltEnglishSize, 'compact');
  assert.equal(h.document.documentElement.dataset.ltArabicSize, 'large', 'English preference must not mutate Arabic');
}
{
  const h = harness({readingSizeArabic:'unsupported',readingSizeEnglish:'large',fontArabic:'invalid',fontEnglish:'sans'});
  h.api.loadFonts();
  h.api.loadReadingSizes();
  assert.equal(h.document.documentElement.dataset.ltArabicFont,'sans');
  assert.equal(h.document.documentElement.dataset.ltEnglishFont,'sans');
  assert.equal(h.document.documentElement.dataset.ltArabicSize,'comfortable');
  assert.equal(h.document.documentElement.dataset.ltEnglishSize,'large');
  assert.equal(h.api.applyReadingSize('ar','huge'),false);
  assert.equal(h.storage.readingSizeArabic,'unsupported','invalid request must not overwrite saved state');
  assert.equal(h.api.applyFont('en','naskh'),false);
}
{
  const h = harness();
  h.state.page='reader';h.state.story={id:'story-1'};h.state.chapter=2;h.global.scrollY=321;
  assert.equal(h.api.applyReadingSize('en','large'),true);
  assert.equal(h.calls.saved,1,'typography changes save a semantic reading anchor');
  assert.deepEqual(h.calls.restored,[['story-1',2,321]],'the same chapter and fallback position are restored after reflow');
}
{
  const h = harness();
  assert.equal(h.api.applyFont('ar','naskh'),true);
  assert.equal(h.storage.fontArabic,'naskh');
  assert.equal(h.api.applyFont('en','sans'),true);
  assert.equal(h.storage.fontEnglish,'sans');
  assert.equal(h.document.documentElement.dataset.ltArabicFont,'naskh');
  assert.equal(h.document.documentElement.dataset.ltEnglishFont,'sans');
}
assert.match(shell,/Text size & line spacing/);
assert.match(shell,/حجم النص وتباعد السطور/);
assert.match(css,/html\[data-lt-arabic-size="large"\]/);
assert.match(css,/html\[data-lt-english-size="large"\]/);
assert.match(css,/letter-spacing:0!important/,'Arabic shaping must not receive added letter spacing');
assert.match(css,/--lt-en-reading-spacing:\.012em/,'large English profile exposes its spacing choice');
console.log('PASS: independent offline Arabic/English font and reading-size preferences, validation, fallback and CSS profiles');
