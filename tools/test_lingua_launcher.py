#!/usr/bin/env python3
"""Source-level LT-01/LT-04 gate. Device launcher masks and upgrade remain NOT TESTED."""
from pathlib import Path
from xml.etree import ElementTree as ET
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "app/src/main/res"
ANDROID = "{http://schemas.android.com/apk/res/android}"

def xml(path):
    return ET.parse(path).getroot()

manifest = xml(ROOT / "app/src/main/AndroidManifest.xml")
app = manifest.find("application")
assert app is not None
assert app.get(ANDROID + "label") == "${ltAppLabel}"
assert app.get(ANDROID + "icon") == "@mipmap/ic_launcher"
assert app.get(ANDROID + "roundIcon") == "@mipmap/ic_launcher"
assert manifest.findall("uses-permission") == [], "reader must remain fully offline"

adaptive = xml(RES / "mipmap-anydpi-v26/ic_launcher.xml")
assert adaptive.tag == "adaptive-icon"
refs = {"background": "lingua_icon_background", "foreground": "lingua_icon_foreground",
        "monochrome": "lingua_icon_monochrome"}
for tag, name in refs.items():
    child = adaptive.find(tag)
    assert child is not None and child.get(ANDROID + "drawable") == "@drawable/" + name
    assert (RES / "drawable" / (name + ".xml")).is_file()

background = xml(RES / "drawable/lingua_icon_background.xml")
gradient = background.find("gradient")
assert gradient is not None
for color in ("startColor", "centerColor", "endColor"):
    assert re.fullmatch(r"#[0-9A-Fa-f]{6}", gradient.get(ANDROID + color, ""))

foreground = xml(RES / "drawable/lingua_icon_foreground.xml")
assert foreground.tag == "layer-list", "approved icon should be image-backed and scaled"
icon_item = foreground.find("item")
assert icon_item is not None and icon_item.get(ANDROID+"gravity") == "center"
assert icon_item.get(ANDROID+"width") == "72dp"
assert icon_item.get(ANDROID+"height") == "72dp"
bitmap = icon_item.find("bitmap")
assert bitmap is not None and bitmap.get(ANDROID+"src") == "@drawable/lingua_tales_approved"
approved = RES / "drawable-nodpi/lingua_tales_approved.png"
assert approved.is_file(), "approved Lingua Tales reference artwork must be packaged"
data = approved.read_bytes()
assert data[:8] == b"\x89PNG\r\n\x1a\n", "approved icon must be a real PNG"
assert len(data) >= 120000, "do not replace approved 3D icon with placeholder artwork"

for name in ("lingua_icon_monochrome",):
    vector = xml(RES / "drawable" / (name + ".xml"))
    assert vector.tag == "vector"
    assert vector.get(ANDROID + "viewportWidth") == "108"
    assert vector.get(ANDROID + "viewportHeight") == "108"
    paths = vector.findall("path")
    assert len(paths) >= 5
    for path in paths:
        data = path.get(ANDROID + "pathData")
        assert data and data.startswith("M")
        # All actual shape coordinates are in the 108x108 viewport.
        # Adaptive clipping/safe-zone appearance still requires Android testing.
        assert not re.search(r"https?://", data)
    assert any(("54,42" in p.get(ANDROID + "pathData", "") or "54,43" in p.get(ANDROID + "pathData", "")) for p in paths), "open-book/petal center anchor is present"

html = (ROOT / "app/src/main/assets/index.html").read_text(encoding="utf-8")
assert '"displayName":"Lingua Tales"' in html
assert '>LINGUA TALES</div>' in html
assert '>STORYLENS</div>' not in html
assert "storylens_" in html, "legacy localStorage keys must not be renamed"
gradle = (ROOT / "app/build.gradle.kts").read_text(encoding="utf-8")
assert 'applicationId = "com.storylens.reader"' in gradle, "upgrade identity must be preserved"
assert 'applicationIdSuffix = ".preview"' in gradle, "CI preview must not collide with production install"
previewBlock = gradle.split('debug {', 1)[1].split('release {', 1)[0]
assert 'if (hasLtStableSigning) signingConfig = signingConfigs.getByName("stableRelease")' in previewBlock, "preview must use stable signing when configured"
assert 'manifestPlaceholders["ltAppLabel"] = "Lingua Tales Preview"' in gradle
i18n = (ROOT / "app/src/main/assets/lingua-i18n.js").read_text(encoding="utf-8")
assert "const metrics = find('.storylens-hero .hero-metrics');" in i18n
assert "if (metrics) metrics.remove();" in i18n
assert "each('.storylens-hero .hero-metrics span'" not in i18n, "stale hard-coded marketing counters must not return"
subprocess.run(["node", str(ROOT / "tools/hero-declutter.test.cjs")], cwd=ROOT, check=True)
print("PASS Lingua Tales LT-01/04/05: adaptive icon, brand, offline identity and content-first hero")
