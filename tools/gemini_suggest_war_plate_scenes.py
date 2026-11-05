#!/usr/bin/env python3
"""Match ACTUAL 1906 Corrêa scans to byte-verified 1898 Wells paragraphs.

Reuses Verne's image-seeing Gemini + independently skeptical image recheck.
Results are evidence-only, never publishable thumbnails or rights approvals.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import sys

import gemini_suggest_verne_plate_scenes as engine
from export_war_source_for_art import extract

ROOT = Path(__file__).resolve().parents[1]
engine.GALLERY = ROOT / "docs/literature/staging/war-of-worlds-correa-period-plates"
engine.OUTPUT = ROOT / "docs/literature/staging/war-of-worlds-correa-scene-reviews"
engine.WORK_ID = "wells-war-of-the-worlds-1898"
engine.EDITION_CONTEXT = (
    "Historian/editor comparing a real Henrique Alvim Corrêa 1906 French-edition "
    "engraving to exact passages in H. G. Wells's unabridged 1898 English original. "
    "A 1906 plate's French-edition page order does not prove English chapter placement."
)
engine.ORIGINAL_ARTIST = "Henrique Alvim Corrêa (1876–1910)"
engine.ILLUSTRATED_EDITION = "La Guerre des mondes, Brussels 1906"


def check() -> None:
    book = extract()
    assert book["workId"] == engine.WORK_ID
    assert [c["chapterOneBased"] for c in book["chapters"]] == list(range(1, 28))
    assert len({c["sourceGitBlobSha"] for c in book["chapters"]}) == 27
    engine.self_test()
    print("PASS: War vision engine wired to original Wells full prose and isolated artwork staging")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--max-new", type=int, default=4)
    args = parser.parse_args()
    try:
        if args.self_test:
            check()
        elif not 1 <= args.max_new <= 8:
            parser.error("--max-new must be 1..8")
        else:
            engine.corpus = extract
            engine.run(args.max_new)
    except Exception as exc:
        import os
        message = str(exc)
        token = os.environ.get("GEMINI_API_KEY", "")
        if token:
            message = message.replace(token, "[REDACTED]")
        print("Original Wells art evidence checkpoint interrupted:", message, file=sys.stderr)
        sys.exit(1)
