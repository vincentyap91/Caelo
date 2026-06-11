/* use_figma — Bind color/effect/shadow/card/soft on referral-page card DROP_SHADOW effects */

const REFERRAL_FRAME_ID = "131:5287";

const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!primCol || !semCol) throw new Error('Missing "01 Primitives" or "02 Semantic"');

const semModeId = semCol.modes[0].modeId;

async function getSem(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

async function getPrim(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === primCol.id && v.name === path,
  );
}

async function ensureSemAlias(path, primPath) {
  const primVar = await getPrim(primPath);
  if (!primVar) throw new Error(`Missing primitive ${primPath}`);
  let v = await getSem(path);
  if (!v) {
    v = figma.variables.createVariable(path, semCol, "COLOR");
    v.scopes = ["EFFECT_COLOR"];
  }
  v.setValueForMode(semModeId, { type: "VARIABLE_ALIAS", id: primVar.id });
  return v;
}

const shadowVar = await ensureSemAlias("color/effect/shadow/card/soft", "mono/950");

function isCardShadowRgb(c) {
  if (!c) return false;
  return (
    Math.abs(c.r - 15 / 255) < 0.02 &&
    Math.abs(c.g - 23 / 255) < 0.02 &&
    Math.abs(c.b - 42 / 255) < 0.02
  );
}

/** Nodes using shadow-card-soft (8px 24px slate tint) on referral-page */
const CARD_SOFT_SHADOW_NODES = new Set([
  "131:5315",
  "131:5324",
  "131:5342",
  "131:5353",
]);

function isCardSoftShadowEffect(effect) {
  if (!effect || effect.type !== "DROP_SHADOW") return false;
  const y = effect.offset?.y ?? 0;
  const blur = effect.radius ?? 0;
  return Math.abs(y - 8) < 2 && Math.abs(blur - 24) < 4;
}

async function bindDropShadows(node, boundNodes = []) {
  if (!node?.effects?.length) return boundNodes;
  const legacyVars = await Promise.all([
    getSem("color/effect/shadow/referral"),
    getSem("color/effect/shadow/card"),
  ]);
  const effects = [...node.effects];
  let changed = false;
  for (let i = 0; i < effects.length; i++) {
    const effect = effects[i];
    if (effect.visible === false || effect.type !== "DROP_SHADOW") continue;
    const boundId = effect.boundVariables?.color?.id;
    const isCardSoft =
      isCardSoftShadowEffect(effect) ||
      isCardShadowRgb(effect.color) ||
      legacyVars.some((v) => v && boundId === v.id) ||
      boundId === shadowVar.id;
    if (isCardSoft) {
      effects[i] = figma.variables.setBoundVariableForEffect(effect, "color", shadowVar);
      changed = true;
    }
  }
  if (changed) {
    node.effects = effects;
    boundNodes.push({ id: node.id, name: node.name });
  }
  return boundNodes;
}

const frame = await figma.getNodeByIdAsync(REFERRAL_FRAME_ID);
if (!frame) throw new Error("referral-page not found");

let bound = [];
for (const nodeId of CARD_SOFT_SHADOW_NODES) {
  const node = await figma.getNodeByIdAsync(nodeId);
  if (node) await bindDropShadows(node, bound);
}

for (const node of frame.findAll((n) => CARD_SOFT_SHADOW_NODES.has(n.id))) {
  if (!bound.some((b) => b.id === node.id)) await bindDropShadows(node, bound);
}

return {
  semantic: "color/effect/shadow/card/soft",
  primitive: "mono/950",
  frame: { id: frame.id, name: frame.name },
  bound,
  boundCount: bound.length,
};
