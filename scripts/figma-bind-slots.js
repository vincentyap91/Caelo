/* use_figma — Bind Slots frame semantics (Web_Slot / SlotsPage.jsx, VARIABLE-RULES.en.md §13.11) */

const SLOTS_FRAME_ID = "124:3481";

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
  if (!node.strokes?.length) node.strokes = solidFill();
  bindStroke(node, await getVar(path));
}

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) {
    await bindSolidFillPath(node, "color/surface/base");
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
    if (node.fills?.length && node.fills[0].type === "SOLID") {
      bindFill(node, await getVar(path));
    }
    if (node.strokes?.length && node.strokes[0].type === "SOLID") {
      bindStroke(node, await getVar(path));
    }
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

function isWalletSummaryCard(node) {
  return (
    node?.type === "FRAME" &&
    (node.name === "Background+Border+Shadow" || node.name === "slots-browse-summary-card") &&
    node.parent?.name?.includes("Wallet")
  );
}

function isGameCard(node) {
  if (node?.type !== "FRAME" || !node.name.includes("Background+Border+Shadow")) return false;
  return node.children?.some((c) => c.name === "Heading 4" || c.name?.startsWith("slots-game-card"));
}

function isProviderTab(node) {
  return (
    node?.type === "FRAME" &&
    node.cornerRadius >= 12 &&
    node.width >= 100 &&
    node.height >= 48 &&
    node.height <= 80 &&
    node.parent?.layoutMode === "HORIZONTAL"
  );
}

function classifySummaryLabel(text) {
  const t = (text || "").trim();
  if (/wallet|rebate|balance|membership/i.test(t)) return "color/primary";
  if (t.length <= 24 && !/^\d/.test(t)) return "color/primary";
  return "color/text/primary";
}

function classifySummaryValue(text) {
  const t = (text || "").trim();
  if (/^[\d.,]+%?$/.test(t) || /^\d+\.\d{2}$/.test(t)) return "color/text/primary";
  return "color/text/primary";
}

const slotsFrame = await figma.getNodeByIdAsync(SLOTS_FRAME_ID);
if (!slotsFrame) throw new Error(`Slots frame ${SLOTS_FRAME_ID} not found`);

const browsePanel = await figma.getNodeByIdAsync("124:3488");
if (browsePanel) {
  browsePanel.name = "slots-browse-panel";
  await bindGradientFill(
    browsePanel,
    "color/gradient/home/muted/start",
    "color/gradient/home/muted/end",
  );
  await bindStrokePath(browsePanel, "color/border/subtle", 1);
}

const walletSection = await figma.getNodeByIdAsync("124:3489");
if (walletSection) walletSection.name = "slots-browse-summary-bar";

for (const id of ["124:3490", "124:3497"]) {
  const card = await figma.getNodeByIdAsync(id);
  if (!card) continue;
  card.name = "slots-browse-summary-card";
  await bindSolidFillPath(card, "color/surface");
  await bindStrokePath(card, "color/border/subtle", 1);
}

await bindTextPath(await figma.getNodeByIdAsync("124:3491"), "color/primary");
await bindTextPath(await figma.getNodeByIdAsync("124:3492"), "color/text/primary");
await bindTextPath(await figma.getNodeByIdAsync("124:3498"), "color/primary");
await bindTextPath(await figma.getNodeByIdAsync("124:3499"), "color/text/primary");

for (const id of ["124:3493", "124:3500"]) {
  const btn = await figma.getNodeByIdAsync(id);
  if (!btn) continue;
  btn.name = "slots-browse-summary-icon";
  await bindSolidFillPath(btn, "color/surface/float");
  await bindStrokePath(btn, "color/border/subtle", 1);
  const svg = btn.findOne((n) => n.name === "SVG");
  if (svg) await bindIconSubtree(svg, "color/info/icon");
}

const searchSection = await figma.getNodeByIdAsync("124:3503");
if (searchSection) searchSection.name = "slots-browse-search-row";

const searchInput = await figma.getNodeByIdAsync("124:3504");
if (searchInput) {
  searchInput.name = "slots-browse-search";
  await bindSolidFillPath(searchInput, "color/surface/input-inverse");
  await bindStrokePath(searchInput, "color/border/subtle", 1);
}

await bindTextPath(await figma.getNodeByIdAsync("124:3506"), "color/info/icon");

const searchIcon = await figma.getNodeByIdAsync("124:3507");
if (searchIcon) {
  if (searchIcon.type === "TEXT") await bindTextPath(searchIcon, "color/info/icon");
  else await bindIconSubtree(searchIcon, "color/info/icon");
}

async function bindGameCard(node) {
  if (!node || node.type !== "FRAME") return;
  node.name = "slots-game-card";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  for (const child of node.children) {
    if (child.name === "Heading 4" || child.type === "FRAME" && child.children?.some((c) => c.type === "TEXT")) {
      const title = child.findOne((n) => n.type === "TEXT");
      if (title) await bindTextPath(title, "color/text/primary");
    }
    if (child.name === "Paragraph+Background") {
      child.name = "slots-game-card__rtp";
      await bindSolidFillPath(child, "color/surface/rtp-secondary-card");
      await bindStrokePath(child, "color/border/brand", 1);
      const rtpText = child.findOne((n) => n.type === "TEXT");
      if (rtpText) await bindTextPath(rtpText, "color/surface/rtp-secondary-card-text");
      const arrow = child.findOne((n) => n.type === "VECTOR");
      if (arrow) await bindIconSubtree(arrow, "color/surface/rtp-secondary-card-text");
    }
    if (child.name === "Background" && child.children?.length) {
      child.name = "slots-game-card__thumb";
      await bindStrokePath(child, "color/border/danger", 1);
    }
  }
}

async function bindPromoSubtree(node) {
  if (!node) return;
  const n = (node.name || "").toLowerCase();
  if (n.includes("current promo") || node.name === "slot-current-promo") {
    node.name = "slot-current-promo";
  }
  if (n.includes("slot-current-promo__card") || (node.name === "Background+Border+Shadow" && node.parent?.name === "slot-current-promo")) {
    node.name = "slot-current-promo__card";
    await bindSolidFillPath(node, "color/surface");
    await bindStrokePath(node, "color/border/subtle", 1);
  }
  if (node.type === "TEXT") {
    const t = node.characters || "";
    if (/current promo/i.test(t)) await bindTextPath(node, "color/text/primary");
    else if (/end promo/i.test(t)) await bindTextPath(node, "color/button/cta/fourth/text");
    else if (/promo rollover/i.test(t)) await bindTextPath(node, "color/primary");
    else if (/^\d+%$/.test(t.trim())) await bindTextPath(node, "color/text/primary");
    else if (t.includes("/") && /\d/.test(t)) await bindTextPath(node, "color/primary");
    else if (node.name?.toLowerCase().includes("promo")) await bindTextPath(node, "color/primary");
  }
  if (node.name === "Button" && node.parent?.name?.includes("promo")) {
    node.name = "btn-theme-cta-fourth";
    await bindGradientFill(node, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
    await bindStrokePath(node, "color/border/brand", 1);
  }
  if (node.name?.toLowerCase().includes("progress") || node.name === "Progress") {
    const track = node.findOne((c) => c.width > 40 && c.height <= 8);
    const fill = node.findOne((c) => c.width < node.width && c.height <= 8);
    if (track) await bindSolidFillPath(track, "color/progress/bar/bg");
    if (fill) await bindSolidFillPath(fill, "color/progress/bar/fill");
  }
  if ("children" in node) {
    for (const child of node.children) await bindPromoSubtree(child);
  }
}

async function bindProviderTab(node, index = 0) {
  if (!node || node.type !== "FRAME") return;
  const active = index === 0 || node.name.includes("active");
  node.name = active ? "slots-provider-tab--active" : "slots-provider-tab";
  if (active) {
    await bindSolidFillPath(node, "color/button/tabs");
  } else {
    await bindSolidFillPath(node, "color/surface");
  }
  await bindStrokePath(node, "color/border/tabs", 2);
}

async function walkSlots(node, inBrowsePanel = false) {
  if (!node) return;

  if (node.id === "124:3488" || node.name === "slots-browse-panel") inBrowsePanel = true;

  if (isWalletSummaryCard(node)) {
    node.name = "slots-browse-summary-card";
    await bindSolidFillPath(node, "color/surface");
    await bindStrokePath(node, "color/border/subtle", 1);
  }

  if (isGameCard(node)) await bindGameCard(node);

  if (node.type === "TEXT" && inBrowsePanel) {
    const t = node.characters || "";
    if (node.parent?.name === "slots-browse-summary-card" || isWalletSummaryCard(node.parent)) {
      if (classifySummaryValue(t) && /[\d%]/.test(t)) await bindTextPath(node, "color/text/primary");
      else await bindTextPath(node, classifySummaryLabel(t));
    }
    if (/search games|search provider/i.test(t)) await bindTextPath(node, "color/info/icon");
    if (/games in|provider filter/i.test(t)) await bindTextPath(node, "color/text/muted");
    if (/^filter$/i.test(t.trim())) await bindTextPath(node, "color/text/secondary");
  }

  if (node.name === "Input" || node.name === "slots-browse-search") {
    node.name = "slots-browse-search";
    await bindSolidFillPath(node, "color/surface/input-inverse");
    await bindStrokePath(node, "color/border/subtle", 1);
  }

  if (node.name === "Button" && node.findOne((c) => c.type === "TEXT" && /^filter$/i.test(c.characters))) {
    node.name = "slots-browse-filter";
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/subtle", 1);
    const label = node.findOne((n) => n.type === "TEXT");
    if (label) await bindTextPath(label, "color/text/secondary");
    await bindIconSubtree(node, "color/primary");
  }

  await bindPromoSubtree(node);

  if ("children" in node) {
    if (node.name === "slots-provider-tabs" || (node.layoutMode === "HORIZONTAL" && node.children?.every(isProviderTab))) {
      node.name = "slots-provider-tabs";
      let i = 0;
      for (const child of node.children) {
        if (isProviderTab(child)) await bindProviderTab(child, i++);
      }
    }
    for (const child of node.children) await walkSlots(child, inBrowsePanel);
  }
}

await walkSlots(slotsFrame);

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
audit(slotsFrame);

return {
  frameId: slotsFrame.id,
  frameName: slotsFrame.name,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/gradient/home/muted (slots-browse-panel)",
    "color/surface + color/border/subtle (summary cards)",
    "color/primary + color/text/primary (wallet labels/values)",
    "color/surface/float + color/info/icon (summary icons)",
    "color/surface/input-inverse + color/border/subtle (search)",
    "color/button/tabs + color/border/tabs (provider tabs)",
    "color/surface/base + color/border/danger (game cards)",
    "color/surface/rtp-secondary-card (+text, border/brand)",
    "color/progress/bar/* + color/button/cta/fourth (promo when present)",
  ],
};
