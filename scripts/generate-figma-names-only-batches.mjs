/**
 * Generate Figma MCP batches that create variable NAMES only (placeholder #cccccc).
 * Source: scripts/figma-theme-token-data.json (from src/theme.css).
 */
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const BATCH = 80;
const PLACEHOLDER = { r: 0.8, g: 0.8, b: 0.8, a: 1 };

const SC_FILL = ['FRAME_FILL', 'SHAPE_FILL'];
const SC_TEXT = ['TEXT_FILL'];
const SC_STROKE = ['STROKE_COLOR'];

function scopeFor(path) {
  if (path.startsWith('color/text/')) return SC_TEXT;
  if (path.startsWith('color/border/')) return SC_STROKE;
  return SC_FILL;
}

function figmaPathToWeb(path) {
  if (path.startsWith('color/')) {
    return `var(--color-${path.slice('color/'.length).replace(/\//g, '-')})`;
  }
  return `var(--${path.replace(/\//g, '-')})`;
}

const HEADER = `const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];
const PLACEHOLDER = { r: 0.8, g: 0.8, b: 0.8, a: 1 };

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) col.renameMode(col.modes[i].modeId, modeNames[i]);
    else if (i > 0) col.addMode(modeNames[i]);
  }
  return col;
}

function scopeFor(path) {
  if (path.startsWith("color/text/")) return SC_TEXT;
  if (path.startsWith("color/border/")) return SC_STROKE;
  return SC_FILL;
}

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}
`;

function chunk(items, label, collectionExpr, modeIdsExpr) {
  const scripts = [];
  for (let i = 0; i < items.length; i += BATCH) {
    const slice = items.slice(i, i + BATCH);
    const idx = String(Math.floor(i / BATCH) + 1).padStart(2, '0');
    const body = `
const col = ${collectionExpr};
${modeIdsExpr}
const ITEMS = ${JSON.stringify(slice)};
let created = 0, skipped = 0;
for (const item of ITEMS) {
  let v = await findVar(col.id, item.n);
  if (v) { skipped++; continue; }
  v = figma.variables.createVariable(item.n, col, "COLOR");
  v.scopes = item.sc;
  v.setVariableCodeSyntax("WEB", item.web);
  for (const modeId of modeIds) v.setValueForMode(modeId, PLACEHOLDER);
  created++;
}
return { step: "${label}", batch: "${idx}", created, skipped, total: ITEMS.length };
`;
    scripts.push({ file: `${label}-${idx}.js`, code: HEADER + body });
  }
  return scripts;
}

const primitives = data.primitives.map((p) => ({
  n: p.figmaPath,
  sc: SC_FILL,
  web: figmaPathToWeb(p.figmaPath),
}));

const semantics = data.semantics.map((s) => ({
  n: s.figmaPath,
  sc: scopeFor(s.figmaPath),
  web: figmaPathToWeb(s.figmaPath),
}));

const setup = `${HEADER}
const primCol = await getOrCreateCollection("01 Primitives", ["Value"]);
const semCol = await getOrCreateCollection("02 Semantic", ["Default", "CAM88"]);
return {
  step: "setup",
  primitiveCollectionId: primCol.id,
  semanticCollectionId: semCol.id,
  primitiveModeId: primCol.modes[0].modeId,
  defaultModeId: semCol.modes.find((m) => m.name === "Default").modeId,
  cam88ModeId: semCol.modes.find((m) => m.name === "CAM88").modeId,
};
`;

const outDir = 'scripts/figma-names-only-batches';
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(`${outDir}/00-setup.js`, setup);

const primScripts = chunk(
  primitives,
  '01-primitives',
  '(await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives")',
  'const modeIds = [col.modes[0].modeId];',
);
const semScripts = chunk(
  semantics,
  '02-semantics',
  '(await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic")',
  'const modeIds = col.modes.map((m) => m.modeId);',
);

const manifest = [{ file: '00-setup.js', step: 'setup' }];
for (const s of [...primScripts, ...semScripts]) {
  fs.writeFileSync(`${outDir}/${s.file}`, s.code);
  manifest.push({ file: s.file, bytes: Buffer.byteLength(s.code, 'utf8') });
}

fs.writeFileSync(`${outDir}/manifest.json`, JSON.stringify({ primitives: primitives.length, semantics: semantics.length, batches: manifest }, null, 2));
console.log(`Wrote ${manifest.length} batches to ${outDir}/`);
console.log(`  ${primitives.length} primitives, ${semantics.length} semantics`);
