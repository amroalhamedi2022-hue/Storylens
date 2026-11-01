/* LT-06 regression: the drawer is the single localized genre-navigation surface. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const shell = fs.readFileSync('app/src/main/assets/lingua-shell.js', 'utf8');
const helperStart = shell.indexOf('function removeLegacyGenreFilters(section){');
const helperEnd = shell.indexOf('\nfunction decorateLibrary()', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'production filter-removal helper must exist');
const context = {};
vm.runInNewContext(shell.slice(helperStart, helperEnd) +
  '\nglobalThis.removeLegacyGenreFilters = removeLegacyGenreFilters;', context, { timeout: 2000 });

let removed = 0;
let filterPresent = true;
const filters = { remove() { removed++; filterPresent = false; } };
const section = { querySelector(selector) {
  assert.equal(selector, '.filters');
  return filterPresent ? filters : null;
}};
assert.equal(context.removeLegacyGenreFilters(section), true);
assert.equal(context.removeLegacyGenreFilters(section), false,
  'repeated library decoration must not remove or recreate a duplicate filter row');
assert.equal(removed, 1, 'only the obsolete duplicate genre row is removed');

const decorateStart = shell.indexOf('function decorateLibrary()');
const decorateEnd = shell.indexOf('\nlibrary=function()', decorateStart);
assert.ok(decorateStart >= 0 && decorateEnd > decorateStart);
assert.ok(shell.slice(decorateStart, decorateEnd).includes('removeLegacyGenreFilters(section);'),
  'production library decoration must wire the helper');
assert.ok(shell.includes("genres.className='lt-genre-list'") &&
  shell.includes('filterGenre(genre.id)'),
  'the accessible drawer retains the working genre filters');

const libraryExperience = fs.readFileSync('app/src/main/assets/library-experience.js', 'utf8');
const localeStart = libraryExperience.indexOf("const uiText=(ar,en)=>");
const localeEnd = libraryExperience.indexOf(';', localeStart) + 1;
assert.ok(localeStart >= 0 && localeEnd > localeStart, 'production discovery locale helper must exist');
const localeContext = { document: { documentElement: { lang: 'ar' } } };
vm.createContext(localeContext);
vm.runInContext(libraryExperience.slice(localeStart, localeEnd) +
  '\nglobalThis.uiText = uiText;', localeContext, { timeout: 2000 });
assert.equal(localeContext.uiText('★ المفضلة', '★ Favorites'), '★ المفضلة');
localeContext.document.documentElement.lang = 'en';
assert.equal(localeContext.uiText('★ المفضلة', '★ Favorites'), '★ Favorites');

const renderStart = libraryExperience.indexOf('function renderDiscovery()');
const renderEnd = libraryExperience.indexOf('\nconst originalLibrary=library;', renderStart);
assert.ok(renderStart >= 0 && renderEnd > renderStart);
const discovery = libraryExperience.slice(renderStart, renderEnd);
for (const required of [
  'Filter by language level', 'Sort stories', 'Recommended',
  'Remove from favorites', 'Add to favorites', 'Visible stories:',
  'No matching favorites.', 'No stories match this level and genre.'
]) assert.ok(discovery.includes(required), 'bilingual discovery control missing: ' + required);

/* Exercise the real drawer open/close functions with a tiny DOM contract. */
const closeStart = shell.indexOf('function closeDrawer(');
const openStart = shell.indexOf('\nfunction openDrawer()', closeStart);
const moveStart = shell.indexOf('\nfunction moveDiscovery()', openStart);
assert.ok(closeStart >= 0 && openStart > closeStart && moveStart > openStart,
  'production drawer lifecycle functions must remain contiguous and testable');
const drawerFocus = { close: 0, toggle: 0 };
const closeButton = { focus() { drawerFocus.close++; } };
const drawerClasses = new Set();
const backdropClasses = new Set();
const drawerAttrs = {};
const toggleAttrs = {};
const drawer = {
  classList: { add(v) { drawerClasses.add(v); }, remove(v) { drawerClasses.delete(v); } },
  inert: true,
  setAttribute(name, value) { drawerAttrs[name] = String(value); },
  getAttribute(name) { return drawerAttrs[name] ?? null; },
  querySelector(selector) { assert.equal(selector, 'button'); return closeButton; }
};
const backdrop = { classList: { add(v) { backdropClasses.add(v); }, remove(v) { backdropClasses.delete(v); } } };
const toggle = {
  setAttribute(name, value) { toggleAttrs[name] = String(value); },
  getAttribute(name) { return toggleAttrs[name] ?? null; },
  focus() { drawerFocus.toggle++; }
};
const drawerNodes = new Map([
  ['lt-drawer', drawer], ['lt-drawer-backdrop', backdrop], ['lt-menu-toggle', toggle]
]);
const drawerContext = {
  document: { getElementById(id) { return drawerNodes.get(id) || null; } },
  state: { page: 'library' }
};
vm.runInNewContext('let opened=false;\n' +
  shell.slice(closeStart, moveStart) +
  '\nglobalThis.drawerApi={openDrawer,closeDrawer,isOpen:()=>opened};',
  drawerContext, { timeout: 2000 });
assert.equal(drawerContext.drawerApi.openDrawer(), true);
assert.equal(drawerContext.drawerApi.isOpen(), true);
assert.ok(drawerClasses.has('open'));
assert.equal(drawerAttrs['aria-hidden'], 'false');
assert.equal(drawer.inert, false);
assert.ok(backdropClasses.has('open'));
assert.equal(toggleAttrs['aria-expanded'], 'true');
assert.equal(drawerFocus.close, 1, 'opening the drawer moves focus inside it');
assert.equal(drawerContext.drawerApi.closeDrawer(), true);
assert.equal(drawerContext.drawerApi.isOpen(), false);
assert.ok(!drawerClasses.has('open'));
assert.equal(drawerAttrs['aria-hidden'], 'true');
assert.equal(drawer.inert, true);
assert.ok(!backdropClasses.has('open'));
assert.equal(toggleAttrs['aria-expanded'], 'false');
assert.equal(drawerFocus.toggle, 1, 'closing the drawer restores focus to its toggle');
drawerContext.state.page = 'reader';
assert.equal(drawerContext.drawerApi.openDrawer(), false, 'drawer cannot open over the reader');
drawerNodes.delete('lt-drawer');
assert.equal(drawerContext.drawerApi.closeDrawer(), false, 'missing drawer is a safe no-op');


/* Exercise real touch callbacks against a DOM shim. Drawer must follow
 * finger motion while preserving vertical scroll and RTL edge semantics. */
const dragStart=shell.indexOf('// Finger-following drawer');
const dragEnd=shell.indexOf('/* LT-02: a single, cancellable story navigation gate.',dragStart);
assert.ok(dragStart>=0&&dragEnd>dragStart,'finger-following drawer source present');
function swipeHarness(locale,initiallyOpen=false){
 const callbacks={},drawStyle={transform:'',transition:'',removeProperty(k){delete this[k];}};
 const backdropStyle={opacity:'',transition:'',removeProperty(k){delete this[k];}};
 const drawer={style:drawStyle,getBoundingClientRect(){return {width:300};},inert:!initiallyOpen};
 const backdrop={style:backdropStyle,classList:{add(){}}};
 const document={documentElement:{clientWidth:400},addEventListener(type,cb){callbacks[type]=cb;},
  getElementById(id){return id==='lt-drawer'?drawer:id==='lt-drawer-backdrop'?backdrop:null;}};
 const state={page:'library'};
 const global={innerWidth:400};
 let opened=initiallyOpen,touch=null,openCount=0,closeCount=0;
 const rtl=()=>locale==='ar';
 function openDrawer(){opened=true;openCount++;drawer.inert=false;}
 function closeDrawer(){opened=false;closeCount++;drawer.inert=true;}
 vm.runInNewContext('let opened='+JSON.stringify(initiallyOpen)+';let touch=null;\n'+
  shell.slice(dragStart,dragEnd),
  {document,state,global,rtl,openDrawer,closeDrawer,Math});
 function swipe(x,y,dx,dy=0){
  callbacks.touchstart({touches:[{clientX:x,clientY:y}]});
  callbacks.touchmove({touches:[{clientX:x+dx,clientY:y+dy}]});
  const mid=drawStyle.transform;
  callbacks.touchend({});
  return {mid,opened,openCount,closeCount};
 }
 return {swipe,drawer,backdrop,callbacks};
}
{
 const ar=swipeHarness('ar');
 const result=ar.swipe(390,30,-155);
 assert.match(result.mid,/translate3d\(/,'RTL drawer visibly tracks the moving finger');
 assert.equal(result.opened,true,'RTL right-edge swipe opens');
}
{
 const en=swipeHarness('en');
 const result=en.swipe(8,30,155);
 assert.match(result.mid,/translate3d\(/,'LTR drawer visibly tracks the moving finger');
 assert.equal(result.opened,true,'LTR left-edge swipe opens');
}
{
 const en=swipeHarness('en');
 assert.equal(en.swipe(195,40,130).openCount,0,'far-from-edge gestures ignored');
}
{
 const ar=swipeHarness('ar',true);
 const result=ar.swipe(200,40,180);
 assert.equal(result.opened,false,'RTL reciprocal horizontal swipe closes drawer');
}
{
 const en=swipeHarness('en');
 const result=en.swipe(5,30,100,180);
 assert.equal(result.openCount,0,'vertical scroll must not open the drawer');
}

/* LT-10 Settings modal focus isolation: execute the exact production focus helpers, not a parallel implementation. */
const settingsStart = shell.indexOf('let settingsModalActive=false;');
const settingsEnd = shell.indexOf('\nfunction closeDrawer(restoreFocus=true){', settingsStart);
assert.ok(settingsStart >= 0 && settingsEnd > settingsStart,
  'production Settings focus helpers must remain available to the regression harness');
const settingsHelpers = shell.slice(settingsStart, settingsEnd);
const openSettingsStart = shell.indexOf('function openSettings(){');
const openSettingsEnd = shell.indexOf('\n/* LT-07', openSettingsStart);
assert.ok(openSettingsStart >= 0 && openSettingsEnd > openSettingsStart,
  'production Settings modal builder must remain testable');
const openSettingsBody = shell.slice(openSettingsStart, openSettingsEnd);
assert.ok(openSettingsBody.indexOf('beginSettingsModal();') >= 0 &&
  openSettingsBody.indexOf('beginSettingsModal();') < openSettingsBody.indexOf('closeDrawer(false);'),
  'Settings must capture a safe focus return target before making the drawer inert');
assert.match(openSettingsBody, /aria-modal/);

function settingsHarness({ rootInitiallyInert = false, fromDrawer = false,
  targetConnected = true, activeIsBody = false } = {}) {
  let modalPresent = false;
  const focus = { origin: 0, toggle: 0 };
  const root = { inert: rootInitiallyInert };
  const body = {};
  const toggle = { isConnected: true, focus() { focus.toggle++; },
    closest() { return null; } };
  const origin = { isConnected: targetConnected, focus() { focus.origin++; },
    closest(selector) { return fromDrawer && selector === '#lt-drawer' ? {} : null; } };
  const document = {
    body,
    activeElement: activeIsBody ? body : origin,
    getElementById(id) {
      if (id === 'root') return root;
      if (id === 'lt-menu-toggle') return toggle;
      return null;
    },
    querySelector(selector) {
      return selector === '.lt-settings-overlay' && modalPresent ? {} : null;
    }
  };
  const baseCloseSheet = event => {
    if (event && event.target !== event.currentTarget) return;
    modalPresent = false;
  };
  const context = { document, closeSheet: baseCloseSheet };
  vm.runInNewContext(settingsHelpers +
    '\nglobalThis.settingsApi={beginSettingsModal,releaseSettingsModal,closeSheet};',
    context, { timeout: 2000 });
  return {
    root, focus, api: context.settingsApi,
    setModalPresent(value) { modalPresent = value; }
  };
}
{
  const h = settingsHarness();
  h.api.beginSettingsModal();
  h.setModalPresent(true);
  assert.equal(h.root.inert, true, 'background app root becomes inert while Settings is open');
  h.api.closeSheet();
  assert.equal(h.root.inert, false, 'dismissal restores the prior root interactivity');
  assert.equal(h.focus.origin, 1, 'dismissal restores focus to the originating control');
}
{
  const h = settingsHarness();
  h.api.beginSettingsModal();
  h.setModalPresent(true);
  h.api.closeSheet({ target: {}, currentTarget: {} });
  assert.equal(h.root.inert, true, 'an ignored outside click must not unblock the background');
  assert.equal(h.focus.origin, 0, 'focus is not restored while the modal remains open');
  h.setModalPresent(false);
  h.api.releaseSettingsModal();
  assert.equal(h.root.inert, false);
  assert.equal(h.focus.origin, 1);
}
{
  const h = settingsHarness({ rootInitiallyInert: true });
  h.api.beginSettingsModal();
  h.setModalPresent(true);
  h.api.closeSheet();
  assert.equal(h.root.inert, true, 'the modal restores an already-inert root instead of unblocking it');
}
{
  const h = settingsHarness({ fromDrawer: true });
  h.api.beginSettingsModal();
  h.setModalPresent(true);
  h.api.closeSheet();
  assert.equal(h.focus.origin, 0, 'focus is not returned into the now-inert drawer');
  assert.equal(h.focus.toggle, 1, 'drawer-origin focus returns to the visible menu toggle');
}
{
  const h = settingsHarness({ targetConnected: false });
  h.api.beginSettingsModal();
  h.setModalPresent(true);
  h.api.closeSheet();
  assert.equal(h.focus.toggle, 1, 'a detached return target safely falls back to the menu toggle');
}

console.log('PASS: LT-06 localized discovery labels and single genre-navigation surface');
