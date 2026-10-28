'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app/src/main/assets/lingua-i18n.js', 'utf8');
const start = source.indexOf('function localizeReaderLocaleControl()');
const end = source.indexOf('\nfunction wrap(name, after)', start);
assert.ok(start >= 0 && end > start, 'reader locale control must live in the established localization module');
const helper = source.slice(start, end);

function element(tag) {
  return {
    tag, children: [], attributes: {}, listeners: {}, textContent: '', value: '',
    className: '', id: '',
    appendChild(child) { this.children.push(child); return child; },
    insertBefore(child, before) {
      const index = this.children.indexOf(before);
      if (index < 0) this.children.push(child); else this.children.splice(index, 0, child);
      return child;
    },
    querySelector(selector) {
      if (selector === '.lt-reader-locale') return this.children.find(x => (x.className || '').includes('lt-reader-locale')) || null;
      if (selector === '.settings-row') return this.children.find(x => (x.className || '').includes('settings-row')) || null;
      return null;
    },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    getAttribute(name) { return this.attributes[name] ?? null; },
    addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); },
    fire(name) { for (const callback of this.listeners[name] || []) callback({ target: this }); }
  };
}
const sheet = element('section');
const document = {
  documentElement: { lang: 'ar', dir: 'rtl' },
  createElement: element,
  querySelector(selector) { return selector === '#modals .sheet' ? sheet : null; }
};
const state = { page: 'reader', story: { id: 'book-1' }, chapter: 2 };
const writes = [];
const localeCalls = [];
const scrollCalls = [];
let renderCalls = 0, settingsCalls = 0;
const global = {
  scrollY: 418,
  LinguaShell: { applyLocale(lang, rerender) { localeCalls.push([lang, rerender]); document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr'; } },
  renderReader() { renderCalls++; },
  settings() { settingsCalls++; },
  scrollTo(x, y) { scrollCalls.push([x, y]); }
};
const context = {
  state, document, global, english: () => document.documentElement.lang === 'en',
  find: selector => selector === '#modals .sheet' ? sheet : null,
  put: (key, value) => writes.push([key, value])
};
vm.runInNewContext(helper + '\nglobalThis.install = localizeReaderLocaleControl;', context);
assert.equal(context.install(), true);
assert.equal(sheet.children.length, 1);
const row = sheet.children[0];
assert.equal(row.className, 'settings-row lt-reader-locale');
assert.equal(row.children[0].textContent, 'لغة الواجهة');
const select = row.children[1];
assert.equal(select.id, 'lt-reader-locale-select');
assert.equal(select.value, 'ar');
assert.deepEqual(select.children.map(x => [x.value, x.textContent]), [['ar','العربية'],['en','English']]);
assert.equal(context.install(), false, 'reopening settings must not add duplicate locale selectors');
select.value = 'en';
select.fire('change');
assert.deepEqual(localeCalls, [['en', false]]);
assert.deepEqual(writes, [['scroll_book-1_2', 418]]);
assert.equal(renderCalls, 1);
assert.equal(settingsCalls, 1);
assert.deepEqual(scrollCalls, [[0, 418]]);
assert.equal(document.documentElement.dir, 'ltr');
console.log('PASS: reader locale switch preserves chapter scroll, rerenders in LTR/RTL, and avoids duplicate controls');
