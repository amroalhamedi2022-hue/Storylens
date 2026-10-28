'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const shell = fs.readFileSync('app/src/main/assets/lingua-shell.js', 'utf8');
const mapStart = shell.indexOf('const legacyUiEnglishMap = Object.freeze({');
const helperStart = shell.indexOf('function legacyUiEnglishText(value)', mapStart);
const helperEnd = shell.indexOf('\nfunction translateLegacyUi()', helperStart);
assert.ok(mapStart >= 0 && helperStart > mapStart && helperEnd > helperStart,
  'production locale dictionary and pure text resolver must exist');
const context = {};
vm.runInNewContext(
  shell.slice(mapStart, helperStart) +
  shell.slice(helperStart, helperEnd) +
  '\nglobalThis.resolveUiText = legacyUiEnglishText;',
  context
);
const resolve = context.resolveUiText;
assert.equal(resolve('إعدادات القراءة'), 'Reading settings');
assert.equal(resolve('الجملة الإنجليزية'), 'English sentence');
assert.equal(resolve('مراجعة الكلمات المستحقة (4)'), 'Review due words (4)');
assert.equal(resolve('7 عنصر — محفوظة محليًا'), '7 saved locally');
assert.equal(resolve('3 مستحقة الآن · تدريب كتابي فقط'), '3 due now · text-only practice');
assert.equal(resolve('نهاية الفصل 12'), 'End of Chapter 12');
assert.equal(resolve('هذه ترجمة أدبية أصلية وليست عنصر واجهة.'), 'هذه ترجمة أدبية أصلية وليست عنصر واجهة.',
  'unknown learning content must remain unchanged');
assert.equal(resolve('The river crossed the bank.'), 'The river crossed the bank.',
  'English story text must remain unchanged');
const translator = shell.slice(shell.indexOf('function translateLegacyUi()'),
  shell.indexOf('\nfunction addReaderLocaleControl()', shell.indexOf('function translateLegacyUi()')));
assert.ok(translator.includes('.reader .toolbar button'));
assert.ok(translator.includes('#modals .sheet label'));
assert.ok(translator.includes('.vocab .rating button'));
assert.ok(!translator.includes('.sentence'));
assert.ok(!translator.includes('.inline-ar'));
assert.ok(!translator.includes('.vitem p'));
assert.ok(!translator.includes('.arabic-inner > p:not(.quiet)'));
assert.match(shell, /function addReaderLocaleControl\(\)/);
assert.match(shell, /applyLocale\(next,false\)/);
assert.match(shell, /wrapLegacyUiRenderer\('settings',true\)/);
assert.match(shell, /legacyUiEnglishText,translateLegacyUi/);
console.log('PASS: full-interface localization resolver, dynamic labels, and learning-content isolation');
