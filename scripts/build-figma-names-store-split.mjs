import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const primNames = JSON.stringify(data.primitives.map((p) => p.figmaPath));
const semNames = JSON.stringify(data.semantics.map((s) => s.figmaPath));

const storePrim = `figma.root.setSharedPluginData("caelo", "primNames", ${JSON.stringify(primNames)});\nreturn { step: "store-prim", count: ${data.primitives.length} };`;
const storeSem = `figma.root.setSharedPluginData("caelo", "semNames", ${JSON.stringify(semNames)});\nreturn { step: "store-sem", count: ${data.semantics.length} };`;

fs.writeFileSync('scripts/figma-names-only-store-prim.js', storePrim);
fs.writeFileSync('scripts/figma-names-only-store-sem.js', storeSem);
console.log('prim', Buffer.byteLength(storePrim), 'sem', Buffer.byteLength(storeSem));
