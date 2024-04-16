# Dropbox Sign React Native App
React Native app example using the [hellosign-embedded](https://github.com/hellosign/hellosign-embedded) library.

Embedded.js, the library that supports the Dropbox Sign iFrame, cannot run from inside a native app. The current recommendation is to use a WebView to open the Dropbox Sign iFrame.

This basic React Native app shows a way in which that can be achieved.

## Requirements
- iOS device or [iOS Simulator](https://docs.expo.dev/workflow/ios-simulator/).
- Android device or [Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/).
- [Expo Go client](https://expo.dev/go).
- [Expo CLI](https://docs.expo.dev/more/expo-cli/).

## How to use

### Install dependencies:
```sh
npm install
```

### Set Up Environment Variables: 
Create a new file named `.env` in the root of the project and add your Dropbox Sign `API_KEY` and `CLIENT_ID`.

### Start the app:
```
npm start
```

### If a tunnel is needed, then start with:
```bash
expo-cli start --tunnel
```

## Notes

- WebView is currently [not supported](https://docs.expo.dev/versions/latest/sdk/webview/) by [expo-web](https://docs.expo.dev/) on "Web" platform.
- [Expo Router: Docs](https://docs.expo.dev/router/introduction/).
- [React Native: Docs](https://reactnative.dev/docs/getting-started).