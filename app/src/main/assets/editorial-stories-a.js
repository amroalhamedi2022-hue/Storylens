/* StoryLens original adult fiction: editorial batch A; bilingual paragraphs.
 * No external copyright material; full two-act short stories with resolved endings.
 */
(function(global){
'use strict';
const lines = rows => rows.map(line => {
 const at=line.indexOf('¦');
 if(at<=0 || at===line.length-1)throw Error('Bilingual passage incomplete');
 return {en:line.slice(0,at).trim(),ar:line.slice(at+1).trim()};
});
const C=(title,titleAr,rows)=>({title,titleAr,paragraphs:lines(rows)});
const T=(term,literal,context,type,note)=>({term,literal,context,type,note});
const stories=[
{id:'eleven-minute-alibi',title:'The Eleven-Minute Alibi',subtitle:'Every clock lies to someone.',genre:'mystery',level:'B2',cover:'clocktower',
description:'An archivist discovers that a murder alibi depends on eleven minutes the cameras never recorded.',
chapters:[
C('The Honest Clock','الساعة الصادقة',[
'The murder investigation began with a clock that appeared to be running perfectly.¦بدأ التحقيق في جريمة القتل بساعة بدت وكأنها تعمل بلا أي خلل.',
'At nine thirteen, the cameras showed Adrian Vale walking into the museum’s east wing, where the curator was later found dead.¦عند التاسعة وثلاث عشرة دقيقة، أظهرت الكاميرات أدريان فايل وهو يدخل الجناح الشرقي للمتحف، حيث عُثر لاحقًا على أمين المتحف مقتولًا.',
'Eleven minutes later, another camera recorded him leaving the building.¦وبعد إحدى عشرة دقيقة، سجّلته كاميرا أخرى وهو يغادر المبنى.',
'The police thought the case was open and shut, but Leila, who restored antique clocks, noticed something they had missed.¦اعتبرت الشرطة القضية محسومة، لكن ليلى، التي كانت تصلح الساعات الأثرية، لاحظت أمرًا غاب عنهم.',
'Every screen displayed exactly the same timestamp, right down to the second.¦كانت جميع الشاشات تعرض الوقت نفسه بدقة تصل إلى الثانية.',
'That was almost too neat: even clocks connected to the same network occasionally drift apart.¦كان الأمر مرتبًا أكثر مما ينبغي؛ فحتى الساعات المتصلة بالشبكة نفسها قد تختلف قليلًا.',
'She asked the guard whether the system had ever lost power. He looked away and said no.¦سألته إن كان النظام قد انقطعت عنه الكهرباء يومًا، فأشاح بنظره وأجاب بالنفي.',
'Leila did not argue. She asked to see the original recording, not the clips prepared for the police.¦لم تجادله ليلى، بل طلبت أن ترى التسجيل الأصلي لا المقاطع التي جُهزت للشرطة.',
'The first thing she saw was a woman crossing the marble floor with a red umbrella.¦كان أول ما رأته امرأة تعبر الأرضية الرخامية بمظلة حمراء.',
'Then the same woman appeared again, eleven minutes later, with the same raindrops on her coat.¦ثم ظهرت المرأة نفسها بعد إحدى عشرة دقيقة، وبقطرات المطر ذاتها على معطفها.'
]),
C('The Second Bell','الجرس الثاني',[
'Someone had replayed a short stretch of footage and changed the timestamps to cover the missing minutes.¦كان أحدهم قد أعاد مقطعًا قصيرًا من التسجيل وعدّل أوقاته لإخفاء الدقائق المفقودة.',
'Leila called Detective Karim and told him the evidence was not a recording of events. It was a performance.¦اتصلت ليلى بالمحقق كريم وأخبرته أن التسجيل لم يكن توثيقًا للأحداث، بل مشهدًا مصنوعًا.',
'Only the museum director and the security chief had access to the server.¦لم يكن يستطيع الدخول إلى الخادم إلا مدير المتحف ورئيس الأمن.',
'The director insisted Adrian was guilty because they had argued that morning.¦أصرّ المدير على أن أدريان مذنب لأنهما تشاجرا في ذلك الصباح.',
'Leila listened and pointed to an antique clock hanging behind his desk.¦استمعت ليلى ثم أشارت إلى ساعة أثرية معلقة خلف مكتبه.',
'The clock rang every quarter hour, and its bell could be heard faintly in the video marked nine thirteen.¦كانت الساعة تدق كل ربع ساعة، ويمكن سماع جرسها بخفوت في الفيديو الموسوم بالتاسعة وثلاث عشرة.',
'Except the bell in that clip was the bell for nine thirty.¦إلا أن الجرس الذي سُمع في المقطع كان دقة التاسعة والنصف.',
'Adrian was already outside the museum when the murder took place; the director’s timeline had accidentally proved his innocence.¦كان أدريان خارج المتحف حين وقعت الجريمة؛ فقد أثبت التسلسل الزمني الذي صنعه المدير براءته دون قصد.',
'The director finally admitted that the curator had discovered a scheme to replace valuable paintings with copies.¦اعترف المدير أخيرًا بأن أمين المتحف اكتشف خطة لاستبدال اللوحات الثمينة بنسخ مزيفة.',
'Leila returned to her workshop, where a hundred old clocks ticked at different speeds. For once, their disagreement felt reassuring.¦عادت ليلى إلى ورشتها حيث تدق مئة ساعة قديمة بسرعات مختلفة، وللمرة الأولى بدا اختلافها مطمئنًا.'
])],
terms:[
T('open and shut','واضح ومحسوم','قضية تبدو أدلتها قاطعة','idiom','تقال عن قضية تبدو سهلة الحسم.'),
T('right down to','حتى أدق التفاصيل','وصولًا إلى الثانية نفسها','phrase','تؤكد شمول التفاصيل الدقيقة.'),
T('too neat','مرتب أكثر من اللازم','ترتيب يثير الشك','collocation','قد تشير في التحقيقات إلى ترتيب مصطنع.'),
T('drift apart','يتباعد تدريجيًا','تختلف قراءات الساعات مع الزمن','phrasal verb','يمكن أن تصف ابتعاد الأشخاص أيضًا.'),
T('cover the missing minutes','يغطي الفجوة','إخفاء الدقائق التي لا يوجد تسجيل لها','phrase','cover up يعني يتستر على شيء.'),
T('took place','حدث / وقع','وقعت الجريمة','phrasal verb','تستخدم للأحداث المنظمة أو المفاجئة.')
]},
{id:'garden-on-europa',title:'The Garden on Europa',subtitle:'Not every discovery belongs to us.',genre:'sci_fi',level:'B2',cover:'ice-moon',
description:'Beneath Jupiter’s frozen moon, a scientist must choose between preserving life and rescuing her crew.',
chapters:[
C('Beneath the Ice','تحت الجليد',[
'The drill stopped three kilometers below Europa’s surface, a thousand meters short of the ocean.¦توقف المثقاب على عمق ثلاثة كيلومترات تحت سطح يوروبا، قبل الوصول إلى المحيط بألف متر.',
'Commander Soren checked the power levels; they had energy for only one more attempt.¦راجع القائد سورِن مستويات الطاقة؛ لم يبقَ لديهم ما يكفي إلا لمحاولة واحدة.',
'Doctor Nadiya Rahman asked him to wait. Something on her monitor was moving against the current.¦طلبت الدكتورة نادية رحمن منه أن يتريث؛ فقد بدأ شيء على شاشتها يتحرك عكس التيار.',
'Under the microscope, pale cells folded and unfolded as though they were breathing.¦تحت المجهر، انطوت خلايا شاحبة وانبسطت كأنها تتنفس.',
'After decades of searching, the answer to humanity’s oldest question was a fragile line of light.¦بعد عقود من البحث، جاء جواب أحد أقدم أسئلة البشرية على هيئة خيط ضوء هش.',
'Then the cells formed a circle around the drill’s shadow and refused to approach the warmer metal.¦ثم اصطفّت الخلايا حول ظل المثقاب وامتنعت عن الاقتراب من معدنه الأدفأ.',
'Nadiya realized at once that the drill was changing their environment faster than they could adapt.¦أدركت نادية فورًا أن المثقاب يغيّر بيئتها بسرعة تفوق قدرتها على التكيف.',
'She told Soren to shut it down, but the rescue beacon still needed electricity.¦طلبت من سورِن أن يوقفه، لكن منارة الإنقاذ كانت هي الأخرى بحاجة إلى الكهرباء.',
'The crew had crossed half the solar system to find life. Now their survival threatened it.¦كان الطاقم قد قطع نصف المجموعة الشمسية بحثًا عن الحياة، فإذا ببقائه حيًا يهددها.',
'Outside, a radiation storm cut off communication with the ship in orbit.¦وفي الخارج، قطعت عاصفة إشعاعية الاتصال بالسفينة التي تدور في المدار.'
]),
C('A Quiet Signal','إشارة هادئة',[
'Soren argued that finishing the drill would warm their batteries enough to keep them alive.¦جادل سورِن بأن إكمال الحفر سيمنح البطاريات حرارة كافية لإبقائهم أحياء.',
'The colony occupied the only passage into the deep ocean; pushing through would contaminate it forever.¦كانت المستعمرة تشغل الممر الوحيد إلى المحيط العميق، وشق الطريق خلالها سيلوّثها إلى الأبد.',
'A young engineer pointed to a small thermal vent on the previous day’s map.¦أشار مهندس شاب إلى فتحة حرارية صغيرة في خريطة اليوم السابق.',
'They could use it, but only by taking apart the engine of their return vehicle. There would be no second chance.¦يمكنهم الاستفادة منها، لكن بعد تفكيك محرك مركبة العودة، ولن تبقى لديهم فرصة ثانية.',
'Soren stared at the plan for a long time, then handed the engineer the tools.¦حدّق سورِن طويلًا في الخطة، ثم ناول المهندس الأدوات.',
'They worked through the night while the temperature in the habitat slowly dropped.¦عملوا طوال الليل بينما أخذت الحرارة في المسكن تنخفض ببطء.',
'At dawn, the vent supplied a weak but steady current, and the rescue beacon began to blink.¦مع الفجر، وفرت الفتحة تيارًا ضعيفًا لكنه ثابت، وبدأت منارة الإنقاذ تومض.',
'A message arrived from orbit: they had been located, and help was on its way.¦وصلتهم رسالة من المدار: عُثر على موقعهم، والمساعدة في الطريق.',
'Nadiya returned to the microscope and found the cells gathering in branching patterns like tiny gardens.¦عادت نادية إلى المجهر فرأت الخلايا تتجمع في أشكال متفرعة كحدائق صغيرة.',
'She wrote one sentence in her report: We found life, and chose not to own it.¦كتبت نادية جملة واحدة في تقريرها: وجدنا الحياة، واخترنا ألّا نتملكها.'
])],
terms:[
T('short of','دون / أقل من','قبل الوصول إلى المحيط بألف متر','phrase','تأتي مع المسافات والمقادير.'),
T('against the current','عكس التيار','تتحرك عكس اتجاه المياه','idiom','مجازيًا قد تعني مخالفة الرأي السائد.'),
T('at once','فورًا','أدركت دون تأخير','phrase','تأتي أيضًا بمعنى في الوقت نفسه.'),
T('cut off','يقطع / يعزل','قطع الاتصال بالسفينة','phrasal verb','قد تعني قطع الطريق أو إيقاف إمداد.'),
T('taking apart','تفكيك','فصل أجزاء المحرك','phrasal verb','العكس put together.'),
T('no second chance','لا فرصة ثانية','خيار لا يمكن التراجع عنه','idiom','تؤكد خطورة قرار حاسم.'),
T('on its way','في الطريق','المساعدة متجهة إليهم','phrase','تعبير محادثة شائع.')
]},
{id:'other-handwriting',title:'In Someone Else’s Handwriting',subtitle:'A diary that remembers tomorrow.',genre:'psychological',level:'C1',cover:'diary',
description:'A therapist discovers predictions in her notebook, written in a handwriting she no longer recognizes.',
chapters:[
C('A Page Out of Place','صفحة في غير مكانها',[
'On Tuesday, Doctor Mira Saeed opened her notebook and found a sentence she did not remember writing.¦صباح الثلاثاء، فتحت الدكتورة ميرا سعيد دفترها ووجدت جملة لا تتذكر أنها كتبتها.',
'Don’t take the bridge home on Thursday, it said, in handwriting strikingly similar to her own.¦كانت تقول: لا تسلكي الجسر في طريق العودة يوم الخميس، بخط يشبه خطها إلى حد يثير القلق.',
'Mira was a therapist. She knew better than to treat an odd coincidence as proof of anything.¦كانت ميرا معالجة نفسية، وتعرف جيدًا ألا تعتبر المصادفة الغريبة دليلًا بحد ذاتها.',
'She photographed the page, locked the notebook in a drawer, and went home by her usual route.¦صوّرت الصفحة وأغلقت الدفتر في درج، ثم عادت إلى بيتها من طريقها المعتاد.',
'The next morning, a second warning appeared: He will ask about the blue door.¦وفي صباح اليوم التالي ظهر تحذير ثانٍ: سيسألك عن الباب الأزرق.',
'That afternoon, a patient described a blue entrance from a recurring dream. He had never mentioned it before.¦وفي العصر وصف مريض مدخلًا أزرق رآه مرارًا في حلم متكرر، رغم أنه لم يذكره من قبل.',
'Mira felt a surge of fear, followed by embarrassment at her own reaction.¦اجتاحها خوف مفاجئ، أعقبه إحراج من رد فعلها نفسه.',
'She stayed after work to review the hallway camera, hoping to prove someone had been playing a trick.¦بقيت بعد العمل لتراجع كاميرا الممر، آملة أن تثبت أن أحدًا يحاول خداعها.',
'The video showed Mira entering her own office at six fifteen in the morning.¦أظهر التسجيل ميرا تدخل مكتبها عند السادسة والربع صباحًا.',
'She had no memory of waking before seven, let alone coming to work.¦لم تتذكر أنها استيقظت قبل السابعة أصلًا، فضلًا عن ذهابها إلى العمل.'
]),
C('A Note to Myself','رسالة إلى نفسي',[
'On the video, Mira opened the drawer, wrote two lines, and sat motionless for nearly a minute.¦في التسجيل فتحت ميرا الدرج وكتبت سطرين، ثم جلست بلا حراك قرابة دقيقة.',
'Her colleague Daniel watched the clip twice before speaking: You told me last month you were losing pieces of the day.¦شاهد زميلها دانيال المقطع مرتين ثم قال: أخبرتِني الشهر الماضي أنك بدأت تفقدين أجزاءً من يومك.',
'She shook her head. She had told him no such thing, or at least she could not remember it.¦هزّت رأسها؛ لم تخبره بذلك، أو على الأقل لم تتذكر أنها أخبرته.',
'Daniel showed her an email in which she had asked for help but begged him not to tell anyone.¦أراها دانيال رسالة بريدية طلبت فيها المساعدة، لكنها ترجته ألّا يخبر أحدًا.',
'On Thursday, an accident closed the bridge at dawn; the warning appeared to have come true.¦يوم الخميس أغلق حادث الجسر مع الفجر، وبدا أن التحذير قد تحقق.',
'But Mira checked her notes and found the bridge repairs had been discussed in a meeting she barely remembered.¦لكن ميرا راجعت ملاحظاتها فوجدت أن إصلاحات الجسر نوقشت في اجتماع لا تكاد تتذكره.',
'The blue door had appeared in a patient file she read during a sleepless night.¦أما الباب الأزرق فكان واردًا في ملف مريض قرأته ذات ليلة بلا نوم.',
'None of the warnings required supernatural knowledge: they were clues an exhausted mind had left for itself.¦لم تكن التحذيرات بحاجة إلى معرفة خارقة؛ كانت إشارات تركها عقل مرهق لنفسه.',
'Mira called a specialist, told Daniel how frightened she was, and asked him to accompany her.¦اتصلت ميرا بطبيب مختص، وأخبرت دانيال بمدى خوفها، وطلبت منه أن يرافقها.',
'Then she opened a blank page and wrote slowly: Ask for help before you disappear from yourself. This time, she recognized every letter.¦ثم فتحت صفحة بيضاء وكتبت ببطء: اطلبي المساعدة قبل أن تغيبي عن نفسك. وهذه المرة عرفت كل حرف كتبته.'
])],
terms:[
T('out of place','في غير مكانه','شيء يبدو غريبًا في موضعه','idiom','يستخدم للأشياء والسلوكيات.'),
T('strikingly similar','مشابه بصورة لافتة','شبه شديد يثير الانتباه','collocation','strikingly تعني بصورة واضحة ومدهشة.'),
T('knew better than to','كان يعرف أن الأفضل ألا','تمنعها خبرتها من الاستنتاج المتسرع','idiom','تعبير ناضج شائع.'),
T('let alone','ناهيك عن','فضلًا عن الذهاب للعمل مبكرًا','phrase','الأمر الثاني أبعد احتمالًا من الأول.'),
T('surge of fear','موجة من الخوف','خوف مفاجئ وقوي','collocation','surge تستخدم للمشاعر والطاقة.'),
T('pieces of the day','أجزاء من اليوم','فترات من الذاكرة المفقودة','metaphor','تعبير مجازي أدبي.'),
T('barely remembered','تكاد لا تتذكر','تملك ذكرى ضعيفة للغاية','collocation','barely تعني بالكاد.')
]}
];
global.StoryLensEditorialStories=(global.StoryLensEditorialStories||[]).concat(stories);
})(window);
