import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const appRoot = fileURLToPath(new URL('..', import.meta.url));
const read = path => readFileSync(`${appRoot}/${path}`, 'utf8');
for (const path of ['src/App.tsx', 'index.ts', 'app.json', 'src/app/explore.tsx', 'src/components/app-tabs.tsx']) {
  assert(!existsSync(`${appRoot}/${path}`), `Obsolete starter file: ${path}`);
}
assert.equal(JSON.parse(read('package.json')).main, 'expo-router/entry');
assert.match(read('src/app/_layout.tsx'), /<Stack/);
assert.doesNotMatch(read('src/app/_layout.tsx'), /AppTabs|NativeTabs|TabList/);
assert.match(read('src/app/index.tsx').trim(), /^export \{ default \} from '@\/screens\/PickerScreen';$/);
assert.match(read('src/app/index.web.tsx').trim(), /^export \{ default \} from '@\/screens\/WebInstructionsScreen';$/);
assert.doesNotMatch(read('src/screens/WebInstructionsScreen.tsx'), /react-native-nitro|picker-examples|usePickerExample/);
assert.doesNotMatch(read('src/screens/PickerScreen.tsx'), /react-native-nitro|useEffect|async |await /);
assert.match(read('src/hooks/usePickerExample.ts'), /@\/examples\/picker-examples/);
console.log('Example uses one Router stack, route-only entries, native services, and an isolated web page.');
