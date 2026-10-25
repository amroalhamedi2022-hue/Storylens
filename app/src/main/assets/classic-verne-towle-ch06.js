/* Lingua Tales — complete Towle Chapter VI (37 source paragraphs).
 * English: Jules Verne / George Makepeace Towle (1873); Standard Ebooks CC0 transcription.
 * https://github.com/standardebooks/jules-verne_around-the-world-in-eighty-days_george-makepeace-towle/blob/master/src/epub/text/chapter-6.xhtml
 * Arabic: new companion draft; independent literary review and territorial rights pending.
 */
(function(global){
'use strict';
const story=(global.StoryLensEditorialStories||[]).find(s=>s.id==='around-the-world-in-eighty-days-towle');
if(!story||story.chapters.length!==5)throw Error('Towle chapter VI load order mismatch');
story.chapters.push({
 title:'In Which Fix, the Detective, Betrays a Very Natural Impatience',
 titleAr:'فيه يُظهر المحقق فيكس نفاد صبر مفهومًا',
 paragraphs:[
  {
    "en": "The circumstances under which this telegraphic dispatch about Phileas Fogg was sent were as follows:",
    "ar": "كانت الظروف التي أُرسلت فيها هذه البرقية بشأن فيلياس فوغ على النحو الآتي:"
  },
  {
    "en": "The steamer Mongolia, belonging to the Peninsular and Oriental Company, built of iron, of two thousand eight hundred tons burden, and five hundred horsepower, was due at eleven o’clock a.m. on Wednesday, the 9th of October, at Suez. The Mongolia plied regularly between Brindisi and Bombay via the Suez Canal, and was one of the fastest steamers belonging to the company, always making more than ten knots an hour between Brindisi and Suez, and nine and a half between Suez and Bombay.",
    "ar": "كان من المقرر أن تصل الباخرة «منغوليا»، التابعة لشركة الملاحة شبه الجزيرة والشرقية، إلى السويس في الحادية عشرة صباح الأربعاء التاسع من أكتوبر. وكانت سفينة حديدية حمولتها ألفان وثمانمئة طن، بقوة خمسمئة حصان. تبحر بانتظام بين برينديزي وبومباي عبر قناة السويس، وهي من أسرع سفن الشركة؛ إذ تتجاوز سرعتها عشر عقد بحرية في الساعة بين برينديزي والسويس، وتسع عقد ونصف بين السويس وبومباي."
  },
  {
    "en": "Two men were promenading up and down the wharves, among the crowd of natives and strangers who were sojourning at this once straggling village—now, thanks to the enterprise of M. Lesseps, a fast-growing town. One was the British consul at Suez, who, despite the prophecies of the English Government, and the unfavourable predictions of Stephenson, was in the habit of seeing, from his office window, English ships daily passing to and fro on the great canal, by which the old roundabout route from England to India by the Cape of Good Hope was abridged by at least a half. The other was a small, slight-built personage, with a nervous, intelligent face, and bright eyes peering out from under eyebrows which he was incessantly twitching. He was just now manifesting unmistakable signs of impatience, nervously pacing up and down, and unable to stand still for a moment. This was Fix, one of the detectives who had been dispatched from England in search of the bank robber; it was his task to narrowly watch every passenger who arrived at Suez, and to follow up all who seemed to be suspicious characters, or bore a resemblance to the description of the criminal, which he had received two days before from the police headquarters at London. The detective was evidently inspired by the hope of obtaining the splendid reward which would be the prize of success, and awaited with a feverish impatience, easy to understand, the arrival of the steamer Mongolia.",
    "ar": "كان رجلان يتمشيان ذهابًا وإيابًا على الأرصفة وسط حشود السكان والغرباء المقيمين في قرية كانت يومًا متناثرة البيوت، ثم غدت مدينة سريعة النمو بفضل مشروع السيد دي لسبس. أحدهما القنصل البريطاني في السويس؛ وكان يرى من نافذة مكتبه كل يوم السفن الإنجليزية تعبر القناة العظيمة ذهابًا وإيابًا، رغم تشاؤم الحكومة الإنجليزية وتنبؤات ستيفنسون، بعدما اختصرت القناة الطريق القديم حول رأس الرجاء الصالح إلى الهند بما لا يقل عن النصف. أما الثاني فكان رجلًا صغير القامة نحيل البنية، على وجهه ملامح ذكاء وتوتر، وعيناه اللامعتان تترقبان من تحت حاجبين لا يكف عن تحريكهما. بدت عليه علامات نفاد الصبر بوضوح؛ يمشي بعصبية ولا يطيق الثبات لحظة. كان ذلك فيكس، أحد المحققين الذين أُرسلوا من إنجلترا للبحث عن سارق البنك. مهمته مراقبة كل راكب يصل إلى السويس وملاحقة كل من يثير الريبة أو يشبه وصف المجرم الذي تلقاه قبل يومين من مقر الشرطة في لندن. وكان يأمل في المكافأة الكبيرة لمن ينجح في القبض عليه، وينتظر وصول «منغوليا» بلهفة محمومة مفهومة."
  },
  {
    "en": "“So you say, consul,” asked he for the twentieth time, “that this steamer is never behind time?”",
    "ar": "سأله للمرة العشرين: «إذن أنت تقول يا سعادة القنصل إن هذه الباخرة لا تتأخر أبدًا؟»"
  },
  {
    "en": "“No, Mr. Fix,” replied the consul. “She was bespoken yesterday at Port Said, and the rest of the way is of no account to such a craft. I repeat that the Mongolia has been in advance of the time required by the company’s regulations, and gained the prize awarded for excess of speed.”",
    "ar": "أجاب القنصل: «لا يا سيد فيكس. لقد رُصدت أمس عند بورسعيد، وما بقي من الطريق يسير على سفينة كهذه. أكرر لك أن منغوليا تسبق عادة الموعد المحدد في لوائح الشركة، وقد نالت جائزة لتجاوزها السرعة المطلوبة»."
  },
  {
    "en": "“Does she come directly from Brindisi?”",
    "ar": "«وهل تأتي مباشرة من برينديزي؟»"
  },
  {
    "en": "“Directly from Brindisi; she takes on the Indian mails there, and she left there Saturday at five p.m. Have patience, Mr. Fix; she will not be late. But really, I don’t see how, from the description you have, you will be able to recognise your man, even if he is on board the Mongolia.”",
    "ar": "«مباشرة من برينديزي؛ تحمل البريد الهندي هناك، وقد غادرت السبت عند الخامسة مساءً. تحلَّ بالصبر يا سيد فيكس، فلن تتأخر. لكنني لا أرى كيف ستتعرف إلى الرجل اعتمادًا على الوصف الذي معك، حتى لو كان على متن منغوليا»."
  },
  {
    "en": "“A man rather feels the presence of these fellows, consul, than recognises them. You must have a scent for them, and a scent is like a sixth sense which combines hearing, seeing, and smelling. I’ve arrested more than one of these gentlemen in my time, and, if my thief is on board, I’ll answer for it; he’ll not slip through my fingers.”",
    "ar": "«إن المرء يستشعر وجود أمثال هؤلاء يا سعادة القنصل أكثر مما يتعرف إلى وجوههم. لا بد من حاسة خاصة بهم، كأنها حاسة سادسة تجمع السمع والبصر والشم. لقد ألقيت القبض على أكثر من واحد منهم، وإذا كان لصّي على متن السفينة فأضمن لك أنه لن يفلت من يدي»."
  },
  {
    "en": "“I hope so, Mr. Fix, for it was a heavy robbery.”",
    "ar": "«آمل ذلك يا سيد فيكس، فقد كانت سرقة كبيرة»."
  },
  {
    "en": "“A magnificent robbery, consul; fifty-five thousand pounds! We don’t often have such windfalls. Burglars are getting to be so contemptible nowadays! A fellow gets hung for a handful of shillings!”",
    "ar": "«بل سرقة هائلة يا سعادة القنصل: خمسة وخمسون ألف جنيه! لا نصادف مثل هذه الغنائم كثيرًا. لقد صار اللصوص في أيامنا مثيرين للازدراء؛ فقد يُشنق أحدهم من أجل حفنة شلنات!»"
  },
  {
    "en": "“Mr. Fix,” said the consul, “I like your way of talking, and hope you’ll succeed; but I fear you will find it far from easy. Don’t you see, the description which you have there has a singular resemblance to an honest man?”",
    "ar": "قال القنصل: «يعجبني أسلوبك في الكلام يا سيد فيكس، وأتمنى أن تنجح، لكنني أخشى ألا تكون المهمة سهلة. ألا ترى أن الوصف الذي تحمله يشبه إلى حد بعيد رجلًا شريفًا؟»"
  },
  {
    "en": "“Consul,” remarked the detective, dogmatically, “great robbers always resemble honest folks. Fellows who have rascally faces have only one course to take, and that is to remain honest; otherwise they would be arrested offhand. The artistic thing is, to unmask honest countenances; it’s no light task, I admit, but a real art.”",
    "ar": "قال المحقق بثقة قاطعة: «يا سعادة القنصل، كبار اللصوص يشبهون دائمًا الشرفاء. أما أصحاب الوجوه التي توحي بالإجرام فلا خيار أمامهم سوى الاستقامة، وإلا قُبض عليهم فورًا. البراعة الحقيقية أن تكشف القناع عن وجه يبدو أمينًا؛ أعترف بأنها مهمة صعبة، لكنها فن قائم بذاته»."
  },
  {
    "en": "Mr. Fix evidently was not wanting in a tinge of self-conceit.",
    "ar": "ومن الواضح أن السيد فيكس لم يكن يفتقر إلى شيء من الغرور."
  },
  {
    "en": "Little by little the scene on the quay became more animated; sailors of various nations, merchants, ship-brokers, porters, fellahs, bustled to and fro as if the steamer were immediately expected. The weather was clear, and slightly chilly. The minarets of the town loomed above the houses in the pale rays of the sun. A jetty pier, some two thousand yards along, extended into the roadstead. A number of fishing-smacks and coasting boats, some retaining the fantastic fashion of ancient galleys, were discernible on the Red Sea.",
    "ar": "شيئًا فشيئًا ازدادت الحركة على الرصيف؛ فبحارة من جنسيات مختلفة، وتجار وسماسرة سفن وحمالون وفلاحون، يروحون ويجيئون كأن الباخرة ستصل في أي لحظة. كان الجو صافيًا مائلًا إلى البرودة، وتلوح مآذن المدينة فوق البيوت في أشعة الشمس الباهتة. وامتد حاجز بحري إلى عرض المرسى نحو ألفي ياردة، بينما ظهرت في البحر الأحمر قوارب صيد وسفن ساحلية، ما زال بعضها يحتفظ بهيئة القوادس القديمة الغريبة."
  },
  {
    "en": "As he passed among the busy crowd, Fix, according to habit, scrutinised the passersby with a keen, rapid glance.",
    "ar": "وأثناء مرور فيكس وسط الزحام، كان يفحص وجوه المارة بنظرات حادة سريعة، على عادته."
  },
  {
    "en": "It was now half-past ten.",
    "ar": "كانت الساعة قد بلغت العاشرة والنصف."
  },
  {
    "en": "“The steamer doesn’t come!” he exclaimed, as the port clock struck.",
    "ar": "صاح حين دقت ساعة الميناء: «الباخرة لم تصل!»"
  },
  {
    "en": "“She can’t be far off now,” returned his companion.",
    "ar": "أجابه رفيقه: «لا بد أنها باتت قريبة الآن»."
  },
  {
    "en": "“How long will she stop at Suez?”",
    "ar": "«كم ستبقى في السويس؟»"
  },
  {
    "en": "“Four hours; long enough to get in her coal. It is thirteen hundred and ten miles from Suez to Aden, at the other end of the Red Sea, and she has to take in a fresh coal supply.”",
    "ar": "«أربع ساعات، تكفي لتزويدها بالفحم. المسافة من السويس إلى عدن، عند الطرف الآخر للبحر الأحمر، ألف وثلاثمئة وعشرة أميال، ولا بد لها من التزود بمخزون جديد من الفحم»."
  },
  {
    "en": "“And does she go from Suez directly to Bombay?”",
    "ar": "«وهل تتجه من السويس إلى بومباي مباشرة؟»"
  },
  {
    "en": "“Without putting in anywhere.”",
    "ar": "«دون أن تتوقف في أي مكان»."
  },
  {
    "en": "“Good!” said Fix. “If the robber is on board he will no doubt get off at Suez, so as to reach the Dutch or French colonies in Asia by some other route. He ought to know that he would not be safe an hour in India, which is English soil.”",
    "ar": "قال فيكس: «جيد! إن كان السارق على متنها فسينزل بلا شك في السويس ليصل إلى المستعمرات الهولندية أو الفرنسية في آسيا عبر طريق آخر. لا بد أنه يعلم أنه لن يكون آمنًا ساعة واحدة في الهند الخاضعة للإنجليز»."
  },
  {
    "en": "“Unless,” objected the consul, “he is exceptionally shrewd. An English criminal, you know, is always better concealed in London than anywhere else.”",
    "ar": "اعترض القنصل: «إلا إذا كان شديد الدهاء؛ فأنت تعلم أن المجرم الإنجليزي يستطيع الاختباء في لندن أفضل من أي مكان آخر»."
  },
  {
    "en": "This observation furnished the detective food for thought, and meanwhile the consul went away to his office. Fix, left alone, was more impatient than ever, having a presentiment that the robber was on board the Mongolia. If he had indeed left London intending to reach the New World, he would naturally take the route via India, which was less watched and more difficult to watch than that of the Atlantic. But Fix’s reflections were soon interrupted by a succession of sharp whistles, which announced the arrival of the Mongolia. The porters and fellahs rushed down the quay, and a dozen boats pushed off from the shore to go and meet the steamer. Soon her gigantic hull appeared passing along between the banks, and eleven o’clock struck as she anchored in the road. She brought an unusual number of passengers, some of whom remained on deck to scan the picturesque panorama of the town, while the greater part disembarked in the boats, and landed on the quay.",
    "ar": "أعطت هذه الملاحظة المحقق مادة للتفكير، بينما عاد القنصل إلى مكتبه. بقي فيكس وحده أشد نفادًا للصبر، وقد ساوره إحساس بأن السارق على متن «منغوليا». فإذا كان قد غادر لندن قاصدًا العالم الجديد، فمن الطبيعي أن يسلك طريق الهند، لأنه أقل مراقبة وأصعب تتبعًا من طريق الأطلسي. لكن أفكاره انقطعت على وقع صفارات حادة متتابعة تعلن وصول «منغوليا». اندفع الحمالون والفلاحون إلى الرصيف، وانطلقت عشرات القوارب من الشاطئ لاستقبال السفينة. وسرعان ما ظهر هيكلها الهائل بين الضفتين، ودقت الحادية عشرة عندما رست في المرسى. كانت تقل عددًا غير معتاد من الركاب؛ فبقي بعضهم على السطح يتأمل منظر المدينة، ونزل معظمهم في القوارب إلى الرصيف."
  },
  {
    "en": "Fix took up a position, and carefully examined each face and figure which made its appearance. Presently one of the passengers, after vigorously pushing his way through the importunate crowd of porters, came up to him and politely asked if he could point out the English consulate, at the same time showing a passport which he wished to have visaed. Fix instinctively took the passport, and with a rapid glance read the description of its bearer. An involuntary motion of surprise nearly escaped him, for the description in the passport was identical with that of the bank robber which he had received from Scotland Yard.",
    "ar": "اتخذ فيكس موضعًا يتيح له فحص كل وجه وقامة تظهر أمامه. وبعد قليل تقدم منه أحد الركاب بعدما شق طريقه بصعوبة بين الحمالين الملحّين، وسأله بأدب عن مكان القنصلية الإنجليزية، وهو يريه جواز سفر يريد تأشيرته. أخذ فيكس الجواز تلقائيًا وقرأ وصف صاحبه بنظرة سريعة. وكاد يفضح دهشته بحركة لا إرادية، لأن الوصف في الجواز كان مطابقًا لوصف سارق البنك الذي تلقاه من سكوتلاند يارد."
  },
  {
    "en": "“Is this your passport?” asked he.",
    "ar": "سأله: «هل هذا جواز سفرك؟»"
  },
  {
    "en": "“No, it’s my master’s.”",
    "ar": "«لا، إنه جواز سيدي»."
  },
  {
    "en": "“And your master is—”",
    "ar": "«وسيدك هو...؟»"
  },
  {
    "en": "“He stayed on board.”",
    "ar": "«بقي على متن السفينة»."
  },
  {
    "en": "“But he must go to the consul’s in person, so as to establish his identity.”",
    "ar": "«لكن عليه أن يحضر بنفسه إلى القنصلية لإثبات هويته»."
  },
  {
    "en": "“Oh, is that necessary?”",
    "ar": "«آه، أهذا ضروري؟»"
  },
  {
    "en": "“Quite indispensable.”",
    "ar": "«ضروري تمامًا»."
  },
  {
    "en": "“And where is the consulate?”",
    "ar": "«وأين تقع القنصلية؟»"
  },
  {
    "en": "“There, on the corner of the square,” said Fix, pointing to a house two hundred steps off.",
    "ar": "قال فيكس مشيرًا إلى منزل على بعد مئتي خطوة: «هناك، عند زاوية الساحة»."
  },
  {
    "en": "“I’ll go and fetch my master, who won’t be much pleased, however, to be disturbed.”",
    "ar": "«سأذهب لأحضر سيدي، مع أنه لن يُسر كثيرًا إذا أزعجته»."
  },
  {
    "en": "The passenger bowed to Fix, and returned to the steamer.",
    "ar": "انحنى الراكب تحيةً لفيكس، ثم عاد إلى الباخرة."
  }
]
});
story.terms.push(...[
  {
    "term": "telegraphic dispatch",
    "literal": "برقية تلغرافية",
    "context": "الرسالة التي أثارت شكوك الشرطة",
    "type": "noun phrase",
    "note": "A message sent by telegraph."
  },
  {
    "term": "wharves",
    "literal": "الأرصفة البحرية",
    "context": "مكان انتظار فيكس للباخرة",
    "type": "noun",
    "note": "Structures alongside which ships load and unload."
  },
  {
    "term": "straggling village",
    "literal": "قرية مترامية البيوت",
    "context": "وصف السويس قبل ازدهار القناة",
    "type": "descriptive phrase",
    "note": "A settlement spread out irregularly."
  },
  {
    "term": "unmistakable signs",
    "literal": "علامات لا تخطئها العين",
    "context": "نفاد صبر المحقق",
    "type": "collocation",
    "note": "Clear indications that cannot be confused."
  },
  {
    "term": "suspicious characters",
    "literal": "أشخاص مثيرون للريبة",
    "context": "ركاب يراقبهم فيكس",
    "type": "phrase",
    "note": "People whose behavior raises suspicion."
  },
  {
    "term": "behind time",
    "literal": "متأخر عن الموعد",
    "context": "سؤال فيكس عن انتظام الباخرة",
    "type": "idiom",
    "note": "Late compared with a schedule."
  },
  {
    "term": "sixth sense",
    "literal": "حاسة سادسة",
    "context": "حدس المحقق في اكتشاف اللصوص",
    "type": "idiom",
    "note": "An intuition beyond the five senses."
  },
  {
    "term": "windfalls",
    "literal": "مكاسب غير متوقعة",
    "context": "وصف فيكس لقيمة السرقة",
    "type": "noun",
    "note": "Unexpected gains or good fortune."
  },
  {
    "term": "self-conceit",
    "literal": "غرور بالنفس",
    "context": "اعتزاز فيكس المبالغ بمهارته",
    "type": "noun",
    "note": "An exaggerated opinion of one's abilities."
  },
  {
    "term": "bustled to and fro",
    "literal": "راحوا وجاؤوا بنشاط",
    "context": "حركة الميناء قبيل وصول السفينة",
    "type": "phrase",
    "note": "Moved busily back and forth."
  },
  {
    "term": "food for thought",
    "literal": "مادة للتفكير",
    "context": "ملاحظة القنصل التي شغلت فيكس",
    "type": "idiom",
    "note": "Something worth considering carefully."
  },
  {
    "term": "presentiment",
    "literal": "إحساس مسبق",
    "context": "شعور فيكس بأن السارق على السفينة",
    "type": "noun",
    "note": "A feeling that something is about to happen."
  },
  {
    "term": "disembarked",
    "literal": "نزلوا من السفينة",
    "context": "وصول الركاب إلى الرصيف",
    "type": "verb",
    "note": "Went ashore from a ship."
  },
  {
    "term": "importunate crowd",
    "literal": "حشد ملحّ",
    "context": "الحمالون الذين زاحموا الراكب",
    "type": "literary phrase",
    "note": "A persistently demanding crowd."
  },
  {
    "term": "visaed",
    "literal": "وُضعت عليه تأشيرة",
    "context": "طلب الراكب توثيق جواز السفر",
    "type": "verb",
    "note": "Officially endorsed a passport."
  },
  {
    "term": "Quite indispensable",
    "literal": "ضروري تمامًا",
    "context": "إصرار فيكس على حضور صاحب الجواز",
    "type": "phrase",
    "note": "Absolutely necessary."
  },
  {
    "term": "far from easy",
    "literal": "ليس سهلًا على الإطلاق",
    "context": "تحذير القنصل من صعوبة المهمة",
    "type": "idiom",
    "note": "Very difficult."
  }
]);
story.totalChapters=37;
story.subtitle='The original Towle translation — Chapters I–VI';
story.description='At Suez, detective Fix waits for the Mongolia and discovers a passport matching the bank robber’s description. Six authentic chapters; the journey continues.';
story.editorialStatus='English Chapters I–VI source-checked; Arabic draft pending independent review; 6 of 37 chapters';
story.provenance+=' Chapter VI: Standard Ebooks Towle transcription (CC0 editorial edition); territory rights pending review.';
})(window);
