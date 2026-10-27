/* Lingua Tales — authentic Towle Chapters XXXI–XXXII; Standard Ebooks CC0 editorial transcription.
 * Upstream repository: standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle
 * Source commit: 56c82e97ff5d4f8950afca05b71af72688a8da34
 * Chapter XXXI source blob: 3f96f87cf359251196f1a935314eaedce8d676fd; src/epub/text/chapter-31.xhtml; 37 body paragraphs / 1,843 words.
 * Chapter XXXII source blob: e218533192364ce19436fcc65e9cd2d93842c8d5; src/epub/text/chapter-32.xhtml; 50 body paragraphs / 1,051 words; normalized English SHA-256: 992fcb13f472c5638ec7bfe89569351bc64c17a40d2b671b598df4679d4f5877.
 * Arabic is a companion draft pending independent literary review; historical framing is retained, not endorsed.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==30)throw Error('Towle chapter XXXI load order mismatch');
const english=[
  "Phileas Fogg found himself twenty hours behind time. Passepartout, the involuntary cause of this delay, was desperate. He had ruined his master!",
  "At this moment the detective approached Mr. Fogg, and, looking him intently in the face, said:",
  "“Seriously, sir, are you in great haste?”",
  "“Quite seriously.”",
  "“I have a purpose in asking,” resumed Fix. “Is it absolutely necessary that you should be in New York on the 11th, before nine o’clock in the evening, the time that the steamer leaves for Liverpool?”",
  "“It is absolutely necessary.”",
  "“And, if your journey had not been interrupted by these Indians, you would have reached New York on the morning of the 11th?”",
  "“Yes; with eleven hours to spare before the steamer left.”",
  "“Good! you are therefore twenty hours behind. Twelve from twenty leaves eight. You must regain eight hours. Do you wish to try to do so?”",
  "“On foot?” asked Mr. Fogg.",
  "“No; on a sledge,” replied Fix. “On a sledge with sails. A man has proposed such a method to me.”",
  "It was the man who had spoken to Fix during the night, and whose offer he had refused.",
  "Phileas Fogg did not reply at once; but Fix, having pointed out the man, who was walking up and down in front of the station, Mr. Fogg went up to him. An instant after, Mr. Fogg and the American, whose name was Mudge, entered a hut built just below the fort.",
  "There Mr. Fogg examined a curious vehicle, a kind of frame on two long beams, a little raised in front like the runners of a sledge, and upon which there was room for five or six persons. A high mast was fixed on the frame, held firmly by metallic lashings, to which was attached a large brigantine sail. This mast held an iron stay upon which to hoist a jib-sail. Behind, a sort of rudder served to guide the vehicle. It was, in short, a sledge rigged like a sloop. During the winter, when the trains are blocked up by the snow, these sledges make extremely rapid journeys across the frozen plains from one station to another. Provided with more sails than a cutter, and with the wind behind them, they slip over the surface of the prairies with a speed equal if not superior to that of the express trains.",
  "Mr. Fogg readily made a bargain with the owner of this land-craft. The wind was favourable, being fresh, and blowing from the west. The snow had hardened, and Mudge was very confident of being able to transport Mr. Fogg in a few hours to Omaha. Thence the trains eastward run frequently to Chicago and New York. It was not impossible that the lost time might yet be recovered; and such an opportunity was not to be rejected.",
  "Not wishing to expose Aouda to the discomforts of travelling in the open air, Mr. Fogg proposed to leave her with Passepartout at Fort Kearney, the servant taking upon himself to escort her to Europe by a better route and under more favourable conditions. But Aouda refused to separate from Mr. Fogg, and Passepartout was delighted with her decision; for nothing could induce him to leave his master while Fix was with him.",
  "It would be difficult to guess the detective’s thoughts. Was this conviction shaken by Phileas Fogg’s return, or did he still regard him as an exceedingly shrewd rascal, who, his journey round the world completed, would think himself absolutely safe in England? Perhaps Fix’s opinion of Phileas Fogg was somewhat modified; but he was nevertheless resolved to do his duty, and to hasten the return of the whole party to England as much as possible.",
  "At eight o’clock the sledge was ready to start. The passengers took their places on it, and wrapped themselves up closely in their travelling-cloaks. The two great sails were hoisted, and under the pressure of the wind the sledge slid over the hardened snow with a velocity of forty miles an hour.",
  "The distance between Fort Kearney and Omaha, as the birds fly, is at most two hundred miles. If the wind held good, the distance might be traversed in five hours; if no accident happened the sledge might reach Omaha by one o’clock.",
  "What a journey! The travellers, huddled close together, could not speak for the cold, intensified by the rapidity at which they were going. The sledge sped on as lightly as a boat over the waves. When the breeze came skimming the earth the sledge seemed to be lifted off the ground by its sails. Mudge, who was at the rudder, kept in a straight line, and by a turn of his hand checked the lurches which the vehicle had a tendency to make. All the sails were up, and the jib was so arranged as not to screen the brigantine. A topmast was hoisted, and another jib, held out to the wind, added its force to the other sails. Although the speed could not be exactly estimated, the sledge could not be going at less than forty miles an hour.",
  "“If nothing breaks,” said Mudge, “we shall get there!”",
  "Mr. Fogg had made it for Mudge’s interest to reach Omaha within the time agreed on, by the offer of a handsome reward.",
  "The prairie, across which the sledge was moving in a straight line, was as flat as a sea. It seemed like a vast frozen lake. The railroad which ran through this section ascended from the southwest to the northwest by Great Island, Columbus, an important Nebraska town, Schuyler, and Fremont, to Omaha. It followed throughout the right bank of the Platte River. The sledge, shortening this route, took a chord of the arc described by the railway. Mudge was not afraid of being stopped by the Platte River, because it was frozen. The road, then, was quite clear of obstacles, and Phileas Fogg had but two things to fear—an accident to the sledge, and a change or calm in the wind.",
  "But the breeze, far from lessening its force, blew as if to bend the mast, which, however, the metallic lashings held firmly. These lashings, like the chords of a stringed instrument, resounded as if vibrated by a violin bow. The sledge slid along in the midst of a plaintively intense melody.",
  "“Those chords give the fifth and the octave,” said Mr. Fogg.",
  "These were the only words he uttered during the journey. Aouda, cosily packed in furs and cloaks, was sheltered as much as possible from the attacks of the freezing wind. As for Passepartout, his face was as red as the sun’s disc when it sets in the mist, and he laboriously inhaled the biting air. With his natural buoyancy of spirits, he began to hope again. They would reach New York on the evening, if not on the morning, of the 11th, and there was still some chances that it would be before the steamer sailed for Liverpool.",
  "Passepartout even felt a strong desire to grasp his ally, Fix, by the hand. He remembered that it was the detective who procured the sledge, the only means of reaching Omaha in time; but, checked by some presentiment, he kept his usual reserve. One thing, however, Passepartout would never forget, and that was the sacrifice which Mr. Fogg had made, without hesitation, to rescue him from the Sioux. Mr. Fogg had risked his fortune and his life. No! His servant would never forget that!",
  "While each of the party was absorbed in reflections so different, the sledge flew past over the vast carpet of snow. The creeks it passed over were not perceived. Fields and streams disappeared under the uniform whiteness. The plain was absolutely deserted. Between the Union Pacific road and the branch which unites Kearney with Saint Joseph it formed a great uninhabited island. Neither village, station, nor fort appeared. From time to time they sped by some phantom-like tree, whose white skeleton twisted and rattled in the wind. Sometimes flocks of wild birds rose, or bands of gaunt, famished, ferocious prairie-wolves ran howling after the sledge. Passepartout, revolver in hand, held himself ready to fire on those which came too near. Had an accident then happened to the sledge, the travellers, attacked by these beasts, would have been in the most terrible danger; but it held on its even course, soon gained on the wolves, and ere long left the howling band at a safe distance behind.",
  "About noon Mudge perceived by certain landmarks that he was crossing the Platte River. He said nothing, but he felt certain that he was now within twenty miles of Omaha. In less than an hour he left the rudder and furled his sails, whilst the sledge, carried forward by the great impetus the wind had given it, went on half a mile further with its sails unspread.",
  "It stopped at last, and Mudge, pointing to a mass of roofs white with snow, said: “We have got there!”",
  "Arrived! Arrived at the station which is in daily communication, by numerous trains, with the Atlantic seaboard!",
  "Passepartout and Fix jumped off, stretched their stiffened limbs, and aided Mr. Fogg and the young woman to descend from the sledge. Phileas Fogg generously rewarded Mudge, whose hand Passepartout warmly grasped, and the party directed their steps to the Omaha railway station.",
  "The Pacific Railroad proper finds its terminus at this important Nebraska town. Omaha is connected with Chicago by the Chicago and Rock Island Railroad, which runs directly east, and passes fifty stations.",
  "A train was ready to start when Mr. Fogg and his party reached the station, and they only had time to get into the cars. They had seen nothing of Omaha; but Passepartout confessed to himself that this was not to be regretted, as they were not travelling to see the sights.",
  "The train passed rapidly across the State of Iowa, by Council Bluffs, Des Moines, and Iowa City. During the night it crossed the Mississippi at Davenport, and by Rock Island entered Illinois. The next day, which was the 10th, at four o’clock in the evening, it reached Chicago, already risen from its ruins, and more proudly seated than ever on the borders of its beautiful Lake Michigan.",
  "Nine hundred miles separated Chicago from New York; but trains are not wanting at Chicago. Mr. Fogg passed at once from one to the other, and the locomotive of the Pittsburgh, Fort Wayne, and Chicago Railway left at full speed, as if it fully comprehended that that gentleman had no time to lose. It traversed Indiana, Ohio, Pennsylvania, and New Jersey like a flash, rushing through towns with antique names, some of which had streets and car-tracks, but as yet no houses. At last the Hudson came into view; and, at a quarter-past eleven in the evening of the 11th, the train stopped in the station on the right bank of the river, before the very pier of the Cunard line.",
  "The China, for Liverpool, had started three-quarters of an hour before!"
];
const arabic=[
  "وجد فيلياس فوج نفسه متأخرًا عشرين ساعة عن الموعد. وكان باسبارتو، الذي تسبب في هذا التأخير دون قصد، في غاية اليأس؛ فقد ظن أنه أضاع مستقبل سيده!",
  "في تلك اللحظة اقترب المحقق من السيد فوج، وحدّق في وجهه قائلًا:",
  "«أحقًا أنت في عجلة شديدة، يا سيدي؟»",
  "«نعم، وبكل جدية.»",
  "«أسأل لأن لدي غرضًا من ذلك»، تابع فيكس. «هل من الضروري تمامًا أن تكون في نيويورك يوم الحادي عشر، قبل التاسعة مساءً، وهو موعد مغادرة الباخرة إلى ليفربول؟»",
  "«هذا ضروري حتمًا.»",
  "«ولو لم يقطع الهنود رحلتكم، أكنتم ستصلون إلى نيويورك صباح الحادي عشر؟»",
  "«نعم، وكان سيتبقى أمامي أحد عشر ساعة قبل إبحار الباخرة.»",
  "«حسنًا! إذن تأخركم عشرون ساعة. وطرح اثنتي عشرة من عشرين يترك ثماني ساعات. عليك استعادتها. هل ترغب في محاولة ذلك؟»",
  "«سيرًا على الأقدام؟» سأل السيد فوج.",
  "«لا، على زلّاجة»، أجاب فيكس. «زلّاجة مزوّدة بأشرعة. لقد عرض عليّ رجل هذه الوسيلة.»",
  "كان ذلك الرجل نفسه الذي تحدث إلى فيكس ليلًا، فرفض عرضه حينها.",
  "لم يجب فيلياس فوج فورًا. لكن فيكس أشار إلى الرجل الذي كان يذرع المكان أمام المحطة ذهابًا وإيابًا، فمضى إليه السيد فوج. وبعد لحظات دخل فوج والأمريكي، واسمه مادج، كوخًا أسفل الحصن.",
  "هناك فحص السيد فوج مركبة عجيبة، إطارًا يستند إلى عارضتين طويلتين وترتفع مقدمته قليلًا كزلاجات الثلج، وتتسع لخمسة أو ستة أشخاص. ثُبّتت سارية عالية على الإطار وأمسكتها أحزمة معدنية متينة، وحملت شراعًا كبيرًا من طراز بريغنتين. وامتدت من السارية دعامة حديدية لرفع شراع أمامي صغير، بينما استُخدم في الخلف ما يشبه الدفة لتوجيه المركبة. كانت في الحقيقة زلّاجة مجهزة كالسفينة الشراعية. ففي الشتاء، حين تحاصر الثلوج القطارات، تقطع هذه الزلاجات السهول المتجمدة بسرعة فائقة بين المحطات. وبفضل أشرعتها الكثيرة والريح الدافعة من الخلف، تنزلق فوق البراري بسرعة تضاهي القطارات السريعة أو تتجاوزها.",
  "اتفق السيد فوج بسهولة مع مالك هذه المركبة البرية. كانت الريح مواتية، قوية وتهب من الغرب، وقد تصلّب الثلج، وكان مادج واثقًا بأنه يستطيع نقله إلى أوماها خلال ساعات. ومن هناك تنطلق قطارات متكررة شرقًا إلى شيكاغو ونيويورك. لم يكن استرداد الوقت الضائع مستحيلًا، ولم يكن من الحكمة إضاعة هذه الفرصة.",
  "ولأنه لم يشأ تعريض أودا لمشقة السفر في الهواء الطلق، اقترح فوج أن تبقى في حصن كيرني مع باسبارتو، على أن يتولى الخادم مرافقتها إلى أوروبا بطريق أفضل وظروف أريح. لكن أودا رفضت الانفصال عن فوج، وسُرّ باسبارتو بقرارها؛ إذ لم يكن شيء ليجعله يترك سيده ما دام فيكس برفقته.",
  "كان من الصعب تخمين ما يدور في ذهن المحقق. هل اهتز يقينه بعد عودة فيلياس فوج، أم ما زال يراه محتالًا شديد الدهاء سيظن نفسه في مأمن تام في إنجلترا بعد إتمام رحلته حول العالم؟ ربما تبدّل رأي فيكس في فوج بعض الشيء، لكنه ظل مصممًا على أداء واجبه وتعجيل عودة المجموعة كلها إلى إنجلترا قدر الإمكان.",
  "عند الثامنة كانت الزلّاجة جاهزة للانطلاق. جلس المسافرون عليها والتفوا بإحكام في عباءاتهم. رُفع الشراعان الكبيران، وتحت ضغط الريح انزلقت الزلّاجة فوق الثلج المتصلب بسرعة بلغت أربعين ميلًا في الساعة.",
  "لا تزيد المسافة بخط مستقيم بين حصن كيرني وأوماها على مئتي ميل. فإذا استمرت الريح مواتية أمكن قطعها في خمس ساعات، وقد تصل الزلّاجة إلى أوماها عند الواحدة إذا لم يقع حادث.",
  "يا لها من رحلة! التصق المسافرون بعضهم ببعض، ولم يستطيعوا الكلام من شدة البرد الذي ضاعفته سرعة الحركة. اندفعت الزلّاجة بخفة قارب فوق الأمواج. وحين هب النسيم ملاصقًا للأرض بدا كأن الأشرعة ترفعها عن سطحها. حافظ مادج، عند الدفة، على خط مستقيم، وكان يخفف بلفّة من يده تمايل المركبة. رُفعت الأشرعة كلها، وضُبط الشراع الأمامي كيلا يحجب شراع البريغنتين. ثم رُفعت سارية علوية وأضاف شراع أمامي آخر قوة إلى بقية الأشرعة. ومع أن السرعة لم تكن قابلة للقياس الدقيق، فلا بد أنها بلغت أربعين ميلًا في الساعة على الأقل.",
  "قال مادج: «إن لم ينكسر شيء، فسنصل!»",
  "وكان فوج قد حفّز مادج على بلوغ أوماها في الموعد المتفق عليه، إذ وعده بمكافأة سخية.",
  "امتد المرج الذي شقته الزلّاجة في خط مستقيم مستويًا كالبحر، حتى بدا بحيرة متجمدة شاسعة. أما خط السكة الحديدية في تلك المنطقة فكان يتجه من الجنوب الغربي إلى الشمال الغربي مرورًا بجريت آيلاند وكولومبوس، وهي بلدة مهمة في نبراسكا، ثم شيلر وفريمونت وصولًا إلى أوماها، متبعًا الضفة اليمنى لنهر بلات طوال الطريق. اختصرت الزلّاجة المسافة بسلوك وتر القوس الذي رسمته السكة. ولم يخشَ مادج أن يوقفه نهر بلات لأنه كان متجمدًا. وهكذا خلا الطريق من العوائق، ولم يبقَ أمام فوج سوى خطرين: عطل في الزلّاجة أو تغيّر الريح أو سكونها.",
  "لكن النسيم لم يضعف؛ بل اشتد حتى كاد يثني السارية، غير أن الأربطة المعدنية أمسكت بها بإحكام. وأصدرت الأربطة رنينًا كأوتار آلة موسيقية يهتز عليها قوس كمان. وانزلقت الزلّاجة وسط لحن حزين نافذ.",
  "قال السيد فوج: «هذه الأوتار تعطي الخامسة والأوكتاف.»",
  "كانت تلك الكلمات الوحيدة التي نطق بها طوال الرحلة. وكانت أودا ملفوفة بالفراء والعباءات لتحتمي قدر الإمكان من الريح المتجمدة. أما باسبارتو، فاحمر وجهه كقرص الشمس عند الغروب وسط الضباب، وكان يتنفس الهواء اللاسع بصعوبة. وبفضل روحه المتفائلة عاد الأمل إليه؛ فقد يصلون إلى نيويورك مساء الحادي عشر، إن لم يكن صباحه، وربما يلحقون بالباخرة قبل إبحارها إلى ليفربول.",
  "وشعر باسبارتو برغبة قوية في مصافحة حليفه فيكس. فقد تذكر أن المحقق هو من دبر الزلّاجة، وهي الوسيلة الوحيدة للوصول إلى أوماها في الوقت المناسب؛ لكنه كبح اندفاعه بدافع من حدس غامض، ولزم تحفظه المعتاد. ومع ذلك، لن ينسى باسبارتو أبدًا التضحية التي قدمها السيد فوج بلا تردد لإنقاذه من قبيلة السيو. لقد خاطر فوج بثروته وحياته. كلا، لن ينسى خادمه ذلك أبدًا!",
  "وبينما غرق كل فرد في أفكاره المختلفة، كانت الزلّاجة تطير فوق بساط الثلج الشاسع. لم يشعروا بالجداول التي عبروا فوقها؛ فقد اختفت الحقول والمجاري تحت البياض المتجانس، وكانت السهول مهجورة تمامًا. وبين خط الاتحاد الهادئ والفرع الذي يصل كيرني بسانت جوزيف، امتدت مساحة واسعة خالية من السكان؛ فلا قرية ولا محطة ولا حصن يظهر. وكانوا يمرون أحيانًا بشجرة تبدو كالشبح، يلتوي هيكلها الأبيض ويخشخش في الريح. وأحيانًا تنهض أسراب الطيور البرية، أو تطارد الزلّاجة قطعان من ذئاب البراري الهزيلة الجائعة المفترسة وهي تعوي. أمسك باسبارتو بمسدسه استعدادًا لإطلاق النار على ما يقترب منها. ولو تعطلت الزلّاجة آنذاك لوقع المسافرون في خطر بالغ بين أنياب تلك الوحوش؛ لكنها واصلت سيرها المنتظم، وتجاوزت الذئاب، وتركت عواءها بعيدًا خلفها.",
  "نحو الظهر، استدل مادج بعلامات في الطريق على أنه يعبر نهر بلات. لم يقل شيئًا، لكنه تيقن أنه لم يعد يبعد عن أوماها سوى عشرين ميلًا. وبعد أقل من ساعة ترك الدفة ولفّ الأشرعة، بينما واصلت الزلّاجة سيرها نصف ميل آخر بفعل الدفع القوي الذي منحته الريح، حتى وهي بلا أشرعة منشورة.",
  "توقفت أخيرًا، وأشار مادج إلى مجموعة من الأسطح البيضاء بالثلج وقال: «لقد وصلنا!»",
  "وصلوا! وصلوا إلى المحطة التي تربطها كل يوم قطارات عديدة بساحل الأطلسي!",
  "قفز باسبارتو وفيكس من الزلّاجة ومدّا أطرافهما المتصلبة، ثم ساعدا السيد فوج والشابة على النزول. كافأ فيلياس فوج مادج بسخاء، وصافحه باسبارتو بحرارة، ثم توجه الجميع إلى محطة أوماها للسكك الحديدية.",
  "كانت أوماها، وهي بلدة مهمة في نبراسكا، نهاية خط سكة حديد المحيط الهادئ نفسه. وكانت تتصل بشيكاغو عبر خط شيكاغو وروك آيلاند، الذي يتجه مباشرة شرقًا ويمر بخمسين محطة.",
  "كان قطار على وشك الانطلاق حين وصل فوج ورفاقه إلى المحطة، ولم يسعهم إلا الصعود إليه فورًا. لم يروا شيئًا من أوماها، لكن باسبارتو اعترف في نفسه أن ذلك لا يدعو للأسف، فهم لم يسافروا لمشاهدة المعالم.",
  "عبر القطار ولاية آيوا بسرعة، مرورًا بمجلس بلافز ودي موين وآيوا سيتي. وفي الليل اجتاز نهر المسيسيبي عند دافنبورت، ثم دخل إلينوي عبر روك آيلاند. وفي اليوم التالي، العاشر، وصل إلى شيكاغو عند الرابعة عصرًا؛ وكانت المدينة قد نهضت من أنقاضها، وعادت أكثر اعتزازًا بموقعها على ضفاف بحيرة ميشيغان الجميلة.",
  "كانت شيكاغو تبعد تسعمئة ميل عن نيويورك، لكن القطارات لم تكن نادرة فيها. انتقل السيد فوج مباشرة إلى قطار آخر، وانطلقت قاطرة سكة بيتسبرغ وفورت واين وشيكاغو بأقصى سرعتها، كأنها أدركت أنه لا وقت لديه ليضيعه. اجتازت إنديانا وأوهايو وبنسلفانيا ونيوجيرسي كالبرق، واندفعت عبر بلدات ذات أسماء عريقة، لبعضها شوارع ومسارات عربات من دون بيوت بعد. وأخيرًا ظهر نهر هدسون؛ وفي الحادية عشرة والربع من مساء الحادي عشر توقف القطار في المحطة على الضفة اليمنى للنهر، أمام رصيف خط كونارد مباشرة.",
  "لكن باخرة «تشاينا» المتجهة إلى ليفربول كانت قد أبحرت قبل ذلك بثلاثة أرباع الساعة!"
];
const terms=[
  {
    "term": "behind time",
    "literal": "متأخرًا عن الموعد",
    "context": "وصف للتأخر عن الجدول الزمني",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "in great haste",
    "literal": "في عجلة شديدة",
    "context": "تعبير عن الاستعجال",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "to spare",
    "literal": "متبقٍّ",
    "context": "وقت زائد قبل موعد المغادرة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "on a sledge",
    "literal": "على زلّاجة",
    "context": "وسيلة نقل تنزلق فوق الثلج",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "land-craft",
    "literal": "مركبة برية شراعية",
    "context": "مركبة تسير فوق اليابسة بدفع الريح",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "brigantine sail",
    "literal": "شراع بريغنتين",
    "context": "شراع كبير على مركبة ذات سارية",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "jib-sail",
    "literal": "شراع أمامي صغير",
    "context": "شراع أمامي يساعد في دفع المركبة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "rudder",
    "literal": "دَفّة",
    "context": "أداة لتوجيه المركبة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "made a bargain",
    "literal": "أبرم اتفاقًا",
    "context": "توصّل إلى اتفاق مع مالك المركبة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "favourable",
    "literal": "مواتية",
    "context": "ظروف تساعد على تحقيق الهدف",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "hardened snow",
    "literal": "ثلج متصلّب",
    "context": "سطح ثلجي صار صلبًا بفعل البرد",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "open air",
    "literal": "الهواء الطلق",
    "context": "السفر في الخارج دون مأوى",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "presentiment",
    "literal": "حدس مسبق",
    "context": "شعور غامض بما قد يحدث",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "travelling-cloaks",
    "literal": "عباءات السفر",
    "context": "ملابس خارجية للرحلة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "velocity",
    "literal": "سرعة",
    "context": "مقدار سرعة الحركة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "as the birds fly",
    "literal": "بخط مستقيم",
    "context": "قياس المسافة دون اتباع الطريق المتعرج",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "lurches",
    "literal": "تمايلات مفاجئة",
    "context": "حركات جانبية غير مستقرة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "handsome reward",
    "literal": "مكافأة سخية",
    "context": "مبلغ مجزٍ لقاء إنجاز المهمة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "prairie",
    "literal": "مرج واسع",
    "context": "سهل عشبي مفتوح في أمريكا الشمالية",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "chord of the arc",
    "literal": "وتر القوس",
    "context": "خط مستقيم يختصر قوسًا من مسار أطول",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "calm in the wind",
    "literal": "سكون الريح",
    "context": "توقف الريح الذي قد يعطل الأشرعة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "topmast",
    "literal": "سارية علوية",
    "context": "امتداد أعلى السارية الرئيسية",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "furs and cloaks",
    "literal": "الفراء والعباءات",
    "context": "ملابس عازلة للبرد",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "natural buoyancy",
    "literal": "روح التفاؤل",
    "context": "ميله الطبيعي إلى استعادة الأمل",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "uniform whiteness",
    "literal": "بياض متجانس",
    "context": "غطاء الثلج الذي أخفى معالم الأرض",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "phantom-like",
    "literal": "شبيه بالشبح",
    "context": "وصف لشجرة بدت مخيفة وسط الثلج",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "gaunt",
    "literal": "هزيل",
    "context": "نحيل بسبب الجوع أو الإرهاق",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "furled his sails",
    "literal": "لفّ أشرعته",
    "context": "جمع الأشرعة وأوقف تأثير الريح",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "terminus",
    "literal": "نهاية الخط",
    "context": "المحطة النهائية لخط السكك الحديدية",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "seaboard",
    "literal": "الساحل البحري",
    "context": "المنطقة الساحلية المتصلة بالموانئ",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "word"
  },
  {
    "term": "car-tracks",
    "literal": "مسارات عربات",
    "context": "مسارات مخصصة لعربات النقل داخل البلدة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "at full speed",
    "literal": "بأقصى سرعة",
    "context": "الانطلاق دون إبطاء",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "Cunard line",
    "literal": "خط كونارد الملاحي",
    "context": "شركة الخط البحري المتجه إلى ليفربول",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  },
  {
    "term": "three-quarters of an hour",
    "literal": "ثلاثة أرباع الساعة",
    "context": "45 دقيقة",
    "note": "Chapter XXXI: sail-powered sledge to Omaha",
    "type": "phrase"
  }
];
const body=english.join(' ');
if(english.length!==37||arabic.length!==english.length||terms.length!==34)throw Error('Towle XXXI bilingual/glossary alignment mismatch');
if(terms.some(t=>!body.toLowerCase().includes(t.term.toLowerCase())))throw Error('Towle XXXI glossary term absent from source');
if(arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXI Arabic draft missing');
s.chapters.push({title:'In which Fix, the detective, considerably furthers the interests of Phileas Fogg.',titleAr:'الفصل الحادي والثلاثون — حيث يعزز المحقق فيكس مصالح فيلياس فوج',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXI';
s.description='Fogg and his companions race across the frozen prairie on a sail-powered sledge toward Omaha.';
s.editorialStatus='English Chapters I–XXXI source-transcribed; Arabic draft pending independent review; 31 of 37 chapters';
s.provenance+=' Chapter XXXI: Standard Ebooks Towle transcription (source blob 3f96f87cf359251196f1a935314eaedce8d676fd; CC0 editorial edition; territory-specific rights pending review).';

/* Chapter XXXII — pinned Standard Ebooks/Towle source; Arabic companion is an editorial draft. */
const english32=[
  "The China, in leaving, seemed to have carried off Phileas Fogg’s last hope. None of the other steamers were able to serve his projects. The Pereire, of the French Transatlantic Company, whose admirable steamers are equal to any in speed and comfort, did not leave until the 14th; the Hamburg boats did not go directly to Liverpool or London, but to Havre; and the additional trip from Havre to Southampton would render Phileas Fogg’s last efforts of no avail. The Inman steamer did not depart till the next day, and could not cross the Atlantic in time to save the wager.",
  "Mr. Fogg learned all this in consulting his Bradshaw, which gave him the daily movements of the trans-Atlantic steamers.",
  "Passepartout was crushed; it overwhelmed him to lose the boat by three-quarters of an hour. It was his fault, for, instead of helping his master, he had not ceased putting obstacles in his path! And when he recalled all the incidents of the tour, when he counted up the sums expended in pure loss and on his own account, when he thought that the immense stake, added to the heavy charges of this useless journey, would completely ruin Mr. Fogg, he overwhelmed himself with bitter self-accusations. Mr. Fogg, however, did not reproach him; and, on leaving the Cunard pier, only said: “We will consult about what is best tomorrow. Come.”",
  "The party crossed the Hudson in the Jersey City ferryboat, and drove in a carriage to the St. Nicholas Hotel, on Broadway. Rooms were engaged, and the night passed, briefly to Phileas Fogg, who slept profoundly, but very long to Aouda and the others, whose agitation did not permit them to rest.",
  "The next day was the 12th of December. From seven in the morning of the 12th to a quarter before nine in the evening of the 21st there were nine days, thirteen hours, and forty-five minutes. If Phileas Fogg had left in the China, one of the fastest steamers on the Atlantic, he would have reached Liverpool, and then London, within the period agreed upon.",
  "Mr. Fogg left the hotel alone, after giving Passepartout instructions to await his return, and inform Aouda to be ready at an instant’s notice. He proceeded to the banks of the Hudson, and looked about among the vessels moored or anchored in the river, for any that were about to depart. Several had departure signals, and were preparing to put to sea at morning tide; for in this immense and admirable port there is not one day in a hundred that vessels do not set out for every quarter of the globe. But they were mostly sailing vessels, of which, of course, Phileas Fogg could make no use.",
  "He seemed about to give up all hope, when he espied, anchored at the Battery, a cable’s length off at most, a trading vessel, with a screw, well-shaped, whose funnel, puffing a cloud of smoke, indicated that she was getting ready for departure.",
  "Phileas Fogg hailed a boat, got into it, and soon found himself on board the Henrietta, iron-hulled, wood-built above. He ascended to the deck, and asked for the captain, who forthwith presented himself. He was a man of fifty, a sort of sea-wolf, with big eyes, a complexion of oxidised copper, red hair and thick neck, and a growling voice.",
  "“The captain?” asked Mr. Fogg.",
  "“I am the captain.”",
  "“I am Phileas Fogg, of London.”",
  "“And I am Andrew Speedy, of Cardiff.”",
  "“You are going to put to sea?”",
  "“In an hour.”",
  "“You are bound for—”",
  "“Bordeaux.”",
  "“And your cargo?”",
  "“No freight. Going in ballast.”",
  "“Have you any passengers?”",
  "“No passengers. Never have passengers. Too much in the way.”",
  "“Is your vessel a swift one?”",
  "“Between eleven and twelve knots. The Henrietta, well known.”",
  "“Will you carry me and three other persons to Liverpool?”",
  "“To Liverpool? Why not to China?”",
  "“I said Liverpool.”",
  "“No!”",
  "“No?”",
  "“No. I am setting out for Bordeaux, and shall go to Bordeaux.”",
  "“Money is no object?”",
  "“None.”",
  "The captain spoke in a tone which did not admit of a reply.",
  "“But the owners of the Henrietta—” resumed Phileas Fogg.",
  "“The owners are myself,” replied the captain. “The vessel belongs to me.”",
  "“I will freight it for you.”",
  "“No.”",
  "“I will buy it of you.”",
  "“No.”",
  "Phileas Fogg did not betray the least disappointment; but the situation was a grave one. It was not at New York as at Hong Kong, nor with the captain of the Henrietta as with the captain of the Tankadere. Up to this time money had smoothed away every obstacle. Now money failed.",
  "Still, some means must be found to cross the Atlantic on a boat, unless by balloon—which would have been venturesome, besides not being capable of being put in practice. It seemed that Phileas Fogg had an idea, for he said to the captain, “Well, will you carry me to Bordeaux?”",
  "“No, not if you paid me two hundred dollars.”",
  "“I offer you two thousand.”",
  "“Apiece?”",
  "“Apiece.”",
  "“And there are four of you?”",
  "“Four.”",
  "Captain Speedy began to scratch his head. There were eight thousand dollars to gain, without changing his route; for which it was well worth conquering the repugnance he had for all kinds of passengers. Besides, passengers at two thousand dollars are no longer passengers, but valuable merchandise. “I start at nine o’clock,” said Captain Speedy, simply. “Are you and your party ready?”",
  "“We will be on board at nine o’clock,” replied, no less simply, Mr. Fogg.",
  "It was half-past eight. To disembark from the Henrietta, jump into a hack, hurry to the St. Nicholas, and return with Aouda, Passepartout, and even the inseparable Fix was the work of a brief time, and was performed by Mr. Fogg with the coolness which never abandoned him. They were on board when the Henrietta made ready to weigh anchor.",
  "When Passepartout heard what this last voyage was going to cost, he uttered a prolonged “Oh!” which extended throughout his vocal gamut.",
  "As for Fix, he said to himself that the Bank of England would certainly not come out of this affair well indemnified. When they reached England, even if Mr. Fogg did not throw some handfuls of bank-bills into the sea, more than seven thousand pounds would have been spent!"
];
const arabic32=[
  "بدت «تشاينا» وهي تغادر وكأنها حملت معها آخر أمل لفيلياس فوج. ولم تكن أي سفينة أخرى قادرة على خدمة خطته. فسفينة «بيرير» التابعة للشركة الفرنسية العابرة للأطلسي، التي تضاهي سفنها الرائعة غيرها سرعةً وراحةً، لم تكن ستغادر قبل الرابع عشر؛ أما سفن هامبورغ فلم تكن تتجه مباشرة إلى ليفربول أو لندن، بل إلى لوهافر، وكانت الرحلة الإضافية من لوهافر إلى ساوثهامبتون ستجعل آخر محاولات فوج بلا جدوى. ولم تكن سفينة إنمان ستغادر إلا في اليوم التالي، ولن تستطيع عبور الأطلسي في الوقت المناسب لإنقاذ الرهان.",
  "عرف السيد فوج كل ذلك حين راجع دليل برادشو، الذي كان يسرد مواعيد رحلات السفن العابرة للأطلسي يومًا بيوم.",
  "كان باسبارتو محطّمًا؛ فقد سحقه أن السفينة فاتته بثلاثة أرباع الساعة. وكان يحمّل نفسه المسؤولية، لأنه بدلًا من مساعدة سيده لم يكفّ عن وضع العقبات في طريقه! وكلما استعاد أحداث الرحلة، وحسب الأموال التي أُنفقت سدى وبسببه، وتذكّر أن الرهان الضخم، مضافًا إليه نفقات هذه الرحلة التي بدت بلا جدوى، سيُفلس السيد فوج تمامًا، غرق في لوم نفسه بمرارة. لكن السيد فوج لم يوبّخه، وقال فقط عند مغادرته رصيف كونارد: «سنتشاور غدًا بشأن أفضل ما يمكن فعله. هيا.»",
  "عبر أفراد المجموعة نهر هدسون على متن عبّارة جيرسي سيتي، ثم استقلوا عربة إلى فندق سانت نيكولاس في برودواي. حُجزت لهم غرف، ومضت الليلة قصيرةً بالنسبة إلى فيلياس فوج، إذ نام نومًا عميقًا، لكنها بدت طويلة جدًا لأودا والآخرين الذين منعهم القلق من الراحة.",
  "كان اليوم التالي هو الثاني عشر من ديسمبر. ومن السابعة صباحًا في ذلك اليوم إلى الثامنة وخمس وأربعين دقيقة مساءً في الحادي والعشرين، كانت هناك تسعة أيام وثلاث عشرة ساعة وخمس وأربعون دقيقة. ولو غادر السيد فوج على متن «تشاينا»، إحدى أسرع السفن البخارية في الأطلسي، لوصل إلى ليفربول ثم لندن ضمن المهلة المتفق عليها.",
  "غادر السيد فوج الفندق وحده، بعد أن طلب من باسبارتو انتظار عودته وإبلاغ أودا بأن تكون مستعدة في أي لحظة. واتجه إلى ضفاف هدسون، يتفحّص السفن الراسية أو المربوطة في النهر بحثًا عن سفينة تستعد للمغادرة. كانت عدة سفن ترفع إشارات الرحيل وتتهيأ للإبحار مع مدّ الصباح؛ ففي هذا الميناء الهائل الرائع تكاد السفن تنطلق إلى كل أرجاء العالم كل يوم. غير أن معظمها كان شراعيًا، وهو ما لم يكن يفيد فوج بالطبع.",
  "كاد يفقد الأمل تمامًا، إلى أن لمح عند ذا باتري سفينة تجارية راسية لا تبعد أكثر من طول حبل تقريبًا، مزوّدة بمروحة دفع وهيكل أنيق، وكان دخان يتصاعد من مدخنتها يشير إلى استعدادها للمغادرة.",
  "استوقف فيلياس فوج قاربًا وصعد إليه، وسرعان ما وجد نفسه على متن «هنرييتا»، ذات الهيكل الحديدي والسطح العلوي الخشبي. صعد إلى السطح وطلب مقابلة القبطان، الذي حضر فورًا. كان رجلًا في الخمسين، أشبه بذئب بحر، بعينين كبيرتين وبشرة بلون النحاس المؤكسد وشعر أحمر وعنق غليظ وصوت أجش.",
  "«القبطان؟» سأل السيد فوج.",
  "«أنا القبطان.»",
  "«أنا فيلياس فوج من لندن.»",
  "«وأنا أندرو سبيدي من كارديف.»",
  "«هل ستبحرون؟»",
  "«بعد ساعة.»",
  "«إلى أين تتجهون؟»",
  "«بوردو.»",
  "«وما حمولتكم؟»",
  "«لا شحنات. نبحر دون حمولة.»",
  "«هل على متنكم ركاب؟»",
  "«لا ركاب. لا أحمل ركابًا أبدًا. إنهم يعيقون العمل.»",
  "«هل سفينتكم سريعة؟»",
  "«بين إحدى عشرة واثنتي عشرة عقدة. هنرييتا معروفة.»",
  "«هل تنقلني أنا وثلاثة أشخاص آخرين إلى ليفربول؟»",
  "«إلى ليفربول؟ ولمَ لا إلى الصين؟»",
  "«قلت ليفربول.»",
  "«لا!»",
  "«لا؟»",
  "«لا. أنا متجه إلى بوردو وسأذهب إلى بوردو.»",
  "«المال ليس عائقًا؟»",
  "«ليس عائقًا.»",
  "تحدث القبطان بنبرة لا تسمح بالرد.",
  "«لكن مالكي هنرييتا—» استأنف فيلياس فوج.",
  "«أنا مالكها»، أجاب القبطان. «السفينة ملكي.»",
  "«سأستأجرها لك.»",
  "«لا.»",
  "«سأشتريها منك.»",
  "«لا.»",
  "لم يُظهر فيلياس فوج أدنى خيبة، لكن الموقف كان خطيرًا. لم يكن الوضع في نيويورك كما كان في هونغ كونغ، ولم يكن قبطان «هنرييتا» مثل قبطان «تانكادير». حتى ذلك الوقت كان المال يزيل كل عقبة، أما الآن فقد عجز المال عن حل المشكلة.",
  "مع ذلك، كان لا بد من إيجاد وسيلة لعبور الأطلسي بحرًا، لا بمنطاد؛ فذلك سيكون مغامرة محفوفة بالمخاطر، فضلًا عن أنه غير قابل للتنفيذ. وبدا أن فكرة خطرت للسيد فوج، فقال للقبطان: «حسنًا، هل ستنقلني إلى بوردو؟»",
  "«لن أفعل، حتى لو دفعت مئتي دولار.»",
  "«أعرض عليك ألفي دولار.»",
  "«لكل شخص؟»",
  "«لكل شخص.»",
  "«وأنتم أربعة؟»",
  "«أربعة.»",
  "بدأ القبطان سبيدي يحك رأسه. كان بإمكانه كسب ثمانية آلاف دولار دون تغيير مساره، وهو ما يستحق التغلب على نفوره من جميع أنواع الركاب. ثم إن من يدفع ألفي دولار لا يعود راكبًا عاديًا، بل بضاعة ثمينة. قال القبطان ببساطة: «سأغادر الساعة التاسعة. هل ستكون أنت ورفاقك مستعدين؟»",
  "«سنكون على متن السفينة في التاسعة»، أجاب السيد فوج بالبساطة نفسها.",
  "كانت الساعة الثامنة والنصف. كان النزول من «هنرييتا»، والقفز في عربة أجرة، والإسراع إلى سانت نيكولاس، ثم العودة مع أودا وباسبارتو وحتى فيكس الذي لا يفارقهما، مهمةً قصيرة أنجزها السيد فوج بهدوئه المعتاد. وكانوا على متن السفينة حين بدأت «هنرييتا» تستعد لرفع المرساة.",
  "حين سمع باسبارتو كم ستكلف هذه الرحلة الأخيرة، أطلق «آه!» طويلة امتدت عبر طبقات صوته كلها.",
  "أما فيكس، فقال في نفسه إن بنك إنجلترا لن يستعيد أمواله من هذه القضية بسهولة. فعندما يصلون إلى إنجلترا، حتى لو لم يلقِ السيد فوج رزمًا من الأوراق النقدية في البحر، فستكون نفقات الرحلة قد تجاوزت سبعة آلاف جنيه!"
];
const terms32=[
  {
    "term": "transatlantic",
    "literal": "عابر للأطلسي",
    "context": "وصف خطوط الملاحة التي تعبر المحيط الأطلسي",
    "note": "Chapter XXXII: transatlantic timetable",
    "type": "phrase"
  },
  {
    "term": "three-quarters of an hour",
    "literal": "ثلاثة أرباع الساعة",
    "context": "مدة تساوي خمسًا وأربعين دقيقة",
    "note": "Chapter XXXII: missed steamer",
    "type": "phrase"
  },
  {
    "term": "self-accusations",
    "literal": "لوم الذات",
    "context": "تحميل النفس مسؤولية ما حدث",
    "note": "Chapter XXXII: Passepartout's guilt",
    "type": "word"
  },
  {
    "term": "did not reproach him",
    "literal": "لم يوبّخه",
    "context": "امتنع عن لومه رغم تأخر الرحلة",
    "note": "Chapter XXXII: Fogg's response",
    "type": "phrase"
  },
  {
    "term": "at an instant’s notice",
    "literal": "عند أي طلب فوري",
    "context": "أن تكون مستعدة دون مهلة طويلة",
    "note": "Chapter XXXII: Aouda's readiness",
    "type": "phrase"
  },
  {
    "term": "morning tide",
    "literal": "مدّ الصباح",
    "context": "ارتفاع الماء الذي يساعد السفن على الإبحار",
    "note": "Chapter XXXII: harbor departures",
    "type": "phrase"
  },
  {
    "term": "at the Battery",
    "literal": "عند ذا باتري",
    "context": "منطقة ساحلية عند الطرف الجنوبي لمانهاتن",
    "note": "Chapter XXXII: the Henrietta",
    "type": "phrase"
  },
  {
    "term": "a cable’s length",
    "literal": "طول حبل بحري",
    "context": "مسافة قصيرة تُقدّر بطول كابل سفينة",
    "note": "Chapter XXXII: distance from shore",
    "type": "phrase"
  },
  {
    "term": "trading vessel",
    "literal": "سفينة تجارية",
    "context": "سفينة مخصصة لنقل البضائع",
    "note": "Chapter XXXII: Hudson search",
    "type": "phrase"
  },
  {
    "term": "iron-hulled",
    "literal": "ذات هيكل حديدي",
    "context": "وصف لبنية بدن السفينة",
    "note": "Chapter XXXII: the Henrietta",
    "type": "word"
  },
  {
    "term": "sea-wolf",
    "literal": "ذئب بحر",
    "context": "تعبير يصوّر بحّارًا خشنًا خبيرًا",
    "note": "Chapter XXXII: Captain Speedy",
    "type": "phrase"
  },
  {
    "term": "put to sea",
    "literal": "يبحر إلى عرض البحر",
    "context": "مغادرة الميناء وبدء الرحلة",
    "note": "Chapter XXXII: departure",
    "type": "phrase"
  },
  {
    "term": "going in ballast",
    "literal": "يبحر دون حمولة تجارية",
    "context": "السفر دون شحنة مدفوعة",
    "note": "Chapter XXXII: the Henrietta's cargo",
    "type": "phrase"
  },
  {
    "term": "No freight",
    "literal": "لا شحنات",
    "context": "لا توجد بضائع مدفوعة لنقلها",
    "note": "Chapter XXXII: the captain's answer",
    "type": "phrase"
  },
  {
    "term": "Too much in the way",
    "literal": "يعيقون العمل كثيرًا",
    "context": "سبب القبطان لرفض حمل الركاب",
    "note": "Chapter XXXII: passenger policy",
    "type": "phrase"
  },
  {
    "term": "a swift one",
    "literal": "سريعة",
    "context": "سؤال عن سرعة السفينة",
    "note": "Chapter XXXII: vessel speed",
    "type": "phrase"
  },
  {
    "term": "between eleven and twelve knots",
    "literal": "بين إحدى عشرة واثنتي عشرة عقدة",
    "context": "قياس سرعة بحرية بالعقدة",
    "note": "Chapter XXXII: Henrietta speed",
    "type": "phrase"
  },
  {
    "term": "Money is no object",
    "literal": "المال ليس عائقًا",
    "context": "التأكيد أن السعر ليس مانعًا",
    "note": "Chapter XXXII: bargaining",
    "type": "phrase"
  },
  {
    "term": "freight it for you",
    "literal": "أستأجرها لنقلك",
    "context": "استئجار السفينة لنقل الركاب",
    "note": "Chapter XXXII: Fogg's offer",
    "type": "phrase"
  },
  {
    "term": "did not betray the least disappointment",
    "literal": "لم يُظهر أدنى خيبة",
    "context": "حافظ على هدوئه رغم رفض العرض",
    "note": "Chapter XXXII: Fogg's composure",
    "type": "phrase"
  },
  {
    "term": "smoothed away every obstacle",
    "literal": "أزال كل عقبة",
    "context": "صورة مجازية عن المال الذي يحل المشكلات",
    "note": "Chapter XXXII: limits of wealth",
    "type": "phrase"
  },
  {
    "term": "venturesome",
    "literal": "محفوف بالمخاطر",
    "context": "يتطلب جرأة ومجازفة",
    "note": "Chapter XXXII: balloon alternative",
    "type": "word"
  },
  {
    "term": "Apiece",
    "literal": "لكل فرد",
    "context": "المبلغ المعروض لكل شخص",
    "note": "Chapter XXXII: the bargain",
    "type": "word"
  },
  {
    "term": "valuable merchandise",
    "literal": "بضاعة ثمينة",
    "context": "تشبيه الركاب الذين يدفعون مبلغًا كبيرًا",
    "note": "Chapter XXXII: Captain Speedy's calculation",
    "type": "phrase"
  },
  {
    "term": "weigh anchor",
    "literal": "يرفع المرساة",
    "context": "يستعد للمغادرة من الميناء",
    "note": "Chapter XXXII: departure",
    "type": "phrase"
  },
  {
    "term": "profoundly",
    "literal": "بعمق",
    "context": "وصف نوم شديد العمق",
    "note": "Chapter XXXII: the night at the hotel",
    "type": "word"
  },
  {
    "term": "inseparable Fix",
    "literal": "فيكس الذي لا يفارقهما",
    "context": "وصف ملازمتهما في الرحلة",
    "note": "Chapter XXXII: returning to the ship",
    "type": "phrase"
  },
  {
    "term": "not admit of a reply",
    "literal": "لا يسمح بالرد",
    "context": "نبرة حاسمة لا تترك مجالًا للاعتراض",
    "note": "Chapter XXXII: Captain Speedy",
    "type": "phrase"
  },
  {
    "term": "the vessel belongs to me",
    "literal": "السفينة ملكي",
    "context": "تأكيد الملكية الشخصية للسفينة",
    "note": "Chapter XXXII: ownership",
    "type": "phrase"
  },
  {
    "term": "to Bordeaux",
    "literal": "إلى بوردو",
    "context": "وجهة السفينة التي يرفض القبطان تغييرها",
    "note": "Chapter XXXII: route negotiation",
    "type": "phrase"
  },
  {
    "term": "well indemnified",
    "literal": "مُعوَّضًا عنه جيدًا",
    "context": "استرداد المال المفقود أو تعويضه",
    "note": "Chapter XXXII: Bank of England",
    "type": "phrase"
  },
  {
    "term": "vocal gamut",
    "literal": "مدى صوته",
    "context": "امتداد طبقات الصوت من المنخفض إلى المرتفع",
    "note": "Chapter XXXII: Passepartout's exclamation",
    "type": "phrase"
  },
  {
    "term": "daily movements",
    "literal": "المواعيد اليومية",
    "context": "جدول رحلات السفن ومواعيدها",
    "note": "Chapter XXXII: Bradshaw",
    "type": "phrase"
  },
  {
    "term": "within the period agreed upon",
    "literal": "ضمن المهلة المتفق عليها",
    "context": "الوصول قبل انتهاء الموعد المحدد",
    "note": "Chapter XXXII: the wager",
    "type": "phrase"
  }
];
const body32=english32.join(' ');
const words32=(body32.match(/[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*/g)||[]).length;
if(english32.length!==50||arabic32.length!==english32.length||terms32.length!==34||words32!==1051)throw Error('Towle XXXII bilingual/source count mismatch');
if(arabic32.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXII Arabic draft missing');
if(terms32.some(t=>!body32.toLowerCase().includes(t.term.toLowerCase())))throw Error('Towle XXXII glossary term absent from source');
s.chapters.push({title:'In which Phileas Fogg engages in a direct struggle with bad fortune.',titleAr:'الفصل الثاني والثلاثون — حيث يخوض فيلياس فوج صراعًا مباشرًا مع سوء الحظ',paragraphs:english32.map((en,i)=>({en,ar:arabic32[i]}))});
s.terms.push(...terms32);
s.subtitle='The original Towle translation — Chapters I–XXXII';
s.description='After missing the China, Fogg searches New York Harbor for a ship that can still carry his wager across the Atlantic.';
s.editorialStatus='English Chapters I–XXXII source-transcribed; Arabic drafts pending independent review; 32 of 37 chapters';
s.provenance+=' Chapter XXXII: Standard Ebooks Towle transcription (source blob e218533192364ce19436fcc65e9cd2d93842c8d5; src/epub/text/chapter-32.xhtml; CC0 editorial edition; territory-specific rights pending review).';

})(window);
