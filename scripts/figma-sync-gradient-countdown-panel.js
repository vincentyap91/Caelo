/* use_figma — Add color/gradient/countdown/panel/* + bind countdown-timer__shell fills */

const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!primCol || !semCol) throw new Error('Missing "01 Primitives" or "02 Semantic"');

const primModeId = primCol.modes[0].modeId;
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

async function ensurePrimRgba(path, rgba) {
  let v = await getPrim(path);
  if (!v) {
    v = figma.variables.createVariable(path, primCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
  }
  v.setValueForMode(primModeId, rgba);
  return v;
}

async function ensureSemAlias(path, primVar) {
  let v = await getSem(path);
  if (!v) {
    v = figma.variables.createVariable(path, semCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
  }
  v.setValueForMode(semModeId, { type: "VARIABLE_ALIAS", id: primVar.id });
  return v;
}

const startPrim = await ensurePrimRgba("raw/gradient/countdown/panel/start", {
  r: 1,
  g: 1,
  b: 1,
  a: 0.72,
});
const endPrim = await ensurePrimRgba("raw/gradient/countdown/panel/end", {
  r: 1,
  g: 248 / 255,
  b: 230 / 255,
  a: 0.55,
});

const startVar = await ensureSemAlias("color/gradient/countdown/panel/start", startPrim);
const endVar = await ensureSemAlias("color/gradient/countdown/panel/end", endPrim);

const COUNTDOWN_PANEL_GRADIENT_TRANSFORM = [
  [0.8333575129508972, 0.16664251685142517, 0],
  [-3.5361487865448, 0.7071067690849304, 1.9145209789276123],
];

function isCountdownContext(node) {
  let p = node?.parent;
  while (p) {
    if (/timer|countdown/i.test(p.name || "")) return true;
    p = p.parent;
  }
  return false;
}

async function bindCountdownPanelGradient(node) {
  if (!node) return false;
  node.name = "countdown-timer__shell";
  node.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: COUNTDOWN_PANEL_GRADIENT_TRANSFORM,
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
  ];
  return true;
}

function findShells(root) {
  if (!root) return [];
  const named = root.findAll((n) => n.name === "countdown-timer__shell");
  const legacy = root.findAll(
    (n) => n.name?.includes("Background+Border") && isCountdownContext(n),
  );
  const seen = new Set();
  return [...named, ...legacy].filter((n) => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}

let bound = 0;
const frames = [];

for (const frameId of ["124:4241", "129:4739"]) {
  const frame =
    (await figma.getNodeByIdAsync(frameId)) ||
    figma.root.findOne(
      (n) =>
        n.type === "FRAME" &&
        (n.name === "promotion-page" || n.name === "Promotion Details"),
    );
  if (!frame) continue;
  frames.push({ id: frame.id, name: frame.name });
  for (const shell of findShells(frame)) {
    if (await bindCountdownPanelGradient(shell)) bound++;
  }
}

return {
  start: "color/gradient/countdown/panel/start",
  end: "color/gradient/countdown/panel/end",
  frames,
  bound,
};
