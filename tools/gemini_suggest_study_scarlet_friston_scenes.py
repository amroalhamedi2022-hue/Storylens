#!/usr/bin/env python3
"""Skeptical real 1887 Friston illustrated scene vs exact 14-chapter Doyle prose.

Uses actual local source-hashed original period WebP, model-identified visual
subjects, exact original English quotation and second independent image+passage
inspection. Every saved result is a research SUGGESTION only, never an approved
thumbnail, historical rights clearance or automatic reader integration.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import sys

import gemini_suggest_verne_plate_scenes as engine
from export_study_scarlet_original_for_art import extract

ROOT = Path(__file__).resolve().parents[1]
engine.GALLERY = ROOT / "docs/literature/staging/study-in-scarlet-friston-1887-period-plates"
engine.OUTPUT = ROOT / "docs/literature/staging/study-in-scarlet-friston-1887-scene-reviews"
engine.WORK_ID = "a-study-in-scarlet"
engine.ORIGINAL_ARTIST = "David Henry Friston (1820–1906)"
engine.ILLUSTRATED_EDITION = "A Study in Scarlet original 1887 Beeton's Christmas Annual"
engine.EDITION_CONTEXT = (
    "You are comparing a REAL 1887 David Henry Friston original engraving "
    "from Beeton's Christmas Annual with exact original 1887 Arthur Conan Doyle "
    "A Study in Scarlet English novel source, normalized by Standard Ebooks. "
    "Only match a SPECIFIC visible action or scene, not just Sherlock Holmes, "
    "Victorian clothing or a London setting. Refuse when the artwork is decorative, "
    "frontispiece-only or unassignable to a single exact chapter; require exact "
    "source paragraph quotation. Rights and chapter editorial approval remain held."
)


def checks() -> None:
    book = extract()
    assert book["workId"] == engine.WORK_ID
    assert len(book["chapters"]) == 14
    assert [x["partOneBased"] for x in book["chapters"]] == [1]*7 + [2]*7
    assert book["rightsApproved"] is False
    engine.self_test()
    print("PASS: 1887 Friston original source art vs full fourteen-chapter Doyle original is isolated")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    parser.add_argument("--max-new", type=int, default=4)
    args = parser.parse_args()
    try:
        if args.self_test:
            checks()
        elif not 1 <= args.max_new <= 4:
            parser.error("--max-new must be 1..4")
        else:
            engine.corpus = extract
            engine.run(args.max_new)
    except Exception as exc:
        message = str(exc)
        token = os.environ.get("GEMINI_API_KEY", "")
        if token:
            message = message.replace(token, "[REDACTED]")
        print("Original Friston illustration inspection checkpoint interrupted:", message, file=sys.stderr)
        sys.exit(1)
