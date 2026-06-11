/* use_figma — Bind Referral - Invite Friends (referral.jsx, VARIABLE-RULES.en.md §13.11 Web_Referral) */

const REFERRAL_FRAME_ID = "131:5287";
const PANEL_ID = "131:5291";
const TAB_BAR_ID = "131:5292";

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

function textOf(node) {
  if (!node) return "";
  if (node.type === "TEXT") return node.characters || "";
  return node.findOne((n) => n.type === "TEXT")?.characters || "";
}

function isMoneyValue(text) {
  const t = (text || "").trim();
  return /^[$€£]?\s*[\d,.]+$/.test(t) || /^[A-Za-z]{3}\s+[\d,.]+$/.test(t);
}

async function bindSectionTab(node, activeLabel = /invite friends/i) {
  if (!node || node.type !== "FRAME") return;
  if (!/Button|referral-section-tab/.test(node.name)) return;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = activeLabel.test(label?.characters || "");
  node.name = selected ? "referral-section-tab--active" : "referral-section-tab";
  if (selected) {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/brand", 1);
    if (label) {
      await bindTextPath(label, "color/surface/menu/active");
    } else {
      for (const vector of node.findAll((n) => n.type === "VECTOR")) {
        const variable = await getVar("color/surface/menu/active");
        if (!variable || !vector.fills?.length) continue;
        const paint = vector.fills[0];
        if (paint.type !== "SOLID") continue;
        vector.fills = [
          figma.variables.setBoundVariableForPaint(paint, "color", variable),
        ];
      }
    }
  } else {
    node.fills = [];
    if (label) await bindTextPath(label, "color/text/muted");
  }
}

async function bindBenefitChip(node) {
  if (!node || node.type !== "FRAME") return;
  node.name = "referral-benefit-chip";
  await bindSolidFillPath(node, "color/surface/subtle");
  await bindStrokePath(node, "color/border/subtle", 1);
  for (const child of node.children) {
    if (child.name === "Background" || child.name === "referral-benefit-chip__icon") {
      child.name = "referral-benefit-chip__icon";
      await bindSolidFillPath(child, "color/accent/pale");
      await bindIconSubtree(child, "color/button/hover");
    }
    if (child.type === "TEXT" && child.name !== "Symbol") {
      await bindTextPath(child, "color/text/primary");
    }
  }
}

async function bindBonusSidebar(node) {
  if (!node || node.type !== "FRAME") return;
  node.name = "referral-bonus-sidebar";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);
  for (const child of node.children) {
    if (child.type === "TEXT") {
      const t = child.characters || "";
      if (/total referral/i.test(t)) await bindTextPath(child, "color/text/muted");
      else if (isMoneyValue(t)) await bindTextPath(child, "color/primary");
    }
    if (
      child.type === "RECTANGLE" ||
      child.name === "referral-info-icon" ||
      (child.name === "Symbol" && child.type === "TEXT")
    ) {
      if (child.type === "RECTANGLE") {
        child.name = "referral-info-icon";
        await bindSolidFillPath(child, "color/accent/glow");
      } else {
        await bindTextPath(child, "color/button/hover");
      }
    }
    if (child.name === "referral-info-icon" && child.type !== "RECTANGLE") {
      await bindSolidFillPath(child, "color/accent/glow");
      await bindIconSubtree(child, "color/button/hover");
    }
    if (child.name === "Button") {
      const label = textOf(child);
      if (/downlines/i.test(label)) {
        child.name = "btn-theme-cta";
        await bindGradientFill(child, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
        await bindStrokePath(child, "color/border/brand", 1);
        const t = child.findOne((n) => n.type === "TEXT");
        if (t) await bindTextPath(t, "color/text/card/text");
      }
    }
  }
}

async function bindCopyCard(node) {
  if (!node || node.type !== "FRAME") return;
  const heading = node.findOne(
    (n) => n.type === "TEXT" && (n.name?.startsWith("Heading 3") || n.fontSize >= 14),
  );
  const title = heading?.characters || "";
  if (/referral code/i.test(title)) node.name = "referral-code-card";
  else if (/referral link/i.test(title)) node.name = "referral-link-card";
  else if (/qr code/i.test(title)) node.name = "referral-qr-card";
  else node.name = "surface-card";

  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  if (heading) {
    heading.name = "referral-card__title";
    await bindTextPath(heading, "color/text/primary");
  }

  for (const child of node.children) {
    if (child.name?.includes("Background+Border") && child.findOne((n) => n.name === "Input")) {
      child.name = "referral-input-row";
      await bindSolidFillPath(child, "color/surface/input/color");
      await bindStrokePath(child, "color/border/brand", 1);
      for (const t of child.findAll((n) => n.type === "TEXT")) {
        if (t.name !== "Symbol") await bindTextPath(t, "color/text/primary");
      }
      const copyBtn = child.findOne((n) => n.name === "Button");
      if (copyBtn) {
        copyBtn.name = "referral-copy-btn";
        await bindSolidFillPath(copyBtn, "color/surface/base");
        await bindStrokePath(copyBtn, "color/border/subtle", 1);
        await bindIconSubtree(copyBtn, "color/text/muted");
      }
    }

    if (child.name?.includes("Background+Border") && child.findOne((n) => /qr code/i.test(n.name))) {
      child.name = "referral-qr-frame";
      await bindSolidFillPath(child, "color/surface/base");
      await bindStrokePath(child, "color/border/brand", 1);
    }

    if (child.name === "Button") {
      const label = textOf(child);
      if (/share/i.test(label)) {
        child.name = "referral-share-btn";
        const t = child.findOne((n) => n.type === "TEXT" && n.name !== "Symbol");
        if (t) await bindTextPath(t, "color/text/muted");
        await bindIconSubtree(child, "color/text/muted");
      }
    }

    if (child.type === "TEXT" && /share via social/i.test(child.characters || "")) {
      await bindTextPath(child, "color/text/muted");
    }

    if (child.name === "Link") {
      child.name = "referral-social-link";
      await bindIconSubtree(child, "color/text/muted");
    }
  }
}

const referralFrame = await figma.getNodeByIdAsync(REFERRAL_FRAME_ID);
if (!referralFrame) throw new Error(`Frame ${REFERRAL_FRAME_ID} not found`);

referralFrame.name = "referral-page";

for (const bgId of ["131:5288", "131:5289"]) {
  const bg = await figma.getNodeByIdAsync(bgId);
  if (bg) {
    bg.name = "referral-page__background";
    await bindSolidFillPath(bg, "color/surface/base");
  }
}

const panel = await figma.getNodeByIdAsync(PANEL_ID);
if (panel) {
  panel.name = "soft-blue-panel";
  await bindGradientFill(
    panel,
    "color/gradient/referral/panel/start",
    "color/gradient/referral/panel/end",
  );
  await bindStrokePath(panel, "color/accent/glow", 1);
}

const tabBar = await figma.getNodeByIdAsync(TAB_BAR_ID);
if (tabBar) {
  tabBar.name = "referral-tab-bar";
  await bindSolidFillPath(tabBar, "color/surface/subtle");
  await bindStrokePath(tabBar, "color/border/subtle", 1);
  for (const child of tabBar.children) {
    if (child.name === "Button" || child.name?.startsWith("referral-section-tab")) {
      await bindSectionTab(child);
    }
  }
}

const inviteHeading = await figma.getNodeByIdAsync("131:5301");
if (inviteHeading) {
  inviteHeading.name = "referral-invite-heading";
  await bindTextPath(inviteHeading, "color/text/primary");
}
const desc = await figma.getNodeByIdAsync("131:5302");
if (desc) {
  desc.name = "referral-invite-description";
  await bindTextPath(desc, "color/text/muted");
}

for (const id of ["131:5303", "131:5307", "131:5311"]) {
  await bindBenefitChip(await figma.getNodeByIdAsync(id));
}

await bindBonusSidebar(await figma.getNodeByIdAsync("131:5315"));
for (const id of ["131:5324", "131:5342", "131:5353"]) {
  await bindCopyCard(await figma.getNodeByIdAsync(id));
}

async function walkReferral(node) {
  if (!node) return;
  if (node.parent?.id === PANEL_ID && node.name === "Background+Border" && !node.name.includes("Shadow")) {
    await bindBenefitChip(node);
  }
  if (node.parent?.id === PANEL_ID && node.name === "Background+Border+Shadow") {
    const t = node.findOne((n) => n.type === "TEXT" && /total referral/i.test(n.characters || ""));
    if (t) await bindBonusSidebar(node);
    else if (node.findOne((n) => n.name?.startsWith("Heading 3"))) await bindCopyCard(node);
  }
  if ("children" in node) {
    for (const child of node.children) await walkReferral(child);
  }
}
await walkReferral(referralFrame);

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
audit(referralFrame);

return {
  frameId: referralFrame.id,
  frameName: referralFrame.name,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/surface/base (page + surface-card shells)",
    "color/gradient/referral/panel + color/accent/glow (soft-blue-panel)",
    "color/surface/subtle (tab bar + benefit chips)",
    "color/text/sub/title + color/border/brand (active section tab)",
    "color/text/muted (inactive tabs, labels, share)",
    "color/primary (bonus totals)",
    "color/surface/input/color (code/link fields)",
    "color/gradient/button/cta (Downlines CTA)",
  ],
};
