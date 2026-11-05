#!/usr/bin/env node
'use strict';
/**
 * Read exactly one original Towle chapter from the app's committed editorial
 * sources, WITHOUT loading Android, writing to the reader or touching storage.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

function extract(n, dir = path.join(__dirname, '..', 'app', 'src', 'main', 'assets')) {
  if (!Number.isInteger(n) || n < 1 || n > 37) {
    throw Error('Chapter number must be between 1 and 37');
  }
  const sandbox = { StoryLensEditorialStories: [] };
  const ctx = vm.createContext({ window: sandbox });
  const sourceHashes = [];
  for (let i = 1; i <= n; i++) {
    const file = path.join(dir, 'classic-verne-towle-ch' + String(i).padStart(2, '0') + '.js');
    const bytes = fs.readFileSync(file);
    sourceHashes.push(crypto.createHash('sha256').update(bytes).digest('hex'));
    vm.runInContext(bytes.toString('utf8'), ctx, { filename: path.basename(file), timeout: 2500 });
  }
  const story = sandbox.StoryLensEditorialStories.find(s => s.id === 'around-the-world-in-eighty-days-towle');
  if (!story || story.chapters.length !== n) throw Error('Source chapter count is inconsistent');
  const chapter = story.chapters[n - 1];
  const paragraphs = chapter.paragraphs;
  if (!Array.isArray(paragraphs) || paragraphs.length < 8) throw Error('Missing or abridged chapter paragraphs');
  for (const p of paragraphs) {
    if (!p || typeof p.en !== 'string' || p.en.trim().length < 2 || typeof p.ar !== 'string') {
      throw Error('Chapter contains an invalid original/companion paragraph pair');
    }
  }
  return {
    workId: story.id,
    chapterOneBased: n,
    chapterTitle: chapter.title,
    originalLanguage: 'en',
    companionLanguage: 'ar',
    sourceFileShas256: sourceHashes,
    paragraphs: paragraphs.map((p, i) => ({ index: i, en: p.en, existingArabicDraft: p.ar }))
  };
}

if (require.main === module) {
  try {
    const chapter = Number(process.argv[2]);
    const data = extract(chapter);
    if (process.argv.includes('--check')) {
      console.log('Source chapter ' + chapter + ': ' + data.paragraphs.length + ' aligned paragraphs; no edits.');
    } else {
      process.stdout.write(JSON.stringify(data) + '\n');
    }
  } catch (e) {
    console.error('Verne source extraction failed:', e.message);
    process.exitCode = 1;
  }
}
module.exports = { extract };
