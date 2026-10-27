/* Lingua Tales — authentic Towle Chapter XXXVI from the pinned Standard Ebooks transcription.
 * Upstream commit: 56c82e97ff5d4f8950afca05b71af72688a8da34; source blob: 04892fb62e2a79732e13ad18620a0d9ec8f98189; src/epub/text/chapter-36.xhtml.
 * Standard Ebooks contributors dedicate editorial transcription/artwork to CC0; Towle's 1873 translation is treated as public domain in the USA.
 * Territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
 * 30 narrative paragraphs / 1060 English words; normalized English SHA-256: ebb586929c9c278c7191447c1bc99152e2ad83754a6c25844325372d3a9387cf.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==35)throw Error('Towle chapter XXXVI load order mismatch');
const english=[
  "It is time to relate what a change took place in English public opinion when it transpired that the real bank robber, a certain James Strand, had been arrested, on the 17th day of December, at Edinburgh. Three days before, Phileas Fogg had been a criminal, who was being desperately followed up by the police; now he was an honourable gentleman, mathematically pursuing his eccentric journey round the world.",
  "The papers resumed their discussion about the wager; all those who had laid bets, for or against him, revived their interest, as if by magic; the “Phileas Fogg bonds” again became negotiable, and many new wagers were made. Phileas Fogg’s name was once more at a premium on ’Change.",
  "His five friends of the Reform Club passed these three days in a state of feverish suspense. Would Phileas Fogg, whom they had forgotten, reappear before their eyes! Where was he at this moment? The 17th of December, the day of James Strand’s arrest, was the seventy-sixth since Phileas Fogg’s departure, and no news of him had been received. Was he dead? Had he abandoned the effort, or was he continuing his journey along the route agreed upon? And would he appear on Saturday, the 21st of December, at a quarter before nine in the evening, on the threshold of the Reform Club saloon?",
  "The anxiety in which, for three days, London society existed, cannot be described. Telegrams were sent to America and Asia for news of Phileas Fogg. Messengers were dispatched to the house in Saville Row morning and evening. No news. The police were ignorant what had become of the detective, Fix, who had so unfortunately followed up a false scent. Bets increased, nevertheless, in number and value. Phileas Fogg, like a racehorse, was drawing near his last turning-point. The bonds were quoted, no longer at a hundred below par, but at twenty, at ten, and at five; and paralytic old Lord Albemarle bet even in his favour.",
  "A great crowd was collected in Pall Mall and the neighbouring streets on Saturday evening; it seemed like a multitude of brokers permanently established around the Reform Club. Circulation was impeded, and everywhere disputes, discussions, and financial transactions were going on. The police had great difficulty in keeping back the crowd, and as the hour when Phileas Fogg was due approached, the excitement rose to its highest pitch.",
  "The five antagonists of Phileas Fogg had met in the great saloon of the club. John Sullivan and Samuel Fallentin, the bankers, Andrew Stuart, the engineer, Gauthier Ralph, the director of the Bank of England, and Thomas Flanagan, the brewer, one and all waited anxiously.",
  "When the clock indicated twenty minutes past eight, Andrew Stuart got up, saying, “Gentlemen, in twenty minutes the time agreed upon between Mr. Fogg and ourselves will have expired.”",
  "“What time did the last train arrive from Liverpool?” asked Thomas Flanagan.",
  "“At twenty-three minutes past seven,” replied Gauthier Ralph; “and the next does not arrive till ten minutes after twelve.”",
  "“Well, gentlemen,” resumed Andrew Stuart, “if Phileas Fogg had come in the 7:23 train, he would have got here by this time. We can, therefore, regard the bet as won.”",
  "“Wait; don’t let us be too hasty,” replied Samuel Fallentin. “You know that Mr. Fogg is very eccentric. His punctuality is well known; he never arrives too soon, or too late; and I should not be surprised if he appeared before us at the last minute.”",
  "“Why,” said Andrew Stuart nervously, “if I should see him, I should not believe it was he.”",
  "“The fact is,” resumed Thomas Flanagan, “Mr. Fogg’s project was absurdly foolish. Whatever his punctuality, he could not prevent the delays which were certain to occur; and a delay of only two or three days would be fatal to his tour.”",
  "“Observe, too,” added John Sullivan, “that we have received no intelligence from him, though there are telegraphic lines all along his route.”",
  "“He has lost, gentleman,” said Andrew Stuart, “he has a hundred times lost! You know, besides, that the China—the only steamer he could have taken from New York to get here in time—arrived yesterday. I have seen a list of the passengers, and the name of Phileas Fogg is not among them. Even if we admit that fortune has favoured him, he can scarcely have reached America. I think he will be at least twenty days behindhand, and that Lord Albemarle will lose a cool five thousand.”",
  "“It is clear,” replied Gauthier Ralph; “and we have nothing to do but to present Mr. Fogg’s cheque at Barings tomorrow.”",
  "At this moment, the hands of the club clock pointed to twenty minutes to nine.",
  "“Five minutes more,” said Andrew Stuart.",
  "The five gentlemen looked at each other. Their anxiety was becoming intense; but, not wishing to betray it, they readily assented to Mr. Fallentin’s proposal of a rubber.",
  "“I wouldn’t give up my four thousand of the bet,” said Andrew Stuart, as he took his seat, “for three thousand nine hundred and ninety-nine.”",
  "The clock indicated eighteen minutes to nine.",
  "The players took up their cards, but could not keep their eyes off the clock. Certainly, however secure they felt, minutes had never seemed so long to them!",
  "“Seventeen minutes to nine,” said Thomas Flanagan, as he cut the cards which Ralph handed to him.",
  "Then there was a moment of silence. The great saloon was perfectly quiet; but the murmurs of the crowd outside were heard, with now and then a shrill cry. The pendulum beat the seconds, which each player eagerly counted, as he listened, with mathematical regularity.",
  "“Sixteen minutes to nine!” said John Sullivan, in a voice which betrayed his emotion.",
  "One minute more, and the wager would be won. Andrew Stuart and his partners suspended their game. They left their cards, and counted the seconds.",
  "At the fortieth second, nothing. At the fiftieth, still nothing.",
  "At the fifty-fifth, a loud cry was heard in the street, followed by applause, hurrahs, and some fierce growls.",
  "The players rose from their seats.",
  "At the fifty-seventh second the door of the saloon opened; and the pendulum had not beat the sixtieth second when Phileas Fogg appeared, followed by an excited crowd who had forced their way through the club doors, and in his calm voice, said, “Here I am, gentlemen!”"
];
const arabic=[
  "حان الوقت لنسرد كيف تبدّل الرأي العام الإنجليزي حين تبيّن أن سارق المصرف الحقيقي، رجل يُدعى جيمس ستراند، قد اعتُقل في إدنبرة يوم السابع عشر من ديسمبر. قبل ذلك بثلاثة أيام كان فيلياس فوج مجرمًا تطارده الشرطة بكل إصرار؛ أما الآن فهو رجل محترم يواصل رحلته الغريبة حول العالم بدقة حسابية.",
  "عادت الصحف إلى مناقشة الرهان، واستعاد كل من راهن معه أو ضده اهتمامه كأنما بسحر؛ وعادت «سندات فيلياس فوج» قابلة للتداول، وعُقدت رهانات جديدة كثيرة. وهكذا ارتفعت قيمة اسم فيلياس فوج من جديد في البورصة.",
  "قضى أصدقاؤه الخمسة في نادي الإصلاح هذه الأيام الثلاثة في ترقّب محموم. أسيعود فيلياس فوج، الذي نسوه، للظهور أمامهم؟ أين كان الآن؟ كان السابع عشر من ديسمبر، يوم اعتقال جيمس ستراند، اليوم السادس والسبعين منذ مغادرة فوج، ولم يصل عنه أي خبر. أكان قد مات؟ هل تخلّى عن المحاولة أم واصل رحلته وفق المسار المتفق عليه؟ وهل سيظهر مساء السبت، الحادي والعشرين من ديسمبر، قبل التاسعة بخمس عشرة دقيقة، عند عتبة قاعة نادي الإصلاح؟",
  "لا يمكن وصف القلق الذي عاشه مجتمع لندن طوال ثلاثة أيام. أُرسلت برقيات إلى أمريكا وآسيا طلبًا لأخبار فوج، وأُوفد رسل إلى منزله في سافيل رو صباحًا ومساءً، لكن لا جديد. لم تعرف الشرطة ما آل إليه أمر المفتش فيكس الذي اتبع أثرًا زائفًا على نحو مؤسف. ومع ذلك ازدادت الرهانات عددًا وقيمة، وكان فوج يقترب من نقطة الحسم كحصان سباق. ولم تعد السندات تُسعّر بأقل من قيمتها بمئة، بل بعشرين ثم بعشرة وخمسة، حتى إن اللورد ألبرمارل المسن، المصاب بالشلل، راهن لصالحه.",
  "احتشد جمع غفير في بال مول والشوارع المجاورة مساء السبت؛ وبدا المكان كأن سماسرة البورصة اتخذوا من محيط نادي الإصلاح مقرًا دائمًا. تعطلت حركة المرور، واشتعلت المناقشات والمجادلات والمعاملات المالية في كل مكان. وعانى رجال الشرطة كثيرًا لإبقاء الحشد في الخلف، وكلما اقترب الموعد المنتظر ازداد التوتر حتى بلغ ذروته.",
  "اجتمع خصوم فيلياس فوج الخمسة في القاعة الكبرى للنادي: المصرفيان جون سوليفان وصموئيل فالنتين، والمهندس أندرو ستيوارت، وغوتييه رالف مدير بنك إنجلترا، وتوماس فلاناغان صانع الجعة؛ وكانوا جميعًا ينتظرون بقلق.",
  "حين أشارت الساعة إلى الثامنة وعشرين دقيقة، نهض أندرو ستيوارت وقال: «أيها السادة، لم يبقَ سوى عشرين دقيقة على انقضاء الموعد الذي اتفقنا عليه مع السيد فوج.»",
  "سأل توماس فلاناغان: «متى وصل آخر قطار من ليفربول؟»",
  "أجاب غوتييه رالف: «في السابعة وثلاث وعشرين دقيقة، أما القطار التالي فلن يصل قبل الثانية عشرة وعشر دقائق بعد منتصف الليل.»",
  "قال أندرو ستيوارت: «حسنًا أيها السادة، لو وصل السيد فوج بقطار السابعة وثلاث وعشرين دقيقة لكان قد وصل إلى هنا الآن. لذا يمكننا اعتبار الرهان محسومًا لصالحنا.»",
  "رد صموئيل فالنتين: «تمهّلوا، لا تتسرعوا. أنتم تعرفون غرابة أطوار السيد فوج. فدقته في المواعيد مشهورة؛ لا يأتي مبكرًا ولا متأخرًا، ولن أستغرب إن ظهر أمامنا في اللحظة الأخيرة.»",
  "قال أندرو ستيوارت متوترًا: «لو رأيته أمامي الآن، لما صدّقت أنه هو.»",
  "تابع توماس فلاناغان: «في الواقع، كانت خطة السيد فوج حمقاء إلى حد بعيد. مهما بلغت دقته، لا يستطيع منع التأخيرات الحتمية، وتأخير يومين أو ثلاثة كفيل بإفشال رحلته.»",
  "وأضاف جون سوليفان: «لاحظوا أيضًا أننا لم نتلقَّ منه أي خبر، مع أن خطوط التلغراف تمتد على طول الطريق الذي يسلكه.»",
  "قال أندرو ستيوارت: «لقد خسر، يا سادة؛ لقد خسر مئة مرة! ثم إن سفينة «تشاينا» — وهي الباخرة الوحيدة التي كان يمكنه ركوبها من نيويورك ليصل في الموعد — وصلت أمس. راجعت قائمة الركاب ولم أجد اسم فيلياس فوج فيها. وحتى لو افترضنا أن الحظ حالفه، فمن الصعب أن يكون قد بلغ أمريكا. أظنه سيتأخر عشرين يومًا على الأقل، وعندها سيخسر اللورد ألبرمارل خمسة آلاف كاملة.»",
  "قال غوتييه رالف: «الأمر واضح؛ لا يبقى لنا إلا تقديم شيك السيد فوج إلى مصرف بارينغز غدًا.»",
  "في تلك اللحظة كانت عقارب ساعة النادي تشير إلى الثامنة وأربعين دقيقة.",
  "قال أندرو ستيوارت: «خمس دقائق أخرى.»",
  "تبادل الرجال الخمسة النظرات. بلغ قلقهم حدًا شديدًا، لكنهم لم يرغبوا في إظهاره، فوافقوا بسهولة على اقتراح السيد فالنتين أن يلعبوا جولة أخرى من الورق.",
  "قال أندرو ستيوارت وهو يجلس: «لن أتنازل عن حصتي البالغة أربعة آلاف من الرهان مقابل ثلاثة آلاف وتسعمئة وتسعة وتسعين.»",
  "أشارت الساعة إلى الثامنة واثنتين وأربعين دقيقة.",
  "تناول اللاعبون أوراقهم، لكن أعينهم لم تفارق الساعة. ومع ذلك، لم تبدُ الدقائق أطول في حياتهم قط، مهما حاولوا إقناع أنفسهم بالطمأنينة.",
  "قال توماس فلاناغان وهو يقطع الأوراق التي ناوله إياها رالف: «بقيت سبع عشرة دقيقة على التاسعة.»",
  "ساد الصمت لحظة. كانت القاعة الكبرى هادئة تمامًا، لكن همهمات الحشد في الخارج كانت تتخللها صيحات حادة بين حين وآخر. وأخذ بندول الساعة يدق الثواني بانتظام رياضي، وكان كل لاعب يعدّها بشغف وهو يصغي.",
  "قال جون سوليفان بصوت فضح اضطرابه: «بقيت ست عشرة دقيقة على التاسعة!»",
  "لم يبقَ سوى دقيقة واحدة، وعندها يُحسم الرهان. أوقف أندرو ستيوارت ورفاقه اللعب، وتركوا أوراقهم وراحوا يعدّون الثواني.",
  "مرّت الثانية الأربعون دون شيء، ثم الخمسون، وما زال لا شيء.",
  "عند الثانية الخامسة والخمسين دوّى في الشارع صراخ عالٍ، أعقبته تصفيقات وهتافات ترحيب وزمجرات غاضبة.",
  "نهض اللاعبون من مقاعدهم.",
  "عند الثانية السابعة والخمسين انفتح باب القاعة، وقبل أن يدق البندول الثانية الستين ظهر فيلياس فوج، يتبعه حشد هائج اقتحم أبواب النادي. وقال بصوته الهادئ: «ها أنا ذا، أيها السادة!»"
];
const terms=[
  {
    "term": "bank robber",
    "literal": "سارق مصرف",
    "context": "the real bank robber",
    "note": "The person who actually committed the bank robbery",
    "type": "phrase"
  },
  {
    "term": "transpired",
    "literal": "تبيّن / اتّضح",
    "context": "when it transpired that",
    "note": "Became known or was revealed",
    "type": "word"
  },
  {
    "term": "pursuing his eccentric journey",
    "literal": "يواصل رحلته الغريبة",
    "context": "mathematically pursuing his eccentric journey round the world",
    "note": "Continuing an unusual, carefully timed trip",
    "type": "phrase"
  },
  {
    "term": "at a premium",
    "literal": "بسعر أعلى / بقيمة مرتفعة",
    "context": "at a premium on ’Change",
    "note": "Financially valued above the previous level",
    "type": "idiom"
  },
  {
    "term": "feverish suspense",
    "literal": "ترقّب محموم",
    "context": "in a state of feverish suspense",
    "note": "Intense anxious waiting",
    "type": "phrase"
  },
  {
    "term": "on the threshold",
    "literal": "عند عتبة",
    "context": "on the threshold of the Reform Club saloon",
    "note": "At the entrance or point of entering",
    "type": "phrase"
  },
  {
    "term": "false scent",
    "literal": "أثر زائف",
    "context": "followed up a false scent",
    "note": "A misleading clue, using a tracking metaphor",
    "type": "idiom"
  },
  {
    "term": "turning-point",
    "literal": "نقطة حاسمة",
    "context": "his last turning-point",
    "note": "The moment at which the outcome may change",
    "type": "phrase"
  },
  {
    "term": "financial transactions",
    "literal": "معاملات مالية",
    "context": "financial transactions were going on",
    "note": "Deals involving money or securities",
    "type": "phrase"
  },
  {
    "term": "antagonists",
    "literal": "خصوم",
    "context": "The five antagonists of Phileas Fogg",
    "note": "People on the opposing side of a contest",
    "type": "word"
  },
  {
    "term": "will have expired",
    "literal": "سيكون قد انقضى",
    "context": "the time agreed upon ... will have expired",
    "note": "A deadline or agreed period coming to an end",
    "type": "phrase"
  },
  {
    "term": "punctuality",
    "literal": "الالتزام بالمواعيد",
    "context": "His punctuality is well known",
    "note": "Being on time consistently",
    "type": "word"
  },
  {
    "term": "at the last minute",
    "literal": "في اللحظة الأخيرة",
    "context": "before us at the last minute",
    "note": "Just before the deadline",
    "type": "idiom"
  },
  {
    "term": "fatal to his tour",
    "literal": "كفيل بإفشال رحلته",
    "context": "would be fatal to his tour",
    "note": "Likely to cause the plan to fail",
    "type": "phrase"
  },
  {
    "term": "telegraphic lines",
    "literal": "خطوط التلغراف",
    "context": "there are telegraphic lines all along his route",
    "note": "Historical communication lines carrying telegrams",
    "type": "phrase"
  },
  {
    "term": "behindhand",
    "literal": "متأخرًا عن الموعد",
    "context": "at least twenty days behindhand",
    "note": "An older word meaning late or behind schedule",
    "type": "word"
  },
  {
    "term": "present Mr. Fogg’s cheque",
    "literal": "تقديم شيك السيد فوج",
    "context": "present Mr. Fogg’s cheque at Barings",
    "note": "Present a cheque to the bank for payment",
    "type": "phrase"
  },
  {
    "term": "twenty minutes to nine",
    "literal": "الثامنة وأربعون دقيقة",
    "context": "pointed to twenty minutes to nine",
    "note": "An older clock expression meaning 8:40",
    "type": "phrase"
  },
  {
    "term": "a rubber",
    "literal": "جولة لعب ورق",
    "context": "proposal of a rubber",
    "note": "A set or round of card games, not an elastic object",
    "type": "word"
  },
  {
    "term": "betray it",
    "literal": "يفضح ذلك",
    "context": "not wishing to betray it",
    "note": "To reveal a feeling that someone is trying to hide",
    "type": "phrase"
  },
  {
    "term": "pendulum",
    "literal": "بندول الساعة",
    "context": "The pendulum beat the seconds",
    "note": "A swinging part used to regulate a clock",
    "type": "word"
  },
  {
    "term": "at the fortieth second",
    "literal": "عند الثانية الأربعين",
    "context": "At the fortieth second, nothing",
    "note": "A precise point in the final minute",
    "type": "phrase"
  },
  {
    "term": "at the fifty-fifth",
    "literal": "عند الثانية الخامسة والخمسين",
    "context": "At the fifty-fifth, a loud cry was heard",
    "note": "The suspense peaks just before the deadline",
    "type": "phrase"
  },
  {
    "term": "forced their way",
    "literal": "شقّوا طريقهم بالقوة",
    "context": "who had forced their way through the club doors",
    "note": "Pushing through a barrier or crowd",
    "type": "phrase"
  },
  {
    "term": "Here I am, gentlemen!",
    "literal": "ها أنا ذا، أيها السادة!",
    "context": "Here I am, gentlemen!",
    "note": "A calm arrival announcement after a tense wait",
    "type": "phrase"
  },
  {
    "term": "on ’Change",
    "literal": "في البورصة",
    "context": "at a premium on ’Change",
    "note": "An old British expression for the stock exchange",
    "type": "phrase"
  }
];
const body=english.join(' ');
for(const t of terms)if(!body.toLowerCase().includes(t.term.toLowerCase()))throw Error('Towle XXXVI contextual glossary term absent: '+t.term);
if(english.length!==30||arabic.length!==english.length||arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXVI bilingual paragraph alignment mismatch');
s.chapters.push({title:'In which Phileas Fogg’s name is once more at a premium on ’Change.',titleAr:'الفصل السادس والثلاثون — حيث ترتفع قيمة اسم فيلياس فوج من جديد في البورصة',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXVI';
s.description='As London waits for one last train, the Reform Club counts down the final seconds.';
s.editorialStatus='English Chapters I–XXXVI source-transcribed; Arabic draft pending independent review; 36 of 37 chapters';
s.provenance+=' Chapter XXXVI: Standard Ebooks Towle transcription (source blob 04892fb62e2a79732e13ad18620a0d9ec8f98189; CC0 editorial edition; territory-specific rights pending review).';
})(window);
