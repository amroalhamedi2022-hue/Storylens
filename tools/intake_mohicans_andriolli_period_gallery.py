#!/usr/bin/env python3
"""Download only genuine independently PD-tagged Andriolli-era Mohicans plates.

The authenticated Wikimedia Commons CATEGORY narrows the artist/work, a strict
filename gate rejects modern media/covers. Actual local WebPs + downloaded bytes
get SHA256s and explicit non-publication holds. No chapter guessed from page no.
"""
from __future__ import annotations

import argparse
import json
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/mohicans-andriolli-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:Illustrations from Last of Mohicans by Michał Elwiro Andriolli"
engine.ORIGINAL_YEAR = None  # Individual printed edition date not verified; never invent one.
engine.OUTPUT_PREFIX = "mohicans-andriolli"
engine.PERIOD_NAME = re.compile(
    r"^File:Le dernier des Mohicans - Cooper James - Andriolli - Huyot - p[1-9][0-9]{0,2}(?: 2)?\.jpg$",
    re.IGNORECASE,
)

ARTIST = "Michał Elwiro Andriolli (1836–1893); engraving attribution: Huyot"
EDITION = "Le dernier des Mohicans, French illustrated print; exact plate/edition year pending verification"


def run(max_new: int) -> int:
    count = engine.run(max_new)
    if engine.MANIFEST.is_file():
        doc = json.loads(engine.MANIFEST.read_text(encoding="utf-8"))
        doc["originalCreator"] = ARTIST
        doc["illustratedEdition"] = EDITION
        doc["originalEditionYear"] = None
        doc["humanSceneReviewDone"] = False
        doc["publicationApproved"] = False
        for image in doc["images"]:
            image["originalCreator"] = ARTIST
            image["sourceEdition"] = EDITION
            image["altAr"] = None
            image["altEn"] = None
            image["editoriallyApproved"] = False
            image["rightsStatus"] = "PENDING_INDIVIDUAL_TERRITORY_AND_EDITORIAL_REVIEW"
        engine.persist(doc)
    return count


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-new", type=int, default=18)
    args = parser.parse_args()
    if not 1 <= args.max_new <= 30:
        parser.error("--max-new must be 1..30")
    run(args.max_new)
