#!/usr/bin/env python3
"""Only genuine full-colour Met 16th-century Kalila folios; STAGING ONLY.

No Android assets are touched. Validate Arabic story passages, Met accession,
native colour, full folio and bounded WebP. Fail closed before saving files.
No synthetic repainting and no web requests at runtime.
"""
import hashlib
import io
import json
import pathlib
import urllib.request
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
BOOK = ROOT / "docs/literature/staging/kalila-arabic-wikisource"
TEXT = BOOK / "kalila.md"
OUTPUT = BOOK / "art"
MANIFEST = BOOK / "COLOR_FOLIOS.json"
WORKS = [
    {
        "id": "met-kalila-fox-and-drum-16c",
        "objectID": 453083, "accession": "1981.373.29",
        "title": "The Fox and the Drum",
        "titleAr": "الثعلب والطبل",
        "file": "kalila-fox-drum-met-453083.webp",
        "sourceUrl": "https://images.metmuseum.org/CRDImages/is/original/sf1981-373-29b.jpg",
        "catalogueUrl": "https://www.metmuseum.org/art/collection/search/453083",
        "sourceAnchor": "زعموا أن ثعلباً أتى أجمةً فيها طبل معلق على شجرةٍ",
        "altAr": "ثعلب بني بجوار طبل مخطط تحت الأشجار، في مخطوطة مصورة ملوّنة.",
        "altEn": "Original coloured manuscript: fox beside a striped drum under flowering trees.",
    },
    {
        "id": "met-kalila-lion-receives-shanzabeh-16c",
        "objectID": 453084, "accession": "1981.373.30",
        "title": "The Lion King Receives the Ox, Shanzabeh, Escorted by Dimna",
        "titleAr": "الأسد يستقبل الثور شتربة برفقة دمنة",
        "file": "kalila-lion-ox-met-453084.webp",
        "sourceUrl": "https://images.metmuseum.org/CRDImages/is/original/sf1981-373-30b.jpg",
        "catalogueUrl": "https://www.metmuseum.org/art/collection/search/453084",
        "sourceAnchor": "ثم أقبل والثور معه، حتى دخلا على الأسد فأحسن الأسد إلى الثور وقرّبه",
        "altAr": "لوحة ملوّنة من مخطوطة كليلة ودمنة: أسد وثور وابن آوى دمنة بين أشجار مزهرة.",
        "altEn": "Original coloured manuscript: lion welcomes Shanzabeh the ox with Dimna the jackal.",
    },
]

def fetch_jpeg(work):
    request = urllib.request.Request(work["sourceUrl"], headers={
        "User-Agent": "LinguaTalesLiteratureArchive/1.0 (https://github.com/amroalhamedi2022-hue/Storylens; non-commercial period-art preservation)",
        "Accept": "image/jpeg",
    })
    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read(14_000_001)
        content_type = response.headers.get_content_type()
    if content_type not in ("image/jpeg", "image/jpg") or not (50_000 < len(raw) <= 14_000_000):
        raise ValueError("Unexpected upstream MIME/size; no substitution: " + work["id"])
    if raw[:2] != b"\xff\xd8":
        raise ValueError("Met original does not contain JPEG bytes")
    return raw

def convert(work, raw):
    image = ImageOps.exif_transpose(Image.open(io.BytesIO(raw)))
    if image.format not in (None, "JPEG") or image.width < 550 or image.height < 700:
        raise ValueError("Unexpected source geometry for " + work["id"])
    image = image.convert("RGB")
    # Fail closed if this is actually a grayscale scan painted by CSS,
    # or the wrong image. Test pigmentation directly on decoded pixels.
    sample = image.resize((72, 96), Image.Resampling.BOX)
    pixels = list(sample.getdata())
    colourful = sum((max(rgb) - min(rgb) >= 28) for rgb in pixels) / len(pixels)
    if colourful < 0.10:
        raise ValueError(f"Original image not sufficiently coloured: {work['id']} ({colourful:.3f})")
    if image.width > 760:
        image = image.resize((760, round(image.height * 760 / image.width)),
                             Image.Resampling.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=73, method=6)
    packed = buffer.getvalue()
    if packed[:4] != b"RIFF" or packed[8:12] != b"WEBP" or len(packed) > 450_000:
        raise ValueError("Bad WebP/compression size; no crop permitted")
    record = {key: value for key, value in work.items() if key != "sourceAnchor"}
    record.update(
        sourceTextAnchor=work["sourceAnchor"],
        sourceBookText="docs/literature/staging/kalila-arabic-wikisource/kalila.md",
        imageManuscript="Second quarter of 16th century, India (Gujarat attribution), possibly based on Egyptian model",
        textRecension="Different Arabic Wikisource-derived source edition; narrative correspondence ONLY",
        rights="Metropolitan Museum of Art Public Domain / Open Access; review country-specific distribution",
        credit="The Metropolitan Museum of Art, Alice and Nasli Heeramaneck Collection, Gift of Alice Heeramaneck, 1981",
        visualTreatment="original-colour", alteration="resize and WEBP encoding only; full original scan uncropped",
        sourceSha256=hashlib.sha256(raw).hexdigest(),
        webpSha256=hashlib.sha256(packed).hexdigest(),
        webpBytes=len(packed), width=image.width, height=image.height,
        sourceColourfulPixelFraction=round(colourful, 5),
        sceneVerifiedInStagedArabic=True, contextualEnglishComplete=False,
        reviewRequired=True, stagingOnly=True, packagedInApk=False
    )
    return record, packed

def main():
    if MANIFEST.exists():
        raise ValueError("Already imported: never overwrite or duplicate genuine source files")
    source = TEXT.read_text(encoding="utf-8")
    for work in WORKS:
        if source.count(work["sourceAnchor"]) != 1:
            raise ValueError("Exact source scene missing/duplicated: " + work["id"])
        if (OUTPUT / work["file"]).exists():
            raise ValueError("Refusing to overwrite staged archival file")
    # Atomic archive: verify BOTH original source downloads before any files.
    verified = [convert(work, fetch_jpeg(work)) for work in WORKS]
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for record, data in verified:
        (OUTPUT / record["file"]).write_bytes(data)
        print("STAGED authentic COLOUR folio",record["file"],record["webpBytes"],
              "color pixel fraction",record["sourceColourfulPixelFraction"],flush=True)
    MANIFEST.write_text(json.dumps({
        "schemaVersion":1, "source":"The Metropolitan Museum of Art Open Access",
        "releaseApproved":False, "completeEnglishTranslation":False,
        "productionAppAssetCount":0, "images": [item for item, _ in verified]
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("PASS: 2 authentic colour folios staged only; NOTHING placed inside Android APK",flush=True)

if __name__ == "__main__":
    main()
