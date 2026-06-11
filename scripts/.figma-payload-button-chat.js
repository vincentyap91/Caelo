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

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: 1,
  };
}

async function ensurePrimHex(path, hex) {
  let v = await getPrim(path);
  if (!v) {
    v = figma.variables.createVariable(path, primCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
  }
  v.setValueForMode(primModeId, hexToRgb(hex));
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

const startPrim = await ensurePrimHex("raw/gradient/button/chat/start", "#3b82f6");
const endPrim = await ensurePrimHex("raw/gradient/button/chat/end", "#8b5cf6");
const startVar = await ensureSemAlias("color/gradient/button/chat/start", startPrim);
const endVar = await ensureSemAlias("color/gradient/button/chat/end", endPrim);

const textVar = await getSem("color/text/cta/inverse");

const CHAT_BUTTON_GRADIENT_TRANSFORM = [
  [0.9112988114356995, 0.08870115876197815, 0],
  [-7.2646803855896, 0.7071067690849304, 3.7787868976593018],
];

function findChatButton(root) {
  const textNode = root.findOne(
    (n) => n.type === "TEXT" && /chat with us/i.test(n.characters || ""),
  );
  if (!textNode) return null;
  let btn = textNode.parent;
  while (btn && btn.type !== "FRAME" && btn.type !== "INSTANCE" && btn.type !== "COMPONENT") {
    btn = btn.parent;
  }
  return { textNode, btn };
}

async function bindChatButtonGradient(node) {
  if (!node) return false;
  node.name = "btn-promotion-chat";
  node.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: CHAT_BUTTON_GRADIENT_TRANSFORM,
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

async function bindChatButtonText(node) {
  if (!node || node.type !== "TEXT" || !textVar) return false;
  node.name = "btn-promotion-chat__label";
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    textVar,
  );
  node.setRangeFills(0, node.characters.length, [paint]);
  return true;
}

let bound = 0;
const frame = await figma.getNodeByIdAsync("129:4739");
const match = frame ? findChatButton(frame) : null;

if (match?.btn) {
  if (await bindChatButtonGradient(match.btn)) bound++;
}
if (match?.textNode) {
  if (await bindChatButtonText(match.textNode)) bound++;
}

return {
  start: "color/gradient/button/chat/start",
  end: "color/gradient/button/chat/end",
  text: "color/text/cta/inverse",
  frame: frame ? { id: frame.id, name: frame.name } : null,
  button: match?.btn ? { id: match.btn.id, name: match.btn.name } : null,
  bound,
};
