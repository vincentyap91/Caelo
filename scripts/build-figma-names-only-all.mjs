import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const SC_FILL = ['FRAME_FILL', 'SHAPE_FILL'];
const SC_TEXT = ['TEXT_FILL'];
const SC_STROKE = ['STROKE_COLOR'];

function scopeFor(path) {
  if (path.startsWith('color/text/')) return SC_TEXT;
  if (path.startsWith('color/border/')) return SC_STROKE;
  return SC_FILL;
}

function web(path) {
  if (path.startsWith('color/')) {
    return `var(--color-${path.slice('color/'.length).replace(/\//g, '-')})`;
  }
  return `var(--${path.replace(/\//g, '-')})`;
}

const prim = data.primitives.map((p) => ({ n: p.figmaPath, sc: SC_FILL, web: web(p.figmaPath) }));
const sem = data.semantics.map((s) => ({ n: s.figmaPath, sc: scopeFor(s.figmaPath), web: web(s.figmaPath) }));

const code = `const PLACEHOLDER = { r: 0.8, g: 0.8, b: 0.8, a: 1 };

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

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}

async function upsert(col, modeIds, items) {
  let created = 0, skipped = 0;
  for (const item of items) {
    let v = await findVar(col.id, item.n);
    if (v) { skipped++; continue; }
    v = figma.variables.createVariable(item.n, col, "COLOR");
    v.scopes = item.sc;
    v.setVariableCodeSyntax("WEB", item.web);
    for (const modeId of modeIds) v.setValueForMode(modeId, PLACEHOLDER);
    created++;
  }
  return { created, skipped, total: items.length };
}

const primCol = await getOrCreateCollection("01 Primitives", ["Value"]);
const semCol = await getOrCreateCollection("02 Semantic", ["Default", "CAM88"]);
const primResult = await upsert(primCol, [primCol.modes[0].modeId], ${JSON.stringify(prim)});
const semResult = await upsert(semCol, semCol.modes.map((m) => m.modeId), ${JSON.stringify(sem)});
return {
  step: "names-only-all",
  primitives: primResult,
  semantics: semResult,
  total: ${prim.length + sem.length},
};
`;

fs.writeFileSync('scripts/figma-names-only-all.js', code);
console.log('bytes', Buffer.byteLength(code, 'utf8'));
console.log('primitives', prim.length, 'semantics', sem.length);
