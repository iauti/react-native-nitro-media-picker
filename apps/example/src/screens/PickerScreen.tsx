import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '@/components/ActionButton';
import { SelectionCard } from '@/components/SelectionCard';
import { usePickerExample } from '@/hooks/usePickerExample';

export default function PickerScreen() {
  const picker = usePickerExample();
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>NITRO MEDIA PICKER</Text>
        <Text style={styles.title}>Your files,{'\n'}on demand.</Text>
        <Text style={styles.body}>
          Choose photos, videos, or documents. Copy only the files you need.
        </Text>
        <View style={styles.row}>
          <Text style={styles.heading}>Multiple selection</Text>
          <Switch
            accessibilityLabel="Multiple selection"
            value={picker.multiple}
            onValueChange={picker.setMultiple}
            disabled={picker.isBusy}
            trackColor={{ true: '#059669' }}
          />
        </View>
        <Text style={styles.heading}>01 / Media library</Text>
        <View style={styles.actions}>
          <ActionButton
            label="Photos"
            onPress={picker.pickPhotos}
            disabled={picker.isBusy}
          />
          <ActionButton
            label="Videos"
            onPress={picker.pickVideos}
            disabled={picker.isBusy}
          />
          <ActionButton
            label="Photos + videos"
            onPress={picker.pickMixed}
            disabled={picker.isBusy}
          />
          <ActionButton
            label="Check / request access"
            onPress={picker.requestPermission}
            disabled={picker.isBusy}
          />
        </View>
        <Text style={styles.heading}>02 / Documents</Text>
        <View style={styles.actions}>
          <ActionButton
            label="Any file"
            onPress={picker.pickAnyFile}
            disabled={picker.isBusy}
          />
          <ActionButton
            label="PDF documents"
            onPress={picker.pickPdf}
            disabled={picker.isBusy}
          />
        </View>
        <Text style={styles.heading}>03 / Copy destination</Text>
        <Text style={styles.body}>
          An absolute path in app storage. Copying replaces this file. Change
          the name to keep separate copies.
        </Text>
        <TextInput
          accessibilityLabel="Copy destination path"
          style={styles.input}
          value={picker.destination}
          onChangeText={picker.setDestination}
          editable={!picker.isBusy}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        <View style={styles.console}>
          <Text
            accessibilityLiveRegion="polite"
            selectable
            style={styles.status}
          >
            {picker.status}
          </Text>
          {picker.progressLabel !== null && (
            <>
              <View style={styles.track}>
                <View
                  style={[styles.progress, { width: picker.progressWidth }]}
                />
              </View>
              <Text style={styles.progressLabel}>{picker.progressLabel}</Text>
            </>
          )}
        </View>
        {picker.items.map((item) => (
          <SelectionCard
            key={item.key}
            name={item.name}
            details={item.details}
            onSave={item.onSave}
            disabled={picker.saveDisabled}
          />
        ))}
        <Text style={styles.footnote}>
          Handles last for this session. Cloud providers may download during
          selection or copying.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f172a' },
  container: {
    padding: 24,
    paddingBottom: 48,
    gap: 18,
    width: '100%',
    maxWidth: 740,
    alignSelf: 'center',
  },
  eyebrow: {
    color: '#6ee7b7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: { color: '#f8fafc', fontSize: 42, fontWeight: '800', lineHeight: 47 },
  body: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
  heading: { color: '#e2e8f0', fontSize: 15, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  input: {
    color: '#e2e8f0',
    fontSize: 13,
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 70,
  },
  console: {
    gap: 12,
    backgroundColor: '#071321',
    borderRadius: 14,
    padding: 18,
  },
  status: { color: '#a7f3d0', fontSize: 13, lineHeight: 20 },
  track: {
    height: 5,
    backgroundColor: '#26374d',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: { height: 5, backgroundColor: '#6ee7b7' },
  progressLabel: { color: '#6ee7b7', fontSize: 12 },
  footnote: { color: '#64748b', fontSize: 12, lineHeight: 19 },
});
