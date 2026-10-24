/* Lingua Tales LT-06: localize app chrome without translating the English
 * literature or overwriting its Arabic learning translations.
 * Loaded after the reader, discovery, backup and shell enhancements. */
(function (global) {
'use strict';
const english = () => document.documentElement.lang === 'en';
const find = selector => document.querySelector(selector);
const each = (selector, callback) => document.querySelectorAll(selector).forEach(callback);
function label(selector, en) {
 const node = find(selector);
 if (node && english()) node.textContent = en;
}
function exact(selector, replacements) {
 if (!english()) return;
 each(selector, node => {
  const translated = replacements[node.textContent.trim()];
  if (translated) node.textContent = translated;
 });
}
function backLabel(selector) { label(selector, '← Library'); }
function localizeReader() {
 if (!english() || state.page !== 'reader') return;
 backLabel('.reader .toolbar button[onclick="libraryBack()"]');
 label('.reader .toolbar button[onclick="settings()"]', 'Aa · Options');
 const chapterEnd = find('.reader .chapter-end > div');
 if (chapterEnd) chapterEnd.textContent =
  state.chapter === state.story.chapters.length - 1 ? 'The End' : 'End of Chapter ' + (state.chapter + 1);
 label('.reader .chapter-end button', state.chapter === state.story.chapters.length - 1 ? 'Return to library' : 'Next chapter →');
}
function localizeSettings() {
 if (!english()) return;
 label('#modals .sheet > h2', 'Reading settings');
 label('#modals .sheet > p.quiet', 'Tap the chapter image to show reading options.');
 exact('#modals .sheet .settings-row > span:first-child', {
  'حجم الخط': 'Text size', 'الوضع الداكن': 'Dark mode',
  'ترجمة تحت كل جملة': 'Arabic translation under each sentence'
 });
 exact('#modals .sheet button[onclick="theme()"], #modals .sheet button[onclick="inlineTranslate()"]', {
  'إيقاف': 'Turn off', 'تفعيل': 'Turn on', 'إخفاء': 'Hide', 'إظهار': 'Show'
 });
 label('#modals .sheet > button[onclick="fullTranslation()"]', 'Read the full Arabic translation');
 label('#modals .sheet footer button[onclick="closeSheet()"]', 'Close');
}
function localizeWordSheet() {
 if (!english()) return;
 exact('#modals .sheet > label', {
  'المعنى المعجمي (حتى معنيين متاحين)': 'Dictionary meaning (up to two senses)',
  'المعنى داخل القصة (محرّر)': 'Edited meaning in this story',
  'المعنى في الجملة: يحتاج مراجعة سياقية': 'Meaning in this sentence: context not verified',
  'المعنى المستفاد من الجملة': 'Meaning suggested by the sentence',
  'الجملة الإنجليزية': 'English sentence',
  'ترجمة الجملة (معنوية)': 'Arabic sentence translation'
 });
 exact('#modals .sheet > p.quiet', {
  'هذه معانٍ معجمية عامة وليست تحديدًا آليًا لمعنى الكلمة في الجملة. استخدم الترجمة المعنوية أدناه لفهم السياق.':
   'These are general dictionary senses, not an automatically verified meaning for this sentence. Use the Arabic translation below for context.',
  'الترجمة هنا للجملة كاملة وليست تعريفًا مؤكدًا لهذه الكلمة وحدها. بنضيف معاني منفصلة بعد مراجعتها، بدل اختراع معنى غير صحيح.':
   'This translates the full sentence; it is not a verified definition of this word. Individual senses are added only after review.'
 });
 exact('#modals .sheet footer button', {
  'إزالة من مفرداتي': 'Remove from my words', '＋ حفظ التعبير': '＋ Save expression', 'إغلاق': 'Close'
 });
 // These nodes are actual learning content, never UI chrome.
 each('#modals .sheet p.en', node => { node.lang = 'en'; node.dir = 'ltr'; });
}
function localizeWords() {
 if (!english() || state.page !== 'words') return;
 backLabel('.vocab > button[onclick="libraryBack()"]');
 label('.vocab > h1', 'My saved words');
 label('.vocab > p.quiet', state.saved.length + ' saved locally');
 label('.vocab > button[onclick="showReview()"]',
  'Review due words (' + state.cards.filter(card => card.dueAt <= Date.now()).length + ')');
 each('.vocab .vitem > button', node => {
  if (node.getAttribute('onclick')?.startsWith('removeWord(')) node.textContent = 'Remove';
 });
 exact('.vocab > p:not(.quiet)', {'احفظ أول كلمة أو تعبير من إحدى القصص.': 'Save your first word or expression while reading a story.'});
}
function localizeReview() {
 if (!english() || state.page !== 'review') return;
 backLabel('.review > button[onclick="libraryBack()"]');
 label('.review > h1', 'Vocabulary review');
 const due = state.cards.filter(card => card.dueAt <= Date.now()).length;
 label('.review > p.quiet', due + ' due now · writing practice only');
 label('.review > h2', 'All caught up for today 🎉');
 exact('.review > p:not(.quiet)', {
  'اقرأ قصة جديدة واحفظ مفردات من سياقها.': 'Read another story and save words in context.'
 });
 label('.review-card > p.quiet', 'Recall the missing expression, then reveal the answer.');
 label('.review-card > button[onclick="renderReview(true)"]', 'Reveal answer');
 exact('.review-card .rating button', {
  'نسيت': 'Again', 'صعب': 'Hard', 'تذكرت': 'Good', 'سهل': 'Easy'
 });
 // Masked source sentence, saved Arabic meaning and translation are untouched.
}
function localizeTranslation() {
 if (state.page !== 'translation') return;
 if (english()) {
  label('.arabic-inner > button[onclick="backToReader()"]', '← Back to English story');
  label('.arabic-inner > p.quiet', 'Complete literary Arabic translation');
 }
 each('.arabic-inner > h2, .arabic-inner > p:not(.quiet)', node => {
  node.lang = 'ar'; node.dir = 'rtl';
 });
}
function wrap(name, after) {
 const previous = global[name];
 if (typeof previous !== 'function') return false;
 global[name] = function (...args) {
  const result = previous.apply(this, args);
  after();
  return result;
 };
 return true;
}
// Top-level script functions are exposed on Window in the Android WebView.
for (const [name, callback] of [
 ['renderReader', localizeReader], ['settings', localizeSettings],
 ['wordSheet', localizeWordSheet], ['showWords', localizeWords],
 ['renderReview', localizeReview], ['fullTranslation', localizeTranslation]
]) wrap(name, callback);
global.LinguaI18n = {localizeReader, localizeSettings, localizeWordSheet,
 localizeWords, localizeReview, localizeTranslation};
})(window);
