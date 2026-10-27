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
  const sentenceNodes = [];
  const document = {
    documentElement:{dataset:{},clientHeight:800},
    querySelectorAll(selector) { return selector === '.reader .sentence' ? sentenceNodes : []; }
  };
  const calls = {restored:[]};
  const context = {
    document,
    state:{page:'library',story:null,chapter:0},
    global:{scrollY:0,innerHeight:800,
      requestAnimationFrame(callback){callback();},
      scrollTo(x,y){calls.restored.push(y);},
      setTimeout(callback){callback();}},
    calls,
    sentenceNodes,
    get(key, fallback) { return Object.prototype.hasOwnProperty.call(storage,key) ? storage[key] : fallback; },
    put(key,value) { storage[key] = value; },
    storage
  };
  vm.createContext(context);
  vm.runInContext(source, context, {filename:'lingua-shell.js#typography',timeout:2000});
  return {...context, api:context.__api, document, storage, sentenceNodes};
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
  let geometryRead=0;
  h.state.page='reader';
  h.state.story={id:'story-1',chapters:[{paragraphs:[]},{paragraphs:[]},{paragraphs:Array(8).fill('p')}]};
  h.state.chapter=2;
  h.global.scrollY=321;
  h.sentenceNodes.push({
    dataset:{i:'3'},
    getBoundingClientRect(){
      geometryRead++;
      return geometryRead===1?{top:100,bottom:140}:{top:150,bottom:190};
    }
  });
  assert.equal(h.api.applyReadingSize('en','large'),true);
  assert.equal(h.storage['scroll_story-1_2'],321,'legacy scroll checkpoint is saved');
  assert.deepEqual(h.calls.restored,[371],
    'same paragraph remains at its prior viewport offset after simulated reflow');
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
