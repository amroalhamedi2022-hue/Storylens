# Lingua Tales — licensed audio provenance

## Selected assets

The app packages **20 looped ambience recordings and four short sound effects** from the Oculus Audio Pack 01 OGG previews, distributed by the public `facebookincubator/Meta-open-sound` repository.

- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Required attribution:** “Oculus Audio Pack 01” by Oculus VR, LLC (https://developers.meta.com/vr/downloads/package/oculus-audio-pack-1/), licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/.
- **Pinned source repository:** https://github.com/facebookincubator/Meta-open-sound
- **Source commit:** `251c0be57d5d1b3242b91f53e0cde62ab1cb42d9`
- **Integrity:** `tools/fetch_licensed_audio.py` checks each source byte length, Git blob SHA-1 and OGG signature before copying it into the Android assets. The runtime never fetches audio from the internet.
- **Transformations:** source OGG previews are redistributed unchanged; only the app-local filenames differ. The source repository notes that the OGG previews were transcoded from original WAVs.
- **Runtime:** audio is optional and begins only after an explicit user tap. No microphone, TTS, autoplay or runtime network access is added.

| App ID | Local file | Source file | Type | Bytes | Source Git blob SHA-1 |
|---|---|---|---|---:|---|
| forest | `forest-loop.ogg` | `AMBForst_Forest_LOOP_01.ogg` | loop | 1156239 | `3eb5feeca6fd61b4e0f1965f32c15fb0616a06da` |
| night-forest | `night-forest.ogg` | `AMBForst_Night_LOOP_01.ogg` | loop | 903958 | `0c8c918091b45ee61d7a7c13b5e41db4eb3b4619` |
| quiet-room | `quiet-room.ogg` | `AMBHome_RoomTone_LOOP_01.ogg` | loop | 1145434 | `bf2541c9a2092f77b920fd7b4b1b550bd44ebf64` |
| lake-shore | `lake-shore.ogg` | `AMBLake_LakeShore_LOOP_01.ogg` | loop | 909591 | `ac8a07b34fe120a3ee70c2700552992246f48bbd` |
| coastal-waves | `coastal-waves.ogg` | `AMBSea_BeachWavesStonesBirds_LOOP_01.ogg` | loop | 1464255 | `0654661d9086e7e11af33ade5cadcdaa58a5c0da` |
| underwater | `underwater.ogg` | `AMBUndwtr_Underwater_LOOP_01.ogg` | loop | 588117 | `1159b8fc1c6303426b8c84126f5723769e4b98eb` |
| distant-city | `distant-city.ogg` | `AMBUrbn_CityAmerican_LOOP_01.ogg` | loop | 1493908 | `97c6dafaacef5ef40b42a771c0a7fe971cedb84f` |
| book-cafe | `book-cafe.ogg` | `CRWDConv_Restaurant_LOOP_01.ogg` | loop | 925713 | `a47e28792098ffc4bda31a61dc2dcae239bcac98` |
| rain-cabin | `rain-cabin.ogg` | `RAINInt_ForestCabinRain_LOOP_01.ogg` | loop | 863954 | `28b98d038dc1f17bd81577bc168fa6a27bbf949a` |
| forest-rain | `forest-rain.ogg` | `RAINVege_ForestRain_LOOP_01.ogg` | loop | 947485 | `48618d985df2dc9bdbad70579e30aa14408362ce` |
| city-rain | `city-rain.ogg` | `RAIN_CityRain_LOOP_01.ogg` | loop | 962858 | `fe1078ebcf1d0bc1254356ea78107c175906ed11` |
| ocean-waves | `ocean-waves.ogg` | `WATRWave_OceanWaves_LOOP_01.ogg` | loop | 867635 | `3c1108f6ba8410fde697b2296498002f8a4fc062` |
| river-flow | `river-flow.ogg` | `WATRFlow_River_LOOP_01.ogg` | loop | 803453 | `cf2efe4ee437db35f76d9f2c9457cace5909c55f` |
| waterfall | `waterfall.ogg` | `WATRFall_Waterfall_LOOP_01.ogg` | loop | 835097 | `903dfb081c2236de6f191549b37a9a3cf838afab` |
| wind-birds | `wind-birds.ogg` | `WINDVege_LightWindTreesBirds_LOOP_01.ogg` | loop | 744823 | `44fc6726008fecc2be583bb515d83b1743db0573` |
| wind-chimes | `wind-chimes.ogg` | `MUSCChim_WindChimes_LOOP_01.ogg` | loop | 403433 | `f4be8f4c50918a2e096381366b8ee98858180ce7` |
| farm | `farm.ogg` | `AMBFarm_FarmGeneric_LOOP_01.ogg` | loop | 1763215 | `4626085b1d23ac38f0806e178cb19aef165181d2` |
| european-city | `european-city.ogg` | `AMBUrbn_CityEuroDaytime_LOOP_01.ogg` | loop | 1558032 | `63d4d56dd1e7fc2fa158b5e67d1a11d8c13b8af5` |
| creek-in-woods | `creek-in-woods.ogg` | `WATRFlow_CreekInWoods_LOOP_01.ogg` | loop | 1208188 | `f984fec3a818b76e435745475766ddae9a5e998f` |
| water-lapping | `water-lapping.ogg` | `WATRLap_WaterLapping_LOOP_01.ogg` | loop | 1128762 | `85b791df8fb7fabf6f5d72bbde4c2f99e4a93c94` |
| book-open | `book-open.ogg` | `OBJBook_BookOpen_OS_01.ogg` | oneshot | 14021 | `a1ec470cc912e568784869b5dca5e54d424f1107` |
| page-turn | `page-turn.ogg` | `PAPRHndl_BookPageTurns_OS_01.ogg` | oneshot | 49762 | `6d1b1cc552c7e0e79006c6aaefcf5d406b13ba00` |
| clock-tick | `clock-tick.ogg` | `CLOCKTick_ClockCreepy_OS_01.ogg` | oneshot | 69354 | `c81d98a8b1a2413bf13ff25f40be4002c6177ed9` |
| forest-birds | `forest-birds.ogg` | `AMBForst_ForestBirds_OS_01.ogg` | oneshot | 58543 | `3af40cd0b7d614c5215eb6b966a26239c840ca71` |

The full attribution is also copied into the packaged `app/src/main/assets/LICENSE_AUDIO.txt`. This provenance record does not replace a separate review of the app's overall distribution and privacy obligations.
