import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const CHUNK = 80;
const P = '{ r: 0.8, g: 0.8, b: 0.8, a: 1 }';

const HEADER = `const PLACEHOLDER = ${P};
async function getCol(name, modes) {
  let col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modes.length; i++) {
    if (col.modes[i]) col.renameMode(col.modes[i].modeId, modes[i]);
    else if (i > 0) col.addMode(modes[i]);
  }
  return col;
}
async function findVar(colId, name) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find((v) => v.variableCollectionId === colId && v.name === name) ?? null;
}
`;

function chunkScript(collection, modeExpr, names, isSemantic, label) {
  const scopesFn = isSemantic
    ? `function scopes(n){if(n.startsWith("color/text/"))return["TEXT_FILL"];if(n.startsWith("color/border/"))return["STROKE_COLOR"];return["FRAME_FILL","SHAPE_FILL"];}function web(n){return "var(--color-"+n.slice(6).replace(/\\//g,"-")+")";}`
    : `function scopes(){return["FRAME_FILL","SHAPE_FILL"];}function web(n){return "var(--"+n.replace(/\\//g,"-")+")";}`;

  return (
    HEADER +
    scopesFn +
    `\nawait getCol("01 Primitives", ["Value"]);\nawait getCol("02 Semantic", ["Default", "CAM88"]);\n` +
    `const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "${collection}");\n` +
    `const modeIds = ${modeExpr};\n` +
    `const NAMES = ${JSON.stringify(names)};\n` +
    `let created = 0, skipped = 0;\n` +
    `for (const n of NAMES) {\n` +
    `  let v = await findVar(col.id, n);\n` +
    `  if (v) { skipped++; continue; }\n` +
    `  v = figma.variables.createVariable(n, col, "COLOR");\n` +
    `  v.scopes = scopes(n);\n` +
    `  v.setVariableCodeSyntax("WEB", web(n));\n` +
    `  for (const m of modeIds) v.setValueForMode(m, PLACEHOLDER);\n` +
    `  created++;\n` +
    `}\n` +
    `return { batch: "${label}", created, skipped, total: NAMES.length };`
  );
}

const prim = data.primitives.map((p) => p.figmaPath);
const sem = data.semantics.map((s) => s.figmaPath);
const invokes = [];

for (let i = 0; i < prim.length; i += CHUNK) {
  const slice = prim.slice(i, i + CHUNK);
  const label = `prim-${String(Math.floor(i / CHUNK) + 1).padStart(2, '0')}`;
  const code = chunkScript('01 Primitives', '[col.modes[0].modeId]', slice, false, label);
  invokes.push({ label, code, bytes: Buffer.byteLength(code) });
}

for (let i = 0; i < sem.length; i += CHUNK) {
  const slice = sem.slice(i, i + CHUNK);
  const label = `sem-${String(Math.floor(i / CHUNK) + 1).padStart(2, '0')}`;
  const code = chunkScript('02 Semantic', 'col.modes.map((m) => m.modeId)', slice, true, label);
  invokes.push({ label, code, bytes: Buffer.byteLength(code) });
}

fs.mkdirSync('scripts/figma-names-only-invokes', { recursive: true });
for (const inv of invokes) {
  fs.writeFileSync(`scripts/figma-names-only-invokes/${inv.label}.json`, JSON.stringify({
    fileKey: 'J056FpXrIW4sDJtXNLsz0T',
    skillNames: 'figma-use',
    description: `Create variable names ${inv.label}`,
    code: inv.code,
  }));
}
fs.writeFileSync('scripts/figma-names-only-invokes/manifest.json', JSON.stringify(invokes.map((i) => ({ label: i.label, bytes: i.bytes })), null, 2));
console.log(invokes.map((i) => `${i.label}: ${i.bytes}b`).join('\n'));
