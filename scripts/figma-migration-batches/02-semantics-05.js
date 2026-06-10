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

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
if (!semCol || !primCol) throw new Error("Run setup + primitives first");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88").modeId;
const ITEMS = [{"n":"color/secondary/tag","a":"raw/gradient/accent/50","col":"01 Primitives","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-secondary-tag)"},{"n":"color/secondary/tag/text","a":"support/success-vivid","col":"01 Primitives","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-secondary-tag-text)"},{"n":"color/sticky/nav","a":"brand/700","col":"01 Primitives","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-sticky-nav)"},{"n":"color/thumbnail","a":"mono/950","col":"01 Primitives","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-thumbnail)"}];
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
return { step: "semantics", batch: "05", created, updated, errors, total: ITEMS.length };
