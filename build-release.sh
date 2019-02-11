#!/bin/bash

# build using the production option
ionic cordova build android --prod --release --minifyjs --minifycss --optimizejs

# align apk
zipalign -f -v -p 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned-align.apk

# apply signature. Key is in the .keystore directory in project root.
apksigner sign --ks .keystore/android/attempo-app-key-v2.jks --out ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned-align.apk

# verify the apk's signature
apksigner verify --verbose ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk

cp ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk terrama-data-collector.apk

# verify Android SDK versions
apkanalyzer -h manifest min-sdk terrama-data-collector.apk
apkanalyzer -h manifest target-sdk terrama-data-collector.apk