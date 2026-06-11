/* use_figma — Bind Recent Big Wins semantics on Home - 1 (VARIABLE-RULES.en.md §13.11) */

const HOME_FRAME_ID = "174:2285";
const SECTION_ID = "174:3331";

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

function bindStroke(node, variable) {
  if (!variable || !node?.strokes?.length) return false;
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFillPath(node, path) {
  if (!node) return;
  node.fills = solidFill();
  bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight = 1) {
  if (!node) return;
  node.strokes = solidFill();
  node.strokeWeight = weight;
  bindStroke(node, await getVar(path));
}

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) {
    await bindFillPath(node, startPath);
    return;
  }
  node.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [0, 1, 0],
        [-1, 0, 1],
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
  ];
}

async function bindTextPath(node, path) {
  if (!node || node.type !== "TEXT") return;
  node.fills = solidFill();
  bindFill(node, await getVar(path));
}

async function bindIconSubtree(node, path) {
  if (!node) return;
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") {
    if (node.fills?.length && node.fills[0].type === "SOLID") await bindFillPath(node, path);
    if (node.strokes?.length && node.strokes[0].type === "SOLID") await bindStrokePath(node, path);
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

const home = await figma.getNodeByIdAsync(HOME_FRAME_ID);
const section = await figma.getNodeByIdAsync(SECTION_ID);
if (!section) throw new Error(`Recent Big Wins section ${SECTION_ID} not found`);

section.name = "recent-big-wins-section home-live-activity-card";

await bindGradientFill(section, "color/gradient/home/dashboard/start", "color/gradient/home/dashboard/end");
await bindStrokePath(section, "color/border/brand");
section.cornerRadius = 20;

const header = await figma.getNodeByIdAsync("174:3332");
if (header) header.name = "SectionHeader recent-big-wins-header";

await bindIconSubtree(await figma.getNodeByIdAsync("174:3333"), "color/accent");
const title = await figma.getNodeByIdAsync("174:3340");
if (title?.type === "TEXT") {
  const chars = title.characters;
  const recentVar = await getVar("color/text/primary");
  const bigVar = await getVar("color/text/recent/amount");
  if (chars.includes("Big Wins") && recentVar && bigVar) {
    const idx = chars.indexOf("Big Wins");
    title.fills = solidFill();
    title.setRangeFills(0, idx, [
      figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", recentVar),
    ]);
    title.setRangeFills(idx, chars.length, [
      figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", bigVar),
    ]);
    title.name = "Recent Big Wins title";
  } else {
    await bindTextPath(title, "color/text/primary");
  }
}
for (const id of ["174:3341", "174:3342", "174:3343"]) {
  await bindFillPath(await figma.getNodeByIdAsync(id), "color/primary");
}
await bindTextPath(await figma.getNodeByIdAsync("174:3344"), "color/text/muted");

function classifyText(node) {
  const t = (node.characters || "").trim();
  if (/^(MYR|RM|USD|\$)/.test(t)) return "color/text/recent/amount";
  if (t.includes("***")) return "color/text/muted";
  if (node.fontSize <= 12 && t.length <= 12 && t === t.toUpperCase()) return "color/text/subtle";
  if (node.fontSize >= 14 || (node.fontWeight >= 600 && t.length > 8)) return "color/text/primary";
  if (node.fontSize <= 12) return "color/text/muted";
  return "color/text/subtle";
}

async function bindWinRow(itemId) {
  const item = await figma.getNodeByIdAsync(itemId);
  if (!item) return;
  item.name = "recent-big-wins-row";
  await bindStrokePath(item, "color/border/line");

  for (const child of item.children) {
    if (child.name.includes("Background+Shadow") || child.name === "recent-big-wins-thumb") {
      child.name = "recent-big-wins-thumb";
      await bindFillPath(child, "color/surface/panel");
      await bindStrokePath(child, "color/border/brand");
    }
    if (child.name === "Background" || child.name === "provider-chip") {
      child.name = "provider-chip";
      await bindFillPath(child, "color/surface/panel");
      await bindStrokePath(child, "color/border/line");
      for (const gc of child.children) {
        if (gc.type === "TEXT") await bindTextPath(gc, "color/text/subtle");
      }
    }
    if (child.type === "TEXT") await bindTextPath(child, classifyText(child));
    if (child.name === "Container" || child.name.startsWith("Container")) {
      for (const gc of child.children) {
        if (gc.type === "TEXT") await bindTextPath(gc, classifyText(gc));
        if (gc.name.includes("Play game")) {
          await bindFillPath(gc, "color/primary");
          await bindIconSubtree(gc, "color/text/primary");
        }
      }
    }
  }
}

function walkWinRows(node) {
  if (!node) return;
  if (node.name === "Item" || node.name === "recent-big-wins-row") bindWinRow(node.id);
  if ("children" in node) node.children.forEach(walkWinRows);
}
walkWinRows(section);

let bound = 0;
let raw = 0;
function audit(node) {
  if ("fills" in node && Array.isArray(node.fills) && node.fills.length) {
    const p = node.fills[0];
    if (p.visible !== false && p.type === "SOLID") {
      if (p.boundVariables?.color) bound++;
      else if (p.color) raw++;
    }
    if (p.type === "GRADIENT_LINEAR" && p.visible !== false) bound++;
  }
  if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length) {
    const s = node.strokes[0];
    if (s.visible !== false && s.type === "SOLID") {
      if (s.boundVariables?.color) bound++;
      else if (s.color) raw++;
    }
  }
  if ("children" in node) node.children.forEach(audit);
}
audit(section);

return {
  frame: home?.name,
  sectionId: section.id,
  sectionName: section.name,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/gradient/home/dashboard/start+end",
    "color/border/brand",
    "color/accent",
    "color/text/primary",
    "color/text/muted",
    "color/text/subtle",
    "color/text/recent/amount",
    "color/surface/panel",
    "color/border/line",
  ],
};
