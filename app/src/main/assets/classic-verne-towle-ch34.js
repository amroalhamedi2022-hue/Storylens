/* Lingua Tales — authentic Towle Chapter XXXIV from the pinned Standard Ebooks edition.
 * Upstream commit: 56c82e97ff5d4f8950afca05b71af72688a8da34; source blob: d78ec1d3014c2bb027c60645be33e0c0331ea7d3; src/epub/text/chapter-34.xhtml.
 * Standard Ebooks editorial transcription is CC0; Towle's 1873 English translation is treated as public domain in the USA.
 * Territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
 * 22 narrative paragraphs / 972 English words; normalized English SHA-256: b99d773a896ea121836a443ffc1290e67041718ccbb59f5341a19bc78246e6d9.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==33)throw Error('Towle chapter XXXIV load order mismatch');
const english=[
  "Phileas Fogg was in prison. He had been shut up in the Custom House, and he was to be transferred to London the next day.",
  "Passepartout, when he saw his master arrested, would have fallen upon Fix had he not been held back by some policemen. Aouda was thunderstruck at the suddenness of an event which she could not understand. Passepartout explained to her how it was that the honest and courageous Fogg was arrested as a robber. The young woman’s heart revolted against so heinous a charge, and when she saw that she could attempt to do nothing to save her protector, she wept bitterly.",
  "As for Fix, he had arrested Mr. Fogg because it was his duty, whether Mr. Fogg were guilty or not.",
  "The thought then struck Passepartout, that he was the cause of this new misfortune! Had he not concealed Fix’s errand from his master? When Fix revealed his true character and purpose, why had he not told Mr. Fogg? If the latter had been warned, he would no doubt have given Fix proof of his innocence, and satisfied him of his mistake; at least, Fix would not have continued his journey at the expense and on the heels of his master, only to arrest him the moment he set foot on English soil. Passepartout wept till he was blind, and felt like blowing his brains out.",
  "Aouda and he had remained, despite the cold, under the portico of the Custom House. Neither wished to leave the place; both were anxious to see Mr. Fogg again.",
  "That gentleman was really ruined, and that at the moment when he was about to attain his end. This arrest was fatal. Having arrived at Liverpool at twenty minutes before twelve on the 21st of December, he had till a quarter before nine that evening to reach the Reform Club, that is, nine hours and a quarter; the journey from Liverpool to London was six hours.",
  "If anyone, at this moment, had entered the Custom House, he would have found Mr. Fogg seated, motionless, calm, and without apparent anger, upon a wooden bench. He was not, it is true, resigned; but this last blow failed to force him into an outward betrayal of any emotion. Was he being devoured by one of those secret rages, all the more terrible because contained, and which only burst forth, with an irresistible force, at the last moment? No one could tell. There he sat, calmly waiting—for what? Did he still cherish hope? Did he still believe, now that the door of this prison was closed upon him, that he would succeed?",
  "However that may have been, Mr. Fogg carefully put his watch upon the table, and observed its advancing hands. Not a word escaped his lips, but his look was singularly set and stern. The situation, in any event, was a terrible one, and might be thus stated: if Phileas Fogg was honest he was ruined; if he was a knave, he was caught.",
  "Did escape occur to him? Did he examine to see if there were any practicable outlet from his prison? Did he think of escaping from it? Possibly; for once he walked slowly around the room. But the door was locked, and the window heavily barred with iron rods. He sat down again, and drew his journal from his pocket. On the line where these words were written, “21st December, Saturday, Liverpool,” he added, “80th day, 11:40 a.m.,” and waited.",
  "The Custom House clock struck one. Mr. Fogg observed that his watch was two hours too fast.",
  "Two hours! Admitting that he was at this moment taking an express train, he could reach London and the Reform Club by a quarter before nine, p.m. His forehead slightly wrinkled.",
  "At thirty-three minutes past two he heard a singular noise outside, then a hasty opening of doors. Passepartout’s voice was audible, and immediately after that of Fix. Phileas Fogg’s eyes brightened for an instant.",
  "The door swung open, and he saw Passepartout, Aouda, and Fix, who hurried towards him.",
  "Fix was out of breath, and his hair was in disorder. He could not speak. “Sir,” he stammered, “sir—forgive me—most—unfortunate resemblance—robber arrested three days ago—you are free!”",
  "Phileas Fogg was free! He walked to the detective, looked him steadily in the face, and with the only rapid motion he had ever made in his life, or which he ever would make, drew back his arms, and with the precision of a machine knocked Fix down.",
  "“Well hit!” cried Passepartout, “Parbleu! that’s what you might call a good application of English fists!”",
  "Fix, who found himself on the floor, did not utter a word. He had only received his deserts. Mr. Fogg, Aouda, and Passepartout left the Custom House without delay, got into a cab, and in a few moments descended at the station.",
  "Phileas Fogg asked if there was an express train about to leave for London. It was forty minutes past two. The express train had left thirty-five minutes before. Phileas Fogg then ordered a special train.",
  "There were several rapid locomotives on hand; but the railway arrangements did not permit the special train to leave until three o’clock.",
  "At that hour Phileas Fogg, having stimulated the engineer by the offer of a generous reward, at last set out towards London with Aouda and his faithful servant.",
  "It was necessary to make the journey in five hours and a half; and this would have been easy on a clear road throughout. But there were forced delays, and when Mr. Fogg stepped from the train at the terminus, all the clocks in London were striking ten minutes before nine.",
  "Having made the tour of the world, he was behindhand five minutes. He had lost the wager!"
];
const arabic=[
  "كان فيلياس فوج في السجن؛ فقد احتُجز في دار الجمارك، وكان مقررًا نقله إلى لندن في اليوم التالي.",
  "كاد باسبارتو، حين رأى سيده يُعتقل، يهجم على فيكس لولا أن بعض رجال الشرطة أمسكوا به. أما أودا فصُعقت من مفاجأة حدث لم تستطع فهمه. شرح لها باسبارتو كيف اعتُقل فوج، الرجل النزيه الشجاع، بتهمة السرقة. ورفض قلبها اتهامًا بهذه الفظاعة، وحين أدركت أنها لا تستطيع فعل شيء لإنقاذ من حماها، انفجرت في بكاء مرير.",
  "أما فيكس، فقد اعتقل السيد فوج لأن ذلك كان واجبه، سواء أكان السيد فوج مذنبًا أم بريئًا.",
  "أدرك باسبارتو فجأة أنه سبب هذه المصيبة الجديدة! ألم يُخفِ عن سيده مهمة فيكس؟ وحين كشف فيكس عن حقيقته وغرضه، لماذا لم يخبر السيد فوج؟ لو حُذّر فوج، لأثبت على الأرجح براءته وأقنع فيكس بخطئه؛ ولما واصل المحقق رحلته على نفقة سيده مقتفيًا أثره، فقط ليعتقله لحظة تطأ قدماه أرض إنجلترا. بكى باسبارتو حتى كاد يعمى، واستولى عليه يأس شديد جعله يتمنى لو ينهي حياته.",
  "ظلّت أودا وباسبارتو، رغم البرد، تحت رواق دار الجمارك. لم يرغب أيٌّ منهما في مغادرة المكان؛ فقد كانا يتوقان إلى رؤية السيد فوج مرة أخرى.",
  "كان ذلك الرجل قد خسر كل شيء فعلًا، وفي اللحظة نفسها التي أوشك فيها على بلوغ غايته. كان الاعتقال ضربة قاضية. فقد وصل إلى ليفربول في الحادية عشرة وأربعين دقيقة من صباح الحادي والعشرين من ديسمبر، وكان أمامه حتى الثامنة وخمس وأربعين دقيقة مساءً ليبلغ نادي الإصلاح؛ أي تسع ساعات وخمس عشرة دقيقة، مع أن الرحلة من ليفربول إلى لندن تستغرق ست ساعات.",
  "لو دخل أحد دار الجمارك في تلك اللحظة، لرأى السيد فوج جالسًا على مقعد خشبي، ساكنًا هادئًا لا يبدو عليه الغضب. لم يكن مستسلمًا حقًا، لكن الضربة الأخيرة لم تنتزع منه أي انفعال ظاهر. أكانت نيران غضب خفي تلتهمه، تزداد رهبة لأنها مكبوتة ولا تنفجر إلا في اللحظة الأخيرة بقوة لا تُقاوم؟ لم يستطع أحد أن يعرف. ظل جالسًا ينتظر بهدوء—لكن ماذا ينتظر؟ أكان لا يزال يتشبث بالأمل؟ وهل بقي يعتقد أنه سينجح بعدما أُغلق باب السجن عليه؟",
  "ومهما يكن، وضع السيد فوج ساعته بعناية على الطاولة وراح يراقب عقاربها المتقدمة. لم تفلت من شفتيه كلمة، لكن نظرته بدت حازمة صارمة على نحو لافت. كان الموقف فادحًا: إن كان فيلياس فوج نزيهًا فقد انتهى أمره، وإن كان محتالًا فقد أُمسك به.",
  "هل خطرت له فكرة الهرب؟ هل بحث عن مخرج عملي من سجنه؟ هل فكّر في الفرار؟ ربما؛ فقد دار مرة ببطء في الغرفة. لكن الباب كان مقفلًا والنافذة محصنة بقضبان حديدية ثقيلة. عاد فجلس وأخرج دفتر يومياته. عند السطر الذي كتب فيه «السبت، 21 ديسمبر، ليفربول»، أضاف: «اليوم الثمانون، 11:40 صباحًا»، ثم انتظر.",
  "دقّت ساعة دار الجمارك معلنة الواحدة. ولاحظ السيد فوج أن ساعته تسبق الوقت الحقيقي بساعتين.",
  "ساعتان! لو كان يستقل في تلك اللحظة قطارًا سريعًا، لأمكنه الوصول إلى لندن ونادي الإصلاح قبل التاسعة إلا ربعًا مساءً. وانعقد حاجباه قليلًا.",
  "عند الثانية وثلاث وثلاثين دقيقة، سمع صوتًا غريبًا في الخارج، ثم سمع أبوابًا تُفتح على عجل. وصل إليه صوت باسبارتو، وتلاه فورًا صوت فيكس. ولمعت عينا فيلياس فوج للحظة.",
  "انفتح الباب فجأة، فرأى باسبارتو وأودا وفيكس يسرعون نحوه.",
  "كان فيكس يلهث وشعره أشعث، ولم يستطع الكلام. تمتم: «سيدي... سامحني... تشابه مؤسف للغاية... قُبض على اللص قبل ثلاثة أيام... أنت حر!»",
  "أصبح فيلياس فوج حرًا! تقدّم نحو المحقق وحدّق في وجهه بثبات، ثم نفّذ الحركة السريعة الوحيدة التي فعلها في حياته، وربما سيفعلها قط: أرجع ذراعيه إلى الخلف، ثم وجّه إلى فيكس لكمة دقيقة كأنها صادرة عن آلة فأسقطته أرضًا.",
  "«ضربة موفقة!» صاح باسبارتو. «يا للعجب! هذه هي اللكمات الإنجليزية التي يُعتدّ بها!»",
  "لم ينبس فيكس، الذي وجد نفسه على الأرض، بكلمة. لقد نال ما يستحقه. وغادر السيد فوج وأودا وباسبارتو دار الجمارك بلا تأخير، واستقلوا عربة أجرة، ثم نزلوا بعد دقائق عند المحطة.",
  "سأل فيلياس فوج إن كان هناك قطار سريع يستعد للمغادرة إلى لندن. كانت الساعة الثانية وأربعين دقيقة، لكن القطار السريع انطلق قبل خمس وثلاثين دقيقة. لذلك أمر فوج بتجهيز قطار خاص.",
  "كانت هناك عدة قاطرات سريعة جاهزة، لكن ترتيبات السكك الحديدية لم تسمح للقطار الخاص بالمغادرة قبل الساعة الثالثة.",
  "في تلك الساعة انطلق فيلياس فوج نحو لندن مع أودا وخادمه الوفي، بعدما حفّز المهندس بوعده بمكافأة سخية.",
  "كان لا بد من قطع الرحلة في خمس ساعات ونصف؛ وكان ذلك سهلًا لو ظل الطريق مفتوحًا طوال الوقت. لكن تأخيرات قسرية وقعت، وحين نزل السيد فوج من القطار في المحطة النهائية، كانت كل ساعات لندن تشير إلى العاشرة إلا عشر دقائق.",
  "بعد أن طاف حول العالم، كان متأخرًا خمس دقائق. لقد خسر الرهان!"
];
if(english.length!==22||arabic.length!==english.length)throw Error('Towle XXXIV bilingual paragraph alignment mismatch');
const terms=[
  {
    "term": "thunderstruck",
    "literal": "مصدوم بشدة",
    "context": "Aouda was thunderstruck at the suddenness",
    "note": "Chapter XXXIV: arrest and release",
    "type": "word"
  },
  {
    "term": "heinous a charge",
    "literal": "اتهام فظيع",
    "context": "her heart revolted against so heinous a charge",
    "note": "Chapter XXXIV: moral outrage",
    "type": "phrase"
  },
  {
    "term": "concealed",
    "literal": "أخفى",
    "context": "concealed Fix’s errand from his master",
    "note": "Chapter XXXIV: missed warning",
    "type": "word"
  },
  {
    "term": "at the expense and on the heels of his master",
    "literal": "على نفقة سيده مقتفيًا أثره",
    "context": "Fix continued his journey at the expense and on the heels of his master",
    "note": "Chapter XXXIV: idiomatic pursuit",
    "type": "idiom"
  },
  {
    "term": "attain his end",
    "literal": "يبلغ غايته",
    "context": "the moment when he was about to attain his end",
    "note": "Chapter XXXIV: deadline",
    "type": "phrase"
  },
  {
    "term": "fatal",
    "literal": "كارثيّ / ضربة قاصمة",
    "context": "This arrest was fatal",
    "note": "Chapter XXXIV: decisive setback",
    "type": "word"
  },
  {
    "term": "resigned",
    "literal": "مستسلم للأمر الواقع",
    "context": "He was not, it is true, resigned",
    "note": "Chapter XXXIV: restrained emotion",
    "type": "word"
  },
  {
    "term": "outward betrayal",
    "literal": "انكشاف ظاهر",
    "context": "an outward betrayal of any emotion",
    "note": "Chapter XXXIV: controlled expression",
    "type": "phrase"
  },
  {
    "term": "cherish hope",
    "literal": "يتمسّك بالأمل",
    "context": "Did he still cherish hope?",
    "note": "Chapter XXXIV: uncertainty",
    "type": "phrase"
  },
  {
    "term": "knave",
    "literal": "محتال",
    "context": "if he was a knave, he was caught",
    "note": "Chapter XXXIV: moral contrast",
    "type": "word"
  },
  {
    "term": "practicable outlet",
    "literal": "مخرج يمكن استخدامه",
    "context": "any practicable outlet from his prison",
    "note": "Chapter XXXIV: escape vocabulary",
    "type": "phrase"
  },
  {
    "term": "stammered",
    "literal": "تلعثم",
    "context": "he stammered, sir—forgive me",
    "note": "Chapter XXXIV: speech under stress",
    "type": "word"
  },
  {
    "term": "precision of a machine",
    "literal": "بدقة الآلة",
    "context": "with the precision of a machine knocked Fix down",
    "note": "Chapter XXXIV: exact movement",
    "type": "phrase"
  },
  {
    "term": "received his deserts",
    "literal": "نال ما يستحقه",
    "context": "He had only received his deserts",
    "note": "Chapter XXXIV: idiom",
    "type": "idiom"
  },
  {
    "term": "special train",
    "literal": "قطار خاص",
    "context": "Phileas Fogg then ordered a special train",
    "note": "Chapter XXXIV: railway travel",
    "type": "phrase"
  },
  {
    "term": "on hand",
    "literal": "متاح / جاهز",
    "context": "several rapid locomotives on hand",
    "note": "Chapter XXXIV: availability",
    "type": "phrase"
  },
  {
    "term": "generous reward",
    "literal": "مكافأة سخية",
    "context": "the offer of a generous reward",
    "note": "Chapter XXXIV: incentive",
    "type": "phrase"
  },
  {
    "term": "forced delays",
    "literal": "تأخيرات اضطرارية",
    "context": "there were forced delays",
    "note": "Chapter XXXIV: travel obstacle",
    "type": "phrase"
  },
  {
    "term": "behindhand",
    "literal": "متأخر عن الموعد",
    "context": "he was behindhand five minutes",
    "note": "Chapter XXXIV: timekeeping",
    "type": "word"
  },
  {
    "term": "wager",
    "literal": "رهان",
    "context": "He had lost the wager",
    "note": "Chapter XXXIV: central plot term",
    "type": "word"
  }
];
const body=english.join(' ');
for(const t of terms)if(!body.toLowerCase().includes(t.term.toLowerCase()))throw Error('Towle XXXIV contextual glossary term absent: '+t.term);
if(arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXIV Arabic draft missing');
s.chapters.push({title:'In which Phileas Fogg at last reaches London.',titleAr:'الفصل الرابع والثلاثون — حيث يصل فيلياس فوج إلى لندن أخيرًا',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXIV';
s.description='Fogg is released, orders a special train, and reaches London five minutes too late.';
s.editorialStatus='English Chapters I–XXXIV source-transcribed; Arabic draft pending independent review; 34 of 37 chapters';
s.provenance+=' Chapter XXXIV: Standard Ebooks Towle transcription (source blob d78ec1d3014c2bb027c60645be33e0c0331ea7d3; CC0 editorial edition; territory-specific rights pending review).';
})(window);
