#!/usr/bin/env python3
"""Archive complete historical classics specifically requested by the owner.

Only authentic originals or identified historical translations are accepted.
Preserve source HTML byte-for-byte and every source inline image as local WebP
in a SECOND offline HTML copy, with hashes and image order. No generated,
truncated, abridged, AI-written, or silent translation material.
Rights, missing artwork, Arabic companions and reader publication remain HOLD.
"""
from __future__ import annotations

import argparse
from bs4 import BeautifulSoup
from io import BytesIO
from pathlib import Path
from PIL import Image, ImageOps
from urllib.parse import urljoin, urlsplit
import hashlib
import json
import re
import time

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/literature/staging/user-requested-classics-20261105"
BOOKS = {
    "the-woman-in-white": dict(pg=583, title="The Woman in White", author="Wilkie Collins",
                               originalLanguage="en", sourceLanguage="en", year=1860, minimumWords=120000,
                               originalEditionNote="Gutenberg complete English-original novel, not a children's adaptation"),
    "the-valley-of-fear": dict(pg=3289, title="The Valley of Fear", author="Arthur Conan Doyle",
                               originalLanguage="en", sourceLanguage="en", year=1915, minimumWords=45000,
                               originalEditionNote="Fourth complete Sherlock Holmes novel, original English"),
    "the-count-of-monte-cristo": dict(pg=1184, title="The Count of Monte Cristo", author="Alexandre Dumas",
                               originalLanguage="fr", sourceLanguage="en", year=1844, minimumWords=300000,
                               originalEditionNote="Complete historical English TRANSLATION; French original/edition-translator verification outstanding"),
}
for number, eid in enumerate(range(3435, 3445), 1):
    BOOKS[f"arabian-nights-burton-v{number:02}"] = dict(
        pg=eid, title=f"The Book of the Thousand Nights and a Night — Volume {number:02} of 10",
        author="Traditional Arabic storytellers; English translation by Richard F. Burton",
        originalLanguage="ar", sourceLanguage="en", year=1885, minimumWords=30000,
        originalEditionNote="Adult historical Richard F. Burton 1885 English edition; NOT a matching bilingual Arabic transcription, nor a children's adaptation",
        translator="Richard Francis Burton",
        seriesId="arabian-nights-burton-ten-volume-edition", seriesVolume=number, seriesVolumeCount=10,
    )

START = re.compile(r"\*\*\*\s*START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK", re.IGNORECASE)
END = re.compile(r"\*\*\*\s*END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK", re.IGNORECASE)
MAX_HTML = 18_000_000
MAX_IMAGE = 24_000_000
MAX_IMAGES = 450


def sha(blob: bytes) -> str:
    return hashlib.sha256(blob).hexdigest()


def source_session():
    s = requests.Session()
    s.headers["User-Agent"] = "LinguaTales-SourcedPublicDomainHistoricalBookIntake/1.0"
    s.mount("https://", HTTPAdapter(max_retries=Retry(
        total=3, backoff_factor=.7, status_forcelist=[429, 500, 502, 503, 504],
    )))
    return s


def allowed_url(url, pg, image=False):
    p = urlsplit(url)
    if p.scheme != "https" or p.hostname not in ("www.gutenberg.org", "gutenberg.org") or p.username or p.password:
        raise ValueError(f"Unsafe source or redirect URL {url}")
    if image:
        if not (p.path.startswith(f"/cache/epub/{pg}/") or p.path.startswith(f"/files/{pg}/")):
            raise ValueError(f"Image outside identified ebook edition {url}")
        if not re.search(r"\.(jpe?g|png|gif|webp)$", p.path, re.IGNORECASE):
            raise ValueError(f"Unexpected image type {url}")
    return url


def fetch(s, url, pg, limit, image=False):
    allowed_url(url, pg, image=image)
    with s.get(url, timeout=(15, 90), stream=True) as resp:
        resp.raise_for_status()
        allowed_url(resp.url, pg, image=image)
        blocks, length = [], 0
        for chunk in resp.iter_content(131072):
            if chunk:
                length += len(chunk)
                if length > limit:
                    raise ValueError(f"Archive file too large {url}")
                blocks.append(chunk)
    return b"".join(blocks)


def text_only(doc):
    return BeautifulSoup(doc, "html.parser").get_text(" ", strip=True)


def verify(slug):
    folder = DEST / slug
    m = json.loads((folder / "manifest.json").read_text(encoding="utf-8"))
    spec = BOOKS[slug]
    assert m["workId"] == slug
    raw = (folder / "original-edition.html").read_bytes()
    offline = (folder / "offline-edition.html").read_bytes()
    assert len(raw) == m["source"]["bytes"] and sha(raw) == m["source"]["sha256"]
    assert sha(text_only(raw).encode("utf-8")) == m["source"]["allTextSha256"]
    assert text_only(raw) == text_only(offline), f"{slug}: original narrative changed"
    assert START.search(text_only(raw)) and END.search(text_only(raw)), f"{slug}: markers missing"
    assert m["source"]["narrativeWords"] >= spec["minimumWords"], f"{slug}: abridgement?"
    imgs_orig = BeautifulSoup(raw, "html.parser").find_all("img")
    imgs_out = BeautifulSoup(offline, "html.parser").find_all("img")
    assert len(imgs_orig) == len(imgs_out) == len(m["sourceImages"])
    for ix, (tag, info) in enumerate(zip(imgs_out, m["sourceImages"]), 1):
        assert tag["src"] == info["localPath"], f"{slug}: image order changed #{ix}"
        data = (folder / info["localPath"]).read_bytes()
        assert len(data) == info["bytes"] and sha(data) == info["sha256"], f"{slug}: image changed #{ix}"
        assert data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    assert m["acceptance"]["fullNaturalArabicTranslation"] is False
    assert m["acceptance"]["appIntegrated"] is False
    print(f"VERIFIED {slug}: {m['source']['narrativeWords']} original-source words, "
          f"{m['historicalArtworkCandidates']} real illustrated-edition pictures "
          f"(of {len(imgs_orig)} exact in-source images), no text/image tampering.", flush=True)
    return m


def download(slug):
    if (DEST / slug / "manifest.json").exists():
        verify(slug)
        print(f"REUSED existing verified {slug} without duplication", flush=True)
        return
    m = BOOKS[slug]
    id_ = m["pg"]
    urls = [
        f"https://www.gutenberg.org/cache/epub/{id_}/pg{id_}-images.html",
        f"https://www.gutenberg.org/files/{id_}/{id_}-h/{id_}-h.htm",
    ]
    s = source_session()
    failures = []
    for url in urls:
        try:
            raw = fetch(s, url, id_, MAX_HTML)
            original = BeautifulSoup(raw, "html.parser")
            alltext = original.get_text(" ", strip=True)
            if not START.search(alltext) or not END.search(alltext):
                raise ValueError("Not a complete Gutenberg work with intact source markers")
            front = alltext[:20000].lower()
            if m["title"].split(" —")[0].lower() not in front:
                raise ValueError("Title mismatch for this Gutenberg identifier")
            core = END.split(START.split(alltext, maxsplit=1)[-1], maxsplit=1)[0]
            words = len(re.findall(r"\b[\w’'-]+\b", core))
            if words < m["minimumWords"]:
                raise ValueError(f"Incomplete source? word count {words}")
            break
        except (requests.RequestException, ValueError, UnicodeDecodeError) as exc:
            failures.append(str(exc))
    else:
        raise ValueError(f"{slug}: no verified complete source: {failures}")
    second = BeautifulSoup(raw.decode("utf-8-sig"), "html.parser")
    entries, images = [], []
    for index, tag in enumerate(second.find_all("img"), 1):
        if index > MAX_IMAGES:
            raise ValueError(f"{slug} has more than max images")
        source_rel = tag.get("src")
        if not source_rel:
            raise ValueError(f"{slug} has an image without src")
        image_url = urljoin(url, source_rel)
        image_raw = fetch(s, image_url, id_, MAX_IMAGE, image=True)
        with Image.open(BytesIO(image_raw)) as scanned:
            original_dims = list(scanned.size)
            original_format = scanned.format
            if min(original_dims) < 1 or scanned.width * scanned.height > 80_000_000:
                raise ValueError(f"Invalid illustrated edition image size {image_url}")
            scanned = ImageOps.exif_transpose(scanned)
            scanned.thumbnail((1300, 1700), Image.Resampling.LANCZOS)
            if scanned.mode not in ("RGB", "RGBA"):
                scanned = scanned.convert("RGB")
            out = BytesIO()
            scanned.save(out, "WEBP", quality=78, method=5)
            webp = out.getvalue()
            small_or_ui = min(original_dims) < 100 or "enlarge" in image_url.lower()
        local = f"art/image-{index:03}.webp"
        tag["src"] = local
        caption = (tag.get("alt") or tag.get("title") or "").strip()
        heading = tag.find_previous(["h1", "h2", "h3", "h4"])
        para = tag.find_previous("p")
        entries.append(dict(
            number=index, localPath=local, bytes=len(webp), sha256=sha(webp),
            originalUrl=image_url, originalSha256=sha(image_raw), originalBytes=len(image_raw),
            originalImageFormat=original_format, originalImageDimensions=original_dims,
            historicalArtworkCandidate=not small_or_ui,
            originalAltOrCaption=caption[:240],
            nearestPreviousHeading=heading.get_text(" ", strip=True)[:200] if heading else "",
            previousParagraphContext=para.get_text(" ", strip=True)[:210] if para else "",
            placementStatus="SOURCE_DOM_EXACT; STORY_SCENE_EDITORIAL_CHECK_PENDING",
            rightsStatus="INDIVIDUAL_IMAGE_AND_TERRITORY_REVIEW_PENDING",
        ))
        images.append((local, webp))
        time.sleep(.05)
    secondary = str(second).encode("utf-8")
    if text_only(secondary) != alltext:
        raise ValueError(f"{slug}: offline image rewriting changed text")
    output = dict(
        schemaVersion=1, workId=slug, title=m["title"], author=m["author"],
        sourceLanguage=m["sourceLanguage"], originalLanguage=m["originalLanguage"],
        originalPublicationYear=m["year"], sourceEditionNote=m["originalEditionNote"],
        translator=m.get("translator", None),
        seriesId=m.get("seriesId", None), seriesVolume=m.get("seriesVolume", None),
        seriesVolumeCount=m.get("seriesVolumeCount", None),
        source=dict(
            provider="Project Gutenberg", ebookNumber=id_, url=url,
            catalog=f"https://www.gutenberg.org/ebooks/{id_}",
            sha256=sha(raw), bytes=len(raw), narrativeWords=words,
            allTextSha256=sha(alltext.encode("utf-8")),
            completeGutenbergMarkers=True, originalFullEditionPreservedVerbatim=True,
        ),
        sourceImages=entries, historicalArtworkCandidates=sum(1 for e in entries if e["historicalArtworkCandidate"]),
        imagesWithExactRelativePositions=len(entries),
        acceptance=dict(
            fullOriginalOrUnabridgedHistoricalTranslation=True,
            fullNaturalArabicTranslation=False,
            bilingualOriginalEnglishEditionAligned=False,
            illustrationRightsApproved=False,
            allRequestedHistoricalColouredArtworkPresent=False,
            appIntegrated=False, androidDeviceVerified=False,
        ),
        status="COMPLETE_SOURCE_STAGED_ONLY_NOT_PUBLISHED",
        note="Unabridged cited source, NOT bilingual or APK-ready. No invented images or missing-book equivalence. Burton Arabic-origin source not aligned to any Arabic edition.",
    )
    folder = DEST / slug
    folder.mkdir(parents=True, exist_ok=False)
    (folder / "art").mkdir()
    for name, blob in images:
        (folder / name).write_bytes(blob)
    (folder / "original-edition.html").write_bytes(raw)
    (folder / "offline-edition.html").write_bytes(secondary)
    (folder / "manifest.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", "utf-8")
    verify(slug)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--book", choices=list(BOOKS), default=None)
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    targets = [args.book] if args.book else list(BOOKS)
    for name in targets:
        if args.verify:
            verify(name)
        else:
            download(name)
    if args.verify and not args.book:
        vols = [name for name in BOOKS if name.startswith("arabian-nights-burton-v")]
        assert len(vols) == 10, "Burton 1885 edition MUST be all 10 numbered volumes"
        assert all((DEST / name / "manifest.json").exists() for name in vols)
        print("PASS: 3 requested full novels and ALL TEN Burton Arabian Nights English volumes staged, never claimed as complete Arabic bilingual release.", flush=True)


if __name__ == "__main__":
    main()
