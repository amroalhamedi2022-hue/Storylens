#!/usr/bin/env python3
"""Bounded Gemini VISION research: original Townsend images vs all original prose.

Only model-suggested, double-crosschecked, NON-PUBLISHABLE original-image
scene evidence. No fake chapter cards, human approval, or rights clearance.
Use existing shared fail-closed model engine and exact-quotation rejection.
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
import sys

import gemini_suggest_verne_plate_scenes as engine
from export_sign_four_original_source_for_art import collect

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "docs/literature/staging/sign-four-townsend-1903-period-plates"
engine.GALLERY = ART
engine.OUTPUT = ROOT / "docs/literature/staging/sign-four-townsend-1903-scene-reviews"
engine.WORK_ID = "the-sign-of-the-four"
engine.EDITION_CONTEXT = (
    "Compare an authentic Frederick Henry Townsend G. Newnes 1903 illustrated "
    "souvenir edition of The Sign of Four against the genuine complete 12-chapter "
    "1890 English Arthur Conan Doyle novel as pinned by Standard Ebooks. "
    "Do not equate the 1903 illustration caption with the exact text in another "
    "edition. Only accept exact contiguous original source prose, specific "
    "visible objects/actions and a second independent skeptical vision check; "
    "otherwise reject. No historical page-placement, copyright or approvals."
)
engine.ORIGINAL_ARTIST = "Frederick Henry Townsend (1868–1920); per-file credits pending"
engine.ILLUSTRATED_EDITION = (
    "The Sign of Four, G. Newnes Ltd. 1903 illustrated souvenir edition; "
    "per-image territorial rights and scene identity require review"
)



def pending_scene_count() -> int:
    """Compute work locally; ZERO requests to Gemini if all images reviewed."""
    archive = json.loads((ART / "manifest.json").read_text("utf-8"))
    count = 0
    for item in archive["images"]:
        file = engine.record_file(item)
        if file.exists():
            record = json.loads(file.read_text("utf-8"))
            if (record.get("status") == "AI_SCENE_SUGGESTION_NOT_RELEASE_APPROVED"
                    and "visualCrosscheck" in record):
                continue
        count += 1
    return count


def check() -> None:
    doc = collect()
    archive = json.loads((ART / "manifest.json").read_text("utf-8"))
    assert doc["workId"] == engine.WORK_ID
    assert doc["chapterCount"] == 12
    assert len(doc["chapters"]) == 12
    assert sum(len(c["paragraphs"]) for c in doc["chapters"]) > 150
    assert archive["publicationApproved"] is False
    assert len({x["webpSha256"] for x in archive["images"]}) == 8
    assert doc["rightsApproved"] is False
    engine.self_test()
    print("PASS: original 12-chapter Sign of Four and eight authentic Townsend visuals; "
          "model cannot grant historical-art rights or publish chapters")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--self-test", action="store_true")
    ap.add_argument("--pending-count", action="store_true")
    ap.add_argument("--max-new", type=int, default=4)
    args = ap.parse_args()
    try:
        if args.self_test:
            check()
        elif args.pending_count:
            print("PENDING_UNREVIEWED_TOWNSEND_IMAGES:", pending_scene_count())
        elif not 1 <= args.max_new <= 4:
            ap.error("--max-new must be 1..4")
        else:
            if pending_scene_count() == 0:
                print("All eight genuine Townsend images have review checkpoints; no Gemini API calls")
            else:
                engine.corpus = collect
                engine.run(args.max_new)
    except Exception as exc:
        message = str(exc)
        secret = os.environ.get("GEMINI_API_KEY", "")
        if secret:
            message = message.replace(secret, "[REDACTED]")
        print("Historical 1903 Townsend vision/source QA preserved partial source evidence:",
              message, file=sys.stderr)
        raise SystemExit(1)
