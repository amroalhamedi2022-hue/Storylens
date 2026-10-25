/* Lingua Tales — Towle Chapter VII, source-aligned bilingual batch.
 * English: Jules Verne / George Makepeace Towle (1873); Standard Ebooks CC0 editorial XHTML.
 * Arabic: companion draft; independent literary review and territory rights pending.
 * Source XHTML SHA-256: 02d79d84d624a78dc6ac239e8a565ea001cd5fa1559014479c09a18b99cfb836
 * https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-7.xhtml
 */
(function(global){
'use strict';
const story=(global.StoryLensEditorialStories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
if(!story||story.chapters.length!==6)throw Error('Towle chapter VII load order mismatch');
story.chapters.push({
 title:'Which once more demonstrates the uselessness of passports as aids to detectives',
 titleAr:'فيه يتأكد مجددًا أن جوازات السفر لا تفيد المحققين',
 paragraphs:[
  {
    "en": "The detective passed down the quay, and rapidly made his way to the consul’s office, where he was at once admitted to the presence of that official.",
    "ar": "مضى المحقق على الرصيف مسرعًا إلى مكتب القنصل، حيث سُمح له فورًا بمقابلة المسؤول."
  },
  {
    "en": "“Consul,” said he, without preamble, “I have strong reasons for believing that my man is a passenger on the Mongolia.” And he narrated what had just passed concerning the passport.",
    "ar": "قال بلا مقدمات: «يا سعادة القنصل، لدي أسباب قوية تجعلني أعتقد أن الرجل الذي أبحث عنه راكب على متن منغوليا». ثم روى له ما حدث بشأن جواز السفر."
  },
  {
    "en": "“Well, Mr. Fix,” replied the consul, “I shall not be sorry to see the rascal’s face; but perhaps he won’t come here⁠—that is, if he is the person you suppose him to be. A robber doesn’t quite like to leave traces of his flight behind him; and, besides, he is not obliged to have his passport countersigned.”",
    "ar": "أجاب القنصل: «حسنًا يا سيد فيكس، لن أمانع رؤية وجه ذلك المحتال؛ لكنه ربما لن يأتي إلى هنا، إن كان أصلًا الشخص الذي تظنه. فاللص لا يحب أن يترك آثار هروبه وراءه، وفوق ذلك ليس ملزمًا بأن يصدّق أحدٌ جواز سفره بتوقيع إضافي»."
  },
  {
    "en": "“If he is as shrewd as I think he is, consul, he will come.”",
    "ar": "قال فيكس: «إذا كان داهية كما أعتقد يا سعادة القنصل، فسيأتي»."
  },
  {
    "en": "“To have his passport visaed?”",
    "ar": "«ليضع تأشيرة على جوازه؟»"
  },
  {
    "en": "“Yes. Passports are only good for annoying honest folks, and aiding in the flight of rogues. I assure you it will be quite the thing for him to do; but I hope you will not visa the passport.”",
    "ar": "«نعم. جوازات السفر لا تفعل سوى إزعاج الشرفاء ومساعدة الأوغاد على الفرار. أؤكد لك أن هذا بالضبط ما سيفعله، لكنني أرجو ألا تضع التأشيرة على الجواز»."
  },
  {
    "en": "“Why not? If the passport is genuine I have no right to refuse.”",
    "ar": "«ولماذا؟ إذا كان الجواز أصليًا، فلا يحق لي أن أرفض»."
  },
  {
    "en": "“Still, I must keep this man here until I can get a warrant to arrest him from London.”",
    "ar": "«ومع ذلك، يجب أن أبقي هذا الرجل هنا إلى أن أحصل من لندن على مذكرة توقيف»."
  },
  {
    "en": "“Ah, that’s your lookout. But I cannot⁠—”",
    "ar": "«آه، تلك مسؤوليتك أنت. لكنني لا أستطيع—»"
  },
  {
    "en": "The consul did not finish his sentence, for as he spoke a knock was heard at the door, and two strangers entered, one of whom was the servant whom Fix had met on the quay. The other, who was his master, held out his passport with the request that the consul would do him the favour to visa it. The consul took the document and carefully read it, whilst Fix observed, or rather devoured, the stranger with his eyes from a corner of the room.",
    "ar": "لم يُكمل القنصل عبارته؛ إذ سُمع طرق على الباب ودخل غريبان. كان أحدهما الخادم الذي قابله فيكس على الرصيف، أما الآخر، سيده، فمدّ جواز سفره طالبًا من القنصل التكرم بوضع التأشيرة عليه. أخذ القنصل الوثيقة وقرأها بعناية، بينما كان فيكس يراقب الغريب من زاوية الغرفة، بل يلتهمه بعينيه."
  },
  {
    "en": "“You are Mr. Phileas Fogg?” said the consul, after reading the passport.",
    "ar": "سأل القنصل بعد قراءة الجواز: «أأنت السيد فيلياس فوغ؟»"
  },
  {
    "en": "“I am.”",
    "ar": "«أنا هو»."
  },
  {
    "en": "“And this man is your servant?”",
    "ar": "«وهذا الرجل خادمك؟»"
  },
  {
    "en": "“He is: a Frenchman, named Passepartout.”",
    "ar": "«نعم، إنه فرنسي يُدعى باسبارتو»."
  },
  {
    "en": "“You are from London?”",
    "ar": "«أنت قادم من لندن؟»"
  },
  {
    "en": "“Yes.”",
    "ar": "«نعم»."
  },
  {
    "en": "“And you are going⁠—”",
    "ar": "«ووجهتك هي—»"
  },
  {
    "en": "“To Bombay.”",
    "ar": "«بومباي»."
  },
  {
    "en": "“Very good, sir. You know that a visa is useless, and that no passport is required?”",
    "ar": "«حسنًا يا سيدي. أتعلم أن التأشيرة لا فائدة منها، وأنك لا تحتاج إلى جواز سفر؟»"
  },
  {
    "en": "“I know it, sir,” replied Phileas Fogg; “but I wish to prove, by your visa, that I came by Suez.”",
    "ar": "أجاب فيلياس فوغ: «أعلم ذلك يا سيدي، لكنني أريد أن تثبت تأشيرتك أنني مررت بالسويس»."
  },
  {
    "en": "“Very well, sir.”",
    "ar": "«حسنًا يا سيدي»."
  },
  {
    "en": "The consul proceeded to sign and date the passport, after which he added his official seal. Mr. Fogg paid the customary fee, coldly bowed, and went out, followed by his servant.",
    "ar": "وقّع القنصل جواز السفر ودوّن التاريخ، ثم أضاف ختمه الرسمي. دفع السيد فوغ الرسوم المعتادة، وانحنى ببرود وغادر، يتبعه خادمه."
  },
  {
    "en": "“Well?” queried the detective.",
    "ar": "سأل المحقق: «حسنًا؟»"
  },
  {
    "en": "“Well, he looks and acts like a perfectly honest man,” replied the consul.",
    "ar": "أجاب القنصل: «حسنًا، يبدو الرجل ويتصرف كما لو كان شريفًا تمامًا»."
  },
  {
    "en": "“Possibly; but that is not the question. Do you think, consul, that this phlegmatic gentleman resembles, feature by feature, the robber whose description I have received?”",
    "ar": "قال فيكس: «ربما، لكن هذا ليس موضع السؤال. هل ترى يا سعادة القنصل أن هذا الرجل الهادئ يشبه، سمةً بسمة، اللص الذي وصلني وصفه؟»"
  },
  {
    "en": "“I concede that; but then, you know, all descriptions⁠—”",
    "ar": "«أقرّ بذلك، لكنك تعلم أن كل الأوصاف—»"
  },
  {
    "en": "“I’ll make certain of it,” interrupted Fix. “The servant seems to me less mysterious than the master; besides, he’s a Frenchman, and can’t help talking. Excuse me for a little while, consul.”",
    "ar": "قاطعه فيكس: «سأتحقق من الأمر بنفسي. يبدو الخادم أقل غموضًا من سيده؛ ثم إنه فرنسي، ولا يستطيع منع نفسه من الكلام. اعذرني قليلًا يا سعادة القنصل»."
  },
  {
    "en": "Fix started off in search of Passepartout.",
    "ar": "انطلق فيكس بحثًا عن باسبارتو."
  },
  {
    "en": "Meanwhile Mr. Fogg, after leaving the consulate, repaired to the quay, gave some orders to Passepartout, went off to the Mongolia in a boat, and descended to his cabin. He took up his notebook, which contained the following memoranda:",
    "ar": "في هذه الأثناء، عاد السيد فوغ بعد مغادرة القنصلية إلى الرصيف، وأعطى باسبارتو بعض التعليمات، ثم استقل قاربًا إلى منغوليا ونزل إلى مقصورته. وأخرج دفتر ملاحظاته الذي احتوى على السجلات التالية:"
  },
  {
    "en": "“Left London, Wednesday, October 2nd, at 8:45 p.m.",
    "ar": "«غادرت لندن، الأربعاء الثاني من أكتوبر، الساعة 8:45 مساءً»."
  },
  {
    "en": "“Reached Paris, Thursday, October 3rd, at 7:20 a.m.",
    "ar": "«وصلت باريس، الخميس الثالث من أكتوبر، الساعة 7:20 صباحًا»."
  },
  {
    "en": "“Left Paris, Thursday, at 8:40 a.m.",
    "ar": "«غادرت باريس، الخميس، الساعة 8:40 صباحًا»."
  },
  {
    "en": "“Reached Turin by Mont Cenis, Friday, October 4th, at 6:35 a.m.",
    "ar": "«وصلت تورينو عبر مون سيني، الجمعة الرابع من أكتوبر، الساعة 6:35 صباحًا»."
  },
  {
    "en": "“Left Turin, Friday, at 7:20 a.m.",
    "ar": "«غادرت تورينو، الجمعة، الساعة 7:20 صباحًا»."
  },
  {
    "en": "“Arrived at Brindisi, Saturday, October 5th, at 4 p.m.",
    "ar": "«وصلت برينديزي، السبت الخامس من أكتوبر، الساعة الرابعة مساءً»."
  },
  {
    "en": "“Sailed on the Mongolia, Saturday, at 5 p.m.",
    "ar": "«أبحرت على متن منغوليا، السبت، الساعة الخامسة مساءً»."
  },
  {
    "en": "“Reached Suez, Wednesday, October 9th, at 11 a.m.",
    "ar": "«وصلت السويس، الأربعاء التاسع من أكتوبر، الساعة الحادية عشرة صباحًا»."
  },
  {
    "en": "“Total of hours spent, 158+; or, in days, six days and a half.”",
    "ar": "«إجمالي الوقت المستغرق: أكثر من 158 ساعة، أي ستة أيام ونصف»."
  },
  {
    "en": "These dates were inscribed in an itinerary divided into columns, indicating the month, the day of the month, and the day for the stipulated and actual arrivals at each principal point Paris, Brindisi, Suez, Bombay, Calcutta, Singapore, Hong Kong, Yokohama, San Francisco, New York, and London⁠—from the 2nd of October to the 21st of December; and giving a space for setting down the gain made or the loss suffered on arrival at each locality. This methodical record thus contained an account of everything needed, and Mr. Fogg always knew whether he was behindhand or in advance of his time. On this Friday, October 9th, he noted his arrival at Suez, and observed that he had as yet neither gained nor lost. He sat down quietly to breakfast in his cabin, never once thinking of inspecting the town, being one of those Englishmen who are wont to see foreign countries through the eyes of their domestics.",
    "ar": "كانت هذه التواريخ مسجلة في جدول ذي أعمدة للشهر واليوم ومواعيد الوصول المحددة والفعلية إلى المدن الرئيسية: باريس وبرينديزي والسويس وبومباي وكلكتا وسنغافورة وهونغ كونغ ويوكوهاما وسان فرانسيسكو ونيويورك ولندن، من الثاني من أكتوبر حتى الحادي والعشرين من ديسمبر، مع خانة لتسجيل الوقت المكتسب أو المفقود عند الوصول إلى كل مكان. وقد جمع هذا السجل المنظم كل ما يحتاج إليه فوغ، فكان يعرف دائمًا إن كان متأخرًا عن موعده أم متقدمًا عليه. وفي يوم الجمعة التاسع من أكتوبر، دوّن وصوله إلى السويس ولاحظ أنه لم يكسب وقتًا ولم يخسره بعد. ثم جلس بهدوء ليتناول إفطاره في مقصورته، من غير أن يفكر في زيارة المدينة؛ فقد كان من أولئك الإنجليز الذين اعتادوا رؤية البلدان الأجنبية من خلال أعين خدمهم."
  }
]
});
story.terms.push(...[
  {
    "term": "without preamble",
    "literal": "من دون مقدمات",
    "context": "طريقة فيكس المباشرة في بدء الحديث",
    "type": "phrase",
    "note": "Without any introductory remarks."
  },
  {
    "term": "leave traces of his flight",
    "literal": "يترك آثار هروبه",
    "context": "حجة القنصل بشأن جواز السفر",
    "type": "idiom",
    "note": "Leave evidence that reveals how someone escaped."
  },
  {
    "term": "countersigned",
    "literal": "موقّع عليه من جهة ثانية",
    "context": "الإجراء الذي يناقشه فيكس والقنصل",
    "type": "verb",
    "note": "Signed additionally by another authorized person."
  },
  {
    "term": "as shrewd as I think he is",
    "literal": "بالدهاء الذي أظنه عليه",
    "context": "توقع فيكس لسلوك المشتبه به",
    "type": "phrase",
    "note": "As clever and calculating as expected."
  },
  {
    "term": "passport visaed",
    "literal": "جواز مختوم بتأشيرة",
    "context": "السؤال عن التصديق القنصلي",
    "type": "phrase",
    "note": "A passport bearing an official visa."
  },
  {
    "term": "no right to refuse",
    "literal": "لا يحق لي الرفض",
    "context": "تبرير القنصل لإجراء التأشيرة",
    "type": "phrase",
    "note": "Having no legitimate basis to say no."
  },
  {
    "term": "warrant to arrest",
    "literal": "مذكرة توقيف",
    "context": "ما يحتاجه فيكس من لندن",
    "type": "legal phrase",
    "note": "An official authorization to arrest someone."
  },
  {
    "term": "your lookout",
    "literal": "مسؤوليتك أنت",
    "context": "رد القنصل على طلب فيكس",
    "type": "idiom",
    "note": "Something that is your own responsibility."
  },
  {
    "term": "admitted to the presence",
    "literal": "أُذن له بالمثول أمام",
    "context": "وصول فيكس إلى مكتب القنصل",
    "type": "formal phrase",
    "note": "Allowed to meet an official or important person."
  },
  {
    "term": "devoured the stranger with his eyes",
    "literal": "التهم الغريب بنظراته",
    "context": "مبالغة تصف مراقبة فيكس لفوغ",
    "type": "figurative phrase",
    "note": "Watched someone with intense, consuming attention."
  },
  {
    "term": "official seal",
    "literal": "الختم الرسمي",
    "context": "توثيق جواز فوغ",
    "type": "noun phrase",
    "note": "An authorized stamp confirming a document."
  },
  {
    "term": "customary fee",
    "literal": "الرسم المعتاد",
    "context": "المبلغ الذي دفعه فوغ",
    "type": "collocation",
    "note": "The standard charge for a service."
  },
  {
    "term": "coldly bowed",
    "literal": "انحنى ببرود",
    "context": "تصرف فوغ عند مغادرة القنصلية",
    "type": "phrase",
    "note": "Bowed in a detached, unemotional manner."
  },
  {
    "term": "perfectly honest man",
    "literal": "رجل شريف تمامًا",
    "context": "انطباع القنصل عن فوغ",
    "type": "phrase",
    "note": "Someone who appears completely trustworthy."
  },
  {
    "term": "feature by feature",
    "literal": "سمةً بسمة",
    "context": "مقارنة فيكس بين فوغ ووصف اللص",
    "type": "idiom",
    "note": "Comparing individual physical characteristics."
  },
  {
    "term": "make certain of it",
    "literal": "يتأكد من الأمر",
    "context": "قرار فيكس بملاحقة باسبارتو",
    "type": "phrase",
    "note": "To verify something rather than guess."
  },
  {
    "term": "descended to his cabin",
    "literal": "نزل إلى مقصورته",
    "context": "عودة فوغ إلى السفينة",
    "type": "verb phrase",
    "note": "Went down into the private cabin aboard a ship."
  },
  {
    "term": "behindhand",
    "literal": "متأخر عن الموعد",
    "context": "ملاحظة فوغ في دفتر الرحلة",
    "type": "adverb",
    "note": "Behind the scheduled time."
  },
  {
    "term": "in advance of his time",
    "literal": "متقدم على موعده",
    "context": "طريقة فوغ في متابعة الجدول",
    "type": "phrase",
    "note": "Earlier than the expected schedule."
  }
]);
story.totalChapters=37;
story.subtitle='The original Towle translation — Chapters I–VII';
story.description='At the Suez consulate, Fix watches Fogg secure a passport visa while recording a precise itinerary. Seven authentic chapters; the journey continues.';
story.editorialStatus='English Chapters I–VII source-checked; Arabic draft pending independent review; 7 of 37 chapters';
story.provenance+=' Chapter VII: Standard Ebooks Towle transcription (CC0 editorial edition); territory rights pending review.';
})(window);
