# StoryLens — Execution Plan / خطة التطوير

Updated: 2026-10-22 · Source of truth: `main` · Target: Android / Xiaomi Pad 5 and phones

## Product invariants
- Adult, professionally edited illustrated fiction. Six genres: mystery/crime, sci-fi, psychological thriller, historical fiction, contemporary drama, literary horror.
- Never add voice, audio, text-to-speech, speech recognition or microphone permission.
- **Fullscreen distraction-free reader** is deliberately simpler than the library; no glowing bubbles behind reading text.
- Tap a word or longest matching multi-word expression; display **standalone Arabic meaning vs sense in this exact sentence** clearly differentiated.
- Natural Arabic sentence/chapter translation, offline reading/saves/reviews. No fabricated dictionary meanings.
- Long-range content target: **20 substantial stories per genre (120 total)**, quality-gated. Story count is NOT a proxy for literary quality.
- Visual reference supplied by user: *Liquid Aurora* dark cobalt/violet/cyan + *Aqua Glass* light mint/cyan, with glass cards, animated bubbles and gradients.

## Execution phases and acceptance gates

### P0 — Baseline audit and recoverable CI
- [x] Repo reachable with admin/write permission
- [x] Android GitHub Actions prior build success (2026-10-22); existing index is a WebView-based reader
- [x] Root cause of missing-meaning message located in `wordSheet`
- [ ] Establish automated baseline count of unique story words / inflected forms / missing glosses; document CI outcomes

### P1 — Contextual vocabulary: functional blocker
- [ ] No generic 'not yet in preview' modal for a tapped word
- [ ] Resolve idioms before words; handle common irregulars, plurals, contractions and possessives
- [ ] Expand legally reusable offline English→Arabic dictionary with source + license tracking, accurate sense labeling
- [ ] Each word tap gives a useful standalone meaning and natural sentence translation; when dictionary sense is unknown, show an **honest differentiated context view**, not invented equivalence
- [ ] Test common words, uncommon words, idioms, proper names, inflections, same surface with two meanings
- [ ] Save/review preserves exact phrase, context and translation; no data loss after app updates

### P2 — Full redesign (not a reskin)
- [ ] Library: Liquid Aurora dark + Aqua Glass light theme variants, editorial hero, category carousels, real progress and saved-story cards
- [ ] Animations: soft gradient drift, floating bubbles, staggered card entrance, pressed feedback, elegant sheet transitions; respect Reduce Motion
- [ ] Style system: typography, tokens, contrast, adaptive tablet/phone layouts, minimum 44dp touch targets
- [ ] Reader: fullscreen paper/dark page, clean typography and invisible controls until tapped; optional chapter art only when wanted
- [ ] Word sheet: translucent glass around content, not over reading text

### P3 — Story pipeline and library quality
- [ ] Genre-specific editorial guide and age-appropriate writing standard
- [ ] Each story: arc, stakes, coherent ending, natural prose, all paragraphs translated, phrase annotations and curated visuals
- [ ] Genre-based content batches, reviewed with duplicate checks and passage-length checks
- [ ] 20 approved per genre (120), no filler, no copied copyrighted novels without a license

### P4 — Learning & offline infrastructure
- [ ] Smart vocabulary review and writing-use prompts, no audio
- [ ] Reading streaks *optional* and not manipulative; sentence-level translations, highlights, bookmarks, reading progress
- [ ] Efficient asset loading, on-disk offline data; robust Android back navigation, accessibility, backup

### P5 — QA and release
- [ ] GitHub Actions: unit/static/content checks, APK, artifact retention
- [ ] UI tests on phone + 11-inch tablet and Android device install check
- [ ] Offline/airplane mode, cold launch, navigation, file permissions, keyboard, low-memory, rotation, system back, saved-state regression
- [ ] Performance & contrast on realistic device; release APK only after evidence is recorded

## Progress protocol
Each progress update must include (a) change/files or commit ID; (b) tests truly run and results; (c) risks/blockers; (d) exact next gate. No 'verified APK' claim based solely on source validation. Do not conceal partial work.
