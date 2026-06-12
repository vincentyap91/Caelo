/* use_figma — Add color/gradient/membership/tier semantic stops (VARIABLE-RULES.en.md §13.5) */

const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
if (!semCol || !primCol) throw new Error("Missing 01 Primitives or 02 Semantic");

const defaultModeId = semCol.modes.find((m) => m.name === "Default")?.modeId ?? semCol.modes[0].modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88")?.modeId;
const primDefaultModeId = primCol.modes[0].modeId;

async function findVar(collectionId, name) {
  return (
    (await figma.variables.getLocalVariablesAsync("COLOR")).find(
      (v) => v.variableCollectionId === collectionId && v.name === name,
    ) ?? null
  );
}

async function ensurePrimitive(name, aliasName) {
  let v = await findVar(primCol.id, name);
  if (!v) {
    v = figma.variables.createVariable(name, primCol, "COLOR");
    v.scopes = SC_FILL;
  }
  const aliasTarget = await findVar(primCol.id, aliasName);
  if (!aliasTarget) throw new Error(`Missing primitive alias ${aliasName}`);
  const alias = { type: "VARIABLE_ALIAS", id: aliasTarget.id };
  v.setValueForMode(primDefaultModeId, alias);
  return v;
}

async function ensureSemantic(name, aliasName, web) {
  let v = await findVar(semCol.id, name);
  const created = !v;
  if (!v) v = figma.variables.createVariable(name, semCol, "COLOR");
  v.scopes = SC_FILL;
  if (web) v.setVariableCodeSyntax("WEB", web);
  const aliasTarget = await findVar(primCol.id, aliasName);
  if (!aliasTarget) throw new Error(`Missing primitive ${aliasName}`);
  const alias = { type: "VARIABLE_ALIAS", id: aliasTarget.id };
  v.setValueForMode(defaultModeId, alias);
  if (cam88ModeId) v.setValueForMode(cam88ModeId, alias);
  return { name, created };
}

await ensurePrimitive("raw/gradient/membership/tier/start", "brand/630");
await ensurePrimitive("raw/gradient/membership/tier/end", "brand/500");

const semantics = [
  {
    n: "color/gradient/membership/tier/start",
    a: "raw/gradient/membership/tier/start",
    web: "var(--color-gradient-membership-tier-start)",
  },
  {
    n: "color/gradient/membership/tier/end",
    a: "raw/gradient/membership/tier/end",
    web: "var(--color-gradient-membership-tier-end)",
  },
];

const results = [];
for (const item of semantics) {
  results.push(await ensureSemantic(item.n, item.a, item.web));
}

return {
  step: "add-membership-tier-gradient",
  primitives: [
    "raw/gradient/membership/tier/start → brand/630",
    "raw/gradient/membership/tier/end → brand/500",
  ],
  semantics: results,
  compositeWeb: "var(--color-gradient-membership-tier)",
};
