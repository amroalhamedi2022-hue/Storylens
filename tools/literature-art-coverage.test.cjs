'use strict';
// Offline-first, fail-closed audit of historic image coverage and candidate separation.
// No network, artwork generation, or changes to reader/app assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const historic = read('docs/literature/HISTORIC_VERNES_ASSETS.json');
const verneQueue = read('docs/literature/VERNE_FOUR_ADDITIONAL_PLATES_QUEUE.json');
const moonstoneQueue = read('docs/literature/staging/the-moonstone/HISTORIC_PLATE_QUEUE.json');
const counts = {verne: 37, moonstone: 53, warOfTheWorlds: 27};
const byChapter = Array.from({length: counts.verne}, (_, index) => ({
  chapter: index + 1, verifiedLocalImages: 0, images: [], needsMoreHistoricalArt: true
}));
const ids = new Set(), files = new Set(), sourceHashes = new Set();
for (const item of historic) {
  assert.ok(item && typeof item === 'object');
  assert.ok(typeof item.id === 'string' && item.id.startsWith('verne-'));
  assert.ok(!ids.has(item.id), 'duplicate historic image ID: ' + item.id);
  ids.add(item.id);
  assert.ok(typeof item.file === 'string' && /^verne-[a-z0-9-]+\.webp$/.test(item.file));
  assert.ok(!files.has(item.file), 'duplicate local image filename');
  files.add(item.file);
  assert.ok(Number.isInteger(item.chapter) && item.chapter >= 0 && item.chapter < counts.verne);
  assert.match(item.commons, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  assert.match(item.url, /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//);
  assert.match(item.expected_sha1, /^[a-f0-9]{40}$/);
  assert.match(item.source_sha256, /^[a-f0-9]{64}$/);
  assert.match(item.webp_sha256, /^[a-f0-9]{64}$/);
  assert.ok(!sourceHashes.has(item.source_sha256), 'same archival source duplicated');
  sourceHashes.add(item.source_sha256);
  assert.ok(typeof item.scene === 'string' && item.scene.length > 20);
  assert.ok(typeof item.rights === 'string' && item.rights.length > 20);
  const bytes = fs.readFileSync(path.join(root, 'app/src/main/assets/art', item.file));
  assert.equal(bytes.subarray(0,4).toString('ascii'), 'RIFF');
  assert.equal(bytes.subarray(8,12).toString('ascii'), 'WEBP');
  assert.equal(bytes.length, item.webp_bytes, 'size drift: ' + item.file);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), item.webp_sha256,
    'offline scan checksum drift: ' + item.file);
  const chapter = byChapter[item.chapter];
  chapter.verifiedLocalImages++;
  chapter.images.push({id:item.id, file:item.file, afterParagraph:item.afterParagraph ?? null,
    originalYear:item.year, source:item.commons, scene:item.scene,
    territorialReviewPending:/pending|verify territorial/i.test(item.rights)});
}
assert.equal(historic.length, 9, 'current shipped baseline changed; review the coverage gate and actual assets');
assert.equal(byChapter.reduce((sum,c)=>sum+c.verifiedLocalImages,0), historic.length);
assert.equal(verneQueue.queue.length, 4);
for (const candidate of verneQueue.queue) {
  assert.equal(candidate.scanStatus, 'NOT_DOWNLOADED');
  assert.equal(candidate.rights, 'PENDING');
  assert.ok(!ids.has(candidate.id), 'a queued scan was shipped without updating its queue status');
  assert.ok(candidate.chapterOneBased >= 1 && candidate.chapterOneBased <= counts.verne);
}
assert.equal(moonstoneQueue.candidates.length, 3);
for (const candidate of moonstoneQueue.candidates) {
  assert.equal(candidate.binary, 'NOT_DOWNLOADED');
  assert.equal(candidate.rights, 'PENDING');
}
for (const row of byChapter) row.needsMoreHistoricalArt = row.verifiedLocalImages < 2;
const result = {
  status:'AUDIT_ONLY_NOT_EDITORIAL_OR_TERRITORIAL_APPROVAL',
  books: {
    'around-the-world-in-eighty-days': {
      narrativeChapters:counts.verne, verifiedLocalImageFiles:historic.length,
      chaptersWithAtLeastOneImage:byChapter.filter(x=>x.verifiedLocalImages>0).length,
      chaptersWithAtLeastTwoImages:byChapter.filter(x=>x.verifiedLocalImages>=2).length,
      chaptersNeedingMoreImages:byChapter.filter(x=>x.needsMoreHistoricalArt).map(x=>x.chapter),
      unacquiredSourceCandidates:verneQueue.queue.length,
      chapters:byChapter
    },
    'the-moonstone': {stagedEnglishNarrativeUnits:counts.moonstone,
      verifiedLocalImageFiles:0, unacquiredSourceCandidates:moonstoneQueue.candidates.length,
      publication:'STAGED_NOT_PUBLISHED'},
    'the-war-of-the-worlds': {stagedEnglishNarrativeUnits:counts.warOfTheWorlds,
      verifiedLocalImageFiles:0, publication:'STAGED_NOT_PUBLISHED'}
  }
};
const json=JSON.stringify(result,null,2)+'\n';
if (process.argv.includes('--json')) process.stdout.write(json);
else console.log('PASS: 9 SHA-256-verified original Verne WebP images across '+
  result.books['around-the-world-in-eighty-days'].chaptersWithAtLeastOneImage+
  '/37 chapters; 4 Verne + 3 Moonstone leads NOT counted as images; Moonstone/War staged');
if (process.env.LT_ART_COVERAGE_OUTPUT) {
  const destination=path.resolve(process.env.LT_ART_COVERAGE_OUTPUT);
  fs.mkdirSync(path.dirname(destination),{recursive:true});
  fs.writeFileSync(destination,json,'utf8');
}
