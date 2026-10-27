/* Lingua Tales — authentic Towle Chapter XXXVII from the pinned Standard Ebooks transcription.
 * Upstream commit: 56c82e97ff5d4f8950afca05b71af72688a8da34; source blob: d6b1761b77004e1b00db04837c7b88f006b78c4d; src/epub/text/chapter-37.xhtml.
 * Standard Ebooks editorial contributions are CC0; Towle's 1873 translation is treated as public domain in the USA.
 * Territory-specific redistribution clearance and independent Arabic literary review remain NOT TESTED.
 * 41 narrative paragraphs / 947 English words; normalized English SHA-256: 868ef0d51c18834255f7ca9aa79af2d18fb5f86809579880302753ff75056409.
 */
(function(g){'use strict';
const s=(g.StoryLensEditorialStories||[]).find(x=>x.id==='around-the-world-in-eighty-days-towle');
if(!s||s.chapters.length!==36)throw Error('Towle chapter XXXVII load order mismatch');
const english=[
  "Yes; Phileas Fogg in person.",
  "The reader will remember that at five minutes past eight in the evening—about five and twenty hours after the arrival of the travellers in London—Passepartout had been sent by his master to engage the services of the Reverend Samuel Wilson in a certain marriage ceremony, which was to take place the next day.",
  "Passepartout went on his errand enchanted. He soon reached the clergyman’s house, but found him not at home. Passepartout waited a good twenty minutes, and when he left the reverend gentleman, it was thirty-five minutes past eight. But in what a state he was! With his hair in disorder, and without his hat, he ran along the street as never man was seen to run before, overturning passersby, rushing over the sidewalk like a waterspout.",
  "In three minutes he was in Saville Row again, and staggered back into Mr. Fogg’s room.",
  "He could not speak.",
  "“What is the matter?” asked Mr. Fogg.",
  "“My master!” gasped Passepartout—“marriage—impossible—”",
  "“Impossible?”",
  "“Impossible—for tomorrow.”",
  "“Why so?”",
  "“Because tomorrow—is Sunday!”",
  "“Monday,” replied Mr. Fogg.",
  "“No—today is Saturday.”",
  "“Saturday? Impossible!”",
  "“Yes, yes, yes, yes!” cried Passepartout. “You have made a mistake of one day! We arrived twenty-four hours ahead of time; but there are only ten minutes left!”",
  "Passepartout had seized his master by the collar, and was dragging him along with irresistible force.",
  "Phileas Fogg, thus kidnapped, without having time to think, left his house, jumped into a cab, promised a hundred pounds to the cabman, and, having run over two dogs and overturned five carriages, reached the Reform Club.",
  "The clock indicated a quarter before nine when he appeared in the great saloon.",
  "Phileas Fogg had accomplished the journey round the world in eighty days!",
  "Phileas Fogg had won his wager of twenty thousand pounds!",
  "How was it that a man so exact and fastidious could have made this error of a day? How came he to think that he had arrived in London on Saturday, the twenty-first day of December, when it was really Friday, the twentieth, the seventy-ninth day only from his departure?",
  "The cause of the error is very simple.",
  "Phileas Fogg had, without suspecting it, gained one day on his journey, and this merely because he had travelled constantly eastward; he would, on the contrary, have lost a day had he gone in the opposite direction, that is, westward.",
  "In journeying eastward he had gone towards the sun, and the days therefore diminished for him as many times four minutes as he crossed degrees in this direction. There are three hundred and sixty degrees on the circumference of the earth; and these three hundred and sixty degrees, multiplied by four minutes, gives precisely twenty-four hours—that is, the day unconsciously gained. In other words, while Phileas Fogg, going eastward, saw the sun pass the meridian eighty times, his friends in London only saw it pass the meridian seventy-nine times. This is why they awaited him at the Reform Club on Saturday, and not Sunday, as Mr. Fogg thought.",
  "And Passepartout’s famous family watch, which had always kept London time, would have betrayed this fact, if it had marked the days as well as the hours and the minutes!",
  "Phileas Fogg, then, had won the twenty thousand pounds; but, as he had spent nearly nineteen thousand on the way, the pecuniary gain was small. His object was, however, to be victorious, and not to win money. He divided the one thousand pounds that remained between Passepartout and the unfortunate Fix, against whom he cherished no grudge. He deducted, however, from Passepartout’s share the cost of the gas which had burned in his room for nineteen hundred and twenty hours, for the sake of regularity.",
  "That evening, Mr. Fogg, as tranquil and phlegmatic as ever, said to Aouda: “Is our marriage still agreeable to you?”",
  "“Mr. Fogg,” replied she, “it is for me to ask that question. You were ruined, but now you are rich again.”",
  "“Pardon me, madam; my fortune belongs to you. If you had not suggested our marriage, my servant would not have gone to the Reverend Samuel Wilson’s, I should not have been apprised of my error, and—”",
  "“Dear Mr. Fogg!” said the young woman.",
  "“Dear Aouda!” replied Phileas Fogg.",
  "It need not be said that the marriage took place forty-eight hours after, and that Passepartout, glowing and dazzling, gave the bride away. Had he not saved her, and was he not entitled to this honour?",
  "The next day, as soon as it was light, Passepartout rapped vigorously at his master’s door. Mr. Fogg opened it, and asked, “What’s the matter, Passepartout?”",
  "“What is it, sir? Why, I’ve just this instant found out—”",
  "“What?”",
  "“That we might have made the tour of the world in only seventy-eight days.”",
  "“No doubt,” returned Mr. Fogg, “by not crossing India. But if I had not crossed India, I should not have saved Aouda; she would not have been my wife, and—”",
  "Mr. Fogg quietly shut the door.",
  "Phileas Fogg had won his wager, and had made his journey around the world in eighty days. To do this he had employed every means of conveyance—steamers, railways, carriages, yachts, trading-vessels, sledges, elephants. The eccentric gentleman had throughout displayed all his marvellous qualities of coolness and exactitude. But what then? What had he really gained by all this trouble? What had he brought back from this long and weary journey?",
  "Nothing, say you? Perhaps so; nothing but a charming woman, who, strange as it may appear, made him the happiest of men!",
  "Truly, would you not for less than that make the tour around the world?"
];
const arabic=[
  "نعم، كان فيلياس فوج نفسه.",
  "يتذكر القارئ أنه في الخامسة وثلاث دقائق بعد الثامنة مساءً—أي بعد نحو خمس وعشرين ساعة من وصول المسافرين إلى لندن—أرسل فوج خادمه لاستدعاء القس صموئيل ويلسون لإتمام مراسم زواج مقررة في اليوم التالي.",
  "انطلق باسبارتو في مهمته فرحًا. وصل سريعًا إلى منزل القس، لكنه لم يجده. انتظر نحو عشرين دقيقة، وحين غادر منزل رجل الدين كانت الساعة الثامنة وخمسًا وثلاثين دقيقة. لكن أي هيئة كان عليها! شعره أشعث، ومن دون قبعته، اندفع في الشارع بسرعة لم يُرَ مثلها من قبل، يطيح بالمارة ويجتاح الرصيف كالشلال الدافق.",
  "وبعد ثلاث دقائق عاد إلى شارع سافيل رو، وترنّح داخل غرفة السيد فوج.",
  "لم يستطع الكلام.",
  "«ما الأمر؟» سأل السيد فوج.",
  "«سيدي!» شهق باسبارتو، «الزواج—مستحيل—»",
  "«مستحيل؟»",
  "«مستحيل—غدًا.»",
  "«ولماذا؟»",
  "«لأن غدًا—الأحد!»",
  "«الاثنين»، أجاب فوج.",
  "«لا—اليوم السبت.»",
  "«السبت؟ مستحيل!»",
  "«نعم، نعم، نعم، نعم!» صاح باسبارتو. «لقد أخطأت يومًا كاملًا! وصلنا قبل الموعد بأربع وعشرين ساعة، ولم يبقَ الآن سوى عشر دقائق!»",
  "أمسك باسبارتو سيده من ياقة معطفه، وأخذ يجرّه بقوة لا تُقاوم.",
  "خرج فيلياس فوج، وكأنه اختُطف، من منزله من دون أن تتاح له فرصة للتفكير؛ فقفز إلى عربة أجرة، ووعد سائقها بمئة جنيه، وبعد أن دهس كلبين وقلب خمس عربات، وصل إلى نادي الإصلاح.",
  "كانت الساعة تشير إلى التاسعة إلا ربعًا حين ظهر في الصالون الكبير.",
  "لقد أتم فيلياس فوج رحلته حول العالم في ثمانين يومًا!",
  "لقد ربح فيلياس فوج رهانه البالغ عشرين ألف جنيه!",
  "كيف يمكن لرجل شديد الدقة والتأنق أن يخطئ في حساب يوم؟ وكيف ظن أنه وصل لندن يوم السبت، الحادي والعشرين من ديسمبر، بينما كان في الحقيقة يوم الجمعة، العشرين، أي اليوم التاسع والسبعين فقط منذ انطلاقه؟",
  "سبب الخطأ بسيط للغاية.",
  "لقد كسب فيلياس فوج، من دون أن يدري، يومًا خلال رحلته، وذلك لأنه سافر باستمرار نحو الشرق؛ أما لو سار في الاتجاه المعاكس، أي نحو الغرب، لخسر يومًا.",
  "أثناء سفره شرقًا، كان يتجه نحو الشمس، ولذلك كانت الأيام تقصر لديه أربع دقائق عن كل درجة يعبرها في هذا الاتجاه. ومحيط الأرض 360 درجة؛ وضرب هذه الدرجات في أربع دقائق يعطي أربعًا وعشرين ساعة بالضبط—أي اليوم الذي كسبه من دون أن ينتبه. بعبارة أخرى، رأى فوج الشمس تعبر خط الزوال ثمانين مرة، بينما لم يرها أصدقاؤه في لندن تعبره إلا تسعًا وسبعين مرة. لذلك انتظروه في نادي الإصلاح يوم السبت، لا الأحد كما اعتقد.",
  "وكانت ساعة باسبارتو العائلية الشهيرة، التي ظلت تضبط الوقت على توقيت لندن، ستكشف الحقيقة لو أنها سجّلت الأيام إلى جانب الساعات والدقائق!",
  "وهكذا ربح فوج عشرين ألف جنيه، لكنه أنفق في الطريق ما يقارب تسعة عشر ألفًا، فلم يكن مكسبه المالي كبيرًا. غير أن هدفه كان الفوز لا جمع المال. فقسّم الألف جنيه المتبقية بين باسبارتو والمفتش فيكس، الذي لم يعد يحمل له ضغينة. لكنه خصم من حصة باسبارتو تكلفة الغاز الذي ظل مضاءً في غرفته ألفًا وتسعمئة وعشرين ساعة، حفاظًا على النظام.",
  "في ذلك المساء، سأل السيد فوج أودا، هادئًا وبارد الأعصاب كعادته: «ألا يزال زواجنا يرضيكِ؟»",
  "أجابت: «سيدي فوج، بل أنا من يجب أن يسأل هذا السؤال. لقد كنت مفلسًا، لكنك الآن عدت غنيًا.»",
  "قال: «اعذريني يا سيدتي؛ ثروتي لكِ. فلولا اقتراحكِ الزواج، لما ذهب خادمي إلى القس صموئيل ويلسون، ولما عرفت خطئي، و—»",
  "قالت الشابة: «عزيزي السيد فوج!»",
  "أجاب فيلياس فوج: «عزيزتي أودا!»",
  "ولا حاجة إلى القول إن الزواج تم بعد ثمانٍ وأربعين ساعة، وإن باسبارتو، متألقًا ومبتهجًا، سلّم العروس إلى عريسها. ألم يكن هو من أنقذها، وألم يكن جديرًا بهذا الشرف؟",
  "في اليوم التالي، وما إن أضاء الفجر، حتى طرق باسبارتو باب سيده بقوة. فتح السيد فوج وسأله: «ما الأمر يا باسبارتو؟»",
  "«ما الأمر يا سيدي؟ لقد اكتشفت للتو—»",
  "«ماذا؟»",
  "«أننا كنا نستطيع الدوران حول العالم في ثمانية وسبعين يومًا فقط.»",
  "«بلا شك»، أجاب فوج، «لو لم نعبر الهند. لكن لو لم أعبر الهند لما أنقذت أودا؛ ولما أصبحت زوجتي، و—»",
  "أغلق السيد فوج الباب بهدوء.",
  "كان فيلياس فوج قد ربح رهانه وأتم رحلته حول العالم في ثمانين يومًا. ولتحقيق ذلك استخدم كل وسائل النقل: البواخر والسكك الحديدية والعربات واليخوت والسفن التجارية والزلاجات والفيلة. وقد أظهر هذا الرجل الغريب طوال الرحلة صفاته المدهشة من رباطة الجأش والدقة. لكن ماذا بعد؟ ماذا جنى حقًا من كل هذا العناء؟ وماذا عاد به من رحلته الطويلة الشاقة؟",
  "لا شيء، تقول؟ ربما؛ لا شيء سوى امرأة فاتنة جعلته، على نحو قد يبدو غريبًا، أسعد الرجال!",
  "أليس من أجل ذلك وحده تستحق رحلة كهذه حول العالم؟"
];
const terms=[
  {
    "term": "enchanted",
    "literal": "مبتهج / مسحور بالفرح",
    "context": "went on his errand enchanted",
    "note": "Very happy or delighted; here it describes Passepartout’s eager mood.",
    "type": "word"
  },
  {
    "term": "like a waterspout",
    "literal": "كدوّامة ماء نافورة",
    "context": "like a waterspout",
    "note": "A vivid comparison for a forceful, rushing movement.",
    "type": "idiom"
  },
  {
    "term": "staggered back",
    "literal": "عاد مترنحًا",
    "context": "staggered back into Mr. Fogg’s room",
    "note": "Returned unsteadily, as if exhausted or shocked.",
    "type": "phrase"
  },
  {
    "term": "gasped",
    "literal": "لهث / قال بصعوبة",
    "context": "gasped Passepartout",
    "note": "Spoke while struggling to breathe.",
    "type": "word"
  },
  {
    "term": "ahead of time",
    "literal": "قبل الموعد",
    "context": "twenty-four hours ahead of time",
    "note": "Earlier than the expected time or deadline.",
    "type": "phrase"
  },
  {
    "term": "seized his master by the collar",
    "literal": "أمسك سيده من ياقة معطفه",
    "context": "seized his master by the collar",
    "note": "Grabbed the clothing at the neck to pull someone along.",
    "type": "phrase"
  },
  {
    "term": "irresistible force",
    "literal": "قوة لا تُقاوم",
    "context": "with irresistible force",
    "note": "Power that cannot reasonably be resisted.",
    "type": "phrase"
  },
  {
    "term": "quarter before nine",
    "literal": "التاسعة إلا ربعًا",
    "context": "a quarter before nine",
    "note": "A time expression meaning 8:45.",
    "type": "phrase"
  },
  {
    "term": "wager",
    "literal": "رهان",
    "context": "won his wager of twenty thousand pounds",
    "note": "An agreement to risk money on an outcome.",
    "type": "word"
  },
  {
    "term": "exact and fastidious",
    "literal": "دقيق وشديد الاعتناء بالتفاصيل",
    "context": "a man so exact and fastidious",
    "note": "Extremely precise and particular about details.",
    "type": "phrase"
  },
  {
    "term": "gained one day",
    "literal": "كسب يومًا",
    "context": "gained one day on his journey",
    "note": "Ended up one calendar day ahead due to travelling eastward.",
    "type": "phrase"
  },
  {
    "term": "opposite direction",
    "literal": "الاتجاه المعاكس",
    "context": "in the opposite direction",
    "note": "The reverse direction; here, travelling westward.",
    "type": "phrase"
  },
  {
    "term": "circumference",
    "literal": "محيط",
    "context": "circumference of the earth",
    "note": "The distance around a circle or spherical body.",
    "type": "word"
  },
  {
    "term": "meridian",
    "literal": "خط الزوال",
    "context": "pass the meridian eighty times",
    "note": "The apparent north–south line crossed by the sun at local noon.",
    "type": "word"
  },
  {
    "term": "betrayed this fact",
    "literal": "كشفت هذه الحقيقة",
    "context": "would have betrayed this fact",
    "note": "Would have revealed information unintentionally.",
    "type": "phrase"
  },
  {
    "term": "pecuniary gain",
    "literal": "مكسب مالي",
    "context": "the pecuniary gain was small",
    "note": "A financial profit or benefit.",
    "type": "phrase"
  },
  {
    "term": "cherished no grudge",
    "literal": "لم يضمر أي حقد",
    "context": "against whom he cherished no grudge",
    "note": "Did not continue to feel resentment against someone.",
    "type": "phrase"
  },
  {
    "term": "for the sake of regularity",
    "literal": "حفاظًا على الانتظام",
    "context": "for the sake of regularity",
    "note": "To preserve a routine or consistent order.",
    "type": "phrase"
  },
  {
    "term": "phlegmatic",
    "literal": "هادئ بارد الأعصاب",
    "context": "tranquil and phlegmatic as ever",
    "note": "Calm and not easily excited, especially under pressure.",
    "type": "word"
  },
  {
    "term": "ruined",
    "literal": "مفلس / خسر ثروته",
    "context": "You were ruined, but now you are rich again",
    "note": "Financially destroyed or left without money.",
    "type": "word"
  },
  {
    "term": "apprised of my error",
    "literal": "أُبلغت بخطئي",
    "context": "apprised of my error",
    "note": "Informed or made aware of a mistake.",
    "type": "phrase"
  },
  {
    "term": "gave the bride away",
    "literal": "سلّم العروس إلى عريسها",
    "context": "gave the bride away",
    "note": "A traditional wedding role, usually performed by a close relative or escort.",
    "type": "phrase"
  },
  {
    "term": "rapped vigorously",
    "literal": "طرق بقوة",
    "context": "rapped vigorously at his master’s door",
    "note": "Knocked sharply and energetically.",
    "type": "phrase"
  },
  {
    "term": "seventy-eight days",
    "literal": "ثمانية وسبعون يومًا",
    "context": "in only seventy-eight days",
    "note": "The counterfactual shorter route Fogg could have taken.",
    "type": "phrase"
  },
  {
    "term": "eccentric gentleman",
    "literal": "الرجل الغريب الأطوار",
    "context": "The eccentric gentleman had throughout displayed",
    "note": "A person whose behaviour differs from conventional expectations.",
    "type": "phrase"
  },
  {
    "term": "coolness and exactitude",
    "literal": "رباطة الجأش والدقة",
    "context": "qualities of coolness and exactitude",
    "note": "Calm under pressure and careful precision.",
    "type": "phrase"
  },
  {
    "term": "nothing but a charming woman",
    "literal": "لا شيء سوى امرأة فاتنة",
    "context": "nothing but a charming woman",
    "note": "A rhetorical phrase that reframes the journey’s true reward.",
    "type": "phrase"
  },
  {
    "term": "happiest of men",
    "literal": "أسعد الرجال",
    "context": "made him the happiest of men",
    "note": "A superlative expression for profound happiness.",
    "type": "phrase"
  },
  {
    "term": "for less than that",
    "literal": "من أجل ما هو أقل من ذلك",
    "context": "would you not for less than that make the tour around the world",
    "note": "A rhetorical question implying the reward is worth a great deal.",
    "type": "phrase"
  }
];
const body=english.join(' ');
for(const t of terms)if(!body.toLowerCase().includes(t.term.toLowerCase()))throw Error('Towle XXXVII contextual glossary term absent: '+t.term);
if(english.length!==41||arabic.length!==english.length||arabic.some(t=>!/[ء-ي]/.test(t)))throw Error('Towle XXXVII bilingual paragraph alignment mismatch');
s.chapters.push({title:"In which it is shown that Phileas Fogg gained nothing by his tour around the world, unless it were happiness.",titleAr:'الفصل السابع والثلاثون — حيث يتبيّن أن فيلياس فوج لم يربح من رحلته حول العالم سوى السعادة',paragraphs:english.map((en,i)=>({en,ar:arabic[i]}))});
s.terms.push(...terms);s.totalChapters=37;
s.subtitle='The original Towle translation — Chapters I–XXXVII';
s.description='The final minutes reveal what the journey was truly worth.';
s.editorialStatus='English Chapters I–XXXVII source-transcribed; Arabic draft pending independent review; 37 of 37 chapters';
s.provenance+=' Chapter XXXVII: Standard Ebooks Towle transcription (source blob d6b1761b77004e1b00db04837c7b88f006b78c4d; CC0 editorial edition; territory-specific rights pending review).';
})(window);
