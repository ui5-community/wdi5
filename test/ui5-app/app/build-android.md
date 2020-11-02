# android

## build app 

-   run `build-android.js` via `yarn _build:android_app`

## notes

deploying to AVD via
```shell
# start emulator
$> emulator -avd <device_name>
$> adb install /Users/<you>/wdi5/test/ui5-app/app/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```
