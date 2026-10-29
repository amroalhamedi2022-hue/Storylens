# Lingua Tales — direct device feedback and acceptance, 2026-10-29

Source: user's 4 actual Android screenshots and 12 listed requirements; code verification against PR #1, not guesses based on prior Drive plans.

**Required identity:** user-facing brand must be Lingua Tales (no Preview in final delivery). Existing production Android application ID **com.storylens.reader** is intentionally retained to protect WebView app data. Future production updates need signing certificate matching the installed app and nondecreasing versionCode. Public APK and private keystore must never be conflated. Never delete existing app before exporting learning backup.

## Feedback triage

| Requirement | Code / PR1 implementation | What is NOT proven / remaining work |
|---|---|---|
| 1. No blue rectangular Android tap highlight; elastic liquid bubble feedback | `lt-product-polish.css`, `lt-tap-feedback.js`; CSS tap highlight disabled except accessible keyboard focus; one animation per primary pointer event | Actual 120Hz/pointer feedback on user's device NOT TESTED |
| 2. Hold real edge and fold paper dynamically instead of Next/Previous buttons | `reader-experience.js` pointerdown/move/up with rotation, edge-pull progress, threshold and RTL/text-selection/vertical-scroll gates; keyboard nav retained for accessibility | Genuine physical paper curvature (mesh curl) NOT IMPLEMENTED: current version uses CSS 3D rotation+shading; touch acceptance NOT TESTED |
| 3. Crowded homepage and redundant search | Hero reduced to compact Resume only; redundant marketing copy/orb/large searches removed from library surface; searches kept in drawer | Real Android viewport and readability NOT TESTED |
| 4. Heavy runtime/120Hz | Noninteractive card rendering deferred via content-visibility; expensive backdrop-filter removed from shelf cards; body fixed gradient converted to scroll, no continuous per-frame JS; pointer move batched by requestAnimationFrame | Measured FPS, CPU, RAM, startup, thermal on 120Hz phone/Pad 5 NOT TESTED |
| 5. Audio stops within one second, no SFX | New native `serveOfflineOgg()` supports HTTP 206 Range, correct audio/ogg MIME and bounded asset stream; Kotlin `OfflineOggByteRangeTest` covers malformed/suffix/open ranges; secondary synthesized settings collapsed | Actual audio focus/device playback/uninterrupted long audio NOT TESTED — do not certify fixed on physical Android without a long playback |
| 6/12. Prior requests remain binding | No changes to story English body, translations, offline dictionary, semantic bookmark, SRS, licenses, 37-chapter classic, adaptive icon/legacy backup. Full existing CI suite required. | Prior acceptance ledger LT-01..LT-13 / LT-R14/15 is still IN_PROGRESS; must not claim all passed |
| 8. Story headings not Arabic | Base reader renders original `chapter.title` regardless UI locale; Chromium fixtures for 36/37 now assert English headings even with Arabic UI | Verify on user's installed build |
| 9. Long press theme to delete/recolor | Long press opens editor with 3 color inputs, reversible **Hide theme** and **Restore hidden themes**, saved under theme-specific keys and portable backup | Physically deleting bundled theme resources is unsupported without rebuild; hide rather than irreversible asset deletion |
| 10. Liquid Glass 27 and customized colors | `theme-liquid-27` in production theme registry, CSS surfaces, persisted palette overrides, initial override applied on startup | Inspired visual system; pixel-for-pixel iOS proprietary design parity NOT ESTABLISHED; 120Hz display test open |
| 11. Many long adult suspense and detective stories | Existing catalog: 44 total entries at last count, full 37-chapter public-domain Towle novel (source and paired Arabic draft), 19 adult editorial/novella entries, offline dictionary and art | 120-story target and newly requested genuinely long original detective books NOT COMPLETE; literary Arabic review and international copyright review NOT TESTED |
| Icon / naming | User's original `Lingua Tales: Blooming Knowledge.png` located on Drive, uploaded as immutable PNG to `res/drawable-nodpi/lingua_tales_approved.png`; adaptive icon foreground uses a centered image safe zone. Logo includes book+petals and LINGUA TALES text. English product name in UI/Android label. | Confirm full legibility of tiny wordmark and mask on real launcher; actual signed non-preview Release NOT PRODUCED |
| Non-preview update | Existing stable signing secrets optional; exact APK identity/report, backup compatibility diagnostic implemented | Without original installed signer or new permanent stable key, Android prevents true in-place upgrade; a one-time backup/uninstall/restore may be required. Do not issue ephemeral Preview as final. |

## Gate

Latest already-proven CI *before this batch* was https://github.com/amroalhamedi2022-hue/Storylens/actions/runs/40927895163 at SHA 523822c9. Subsequent exact-HEAD run for the final UX+icon+audio bundle must pass all content, Node, Gradle, Android resource and full Chromium journeys before calling this batch CI PASS. Initial new runs failed only because obsolete acceptance expected Arabic headings and old duplicate expanded audio panels; those tests were updated according to user's new requirements. **Physical device, final signed release, 120Hz metric and 120-story scope remain open.**

Never merge main, publish a public release, use paid services, add microphone/TTS, or expose private keystores without explicit authorization. 
