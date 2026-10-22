# StoryLens — Live progress ledger

Last checkpoint: 2026-10-22

## Verified source of truth
- Private repository: https://github.com/amroalhamedi2022-hue/Storylens
- Passing workflow on `main`: https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/39742665492
- Current passing commit: `114cf679291e16d8bf5827c17a61bdff8af675e0`
- APK artifact: `StoryLens-Debug-APK` attached to that workflow run. **Compiled, not device-tested.**

## Actual changes completed this round
- Execution plan established in `docs/EXECUTION_PLAN.md` (`1fa77f8`)
- Added supplemental curated English-Arabic lexicon with 296 headwords, lemma and name handling (`cb76436`)
- Added `liquid-aurora.css`, with 3 switchable styles, library glass cards and subtle gradients/bubbles; reading surface stays still and matte, reduced-motion supported (`eb0cce3`)
- Wired visual themes and supplemental word resolver in `index.html`. Replaced the obsolete blanket 'missing dictionary entry' modal with an honest context view on any remaining unknown word (`abe81a2`)
- New `tools/lexicon.test.cjs` checks glosses, inflection, proper names, anti-hallucination fallback, story integrity, CSS themes and old-message regression (`24aac7c`)
- GitHub Actions now runs these checks before compiling APK (`114cf67`)

## Latest workflow results (observed from workflow logs)
- Python catalog validation: PASS
- Script syntax checks: PASS
- New lexicon and visual regression test: PASS
- Gradle Android unit tests and assembleDebug: PASS
- APK artifact upload: PASS
- **Catalog:** 6 genres, 24 stories, 66 chapters, 418 paired English/Arabic paragraphs, 66 chapter illustrations
- **Vocabulary:** 761 existing unique dictionary/story terms; 296 new curated supplemental headwords, including 214 newly covered surface forms among 1,622 raw story word forms
- No claim of full coverage: many words need editorial senses or a licensed bilingual dictionary.

## Outstanding — ordered
1. P1: Integrate broad, licensed EN→AR offline dictionary and word-sense matching; add automated full tap coverage report and true sense-in-context QA. Any unknown must be transparently marked, never guessed.
2. P2: Inspect actual screenshot, Android WebView rendering, motion/performance, and reading legibility at smartphone and tablet dimensions; bring aesthetics closer to user reference.
3. P3: Expand from 24 to 120 **approved** adult stories across six genres; stronger length, arc, character consistency and original illustrations.
4. P4: Extend vocabulary usage exercises, navigation, bookmarks and review/recovery tests.
5. P5: Install and manually exercise APK on physical Android, review offline behavior + accessibility + rotation + process restore + crashes before a polished release.

## Reporting protocol
At each meaningful checkpoint include file/commit, actual tests and evidence, remaining blockers, next deliverable. Don't equate passing CI with design approval or device QA. No audio, microphone or speech features, ever.
