import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';

export function SelectionCard({
  name,
  details,
  onSave,
  disabled,
}: {
  name: string;
  details: string;
  onSave: () => void;
  disabled: boolean;
}) {
  return (
    <View style={styles.card}>
      <Text selectable style={styles.name}>
        {name}
      </Text>
      <Text style={styles.details}>{details}</Text>
      <ActionButton
        label="Copy to destination"
        onPress={onSave}
        disabled={disabled}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#172338',
    padding: 18,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#26374d',
  },
  name: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  details: { color: '#94a3b8', fontSize: 13 },
});
