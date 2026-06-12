/* use_figma — Bind Membership frame (VipPage.jsx + .vip-page, VARIABLE-RULES.en.md §13.11) */

const FRAME_ID = "399:3530";
const PAGE_BG_ID = "399:3533";
const PANEL_ID = "399:3566";
const VIP_CLUB_BADGE_ID = "399:3573";
const STAT_CARD_IDS = ["399:3599", "399:3613", "399:3623"];
const TIER_BUTTON_IDS = [
  { id: "399:3639", selected: true },
  { id: "399:3649", selected: false },
  { id: "399:3654", selected: false },
  { id: "399:3658", selected: false },
  { id: "399:3662", selected: false },
  { id: "399:3666", selected: false },
];
const TAB_IDS = ["399:3672", "399:3677"];
const HORIZONTAL_BORDER_ID = "399:3670";
const TABLE_SHELL_IDS = [
  { shell: "399:3680", table: "399:3681" },
  { shell: "399:3706", table: "399:3707" },
];
const HIGHLIGHTS_ID = "399:3737";
const JOIN_NOW_ID = "399:3750";

const ACTIVE_TAB_LABEL = /membership benefits/i;

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

async function bindGradientFill(node, startPath, endPath, vertical = false) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) return;
  node.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: vertical
        ? [
            [0, 1, 0],
            [-1, 0, 1],
          ]
        : [
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

async function bindVerticalBrandGradient(node) {
  await bindGradientFill(
    node,
    "color/gradient/membership/tier/start",
    "color/gradient/membership/tier/end",
    true,
  );
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

function isValueText(text) {
  const t = (text || "").trim();
  return /%$/.test(t) || /^(high priority|no limit|first priority|low priority|\d[\d,.]*)$/i.test(t);
}

async function bindStatCard(node) {
  if (!node) return;
  node.name = "surface-card";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  for (const t of node.findAll((n) => n.type === "TEXT")) {
    const text = t.characters || "";
    if (/^(starting tier|top reward tier|member support)$/i.test(text)) {
      await bindTextPath(t, "color/text/fifth/title");
    } else {
      await bindTextPath(t, "color/text/primary");
    }
  }
}

async function bindTierButton(node, selected) {
  if (!node) return null;
  const label = node.findOne((n) => n.type === "TEXT");
  node.name = selected ? "vip-tier-card--selected" : "vip-tier-card";
  if (selected) {
    await bindVerticalBrandGradient(node);
    await bindStrokePath(node, "color/border/brand", 1);
    if (label) await bindTextPath(label, "color/text/card/text");
  } else {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/subtle", 1);
    if (label) await bindTextPath(label, "color/primary");
  }
  return { id: node.id, tier: label?.characters, selected };
}

async function bindMembershipTab(node) {
  if (!node) return null;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = ACTIVE_TAB_LABEL.test(label?.characters || "");
  node.name = selected ? "vip-membership-tabs__tab--active" : "vip-membership-tabs__tab";
  if (selected) {
    await bindSolidFillPath(node, "color/button/tabs");
    await bindStrokePath(node, "color/button/tabs", 1);
    if (label) await bindTextPath(label, "color/button/tabs/text");
  } else {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/subtle", 1);
    if (label) await bindTextPath(label, "color/text/muted");
  }
  return { id: node.id, text: label?.characters, selected };
}

async function bindMembershipTable(shellId, tableId) {
  const shell = await figma.getNodeByIdAsync(shellId);
  const table = await figma.getNodeByIdAsync(tableId);
  if (!shell || !table) return;

  shell.name = "vip-membership-table";
  await bindSolidFillPath(shell, "color/surface/base");
  await bindStrokePath(shell, "color/border/subtle", 1);

  const header = table.findOne((n) => n.name?.startsWith("Header"));
  if (header) {
    header.name = "vip-membership-brand-gradient";
    await bindVerticalBrandGradient(header);
    for (const t of header.findAll((n) => n.type === "TEXT")) {
      await bindTextPath(t, "color/text/card/text");
    }
  }

  for (const row of table.findAll((n) => n.name === "Row")) {
    await bindSolidFillPath(row, "color/surface/base");
    await bindStrokePath(row, "color/border/subtle", 1);
    const texts = row.findAll((n) => n.type === "TEXT");
    for (const t of texts) {
      await bindTextPath(t, isValueText(t.characters) ? "color/primary" : "color/text/muted");
    }
    for (const cell of row.findAll((n) => n.name === "Data")) {
      await bindSolidFillPath(cell, "color/surface/base");
    }
  }
}

const frame = await figma.getNodeByIdAsync(FRAME_ID);
if (!frame) throw new Error("Membership frame not found");
frame.name = "Membership";

const pageBg = await figma.getNodeByIdAsync(PAGE_BG_ID);
if (pageBg) {
  pageBg.name = "vip-page__background";
  await bindSolidFillPath(pageBg, "color/surface/base");
}

const panel = await figma.getNodeByIdAsync(PANEL_ID);
if (panel) {
  panel.name = "soft-blue-panel";
  await bindGradientFill(
    panel,
    "color/gradient/home/muted/start",
    "color/gradient/home/muted/end",
    true,
  );
  await bindStrokePath(panel, "color/accent/glow", 1);
}

const vipClubBadge = await figma.getNodeByIdAsync(VIP_CLUB_BADGE_ID);
if (vipClubBadge) {
  vipClubBadge.name = "vip-club-badge";
  await bindSolidFillPath(vipClubBadge, "color/surface/base");
  await bindStrokePath(vipClubBadge, "color/accent/glow", 1);
  const crown = vipClubBadge.findOne((n) => n.name === "SVG");
  if (crown) await bindIconSubtree(crown, "color/accent");
  const label = vipClubBadge.findOne((n) => n.type === "TEXT");
  if (label) await bindTextPath(label, "color/text/fifth/title");
}

for (const t of frame.findAll((n) => n.type === "TEXT")) {
  const text = t.characters || "";
  if (t.id === "399:3588" || t.id === "399:3635" || t.id === "399:3743") {
    await bindTextPath(t, "color/text/primary");
  } else if (t.id === "399:3593" || t.id === "399:3747") {
    await bindTextPath(t, "color/text/muted");
  }
}

const statCards = [];
for (const id of STAT_CARD_IDS) {
  const card = await figma.getNodeByIdAsync(id);
  await bindStatCard(card);
  statCards.push({ id });
}

const tierButtons = [];
for (const { id, selected } of TIER_BUTTON_IDS) {
  const btn = await figma.getNodeByIdAsync(id);
  const info = await bindTierButton(btn, selected);
  if (info) tierButtons.push(info);
}

const horizontalBorder = await figma.getNodeByIdAsync(HORIZONTAL_BORDER_ID);
if (horizontalBorder) {
  horizontalBorder.name = "vip-membership-divider";
  await bindStrokePath(horizontalBorder, "color/border/subtle", 1);
}

const tabs = [];
for (const id of TAB_IDS) {
  const tab = await figma.getNodeByIdAsync(id);
  const info = await bindMembershipTab(tab);
  if (info) tabs.push(info);
}

const tables = [];
for (const { shell, table } of TABLE_SHELL_IDS) {
  await bindMembershipTable(shell, table);
  tables.push({ shell, table });
}

const highlights = await figma.getNodeByIdAsync(HIGHLIGHTS_ID);
if (highlights) {
  highlights.name = "vip-highlights-card";
  await bindSolidFillPath(highlights, "color/surface/base");
  await bindStrokePath(highlights, "color/border/subtle", 1);
}

const joinNow = await figma.getNodeByIdAsync(JOIN_NOW_ID);
if (joinNow) {
  joinNow.name = "btn-theme-cta";
  await bindGradientFill(joinNow, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
  await bindStrokePath(joinNow, "color/border/brand", 1);
  const label = joinNow.findOne((n) => n.type === "TEXT");
  if (label) await bindTextPath(label, "color/text/card/text");
  const chevron = joinNow.findOne((n) => n.name === "SVG");
  if (chevron) await bindIconSubtree(chevron, "color/text/card/text");
}

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
  tierButtons,
  tabs,
  statCards,
  tables,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/surface/base (page, cards, tables, inactive tier/tab)",
    "color/gradient/home/muted (soft-blue-panel)",
    "color/accent/glow + color/accent (VIP Club badge)",
    "color/text/fifth/title (badge + stat eyebrows)",
    "color/text/primary (headings, stat values, tier labels, table values)",
    "color/text/muted (body copy, inactive tab, table labels)",
    "color/text/card/text (selected tier, table headers, Join Now)",
    "color/gradient/membership/tier (selected tier + table header gradient)",
    "color/button/tabs + color/button/tabs/text (active section tab)",
    "color/border/subtle|brand",
    "color/gradient/button/cta (Join Now CTA)",
  ],
};
