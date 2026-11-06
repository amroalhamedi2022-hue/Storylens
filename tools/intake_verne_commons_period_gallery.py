#!/usr/bin/env python3
"""Bounded, resumable real 1873-period illustration acquisition (staging only).

Only files from the specified Wikimedia Commons historical illustration category,
whose individual Commons metadata reports public-domain status, are fetched.
Their source bytes and the unaltered-colour compressed local WebP are hashed.
No guessed chapter placement, rights clearance, user-facing publication or
synthetic art. The source category is NOT a blanket copyright declaration.
"""
from __future__ import annotations
import argparse
import hashlib
from io import BytesIO
import json
import os
from pathlib import Path
import re
import sys
import time
from urllib.parse import urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/literature/staging/verne-commons-period-plates"
MANIFEST = DEST / "manifest.json"
IMAGES = DEST / "plates"
SOURCE_CATEGORY = "Category:Illustrations from Around the World in Eighty Days by Neuville and Benett"
ORIGINAL_YEAR = 1873
PERIOD_MIME = "image/jpeg"
PERIOD_MAGIC = b"\xff\xd8\xff"
OUTPUT_PREFIX = "verne-commons"
API = "https://commons.wikimedia.org/w/api.php"
MAX_DOWNLOAD_BYTES = 5_000_000
MAX_IMAGE_PIXELS = 24_000_000
Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
PERIOD_NAME = re.compile(
    r"^File:(?:(?:Around the world in eighty days \(1873\) \(\d+\))|"
    r"(?:'Around the World in Eighty Days' by Neuville and Benett \d+))\.jpg$",
    re.IGNORECASE
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def create_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({
        "User-Agent": "LinguaTalesOriginalPeriodArtworkResearch/1.0 (https://github.com/amroalhamedi2022-hue/Storylens; contact via repository issues)",
        "Accept": "application/json, image/jpeg;q=0.9, image/png;q=0.8",
    })
    s.mount("https://", HTTPAdapter(max_retries=Retry(
        total=3, backoff_factor=1.5, status_forcelist=[429, 500, 502, 503, 504],
        respect_retry_after_header=True,
    )))
    return s


def category_members(s: requests.Session) -> list[dict]:
    result, cursor = [], None
    while True:
        params = {
            "action": "query", "generator": "categorymembers",
            "gcmtitle": SOURCE_CATEGORY, "gcmtype": "file", "gcmlimit": "50",
            "prop": "imageinfo", "iiprop": "url|size|sha1|mime|extmetadata",
            "iiurlwidth": "950", "format": "json", "formatversion": "2",
        }
        if cursor:
            params["gcmcontinue"] = cursor
        response = s.get(API, params=params, timeout=(15, 45))
        response.raise_for_status()
        payload = response.json()
        if "error" in payload:
            raise ValueError("Commons API refused archive query; no phantom candidates")
        result.extend(payload.get("query", {}).get("pages", []))
        cursor = payload.get("continue", {}).get("gcmcontinue")
        if not cursor:
            break
        if len(result) > 350:
            raise ValueError("Unexpected Commons category expansion")
    if len(result) < 10:
        raise RuntimeError("Commons did not return expected historical image category members")
    return sorted(result, key=lambda x: x.get("title", ""))


def metadata_text(imageinfo: dict, key: str) -> str:
    value = imageinfo.get("extmetadata", {}).get(key, {}).get("value", "")
    return value if isinstance(value, str) else ""


def permit_candidate(entry: dict, existing_sha1: set[str]) -> dict | None:
    name = entry.get("title", "")
    if not PERIOD_NAME.match(name):
        return None
    details = entry.get("imageinfo", [])
    if len(details) != 1:
        return None
    info = details[0]
    remote_sha1 = info.get("sha1", "")
    if not re.fullmatch(r"[a-f0-9]{40}", remote_sha1):
        return None
    if remote_sha1 in existing_sha1:
        return None
    if info.get("mime") != PERIOD_MIME:
        return None
    rights = metadata_text(info, "LicenseShortName")
    copyright_flag = metadata_text(info, "Copyrighted").strip().lower()
    if not re.search(r"public\s*domain|^pd(?:-|$)|cc0", rights, re.IGNORECASE):
        return None
    if copyright_flag not in ("", "false", "0"):
        return None
    url = info.get("thumburl") or info.get("url")
    parsed = urlparse(url or "")
    if parsed.scheme != "https" or parsed.hostname not in ("upload.wikimedia.org", "thumb.wikimedia.org"):
        return None
    if parsed.username or parsed.password:
        return None
    return {
        "wikiFile": name,
        "commonsPage": info.get("descriptionurl", "https://commons.wikimedia.org/wiki/" + name.replace(" ", "_")),
        "commonsOriginalImageURL": info.get("url"),
        "downloadURL": url,
        "originalCommonsSHA1MetadataOnly": remote_sha1,
        "originalCommonsWidthMetadataOnly": info.get("width"),
        "originalCommonsHeightMetadataOnly": info.get("height"),
        "individualCommonsLicense": rights,
        "commonsLicenseURL": metadata_text(info, "LicenseUrl"),
    }


def download_image(s: requests.Session, entry: dict) -> tuple[bytes, bytes, int, int]:
    source = entry["downloadURL"]
    with s.get(source, stream=True, timeout=(18, 60), allow_redirects=True) as response:
        response.raise_for_status()
        final = urlparse(response.url)
        if final.scheme != "https" or final.hostname not in ("upload.wikimedia.org", "thumb.wikimedia.org"):
            raise ValueError("Commons image left trusted Wikimedia HTTPS origin")
        raw_chunks, size = [], 0
        for chunk in response.iter_content(chunk_size=65536):
            if chunk:
                size += len(chunk)
                if size > MAX_DOWNLOAD_BYTES:
                    raise ValueError("Oversized image excluded from bounded archive")
                raw_chunks.append(chunk)
    raw = b"".join(raw_chunks)
    if len(raw) < 5000 or not raw.startswith(PERIOD_MAGIC):
        raise ValueError("Historical JPG source has unexpected bytes")
    try:
        image = ImageOps.exif_transpose(Image.open(BytesIO(raw)))
        image.load()
    except (UnidentifiedImageError, OSError) as exc:
        raise ValueError("Invalid image decoder result") from exc
    if image.width < 350 or image.height < 350 or image.width * image.height > MAX_IMAGE_PIXELS:
        raise ValueError("Historical scan size/dimensions outside bounds")
    if image.width > 950 or image.height > 1400:
        image.thumbnail((950, 1400), Image.Resampling.LANCZOS)
    image = image.convert("RGB")  # native color preserved; no grayscale or crop
    out = BytesIO()
    image.save(out, "WEBP", quality=79, method=6)
    encoded = out.getvalue()
    if len(encoded) > 1_000_000 or encoded[:4] != b"RIFF" or encoded[8:12] != b"WEBP":
        raise ValueError("Invalid or oversized encoded local historical plate")
    return raw, encoded, image.width, image.height


def load_existing() -> dict:
    if MANIFEST.exists():
        existing = json.loads(MANIFEST.read_text(encoding="utf-8"))
        if existing.get("category") != SOURCE_CATEGORY:
            raise ValueError("Existing gallery manifest belongs to wrong source")
        for row in existing["images"]:
            file = DEST / row["localPath"]
            if not file.exists() or sha256(file.read_bytes()) != row["webpSha256"]:
                raise ValueError("Existing source-backed image was altered: " + row["localPath"])
        return existing
    return {
        "schemaVersion": 1,
        "status": "STAGED_ORIGINAL_HISTORICAL_PLATES__NO_CHAPTER_MAP_OR_RIGHTS_APPROVAL",
        "category": SOURCE_CATEGORY,
        "categoryURL": "https://commons.wikimedia.org/wiki/" + SOURCE_CATEGORY.replace(" ", "_"),
        "originalEditionYear": ORIGINAL_YEAR,
        "rightsStatus": "INDIVIDUAL_IMAGE_AND_TERRITORY_REVIEW_PENDING",
        "chapterSceneMatchingComplete": False,
        "publicationApproved": False,
        "colourPolicy": "preserve genuine source hues; never fake historical colour",
        "images": [],
    }


def persist(doc: dict) -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    path = MANIFEST.with_suffix(".json.tmp")
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    path.replace(MANIFEST)


def run(max_new: int) -> int:
    s = create_session()
    existing = load_existing()
    original = json.loads((ROOT / "docs/literature/HISTORIC_VERNES_ASSETS.json").read_text("utf-8"))
    known_sha1 = {row.get("expected_sha1") for row in original}
    known_sha1.update(row["originalCommonsSHA1MetadataOnly"] for row in existing["images"])
    seen = {row["wikiFile"] for row in existing["images"]}
    pages = category_members(s)
    count, failures = 0, []
    candidates = [p for p in pages if permit_candidate(p, known_sha1)]
    print(f"Commons category members: {len(pages)}, eligible previously-unarchived: {len(candidates)}")
    for page in candidates:
        metadata = permit_candidate(page, known_sha1)
        if metadata is None or metadata["wikiFile"] in seen:
            continue
        remote_id = metadata["originalCommonsSHA1MetadataOnly"]
        output = f"plates/{OUTPUT_PREFIX}-{remote_id[:16]}.webp"
        try:
            raw, packed, width, height = download_image(s, metadata)
        except (requests.RequestException, OSError, ValueError) as exc:
            failures.append(metadata["wikiFile"] + ": " + type(exc).__name__)
            continue
        IMAGES.mkdir(parents=True, exist_ok=True)
        file = DEST / output
        if file.exists():
            raise ValueError("Historical image filename collision; refusing overwrite")
        file.write_bytes(packed)
        existing["images"].append({
            **metadata,
            "localPath": output,
            "downloadedResourceSha256": sha256(raw),
            "downloadedResourceBytes": len(raw),
            "webpSha256": sha256(packed),
            "webpBytes": len(packed),
            "width": width,
            "height": height,
            "sourceProofStatus": "INDIVIDUAL_COMMONS_METADATA_AND_HASH_RECORDED",
            "sceneChapterMatchStatus": "UNREVIEWED__NO_CHAPTER_CARD",
            "rightsStatus": "PENDING_TERRITORIAL_AND_EDITORIAL_REVIEW",
            "recolouring": False,
            "cropped": False,
            "publishedToApp": False,
        })
        persist(existing)  # survives failed next request; Actions commits even on later failure
        known_sha1.add(remote_id)
        seen.add(metadata["wikiFile"])
        count += 1
        print(f"STAGED real period plate {count}/{max_new}: {output} SHA256={sha256(packed)}", flush=True)
        if count >= max_new:
            break
        time.sleep(0.5)
    if failures:
        print("Individual skipped download failures: " + str(len(failures)) +
              " (no substitute scans, will retry future run)", flush=True)
    print(f"DONE: new historical images {count}; total staged {len(existing['images'])}; "
          "0 newly approved chapter images; 0 publication", flush=True)
    if count == 0 and not existing["images"]:
        raise RuntimeError("No original period images downloaded; check Wikimedia access/rights metadata")
    return count


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--max-new", type=int, default=18)
    args = p.parse_args()
    if not 1 <= args.max_new <= 40:
        p.error("--max-new must be between 1 and 40")
    try:
        run(args.max_new)
    except Exception as exc:
        print("Commons period-plate intake failed safely: " + str(exc), file=sys.stderr)
        raise SystemExit(1)
