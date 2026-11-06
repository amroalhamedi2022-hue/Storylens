#!/usr/bin/env python3
"""Read-only archive-wide real Commons original-image integrity and rights audit.

Unlike chapter-image-map checks, this audits *unassigned* original period media
before a chapter match exists. It checks actual local binary SHA256, source
Commons provenance, nonpublication, and duplicates across historic collections.
No remote requests, image generation, release approval or manifest mutation.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/literature/staging"


def is_trusted_https(value: object, host: str) -> bool:
    if not isinstance(value, str):
        return False
    try:
        url = urlparse(value)
        return (url.scheme == "https" and url.hostname == host and
                not url.username and not url.password and bool(url.path))
    except ValueError:
        return False


def check_archive(path: Path, root: Path) -> list[dict]:
    data = json.loads(path.read_text("utf-8"))
    if (not isinstance(data, dict) or not isinstance(data.get("images"), list)
            or not isinstance(data.get("category"), str)
            or not data["category"].startswith("Category:")):
        raise ValueError("Not an original Commons category media manifest: " + str(path))
    if (data.get("publicationApproved") is not False or
            data.get("chapterSceneMatchingComplete") is not False or
            not is_trusted_https(data.get("categoryURL"), "commons.wikimedia.org")):
        raise ValueError("Original source rights/scene/category source approval drift: " + str(path))
    archive_root = path.parent.resolve()
    staging_root = (root / "docs/literature/staging").resolve()
    if not archive_root.is_relative_to(staging_root):
        raise ValueError("Source manifest outside staging root")
    found, names, paths, source_sha, image_sha = [], set(), set(), set(), set()
    for row in data["images"]:
        name = row.get("wikiFile")
        rel = row.get("localPath")
        if (not isinstance(name, str) or not name.startswith("File:")
                or not isinstance(rel, str)):
            raise ValueError("Missing original Commons file identity or local binary path")
        path_bits = PurePosixPath(rel)
        if (path_bits.is_absolute() or ".." in path_bits.parts
                or not rel.startswith("plates/") or not rel.endswith(".webp")):
            raise ValueError("Unsafe original period art local path: " + rel)
        file = (archive_root / rel).resolve()
        if not file.is_relative_to(archive_root) or not file.is_file():
            raise ValueError("Original period image missing/outside archive: " + rel)
        actual = file.read_bytes()
        digest = hashlib.sha256(actual).hexdigest()
        recorded = row.get("webpSha256")
        if (not isinstance(recorded, str) or digest != recorded.lower()
                or len(actual) != row.get("webpBytes")
                or actual[:4] != b"RIFF" or actual[8:12] != b"WEBP"):
            raise ValueError("Period image binary/hash/WEBP signature mismatch: " + rel)
        if (not is_trusted_https(row.get("commonsPage"), "commons.wikimedia.org")
                or not is_trusted_https(row.get("commonsOriginalImageURL"), "upload.wikimedia.org")
                or not is_trusted_https(row.get("downloadURL"), "upload.wikimedia.org")
                or not isinstance(row.get("individualCommonsLicense"), str)
                or not row["individualCommonsLicense"].strip()
                or row.get("sourceProofStatus") != "INDIVIDUAL_COMMONS_METADATA_AND_HASH_RECORDED"
                or row.get("recolouring") is not False or row.get("cropped") is not False
                or row.get("publishedToApp") is not False
                or row.get("editoriallyApproved", False) is not False):
            raise ValueError("Original Commons provenance, rights or image colour unsafe: " + rel)
        orig_sha = row.get("originalCommonsSHA1MetadataOnly")
        if not isinstance(orig_sha, str) or len(orig_sha) != 40 or any(c not in "0123456789abcdef" for c in orig_sha.lower()):
            raise ValueError("Original Commons source SHA1 missing or invalid")
        if name in names or rel in paths or orig_sha in source_sha or digest in image_sha:
            raise ValueError("Duplicate historical image within same source archive: " + rel)
        names.add(name); paths.add(rel); source_sha.add(orig_sha); image_sha.add(digest)
        found.append({"archive": str(path.relative_to(root)), "wikiFile": name,
                      "originalCommonsSHA1": orig_sha, "localSha256": digest,
                      "localPath": str(file.relative_to(root))})
    return found


def audit(root: Path = ROOT) -> dict:
    staging = root / "docs/literature/staging"
    archives = []
    for file in sorted(staging.glob("*/manifest.json")):
        data = json.loads(file.read_text("utf-8"))
        if isinstance(data, dict) and isinstance(data.get("images"), list) and str(data.get("category", "")).startswith("Category:"):
            archives.append(file)
    if not archives:
        raise ValueError("No real Commons historical source archives found")
    items = [item for path in archives for item in check_archive(path, root)]
    if not items:
        raise ValueError("Original Commons archives exist but contain no actual verified images")
    by_source, by_binary = {}, {}
    overlaps = []
    for item in items:
        for key, registry, typ in (("originalCommonsSHA1", by_source, "original source"),
                                   ("localSha256", by_binary, "identical local binary")):
            value = item[key]
            if value in registry and registry[value]["archive"] != item["archive"]:
                overlaps.append({"type": typ, "first": registry[value]["archive"],
                                 "second": item["archive"], "wikiFile": item["wikiFile"]})
            else:
                registry[value] = item
    return {"archiveCount": len(archives), "verifiedOriginalImageFiles": len(items),
            "distinctOriginalCommonsSources": len(by_source),
            "distinctLocalBinaries": len(by_binary),
            "crossArchiveReusedSourceWarnings": overlaps,
            "approvedImagesByThisAudit": 0}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    report = audit()
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print("PASS: real Commons original source archives:", report["archiveCount"],
              "verified actual WebP:", report["verifiedOriginalImageFiles"],
              "cross-archive overlaps:", len(report["crossArchiveReusedSourceWarnings"]),
              "publication approvals: 0")


if __name__ == "__main__":
    main()
