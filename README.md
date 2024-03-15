# Dropbox Sign React Native App
React Native app example using the [hellosign-embedded](https://github.com/hellosign/hellosign-embedded) library.

Embedded.js, the library that supports the Dropbox Sign iFrame, cannot run from inside a native app. The current recommendation is to use a WebView to open the Dropbox Sign iFrame.

## Requirements
- iOS device or [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).
- Android device or [Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).

## How to use

```sh
npx create-expo-app -e with-router
```

## Notes

- WebView is currently [not supported](https://docs.expo.dev/versions/latest/sdk/webview/) by [expo-web](https://docs.expo.dev/) on "Web" platform.
- [Expo Router: Docs](https://docs.expo.dev/router/introduction/).
- [React Native: Docs](https://reactnative.dev/docs/getting-started).