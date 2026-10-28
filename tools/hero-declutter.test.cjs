'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('app/src/main/assets/lingua-i18n.js', 'utf8');
new Function(source); // Parse the exact production localization module.
const start = source.indexOf('function localizeLibrary() {');
const end = source.indexOf('\nfunction localizeReader()', start);
assert.ok(start >= 0 && end > start, 'content-first library localization function must exist');
assert.ok(!source.includes("each('.storylens-hero .hero-metrics span'"),
  'the old hard-coded promotional-counter localization must not return');

const productionFunction = source.slice(start, end);
const createLocalizer = new Function(
  'state', 'find', 'set', 'each', 'english',
  productionFunction + '\nreturn localizeLibrary;'
);

for (const locale of ['ar', 'en']) {
  const metrics = { removed: false, remove() { this.removed = true; } };
  const find = selector => selector === '.storylens-hero .hero-metrics' ? metrics : null;
  const localize = createLocalizer(
    { page: 'library' }, find, () => {}, () => {}, () => locale === 'en'
  );
  localize();
  assert.equal(metrics.removed, true, 'promotional metrics must be removed in ' + locale);
}
console.log('PASS LT-05: production library localization removes stale hero metrics in Arabic and English');
