import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const primNames = JSON.stringify(data.primitives.map((p) => p.figmaPath));
const semNames = JSON.stringify(data.semantics.map((s) => s.figmaPath));

const storeCode = `figma.root.setSharedPluginData("caelo", "primNames", ${JSON.stringify(primNames)});
figma.root.setSharedPluginData("caelo", "semNames", ${JSON.stringify(semNames)});
return { step: "store-names", primCount: ${data.primitives.length}, semCount: ${data.semantics.length} };`;

const createCode = fs.readFileSync('scripts/figma-names-only-create.js', 'utf8');

fs.writeFileSync('scripts/figma-names-only-store.js', storeCode);
console.log('store bytes', Buffer.byteLength(storeCode));
console.log('create bytes', Buffer.byteLength(createCode));
