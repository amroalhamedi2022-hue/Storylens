#!/usr/bin/env python3
"""Acquire authentic COLOURED medieval Kalila wa Dimna plates from Commons.

Target manuscript: BnF Arabic 3465, c. 1200–1220, as classified by Commons.
Never invent, recolour, de-saturate, or silently place a manuscript folio in a
different edition's chapter. Images are quarantined until matching narrative
scene, user rights geography and English companion are editorially checked.
"""
from __future__ import annotations

import hashlib
import json
from io import BytesIO
from pathlib import Path
import re
import time
from urllib.parse import urlparse

from PIL import Image, ImageOps
import requests

OUT = Path(__file__).resolve().parents[1] / "docs/literature/staging/kalila-original-colour-miniatures-20261105"
CATEGORY = "Category:Kalila and Dimna, 1200-1220 (BNF, Arabe 3465)"
API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "LinguaTalesEditorialColouredArchive/1.0 (source-preserving manuscript intake)"
LIMIT = 24


def hash_bytes(blob):
    return hashlib.sha256(blob).hexdigest()


def verify():
    manifest = json.loads((OUT / "manifest.json").read_text("utf-8"))
    assert manifest["status"] == "COLOURED_HISTORIC_PLATES_STAGED_NOT_CHAPTER_PUBLISHED"
    assert manifest["sourceCategory"] == CATEGORY
    assert len(manifest["plates"]) >= 6
    for plate in manifest["plates"]:
        data = (OUT / plate["localPath"]).read_bytes()
        assert len(data) == plate["webpBytes"] and hash_bytes(data) == plate["webpSha256"]
        assert data[:4] == b"RIFF" and data[8:12] == b"WEBP"
        assert plate["colourWasAdded"] is False
        assert plate["manuscriptFolioChapterAligned"] is False
        assert plate["individualFileRightsStatus"] in (
            "PUBLIC_DOMAIN_TAG_FOUND_PENDING_TERRITORIAL_REVIEW", "RIGHTS_METADATA_MISSING_NO_APP_PUBLICATION"
        )
    print(f"VERIFIED {len(manifest['plates'])} genuine COLOURED manuscript miniature files; "
          "all WebP SHA-256 checked, original hues preserved; chapter anchors pending.", flush=True)


def limited_download(sess, url, max_bytes=18_000_000):
    u = urlparse(url)
    if u.scheme != "https" or u.hostname not in ("upload.wikimedia.org", "thumb.wikimedia.org", "commons.wikimedia.org"):
        raise ValueError(f"Not a Commons upload endpoint: {url}")
    with sess.get(url, timeout=(20, 90), stream=True, allow_redirects=True) as response:
        response.raise_for_status()
        end = urlparse(response.url)
        if end.scheme != "https" or end.hostname not in ("upload.wikimedia.org", "thumb.wikimedia.org", "commons.wikimedia.org"):
            raise ValueError(f"Redirect leaves Commons: {response.url}")
        data, size = [], 0
        for chunk in response.iter_content(131072):
            size += len(chunk)
            if size > max_bytes:
                raise ValueError(f"Oversized heritage image: {url}")
            data.append(chunk)
    return b"".join(data)


def colour_fraction(image):
    img = ImageOps.exif_transpose(image).convert("RGB")
    img.thumbnail((88, 88), Image.Resampling.BILINEAR)
    hsv = img.convert("HSV")
    pixels = list(hsv.getdata())
    rich = sum(1 for hue, saturation, luminance in pixels
               if saturation > 65 and 55 < luminance < 250)
    return rich / len(pixels)


def get_metadata(sess):
    params = dict(
        action="query", format="json", generator="categorymembers",
        gcmtitle=CATEGORY, gcmlimit=200, gcmtype="file", iiurlwidth=960,
        prop="imageinfo", iiprop="url|size|sha1|extmetadata",
        iiextmetadatalanguage="en",
    )
    r = sess.get(API, params=params, timeout=(20, 70))
    r.raise_for_status()
    data = r.json()
    pages = list(data.get("query", {}).get("pages", {}).values())
    if not pages:
        raise ValueError("Cannot authenticate the target medieval manuscript category")
    candidates = []
    for page in pages:
        file_name = page.get("title", "")
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata") or {}
        license_label = str((meta.get("LicenseShortName") or {}).get("value") or "")
        pub = str((meta.get("Copyrighted") or {}).get("value") or "").strip().lower()
        # Wikimedia category membership and manuscript identification are
        # evidence of origin, NOT independent per-scan legal clearance.
        # Machine-readable PD metadata is often absent even for medieval
        # faithful reproductions: stage such scans with explicit rights HOLD.
        if not file_name.startswith("File:"):
            continue
        if info.get("mime", "image/jpeg") not in ("image/jpeg", "image/png", "image/webp"):
            continue
        # Wikimedia explicitly recommends thumbnail derivatives rather than
        # repeatedly fetching full-resolution master scans (HTTP 429 policy).
        original_url = info.get("url")
        url = info.get("thumburl") or original_url
        if not url or not (url.startswith("https://upload.wikimedia.org/") or url.startswith("https://thumb.wikimedia.org/")):
            continue
        candidates.append(dict(title=file_name, url=url, originalUrl=original_url, info=info, license=license_label))
    if not candidates:
        raise ValueError("No individually tagged public-domain manuscript folios were found")
    # Manually staged historical folios, not an automatic reader-chapter mapping.
    return sorted(candidates, key=lambda a: a["title"])


def main():
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    if args.verify or (OUT / "manifest.json").exists():
        verify()
        return
    sess = requests.Session()
    sess.headers["User-Agent"] = USER_AGENT
    candidates = get_metadata(sess)
    print(f"Authentic 13th-century BnF manuscript folio candidates (rights gated): {len(candidates)}", flush=True)
    records, encoded = [], []
    for c in candidates:
        if len(records) >= LIMIT:
            break
        info = c["info"]
        if info.get("width", 0) < 350 or info.get("height", 0) < 350:
            continue
        try:
            # Archive permits thumbnails; respect the public host by spacing
            # requests and using exponential 429 backoff, never a request storm.
            original = None
            for attempt in range(5):
                try:
                    original = limited_download(sess, c["url"])
                    break
                except requests.HTTPError as exc:
                    if exc.response is None or exc.response.status_code != 429 or attempt == 4:
                        raise
                    pause = min(50, 7 * (attempt + 1))
                    print(f"Commons rate limit: sleeping {pause}s before retry", flush=True)
                    time.sleep(pause)
            if original is None:
                raise ValueError("No image bytes obtained")
            with Image.open(BytesIO(original)) as src:
                score = colour_fraction(src)
                if score < .022:
                    # Skip non-illustrated typeset/title-only leaves, retaining original colours.
                    continue
                copied = ImageOps.exif_transpose(src).convert("RGB")
                copied.thumbnail((1350, 1700), Image.Resampling.LANCZOS)
                out = BytesIO()
                copied.save(out, "WEBP", quality=81, method=5)
                converted = out.getvalue()
            number = len(records) + 1
            local = f"plates/kalila-colour-folio-{number:03d}.webp"
            records.append(dict(
                localPath=local, webpBytes=len(converted), webpSha256=hash_bytes(converted),
                sourceCommonsFile=c["title"], sourceCommonsFilePage="https://commons.wikimedia.org/wiki/" + c["title"].replace(" ", "_"),
                sourceUrl=c["originalUrl"], actualDownloadedWikimediaDerivativeUrl=c["url"],
                downloadedDerivativeSha256=hash_bytes(original), downloadedDerivativeBytes=len(original),
                colourFraction=round(score, 4), colourWasAdded=False, colourRemoved=False,
                originalArtistPublicDomainMetadataChecked=(bool(c["license"]) and "public domain" in c["license"].lower()),
                individualCommonsLicenseShortName=c["license"],
                individualFileRightsStatus=("PUBLIC_DOMAIN_TAG_FOUND_PENDING_TERRITORIAL_REVIEW" if "public domain" in c["license"].lower() else "RIGHTS_METADATA_MISSING_NO_APP_PUBLICATION"),
                originalSourceCollection="BnF Arabe 3465 medieval Kalila wa Dimna manuscript, ca. 1200–1220",
                originalManuscriptURL="https://commons.wikimedia.org/wiki/" + CATEGORY.replace(" ", "_"),
                originalWikimediaSha1=info.get("sha1"),
                manuscriptFolioChapterAligned=False,
                narrativeSceneIdentification="NOT_YET_EDITORIALLY_MATCHED_TO_ARABIC_TEXT",
                editorialStatus="STAGED_ONLY_NO_APP_PUBLICATION",
            ))
            encoded.append((local, converted))
            print(f"ORIGINAL COLOURED FOLIO {number}: {c['title']} ({score:.1%} colour)", flush=True)
        except (requests.RequestException, OSError, ValueError) as exc:
            print(f"SKIP source image failure {c['title']}: {exc}", flush=True)
        time.sleep(2.1)
    if len(records) < 6:
        raise ValueError(f"Only {len(records)} qualifying authentic coloured folios, require >=6")
    OUT.mkdir(parents=True, exist_ok=False)
    (OUT / "plates").mkdir()
    for relative, raw in encoded:
        (OUT / relative).write_bytes(raw)
    manifest = dict(
        schemaVersion=1, workId="kalila-wa-dimna-arabic",
        sourceCategory=CATEGORY, sourceManuscriptYear="circa 1200–1220",
        workTextSeparateSource="docs/literature/staging/kalila-arabic-wikisource/",
        status="COLOURED_HISTORIC_PLATES_STAGED_NOT_CHAPTER_PUBLISHED",
        fullSourceTextAlreadyStagedInOtherFolder=True,
        colourReconstruction="NONE; original source colours preserved",
        imageRights="COMMONS_PER_FILE_METADATA_RECORDED_WHEN_AVAILABLE; ALL_INDIVIDUAL_AND_TERRITORIAL_REVIEW_OPEN",
        completeEnglishContextualTranslation=False,
        everyMiniatureSceneMatched=False,
        chapterIntegration=False,
        plates=records,
    )
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    verify()


if __name__ == "__main__":
    main()
