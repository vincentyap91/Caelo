/* use_figma — Bind all header icon fills + borders to color/border/subtle */

const NAV_ID = "174:2204";
const BORDER = "color/border/subtle";

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!semCol) throw new Error('Missing collection "02 Semantic"');

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

const borderVar = await getVar(BORDER);
if (!borderVar) throw new Error(`Missing semantic variable ${BORDER}`);

function solidFill() {
  return [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
}

function bindFill(node) {
  if (!node.fills?.length) return false;
  const paint = node.fills[0];
  if (paint.type !== "SOLID" || paint.visible === false) return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", borderVar)];
  return true;
}

function bindStroke(node) {
  if (!node.strokes?.length) return false;
  const paint = node.strokes[0];
  if (paint.type !== "SOLID" || paint.visible === false) return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", borderVar)];
  return true;
}

function isIconContainer(node) {
  const n = node.name.toLowerCase();
  if (n.includes("flag")) return false;
  return (
    n.includes("svg") ||
    n.includes("icon") ||
    n.includes("refresh balance") ||
    n.includes("chevron")
  );
}

function isVectorIcon(node) {
  return node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION" || node.type === "STAR";
}

let strokesBound = 0;
let iconsBound = 0;

function walk(node, insideIcon = false) {
  const inIcon = insideIcon || isIconContainer(node);

  if (node.type !== "TEXT" && "strokes" in node && Array.isArray(node.strokes) && node.strokes.length) {
    const s = node.strokes[0];
    if (s.visible !== false && s.type === "SOLID") {
      node.strokes = solidFill();
      if (bindStroke(node)) strokesBound++;
    }
  }

  if (inIcon || isVectorIcon(node)) {
    if (node.type !== "TEXT" && "fills" in node && Array.isArray(node.fills) && node.fills.length) {
      const p = node.fills[0];
      if (p.type === "IMAGE") {
        /* keep flag / raster assets */
      } else if (p.type === "SOLID" && p.visible !== false) {
        node.fills = solidFill();
        if (bindFill(node)) iconsBound++;
      }
    }
  }

  if ("children" in node) {
    for (const child of node.children) walk(child, inIcon);
  }
}

const nav = await figma.getNodeByIdAsync(NAV_ID);
if (!nav) throw new Error(`Nav frame ${NAV_ID} not found`);
walk(nav);

return { frameId: NAV_ID, strokesBound, iconsBound, variable: BORDER };
