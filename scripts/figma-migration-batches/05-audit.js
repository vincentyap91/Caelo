const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
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
