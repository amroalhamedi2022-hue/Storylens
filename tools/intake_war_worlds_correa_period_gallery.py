#!/usr/bin/env python3
"""Acquire unaltered original Correa 1906 War of the Worlds art in staged batches.

Shared engine independently records actual Wikimedia source, checksums and
rights flags. Only chapter-specific reviewed scans may later be chosen for UI.
"""
import argparse
from pathlib import Path
import re

import intake_verne_commons_period_gallery as engine

engine.DEST = engine.ROOT / "docs/literature/staging/war-of-worlds-correa-period-plates"
engine.MANIFEST = engine.DEST / "manifest.json"
engine.IMAGES = engine.DEST / "plates"
engine.SOURCE_CATEGORY = "Category:Illustrations from 'The War of the Worlds' by Henrique Alvim Corrêa"
engine.ORIGINAL_YEAR = 1906
engine.OUTPUT_PREFIX = "war-correa"
engine.PERIOD_NAME = re.compile(
    r"^File:(?:The War of the Worlds by Henrique Alvim Corrêa \d+(?: b&w)?\.jpg|"
    r"H G Wells La guerre des mondes 1906 \(page \d{1,3}(?:-\d+)? crop\)\.jpg)$",
    re.IGNORECASE,
)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-new", type=int, default=18)
    args = ap.parse_args()
    if not 1 <= args.max_new <= 40:
        ap.error("max-new out of bounds")
    engine.run(args.max_new)
