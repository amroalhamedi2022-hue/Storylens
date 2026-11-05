#!/usr/bin/env python3
"""Checkpointed Gemini review of the EXISTING complete Verne bilingual draft.

Each chapter is exported from the actual committed reader source. Gemini reviews
small aligned windows; output is editorial feedback, NEVER a publishable
translation. Safe to rerun: every completed batch is hash-keyed and immutable.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import random
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "docs/literature/staging/verne-gemini-editorial"
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/"
MODELS = ("gemini-2.5-flash", "gemini-2.5-flash-lite")
PROMPT_VERSION = "verne-editorial-v1"
BATCH_SIZE = 5

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def call_gemini(key, payload):
    body = json.dumps({
        "contents": [{"role": "user", "parts": [{"text": json.dumps(payload, ensure_ascii=False)}]}],
        "generationConfig": {"temperature": 0, "responseMimeType": "application/json",
                             "maxOutputTokens": 2200}
    }, ensure_ascii=False).encode("utf-8")
    errors = []
    for model in MODELS:
        for attempt in range(3):
            req = urllib.request.Request(
                ENDPOINT + model + ":generateContent", data=body,
                headers={"Content-Type": "application/json", "x-goog-api-key": key},
                method="POST")
            try:
                with urllib.request.urlopen(req, timeout=90) as response:
                    obj = json.load(response)
                parts = obj["candidates"][0]["content"]["parts"]
                result = json.loads("".join(p.get("text", "") for p in parts))
                if not isinstance(result, dict):
                    raise ValueError("Gemini response is not a JSON object")
                return result, model
            except urllib.error.HTTPError as exc:
                errors.append(f"{model}: HTTP {exc.code}")
                if exc.code in (429, 500, 502, 503, 504) and attempt < 2:
                    time.sleep(5 * (attempt + 1) + random.uniform(0, 2))
                    continue
                break
            except (ValueError, KeyError, IndexError, TimeoutError, urllib.error.URLError) as exc:
                errors.append(f"{model}: {type(exc).__name__}")
                if attempt < 2:
                    time.sleep(2 * (attempt + 1))
                    continue
                break
    raise RuntimeError("No Gemini model available (" + "; ".join(errors[-4:]) + ")")

def chapter_source(number):
    result = subprocess.run(
        ["node", "tools/export_verne_chapter.cjs", str(number)],
        cwd=ROOT, check=True, capture_output=True, text=True, timeout=35)
    obj = json.loads(result.stdout)
    if obj["chapterOneBased"] != number:
        raise RuntimeError("Chapter mismatch")
    return obj

def review_window(key, chapter, window):
    ids = [row["index"] for row in window]
    payload = {
        "role": "Bilingual literary editorial checker, not creative fiction author",
        "task": ("Compare the English original against the existing Arabic draft. "
                 "Detect missing meanings, additions, mistranslated proper nouns, chronology, "
                 "untranslated words and unnatural Arabic. Return only findings, with "
                 "minimal proposed Arabic replacement when necessary. Preserve complete "
                 "paragraph alignment and original meaning; do not invent source passages. "
                 "Never claim rights clearance or publication approval."),
        "required_json": {
            "findings": [{"index": 0, "severity": "minor|major|critical",
                          "issue": "short Arabic description",
                          "suggestedArabic": "corrected full paragraph or empty string"}],
            "qualityNotes": "brief Arabic summary"
        },
        "chapter": chapter, "paragraphs": window
    }
    result, model = call_gemini(key, payload)
    findings = result.get("findings")
    if not isinstance(findings, list) or len(findings) > len(window) * 4:
        raise RuntimeError("Malformed findings")
    for finding in findings:
        if (not isinstance(finding, dict) or type(finding.get("index")) is not int
                or finding["index"] not in ids
                or finding.get("severity") not in ("minor", "major", "critical")
                or not isinstance(finding.get("issue"), str)
                or not isinstance(finding.get("suggestedArabic"), str)):
            raise RuntimeError("Invalid finding fields or paragraph index")
    return {"model": model, "findings": findings,
            "qualityNotes": str(result.get("qualityNotes", ""))[:1500]}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--chapter", type=int, default=1)
    parser.add_argument("--max-batches", type=int, default=4)
    args = parser.parse_args()
    if not 1 <= args.chapter <= 37 or not 1 <= args.max_batches <= 15:
        parser.error("chapter 1..37 and max-batches 1..15 required")
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise RuntimeError("Missing GEMINI_API_KEY Actions secret")
    source = chapter_source(args.chapter)
    rows = source["paragraphs"]
    dest = DEST / f"chapter-{args.chapter:02d}"
    dest.mkdir(parents=True, exist_ok=True)
    completed = 0
    for offset in range(0, len(rows), BATCH_SIZE):
        window = rows[offset:offset + BATCH_SIZE]
        identity = {
            "version": PROMPT_VERSION,
            "chapter": args.chapter,
            "sourceFileShas256": source["sourceFileShas256"],
            "paragraphs": window,
        }
        identity_hash = digest(json.dumps(identity, ensure_ascii=False, sort_keys=True).encode("utf-8"))
        output = dest / f"review-{offset:04d}-{identity_hash[:16]}.json"
        if output.exists():
            existing = json.loads(output.read_text("utf-8"))
            if existing.get("inputSha256") != identity_hash:
                raise RuntimeError("Checkpoint integrity mismatch: " + str(output))
            print("REUSED", output.relative_to(ROOT), flush=True)
            continue
        if completed >= args.max_batches:
            break
        result = review_window(key, args.chapter, window)
        document = {
            "status": "AI_EDITORIAL_DRAFT_NOT_APPROVED_NOT_PUBLISHED",
            "source": "committed Lingua Tales 37-chapter Towle English and Arabic draft",
            "chapterOneBased": args.chapter,
            "paragraphIndices": [r["index"] for r in window],
            "inputSha256": identity_hash,
            "promptVersion": PROMPT_VERSION,
            "originalSourceFileSha256": source["sourceFileShas256"][-1],
            "publicationApproved": False, "rightsVerified": False,
            "result": result
        }
        data = (json.dumps(document, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
        temp = output.with_suffix(".tmp")
        temp.write_bytes(data)
        temp.replace(output)
        print("STAGED", output.relative_to(ROOT), "SHA256", digest(data), flush=True)
        completed += 1
    all_windows = list(range(0, len(rows), BATCH_SIZE))
    checkpoint_files = sorted(dest.glob("review-*.json"))
    matched = set()
    for file in checkpoint_files:
        record = json.loads(file.read_text("utf-8"))
        indices = record.get("paragraphIndices", [])
        if indices and indices[0] in all_windows:
            expected_window = rows[indices[0]:indices[0] + BATCH_SIZE]
            identity = {"version": PROMPT_VERSION, "chapter": args.chapter,
                        "sourceFileShas256": source["sourceFileShas256"],
                        "paragraphs": expected_window}
            expected_hash = digest(json.dumps(identity, ensure_ascii=False,
                                              sort_keys=True).encode("utf-8"))
            if record.get("inputSha256") == expected_hash:
                matched.add(indices[0])
    if set(all_windows) == matched:
        marker = dest / "complete.json"
        marker.write_text(json.dumps({
            "status": "AI_REVIEW_COMPLETE_HUMAN_APPROVAL_PENDING",
            "chapter": args.chapter, "paragraphCount": len(rows),
            "windowCount": len(all_windows), "reviewedWindowOffsets": sorted(matched),
            "sourceSha256": source["sourceFileShas256"][-1],
            "rightsVerified": False, "published": False
        }, ensure_ascii=False, indent=2) + chr(10), encoding="utf-8")
        print("Chapter", args.chapter, "AI editorial review coverage complete; human review still pending")
    print("New editorial review batches:", completed, "new books: 0, new images: 0")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Do not log request payloads, secrets, or user data.
        print("Gemini editorial pipeline stopped:", type(exc).__name__, str(exc)[:250],
              file=sys.stderr)
        raise SystemExit(1)
