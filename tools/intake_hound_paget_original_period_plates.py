#!/usr/bin/env python3
"""Source-authenticated genuine Sidney Paget (1901–02) Hound of Baskervilles art.

Only named original Sherlock Holmes Houn-* serial/book illustrations in the
actual Wikimedia Commons Paget-Hound category are eligible. Commons individual
PD metadata, authentic JPEG magic, origin/source hashes, WebP hash and minimum
scan dimensions are verified by the shared archival engine before persistence.
No generic Hound cover, AI art, scene assignment or publication is implied.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/hound-paget-original-1901-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:The Hound of the Baskervilles illustrated by Sidney Paget"
engine.ORIGINAL_YEAR = 1902
engine.OUTPUT_PREFIX = "hound-paget"
engine.PERIOD_NAME = re.compile(
    r"^File:Houn-(?:0[1-9]|[1-5][0-9]|60)(?: - [A-Za-z0-9 ,()'’\-]+)?\.jpg$",
    re.IGNORECASE,
)

ATTRIBUTION = "Sidney Paget (1860–1908), original Sherlock Holmes illustrator"
EDITION = ("The Hound of the Baskervilles original 1901–1902 serial/book-era engravings; "
           "individual printing, visual scene and territorial reuse pending review")


def maintain_evidence() -> None:
    if not engine.MANIFEST.exists():
        return
    doc = json.loads(engine.MANIFEST.read_text("utf-8"))
    if doc["category"] != engine.SOURCE_CATEGORY:
        raise ValueError("Archive source isn't the exact original Sidney Paget category")
    doc["originalCreator"] = ATTRIBUTION
    doc["sourceEdition"] = EDITION
    doc["sourceWork"] = "Arthur Conan Doyle, The Hound of the Baskervilles (1901–1902)"
    doc["historicalArtSceneMatchingComplete"] = False
    doc["chapterSceneMatchingComplete"] = False
    doc["publicationApproved"] = False
    for item in doc["images"]:
        if not engine.PERIOD_NAME.fullmatch(item["wikiFile"]):
            raise ValueError("A non-original/foreign Hound of the Baskervilles file slipped into the archive")
        item["originalCreator"] = ATTRIBUTION
        item["sourceEdition"] = EDITION
        item["sceneChapterMatchStatus"] = "UNREVIEWED__NO_CHAPTER_CARD"
        item["editoriallyApproved"] = False
        item["altAr"] = None
        item["altEn"] = None
        item["rightsStatus"] = "PENDING_INDIVIDUAL_PAGET_1902_TERRITORY_AND_SCENE_REVIEW"
    engine.persist(doc)


def run(max_new: int) -> int:
    try:
        return engine.run(max_new)
    finally:
        maintain_evidence()


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--max-new", type=int, default=18)
    args = p.parse_args()
    if not 1 <= args.max_new <= 24:
        p.error("--max-new must be between 1 and 24")
    run(args.max_new)
