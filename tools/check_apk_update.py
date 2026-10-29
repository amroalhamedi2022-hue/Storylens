#!/usr/bin/env python3
"""Read-only Android APK update preflight. Does not install or modify data."""
from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
import re
import subprocess
import sys


@dataclass(frozen=True)
class ApkIdentity:
    package: str
    version_code: int
    signer_sha256: str


def parse_badging(text: str) -> tuple[str, int]:
    match = re.search(r"^package:\s+name='([^']+)'\s+versionCode='(\d+)'", text, re.M)
    if not match:
        raise ValueError("Could not read APK package/versionCode from aapt dump badging")
    return match.group(1), int(match.group(2))


def parse_signer(text: str) -> str:
    # apksigner may also print SHA-1/MD5; only compare the full certificate SHA-256.
    matches = re.findall(r"Signer #\d+ certificate SHA-256 digest:\s*([0-9a-fA-F:]+)", text)
    if len(matches) != 1:
        raise ValueError("Expected exactly one APK signing certificate SHA-256 digest")
    digest = matches[0].replace(":", "").lower()
    if not re.fullmatch(r"[0-9a-f]{64}", digest):
        raise ValueError("Malformed signing certificate fingerprint")
    return digest


def inspect(path: Path, aapt: str, apksigner: str) -> ApkIdentity:
    if not path.is_file():
        raise ValueError(f"APK not found: {path}")
    def invoke(*args: str) -> str:
        try:
            return subprocess.run(args, capture_output=True, text=True, check=True).stdout
        except FileNotFoundError as exc:
            raise ValueError(f"Missing Android SDK utility: {args[0]}") from exc
        except subprocess.CalledProcessError as exc:
            raise ValueError(f"Android utility failed on {path}: {exc.stderr.strip()}") from exc
    package, version = parse_badging(invoke(aapt, "dump", "badging", str(path)))
    cert = parse_signer(invoke(apksigner, "verify", "--print-certs", str(path)))
    return ApkIdentity(package, version, cert)


def diagnose(installed: ApkIdentity, candidate: ApkIdentity) -> tuple[bool, str]:
    if installed.package != candidate.package:
        return False, "DIFFERENT_PACKAGE: this is another application, not an in-place update."
    if installed.signer_sha256 != candidate.signer_sha256:
        return False, ("SIGNATURE_MISMATCH: Android cannot update an installed app with a "
                       "different signing certificate. Export a backup BEFORE any uninstall; "
                       "re-sign with the original private key when available.")
    if candidate.version_code < installed.version_code:
        return False, ("VERSION_DOWNGRADE: candidate versionCode is lower than installed; "
                       "build a higher versionCode with the SAME signing key.")
    return True, ("METADATA_COMPATIBLE: package, signing certificate and versionCode permit "
                  "an update; physical device installation remains unverified.")


def main() -> int:
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--installed", required=True, type=Path, help="APK pulled from the device")
    cli.add_argument("--candidate", required=True, type=Path, help="New APK to install")
    cli.add_argument("--aapt", default="aapt")
    cli.add_argument("--apksigner", default="apksigner")
    args = cli.parse_args()
    try:
        current = inspect(args.installed, args.aapt, args.apksigner)
        new = inspect(args.candidate, args.aapt, args.apksigner)
        ok, verdict = diagnose(current, new)
    except ValueError as exc:
        print("ERROR:", exc, file=sys.stderr)
        return 2
    print("Installed:", current.package, "versionCode", current.version_code,
          "cert SHA-256", current.signer_sha256)
    print("Candidate:", new.package, "versionCode", new.version_code,
          "cert SHA-256", new.signer_sha256)
    print(verdict)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
