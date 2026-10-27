#!/usr/bin/env python3
"""Source contract for playback-only Android audio focus; no device/audio claim."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
activity = (root / "app/src/main/java/com/storylens/reader/MainActivity.kt").read_text(encoding="utf-8")
audio = (root / "app/src/main/assets/lingua-ambience.js").read_text(encoding="utf-8")
manifest = (root / "app/src/main/AndroidManifest.xml").read_text(encoding="utf-8")

assert 'addJavascriptInterface(ReaderAudioFocusBridge(), "LinguaTalesAudioFocus")' in activity
assert "AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)" in activity
assert "AUDIOFOCUS_REQUEST_GRANTED" in activity
assert "abandonAudioFocusRequest" in activity and "abandonAudioFocus(readerAudioFocusListener)" in activity
assert "window.LinguaAmbience.onNativeAudioFocusLoss" in activity
assert "window.LinguaAmbience.pauseFromNative" in activity
assert "override fun onPause()" in activity and "abandonReaderAudioFocus()" in activity
assert "requestNativeAudioFocus()" in audio and "releaseNativeAudioFocus()" in audio
assert "function onNativeAudioFocusLoss()" in audio and "function pauseFromNative()" in audio
assert "if(!requestNativeAudioFocus())return false" in audio
assert "if(needsFocus&&!requestNativeAudioFocus())return" in audio
assert "RECORD_AUDIO" not in manifest and "android.permission.INTERNET" not in manifest
print("PASS: Android audio focus gates optional ambience/SFX, pauses on loss/background, and adds no microphone/network permission.")
print("NOT TESTED: physical Android audio focus, interruptions, acoustic quality, battery and Xiaomi Pad 5.")
