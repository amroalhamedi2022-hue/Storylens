/* StoryLens Editorial Collection B — original adult fiction.
 * Natural meaning-first Arabic translations, complete beginnings and endings.
 */
(function(global){
'use strict';
const P=rows=>rows.map(row=>{
 const split=row.indexOf('¦');
 if(split<1||split===row.length-1)throw Error('Incomplete bilingual editorial line');
 return {en:row.slice(0,split).trim(),ar:row.slice(split+1).trim()};
});
const C=(title,titleAr,rows)=>({title,titleAr,paragraphs:P(rows)});
const T=(term,literal,context,type,note)=>({term,literal,context,type,note});
const stories=[
{id:'mapmakers-silence',title:"The Mapmaker’s Silence",subtitle:'A city erased in ordinary ink.',genre:'historical',level:'B2',cover:'old-map',
description:'In 1898, a young cartographer must decide whether to publish a map that could destroy the family who hired her.',
chapters:[
C('The Blank Quarter','الحيّ الأبيض على الخريطة',[
'In the autumn of 1898, Hana was hired to redraw a city map for a wealthy merchant named Faris.¦في خريف عام 1898، استأجر التاجر الثري فارس هناء لتعيد رسم خريطة المدينة.',
'His instructions were simple: keep the roads, remove the old quarter, and ask no questions.¦كانت تعليماته بسيطة: اتركي الطرق كما هي، واحذفي الحيّ القديم، ولا تسألي عن شيء.',
'Hana had been trained to trust measurements more than promises. An empty space on a map usually concealed a story.¦تعلّمت هناء أن تثق بالقياسات أكثر من الوعود؛ فالمساحة البيضاء على الخريطة تخفي حكاية في الغالب.',
'She walked to the quarter before sunrise and found families living behind a row of boarded shops.¦ذهبت إلى الحي قبل شروق الشمس، فوجدت عائلات تعيش خلف صف من الدكاكين المغلقة بالألواح.',
'A woman filling water jars told her that the district had once belonged to the city’s poorest workers.¦أخبرتها امرأة تملأ جرار الماء أن الحي كان في السابق موطن أفقر عمال المدينة.',
'When the new railway was announced, officials declared those homes abandoned. They were not.¦وحين أُعلن مشروع السكة الحديدية، أعلن المسؤولون أن البيوت مهجورة، لكنها لم تكن كذلك.',
'Faris planned to sell the land as empty property, collecting a fortune from people who had nowhere else to go.¦كان فارس يخطط لبيع الأرض باعتبارها خالية، وجني ثروة على حساب أناس لا يجدون مكانًا آخر.',
'Hana copied every street and doorway into a small private notebook. She knew the official map would be inspected.¦نسخت هناء كل شارع وباب في دفتر صغير خاص؛ فقد كانت تعلم أن الخريطة الرسمية ستخضع للتفتيش.',
'By evening, Faris had sent a carriage to collect the drawing, and his clerk was waiting outside her workshop.¦بحلول المساء، أرسل فارس عربة لتسلّم الرسم، وكان كاتبه ينتظر أمام ورشتها.',
'She had one night to decide which version of the city the world would be allowed to see.¦لم يبقَ أمامها سوى ليلة واحدة لتقرر أي نسخة من المدينة سيسمح للعالم بأن يراها.'
]),
C('Ink That Would Not Fade','حبر لا يبهت',[
'Hana visited the printing house and asked the typesetter how many copies he could make before morning.¦ذهبت هناء إلى المطبعة وسألت منضّد الحروف كم نسخة يستطيع إنتاجها قبل الصباح.',
'He looked at the map, understood what she was asking, and quietly locked the front door.¦نظر إلى الخريطة، وفهم مقصدها، ثم أغلق الباب الأمامي بهدوء.',
'They printed the complete district, with its wells, schools, and homes, on the back of an ordinary market notice.¦طبعا الحي كاملًا، بآباره ومدارسه وبيوته، على ظهر إعلان عادي عن السوق.',
'At dawn, hundreds of the notices appeared on walls throughout the city.¦ومع الفجر، ظهرت مئات الإعلانات على الجدران في أنحاء المدينة.',
'Faris threatened to ruin Hana’s career, but there was no longer a single document for him to confiscate.¦هدد فارس بتدمير مستقبل هناء المهني، لكن لم تعد هناك وثيقة واحدة يستطيع مصادرتها.',
'The families formed a committee and carried their maps to the municipal hearing.¦شكّلت العائلات لجنة وحملت خرائطها إلى جلسة البلدية.',
'The railway was not canceled. Its route was altered so the existing homes would remain standing.¦لم يُلغَ مشروع السكة الحديدية، لكن مسارها عُدّل حتى تبقى البيوت قائمة.',
'Hana lost her wealthy client and gained work surveying neighborhoods the authorities had ignored.¦خسرت هناء زبونها الثري، لكنها حصلت على عمل جديد في مسح الأحياء التي تجاهلتها السلطات.',
'Years later, a child asked why the faded map on her wall was crowded with handwritten names.¦وبعد سنوات، سألها طفل لماذا امتلأت الخريطة الباهتة على جدارها بأسماء مكتوبة بخط اليد.',
'Because a place is not empty, she said, simply because powerful people refuse to see who lives there.¦أجابته: لأن المكان لا يصبح خاليًا لمجرد أن أصحاب النفوذ يرفضون رؤية من يعيش فيه.'
])],
terms:[
T('ask no questions','لا تسأل','طلب الطاعة دون استفسار','phrase','صيغة سلطوية أو حاسمة.'),
T('nowhere else to go','لا مكان آخر يلجؤون إليه','عائلات مهددة بفقدان بيوتها','idiom','تستخدم للمواقف الصعبة.'),
T('typesetter','منضّد الحروف','عامل يرتب أحرف الطباعة القديمة','noun','مهنة تاريخية قبل الطباعة الرقمية.'),
T('no longer','لم يعد','انتفاء الأمر الذي كان ممكنًا','phrase','تعبير زمني.'),
T('remain standing','يبقى قائمًا','تبقى البيوت دون هدم','collocation','يمكن أن تُستخدم مجازيًا للصمود.'),
T('powerful people','أصحاب النفوذ','من يتحكمون بالقرارات العامة','phrase','لا يعني القوة الجسدية.'),
T('simply because','لمجرد أن','رفض اعتبار حجة ما كافية','phrase','تؤكد ضعف السبب.')
]},
{id:'last-table',title:'The Last Table',subtitle:'Not every silence is an ending.',genre:'contemporary',level:'B1',cover:'cafe',
description:'A closing neighborhood café becomes the unlikely meeting place of two people who stopped speaking seven years ago.',
chapters:[
C('The Closing Notice','إشعار الإغلاق',[
'The café on Willow Street had been open for forty years, but on Friday it would close for good.¦ظل المقهى في شارع ويلو مفتوحًا أربعين عامًا، لكنه سيغلق نهائيًا يوم الجمعة.',
'Jude, a journalist, came to write a short article about the owner’s retirement.¦جاء جود، وهو صحفي، ليكتب مقالًا قصيرًا عن تقاعد صاحب المقهى.',
'He expected old photographs and a few memories. He did not expect to see his father behind the counter.¦توقع صورًا قديمة وبعض الذكريات، ولم يتوقع أن يرى والده خلف المنضدة.',
'They had not spoken in seven years, ever since a bitter argument after his mother’s funeral.¦لم يتحدثا منذ سبع سنوات، منذ مشاجرة قاسية عقب جنازة والدته.',
'His father placed two cups of tea on the table without asking what Jude wanted.¦وضع والده كوبَي شاي على الطاولة دون أن يسأل جود عما يريد.',
'You still take it without sugar, he said. Jude nodded, surprised that the smallest things had survived.¦قال والده: ما زلت تشربه بلا سكر. أومأ جود، متفاجئًا بأن أصغر التفاصيل ما زالت حاضرة.',
'They spoke about the broken refrigerator and the rising rent, carefully avoiding the past.¦تحدثا عن الثلاجة المعطلة والإيجار المرتفع، متجنبَين الحديث عن الماضي.',
'Then Jude noticed a box of letters beside the till, each marked with a date in his mother’s handwriting.¦ثم لمح جود صندوق رسائل قرب صندوق النقود، على كل منها تاريخ بخط والدته.',
'His father said she had written them during her final winter, one for every year she hoped they would still be together.¦قال والده إنها كتبتها في شتائها الأخير، رسالة لكل سنة كانت تأمل أن يبقوا خلالها معًا.',
'Jude reached for the oldest envelope but stopped. Some truths were easier to discover than to face.¦مدّ جود يده نحو أقدم ظرف، ثم تراجع؛ فبعض الحقائق يسهل اكتشافها أكثر من مواجهتها.'
]),
C('What We Leave Behind','ما نتركه وراءنا',[
'On the final evening, customers came to say goodbye and carried away the familiar smell of coffee on their clothes.¦في الأمسية الأخيرة جاء الزبائن للوداع، وحملوا معهم على ثيابهم رائحة القهوة المألوفة.',
'Jude returned after everyone had gone. His father was wiping the same clean table for the third time.¦عاد جود بعدما غادر الجميع؛ كان والده يمسح الطاولة النظيفة نفسها للمرة الثالثة.',
'I thought you blamed me for her death, his father said quietly.¦قال والده بصوت منخفض: كنت أظن أنك تلومني على موتها.',
'I blamed you for never talking about her, Jude answered. I needed to know you missed her too.¦أجاب جود: لُمتك لأنك لم تتحدث عنها قط. كنت بحاجة أن أعرف أنك تفتقدها مثلي.',
'His father sat down. For a long moment, neither man tried to make the conversation easier.¦جلس والده، وللحظات طويلة لم يحاول أي منهما تبسيط هذا الحديث الصعب.',
'Then he admitted he had been afraid that speaking her name would make the loss real all over again.¦ثم اعترف بأنه كان يخشى أن يجعل ذكر اسمها الفقدَ حقيقيًا من جديد.',
'They opened the first letter together. It described an ordinary rainy afternoon when the three of them had laughed over burnt toast.¦فتحا الرسالة الأولى معًا؛ كانت تصف عصرًا ممطرًا عاديًا ضحكوا فيه ثلاثتهم على خبز محمص احترق.',
'There was nothing grand in it, and that was what finally made Jude cry.¦لم تكن فيها حادثة عظيمة، وهذا تحديدًا ما جعل جود يبكي أخيرًا.',
'The next morning, Jude did not publish his article about a closing café. Instead, he wrote about the people who had found a second home there.¦في الصباح التالي لم ينشر جود مقالًا عن مقهى يغلق أبوابه، بل كتب عن أناس وجدوا فيه بيتًا ثانيًا.',
'At the bottom he added a sentence that his father helped him choose: A place can close without every conversation ending.¦وفي النهاية أضاف جملة اختارها بمساعدة والده: قد يُغلق المكان، دون أن تنتهي كل الأحاديث.'
])],
terms:[
T('for good','إلى الأبد','إغلاق نهائي لا مؤقت','idiom','معنى for good ليس من أجل الخير في هذا السياق.'),
T('behind the counter','خلف المنضدة','كان والده يعمل داخل المقهى','phrase','counter ليست عدادًا هنا.'),
T('carefully avoiding','يتجنبان بحذر','يتهربان من ذكر الماضي','collocation','تحمل تجنبًا مقصودًا للموضوع.'),
T('reach for','يمد يده نحو','محاولة الإمساك بالرسالة','phrasal verb','تستخدم للمد الحسي أو السعي وراء هدف.'),
T('face the truth','يواجه الحقيقة','تقبّل حقيقة مؤلمة','idiom','face هنا بمعنى يواجه.'),
T('all over again','من جديد تمامًا','عودة شعور الفقد كما حدث أول مرة','idiom','شائع في المحادثات.'),
T('second home','بيت ثانٍ','مكان يمنح شعور الانتماء','metaphor','لا يقصد غالبًا امتلاك منزل ثانٍ.')
]},
{id:'rain-room',title:'The Room That Kept the Rain',subtitle:'Some houses remember too much.',genre:'horror',level:'C1',cover:'rain-room',
description:'A surveyor enters an abandoned coastal house where one room remains wet even on the driest days.',
chapters:[
C('A Dry Day','يوم جاف',[
'The village had not seen rain for seventy-two days, yet the upstairs room smelled of wet stone.¦لم تشهد القرية مطرًا منذ اثنين وسبعين يومًا، ومع ذلك كانت الغرفة العلوية تفوح برائحة الحجر المبتل.',
'Amal, a property surveyor, was sent to inspect the empty house before its demolition.¦أُرسلت أمل، وهي خبيرة في معاينة العقارات، لتفحص المنزل الخالي قبل هدمه.',
'The owner warned her not to open the blue door, though he could give no convincing reason.¦حذّرها المالك من فتح الباب الأزرق، من دون أن يقدم سببًا مقنعًا.',
'Inside, a puddle reflected a gray sky that was not visible through any window.¦في الداخل عكست بركة ماء سماء رمادية لا تظهر من أي نافذة.',
'When Amal stepped closer, she heard distant footsteps above her, as if another floor existed beyond the ceiling.¦حين اقتربت سمعت خطوات بعيدة فوقها، كأن طابقًا آخر يوجد وراء السقف.',
'She recorded the sound on her phone, but the playback contained nothing except the soft hiss of water.¦سجلت الصوت بهاتفها، لكن التسجيل لم يحتوِ إلا حفيفًا خافتًا للماء.',
'On the wall, under layers of peeling paint, she found the height marks of a child named Lina.¦وعلى الجدار، تحت طبقات الطلاء المتقشر، وجدت علامات طول لطفلة اسمها لينا.',
'The last mark was dated the year a flood had swept through the village.¦حملت آخر علامة تاريخ السنة التي اجتاح فيها فيضان القرية.',
'Someone had crossed it out so violently that the plaster underneath had cracked.¦كان أحدهم قد شطب العلامة بعنف حتى تشقق الجص تحتها.',
'Amal left the room, but the damp smell followed her down the stairs.¦خرجت أمل من الغرفة، لكن رائحة الرطوبة تبعتها إلى أسفل الدرج.'
]),
C('A Name in the Water','اسم في الماء',[
'At the municipal archive, Amal found records of the flood and a list of families who had lost their homes.¦في الأرشيف البلدي، عثرت أمل على سجلات الفيضان وقائمة بالعائلات التي فقدت بيوتها.',
'The house had belonged to a teacher whose daughter, Lina, disappeared during the evacuation.¦كان المنزل لمعلم اختفت ابنته لينا أثناء الإجلاء.',
'Witnesses claimed he had refused to leave, searching the rooms until the floodwaters reached the second floor.¦قال شهود إنه رفض المغادرة، وظل يبحث في الغرف حتى بلغ الماء الطابق الثاني.',
'Amal returned after sunset with the teacher’s old photograph, which she had copied from the archive.¦عادت أمل بعد الغروب بصورة قديمة للمعلم نسختها من الأرشيف.',
'She opened the blue door and placed the photograph beside the final mark on the wall.¦فتحت الباب الأزرق ووضعت الصورة بجوار آخر علامة على الجدار.',
'The puddle trembled. For a moment, two reflections appeared: a man by the window and a small figure at his side.¦ارتجفت البركة، ولحظةً ظهرت فيها صورتان منعكستان: رجل قرب النافذة وطفلة بجانبه.',
'Amal did not know whether she had witnessed a memory, a trick of the light, or something that had no proper name.¦لم تعرف أمل إن كانت رأت ذكرى، أو خدعة ضوئية، أو أمرًا لا اسم له.',
'She did know what the demolition report needed to say: Preserve the room until the family records are examined.¦لكنها عرفت ما ينبغي أن يرد في تقرير الهدم: يجب حفظ الغرفة حتى تُراجع سجلات العائلة.',
'When she returned the following week, the floor was dry for the first time.¦وعندما عادت في الأسبوع التالي، كانت الأرضية جافة للمرة الأولى.',
'The height marks remained; someone had gently erased the violent line through Lina’s name.¦بقيت علامات الطول، لكن أحدهم محا برفق الخط العنيف الذي كان يشطب اسم لينا.'
])],
terms:[
T('not seen rain','لم تشهد مطرًا','لم تمطر منذ مدة طويلة','expression','صياغة مجازية شائعة عن الأماكن.'),
T('peeling paint','طلاء متقشر','طبقة دهان تتساقط من الجدار','collocation','وصف بصري للمكان القديم.'),
T('crossed it out','شطبها','رسم خطًا لإلغاء العلامة','phrasal verb','cross out تستخدم للمكتوب عادةً.'),
T('followed her','تبعتها','ظلت الرائحة ترافقها','personification','شخصنة أدبية للرائحة.'),
T('swept through','اجتاح','مرّ الفيضان بقوة عبر القرية','phrasal verb','تستخدم للكوارث والأخبار والأفكار.'),
T('proper name','اسم دقيق','تسمية تشرح حقيقة الشيء','phrase','proper هنا بمعنى مناسب لا لائق فقط.'),
T('for the first time','لأول مرة','حدث شيء لم يسبق أن حدث','phrase','زمنية شائعة.')
]}
];
global.StoryLensEditorialStories=(global.StoryLensEditorialStories||[]).concat(stories);
})(window);
