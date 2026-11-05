#!/usr/bin/env python3
"""Real original Andriolli engraving vs exact 33-chapter Cooper text, double vision QA.

AI is a search aide only. No output automatically becomes a thumbnail,
chapter-map candidate, copyright determination or human editorial signoff.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import sys

import gemini_suggest_verne_plate_scenes as engine
from export_mohicans_original_source_for_art import collect

ROOT = Path(__file__).resolve().parents[1]
engine.GALLERY = ROOT / "docs/literature/staging/mohicans-andriolli-period-plates"
engine.OUTPUT = ROOT / "docs/literature/staging/mohicans-andriolli-scene-reviews"
engine.WORK_ID = "the-last-of-the-mohicans"
engine.EDITION_CONTEXT = (
    "Compare an authentic Michał Elwiro Andriolli engraved illustration in a "
    "nineteenth-century French Le dernier des Mohicans edition with the REAL "
    "English original of James Fenimore Cooper's Last of the Mohicans. "
    "The French and English pagination differs; choose only exact prose-supported "
    "visual scenes, not book-wide character, forest or battle similarities."
)
engine.ORIGINAL_ARTIST = "Michał Elwiro Andriolli; engraved by Huyot"
engine.ILLUSTRATED_EDITION = "Le dernier des Mohicans, French illustrated period source (exact plate year to confirm)"


def local_checks() -> None:
    original = collect()
    assert original["workId"] == engine.WORK_ID
    assert len(original["chapters"]) == 33
    assert sum(len(c["paragraphs"]) for c in original["chapters"]) > 300
    assert original["rightsApproved"] is False
    engine.self_test()
    print("PASS: Mohicans real vision engine loaded 33 exact chapters with independent rights hold")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--max-new", type=int, default=4)
    args = parser.parse_args()
    try:
        if args.self_test:
            local_checks()
        elif not 1 <= args.max_new <= 8:
            parser.error("--max-new must be 1..8")
        else:
            engine.corpus = collect
            engine.run(args.max_new)
    except Exception as exc:
        message = str(exc)
        key = os.environ.get("GEMINI_API_KEY", "")
        if key:
            message = message.replace(key, "[REDACTED]")
        print("Original Andriolli image/source match stopped with saved checkpoints:", message, file=sys.stderr)
        sys.exit(1)
