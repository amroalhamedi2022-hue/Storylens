'use strict';
// Offline, dependency-free integrity gate for FIVE authentic complete novels.
// Checks exact original full HTML bytes, every local WebP, and source position.
// This does not claim Arabic translations, redistribution rights, or APK release.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'docs/literature/staging/illustrated-five-20261105');
const expected = new Map([
  ['treasure-island', {minWords: 68000, minArt: 115}],
  ['kidnapped', {minWords: 82000, minArt: 98}],
  ['the-black-arrow', {minWords: 80000, minArt: 13}],
  ['the-last-of-the-mohicans', {minWords: 148000, minArt: 12}],
  ['the-gilded-age', {minWords: 160000, minArt: 212}],
]);
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
let totalWords = 0, totalHistoricalArt = 0, totalDocumentImages = 0;
for (const [id, target] of expected) {
  const folder = path.join(base, id);
  const manifest = JSON.parse(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8'));
  assert.equal(manifest.workId, id);
  assert.equal(manifest.originalLanguage, 'en');
  assert.equal(manifest.status, 'COMPLETE_ENGLISH_SOURCE_AND_LOCAL_ORIGINAL_ILLUSTRATIONS_STAGED_NOT_PUBLISHED');
  assert.equal(manifest.publication.startsWith('NOT_APPROVED'), true);
  assert.equal(manifest.acceptance.englishSourceComplete, true);
  assert.equal(manifest.acceptance.arabicFullNaturalTranslationComplete, false);
  assert.equal(manifest.acceptance.individualImagesAndTerritorialRightsApproved, false);
  assert.equal(manifest.acceptance.mobileAppIntegrated, false);
  assert.ok(manifest.source.narrativeWords >= target.minWords, id + ': missing narrative');
  assert.ok(manifest.historicArtFiles >= target.minArt, id + ': missing original book engravings');
  const raw = fs.readFileSync(path.join(folder, manifest.source.filename));
  assert.equal(raw.length, manifest.source.bytes);
  assert.equal(hash(raw), manifest.source.sha256);
  const html = raw.toString('utf8');
  assert.match(html, /\*\*\*\s*START OF (THE|THIS) PROJECT GUTENBERG EBOOK/i);
  assert.match(html, /\*\*\*\s*END OF (THE|THIS) PROJECT GUTENBERG EBOOK/i);
  const offline = fs.readFileSync(path.join(folder, manifest.offlineHTMLFile), 'utf8');
  assert.ok(offline.length >= html.length / 2, id + ': offline copy truncated');
  const tagsOriginal = (html.match(/<img\b/gi) || []).length;
  const tagsOffline = (offline.match(/<img\b/gi) || []).length;
  assert.equal(manifest.art.length, tagsOriginal, id + ': source images lost');
  assert.equal(tagsOffline, tagsOriginal, id + ': offline images lost');
  assert.equal(manifest.allOriginalHTMLImageTagsPreserved, tagsOriginal);
  assert.equal(manifest.art.filter(a => a.literaryArtwork).length, manifest.historicArtFiles);
  const seen = new Set();
  for (const [index, art] of manifest.art.entries()) {
    assert.equal(art.imageOrdinalInExactSourceDOM, index + 1);
    assert.match(art.localPath, /^art\/plate-\d{3}\.webp$/);
    assert.ok(!seen.has(art.localPath), id + ': duplicated local image path');
    seen.add(art.localPath);
    assert.match(art.originalSourceUrl, /^https:\/\/www\.gutenberg\.org\/cache\/epub\//);
    assert.match(art.sourceSha256, /^[a-f0-9]{64}$/);
    assert.ok(art.sourceBytes > 0);
    assert.match(art.webpSha256, /^[a-f0-9]{64}$/);
    const bytes = fs.readFileSync(path.join(folder, art.localPath));
    assert.equal(bytes.length, art.webpBytes);
    assert.equal(hash(bytes), art.webpSha256, id + ': corrupt archive picture '+art.localPath);
    assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP');
    assert.equal(offline.split('src="' + art.localPath + '"').length - 1, 1,
      id + ': source-order image position missing or duplicated: ' + art.localPath);
    assert.ok(art.scenePosition.startsWith('EXACT_IN_ORIGINAL_HTML'));
    assert.ok(art.illustrationRights.includes('PENDING'));
  }
  totalWords += manifest.source.narrativeWords;
  totalHistoricalArt += manifest.historicArtFiles;
  totalDocumentImages += tagsOriginal;
  console.log('PASS ' + id + ': '+manifest.source.narrativeWords+' complete English words, '
    +manifest.historicArtFiles+' historic scans / '+tagsOriginal+' source images preserved');
}
assert.equal(totalWords, 540656);
assert.equal(totalHistoricalArt, 450);
assert.equal(totalDocumentImages, 491);
console.log('PASS: FIVE unabridged illustrated sources, 540656 original English words, '
  +'450 historical art files, 491 exact source image positions; '
  +'staged NOT yet translated, rights-approved, integrated or released.');
