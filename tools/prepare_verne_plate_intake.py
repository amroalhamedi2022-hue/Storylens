#!/usr/bin/env python3
"""Fail-closed, offline-safe intake of *candidate* 1872/1873 Verne plates.

An editor must supply a DIRECT image URL and independently measured SHA-256
for each candidate. This command never changes Android assets, never declares
rights approved, and never promotes an image to the reader.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "docs/literature/VERNE_FOUR_ADDITIONAL_PLATES_QUEUE.json"
EXISTING = ROOT / "docs/literature/HISTORIC_VERNES_ASSETS.json"
ALLOWED_HOSTS = {"upload.wikimedia.org", "www.oldbookillustrations.com"}
MAX_BYTES = 12_000_000
MIN_BYTES = 10_000

def check_submission(submission, queue, existing):
    assert isinstance(submission, list) and submission, "Expected nonempty candidate array"
    by_id = {p["id"]: p for p in queue["queue"]}
    shipped = {p["id"] for p in existing}
    seen = set()
    for row in submission:
        ident = row.get("id")
        assert ident in by_id and ident not in shipped and ident not in seen, "Unknown, duplicate or shipped plate"
        seen.add(ident)
        url = row.get("directImageUrl", "")
        parsed = urlparse(url)
        assert parsed.scheme == "https" and parsed.hostname in ALLOWED_HOSTS, "Unapproved image host"
        assert not parsed.username and not parsed.password and not parsed.fragment, "Unexpected URL component"
        assert re.search(r"\\.(jpe?g|png|webp)$", parsed.path, re.I), "Use a direct image URL, not a source webpage"
        assert re.fullmatch(r"[a-f0-9]{64}", row.get("independentSourceSha256", "")), "Independent SHA-256 required"
        assert row.get("rightsStatus") == "PENDING", "Intake cannot approve territorial redistribution"
        assert row.get("chapterOneBased") == by_id[ident]["chapterOneBased"], "Scene/chapter mismatch"
    return by_id

def download_verified(row):
    request = Request(row["directImageUrl"], headers={"User-Agent": "LinguaTalesArchiveVerifier/1.0"})
    with urlopen(request, timeout=35) as response:
        assert response.geturl().startswith("https://"), "Redirect to non-HTTPS rejected"
        assert urlparse(response.geturl()).hostname in ALLOWED_HOSTS, "Redirect to unapproved host"
        raw = response.read(MAX_BYTES + 1)
    assert MIN_BYTES <= len(raw) <= MAX_BYTES, "Unexpected image size"
    assert hashlib.sha256(raw).hexdigest() == row["independentSourceSha256"], "Source image hash mismatch"
    assert raw.startswith((b"\\xff\\xd8\\xff", b"\\x89PNG\\r\\n\\x1a\\n", b"RIFF")), "Unexpected image format"
    return raw

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--submission", type=Path, required=True, help="JSON array: id, chapterOneBased, directImageUrl, independentSourceSha256, rightsStatus=PENDING")
    parser.add_argument("--output", type=Path, required=True, help="Staging directory outside Android assets")
    parser.add_argument("--download", action="store_true", help="Fetch and hash-verify actual image bytes")
    args = parser.parse_args()
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    existing = json.loads(EXISTING.read_text(encoding="utf-8"))
    submission = json.loads(args.submission.read_text(encoding="utf-8"))
    by_id = check_submission(submission, queue, existing)
    assert not args.output.resolve().is_relative_to((ROOT / "app/src/main/assets").resolve()), "Never write directly to app assets"
    if not args.download:
        print(f"VALIDATED {len(submission)} candidate records; no files downloaded, no release rights approved")
        return
    verified = []
    for row in submission:
        raw = download_verified(row)
        verified.append((row, raw))
    args.output.mkdir(parents=True, exist_ok=True)
    records = []
    for row, raw in verified:
        suffix = Path(urlparse(row["directImageUrl"]).path).suffix.lower()
        dest = args.output / (row["id"] + suffix)
        assert not dest.exists(), "Refuse to overwrite candidate"
        dest.write_bytes(raw)
        record = dict(by_id[row["id"]])
        record.update({"candidateFile": dest.name, "directImageUrl": row["directImageUrl"],
                       "sourceSha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw),
                       "scanStatus": "DOWNLOADED_UNREVIEWED", "rights": "PENDING",
                       "distributionReviewApproved": False, "published": False})
        records.append(record)
    (args.output / "candidate-manifest.json").write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\\n", encoding="utf-8")
    print(f"STAGED {len(records)} hash-verified image binaries; NOT rights-cleared, NOT published")

if __name__ == "__main__":
    main()
