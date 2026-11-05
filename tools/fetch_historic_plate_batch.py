#!/usr/bin/env python3
"""Download four identified 1873 book engravings using a CI runner with network.
Quarantine only: NOT cleared for distribution, NOT imported into Android assets.
No website crawling; fetch four manually verified pages and one linked image each.
"""
import hashlib
import io
import json
import os
from pathlib import Path
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "docs/literature/VERNE_FOUR_ADDITIONAL_PLATES_QUEUE.json"
DEST = ROOT / "docs/literature/staging/verne-period-plates-20261105"
HOST = "www.oldbookillustrations.com"
# Slugs manually checked against each page's official 1200px download link.
IDENTIFIED = {
    "verne-1873-a-cry-of-terror": "cry-terror",
    "verne-1873-sleeping-car": "sleeping-car",
    "verne-1873-vessel": "looking-for-vessel",
    "verne-1873-crew": "astonished-crew",
}
USER_AGENT = "LinguaTalesArchiveIntake/1.0 (four verified public-domain-era engravings)"
MAX_IMAGE = 12_000_000


def fetch(url, limit):
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != HOST or parsed.username or parsed.password:
        raise ValueError("Outside the approved HTTPS image archive")
    last_error = None
    for attempt in range(3):
        try:
            req = Request(url, headers={"User-Agent": USER_AGENT})
            with urlopen(req, timeout=35) as resp:
                final = urlparse(resp.geturl())
                if final.scheme != "https" or final.hostname != HOST:
                    raise ValueError("Unapproved redirect")
                content = resp.read(limit + 1)
                if not 100 <= len(content) <= limit:
                    raise ValueError("Unexpected remote response size")
                return content
        except (HTTPError, URLError, TimeoutError) as error:
            last_error = error
            if attempt < 2:
                time.sleep(attempt + 1)
    raise RuntimeError(f"Unable to reach {url}: {last_error}")


def validated_image(raw):
    if not raw.startswith(b"\xff\xd8\xff"):
        raise ValueError("Image was not a JPEG source scan")
    try:
        with Image.open(io.BytesIO(raw)) as img:
            if img.format != "JPEG":
                raise ValueError("Unexpected image format")
            width, height = img.size
            img.verify()
        if min(width, height) < 600 or max(width, height) > 10000:
            raise ValueError("Unexpected scan dimensions")
        return width, height
    except (UnidentifiedImageError, OSError) as error:
        raise ValueError("Invalid archive image") from error


def main():
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    if {r["id"] for r in queue["queue"]} != set(IDENTIFIED):
        raise ValueError("Queue modified; review all source mappings first")
    output = []
    staged_bytes = []
    for entry in queue["queue"]:
        ident = entry["id"]
        slug = IDENTIFIED[ident]
        source_page = f"https://{HOST}/illustrations/{slug}/"
        if entry["sourcePage"] != source_page or entry["rights"] != "PENDING":
            raise ValueError("Unexpected source page or licence change")
        # Read only the four known record pages, never scrape arbitrary links.
        page_html = fetch(source_page, 1_000_000).lower()
        if b"benett" not in page_html or b"1873" not in page_html:
            raise ValueError("Source edition/illustrator identity cannot be established")
        errors = []
        for size in (1200, 768):
            direct = f"https://{HOST}/site/assets/high-res/1873/{slug}-{size}.jpg"
            try:
                raw = fetch(direct, MAX_IMAGE)
                width, height = validated_image(raw)
                break
            except (RuntimeError, ValueError) as error:
                errors.append(str(error))
        else:
            raise RuntimeError(f"No verified scan for {ident}: {'; '.join(errors)}")
        filename = f"{slug}.jpg"
        if (DEST / filename).exists():
            raise ValueError(f"Refusing to overwrite an existing scan: {filename}")
        staged_bytes.append((filename, raw))
        output.append({
            "id": ident,
            "bookId": "around-the-world-in-eighty-days-towle",
            "chapterOneBased": entry["chapterOneBased"],
            "scene": entry["scene"],
            "page": source_page,
            "originalDirectImageUrl": direct,
            "sourceSha256": hashlib.sha256(raw).hexdigest(),
            "bytes": len(raw),
            "width": width,
            "height": height,
            "originalEditionYear": 1873,
            "illustrator": "Leon Benett",
            "localFile": filename,
            "rightsStatus": "PENDING_TERRITORIAL_AND_INDIVIDUAL_SCAN_REVIEW",
            "sourceIdentity": "ARCHIVE_PAGE_CHECKED; SOURCE_HASH_MEASURED_ON_DOWNLOAD; SECONDARY_CHECK_PENDING",
            "publicationStatus": "STAGED_ONLY_NOT_IN_APP",
            "paragraphAnchorStatus": entry["textAnchorStatus"],
        })
        print(f"ACQUIRED {ident}: JPEG {width}x{height}, sha256={output[-1]['sourceSha256']}", flush=True)
        time.sleep(0.35)  # Respect the archive; no bulk crawler.
    DEST.mkdir(parents=True, exist_ok=True)
    for name, raw in staged_bytes:
        (DEST / name).write_bytes(raw)
    (DEST / "manifest.json").write_text(
        json.dumps({"status": "STAGED_NOT_PUBLISHED", "images": output}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print("STAGED 4 verified-format real image binaries; publication and editorial clearance pending.")


if __name__ == "__main__":
    main()
