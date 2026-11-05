#!/usr/bin/env python3
"""Acquire five COMPLETE, authentic, illustrated Project Gutenberg editions.
Literature staging ONLY: never modify app, fonts, reader code, or translations.
Preserve original full HTML byte-for-byte, link EVERY original inline image to
a local WebP inside a second offline HTML, preserve original illustration order,
chapter context, original-source hashes, and content identity verification.
No synthesis, no abridging. Distribution rights + full Arabic remain PENDING.
"""
from __future__ import annotations

import argparse
import hashlib
from io import BytesIO
import json
import re
from pathlib import Path
import time
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup
from PIL import Image, ImageOps, UnidentifiedImageError
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs/literature/staging/illustrated-five-20261105"
BOOKS = {
    "treasure-island": dict(gutenbergId=120, title="Treasure Island", author="Robert Louis Stevenson", language="en",
                            year=1883, genre="pirate adventure", illustrator="Louis Rhead (illustrated edition)"),
    "kidnapped": dict(gutenbergId=421, title="Kidnapped", author="Robert Louis Stevenson", language="en",
                     year=1886, genre="historical adventure", illustrator="Louis Rhead (illustrated edition)"),
    "the-black-arrow": dict(gutenbergId=32954, title="The Black Arrow", author="Robert Louis Stevenson", language="en",
                            year=1888, genre="historical intrigue", illustrator="N. C. Wyeth (1916 book plates; 1933 reprint)"),
    "the-last-of-the-mohicans": dict(gutenbergId=27681, title="The Last of the Mohicans",
                                   author="James Fenimore Cooper", language="en", year=1826,
                                   genre="historical frontier fiction", illustrator="N. C. Wyeth (1919 illustration edition)"),
    "the-gilded-age": dict(gutenbergId=3178, title="The Gilded Age", author="Mark Twain and Charles Dudley Warner",
                            language="en", year=1873, genre="political and social satire",
                            illustrator="19th-century illustrated edition; identify individual plate credits before publication"),
}
MAX_HTML_BYTES = 11_000_000
MAX_IMAGE_BYTES = 24_000_000
MAX_IMAGE_COUNT = 600
MIN_NARRATIVE_WORDS = 30_000
START = re.compile(r"\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK", re.I)
END = re.compile(r"\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK", re.I)
CHAPTER = re.compile(r"\bCHAPTER\s+(?:[IVXLCDM]{1,10}|\d{1,3})\b", re.I)


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def session() -> requests.Session:
    s = requests.Session()
    s.headers["User-Agent"] = "LinguaTalesIllustratedClassicIntake/1.0 (archival verification; noncommercial research)"
    s.mount("https://", HTTPAdapter(max_retries=Retry(
        total=3, backoff_factor=0.6, status_forcelist=[429, 500, 502, 503, 504]
    )))
    return s


def fetch(s: requests.Session, url: str, limit: int) -> bytes:
    parsed = urlsplit(url)
    if parsed.scheme != "https" or parsed.hostname not in ("www.gutenberg.org", "gutenberg.org"):
        raise ValueError(f"Outside pinned Project Gutenberg HTTPS origin: {url}")
    if parsed.username or parsed.password or parsed.fragment:
        raise ValueError(f"Unapproved URL component: {url}")
    with s.get(url, timeout=(15, 65), stream=True, allow_redirects=True) as r:
        r.raise_for_status()
        final = urlsplit(r.url)
        if final.scheme != "https" or final.hostname not in ("www.gutenberg.org", "gutenberg.org"):
            raise ValueError(f"Unapproved redirect destination {r.url}")
        chunks, total = [], 0
        for chunk in r.iter_content(chunk_size=131_072):
            if chunk:
                total += len(chunk)
                if total > limit:
                    raise ValueError(f"Refusing oversized archive resource {url}")
                chunks.append(chunk)
    return b"".join(chunks)


def image_source_url(book_id: int, page_url: str, source: str) -> str:
    url = urljoin(page_url, source)
    parts = urlsplit(url)
    if parts.scheme != "https" or parts.hostname not in ("www.gutenberg.org", "gutenberg.org"):
        raise ValueError(f"Source HTML embeds a non-Gutenberg image {source}")
    if not (
        parts.path.startswith(f"/cache/epub/{book_id}/")
        or parts.path.startswith(f"/files/{book_id}/")
    ):
        raise ValueError(f"Unexpected illustrated-edition source path: {url}")
    if parts.query or parts.fragment or not re.search(r"\.(?:png|jpe?g|gif|webp)$", parts.path, re.I):
        raise ValueError(f"Unknown image source format {url}")
    return url


def paragraph_preview(element, max_chars=200) -> str:
    return " ".join(element.get_text(" ", strip=True).split())[:max_chars] if element else ""


def load_and_validate_html(raw: bytes, metadata: dict) -> tuple[str, BeautifulSoup, int, int]:
    html = raw.decode("utf-8-sig")
    if len(html) < 100_000:
        raise ValueError("This source is too short for the full novel")
    soup = BeautifulSoup(html, "html.parser")
    full_text = soup.get_text(" ", strip=True)
    if not START.search(full_text) or not END.search(full_text):
        raise ValueError("Complete original Gutenberg START/END markers were not found")
    if metadata["title"].lower() not in full_text[:15_000].lower():
        raise ValueError("Unexpected book title in the Gutenberg source")
    narrative = START.split(full_text, maxsplit=1)[-1]
    narrative = END.split(narrative, maxsplit=1)[0]
    words = len(re.findall(r"\b[\w’'-]+\b", narrative, re.UNICODE))
    if words < MIN_NARRATIVE_WORDS:
        raise ValueError(f"Novel unexpectedly short: {words} words")
    chapters = len(CHAPTER.findall(narrative))
    if chapters < 12:
        raise ValueError(f"Could not confirm original complete chapter structure: {chapters} chapter markers")
    return html, soup, words, chapters


def verify(folder: Path) -> dict:
    manifest = json.loads((folder / "manifest.json").read_text("utf-8"))
    source = (folder / "original-full-edition.html").read_bytes()
    offline = (folder / "offline-illustrated-edition.html").read_bytes()
    if sha(source) != manifest["source"]["sha256"] or len(source) != manifest["source"]["bytes"]:
        raise ValueError(f"Original source text identity changed: {folder}")
    original_text = BeautifulSoup(source, "html.parser").get_text(" ", strip=True)
    local_text = BeautifulSoup(offline, "html.parser").get_text(" ", strip=True)
    if original_text != local_text:
        raise ValueError(f"Offline edition altered or removed source text: {folder}")
    if manifest["source"]["totalTextIntegritySha256"] != sha(original_text.encode("utf-8")):
        raise ValueError(f"Text integrity hash mismatch: {folder}")
    original_images = BeautifulSoup(source, "html.parser").find_all("img")
    localized = BeautifulSoup(offline, "html.parser").find_all("img")
    if len(original_images) != len(localized) or len(localized) != len(manifest["art"]):
        raise ValueError(f"Illustration DOM count drift: {folder}")
    for i, row in enumerate(manifest["art"]):
        content = (folder / row["localPath"]).read_bytes()
        if sha(content) != row["webpSha256"] or len(content) != row["webpBytes"]:
            raise ValueError(f"Corrupted period art: {row['localPath']}")
        if content[:4] != b"RIFF" or content[8:12] != b"WEBP":
            raise ValueError(f"Not a WebP: {row['localPath']}")
        if localized[i].get("src") != row["localPath"]:
            raise ValueError(f"Original illustration position changed: {row['localPath']}")
        with Image.open(BytesIO(content)) as img:
            if list(img.size) != [row["width"], row["height"]]:
                raise ValueError(f"Image dimensions drift: {row['localPath']}")
    print(f"VERIFIED {folder.name}: original COMPLETE, {manifest['source']['narrativeWords']} words, "
          f"{len(manifest['art'])} real local period illustrations, exact HTML scene positions", flush=True)
    return manifest


def acquire(book_slug: str) -> None:
    metadata = BOOKS[book_slug]
    folder = OUTPUT / book_slug
    if folder.exists():
        verify(folder)
        print(f"REUSED {book_slug}; no duplicate archive or repeated download", flush=True)
        return
    source_id = metadata["gutenbergId"]
    page_url = f"https://www.gutenberg.org/cache/epub/{source_id}/pg{source_id}-images.html"
    s = session()
    raw = fetch(s, page_url, MAX_HTML_BYTES)
    original_html, original_soup, words, markers = load_and_validate_html(raw, metadata)
    offline_soup = BeautifulSoup(original_html, "html.parser")
    orig_tags = original_soup.find_all("img")
    tags = offline_soup.find_all("img")
    if len(tags) < 3 or len(tags) != len(orig_tags) or len(tags) > MAX_IMAGE_COUNT:
        raise ValueError(f"Illustration count unexpected for {book_slug}: {len(tags)}")
    image_rows, bytes_to_save = [], []
    encoded_by_url = {}
    narrative_paragraphs = offline_soup.find_all("p")
    para_index = {id(tag): idx + 1 for idx, tag in enumerate(narrative_paragraphs)}
    for index, tag in enumerate(tags, start=1):
        src = tag.get("src")
        if not src:
            raise ValueError(f"Image {index} has no original source URL")
        url = image_source_url(source_id, page_url, src)
        if url not in encoded_by_url:
            data = fetch(s, url, MAX_IMAGE_BYTES)
            if len(data) < 250:
                raise ValueError(f"Unexpectedly tiny archival figure {url}")
            if not (data.startswith(b"\xff\xd8\xff") or data.startswith(b"\x89PNG")
                    or data[:4] in (b"GIF8", b"RIFF")):
                raise ValueError(f"Not an archival raster image {url}")
            try:
                with Image.open(BytesIO(data)) as pic:
                    original_format = pic.format
                    original_dimensions = list(pic.size)
                    if pic.width < 40 or pic.height < 40 or pic.width * pic.height > 80_000_000:
                        raise ValueError(f"Unreasonable image dimensions {url}: {pic.size}")
                    pic = ImageOps.exif_transpose(pic)
                    pic.thumbnail((1280, 1600), Image.Resampling.LANCZOS)
                    if pic.mode not in ("RGB", "RGBA"):
                        pic = pic.convert("RGB")
                    buf = BytesIO()
                    pic.save(buf, format="WEBP", quality=73, method=5)
                    packed = buf.getvalue()
                    packed_dimensions = list(pic.size)
            except (UnidentifiedImageError, OSError) as exc:
                raise ValueError(f"Cannot decode historical image {url}") from exc
            encoded_by_url[url] = (data, packed, original_format, original_dimensions, packed_dimensions)
            time.sleep(0.07)
        source_data, packed, fmt, raw_dims, dimensions = encoded_by_url[url]
        relative = f"art/plate-{index:03d}.webp"
        tag["src"] = relative
        # Original HTML still exists unchanged; the edition display keeps every
        # raster exactly in its original source position, after neighbouring prose.
        before = tag.find_previous("p")
        after = tag.find_next("p")
        heading = tag.find_previous(["h1", "h2", "h3", "h4"])
        scene = tag.get("alt", "").strip() or tag.get("title", "").strip()
        scene = " ".join(scene.split())[:240]
        image_rows.append({
            "imageOrdinalInExactSourceDOM": index,
            "originalRelativeImageSource": src,
            "originalSourceUrl": url,
            "sourceSha256": sha(source_data),
            "sourceBytes": len(source_data),
            "sourceFormat": fmt,
            "sourceWidth": raw_dims[0],
            "sourceHeight": raw_dims[1],
            "localPath": relative,
            "webpSha256": sha(packed),
            "webpBytes": len(packed),
            "width": dimensions[0],
            "height": dimensions[1],
            "captionOrAltFromOriginal": scene,
            "nearestPriorHeading": paragraph_preview(heading, 140),
            "priorProsePreview": paragraph_preview(before, 190),
            "followingProsePreview": paragraph_preview(after, 190),
            "scenePosition": "EXACT_IN_ORIGINAL_HTML; CHAPTER_PARAGRAPH_EDITORIAL_REVIEW_PENDING",
            "illustrationRights": "PENDING_INDIVIDUAL_FIGURE_AND_TERRITORIAL_REVIEW",
        })
        bytes_to_save.append((relative, packed))
    offline_html = str(offline_soup).encode("utf-8")
    if BeautifulSoup(offline_html, "html.parser").get_text(" ", strip=True) != original_soup.get_text(" ", strip=True):
        raise ValueError("Conversion unexpectedly changed original literary text")
    manifest = {
        "schemaVersion": 1,
        "status": "COMPLETE_ENGLISH_SOURCE_AND_LOCAL_ORIGINAL_ILLUSTRATIONS_STAGED_NOT_PUBLISHED",
        "workId": book_slug,
        "title": metadata["title"],
        "author": metadata["author"],
        "originalLanguage": metadata["language"],
        "originalPublicationYear": metadata["year"],
        "genre": metadata["genre"],
        "illustratedEditionCredit": metadata["illustrator"],
        "source": {
            "provider": "Project Gutenberg",
            "catalogueUrl": f"https://www.gutenberg.org/ebooks/{source_id}",
            "originalFullHTMLUrl": page_url,
            "ebookId": source_id,
            "filename": "original-full-edition.html",
            "sha256": sha(raw),
            "bytes": len(raw),
            "narrativeWords": words,
            "chapterMarkerOccurrences": markers,
            "completeGutenbergStartEndMarkers": True,
            "totalTextIntegritySha256": sha(original_soup.get_text(" ", strip=True).encode("utf-8")),
        },
        "offlineHTMLFile": "offline-illustrated-edition.html",
        "historicArtFiles": len(image_rows),
        "allOriginalImageTagPositionsPreserved": True,
        "art": image_rows,
        "acceptance": {
            "englishSourceComplete": True,
            "allEditionOriginalInlineFiguresAcquired": True,
            "arabicFullNaturalTranslationComplete": False,
            "englishAndArabicImageParagraphAnchorsEditoriallyApproved": False,
            "individualImagesAndTerritorialRightsApproved": False,
            "mobileAppIntegrated": False,
            "physicalDeviceVerified": False
        },
        "publication": "NOT_APPROVED; ORIGINAL ENGLISH AND ILLUSTRATED SCANS ARE QUARANTINED",
        "usageWarning": "Original edition and pictures must NOT be treated as release-ready or redistributable in all territories without review. No synthetic/AI art. No automatic Arabic translation.",
    }
    # Atomic per-book staging: build all images, manifest and source before any
    # commit. GitHub workflow commits the book only if every test passes.
    folder.mkdir(parents=True, exist_ok=False)
    (folder / "art").mkdir()
    for name, packed in bytes_to_save:
        (folder / name).write_bytes(packed)
    (folder / "original-full-edition.html").write_bytes(raw)
    (folder / "offline-illustrated-edition.html").write_bytes(offline_html)
    (folder / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", "utf-8")
    verify(folder)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=list(BOOKS))
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    if args.verify:
        if args.book:
            verify(OUTPUT / args.book)
        else:
            for name in BOOKS:
                verify(OUTPUT / name)
    elif args.book:
        acquire(args.book)
    else:
        parser.error("--book is required during acquisition; --verify verifies staged books.")


if __name__ == "__main__":
    main()
