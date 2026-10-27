/* Lingua Tales — complete Towle Chapter XXXIII, transcribed from the pinned Standard Ebooks editorial edition.
 * Upstream commit: 56c82e97ff5d4f8950afca05b71af72688a8da34; source blob: 22da80571dce2d37f9bfb1612f1c96ab9331c3c9; source path: src/epub/text/chapter-33.xhtml.
 * Standard Ebooks editorial transcription is CC0; Towle's 1873 English translation is public domain in the US.
 * Territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
 * 67 narrative paragraphs / 2482 English words; normalized English SHA-256: c575cc82b383cc32f87ec58929f92dac3e152f9ab42025c859bf4897b5337f32.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==32)throw Error('Towle chapter XXXIII load order mismatch');
const english=[
  "An hour after, the Henrietta passed the lighthouse which marks the entrance of the Hudson, turned the point of Sandy Hook, and put to sea. During the day she skirted Long Island, passed Fire Island, and directed her course rapidly eastward.",
  "At noon the next day, a man mounted the bridge to ascertain the vessel’s position. It might be thought that this was Captain Speedy. Not the least in the world. It was Phileas Fogg, Esquire. As for Captain Speedy, he was shut up in his cabin under lock and key, and was uttering loud cries, which signified an anger at once pardonable and excessive.",
  "What had happened was very simple. Phileas Fogg wished to go to Liverpool, but the captain would not carry him there. Then Phileas Fogg had taken passage for Bordeaux, and, during the thirty hours he had been on board, had so shrewdly managed with his banknotes that the sailors and stokers, who were only an occasional crew, and were not on the best terms with the captain, went over to him in a body. This was why Phileas Fogg was in command instead of Captain Speedy; why the captain was a prisoner in his cabin; and why, in short, the Henrietta was directing her course towards Liverpool. It was very clear, to see Mr. Fogg manage the craft, that he had been a sailor.",
  "How the adventure ended will be seen anon. Aouda was anxious, though she said nothing. As for Passepartout, he thought Mr. Fogg’s manoeuvre simply glorious. The captain had said “between eleven and twelve knots,” and the Henrietta confirmed his prediction.",
  "If, then⁠—for there were “ifs” still⁠—the sea did not become too boisterous, if the wind did not veer round to the east, if no accident happened to the boat or its machinery, the Henrietta might cross the three thousand miles from New York to Liverpool in the nine days, between the 12th and the 21st of December. It is true that, once arrived, the affair on board the Henrietta, added to that of the Bank of England, might create more difficulties for Mr. Fogg than he imagined or could desire.",
  "During the first days, they went along smoothly enough. The sea was not very unpropitious, the wind seemed stationary in the northeast, the sails were hoisted, and the Henrietta ploughed across the waves like a real transatlantic steamer.",
  "Passepartout was delighted. His master’s last exploit, the consequences of which he ignored, enchanted him. Never had the crew seen so jolly and dexterous a fellow. He formed warm friendships with the sailors, and amazed them with his acrobatic feats. He thought they managed the vessel like gentlemen, and that the stokers fired up like heroes. His loquacious good-humour infected everyone. He had forgotten the past, its vexations and delays. He only thought of the end, so nearly accomplished; and sometimes he boiled over with impatience, as if heated by the furnaces of the Henrietta. Often, also, the worthy fellow revolved around Fix, looking at him with a keen, distrustful eye; but he did not speak to him, for their old intimacy no longer existed.",
  "Fix, it must be confessed, understood nothing of what was going on. The conquest of the Henrietta, the bribery of the crew, Fogg managing the boat like a skilled seaman, amazed and confused him. He did not know what to think. For, after all, a man who began by stealing fifty-five thousand pounds might end by stealing a vessel; and Fix was not unnaturally inclined to conclude that the Henrietta under Fogg’s command, was not going to Liverpool at all, but to some part of the world where the robber, turned into a pirate, would quietly put himself in safety. The conjecture was at least a plausible one, and the detective began to seriously regret that he had embarked on the affair.",
  "As for Captain Speedy, he continued to howl and growl in his cabin; and Passepartout, whose duty it was to carry him his meals, courageous as he was, took the greatest precautions. Mr. Fogg did not seem even to know that there was a captain on board.",
  "On the 13th they passed the edge of the Banks of Newfoundland, a dangerous locality; during the winter, especially, there are frequent fogs and heavy gales of wind. Ever since the evening before the barometer, suddenly falling, had indicated an approaching change in the atmosphere; and during the night the temperature varied, the cold became sharper, and the wind veered to the southeast.",
  "This was a misfortune. Mr. Fogg, in order not to deviate from his course, furled his sails and increased the force of the steam; but the vessel’s speed slackened, owing to the state of the sea, the long waves of which broke against the stern. She pitched violently, and this retarded her progress. The breeze little by little swelled into a tempest, and it was to be feared that the Henrietta might not be able to maintain herself upright on the waves.",
  "Passepartout’s visage darkened with the skies, and for two days the poor fellow experienced constant fright. But Phileas Fogg was a bold mariner, and knew how to maintain headway against the sea; and he kept on his course, without even decreasing his steam. The Henrietta, when she could not rise upon the waves, crossed them, swamping her deck, but passing safely. Sometimes the screw rose out of the water, beating its protruding end, when a mountain of water raised the stern above the waves; but the craft always kept straight ahead.",
  "The wind, however, did not grow as boisterous as might have been feared; it was not one of those tempests which burst, and rush on with a speed of ninety miles an hour. It continued fresh, but, unhappily, it remained obstinately in the southeast, rendering the sails useless.",
  "The 16th of December was the seventy-fifth day since Phileas Fogg’s departure from London, and the Henrietta had not yet been seriously delayed. Half of the voyage was almost accomplished, and the worst localities had been passed. In summer, success would have been well-nigh certain. In winter, they were at the mercy of the bad season. Passepartout said nothing; but he cherished hope in secret, and comforted himself with the reflection that, if the wind failed them, they might still count on the steam.",
  "On this day the engineer came on deck, went up to Mr. Fogg, and began to speak earnestly with him. Without knowing why it was a presentiment, perhaps Passepartout became vaguely uneasy. He would have given one of his ears to hear with the other what the engineer was saying. He finally managed to catch a few words, and was sure he heard his master say, “You are certain of what you tell me?”",
  "“Certain, sir,” replied the engineer. “You must remember that, since we started, we have kept up hot fires in all our furnaces, and, though we had coal enough to go on short steam from New York to Bordeaux, we haven’t enough to go with all steam from New York to Liverpool.”",
  "“I will consider,” replied Mr. Fogg.",
  "Passepartout understood it all; he was seized with mortal anxiety. The coal was giving out! “Ah, if my master can get over that,” muttered he, “he’ll be a famous man!” He could not help imparting to Fix what he had overheard.",
  "“Then you believe that we really are going to Liverpool?”",
  "“Of course.”",
  "“Ass!” replied the detective, shrugging his shoulders and turning on his heel.",
  "Passepartout was on the point of vigorously resenting the epithet, the reason of which he could not for the life of him comprehend; but he reflected that the unfortunate Fix was probably very much disappointed and humiliated in his self-esteem, after having so awkwardly followed a false scent around the world, and refrained.",
  "And now what course would Phileas Fogg adopt? It was difficult to imagine. Nevertheless he seemed to have decided upon one, for that evening he sent for the engineer, and said to him, “Feed all the fires until the coal is exhausted.”",
  "A few moments after, the funnel of the Henrietta vomited forth torrents of smoke. The vessel continued to proceed with all steam on; but on the 18th, the engineer, as he had predicted, announced that the coal would give out in the course of the day.",
  "“Do not let the fires go down,” replied Mr. Fogg. “Keep them up to the last. Let the valves be filled.”",
  "Towards noon Phileas Fogg, having ascertained their position, called Passepartout, and ordered him to go for Captain Speedy. It was as if the honest fellow had been commanded to unchain a tiger. He went to the poop, saying to himself, “He will be like a madman!”",
  "In a few moments, with cries and oaths, a bomb appeared on the poop-deck. The bomb was Captain Speedy. It was clear that he was on the point of bursting. “Where are we?” were the first words his anger permitted him to utter. Had the poor man been an apoplectic, he could never have recovered from his paroxysm of wrath.",
  "“Where are we?” he repeated, with purple face.",
  "“Seven hundred and seven miles from Liverpool,” replied Mr. Fogg, with imperturbable calmness.",
  "“Pirate!” cried Captain Speedy.",
  "“I have sent for you, sir⁠—”",
  "“Pickaroon!”",
  "“⁠—sir,” continued Mr. Fogg, “to ask you to sell me your vessel.”",
  "“No! By all the devils, no!”",
  "“But I shall be obliged to burn her.”",
  "“Burn the Henrietta!”",
  "“Yes; at least the upper part of her. The coal has given out.”",
  "“Burn my vessel!” cried Captain Speedy, who could scarcely pronounce the words. “A vessel worth fifty thousand dollars!”",
  "“Here are sixty thousand,” replied Phileas Fogg, handing the captain a roll of bank-bills. This had a prodigious effect on Andrew Speedy. An American can scarcely remain unmoved at the sight of sixty thousand dollars. The captain forgot in an instant his anger, his imprisonment, and all his grudges against his passenger. The Henrietta was twenty years old; it was a great bargain. The bomb would not go off after all. Mr. Fogg had taken away the match.",
  "“And I shall still have the iron hull,” said the captain in a softer tone.",
  "“The iron hull and the engine. Is it agreed?”",
  "“Agreed.”",
  "And Andrew Speedy, seizing the banknotes, counted them and consigned them to his pocket.",
  "During this colloquy, Passepartout was as white as a sheet, and Fix seemed on the point of having an apoplectic fit. Nearly twenty thousand pounds had been expended, and Fogg left the hull and engine to the captain, that is, near the whole value of the craft! It was true, however, that fifty-five thousand pounds had been stolen from the Bank.",
  "When Andrew Speedy had pocketed the money, Mr. Fogg said to him, “Don’t let this astonish you, sir. You must know that I shall lose twenty thousand pounds, unless I arrive in London by a quarter before nine on the evening of the 21st of December. I missed the steamer at New York, and as you refused to take me to Liverpool⁠—”",
  "“And I did well!” cried Andrew Speedy; “for I have gained at least forty thousand dollars by it!” He added, more sedately, “Do you know one thing, Captain⁠—”",
  "“Fogg.”",
  "“Captain Fogg, you’ve got something of the Yankee about you.”",
  "And, having paid his passenger what he considered a high compliment, he was going away, when Mr. Fogg said, “The vessel now belongs to me?”",
  "“Certainly, from the keel to the truck of the masts⁠—all the wood, that is.”",
  "“Very well. Have the interior seats, bunks, and frames pulled down, and burn them.”",
  "It was necessary to have dry wood to keep the steam up to the adequate pressure, and on that day the poop, cabins, bunks, and the spare deck were sacrificed. On the next day, the 19th of December, the masts, rafts, and spars were burned; the crew worked lustily, keeping up the fires. Passepartout hewed, cut, and sawed away with all his might. There was a perfect rage for demolition.",
  "The railings, fittings, the greater part of the deck, and top sides disappeared on the 20th, and the Henrietta was now only a flat hulk. But on this day they sighted the Irish coast and Fastnet Light. By ten in the evening they were passing Queenstown. Phileas Fogg had only twenty-four hours more in which to get to London; that length of time was necessary to reach Liverpool, with all steam on. And the steam was about to give out altogether!",
  "“Sir,” said Captain Speedy, who was now deeply interested in Mr. Fogg’s project, “I really commiserate you. Everything is against you. We are only opposite Queenstown.”",
  "“Ah,” said Mr. Fogg, “is that place where we see the lights Queenstown?”",
  "“Yes.”",
  "“Can we enter the harbour?”",
  "“Not under three hours. Only at high tide.”",
  "“Stay,” replied Mr. Fogg calmly, without betraying in his features that by a supreme inspiration he was about to attempt once more to conquer ill-fortune.",
  "Queenstown is the Irish port at which the trans-Atlantic steamers stop to put off the mails. These mails are carried to Dublin by express trains always held in readiness to start; from Dublin they are sent on to Liverpool by the most rapid boats, and thus gain twelve hours on the Atlantic steamers.",
  "Phileas Fogg counted on gaining twelve hours in the same way. Instead of arriving at Liverpool the next evening by the Henrietta, he would be there by noon, and would therefore have time to reach London before a quarter before nine in the evening.",
  "The Henrietta entered Queenstown Harbour at one o’clock in the morning, it then being high tide; and Phileas Fogg, after being grasped heartily by the hand by Captain Speedy, left that gentleman on the levelled hulk of his craft, which was still worth half what he had sold it for.",
  "The party went on shore at once. Fix was greatly tempted to arrest Mr. Fogg on the spot; but he did not. Why? What struggle was going on within him? Had he changed his mind about “his man”? Did he understand that he had made a grave mistake? He did not, however, abandon Mr. Fogg. They all got upon the train, which was just ready to start, at half-past one; at dawn of day they were in Dublin; and they lost no time in embarking on a steamer which, disdaining to rise upon the waves, invariably cut through them.",
  "Phileas Fogg at last disembarked on the Liverpool quay, at twenty minutes before twelve, 21st December. He was only six hours distant from London.",
  "But at this moment Fix came up, put his hand upon Mr. Fogg’s shoulder, and, showing his warrant, said, “You are really Phileas Fogg?”",
  "“I am.”",
  "“I arrest you in the Queen’s name!”"
];
const arabic=[
  "بعد ساعة، مرّت «هنرييتا» بالمنارة التي تحدد مدخل نهر هدسون، والتفت حول رأس ساندي هوك ثم خرجت إلى عرض البحر. وخلال النهار سارت بمحاذاة لونغ آيلاند، واجتازت جزيرة فاير، ومضت سريعًا شرقًا.",
  "عند ظهر اليوم التالي، صعد رجل إلى الجسر ليتحقق من موقع السفينة. قد يظن المرء أنه القبطان سبيدي، لكن الأمر لم يكن كذلك إطلاقًا؛ بل كان السيد فيلياس فوج. أما القبطان سبيدي فكان حبيس مقصورته خلف القفل والمفتاح، يطلق صيحات غاضبة يمكن تفهّمها، وإن تجاوزت حدها.",
  "كان ما حدث بسيطًا جدًا. أراد فوج الوصول إلى ليفربول، لكن القبطان رفض نقله إليها. فحجز فوج رحلة إلى بوردو، وخلال الساعات الثلاثين التي قضاها على متن السفينة استخدم أوراقه النقدية بذكاء حتى انضم إليه البحارة وعمال الأفران، وهم طاقم مؤقت لم تكن علاقته بالقبطان على ما يرام. وهكذا صار فوج قائدًا بدل سبيدي، وأُودع القبطان مقصورته، واتجهت «هنرييتا» إلى ليفربول. وكان واضحًا من طريقة فوج في إدارة السفينة أنه سبق أن عمل بحّارًا.",
  "ستتضح نهاية المغامرة لاحقًا. كانت أودا قلقة، وإن لم تقل شيئًا. أما باسبارتو فعدّ مناورة سيده رائعة. كان القبطان قد قال إن سرعتها بين إحدى عشرة واثنتي عشرة عقدة، وأكدت «هنرييتا» صحة توقعه.",
  "إذا لم يشتد اضطراب البحر، ولم تنحرف الريح إلى الشرق، ولم يقع عطل في السفينة أو آلاتها، فقد تعبر «هنرييتا» الأميال الثلاثة آلاف بين نيويورك وليفربول خلال الأيام التسعة من الثاني عشر إلى الحادي والعشرين من ديسمبر. غير أن ما جرى على متنها، مضافًا إلى قضية بنك إنجلترا، قد يخلق للسيد فوج متاعب أكثر مما تخيل أو أراد.",
  "مرّت الأيام الأولى بسلاسة معقولة. لم يكن البحر شديد العناد، وبدا أن الريح ثابتة من الشمال الشرقي، ورُفعت الأشرعة، وشقّت «هنرييتا» الأمواج كما تفعل سفينة حقيقية تعبر الأطلسي.",
  "كان باسبارتو في غاية السرور. فقد أسعده إنجاز سيده الأخير، مع أنه لم يعرف عواقبه. ولم يرَ الطاقم قط رجلًا مرحًا وماهرًا مثله؛ صادق البحارة وأدهشهم بحركاته البهلوانية. وأعجب بطريقة عملهم، ورأى أن عمال الأفران يوقدون النار كالأبطال. وانتقلت خفة ظله إلى الجميع. نسي ما سبق من متاعب وتأخيرات، ولم يعد يفكر إلا في النهاية التي اقتربت؛ وكان يغلي أحيانًا من نفاد الصبر كأنه يسخن في أفران «هنرييتا». وكان يطوف حول فيكس ويرمقه بريبة، لكنه لم يعد يكلمه، إذ انقطعت الألفة القديمة بينهما.",
  "لم يكن فيكس، باعترافنا، يفهم ما يجري. فقد حيّره استيلاء فوج على «هنرييتا» وإغراؤه الطاقم وإدارته السفينة كبحّار خبير. ولم يعرف ما الذي ينبغي أن يصدقه؛ فالرجل الذي بدأ بسرقة خمسة وخمسين ألف جنيه قد ينتهي بسرقة سفينة أيضًا. لذلك مال المحقق إلى الاعتقاد بأن فوج لن يتجه إلى ليفربول، بل سيهرب بالسفينة إلى مكان بعيد بصفته قرصانًا. وكان ذلك احتمالًا معقولًا، وبدأ فيكس يندم بجدية على دخوله في هذه القضية.",
  "ظل القبطان سبيدي يعوي ويتذمر في مقصورته، وكان باسبارتو يتولى إيصال وجباته، فيتخذ أقصى درجات الحذر رغم شجاعته. أما السيد فوج فبدا كأنه لا يعلم بوجود قبطان على متن السفينة أصلًا.",
  "في الثالث عشر من الشهر مرّوا بمحاذاة ضفاف نيوفاوندلاند، وهي منطقة خطرة تكثر فيها الضبابات والعواصف الشتوية. ومنذ المساء السابق كان مقياس الضغط يهبط فجأة، مشيرًا إلى تغير قريب في الجو. وخلال الليل تبدلت الحرارة واشتد البرد وانحرفت الريح إلى الجنوب الشرقي.",
  "كانت تلك نكسة. ولكيلا يغيّر فوج مساره، طوى الأشرعة وزاد قوة البخار؛ لكن سرعة السفينة تباطأت بسبب حالة البحر، إذ كانت الأمواج الطويلة تضرب المؤخرة. راحت السفينة تتمايل بعنف، وأخذ النسيم يتحول تدريجيًا إلى عاصفة، حتى خُشي ألا تتمكن «هنرييتا» من البقاء مستقيمة فوق الأمواج.",
  "اسودّ وجه باسبارتو مع اسوداد السماء، وعاش يومين في خوف دائم. لكن فوج كان بحّارًا جريئًا يعرف كيف يحافظ على تقدم السفينة في مواجهة البحر، فواصل المسير دون أن يقلل البخار. وحين تعجز «هنرييتا» عن اعتلاء الموج كانت تخترقه، فتغمر المياه سطحها ثم تمضي سالمة. وأحيانًا يخرج المسمار الدافع من الماء ويضرب الهواء، بينما ترفع كتلة مائية المؤخرة فوق الموج؛ ومع ذلك ظلت السفينة تتقدم مباشرة.",
  "لم تشتد الريح، لحسن الحظ، كما خُشي؛ فلم تكن إحدى تلك العواصف التي تنفجر وتندفع بسرعة تسعين ميلًا في الساعة. بقيت قوية، لكنها ظلت بعناد من الجنوب الشرقي، فصارت الأشرعة بلا فائدة.",
  "كان السادس عشر من ديسمبر اليوم الخامس والسبعين منذ مغادرة فوج لندن، ولم تتعرض «هنرييتا» لتأخير خطير. كاد نصف الرحلة أن يكتمل، وقد تجاوزوا أخطر المناطق. لو كان الفصل صيفًا لكان النجاح شبه مؤكد، أما في الشتاء فكانوا تحت رحمة الطقس السيئ. لم يقل باسبارتو شيئًا، لكنه احتفظ بالأمل سرًا وعزّى نفسه بأنهم يستطيعون الاعتماد على البخار إذا خذلتهم الريح.",
  "في ذلك اليوم صعد المهندس إلى السطح وتحدث مع فوج بجدية. ولم يعرف باسبارتو السبب، لكن حدسًا غامضًا جعله قلقًا. كان مستعدًا للتضحية بإحدى أذنيه كي يسمع الحديث بالأخرى. وتمكن أخيرًا من التقاط كلمات قليلة، وظن أنه سمع سيده يسأل: «أأنت متأكد مما تقوله؟»",
  "«متأكد يا سيدي»، أجاب المهندس. «عليك أن تتذكر أننا أبقينا النيران مشتعلة في كل الأفران منذ انطلاقنا. ومع أن الفحم كان يكفينا للسير بالبخار المنخفض من نيويورك إلى بوردو، فإنه لا يكفي للسير بأقصى قوة من نيويورك إلى ليفربول».",
  "«سأفكر في الأمر»، أجاب السيد فوج.",
  "فهم باسبارتو كل شيء، فاستولى عليه قلق قاتل. الفحم ينفد! وتمتم: «آه، لو استطاع سيدي تجاوز هذه العقبة لصار رجلًا عظيمًا!» ولم يستطع منع نفسه من إخبار فيكس بما سمع.",
  "«إذن تعتقد أننا ذاهبون حقًا إلى ليفربول؟»",
  "«بالطبع».",
  "«أحمق!» قال المحقق وهو يهز كتفيه ويدير ظهره.",
  "كاد باسبارتو يردّ الإهانة بعنف، ولم يفهم سببها مهما حاول؛ لكنه فكر في أن فيكس ربما كان محبطًا ومهانًا بعد أن تبع أثرًا زائفًا حول العالم بهذه الطريقة المرتبكة، فكفّ عن الرد.",
  "ما الخطة التي سيختارها فوج؟ كان من الصعب تخمينها. ومع ذلك بدا أنه حسم أمره؛ ففي المساء استدعى المهندس وقال له: «أبقِ كل النيران مشتعلة حتى ينفد الفحم».",
  "بعد لحظات قذف مدخن «هنرييتا» سحبًا كثيفة من الدخان. وواصلت السفينة السير بأقصى بخار، لكن المهندس أعلن في الثامن عشر أن الفحم سينفد خلال ذلك اليوم، كما توقع.",
  "«لا تدع النيران تخبو»، قال فوج. «أبقها مشتعلة حتى النهاية، وليُملأ الضغط في الصمامات».",
  "قبيل الظهر، وبعد أن حدد فوج موقعهم، استدعى باسبارتو وأمره بإحضار القبطان سبيدي. شعر الرجل الصادق كأنه كُلّف بإطلاق نمر من قفصه، وصعد إلى المؤخرة وهو يقول لنفسه: «سيكون كالمجنون!»",
  "وبعد لحظات ظهر على سطح المؤخرة رجل يصرخ ويلعن، كأنه قنبلة توشك أن تنفجر: كان ذلك القبطان سبيدي. وأول ما سمحت له ثورة غضبه أن ينطق به كان: «أين نحن؟» ولو كان الرجل مصابًا بسكتة لربما لم ينجُ من نوبة الغضب.",
  "كرر السؤال ووجهه أرجواني من الغيظ: «أين نحن؟»",
  "«على بُعد سبعمئة وسبعة أميال من ليفربول»، أجاب فوج بهدوء لا يتزعزع.",
  "«قرصان!» صاح القبطان سبيدي.",
  "«طلبت حضورك يا سيدي—»",
  "«لصّ بحر!»",
  "«—يا سيدي»، تابع فوج، «لأطلب منك أن تبيعني سفينتك».",
  "«لا! أقسم بكل الشياطين، لا!»",
  "«لكنني سأضطر إلى إحراقها».",
  "«أتحرق «هنرييتا»؟!»",
  "«نعم، أو على الأقل الجزء العلوي منها. لقد نفد الفحم».",
  "«أحرق سفينتي!» صاح سبيدي بالكاد قادرًا على نطق الكلمات. «سفينة قيمتها خمسون ألف دولار!»",
  "«هاك ستون ألفًا»، قال فوج وهو يناوله لفافة من الأوراق النقدية. كان لذلك أثر هائل في أندرو سبيدي؛ فقلّما يبقى أمريكي غير مبالٍ أمام ستين ألف دولار. نسي القبطان في لحظة غضبه وسجنه وضغائنه تجاه الراكب. كانت «هنرييتا» قد بلغت عشرين عامًا، وكانت الصفقة رابحة. لن تنفجر القنبلة بعد الآن؛ فقد انتزع فوج عود الثقاب.",
  "«وسيبقى لي الهيكل الحديدي»، قال القبطان بنبرة أهدأ.",
  "«الهيكل الحديدي والمحرك. هل اتفقنا؟»",
  "«اتفقنا».",
  "أمسك أندرو سبيدي بالأوراق النقدية وعدّها ثم دسّها في جيبه.",
  "خلال هذا الحوار كان باسبارتو شاحبًا كالورقة، وبدا فيكس على وشك الإصابة بسكتة. فقد أنفق فوج ما يقارب عشرين ألف جنيه، وترك الهيكل والمحرك للقبطان، أي إنه تنازل عن معظم قيمة السفينة. ومع ذلك كان صحيحًا أن خمسة وخمسين ألف جنيه قد سُرقت من البنك.",
  "بعدما وضع سبيدي المال في جيبه، قال له فوج: «لا تدع الأمر يدهشك يا سيدي. عليك أن تعلم أنني سأخسر عشرين ألف جنيه إن لم أصل إلى لندن قبل التاسعة إلا ربعًا مساء الحادي والعشرين من ديسمبر. لقد فاتتني السفينة البخارية في نيويورك، ولما رفضت نقلِي إلى ليفربول—»",
  "«وقد أحسنت صنعًا!» صاح سبيدي. «فقد ربحت من ذلك أربعين ألف دولار على الأقل!» ثم أضاف بنبرة أكثر هدوءًا: «أتعرف شيئًا يا كابتن—»",
  "«فوج».",
  "وبعد أن قدّم لراكبه ما عدّه إطراءً كبيرًا، همّ بالانصراف، لكن فوج سأله: «هل أصبحت السفينة ملكي الآن؟»",
  "«بالتأكيد، من العارضة إلى قمة الصواري—أعني كل ما هو خشب».",
  "«حسنًا. فكّ المقاعد الداخلية والأسرّة والهياكل الخشبية وأحرقها».",
  "كان لا بد من خشب جاف للحفاظ على ضغط البخار الكافي؛ لذلك ضُحّي في ذلك اليوم بالسطح الخلفي والمقصورات والأسرّة والسطح الاحتياطي. وفي اليوم التالي، التاسع عشر من ديسمبر، أُحرقت الصواري والطوافات والعوارض، وعمل الطاقم بنشاط لإبقاء النيران مشتعلة. وكان باسبارتو يقطع الخشب وينشره بكل قوته، وقد استبدت بالجميع رغبة جامحة في التفكيك.",
  "اختفت الدرابزينات والتجهيزات ومعظم السطح والجوانب في العشرين من ديسمبر، ولم تعد «هنرييتا» سوى هيكل مسطّح. لكنهم أبصروا الساحل الإيرلندي ومنارة فاستنت في ذلك اليوم. وعند العاشرة مساءً كانوا يمرون بكوينزتاون. لم يبقَ لفوج سوى أربع وعشرين ساعة للوصول إلى لندن، وكان الوصول إلى ليفربول بأقصى بخار يتطلب هذا الوقت كله تقريبًا؛ فيما كان البخار على وشك النفاد تمامًا.",
  "«سيدي»، قال القبطان سبيدي الذي صار مهتمًا بمشروع فوج، «أنا أشفق عليك حقًا. كل شيء ضدك. نحن قبالة كوينزتاون فحسب».",
  "«آه»، قال فوج، «أذلك المكان الذي نرى أضواءه هو كوينزتاون؟»",
  "«نعم».",
  "«هل نستطيع دخول المرفأ؟»",
  "«ليس قبل ثلاث ساعات، عند المد العالي فقط».",
  "«انتظر»، قال فوج بهدوء، دون أن يكشف وجهه أنه يستعد، بإلهام حاسم، لمحاولة جديدة لقهر سوء الحظ.",
  "كوينزتاون ميناء إيرلندي تتوقف عنده السفن العابرة للأطلسي لتسليم البريد. وتنقل القطارات السريعة هذه الرسائل إلى دبلن، وتكون جاهزة للانطلاق، ثم تُرسل من دبلن إلى ليفربول بأسرع السفن، فتختصر اثنتي عشرة ساعة مقارنة بالسفن القادمة مباشرة عبر الأطلسي.",
  "كان فوج يخطط لكسب الاثنتي عشرة ساعة نفسها. فبدلًا من الوصول إلى ليفربول مساء اليوم التالي على متن «هنرييتا»، سيصل عند الظهر، وبذلك يتاح له الوقت لبلوغ لندن قبل التاسعة إلا ربعًا مساءً.",
  "دخلت «هنرييتا» مرفأ كوينزتاون في الواحدة صباحًا، حين كان المد عاليًا. وبعد أن صافح فوج القبطان سبيدي بحرارة، تركه فوق الهيكل المسطّح لسفينته، الذي ظلّ يساوي نصف الثمن الذي باعه به.",
  "نزلت المجموعة إلى البر فورًا. كاد فيكس يعتقل فوج في المكان، لكنه لم يفعل. لماذا؟ أي صراع كان يدور في داخله؟ هل غيّر رأيه في الرجل الذي يطارده؟ هل أدرك أنه ارتكب خطأ جسيمًا؟ ومع ذلك لم يبتعد عن فوج. استقل الجميع القطار المستعد للمغادرة في الواحدة والنصف، ووصلوا دبلن عند الفجر، ثم أسرعوا إلى سفينة لم تكن ترتفع فوق الأمواج بقدر ما تشقّها مباشرة.",
  "وأخيرًا نزل فوج على رصيف ليفربول عند الساعة الثانية عشرة إلا عشرين دقيقة، في الحادي والعشرين من ديسمبر. ولم يعد يفصله عن لندن سوى ست ساعات.",
  "لكن في هذه اللحظة اقترب فيكس ووضع يده على كتف السيد فوج، وأبرز مذكرة الاعتقال وقال:",
  "«أأنت حقًا فيلياس فوج؟»",
  "«أنا هو».",
  "«أعتقلك باسم الملكة!»"
];
if(english.length!==67||arabic.length!==english.length)throw Error('Towle XXXIII bilingual paragraph alignment mismatch');
const terms=[
  {
    "term": "put to sea",
    "literal": "أبحر إلى عرض البحر",
    "context": "غادر الساحل وبدأ الإبحار في البحر المفتوح",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "under lock and key",
    "literal": "محبوس خلف القفل والمفتاح",
    "context": "محتجز داخل مكان مغلق لا يستطيع مغادرته",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "went over to him",
    "literal": "انضموا إلى صفّه",
    "context": "انتقلوا إلى تأييده بدلًا من القبطان",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "in command",
    "literal": "يتولى القيادة",
    "context": "يمتلك سلطة توجيه السفينة والطاقم",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "boisterous",
    "literal": "هائج وعنيف",
    "context": "يصف البحر أو الريح حين يشتد اضطرابهما",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "word"
  },
  {
    "term": "veer round",
    "literal": "ينحرف باتجاه",
    "context": "يتغير اتجاه الريح أو الحركة إلى جهة أخرى",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "furled his sails",
    "literal": "طوى أشرعته",
    "context": "جمع الأشرعة لتقليل تأثير الريح عليها",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "maintain headway",
    "literal": "يحافظ على التقدّم",
    "context": "يستمر في إحراز مسافة إلى الأمام رغم المقاومة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "at the mercy of",
    "literal": "تحت رحمة",
    "context": "لا يملك السيطرة على الظروف المؤثرة فيه",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "give out",
    "literal": "ينفد أو يتوقف",
    "context": "يتوقف الوقود أو المورد عن الكفاية",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "presentiment",
    "literal": "حدس مسبق",
    "context": "شعور غامض بأن أمرًا ما سيحدث",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "word"
  },
  {
    "term": "turning on his heel",
    "literal": "استدار على عقبه",
    "context": "استدار فجأة ومضى في الاتجاه الآخر",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "false scent",
    "literal": "أثر زائف",
    "context": "قرينة مضللة يتبعها المحقق بعيدًا عن الحقيقة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "all steam on",
    "literal": "بأقصى قوة بخارية",
    "context": "تشغيل المحرك بأقصى ما تسمح به قدرته",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "poop-deck",
    "literal": "سطح المؤخرة",
    "context": "السطح المرتفع في مؤخرة السفينة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "word"
  },
  {
    "term": "apoplectic fit",
    "literal": "نوبة سكتة",
    "context": "وصف تاريخي لنوبة مفاجئة شديدة من الغضب أو المرض",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "imperturbable calmness",
    "literal": "هدوء لا يتزعزع",
    "context": "ثبات انفعالي لا تهزه الاستفزازات",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "taken away the match",
    "literal": "انتزع عود الثقاب",
    "context": "أوقف لحظة الانفجار مجازًا بإزالة ما يشعلها",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "iron hull",
    "literal": "هيكل حديدي",
    "context": "الجزء الخارجي البنيوي للسفينة المصنوع من الحديد",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "from the keel to the truck",
    "literal": "من العارضة إلى قمة السارية",
    "context": "تعبير عن امتداد السفينة من أسفلها إلى أعلاها",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "keep the steam up",
    "literal": "يحافظ على ضغط البخار",
    "context": "يبقي النار والضغط كافيين لاستمرار عمل المحرك",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "sighted the Irish coast",
    "literal": "أبصر الساحل الإيرلندي",
    "context": "رأى اليابسة من البحر لأول مرة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "at high tide",
    "literal": "وقت المد العالي",
    "context": "حين يبلغ مستوى ماء البحر ارتفاعه الأكبر في دورة المد",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "put off the mails",
    "literal": "إنزال البريد",
    "context": "تفريغ الرسائل من السفينة لنقلها برًا",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "express trains",
    "literal": "قطارات سريعة",
    "context": "قطارات تقلل التوقفات لقطع المسافة بسرعة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "disembarked",
    "literal": "نزل من السفينة",
    "context": "انتقل من وسيلة النقل البحرية إلى اليابسة",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "word"
  },
  {
    "term": "showing his warrant",
    "literal": "مُبرزًا مذكرة الاعتقال",
    "context": "يعرض وثيقة رسمية تمنحه صلاحية القبض",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "in the Queen’s name",
    "literal": "باسم الملكة",
    "context": "صيغة رسمية لإعلان تنفيذ سلطة التاج",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "a keen, distrustful eye",
    "literal": "نظرة حادّة مرتابة",
    "context": "مراقبة دقيقة يرافقها الشك",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "loquacious good-humour",
    "literal": "مرح كثير الكلام",
    "context": "خفة ظل تترافق مع كثرة الحديث",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "a perfect rage for demolition",
    "literal": "اندفاع جامح نحو التفكيك",
    "context": "حماس شديد لهدم الأجزاء وإزالتها",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "the sails useless",
    "literal": "الأشرعة بلا فائدة",
    "context": "الأشرعة لا تدفع السفينة بسبب اتجاه الريح",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "by a supreme inspiration",
    "literal": "بإلهام حاسم",
    "context": "بفكرة مفاجئة تبدو وكأنها تنقذ الموقف",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "twelve hours",
    "literal": "اثنتا عشرة ساعة",
    "context": "الفارق الزمني الذي توفره خطة نقل البريد عبر إيرلندا",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  },
  {
    "term": "the Queen’s name",
    "literal": "اسم الملكة",
    "context": "مرجعية السلطة القانونية التي يستند إليها الاعتقال",
    "note": "Chapter XXXIII: Atlantic crossing and arrest",
    "type": "phrase"
  }
];
const body=english.join(' ');
if(terms.some(t=>!body.toLowerCase().includes(t.term.toLowerCase())||!t.literal||!t.context||!t.note))throw Error('Towle XXXIII contextual glossary validation failed');
if(arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXIII Arabic draft missing');
s.chapters.push({title:'In which Phileas Fogg shows himself equal to the occasion.',titleAr:'الفصل الثالث والثلاثون — حيث يثبت فيلياس فوج أنه أهل للموقف',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXIII';
s.description='The Henrietta races through the Atlantic storm, and Fogg gambles everything on the Irish mail route.';
s.editorialStatus='English Chapters I–XXXIII source-transcribed; Arabic draft pending independent review; 33 of 37 chapters';
s.provenance+=' Chapter XXXIII: Standard Ebooks Towle transcription (source blob 22da80571dce2d37f9bfb1612f1c96ab9331c3c9; CC0 editorial edition; territory-specific rights pending review).';
})(window);
