const FRAME_ID = "131:6079";
const PAGE_BG_ID = "131:6080";
const TAB_BAR_ID = "131:6085";
const SECTION_TAB_IDS = ["131:6087", "131:6089", "131:6091", "131:6093"];
const REWARD_CARD_IDS = ["131:6095", "131:6121"];
const HISTORY_SECTION_ID = "131:6147";
const HISTORY_FILTER_BAR_ID = "131:6151";
const HISTORY_FILTER_TAB_IDS = ["131:6153", "131:6155"];
const TABLE_ID = "131:6157";

const ACTIVE_SECTION_LABEL = /my rewards/i;
const ACTIVE_HISTORY_LABEL = /referral commission bonus/i;

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
  if (!startVar || !endVar || !node) return;
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
      await bindSolidFillPath(node, path);
    }
    if (node.strokes?.length) bindStroke(node, await getVar(path));
  }
  if (node.type === "TEXT" && node.name === "Symbol") {
    await bindTextPath(node, path);
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

function isMoneyValue(text) {
  const t = (text || "").trim();
  return /^[$€£]?\s*[\d,.]+$/.test(t) || /^[A-Za-z]{3}\s+[\d,.]+$/.test(t);
}

async function bindSectionTab(node) {
  if (!node || node.type !== "FRAME") return null;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = ACTIVE_SECTION_LABEL.test(label?.characters || "");
  node.name = selected ? "referral-section-tab--active" : "referral-section-tab";
  if (selected) {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/brand", 1);
    if (label) await bindTextPath(label, "color/surface/menu/active");
  } else {
    node.fills = [];
    if (label) await bindTextPath(label, "color/text/muted");
  }
  return { id: node.id, text: label?.characters, selected };
}

async function bindHistoryFilterTab(node) {
  if (!node || node.type !== "FRAME") return null;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = ACTIVE_HISTORY_LABEL.test(label?.characters || "");
  node.name = selected ? "referral-history-tab--active" : "referral-history-tab";
  if (selected) {
    await bindGradientFill(node, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
    await bindStrokePath(node, "color/border/brand", 1);
    if (label) await bindTextPath(label, "color/text/cta/inverse");
  } else {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/subtle", 1);
    if (label) await bindTextPath(label, "color/text/secondary");
  }
  return { id: node.id, text: label?.characters, selected };
}

async function bindRewardSummaryCard(node) {
  if (!node || node.type !== "FRAME") return;
  node.name = "referral-reward-summary-card";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  for (const child of node.children) {
    if (child.name === "Background") {
      child.name = "referral-reward-card__icon";
      await bindGradientFill(
        child,
        "color/gradient/referral/card/start",
        "color/gradient/referral/card/end",
      );
    }

    if (child.type === "TEXT" && child.name?.startsWith("Heading 3")) {
      child.name = "referral-reward-card__title";
      await bindTextPath(child, "color/text/primary");
    }

    if (child.type === "TEXT" && /claim your available/i.test(child.characters || "")) {
      await bindTextPath(child, "color/text/muted");
    }

    if (child.name === "Button") {
      child.name = "btn-theme-cta";
      await bindGradientFill(child, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
      const claim = child.findOne((n) => n.type === "TEXT");
      if (claim) await bindTextPath(claim, "color/text/card/text");
    }

    if (child.name?.startsWith("Paragraph+Background+Border")) {
      await bindSolidFillPath(child, "color/surface/subtle");
      await bindStrokePath(child, "color/border/subtle", 1);
      for (const t of child.findAll((n) => n.type === "TEXT")) {
        const text = t.characters || "";
        if (/today|this month|total claimed|unclaimed/i.test(text)) {
          await bindTextPath(t, "color/text/muted");
        } else if (/unclaimed/i.test(child.findOne((n) => n.type === "TEXT" && /unclaimed/i.test(n.characters))?.characters ? "" : "") && isMoneyValue(text)) {
          // handled below via label sibling
        } else if (isMoneyValue(text)) {
          const label = child.findOne((n) => n.type === "TEXT" && /unclaimed/i.test(n.characters));
          await bindTextPath(t, label ? "color/text/accent" : "color/text/primary");
        }
      }
      const labelNode = child.findOne((n) => n.type === "TEXT" && !isMoneyValue(n.characters));
      const valueNode = child.findOne((n) => n.type === "TEXT" && isMoneyValue(n.characters));
      if (labelNode) await bindTextPath(labelNode, "color/text/muted");
      if (valueNode) {
        const isUnclaimed = /unclaimed/i.test(labelNode?.characters || "");
        await bindTextPath(valueNode, isUnclaimed ? "color/text/accent" : "color/text/primary");
      }
    }

    if (child.name === "Background+Border") {
      await bindSolidFillPath(child, "color/surface/subtle");
      await bindStrokePath(child, "color/border/subtle", 1);
      const iconBg = child.findOne((n) => n.name === "Background");
      if (iconBg) {
        iconBg.name = "referral-reward-note__icon";
        await bindSolidFillPath(iconBg, "color/accent/pale");
        await bindIconSubtree(iconBg, "color/button/hover");
      }
      for (const t of child.findAll((n) => n.type === "TEXT" && n.name !== "Symbol")) {
        await bindTextPath(t, "color/text/secondary");
      }
    }
  }
}

async function bindHistorySection(node) {
  if (!node) return;
  node.name = "referral-reward-history";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  for (const child of node.children) {
    if (child.name?.startsWith("Paragraph+HorizontalBorder")) {
      await bindStrokePath(child, "color/border/subtle", 1);
      for (const t of child.findAll((n) => n.type === "TEXT")) {
        if (/reward history/i.test(t.characters || "")) {
          t.name = "referral-reward-history__title";
          await bindTextPath(t, "color/text/primary");
        } else {
          await bindTextPath(t, "color/text/muted");
        }
      }
    }
  }
}

async function bindHistoryTable(node) {
  if (!node) return;
  const header = node.findOne((n) => n.name?.startsWith("Header"));
  if (header) {
    await bindSolidFillPath(header, "color/surface/subtle");
    await bindStrokePath(header, "color/border/subtle", 1);
    for (const t of header.findAll((n) => n.type === "TEXT")) {
      await bindTextPath(t, "color/text/muted");
    }
  }

  for (const row of node.findAll((n) => n.name === "Row")) {
    await bindStrokePath(row, "color/border/subtle", 1);
    for (const t of row.findAll((n) => n.type === "TEXT")) {
      const text = t.characters || "";
      if (/claimed$/i.test(text) && text !== "-") {
        await bindTextPath(t, "color/success");
      } else if (/unclaimed/i.test(text)) {
        await bindTextPath(t, "color/text/accent");
      } else if (isMoneyValue(text)) {
        await bindTextPath(t, "color/text/accent");
      } else if (/\d{2} \w{3} \d{4}/.test(text) && !/,/.test(text)) {
        await bindTextPath(t, "color/text/primary");
      } else {
        await bindTextPath(t, "color/text/muted");
      }
    }
  }
}

const frame = await figma.getNodeByIdAsync(FRAME_ID);
if (!frame) throw new Error("Referral - My Rewards not found");
frame.name = "Referral - My Rewards";

const pageBg = await figma.getNodeByIdAsync(PAGE_BG_ID);
if (pageBg) {
  pageBg.name = "referral-page__background";
  await bindSolidFillPath(pageBg, "color/surface/base");
}

const tabBar = await figma.getNodeByIdAsync(TAB_BAR_ID);
if (tabBar) {
  tabBar.name = "referral-tab-bar";
  await bindSolidFillPath(tabBar, "color/surface/subtle");
  await bindStrokePath(tabBar, "color/border/subtle", 1);
}

const sectionTabs = [];
for (const id of SECTION_TAB_IDS) {
  const tab = await figma.getNodeByIdAsync(id);
  const info = await bindSectionTab(tab);
  if (info) sectionTabs.push(info);
}

const rewardCards = [];
for (const id of REWARD_CARD_IDS) {
  const card = await figma.getNodeByIdAsync(id);
  if (card) {
    await bindRewardSummaryCard(card);
    rewardCards.push({ id: card.id, name: card.name });
  }
}

const historySection = await figma.getNodeByIdAsync(HISTORY_SECTION_ID);
await bindHistorySection(historySection);

const filterBar = await figma.getNodeByIdAsync(HISTORY_FILTER_BAR_ID);
if (filterBar) {
  filterBar.name = "referral-history-filter-bar";
  await bindSolidFillPath(filterBar, "color/surface/notify");
  await bindStrokePath(filterBar, "color/border/subtle", 1);
}

const historyTabs = [];
for (const id of HISTORY_FILTER_TAB_IDS) {
  const tab = await figma.getNodeByIdAsync(id);
  const info = await bindHistoryFilterTab(tab);
  if (info) historyTabs.push(info);
}

const table = await figma.getNodeByIdAsync(TABLE_ID);
await bindHistoryTable(table);

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
audit(frame);

return {
  frameId: frame.id,
  frameName: frame.name,
  sectionTabs,
  rewardCards,
  historyTabs,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/surface/base (page, cards, active section tab)",
    "color/surface/subtle (tab bar, stat tiles, table header)",
    "color/surface/menu/active (active section tab label)",
    "color/surface/notify (history filter bar)",
    "color/text/primary|muted|secondary|accent (copy + table)",
    "color/text/cta/inverse (selected history filter tab)",
    "color/text/card/text (Claim CTA)",
    "color/success (Claimed status)",
    "color/gradient/referral/card (reward icon tile)",
    "color/gradient/button/cta (Claim + selected history tab)",
    "color/accent/pale + color/button/hover (info note icon)",
    "color/border/subtle|brand",
  ],
};
