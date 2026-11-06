#!/usr/bin/env python3
"""Acquire *genuine 1903* F. H. Townsend 'The Sign of Four' edition plates.

The Commons category contains eight small authentic illustrated-edition scans
(Sign-t1.jpg ... Sign-t8.jpg). Exact titles, creator, 1903 edition provenance,
individual metadata/license, actual HTTPS image bytes and SHA256 are retained.
A tiny primary scan is NOT a license to pull a modern cover or synthetic art.
No attempt to publish a chapter picture, approve rights or auto-match a scene.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

EDITION = (
    "The Sign of Four, G. Newnes Ltd. illustrated souvenir edition (1903); "
    "individual scan rights and edition context require review"
)
CREATOR = "Frederick Henry Townsend (1868–1920)"
WORK = "The Sign of Four — Arthur Conan Doyle (original publication 1890)"
NAMES = frozenset(f"File:Sign-t{i}.jpg" for i in range(1, 9))

engine.DEST = engine.ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:The Sign of Four illustrated by F. H. Townsend"
engine.ORIGINAL_YEAR = 1903
engine.OUTPUT_PREFIX = "sign-four-townsend"
engine.PERIOD_NAME = re.compile(r"^File:Sign-t[1-8]\\.jpg$", re.IGNORECASE)
# The 1903 Commons scans are 254–265px wide; the 350px generic Verne floor
# otherwise rejects ALL authentic plates. Keep this exception source-specific.
engine.MIN_CATEGORY_MEMBERS = 8
engine.MIN_IMAGE_WIDTH = 240
engine.MIN_IMAGE_HEIGHT = 330


def maintain_evidence() -> None:
    if not engine.MANIFEST.is_file():
        return
    document = json.loads(engine.MANIFEST.read_text(encoding="utf-8"))
    if (document.get("category") != engine.SOURCE_CATEGORY
            or document.get("publicationApproved") is not False
            or document.get("chapterSceneMatchingComplete") is not False):
        raise ValueError("Unexpected Townsend gallery or rights state")
    if len(document.get("images", [])) > 8:
        raise ValueError("Too many 1903 Townsend original period plates")
    document["sourceEdition"] = EDITION
    document["sourceWork"] = WORK
    document["originalCreator"] = CREATOR
    document["humanChapterSceneVerificationComplete"] = False
    document["publicationApproved"] = False
    document["chapterSceneMatchingComplete"] = False
    names, hashes = set(), set()
    for plate in document["images"]:
        name, original = plate["wikiFile"], plate["originalCommonsSHA1MetadataOnly"]
        if name not in NAMES or name in names or original in hashes:
            raise ValueError("Non-original, duplicate or cross-source Townsend art")
        if not plate.get("individualCommonsLicense") or not plate.get("commonsPage"):
            raise ValueError("Original Commons image needs individual license and attribution")
        plate["originalCreator"] = CREATOR
        plate["sourceEdition"] = EDITION
        plate["artworkClassificationStatus"] = "1903_ORIGINAL_ENGRAVING__SCENE_UNREVIEWED"
        plate["editoriallyApproved"] = False
        plate["rightsStatus"] = "PENDING_INDIVIDUAL_TERRITORY_AND_SCENE_REVIEW"
        plate["altAr"] = None
        plate["altEn"] = None
        plate["publishedToApp"] = False
        names.add(name)
        hashes.add(original)
    engine.persist(document)


def run(max_new: int = 8) -> int:
    if not 1 <= max_new <= 8:
        raise ValueError("max-new must be 1..8")
    try:
        return engine.run(max_new)
    finally:
        # Retain genuine files and attribution even if a later Commons request
        # fails or encounters a transient rate limit.
        maintain_evidence()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=8)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 8:
        parser.error("--max-new must be 1..8")
    run(args.max_new)
