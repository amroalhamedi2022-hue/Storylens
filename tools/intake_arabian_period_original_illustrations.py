#!/usr/bin/env python3
"""Actually archive period Arabian Nights pictures from TWO named original editions.

Edmund Dulac, Stories from the Arabian Nights (Housman retelling), 1907:
28 individually identified original-colour printed plates from one London edition.
Friedrich Groß, 1001 Nacht, original German historical illustrations 1838-39:
7 individually identified higher-resolution numbered-night prints.

THESE BOOKS ARE NOT BURTON'S UNABRIDGED 1885 ENGLISH TRANSLATION OR AN EXACT
COMPANION TO OUR FOUR ARABIC VOLUMES. A picture's night/printed-page metadata
is a research lead, NOT an invented match to a Burton narrative, official
translation, licensed app cover, published chapter thumbnail or usable reader
asset. Per-file Commons public-domain metadata and actual downloaded image
bytes are required; the publication rights/scene/territory gate remains CLOSED.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import intake_verne_commons_period_gallery as engine

DULAC_PLATES = frozenset(set(range(2, 31)) - {11})
GROSS_NIGHTS = frozenset({9, 109, 167, 231, 236, 247, 460})

DULAC_CATEGORY = "Category:Stories from The Arabian Nights (Dulac, 1907) (London)"
GROSS_CATEGORY = "Category:Illustrations to the Arabian Nights by F. Groß"

GROSS_FILENAMES = {
    f"File:Gross F, {night}. Nacht, 1001 Nacht, Bd {part}, {year}{suffix}.jpg"
    for night, part, year, suffix in (
        (9, 1, 1838, ""), (109, 1, 1838, ""), (167, 1, 1838, ""),
        (231, 1, 1838, ""), (236, 1, 1838, ""), (247, 1, 1838, " (1)"),
        (460, 2, 1839, ""),
    )
}

CONFIG = {
    "dulac": {
        "category": DULAC_CATEGORY,
        "dir": "arabian-nights-dulac-london-1907-original-colour-plates",
        "year": 1907,
        "prefix": "arabian-dulac-london-1907",
        "creator": "Edmund Dulac (1882–1953)",
        "edition": "Stories from The Arabian Nights, Laurence Housman retelling; illustrated by Edmund Dulac; Hodder & Stoughton London, 1907 original print",
        "rightsNote": "Original art scanned from the 1907 Housman *retelling*; not a proof of alignment with Burton/Arabic primary text",
        "names": {
            f"File:Stories from the Arabian nights - London 1907 - plate {page:02d}.jpg"
            for page in DULAC_PLATES
        },
    },
    "gross": {
        "category": GROSS_CATEGORY,
        "dir": "arabian-nights-gross-1838-original-night-illustrations",
        "year": None,  # Historical German edition volume 1 (1838), volume 2 (1839)
        "prefix": "arabian-gross-1838",
        "creator": "Friedrich Groß (F. Gross), original nineteenth-century illustrator",
        "edition": "1001 Nacht, German illustrated historical book; volume I 1838, volume II 1839",
        "rightsNote": "Numbered Nacht is a print citation, not verified against Burton or Arabic narrative chapters",
        "names": GROSS_FILENAMES,
    },
}


def configure(edition: str) -> dict:
    if edition not in CONFIG:
        raise ValueError("Only two individually documented period Arabian Nights sources are eligible")
    cfg = CONFIG[edition]
    engine.DEST = engine.ROOT / "docs/literature/staging" / cfg["dir"]
    engine.MANIFEST = engine.DEST / "manifest.json"
    engine.IMAGES = engine.DEST / "plates"
    engine.SOURCE_CATEGORY = cfg["category"]
    engine.ORIGINAL_YEAR = cfg["year"]
    engine.OUTPUT_PREFIX = cfg["prefix"]
    engine.PERIOD_NAME = re.compile(
        r"^(?:" + "|".join(re.escape(n) for n in sorted(cfg["names"])) + r")$",
        re.IGNORECASE,
    )
    engine.PERIOD_MIME = "image/jpeg"
    engine.PERIOD_MAGIC = b"\xff\xd8\xff"
    engine.MIN_CATEGORY_MEMBERS = 7
    return cfg


def provenance(edition: str) -> None:
    cfg = configure(edition)
    if not engine.MANIFEST.is_file():
        return
    doc = json.loads(engine.MANIFEST.read_text(encoding="utf-8"))
    if (doc.get("category") != cfg["category"]
            or doc.get("publicationApproved") is not False
            or doc.get("chapterSceneMatchingComplete") is not False):
        raise ValueError("Original historical edition manifest is foreign or auto-approved")
    doc["sourceWorkFamily"] = "The Thousand and One Nights (traditional Arabic narrative family)"
    doc["sourceEdition"] = cfg["edition"]
    doc["originalIllustrator"] = cfg["creator"]
    doc["sourceBookNotExactBurtonTranslation"] = True
    doc["sourceBookNotExactArabicTranscription"] = True
    doc["sourceEditionRightsAndTextNote"] = cfg["rightsNote"]
    doc["originalArtworkIndividualTerritorialRightsApproved"] = False
    doc["humanChapterSceneMatchesComplete"] = False
    doc["chapterSceneMatchingComplete"] = False
    doc["publicationApproved"] = False
    seen_origin, seen_webps, seen_file = set(), set(), set()
    for item in doc["images"]:
        name = item.get("wikiFile")
        if name not in cfg["names"]:
            raise ValueError("A generic, duplicated, cropped or nonperiod image was inserted")
        origin = item.get("originalCommonsSHA1MetadataOnly")
        webp = item.get("webpSha256")
        if not origin or origin in seen_origin or not webp or webp in seen_webps or name in seen_file:
            raise ValueError("An original source, printed plate or actual image was duplicated")
        if not item.get("commonsPage") or not item.get("individualCommonsLicense"):
            raise ValueError("Per-image historical Commons source and license missing")
        seen_origin.add(origin)
        seen_webps.add(webp)
        seen_file.add(name)
        item["originalCreator"] = cfg["creator"]
        item["sourceEdition"] = cfg["edition"]
        item["artworkClassificationStatus"] = "HISTORIC_PRINT_ART__NOT_MATCHED_TO_CANONICAL_ARABIC_OR_BURTON"
        item["rightsStatus"] = "INDIVIDUAL_LICENSE_AND_TARGET_TERRITORY_REVIEW_PENDING"
        item["editoriallyApproved"] = False
        item["publishedToApp"] = False
        item["altAr"] = None
        item["altEn"] = None
        if edition == "dulac":
            page = int(re.search(r"plate (\d{2})\.jpg$", name).group(1))
            if page not in DULAC_PLATES:
                raise ValueError("1907 original edition page citation altered")
            item["sourceEditionPlateOrdinal"] = page
            item["sourceNightNumberClaim"] = None
            item["captionEvidenceStatus"] = "EXACT_LONDON_1907_PRINTED_PLATE_ORDINAL_NOT_STORY_ALIGNED"
            item["sourceArtworkYear"] = 1907
        else:
            night = int(re.search(r"Gross F, (\d+)\. Nacht,", name).group(1))
            if night not in GROSS_NIGHTS:
                raise ValueError("Original numbered German 1838/39 printed night altered")
            item["sourcePrintedNightNumber"] = night
            item["sourceArtworkYear"] = 1839 if night == 460 else 1838
            item["captionEvidenceStatus"] = "EXACT_GERMAN_EDITION_NIGHT_NUMBER_NOT_SCENE_ALIGNED"
    doc["historicalOriginalImageFileCountVerifiedByManifest"] = len(doc["images"])
    doc["completeKnownSelectedOriginalArt"] = seen_file == cfg["names"]
    engine.persist(doc)


def collect(edition: str, max_new: int) -> int:
    cfg = configure(edition)
    if not 1 <= max_new <= len(cfg["names"]):
        raise ValueError("Request exceeds one collection's authentic period image count")
    try:
        count = engine.run(max_new)
    finally:
        # Even failed later network operations retain each actually downloaded
        # source-hashed image and the exact scanned edition attribution.
        provenance(edition)
    return count


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--edition", choices=("dulac", "gross", "all"), default="all")
    parser.add_argument("--max-new", type=int, default=22)
    args = parser.parse_args()
    editions = ("dulac", "gross") if args.edition == "all" else (args.edition,)
    for edition in editions:
        n = min(args.max_new, len(CONFIG[edition]["names"]))
        print(f"ORIGINAL_SOURCE_START {edition} max-new={n}", flush=True)
        collect(edition, n)
