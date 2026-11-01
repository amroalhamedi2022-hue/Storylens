/* Lingua Tales — authentic Towle Chapter XXXV from the pinned Standard Ebooks transcription.
 * Upstream commit: 56c82e97ff5d4f8950afca05b71af72688a8da34; source blob: 8a39e6eaa78e1c14cca130353697f307f55e48d0; src/epub/text/chapter-35.xhtml.
 * Standard Ebooks contributors dedicate editorial transcription/artwork to CC0; Towle's 1873 translation is treated as public domain in the USA.
 * Territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
 * 52 narrative paragraphs / 1573 English words; normalized English SHA-256: 3746f6d1389e415cec8a093d32fa5bf7e0feca5970ccad59f69bfbb50943820a.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==34)throw Error('Towle chapter XXXV load order mismatch');
const english=[
  "The dwellers in Saville Row would have been surprised the next day, if they had been told that Phileas Fogg had returned home. His doors and windows were still closed, no appearance of change was visible.",
  "After leaving the station, Mr. Fogg gave Passepartout instructions to purchase some provisions, and quietly went to his domicile.",
  "He bore his misfortune with his habitual tranquillity. Ruined! And by the blundering of the detective! After having steadily traversed that long journey, overcome a hundred obstacles, braved many dangers, and still found time to do some good on his way, to fail near the goal by a sudden event which he could not have foreseen, and against which he was unarmed; it was terrible! But a few pounds were left of the large sum he had carried with him. There only remained of his fortune the twenty thousand pounds deposited at Barings, and this amount he owed to his friends of the Reform Club. So great had been the expense of his tour that, even had he won, it would not have enriched him; and it is probable that he had not sought to enrich himself, being a man who rather laid wagers for honour’s sake than for the stake proposed. But this wager totally ruined him.",
  "Mr. Fogg’s course, however, was fully decided upon; he knew what remained for him to do.",
  "A room in the house in Saville Row was set apart for Aouda, who was overwhelmed with grief at her protector’s misfortune. From the words which Mr. Fogg dropped, she saw that he was meditating some serious project.",
  "Knowing that Englishmen governed by a fixed idea sometimes resort to the desperate expedient of suicide, Passepartout kept a narrow watch upon his master, though he carefully concealed the appearance of so doing.",
  "First of all, the worthy fellow had gone up to his room, and had extinguished the gas burner, which had been burning for eighty days. He had found in the letterbox a bill from the gas company, and he thought it more than time to put a stop to this expense, which he had been doomed to bear.",
  "The night passed. Mr. Fogg went to bed, but did he sleep? Aouda did not once close her eyes. Passepartout watched all night, like a faithful dog, at his master’s door.",
  "Mr. Fogg called him in the morning, and told him to get Aouda’s breakfast, and a cup of tea and a chop for himself. He desired Aouda to excuse him from breakfast and dinner, as his time would be absorbed all day in putting his affairs to rights. In the evening he would ask permission to have a few moment’s conversation with the young lady.",
  "Passepartout, having received his orders, had nothing to do but obey them. He looked at his imperturbable master, and could scarcely bring his mind to leave him. His heart was full, and his conscience tortured by remorse; for he accused himself more bitterly than ever of being the cause of the irretrievable disaster. Yes! if he had warned Mr. Fogg, and had betrayed Fix’s projects to him, his master would certainly not have given the detective passage to Liverpool, and then—",
  "Passepartout could hold in no longer.",
  "“My master! Mr. Fogg!” he cried, “why do you not curse me? It was my fault that—”",
  "“I blame no one,” returned Phileas Fogg, with perfect calmness. “Go!”",
  "Passepartout left the room, and went to find Aouda, to whom he delivered his master’s message.",
  "“Madam,” he added, “I can do nothing myself—nothing! I have no influence over my master; but you, perhaps—”",
  "“What influence could I have?” replied Aouda. “Mr. Fogg is influenced by no one. Has he ever understood that my gratitude to him is overflowing? Has he ever read my heart? My friend, he must not be left alone an instant! You say he is going to speak with me this evening?”",
  "“Yes, madam; probably to arrange for your protection and comfort in England.”",
  "“We shall see,” replied Aouda, becoming suddenly pensive.",
  "Throughout this day (Sunday) the house in Saville Row was as if uninhabited, and Phileas Fogg, for the first time since he had lived in that house, did not set out for his club when Westminster clock struck half-past eleven.",
  "Why should he present himself at the Reform? His friends no longer expected him there. As Phileas Fogg had not appeared in the saloon on the evening before (Saturday, the 21st of December, at a quarter before nine), he had lost his wager. It was not even necessary that he should go to his bankers for the twenty thousand pounds; for his antagonists already had his cheque in their hands, and they had only to fill it out and send it to the Barings to have the amount transferred to their credit.",
  "Mr. Fogg, therefore, had no reason for going out, and so he remained at home. He shut himself up in his room, and busied himself putting his affairs in order. Passepartout continually ascended and descended the stairs. The hours were long for him. He listened at his master’s door, and looked through the keyhole, as if he had a perfect right so to do, and as if he feared that something terrible might happen at any moment. Sometimes he thought of Fix, but no longer in anger. Fix, like all the world, had been mistaken in Phileas Fogg, and had only done his duty in tracking and arresting him; while he, Passepartout. … This thought haunted him, and he never ceased cursing his miserable folly.",
  "Finding himself too wretched to remain alone, he knocked at Aouda’s door, went into her room, seated himself, without speaking, in a corner, and looked ruefully at the young woman. Aouda was still pensive.",
  "About half-past seven in the evening Mr. Fogg sent to know if Aouda would receive him, and in a few moments he found himself alone with her.",
  "Phileas Fogg took a chair, and sat down near the fireplace, opposite Aouda. No emotion was visible on his face. Fogg returned was exactly the Fogg who had gone away; there was the same calm, the same impassibility.",
  "He sat several minutes without speaking; then, bending his eyes on Aouda, “Madam,” said he, “will you pardon me for bringing you to England?”",
  "“I, Mr. Fogg!” replied Aouda, checking the pulsations of her heart.",
  "“Please let me finish,” returned Mr. Fogg. “When I decided to bring you far away from the country which was so unsafe for you, I was rich, and counted on putting a portion of my fortune at your disposal; then your existence would have been free and happy. But now I am ruined.”",
  "“I know it, Mr. Fogg,” replied Aouda; “and I ask you in my turn, will you forgive me for having followed you, and—who knows?—for having, perhaps, delayed you, and thus contributed to your ruin?”",
  "“Madam, you could not remain in India, and your safety could only be assured by bringing you to such a distance that your persecutors could not take you.”",
  "“So, Mr. Fogg,” resumed Aouda, “not content with rescuing me from a terrible death, you thought yourself bound to secure my comfort in a foreign land?”",
  "“Yes, madam; but circumstances have been against me. Still, I beg to place the little I have left at your service.”",
  "“But what will become of you, Mr. Fogg?”",
  "“As for me, madam,” replied the gentleman, coldly, “I have need of nothing.”",
  "“But how do you look upon the fate, sir, which awaits you?”",
  "“As I am in the habit of doing.”",
  "“At least,” said Aouda, “want should not overtake a man like you. Your friends—”",
  "“I have no friends, madam.”",
  "“Your relatives—”",
  "“I have no longer any relatives.”",
  "“I pity you, then, Mr. Fogg, for solitude is a sad thing, with no heart to which to confide your griefs. They say, though, that misery itself, shared by two sympathetic souls, may be borne with patience.”",
  "“They say so, madam.”",
  "“Mr. Fogg,” said Aouda, rising and seizing his hand, “do you wish at once a kinswoman and friend? Will you have me for your wife?”",
  "Mr. Fogg, at this, rose in his turn. There was an unwonted light in his eyes, and a slight trembling of his lips. Aouda looked into his face. The sincerity, rectitude, firmness, and sweetness of this soft glance of a noble woman, who could dare all to save him to whom she owed all, at first astonished, then penetrated him. He shut his eyes for an instant, as if to avoid her look. When he opened them again, “I love you!” he said, simply. “Yes, by all that is holiest, I love you, and I am entirely yours!”",
  "“Ah!” cried Aouda, pressing his hand to her heart.",
  "Passepartout was summoned and appeared immediately. Mr. Fogg still held Aouda’s hand in his own; Passepartout understood, and his big, round face became as radiant as the tropical sun at its zenith.",
  "Mr. Fogg asked him if it was not too late to notify the Reverend Samuel Wilson, of Marylebone parish, that evening.",
  "Passepartout smiled his most genial smile, and said, “Never too late.”",
  "It was five minutes past eight.",
  "“Will it be for tomorrow, Monday?”",
  "“For tomorrow, Monday,” said Mr. Fogg, turning to Aouda.",
  "“Yes; for tomorrow, Monday,” she replied.",
  "Passepartout hurried off as fast as his legs could carry him."
];
const arabic=[
  "كان سكان سافيل رو سيفاجَؤون في اليوم التالي لو قيل لهم إن فيلياس فوج عاد إلى منزله. ظلت الأبواب والنوافذ مغلقة، ولم يظهر أي تغيير.",
  "بعد مغادرة المحطة، طلب السيد فوج من باسبارتو شراء بعض المؤن، ثم مضى بهدوء إلى مسكنه.",
  "تقبّل مصيبته بهدوئه المعتاد. لقد أفلس! وبسبب خطأ المحقق الفادح! بعد أن قطع تلك الرحلة الطويلة بثبات، وتغلب على مئة عقبة، وواجه أخطارًا كثيرة، ووجد مع ذلك وقتًا لفعل الخير في طريقه، انتهى به الأمر إلى الإخفاق قرب الهدف بسبب واقعة مفاجئة لم يكن بوسعه توقعها أو دفعها؛ كان ذلك فظيعًا! لم يبقَ معه إلا بضعة جنيهات من المبلغ الكبير الذي حمله. ولم يتبقَّ من ثروته سوى عشرين ألف جنيه مودعة لدى بارينغز، وكان هذا المبلغ مستحقًا لأصدقائه في نادي الإصلاح. وقد بلغت نفقات الرحلة حدًا جعلها لا تزيد ثروته حتى لو فاز؛ وربما لم يكن يسعى إلى المال أصلًا، إذ كان يراهن بدافع الشرف أكثر من قيمة الرهان. لكن هذا الرهان دمّره تمامًا.",
  "ومع ذلك، كان فوج قد حسم أمره تمامًا؛ فقد عرف ما بقي عليه فعله.",
  "خُصصت غرفة في منزل سافيل رو لأودا، التي غمرها الحزن بسبب مصيبة الرجل الذي حماها. ومن الكلمات التي أفلتت من فوج، فهمت أنه يدبر أمرًا خطيرًا.",
  "ولأن بعض الإنجليز الذين تستولي عليهم فكرة ثابتة قد يلجؤون أحيانًا إلى الانتحار بوصفه مخرجًا يائسًا، راح باسبارتو يراقب سيده عن كثب، مع حرصه على ألا يبدو كأنه يفعل ذلك.",
  "أول ما فعله ذلك الرجل الطيب أنه صعد إلى غرفته وأطفأ موقد الغاز الذي ظل مشتعلًا ثمانين يومًا. فقد وجد في صندوق الرسائل فاتورة من شركة الغاز، ورأى أن الوقت حان لوقف هذه الكلفة التي ابتُلي بتحملها.",
  "مرّ الليل. ذهب السيد فوج إلى الفراش، لكن هل نام؟ لم تغمض أودا عينيها لحظة. وظل باسبارتو يحرس باب سيده طوال الليل ككلب وفيّ.",
  "استدعاه السيد فوج في الصباح، وطلب منه إحضار فطور أودا، وكوب شاي وقطعة لحم له. وطلب من أودا أن تعذره عن عدم تناول الفطور والغداء معها، إذ سيقضي اليوم كله في ترتيب شؤونه. وفي المساء سيطلب الإذن بالتحدث مع الشابة لبضع دقائق.",
  "لم يكن أمام باسبارتو، بعد تلقي الأوامر، سوى تنفيذها. نظر إلى سيده الذي لا يتزعزع، وكاد يعجز عن حمل نفسه على مغادرته. كان قلبه مثقلًا وضميره يعذبه الندم؛ إذ لام نفسه أكثر من أي وقت مضى لأنه سبب الكارثة التي لا رجعة فيها. نعم، لو أنه حذّر السيد فوج وكشف له خطط فيكس، لما اصطحب سيده المحقق إلى ليفربول، وعندها...",
  "لم يعد باسبارتو قادرًا على كبح نفسه.",
  "صاح: «سيدي! سيد فوج! لماذا لا توبخني؟ أنا السبب في أن...»",
  "أجاب فيلياس فوج بهدوء تام: «لا ألوم أحدًا. اذهب!»",
  "غادر باسبارتو الغرفة وذهب يبحث عن أودا لينقل إليها رسالة سيده.",
  "وأضاف: «سيدتي، لا أستطيع فعل شيء بنفسي، لا شيء! ليس لي أي تأثير على سيدي، لكن ربما أنتِ...»",
  "ردت أودا: «أي تأثير يمكن أن يكون لي؟ لا أحد يؤثر في السيد فوج. هل فهم يومًا أن امتناني له يفيض؟ هل قرأ ما في قلبي؟ يا صديقي، يجب ألا يُترك وحده لحظة! أتقول إنه سيتحدث إليّ هذا المساء؟»",
  "قال: «نعم يا سيدتي، ربما ليطمئن على حمايتك وراحتك في إنجلترا.»",
  "أجابت أودا وقد غلب عليها التفكير فجأة: «سنرى.»",
  "طوال ذلك اليوم، يوم الأحد، بدا منزل سافيل رو كأنه مهجور؛ ولأول مرة منذ أن سكنه فيلياس فوج، لم يتوجه إلى ناديه عندما دقت ساعة وستمنستر الحادية عشرة والنصف.",
  "لماذا كان سيذهب إلى نادي الإصلاح؟ لم يعد أصدقاؤه يتوقعون رؤيته هناك. وبما أنه لم يظهر في الصالون مساء اليوم السابق، السبت 21 ديسمبر عند الثامنة وخمس وأربعين دقيقة، فقد خسر رهانه. ولم تكن هناك حاجة حتى إلى ذهابه إلى مصرفييه طلبًا للعشرين ألف جنيه؛ فخصومه كانوا يحملون الشيك بالفعل، ولم يبقَ عليهم سوى تعبئته وإرساله إلى بارينغز لتحويل المبلغ إلى حسابهم.",
  "لذلك لم يعد لدى السيد فوج سبب للخروج، فبقي في المنزل. انغلق على نفسه في غرفته وانشغل بترتيب شؤونه. ظل باسبارتو يصعد الدرج وينزل. كانت الساعات ثقيلة عليه. كان يصغي إلى باب سيده وينظر عبر ثقب المفتاح، كأنه يملك الحق الكامل في ذلك، وكأنه يخشى وقوع أمر فظيع في أي لحظة. وكان يفكر أحيانًا في فيكس، لكن دون غضب هذه المرة. فقد أخطأ فيكس، مثل العالم كله، في فهم فيلياس فوج، ولم يفعل سوى واجبه حين تعقبه واعتقله؛ أما هو، باسبارتو... كانت هذه الفكرة تطارده ولم يكف عن لعن حماقته البائسة.",
  "ولأنه لم يعد يحتمل البقاء وحيدًا مع بؤسه، طرق باب أودا ودخل غرفتها وجلس في زاوية من دون كلام، ونظر إلى الشابة بأسى. كانت أودا لا تزال غارقة في التفكير.",
  "نحو السابعة والنصف مساءً، أرسل السيد فوج يسأل إن كانت أودا ستستقبله، وبعد دقائق وجد نفسه معها على انفراد.",
  "سحب فيلياس فوج كرسيًا وجلس قرب المدفأة مقابل أودا. لم يظهر أي انفعال على وجهه. كان فوج العائد هو نفسه فوج الذي رحل؛ الهدوء ذاته والجمود ذاته.",
  "ظل جالسًا دقائق عدة دون كلام، ثم رفع عينيه نحو أودا وقال: «سيدتي، هل تسامحينني لأنني جلبتك إلى إنجلترا؟»",
  "أجابت أودا وهي تحاول ضبط خفقان قلبها: «أنا، يا سيد فوج؟»",
  "قال: «أرجوكِ دعيني أتم كلامي. حين قررت إبعادك عن البلد الذي لم يعد آمنًا لك، كنت ثريًا، وكنت أنوي أن أضع جزءًا من ثروتي تحت تصرفك لتعيشي حرة وسعيدة. لكنني الآن مفلس.»",
  "قالت أودا: «أعرف ذلك يا سيد فوج، وأنا بدوري أسألك: هل تسامحني لأنني تبعتك، ولأنني ربما أخرتك وأسهمت في إفلاسك؟»",
  "قال: «لم يكن بوسعك البقاء في الهند، ولم يكن من الممكن ضمان سلامتك إلا بإبعادك إلى مكان بعيد لا يستطيع مضطهدوك الوصول إليك فيه.»",
  "قالت أودا: «إذن، يا سيد فوج، لم تكتفِ بإنقاذي من موت فظيع، بل رأيت أنك ملزم بضمان راحتي في بلد غريب؟»",
  "أجاب: «نعم يا سيدتي، لكن الظروف كانت ضدي. ومع ذلك أرجو أن تقبلي القليل الذي بقي لي.»",
  "سألت: «وماذا سيحل بك أنت يا سيد فوج؟»",
  "أجاب الرجل ببرود: «أما أنا يا سيدتي، فلا أحتاج إلى شيء.»",
  "قالت: «لكن كيف تنظر إلى المصير الذي ينتظرك؟»",
  "أجاب: «كما اعتدت أن أنظر إليه.»",
  "قالت أودا: «على الأقل، لا ينبغي أن يمسّ العوز رجلًا مثلك. أصدقاؤك...»",
  "قال: «ليس لي أصدقاء يا سيدتي.»",
  "قالت: «أقاربك...»",
  "أجاب: «لم يعد لي أقارب.»",
  "قالت: «أشفق عليك يا سيد فوج؛ فالوحدة أمر محزن حين لا تجد قلبًا تبوح له بأحزانك. يقولون إن حتى البؤس يمكن احتماله بصبر إذا تقاسمه روحان متعاطفتان.»",
  "قال: «هكذا يقولون يا سيدتي.»",
  "قالت أودا وهي تنهض وتمسك بيده: «هل ترغب في أن أكون لك قريبة وصديقة معًا؟ هل تقبل أن أكون زوجتك؟»",
  "نهض السيد فوج بدوره. أضاءت عيناه بلمعة لم تُعهَد، وارتجفت شفتاه قليلًا. نظرت أودا إلى وجهه. لقد أدهشته أولًا، ثم نفذت إلى أعماقه نظرة هذه المرأة النبيلة الناعمة، بما فيها من صدق واستقامة وثبات وعذوبة، امرأة تجرؤ على كل شيء لإنقاذ من تدين له بكل شيء. أغمض عينيه لحظة كأنه يتجنب نظرتها. وحين فتحهما قال ببساطة: «أحبك! نعم، بكل ما هو مقدس، أحبك، وأنا لك تمامًا!»",
  "صاحت أودا وهي تضغط يده إلى قلبها: «آه!»",
  "استُدعي باسبارتو فحضر فورًا. كان السيد فوج لا يزال ممسكًا بيد أودا؛ وفهم باسبارتو الأمر، فأشرق وجهه المستدير الكبير كالشمس الاستوائية في كبد السماء.",
  "سأله السيد فوج إن كان الوقت قد تأخر لإبلاغ القس صموئيل ويلسون، من أبرشية ماريليبون، في تلك الليلة.",
  "ابتسم باسبارتو ابتسامته الودودة وقال: «لا وقت يفوت أبدًا.»",
  "كانت الساعة الثامنة وخمس دقائق.",
  "سأل: «هل سيكون ذلك غدًا، الاثنين؟»",
  "قال السيد فوج وهو يلتفت إلى أودا: «غدًا، الاثنين.»",
  "أجابت: «نعم، غدًا الاثنين.»",
  "وانطلق باسبارتو مسرعًا بكل ما تستطيع ساقاه حمله."
];
const terms=[
  {
    "term": "dwellers",
    "literal": "سكان / قاطنو",
    "context": "The dwellers in Saville Row",
    "note": "Opening description of a street's residents",
    "type": "word"
  },
  {
    "term": "habitual tranquillity",
    "literal": "هدوؤه المعتاد",
    "context": "with his habitual tranquillity",
    "note": "A repeated trait in Fogg's character",
    "type": "phrase"
  },
  {
    "term": "blundering",
    "literal": "خطأ فادح",
    "context": "by the blundering of the detective",
    "note": "A serious mistake, not a minor slip",
    "type": "word"
  },
  {
    "term": "unarmed",
    "literal": "بلا وسيلة للدفاع",
    "context": "against which he was unarmed",
    "note": "Figurative: unable to prevent an event",
    "type": "word"
  },
  {
    "term": "fully decided upon",
    "literal": "حسم أمره تمامًا",
    "context": "his course was fully decided upon",
    "note": "A settled decision",
    "type": "phrase"
  },
  {
    "term": "set apart",
    "literal": "خُصصت",
    "context": "A room in the house in Saville Row was set apart",
    "note": "Reserved for a particular purpose",
    "type": "phrase"
  },
  {
    "term": "meditating",
    "literal": "يدبّر / يفكر في",
    "context": "he was meditating some serious project",
    "note": "Considering a plan",
    "type": "word"
  },
  {
    "term": "fixed idea",
    "literal": "فكرة مسيطرة",
    "context": "governed by a fixed idea",
    "note": "An idea that dominates one's thinking",
    "type": "phrase"
  },
  {
    "term": "kept a narrow watch",
    "literal": "راقب عن كثب",
    "context": "kept a narrow watch upon his master",
    "note": "Watched closely and continuously",
    "type": "phrase"
  },
  {
    "term": "gas burner",
    "literal": "موقد الغاز",
    "context": "extinguished the gas burner",
    "note": "A device that burns gas for light or heat",
    "type": "phrase"
  },
  {
    "term": "doomed to bear",
    "literal": "مضطر إلى تحمّل",
    "context": "expense which he had been doomed to bear",
    "note": "Made to endure an unwanted cost",
    "type": "phrase"
  },
  {
    "term": "hold in no longer",
    "literal": "لم يعد قادرًا على كبح نفسه",
    "context": "could hold in no longer",
    "note": "An idiom for being unable to restrain emotion",
    "type": "idiom"
  },
  {
    "term": "imperturbable",
    "literal": "لا يتزعزع",
    "context": "his imperturbable master",
    "note": "Calm and difficult to disturb",
    "type": "word"
  },
  {
    "term": "delivered",
    "literal": "نقل / أوصل",
    "context": "he delivered his master's message",
    "note": "Communicated what someone asked him to say",
    "type": "word"
  },
  {
    "term": "pensive",
    "literal": "غارقة في التفكير",
    "context": "becoming suddenly pensive",
    "note": "Quietly thoughtful, often worried",
    "type": "word"
  },
  {
    "term": "present himself",
    "literal": "يحضر / يظهر",
    "context": "Why should he present himself at the Reform?",
    "note": "A formal way to say appear or attend",
    "type": "phrase"
  },
  {
    "term": "antagonists",
    "literal": "خصوم",
    "context": "his antagonists already had his cheque",
    "note": "People on the opposing side",
    "type": "word"
  },
  {
    "term": "putting his affairs in order",
    "literal": "ترتيب شؤونه",
    "context": "putting his affairs in order",
    "note": "Arranging practical matters before a major change",
    "type": "phrase"
  },
  {
    "term": "haunted him",
    "literal": "ظل يطارده",
    "context": "This thought haunted him",
    "note": "A thought that repeatedly troubles someone",
    "type": "phrase"
  },
  {
    "term": "pulsations",
    "literal": "خفقات",
    "context": "checking the pulsations of her heart",
    "note": "Rhythmic beats; here, heartbeats",
    "type": "word"
  },
  {
    "term": "at your disposal",
    "literal": "تحت تصرفك",
    "context": "putting a portion of my fortune at your disposal",
    "note": "Available for someone to use",
    "type": "phrase"
  },
  {
    "term": "persecutors",
    "literal": "مضطهِدون",
    "context": "that your persecutors could not take you",
    "note": "People who pursue or harm someone",
    "type": "word"
  },
  {
    "term": "want should not overtake",
    "literal": "ألا يدركك العوز",
    "context": "want should not overtake a man like you",
    "note": "Want means poverty or lack here",
    "type": "phrase"
  },
  {
    "term": "solitude",
    "literal": "الوحدة",
    "context": "solitude is a sad thing",
    "note": "Being alone without companionship",
    "type": "word"
  },
  {
    "term": "sympathetic souls",
    "literal": "روحان متعاطفتان",
    "context": "shared by two sympathetic souls",
    "note": "People who understand and care for each other",
    "type": "phrase"
  },
  {
    "term": "kinswoman",
    "literal": "قريبة",
    "context": "a kinswoman and friend",
    "note": "A female relative",
    "type": "word"
  },
  {
    "term": "unwonted light",
    "literal": "لمعة غير معهودة",
    "context": "There was an unwonted light in his eyes",
    "note": "Unwonted means unusual or unfamiliar",
    "type": "phrase"
  },
  {
    "term": "rectitude",
    "literal": "استقامة ونزاهة",
    "context": "sincerity, rectitude, firmness, and sweetness",
    "note": "Moral integrity and uprightness",
    "type": "word"
  },
  {
    "term": "genial smile",
    "literal": "ابتسامة ودودة",
    "context": "his most genial smile",
    "note": "Warm, friendly and cheerful",
    "type": "phrase"
  },
  {
    "term": "Never too late",
    "literal": "لم يفت الأوان بعد",
    "context": "Never too late",
    "note": "A confident response that there is still time",
    "type": "idiom"
  }
];
const body=english.join(' ');
for(const t of terms)if(!body.toLowerCase().includes(t.term.toLowerCase()))throw Error('Towle XXXV contextual glossary term absent: '+t.term);
if(english.length!==52||arabic.length!==english.length||arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXV bilingual paragraph alignment mismatch');
s.chapters.push({title:'In which Phileas Fogg does not have to repeat his orders to Passepartout twice.',titleAr:'الفصل الخامس والثلاثون — حيث لا يضطر فيلياس فوج إلى تكرار أوامره لباسبارتو مرتين',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXV';
s.description='After the lost wager seems final, Aouda offers Fogg a future beyond solitude.';
s.editorialStatus='English Chapters I–XXXV source-transcribed; Arabic draft pending independent review; 35 of 37 chapters';
s.provenance+=' Chapter XXXV: Standard Ebooks Towle transcription (source blob 8a39e6eaa78e1c14cca130353697f307f55e48d0; CC0 editorial edition; territory-specific rights pending review).';
})(window);
