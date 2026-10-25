/* Lingua Tales — complete Towle Chapter IV (43 source paragraphs).
 * English: Jules Verne / George Makepeace Towle (1873); Standard Ebooks CC0 transcription.
 * https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-4.xhtml
 * Arabic: new companion draft; independent literary review and territory rights pending.
 */
(function(global){
'use strict';
const story=(global.StoryLensEditorialStories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
if(!story||story.chapters.length!==3)throw Error('Towle chapter IV load order mismatch');
story.chapters.push({title:'In Which Phileas Fogg Astounds Passepartout, His Servant',
 titleAr:'فيه يذهل فيلياس فوغ خادمه باسبارتو',
 paragraphs:[
  {
    "en": "Having won twenty guineas at whist, and taken leave of his friends, Phileas Fogg, at twenty-five minutes past seven, left the Reform Club.",
    "ar": "بعد أن ربح عشرين جنيهًا ذهبيًا في لعبة «ويست» وودّع أصدقاءه، غادر فيلياس فوغ نادي الإصلاح عند السابعة وخمس وثلاثين دقيقة مساءً."
  },
  {
    "en": "Passepartout, who had conscientiously studied the programme of his duties, was more than surprised to see his master guilty of the inexactness of appearing at this unaccustomed hour; for, according to rule, he was not due in Saville Row until precisely midnight.",
    "ar": "كان باسبارتو قد درس برنامج واجباته بعناية، ففوجئ أشد المفاجأة بعودة سيده في ساعة غير معتادة؛ إذ لم يكن مقررًا أن يصل إلى منزله في سافيل رو قبل منتصف الليل تمامًا."
  },
  {
    "en": "Mr. Fogg repaired to his bedroom, and called out, “Passepartout!”",
    "ar": "دخل السيد فوغ غرفة نومه ونادى: «باسبارتو!»"
  },
  {
    "en": "Passepartout did not reply. It could not be he who was called; it was not the right hour.",
    "ar": "لم يُجب باسبارتو؛ فلم يخطر له أنه المقصود بالنداء، فالوقت لم يحن بعد."
  },
  {
    "en": "“Passepartout!” repeated Mr. Fogg, without raising his voice.",
    "ar": "كرر السيد فوغ من دون أن يرفع صوته: «باسبارتو!»"
  },
  {
    "en": "Passepartout made his appearance.",
    "ar": "حضر باسبارتو إلى الغرفة."
  },
  {
    "en": "“I’ve called you twice,” observed his master.",
    "ar": "قال سيده: «ناديتك مرتين»."
  },
  {
    "en": "“But it is not midnight,” responded the other, showing his watch.",
    "ar": "أجاب الخادم وهو يشير إلى ساعته: «لكن الساعة لم تبلغ منتصف الليل»."
  },
  {
    "en": "“I know it; I don’t blame you. We start for Dover and Calais in ten minutes.”",
    "ar": "قال فوغ: «أعرف ذلك ولا ألومك. سننطلق إلى دوفر وكاليه بعد عشر دقائق»."
  },
  {
    "en": "A puzzled grin overspread Passepartout’s round face; clearly he had not comprehended his master.",
    "ar": "ارتسمت على وجه باسبارتو المستدير ابتسامة حائرة؛ فمن الواضح أنه لم يفهم ما يقصده سيده."
  },
  {
    "en": "“Monsieur is going to leave home?”",
    "ar": "سأل: «هل سيغادر سيدي المنزل؟»"
  },
  {
    "en": "“Yes,” returned Phileas Fogg. “We are going round the world.”",
    "ar": "أجاب فيلياس فوغ: «نعم، سنطوف حول العالم»."
  },
  {
    "en": "Passepartout opened wide his eyes, raised his eyebrows, held up his hands, and seemed about to collapse, so overcome was he with stupefied astonishment.",
    "ar": "اتسعت عينا باسبارتو وارتفع حاجباه، ورفع يديه وكاد يسقط أرضًا من فرط الدهشة والذهول."
  },
  {
    "en": "“Round the world!” he murmured.",
    "ar": "تمتم: «حول العالم!»"
  },
  {
    "en": "“In eighty days,” responded Mr. Fogg. “So we haven’t a moment to lose.”",
    "ar": "قال السيد فوغ: «في ثمانين يومًا؛ ولذلك ليس لدينا لحظة نضيعها»."
  },
  {
    "en": "“But the trunks?” gasped Passepartout, unconsciously swaying his head from right to left.",
    "ar": "شهق باسبارتو وهو يهز رأسه لا شعوريًا: «لكن ماذا عن صناديق الأمتعة؟»"
  },
  {
    "en": "“We’ll have no trunks; only a carpetbag, with two shirts and three pairs of stockings for me, and the same for you. We’ll buy our clothes on the way. Bring down my mackintosh and traveling-cloak, and some stout shoes, though we shall do little walking. Make haste!”",
    "ar": "قال فوغ: «لن نحمل صناديق؛ حقيبة سفر صغيرة فحسب، فيها قميصان وثلاثة أزواج من الجوارب لي، ومثلها لك. سنشتري ثيابنا في الطريق. أحضر معطفي الواقي من المطر وعباءة السفر وحذاءً متينًا، وإن كنا لن نمشي كثيرًا. أسرع!»"
  },
  {
    "en": "Passepartout tried to reply, but could not. He went out, mounted to his own room, fell into a chair, and muttered: “That’s good, that is! And I, who wanted to remain quiet!”",
    "ar": "حاول باسبارتو أن يرد فلم يستطع. خرج وصعد إلى غرفته، ثم ارتمى على كرسي وتمتم: «يا لها من مفاجأة! وأنا الذي كنت أريد حياة هادئة!»"
  },
  {
    "en": "He mechanically set about making the preparations for departure. Around the world in eighty days! Was his master a fool? No. Was this a joke, then? They were going to Dover; good! To Calais; good again! After all, Passepartout, who had been away from France five years, would not be sorry to set foot on his native soil again. Perhaps they would go as far as Paris, and it would do his eyes good to see Paris once more. But surely a gentleman so chary of his steps would stop there; no doubt⁠—but, then, it was none the less true that he was going away, this so domestic person hitherto!",
    "ar": "بدأ يستعد للمغادرة بصورة آلية. حول العالم في ثمانين يومًا! أجنّ سيده؟ لا. أهي مزحة؟ سيذهبان إلى دوفر، حسنًا؛ ثم إلى كاليه، حسنًا أيضًا. ولم يكن باسبارتو، الذي ابتعد عن فرنسا خمس سنوات، ليكره أن تطأ قدماه أرض وطنه من جديد. وربما بلغا باريس فيسعد برؤيتها مرة أخرى. لكن رجلًا يقتصد في خطواته إلى هذا الحد لا بد أن يتوقف هناك؛ هكذا ظن. ومع ذلك كانت الحقيقة أنه سيغادر منزله، هذا الرجل الذي لم يعرف عنه إلا ملازمة البيت!"
  },
  {
    "en": "By eight o’clock Passepartout had packed the modest carpetbag, containing the wardrobes of his master and himself; then, still troubled in mind, he carefully shut the door of his room, and descended to Mr. Fogg.",
    "ar": "بحلول الثامنة كان باسبارتو قد حزم الحقيبة الصغيرة بما يلزم سيده ويلزمه من ثياب، ثم أغلق باب غرفته بعناية ونزل، وما زال القلق يشغل باله، إلى السيد فوغ."
  },
  {
    "en": "Mr. Fogg was quite ready. Under his arm might have been observed a red-bound copy of Bradshaw’s Continental Railway Steam Transit and General Guide, with its timetables showing the arrival and departure of steamers and railways. He took the carpetbag, opened it, and slipped into it a goodly roll of Bank of England notes, which would pass wherever he might go.",
    "ar": "كان السيد فوغ مستعدًا تمامًا. وتحت ذراعه نسخة حمراء الغلاف من دليل برادشو لسكك الحديد والبواخر الأوروبية، وفيه مواعيد الوصول والمغادرة. أخذ الحقيبة وفتحها ووضع فيها رزمة كبيرة من أوراق بنك إنجلترا النقدية، تصلح للإنفاق حيثما ذهب."
  },
  {
    "en": "“You have forgotten nothing?” asked he.",
    "ar": "سأل فوغ: «هل نسيت شيئًا؟»"
  },
  {
    "en": "“Nothing, monsieur.”",
    "ar": "أجاب: «لا شيء يا سيدي»."
  },
  {
    "en": "“My mackintosh and cloak?”",
    "ar": "«ومعطفي الواقي من المطر وعباءة السفر؟»"
  },
  {
    "en": "“Here they are.”",
    "ar": "«ها هما»."
  },
  {
    "en": "“Good! Take this carpetbag,” handing it to Passepartout. “Take good care of it, for there are twenty thousand pounds in it.”",
    "ar": "قال فوغ وهو يناوله الحقيبة: «جيد! خذ هذه الحقيبة واعتنِ بها جيدًا؛ ففيها عشرون ألف جنيه»."
  },
  {
    "en": "Passepartout nearly dropped the bag, as if the twenty thousand pounds were in gold, and weighed him down.",
    "ar": "كاد باسبارتو يسقط الحقيبة من يده، كأن العشرين ألف جنيه قطع ذهبية ثقيلة تشدها إلى الأرض."
  },
  {
    "en": "Master and man then descended, the street-door was double-locked, and at the end of Saville Row they took a cab and drove rapidly to Charing Cross. The cab stopped before the railway station at twenty minutes past eight. Passepartout jumped off the box and followed his master, who, after paying the cabman, was about to enter the station, when a poor beggar-woman, with a child in her arms, her naked feet smeared with mud, her head covered with a wretched bonnet, from which hung a tattered feather, and her shoulders shrouded in a ragged shawl, approached, and mournfully asked for alms.",
    "ar": "نزل السيد وخادمه، وأُحكم إغلاق باب المنزل بقفلين. وعند نهاية سافيل رو استقلا عربة أجرة أسرعت بهما إلى تشارينغ كروس. توقفت العربة أمام محطة القطار في الثامنة وعشرين دقيقة. قفز باسبارتو عن مقعده وتبع سيده بعد أن دفع أجرة السائق. وبينما كان فوغ يهم بدخول المحطة، اقتربت منه امرأة فقيرة تحمل طفلًا، وقد تلطخت قدماها الحافيتان بالطين، وعلى رأسها قبعة بالية تتدلى منها ريشة ممزقة، وعلى كتفيها شال رث، وسألته صدقة بصوت حزين."
  },
  {
    "en": "Mr. Fogg took out the twenty guineas he had just won at whist, and handed them to the beggar, saying, “Here, my good woman. I’m glad that I met you;” and passed on.",
    "ar": "أخرج السيد فوغ الجنيهات الذهبية العشرين التي ربحها قبل قليل، وأعطاها للمتسولة قائلًا: «خذي يا سيدتي الطيبة. يسعدني أنني التقيتك»، ثم مضى."
  },
  {
    "en": "Passepartout had a moist sensation about the eyes; his master’s action touched his susceptible heart.",
    "ar": "شعر باسبارتو بأن عينيه تدمعان؛ فقد مسّ تصرف سيده قلبه الرقيق."
  },
  {
    "en": "Two first-class tickets for Paris having been speedily purchased, Mr. Fogg was crossing the station to the train, when he perceived his five friends of the Reform.",
    "ar": "بعد شراء تذكرتين من الدرجة الأولى إلى باريس بسرعة، كان فوغ يعبر المحطة نحو القطار حين لمح أصدقاءه الخمسة من نادي الإصلاح."
  },
  {
    "en": "“Well, gentlemen,” said he, “I’m off, you see; and, if you will examine my passport when I get back, you will be able to judge whether I have accomplished the journey agreed upon.”",
    "ar": "قال لهم: «ها أنا راحل كما ترون يا سادة. وحين أعود يمكنكم فحص جواز سفري لتحكموا هل أتممت الرحلة المتفق عليها»."
  },
  {
    "en": "“Oh, that would be quite unnecessary, Mr. Fogg,” said Ralph politely. “We will trust your word, as a gentleman of honour.”",
    "ar": "أجاب رالف بأدب: «لا داعي إلى ذلك يا سيد فوغ؛ سنثق بكلمتك بوصفك رجل شرف»."
  },
  {
    "en": "“You do not forget when you are due in London again?” asked Stuart.",
    "ar": "سأل ستيوارت: «ألم تنس موعد عودتك إلى لندن؟»"
  },
  {
    "en": "“In eighty days; on Saturday, the 21st of December, 1872, at a quarter before nine p.m. Goodbye, gentlemen.”",
    "ar": "أجاب: «بعد ثمانين يومًا، يوم السبت الحادي والعشرين من ديسمبر سنة 1872، عند الثامنة وخمس وأربعين دقيقة مساءً. وداعًا يا سادة»."
  },
  {
    "en": "Phileas Fogg and his servant seated themselves in a first-class carriage at twenty minutes before nine; five minutes later the whistle screamed, and the train slowly glided out of the station.",
    "ar": "جلس فيلياس فوغ وخادمه في عربة من الدرجة الأولى عند الثامنة وأربعين دقيقة، وبعد خمس دقائق دوّت صفارة القطار وانطلق ببطء خارج المحطة."
  },
  {
    "en": "The night was dark, and a fine, steady rain was falling. Phileas Fogg, snugly ensconced in his corner, did not open his lips. Passepartout, not yet recovered from his stupefaction, clung mechanically to the carpetbag, with its enormous treasure.",
    "ar": "كان الليل مظلمًا والمطر يهطل بخفة وانتظام. جلس فوغ مستريحًا في زاويته ولم ينطق بكلمة. أما باسبارتو، الذي لم يفق من دهشته بعد، فظل ممسكًا بالحقيبة آليًا، وفيها تلك الثروة الهائلة."
  },
  {
    "en": "Just as the train was whirling through Sydenham, Passepartout suddenly uttered a cry of despair.",
    "ar": "وحين اندفع القطار عبر سيدنهام، أطلق باسبارتو فجأة صرخة يائسة."
  },
  {
    "en": "“What’s the matter?” asked Mr. Fogg.",
    "ar": "سأله السيد فوغ: «ما الأمر؟»"
  },
  {
    "en": "“Alas! In my hurry⁠—I⁠—I forgot⁠—”",
    "ar": "قال: «آه! من شدة استعجالي... أنا... نسيت...»"
  },
  {
    "en": "“What?”",
    "ar": "«ماذا؟»"
  },
  {
    "en": "“To turn off the gas in my room!”",
    "ar": "«نسيت أن أطفئ مصباح الغاز في غرفتي!»"
  },
  {
    "en": "“Very well, young man,” returned Mr. Fogg, coolly; “it will burn⁠—at your expense.”",
    "ar": "أجابه فوغ ببرود: «حسنًا يا فتى، سيظل مشتعلًا... وعلى حسابك!»"
  }
]
});
story.terms.push(...[
  {
    "term": "taken leave of",
    "literal": "ودّع",
    "context": "يودّع فوغ أصدقاءه قبل السفر",
    "type": "phrase",
    "note": "To say goodbye before departing."
  },
  {
    "term": "guilty of the inexactness",
    "literal": "مذنب بعدم الدقة",
    "context": "مفارقة ساخرة لأن فوغ عاد خلاف جدوله",
    "type": "ironic phrase",
    "note": "Humorous description of breaking an exact schedule."
  },
  {
    "term": "at this unaccustomed hour",
    "literal": "في ساعة غير معتادة",
    "context": "عودة فوغ في وقت يخالف روتينه",
    "type": "collocation",
    "note": "At an unusual time."
  },
  {
    "term": "without raising his voice",
    "literal": "دون أن يرفع صوته",
    "context": "فوغ ينادي خادمه بهدوء",
    "type": "phrase",
    "note": "Without speaking more loudly."
  },
  {
    "term": "stupefied astonishment",
    "literal": "دهشة مذهلة",
    "context": "رد باسبارتو على قرار السفر",
    "type": "collocation",
    "note": "A state of overwhelming surprise."
  },
  {
    "term": "carpetbag",
    "literal": "حقيبة سفر صغيرة",
    "context": "الأمتعة الوحيدة المسموح بها في الرحلة",
    "type": "noun",
    "note": "A soft travelling bag, traditionally made of carpet fabric."
  },
  {
    "term": "Make haste",
    "literal": "أسرع",
    "context": "يطلب فوغ تجهيز الأمتعة فورًا",
    "type": "imperative",
    "note": "Hurry; act quickly."
  },
  {
    "term": "set foot on",
    "literal": "تطأ قدماه",
    "context": "رغبة باسبارتو في زيارة فرنسا مجددًا",
    "type": "idiom",
    "note": "To arrive at or enter a place."
  },
  {
    "term": "chary of his steps",
    "literal": "شديد الاقتصاد في خطواته",
    "context": "وصف باسبارتو لروتين فوغ الحذر",
    "type": "literary phrase",
    "note": "Very sparing or cautious about movement."
  },
  {
    "term": "goodly roll",
    "literal": "رزمة كبيرة",
    "context": "النقود التي وضعها فوغ في الحقيبة",
    "type": "literary collocation",
    "note": "A substantial bundle."
  },
  {
    "term": "asked for alms",
    "literal": "طلبت صدقة",
    "context": "المرأة الفقيرة في محطة تشارينغ كروس",
    "type": "phrase",
    "note": "Requested charitable money or help."
  },
  {
    "term": "gentleman of honour",
    "literal": "رجل شرف",
    "context": "رالف يثق بكلمة فوغ",
    "type": "collocation",
    "note": "A man whose word and integrity are trusted."
  },
  {
    "term": "snugly ensconced",
    "literal": "مستريح في موضعه",
    "context": "جلوس فوغ بهدوء في القطار",
    "type": "literary phrase",
    "note": "Comfortably settled in a place."
  },
  {
    "term": "at your expense",
    "literal": "على حسابك",
    "context": "فوغ يحمّل باسبارتو كلفة الغاز المنسي",
    "type": "idiom",
    "note": "Paid for or borne by you."
  }
]);
story.totalChapters=37;
story.subtitle='The original Towle translation — Chapters I–IV';
story.description='Fogg wagers his fortune and rushes to the train, leaving a stunned Passepartout to pack. Four authentic chapters; the journey continues.';
story.editorialStatus='English Chapters I–IV source-checked; Arabic draft pending independent review; 4 of 37 chapters';
story.provenance+=' Chapter IV: Standard Ebooks Towle transcription (CC0 editorial edition); territory rights pending review.';
})(window);
