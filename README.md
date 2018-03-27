# TerraMAionic
An exercise using ionic 3

# The develop project

I used the official instructions to start the project: https://ionicframework.com/docs/intro/tutorial/

## Create base project

Adding the android platform:

```
$ ionic cordova platform add android
```

## install cordova dependencies

Install the Cordova and Ionic Native plugins.

Add the geolocation plugin:

```
$ ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
$ npm install --save @ionic-native/geolocation
```

Add the camera plugin:

```
$ ionic cordova plugin add cordova-plugin-camera
$ npm install --save @ionic-native/camera
```

## Debug at develop mode
To debug in development mode using your browser.

```
$ ionic cordova platform add browser
```

and run it:

```
$ ionic cordova run browser
```

## Adding new pages

To adding the new page called locations, use this command:

```
$ ionic generate page Locations
```

Or:

```
$ ionic g page Locations
```

## Generate images to start icon and splash

Works only if you have an account on ionic, so use this commands:

```
$ ionic setup
$ ionic signup
$ ionic cordova resources -f
```

## Create a storage provider

Based on this example
http://www.fabricadecodigo.com/como-armazenar-dados-offline-com-ionic-storage/

Commands:
```
$ ionic cordova plugin add cordova-sqlite-storage --save
$ npm install --save @ionic/storage
$ ionic g provider LocationsProvider
```

Edit your app.module.ts to include provider configurations.

## Deploy to android device

```
$ ionic cordova run android --release
```
