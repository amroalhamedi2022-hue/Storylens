/* Exercise the exact LT-06 locale persistence functions from the production shell. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app/src/main/assets/lingua-shell.js', 'utf8');
const start = source.indexOf("const localeChoices=['ar','en'];");
const end = source.indexOf('const originalLibrary=library;', start);
assert.ok(start >= 0 && end > start, 'production locale functions must remain in the expected shell section');
const localeSource = source.slice(start, end);

function harness(initialLocale = 'ar') {
  const storage = { uiLocale: initialLocale };
  const calls = { closeSheet: 0, library: 0, openSettings: 0, scrollTo: [], focus: 0 };
  let settingsOpen = false;
  const selector = { focus() { calls.focus++; } };
  const window = {
    scrollY: 347,
    scrollTo(x, y) { calls.scrollTo.push([x, y]); }
  };
  const document = {
    documentElement: { lang: '', dir: '' },
    querySelector(selectorText) {
      if (selectorText === '.lt-settings-overlay') return settingsOpen ? {} : null;
      if (selectorText === '.lt-locale-setting select') return settingsOpen ? selector : null;
      return null;
    }
  };
  const context = {
    document, window, global: window, state: { page: 'settings' },
    get(key, fallback) { return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : fallback; },
    put(key, value) { storage[key] = value; },
    closeSheet() { calls.closeSheet++; settingsOpen = false; },
    library() { calls.library++; },
    openSettings() { calls.openSettings++; settingsOpen = true; },
    calls, storage,
    setSettingsOpen(value) { settingsOpen = value; }
  };
  vm.createContext(context);
  vm.runInContext(localeSource, context, { filename: 'lingua-shell.js#locale', timeout: 2000 });
  return context;
}

{
  const h = harness('en');
  h.loadLocale();
  assert.equal(h.document.documentElement.lang, 'en');
  assert.equal(h.document.documentElement.dir, 'ltr');
}
{
  const h = harness('unsupported');
  h.loadLocale();
  assert.equal(h.document.documentElement.lang, 'ar', 'unknown stored locale safely falls back to Arabic');
  assert.equal(h.document.documentElement.dir, 'rtl');
}
{
  const h = harness('ar');
  assert.equal(h.applyLocale('en'), true);
  assert.equal(h.storage.uiLocale, 'en', 'English locale is persisted offline');
  assert.equal(h.document.documentElement.lang, 'en');
  assert.equal(h.document.documentElement.dir, 'ltr');
  assert.equal(h.applyLocale('ar'), true);
  assert.equal(h.storage.uiLocale, 'ar', 'Arabic locale is persisted offline');
  assert.equal(h.document.documentElement.lang, 'ar');
  assert.equal(h.document.documentElement.dir, 'rtl');
  assert.equal(h.applyLocale('fr'), false, 'unsupported locale is rejected');
  assert.equal(h.storage.uiLocale, 'ar', 'invalid locale must not corrupt persisted preference');
}
{
  const h = harness('en');
  h.state.page = 'library';
  h.setSettingsOpen(true);
  assert.equal(h.applyLocale('ar'), true);
  assert.equal(h.calls.closeSheet, 1);
  assert.equal(h.calls.library, 1, 'library is re-rendered in the new locale');
  assert.equal(h.calls.openSettings, 1, 'open settings remains open across locale switch');
  assert.deepEqual(h.calls.scrollTo, [[0, 347]], 'library scroll position is preserved');
  assert.equal(h.calls.focus, 1, 'focus returns to the locale selector');
  assert.equal(h.document.documentElement.lang, 'ar');
  assert.equal(h.document.documentElement.dir, 'rtl');
}
console.log('PASS: production LT-06 locale persistence, RTL/LTR, invalid values, scroll and focus restoration');
