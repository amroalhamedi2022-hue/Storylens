/* Lingua Tales LT-03: defer the long Verne corpus and FreeDict until needed.
 * All assets stay local in the APK; this loader never opens a network URL.
 * Chapter files must load sequentially because each verifies the prior chapter count.
 */
(function (global) {
'use strict';

const lazyNodes = Array.from(document.querySelectorAll('script[data-lt-lazy]'));
const bookAssets = [];
const dictionaryAssets = [];
for (const node of lazyNodes) {
  const src = node.getAttribute('src');
  const group = node.getAttribute('data-lt-lazy');
  if (src && group === 'book') bookAssets.push(src);
  else if (src && group === 'dictionary') dictionaryAssets.push(src);
  node.remove();
}
const loaded = new Set();
let bookPromise = null;
let dictionaryPromise = null;
let editorialArtPromise = null;
let editorialArtReady = false;
let openGeneration = 0;
let bookLoadGeneration = 0;
const inFlightAssets = new Map();
let statusNode = null;
const BOOK_ID = 'around-the-world-in-eighty-days-towle';

function rootNode() { return document.getElementById('root'); }
function unlockRoot() {
  const root = rootNode();
  if (!root) return;
  root.inert = false;
  root.removeAttribute('aria-busy');
}
function cancelBookLoad() {
  // Let the already-started local script finish, but never load the remaining
  // chapter/art scripts after the user leaves or cancels the long book.
  bookLoadGeneration++;
  bookPromise = null;
}
function cancelledLoadError() {
  const error = new Error('Offline book load cancelled');
  error.name = 'AbortError';
  return error;
}
function clearStatus() {
  if (statusNode) statusNode.remove();
  statusNode = null;
}
function status() {
  if (statusNode) return statusNode;
  const style = document.createElement('style');
  style.id = 'lt-content-loader-style';
  style.textContent = '.lt-content-load-status{position:fixed;z-index:10000;inset:auto 16px 18px;max-width:min(92vw,460px);margin-inline:auto;padding:14px 16px;border:1px solid #ffffff35;border-radius:18px;background:#171b35f5;color:#fff;font:500 15px/1.55 system-ui,sans-serif;box-shadow:0 12px 36px #0005;display:flex;align-items:center;gap:12px;flex-wrap:wrap}.lt-content-load-status span{flex:1 1 180px}.lt-content-load-status button{border:1px solid #ffffff55;border-radius:12px;padding:8px 12px;background:#ffffff18;color:inherit;font:inherit}';
  if (!document.getElementById('lt-content-loader-style')) document.head.appendChild(style);
  statusNode = document.createElement('div');
  statusNode.id = 'lt-content-load-status';
  statusNode.className = 'lt-content-load-status';
  statusNode.setAttribute('role', 'status');
  statusNode.setAttribute('aria-live', 'polite');
  document.body.appendChild(statusNode);
  return statusNode;
}
function addAction(node, label, callback) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', callback);
  node.appendChild(button);
}
function showLoading(kind = 'book') {
  const node = status();
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', 'polite');
  node.lang = document.documentElement.lang || 'ar';
  node.dir = document.documentElement.dir || 'rtl';
  node.replaceChildren();
  const message = document.createElement('span');
  message.textContent = kind === 'art'
    ? (node.dir === 'ltr' ? 'Preparing this story’s offline illustrations…' : 'جارٍ تجهيز رسومات هذه القصة دون إنترنت…')
    : (node.dir === 'ltr' ? 'Preparing the book for offline reading…' : 'جارٍ تجهيز الكتاب للقراءة دون إنترنت…');
  node.appendChild(message);
  addAction(node, node.dir === 'ltr' ? 'Cancel' : 'إلغاء', cancelPending);
}
function showError() {
  const node = status();
  node.setAttribute('role', 'alert');
  node.setAttribute('aria-live', 'assertive');
  node.lang = document.documentElement.lang || 'ar';
  node.dir = document.documentElement.dir || 'rtl';
  node.replaceChildren();
  const message = document.createElement('span');
  message.textContent = node.dir === 'ltr'
    ? 'The offline book could not be prepared. Please retry.'
    : 'تعذّر تجهيز الكتاب دون إنترنت. أعد المحاولة من فضلك.';
  node.appendChild(message);
  addAction(node, node.dir === 'ltr' ? 'Retry' : 'إعادة المحاولة', () => global.openStory?.(BOOK_ID));
  addAction(node, node.dir === 'ltr' ? 'Close' : 'إغلاق', cancelPending);
}
function cancelPending() {
  openGeneration++;
  cancelBookLoad();
  clearStatus();
  unlockRoot();
}
function loadAsset(src) {
  if (loaded.has(src)) return Promise.resolve();
  if (inFlightAssets.has(src)) return inFlightAssets.get(src);
  const pending = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.ltLazyLoaded = src;
    let settled = false;
    script.onload = () => {
      if (settled) return;
      settled = true;
      loaded.add(src);
      resolve();
    };
    script.onerror = () => {
      if (settled) return;
      settled = true;
      script.remove();
      reject(new Error('Offline asset failed to load'));
    };
    document.head.appendChild(script);
  });
  let tracked;
  tracked = pending.finally(() => {
    if (inFlightAssets.get(src) === tracked) inFlightAssets.delete(src);
  });
  inFlightAssets.set(src, tracked);
  return tracked;
}
async function loadAssets(list, generation = null) {
  for (const src of list) {
    if (generation !== null && generation !== bookLoadGeneration) throw cancelledLoadError();
    await loadAsset(src);
  }
  if (generation !== null && generation !== bookLoadGeneration) throw cancelledLoadError();
}
// The existing 100KB scene engine stays lazy. Non-Verne stories can load it
// alone when first opened, without forcing any of the 36 book chapter scripts.
function ensureEditorialArt() {
  if (editorialArtReady) return Promise.resolve(true);
  if (!editorialArtPromise) {
    editorialArtPromise = loadAsset('editorial-art.js').then(() => {
      if (typeof global.LinguaAttachEditorialArt !== 'function' ||
          global.LinguaAttachEditorialArt() !== true)
        throw new Error('Offline chapter scene registry is unavailable');
      editorialArtReady = true;
      return true;
    }).catch(error => { editorialArtPromise = null; throw error; });
  }
  return editorialArtPromise;
}
async function loadBook(generation) {
  if (!bookAssets.length) throw new Error('Offline book manifest is empty');
  await loadAssets(bookAssets, generation);
  if (generation !== bookLoadGeneration) throw cancelledLoadError();
  if (typeof global.LinguaAttachEditorialArt !== 'function' || global.LinguaAttachEditorialArt() !== true)
    throw new Error('Offline illustration registry is unavailable');
  editorialArtReady = true;
  const story = (global.StoryLensEditorialStories || []).find(item => item.id === BOOK_ID);
  if (!story || story.totalChapters !== 37 || story.chapters.length !== 37 ||
      story.chapters.some(chapter => !Array.isArray(chapter.paragraphs) || !chapter.paragraphs.length ||
        chapter.paragraphs.some(paragraph => !paragraph.en?.trim() || !paragraph.ar?.trim()))) {
    throw new Error('Offline bilingual chapter catalog is incomplete');
  }
  // The first chapter is lazy-loaded, so the library starts with a lightweight
  // metadata placeholder. Merge the verified loaded object into that same
  // catalog entry before the original openStory callback looks it up.
  const catalog = global.LinguaCatalog;
  if (!catalog || !Array.isArray(catalog.stories)) {
    throw new Error('Offline library catalog is unavailable');
  }
  const catalogStory = catalog.stories.find(item => item.id === BOOK_ID);
  if (catalogStory) Object.assign(catalogStory, story, { lazyBook: false });
  else catalog.stories.push(story);
  return true;
}
function ensureStory(id) {
  if (id !== BOOK_ID) return Promise.resolve(true);
  if (!bookPromise) {
    const generation = bookLoadGeneration;
    const pending = loadBook(generation);
    let tracked;
    tracked = pending.catch(error => {
      if (bookPromise === tracked) bookPromise = null;
      throw error;
    });
    bookPromise = tracked;
  }
  return bookPromise;
}
function ensureDictionary() {
  if (global.FreeDictEnglishArabic?.resolve) return Promise.resolve(true);
  if (!dictionaryAssets.length) return Promise.reject(new Error('Offline dictionary manifest is empty'));
  if (!dictionaryPromise) dictionaryPromise = loadAssets(dictionaryAssets).then(() => {
    if (!global.FreeDictEnglishArabic || typeof global.FreeDictEnglishArabic.resolve !== 'function')
      throw new Error('Offline dictionary did not register');
    return true;
  }).catch(error => { dictionaryPromise = null; throw error; });
  return dictionaryPromise;
}

// Paint the library first, then populate its context-matched offline covers
// during browser idle. This is NOT the heavyweight 37-chapter book payload.
// The loader's own promise deduplicates taps that occur while art is loading.
// If a local asset fails, reading and navigation remain fully usable.
function scheduleEditorialCoverWarmup(){
 const work=()=>{
  ensureEditorialArt().then(()=>{
   if(typeof global.LinguaHydrateStoryCovers==='function')
    global.LinguaHydrateStoryCovers();
  }).catch(()=>{}); // decorative cover failure never blocks a story
 };
 if(typeof global.requestIdleCallback==='function')
  global.requestIdleCallback(work,{timeout:3000});
 else if(typeof global.setTimeout==='function')
  global.setTimeout(work,1100);
}
scheduleEditorialCoverWarmup();

const originalOpenStory = global.openStory;
if (typeof originalOpenStory === 'function') {
  global.openStory = function (id, ...args) {
    const token = ++openGeneration;
    if (id !== BOOK_ID) {
      cancelBookLoad();
      clearStatus();
      unlockRoot();
      const needsIllustrations = !editorialArtReady &&
        (global.StoryLensEditorialStories || []).some(story => story?.id === id);
      if (!needsIllustrations) return originalOpenStory.call(this, id, ...args);
      showLoading('art');
      const root = rootNode();
      if (root) {
        root.setAttribute('aria-busy', 'true');
        root.inert = true;
      }
      ensureEditorialArt().then(() => {
        if (token !== openGeneration) return;
        clearStatus();
        unlockRoot();
        originalOpenStory.call(this, id, ...args);
      }).catch(() => {
        if (token !== openGeneration) return;
        // Illustrations may fail, but offline story text is always readable.
        clearStatus();
        unlockRoot();
        originalOpenStory.call(this, id, ...args);
      });
      return;
    }
    // Once the verified long book has been merged into the catalog, reopening it
    // must be synchronous: no loading overlay, inert library, or microtask race.
    const readyStory = global.LinguaCatalog?.stories?.find(item => item.id === BOOK_ID);
    if (readyStory && readyStory.lazyBook === false &&
        Number.isInteger(readyStory.totalChapters) && readyStory.totalChapters > 0 &&
        Array.isArray(readyStory.chapters) && readyStory.chapters.length === readyStory.totalChapters) {
      clearStatus();
      unlockRoot();
      return originalOpenStory.call(this, id, ...args);
    }
    showLoading();
    const root = rootNode();
    if (root) {
      root.setAttribute('aria-busy', 'true');
      root.inert = true;
    }
    ensureStory(id).then(() => {
      if (token !== openGeneration) return;
      clearStatus();
      unlockRoot();
      originalOpenStory.call(this, id, ...args);
    }).catch(() => {
      if (token !== openGeneration) return;
      unlockRoot();
      showError();
    });
  };
}

// The first unknown word opens immediately with the honest sentence translation.
// Once the local FreeDict pack is ready, refresh only that same still-open word sheet.
const originalWordSheet = global.wordSheet;
let wordSheetGeneration = 0;
if (typeof originalWordSheet === 'function') {
  global.wordSheet = function (payload, ...args) {
    const token = ++wordSheetGeneration;
    const result = originalWordSheet.call(this, payload, ...args);
    if (global.FreeDictEnglishArabic?.resolve || !payload || payload.entry ||
        typeof payload.display !== 'string' || !payload.display || /\s/u.test(payload.display)) return result;
    ensureDictionary().then(() => {
      if (token !== wordSheetGeneration) return;
      const heading = document.querySelector('#modals .sheet h2');
      if (!heading || heading.textContent !== payload.display) return;
      const entry = global.FreeDictEnglishArabic?.resolve(payload.display);
      if (entry) originalWordSheet.call(this, { ...payload, entry });
    }).catch(() => {});
    return result;
  };
}

global.LinguaContentLoader = Object.freeze({
  ensureStory,
  ensureEditorialArt,
  ensureDictionary,
  cancel: cancelPending,
  get bookAssetCount() { return bookAssets.length; },
  get dictionaryAssetCount() { return dictionaryAssets.length; },
  get loadedAssetCount() { return loaded.size; }
});
})(window);
