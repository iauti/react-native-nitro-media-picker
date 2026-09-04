import { useRef, useState } from 'react';
import {
  copySelection,
  defaultDestination,
  describeSelection,
  pickFiles,
  pickMedia,
  requestMediaPermission,
  type SelectedItem,
} from '@/examples/picker-examples';

export function usePickerExample() {
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [status, setStatus] = useState(
    'Ready to pick. Files stay with their provider until you copy them.',
  );
  const [isBusy, setIsBusy] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [destination, setDestination] = useState(defaultDestination);
  const [progress, setProgress] = useState<number | null>(null);
  const running = useRef(false);

  async function run(action: () => Promise<void>) {
    if (running.current) return;
    running.current = true;
    setIsBusy(true);
    setProgress(null);
    try {
      await action();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      running.current = false;
      setIsBusy(false);
    }
  }

  const media = (types: ('image' | 'video')[]) =>
    run(async () => {
      const result = await pickMedia(types, multiple);
      setItems(result.assets);
      setStatus(
        result.isCanceled
          ? 'Selection canceled.'
          : `${result.assets.length} media handles ready. No bytes copied.`,
      );
    });
  const documents = (pdfOnly: boolean) =>
    run(async () => {
      const result = await pickFiles(pdfOnly, multiple);
      setItems(result.documents);
      setStatus(
        result.isCanceled
          ? 'Selection canceled.'
          : `${result.documents.length} document handles ready to copy.`,
      );
    });
  const save = (item: SelectedItem) =>
    run(async () => {
      setStatus(`Copying ${item.fileName}…`);
      const bytes = await copySelection(item, destination, setProgress);
      setProgress(1);
      setStatus(`Saved ${bytes} bytes to ${destination}`);
    });

  return {
    status,
    isBusy,
    multiple,
    setMultiple,
    destination,
    setDestination,
    progressLabel: progress === null ? null : `${Math.round(progress * 100)}%`,
    progressWidth: `${Math.round((progress ?? 0) * 100)}%` as `${number}%`,
    items: items.map((item) => ({
      ...describeSelection(item),
      onSave: () => save(item),
    })),
    saveDisabled: isBusy || !destination.startsWith('/'),
    requestPermission: () =>
      run(async () =>
        setStatus(`Media permission: ${await requestMediaPermission()}`),
      ),
    pickPhotos: () => media(['image']),
    pickVideos: () => media(['video']),
    pickMixed: () => media(['image', 'video']),
    pickAnyFile: () => documents(false),
    pickPdf: () => documents(true),
  };
}
