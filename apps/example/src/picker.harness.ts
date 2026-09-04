import { describe, expect, it } from 'react-native-harness';
import { Platform } from 'react-native';
import { documentPicker, mediaPicker } from 'react-native-nitro-media-picker';

// These tests execute against the installed native library. Valid selection and
// file copying need a real user-selected handle and remain manual device tests.
describe('Picker native smoke tests', () => {
  it('constructs both registered native HybridObjects', () => {
    expect(mediaPicker.toString()).toBe('[HybridObject MediaPicker]');
    expect(documentPicker.toString()).toBe('[HybridObject DocumentPicker]');
    expect(typeof mediaPicker.pickAssets).toBe('function');
    expect(typeof documentPicker.pickDocuments).toBe('function');
  });

  it('reads photo permission without presenting a prompt', async () => {
    const status = await mediaPicker.getPermissionStatus();
    expect(['not-determined', 'granted', 'limited', 'denied']).toContain(
      status,
    );
    if (Platform.OS === 'android') expect(status).toBe('granted');
  });

  it('rejects empty media filters before asking permission or presenting UI', async () => {
    // Native validation may throw synchronously or reject its Promise.
    await expect(
      Promise.resolve().then(() => mediaPicker.pickAssets({ mediaTypes: [] })),
    ).rejects.toThrow();
  });

  it('rejects invalid selection limits before asking permission or presenting UI', async () => {
    for (const maxSelectionCount of [0, -1, 1.5, 2_147_483_648]) {
      await expect(
        Promise.resolve().then(() =>
          mediaPicker.pickAssets({ mediaTypes: ['image'], maxSelectionCount }),
        ),
      ).rejects.toThrow();
    }
  });

  it('rejects empty document filters before presenting UI', async () => {
    await expect(
      Promise.resolve().then(() =>
        documentPicker.pickDocuments({ mimeTypes: [] }),
      ),
    ).rejects.toThrow();
  });

  it('rejects extensions and malformed MIME filters before presenting UI', async () => {
    for (const mimeType of ['.pdf', 'pdf', '*/pdf', 'image/']) {
      await expect(
        Promise.resolve().then(() =>
          documentPicker.pickDocuments({ mimeTypes: [mimeType] }),
        ),
      ).rejects.toThrow();
    }
  });
});
