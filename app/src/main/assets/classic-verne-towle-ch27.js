/* Lingua Tales — authentic Towle Chapter XXVII; Standard Ebooks CC0 editorial transcription.
 * Upstream path: src/epub/text/chapter-27.xhtml
 * Source commit: 56c82e97ff5d4f8950afca05b71af72688a8da34
 * Source blob SHA-1: 2475c77964fd4cdaf1a83b3e60a6c905e89d66f7; English source paragraphs normalized from XHTML.
 * Arabic is an editorial translation draft; independent literary proofreading and territory-specific rights review remain pending.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==26)throw Error('Towle chapter XXVII load order mismatch');
const english=[
  "During the night of the 5th of December, the train ran southeasterly for about fifty miles; then rose an equal distance in a northeasterly direction, towards the Great Salt Lake.",
  "Passepartout, about nine o’clock, went out upon the platform to take the air. The weather was cold, the heavens grey, but it was not snowing. The sun’s disc, enlarged by the mist, seemed an enormous ring of gold, and Passepartout was amusing himself by calculating its value in pounds sterling, when he was diverted from this interesting study by a strange-looking personage who made his appearance on the platform.",
  "This personage, who had taken the train at Elko, was tall and dark, with black moustache, black stockings, a black silk hat, a black waistcoat, black trousers, a white cravat, and dogskin gloves. He might have been taken for a clergyman. He went from one end of the train to the other, and affixed to the door of each car a notice written in manuscript.",
  "Passepartout approached and read one of these notices, which stated that Elder William Hitch, Mormon missionary, taking advantage of his presence on train No. 48, would deliver a lecture on Mormonism in car No. 117, from eleven to twelve o’clock; and that he invited all who were desirous of being instructed concerning the mysteries of the religion of the “Latter Day Saints” to attend.",
  "“I’ll go,” said Passepartout to himself. He knew nothing of Mormonism except the custom of polygamy, which is its foundation.",
  "The news quickly spread through the train, which contained about one hundred passengers, thirty of whom, at most, attracted by the notice, ensconced themselves in car No. 117. Passepartout took one of the front seats. Neither Mr. Fogg nor Fix cared to attend.",
  "At the appointed hour Elder William Hitch rose, and, in an irritated voice, as if he had already been contradicted, said, “I tell you that Joe Smith is a martyr, that his brother Hiram is a martyr, and that the persecutions of the United States Government against the prophets will also make a martyr of Brigham Young. Who dares to say the contrary?”",
  "No one ventured to gainsay the missionary, whose excited tone contrasted curiously with his naturally calm visage. No doubt his anger arose from the hardships to which the Mormons were actually subjected. The government had just succeeded, with some difficulty, in reducing these independent fanatics to its rule. It had made itself master of Utah, and subjected that territory to the laws of the Union, after imprisoning Brigham Young on a charge of rebellion and polygamy. The disciples of the prophet had since redoubled their efforts, and resisted, by words at least, the authority of Congress. Elder Hitch, as is seen, was trying to make proselytes on the very railway trains.",
  "Then, emphasising his words with his loud voice and frequent gestures, he related the history of the Mormons from Biblical times: how that, in Israel, a Mormon prophet of the tribe of Joseph published the annals of the new religion, and bequeathed them to his son Mormon; how, many centuries later, a translation of this precious book, which was written in Egyptian, was made by Joseph Smith, junior, a Vermont farmer, who revealed himself as a mystical prophet in 1825; and how, in short, the celestial messenger appeared to him in an illuminated forest, and gave him the annals of the Lord.",
  "Several of the audience, not being much interested in the missionary’s narrative, here left the car; but Elder Hitch, continuing his lecture, related how Smith, junior, with his father, two brothers, and a few disciples, founded the church of the “Latter Day Saints,” which, adopted not only in America, but in England, Norway and Sweden, and Germany, counts many artisans, as well as men engaged in the liberal professions, among its members; how a colony was established in Ohio, a temple erected there at a cost of two hundred thousand dollars, and a town built at Kirkland; how Smith became an enterprising banker, and received from a simple mummy showman a papyrus scroll written by Abraham and several famous Egyptians.",
  "The Elder’s story became somewhat wearisome, and his audience grew gradually less, until it was reduced to twenty passengers. But this did not disconcert the enthusiast, who proceeded with the story of Joseph Smith’s bankruptcy in 1837, and how his ruined creditors gave him a coat of tar and feathers; his reappearance some years afterwards, more honourable and honoured than ever, at Independence, Missouri, the chief of a flourishing colony of three thousand disciples, and his pursuit thence by outraged Gentiles, and retirement into the Far West.",
  "Ten hearers only were now left, among them honest Passepartout, who was listening with all his ears. Thus he learned that, after long persecutions, Smith reappeared in Illinois, and in 1839 founded a community at Nauvoo, on the Mississippi, numbering twenty-five thousand souls, of which he became mayor, chief justice, and general-in-chief; that he announced himself, in 1843, as a candidate for the Presidency of the United States; and that finally, being drawn into ambuscade at Carthage, he was thrown into prison, and assassinated by a band of men disguised in masks.",
  "Passepartout was now the only person left in the car, and the Elder, looking him full in the face, reminded him that, two years after the assassination of Joseph Smith, the inspired prophet, Brigham Young, his successor, left Nauvoo for the banks of the Great Salt Lake, where, in the midst of that fertile region, directly on the route of the emigrants who crossed Utah on their way to California, the new colony, thanks to the polygamy practised by the Mormons, had flourished beyond expectations.",
  "“And this,” added Elder William Hitch, “this is why the jealousy of Congress has been aroused against us! Why have the soldiers of the Union invaded the soil of Utah? Why has Brigham Young, our chief, been imprisoned, in contempt of all justice? Shall we yield to force? Never! Driven from Vermont, driven from Illinois, driven from Ohio, driven from Missouri, driven from Utah, we shall yet find some independent territory on which to plant our tents. And you, my brother,” continued the Elder, fixing his angry eyes upon his single auditor, “will you not plant yours there, too, under the shadow of our flag?”",
  "“No!” replied Passepartout courageously, in his turn retiring from the car, and leaving the Elder to preach to vacancy.",
  "During the lecture the train had been making good progress, and towards half-past twelve it reached the northwest border of the Great Salt Lake. Thence the passengers could observe the vast extent of this interior sea, which is also called the Dead Sea, and into which flows an American Jordan. It is a picturesque expanse, framed in lofty crags in large strata, encrusted with white salt—a superb sheet of water, which was formerly of larger extent than now, its shores having encroached with the lapse of time, and thus at once reduced its breadth and increased its depth.",
  "The Salt Lake, seventy miles long and thirty-five wide, is situated three miles eight hundred feet above the sea. Quite different from Lake Asphaltite, whose depression is twelve hundred feet below the sea, it contains considerable salt, and one quarter of the weight of its water is solid matter, its specific weight being 1,170, and, after being distilled, 1,000. Fishes are, of course, unable to live in it, and those which descend through the Jordan, the Weber, and other streams soon perish.",
  "The country around the lake was well cultivated, for the Mormons are mostly farmers; while ranches and pens for domesticated animals, fields of wheat, corn, and other cereals, luxuriant prairies, hedges of wild rose, clumps of acacias and milkwort, would have been seen six months later. Now the ground was covered with a thin powdering of snow.",
  "The train reached Ogden at two o’clock, where it rested for six hours, Mr. Fogg and his party had time to pay a visit to Salt Lake City, connected with Ogden by a branch road; and they spent two hours in this strikingly American town, built on the pattern of other cities of the Union, like a checkerboard, “with the sombre sadness of right-angles,” as Victor Hugo expresses it. The founder of the City of the Saints could not escape from the taste for symmetry which distinguishes the Anglo-Saxons. In this strange country, where the people are certainly not up to the level of their institutions, everything is done “squarely”—cities, houses, and follies.",
  "The travellers, then, were promenading, at three o’clock, about the streets of the town built between the banks of the Jordan and the spurs of the Wahsatch Range. They saw few or no churches, but the prophet’s mansion, the courthouse, and the arsenal, blue-brick houses with verandas and porches, surrounded by gardens bordered with acacias, palms, and locusts. A clay and pebble wall, built in 1853, surrounded the town; and in the principal street were the market and several hotels adorned with pavilions. The place did not seem thickly populated. The streets were almost deserted, except in the vicinity of the temple, which they only reached after having traversed several quarters surrounded by palisades. There were many women, which was easily accounted for by the “peculiar institution” of the Mormons; but it must not be supposed that all the Mormons are polygamists. They are free to marry or not, as they please; but it is worth noting that it is mainly the female citizens of Utah who are anxious to marry, as, according to the Mormon religion, maiden ladies are not admitted to the possession of its highest joys. These poor creatures seemed to be neither well off nor happy. Some—the more well-to-do, no doubt—wore short, open, black silk dresses, under a hood or modest shawl; others were habited in Indian fashion.",
  "Passepartout could not behold without a certain fright these women, charged, in groups, with conferring happiness on a single Mormon. His common sense pitied, above all, the husband. It seemed to him a terrible thing to have to guide so many wives at once across the vicissitudes of life, and to conduct them, as it were, in a body to the Mormon paradise with the prospect of seeing them in the company of the glorious Smith, who doubtless was the chief ornament of that delightful place, to all eternity. He felt decidedly repelled from such a vocation, and he imagined—perhaps he was mistaken—that the fair ones of Salt Lake City cast rather alarming glances on his person. Happily, his stay there was but brief. At four the party found themselves again at the station, took their places in the train, and the whistle sounded for starting. Just at the moment, however, that the locomotive wheels began to move, cries of “Stop! stop!” were heard.",
  "Trains, like time and tide, stop for no one. The gentleman who uttered the cries was evidently a belated Mormon. He was breathless with running. Happily for him, the station had neither gates nor barriers. He rushed along the track, jumped on the rear platform of the train, and fell, exhausted, into one of the seats.",
  "Passepartout, who had been anxiously watching this amateur gymnast, approached him with lively interest, and learned that he had taken flight after an unpleasant domestic scene.",
  "When the Mormon had recovered his breath, Passepartout ventured to ask him politely how many wives he had; for, from the manner in which he had decamped, it might be thought that he had twenty at least.",
  "“One, sir,” replied the Mormon, raising his arms heavenward—“one, and that was enough!”"
];
const arabic=[
  "في ليلة الخامس من ديسمبر، سار القطار نحو الجنوب الشرقي قرابة خمسين ميلًا، ثم قطع مسافة مماثلة باتجاه الشمال الشرقي نحو البحيرة المالحة الكبرى.",
  "نحو الساعة التاسعة، خرج باسبارتو إلى منصة القطار ليستنشق الهواء. كان الجو باردًا والسماء رمادية، من دون تساقط للثلج. وبدت قرص الشمس، وقد كبّر الضباب صورتها، كحلقة ذهبية هائلة. وكان باسبارتو يتسلى بحساب قيمتها بالجنيه الإسترليني حين شغله عن هذه الدراسة شخص غريب المظهر ظهر على المنصة.",
  "كان الرجل قد استقل القطار في إلكو؛ طويلًا، داكن البشرة، ذا شارب أسود وجوارب سوداء وقبعة حريرية سوداء وسترة سوداء وسروال أسود وربطة عنق بيضاء وقفازين من جلد الكلب. وكان يمكن أن يُظن رجل دين. تنقّل بين طرفي القطار وثبّت على باب كل عربة إعلانًا مكتوبًا بخط اليد.",
  "اقترب باسبارتو وقرأ أحد الإعلانات، وفيه أن الشيخ ويليام هيتش، المبشّر المورموني، سيستغل وجوده على القطار رقم 48 لإلقاء محاضرة عن المورمونية في العربة رقم 117 من الحادية عشرة حتى الثانية عشرة، ودعا كل من يرغب في معرفة أسرار ديانة «قديسي الأيام الأخيرة» إلى الحضور.",
  "قال باسبارتو لنفسه: «سأذهب». فلم يكن يعرف عن المورمونية شيئًا سوى عادة تعدد الزوجات التي اعتقد أنها أساسها.",
  "انتشر الخبر سريعًا في القطار الذي كان يقل نحو مئة مسافر. وجذب الإعلان ثلاثين شخصًا على الأكثر، فاستقروا في العربة رقم 117. وجلس باسبارتو في أحد المقاعد الأمامية، أما السيد فوغ وفيكس فلم يرغبا في الحضور.",
  "عند الموعد المحدد، نهض الشيخ ويليام هيتش وقال بصوت غاضب، كأنه تعرّض للاعتراض مسبقًا: «أقول لكم إن جو سميث شهيد، وإن أخاه هيرام شهيد، وإن اضطهاد حكومة الولايات المتحدة للأنبياء سيجعل من بريغهام يونغ شهيدًا أيضًا. من يجرؤ على قول غير ذلك؟»",
  "لم يجرؤ أحد على مخالفة المبشّر، وكان انفعاله لافتًا مقارنة بملامحه الهادئة بطبيعتها. ولعل غضبه نبع من المشقات التي تعرّض لها المورمون فعلًا. فقد نجحت الحكومة، بعد صعوبة، في إخضاع هذه الجماعة المستقلة لقوانين الاتحاد؛ وسيطرت على يوتا وأخضعتها للقانون بعد سجن بريغهام يونغ بتهمتي التمرد وتعدد الزوجات. ومنذ ذلك الحين ضاعف أتباع النبي جهودهم وقاوموا سلطة الكونغرس بالكلام على الأقل. وكما يتضح، كان الشيخ هيتش يحاول استقطاب أتباع حتى داخل قطارات السكك الحديدية.",
  "ثم شدّد على كلماته بصوته المرتفع وإيماءاته المتكررة، وراح يروي تاريخ المورمون منذ الأزمنة التوراتية: زاعمًا أن نبيًا مورمونيًا من سبط يوسف في إسرائيل نشر سجلات الدين الجديد وتركها لابنه مورمون؛ وأن ترجمة ذلك الكتاب الثمين، المكتوب بالمصرية، أُنجزت بعد قرون على يد جوزيف سميث الابن، وهو مزارع من فيرمونت أعلن نفسه نبيًا غيبيًا عام 1825؛ وأن رسولًا سماويًا ظهر له في غابة مضاءة وسلّمه سجلات الرب.",
  "غادر بعض الحاضرين العربة لأن رواية المبشّر لم تثر اهتمامهم كثيرًا، لكن الشيخ هيتش واصل المحاضرة. وروى كيف أسّس سميث الابن، مع أبيه وأخويه وقلة من الأتباع، كنيسة «قديسي الأيام الأخيرة»، التي انتشرت في أمريكا وإنجلترا والنرويج والسويد وألمانيا، وضمت حرفيين وأصحاب مهن فكرية. ثم تحدث عن مستعمرة في أوهايو ومعبد كلف بناؤه مئتي ألف دولار وبلدة في كيركلاند، وكيف أصبح سميث مصرفيًا طموحًا وتسلّم من عارض مومياوات بسيط لفافة بردي قال إنها كُتبت بيد إبراهيم وعدد من المصريين المشهورين.",
  "أصبحت حكاية الشيخ مملّة بعض الشيء، وبدأ جمهوره يتناقص حتى بقي عشرون راكبًا. لكن ذلك لم يثنِ المتحمّس؛ فتابع قصة إفلاس جوزيف سميث عام 1837، وكيف ألبسه دائِنوه الذين خسروا أموالهم معطفًا من القطران والريش. ثم عاد بعد سنوات، أكثر وجاهة واحترامًا من قبل، في إندبندنس بولاية ميزوري، زعيمًا لمستعمرة مزدهرة تضم ثلاثة آلاف تابع، قبل أن يطارده غير المنتمين إلى جماعته ويضطر إلى التراجع نحو الغرب البعيد.",
  "لم يبقَ سوى عشرة مستمعين، بينهم باسبارتو الصادق الذي كان يصغي بكل جوارحه. وتعلّم أن سميث عاد إلى إلينوي بعد اضطهاد طويل، وأسّس عام 1839 مجتمعًا في ناوفو على نهر المسيسيبي بلغ خمسة وعشرين ألف نسمة، وأصبح رئيس بلديته وقاضيه الأعلى وقائده العام. ثم أعلن ترشحه لرئاسة الولايات المتحدة عام 1843، قبل أن يُستدرج أخيرًا إلى كمين في كارثاج ويُلقى في السجن ويُغتال على يد مجموعة رجال ملثمين.",
  "أصبح باسبارتو المستمع الوحيد في العربة. ونظر الشيخ إليه مباشرة وذكّره بأن بريغهام يونغ، النبي الذي خلف جوزيف سميث، غادر ناوفو بعد اغتيال سميث بعامين متجهًا إلى ضفاف البحيرة المالحة الكبرى. وهناك، في منطقة خصبة تقع على طريق المهاجرين العابرين يوتا نحو كاليفورنيا، ازدهرت المستعمرة الجديدة، بحسب رواية الشيخ، بفضل تعدد الزوجات الذي مارسه المورمون.",
  "وأضاف الشيخ ويليام هيتش: «لهذا أثارنا حقد الكونغرس! لماذا غزت جنود الاتحاد أرض يوتا؟ ولماذا سُجن بريغهام يونغ زعيمنا في ازدراء للعدالة؟ أَنخضع للقوة؟ أبدًا! طُردنا من فيرمونت، ثم إلينوي، ثم أوهايو، ثم ميزوري، ثم يوتا؛ ومع ذلك سنجد أرضًا مستقلة ننصب فيها خيامنا. وأنت يا أخي»، تابع الشيخ محدقًا بعينين غاضبتين في مستمعه الوحيد، «ألن تنصب خيمتك هناك تحت رايتنا؟»",
  "أجاب باسبارتو بشجاعة: «لا!» ثم خرج بدوره من العربة، تاركًا الشيخ يعظ الفراغ.",
  "كان القطار يحرز تقدمًا جيدًا أثناء المحاضرة، ونحو الثانية عشرة والنصف بلغ الطرف الشمالي الغربي للبحيرة المالحة الكبرى. ومن هناك استطاع الركاب مشاهدة امتداد هذا البحر الداخلي الهائل، الذي يُسمّى أيضًا البحر الميت، ويصب فيه نهر يشبه الأردن الأمريكي. كان منظرًا خلابًا تحيط به صخور شاهقة ذات طبقات كبيرة مكسوّة بقشرة من الملح الأبيض؛ صفحة ماء رائعة كانت مساحتها أكبر في الماضي، ثم تراجعت شواطئها مع مرور الزمن، فقلّ عرضها وازداد عمقها.",
  "يبلغ طول البحيرة المالحة سبعين ميلًا وعرضها خمسة وثلاثين، وتقع على ارتفاع ثلاثة آلاف وثمانمئة قدم فوق سطح البحر. وهي تختلف تمامًا عن بحيرة الأسفلت، التي يقع سطحها على عمق ألف ومئتي قدم تحت مستوى البحر؛ إذ تحتوي البحيرة المالحة على قدر كبير من الملح، ويشكّل الملح والمواد الصلبة ربع وزن مياهها، وتبلغ كثافتها النوعية 1.170، وتنخفض إلى 1.000 بعد التقطير. وبالطبع لا تستطيع الأسماك العيش فيها، وتموت سريعًا تلك التي تنزل إليها عبر نهر الأردن ونهر ويبر والجداول الأخرى.",
  "كانت الأراضي المحيطة بالبحيرة مزروعة جيدًا، فمعظم المورمون مزارعون. وكان يمكن رؤية المزارع وأحواش الحيوانات المستأنسة وحقول القمح والذرة والحبوب الأخرى والبراري الغنية بالغطاء النباتي وأسوار الورد البري ومجموعات السنط ونباتات اللبن، لو كان الفصل بعد ستة أشهر. أما الآن فقد غطّت الأرض طبقة رقيقة من الثلج.",
  "وصل القطار إلى أوغدن في الثانية، وتوقف ست ساعات. وأتاح ذلك للسيد فوغ ورفاقه زيارة سولت ليك سيتي المتصلة بأوغدن بخط فرعي؛ فقضوا ساعتين في هذه المدينة ذات الطابع الأمريكي الواضح، المبنية على هيئة رقعة شطرنج، «بكآبة زواياها القائمة» على حد تعبير فيكتور هوغو. ولم يستطع مؤسس مدينة القديسين الإفلات من الميل إلى التناظر الذي يميز الأنغلوسكسونيين. ففي هذا البلد الغريب، حيث لا يبدو الناس على قدر مؤسساتهم، تُنفّذ الأمور كلها «بزوايا قائمة»؛ المدن والبيوت وحتى الحماقات.",
  "وفي الثالثة، كان المسافرون يتنزّهون في شوارع المدينة المبنية بين ضفاف الأردن وسفوح سلسلة واهساتش. لم يروا إلا قليلًا من الكنائس، لكنهم شاهدوا قصر النبي والمحكمة والترسانة وبيوتًا من الطوب الأزرق ذات شرفات وحدائق تحدّها أشجار السنط والنخيل والجراد. وكان سور من الطين والحصى بُني عام 1853 يحيط بالمدينة، وفي الشارع الرئيسي سوق وعدة فنادق مزينة بأجنحة. بدت المدينة قليلة السكان؛ فالشوارع شبه خالية إلا قرب المعبد الذي وصلوا إليه بعد عبور أحياء عديدة تحيط بها الأسوار. وكانت النساء كثيرات، وهو ما ربطه الراوي بالعُرف الاجتماعي المورموني آنذاك، لكن النص نفسه ينبه إلى أن المورمون لم يكونوا جميعًا متعددي الزوجات. كان لهم أن يتزوجوا أو لا يتزوجوا كما يشاؤون؛ ومع ذلك يذكر الراوي أن نساء يوتا كنّ أكثر حرصًا على الزواج، إذ إن الديانة المورمونية، وفق وصفه، لا تمنح غير المتزوجات أعلى مراتب النعيم. وبدت هؤلاء النساء فقيرات أو غير سعيدات؛ ارتدت بعضهن فساتين حريرية سوداء قصيرة ومفتوحة تحت غطاء أو شال محتشم، فيما لبست أخريات ملابس على الطراز الهندي.",
  "لم يستطع باسبارتو النظر بلا خوف إلى النساء اللواتي وُصفن بأنهن يجتمعن لإسعاد رجل مورموني واحد. وقد أشفق بحسه السليم، قبل الجميع، على الزوج نفسه. بدا له أمرًا مرعبًا أن يقود هذا العدد من الزوجات معًا خلال تقلبات الحياة، وأن يسوقهن جماعةً إلى الفردوس المورموني، حيث سيجدن جوزيف سميث، الذي تخيله الراوي زينة ذلك المكان إلى الأبد. شعر بنفور شديد من مثل هذه الحياة، وخُيّل إليه — وربما أخطأ — أن نساء سولت ليك سيتي يرمقنه بنظرات مقلقة. ولحسن حظه، كانت إقامته قصيرة. ففي الرابعة عاد الرفاق إلى المحطة واستقلوا القطار، ودوّى صفير الانطلاق. لكن ما إن بدأت العجلات تتحرك حتى تعالت صيحات: «توقفوا! توقفوا!»",
  "القطارات، مثل الزمن والمد والجزر، لا تتوقف لأحد. كان الرجل الذي أطلق الصيحات متأخرًا بوضوح؛ لا بد أنه مورموني، وكان يلهث من شدة الركض. ولحسن حظه لم تكن المحطة مزودة ببوابات أو حواجز، فاندفع بمحاذاة السكة وقفز إلى المنصة الخلفية للقطار، ثم هوى منهكًا في أحد المقاعد.",
  "اقترب منه باسبارتو، الذي كان يراقب هذا البهلوان الهاوي بقلق واهتمام، وعرف أنه فرّ بعد مشادة منزلية غير سارة.",
  "وبعد أن استعاد المورموني أنفاسه، تجرأ باسبارتو على سؤاله بأدب عن عدد زوجاته؛ إذ إن طريقة هروبه جعلت المرء يظن أن لديه عشرين زوجة على الأقل.",
  "أجاب المورموني رافعًا ذراعيه نحو السماء: «واحدة يا سيدي، واحدة، وكانت أكثر من كافية!»"
];
const terms=[
  {
    "term": "take the air",
    "literal": "يستنشق الهواء",
    "context": "يخرج إلى مكان مفتوح ليتنفس",
    "note": "Chapter XXVII: خروج باسبارتو إلى منصة القطار",
    "type": "phrase"
  },
  {
    "term": "sun’s disc",
    "literal": "قرص الشمس",
    "context": "وصف أدبي للشمس كما تبدو في السماء",
    "note": "Chapter XXVII: الشمس التي كبّر الضباب صورتها",
    "type": "phrase"
  },
  {
    "term": "pounds sterling",
    "literal": "الجنيه الإسترليني",
    "context": "اسم العملة البريطانية",
    "note": "Chapter XXVII: حساب باسبارتو قيمة قرص الشمس على سبيل المزاح",
    "type": "phrase"
  },
  {
    "term": "strange-looking personage",
    "literal": "شخص غريب المظهر",
    "context": "شخص يبدو غير مألوف في هيئته",
    "note": "Chapter XXVII: ظهور الشيخ على المنصة",
    "type": "phrase"
  },
  {
    "term": "affixed",
    "literal": "ثبّت",
    "context": "ألصق أو ربط شيئًا في موضعه",
    "note": "Chapter XXVII: تعليق الإعلانات على أبواب العربات",
    "type": "word"
  },
  {
    "term": "taking advantage of",
    "literal": "مستغلًا فرصة",
    "context": "مستفيدًا من ظرف متاح",
    "note": "Chapter XXVII: استغلال وجود المبشر على القطار",
    "type": "phrase"
  },
  {
    "term": "desirous of being instructed",
    "literal": "الراغبون في التعلّم",
    "context": "من يريدون تلقي معلومات أو إرشاد",
    "note": "Chapter XXVII: دعوة الركاب إلى المحاضرة",
    "type": "phrase"
  },
  {
    "term": "ventured to gainsay",
    "literal": "يجرؤ على المخالفة",
    "context": "يتجرأ على الاعتراض أو إنكار قول",
    "note": "Chapter XXVII: رد فعل الجمهور على الشيخ",
    "type": "phrase"
  },
  {
    "term": "calm visage",
    "literal": "ملامح هادئة",
    "context": "وجه يبدو ساكنًا رغم الانفعال",
    "note": "Chapter XXVII: التباين بين وجه الشيخ وصوته",
    "type": "phrase"
  },
  {
    "term": "subjected that territory to the laws",
    "literal": "أخضع ذلك الإقليم للقوانين",
    "context": "جعل منطقة خاضعة لقانون الدولة",
    "note": "Chapter XXVII: وصف الراوي لسيطرة الحكومة على يوتا",
    "type": "phrase"
  },
  {
    "term": "make proselytes",
    "literal": "يستقطب أتباعًا",
    "context": "يحاول إقناع آخرين باعتناق معتقد",
    "note": "Chapter XXVII: محاولة المبشر إقناع المسافرين",
    "type": "phrase"
  },
  {
    "term": "emphasising his words",
    "literal": "مشددًا على كلماته",
    "context": "يبرز المعنى بصوت أو إيماءة",
    "note": "Chapter XXVII: أسلوب إلقاء المحاضرة",
    "type": "phrase"
  },
  {
    "term": "annals",
    "literal": "السجلات",
    "context": "سجل مكتوب للأحداث أو التاريخ",
    "note": "Chapter XXVII: السجلات التي يزعم الشيخ أنها أساس الدين",
    "type": "word"
  },
  {
    "term": "bequeathed",
    "literal": "ترك إرثًا",
    "context": "نقل شيئًا إلى من يأتي بعده",
    "note": "Chapter XXVII: ما يرويه الشيخ عن النبي المزعوم",
    "type": "word"
  },
  {
    "term": "revealed himself",
    "literal": "أعلن عن نفسه",
    "context": "أظهر هويته أو ادعى صفة معينة",
    "note": "Chapter XXVII: ادعاء جوزيف سميث النبوة",
    "type": "phrase"
  },
  {
    "term": "not being much interested",
    "literal": "لعدم اهتمامهم كثيرًا",
    "context": "لأن الأمر لم يجذب انتباههم",
    "note": "Chapter XXVII: مغادرة بعض مستمعي المحاضرة",
    "type": "phrase"
  },
  {
    "term": "disconcert",
    "literal": "يثنيه أو يربكه",
    "context": "يجعله يفقد ثقته أو يتوقف",
    "note": "Chapter XXVII: استمرار الشيخ رغم تناقص الجمهور",
    "type": "word"
  },
  {
    "term": "hearers",
    "literal": "المستمعون",
    "context": "الأشخاص الذين ينصتون إلى حديث",
    "note": "Chapter XXVII: عدد من بقي في العربة",
    "type": "word"
  },
  {
    "term": "listening with all his ears",
    "literal": "يصغي بكل جوارحه",
    "context": "تعبير مبالغ فيه عن شدة الانتباه",
    "note": "Chapter XXVII: اهتمام باسبارتو بالمحاضرة",
    "type": "phrase"
  },
  {
    "term": "ambuscade",
    "literal": "كمين",
    "context": "هجوم مباغت من موضع مخفي",
    "note": "Chapter XXVII: رواية اغتيال جوزيف سميث",
    "type": "word"
  },
  {
    "term": "in contempt of",
    "literal": "في ازدراء لـ",
    "context": "بما يظهر استخفافًا بشيء",
    "note": "Chapter XXVII: خطاب الشيخ عن سجن بريغهام يونغ",
    "type": "phrase"
  },
  {
    "term": "flourished beyond expectations",
    "literal": "ازدهر بما يفوق التوقعات",
    "context": "نما ونجح أكثر مما كان متوقعًا",
    "note": "Chapter XXVII: وصف المستعمرة قرب البحيرة",
    "type": "phrase"
  },
  {
    "term": "plant our tents",
    "literal": "ننصب خيامنا",
    "context": "نستقر في مكان جديد",
    "note": "Chapter XXVII: دعوة الشيخ إلى البحث عن أرض للاستقرار",
    "type": "phrase"
  },
  {
    "term": "preach to vacancy",
    "literal": "يعظ الفراغ",
    "context": "يتحدث دون وجود مستمعين",
    "note": "Chapter XXVII: مغادرة باسبارتو للعربة",
    "type": "phrase"
  },
  {
    "term": "northwest border",
    "literal": "الطرف الشمالي الغربي",
    "context": "الحد الواقع في جهة الشمال الغربي",
    "note": "Chapter XXVII: وصول القطار إلى البحيرة المالحة",
    "type": "phrase"
  },
  {
    "term": "encrusted with white salt",
    "literal": "مغطاة بقشرة من الملح الأبيض",
    "context": "تكسوها طبقة ملحية متصلبة",
    "note": "Chapter XXVII: وصف الصخور المحيطة بالبحيرة",
    "type": "phrase"
  },
  {
    "term": "with the lapse of time",
    "literal": "مع مرور الزمن",
    "context": "بمرور الوقت وتتابع السنين",
    "note": "Chapter XXVII: تغير مساحة البحيرة",
    "type": "phrase"
  },
  {
    "term": "specific weight",
    "literal": "الكثافة النوعية",
    "context": "مقياس مقارنة كثافة مادة بالماء",
    "note": "Chapter XXVII: قياس ملوحة البحيرة وفق الرواية",
    "type": "phrase"
  },
  {
    "term": "well cultivated",
    "literal": "مزروعة جيدًا",
    "context": "أرض تُعتنى بزراعتها",
    "note": "Chapter XXVII: الحقول حول البحيرة",
    "type": "phrase"
  },
  {
    "term": "luxuriant prairies",
    "literal": "براري كثيفة النبات",
    "context": "أراضٍ عشبية تنمو فيها النباتات بكثرة",
    "note": "Chapter XXVII: وصف المشهد الزراعي",
    "type": "phrase"
  },
  {
    "term": "branch road",
    "literal": "خط فرعي",
    "context": "مسار يتصل بخط رئيسي",
    "note": "Chapter XXVII: خط القطار بين أوغدن وسولت ليك سيتي",
    "type": "phrase"
  },
  {
    "term": "checkerboard",
    "literal": "رقعة شطرنج",
    "context": "نمط متعامد من مربعات متناوبة",
    "note": "Chapter XXVII: تخطيط شوارع المدينة",
    "type": "word"
  },
  {
    "term": "spurs of the Wahsatch Range",
    "literal": "سفوح سلسلة واهساتش",
    "context": "امتدادات منخفضة من سلسلة جبلية",
    "note": "Chapter XXVII: موقع المدينة بين النهر والجبال",
    "type": "phrase"
  },
  {
    "term": "belated",
    "literal": "متأخر عن الموعد",
    "context": "وصل بعد وقت الانطلاق المتوقع",
    "note": "Chapter XXVII: الراكب الذي يلحق بالقطار",
    "type": "word"
  },
  {
    "term": "decamped",
    "literal": "فرّ على عجل",
    "context": "غادر المكان بسرعة هربًا من موقف",
    "note": "Chapter XXVII: هروب الرجل من مشادة منزلية",
    "type": "word"
  },
  {
    "term": "amateur gymnast",
    "literal": "بهلوان هاوٍ",
    "context": "شخص يؤدي حركة جسدية خطرة دون احتراف",
    "note": "Chapter XXVII: قفزة الرجل إلى القطار",
    "type": "phrase"
  },
  {
    "term": "domestic scene",
    "literal": "مشادة منزلية",
    "context": "خلاف أو مواجهة داخل البيت",
    "note": "Chapter XXVII: سبب هروب المسافر",
    "type": "phrase"
  },
  {
    "term": "raising his arms heavenward",
    "literal": "رافعًا ذراعيه نحو السماء",
    "context": "إيماءة درامية باتجاه السماء",
    "note": "Chapter XXVII: جواب المورموني الأخير",
    "type": "phrase"
  }
];
if(english.length!==25||arabic.length!==english.length||terms.length!==38)throw Error('Towle XXVII bilingual alignment mismatch');
s.chapters.push({title:"In which Passepartout undergoes, at a speed of twenty miles an hour, a course of Mormon history.",titleAr:"يتلقى باسبارتو درسًا في تاريخ المورمون بسرعة عشرين ميلًا في الساعة",paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;s.subtitle='The original Towle translation — Chapters I–XXVII';
s.description='Passepartout hears a Mormon missionary aboard the train, then the travellers cross the shores of the Great Salt Lake.';
s.editorialStatus='English Chapters I–XXVII source-transcribed; Arabic draft pending independent review; 27 of 37 chapters';
s.provenance+=' Chapter XXVII: Standard Ebooks Towle transcription (CC0 editorial edition; source blob 2475c77964fd4cdaf1a83b3e60a6c905e89d66f7); territory-specific rights pending review.';
})(window);
