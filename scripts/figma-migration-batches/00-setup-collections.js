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
