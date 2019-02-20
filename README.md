# TerraMAionic
An exercise using ionic 3

https://andre-carvalho.github.io/TerraMAionic/

# Install Ionic

I used the official instructions to install Ionic in my environment: https://ionicframework.com/docs/intro/installation/

We should to have npm nodejs to start!

# The develop project

I used the official instructions to start the project: https://ionicframework.com/docs/intro/tutorial/

## Create base project

Create a blank project:
```
ionic start TerraMAionic blank
```

Adding the android* platform:

```
ionic cordova platform add android
```

*Here is mandatory that you have in your environment the Android SDK and set the ANDROID_HOME environment variable if you want run this project in android device.

## install cordova dependencies

Install the Cordova and Ionic Native plugins.

Add the geolocation plugin:

```
ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
npm install --save @ionic-native/geolocation
```

Add the camera plugin:

```
ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera
```

## Debug at develop mode
To debug in development mode using your browser.

```
ionic cordova platform add browser
```

and run it:

```
ionic serve -l
# OR 
ionic cordova run browser
```

## Adding new pages

To adding the new page called locations, use this command:

```
ionic generate page Locations
```

Or:

```
ionic g page Locations
```

## Generate images to start icon and splash

Works only if you have an account on ionic, so use this commands:

```
ionic setup
ionic signup
ionic cordova resources -f
```

## Create a storage provider

Based on this example
http://www.fabricadecodigo.com/como-armazenar-dados-offline-com-ionic-storage/

Commands:
```
ionic cordova plugin add cordova-sqlite-storage --save
npm install --save @ionic/storage
ionic g provider LocationsProvider
```

Edit your app.module.ts to include provider configurations.


## Build in debug and release

Using the help command to see all options.

```
ionic cordova build --help
```

For generate the unsigned release, on final build, i used this command.
```
ionic cordova build android --prod --release --minifyjs --minifycss --optimizejs
```

## Asign APK

To sign the APK i followed the official instruction in [that page](https://developer.android.com/studio/publish/app-signing#sign-manually).


Tasks:

- Generate a key once (the same key is valid to 10000 ?days?).
- Align APK
- Apply key into apk

```
# Path to Android build tools: /home/andre/Android/Sdk/build-tools/28.0.3

# generate key.
keytool -genkey -v -keystore .keystore/android/attempo-app-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias attempo-alias


# align apk
zipalign -f -v -p 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned-align.apk

# apply signature. Key is in the .keystore directory in project root.
apksigner sign --ks .keystore/android/attempo-app-key.jks --out ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk ./platforms/android/app/build/outputs/apk/release/app-release-unsigned-align.apk

# verify the apk's signature
apksigner verify --verbose ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk
```

## Show min and target android SDK version

```
apkanalyzer -h manifest min-sdk terrama-data-collector.apk
apkanalyzer -h manifest target-sdk terrama-data-collector.apk
```


## Deploy to android device

```
ionic cordova run android --release

# or use adb to push apk to device via USB.
adb install ./platforms/android/app/build/outputs/apk/signed/terrama-data-collector.apk

```


## Reinstall after clone into new environment

To reinstall all packages from package.json we use this steps:

- First install both ionic and cordova cli.(It is an ionic v1 project with android/ios platforms) from your package.json.
```
npm i -g cordova ionic
```

- To install dependencies and devDependencies, do:
```
npm install
```

- To install plugins and platforms as per package.json,
```
ionic cordova prepare
```