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
const filters = { remove() { removed++; } };
const section = { querySelector(selector) {
  assert.equal(selector, '.filters');
  return filters;
}};
assert.equal(context.removeLegacyGenreFilters(section), true);
assert.equal(removed, 1, 'only the obsolete duplicate genre row is removed');
assert.equal(context.removeLegacyGenreFilters({ querySelector: () => null }), false,
  'a missing legacy row is a safe no-op');

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
console.log('PASS: LT-06 localized discovery labels and single genre-navigation surface');
