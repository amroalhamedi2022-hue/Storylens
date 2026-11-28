#!/usr/bin/env python3
"""Stage ALL FOUR Arabic Wikisource 'Alf Layla wa Layla' source parts.

The Arabic original transcription and Burton's historical English translation
may not be the same text/recension, episode order or completeness. This stages
real source pages, NOT a claim of bilingual correspondence or commercial rights.
"""
from __future__ import annotations

from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import quote, urlsplit
import argparse
import hashlib
import json
import re
import time

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

DEST = Path(__file__).resolve().parents[1] / "docs/literature/staging/arabian-nights-arabic-wikisource-20261105"
PARTS = {
  1: "الجزء الأول",
  2: "الجزء الثاني",
  3: "الجزء الثالث",
  4: "الجزء الرابع",
}
ROOT_URL = "https://ar.wikisource.org/wiki/" + quote("ألف_ليلة_وليلة", safe="")


def sha(b):
    return hashlib.sha256(b).hexdigest()


def session():
    s = requests.Session()
    s.headers.update({"User-Agent": "LinguaTalesArabicHeritageSourceResearch/1.0"})
    s.mount("https://", HTTPAdapter(max_retries=Retry(
        total=3, backoff_factor=2, status_forcelist=[429, 500, 502, 503, 504],
    )))
    return s


def fetch(s, url):
    p = urlsplit(url)
    if p.scheme != "https" or p.hostname != "ar.wikisource.org":
        raise ValueError(f"Unsafe Arabic literary source {url}")
    for attempt in range(4):
        try:
            with s.get(url, timeout=(20, 85), stream=True) as r:
                r.raise_for_status()
                if urlsplit(r.url).hostname != "ar.wikisource.org":
                    raise ValueError(f"Off-site redirect {r.url}")
                chunks, size = [], 0
                for ch in r.iter_content(131072):
                    size += len(ch)
                    if size > 12_000_000:
                        raise ValueError("Wikisource unexpectedly huge page")
                    chunks.append(ch)
                return b"".join(chunks)
        except requests.HTTPError as exc:
            if exc.response is None or exc.response.status_code != 429 or attempt == 3:
                raise
            time.sleep(10*(attempt+1))


def plain(doc):
    soup = BeautifulSoup(doc, "html.parser")
    main = soup.select_one(".mw-parser-output") or soup.select_one("#mw-content-text")
    if not main:
        raise ValueError("Cannot identify real Wikisource transcribed reading body")
    for bad in main.select(".mw-editsection, .toc, .mw-empty-elt, .noprint, script, style"):
        bad.decompose()
    # Use the actual displayed source paragraphs and headings, not site menus.
    segments = []
    for child in main.descendants:
        if getattr(child, "name", None) in ("p", "h2", "h3", "h4") and not child.find_parent(["p", "h2", "h3", "h4"]):
            t = child.get_text(" ", strip=True)
            if t and not t.startswith("مجلوبة من"):
                segments.append(t)
    return "\n\n".join(segments).strip()


def verify(part):
    name = f"part-{part:02d}"
    folder = DEST / name
    m = json.loads((folder / "manifest.json").read_text("utf-8"))
    raw = (folder / "wikisource-original-page.html").read_bytes()
    readable = (folder / "arabic-transcription.txt").read_bytes()
    assert sha(raw) == m["originalPageSha256"] and len(raw) == m["originalPageBytes"]
    assert sha(readable) == m["transcriptionSha256"]
    assert plain(raw).encode("utf-8") == readable, "Wikisource extraction altered"
    words = len(re.findall(r"[\u0621-\u064A]{2,}", readable.decode("utf-8")))
    assert words == m["arabicWordTokens"] and words >= 1200, "Possibly truncated Arabic part"
    assert m["verifiedAsMatchingBurtonEnglishEdition"] is False
    assert m["sourceEditionBibliographicalAlignment"] == "PENDING_PRINT_EDITION_COMPARISON"
    if part == 4:
        assert "الليلة الواحدة بعد الألف" in readable.decode("utf-8"), "Final night missing"
    print(f"VERIFIED Arabic original transcription {name}: {words} Arabic tokens, "
          "Wikisource HTML + extracted prose SHA256 consistent.", flush=True)
    return m


def acquire(part):
    name = f"part-{part:02d}"
    if (DEST/name/"manifest.json").exists():
        verify(part)
        return
    slug = quote(PARTS[part].replace(" ", "_"), safe="")
    url = ROOT_URL + "/" + slug
    s = session()
    raw = fetch(s, url)
    if len(raw) < 10_000:
        raise ValueError(f"Suspiciously short Wikisource source part {name}")
    soup = BeautifulSoup(raw, "html.parser")
    header = soup.find("h1")
    if not header or PARTS[part] not in header.get_text(" ", strip=True):
        raise ValueError(f"Wrong Arabic work/part title in source {name}")
    text = plain(raw)
    words = len(re.findall(r"[\u0621-\u064A]{2,}", text))
    if words < 1200:
        raise ValueError(f"{name}: only {words} words, full part incomplete")
    if part == 1 and "شهريار" not in text:
        raise ValueError("Part 1 lacks original Scheherazade Shahryar frame narrative")
    if part == 4 and "الليلة الواحدة بعد الألف" not in text:
        raise ValueError("Part 4 does not reach final night")
    folder = DEST / name
    folder.mkdir(parents=True, exist_ok=False)
    txt = text.encode("utf-8")
    (folder/"wikisource-original-page.html").write_bytes(raw)
    (folder/"arabic-transcription.txt").write_bytes(txt)
    manifest = dict(
        schemaVersion=1, workId="alf-layla-wa-layla", segment=name,
        arabicPartTitle=PARTS[part], sourceURL=url,
        originalPageSha256=sha(raw), originalPageBytes=len(raw),
        transcriptionSha256=sha(txt), transcriptionBytes=len(txt),
        arabicWordTokens=words, transcriptionProvider="Arabic Wikisource",
        textualProvenance="The exact four-part Arabic Wikisource transcription, not identified as Bulaq 1835 or another guaranteed critical edition",
        transcriptionTerms="Arabic Wikisource site text licensed CC BY-SA; preserve attribution and source URL",
        sourceEditionBibliographicalAlignment="PENDING_PRINT_EDITION_COMPARISON",
        verifiedAsMatchingBurtonEnglishEdition=False,
        arabicSourceCompletenessReview="FOUR_PARTS_PLUS_FINAL_NIGHT_CHECK; MISSING_EPISODES_NOT_INDEPENDENTLY_AUDITED",
        colouredHistoricalChapterArtworkIntegrated=False,
        publication="STAGED_ONLY; DO NOT LABEL COMPLETE BILINGUAL APP BOOK",
    )
    (folder/"manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n","utf-8")
    verify(part)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--part", type=int, choices=range(1,5))
    parser.add_argument("--verify", action="store_true")
    args = parser.parse_args()
    parts = [args.part] if args.part else range(1,5)
    for part in parts:
        if args.verify:
            verify(part)
        else:
            acquire(part)
    if args.verify and not args.part:
        assert all((DEST/f"part-{n:02d}"/"manifest.json").exists() for n in range(1,5))
        print("VERIFIED FOUR Arabic Wikisource original heritage parts through the 1001st night; critical printed edition / Burton alignment NOT claimed.",flush=True)


if __name__ == "__main__":
    main()
