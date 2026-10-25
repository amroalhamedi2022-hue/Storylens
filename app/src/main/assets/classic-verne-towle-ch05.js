/* Lingua Tales — complete Towle Chapter V (14 source paragraphs, including the Suez telegram).
 * English: Jules Verne / George Makepeace Towle (1873), Standard Ebooks CC0 transcription.
 * https://raw.githubusercontent.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/master/src/epub/text/chapter-5.xhtml
 * Arabic companion is a new draft; independent literary review and territory rights remain open.
 */
(function(global){
'use strict';
const story=(global.StoryLensEditorialStories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
if(!story||story.chapters.length!==4)throw Error('Towle chapter V load order mismatch');
story.chapters.push({
 title:"In Which a New Species of Funds, Unknown to the Moneyed Men, Appears on ’Change",
 titleAr:"فيه يظهر في البورصة نوع جديد من الأوراق المالية يجهله أهل المال",
 paragraphs:[
  {
    "en": "Phileas Fogg rightly suspected that his departure from London would create a lively sensation at the West End. The news of the bet spread through the Reform Club, and afforded an exciting topic of conversation to its members. From the club it soon got into the papers throughout England. The boasted “tour of the world” was talked about, disputed, argued with as much warmth as if the subject were another Alabama claim. Some took sides with Phileas Fogg, but the large majority shook their heads and declared against him; it was absurd, impossible, they declared, that the tour of the world could be made, except theoretically and on paper, in this minimum of time, and with the existing means of travelling. The Times, Standard, Morning Post, and Daily News, and twenty other highly respectable newspapers scouted Mr. Fogg’s project as madness; the Daily Telegraph alone hesitatingly supported him. People in general thought him a lunatic, and blamed his Reform Club friends for having accepted a wager which betrayed the mental aberration of its proposer.",
    "ar": "كان فيلياس فوغ محقًا في توقع أن مغادرته لندن ستثير ضجة كبيرة في الطرف الغربي من المدينة. انتشر خبر الرهان في نادي الإصلاح، وأصبح موضوعًا مثيرًا لأحاديث أعضائه. وسرعان ما تناقلت الصحف في أنحاء إنجلترا الخبر. وأخذ الناس يتحدثون عن «الطواف حول العالم» المزعوم، ويجادلون فيه بحماسة كأنهم يناقشون قضية ألاباما. أيد بعضهم فوغ، لكن الغالبية هزّت رؤوسها ورفضت فكرته؛ إذ رأوا أن إتمام الطواف في هذه المدة القصيرة، وبوسائل السفر المتاحة، أمر مستحيل إلا على الورق. ووصفت صحف مرموقة عديدة مشروعه بالجنون، ولم تؤيده بتردد إلا صحيفة ديلي تلغراف. أما عامة الناس فظنوه مختل العقل، ولاموا أصدقاءه في نادي الإصلاح لقبول رهان يكشف، في نظرهم، اضطراب صاحبه."
  },
  {
    "en": "Articles no less passionate than logical appeared on the question, for geography is one of the pet subjects of the English; and the columns devoted to Phileas Fogg’s venture were eagerly devoured by all classes of readers. At first some rash individuals, principally of the gentler sex, espoused his cause, which became still more popular when the Illustrated London News came out with his portrait, copied from a photograph in the Reform Club. A few readers of the Daily Telegraph even dared to say, “Why not, after all? Stranger things have come to pass.”",
    "ar": "ظهرت مقالات لا تقل حماسة عن منطقها في مناقشة القضية، فالجغرافيا من الموضوعات المفضلة لدى الإنجليز، وكانت جميع فئات القراء تلتهم بشغف الأعمدة المخصصة لمغامرة فوغ. وفي البداية، دافع عن فكرته بعض المتحمسين، ومعظمهم من النساء، وازدادت شعبيتها عندما نشرت صحيفة إلوستريتد لندن نيوز صورته المأخوذة من صورة فوتوغرافية في نادي الإصلاح. بل تجرأ بعض قراء ديلي تلغراف على القول: «ولمَ لا، في نهاية المطاف؟ لقد حدثت أمور أغرب من ذلك»."
  },
  {
    "en": "At last a long article appeared, on the 7th of October, in the bulletin of the Royal Geographical Society, which treated the question from every point of view, and demonstrated the utter folly of the enterprise.",
    "ar": "وأخيرًا، نُشر في السابع من أكتوبر مقال مطوّل في نشرة الجمعية الملكية الجغرافية، تناول المسألة من جميع جوانبها وبرهن، بحسب رأيه، على الحماقة التامة لهذه المغامرة."
  },
  {
    "en": "Everything, it said, was against the travellers, every obstacle imposed alike by man and by nature. A miraculous agreement of the times of departure and arrival, which was impossible, was absolutely necessary to his success. He might, perhaps, reckon on the arrival of trains at the designated hours, in Europe, where the distances were relatively moderate; but when he calculated upon crossing India in three days, and the United States in seven, could he rely beyond misgiving upon accomplishing his task? There were accidents to machinery, the liability of trains to run off the line, collisions, bad weather, the blocking up by snow⁠—were not all these against Phileas Fogg? Would he not find himself, when travelling by steamer in winter, at the mercy of the winds and fogs? Is it uncommon for the best ocean steamers to be two or three days behind time? But a single delay would suffice to fatally break the chain of communication; should Phileas Fogg once miss, even by an hour; a steamer, he would have to wait for the next, and that would irrevocably render his attempt vain.",
    "ar": "وجاء في المقال أن كل شيء يقف ضد المسافرين، من العقبات التي يفرضها البشر إلى ما تفرضه الطبيعة. وكان نجاح فوغ يتطلب توافقًا خارقًا، بل مستحيلًا، بين مواعيد المغادرة والوصول. ربما أمكنه الاعتماد على القطارات الأوروبية التي تسير بين مسافات متقاربة نسبيًا، لكن هل يستطيع ضمان عبور الهند في ثلاثة أيام والولايات المتحدة في سبعة؟ فقد تتعطل الآلات، أو تنحرف القطارات عن مسارها، أو تقع التصادمات، أو يسوء الطقس، أو يسد الثلج الطريق. أليست كل هذه المخاطر ضده؟ ألن يصبح، حين يسافر بالبواخر في الشتاء، تحت رحمة الرياح والضباب؟ أليس من المعتاد أن تتأخر أفضل البواخر العابرة للمحيطات يومين أو ثلاثة؟ وكان يكفي تأخير واحد ليقطع سلسلة المواصلات كلها؛ فإذا فات فوغ موعد باخرة، ولو بساعة واحدة، لاضطر إلى انتظار التالية، وعندها ستفشل محاولته نهائيًا."
  },
  {
    "en": "This article made a great deal of noise, and, being copied into all the papers, seriously depressed the advocates of the rash tourist.",
    "ar": "أثار المقال ضجة كبيرة، ولما أعادت الصحف نشره، أحبط بشدة مؤيدي المسافر المتهور."
  },
  {
    "en": "Everybody knows that England is the world of betting men, who are of a higher class than mere gamblers; to bet is in the English temperament. Not only the members of the Reform, but the general public, made heavy wagers for or against Phileas Fogg, who was set down in the betting books as if he were a racehorse. Bonds were issued, and made their appearance on ’Change; “Phileas Fogg bonds” were offered at par or at a premium, and a great business was done in them. But five days after the article in the bulletin of the Geographical Society appeared, the demand began to subside: “Phileas Fogg” declined. They were offered by packages, at first of five, then of ten, until at last nobody would take less than twenty, fifty, a hundred!",
    "ar": "يعرف الجميع أن إنجلترا موطن المراهنين، وهم في نظر النص أرفع شأنًا من المقامرين العاديين؛ فالمراهنة جزء من الطبع الإنجليزي. ولم يقتصر الرهان على أعضاء نادي الإصلاح، بل شارك عامة الناس بمبالغ كبيرة مؤيدين فوغ أو معارضين له، وسُجّل اسمه في دفاتر المراهنات كما لو كان حصان سباق. وأُصدرت سندات وظهرت في البورصة، وعُرضت «سندات فيلياس فوغ» بالقيمة الاسمية أو بسعر أعلى، وازدهرت تجارتها. لكن بعد خمسة أيام من نشر مقال الجمعية الجغرافية بدأ الطلب يتراجع، وانخفضت قيمة «فوغ». وصاروا يعرضون السندات في حزم من خمس ثم عشر، حتى لم يعد أحد يقبل شراء أقل من عشرين أو خمسين أو مئة!"
  },
  {
    "en": "Lord Albemarle, an elderly paralytic gentleman, was now the only advocate of Phileas Fogg left. This noble lord, who was fastened to his chair, would have given his fortune to be able to make the tour of the world, if it took ten years; and he bet five thousand pounds on Phileas Fogg. When the folly as well as the uselessness of the adventure was pointed out to him, he contented himself with replying, “If the thing is feasible, the first to do it ought to be an Englishman.”",
    "ar": "لم يبقَ من مؤيدي فوغ سوى اللورد ألبمارل، وهو رجل مسنّ مصاب بالشلل. كان هذا اللورد المقعد على كرسيه مستعدًا للتخلي عن ثروته لو استطاع القيام بالطواف حول العالم، حتى لو استغرق عشر سنوات؛ وقد راهن بخمسة آلاف جنيه على فوغ. وحين أشاروا إليه بحماقة المغامرة وعديم جدواها، اكتفى بالرد: «إذا كان الأمر ممكنًا، فينبغي أن يكون أول من ينجزه إنجليزيًا»."
  },
  {
    "en": "The Fogg party dwindled more and more, everybody was going against him, and the bets stood a hundred and fifty and two hundred to one; and a week after his departure an incident occurred which deprived him of backers at any price.",
    "ar": "أخذ أنصار فوغ يتناقصون أكثر فأكثر، وانقلب الجميع ضده، حتى بلغت نسب المراهنة مئة وخمسين إلى واحد ثم مئتين إلى واحد. وبعد أسبوع من مغادرته، وقع حادث أفقده آخر من كان مستعدًا لدعمه مهما كان الثمن."
  },
  {
    "en": "The commissioner of police was sitting in his office at nine o’clock one evening, when the following telegraphic dispatch was put into his hands:",
    "ar": "كان مفوض الشرطة جالسًا في مكتبه عند التاسعة مساءً، حين وُضعت بين يديه البرقية التالية:"
  },
  {
    "en": "Suez to London.",
    "ar": "من السويس إلى لندن."
  },
  {
    "en": "Rowan, Commissioner of Police, Scotland Yard:",
    "ar": "إلى روان، مفوض الشرطة في سكوتلاند يارد:"
  },
  {
    "en": "I’ve found the bank robber, Phileas Fogg. Send without delay warrant of arrest to Bombay.",
    "ar": "عثرت على سارق البنك، فيلياس فوغ. أرسلوا مذكرة توقيف إلى بومباي دون تأخير."
  },
  {
    "en": "Fix, Detective.",
    "ar": "فيكس، المحقق."
  },
  {
    "en": "The effect of this dispatch was instantaneous. The polished gentleman disappeared to give place to the bank robber. His photograph, which was hung with those of the rest of the members at the Reform Club, was minutely examined, and it betrayed, feature by feature, the description of the robber which had been provided to the police. The mysterious habits of Phileas Fogg were recalled; his solitary ways, his sudden departure; and it seemed clear that, in undertaking a tour round the world on the pretext of a wager, he had had no other end in view than to elude the detectives, and throw them off his track.",
    "ar": "كان أثر البرقية فوريًا؛ فقد اختفت صورة الرجل المهذب لتحل محلها صورة سارق البنك. وفُحصت صورته المعلقة بين صور أعضاء نادي الإصلاح بدقة، فبدت ملامحه متطابقة مع وصف السارق الذي وصل إلى الشرطة. وتذكّر الناس عادات فوغ الغامضة، وانعزاله، ومغادرته المفاجئة؛ وبدا لهم أنه لم يقم برحلة حول العالم بحجة الرهان إلا ليفلت من المحققين ويضللهم عن أثره."
  }
]
});
story.terms.push(...[
  {
    "term": "lively sensation",
    "literal": "ضجة كبيرة",
    "context": "الأثر المتوقع لخبر مغادرة فوغ لندن",
    "type": "collocation",
    "note": "A strong public reaction or excitement."
  },
  {
    "term": "took sides with",
    "literal": "انحاز إلى",
    "context": "بعض الناس أيدوا فوغ في الرهان",
    "type": "phrase",
    "note": "To support one side in a disagreement."
  },
  {
    "term": "declared against him",
    "literal": "أعلنوا معارضتهم له",
    "context": "الغالبية رفضت إمكانية نجاح الرحلة",
    "type": "phrase",
    "note": "To state openly that one opposes someone."
  },
  {
    "term": "pet subjects",
    "literal": "الموضوعات المفضلة",
    "context": "الجغرافيا من الموضوعات التي يحب الإنجليز النقاش فيها",
    "type": "collocation",
    "note": "Topics someone particularly enjoys or knows well."
  },
  {
    "term": "espoused his cause",
    "literal": "دافعوا عن قضيته",
    "context": "قراء دافعوا عن فكرة فوغ في البداية",
    "type": "literary phrase",
    "note": "To support a cause or position publicly."
  },
  {
    "term": "come to pass",
    "literal": "يحدث أو يقع",
    "context": "الأمور الغريبة التي قد تقع بالفعل",
    "type": "idiom",
    "note": "To happen, especially after being uncertain."
  },
  {
    "term": "from every point of view",
    "literal": "من كل وجهة نظر",
    "context": "المقال درس الرحلة من جميع الجوانب",
    "type": "phrase",
    "note": "Considering all relevant perspectives."
  },
  {
    "term": "at the mercy of",
    "literal": "تحت رحمة",
    "context": "المسافر بالباخرة لا يسيطر على الرياح والضباب",
    "type": "idiom",
    "note": "Unable to control what affects you."
  },
  {
    "term": "break the chain of communication",
    "literal": "يقطع سلسلة المواصلات",
    "context": "تأخير واحد قد يفوّت الرحلة التالية",
    "type": "phrase",
    "note": "To disrupt a connected sequence of travel or contact."
  },
  {
    "term": "made a great deal of noise",
    "literal": "أثار ضجة كبيرة",
    "context": "انتشار المقال وتأثيره في الرأي العام",
    "type": "idiom",
    "note": "To attract much public attention or discussion."
  },
  {
    "term": "betting books",
    "literal": "دفاتر المراهنات",
    "context": "تسجيل الرهانات على نجاح فوغ",
    "type": "noun phrase",
    "note": "Records used to track wagers and odds."
  },
  {
    "term": "at par",
    "literal": "بالقيمة الاسمية",
    "context": "سعر سندات فوغ في البورصة",
    "type": "finance phrase",
    "note": "At the stated face value."
  },
  {
    "term": "at a premium",
    "literal": "بسعر أعلى من القيمة الاسمية",
    "context": "بيع بعض السندات بسعر مرتفع",
    "type": "finance phrase",
    "note": "At a price above face value."
  },
  {
    "term": "dwindled",
    "literal": "تضاءل تدريجيًا",
    "context": "تناقص عدد مؤيدي فوغ",
    "type": "verb",
    "note": "To become steadily smaller or fewer."
  },
  {
    "term": "backers",
    "literal": "المؤيدون أو الداعمون",
    "context": "الأشخاص المستعدون للمراهنة لصالح فوغ",
    "type": "noun",
    "note": "People who support a person or proposal."
  },
  {
    "term": "give place to",
    "literal": "يحل محل",
    "context": "الاشتباه بسارق البنك حل محل صورة الرجل المهذب",
    "type": "phrase",
    "note": "To be replaced by something else."
  },
  {
    "term": "on the pretext of",
    "literal": "بحجة",
    "context": "الشك في أن الرهان مجرد غطاء للهرب",
    "type": "phrase",
    "note": "Using a stated reason that may hide the real motive."
  },
  {
    "term": "throw them off his track",
    "literal": "يضللهم عن أثره",
    "context": "اعتقاد الشرطة أن فوغ يحاول الإفلات من المحققين",
    "type": "idiom",
    "note": "To mislead pursuers so they cannot follow you."
  }
]);
story.totalChapters=37;
story.subtitle='The original Towle translation — Chapters I–V';
story.description='Public opinion turns against Fogg after a newspaper critique, falling bond prices and a telegram from Suez cast suspicion on his journey. Five authentic chapters; the story continues.';
story.editorialStatus='English Chapters I–V source-checked; Arabic draft pending independent review; 5 of 37 chapters';
story.provenance+=' Chapter V: Standard Ebooks Towle transcription (CC0 editorial edition); territory rights pending review.';
})(window);
