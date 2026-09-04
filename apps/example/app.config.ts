import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Nitro Media Picker',
  slug: 'nitro-media-picker-example',
  version: '1.0.0',
  scheme: 'nitromediapicker',
  userInterfaceStyle: 'dark',
  ios: {
    bundleIdentifier: 'com.iauti.nitromediapicker.example',
    supportsTablet: true,
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        'Choose photos and videos to test deferred media access.',
    },
  },
  android: { package: 'com.iauti.nitromediapicker.example' },
  web: { output: 'static' },
  plugins: ['expo-router'],
  experiments: { typedRoutes: true },
});
