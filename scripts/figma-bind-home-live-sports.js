/* use_figma — Bind home-live-sports-section (Home - Live Sports section - 1 audit, VARIABLE-RULES.en.md §13.11) */

const SECTION_ID = "234:1247";

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

async function getPrim(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === primCol.id && v.name === path,
  );
}

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

async function setPrimColor(path, hex) {
  let v = await getPrim(path);
  if (!v) {
    v = figma.variables.createVariable(path, primCol, "COLOR");
    v.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];
  }
  v.setValueForMode(primModeId, hexToRgb(hex));
  return v;
}

/* Caelo values from Home - Live Sports section - 1 */
const PRIMITIVE_UPDATES = [
  ["raw/gradient/sports/card/start", "#1a2744"],
  ["raw/gradient/sports/card/end", "#1a2744"],
  ["overlay/sports-card", "#0f1424a6"],
  ["raw/text/sports/primary", "#ffffff"],
  ["raw/text/sports/muted", "#b3b3b3"],
  ["raw/nav/text/accent", "#6bc5e8"],
  ["accent/460", "#d4af37"],
  ["mono/798", "#1a1a1a"],
  ["mono/950", "#000000"],
];

for (const [path, hex] of PRIMITIVE_UPDATES) {
  await setPrimColor(path, hex);
}

function solidFill(hex = { r: 1, g: 1, b: 1 }) {
  return [{ type: "SOLID", color: hex }];
}

function bindFill(node, variable) {
  if (!variable || !node) return false;
  if (!node.fills?.length) node.fills = solidFill();
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

function bindStroke(node, variable) {
  if (!variable || !node) return false;
  if (!node.strokes?.length) node.strokes = solidFill();
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFillPath(node, path) {
  if (!node) return;
  bindFill(node, await getVar(path));
}

async function bindSolidFillPath(node, path) {
  if (!node) return;
  const variable = await getVar(path);
  if (!variable) return;
  node.fills = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    ),
  ];
}

async function bindStrokePath(node, path, weight) {
  if (!node) return;
  if (weight != null) node.strokeWeight = weight;
  bindStroke(node, await getVar(path));
}

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) {
    await bindSolidFillPath(node, "color/border/sports/card");
    return;
  }
  node.fills = [
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
  ];
}

async function bindTextPath(node, path) {
  if (!node || node.type !== "TEXT") return;
  const variable = await getVar(path);
  if (!variable) return;
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    variable,
  );
  node.setRangeFills(0, node.characters.length, [paint]);
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

const SPORTS_CARD = ["color/gradient/sports/card/start", "color/gradient/sports/card/end"];

function isOddsRowContainer(node) {
  return (
    node?.type === "FRAME" &&
    (node.name === "sports-odds-cell" ||
      (node.name === "Background" &&
        node.parent?.name === "sports-match-card" &&
        node.fills?.[0]?.type === "SOLID"))
  );
}

function isInOddsRow(node) {
  let parent = node?.parent;
  while (parent && parent.name !== "sports-match-card") {
    if (parent.name === "sports-odds-cell") return true;
    parent = parent.parent;
  }
  return false;
}

function isOddsLabelChip(node) {
  if (node?.type !== "FRAME" || node.name !== "Background") return false;
  const parent = node.parent;
  if (!parent || parent.name !== "Background") return false;
  const gp = parent.parent;
  return (gp?.name === "sports-odds-cell" || gp?.name === "sports-odds-pill") && node.height <= 18;
}

function isOddsPillRow(node) {
  if (node?.type !== "FRAME" || node.name !== "Background") return false;
  return node.parent?.name === "sports-odds-cell";
}

function classifySportsText(node, inOddsCell = false) {
  const t = (node.characters || "").trim();
  if (t === "HDP" || t === "Odds") return "color/text/sports/muted";
  if (inOddsCell && /^-?\d+(\.\d+)?$/.test(t)) return "color/text/sports/primary";
  if (t.includes("GMT") || (t.includes("/") && t.includes("am"))) return "color/text/sports/primary";
  if (/^\d{2}:\d{2}$/.test(t) || t === "-") return "color/text/sports/primary";
  if (t.length > 15 || t.includes("WORLD CUP") || t.includes("Friendly")) {
    return "color/text/sticky-nav-active";
  }
  return "color/text/sports/primary";
}

const section = await figma.getNodeByIdAsync(SECTION_ID);
if (!section) throw new Error(`Live Sports section ${SECTION_ID} not found`);

section.name = "home-live-sports-section";

const header = await figma.getNodeByIdAsync("234:1248");
if (header) {
  header.name = "section-header-theme HorizontalBorder";
  await bindStrokePath(header, "color/border/line");
}

const title = await figma.getNodeByIdAsync("234:1249");
if (title?.type === "TEXT") {
  title.name = "home-section-title";
  const chars = title.characters;
  const liveVar = await getVar("color/text/third/title");
  const sportsVar = await getVar("color/text/card/text");
  const idx = chars.indexOf("Sports");
  if (idx > 0 && liveVar && sportsVar) {
    title.setRangeFills(0, idx, [
      figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", liveVar),
    ]);
    title.setRangeFills(idx, chars.length, [
      figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", sportsVar),
    ]);
  } else {
    await bindTextPath(title, "color/text/card/text");
  }
}

await bindTextPath(await figma.getNodeByIdAsync("234:1250"), "color/text/muted");

const betBtn = await figma.getNodeByIdAsync("234:1252");
if (betBtn) {
  betBtn.name = "sports-bet-now-button";
  await bindSolidFillPath(betBtn, "color/button/cta/fourth");
}
await bindTextPath(await figma.getNodeByIdAsync("234:1253"), "color/button/cta/fourth/text");

const liveCol = await figma.getNodeByIdAsync("234:1254");
if (liveCol) liveCol.name = "home-live-sports-carousel";
await bindTextPath(await figma.getNodeByIdAsync("234:1255"), "color/text/card/text");

const nextBtn = await figma.getNodeByIdAsync("234:1548");
if (nextBtn) {
  nextBtn.name = "home-live-sports-next";
  await bindSolidFillPath(nextBtn, "color/button/cta/fourth");
  await bindIconSubtree(await figma.getNodeByIdAsync("234:1549"), "color/button/cta/fourth/text");
}

async function bindSportsSubtree(node, inCard = false) {
  if (!node) return;

  if (
    (node.name === "Background+Shadow" || node.name === "sports-match-card") &&
    node.parent?.name.includes("Container")
  ) {
    node.name = "sports-match-card";
    await bindGradientFill(node, ...SPORTS_CARD);
    node.strokes = [];
    node.strokeWeight = 0;
    inCard = true;
  }

  if (inCard && node.name === "Overlay" && node.type === "FRAME") {
    node.name = "sports-match-card__overlay";
    await bindFillPath(node, "color/overlay/sports/card");
  }

  if (inCard && isOddsRowContainer(node)) {
    node.name = "sports-odds-cell";
    await bindSolidFillPath(node, "color/accent/yellow");
    node.strokes = [];
    node.strokeWeight = 0;
  }

  if (inCard && isOddsPillRow(node)) {
    node.name = "sports-odds-pill";
    await bindSolidFillPath(node, "color/surface/inset");
    node.strokes = [];
    node.strokeWeight = 0;
  }

  if (inCard && isOddsLabelChip(node)) {
    node.name = "sports-odds-label";
    await bindSolidFillPath(node, "color/surface/scrim/dark");
    node.strokes = [];
    node.strokeWeight = 0;
  }

  if (inCard && node.type === "TEXT") {
    await bindTextPath(node, classifySportsText(node, isInOddsRow(node)));
  }

  if (inCard && (node.name === "SVG" || node.type === "VECTOR")) {
    await bindIconSubtree(node, "color/accent/yellow");
  }

  if ("children" in node) {
    for (const child of node.children) await bindSportsSubtree(child, inCard);
  }
}

await bindSportsSubtree(section);

let bound = 0;
let raw = 0;
function audit(node) {
  if ("fills" in node && node.fills?.length) {
    const f = node.fills[0];
    if (f.visible !== false && f.type === "SOLID") {
      if (f.boundVariables?.color) bound++;
      else if (f.color) raw++;
    }
    if (f.type === "GRADIENT_LINEAR" && f.visible !== false) bound++;
  }
  if (node.type === "TEXT") {
    for (const seg of node.getStyledTextSegments(["fills"])) {
      const f = seg.fills?.[0];
      if (f?.type === "SOLID") {
        if (f.boundVariables?.color) bound++;
        else if (f.color) raw++;
      }
    }
  }
  if ("strokes" in node && node.strokes?.length) {
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
  sectionId: section.id,
  sectionName: section.name,
  bound,
  rawFillsStrokes: raw,
  primitiveUpdates: PRIMITIVE_UPDATES.map(([path]) => path),
  bindings: [
    "color/gradient/sports/card (solid #1a2744)",
    "color/overlay/sports/card (rgba pill)",
    "color/accent/yellow (#d4af37 odds bar)",
    "color/surface/inset (black odds pill) + color/surface/scrim/dark (label chip)",
    "color/text/sticky-nav-active (tournament cyan)",
    "color/text/sports/primary + /muted",
    "color/button/cta/fourth + /text",
    "color/text/card/text",
  ],
};
