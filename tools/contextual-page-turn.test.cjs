'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const reader = fs.readFileSync('app/src/main/assets/reader-experience.js','utf8');
const css = fs.readFileSync('app/src/main/assets/reader-experience.css','utf8');
const start = reader.indexOf('function contextualMeaning(');
const end = reader.indexOf('\nwordSheet=function', start);
assert.ok(start >= 0 && end > start, 'production contextual selector is present');
const productionHelper = reader.slice(start, end);
const context = {};
vm.runInNewContext(productionHelper + "\nresult = contextualMeaning({term:'bank',meanings:['مؤسسة مالية','ضفة النهر','صف من الأشياء']},{en:'They waited on the bank of the river.',ar:'انتظروا على ضفة النهر حتى وصل القارب.'},{terms:[]});", context);
assert.equal(context.result.kind, 'inferred');
assert.equal(context.result.text, 'ضفة النهر');
const authored = {};
vm.runInNewContext(productionHelper + "\nconst entry={term:'take off',context:'ينطلق في رحلة'}; result = contextualMeaning(entry,{en:'The plane will take off.',ar:'ستقلع الطائرة.'},{terms:[entry]});", authored);
assert.equal(authored.result.kind, 'editorial');
assert.equal(authored.result.text, 'ينطلق في رحلة');
const missing = {};
vm.runInNewContext(productionHelper + "\nresult = contextualMeaning({term:'xyz',meanings:['مصطلح بعيد']},{en:'xyz appeared.',ar:'وصل القطار إلى المحطة.'},{terms:[]});", missing);
assert.equal(missing.result.kind, 'sentence');
assert.match(missing.result.text, /لم يُعثر على معنى مفرد موثّق/);
assert.ok(!missing.result.text.includes('هذه معانٍ معجمية عامة وليست تحديدًا آليًا'));
assert.match(reader, /function installPageTurn\(\)/);
assert.match(reader, /const LT_PAGE_PARAGRAPHS=4/);
assert.match(reader, /count>=LT_PAGE_PARAGRAPHS/);
assert.match(reader, /readerPage:Number\.isInteger\(currentPage\)/);
assert.match(reader, /Math\.floor\(mark\.paragraph\/LT_PAGE_PARAGRAPHS\)/);
assert.match(reader, /readpage_/);
assert.match(reader, /touchstart/);
assert.match(reader, /lt-turn-forward/);
assert.match(reader, /installPageTurn\(\);/);
assert.match(css, /\.lt-book-page\.is-active/);
assert.match(css, /@keyframes ltPageTurnForward/);
assert.match(css, /prefers-reduced-motion:reduce/);
const swipeStart = reader.indexOf('function pageSwipeAllowed(');
const swipeEnd = reader.indexOf('function installPageTurn()', swipeStart);
assert.ok(swipeStart >= 0 && swipeEnd > swipeStart, 'production page-swipe guard is present');
const swipeContext = {};
vm.runInNewContext(reader.slice(swipeStart, swipeEnd) + '\nglobalThis.__pageSwipeAllowed = pageSwipeAllowed;', swipeContext);
const swipeAllowed = swipeContext.__pageSwipeAllowed;
const plainTarget = {nodeType:1, closest:()=>null};
const buttonTarget = {nodeType:1, closest:()=>({tagName:'BUTTON'})};
const textInsideButton = {nodeType:3, parentElement:buttonTarget};
assert.equal(swipeAllowed(plainTarget, ''), true, 'ordinary reading surface can page-swipe');
assert.equal(swipeAllowed(plainTarget, 'selected English words'), false, 'active text selection must not turn into a page swipe');
assert.equal(swipeAllowed(buttonTarget, ''), false, 'interactive controls must not trigger page gestures');
assert.equal(swipeAllowed(textInsideButton, ''), false, 'text nodes inside controls are protected too');
assert.equal(swipeAllowed(null, ''), true, 'missing event target fails safely without throwing');
assert.ok(reader.includes("sentenceBox.addEventListener('touchcancel',resetTouch"), 'touch cancellation resets gesture state');
assert.ok(reader.includes("window.getSelection?.()?.toString()||''"), 'selection lookup is null-safe');
console.log('PASS: contextual meaning and page-turn production regression');

assert.match(reader, /const ltFontChoices=\[/, 'font gallery choices are defined in production');
for (const id of ['system','naskh','sans','serif','rounded','humanist','classic','mono','handwritten','casual-hand','calligraphy']) {
 assert.match(reader, new RegExp("id:'"+id+"'"), 'font choice '+id+' exists');
}
assert.match(reader, /ltApplyFonts\(\)/, 'font choice is applied to the reader');
assert.match(reader, /lt_font_choice/, 'font choice is persisted offline');
assert.match(reader, /lt-font-choice/, 'font picker is rendered in reader settings');
assert.match(css, /\.lt-font-panel/, 'font picker is styled');

assert.match(reader, /Aref Ruqaa Ink/, 'Arabic handwriting font stack is offered');
assert.match(reader, /Segoe Print/, 'English handwriting font stack is offered');

assert.match(reader, /const ltGlassPalettes=\[/, 'Liquid Glass palette gallery exists');
for (const id of ['sapphire','violet','rose','sunset','ocean','mint','lavender','graphite','pearl','rainbow']) {
 assert.match(reader, new RegExp("id:'"+id+"'"), 'color palette '+id+' exists');
}
assert.match(reader, /lt_glass_tint/, 'adjustable glass tint is persisted');
assert.match(reader, /lt_reduce_transparency/, 'reduced transparency accessibility option exists');
assert.match(reader, /lt_high_contrast/, 'higher contrast accessibility option exists');
assert.match(css, /--lt-glass-opacity/, 'glass material has adjustable opacity');
assert.match(css, /lt-glass-swatch\[aria-pressed="true"\]/, 'selected palette is visibly indicated');
assert.match(css, /prefers-reduced-transparency:reduce/, 'system reduced-transparency preference is respected');
assert.match(css, /prefers-contrast:more/, 'system increased-contrast preference is respected');
