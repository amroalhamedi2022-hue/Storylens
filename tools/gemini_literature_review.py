#!/usr/bin/env python3
"""Gemini-assisted review of existing historical plate metadata; never auto-publish."""
import hashlib
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "docs/literature/VERNE_FOUR_ADDITIONAL_PLATES_QUEUE.json"
MANIFEST = ROOT / "docs/literature/staging/verne-period-plates-20261105/manifest.json"
OUTPUT = ROOT / "docs/literature/staging/gemini-reviews/verne-four-review.json"
MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
API = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent"

def request_review(payload):
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        raise RuntimeError("GEMINI_API_KEY missing from Actions secrets")
    body = json.dumps({
        "contents": [{"role": "user", "parts": [{"text": json.dumps(payload, ensure_ascii=False)}]}],
        "generationConfig": {"temperature": 0, "responseMimeType": "application/json"}
    }).encode()
    req = urllib.request.Request(API, data=body, method="POST",
        headers={"Content-Type": "application/json", "x-goog-api-key": key})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=75) as response:
                answer = json.load(response)
            text = answer["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except urllib.error.HTTPError as exc:
            if exc.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(5 * (attempt + 1))
                continue
            raise RuntimeError("Gemini HTTP " + str(exc.code)) from None

def main():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))["queue"]
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))["images"]
    indexed = {row["id"]: row for row in manifest}
    rows = []
    for item in queue:
        entry = indexed[item["id"]]
        path = MANIFEST.parent / entry["localFile"]
        if not path.is_file():
            raise RuntimeError("Missing local image: " + path.name)
        actual_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual_hash != entry["sourceSha256"]:
            raise RuntimeError("SHA256 mismatch: " + path.name)
        rows.append({
            "id": item["id"], "chapter": item["chapterOneBased"],
            "scene": item["scene"], "caption": item.get("originalCaption", ""),
            "englishTextNeedle": item.get("englishTextNeedle", ""),
            "altAr": item.get("altAr", ""), "altEn": item.get("altEn", ""),
            "sourcePage": item["sourcePage"], "sha256": actual_hash,
        })
    result = request_review({
        "task": "Literature editorial assistant. Review ONLY metadata for four authentic 1873 Verne engravings. Do not claim to have viewed the images or checked the actual chapter text. Flag suspicious chapter/scene/caption mismatch and suggest precise Arabic/English alt text. Do not certify rights, translation or publication.",
        "requiredOutput": {
            "reviews": [{"id": "one of supplied ids", "potentialMismatch": True,
                         "reason": "brief", "suggestedAltAr": "brief",
                         "suggestedAltEn": "brief"}]
        }, "items": rows
    })
    if not isinstance(result, dict) or not isinstance(result.get("reviews"), list):
        raise RuntimeError("Gemini returned invalid review structure")
    allowed = {r["id"] for r in rows}
    if {r.get("id") for r in result["reviews"]} != allowed or len(result["reviews"]) != len(rows):
        raise RuntimeError("Gemini review IDs do not match input")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps({
        "status": "AI_METADATA_SUGGESTIONS_ONLY_NOT_RIGHTS_CLEARED_NOT_PUBLISHED",
        "model": MODEL, "inputImageCount": len(rows),
        "imagePixelsReviewed": False, "rightsVerified": False,
        "reviews": result["reviews"]
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Gemini reviewed metadata for", len(rows), "already-staged images; 0 new images; no publication")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print("Review failed:", str(exc).replace(os.environ.get("GEMINI_API_KEY", "") or "__NO_KEY__", "[REDACTED]"), file=sys.stderr)
        raise SystemExit(1)
