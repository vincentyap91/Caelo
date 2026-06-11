import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('scripts/figma-theme-token-data.json', 'utf8'));
const primNames = data.primitives.map((p) => p.figmaPath);
const semNames = data.semantics.map((s) => s.figmaPath);

const code = `const P = { r: 0.8, g: 0.8, b: 0.8, a: 1 };

async function getCol(name, modeNames) {
  let col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) col.renameMode(col.modes[i].modeId, modeNames[i]);
    else if (i > 0) col.addMode(modeNames[i]);
  }
  return col;
}

async function findVar(col, name) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === col.id && v.name === name,
  );
}

function scopes(name) {
  if (name.startsWith("color/text/")) return ["TEXT_FILL"];
  if (name.startsWith("color/border/")) return ["STROKE_COLOR"];
  return ["FRAME_FILL", "SHAPE_FILL"];
}

function webSyntax(name, isSemantic) {
  if (isSemantic) return "var(--color-" + name.slice("color/".length).replace(/\\//g, "-") + ")";
  return "var(--" + name.replace(/\\//g, "-") + ")";
}

async function addNames(col, modeIds, names, isSemantic) {
  let created = 0;
  let skipped = 0;
  for (const name of names) {
    let v = await findVar(col, name);
    if (v) {
      skipped++;
      continue;
    }
    v = figma.variables.createVariable(name, col, "COLOR");
    v.scopes = scopes(name);
    v.setVariableCodeSyntax("WEB", webSyntax(name, isSemantic));
    for (const modeId of modeIds) v.setValueForMode(modeId, P);
    created++;
  }
  return { created, skipped, total: names.length };
}

const primCol = await getCol("01 Primitives", ["Value"]);
const semCol = await getCol("02 Semantic", ["Default", "CAM88"]);
const primResult = await addNames(primCol, [primCol.modes[0].modeId], ${JSON.stringify(primNames)}, false);
const semResult = await addNames(semCol, semCol.modes.map((m) => m.modeId), ${JSON.stringify(semNames)}, true);
return { step: "names-only-all", primitives: primResult, semantics: semResult, total: ${primNames.length + semNames.length} };
`;

fs.writeFileSync('scripts/figma-names-only-compact.js', code);
console.log('bytes', Buffer.byteLength(code, 'utf8'));
