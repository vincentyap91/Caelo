/* use_figma — Bind Live Transactions avatar ring on Home - 1 (VARIABLE-RULES.en.md §13.11) */

const HOME_FRAME_ID = "174:2285";
const SECTION_ID = "174:3009";

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!semCol) throw new Error('Missing collection "02 Semantic"');

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

function solidFill(hex = { r: 1, g: 1, b: 1 }) {
  return [{ type: "SOLID", color: hex }];
}

function bindFill(node, variable) {
  if (!variable || !node?.fills?.length) return false;
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFillPath(node, path) {
  if (!node) return;
  node.fills = solidFill();
  bindFill(node, await getVar(path));
}

async function bindIconSubtree(node, path) {
  if (!node) return;
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") {
    if (node.fills?.length && node.fills[0].type === "SOLID") await bindFillPath(node, path);
    if (node.strokes?.length && node.strokes[0].type === "SOLID") {
      node.strokes = solidFill();
      const v = await getVar(path);
      if (v) {
        node.strokes = [
          figma.variables.setBoundVariableForPaint(node.strokes[0], "color", v),
        ];
      }
    }
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

async function bindAvatarRing(overlayNode, borderVar) {
  if (!overlayNode || !borderVar || overlayNode.type === "TEXT") return false;
  const effects = [...(overlayNode.effects || [])];
  let bound = false;
  for (let i = 0; i < effects.length; i++) {
    if (effects[i].type === "INNER_SHADOW" && effects[i].spread > 0) {
      effects[i] = figma.variables.setBoundVariableForEffect(effects[i], "color", borderVar);
      bound = true;
    }
  }
  if (bound) overlayNode.effects = effects;
  return bound;
}

const home = await figma.getNodeByIdAsync(HOME_FRAME_ID);
const section = await figma.getNodeByIdAsync(SECTION_ID);
if (!section) throw new Error(`Live Transactions section ${SECTION_ID} not found`);

section.name = "live-transactions-panel home-live-activity-card";

const borderVar = await getVar("color/border/brand");
const coolLightVar = await getVar("color/surface/cool/light");

let avatarRings = 0;
let avatarFills = 0;
let avatarIcons = 0;

async function walkTxRows(node) {
  if (!node || !("children" in node)) return;
  for (const child of node.children) {
    if (
      (child.name === "Background" || child.name === "tx-avatar") &&
      child.width === 40 &&
      child.height === 40
    ) {
      child.name = "tx-avatar";
      if (bindFill(child, coolLightVar)) avatarFills++;
      const overlay = child.parent?.children?.find(
        (s) =>
          (s.name.includes("Overlay") || s.name === "tx-avatar-ring") &&
          s.width === 40 &&
          s.height === 40,
      );
      if (overlay) {
        overlay.name = "tx-avatar-ring";
        if (await bindAvatarRing(overlay, borderVar)) avatarRings++;
      }
      const svg = child.parent?.children?.find(
        (s) => s.name === "SVG" || s.name === "tx-avatar-icon",
      );
      if (svg) {
        svg.name = "tx-avatar-icon";
        await bindIconSubtree(svg, "color/button/hover");
        avatarIcons++;
      }
    }
    await walkTxRows(child);
  }
}

await walkTxRows(section);

return {
  frame: home?.name,
  sectionId: section.id,
  sectionName: section.name,
  avatarRings,
  avatarFills,
  avatarIcons,
  binding: "color/border/brand → tx-avatar-ring inner shadow",
};
