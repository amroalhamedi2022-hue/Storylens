# Lingua Tales — 60-scene autonomous visual production contract

## Status (13 November 2026)
This is **a real committed queue runner and source-validation pipeline**, not 60 images already made. No extra images have been generated/approved for release by this work.

- Canonical queue: `docs/art-generation/production-queue-60.json` — **60** unique numbered slots.
- Source verified from the actual book and bilingual source: **8** scenes in Verne chapters I–VI. Of those, **7** are ready as *source-grounded prompts* but **NOT ready for unrestricted image generation** without identity references and reliable prompt binding; one already has a separate prior unapproved draft image to review.
- **52** slots are reserved for source verification and/or actual section segmentation. A slot is not a scene and is not counted as a picture.
- State: `docs/art-generation/production-run-state.json` — persists prior failures and status.
- **Seventh source-verified environment scene:** `verne-007` (Chapter V, paragraph zero-based 8), a police commissioner receiving a telegraphic dispatch in his London office. This scene has no recurring named protagonist in frame; its text-grounded image request can be dry-run with `node tools/generate_story_art_openai.cjs --queue-scenes --scene verne-ch05-color-telegram-arrives`. Its source prompt must NOT be replaced by a scene from a different chapter, and the scene is not yet generated or release-approved.
- **Eighth source-verified environment scene:** `verne-008` (Chapter VI, paragraph zero-based 13), the lively Suez quay before the steamship arrives, grounded in the exact original English paragraph and Arabic companion. No recurring named protagonists in frame. It remains an ungenerated review-queue task, not approved for distribution.
- Character descriptions: `docs/art-generation/character-bibles/verne-main-cast-v1.json` — source-grounded **text only**, not an approved visual character sheet.
- CI: `.github/workflows/story-art-queue-60.yml` — tests queue integrity, source proof and no-cost behavior. It **does not** generate images.
- Entrypoint: `node tools/story_art_queue_60.cjs`. Does not alter APK, app store, original historical artwork, book text or certificates.

## Every hourly task run
1. Fetch the latest `main` and ensure no current competing PR/task is modifying these queue paths. Do not use stale SHA or regenerate a scene with an existing review file.
2. Run or inspect `node tools/story_art_queue_60.cjs --check`, then `--next`. These only check bounded queue state and genuine bilingual Verne excerpt hashes; they are not a paid image request.
3. If `--next` returns `ready:true`, **only** attempt that verified `queueId` / scene. Use its exact `prompt`, scene ID and approved identity/reference files; never let a model pick a generic adjacent scene. No train station in the Saville Row clock scene; no Mumbai/Bombay scene; do not change identity or mix chapters. Use single scene, colored Victorian engraving/book painting style, no labels.
4. If a **real** generation tool with scene-bound prompts and approved reference files is available, generate a single scene and visually cross-check the image against exact source passage. Convert to a real high-resolution WebP, record image SHA256 and a scene-specific `*.review.json` descriptor; write to `docs/art-generation/review/<bookId>/<sceneId>.webp` before running `--record <queueId> <relative-WebP>`. Keep `ownerImageApproved:false`, `releaseApproved:false`. Candidate != integrated.
5. If generation fails, record `node tools/story_art_queue_60.cjs --reject <queueId> <UPPERCASE_REASON>` on a writable checkout and sync state with GitHub. No more than one intelligent retry. Two bad images from 12 Nov (Bombay/London train stations for ch02 clock scene) are **rejected and never usable** as reference material.
6. When source verification of the remaining 53 unverified slots can be performed from exact app assets and documented chapter segmentation without inventing material, expand them **in the queue** with original source text and reviewed chapter/paragraph anchors. Test changes and commit on latest main or existing suitable branch without overwriting work. Do not equate arbitrary paragraph extraction with a legitimate narrative scene.
7. Never publish or set release approved from a generated model's judgment; packager/reader approval requires existing owner/editorial/rights and QA gates. Do not modify UI, reader pagination, signing, database or app internet behavior. No automatic paid API calls or secrets without express approved budget; existing image API adapter remains protected by both paid flags.

## Commands (on checkout)
```bash
node tools/prepare_color_scene_queue.cjs --check
node tools/test_story_art_queue_60.cjs
node tools/story_art_queue_60.cjs --check
node tools/story_art_queue_60.cjs --next
# Inspect output and review only after actual image file is produced:
node tools/story_art_queue_60.cjs --record verne-002 docs/art-generation/review/around-the-world-in-eighty-days-towle/verne-ch01-color-new-servant.webp
# Rejections are safe to persist:
node tools/story_art_queue_60.cjs --reject verne-003 SCENE_MISMATCH
```

**Paid image API is disabled by default.** `--produce` refuses paid generation unless `STORY_ART_AUTOGEN_APPROVED=yes`, `STORY_ART_PAID_IMAGE_LIMIT=1`, `OPENAI_API_KEY` and permitted reference manifest are present. Do not set these without explicit account authorization. Any ChatGPT image generation tool must also be able to bind exact prompts; otherwise report `SCENE_PROMPT_NOT_BOUND`, not fake pictures.

## Integrity / reporting
Five independent counters must remain distinct: number of planned slots, verified source briefs, real candidate image binaries + exact SHA, editorial/rights approved assets, reader-integrated assets. Never claim an image was produced from a script/dry-run/CI PASS. Report only substantive changes and actionable blockers, without asking the user to rewrite any prompt or managing the process.
