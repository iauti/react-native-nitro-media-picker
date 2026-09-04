import { StyleSheet, Text, View } from 'react-native';

export default function WebInstructionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>NITRO MEDIA PICKER</Text>
      <Text style={styles.title}>Your files, on demand.</Text>
      <Text style={styles.body}>
        Photo, video, and document picking runs native Swift and Kotlin code.
        Open the iOS or Android development build to select files and copy them
        into app storage. Expo Go and browsers cannot load this native module.
      </Text>
      <Text style={styles.command}>bun example ios · bun example android</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    padding: 32,
    backgroundColor: '#0f172a',
  },
  eyebrow: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: { color: '#f8fafc', fontSize: 38, fontWeight: '800' },
  body: { maxWidth: 560, color: '#cbd5e1', fontSize: 17, lineHeight: 26 },
  command: { color: '#6ee7b7', fontSize: 14, marginTop: 8 },
});
