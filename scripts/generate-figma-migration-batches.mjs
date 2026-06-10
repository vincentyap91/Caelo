/**
 * Split figma-theme-token-data.json into use_figma-sized plugin batches.
 * Run: node scripts/generate-figma-migration-batches.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { figmaPathToCssVar } from './figma-path-to-css.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'figma-theme-token-data.json'), 'utf8'));
const outDir = path.join(__dirname, 'figma-migration-batches');
fs.mkdirSync(outDir, { recursive: true });

const BATCH_SIZE = 70;

function pluginHeader() {
  return `const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) {
      col.renameMode(col.modes[i].modeId, modeNames[i]);
    } else if (i > 0) {
      col.addMode(modeNames[i]);
    }
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
}

function writeBatch(name, code) {
  const file = path.join(outDir, `${name}.js`);
  fs.writeFileSync(file, code);
  return { name, file, size: code.length };
}

const batches = [];

// Step 0: collections setup
batches.push(
  writeBatch(
    '00-setup-collections',
    `${pluginHeader()}
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
`,
  ),
);

// Primitive batches
const prims = data.primitives.filter((p) => p.rgba);
for (let i = 0; i < prims.length; i += BATCH_SIZE) {
  const slice = prims.slice(i, i + BATCH_SIZE);
  const idx = String(Math.floor(i / BATCH_SIZE) + 1).padStart(2, '0');
  batches.push(
    writeBatch(
      `01-primitives-${idx}`,
      `${pluginHeader()}
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
if (!primCol) throw new Error("Run 00-setup-collections first");
const modeId = primCol.modes[0].modeId;
const ITEMS = ${JSON.stringify(
  slice.map((p) => ({
    n: p.figmaPath,
    c: p.rgba,
    web: figmaPathToCssVar(p.figmaPath),
  })),
)};
let created = 0, updated = 0;
for (const item of ITEMS) {
  let v = await findVar(primCol.id, item.n);
  if (!v) { v = figma.variables.createVariable(item.n, primCol, "COLOR"); created++; }
  else updated++;
  v.scopes = SC_FILL;
  v.setVariableCodeSyntax("WEB", item.web);
  v.setValueForMode(modeId, item.c);
}
return { step: "primitives", batch: "${idx}", created, updated, total: ITEMS.length };
`,
    ),
  );
}

// Semantic batches (non-gradient)
const sems = data.semantics.filter((s) => s.aliasFigma && !s.error);
for (let i = 0; i < sems.length; i += BATCH_SIZE) {
  const slice = sems.slice(i, i + BATCH_SIZE);
  const idx = String(Math.floor(i / BATCH_SIZE) + 1).padStart(2, '0');
  batches.push(
    writeBatch(
      `02-semantics-${idx}`,
      `${pluginHeader()}
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
if (!semCol || !primCol) throw new Error("Run setup + primitives first");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88").modeId;
const ITEMS = ${JSON.stringify(
        slice.map((s) => ({
          n: s.figmaPath,
          a: s.aliasFigma,
          col: s.aliasCollection,
          sc: s.scopes,
          web: figmaPathToCssVar(s.figmaPath),
        })),
      )};
let created = 0, updated = 0, errors = [];
async function resolveTarget(item) {
  const col = item.col === "02 Semantic" ? semCol : primCol;
  return findVar(col.id, item.a);
}
for (const item of ITEMS) {
  let target = await resolveTarget(item);
  if (!target) { errors.push(item.n + " -> missing " + item.a); continue; }
  let v = await findVar(semCol.id, item.n);
  if (!v) { v = figma.variables.createVariable(item.n, semCol, "COLOR"); created++; }
  else updated++;
  v.scopes = item.sc;
  v.setVariableCodeSyntax("WEB", item.web);
  const alias = { type: "VARIABLE_ALIAS", id: target.id };
  v.setValueForMode(defaultModeId, alias);
  v.setValueForMode(cam88ModeId, alias);
}
return { step: "semantics", batch: "${idx}", created, updated, errors, total: ITEMS.length };
`,
    ),
  );
}

// Gradient semantic start/end batches
const gradItems = [];
for (const g of data.gradientComposites) {
  gradItems.push({
    n: g.startSemantic,
    a: g.startFigma,
    col: '01 Primitives',
    web: figmaPathToCssVar(g.startSemantic),
  });
  gradItems.push({
    n: g.endSemantic,
    a: g.endFigma,
    col: '01 Primitives',
    web: figmaPathToCssVar(g.endSemantic),
  });
}
for (let i = 0; i < gradItems.length; i += BATCH_SIZE) {
  const slice = gradItems.slice(i, i + BATCH_SIZE);
  const idx = String(Math.floor(i / BATCH_SIZE) + 1).padStart(2, '0');
  batches.push(
    writeBatch(
      `03-gradient-stops-${idx}`,
      `${pluginHeader()}
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88").modeId;
const ITEMS = ${JSON.stringify(slice.map((x) => ({ ...x, sc: ['FRAME_FILL', 'SHAPE_FILL'] })))};
let created = 0, updated = 0, errors = [];
async function resolveTarget(path) {
  return (await findVar(semCol.id, path)) ?? (await findVar(primCol.id, path));
}
for (const item of ITEMS) {
  const target = await resolveTarget(item.a);
  if (!target) { errors.push(item.n + " -> missing " + item.a); continue; }
  let v = await findVar(semCol.id, item.n);
  if (!v) { v = figma.variables.createVariable(item.n, semCol, "COLOR"); created++; }
  else updated++;
  v.scopes = item.sc;
  v.setVariableCodeSyntax("WEB", item.web);
  const alias = { type: "VARIABLE_ALIAS", id: target.id };
  v.setValueForMode(defaultModeId, alias);
  v.setValueForMode(cam88ModeId, alias);
}
return { step: "gradient-stops", batch: "${idx}", created, updated, errors, total: ITEMS.length };
`,
    ),
  );
}

// Sync WEB code syntax for every local color variable (idempotent repair pass)
const syncItems = [
  ...data.primitives.filter((p) => p.figmaPath).map((p) => ({ n: p.figmaPath, web: figmaPathToCssVar(p.figmaPath) })),
  ...data.semantics.filter((s) => s.figmaPath && !s.error).map((s) => ({ n: s.figmaPath, web: figmaPathToCssVar(s.figmaPath) })),
  ...gradItems.map((g) => ({ n: g.n, web: g.web })),
];
for (let i = 0; i < syncItems.length; i += BATCH_SIZE) {
  const slice = syncItems.slice(i, i + BATCH_SIZE);
  const idx = String(Math.floor(i / BATCH_SIZE) + 1).padStart(2, '0');
  batches.push(
    writeBatch(
      `07-sync-web-code-syntax-${idx}`,
      `${pluginHeader()}
const ITEMS = ${JSON.stringify(slice)};
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "${idx}", updated, missing, total: ITEMS.length };
`,
    ),
  );
}

const SYNC_CHUNK = 400;
for (let i = 0; i < syncItems.length; i += SYNC_CHUNK) {
  const slice = syncItems.slice(i, i + SYNC_CHUNK);
  const part = String(Math.floor(i / SYNC_CHUNK) + 1);
  fs.writeFileSync(
    path.join(__dirname, `figma-sync-web-code-syntax-${part}.js`),
    `/* use_figma — sync WEB code syntax part ${part} */
const ITEMS = ${JSON.stringify(slice)};
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", part: "${part}", updated, missing: missing.slice(0, 10), missingCount: missing.length, total: ITEMS.length };
`,
  );
}

// Pages batch
const PAGE_TOKENS = {
  'Caelo – Site Name': ['color/surface/base', 'color/surface/float', 'color/text/primary', 'color/text/secondary', 'color/border/subtle', 'color/button/primary', 'color/primary', 'color/icon/default', 'color/sticky-nav/bg', 'color/error/main', 'color/success/main'],
  'Caelo – Home': ['color/surface/base', 'color/text/primary', 'color/text/secondary', 'color/border/subtle', 'color/button/nav', 'color/gradient/home/cta/start', 'color/gradient/home/cta/end', 'color/accent/pale', 'color/overlay/strong', 'color/popup/body', 'color/progress/bar/fill', 'color/scrollbar/thumb', 'color/effect/glow'],
  'Caelo – All': ['color/surface/base', 'color/surface/card', 'color/text/primary', 'color/border/subtle', 'color/button/tabs', 'color/gradient/card/brand/start', 'color/gradient/card/brand/end', 'color/table/header', 'color/overlay/medium', 'color/scrollbar/track'],
  'Caelo – Slots': ['color/surface/base', 'color/surface/input-inverse', 'color/button/tabs', 'color/border/tabs', 'color/text/primary', 'color/primary', 'color/surface/rtp-secondary-card', 'color/border/danger', 'color/info/icon', 'color/progress/bar/bg', 'color/progress/bar/fill', 'color/button/cta-fourth'],
};

batches.push(
  writeBatch(
    '04-pages',
    `${pluginHeader()}
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;

function bindFill(node, varName) {
  const v = figma.variables.getLocalVariables("COLOR").find((x) => x.name === varName && x.variableCollectionId === semCol.id);
  if (!v) return false;
  node.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, boundVariables: { color: { type: "VARIABLE_ALIAS", id: v.id } } }];
  return true;
}

const PAGE_TOKENS = ${JSON.stringify(PAGE_TOKENS)};
const createdNodeIds = [];
const pageNames = Object.keys(PAGE_TOKENS);

for (const pageName of pageNames) {
  let page = figma.root.children.find((p) => p.name === pageName);
  if (!page) { page = figma.createPage(); page.name = pageName; }
  await figma.setCurrentPageAsync(page);

  let frame = page.children.find((n) => n.type === "FRAME" && n.name === pageName);
  if (!frame) {
    frame = figma.createFrame();
    frame.name = pageName;
    frame.resize(1440, 900);
    frame.x = 0;
    frame.y = 0;
    page.appendChild(frame);
    createdNodeIds.push(frame.id);
  }
  bindFill(frame, "color/surface/base");

  const annName = "[Color Tokens – " + pageName.replace("Caelo – ", "") + "]";
  let ann = page.children.find((n) => n.type === "FRAME" && n.name === annName);
  if (!ann) {
    ann = figma.createFrame();
    ann.name = annName;
    ann.layoutMode = "VERTICAL";
    ann.primaryAxisSizingMode = "AUTO";
    ann.counterAxisSizingMode = "FIXED";
    ann.resize(1440, 100);
    ann.x = 0;
    ann.y = 960;
    ann.itemSpacing = 8;
    ann.paddingTop = ann.paddingBottom = ann.paddingLeft = ann.paddingRight = 24;
    page.appendChild(ann);
    createdNodeIds.push(ann.id);
  }
  bindFill(ann, "color/surface/float");

  const tokens = PAGE_TOKENS[pageName];
  while (ann.children.length > tokens.length) ann.children[ann.children.length - 1].remove();
  tokens.forEach((tokenPath, i) => {
    let row = ann.children[i];
    if (!row || row.type !== "TEXT") {
      row = figma.createText();
      ann.appendChild(row);
      createdNodeIds.push(row.id);
    }
    row.fontName = { family: "Inter", style: "Regular" };
    row.fontSize = 12;
    row.characters = tokenPath + "  →  (see 02 Semantic / Default)";
    row.layoutSizingHorizontal = "FILL";
  });
}

return { step: "pages", createdNodeIds, pages: pageNames };
`,
  ),
);

// Audit batch
batches.push(
  writeBatch(
    '05-audit',
    `${pluginHeader()}
const allVars = await figma.variables.getLocalVariablesAsync("COLOR");
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const primitives = allVars.filter((v) => v.variableCollectionId === primCol.id);
const semantics = allVars.filter((v) => v.variableCollectionId === semCol.id);
let aliasErrors = 0;
for (const s of semantics) {
  const val = s.valuesByMode[defaultModeId];
  if (!val || val.type !== "VARIABLE_ALIAS") aliasErrors++;
}
return {
  step: "audit",
  primitives: primitives.length,
  semantics: semantics.length,
  aliasErrors,
  pages: figma.root.children.map((p) => p.name).filter((n) => n.startsWith("Caelo –")),
};
`,
  ),
);

const manifest = batches.map((b) => ({ name: b.name, size: b.size }));
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${batches.length} batches to ${outDir}`);
console.log(JSON.stringify(manifest, null, 2));
