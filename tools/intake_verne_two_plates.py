#!/usr/bin/env python3
"""One-time offline originals intake, pinned to individually reviewed 1873 scans.
Do not run during Android CI, and never substitute fabricated modern artwork.
Only write binaries after source checksum and precise prose placement checks.
"""
import hashlib
import io
import json
import pathlib
import re
import urllib.request
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
ASSETS = ROOT / "app/src/main/assets/art"
MANIFEST = ROOT / "docs/literature/HISTORIC_VERNES_ASSETS.json"
BATCH = [
    {
        "id": "verne-1873-fix-on-watch",
        "file": "verne-fix-watch-1873.webp",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Around_the_world_in_eighty_days_%281873%29_%2814597588318%29.jpg",
        "commons": "https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14597588318).jpg",
        "expected_sha1": "71d831d5522d1f69ee8622624e314c14e93e9ad7",
        "year": 1873,
        "chapter": 5,
        "afterParagraph": 25,
        "scene": "Detective Fix on watch for suspicious travellers; Towle VI, Suez surveillance paragraph index 25",
        "needle": "Fix took up a position, and carefully examined each face and figure",
        "max_width": 620,
    },
    {
        "id": "verne-1873-passepartout-train",
        "file": "verne-passepartout-train-1873.webp",
        "url": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Around_the_world_in_eighty_days_%281873%29_%2814597621668%29.jpg",
        "commons": "https://commons.wikimedia.org/wiki/File:Around_the_world_in_eighty_days_(1873)_(14597621668).jpg",
        "expected_sha1": "5fcdad5b0975f4b29254ae4e355a74655388c669",
        "year": 1873,
        "chapter": 28,
        "afterParagraph": 64,
        "scene": "Passepartout suspended by one hand between the baggage-car and locomotive tender; Towle XXIX, source paragraph index 64",
        "needle": "There, suspended by one hand between the baggage-car and the tender",
        "max_width": 620,
    },
]

def source_english(row):
    filename = ROOT / "app/src/main/assets" / f"classic-verne-towle-ch{row['chapter']+1:02d}.js"
    content = filename.read_text(encoding="utf-8")
    if row["chapter"] == 5:
        snippets = re.findall(r'"en":\s*"((?:\\.|[^"\\])*)"', content)
    else:
        original = content.split("const english=[", 1)[1].split("];", 1)[0]
        snippets = re.findall(r'^\s*"((?:\\.|[^"\\])*)",?\s*$', original, flags=re.M)
    assert len(snippets) > row["afterParagraph"], f"missing original paragraph in {filename}"
    assert row["needle"] in snippets[row["afterParagraph"]], (
        f"Wrong chapter or image scene anchor for {row['file']}; abstain from bundling"
    )

def convert(row):
    request = urllib.request.Request(
        row["url"], headers={"User-Agent": "LinguaTalesPeriodArtwork/1.0 (https://github.com/amroalhamedi2022-hue/Storylens; archival-source-integrity)"}
    )
    with urllib.request.urlopen(request, timeout=45) as response:
        assert response.headers.get_content_type() == "image/jpeg"
        source = response.read(7_000_001)
    assert 800_000 < len(source) <= 7_000_000, "unexpected original source size"
    assert hashlib.sha1(source).hexdigest() == row["expected_sha1"], (
        f"Wikimedia original bytes no longer match independent archive metadata: {row['file']}"
    )
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(source)))
    assert image.width >= 900 and image.height >= 900
    image = image.convert("RGB")
    if image.width > row["max_width"]:
        image = image.resize(
            (row["max_width"], round(image.height * row["max_width"] / image.width)),
            Image.Resampling.LANCZOS,
        )
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=62, method=6)
    packed = buffer.getvalue()
    assert packed[:4] == b"RIFF" and packed[8:12] == b"WEBP"
    assert len(packed) < 270000, "phone image too big; lower quality deliberately"
    fields = {k: v for k, v in row.items() if k not in {"needle", "max_width"}}
    fields.update(
        source_sha256=hashlib.sha256(source).hexdigest(),
        webp_sha256=hashlib.sha256(packed).hexdigest(),
        webp_bytes=len(packed),
        width=image.width,
        height=image.height,
        rights="1873 Boston/Osgood print; individual Commons scan says No known copyright restrictions; geographic release review still required",
    )
    return fields, packed

def main():
    current = json.loads(MANIFEST.read_text(encoding="utf-8"))
    existing = {entry["file"] for entry in current}
    assert len(current) == 7 and len(existing) == 7, (
        "One-time intake already applied or manifest changed: do not overwrite existing archived files"
    )
    assert all(entry["file"] not in existing and not (ASSETS / entry["file"]).exists() for entry in BATCH)
    for row in BATCH:
        source_english(row)
    verified = [convert(row) for row in BATCH]
    ASSETS.mkdir(parents=True, exist_ok=True)
    for record, binary in verified:
        (ASSETS / record["file"]).write_bytes(binary)
        print(f"VERIFIED {record['file']} {record['webp_bytes']} bytes  {record['width']}×{record['height']}", flush=True)
    MANIFEST.write_text(json.dumps(current + [record for record, _ in verified],
                                        indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("PASS: 2 new originals checked against Commons and authentic Towle prose; not yet exposed until scene-mapping tests pass", flush=True)

if __name__ == "__main__":
    main()
