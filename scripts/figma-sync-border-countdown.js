/* use_figma — Add color/border/countdown + bind promotion-page remaining time (CountdownTimer.jsx) */

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const hasAlpha = full.length === 8;
  return {
    r: ((n >> (hasAlpha ? 24 : 16)) & 255) / 255,
    g: ((n >> (hasAlpha ? 16 : 8)) & 255) / 255,
    b: ((n >> (hasAlpha ? 8 : 0)) & 255) / 255,
    a: hasAlpha ? (n & 255) / 255 : 1,
  };
}

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

async function ensurePrim(path, hex) {
  let v = await getPrim(path);
  if (!v) {
    v = figma.variables.createVariable(path, primCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];
  }
  v.setValueForMode(primModeId, hexToRgb(hex));
  return v;
}

async function ensureSem(path, primVar) {
  let v = await getSem(path);
  if (!v) {
    v = figma.variables.createVariable(path, semCol, "COLOR");
    v.scopes = ["STROKE_COLOR"];
  }
  v.setValueForMode(semModeId, {
    type: "VARIABLE_ALIAS",
    id: primVar.id,
  });
  return v;
}

const primVar = await ensurePrim("raw/border/countdown", "#ffc83c80");
const semVar = await ensureSem("color/border/countdown", primVar);

function solidFill() {
  return [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
}

async function bindStroke(node, variable) {
  if (!node || !variable) return false;
  if (!node.strokes?.length) node.strokes = solidFill();
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFill(node, variable) {
  if (!node || !variable) return false;
  if (!node.fills?.length) node.fills = solidFill();
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

let bound = 0;

function isCountdownContext(node) {
  let p = node?.parent;
  while (p) {
    if (/timer|countdown/i.test(p.name || "")) return true;
    p = p.parent;
  }
  return false;
}

const promotionFrame =
  (await figma.getNodeByIdAsync("124:4241")) ||
  figma.root.findOne((n) => n.type === "FRAME" && n.name === "promotion-page");

if (promotionFrame) {
  const timers = promotionFrame.findAll(
    (n) =>
      n.name === "countdown-timer__shell" ||
      n.name?.includes("Background+Border") && isCountdownContext(n),
  );

  for (const shell of timers) {
    shell.name = "countdown-timer__shell";
    if (await bindStroke(shell, semVar)) bound++;
  }

  const dividers = promotionFrame.findAll(
    (n) =>
      (n.name === "Vertical Divider" || n.name === "countdown-timer__divider") &&
      isCountdownContext(n),
  );

  for (const div of dividers) {
    div.name = "countdown-timer__divider";
    if (await bindFill(div, semVar)) bound++;
  }

  for (const timer of promotionFrame.findAll((n) => n.name === "countdown-timer")) {
    for (const child of timer.findAll(
      (n) => n.name === "Vertical Divider" || n.name === "countdown-timer__divider",
    )) {
      child.name = "countdown-timer__divider";
      if (await bindFill(child, semVar)) bound++;
    }
    const shell = timer.findOne(
      (n) => n.name === "countdown-timer__shell" || n.name?.includes("Background+Border"),
    );
    if (shell) {
      shell.name = "countdown-timer__shell";
      if (await bindStroke(shell, semVar)) bound++;
    }
  }
}

return {
  primitive: "raw/border/countdown",
  semantic: "color/border/countdown",
  hex: "#ffc83c80",
  promotionFrame: promotionFrame ? { id: promotionFrame.id, name: promotionFrame.name } : null,
  bound,
};
