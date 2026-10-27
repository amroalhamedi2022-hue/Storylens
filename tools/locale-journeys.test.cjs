'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/lingua-i18n.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/index.html'), 'utf8');
assert.ok(html.indexOf('src="lingua-shell.js"') < html.indexOf('src="lingua-i18n.js"'));
const nodes = new Map();
function makeNode(value, attributes={}) {
 const listeners={};
 return {textContent:value,lang:null,dir:null,placeholder:'',dataset:{},onclick:null,
  getAttribute(name){return attributes[name]??null;},
  setAttribute(name,val){attributes[name]=String(val);},
  addEventListener(name,callback){(listeners[name]??=[]).push(callback);},
  click(){
   if(typeof this.onclick==='function')this.onclick();
   for(const callback of listeners.click||[])callback();
  }};
}
function node(selector, value, attributes={}) {
 const result=makeNode(value,attributes);
 nodes.set(selector,[result]);return result;
}
function group(selector,values,attributes={}) {
 const result=values.map(value=>makeNode(value,attributes));
 nodes.set(selector,result);return result;
}
const document={documentElement:{lang:'en'},
 querySelector(selector){return nodes.get(selector)?.[0]||null;},
 querySelectorAll(selector){return nodes.get(selector)||[];}};
const story={chapters:[{paragraphs:[{en:'The river was silent.',ar:'كان النهر صامتًا.'}]},{paragraphs:[]}]};
const state={page:'reader',chapter:0,story,saved:['river'],
 cards:[{dueAt:0,meaning:'نهر',translation:'كان النهر صامتًا.'}]};
const calls={};
const window={};
for(const name of ['renderReader','settings','wordSheet','showWords','renderReview','fullTranslation','openUsage']){
 calls[name]=0;
 window[name]=()=>{calls[name]++;};
}
const sandbox={window,document,state,Date};
vm.runInNewContext(source,sandbox,{filename:'lingua-i18n.js',timeout:5000});
assert.ok(window.LinguaI18n);
const toolbar=node('.reader .toolbar button[onclick="libraryBack()"]','← المكتبة');
const options=node('.reader .toolbar button[onclick="settings()"]','Aa · الخيارات');
const chapter=node('.reader .chapter-end > div','End of Chapter 1');
const next=node('.reader .chapter-end > button.primary','Next chapter →');
const navNext=node('.lt-chapter-nav button:nth-child(2)','Next chapter →');
const englishSentence=node('.reader .sentence','The river was silent.');
const arabicMeaning=node('.reader .inline-ar','كان النهر صامتًا.');
window.renderReader();
assert.equal(calls.renderReader,1);
assert.equal(toolbar.textContent,'← Library');
assert.equal(options.textContent,'Aa · Options');
assert.equal(next.textContent,'Next chapter →');
assert.equal(navNext.textContent,'Next chapter →','locale changes must not overwrite the accessible chapter-navigation control');
state.chapter=1;window.renderReader();
assert.equal(next.textContent,'Return to library');
assert.equal(navNext.textContent,'Next chapter →','primary action localization must not mutate the chapter-navigation control');
assert.equal(chapter.textContent,'The End');
assert.equal(englishSentence.textContent,'The river was silent.');
assert.equal(arabicMeaning.textContent,'كان النهر صامتًا.');
const settingTitle=node('#modals .sheet > h2','إعدادات القراءة');
const settingDescription=node('#modals .sheet > p.quiet','القارئ بلا قوائم دائمة');
const settingLabels=group('#modals .sheet .settings-row > span:first-child',
 ['حجم الخط','الوضع الداكن','ترجمة تحت كل جملة']);
const settingSwitches=group('#modals .sheet button[onclick="theme()"], #modals .sheet button[onclick="inlineTranslate()"]',
 ['تفعيل','إظهار']);
const full=node('#modals .sheet > button[onclick="fullTranslation()"]','قراءة الترجمة الكاملة للقصة');
const close=node('#modals .sheet footer button[onclick="closeSheet()"]','إغلاق');
window.settings();
assert.equal(settingTitle.textContent,'Reading settings');
assert.equal(settingLabels[0].textContent,'Text size');
assert.equal(settingLabels[2].textContent,'Arabic translation under each sentence');
assert.equal(settingSwitches[0].textContent,'Turn on');
assert.equal(full.textContent,'Read the full Arabic translation');
assert.equal(close.textContent,'Close');
const labels=group('#modals .sheet > label',['المعنى المعجمي (حتى معنيين متاحين)','الجملة الإنجليزية','ترجمة الجملة (معنوية)']);
const warnings=group('#modals .sheet > p.quiet',['هذه معانٍ معجمية عامة وليست تحديدًا آليًا لمعنى الكلمة في الجملة. استخدم الترجمة المعنوية أدناه لفهم السياق.']);
const footer=group('#modals .sheet footer button',['＋ حفظ التعبير','إغلاق']);
const sourceSentence=node('#modals .sheet p.en','The river was silent.');
window.wordSheet();
assert.equal(labels[0].textContent,'Dictionary meaning (up to two senses)');
assert.equal(labels[2].textContent,'Arabic sentence translation');
assert.match(warnings[0].textContent,/general dictionary senses/);
assert.equal(footer[0].textContent,'＋ Save expression');
assert.equal(sourceSentence.lang,'en');
assert.equal(sourceSentence.textContent,'The river was silent.');
state.page='words';
const wordsTitle=node('.vocab > h1','مفرداتي المحفوظة');
const wordsBack=node('.vocab > button[onclick="libraryBack()"]','← المكتبة');
const wordsCount=node('.vocab > p.quiet','1 عنصر — محفوظة محليًا');
const wordsReview=node('.vocab > button[onclick="showReview()"]','مراجعة الكلمات المستحقة (1)');
const remove=group('.vocab .vitem > button',['إزالة'],{onclick:"removeWord('river')"});
const wordMeaning=node('.vitem p','نهر');
window.showWords();
assert.equal(wordsTitle.textContent,'My saved words');
assert.equal(wordsCount.textContent,'1 saved locally');
assert.equal(wordsReview.textContent,'Review due words (1)');
assert.equal(remove[0].textContent,'Remove');
assert.equal(wordMeaning.textContent,'نهر');
state.page='review';
const reviewTitle=node('.review > h1','مراجعة المفردات');
const reviewCount=node('.review > p.quiet','1 مستحقة الآن');
const reviewNote=node('.review-card > p.quiet','حاول تذكر التعبير الناقص، ثم اكشف الجواب');
const reveal=node('.review-card > button[onclick="renderReview(true)"]','اكشف الجواب');
const grades=group('.review-card .rating button',['نسيت','صعب','تذكرت','سهل']);
window.renderReview(true);
assert.equal(reviewTitle.textContent,'Vocabulary review');
assert.equal(reviewCount.textContent,'1 due now · writing practice only');
assert.equal(reveal.textContent,'Reveal answer');
assert.deepEqual(grades.map(x=>x.textContent),['Again','Hard','Good','Easy']);
state.page='translation';
const arabicParagraph=group('.arabic-inner > h2, .arabic-inner > p:not(.quiet)',['الفصل الأول','كان النهر صامتًا.']);
const back=node('.arabic-inner > button[onclick="backToReader()"]','← العودة للإنجليزية');
window.fullTranslation();
assert.equal(back.textContent,'← Back to English story');
assert.ok(arabicParagraph.every(x=>x.lang==='ar'&&x.dir==='rtl'));
assert.equal(arabicParagraph[1].textContent,'كان النهر صامتًا.');

state.page='words';
const usageTag=node('#modals .sheet .tag','ACTIVE VOCABULARY');
const usageNote=node('.usage-note','اكتب جملة إنجليزية جديدة تستخدم فيها التعبير. الفحص هنا يساعدك على التدرب والحفظ، لكنه ليس تصحيحًا لغويًا بالذكاء الاصطناعي.');
const usageInput=node('#usage-example','');
const usageSave=node('#usage-check','احفظ محاولتي');
const usageExampleLabel=node('#modals .sheet label','مثال من القصة');
const usageClose=node('#modals .sheet footer button[onclick="closeSheet()"]','إغلاق');
const usageFeedback=node('#usage-feedback','');
usageSave.onclick=()=>{usageFeedback.textContent='تم حفظ جملتك، والتعبير موجود فيها. راجع القواعد والمعنى بنفسك.';};
window.openUsage('river');
assert.equal(calls.openUsage,1);
assert.equal(usageTag.textContent,'VOCABULARY PRACTICE');
assert.match(usageNote.textContent,/not AI grammar correction/);
assert.equal(usageInput.placeholder,'Write your own sentence...');
assert.equal(usageInput.getAttribute('aria-label'),'Your English sentence');
assert.equal(usageInput.getAttribute('lang'),'en');
assert.equal(usageInput.getAttribute('dir'),'ltr');
assert.equal(usageSave.textContent,'Save my attempt');
assert.equal(usageExampleLabel.textContent,'Example from the story');
assert.equal(usageClose.textContent,'Close');
usageSave.click();
assert.equal(usageFeedback.textContent,'Your sentence is saved and includes the expression. Review grammar and meaning yourself.');
assert.equal(sourceSentence.textContent,'The river was silent.','vocabulary practice keeps the source sentence unchanged');

document.documentElement.lang='ar';
const unchanged=node('.review > h1','مراجعة المفردات');
state.page='review';window.renderReview(false);
assert.equal(unchanged.textContent,'مراجعة المفردات','Arabic UI stays Arabic');
assert.equal(story.chapters[0].paragraphs[0].en,'The river was silent.');
assert.equal(story.chapters[0].paragraphs[0].ar,'كان النهر صامتًا.');
console.log('PASS: LT-06 localized reader, settings, word sheet, vocabulary, SRS and full Arabic translation without altering learning text');
