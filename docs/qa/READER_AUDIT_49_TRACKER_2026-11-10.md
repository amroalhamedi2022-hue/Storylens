# Lingua Tales — 49-issue reader and UI verification tracker (2026-11-10)

> **Scope:** A *visual/functional* defect ledger, NOT a cybersecurity assessment. Based on the user's 03:25.7 screen capture and source snapshot from 2026-11-09, reconciled with GitHub **main `ec026268aa1`** on 2026-11-10. The captured APK version was not proven identical to this SHA. **Source-code patches are NOT physical-device acceptance.** Nothing in this branch replaces genuine literature or releases unapproved artwork.

## Latest verified upstream before starting

- PR #67, **CHG-05 already MERGED** on main (`68974e426e`): one gallery/history per tap, quarantines broken approved image for a session, short-landscape rails and independent Chromium viewport QA. **Do not duplicate.**
- Main Android Actions [42775000177](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42775000177) passed on CHG-05 merged code. Earlier [42773890630](https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/42773890630) failed in Wen Glass gesture browser smoke on an older PR branch; this is **not** proof that the latest main Android CI fails.
- Original content ownership stays in separate literature stream. 288 chapter-art source candidates at prior report; **0** editorial+territorial approvals and **0** packaged approved chapter thumbnails. Recheck source audit before release.
- Live Android phone/Xiaomi Pad 5 display, actual 120Hz fluidity, signing/key compatibility, production APK acceptance remain untested in this change-set.

## Current new work (branch `fix/reader-integrity-49-audit-20261110`)

1. **Reader integration:** chapter heading + chapter counter moved from a permanently separate frame into first *actual HTML sheet*. Measured and fallback pagination reserve height; source paragraph IDs, dictionary DOM, bookmarks and original texts unchanged. Landscape announces the two physical pages, not a false single number.
2. **Physical mesh ink:** ensure `under` and `back` never reference the same paragraph/DOM page; portrait forward curls display the real next page as verso while the subsequent page is the distinct under-sheet; at chapter boundaries the placeholder remains incomplete pending a full real preview. Preserve genuinely distinct faces for tablet spreads. Reduce artificial borders/seam shading and clamp contact shadow.
3. **Reading shell:** reader-control contrast uses real paper ink/background; in true landscape spread the cover and persistent toolbar hide; blank-paper tap/keyboard focus temporarily exposes both the genuine Back/Settings toolbar and the navigation bar (no removal of accessible controls).
4. **Chapter gallery:** non-selectable tiles and heading to suppress Android selection handles; search/select inputs retain normal selection/editing.
5. **Tests:** expand real production helper VM test `tools/measured-reader-pages.test.cjs` to verify title-aware pagination, actual `getTurn()` results in portrait/spread and styling guards. All tests must pass on the **exact PR SHA** before merge.

## Status definitions

- **CODE FIXED:** correction written and statically asserted, *not* device-accepted until visual test.
- **MITIGATED / PARTIAL:** narrowed a root cause, but user-visible problem may recur.
- **OPEN:** not changed; no invented completion.

## Full 49 findings (preserved IDs; nothing silently dropped)

| ID | Priority | Finding | Current status |
|---:|:---:|---|---|
| 01 | P0 | الطي على صندوق النص لا الورقة بكاملها | PARTIAL · أصبح العنوان الحقيقي داخل الصفحة الأولى؛ إطار القارئ الخارجي ما زال مستقلًا |
| 02 | P0 | لوح طي رأسي ضيق | OPEN · لم ينفذ إصلاح |
| 03 | P0 | إسفين مثلث حاد | OPEN · لم ينفذ إصلاح |
| 04 | P1 | حواف بين الشرائح | MITIGATED · أزلنا حدود البطاقات عن شرائح الطي؛ يجب تصوير حركة فعلية |
| 05 | P1 | انفصال ظل الثنية | MITIGATED · قُيّد ظل التماس ضمن الورقة |
| 06 | P1 | الطي العكسي كقطعة منفصلة | OPEN · لم ينفذ إصلاح |
| 07 | P0 | حبر مكرر على الورقة والخلفية | MITIGATED · لا يُنسخ نفس محتوى under إلى verso في الوضع الفردي |
| 08 | P0 | تداخل ثلاث طبقات | PARTIAL · قلّلنا الطبقات النصية المكررة، لكن هندسة الطي ما زالت تحتاج إعادة اختبار |
| 09 | P1 | قص الكلمات عند الحافة | OPEN · لم ينفذ إصلاح |
| 10 | P1 | فراغ مستطيل أثناء التقليب | OPEN · لم ينفذ إصلاح |
| 11 | P1 | منظور الحبر الخلفي غير منتظم | OPEN · لم ينفذ إصلاح |
| 12 | P1 | منطقة اللمس لا تشمل كل الورقة | OPEN · لم ينفذ إصلاح |
| 13 | P1 | معاينة الفصل التالي ناقصة | OPEN · لم ينفذ إصلاح |
| 14 | P1 | تكرار DOM بكلفة عالية | OPEN · لم ينفذ إصلاح |
| 15 | P2 | اختلاف خامة وجه الطية | MITIGATED · أزلنا خطوط الشرائح والحبر الشبح |
| 16 | P0 | صفحات شبه فارغة | OPEN · لم ينفذ إصلاح |
| 17 | P0 | تجزئة على حدود الفقرة فقط | OPEN · لم ينفذ إصلاح |
| 18 | P1 | فقرة تتجاوز الورقة | OPEN · لم ينفذ إصلاح |
| 19 | P0 | قص عنوان الفصل في الانتقال | PARTIAL · نقل العنوان داخل الصفحة الأولى؛ اختبار القفز بعد التدوير مطلوب |
| 20 | P1 | قفزة رأسية للعنوان | PARTIAL · ينزل العنوان مع الصفحة الأولى بدل الإطار |
| 21 | P1 | العنوان ثابت فوق كل صفحة | CODE FIXED · العنوان داخل الورقة الأولى فقط |
| 22 | P1 | حجم المتن صغير | OPEN · لم ينفذ إصلاح |
| 23 | P1 | تباين أزرار القراءة ضعيف | CODE FIXED · ألوان تحكم بحدود ونص واضحين بالنسبة إلى خامة الورق |
| 24 | P1 | شريط تحكم دائم تحت الورق | PARTIAL · في الوضع الأفقي فقط: إخفاء دائم واستدعاء اختياري |
| 25 | P2 | إطار مزدوج غير طبيعي | OPEN · لم ينفذ إصلاح |
| 26 | P2 | ترقيم صفحتين غير واضح | CODE FIXED · إعلان المدى للصفحتين معًا |
| 27 | P0 | قص عنوان الوضع الأفقي | PARTIAL · عنوان الفصل داخل الورقة الأولى، ويجب اختبار عرض 700–1280 |
| 28 | P1 | صفحتان غير متوازنتين | OPEN · لم ينفذ إصلاح |
| 29 | P1 | أزرار دائمة في الوضع الأفقي | CODE FIXED · أدوات التحكم تختفي وتظهر بنقرة على الحاشية أو Focus |
| 30 | P1 | تداخل الطية مع مفصل الكتاب | OPEN · لم ينفذ إصلاح |
| 31 | P1 | قص أسفل الورقة اليمنى | OPEN · لم ينفذ إصلاح |
| 32 | P2 | العنوان منفصل عن الورقتين | OPEN · لم ينفذ إصلاح |
| 33 | P1 | تداخل شريط نظام Android | OPEN · لم ينفذ إصلاح |
| 34 | P1 | اختبار ثبات الموضع بعد التدوير | OPEN · لم ينفذ إصلاح |
| 35 | P0 | تحديد نص بطاقة الفصل | CODE FIXED · منع تحديد النص على بطاقة الفصل |
| 36 | P1 | قائمة نسخ/مشاركة في بطاقة الفصل | CODE FIXED · منع تحديد نص الفهرس مع الإبقاء على حقل البحث قابلًا للتحرير |
| 37 | P1 | صور فصول غير معتمدة/غائبة | OPEN · لم ينفذ إصلاح |
| 38 | P2 | فراغ واسع في معرض الفصول | OPEN · لم ينفذ إصلاح |
| 39 | P2 | بطاقات فصل صغيرة | OPEN · لم ينفذ إصلاح |
| 40 | P2 | قص حافة بطاقات التمرير | OPEN · لم ينفذ إصلاح |
| 41 | P1 | صور تاريخية داخل صفحات ناقصة | OPEN · لم ينفذ إصلاح |
| 42 | P1 | المكتبة الظاهرة قليلة | OPEN · لم ينفذ إصلاح |
| 43 | P2 | فراغات المكتبة الرئيسية | OPEN · لم ينفذ إصلاح |
| 44 | P2 | قائمة جانبية مزدحمة | OPEN · لم ينفذ إصلاح |
| 45 | P1 | تسميات الإعدادات مزدحمة | CODE FIXED · Grid يفصل النصوص عن محددات الخيارات |
| 46 | P2 | قص مجموعات الإعدادات | CODE FIXED · ورقة إعدادات قابلة للتمرير مع تذييل متاح |
| 47 | P2 | حجم الخط والخيارات | PARTIAL · تحسين التفاف العناوين ومناطق التفاعل |
| 48 | P2 | وميض شاشة فاتحة عند فتح التطبيق | OPEN · لم ينفذ إصلاح |
| 49 | P2 | تفاوت تباين الثيمات | OPEN · لم ينفذ إصلاح |

### Outstanding critical follow-up

- **P0 #2–3, #8 and P1 #9–11:** genuine sheet deformation, correct continuous geometry/material, proper front/back masking and curved ink placement require a physical HTML curl redesign and 0%, 25%, 50%, 75%, 100% slow-motion screenshots; border removal alone isn't a new paper physics engine.
- **P0 #16–17 and P1 #18:** current pagination still keeps each paragraph/illustration intact. **Line-level splitting with dictionary token semantics, translations, images and stable paragraph anchors has NOT been implemented**. Prevent truncation and wasted sheets in a dedicated evidence-driven batch.
- **#12–14:** outer-paper edge hit testing, accurate full next-chapter paper preview and 22-facet DOM performance on real device require targeted regression and performance QA.
- **#33–34:** Android insets and rotation loop must be tested on actual hardware; do not mistake video letterboxing for an app bug. Width-triggered semantic reader reflow already exists on main, so no duplicate resize listener added.
- **#37, #41, #42:** photo and book availability depend on independently cleared content; never turn an archived candidate into a shipped thumbnail without rights/editorial approval.
- **#38–49:** settings overlap/scroll (#45–47) now code-patched. Remaining library, content and theme acceptance still OPEN pending real device screens.

### Release gates (all must be verified)

- PR-specific Node tests; full Android and Chromium jobs on exact SHA; screenshot QA for portrait phone and real tablet portrait/landscape; gesture cancellation/fast turns/RTL/LTR; reader data backup and semantic anchors; accessibility focus/contrast; sign with *existing* owner certificate (never build unsigned and present as update). No APK shipped by this branch.
