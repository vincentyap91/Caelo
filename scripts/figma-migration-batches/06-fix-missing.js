const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}

async function resolveTarget(semCol, primCol, path) {
  return (await findVar(semCol.id, path)) ?? (await findVar(primCol.id, path));
}

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88").modeId;

const FIXES = [
  { n: "color/surface/rtp/card", a: "color/primary", sc: SC_FILL },
  { n: "color/gradient/home/dashboard/start", a: "color/surface/base", sc: SC_FILL },
  { n: "color/gradient/home/dashboard/end", a: "color/accent/pale", sc: SC_FILL },
];

let created = 0;
let updated = 0;
const errors = [];

for (const item of FIXES) {
  const target = await resolveTarget(semCol, primCol, item.a);
  if (!target) {
    errors.push(`${item.n} -> missing ${item.a}`);
    continue;
  }
  let v = await findVar(semCol.id, item.n);
  if (!v) {
    v = figma.variables.createVariable(item.n, semCol, "COLOR");
    created++;
  } else {
    updated++;
  }
  v.scopes = item.sc;
  const alias = { type: "VARIABLE_ALIAS", id: target.id };
  v.setValueForMode(defaultModeId, alias);
  v.setValueForMode(cam88ModeId, alias);
}

return { step: "fix-missing", created, updated, errors };
