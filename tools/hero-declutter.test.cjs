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

const selectors = {
  eyebrow: '.storylens-hero .hero-eyebrow',
  title: '.storylens-hero .hero-content > h2',
  subtitle: '.storylens-hero .hero-content > p',
  metrics: '.storylens-hero .hero-metrics'
};
const copy = {
  ar: {
    eyebrow: 'LINGUA TALES · قراءة غامرة',
    title: 'انغمس في حكاية تستحق القراءة.',
    subtitle: 'قصص ناضجة، وأسرار تستحق الاكتشاف، وإنجليزية تتعلمها من الأحداث نفسها.'
  },
  en: {
    eyebrow: 'LINGUA TALES · IMMERSIVE READING',
    title: 'Lose yourself in a good story.',
    subtitle: 'Mature stories, mysteries worth discovering, and English learned through the story itself.'
  }
};

function fixture(locale, page = 'library', includeHero = true, includeMetrics = true) {
  const nodes = new Map();
  if (includeHero) {
    nodes.set(selectors.eyebrow, { textContent: 'old eyebrow' });
    nodes.set(selectors.title, { textContent: 'old title' });
    nodes.set(selectors.subtitle, { textContent: 'old subtitle' });
  }
  const metrics = {
    removed: false,
    removeCalls: 0,
    remove() { if (!this.removed) { this.removed = true; this.removeCalls++; } }
  };
  if (includeMetrics) nodes.set(selectors.metrics, metrics);
  const find = selector => {
    if (selector === selectors.metrics && metrics.removed) return null;
    return nodes.get(selector) || null;
  };
  const localize = createLocalizer({ page }, find, () => {}, () => {}, () => locale === 'en');
  return { localize, nodes, metrics };
}

for (const locale of ['ar', 'en']) {
  const f = fixture(locale);
  f.localize();
  assert.equal(f.nodes.get(selectors.eyebrow).textContent, copy[locale].eyebrow,
    'hero eyebrow must be localized in ' + locale);
  assert.equal(f.nodes.get(selectors.title).textContent, copy[locale].title,
    'hero title must be localized in ' + locale);
  assert.equal(f.nodes.get(selectors.subtitle).textContent, copy[locale].subtitle,
    'hero subtitle must be localized in ' + locale);
  assert.equal(f.metrics.removed, true, 'promotional metrics must be removed in ' + locale);
  assert.equal(f.metrics.removeCalls, 1, 'metrics removal must happen once in ' + locale);
  f.localize(); // Reopening/rerendering must be idempotent after the node is gone.
  assert.equal(f.metrics.removeCalls, 1, 'repeated localization must not remove the same node twice');
}

const outsideLibrary = fixture('en', 'reader');
const beforeReader = [...outsideLibrary.nodes.entries()].map(([key, node]) => [key, node.textContent]);
outsideLibrary.localize();
assert.equal(outsideLibrary.metrics.removed, false, 'reader navigation must not remove library nodes');
assert.deepEqual([...outsideLibrary.nodes.entries()].map(([key, node]) => [key, node.textContent]), beforeReader,
  'localizeLibrary must remain a no-op outside the library page');

const noMetrics = fixture('en', 'library', true, false);
assert.doesNotThrow(() => noMetrics.localize(), 'library without the old metrics element must be safe');
assert.equal(noMetrics.nodes.get(selectors.title).textContent, copy.en.title);

const noHero = fixture('ar', 'library', false, false);
assert.doesNotThrow(() => noHero.localize(), 'a partially rendered/empty library must be safe');

console.log('PASS LT-05: production hero localization is bilingual, idempotent, route-scoped, and safe when optional nodes are absent');
