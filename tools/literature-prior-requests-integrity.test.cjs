'use strict';
// Content QA for the user's PREVIOUSLY NAMED novels and heritage works.
// Source-complete ≠ bilingually edited, rights-cleared or published on Android.
// Tests all locally staged bytes offline; no network access or third-party deps.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = path.join(root, 'docs/literature/staging');
const hash = blob => crypto.createHash('sha256').update(blob).digest('hex');
const classics = path.join(base, 'user-requested-classics-20261105');
const works = [
  ['the-woman-in-white', 246996, 0],
  ['the-valley-of-fear', 58089, 7],
  ['the-count-of-monte-cristo', 463095, 449],
  ['arabian-nights-burton-v01', 176003, 0],
  ['arabian-nights-burton-v02', 155635, 0],
  ['arabian-nights-burton-v03', 158628, 0],
  ['arabian-nights-burton-v04', 134294, 0],
  ['arabian-nights-burton-v05', 174631, 0],
  ['arabian-nights-burton-v06', 136781, 0],
  ['arabian-nights-burton-v07', 171548, 0],
  ['arabian-nights-burton-v08', 155108, 0],
  ['arabian-nights-burton-v09', 164210, 0],
  ['arabian-nights-burton-v10', 173013, 0],
];
let words = 0, historicalEngravings = 0, sourceImageCount = 0;
for (const [slug, expectedWords, expectedArt] of works) {
  const folder = path.join(classics, slug);
  const m = JSON.parse(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8'));
  assert.equal(m.workId, slug);
  assert.equal(m.status, 'COMPLETE_SOURCE_STAGED_ONLY_NOT_PUBLISHED');
  assert.equal(m.acceptance.fullOriginalOrUnabridgedHistoricalTranslation, true);
  assert.equal(m.acceptance.fullNaturalArabicTranslation, false);
  assert.equal(m.acceptance.illustrationRightsApproved, false);
  assert.equal(m.acceptance.appIntegrated, false);
  assert.equal(m.source.narrativeWords, expectedWords);
  assert.equal(m.historicalArtworkCandidates, expectedArt);
  if (slug.startsWith('arabian-nights-')) {
    assert.equal(m.seriesId, 'arabian-nights-burton-ten-volume-edition');
    assert.equal(m.seriesVolume, Number(slug.slice(-2)));
    assert.equal(m.seriesVolumeCount, 10);
    assert.equal(m.sourceLanguage, 'en');
    assert.equal(m.originalLanguage, 'ar');
  }
  const raw = fs.readFileSync(path.join(folder, 'original-edition.html'));
  const html = raw.toString('utf8');
  assert.equal(raw.length, m.source.bytes);
  assert.equal(hash(raw), m.source.sha256);
  assert.match(html, /\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK/i);
  assert.match(html, /\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK/i);
  const offline = fs.readFileSync(path.join(folder, 'offline-edition.html'), 'utf8');
  const originalTags = (html.match(/<img\b/gi) || []).length;
  const offlineTags = (offline.match(/<img\b/gi) || []).length;
  assert.equal(originalTags, m.sourceImages.length, slug + ': source image count changed');
  assert.equal(offlineTags, originalTags, slug + ': offline image count changed');
  assert.equal(m.imagesWithExactRelativePositions, originalTags);
  const seen = new Set();
  for (const image of m.sourceImages) {
    assert.match(image.localPath, /^art\/image-\d{3}\.webp$/);
    assert.ok(!seen.has(image.localPath));
    seen.add(image.localPath);
    assert.equal(offline.split('src="' + image.localPath + '"').length - 1, 1,
      slug + ': local illustration missing or repeated');
    const bytes = fs.readFileSync(path.join(folder, image.localPath));
    assert.equal(bytes.length, image.bytes);
    assert.equal(hash(bytes), image.sha256);
    assert.equal(bytes.subarray(0,4).toString('ascii'), 'RIFF');
    assert.equal(bytes.subarray(8,12).toString('ascii'), 'WEBP');
    assert.match(image.originalUrl, /^https:\/\/www\.gutenberg\.org\//);
    assert.match(image.originalSha256, /^[a-f0-9]{64}$/);
    assert.ok(image.rightsStatus.includes('PENDING'));
  }
  words += expectedWords;
  historicalEngravings += expectedArt;
  sourceImageCount += originalTags;
  console.log('PASS: '+slug+' ('+expectedWords+' complete English words, '
      +expectedArt+' source illustration candidates)');
}
assert.equal(words, 2368031);
assert.equal(historicalEngravings, 456);
assert.equal(sourceImageCount, 456);
let arabicTokens = 0;
const arabicBase = path.join(base, 'arabian-nights-arabic-wikisource-20261105');
const knownArabic = [24641,23433,65750,12096];
for (let n=1; n<=4; n++) {
  const name = 'part-'+String(n).padStart(2,'0');
  const folder = path.join(arabicBase,name);
  const m = JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));
  const raw = fs.readFileSync(path.join(folder,'wikisource-original-page.html'));
  const txt = fs.readFileSync(path.join(folder,'arabic-transcription.txt'));
  assert.equal(m.segment,name);
  assert.equal(hash(raw),m.originalPageSha256);
  assert.equal(raw.length,m.originalPageBytes);
  assert.equal(hash(txt),m.transcriptionSha256);
  assert.equal(txt.length,m.transcriptionBytes);
  assert.equal(m.arabicWordTokens,knownArabic[n-1]);
  assert.equal(m.verifiedAsMatchingBurtonEnglishEdition,false);
  assert.equal(m.sourceEditionBibliographicalAlignment,'PENDING_PRINT_EDITION_COMPARISON');
  assert.match(m.publication,/NOT LABEL COMPLETE BILINGUAL/);
  if (n===4) assert.ok(txt.toString('utf8').includes('الليلة الواحدة بعد الألف'));
  arabicTokens += knownArabic[n-1];
  console.log('PASS: Arabic Arabian Nights '+name+' '+knownArabic[n-1]+' source tokens');
}
assert.equal(arabicTokens,125920);
const colour = path.join(base, 'kalila-original-colour-miniatures-20261105');
const colourManifest = path.join(colour,'manifest.json');
if (fs.existsSync(colourManifest)) {
  const m = JSON.parse(fs.readFileSync(colourManifest,'utf8'));
  assert.equal(m.status,'COLOURED_HISTORIC_PLATES_STAGED_NOT_CHAPTER_PUBLISHED');
  assert.ok(m.plates.length>=6);
  assert.equal(m.chapterIntegration,false);
  assert.equal(m.completeEnglishContextualTranslation,false);
  const sourceSHA = new Set();
  for (const plate of m.plates) {
    assert.equal(plate.colourWasAdded,false);
    assert.equal(plate.colourRemoved,false);
    assert.equal(plate.manuscriptFolioChapterAligned,false);
    assert.ok(plate.individualFileRightsStatus.includes('REVIEW') ||
              plate.individualFileRightsStatus.includes('NO_APP_PUBLICATION'));
    const bytes = fs.readFileSync(path.join(colour,plate.localPath));
    assert.equal(bytes.length,plate.webpBytes);
    assert.equal(hash(bytes),plate.webpSha256);
    assert.equal(bytes.subarray(0,4).toString('ascii'),'RIFF');
    assert.equal(bytes.subarray(8,12).toString('ascii'),'WEBP');
    assert.ok(!sourceSHA.has(plate.downloadedDerivativeSha256), 'duplicated coloured folio');
    sourceSHA.add(plate.downloadedDerivativeSha256);
  }
  console.log('PASS: '+m.plates.length+' real medieval COLOURED Kalila folios; source hues preserved');
}
console.log('PASS PREVIOUS-REQUEST CONTENT STAGING: 13 whole English edition files (2,368,031 words), 456 verified in-edition engravings, and 4 Arabic Wikisource parts (125,920 Arabic tokens). Not in Android shelf; rights & complete translations are held.');
