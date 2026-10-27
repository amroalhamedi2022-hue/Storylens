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

console.log('PASS: LT-06 localized discovery labels and single genre-navigation surface');
