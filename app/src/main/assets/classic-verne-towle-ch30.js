/* Lingua Tales — authentic Towle Chapter XXX; Standard Ebooks CC0 editorial transcription.
 * Upstream repository: standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle
 * Source commit: 56c82e97ff5d4f8950afca05b71af72688a8da34
 * Source blob SHA-1: d26e028ef931fea90caa1a625b91ca8f4310f244; src/epub/text/chapter-30.xhtml.
 * Normalized English SHA-256: cc6571f506f550e03e3627476ae0c534bb9fc7cb8d179ed08809ba3e6c5575ef; 67 complete body paragraphs / 2133 words.
 * Arabic is a companion draft pending independent literary review; historical framing is retained, not endorsed.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==29)throw Error('Towle chapter XXX load order mismatch');
const english=[
  "Three passengers including Passepartout had disappeared. Had they been killed in the struggle? Were they taken prisoners by the Sioux? It was impossible to tell.",
  "There were many wounded, but none mortally. Colonel Proctor was one of the most seriously hurt; he had fought bravely, and a ball had entered his groin. He was carried into the station with the other wounded passengers, to receive such attention as could be of avail.",
  "Aouda was safe; and Phileas Fogg, who had been in the thickest of the fight, had not received a scratch. Fix was slightly wounded in the arm. But Passepartout was not to be found, and tears coursed down Aouda’s cheeks.",
  "All the passengers had got out of the train, the wheels of which were stained with blood. From the tyres and spokes hung ragged pieces of flesh. As far as the eye could reach on the white plain behind, red trails were visible. The last Sioux were disappearing in the south, along the banks of Republican River.",
  "Mr. Fogg, with folded arms, remained motionless. He had a serious decision to make. Aouda, standing near him, looked at him without speaking, and he understood her look. If his servant was a prisoner, ought he not to risk everything to rescue him from the Indians? “I will find him, living or dead,” said he quietly to Aouda.",
  "“Ah, Mr.⁠—Mr. Fogg!” cried she, clasping his hands and covering them with tears.",
  "“Living,” added Mr. Fogg, “if we do not lose a moment.”",
  "Phileas Fogg, by this resolution, inevitably sacrificed himself; he pronounced his own doom. The delay of a single day would make him lose the steamer at New York, and his bet would be certainly lost. But as he thought, “It is my duty,” he did not hesitate.",
  "The commanding officer of Fort Kearney was there. A hundred of his soldiers had placed themselves in a position to defend the station, should the Sioux attack it.",
  "“Sir,” said Mr. Fogg to the captain, “three passengers have disappeared.”",
  "“Dead?” asked the captain.",
  "“Dead or prisoners; that is the uncertainty which must be solved. Do you propose to pursue the Sioux?”",
  "“That’s a serious thing to do, sir,” returned the captain. “These Indians may retreat beyond the Arkansas, and I cannot leave the fort unprotected.”",
  "“The lives of three men are in question, sir,” said Phileas Fogg.",
  "“Doubtless; but can I risk the lives of fifty men to save three?”",
  "“I don’t know whether you can, sir; but you ought to do so.”",
  "“Nobody here,” returned the other, “has a right to teach me my duty.”",
  "“Very well,” said Mr. Fogg, coldly. “I will go alone.”",
  "“You, sir!” cried Fix, coming up; “you go alone in pursuit of the Indians?”",
  "“Would you have me leave this poor fellow to perish⁠—him to whom everyone present owes his life? I shall go.”",
  "“No, sir, you shall not go alone,” cried the captain, touched in spite of himself. “No! you are a brave man. Thirty volunteers!” he added, turning to the soldiers.",
  "The whole company started forward at once. The captain had only to pick his men. Thirty were chosen, and an old sergeant placed at their head.",
  "“Thanks, captain,” said Mr. Fogg.",
  "“Will you let me go with you?” asked Fix.",
  "“Do as you please, sir. But if you wish to do me a favour, you will remain with Aouda. In case anything should happen to me⁠—”",
  "A sudden pallor overspread the detective’s face. Separate himself from the man whom he had so persistently followed step by step! Leave him to wander about in this desert! Fix gazed attentively at Mr. Fogg, and, despite his suspicions and of the struggle which was going on within him, he lowered his eyes before that calm and frank look.",
  "“I will stay,” said he.",
  "A few moments after, Mr. Fogg pressed the young woman’s hand, and, having confided to her his precious carpetbag, went off with the sergeant and his little squad. But, before going, he had said to the soldiers, “My friends, I will divide five thousand dollars among you, if we save the prisoners.”",
  "It was then a little past noon.",
  "Aouda retired to a waiting-room, and there she waited alone, thinking of the simple and noble generosity, the tranquil courage of Phileas Fogg. He had sacrificed his fortune, and was now risking his life, all without hesitation, from duty, in silence.",
  "Fix did not have the same thoughts, and could scarcely conceal his agitation. He walked feverishly up and down the platform, but soon resumed his outward composure. He now saw the folly of which he had been guilty in letting Fogg go alone. What! This man, whom he had just followed around the world, was permitted now to separate himself from him! He began to accuse and abuse himself, and, as if he were director of police, administered to himself a sound lecture for his greenness.",
  "“I have been an idiot!” he thought, “and this man will see it. He has gone, and won’t come back! But how is it that I, Fix, who have in my pocket a warrant for his arrest, have been so fascinated by him? Decidedly, I am nothing but an ass!”",
  "So reasoned the detective, while the hours crept by all too slowly. He did not know what to do. Sometimes he was tempted to tell Aouda all; but he could not doubt how the young woman would receive his confidences. What course should he take? He thought of pursuing Fogg across the vast white plains; it did not seem impossible that he might overtake him. Footsteps were easily printed on the snow! But soon, under a new sheet, every imprint would be effaced.",
  "Fix became discouraged. He felt a sort of insurmountable longing to abandon the game altogether. He could now leave Fort Kearney station, and pursue his journey homeward in peace.",
  "Towards two o’clock in the afternoon, while it was snowing hard, long whistles were heard approaching from the east. A great shadow, preceded by a wild light, slowly advanced, appearing still larger through the mist, which gave it a fantastic aspect. No train was expected from the east, neither had there been time for the succour asked for by telegraph to arrive; the train from Omaha to San Francisco was not due till the next day. The mystery was soon explained.",
  "The locomotive, which was slowly approaching with deafening whistles, was that which, having been detached from the train, had continued its route with such terrific rapidity, carrying off the unconscious engineer and stoker. It had run several miles, when, the fire becoming low for want of fuel, the steam had slackened; and it had finally stopped an hour after, some twenty miles beyond Fort Kearney. Neither the engineer nor the stoker was dead, and, after remaining for some time in their swoon, had come to themselves. The train had then stopped. The engineer, when he found himself in the desert, and the locomotive without cars, understood what had happened. He could not imagine how the locomotive had become separated from the train; but he did not doubt that the train left behind was in distress.",
  "He did not hesitate what to do. It would be prudent to continue on to Omaha, for it would be dangerous to return to the train, which the Indians might still be engaged in pillaging. Nevertheless, he began to rebuild the fire in the furnace; the pressure again mounted, and the locomotive returned, running backwards to Fort Kearney. This it was which was whistling in the mist.",
  "The travellers were glad to see the locomotive resume its place at the head of the train. They could now continue the journey so terribly interrupted.",
  "Aouda, on seeing the locomotive come up, hurried out of the station, and asked the conductor, “Are you going to start?”",
  "“At once, madam.”",
  "“But the prisoners, our unfortunate fellow-travellers⁠—”",
  "“I cannot interrupt the trip,” replied the conductor. “We are already three hours behind time.”",
  "“And when will another train pass here from San Francisco?”",
  "“Tomorrow evening, madam.”",
  "“Tomorrow evening! But then it will be too late! We must wait⁠—”",
  "“It is impossible,” responded the conductor. “If you wish to go, please get in.”",
  "“I will not go,” said Aouda.",
  "Fix had heard this conversation. A little while before, when there was no prospect of proceeding on the journey, he had made up his mind to leave Fort Kearney; but now that the train was there, ready to start, and he had only to take his seat in the car, an irresistible influence held him back. The station platform burned his feet, and he could not stir. The conflict in his mind again began; anger and failure stifled him. He wished to struggle on to the end.",
  "Meanwhile the passengers and some of the wounded, among them Colonel Proctor, whose injuries were serious, had taken their places in the train. The buzzing of the overheated boiler was heard, and the steam was escaping from the valves. The engineer whistled, the train started, and soon disappeared, mingling its white smoke with the eddies of the densely falling snow.",
  "The detective had remained behind.",
  "Several hours passed. The weather was dismal, and it was very cold. Fix sat motionless on a bench in the station; he might have been thought asleep. Aouda, despite the storm, kept coming out of the waiting-room, going to the end of the platform, and peering through the tempest of snow, as if to pierce the mist which narrowed the horizon around her, and to hear, if possible, some welcome sound. She heard and saw nothing. Then she would return, chilled through, to issue out again after the lapse of a few moments, but always in vain.",
  "Evening came, and the little band had not returned. Where could they be? Had they found the Indians, and were they having a conflict with them, or were they still wandering amid the mist? The commander of the fort was anxious, though he tried to conceal his apprehensions. As night approached, the snow fell less plentifully, but it became intensely cold. Absolute silence rested on the plains. Neither flight of bird nor passing of beast troubled the perfect calm.",
  "Throughout the night Aouda, full of sad forebodings, her heart stifled with anguish, wandered about on the verge of the plains. Her imagination carried her far off, and showed her innumerable dangers. What she suffered through the long hours it would be impossible to describe.",
  "Fix remained stationary in the same place, but did not sleep. Once a man approached and spoke to him, and the detective merely replied by shaking his head.",
  "Thus the night passed. At dawn, the half-extinguished disc of the sun rose above a misty horizon; but it was now possible to recognise objects two miles off. Phileas Fogg and the squad had gone southward; in the south all was still vacancy. It was then seven o’clock.",
  "The captain, who was really alarmed, did not know what course to take.",
  "Should he send another detachment to the rescue of the first? Should he sacrifice more men, with so few chances of saving those already sacrificed? His hesitation did not last long, however. Calling one of his lieutenants, he was on the point of ordering a reconnaissance, when gunshots were heard. Was it a signal? The soldiers rushed out of the fort, and half a mile off they perceived a little band returning in good order.",
  "Mr. Fogg was marching at their head, and just behind him were Passepartout and the other two travellers, rescued from the Sioux.",
  "They had met and fought the Indians ten miles south of Fort Kearney. Shortly before the detachment arrived, Passepartout and his companions had begun to struggle with their captors, three of whom the Frenchman had felled with his fists, when his master and the soldiers hastened up to their relief.",
  "All were welcomed with joyful cries. Phileas Fogg distributed the reward he had promised to the soldiers, while Passepartout, not without reason, muttered to himself, “It must certainly be confessed that I cost my master dear!”",
  "Fix, without saying a word, looked at Mr. Fogg, and it would have been difficult to analyse the thoughts which struggled within him. As for Aouda, she took her protector’s hand and pressed it in her own, too much moved to speak.",
  "Meanwhile, Passepartout was looking about for the train; he thought he should find it there, ready to start for Omaha, and he hoped that the time lost might be regained.",
  "“The train! the train!” cried he.",
  "“Gone,” replied Fix.",
  "“And when does the next train pass here?” said Phileas Fogg.",
  "“Not till this evening.”",
  "“Ah!” returned the impassible gentleman quietly."
];
const arabic=[
  "اختفى ثلاثة ركاب، بينهم باسبارتو. هل قُتلوا في الاشتباك؟ أم أخذهم أفراد السيو أسرى؟ تعذّر معرفة ذلك.",
  "كان هناك كثير من الجرحى، لكن لم تكن إصابة أحد منهم قاتلة. وكان العقيد بروكتور من أشدهم إصابة؛ فقد قاتل بشجاعة وأصابته رصاصة في أعلى الفخذ. نُقل إلى المحطة مع بقية الجرحى ليتلقى ما يمكن تقديمه من عناية.",
  "كانت أودا سالمة، ولم يُصب فيلياس فوج، الذي كان في قلب القتال، بخدش. أما فيكس فأصيب إصابة طفيفة في ذراعه. لكنهم لم يعثروا على باسبارتو، وانحدرت الدموع على خدي أودا.",
  "خرج جميع الركاب من القطار، وكانت عجلاته ملطخة بالدماء. وتدلّت من الإطارات والأسلاك قطع ممزقة من اللحم. وعلى السهل الأبيض خلفهم، حتى مدى البصر، ظهرت آثار حمراء. وكان آخر أفراد السيو يبتعدون جنوبًا بمحاذاة نهر ريببليكان.",
  "وقف السيد فوج ساكنًا وذراعاه مطويتان. كان عليه اتخاذ قرار خطير. وقفت أودا بالقرب منه تنظر إليه دون كلام، ففهم ما تعنيه نظرتها. إن كان خادمه أسيرًا، أفلا ينبغي له أن يخاطر بكل شيء لإنقاذه من المهاجمين؟ قال لها بهدوء: «سأعثر عليه، حيًا كان أم ميتًا».",
  "صاحت وهي تقبض على يديه وتغمرهما بدموعها: «آه، سيّد—سيّد فوج!»",
  "وأضاف السيد فوج: «حيًا، إن لم نُضع لحظة واحدة».",
  "كان هذا القرار يعني أن فيلياس فوج يضحّي بنفسه حتمًا، وكأنه حكم على رحلته بالفشل. فتأخر يوم واحد سيجعله يفوّت الباخرة في نيويورك ويخسر رهانه قطعًا. لكنه لم يتردد، إذ قال في نفسه: «هذا واجبي».",
  "كان قائد حصن كيرني حاضرًا، وقد اتخذ مئة من جنوده مواقع للدفاع عن المحطة إذا هاجمها أفراد السيو.",
  "قال السيد فوج للنقيب: «سيدي، لقد اختفى ثلاثة ركاب».",
  "سأل النقيب: «أماتوا؟»",
  "أجاب فوج: «إما أنهم ماتوا أو أُخذوا أسرى؛ وهذا هو الأمر المجهول الذي يجب حسمه. أتنوي مطاردة السيو؟»",
  "رد النقيب: «إنها مهمة خطيرة يا سيدي. فقد ينسحب هؤلاء المهاجمون إلى ما وراء نهر أركنساس، ولا أستطيع ترك الحصن بلا حماية».",
  "قال فيلياس فوج: «حياة ثلاثة رجال على المحك، يا سيدي».",
  "قال النقيب: «لا شك في ذلك؛ لكن هل أعرّض حياة خمسين رجلًا للخطر لإنقاذ ثلاثة؟»",
  "أجاب فوج: «لا أعلم إن كان بوسعك ذلك، يا سيدي، لكن ينبغي لك أن تفعله».",
  "رد الآخر: «لا يحق لأحد هنا أن يعلّمني واجبي».",
  "قال فوج ببرود: «حسنًا، سأذهب وحدي».",
  "اقترب فيكس وصاح: «أنت يا سيدي! أتذهب وحدك لمطاردة السيو؟»",
  "قال فوج: «أتريدني أن أترك هذا المسكين يهلك؟ إنه الرجل الذي يدين له كل من هنا بحياته. سأذهب».",
  "صاح النقيب وقد تأثر رغمًا عنه: «لا، لن تذهب وحدك! أنت رجل شجاع. ثلاثون متطوعًا!» ثم التفت إلى الجنود.",
  "اندفع الجنود جميعًا إلى الأمام، ولم يبق للنقيب إلا أن يختار رجاله. فاختار ثلاثين منهم ووضع على رأسهم رقيبًا مسنًا.",
  "قال فوج: «شكرًا لك أيها النقيب».",
  "سأل فيكس: «هل تسمح لي بمرافقتك؟»",
  "أجابه فوج: «كما تشاء. لكن إن أردت أن تسديني معروفًا، فابقَ مع أودا. وإذا حدث لي مكروه...»",
  "شحب وجه المحقق فجأة. كيف ينفصل عن الرجل الذي ظل يلاحقه خطوة بخطوة؟ وكيف يتركه يتجول في هذه البرية؟ حدّق فيكس في السيد فوج، ثم خفض عينيه أمام نظرته الهادئة الصريحة، على الرغم من شكوكه والصراع الذي كان يعتمل داخله.",
  "قال فيكس: «سأبقى».",
  "بعد لحظات ضغط السيد فوج على يد الشابة، وأودعها حقيبته الثمينة، ثم انطلق مع الرقيب وفرقته الصغيرة. وقبل رحيله قال للجنود: «يا أصدقائي، سأقسم بينكم خمسة آلاف دولار إذا أنقذنا الأسرى».",
  "كانت الساعة قد تجاوزت الظهر بقليل.",
  "انسحبت أودا إلى غرفة الانتظار وجلست وحدها، تفكر في كرم فوج النبيل البسيط وشجاعته الهادئة. لقد ضحّى بثروته، والآن يعرّض حياته للخطر دون تردد، بدافع الواجب وفي صمت.",
  "لم يكن فيكس يفكر مثلها، وكاد يعجز عن إخفاء اضطرابه. راح يذرع الرصيف بعصبية، ثم استعاد مظهره المتماسك. وأدرك الحماقة التي ارتكبها حين سمح لفوج بالذهاب وحده. كيف يترك الرجل الذي تبعه حول العالم يفلت منه الآن؟ أخذ يوبّخ نفسه، وكأنه مدير الشرطة، ويلقي على نفسه محاضرة قاسية عن قلة خبرته.",
  "فكّر فيكس: «لقد كنت أحمق! وسيعرف هذا الرجل ذلك. لقد ذهب ولن يعود! كيف سُحرت به أنا فيكس، ومعي مذكرة توقيفه في جيبي؟ لا شك أنني لست إلا حمارًا!»",
  "هكذا كان المحقق يفكر بينما تمر الساعات ببطء شديد. لم يعرف ما الذي ينبغي فعله. كاد يخبر أودا بكل شيء أحيانًا، لكنه لم يشك في ردّها لو أفصح لها. أي طريق يسلك؟ فكّر في اللحاق بفوج عبر السهول البيضاء الشاسعة؛ ربما أمكنه إدراكه، فالخطوات تترك آثارًا واضحة على الثلج، لكن طبقة جديدة من الثلج ستمحو كل أثر قريبًا.",
  "دبّ اليأس في فيكس. وشعر برغبة لا تقاوم في التخلي عن المطاردة كلها. كان بوسعه مغادرة محطة حصن كيرني والعودة إلى بلاده بسلام.",
  "نحو الثانية بعد الظهر، وبينما الثلج يتساقط بغزارة، سُمعت صفارات طويلة تقترب من الشرق. تقدم ظل هائل تسبقه أضواء غريبة، وبدا أكبر وسط الضباب الذي أضفى عليه مظهرًا خياليًا. لم يكن متوقعًا قطار من الشرق، ولم يكن هناك وقت لوصول النجدة المطلوبة بالبرقية؛ فموعد قطار أوماها إلى سان فرانسيسكو كان في اليوم التالي. وسرعان ما انكشف اللغز.",
  "كانت القاطرة تقترب بصفارات مدوية. إنها القاطرة التي انفصلت عن القطار وواصلت سيرها بسرعة هائلة، حاملة المهندس ومساعده فاقدَي الوعي. قطعت عدة أميال، ثم خمدت النار لنقص الوقود فتراجع ضغط البخار، وتوقفت أخيرًا بعد ساعة، على مسافة نحو عشرين ميلًا وراء حصن كيرني. لم يكن المهندس ولا مساعده قد مات؛ وبعد أن بقيا مغمى عليهما بعض الوقت أفاقا. توقفت القاطرة، وحين وجد المهندس نفسه في البرية والقاطرة بلا عربات، فهم ما حدث. لم يعرف كيف انفصلت عن القطار، لكنه أدرك أن القطار الذي تركه خلفه لا بد أنه في مأزق.",
  "لم يتردد المهندس في ما يجب فعله. كان من الأسلم متابعة الطريق إلى أوماها، فالعودة إلى القطار خطرة إذ ربما ظل أفراد السيو ينهبونه. ومع ذلك أعاد إشعال النار في الفرن، فارتفع الضغط مجددًا، وعادت القاطرة إلى حصن كيرني وهي تسير إلى الخلف. كانت تلك هي القاطرة التي صفّرت وسط الضباب.",
  "سرّ الركاب برؤية القاطرة تعود إلى مقدمة القطار، وأصبح بإمكانهم استئناف الرحلة التي انقطعت على نحو مروّع.",
  "حين رأت أودا القاطرة تصل، أسرعت إلى الرصيف وسألت المحصل: «هل ستنطلقون؟»",
  "«في الحال يا سيدتي».",
  "قالت: «لكن الأسرى، رفاق رحلتنا التعساء...»",
  "أجاب المحصل: «لا أستطيع تعطيل الرحلة. نحن متأخرون ثلاث ساعات أصلًا».",
  "سألت: «ومتى يمر قطار آخر من سان فرانسيسكو؟»",
  "أجاب: «مساء الغد يا سيدتي».",
  "صاحت أودا: «مساء الغد! سيكون الأوان قد فات! علينا أن ننتظر...»",
  "رد المحصل: «هذا مستحيل. إن أردتِ السفر، فتفضلي إلى الداخل».",
  "قالت أودا: «لن أذهب».",
  "كان فيكس قد سمع الحديث. قبل قليل، حين بدا استئناف الرحلة مستحيلًا، قرر مغادرة حصن كيرني؛ لكنه الآن، وقد عاد القطار وكان مقعده في متناوله، شعر بقوة لا تقاوم تشده إلى المكان. كأن رصيف المحطة يحرق قدميه، فلم يستطع التحرك. عاد الصراع في داخله؛ خنقه الغضب والشعور بالفشل، وأراد أن يواصل السعي حتى النهاية.",
  "في تلك الأثناء، صعد الركاب وبعض الجرحى، ومنهم العقيد بروكتور الذي كانت إصابته خطيرة، إلى القطار. سُمع أزيز الغلاية المحمّاة، وانطلق البخار من الصمامات. صفّر المهندس، وتحرك القطار، ثم اختفى سريعًا، ممزوجًا دخانه الأبيض بتموجات الثلج الكثيف.",
  "بقي المحقق خلفهم.",
  "مرّت ساعات عدة. كان الجو كئيبًا والبرد قارسًا. جلس فيكس ساكنًا على مقعد في المحطة، حتى ليُظن أنه نائم. أما أودا فكانت تخرج من غرفة الانتظار رغم العاصفة، وتتجه إلى آخر الرصيف وتحدّق خلال الثلج العاصف، كأنها تريد اختراق الضباب الذي يضيّق الأفق حولها أو التقاط أي صوت يبشر بالخير. لم ترَ ولم تسمع شيئًا، ثم تعود وقد تجمدت من البرد، ولا تلبث أن تخرج ثانية بعد دقائق، عبثًا في كل مرة.",
  "حلّ المساء ولم تعد الفرقة الصغيرة. أين يمكن أن تكون؟ هل عثرت على أفراد السيو واشتبكت معهم، أم ما زالت تائهة في الضباب؟ كان قائد الحصن قلقًا، وإن حاول إخفاء مخاوفه. ومع اقتراب الليل خفّ تساقط الثلج، لكن البرد اشتد كثيرًا. وساد السهول صمت مطبق؛ لم يقطعه طيران طائر ولا مرور حيوان.",
  "طوال الليل ظلت أودا تتجول على أطراف السهول، يملؤها التشاؤم ويخنق قلبها الألم. أخذ خيالها يصوّر لها أخطارًا لا حصر لها. وكان وصف ما عانته في تلك الساعات الطويلة مستحيلًا.",
  "بقي فيكس في مكانه ولم ينم. اقترب منه رجل مرة وتحدث إليه، فلم يرد المحقق إلا بهز رأسه.",
  "هكذا مضت الليلة. وعند الفجر ارتفعت قرص الشمس الباهتة فوق الأفق المغطى بالضباب، لكن صار من الممكن تمييز الأشياء على بعد ميلين. كان فوج ورجاله قد اتجهوا جنوبًا، ولم يظهر شيء في ذلك الاتجاه. كانت الساعة السابعة.",
  "كان النقيب قلقًا حقًا ولم يعرف ماذا يفعل.",
  "هل يرسل فرقة أخرى لإنقاذ الأولى؟ وهل يعرّض مزيدًا من رجاله للخطر مع أن فرصة إنقاذ من خاطروا بالفعل ضئيلة؟ لم يطل تردده. استدعى أحد ملازميه وكان على وشك إصدار أمر باستطلاع المنطقة حين دوّت طلقات نارية. أكانت إشارة؟ اندفع الجنود من الحصن، ورأوا على بعد نصف ميل فرقة صغيرة تعود بانتظام.",
  "كان السيد فوج في مقدمتها، وخلفه مباشرة باسبارتو والراكبان الآخران الذين أنقذهم من أفراد السيو.",
  "التقى فوج ورجاله بالسيو واشتبكوا معهم على بعد عشرة أميال جنوب حصن كيرني. وقبل وصول الفرقة بقليل، كان باسبارتو ورفيقاه قد بدؤوا مقاومة آسريهم؛ وأسقط الفرنسي ثلاثة منهم بقبضتيه، حين أسرع سيده والجنود لنجدتهم.",
  "استقبلهم الجميع بهتافات الفرح. ووزّع فيلياس فوج المكافأة التي وعد بها الجنود، بينما تمتم باسبارتو في نفسه، وله كل الحق: «لا بد أن أعترف بأنني كلّفت سيدي كثيرًا!»",
  "نظر فيكس إلى السيد فوج صامتًا، وكان من الصعب تحليل الأفكار المتصارعة داخله. أما أودا فأخذت يد منقذها وضغطتها بين يديها، وقد غلبها التأثر فلم تستطع الكلام.",
  "كان باسبارتو يبحث بعينيه عن القطار؛ فقد ظن أنه سيجده في المحطة مستعدًا للانطلاق إلى أوماها، وأمل أن يتمكنوا من تعويض الوقت الضائع.",
  "«القطار! القطار!» صاح باسبارتو.",
  "أجاب فيكس: «رحل».",
  "سأل فيلياس فوج: «ومتى يمر القطار التالي من هنا؟»",
  "«ليس قبل هذا المساء».",
  "قال الرجل الذي لا تنفعل ملامحه، بهدوء: «آه!»"
];
const terms=[
  {
    "term": "disappeared",
    "literal": "اختفى",
    "context": "لم يعد الركاب الثلاثة ظاهرين بعد الاشتباك",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "in the thickest of the fight",
    "literal": "في قلب القتال",
    "context": "في أشد مواضع الاشتباك",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "not received a scratch",
    "literal": "لم يُصب بخدش",
    "context": "لم يتعرض لإصابة ظاهرة",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "tears coursed down",
    "literal": "انحدرت الدموع",
    "context": "تدفقت الدموع على الوجه",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "folded arms",
    "literal": "ذراعان مطويتان",
    "context": "وضعية تدل على السكون والتفكير",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "risk everything",
    "literal": "يخاطر بكل شيء",
    "context": "يقبل احتمال خسارة ما يملك من أجل الإنقاذ",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "pronounced his own doom",
    "literal": "حكم على نفسه بالفشل",
    "context": "اتخذ قرارًا يهدد رهانه ورحلته",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "lose the steamer",
    "literal": "يفوّت الباخرة",
    "context": "لا يلحق بموعد السفينة",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "placed themselves in a position",
    "literal": "اتخذوا مواقع",
    "context": "تمركز الجنود للدفاع عن المحطة",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "uncertainty which must be solved",
    "literal": "مسألة يجب حسمها",
    "context": "حالة لا بد من معرفة حقيقتها",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "beyond the Arkansas",
    "literal": "وراء نهر أركنساس",
    "context": "إلى الجهة الأخرى من النهر",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "in question",
    "literal": "على المحك",
    "context": "معرّض للخطر أو موضع قرار",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "ought to do so",
    "literal": "ينبغي أن يفعل ذلك",
    "context": "تعبير عن الواجب لا مجرد الإمكان",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "in spite of himself",
    "literal": "رغمًا عنه",
    "context": "على خلاف ما كان ينوي أو يريد",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "thirty volunteers",
    "literal": "ثلاثون متطوعًا",
    "context": "أشخاص تقدموا للمهمة طوعًا",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "lowered his eyes",
    "literal": "خفض عينيه",
    "context": "أشاح بنظره في لحظة تأثر أو تردد",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "precious carpetbag",
    "literal": "حقيبة ثمينة",
    "context": "حقيبة السفر التي عهد بها فوج إلى أودا",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "divide five thousand dollars",
    "literal": "يقسم خمسة آلاف دولار",
    "context": "يوزع المكافأة على الجنود",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "tranquil courage",
    "literal": "شجاعة هادئة",
    "context": "شجاعة بلا استعراض أو ضجيج",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "outward composure",
    "literal": "مظهر متماسك",
    "context": "هدوء خارجي يخفي الاضطراب",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "sound lecture",
    "literal": "محاضرة قاسية",
    "context": "توبيخ طويل للنفس",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "warrant for his arrest",
    "literal": "مذكرة توقيفه",
    "context": "وثيقة قانونية تأذن بالقبض عليه",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "abandon the game",
    "literal": "يتخلى عن المطاردة",
    "context": "يترك السعي وراء الهدف",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "long whistles",
    "literal": "صفارات طويلة",
    "context": "أصوات ممتدة من القطار",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "wild light",
    "literal": "ضوء غريب",
    "context": "إضاءة غير مألوفة تظهر وسط الضباب",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "for want of fuel",
    "literal": "لنقص الوقود",
    "context": "بسبب عدم توافر ما يغذي النار",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "come to themselves",
    "literal": "استعادوا وعيهم",
    "context": "أفاقوا بعد الإغماء",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "resume its place",
    "literal": "تعود إلى مكانها",
    "context": "ترجع القاطرة إلى مقدمة القطار",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "three hours behind time",
    "literal": "متأخرون ثلاث ساعات",
    "context": "تجاوز الموعد المتوقع بثلاث ساعات",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "irresistible influence",
    "literal": "قوة لا تقاوم",
    "context": "دافع داخلي لم يستطع التغلب عليه",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "overheated boiler",
    "literal": "غلاية شديدة السخونة",
    "context": "غلاية ارتفعت حرارتها وضغطها",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "chilled through",
    "literal": "تجمّد من البرد",
    "context": "شعر بالبرد في كامل جسده",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "sad forebodings",
    "literal": "توقعات قاتمة",
    "context": "مخاوف بشأن ما قد يحدث",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "absolute silence",
    "literal": "صمت مطبق",
    "context": "غياب الأصوات تمامًا تقريبًا",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "ordering a reconnaissance",
    "literal": "إصدار أمر باستطلاع",
    "context": "إرسال قوة لتفقد المنطقة",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "in good order",
    "literal": "بانتظام",
    "context": "في تشكيل منظم دون فوضى",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "felled with his fists",
    "literal": "أسقطهم بقبضتيه",
    "context": "أوقعهم أرضًا بضربات يديه",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "without saying a word",
    "literal": "دون أن ينطق بكلمة",
    "context": "في صمت تام",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "too much moved to speak",
    "literal": "غلبه التأثر فلم يتكلم",
    "context": "كان انفعاله أقوى من قدرته على الحديث",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  },
  {
    "term": "the impassible gentleman",
    "literal": "الرجل الذي لا تنفعل ملامحه",
    "context": "وصف لثبات فوج الظاهر",
    "note": "Chapter XXX: Fort Kearney rescue in the snow",
    "type": "phrase"
  }
];
const body=english.join(' ');
if(english.length!==67||arabic.length!==english.length||terms.length!==40)throw Error('Towle XXX bilingual/glossary alignment mismatch');
if(terms.some(t=>!body.toLowerCase().includes(t.term.toLowerCase())))throw Error('Towle XXX glossary term absent from source');
s.chapters.push({title:'In which Phileas Fogg simply does his duty.',titleAr:'الفصل الثلاثون — حيث يؤدي فيلياس فوج واجبه ببساطة',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXX';
s.description='Fogg risks his schedule to rescue missing passengers while Aouda and Fix wait through the snow.';
s.editorialStatus='English Chapters I–XXX source-transcribed; Arabic draft pending independent review; 30 of 37 chapters';
s.provenance+=' Chapter XXX: Standard Ebooks Towle transcription (source blob d26e028ef931fea90caa1a625b91ca8f4310f244; CC0 editorial edition; territory-specific rights pending review).';
})(window);
