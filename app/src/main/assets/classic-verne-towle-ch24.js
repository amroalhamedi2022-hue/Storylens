/* Lingua Tales — authentic Towle Chapter XXIV; Standard Ebooks CC0 editorial transcription.
 * Source: https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-24.xhtml
 * Source blob SHA-1: dd14ef8731bcc974e5d7c8f025f50d408f58badc; English source paragraphs normalized from XHTML.
 * Arabic is an editorial translation draft; independent literary proofreading and territory-specific rights review remain pending.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==23)throw Error('Towle chapter XXIV load order mismatch');
const english=[
  "What happened when the pilot-boat came in sight of Shanghai will be easily guessed. The signals made by the Tankadere had been seen by the captain of the Yokohama steamer, who, espying the flag at half-mast, had directed his course towards the little craft. Phileas Fogg, after paying the stipulated price of his passage to John Busby, and rewarding that worthy with the additional sum of five hundred and fifty pounds, ascended the steamer with Aouda and Fix; and they started at once for Nagasaki and Yokohama.",
  "They reached their destination on the morning of the 14th of November. Phileas Fogg lost no time in going on board the Carnatic, where he learned, to Aouda’s great delight⁠—and perhaps to his own, though he betrayed no emotion⁠—that Passepartout, a Frenchman, had really arrived on her the day before.",
  "The San Francisco steamer was announced to leave that very evening, and it became necessary to find Passepartout, if possible, without delay. Mr. Fogg applied in vain to the French and English consuls, and, after wandering through the streets a long time, began to despair of finding his missing servant. Chance, or perhaps a kind of presentiment, at last led him into the Honourable Mr. Batulcar’s theatre. He certainly would not have recognised Passepartout in the eccentric mountebank’s costume; but the latter, lying on his back, perceived his master in the gallery. He could not help starting, which so changed the position of his nose as to bring the “pyramid” pell-mell upon the stage.",
  "All this Passepartout learned from Aouda, who recounted to him what had taken place on the voyage from Hong Kong to Shanghai on the Tankadere, in company with one Mr. Fix.",
  "Passepartout did not change countenance on hearing this name. He thought that the time had not yet arrived to divulge to his master what had taken place between the detective and himself; and, in the account he gave of his absence, he simply excused himself for having been overtaken by drunkenness, in smoking opium at a tavern in Hong Kong.",
  "Mr. Fogg heard this narrative coldly, without a word; and then furnished his man with funds necessary to obtain clothing more in harmony with his position. Within an hour the Frenchman had cut off his nose and parted with his wings, and retained nothing about him which recalled the sectary of the god Tingou.",
  "The steamer which was about to depart from Yokohama to San Francisco belonged to the Pacific Mail Steamship Company, and was named the General Grant. She was a large paddle-wheel steamer of two thousand five hundred tons; well equipped and very fast. The massive walking-beam rose and fell above the deck; at one end a piston-rod worked up and down; and at the other was a connecting-rod which, in changing the rectilinear motion to a circular one, was directly connected with the shaft of the paddles. The General Grant was rigged with three masts, giving a large capacity for sails, and thus materially aiding the steam power. By making twelve miles an hour, she would cross the ocean in twenty-one days. Phileas Fogg was therefore justified in hoping that he would reach San Francisco by the 2nd of December, New York by the 11th, and London on the 20th⁠—thus gaining several hours on the fatal date of the 21st of December.",
  "There was a full complement of passengers on board, among them English, many Americans, a large number of coolies on their way to California, and several East Indian officers, who were spending their vacation in making the tour of the world. Nothing of moment happened on the voyage; the steamer, sustained on its large paddles, rolled but little, and the Pacific almost justified its name. Mr. Fogg was as calm and taciturn as ever. His young companion felt herself more and more attached to him by other ties than gratitude; his silent but generous nature impressed her more than she thought; and it was almost unconsciously that she yielded to emotions which did not seem to have the least effect upon her protector. Aouda took the keenest interest in his plans, and became impatient at any incident which seemed likely to retard his journey.",
  "She often chatted with Passepartout, who did not fail to perceive the state of the lady’s heart; and, being the most faithful of domestics, he never exhausted his eulogies of Phileas Fogg’s honesty, generosity, and devotion. He took pains to calm Aouda’s doubts of a successful termination of the journey, telling her that the most difficult part of it had passed, that now they were beyond the fantastic countries of Japan and China, and were fairly on their way to civilised places again. A railway train from San Francisco to New York, and a transatlantic steamer from New York to Liverpool, would doubtless bring them to the end of this impossible journey round the world within the period agreed upon.",
  "On the ninth day after leaving Yokohama, Phileas Fogg had traversed exactly one half of the terrestrial globe. The General Grant passed, on the 23rd of November, the one hundred and eightieth meridian, and was at the very antipodes of London. Mr. Fogg had, it is true, exhausted fifty-two of the eighty days in which he was to complete the tour, and there were only twenty-eight left. But, though he was only halfway by the difference of meridians, he had really gone over two-thirds of the whole journey; for he had been obliged to make long circuits from London to Aden, from Aden to Bombay, from Calcutta to Singapore, and from Singapore to Yokohama. Could he have followed without deviation the fiftieth parallel, which is that of London, the whole distance would only have been about twelve thousand miles; whereas he would be forced, by the irregular methods of locomotion, to traverse twenty-six thousand, of which he had, on the 23rd of November, accomplished seventeen thousand five hundred. And now the course was a straight one, and Fix was no longer there to put obstacles in their way!",
  "It happened also, on the 23rd of November, that Passepartout made a joyful discovery. It will be remembered that the obstinate fellow had insisted on keeping his famous family watch at London time, and on regarding that of the countries he had passed through as quite false and unreliable. Now, on this day, though he had not changed the hands, he found that his watch exactly agreed with the ship’s chronometers. His triumph was hilarious. He would have liked to know what Fix would say if he were aboard!",
  "“The rogue told me a lot of stories,” repeated Passepartout, “about the meridians, the sun, and the moon! Moon, indeed! moonshine more likely! If one listened to that sort of people, a pretty sort of time one would keep! I was sure that the sun would some day regulate itself by my watch!”",
  "Passepartout was ignorant that, if the face of his watch had been divided into twenty-four hours, like the Italian clocks, he would have no reason for exultation; for the hands of his watch would then, instead of as now indicating nine o’clock in the morning, indicate nine o’clock in the evening, that is, the twenty-first hour after midnight precisely the difference between London time and that of the one hundred and eightieth meridian. But if Fix had been able to explain this purely physical effect, Passepartout would not have admitted, even if he had comprehended it. Moreover, if the detective had been on board at that moment, Passepartout would have joined issue with him on a quite different subject, and in an entirely different manner.",
  "Where was Fix at that moment?",
  "He was actually on board the General Grant.",
  "On reaching Yokohama, the detective, leaving Mr. Fogg, whom he expected to meet again during the day, had repaired at once to the English consulate, where he at last found the warrant of arrest. It had followed him from Bombay, and had come by the Carnatic, on which steamer he himself was supposed to be. Fix’s disappointment may be imagined when he reflected that the warrant was now useless. Mr. Fogg had left English ground, and it was now necessary to procure his extradition!",
  "“Well,” thought Fix, after a moment of anger, “my warrant is not good here, but it will be in England. The rogue evidently intends to return to his own country, thinking he has thrown the police off his track. Good! I will follow him across the Atlantic. As for the money, heaven grant there may be some left! But the fellow has already spent in travelling, rewards, trials, bail, elephants, and all sorts of charges, more than five thousand pounds. Yet, after all, the Bank is rich!”",
  "His course decided on, he went on board the General Grant, and was there when Mr. Fogg and Aouda arrived. To his utter amazement, he recognised Passepartout, despite his theatrical disguise. He quickly concealed himself in his cabin, to avoid an awkward explanation, and hoped⁠—thanks to the number of passengers⁠—to remain unperceived by Mr. Fogg’s servant.",
  "On that very day, however, he met Passepartout face to face on the forward deck. The latter, without a word, made a rush for him, grasped him by the throat, and, much to the amusement of a group of Americans, who immediately began to bet on him, administered to the detective a perfect volley of blows, which proved the great superiority of French over English pugilistic skill.",
  "When Passepartout had finished, he found himself relieved and comforted. Fix got up in a somewhat rumpled condition, and, looking at his adversary, coldly said, “Have you done?”",
  "“For this time⁠—yes.”",
  "“Then let me have a word with you.”",
  "“But I⁠—”",
  "“In your master’s interests.”",
  "Passepartout seemed to be vanquished by Fix’s coolness, for he quietly followed him, and they sat down aside from the rest of the passengers.",
  "“You have given me a thrashing,” said Fix. “Good, I expected it. Now, listen to me. Up to this time I have been Mr. Fogg’s adversary. I am now in his game.”",
  "“Aha!” cried Passepartout; “you are convinced he is an honest man?”",
  "“No,” replied Fix coldly, “I think him a rascal. Sh! don’t budge, and let me speak. As long as Mr. Fogg was on English ground, it was for my interest to detain him there until my warrant of arrest arrived. I did everything I could to keep him back. I sent the Bombay priests after him, I got you intoxicated at Hong Kong, I separated you from him, and I made him miss the Yokohama steamer.”",
  "Passepartout listened, with closed fists.",
  "“Now,” resumed Fix, “Mr. Fogg seems to be going back to England. Well, I will follow him there. But hereafter I will do as much to keep obstacles out of his way as I have done up to this time to put them in his path. I’ve changed my game, you see, and simply because it was for my interest to change it. Your interest is the same as mine; for it is only in England that you will ascertain whether you are in the service of a criminal or an honest man.”",
  "Passepartout listened very attentively to Fix, and was convinced that he spoke with entire good faith.",
  "“Are we friends?” asked the detective.",
  "“Friends?⁠—no,” replied Passepartout; “but allies, perhaps. At the least sign of treason, however, I’ll twist your neck for you.”",
  "“Agreed,” said the detective quietly.",
  "Eleven days later, on the 3rd of December, the General Grant entered the bay of the Golden Gate, and reached San Francisco.",
  "Mr. Fogg had neither gained nor lost a single day."
];
const arabic=[
  "يمكن تخمين ما حدث حين ظهر قارب الإرشاد قرب شنغهاي بسهولة. فقد رأى قبطان الباخرة المتجهة إلى يوكوهاما الإشارات التي أطلقها تانكادير، ولما لمح العلم مرفوعًا إلى منتصف السارية وجّه مساره نحو القارب الصغير. وبعد أن دفع فيلياس فوغ لجون بَسبي الأجرة المتفق عليها، وكافأ ذلك الرجل المحترم بمبلغ إضافي قدره خمسمائة وخمسون جنيهًا، صعد إلى الباخرة مع أودا وفيكس، وانطلقوا فورًا نحو ناغاساكي ويوكوهاما.",
  "وصلوا إلى وجهتهم صباح الرابع عشر من نوفمبر. ولم يضع فيلياس فوغ وقتًا في الصعود إلى كارنيتيك، حيث علم، لفرح أودا الكبير — وربما لفرحه هو أيضًا، وإن لم يُظهر أي انفعال — أن باسبارتو، الفرنسي، وصل إليها فعلًا في اليوم السابق.",
  "كان مقررًا أن تغادر باخرة سان فرانسيسكو في مساء اليوم نفسه، فأصبح العثور على باسبارتو دون إبطاء ضرورة. راجع السيد فوغ القنصلين الفرنسي والإنجليزي بلا جدوى، وبعد أن تجوّل طويلًا في الشوارع بدأ يفقد الأمل في العثور على خادمه المفقود. وأخيرًا قادته المصادفة، أو ربما حدس داخلي، إلى مسرح السيد المحترم باتولكار. لم يكن ليتعرّف إلى باسبارتو في زي المهرج الغريب، لكن الأخير، وهو مستلقٍ على ظهره، لمح سيده في الشرفة. فانتفض لا إراديًا، فتغيّر موضع أنفه على نحو أسقط «الهرم» كله متدحرجًا إلى خشبة المسرح.",
  "عرف باسبارتو كل ذلك من أودا، التي روت له ما حدث في الرحلة من هونغ كونغ إلى شنغهاي على متن تانكادير، بصحبة السيد فيكس.",
  "لم تتغير ملامح باسبارتو حين سمع هذا الاسم. فقد رأى أن الوقت لم يحن بعد ليكشف لسيده ما جرى بينه وبين المحقق؛ لذلك اكتفى، في تفسير غيابه، بالاعتذار بأنه غلبه السكر بعد تدخين الأفيون في حانة بهونغ كونغ.",
  "استمع فوغ إلى الرواية ببرود ومن دون كلمة، ثم أعطى خادمه المال اللازم لشراء ملابس تلائم مكانته. وخلال ساعة، تخلّص الفرنسي من أنفه المصطنع وجناحيه، ولم يبقَ عليه شيء يذكّر بأتباع الإله تينغو.",
  "كانت الباخرة التي ستغادر يوكوهاما إلى سان فرانسيسكو تابعة لشركة باسيفيك ميل للملاحة البخارية، واسمها جنرال غرانت. كانت باخرة كبيرة ذات عجلات مجدافية، تزن ألفين وخمسمئة طن، مجهزة جيدًا وسريعة جدًا. وكانت عارضة المحرك الضخمة ترتفع وتهبط فوق السطح؛ يتحرك قضيب المكبس صعودًا وهبوطًا عند أحد طرفيها، بينما يتصل الطرف الآخر بذراع توصيل يحوّل الحركة المستقيمة إلى حركة دائرية وينقلها مباشرة إلى محور المجاديف. زُوّدت جنرال غرانت بثلاثة صواري تسمح بحمل قدر كبير من الأشرعة، فتدعم قوة البخار دعمًا ملحوظًا. وبسرعة اثني عشر ميلًا في الساعة، كان يمكنها عبور المحيط خلال واحد وعشرين يومًا. لذلك كان من حق فوغ أن يأمل الوصول إلى سان فرانسيسكو في الثاني من ديسمبر، ونيويورك في الحادي عشر، ولندن في العشرين، أي قبل الموعد الحاسم في الحادي والعشرين من ديسمبر ببضع ساعات.",
  "كان على متن السفينة العدد الكامل من الركاب، وبينهم إنجليز وكثير من الأمريكيين وعدد كبير من العمال الآسيويين المتجهين إلى كاليفورنيا، وعدة ضباط من الهند الشرقية يقضون إجازتهم في رحلة حول العالم. لم يقع شيء مهم أثناء الرحلة؛ فالسفينة، التي تدفعها مجاديفها الكبيرة، لم تتمايل كثيرًا، وكاد المحيط الهادئ يبرر اسمه. ظل فوغ هادئًا قليل الكلام كعادته. أما رفيقته الشابة فكانت تشعر بتعلّق متزايد به، يتجاوز الامتنان؛ فقد أثّرت فيها طبيعته الصامتة والكريمة أكثر مما ظنت، واستسلمت لمشاعر لم يبدُ أنها تؤثر في الرجل الذي يحميها. وأصبحت أودا تتابع خططه باهتمام شديد، وتنزعج من كل حادث قد يؤخر رحلته.",
  "كثيرًا ما كانت تتحدث مع باسبارتو، الذي أدرك مشاعرها، وبصفته أكثر الخدم وفاءً لم يتوقف عن الثناء على أمانة فوغ وكرمه وإخلاصه. وكان يحرص على تبديد شكوك أودا في نجاح الرحلة، ويخبرها أن الجزء الأصعب قد انقضى، وأنهم تجاوزوا الآن غرائب اليابان والصين وهم في طريقهم إلى بلاد مألوفة من جديد. فلا شك أن قطارًا من سان فرانسيسكو إلى نيويورك، ثم باخرة تعبر الأطلسي من نيويورك إلى ليفربول، سيُكملان هذه الرحلة المستحيلة حول العالم ضمن المدة المتفق عليها.",
  "في اليوم التاسع بعد مغادرة يوكوهاما، كان فوغ قد قطع نصف الكرة الأرضية تمامًا. ففي الثالث والعشرين من نوفمبر اجتازت جنرال غرانت خط الطول المئة والثمانين، وأصبحت عند النقطة المقابلة تمامًا للندن على الجانب الآخر من الأرض. صحيح أن فوغ استنفد اثنين وخمسين يومًا من أصل الثمانين المخصصة للرحلة، ولم يبقَ له سوى ثمانية وعشرين يومًا. لكنه، رغم أنه قطع نصف المسافة وفق فرق خطوط الطول، كان قد اجتاز فعليًا ثلثي الرحلة؛ إذ اضطر إلى اتخاذ مسارات التفافية طويلة من لندن إلى عدن، ومن عدن إلى بومباي، ومن كلكتا إلى سنغافورة، ومن سنغافورة إلى يوكوهاما. ولو استطاع السير دون انحراف على خط العرض الخمسين، وهو خط لندن، لما تجاوزت المسافة نحو اثني عشر ألف ميل؛ لكنه سيضطر بسبب وسائل النقل غير المنتظمة إلى قطع ستة وعشرين ألف ميل، وقد أنجز منها في الثالث والعشرين من نوفمبر سبعة عشر ألفًا وخمسمئة. أما الآن فكان المسار مستقيمًا، ولم يعد فيكس موجودًا ليضع العقبات في طريقهم!",
  "حدث أيضًا في الثالث والعشرين من نوفمبر أن باسبارتو توصل إلى اكتشاف أسعده. فقد سبق أن أصرّ هذا العنيد على الاحتفاظ بساعته العائلية مضبوطة على توقيت لندن، معتبرًا توقيت البلدان التي مرّ بها خاطئًا لا يُعتمد عليه. وفي ذلك اليوم، ورغم أنه لم يحرّك عقاربها، وجد أن ساعته تطابق تمامًا كرونومترات السفينة. فغمره انتصار مرح، وتمنى لو يعرف ما الذي سيقوله فيكس لو كان على متنها!",
  "«لقد أغرقني ذلك المحتال بالحكايات»، كرر باسبارتو، «عن خطوط الطول والشمس والقمر! القمر؟ بل كلام فارغ على الأرجح! لو استمع المرء إلى أمثال هؤلاء، لما عرف كيف يضبط وقته! كنت واثقًا أن الشمس ستضطر يومًا إلى ضبط نفسها على ساعتي!»",
  "لم يكن باسبارتو يعلم أنه لو قُسم وجه ساعته إلى أربع وعشرين ساعة، مثل الساعات الإيطالية، لما كان هناك ما يدعو إلى ابتهاجه؛ إذ كانت العقارب ستشير، بدلًا من التاسعة صباحًا كما الآن، إلى التاسعة مساءً، أي إلى الساعة الحادية والعشرين بعد منتصف الليل، وهو بالضبط فرق التوقيت بين لندن وخط الطول المئة والثمانين. ولو استطاع فيكس شرح هذه الظاهرة الفيزيائية البحتة له، لما اقتنع باسبارتو حتى لو فهمها. ثم إن وجود المحقق على متن السفينة في تلك اللحظة كان سيقود باسبارتو إلى مجادلته في موضوع آخر تمامًا وبطريقة مختلفة كليًا.",
  "أين كان فيكس في تلك اللحظة؟",
  "كان في الواقع على متن جنرال غرانت.",
  "عندما وصل فيكس إلى يوكوهاما، ترك السيد فوغ، متوقعًا أن يلتقيه مجددًا خلال النهار، واتجه فورًا إلى القنصلية الإنجليزية حيث عثر أخيرًا على مذكرة التوقيف. كانت قد لحقته من بومباي ووصلت على متن كارنيتيك، وهي السفينة التي كان يُفترض أنه سافر عليها. ويمكن تخيّل خيبة أمل فيكس حين أدرك أن المذكرة أصبحت عديمة الفائدة؛ فقد غادر فوغ الأراضي الإنجليزية، وأصبح من الضروري طلب تسليمه!",
  "«حسنًا»، فكّر فيكس بعد لحظة غضب، «مذكرتي لا تصلح هنا، لكنها ستصلح في إنجلترا. من الواضح أن المحتال ينوي العودة إلى بلده، ظانًا أنه أفلت من تعقّب الشرطة. جيد! سأتتبعه عبر الأطلسي. أما المال، فليت أن شيئًا منه بقي! لقد أنفق الرجل بالفعل على السفر والمكافآت والمحاكمات والكفالات والفيلة وسائر المصاريف أكثر من خمسة آلاف جنيه. ومع ذلك، فالبنك غني!»",
  "بعدما حسم أمره، صعد إلى جنرال غرانت، وكان هناك حين وصل فوغ وأودا. وقد أصابته دهشة شديدة عندما تعرّف إلى باسبارتو رغم تنكّره المسرحي. فاختبأ سريعًا في مقصورته ليتجنب تفسيرًا محرجًا، وأمل أن تساعده كثرة الركاب على البقاء بعيدًا عن أنظار خادم فوغ.",
  "لكن في ذلك اليوم نفسه التقى فيكس وباسبارتو وجهًا لوجه على السطح الأمامي. فاندفع باسبارتو نحوه بلا كلمة، وأمسكه من عنقه، ثم أمطره بوابل من اللكمات، وسط تسلية مجموعة من الأمريكيين الذين أخذوا يراهنون على النتيجة؛ وأثبت العراك تفوق المهارة الفرنسية في الملاكمة على نظيرتها الإنجليزية.",
  "حين انتهى باسبارتو شعر بالراحة والارتياح. ونهض فيكس وقد اختلّ مظهره قليلًا، ونظر إلى خصمه ببرود وقال: «هل انتهيت؟»",
  "«هذه المرة... نعم».",
  "«إذًا دعني أتحدث معك قليلًا».",
  "«لكنني...»",
  "«لمصلحة سيدك».",
  "بدا أن هدوء فيكس قد هزم باسبارتو، فتَبِعه بهدوء وجلسا بعيدًا عن بقية الركاب.",
  "قال فيكس: «لقد لقّنتني درسًا بالضرب. حسنًا، كنت أتوقع ذلك. والآن استمع إليّ. حتى هذه اللحظة كنت خصم السيد فوغ، أما الآن فسأعمل لصالحه».",
  "صاح باسبارتو: «آها! هل اقتنعت بأنه رجل نزيه؟»",
  "رد فيكس ببرود: «لا، أعتقد أنه محتال. اصمت ولا تتحرك ودعني أتكلم. ما دام السيد فوغ على أرض إنجليزية، كان من مصلحتي أن أحتجزه هناك حتى تصل مذكرة توقيفه. فعلت كل ما أستطيع لإعاقته: أرسلت كهنة بومباي خلفه، وجعلتك تسكر في هونغ كونغ، وفصلتك عنه، وجعلته يفوّت باخرة يوكوهاما».",
  "استمع باسبارتو ويداه مقبوضتان.",
  "تابع فيكس: «يبدو الآن أن السيد فوغ عائد إلى إنجلترا. سأتبعه إلى هناك. لكنني من الآن فصاعدًا سأزيل العقبات من طريقه بالقدر نفسه الذي كنت أضعها فيه. لقد غيّرت خطتي لأن مصلحتي تقتضي ذلك. ومصلحتك مثل مصلحتي؛ ففي إنجلترا وحدها ستعرف ما إذا كنت تخدم مجرمًا أم رجلًا نزيهًا».",
  "استمع باسبارتو إلى فيكس بانتباه شديد، واقتنع بأنه يتحدث بصدق تام.",
  "سأل المحقق: «هل أصبحنا صديقين؟»",
  "أجاب باسبارتو: «صديقين؟ لا، لكن ربما حليفين. ومع ذلك، عند أقل علامة على الخيانة، سأكسر عنقك».",
  "قال المحقق بهدوء: «اتفقنا».",
  "وبعد أحد عشر يومًا، في الثالث من ديسمبر، دخلت جنرال غرانت خليج البوابة الذهبية ووصلت إلى سان فرانسيسكو.",
  "لم يربح السيد فوغ يومًا واحدًا ولم يخسر يومًا واحدًا."
];
const terms=[
  {
    "term": "pilot-boat",
    "literal": "قارب إرشاد بحري",
    "context": "القارب الصغير الذي يوجّه السفن قرب الميناء",
    "note": "Chapter XXIV: القارب الصغير الذي يوجّه السفن قرب الميناء",
    "type": "phrase"
  },
  {
    "term": "at half-mast",
    "literal": "منكّس إلى منتصف السارية",
    "context": "إشارة بحرية تدل على خفض العلم جزئيًا",
    "note": "Chapter XXIV: إشارة بحرية تدل على خفض العلم جزئيًا",
    "type": "phrase"
  },
  {
    "term": "stipulated price",
    "literal": "السعر المتفق عليه",
    "context": "الأجرة المحددة مسبقًا للرحلة",
    "note": "Chapter XXIV: الأجرة المحددة مسبقًا للرحلة",
    "type": "phrase"
  },
  {
    "term": "betrayed no emotion",
    "literal": "لم يُظهر أي انفعال",
    "context": "أخفى مشاعره ولم يبدِ رد فعل",
    "note": "Chapter XXIV: أخفى مشاعره ولم يبدِ رد فعل",
    "type": "phrase"
  },
  {
    "term": "without delay",
    "literal": "دون إبطاء",
    "context": "فورًا ومن غير تأخير",
    "note": "Chapter XXIV: فورًا ومن غير تأخير",
    "type": "phrase"
  },
  {
    "term": "presentiment",
    "literal": "حدس مسبق",
    "context": "إحساس داخلي بشيء قبل وقوعه",
    "note": "Chapter XXIV: إحساس داخلي بشيء قبل وقوعه",
    "type": "word"
  },
  {
    "term": "pell-mell",
    "literal": "في فوضى وتدافع",
    "context": "على نحو متخبط ومتداخل",
    "note": "Chapter XXIV: على نحو متخبط ومتداخل",
    "type": "phrase"
  },
  {
    "term": "divulge",
    "literal": "يفشي",
    "context": "يكشف سرًا كان يخفيه",
    "note": "Chapter XXIV: يكشف سرًا كان يخفيه",
    "type": "word"
  },
  {
    "term": "change countenance",
    "literal": "تتغير ملامحه",
    "context": "يتبدل تعبير الوجه بسبب انفعال",
    "note": "Chapter XXIV: يتبدل تعبير الوجه بسبب انفعال",
    "type": "phrase"
  },
  {
    "term": "in harmony with",
    "literal": "ملائم لـ",
    "context": "متوافق مع المكانة أو الظروف",
    "note": "Chapter XXIV: متوافق مع المكانة أو الظروف",
    "type": "phrase"
  },
  {
    "term": "paddle-wheel",
    "literal": "عجلة مجدافية",
    "context": "عجلة تدفع الباخرة عبر الماء",
    "note": "Chapter XXIV: عجلة تدفع الباخرة عبر الماء",
    "type": "word"
  },
  {
    "term": "walking-beam",
    "literal": "عارضة محرك متأرجحة",
    "context": "ذراع كبير يتحرك صعودًا وهبوطًا في محرك بخاري",
    "note": "Chapter XXIV: ذراع كبير يتحرك صعودًا وهبوطًا في محرك بخاري",
    "type": "word"
  },
  {
    "term": "piston-rod",
    "literal": "قضيب المكبس",
    "context": "قضيب ينقل حركة المكبس",
    "note": "Chapter XXIV: قضيب ينقل حركة المكبس",
    "type": "word"
  },
  {
    "term": "connecting-rod",
    "literal": "ذراع التوصيل",
    "context": "قطعة تنقل الحركة بين أجزاء الآلة",
    "note": "Chapter XXIV: قطعة تنقل الحركة بين أجزاء الآلة",
    "type": "word"
  },
  {
    "term": "rectilinear motion",
    "literal": "حركة مستقيمة",
    "context": "حركة تسير على خط مستقيم",
    "note": "Chapter XXIV: حركة تسير على خط مستقيم",
    "type": "phrase"
  },
  {
    "term": "full complement of passengers",
    "literal": "العدد الكامل من الركاب",
    "context": "كل السعة المخصصة للركاب مشغولة",
    "note": "Chapter XXIV: كل السعة المخصصة للركاب مشغولة",
    "type": "phrase"
  },
  {
    "term": "taciturn",
    "literal": "قليل الكلام",
    "context": "هادئ لا يتحدث إلا نادرًا",
    "note": "Chapter XXIV: هادئ لا يتحدث إلا نادرًا",
    "type": "word"
  },
  {
    "term": "yielded to emotions",
    "literal": "استسلمت لمشاعرها",
    "context": "سمحت لعاطفتها بأن تظهر وتؤثر فيها",
    "note": "Chapter XXIV: سمحت لعاطفتها بأن تظهر وتؤثر فيها",
    "type": "phrase"
  },
  {
    "term": "successful termination",
    "literal": "انتهاء ناجح",
    "context": "إتمام الرحلة على النحو المطلوب",
    "note": "Chapter XXIV: إتمام الرحلة على النحو المطلوب",
    "type": "phrase"
  },
  {
    "term": "antipodes",
    "literal": "النقطة المقابلة على الكرة الأرضية",
    "context": "موضع يقع على الجهة الأخرى تمامًا من الأرض",
    "note": "Chapter XXIV: موضع يقع على الجهة الأخرى تمامًا من الأرض",
    "type": "word"
  },
  {
    "term": "long circuits",
    "literal": "مسارات التفافية طويلة",
    "context": "طرق غير مباشرة تزيد المسافة",
    "note": "Chapter XXIV: طرق غير مباشرة تزيد المسافة",
    "type": "phrase"
  },
  {
    "term": "difference of meridians",
    "literal": "فرق خطوط الطول",
    "context": "اختلاف الوقت الناتج عن اختلاف خطوط الطول",
    "note": "Chapter XXIV: اختلاف الوقت الناتج عن اختلاف خطوط الطول",
    "type": "phrase"
  },
  {
    "term": "exultation",
    "literal": "فرح عارم",
    "context": "ابتهاج شديد بسبب نجاح متوهَّم",
    "note": "Chapter XXIV: ابتهاج شديد بسبب نجاح متوهَّم",
    "type": "word"
  },
  {
    "term": "moonshine",
    "literal": "كلام فارغ",
    "context": "تعبير عن كلام يراه المتحدث هراءً",
    "note": "Chapter XXIV: تعبير عن كلام يراه المتحدث هراءً",
    "type": "word"
  },
  {
    "term": "joined issue",
    "literal": "دخل في جدال",
    "context": "واجه شخصًا بالنقاش أو الخصومة",
    "note": "Chapter XXIV: واجه شخصًا بالنقاش أو الخصومة",
    "type": "phrase"
  },
  {
    "term": "warrant of arrest",
    "literal": "مذكرة توقيف",
    "context": "وثيقة قانونية تأمر بالقبض على شخص",
    "note": "Chapter XXIV: وثيقة قانونية تأمر بالقبض على شخص",
    "type": "phrase"
  },
  {
    "term": "extradition",
    "literal": "تسليم مطلوب",
    "context": "نقل شخص مطلوب إلى دولة أخرى وفق إجراء قانوني",
    "note": "Chapter XXIV: نقل شخص مطلوب إلى دولة أخرى وفق إجراء قانوني",
    "type": "word"
  },
  {
    "term": "thrown the police off his track",
    "literal": "أضلّ الشرطة عن تعقّبه",
    "context": "جعل الشرطة تفقد أثره",
    "note": "Chapter XXIV: جعل الشرطة تفقد أثره",
    "type": "phrase"
  },
  {
    "term": "concealed himself",
    "literal": "اختبأ",
    "context": "أخفى نفسه كي لا يراه الآخرون",
    "note": "Chapter XXIV: أخفى نفسه كي لا يراه الآخرون",
    "type": "phrase"
  },
  {
    "term": "face to face",
    "literal": "وجهًا لوجه",
    "context": "مباشرة في مواجهة الشخص الآخر",
    "note": "Chapter XXIV: مباشرة في مواجهة الشخص الآخر",
    "type": "phrase"
  },
  {
    "term": "volley of blows",
    "literal": "وابل من اللكمات",
    "context": "ضربات متتابعة وسريعة",
    "note": "Chapter XXIV: ضربات متتابعة وسريعة",
    "type": "phrase"
  },
  {
    "term": "rumpled condition",
    "literal": "هيئة مبعثرة",
    "context": "مظهره بعد العراك",
    "note": "Chapter XXIV: مظهره بعد العراك",
    "type": "phrase"
  },
  {
    "term": "adversary",
    "literal": "خصم",
    "context": "شخص يقف في الجانب المقابل",
    "note": "Chapter XXIV: شخص يقف في الجانب المقابل",
    "type": "word"
  },
  {
    "term": "detain him there",
    "literal": "يحتجزه هناك",
    "context": "يمنعه من المغادرة إلى حين",
    "note": "Chapter XXIV: يمنعه من المغادرة إلى حين",
    "type": "phrase"
  },
  {
    "term": "entire good faith",
    "literal": "صدق تام",
    "context": "إخلاص ونيّة صادقة بلا خداع",
    "note": "Chapter XXIV: إخلاص ونيّة صادقة بلا خداع",
    "type": "phrase"
  },
  {
    "term": "at the least sign of treason",
    "literal": "عند أقل علامة على الخيانة",
    "context": "إذا ظهر أدنى دليل على الغدر",
    "note": "Chapter XXIV: إذا ظهر أدنى دليل على الغدر",
    "type": "phrase"
  },
  {
    "term": "entered the bay",
    "literal": "دخل الخليج",
    "context": "وصلت السفينة إلى المسطح المائي داخل الساحل",
    "note": "Chapter XXIV: وصلت السفينة إلى المسطح المائي داخل الساحل",
    "type": "phrase"
  },
  {
    "term": "gained nor lost a single day",
    "literal": "لم يربح يومًا ولم يخسر يومًا",
    "context": "وصل وفق الجدول الزمني من دون تقدّم أو تأخّر",
    "note": "Chapter XXIV: وصل وفق الجدول الزمني من دون تقدّم أو تأخّر",
    "type": "phrase"
  }
];
if(english.length!==36||arabic.length!==english.length||terms.length!==38)throw Error('Towle XXIV bilingual alignment mismatch');
s.chapters.push({title:"During which Mr. Fogg and party cross the Pacific Ocean.",titleAr:'عبور فوغ ورفاقه المحيط الهادئ',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXIV';
s.description='The General Grant crosses the Pacific as Fogg, Aouda, Passepartout and Fix move toward the Golden Gate.';
s.editorialStatus='English Chapters I–XXIV source-transcribed; Arabic draft pending independent review; 24 of 37 chapters';
s.provenance+=' Chapter XXIV: Standard Ebooks Towle transcription (CC0 editorial edition; source blob dd14ef8731bcc974e5d7c8f025f50d408f58badc); territory-specific rights pending review.';
})(window);