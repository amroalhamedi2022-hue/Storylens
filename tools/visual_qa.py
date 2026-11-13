#!/usr/bin/env python3
"""Lingua Tales screenshot/reference comparison. Never self-approves a reference."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageStat


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_name(name: str) -> Path:
    p = Path(name)
    if p.is_absolute() or p.suffix.lower() != ".png" or not p.parts or any(part in ("", ".", "..") for part in p.parts):
        raise ValueError(f"Unsafe screenshot name: {name!r}")
    return p


def render_pair(reference: Path, actual: Path, output: Path, options: dict) -> dict:
    tolerance = int(options.get("pixel_tolerance", 18))
    max_changed = float(options.get("max_changed_fraction", 0.015))
    max_mean = float(options.get("max_mean_error", 0.015))
    if not (0 <= tolerance <= 255 and 0 <= max_changed <= 1 and 0 <= max_mean <= 1):
        raise ValueError("Invalid comparison thresholds")
    with Image.open(reference) as original, Image.open(actual) as current:
        a, b = original.convert("RGB"), current.convert("RGB")
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas = Image.new("RGB", (a.width + b.width, max(a.height, b.height) + 26), "#20232B")
    canvas.paste(a, (0, 26))
    canvas.paste(b, (a.width, 26))
    d = ImageDraw.Draw(canvas)
    d.text((8, 6), "APPROVED REFERENCE", fill="white")
    d.text((a.width + 8, 6), "ACTUAL RENDER", fill="white")
    canvas.save(output.with_suffix(".side-by-side.png"))
    if a.size != b.size:
        return {"status": "FAIL", "error": "image_dimensions_mismatch", "reference_size": a.size, "actual_size": b.size}
    valid = Image.new("L", a.size, 255)
    painter = ImageDraw.Draw(valid)
    for rect in options.get("ignore_rectangles", []):
        if not isinstance(rect, list) or len(rect) != 4 or any(type(n) is not int for n in rect):
            raise ValueError("ignore_rectangles requires [x,y,width,height] integers")
        x, y, w, h = rect
        if min(x, y) < 0 or min(w, h) <= 0 or x + w > a.width or y + h > a.height:
            raise ValueError(f"Invalid ignore rectangle: {rect}")
        painter.rectangle((x, y, x + w - 1, y + h - 1), fill=0)
    valid_pixels = valid.histogram()[255]
    if valid_pixels == 0:
        raise ValueError("Cannot mask the entire screenshot")
    difference = ImageChops.difference(a, b)
    r, g, blue = difference.split()
    max_channel = ImageChops.lighter(ImageChops.lighter(r, g), blue)
    changed = max_channel.point(lambda value: 255 if value > tolerance else 0)
    changed = ImageChops.multiply(changed, valid)
    changed_pixels = changed.histogram()[255]
    changed_fraction = changed_pixels / valid_pixels
    mean_error = sum(ImageStat.Stat(difference, mask=valid).mean) / (3 * 255)
    Image.blend(a, b, 0.5).save(output.with_suffix(".overlay.png"))
    Image.composite(Image.new("RGB", a.size, "#FF1E48"), b, changed).save(output.with_suffix(".diff.png"))
    return {
        "status": "PASS" if changed_fraction <= max_changed and mean_error <= max_mean else "FAIL",
        "reference_size": list(a.size), "actual_size": list(b.size),
        "changed_pixels": changed_pixels, "valid_pixels": valid_pixels,
        "changed_fraction": round(changed_fraction, 6), "mean_error": round(mean_error, 6),
        "changed_bounds": list(changed.getbbox()) if changed.getbbox() else None,
        "pixel_tolerance": tolerance, "max_changed_fraction": max_changed,
        "max_mean_error": max_mean,
    }


def check(actual_dir: Path, references: Path, output: Path) -> tuple[dict, int]:
    manifest_file = references / "approved.json"
    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    if manifest.get("schema_version") != 1 or not isinstance(manifest.get("approved_references"), dict):
        raise ValueError("Invalid approved references manifest")
    approved = manifest["approved_references"]
    actuals = {p.relative_to(actual_dir).as_posix(): p for p in actual_dir.rglob("*.png") if p.is_file()}
    if not actuals:
        raise ValueError("No captured screenshots: cannot claim visual QA")
    for name in actuals.keys() | approved.keys():
        validate_name(name)
    results = {}
    for name in sorted(actuals.keys() | approved.keys()):
        record = approved.get(name)
        if record is None:
            results[name] = {"status": "PENDING_REFERENCE", "reason": "No owner-approved reference registered"}
            continue
        if not isinstance(record, dict) or not isinstance(record.get("sha256"), str) or len(record["sha256"]) != 64:
            raise ValueError(f"Approved reference {name}: sha256 is required")
        reference = references / name
        if name not in actuals or not reference.is_file():
            results[name] = {"status": "FAIL", "error": "Missing captured image or approved reference"}
            continue
        if digest(reference) != record["sha256"].lower():
            results[name] = {"status": "FAIL", "error": "Approved reference hash mismatch"}
            continue
        result = render_pair(reference, actuals[name], output / Path(name).with_suffix(""), record)
        result["reference_sha256"] = record["sha256"]
        result["actual_sha256"] = digest(actuals[name])
        results[name] = result
    counts = {status: sum(row["status"] == status for row in results.values()) for status in ("PASS", "FAIL", "PENDING_REFERENCE")}
    summary = {"overall": "FAIL" if counts["FAIL"] else ("PENDING_REFERENCE" if counts["PENDING_REFERENCE"] else "PASS"),
               "counts": counts, "screens": results,
               "note": "Browser screenshots are not Android-device approval. PENDING_REFERENCE is not a visual PASS."}
    output.mkdir(parents=True, exist_ok=True)
    (output / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"overall": summary["overall"], "counts": counts}, indent=2))
    return summary, int(counts["FAIL"] > 0)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--actual-dir", type=Path, required=True)
    parser.add_argument("--references", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    _, code = check(args.actual_dir, args.references, args.out)
    return code


if __name__ == "__main__":
    raise SystemExit(main())
