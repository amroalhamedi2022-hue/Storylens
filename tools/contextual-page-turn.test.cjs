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
const englishSourceContext = {};
vm.runInNewContext(productionHelper + "\nconst entry={term:'dwellers',literal:'سكان / قاطنو',context:'The dwellers in Saville Row',note:'Residents of a street'}; result = contextualMeaning(entry,{en:'The dwellers in Saville Row',ar:'كان سكان شارع سافيل يعيشون بهدوء.'},{terms:[entry]});", englishSourceContext);
assert.equal(englishSourceContext.result.kind, 'inferred', 'an English source excerpt is not an Arabic contextual gloss');
assert.equal(englishSourceContext.result.text, 'سكان / قاطنو', 'use the supported Arabic sense when it overlaps the translated sentence');
assert.notEqual(englishSourceContext.result.text, 'The dwellers in Saville Row', 'never label an English excerpt as an Arabic meaning');
const ambiguousContext = {};
vm.runInNewContext(productionHelper + "\nresult = contextualMeaning({term:'riverbank',meanings:['ضفة النهر','طريق النهر']},{en:'The river was wide.',ar:'كان النهر واسعًا.'},{terms:[]});", ambiguousContext);
assert.equal(ambiguousContext.result.kind, 'sentence', 'equally supported senses must abstain rather than choose arbitrarily');
assert.match(ambiguousContext.result.text, /لم يُعثر على معنى مفرد موثّق/);
const duplicateSense = {};
vm.runInNewContext(productionHelper + "\nresult = contextualMeaning({term:'riverbank',meanings:['ضفة النهر','ضفة النهر']},{en:'They reached the riverbank.',ar:'وصلوا إلى ضفة النهر.'},{terms:[]});", duplicateSense);
assert.equal(duplicateSense.result.kind, 'inferred', 'duplicate copies of one sense are not an ambiguity');
assert.equal(duplicateSense.result.text, 'ضفة النهر');
const missing = {};
vm.runInNewContext(productionHelper + "\nresult = contextualMeaning({term:'xyz',meanings:['مصطلح بعيد']},{en:'xyz appeared.',ar:'وصل القطار إلى المحطة.'},{terms:[]});", missing);
assert.equal(missing.result.kind, 'sentence');
assert.match(missing.result.text, /لم يُعثر على معنى مفرد موثّق/);
assert.ok(!missing.result.text.includes('هذه معانٍ معجمية عامة وليست تحديدًا آليًا'));
assert.match(reader, /function installPageTurn\(\)/);
assert.match(reader, /const LT_PAGE_PARAGRAPHS=4/);
assert.match(reader, /count>=LT_PAGE_PARAGRAPHS/);
assert.match(reader, /aria-atomic="true"/, 'page counter announces the complete updated label');
assert.match(reader, /item\.setAttribute\('aria-label',pageGroupLabel\(index,pages\.length\)\)/, 'each page group has a localized accessible name');
assert.match(reader, /item\.setAttribute\('aria-roledescription',uiText\('صفحة من القصة','story page'\)\)/);
const pageLabelStart=reader.indexOf('function pageGroupLabel(');
const pageLabelEnd=reader.indexOf('\nfunction installPageTurn()',pageLabelStart);
assert.ok(pageLabelStart>=0&&pageLabelEnd>pageLabelStart,'production page label helper exists');
const pageLabelContext={lang:'ar',uiText:(ar,en)=>pageLabelContext.lang==='en'?en:ar};
vm.runInNewContext(reader.slice(pageLabelStart,pageLabelEnd)+'\nglobalThis.pageGroupLabel=pageGroupLabel;',pageLabelContext);
assert.equal(pageLabelContext.pageGroupLabel(0,5),'صفحة 1 من 5');
assert.equal(pageLabelContext.pageGroupLabel(4,5),'صفحة 5 من 5');
pageLabelContext.lang='en';
assert.equal(pageLabelContext.pageGroupLabel(0,5),'Page 1 of 5');
assert.equal(pageLabelContext.pageGroupLabel(4,5),'Page 5 of 5');
assert.match(reader, /readerPage:Number\.isInteger\(currentPage\)/);
assert.match(reader, /Math\.floor\(mark\.paragraph\/LT_PAGE_PARAGRAPHS\)/);
assert.match(reader, /readpage_/);
assert.match(reader, /touchstart/);
assert.match(reader, /lt-turn-forward/);
assert.match(reader, /installPageTurn\(\);/);
assert.match(css, /\.lt-book-page\.is-active/);
assert.match(css, /@keyframes ltPageTurnForward/);
assert.match(css, /@keyframes ltPageTurnBack/);
assert.match(css, /rotateY\(-42deg\)/, 'forward LTR page turn must rotate around a book edge, not just nudge');
assert.match(css, /rotateY\(42deg\)/, 'reverse LTR page turn must mirror the page angle');
assert.match(css, /html\[dir="rtl"\] \.lt-turn-forward\{animation-name:ltPageTurnForwardRtl;transform-origin:left center\}/);
assert.match(css, /html\[dir="rtl"\] \.lt-turn-back\{animation-name:ltPageTurnBackRtl;transform-origin:right center\}/);
assert.match(css, /\.lt-turn-forward:after\{animation:ltPageShadeForward/);
assert.match(css, /@keyframes ltPageShadeForwardRtl/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(css, /\.lt-turn-forward:after,\.lt-turn-back:after\{animation:none!important\}/, 'reduced motion disables page shading too');
const swipeStart = reader.indexOf('function pageSwipeAllowed(');
const swipeEnd = reader.indexOf('function installPageTurn()', swipeStart);
assert.ok(swipeStart >= 0 && swipeEnd > swipeStart, 'production page-swipe guard is present');
const swipeContext = {};
vm.runInNewContext(reader.slice(swipeStart, swipeEnd) + '\nglobalThis.__pageSwipeAllowed = pageSwipeAllowed; globalThis.__pageSwipeGestureAllowed = pageSwipeGestureAllowed;', swipeContext);
const swipeAllowed = swipeContext.__pageSwipeAllowed;
const swipeGestureAllowed = swipeContext.__pageSwipeGestureAllowed;
const plainTarget = {nodeType:1, closest:()=>null};
const buttonTarget = {nodeType:1, closest:()=>({tagName:'BUTTON'})};
const textInsideButton = {nodeType:3, parentElement:buttonTarget};
assert.equal(swipeAllowed(plainTarget, ''), true, 'ordinary reading surface can page-swipe');
assert.equal(swipeAllowed(plainTarget, 'selected English words'), false, 'active text selection must not turn into a page swipe');
assert.equal(swipeAllowed(buttonTarget, ''), false, 'interactive controls must not trigger page gestures');
assert.equal(swipeAllowed(textInsideButton, ''), false, 'text nodes inside controls are protected too');
assert.equal(swipeAllowed(null, ''), true, 'missing event target fails safely without throwing');
assert.equal(swipeGestureAllowed(plainTarget, plainTarget, ''), true, 'a gesture wholly on the reading surface is allowed');
assert.equal(swipeGestureAllowed(plainTarget, buttonTarget, ''), false, 'a gesture ending on a control is rejected');
assert.equal(swipeGestureAllowed(buttonTarget, plainTarget, ''), false, 'a gesture starting on a control is rejected');
assert.equal(swipeGestureAllowed(plainTarget, plainTarget, 'selected words'), false, 'selection blocks the whole gesture');
assert.match(reader, /document\.elementFromPoint\?\.\(/, 'touchend resolves the actual end surface');
assert.match(reader, /pageSwipeGestureAllowed\(startTarget,endTarget,selected\)/, 'both gesture endpoints are guarded');
assert.ok(reader.includes("sentenceBox.addEventListener('touchcancel',resetTouch"), 'touch cancellation resets gesture state');
assert.ok(reader.includes("window.getSelection?.()?.toString()||''"), 'selection lookup is null-safe');

/* Rapid turns on the same page must not let an older timeout cancel the newer
 * animation. Exercise the exact production helper with controllable WebView-like
 * timers, including a callback that was already queued when it was cancelled. */
assert.ok(reader.includes('animatePageTurn(pages[current],direction);'),
  'production page renderer must use the guarded animation helper');
const animationStart=reader.indexOf('const pageTurnTimers=new WeakMap();');
const animationEnd=reader.indexOf('\nfunction installPageTurn()',animationStart);
assert.ok(animationStart>=0&&animationEnd>animationStart,'production timer guard helper exists');
const animationTimers=new Map(), allCallbacks=new Map(), cleared=[];
let nextAnimationTimer=0, reducedMotion=false, forcedLayouts=0;
const animationWindow={
 matchMedia(query){assert.equal(query,'(prefers-reduced-motion: reduce)');return {matches:reducedMotion};},
 setTimeout(callback,delay){assert.equal(delay,420);const id=++nextAnimationTimer;animationTimers.set(id,callback);allCallbacks.set(id,callback);return id;},
 clearTimeout(id){cleared.push(id);animationTimers.delete(id);}
};
const animationContext={window:animationWindow};
vm.runInNewContext(reader.slice(animationStart,animationEnd)+
 '\nglobalThis.animatePageTurn=animatePageTurn;',animationContext,{timeout:2000});
const turnClasses=new Set();
const animatedPage={classList:{
 add(name){turnClasses.add(name);},
 remove(...names){names.forEach(name=>turnClasses.delete(name));}
},get offsetWidth(){forcedLayouts++;return 600;}};
animationContext.animatePageTurn(animatedPage,'next');
const firstTurnTimer=nextAnimationTimer;
assert.ok(turnClasses.has('lt-turn-forward'));
animationContext.animatePageTurn(animatedPage,'back');
const secondTurnTimer=nextAnimationTimer;
assert.ok(cleared.includes(firstTurnTimer),'restarting the same page clears its older timer');
assert.ok(turnClasses.has('lt-turn-back'));
assert.ok(!turnClasses.has('lt-turn-forward'));
// Simulate a timeout callback already queued by the WebView before cancellation.
allCallbacks.get(firstTurnTimer)();
assert.ok(turnClasses.has('lt-turn-back'),'stale timeout cannot remove the newer reverse animation');
allCallbacks.get(secondTurnTimer)();
assert.equal(turnClasses.size,0,'the current timeout eventually cleans up the animation classes');
// Each page owns its own timer; finishing one page cannot clear another page's turn.
const otherClasses=new Set();
const otherPage={classList:{
 add(name){otherClasses.add(name);},
 remove(...names){names.forEach(name=>otherClasses.delete(name));}
},get offsetWidth(){forcedLayouts++;return 600;}};
animationContext.animatePageTurn(animatedPage,'next');
const pageATimer=nextAnimationTimer;
animationContext.animatePageTurn(otherPage,'next');
const pageBTimer=nextAnimationTimer;
allCallbacks.get(pageATimer)();
assert.ok(otherClasses.has('lt-turn-forward'),'a different page keeps its own animation');
allCallbacks.get(pageBTimer)();
assert.equal(otherClasses.size,0);

// Reduced motion must skip forced layout/timers and invalidate any already queued callback.
animationContext.animatePageTurn(animatedPage,'next');
const queuedBeforeReduce=nextAnimationTimer;
const layoutsBeforeReduce=forcedLayouts;
reducedMotion=true;
animationContext.animatePageTurn(animatedPage,'back');
assert.equal(forcedLayouts,layoutsBeforeReduce,'reduced motion skips forced layout');
assert.equal(nextAnimationTimer,queuedBeforeReduce,'reduced motion does not schedule a cleanup timer');
assert.equal(turnClasses.size,0,'reduced motion leaves no animation classes');
allCallbacks.get(queuedBeforeReduce)();
assert.equal(turnClasses.size,0,'a queued stale callback cannot regain ownership after reduced-motion turn');
reducedMotion=false;


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
