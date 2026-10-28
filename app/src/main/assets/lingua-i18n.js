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
function localizeLibrary() {
 if (state.page !== 'library') return;
 const set = (selector, ar, en) => {
  const node = find(selector);
  if (node) node.textContent = english() ? en : ar;
 };
 // The hero is created by the reader enhancement after the base library render.
 // Localize it after that render so switching locale never leaves mixed-language chrome.
 set('.storylens-hero .hero-eyebrow',
  'LINGUA TALES · قراءة غامرة', 'LINGUA TALES · IMMERSIVE READING');
 set('.storylens-hero .hero-content > h2',
  'انغمس في حكاية تستحق القراءة.', 'Lose yourself in a good story.');
 set('.storylens-hero .hero-content > p',
  'قصص ناضجة، وأسرار تستحق الاكتشاف، وإنجليزية تتعلمها من الأحداث نفسها.',
  'Mature stories, mysteries worth discovering, and English learned through the story itself.');

 // The story library is the product. Remove stale promotional counts instead
 // of hard-coding totals that drift whenever a new licensed content batch lands.
 const metrics = find('.storylens-hero .hero-metrics');
 if (metrics) metrics.remove();
}
function localizeReader() {
 if (!english() || state.page !== 'reader') return;
 backLabel('.reader .toolbar button[onclick="libraryBack()"]');
 label('.reader .toolbar button[onclick="settings()"]', 'Aa · Options');
 const chapterEnd = find('.reader .chapter-end > div');
 const lastAvailable = state.chapter === state.story.chapters.length - 1;
 const incomplete = Number.isInteger(state.story.totalChapters) &&
  state.story.totalChapters > state.story.chapters.length;
 if (chapterEnd) chapterEnd.textContent = lastAvailable
  ? (incomplete ? 'End of available chapters' : 'The End')
  : 'End of Chapter ' + (state.chapter + 1);
 label('.reader .chapter-end > button.primary', lastAvailable ? 'Return to library' : 'Next chapter →');
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
function localizeUsageFeedback() {
 if (!english()) return;
 const feedback = find('#usage-feedback');
 if (!feedback) return;
 const messages = {
  'الجملة قصيرة جدًا؛ حاول تضيف سياقًا أوضح.':
   'The sentence is very short; add clearer context.',
  'تم حفظ جملتك، والتعبير موجود فيها. راجع القواعد والمعنى بنفسك.':
   'Your sentence is saved and includes the expression. Review grammar and meaning yourself.',
  'تم حفظ جملتك. جرّب استخدام التعبير نفسه بشكل واضح داخلها.':
   'Your sentence is saved. Try using the expression clearly in the sentence.'
 };
 const translated = messages[feedback.textContent.trim()];
 if (translated) feedback.textContent = translated;
}
function localizeUsage() {
 if (!english()) return;
 label('#modals .sheet .tag', 'VOCABULARY PRACTICE');
 label('.usage-note',
  'Write a new English sentence using this expression. This helps you practise recall; it is not AI grammar correction.');
 const input = find('#usage-example');
 if (input) {
  input.placeholder = 'Write your own sentence...';
  input.setAttribute('aria-label', 'Your English sentence');
  input.setAttribute('lang', 'en');
  input.setAttribute('dir', 'ltr');
 }
 const save = find('#usage-check');
 if (save) {
  save.textContent = 'Save my attempt';
  save.setAttribute('aria-label', 'Save my attempt');
  if (save.dataset && save.dataset.ltUsageFeedbackBound !== 'true') {
   save.dataset.ltUsageFeedbackBound = 'true';
   // The existing click handler saves the attempt first; this listener only
   // localizes its resulting feedback and never alters the saved English text.
   save.addEventListener('click', localizeUsageFeedback);
  }
 }
 exact('#modals .sheet label', {
  'مثال من القصة': 'Example from the story'
 });
 each('#modals .sheet p.en', node => { node.lang = 'en'; node.dir = 'ltr'; });
 const close = find('#modals .sheet footer button[onclick="closeSheet()"]');
 if (close) {
  close.textContent = 'Close';
  close.setAttribute('aria-label', 'Close vocabulary practice');
 }
 localizeUsageFeedback();
}
function localizeReaderLocaleControl() {
 if (state.page !== 'reader' || typeof document.createElement !== 'function') return false;
 const sheet = find('#modals .sheet');
 if (!sheet || typeof sheet.querySelector !== 'function') return false;
 const currentLabel = english() ? 'Interface language' : 'لغة الواجهة';
 const currentLocale = english() ? 'en' : 'ar';
 const existingRow = sheet.querySelector('.lt-reader-locale');
 if (existingRow) {
  // Settings may keep the same DOM row while the interface locale changes.
  // Refresh its visible label, accessibility name and selected value instead
  // of leaving a stale Arabic control inside an English interface (or vice versa).
  const existingLabel = typeof existingRow.querySelector === 'function'
   ? existingRow.querySelector('span') : null;
  const existingSelect = typeof existingRow.querySelector === 'function'
   ? existingRow.querySelector('select') : null;
  const labelNode = existingLabel || existingRow.children?.[0];
  const selectNode = existingSelect || existingRow.children?.[1];
  if (labelNode) labelNode.textContent = currentLabel;
  if (selectNode) {
   selectNode.value = currentLocale;
   selectNode.setAttribute('aria-label', currentLabel);
  }
  return false;
 }
 const row = document.createElement('div');
 row.className = 'settings-row lt-reader-locale';
 row.setAttribute('role', 'group');
 const label = document.createElement('span');
 label.textContent = currentLabel;
 const select = document.createElement('select');
 select.id = 'lt-reader-locale-select';
 select.setAttribute('aria-label', currentLabel);
 for (const choice of [{id:'ar',name:'العربية'},{id:'en',name:'English'}]) {
  const option = document.createElement('option');
  option.value = choice.id;
  option.textContent = choice.name;
  select.appendChild(option);
 }
 select.value = currentLocale;
 select.addEventListener('change', () => {
  const next = select.value;
  const y = Math.max(0, Number(global.scrollY) || 0);
  if (state.story && typeof put === 'function')
   put('scroll_' + state.story.id + '_' + state.chapter, y);
  if (global.LinguaShell && typeof global.LinguaShell.applyLocale === 'function') {
   global.LinguaShell.applyLocale(next, false);
  } else {
   document.documentElement.lang = next;
   document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }
  if (typeof global.renderReader === 'function') global.renderReader();
  if (typeof global.settings === 'function') global.settings();
  if (typeof global.scrollTo === 'function') global.scrollTo(0, y);
 });
 row.appendChild(label);
 row.appendChild(select);
 const first = sheet.querySelector('.settings-row');
 if (first) sheet.insertBefore(row, first);
 else sheet.appendChild(row);
 return true;
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
 ['library', localizeLibrary], ['renderReader', localizeReader],
 ['settings', () => { localizeSettings(); localizeReaderLocaleControl(); }],
 ['wordSheet', localizeWordSheet], ['showWords', localizeWords],
 ['renderReview', localizeReview], ['fullTranslation', localizeTranslation],
 ['openUsage', localizeUsage]
]) wrap(name, callback);
global.LinguaI18n = {localizeLibrary, localizeReader, localizeSettings, localizeWordSheet,
 localizeWords, localizeReview, localizeTranslation, localizeReaderLocaleControl};
})(window);
