#!/usr/bin/env python3
"""Fetch a small, pinned CC-BY offline ambience pack and verify every Git blob before packaging."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "app" / "src" / "main" / "assets"
DEST = ASSETS / "licensed-audio"
SOURCE_REPO = "facebookincubator/Meta-open-sound"
SOURCE_COMMIT = "251c0be57d5d1b3242b91f53e0cde62ab1cb42d9"
LICENSE = "CC BY 4.0"
ATTRIBUTION = ('"Oculus Audio Pack 01" by Oculus VR, LLC '
               '(https://developers.meta.com/vr/downloads/package/oculus-audio-pack-1/), '
               'licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/. '
               'OGG previews are redistributed under the attribution notice in the source repository.')
FILES = [{"id":"forest","file":"forest-loop.ogg","source":"AMBForst_Forest_LOOP_01.ogg","size":1156239,"blob":"3eb5feeca6fd61b4e0f1965f32c15fb0616a06da","kind":"loop","en":"Forest canopy","ar":"أجواء الغابة"},{"id":"night-forest","file":"night-forest.ogg","source":"AMBForst_Night_LOOP_01.ogg","size":903958,"blob":"0c8c918091b45ee61d7a7c13b5e41db4eb3b4619","kind":"loop","en":"Night forest","ar":"غابة ليلية"},{"id":"quiet-room","file":"quiet-room.ogg","source":"AMBHome_RoomTone_LOOP_01.ogg","size":1145434,"blob":"bf2541c9a2092f77b920fd7b4b1b550bd44ebf64","kind":"loop","en":"Quiet room","ar":"غرفة هادئة"},{"id":"lake-shore","file":"lake-shore.ogg","source":"AMBLake_LakeShore_LOOP_01.ogg","size":909591,"blob":"ac8a07b34fe120a3ee70c2700552992246f48bbd","kind":"loop","en":"Lake shore","ar":"شاطئ البحيرة"},{"id":"coastal-waves","file":"coastal-waves.ogg","source":"AMBSea_BeachWavesStonesBirds_LOOP_01.ogg","size":1464255,"blob":"0654661d9086e7e11af33ade5cadcdaa58a5c0da","kind":"loop","en":"Coastal waves and birds","ar":"أمواج ساحلية وطيور"},{"id":"underwater","file":"underwater.ogg","source":"AMBUndwtr_Underwater_LOOP_01.ogg","size":588117,"blob":"1159b8fc1c6303426b8c84126f5723769e4b98eb","kind":"loop","en":"Underwater hush","ar":"هدوء تحت الماء"},{"id":"distant-city","file":"distant-city.ogg","source":"AMBUrbn_CityAmerican_LOOP_01.ogg","size":1493908,"blob":"97c6dafaacef5ef40b42a771c0a7fe971cedb84f","kind":"loop","en":"Distant city","ar":"مدينة بعيدة"},{"id":"book-cafe","file":"book-cafe.ogg","source":"CRWDConv_Restaurant_LOOP_01.ogg","size":925713,"blob":"a47e28792098ffc4bda31a61dc2dcae239bcac98","kind":"loop","en":"Book café murmur","ar":"همهمة مقهى الكتب"},{"id":"rain-cabin","file":"rain-cabin.ogg","source":"RAINInt_ForestCabinRain_LOOP_01.ogg","size":863954,"blob":"28b98d038dc1f17bd81577bc168fa6a27bbf949a","kind":"loop","en":"Rain on a cabin","ar":"مطر على كوخ"},{"id":"forest-rain","file":"forest-rain.ogg","source":"RAINVege_ForestRain_LOOP_01.ogg","size":947485,"blob":"48618d985df2dc9bdbad70579e30aa14408362ce","kind":"loop","en":"Forest rain","ar":"مطر الغابة"},{"id":"city-rain","file":"city-rain.ogg","source":"RAIN_CityRain_LOOP_01.ogg","size":962858,"blob":"fe1078ebcf1d0bc1254356ea78107c175906ed11","kind":"loop","en":"City rain","ar":"مطر المدينة"},{"id":"ocean-waves","file":"ocean-waves.ogg","source":"WATRWave_OceanWaves_LOOP_01.ogg","size":867635,"blob":"3c1108f6ba8410fde697b2296498002f8a4fc062","kind":"loop","en":"Ocean waves","ar":"أمواج المحيط"},{"id":"river-flow","file":"river-flow.ogg","source":"WATRFlow_River_LOOP_01.ogg","size":803453,"blob":"cf2efe4ee437db35f76d9f2c9457cace5909c55f","kind":"loop","en":"River flow","ar":"جريان النهر"},{"id":"waterfall","file":"waterfall.ogg","source":"WATRFall_Waterfall_LOOP_01.ogg","size":835097,"blob":"903dfb081c2236de6f191549b37a9a3cf838afab","kind":"loop","en":"Waterfall","ar":"شلال"},{"id":"wind-birds","file":"wind-birds.ogg","source":"WINDVege_LightWindTreesBirds_LOOP_01.ogg","size":744823,"blob":"44fc6726008fecc2be583bb515d83b1743db0573","kind":"loop","en":"Wind and birds","ar":"رياح وطيور"},{"id":"wind-chimes","file":"wind-chimes.ogg","source":"MUSCChim_WindChimes_LOOP_01.ogg","size":403433,"blob":"f4be8f4c50918a2e096381366b8ee98858180ce7","kind":"loop","en":"Wind chimes","ar":"أجراس الرياح"},{"id":"book-open","file":"book-open.ogg","source":"OBJBook_BookOpen_OS_01.ogg","size":14021,"blob":"a1ec470cc912e568784869b5dca5e54d424f1107","kind":"oneshot","en":"Book opens","ar":"فتح كتاب"},{"id":"page-turn","file":"page-turn.ogg","source":"PAPRHndl_BookPageTurns_OS_01.ogg","size":49762,"blob":"6d1b1cc552c7e0e79006c6aaefcf5d406b13ba00","kind":"oneshot","en":"Page turns","ar":"تقليب صفحات"},{"id":"clock-tick","file":"clock-tick.ogg","source":"CLOCKTick_ClockCreepy_OS_01.ogg","size":69354,"blob":"c81d98a8b1a2413bf13ff25f40be4002c6177ed9","kind":"oneshot","en":"Old clock tick","ar":"دقات ساعة قديمة"},{"id":"forest-birds","file":"forest-birds.ogg","source":"AMBForst_ForestBirds_OS_01.ogg","size":58543,"blob":"3af40cd0b7d614c5215eb6b966a26239c840ca71","kind":"oneshot","en":"Forest birds","ar":"طيور الغابة"}]

def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\\0" + data).hexdigest()

def fetch(entry: dict) -> bytes:
    source_path = "corpora/oculus-audio-pack/ogg/" + entry["source"]
    url = f"https://raw.githubusercontent.com/{SOURCE_REPO}/{SOURCE_COMMIT}/{source_path}"
    request = urllib.request.Request(url, headers={"User-Agent": "LinguaTales-licensed-audio/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            if response.status != 200:
                raise RuntimeError(f"HTTP {response.status} for {entry['source']}")
            data = response.read()
    except (urllib.error.URLError, TimeoutError) as exc:
        raise RuntimeError(f"Could not fetch pinned licensed audio {entry['source']}: {exc}") from exc
    if len(data) != entry["size"]:
        raise RuntimeError(f"Size mismatch for {entry['source']}: {len(data)} != {entry['size']}")
    actual = git_blob_sha(data)
    if actual != entry["blob"]:
        raise RuntimeError(f"Git blob SHA-1 mismatch for {entry['source']}: {actual}")
    if not data.startswith(b"OggS"):
        raise RuntimeError(f"Not an OGG stream: {entry['source']}")
    return data

def main() -> None:
    DEST.mkdir(parents=True, exist_ok=True)
    manifest = {
        "license": LICENSE,
        "sourceRepository": SOURCE_REPO,
        "sourceCommit": SOURCE_COMMIT,
        "attribution": ATTRIBUTION,
        "tracks": []
    }
    total = 0
    for entry in FILES:
        data = fetch(entry)
        (DEST / entry["file"]).write_bytes(data)
        total += len(data)
        manifest["tracks"].append({
            "id": entry["id"], "file": entry["file"], "kind": entry["kind"],
            "en": entry["en"], "ar": entry["ar"], "sourceFile": entry["source"],
            "sizeBytes": entry["size"], "gitBlobSha1": entry["blob"],
            "license": LICENSE, "sourceCommit": SOURCE_COMMIT
        })
        print(f"PASS {entry['id']}: {len(data)} bytes; Git blob {entry['blob']}")
    (DEST / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\\n", encoding="utf-8")
    (ASSETS / "LICENSE_AUDIO.txt").write_text(
        ATTRIBUTION + "\\nSource repository: https://github.com/" + SOURCE_REPO +
        "\\nPinned commit: " + SOURCE_COMMIT +
        "\\nAll 20 selected OGG files are redistributed unchanged except for local filename mapping.\\n",
        encoding="utf-8"
    )
    print(f"PASS: {len(FILES)} pinned CC-BY audio files verified ({total} bytes total).")
    print("No network access is used by the app at runtime; these files are packaged into Android assets.")

if __name__ == "__main__":
    main()
