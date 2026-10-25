/* Lingua Tales — The Salt Meridian: original bilingual five-chapter novella.
 * Original fiction composed for this project, NOT a public-domain classic or
 * an abridgement of a published book. Arabic is an original companion draft;
 * independent literary/editorial review remains required before final release.
 * No external art, remote requests, or third-party text.
 */
(function(global){
'use strict';
function passages(lines){
 return lines.trim().split('\n').map((line,i)=>{
  const divider=line.indexOf('¦');
  if(divider<20||divider===line.length-1||line.indexOf('¦',divider+1)!==-1)
   throw Error('Incomplete bilingual passage '+i);
  return {en:line.slice(0,divider).trim(),ar:line.slice(divider+1).trim()};
 });
}
const chapters=[
 {title:'The Line That Moved',titleAr:'الخط الذي تحرّك',paragraphs:passages(`
On the morning the harbor authority declared the old lighthouse unnecessary, Lina Darwish discovered that the coastline on her father's final chart had moved nearly half a mile inland.¦في الصباح الذي أعلنت فيه سلطة الميناء أن المنارة القديمة لم تعد ضرورية، اكتشفت لينا درويش أن خط الساحل في آخر خريطة رسمها والدها قد انتقل نحو نصف ميل إلى الداخل.
It was not the sort of error a trained surveyor would make, and her father had been the most careful man she knew, measuring twice even when the tide was already turning.¦لم يكن ذلك خطأ يقع فيه مسّاح متمرّس، وكان والدها أدق رجل عرفته؛ يقيس مرتين حتى حين يبدأ المدّ بالتحول.
The revised chart placed a harmless stretch of shallow water where fishermen still spoke of a submerged ridge that had broken three ships in a single winter.¦أظهرت الخريطة المعدّلة مياهًا ضحلة آمنة في موضع ما زال الصيادون يتحدثون فيه عن حيد مغمور حطّم ثلاث سفن في شتاء واحد.
Lina carried the paper to the map room, where a young clerk told her the new survey was official and that old family drawings were no longer admissible evidence.¦حملت لينا الورقة إلى غرفة الخرائط، فأخبرها موظف شاب أن المسح الجديد هو المعتمد، وأن رسومات العائلات القديمة لم تعد دليلًا مقبولًا.
She might have accepted his answer if the ink had not been scraped away at one precise point, leaving a pale scar beneath the carefully drawn replacement line.¦ربما قبلت جوابه لولا أن الحبر كان قد كُشط عند نقطة محددة، تاركًا أثرًا شاحبًا تحت الخط البديل المرسوم بعناية.
In plain sight, above the official seal, someone had written a tide reading in her father's cramped handwriting and then tried to erase the number without damaging the paper.¦وعلى مرأى الجميع، فوق الختم الرسمي، كتب أحدهم قراءة للمدّ بخط والدها الضيق، ثم حاول محو الرقم من غير أن يمزق الورقة.
The clerk lowered his voice and warned her that the harbor director had ordered the lighthouse records destroyed before the new shipping contract was signed.¦خفض الموظف صوته وحذّرها من أن مدير الميناء أمر بإتلاف سجلات المنارة قبل توقيع عقد الشحن الجديد.
Her father had died believing his measurements would protect people he would never meet; Lina could not bear the thought that his life's work might now help someone cut corners.¦مات والدها وهو يؤمن بأن قياساته ستحمي أناسًا لن يلتقيهم قط؛ ولم تحتمل لينا فكرة أن يصبح عمل عمره وسيلة ليتجاوز أحدهم قواعد السلامة.
She folded the chart into her coat, walked through the market, and found Captain Idris repairing a net beside a boat he could no longer afford to sail.¦طوت الخريطة داخل معطفها، وعبرت السوق، ووجدت القبطان إدريس يصلح شبكة قرب قارب لم يعد قادرًا على تحمّل كلفة إبحاره.
When she showed him the altered line, he did not look surprised; he pointed toward the dark lighthouse and said the truth had been kept there, against the tide, for twenty years.¦حين أطلعته على الخط المعدّل، لم يبدُ متفاجئًا؛ أشار إلى المنارة المعتمة وقال إن الحقيقة بقيت محفوظة هناك، رغم كل ما جرى، عشرين عامًا.`)},
 {title:'The Ledger of Soundings',titleAr:'دفتر قياسات الأعماق',paragraphs:passages(`
The lighthouse stairs smelled of salt, lamp oil, and wet stone, and every step seemed to remember the weight of the men who had carried fuel upward during winter storms.¦فاحت من درج المنارة رائحة الملح وزيت المصابيح والحجر الرطب، وبدا أن كل درجة تحفظ ثقل الرجال الذين حملوا الوقود إلى الأعلى في عواصف الشتاء.
Idris brought a brass key he had kept since his last voyage, though he admitted he had never known which lock it opened until Lina noticed a narrow cupboard behind the lantern room.¦أحضر إدريس مفتاحًا نحاسيًا احتفظ به منذ رحلته الأخيرة، معترفًا بأنه لم يعرف يومًا أي قفل يفتحه، حتى لاحظت لينا خزانة ضيقة خلف غرفة المصباح.
Inside lay a ledger of soundings, its pages ruled into columns for depth, wind, position, and the name of the observer who had taken each measurement.¦في الداخل وجدا دفترًا لقياسات الأعماق، قُسمت صفحاته إلى أعمدة للعمق والرياح والموقع واسم الراصد الذي سجّل كل قراءة.
For seventeen years the numbers had formed a reliable pattern, but in the final winter the entries changed in the same week a private shipping company began paying for the harbor survey.¦على مدى سبعة عشر عامًا شكّلت الأرقام نمطًا ثابتًا، لكنها تغيّرت في الشتاء الأخير خلال الأسبوع نفسه الذي بدأت فيه شركة شحن خاصة تموّل مسح الميناء.
Lina traced one column with her finger and realized that the supposed change in seabed depth was exactly equal to the correction needed to make the dangerous ridge disappear from the chart.¦تتبعت لينا عمودًا بإصبعها، وأدركت أن التغيير المزعوم في عمق القاع يساوي تمامًا التصحيح المطلوب لإخفاء الحيد الخطر من الخريطة.
The final page contained a statement in her father's hand: he had refused to sign the revised figures, and he wanted that refusal placed on the record.¦احتوت الصفحة الأخيرة على إفادة بخط والدها: رفض التوقيع على الأرقام المعدّلة، وأراد تثبيت هذا الرفض في السجل الرسمي.
Below it was a second signature, belonging to the man who had become harbor director and who now claimed that no objection had ever been raised.¦وتحت الإفادة توقيع ثانٍ للرجل الذي أصبح مديرًا للميناء، والذي يزعم الآن أن أحدًا لم يعترض يومًا.
Idris confessed that he had once carried the ledger out of the office after being told it would be burned, then hidden it here because he feared losing his captain's license.¦اعترف إدريس بأنه أخرج الدفتر من المكتب بعد أن قيل له إنه سيُحرق، ثم أخفاه هنا خوفًا من خسارة رخصته البحرية.
Lina was angry that he had remained silent, yet she understood that courage was rarely as simple as the speeches delivered by people whose livelihoods were not at stake.¦غضبت لينا لصمته الطويل، لكنها أدركت أن الشجاعة نادرًا ما تكون ببساطة الخطب التي يلقيها من لا تكون أرزاقهم على المحك.
They copied every page by daylight, sealed the original in a waterproof tin, and agreed that the next decision had to be made in public rather than in another locked room.¦نسخا كل صفحة في ضوء النهار، ووضعا الأصل في علبة محكمة لا ينفذ إليها الماء، واتفقا على أن القرار التالي يجب أن يُتخذ علنًا لا في غرفة مغلقة أخرى.`)},
 {title:'The Night of Low Water',titleAr:'ليلة الجَزْر',paragraphs:passages(`
Two evenings later, the first cargo vessel entered the harbor under the new contract, carrying machinery too valuable for its owners to delay while anyone argued about an old chart.¦بعد ليلتين، دخلت أول سفينة شحن إلى الميناء بموجب العقد الجديد، محمّلة بآلات ثمينة لم يشأ أصحابها تأخيرها بينما يتجادل الناس بشأن خريطة قديمة.
The captain had been told the channel was safe at every tide, but Lina knew the ridge would be exposed when the water fell, turning a routine arrival into a narrow gamble.¦قيل للقبطان إن الممر آمن في جميع حالات المدّ، لكن لينا عرفت أن الحيد سيظهر عند انحسار الماء، فيتحول وصول عادي إلى مقامرة خطرة.
She asked the harbor office to stop the ship, and an official answered that she had no authority, no current license, and no evidence that would hold water in court.¦طلبت من مكتب الميناء إيقاف السفينة، فأجابها مسؤول بأنها لا تملك صلاحية ولا رخصة سارية ولا دليلًا يمكن أن يصمد أمام المحكمة.
Idris took her to the quay, where the fishermen had gathered with their lamps and could see the vessel's navigation lights moving steadily toward the wrong side of the buoy.¦اصطحبها إدريس إلى الرصيف، حيث تجمع الصيادون بمصابيحهم، ورأوا أضواء الملاحة في السفينة تتقدم بثبات نحو الجانب الخاطئ من العوامة.
Lina did not invent a dramatic signal; she used the old harbor code, three white flashes followed by a red one, the warning every local captain had learned as an apprentice.¦لم تخترع لينا إشارة درامية؛ استخدمت رمز الميناء القديم: ثلاث ومضات بيضاء تليها حمراء، وهو التحذير الذي تعلمه كل قبطان محلي في بداياته.
The new vessel slowed, uncertain, while the harbor director ordered the lighthouse power cut and demanded that the fishermen leave the restricted quay.¦أبطأت السفينة الجديدة حركتها مترددة، فيما أمر مدير الميناء بقطع الكهرباء عن المنارة وطالب الصيادين بمغادرة الرصيف المحظور.
Without waiting for permission, Idris carried an old oil lantern to the end of the breakwater, and the fishermen answered his signal from boat to boat until the warning reached the bridge.¦من دون انتظار إذن، حمل إدريس فانوس زيت قديمًا إلى نهاية كاسر الأمواج، وردّ الصيادون على إشارته من قارب إلى آخر حتى وصل التحذير إلى جسر القيادة.
The captain changed course with barely enough room to spare, and the vessel passed the hidden ridge so closely that its wake washed over the stones where Lina stood.¦غيّر القبطان مساره ولم يبقَ أمامه إلا هامش ضئيل، ومرّت السفينة بمحاذاة الحيد المخفي حتى غسلت موجتها الحجارة التي وقفت عليها لينا.
When the water withdrew, the ridge emerged like a dark spine, and every witness could see that the new official chart had placed open water where rock now stood.¦حين انحسر الماء، ظهر الحيد كعمود فقري داكن، واستطاع كل شاهد أن يرى أن الخريطة الرسمية الجديدة وضعت مياهًا مفتوحة في موضع صخرة قائمة.
The director called it an unfortunate misunderstanding, but the captain had recorded the warning and the depth on his instruments, and the truth was no longer hers alone to defend.¦وصف المدير ما حدث بأنه سوء فهم مؤسف، لكن القبطان سجّل التحذير والعمق بأجهزته، ولم تعد الحقيقة عبئًا تدافع عنه لينا وحدها.`)},
 {title:'A Matter of Record',titleAr:'مسألة موثّقة',paragraphs:passages(`
The hearing began in a room too small for the fishermen, dockworkers, and families who had come to learn why the coast they knew had vanished from a government map.¦بدأت جلسة الاستماع في غرفة لا تتسع للصيادين والعمّال والعائلات التي حضرت لتعرف كيف اختفى الساحل الذي تعرفه من خريطة حكومية.
The director arrived with lawyers and a polished statement about modernization, insisting in the same breath that the chart was accurate and that any errors were inherited from the previous survey.¦حضر المدير مع محامين وبيان مصقول عن التحديث، وأصرّ في الجملة نفسها على أن الخريطة دقيقة وأن أي أخطاء فيها موروثة من المسح السابق.
Lina presented the original ledger, the altered chart, and the vessel's instrument log, then explained each measurement slowly enough for people without technical training to follow.¦قدّمت لينا دفتر القياسات الأصلي والخريطة المعدّلة وسجل أجهزة السفينة، ثم شرحت كل قياس ببطء يسمح لمن لا يملك تدريبًا تقنيًا أن يفهم.
She refused to pretend the numbers were mysterious: the ridge had not moved, the sea had not changed its rules, and someone had simply drawn a line in the wrong place.¦رفضت أن تصوّر الأرقام لغزًا: الحيد لم يتحرك، والبحر لم يبدّل قوانينه، بل رسم أحدهم خطًا في المكان الخطأ ببساطة.
A lawyer suggested that her father's grief-stricken daughter could hardly be impartial, but Lina answered that the measurements would remain the same whoever read them aloud.¦لمّح محامٍ إلى أن ابنة الرجل الراحل لا تستطيع أن تكون محايدة، فأجابت لينا بأن القياسات ستبقى كما هي مهما كان الشخص الذي يقرؤها بصوت عالٍ.
Idris admitted under oath that he had hidden the ledger for years, accepting the shame of his silence instead of asking the committee to treat fear as an excuse.¦اعترف إدريس تحت القسم بأنه أخفى الدفتر سنوات، وتحمّل خجل صمته بدل أن يطلب من اللجنة اعتبار الخوف عذرًا كافيًا.
The youngest clerk from the map room then testified that he had seen an instruction to destroy the records, a document he had copied before anyone thought to lock the cabinet.¦ثم شهد الموظف الشاب من غرفة الخرائط بأنه رأى أمرًا بإتلاف السجلات، ونسخه قبل أن يخطر لأحد أن يقفل الخزانة.
By the book, the committee could suspend the shipping contract pending an independent survey, but several members hesitated because the port supported hundreds of local jobs.¦وفق الإجراءات الرسمية، استطاعت اللجنة تعليق عقد الشحن ريثما يُجرى مسح مستقل، لكن أعضاءً ترددوا لأن الميناء يوفر مئات فرص العمل.
Lina reminded them that the workers had the most to lose if a vessel broke against the ridge, and that safety was not an expensive luxury reserved for prosperous harbors.¦ذكّرتهم لينا بأن العمّال سيكونون أكثر الخاسرين إذا تحطمت سفينة على الحيد، وأن السلامة ليست ترفًا باهظًا يقتصر على الموانئ الغنية.
The vote was narrow, but the contract was suspended, the charts were withdrawn, and a public survey was ordered before the next cargo ship could enter the channel.¦جاء التصويت بفارق ضئيل، لكن العقد عُلّق والخرائط سُحبت وصدر أمر بإجراء مسح علني قبل دخول سفينة شحن أخرى إلى الممر.`)},
 {title:'The True Coast',titleAr:'الساحل الحقيقي',paragraphs:passages(`
Winter returned before the new charts were ready, bringing short days and a wind that carried salt into every doorway, but the fishermen continued to mark the ridge with temporary lights.¦عاد الشتاء قبل أن تجهز الخرائط الجديدة، حاملًا أيامًا قصيرة ورياحًا تحمل الملح إلى كل باب، لكن الصيادين واصلوا تعليم الحيد بأضواء مؤقتة.
Lina joined the independent survey as a paid cartographer, not because her father's name opened doors, but because she could explain how a false line had survived so many official signatures.¦انضمت لينا إلى فريق المسح المستقل بوصفها رسامة خرائط مأجورة، لا لأن اسم والدها فتح الأبواب، بل لأنها استطاعت شرح كيف نجا خط زائف من كل تلك التواقيع الرسمية.
Each morning she took measurements beside younger apprentices, showing them how to record uncertainty instead of hiding it behind neat numbers that looked more convincing than the truth.¦كل صباح كانت تقيس الأعماق إلى جانب متدرّبين أصغر سنًا، وتعلّمهم تسجيل مقدار الشك بدل إخفائه خلف أرقام مرتبة تبدو أكثر إقناعًا من الحقيقة.
Idris repaired his boat with help from the harbor cooperative and returned to sea, although he kept the brass key on a cord around his neck as a reminder of what silence had cost.¦أصلح إدريس قاربه بمساعدة تعاونية الميناء وعاد إلى البحر، لكنه أبقى المفتاح النحاسي معلّقًا في عنقه تذكيرًا بثمن الصمت.
The clerk was promoted to the records office, where he established a rule that every amended chart must preserve its earlier versions and the names of those who approved the change.¦نُقل الموظف الشاب إلى مكتب السجلات في منصب أعلى، ووضع قاعدة تحفظ كل نسخة سابقة من الخريطة المعدّلة وأسماء من وافقوا على التغيير.
No one pretended that the hearing had solved every problem: the company appealed, the harbor lost income for a season, and some families still distrusted anyone who carried an official seal.¦لم يتظاهر أحد بأن الجلسة حلّت كل مشكلة؛ فقد استأنفت الشركة القرار، وخسر الميناء دخل موسم كامل، وظلت بعض العائلات تشك في كل من يحمل ختمًا رسميًا.
But the next chart placed the ridge where it belonged, and the lighthouse was restored as a working warning station rather than a picturesque ruin for visitors.¦لكن الخريطة التالية أعادت الحيد إلى مكانه الصحيح، ورُممت المنارة لتصبح محطة إنذار عاملة بدل أن تكون أطلالًا جميلة للسياح.
On the day the lamp was lit again, Lina climbed the stairs alone and found a pencil note tucked behind the ledger's cover, written in her father's familiar hand.¦في يوم إضاءة المصباح من جديد، صعدت لينا الدرج وحدها، ووجدت ملاحظة بقلم رصاص مدسوسة خلف غلاف الدفتر، بخط والدها المألوف.
A map, he had written, is a promise to someone you will never see; when you draw a line, remember that a stranger may trust it with a life.¦كتب: «الخريطة وعد تقدمه لشخص لن تراه أبدًا؛ وحين ترسم خطًا، تذكّر أن غريبًا قد يأتمنه على حياته».
She put the note back, opened the shutters, and watched the beam travel across the water, not changing the coast, only helping the people at sea see it clearly.¦أعادت الملاحظة إلى مكانها، وفتحت المصاريع، وراقبت شعاع الضوء يعبر الماء؛ لم يغيّر الساحل، بل ساعد من في البحر على رؤيته بوضوح.`)}
];
const terms=[
 ['in plain sight','على مرأى الجميع','ظهر الرقم فوق الختم الرسمي، لا في مكان خفي','idiom','An obvious place where people may still overlook something.'],
 ['cut corners','يتجاوز خطوات ضرورية لتوفير الوقت أو المال','التلاعب بمعايير السلامة في مسح الميناء','idiom','Not about physically cutting a corner.'],
 ['against the tide','عكس التيار أو رغم الظروف','حُفظت الحقيقة رغم محاولات إخفائها','idiom','A figurative use alongside a literal sea setting.'],
 ['ledger of soundings','دفتر قياسات الأعماق','سجل أعماق المياه والراصدين','nautical phrase','A sounding measures depth.'],
 ['on the record','مثبت رسميًا في السجل','أراد الأب توثيق اعتراضه','idiom','Used for statements preserved in an official record.'],
 ['at stake','معرّض للخطر أو على المحك','كانت رخصة إدريس ورزقه معرضين للخطر','idiom','Often refers to something that may be lost.'],
 ['hold water','يصمد أمام الفحص أو النقد','شكك المسؤول في قوة الدليل القانونية','idiom','Figurative, despite the maritime setting.'],
 ['in the same breath','في الجملة نفسها وبصورة متناقضة','ادّعى المدير دقة الخريطة ووراثة أخطائها معًا','idiom','Often highlights inconsistency.'],
 ['drawn a line','رسم خطًا','غيّر أحدهم حدود الممر على الخريطة','phrase','Also figuratively means setting a limit.'],
 ['by the book','وفق القواعد والإجراءات','سلطة اللجنة في تعليق العقد','idiom','Following formal rules.'],
 ['under oath','تحت القسم','اعترف إدريس رسميًا أمام اللجنة','legal phrase','A formal promise to tell the truth.'],
 ['a matter of record','حقيقة مثبتة في السجلات','الخلاف كان حول بيانات موثقة لا انطباعات','phrase','A fact established in official records.'],
 ['narrow gamble','مغامرة ذات هامش أمان ضئيل','عبور السفينة قرب الحيد','collocation','Narrow refers to the limited margin for error.'],
 ['barely enough room','حيّز بالكاد يكفي','لم تملك السفينة مساحة كبيرة لتغيّر مسارها','phrase','Barely emphasizes a near miss.'],
 ['the most to lose','الأكثر عرضة للخسارة','عمّال الميناء سيتحملون عواقب الحادث','idiom','Used to compare risks and consequences.'],
 ['a blind eye','تجاهل متعمد','مصطلح للمراجعة: لا يُنسب للسرد ما لم يظهر فيه','idiom','Editorial annotation pending: term not present in source text.']
].filter(t=>t[0]!=='a blind eye').map(([term,literal,context,type,note])=>({term,literal,context,type,note}));
const story={
 id:'the-salt-meridian',title:'The Salt Meridian',subtitle:'A false map can sink a real ship.',
 genre:'historical',level:'B2',cover:'salt-meridian',
 description:'A cartographer finds her father\'s erased warning on an altered harbor chart and must decide how much truth a town can afford.',
 provenance:'Original English fiction composed for Lingua Tales; original Arabic companion draft. Not a historic published novel.',
 editorialStatus:'draft — independent bilingual editorial review pending',
 chapters,terms
};
global.StoryLensEditorialStories=(global.StoryLensEditorialStories||[]).concat(story);
})(window);
