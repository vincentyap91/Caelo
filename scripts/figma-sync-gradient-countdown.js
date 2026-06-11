/* use_figma — Add color/gradient/countdown/* + bind promotion-page countdown digit text */

const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!primCol || !semCol) throw new Error('Missing "01 Primitives" or "02 Semantic"');

const semModeId = semCol.modes[0].modeId;

async function getPrim(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === primCol.id && v.name === path,
  );
}

async function getSem(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

async function ensureSemAlias(path, primPath) {
  const primVar = await getPrim(primPath);
  if (!primVar) throw new Error(`Missing primitive ${primPath}`);
  let v = await getSem(path);
  if (!v) {
    v = figma.variables.createVariable(path, semCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
  }
  v.setValueForMode(semModeId, { type: "VARIABLE_ALIAS", id: primVar.id });
  return v;
}

const startVar = await ensureSemAlias("color/gradient/countdown/start", "raw/cta/start");
const endVar = await ensureSemAlias("color/gradient/countdown/end", "raw/cta/end");

function isCountdownNumber(text) {
  return /^\d+$/.test((text || "").trim());
}

function isCountdownContext(node) {
  let p = node?.parent;
  while (p) {
    if (/timer|countdown/i.test(p.name || "")) return true;
    p = p.parent;
  }
  return false;
}

async function bindCountdownNumberGradient(node) {
  if (!node || node.type !== "TEXT") return false;
  node.name = "countdown-timer__value";
  node.setRangeFills(0, node.characters.length, [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
      gradientStops: [
        {
          color: { r: 0, g: 0, b: 0, a: 1 },
          position: 0,
          boundVariables: { color: { type: "VARIABLE_ALIAS", id: startVar.id } },
        },
        {
          color: { r: 0, g: 0, b: 0, a: 1 },
          position: 1,
          boundVariables: { color: { type: "VARIABLE_ALIAS", id: endVar.id } },
        },
      ],
    },
  ]);
  return true;
}

let bound = 0;
const promotionFrame =
  (await figma.getNodeByIdAsync("124:4241")) ||
  figma.root.findOne((n) => n.type === "FRAME" && n.name === "promotion-page");

if (promotionFrame) {
  for (const node of promotionFrame.findAll((n) => n.type === "TEXT")) {
    const chars = (node.characters || "").trim();
    if (isCountdownNumber(chars) && isCountdownContext(node)) {
      if (await bindCountdownNumberGradient(node)) bound++;
    }
  }
}

return {
  start: "color/gradient/countdown/start",
  end: "color/gradient/countdown/end",
  promotionFrame: promotionFrame ? { id: promotionFrame.id, name: promotionFrame.name } : null,
  bound,
};
