/* Lingua Tales — complete Towle Chapter III (65 original prose paragraphs + full 8-leg itinerary).
 * English: Jules Verne / George Makepeace Towle (1873), public domain in US.
 * Transcribed from Standard Ebooks CC0 editorial edition:
 * https://raw.githubusercontent.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/master/src/epub/text/chapter-3.xhtml
 * Arabic companion: new draft translation, pending independent literary review.
 * Chapter III of 37; NEVER claim the novel is complete or globally rights-cleared.
 */
(function(global){
'use strict';
const story=(global.StoryLensEditorialStories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
if(!story||story.chapters.length!==2)throw Error('Towle chapter III load order mismatch');
story.chapters.push({
  "title": "In Which a Conversation Takes Place Which Seems Likely to Cost Phileas Fogg Dear",
  "titleAr": "فيه تدور محادثة قد تكلف فيلياس فوغ غاليًا",
  "paragraphs": [
    {
      "en": "Phileas Fogg, having shut the door of his house at half-past eleven, and having put his right foot before his left five hundred and seventy-five times, and his left foot before his right five hundred and seventy-six times, reached the Reform Club, an imposing edifice in Pall Mall, which could not have cost less than three millions. He repaired at once to the dining-room, the nine windows of which open upon a tasteful garden, where the trees were already gilded with an autumn colouring; and took his place at the habitual table, the cover of which had already been laid for him. His breakfast consisted of a side-dish, a broiled fish with Reading sauce, a scarlet slice of roast beef garnished with mushrooms, a rhubarb and gooseberry tart, and a morsel of Cheshire cheese, the whole being washed down with several cups of tea, for which the Reform is famous. He rose at thirteen minutes to one, and directed his steps towards the large hall, a sumptuous apartment adorned with lavishly-framed paintings. A flunkey handed him an uncut Times, which he proceeded to cut with a skill which betrayed familiarity with this delicate operation. The perusal of this paper absorbed Phileas Fogg until a quarter before four, whilst the Standard, his next task, occupied him till the dinner hour. Dinner passed as breakfast had done, and Mr. Fogg reappeared in the reading-room and sat down to the Pall Mall at twenty minutes before six. Half an hour later several members of the Reform came in and drew up to the fireplace, where a coal fire was steadily burning. They were Mr. Fogg’s usual partners at whist: Andrew Stuart, an engineer; John Sullivan and Samuel Fallentin, bankers; Thomas Flanagan, a brewer; and Gauthier Ralph, one of the Directors of the Bank of England—all rich and highly respectable personages, even in a club which comprises the princes of English trade and finance.",
      "ar": "أغلق فيلياس فوغ باب منزله عند الحادية عشرة والنصف، وبعد أن قدّم قدمه اليمنى على اليسرى خمسمئة وخمسًا وسبعين مرة، واليسرى على اليمنى خمسمئة وستًا وسبعين مرة، وصل إلى نادي الإصلاح في بال مال، وهو بناء فخم لا بد أن تكلفته بلغت ثلاثة ملايين على الأقل. دخل غرفة الطعام ذات النوافذ التسع المطلة على حديقة بدأت أشجارها تكتسي ألوان الخريف، وجلس إلى مائدته المعتادة المعدّة سلفًا. تناول سمكًا مشويًا بصلصة ريدنغ، وشريحة لحم بقري محمرّة مع الفطر، وفطيرة راوند وعنب الثعلب، وقطعة من جبن تشيشاير، وشرب عدة أكواب من الشاي الذي اشتهر به النادي. نهض في الثانية عشرة وسبع وأربعين دقيقة واتجه إلى القاعة الكبيرة المزينة بلوحات مؤطرة بإسراف. ناوله أحد الخدم نسخة من صحيفة «التايمز» لم تُفصل صفحاتها بعد، ففصلها بمهارة تنم عن تمرّسه بهذه المهمة الدقيقة. انشغل بالصحيفة حتى الثالثة وخمس وأربعين دقيقة، ثم قرأ «ستاندرد» حتى موعد العشاء. وبعد العشاء عاد إلى غرفة القراءة ليتصفح «بال مال» عند الخامسة وأربعين دقيقة تقريبًا. وبعد نصف ساعة اجتمع قرب المدفأة شركاؤه المعتادون في لعبة الورق «ويست»: المهندس أندرو ستيوارت، والمصرفيان جون سوليفان وصموئيل فالنتين، وصانع الجعة توماس فلاناغان، وغوتييه رالف أحد مديري بنك إنجلترا؛ وكلهم أثرياء محترمون حتى بمقاييس نادٍ يضم كبار رجال المال والتجارة."
    },
    {
      "en": "“Well, Ralph,” said Thomas Flanagan, “what about that robbery?”",
      "ar": "قال توماس فلاناغان: «حسنًا يا رالف، ما أخبار تلك السرقة؟»"
    },
    {
      "en": "“Oh,” replied Stuart, “the Bank will lose the money.”",
      "ar": "أجاب ستيوارت: «أوه، سيخسر البنك المال»."
    },
    {
      "en": "“On the contrary,” broke in Ralph, “I hope we may put our hands on the robber. Skilful detectives have been sent to all the principal ports of America and the Continent, and he’ll be a clever fellow if he slips through their fingers.”",
      "ar": "قاطعه رالف: «بل آمل أن نقبض على السارق. أُرسل محققون مهرة إلى الموانئ الرئيسية في أمريكا والقارة الأوروبية، وسيكون بارعًا حقًا إن أفلت من أيديهم»."
    },
    {
      "en": "“But have you got the robber’s description?” asked Stuart.",
      "ar": "سأل ستيوارت: «ولكن هل لديكم وصف للسارق؟»"
    },
    {
      "en": "“In the first place, he is no robber at all,” returned Ralph, positively.",
      "ar": "أجاب رالف بثقة: «أولًا، إنه ليس سارقًا أصلًا»."
    },
    {
      "en": "“What! a fellow who makes off with fifty-five thousand pounds, no robber?”",
      "ar": "«ماذا؟ رجل يهرب بخمسة وخمسين ألف جنيه وليس سارقًا؟»"
    },
    {
      "en": "“No.”",
      "ar": "«لا»."
    },
    {
      "en": "“Perhaps he’s a manufacturer, then.”",
      "ar": "«لعلّه رجل صناعة إذن»."
    },
    {
      "en": "“The Daily Telegraph says that he is a gentleman.”",
      "ar": "«تقول صحيفة ديلي تلغراف إنه رجل نبيل»."
    },
    {
      "en": "It was Phileas Fogg, whose head now emerged from behind his newspapers, who made this remark. He bowed to his friends, and entered into the conversation. The affair which formed its subject, and which was town talk, had occurred three days before at the Bank of England. A package of banknotes, to the value of fifty-five thousand pounds, had been taken from the principal cashier’s table, that functionary being at the moment engaged in registering the receipt of three shillings and sixpence. Of course, he could not have his eyes everywhere. Let it be observed that the Bank of England reposes a touching confidence in the honesty of the public. There are neither guards nor gratings to protect its treasures; gold, silver, banknotes are freely exposed, at the mercy of the first comer. A keen observer of English customs relates that, being in one of the rooms of the Bank one day, he had the curiosity to examine a gold ingot weighing some seven or eight pounds. He took it up, scrutinised it, passed it to his neighbour, he to the next man, and so on until the ingot, going from hand to hand, was transferred to the end of a dark entry; nor did it return to its place for half an hour. Meanwhile, the cashier had not so much as raised his head. But in the present instance things had not gone so smoothly. The package of notes not being found when five o’clock sounded from the ponderous clock in the “drawing office,” the amount was passed to the account of profit and loss. As soon as the robbery was discovered, picked detectives hastened off to Liverpool, Glasgow, Havre, Suez, Brindisi, New York, and other ports, inspired by the proffered reward of two thousand pounds, and five percent on the sum that might be recovered. Detectives were also charged with narrowly watching those who arrived at or left London by rail, and a judicial examination was at once entered upon.",
      "ar": "كان فيلياس فوغ هو من قال ذلك بعدما أطلّ برأسه من خلف صحفه. حيّا أصدقاءه وانضم إلى الحديث. وقعت الحادثة التي شغلت المدينة قبل ثلاثة أيام في بنك إنجلترا: اختفت رزمة أوراق نقدية قيمتها خمسة وخمسون ألف جنيه من طاولة أمين الصندوق الرئيسي، بينما كان منشغلًا بتسجيل مبلغ ثلاثة شلنات وستة بنسات. وبالطبع لا يستطيع مراقبة كل شيء. كان البنك يثق بأمانة الجمهور ثقة لافتة؛ فلا حراس ولا قضبان تحمي الذهب والفضة والأوراق النقدية المعروضة أمام الزائرين. وروى مراقب لعادات الإنجليز أنه تناول ذات يوم سبيكة ذهب وزنها سبعة أو ثمانية أرطال في إحدى قاعات البنك، وتفحصها ثم ناولها لجاره، فانتقلت من شخص إلى آخر حتى بلغت نهاية ممر مظلم، ولم تعد إلى مكانها إلا بعد نصف ساعة، بينما لم يرفع أمين الصندوق رأسه. لكن الأمر هذه المرة لم ينتهِ بسلام؛ فلما دقت الخامسة ولم تُعثر على الرزمة، سُجلت قيمتها في حساب الأرباح والخسائر. وانطلق محققون مختارون إلى ليفربول وغلاسكو ولوهافر والسويس وبرينديزي ونيويورك وموانئ أخرى، طمعًا في مكافأة قدرها ألفا جنيه وخمسة بالمئة مما يُسترد. وكُلّف آخرون بمراقبة القادمين إلى لندن والمغادرين بالقطار، وبدأ التحقيق القضائي فورًا."
    },
    {
      "en": "There were real grounds for supposing, as the Daily Telegraph said, that the thief did not belong to a professional band. On the day of the robbery a well-dressed gentleman of polished manners, and with a well-to-do air, had been observed going to and fro in the paying room where the crime was committed. A description of him was easily procured and sent to the detectives; and some hopeful spirits, of whom Ralph was one, did not despair of his apprehension. The papers and clubs were full of the affair, and everywhere people were discussing the probabilities of a successful pursuit; and the Reform Club was especially agitated, several of its members being Bank officials.",
      "ar": "كانت هناك أسباب وجيهة للاعتقاد، كما قالت «ديلي تلغراف»، بأن الفاعل ليس من عصابة محترفة. فقد شوهد يوم السرقة رجل أنيق الثياب، مهذب السلوك، تبدو عليه علامات اليسر، يتردد على صالة الدفع حيث وقعت الجريمة. أمكن الحصول على وصفه وإرساله إلى المحققين، ولم يفقد المتفائلون، ومنهم رالف، الأمل في القبض عليه. شغلت القضية الصحف والنوادي، وراح الناس يتناقشون في فرص نجاح المطاردة؛ وكان نادي الإصلاح أكثر انشغالًا بها لأن عددًا من أعضائه يعملون في البنك."
    },
    {
      "en": "Ralph would not concede that the work of the detectives was likely to be in vain, for he thought that the prize offered would greatly stimulate their zeal and activity. But Stuart was far from sharing this confidence; and, as they placed themselves at the whist-table, they continued to argue the matter. Stuart and Flanagan played together, while Phileas Fogg had Fallentin for his partner. As the game proceeded the conversation ceased, excepting between the rubbers, when it revived again.",
      "ar": "رفض رالف التسليم بأن جهود المحققين ستذهب سدى، إذ رأى أن المكافأة ستحفز نشاطهم. أما ستيوارت فلم يشاركه الثقة، واستمر الجدال حين جلسوا إلى طاولة «ويست». لعب ستيوارت مع فلاناغان، وكان فالنتين شريك فوغ. سكت الحديث أثناء اللعب، ثم عاد بين الجولات."
    },
    {
      "en": "“I maintain,” said Stuart, “that the chances are in favour of the thief, who must be a shrewd fellow.”",
      "ar": "قال ستيوارت: «أصرّ على أن الاحتمالات في صالح اللص؛ فلا بد أنه رجل شديد الدهاء»."
    },
    {
      "en": "“Well, but where can he fly to?” asked Ralph. “No country is safe for him.”",
      "ar": "رد رالف: «لكن إلى أين يهرب؟ لا بلد آمنًا له»."
    },
    {
      "en": "“Pshaw!”",
      "ar": "«هراء!»"
    },
    {
      "en": "“Where could he go, then?”",
      "ar": "«فإلى أين يستطيع الذهاب؟»"
    },
    {
      "en": "“Oh, I don’t know that. The world is big enough.”",
      "ar": "«لا أعرف. العالم واسع بما يكفي»."
    },
    {
      "en": "“It was once,” said Phileas Fogg, in a low tone. “Cut, sir,” he added, handing the cards to Thomas Flanagan.",
      "ar": "قال فوغ بصوت خفيض: «كان كذلك في الماضي». ثم ناول فلاناغان الأوراق وأضاف: «اقطع الأوراق يا سيدي»."
    },
    {
      "en": "The discussion fell during the rubber, after which Stuart took up its thread.",
      "ar": "توقف النقاش أثناء الجولة، وبعد انتهائها عاد ستيوارت إلى الموضوع."
    },
    {
      "en": "“What do you mean by ‘once’? Has the world grown smaller?”",
      "ar": "«ماذا تعني بقولك: كان؟ هل صار العالم أصغر؟»"
    },
    {
      "en": "“Certainly,” returned Ralph. “I agree with Mr. Fogg. The world has grown smaller, since a man can now go round it ten times more quickly than a hundred years ago. And that is why the search for this thief will be more likely to succeed.”",
      "ar": "أجاب رالف: «بالتأكيد. أتفق مع السيد فوغ؛ لقد صار العالم أصغر لأن المرء يستطيع الآن الدوران حوله أسرع بعشر مرات مما كان يستطيع قبل قرن. ولهذا تزيد فرص العثور على اللص»."
    },
    {
      "en": "“And also why the thief can get away more easily.”",
      "ar": "«وتزيد أيضًا فرص هرب اللص بسهولة أكبر»."
    },
    {
      "en": "“Be so good as to play, Mr. Stuart,” said Phileas Fogg.",
      "ar": "قال فوغ: «تفضل باللعب يا سيد ستيوارت»."
    },
    {
      "en": "But the incredulous Stuart was not convinced, and when the hand was finished, said eagerly: “You have a strange way, Ralph, of proving that the world has grown smaller. So, because you can go round it in three months—”",
      "ar": "لكن ستيوارت المتشكك لم يقتنع، وما إن انتهت الجولة حتى قال بحماسة: «هذه طريقة غريبة يا رالف لإثبات أن العالم صغر! أتقصد أن المرء يستطيع الدوران حوله في ثلاثة أشهر...»."
    },
    {
      "en": "“In eighty days,” interrupted Phileas Fogg.",
      "ar": "قاطعه فوغ: «في ثمانين يومًا»."
    },
    {
      "en": "“That is true, gentlemen,” added John Sullivan. “Only eighty days, now that the section between Rothal and Allahabad, on the Great Indian Peninsula Railway, has been opened. Here is the estimate made by the Daily Telegraph:",
      "ar": "قال جون سوليفان: «هذا صحيح يا سادة. ثمانون يومًا فقط بعد افتتاح الجزء الواصل بين روثال والله آباد من سكة حديد شبه الجزيرة الهندية الكبرى. وإليكم تقدير صحيفة ديلي تلغراف:»."
    },
    {
      "en": "From London to Suez via Mont Cenis and Brindisi, by rail and steamboats: 7 days; From Suez to Bombay, by steamer: 13 days; From Bombay to Calcutta, by rail: 3 days; From Calcutta to Hong Kong, by steamer: 13 days; From Hong Kong to Yokohama (Japan), by steamer: 6 days; From Yokohama to San Francisco, by steamer: 22 days; From San Francisco to New York, by rail: 7 days; From New York to London, by steamer and rail: 9 days. Total: 80 days.",
      "ar": "من لندن إلى السويس عبر مون سيني وبرينديزي بالقطار والباخرة: 7 أيام؛ من السويس إلى بومباي بالباخرة: 13 يومًا؛ من بومباي إلى كلكتا بالقطار: 3 أيام؛ من كلكتا إلى هونغ كونغ بالباخرة: 13 يومًا؛ من هونغ كونغ إلى يوكوهاما في اليابان بالباخرة: 6 أيام؛ من يوكوهاما إلى سان فرانسيسكو بالباخرة: 22 يومًا؛ من سان فرانسيسكو إلى نيويورك بالقطار: 7 أيام؛ من نيويورك إلى لندن بالباخرة والقطار: 9 أيام. المجموع: 80 يومًا."
    },
    {
      "en": "“Yes, in eighty days!” exclaimed Stuart, who in his excitement made a false deal. “But that doesn’t take into account bad weather, contrary winds, shipwrecks, railway accidents, and so on.”",
      "ar": "صاح ستيوارت، وقد أخطأ في توزيع الأوراق من شدة انفعاله: «نعم، في ثمانين يومًا! لكن الحساب لا يشمل سوء الطقس والرياح المعاكسة وحوادث الغرق والسكك الحديدية وما إلى ذلك»."
    },
    {
      "en": "“All included,” returned Phileas Fogg, continuing to play despite the discussion.",
      "ar": "أجاب فوغ، وهو يواصل اللعب: «كل ذلك محسوب»."
    },
    {
      "en": "“But suppose the Hindus or Indians pull up the rails,” replied Stuart; “suppose they stop the trains, pillage the luggage-vans, and scalp the passengers!”",
      "ar": "قال ستيوارت: «وماذا لو اقتلع الهنود القضبان، أو أوقفوا القطارات ونهبوا عربات الأمتعة واعتدوا على الركاب؟»"
    },
    {
      "en": "“All included,” calmly retorted Fogg; adding, as he threw down the cards, “Two trumps.”",
      "ar": "رد فوغ بهدوء، وهو يلقي أوراقه: «كل ذلك محسوب. ورقتان رابحتان»."
    },
    {
      "en": "Stuart, whose turn it was to deal, gathered them up, and went on: “You are right, theoretically, Mr. Fogg, but practically—”",
      "ar": "جمع ستيوارت الأوراق وقد جاء دوره في التوزيع، ثم قال: «أنت محق نظريًا يا سيد فوغ، لكن عمليًا...»."
    },
    {
      "en": "“Practically also, Mr. Stuart.”",
      "ar": "«وعمليًا أيضًا يا سيد ستيوارت»."
    },
    {
      "en": "“I’d like to see you do it in eighty days.”",
      "ar": "«أود أن أراك تفعلها في ثمانين يومًا»."
    },
    {
      "en": "“It depends on you. Shall we go?”",
      "ar": "«الأمر يتوقف عليك. هل ننطلق؟»"
    },
    {
      "en": "“Heaven preserve me! But I would wager four thousand pounds that such a journey, made under these conditions, is impossible.”",
      "ar": "«ليحفظني الله! لكنني أراهن بأربعة آلاف جنيه على استحالة رحلة كهذه في هذه الظروف»."
    },
    {
      "en": "“Quite possible, on the contrary,” returned Mr. Fogg.",
      "ar": "أجاب فوغ: «بل هي ممكنة تمامًا»."
    },
    {
      "en": "“Well, make it, then!”",
      "ar": "«إذن قم بها!»"
    },
    {
      "en": "“The journey round the world in eighty days?”",
      "ar": "«رحلة حول العالم في ثمانين يومًا؟»"
    },
    {
      "en": "“Yes.”",
      "ar": "«نعم»."
    },
    {
      "en": "“I should like nothing better.”",
      "ar": "«لا أريد شيئًا أكثر من ذلك»."
    },
    {
      "en": "“When?”",
      "ar": "«متى؟»"
    },
    {
      "en": "“At once. Only I warn you that I shall do it at your expense.”",
      "ar": "«في الحال. لكنني أنبهك إلى أنني سأقوم بها على نفقتك»."
    },
    {
      "en": "“It’s absurd!” cried Stuart, who was beginning to be annoyed at the persistency of his friend. “Come, let’s go on with the game.”",
      "ar": "صاح ستيوارت وقد بدأ يضيق بإصرار صديقه: «هذا عبث! هيا نكمل اللعب»."
    },
    {
      "en": "“Deal over again, then,” said Phileas Fogg. “There’s a false deal.”",
      "ar": "قال فوغ: «أعد توزيع الأوراق إذن؛ فقد أخطأت في التوزيع»."
    },
    {
      "en": "Stuart took up the pack with a feverish hand; then suddenly put them down again.",
      "ar": "أمسك ستيوارت رزمة الأوراق بيد مرتجفة، ثم وضعها فجأة."
    },
    {
      "en": "“Well, Mr. Fogg,” said he, “it shall be so: I will wager the four thousand on it.”",
      "ar": "قال: «حسنًا يا سيد فوغ، ليكن ما تريد. سأراهن بالأربعة آلاف»."
    },
    {
      "en": "“Calm yourself, my dear Stuart,” said Fallentin. “It’s only a joke.”",
      "ar": "قال فالنتين: «اهدأ يا ستيوارت العزيز، إنها مجرد مزحة»."
    },
    {
      "en": "“When I say I’ll wager,” returned Stuart, “I mean it.”",
      "ar": "رد ستيوارت: «حين أقول إنني أراهن فأنا أعني ذلك»."
    },
    {
      "en": "“All right,” said Mr. Fogg; and, turning to the others, he continued: “I have a deposit of twenty thousand at Baring’s which I will willingly risk upon it.”",
      "ar": "قال فوغ: «حسنًا». ثم التفت إلى الآخرين وأضاف: «لديّ وديعة قدرها عشرون ألف جنيه لدى بنك بارينغ، وأنا مستعد للمخاطرة بها»."
    },
    {
      "en": "“Twenty thousand pounds!” cried Sullivan. “Twenty thousand pounds, which you would lose by a single accidental delay!”",
      "ar": "صاح سوليفان: «عشرون ألف جنيه! قد تخسرها بسبب تأخير عارض واحد!»"
    },
    {
      "en": "“The unforeseen does not exist,” quietly replied Phileas Fogg.",
      "ar": "أجاب فوغ بهدوء: «لا وجود لما هو غير متوقع»."
    },
    {
      "en": "“But, Mr. Fogg, eighty days are only the estimate of the least possible time in which the journey can be made.”",
      "ar": "«لكن يا سيد فوغ، ثمانون يومًا ليست إلا تقديرًا لأقصر مدة ممكنة لهذه الرحلة»."
    },
    {
      "en": "“A well-used minimum suffices for everything.”",
      "ar": "«الحد الأدنى، إذا استُخدم جيدًا، يكفي لكل شيء»."
    },
    {
      "en": "“But, in order not to exceed it, you must jump mathematically from the trains upon the steamers, and from the steamers upon the trains again.”",
      "ar": "«ولكيلا تتجاوزه، عليك أن تقفز بحساب دقيق من القطار إلى الباخرة، ومن الباخرة إلى القطار»."
    },
    {
      "en": "“I will jump—mathematically.”",
      "ar": "«سأقفز... بحساب دقيق»."
    },
    {
      "en": "“You are joking.”",
      "ar": "«إنك تمزح»."
    },
    {
      "en": "“A true Englishman doesn’t joke when he is talking about so serious a thing as a wager,” replied Phileas Fogg, solemnly. “I will bet twenty thousand pounds against anyone who wishes that I will make the tour of the world in eighty days or less; in nineteen hundred and twenty hours, or a hundred and fifteen thousand two hundred minutes. Do you accept?”",
      "ar": "قال فوغ بوقار: «الإنجليزي الحق لا يمزح في أمر جاد مثل الرهان. أراهن بعشرين ألف جنيه أمام أي شخص يشاء أنني سأطوف العالم في ثمانين يومًا أو أقل؛ أي ألف وتسعمئة وعشرين ساعة، أو مئة وخمسة عشر ألفًا ومئتي دقيقة. هل تقبلون؟»"
    },
    {
      "en": "“We accept,” replied Messrs. Stuart, Fallentin, Sullivan, Flanagan, and Ralph, after consulting each other.",
      "ar": "قال السادة ستيوارت وفالنتين وسوليفان وفلاناغان ورالف، بعد التشاور: «نقبل»."
    },
    {
      "en": "“Good,” said Mr. Fogg. “The train leaves for Dover at a quarter before nine. I will take it.”",
      "ar": "قال فوغ: «جيد. يغادر القطار إلى دوفر في الثامنة وخمس وأربعين دقيقة. سأستقله»."
    },
    {
      "en": "“This very evening?” asked Stuart.",
      "ar": "سأل ستيوارت: «هذا المساء بالذات؟»"
    },
    {
      "en": "“This very evening,” returned Phileas Fogg. He took out and consulted a pocket almanac, and added, “As today is Wednesday, the 2nd of October, I shall be due in London in this very room of the Reform Club, on Saturday, the 21st of December, at a quarter before nine p.m.; or else the twenty thousand pounds, now deposited in my name at Baring’s, will belong to you, in fact and in right, gentlemen. Here is a cheque for the amount.”",
      "ar": "أجاب فوغ: «هذا المساء». وأخرج مفكرة صغيرة، ثم قال: «بما أن اليوم الأربعاء الثاني من أكتوبر، فسأعود إلى لندن، إلى هذه الغرفة نفسها في نادي الإصلاح، يوم السبت الحادي والعشرين من ديسمبر عند الثامنة وخمس وأربعين دقيقة مساءً؛ وإلا أصبحت العشرون ألف جنيه المودعة باسمي لدى بارينغ ملكًا لكم حقًا وقانونًا يا سادة. وهذا شيك بالمبلغ»."
    },
    {
      "en": "A memorandum of the wager was at once drawn up and signed by the six parties, during which Phileas Fogg preserved a stoical composure. He certainly did not bet to win, and had only staked the twenty thousand pounds, half of his fortune, because he foresaw that he might have to expend the other half to carry out this difficult, not to say unattainable, project. As for his antagonists, they seemed much agitated; not so much by the value of their stake, as because they had some scruples about betting under conditions so difficult to their friend.",
      "ar": "حُررت وثيقة الرهان فورًا ووقّعها الأطراف الستة، فيما حافظ فوغ على رباطة جأشه. لم يكن يراهن طمعًا في الربح؛ بل وضع عشرين ألف جنيه، وهي نصف ثروته، لأنه توقع أن يحتاج إلى إنفاق النصف الآخر لتنفيذ هذا المشروع العسير، بل الذي يبدو مستحيلًا. أما خصومه فبدوا مضطربين، لا لقيمة المبلغ وحدها، بل لأنهم شعروا بشيء من الحرج وهم يراهنون صديقهم على شروط بالغة الصعوبة."
    },
    {
      "en": "The clock struck seven, and the party offered to suspend the game so that Mr. Fogg might make his preparations for departure.",
      "ar": "دقت الساعة السابعة، واقترحوا إيقاف اللعب كي يتمكن فوغ من الاستعداد للسفر."
    },
    {
      "en": "“I am quite ready now,” was his tranquil response. “Diamonds are trumps: be so good as to play, gentlemen.”",
      "ar": "أجاب بطمأنينته المعهودة: «أنا مستعد من الآن. ورق الديناري هو الرابح؛ تفضلوا باللعب يا سادة»."
    }
  ]
});
story.terms.push(...[
  {
    "term": "put our hands on",
    "literal": "نقبض على",
    "context": "يأمل رالف في القبض على المشتبه به",
    "type": "idiom",
    "note": "To catch or obtain someone, not literally placing hands."
  },
  {
    "term": "slips through their fingers",
    "literal": "يفلت من أيديهم",
    "context": "خشية فرار اللص من المحققين",
    "type": "idiom",
    "note": "Escape despite an attempt to catch."
  },
  {
    "term": "makes off with",
    "literal": "يهرب حاملًا",
    "context": "يصف اختفاء الأموال من البنك",
    "type": "phrasal verb",
    "note": "Leave quickly with stolen property."
  },
  {
    "term": "town talk",
    "literal": "حديث المدينة",
    "context": "انتشار خبر السرقة بين الناس",
    "type": "phrase",
    "note": "Something widely discussed."
  },
  {
    "term": "at the mercy of",
    "literal": "تحت رحمة",
    "context": "ترك الأموال دون حماية كافية",
    "type": "idiom",
    "note": "Exposed to someone else's power."
  },
  {
    "term": "going to and fro",
    "literal": "يتردد ذهابًا وإيابًا",
    "context": "حركة الرجل المشتبه به داخل البنك",
    "type": "phrase",
    "note": "Moving back and forth."
  },
  {
    "term": "in vain",
    "literal": "عبثًا",
    "context": "يختلف الأعضاء حول جدوى المطاردة",
    "type": "phrase",
    "note": "Without success."
  },
  {
    "term": "shrewd fellow",
    "literal": "رجل شديد الدهاء",
    "context": "يعتقد ستيوارت أن اللص بارع",
    "type": "collocation",
    "note": "A clever and calculating person."
  },
  {
    "term": "the world has grown smaller",
    "literal": "صار العالم أصغر",
    "context": "التقدم في النقل قلّص زمن السفر",
    "type": "figurative phrase",
    "note": "Faster travel makes distant places easier to reach."
  },
  {
    "term": "false deal",
    "literal": "توزيع خاطئ للأوراق",
    "context": "يخطئ ستيوارت في لعب الورق بسبب انفعاله",
    "type": "phrase",
    "note": "An invalid card deal."
  },
  {
    "term": "All included",
    "literal": "كل ذلك محسوب",
    "context": "فوغ لا يستثني المخاطر من خطة الرحلة",
    "type": "phrase",
    "note": "Every risk is already accounted for."
  },
  {
    "term": "the unforeseen does not exist",
    "literal": "لا وجود لما هو غير متوقع",
    "context": "فوغ يعبّر عن ثقته المطلقة بجدوله",
    "type": "aphorism",
    "note": "A claim of perfect predictability, not a fact."
  },
  {
    "term": "stoical composure",
    "literal": "رباطة جأش",
    "context": "هدوء فوغ عند توقيع الرهان",
    "type": "collocation",
    "note": "Unshaken calm under pressure."
  },
  {
    "term": "scruples",
    "literal": "تحفظات أخلاقية",
    "context": "يشعر خصوم فوغ بالحرج من شروط الرهان",
    "type": "noun",
    "note": "Moral hesitation or misgivings."
  },
  {
    "term": "in fact and in right",
    "literal": "حقًا وقانونًا",
    "context": "تنتقل قيمة الرهان قانونيًا إذا فشل فوغ",
    "type": "legal phrase",
    "note": "In reality and as a legal entitlement."
  },
  {
    "term": "at once",
    "literal": "في الحال",
    "context": "يقرر فوغ بدء الرحلة دون تأخير",
    "type": "phrase",
    "note": "Immediately."
  },
  {
    "term": "a single accidental delay",
    "literal": "تأخير عارض واحد",
    "context": "سوليفان يحذر من احتمال خسارة المال",
    "type": "phrase",
    "note": "One unexpected delay can change the outcome."
  },
  {
    "term": "I will jump",
    "literal": "سأقفز",
    "context": "يؤكد فوغ دقة انتقالاته بين وسائل النقل",
    "type": "figurative phrase",
    "note": "Here a figurative rapid transfer, not necessarily a literal leap."
  }
]);
story.totalChapters=37;
story.subtitle='The original Towle translation — Chapters I–III';
story.description='Phileas Fogg makes the wager that sets his journey in motion. Authentic opening three chapters; more to follow.';
story.editorialStatus='English Chapters I–III source-checked; Arabic companion draft pending independent literary review; 3 of 37 chapters';
story.provenance+=' Chapter III: Standard Ebooks Towle transcription (CC0 editorial edition); rights outside US pending review.';
})(window);
