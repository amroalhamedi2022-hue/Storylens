# StoryLens 📖

An offline-first, visual English reading app for adult learners. Focus: compelling illustrated stories, vocabulary in context, idioms, meaning-first Arabic translations, and spaced review. **No audio features, microphone or speech permissions.**

## Current status

Android app source is being migrated from the existing v0.2 package into this private repository. A successful APK build and on-device verification are required before considering it release-ready.

## Non-negotiable design requirements

- Distraction-free fullscreen reading, day/night paper themes, adjustable type.
- Tap English words and expressions for meaning in context vs standalone meaning.
- Human-quality Arabic translation by sentence and full chapter/story.
- Adult mystery, science fiction, psychological thriller, historical fiction, contemporary drama, literary horror.
- Offline reading, saves and review. No audio, speech or microphone.
- Goal: 20 curated stories per genre, not filler.

## Building

CI workflow in `.github/workflows/android.yml` will run content checks, unit tests and assemble an APK. Do not label APK as verified until it is uploaded by a successful Actions run.
