/* Lingua Tales — authentic Towle Chapter XXVIII; Standard Ebooks CC0 editorial transcription.
 * Upstream: standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle
 * Source commit: 56c82e97ff5d4f8950afca05b71af72688a8da34
 * Source blob SHA-1: 4e233a81707c90e3c70ae89cc66309049a012bee; body paragraphs normalized from src/epub/text/chapter-28.xhtml.
 * English source is kept verbatim after XHTML/whitespace normalization. Arabic is an editorial draft;
 * independent literary proofreading and territory-specific rights review remain pending.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==27)throw Error('Towle chapter XXVIII load order mismatch');
const english=[
  "The train, on leaving Great Salt Lake at Ogden, passed northward for an hour as far as Weber River, having completed nearly nine hundred miles from San Francisco. From this point it took an easterly direction towards the jagged Wahsatch Mountains. It was in the section included between this range and the Rocky Mountains that the American engineers found the most formidable difficulties in laying the road, and that the government granted a subsidy of forty-eight thousand dollars per mile, instead of sixteen thousand allowed for the work done on the plains. But the engineers, instead of violating nature, avoided its difficulties by winding around, instead of penetrating the rocks. One tunnel only, fourteen thousand feet in length, was pierced in order to arrive at the great basin.",
  "The track up to this time had reached its highest elevation at the Great Salt Lake. From this point it described a long curve, descending towards Bitter Creek Valley, to rise again to the dividing ridge of the waters between the Atlantic and the Pacific. There were many creeks in this mountainous region, and it was necessary to cross Muddy Creek, Green Creek, and others, upon culverts.",
  "Passepartout grew more and more impatient as they went on, while Fix longed to get out of this difficult region, and was more anxious than Phileas Fogg himself to be beyond the danger of delays and accidents, and set foot on English soil.",
  "At ten o’clock at night the train stopped at Fort Bridger station, and twenty minutes later entered Wyoming Territory, following the valley of Bitter Creek throughout. The next day, 7th December, they stopped for a quarter of an hour at Green River station. Snow had fallen abundantly during the night, but, being mixed with rain, it had half melted, and did not interrupt their progress. The bad weather, however, annoyed Passepartout; for the accumulation of snow, by blocking the wheels of the cars, would certainly have been fatal to Mr. Fogg’s tour.",
  "“What an idea!” he said to himself. “Why did my master make this journey in winter? Couldn’t he have waited for the good season to increase his chances?”",
  "While the worthy Frenchman was absorbed in the state of the sky and the depression of the temperature, Aouda was experiencing fears from a totally different cause.",
  "Several passengers had got off at Green River, and were walking up and down the platforms; and among these Aouda recognised Colonel Stamp Proctor, the same who had so grossly insulted Phileas Fogg at the San Francisco meeting. Not wishing to be recognised, the young woman drew back from the window, feeling much alarm at her discovery. She was attached to the man who, however coldly, gave her daily evidences of the most absolute devotion. She did not comprehend, perhaps, the depth of the sentiment with which her protector inspired her, which she called gratitude, but which, though she was unconscious of it, was really more than that. Her heart sank within her when she recognised the man whom Mr. Fogg desired, sooner or later, to call to account for his conduct. Chance alone, it was clear, had brought Colonel Proctor on this train; but there he was, and it was necessary, at all hazards, that Phileas Fogg should not perceive his adversary.",
  "Aouda seized a moment when Mr. Fogg was asleep to tell Fix and Passepartout whom she had seen.",
  "“That Proctor on this train!” cried Fix. “Well, reassure yourself, madam; before he settles with Mr. Fogg; he has got to deal with me! It seems to me that I was the more insulted of the two.”",
  "“And, besides,” added Passepartout, “I’ll take charge of him, colonel as he is.”",
  "“Mr. Fix,” resumed Aouda, “Mr. Fogg will allow no one to avenge him. He said that he would come back to America to find this man. Should he perceive Colonel Proctor, we could not prevent a collision which might have terrible results. He must not see him.”",
  "“You are right, madam,” replied Fix; “a meeting between them might ruin all. Whether he were victorious or beaten, Mr. Fogg would be delayed, and⁠—”",
  "“And,” added Passepartout, “that would play the game of the gentlemen of the Reform Club. In four days we shall be in New York. Well, if my master does not leave this car during those four days, we may hope that chance will not bring him face to face with this confounded American. We must, if possible, prevent his stirring out of it.”",
  "The conversation dropped. Mr. Fogg had just woke up, and was looking out of the window. Soon after Passepartout, without being heard by his master or Aouda, whispered to the detective, “Would you really fight for him?”",
  "“I would do anything,” replied Fix, in a tone which betrayed determined will, “to get him back living to Europe!”",
  "Passepartout felt something like a shudder shoot through his frame, but his confidence in his master remained unbroken.",
  "Was there any means of detaining Mr. Fogg in the car, to avoid a meeting between him and the colonel? It ought not to be a difficult task, since that gentleman was naturally sedentary and little curious. The detective, at least, seemed to have found a way; for, after a few moments, he said to Mr. Fogg, “These are long and slow hours, sir, that we are passing on the railway.”",
  "“Yes,” replied Mr. Fogg; “but they pass.”",
  "“You were in the habit of playing whist,” resumed Fix, “on the steamers.”",
  "“Yes; but it would be difficult to do so here. I have neither cards nor partners.”",
  "“Oh, but we can easily buy some cards, for they are sold on all the American trains. And as for partners, if madam plays⁠—”",
  "“Certainly, sir,” Aouda quickly replied; “I understand whist. It is part of an English education.”",
  "“I myself have some pretensions to playing a good game. Well, here are three of us, and a dummy⁠—”",
  "“As you please, sir,” replied Phileas Fogg, heartily glad to resume his favourite pastime even on the railway.",
  "Passepartout was dispatched in search of the steward, and soon returned with two packs of cards, some pins, counters, and a shelf covered with cloth.",
  "The game commenced. Aouda understood whist sufficiently well, and even received some compliments on her playing from Mr. Fogg. As for the detective, he was simply an adept, and worthy of being matched against his present opponent.",
  "“Now,” thought Passepartout, “we’ve got him. He won’t budge.”",
  "At eleven in the morning the train had reached the dividing ridge of the waters at Bridger Pass, seven thousand five hundred and twenty-four feet above the level of the sea, one of the highest points attained by the track in crossing the Rocky Mountains. After going about two hundred miles, the travellers at last found themselves on one of those vast plains which extend to the Atlantic, and which nature has made so propitious for laying the iron road.",
  "On the declivity of the Atlantic basin the first streams, branches of the North Platte River, already appeared. The whole northern and eastern horizon was bounded by the immense semicircular curtain which is formed by the southern portion of the Rocky Mountains, the highest being Laramie Peak. Between this and the railway extended vast plains, plentifully irrigated. On the right rose the lower spurs of the mountainous mass which extends southward to the sources of the Arkansas River, one of the great tributaries of the Missouri.",
  "At half-past twelve the travellers caught sight for an instant of Fort Halleck, which commands that section; and in a few more hours the Rocky Mountains were crossed. There was reason to hope, then, that no accident would mark the journey through this difficult country. The snow had ceased falling, and the air became crisp and cold. Large birds, frightened by the locomotive, rose and flew off in the distance. No wild beast appeared on the plain. It was a desert in its vast nakedness.",
  "After a comfortable breakfast, served in the car, Mr. Fogg and his partners had just resumed whist, when a violent whistling was heard, and the train stopped. Passepartout put his head out of the door, but saw nothing to cause the delay; no station was in view.",
  "Aouda and Fix feared that Mr. Fogg might take it into his head to get out; but that gentleman contented himself with saying to his servant, “See what is the matter.”",
  "Passepartout rushed out of the car. Thirty or forty passengers had already descended, amongst them Colonel Stamp Proctor.",
  "The train had stopped before a red signal which blocked the way. The engineer and conductor were talking excitedly with a signalman, whom the stationmaster at Medicine Bow, the next stopping place, had sent on before. The passengers drew around and took part in the discussion, in which Colonel Proctor, with his insolent manner, was conspicuous.",
  "Passepartout, joining the group, heard the signalman say, “No! you can’t pass. The bridge at Medicine Bow is shaky, and would not bear the weight of the train.”",
  "This was a suspension-bridge thrown over some rapids, about a mile from the place where they now were. According to the signalman, it was in a ruinous condition, several of the iron wires being broken; and it was impossible to risk the passage. He did not in any way exaggerate the condition of the bridge. It may be taken for granted that, rash as the Americans usually are, when they are prudent there is good reason for it.",
  "Passepartout, not daring to apprise his master of what he heard, listened with set teeth, immovable as a statue.",
  "“Hum!” cried Colonel Proctor; “but we are not going to stay here, I imagine, and take root in the snow?”",
  "“Colonel,” replied the conductor, “we have telegraphed to Omaha for a train, but it is not likely that it will reach Medicine Bow in less than six hours.”",
  "“Six hours!” cried Passepartout.",
  "“Certainly,” returned the conductor, “besides, it will take us as long as that to reach Medicine Bow on foot.”",
  "“But it is only a mile from here,” said one of the passengers.",
  "“Yes, but it’s on the other side of the river.”",
  "“And can’t we cross that in a boat?” asked the colonel.",
  "“That’s impossible. The creek is swelled by the rains. It is a rapid, and we shall have to make a circuit of ten miles to the north to find a ford.”",
  "The colonel launched a volley of oaths, denouncing the railway company and the conductor; and Passepartout, who was furious, was not disinclined to make common cause with him. Here was an obstacle, indeed, which all his master’s banknotes could not remove.",
  "There was a general disappointment among the passengers, who, without reckoning the delay, saw themselves compelled to trudge fifteen miles over a plain covered with snow. They grumbled and protested, and would certainly have thus attracted Phileas Fogg’s attention if he had not been completely absorbed in his game.",
  "Passepartout found that he could not avoid telling his master what had occurred, and, with hanging head, he was turning towards the car, when the engineer, a true Yankee, named Forster called out, “Gentlemen, perhaps there is a way, after all, to get over.”",
  "“On the bridge?” asked a passenger.",
  "“On the bridge.”",
  "“With our train?”",
  "“With our train.”",
  "Passepartout stopped short, and eagerly listened to the engineer.",
  "“But the bridge is unsafe,” urged the conductor.",
  "“No matter,” replied Forster; “I think that by putting on the very highest speed we might have a chance of getting over.”",
  "“The devil!” muttered Passepartout.",
  "But a number of the passengers were at once attracted by the engineer’s proposal, and Colonel Proctor was especially delighted, and found the plan a very feasible one. He told stories about engineers leaping their trains over rivers without bridges, by putting on full steam; and many of those present avowed themselves of the engineer’s mind.",
  "“We have fifty chances out of a hundred of getting over,” said one.",
  "“Eighty! ninety!”",
  "Passepartout was astounded, and, though ready to attempt anything to get over Medicine Creek, thought the experiment proposed a little too American. “Besides,” thought he, “there’s a still more simple way, and it does not even occur to any of these people! Sir,” said he aloud to one of the passengers, “the engineer’s plan seems to me a little dangerous, but⁠—”",
  "“Eighty chances!” replied the passenger, turning his back on him.",
  "“I know it,” said Passepartout, turning to another passenger, “but a simple idea⁠—”",
  "“Ideas are no use,” returned the American, shrugging his shoulders, “as the engineer assures us that we can pass.”",
  "“Doubtless,” urged Passepartout, “we can pass, but perhaps it would be more prudent⁠—”",
  "“What! Prudent!” cried Colonel Proctor, whom this word seemed to excite prodigiously. “At full speed, don’t you see, at full speed!”",
  "“I know⁠—I see,” repeated Passepartout; “but it would be, if not more prudent, since that word displeases you, at least more natural⁠—”",
  "“Who! What! What’s the matter with this fellow?” cried several.",
  "The poor fellow did not know to whom to address himself.",
  "“Are you afraid?” asked Colonel Proctor.",
  "“I afraid? Very well; I will show these people that a Frenchman can be as American as they!”",
  "“All aboard!” cried the conductor.",
  "“Yes, all aboard!” repeated Passepartout, and immediately. “But they can’t prevent me from thinking that it would be more natural for us to cross the bridge on foot, and let the train come after!”",
  "But no one heard this sage reflection, nor would anyone have acknowledged its justice. The passengers resumed their places in the cars. Passepartout took his seat without telling what had passed. The whist-players were quite absorbed in their game.",
  "The locomotive whistled vigorously; the engineer, reversing the steam, backed the train for nearly a mile⁠—retiring, like a jumper, in order to take a longer leap. Then, with another whistle, he began to move forward; the train increased its speed, and soon its rapidity became frightful; a prolonged screech issued from the locomotive; the piston worked up and down twenty strokes to the second. They perceived that the whole train, rushing on at the rate of a hundred miles an hour, hardly bore upon the rails at all.",
  "And they passed over! It was like a flash. No one saw the bridge. The train leaped, so to speak, from one bank to the other, and the engineer could not stop it until it had gone five miles beyond the station. But scarcely had the train passed the river, when the bridge, completely ruined, fell with a crash into the rapids of Medicine Bow."
];
const arabic=[
  "غادر القطار بحيرة الملح الكبرى عند أوجدن، واتجه شمالًا ساعة كاملة حتى نهر ويبر، بعدما قطع قرابة تسعمئة ميل من سان فرانسيسكو. ثم انعطف شرقًا نحو جبال واشاتش الوعرة. وفي المنطقة الواقعة بين هذه السلسلة وجبال روكي واجه المهندسون الأمريكيون أصعب مشكلات مدّ السكة؛ لذلك منحت الحكومة دعمًا قدره ثمانية وأربعون ألف دولار لكل ميل، بدلًا من ستة عشر ألفًا للأعمال المنجزة في السهول. لكن المهندسين التفّوا حول العوائق بدلًا من شقّ الصخور وانتهاك طبيعة الأرض، ولم يحفروا سوى نفق واحد يبلغ طوله أربعة عشر ألف قدم للوصول إلى الحوض الكبير.",
  "بلغ خط السكة حتى ذلك الوقت أعلى ارتفاع له عند بحيرة الملح الكبرى. ومن هناك أخذ منعطفًا طويلًا هابطًا نحو وادي بيتر كريك، ثم ارتفع مجددًا إلى الحافة الفاصلة بين مجاري المياه المتجهة إلى الأطلسي وتلك المتجهة إلى الهادئ. وكانت الجداول كثيرة في هذه المنطقة الجبلية، فاضطروا إلى عبور مَدي كريك وغرين كريك وغيرها بواسطة قنوات وجسور تصريف.",
  "ازداد نفاد صبر باسبارتو كلما واصلوا السير، بينما كان فيكس يتوق إلى مغادرة هذه المنطقة الصعبة. بل إن قلقه من التأخير والحوادث ورغبته في الوصول إلى أرض إنجلترا سبقا قلق فيلياس فوغ نفسه.",
  "توقف القطار عند محطة فورت بريدجر في العاشرة ليلًا، وبعد عشرين دقيقة دخل إقليم وايومنغ وتابع سيره في وادي بيتر كريك. وفي اليوم التالي، السابع من ديسمبر، توقف ربع ساعة في محطة غرين ريفر. كان الثلج قد تساقط بكثرة خلال الليل، لكنه اختلط بالمطر وذاب نصفه، فلم يعرقل الرحلة. ومع ذلك أزعج الطقس السيئ باسبارتو؛ إذ كان تراكم الثلج وانسداد عجلات العربات به كفيلين بإفساد رحلة السيد فوغ.",
  "قال في نفسه: «يا لها من فكرة! لماذا اختار سيدي السفر في الشتاء؟ ألم يكن بوسعه انتظار الفصل الأفضل ليزيد فرص نجاحه؟»",
  "وبينما كان الفرنسي الطيب منشغلًا بحالة السماء وانخفاض الحرارة، كانت أودا تعيش مخاوف من سبب مختلف تمامًا.",
  "نزل عدد من الركاب في غرين ريفر وأخذوا يتمشون على الأرصفة، فرأت أودا بينهم العقيد ستامب بروكتور، الرجل نفسه الذي أهان فيلياس فوغ بفظاظة في اجتماع سان فرانسيسكو. وتراجعت الشابة عن النافذة كيلا يتعرف إليها، وقد أصابها اكتشافه بقلق شديد. كانت متعلقة بالرجل الذي يمنحها، رغم بروده الظاهر، دلائل يومية على إخلاص لا حدود له. وربما لم تدرك عمق الشعور الذي أثاره فيها حاميها، وسمّته امتنانًا، مع أنه كان في الحقيقة أكثر من ذلك من دون أن تعي. وانقبض قلبها حين تذكرت أن السيد فوغ يريد عاجلًا أم آجلًا محاسبة الرجل على تصرفه. ومن الواضح أن المصادفة وحدها جاءت بالعقيد بروكتور إلى القطار، لكن وجوده جعل من الضروري، مهما كلّف الأمر، ألا يراه فوغ.",
  "استغلت أودا لحظة كان فيها السيد فوغ نائمًا لتخبر فيكس وباسبارتو بمن رأته.",
  "صاح فيكس: «بروكتور على هذا القطار! اطمئني يا سيدتي؛ قبل أن يتواجه مع السيد فوغ، عليه أن يتعامل معي أنا! وأظن أنني تلقيت الإهانة الأكبر بيننا.»",
  "وأضاف باسبارتو: «وفوق ذلك، سأتولى أمره أنا، مهما كان عقيدًا!»",
  "قالت أودا مستأنفة حديثها: «يا سيد فيكس، لن يسمح السيد فوغ لأحد بالانتقام نيابة عنه. لقد قال إنه سيعود إلى أمريكا ليبحث عن هذا الرجل. وإذا لمح العقيد بروكتور فلن نستطيع منع مواجهة قد تفضي إلى عواقب مروعة. يجب ألا يراه.»",
  "أجاب فيكس: «أنت محقة يا سيدتي؛ فقد تفسد المواجهة كل شيء. سواء انتصر السيد فوغ أم هُزم، فسيتأخر، و...»",
  "أكمل باسبارتو: «وهذا بالضبط ما يتمناه سادة نادي الإصلاح. سنكون في نيويورك بعد أربعة أيام. فإذا بقي سيدي داخل هذه العربة طوال الأيام الأربعة، فربما لا تجمعه المصادفة بهذا الأمريكي الملعون. علينا، إن أمكن، أن نمنعه من الخروج منها.»",
  "انقطع الحديث. كان السيد فوغ قد استيقظ لتوّه وأخذ ينظر من النافذة. وبعد قليل، همس باسبارتو للمحقق من دون أن يسمعه سيده أو أودا: «هل كنت ستقاتل حقًا من أجله؟»",
  "أجاب فيكس بنبرة تكشف عن عزيمة راسخة: «سأفعل أي شيء لأعيده إلى أوروبا حيًّا!»",
  "شعر باسبارتو بقشعريرة تسري في جسده، لكن ثقته بسيده بقيت راسخة لا تتزعزع.",
  "هل توجد وسيلة لإبقاء السيد فوغ داخل العربة وتجنّب لقائه بالعقيد؟ لم يكن الأمر يبدو صعبًا، فالسيد بطبيعته يحب الجلوس ولا يستهويه الفضول كثيرًا. ويبدو أن المحقق وجد وسيلة بالفعل؛ إذ قال لفوغ بعد لحظات: «إن الساعات التي نقضيها في القطار طويلة وبطيئة يا سيدي.»",
  "أجاب السيد فوغ: «نعم، لكنها تمضي.»",
  "تابع فيكس: «كنت معتادًا على لعب الوِست على متن السفن.»",
  "قال فوغ: «نعم، لكن ذلك صعب هنا؛ فلا أوراق لعب معي ولا شركاء.»",
  "قال فيكس: «يمكننا شراء أوراق بسهولة، فهي تُباع في جميع القطارات الأمريكية. أما الشركاء، فإذا كانت السيدة تجيد اللعب...»",
  "أجابت أودا بسرعة: «بالتأكيد يا سيدي، فأنا أعرف لعبة الوِست؛ إنها جزء من التعليم الإنجليزي.»",
  "قال فيكس: «وأنا أيضًا أظن أنني أجيد اللعب. وهكذا نكون ثلاثة، ومعنا لاعب وهمي...»",
  "رد فيلياس فوغ: «كما تشاء يا سيدي»، وكان مسرورًا حقًا لأنه يستطيع العودة إلى هوايته المفضلة حتى في القطار.",
  "أُرسل باسبارتو للبحث عن المضيف، فعاد سريعًا ومعه مجموعتان من أوراق اللعب وبعض الدبابيس والعدادات ولوح صغير مغطى بالقماش.",
  "بدأت اللعبة. كانت أودا تعرف الوِست معرفة كافية، بل نالت بعض الإطراء على لعبها من السيد فوغ. أما المحقق فكان ماهرًا بحق، وخصمًا جديرًا بمنافسه الحالي.",
  "فكر باسبارتو: «ها قد أمسكنا به؛ لن يتحرك من مكانه.»",
  "عند الحادية عشرة صباحًا بلغ القطار حافة تقسيم المياه عند ممر بريدجر، على ارتفاع سبعة آلاف وخمسمئة وأربعة وعشرين قدمًا فوق سطح البحر؛ وهي من أعلى النقاط التي بلغتها السكة أثناء عبورها جبال روكي. وبعد قطع نحو مئتي ميل، وجد المسافرون أنفسهم أخيرًا في إحدى السهول الشاسعة الممتدة نحو الأطلسي، وهي أرض هيأتها الطبيعة لمدّ خطوط السكك الحديدية.",
  "وعلى منحدر حوض الأطلسي ظهرت الجداول الأولى، وهي فروع نهر نورث بلات. وكان الأفق الشمالي والشرقي محاطًا بستار هائل نصف دائري تشكله الجهة الجنوبية من جبال روكي، وتتوجها قمة لارامي. وامتدت بين القمة والسكة سهول واسعة كثيرة الري. وعلى اليمين ارتفعت سفوح منخفضة من الكتلة الجبلية التي تمتد جنوبًا إلى منابع نهر أركنساس، أحد الروافد الكبرى لنهر ميزوري.",
  "عند الثانية عشرة والنصف لمح المسافرون حصن هاليك للحظة، وهو يهيمن على ذلك الجزء من الطريق، وبعد ساعات قليلة اجتازوا جبال روكي. بدا من المعقول إذن أن تنتهي الرحلة عبر هذه المنطقة الصعبة من دون حادث. توقف تساقط الثلج وأصبح الهواء نقيًا باردًا. وفزعت طيور كبيرة من صوت القاطرة فحلّقت مبتعدة في الأفق، ولم يظهر أي حيوان بري في السهل؛ فقد بدا المكان صحراء عارية شاسعة.",
  "بعد فطور مريح قُدّم داخل العربة، كان السيد فوغ وشركاؤه قد استأنفوا لعبة الوِست حين دوّى صفير قوي وتوقف القطار. أخرج باسبارتو رأسه من الباب، لكنه لم ير ما يفسر التأخير؛ فلم تكن أي محطة ظاهرة.",
  "خشيت أودا وفيكس أن تخطر للسيد فوغ فكرة النزول، لكنه اكتفى بأن قال لخادمه: «اذهب وانظر ما الأمر.»",
  "اندفع باسبارتو خارج العربة. وكان ثلاثون أو أربعون راكبًا قد نزلوا بالفعل، ومن بينهم العقيد ستامب بروكتور.",
  "كان القطار قد توقف أمام إشارة حمراء تسد الطريق. وكان المهندس وقائد القطار يتحدثان بانفعال مع عامل الإشارات الذي أرسله رئيس محطة ميديسين بو، المحطة التالية، ليستبق القطار. وتجمع الركاب حولهم وشاركوا في النقاش، وكان العقيد بروكتور بارزًا بينهم بأسلوبه المتعجرف.",
  "سمع باسبارتو عامل الإشارات يقول: «لا! لا يمكنكم المرور. جسر ميديسين بو مهتز ولن يتحمل وزن القطار.»",
  "كان ذلك جسرًا معلقًا فوق مياه سريعة، على بعد نحو ميل من موضعهم. وبحسب عامل الإشارات، كان الجسر متهالكًا، وقد انقطعت عدة أسلاك حديدية منه، ولذلك كان عبوره مجازفة مستحيلة. ولم يكن يبالغ في وصف حالته؛ فحتى الأمريكيون المعروفون بجرأتهم لا يتوخون الحذر إلا لسبب وجيه.",
  "لم يجرؤ باسبارتو على إخبار سيده بما سمع، فظل يستمع بأسنان مطبقة وجسد جامد كأنه تمثال.",
  "صاح العقيد بروكتور: «همم! لكننا لن نبقى هنا، على ما أظن، حتى تنبت لنا جذور في الثلج!»",
  "أجاب قائد القطار: «يا عقيد، أرسلنا برقية إلى أوماها لطلب قطار آخر، لكن من غير المرجح أن يصل إلى ميديسين بو قبل مرور ست ساعات على الأقل.»",
  "صرخ باسبارتو: «ست ساعات!»",
  "قال قائد القطار: «بالتأكيد، وفوق ذلك سيستغرق وصولنا سيرًا على الأقدام إلى ميديسين بو وقتًا مماثلًا.»",
  "قال أحد الركاب: «لكنها لا تبعد سوى ميل واحد من هنا.»",
  "أجاب الرجل: «نعم، لكنها تقع على الضفة الأخرى من النهر.»",
  "سأل العقيد: «ألا يمكننا عبور النهر بقارب؟»",
  "قال عامل الإشارات: «هذا مستحيل. لقد رفعت الأمطار منسوب الجدول وجعلت تياره سريعًا، وسنضطر إلى الالتفاف عشرة أميال شمالًا للعثور على مخاضة آمنة.»",
  "أطلق العقيد وابلًا من الشتائم، مندّدًا بشركة السكك الحديدية وبقائد القطار. وكان باسبارتو الغاضب مستعدًا للانضمام إليه. لقد ظهر عائق لا تستطيع كل الأوراق النقدية التي يملكها سيده إزالته.",
  "ساد الإحباط بين الركاب؛ فإضافة إلى التأخير، صار عليهم قطع خمسة عشر ميلًا مشيًا فوق سهل تغطيه الثلوج. تذمروا واحتجوا، وكان من المؤكد أن ضجيجهم سيجذب انتباه فيلياس فوغ لولا أنه كان غارقًا تمامًا في لعبته.",
  "أدرك باسبارتو أنه لا يستطيع تجنب إخبار سيده بما حدث، وكان يتجه نحو العربة مطأطئ الرأس، حين صاح المهندس، واسمه فورستر، وهو أمريكي حقيقي: «أيها السادة، ربما توجد مع ذلك طريقة لعبور النهر.»",
  "سأل أحد الركاب: «عبر الجسر؟»",
  "أجاب المهندس: «عبر الجسر.»",
  "سأل آخر: «بقطارنا؟»",
  "قال فورستر: «بقطارنا.»",
  "توقف باسبارتو في مكانه وأصغى إلى المهندس باهتمام شديد.",
  "اعترض قائد القطار: «لكن الجسر غير آمن.»",
  "رد فورستر: «لا يهم؛ أعتقد أن زيادة السرعة إلى أقصى حد قد تمنحنا فرصة للعبور.»",
  "تمتم باسبارتو: «يا إلهي!»",
  "اجتذب اقتراح المهندس عددًا من الركاب فورًا، وكان العقيد بروكتور أشدهم حماسًا ورآه خطة قابلة للتنفيذ تمامًا. وراح يروي قصصًا عن مهندسين قفزوا بقطاراتهم فوق الأنهار من دون جسور باستخدام كامل قوة البخار، وأعلن كثيرون موافقتهم على رأيه.",
  "قال أحدهم: «لدينا خمسون فرصة من أصل مئة للنجاح.»",
  "هتف آخرون: «ثمانون! تسعون!»",
  "ذهل باسبارتو. ومع أنه كان مستعدًا لفعل أي شيء لعبور ميديسين كريك، رأى أن التجربة المقترحة أمريكية أكثر مما ينبغي. وفكر: «هناك حل أبسط، ولا يخطر ببال أحد منهم!». ثم قال لأحد الركاب بصوت مسموع: «تبدو لي خطة المهندس خطرة بعض الشيء، لكن...»",
  "أجابه الراكب وهو يدير ظهره: «ثمانون فرصة!»",
  "قال باسبارتو، ملتفتًا إلى راكب آخر: «أعرف ذلك، لكن لدي فكرة بسيطة...»",
  "رد الأمريكي وهو يهز كتفيه: «الأفكار لا تنفع ما دام المهندس يؤكد أننا نستطيع العبور.»",
  "ألح باسبارتو: «لا شك أننا قد نعبر، لكن ربما يكون التصرف الأكثر حكمة...»",
  "صاح العقيد بروكتور، وقد أثارت كلمة «الحكمة» حماسته بشدة: «ماذا؟ الحذر؟ ألا ترى أن علينا الانطلاق بأقصى سرعة، بأقصى سرعة!»",
  "كرر باسبارتو: «أعرف... أرى ذلك، لكن إن لم يعجبكم وصف الأمر بالأكثر حذرًا، فسيكون على الأقل أكثر منطقية...»",
  "صاح عدة أشخاص: «من هذا؟ ماذا يريد؟ ما خطب هذا الرجل؟»",
  "لم يعرف المسكين إلى من يوجّه كلامه.",
  "سأله العقيد بروكتور: «هل أنت خائف؟»",
  "قال باسبارتو: «أنا خائف؟ حسنًا، سأريكم أن الفرنسي يستطيع أن يكون أمريكيًا مثل هؤلاء!»",
  "صاح قائد القطار: «الجميع إلى العربات!»",
  "كرر باسبارتو: «نعم، إلى العربات فورًا! لكن لا أحد يستطيع منعي من التفكير في أن الأجدى أن نعبر الجسر سيرًا على الأقدام، ثم نترك القطار يلحق بنا!»",
  "لكن أحدًا لم يسمع هذه الملاحظة الحكيمة، ولم يكن أحد ليعترف بصوابها. عاد الركاب إلى عرباتهم، وجلس باسبارتو من دون أن يخبر الآخرين بما دار، فيما ظل لاعبو الوِست مستغرقين في لعبتهم.",
  "أطلقت القاطرة صفيرًا قويًا، وعكس المهندس اتجاه البخار وأرجع القطار قرابة ميل إلى الخلف، كأن عدّاءً يتراجع ليأخذ مسافة أطول للقفز. ثم أطلق صفيرًا آخر وانطلق إلى الأمام؛ وازدادت السرعة حتى أصبحت مرعبة، وخرج من القاطرة صرير طويل، فيما تحرك المكبس صعودًا وهبوطًا عشرين مرة في الثانية. وأدرك الركاب أن القطار كله، وهو يندفع بسرعة مئة ميل في الساعة، يكاد لا يلامس القضبان.",
  "واجتازوا الجسر! حدث الأمر في لمح البصر، فلم ير أحد الجسر. قفز القطار، إن صح التعبير، من ضفة إلى الأخرى، ولم يتمكن المهندس من إيقافه إلا بعد أن تجاوز المحطة بخمسة أميال. وما إن عبر القطار النهر حتى انهار الجسر المتداعي تمامًا وسقط بصوت مدوٍّ في مياه ميديسين بو السريعة."
];
const terms=[
  {
    "term": "formidable difficulties",
    "literal": "صعوبات جسيمة",
    "context": "مشكلات شديدة التعقيد",
    "note": "Chapter XXVIII: بناء السكة بين الجبال",
    "type": "phrase"
  },
  {
    "term": "subsidy",
    "literal": "إعانة مالية",
    "context": "دعم حكومي لتغطية جزء من التكلفة",
    "note": "Chapter XXVIII: تمويل مدّ السكة",
    "type": "word"
  },
  {
    "term": "winding around",
    "literal": "الالتفاف حول",
    "context": "اختيار مسار يحيط بالعائق بدل اختراقه",
    "note": "Chapter XXVIII: تجاوز الصخور",
    "type": "phrase"
  },
  {
    "term": "dividing ridge",
    "literal": "حافة تقسيم المياه",
    "context": "مرتفَع يفصل اتجاهات جريان المياه",
    "note": "Chapter XXVIII: الحد الفاصل بين الحوضين",
    "type": "phrase"
  },
  {
    "term": "culverts",
    "literal": "قنوات تصريف",
    "context": "ممرات تسمح بعبور المياه أسفل الطريق",
    "note": "Chapter XXVIII: عبور الجداول",
    "type": "word"
  },
  {
    "term": "impatient",
    "literal": "نافد الصبر",
    "context": "متضايق من الانتظار والتأخير",
    "note": "Chapter XXVIII: قلق باسبارتو",
    "type": "word"
  },
  {
    "term": "abundantly",
    "literal": "بكثرة",
    "context": "بكمية كبيرة",
    "note": "Chapter XXVIII: تساقط الثلج",
    "type": "adverb"
  },
  {
    "term": "absorbed in",
    "literal": "منهمك في",
    "context": "مستغرق في نشاط لا يلتفت معه لما حوله",
    "note": "Chapter XXVIII: انشغال فوغ بالورق",
    "type": "phrase"
  },
  {
    "term": "depression of the temperature",
    "literal": "انخفاض درجة الحرارة",
    "context": "هبوط حرارة الجو",
    "note": "Chapter XXVIII: طقس وايومنغ",
    "type": "phrase"
  },
  {
    "term": "recognised",
    "literal": "تعرّفت إلى",
    "context": "عرفت الشخص بعد رؤيته",
    "note": "Chapter XXVIII: اكتشاف أودا للعقيد",
    "type": "word"
  },
  {
    "term": "absolute devotion",
    "literal": "إخلاص مطلق",
    "context": "وفاء شديد لا يتزعزع",
    "note": "Chapter XXVIII: مشاعر أودا تجاه فوغ",
    "type": "phrase"
  },
  {
    "term": "call to account",
    "literal": "يحاسب",
    "context": "يطلب تفسيرًا أو مساءلة عن تصرف",
    "note": "Chapter XXVIII: عزم فوغ على مواجهة بروكتور",
    "type": "phrase"
  },
  {
    "term": "at all hazards",
    "literal": "مهما كلّف الأمر",
    "context": "بصرف النظر عن المخاطر أو الثمن",
    "note": "Chapter XXVIII: إخفاء بروكتور عن فوغ",
    "type": "phrase"
  },
  {
    "term": "collision",
    "literal": "مواجهة",
    "context": "اصطدام أو لقاء قد ينتهي بصدام",
    "note": "Chapter XXVIII: تجنّب المواجهة",
    "type": "word"
  },
  {
    "term": "stirring out",
    "literal": "الخروج والتحرك",
    "context": "مغادرة المكان أو النهوض منه",
    "note": "Chapter XXVIII: إبقاء فوغ في العربة",
    "type": "phrase"
  },
  {
    "term": "whist",
    "literal": "الوِست",
    "context": "لعبة ورق جماعية تقليدية",
    "note": "Chapter XXVIII: تسلية المسافرين",
    "type": "word"
  },
  {
    "term": "dummy",
    "literal": "اللاعب الوهمي",
    "context": "يد أوراق تُلعب مكشوفة نيابة عن شريك",
    "note": "Chapter XXVIII: ترتيب لعبة الوِست",
    "type": "word"
  },
  {
    "term": "dispatched",
    "literal": "أُرسل",
    "context": "أُوفد لتنفيذ مهمة",
    "note": "Chapter XXVIII: إحضار أوراق اللعب",
    "type": "word"
  },
  {
    "term": "adept",
    "literal": "ماهر",
    "context": "ذو خبرة ومهارة عالية",
    "note": "Chapter XXVIII: مهارة فيكس في اللعب",
    "type": "word"
  },
  {
    "term": "declivity",
    "literal": "منحدر",
    "context": "سطح ينخفض تدريجيًا",
    "note": "Chapter XXVIII: نزول القطار نحو الأطلسي",
    "type": "word"
  },
  {
    "term": "plentifully irrigated",
    "literal": "كثيرة الري",
    "context": "تصلها المياه بوفرة",
    "note": "Chapter XXVIII: وصف السهول",
    "type": "phrase"
  },
  {
    "term": "caught sight for an instant",
    "literal": "لمح للحظة",
    "context": "رأى شيئًا سريعًا قبل أن يختفي",
    "note": "Chapter XXVIII: رؤية حصن هاليك",
    "type": "phrase"
  },
  {
    "term": "crisp and cold",
    "literal": "نقي وبارد",
    "context": "هواء بارد واضح ومنعش",
    "note": "Chapter XXVIII: الطقس بعد الثلج",
    "type": "phrase"
  },
  {
    "term": "red signal",
    "literal": "إشارة حمراء",
    "context": "علامة توقف تمنع المرور",
    "note": "Chapter XXVIII: إيقاف القطار",
    "type": "phrase"
  },
  {
    "term": "signalman",
    "literal": "عامل الإشارات",
    "context": "مسؤول إشارات حركة القطارات",
    "note": "Chapter XXVIII: تحذير الجسر",
    "type": "word"
  },
  {
    "term": "suspension-bridge",
    "literal": "جسر معلّق",
    "context": "جسر يحمل سطحه كابلات معلقة",
    "note": "Chapter XXVIII: جسر ميديسين بو",
    "type": "word"
  },
  {
    "term": "shaky",
    "literal": "مهتز",
    "context": "غير ثابت أو متين",
    "note": "Chapter XXVIII: تحذير من الجسر",
    "type": "word"
  },
  {
    "term": "ruinous condition",
    "literal": "حالة متهالكة",
    "context": "تدهور شديد يجعل الشيء غير آمن",
    "note": "Chapter XXVIII: أسلاك الجسر المقطوعة",
    "type": "phrase"
  },
  {
    "term": "set teeth",
    "literal": "أسنان مطبقة",
    "context": "تعبير عن التوتر والغضب المكبوت",
    "note": "Chapter XXVIII: صمت باسبارتو",
    "type": "phrase"
  },
  {
    "term": "take root",
    "literal": "تتجذر",
    "context": "تثبت في المكان كأنها تنبت جذورًا",
    "note": "Chapter XXVIII: مزحة العقيد عن الثلج",
    "type": "phrase"
  },
  {
    "term": "ford",
    "literal": "مخاضة",
    "context": "موضع ضحل يمكن عبور النهر منه",
    "note": "Chapter XXVIII: البحث عن معبر",
    "type": "word"
  },
  {
    "term": "make common cause",
    "literal": "يتحالف",
    "context": "ينضم إلى شخص في موقف أو خصومة",
    "note": "Chapter XXVIII: غضب باسبارتو من التأخير",
    "type": "phrase"
  },
  {
    "term": "trudge",
    "literal": "يمشي بمشقة",
    "context": "يتقدم بخطوات ثقيلة لمسافة طويلة",
    "note": "Chapter XXVIII: السير فوق الثلج",
    "type": "word"
  },
  {
    "term": "feasible",
    "literal": "قابل للتنفيذ",
    "context": "يمكن تطبيقه عمليًا",
    "note": "Chapter XXVIII: اقتراح المهندس",
    "type": "word"
  },
  {
    "term": "full steam",
    "literal": "كامل قوة البخار",
    "context": "استخدام أقصى قدرة للمحرك البخاري",
    "note": "Chapter XXVIII: اقتراح القفز بالقطار",
    "type": "phrase"
  },
  {
    "term": "avowed themselves",
    "literal": "أعلنوا تأييدهم",
    "context": "صرّحوا بأنهم يتفقون مع رأي",
    "note": "Chapter XXVIII: موافقة الركاب",
    "type": "phrase"
  },
  {
    "term": "sage reflection",
    "literal": "ملاحظة حكيمة",
    "context": "فكرة سليمة لم يلتفت إليها الآخرون",
    "note": "Chapter XXVIII: اقتراح عبور الجسر مشيًا",
    "type": "phrase"
  },
  {
    "term": "reversing the steam",
    "literal": "عكس اتجاه البخار",
    "context": "تغيير اتجاه الدفع لتحريك القطار إلى الخلف",
    "note": "Chapter XXVIII: استعداد القاطرة للاندفاع",
    "type": "phrase"
  },
  {
    "term": "prolonged screech",
    "literal": "صرير طويل",
    "context": "صوت حاد ممتد",
    "note": "Chapter XXVIII: صوت القاطرة",
    "type": "phrase"
  },
  {
    "term": "piston",
    "literal": "مكبس",
    "context": "قطعة تتحرك داخل الأسطوانة لتحويل ضغط البخار إلى حركة",
    "note": "Chapter XXVIII: حركة المحرك",
    "type": "word"
  }
];
if(english.length!==75||arabic.length!==english.length||terms.length!==40)throw Error('Towle XXVIII bilingual alignment mismatch');
s.chapters.push({title:"In which Passepartout does not succeed in making anybody listen to reason.",titleAr:"لا ينجح باسبارتو في إقناع أحد بالاستماع إلى المنطق",paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;s.subtitle='The original Towle translation — Chapters I–XXVIII';
s.description='A dangerous bridge stops the train in the Rocky Mountains, and Passepartout struggles to persuade the passengers to choose a safer crossing.';
s.editorialStatus='English Chapters I–XXVIII source-transcribed; Arabic draft pending independent review; 28 of 37 chapters';
s.provenance+=' Chapter XXVIII: Standard Ebooks Towle transcription (CC0 editorial edition; source blob 4e233a81707c90e3c70ae89cc66309049a012bee); territory-specific rights pending review.';
})(window);
