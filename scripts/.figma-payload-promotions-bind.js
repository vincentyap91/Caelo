const PROMOTIONS_FRAME_ID = "124:4241";
const MAIN_SECTION_ID = "124:4244";

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

function isPromotionCard(node) {
  return (
    node?.type === "FRAME" &&
    (node.name === "Background+Border+Shadow" || node.name === "promotion-card") &&
    node.parent?.id === MAIN_SECTION_ID &&
    node.children?.some((c) => c.name?.includes("HorizontalBorder"))
  );
}

function isCategoryTabButton(node) {
  return (
    node?.type === "FRAME" &&
    node.name === "Button" &&
    (node.parent?.name === "Tablist - Promotions" ||
      node.parent?.name === "promotion-style-tabs")
  );
}

function isCountdownNumber(text) {
  return /^\d+$/.test((text || "").trim());
}

function isCountdownUnitLabel(text) {
  return /^(days|hours|mins|sec)$/i.test((text || "").trim());
}

async function bindImageTag(overlayNode) {
  if (!overlayNode) return;
  const label = overlayNode.findOne((n) => n.type === "TEXT");
  if (!label) return;
  overlayNode.name = "promotion-card-image-tag";
  const available = /available/i.test(label.characters || "");
  const conditions = /conditions/i.test(label.characters || "");
  if (available) {
    overlayNode.name = "promotion-card-image-tag--available";
    await bindSolidFillPath(overlayNode, "color/secondary-tag");
    await bindTextPath(label, "color/secondary-tag-text");
  } else if (conditions) {
    overlayNode.name = "promotion-card-image-tag--conditions";
    await bindSolidFillPath(overlayNode, "color/primary-tag");
    await bindTextPath(label, "color/primary-tag-text");
  }
}

async function bindPromotionCard(node) {
  if (!node || node.type !== "FRAME") return;
  node.name = "promotion-card";
  await bindSolidFillPath(node, "color/surface/base");
  await bindStrokePath(node, "color/border/subtle", 1);

  for (const child of node.children) {
    if (child.name?.includes("HorizontalBorder")) {
      child.name = "promotion-card__image";
      await bindStrokePath(child, "color/border/subtle", 1);
      const tag = child.findOne(
        (n) => n.name?.includes("Overlay") || n.name?.startsWith("promotion-card-image-tag"),
      );
      await bindImageTag(tag);
    }

    if (child.name === "Background" || child.name === "promotion-card__body") {
      child.name = "promotion-card__body";
      for (const bodyChild of child.children) {
        if (bodyChild.name === "Background" || bodyChild.name === "promotion-card-category") {
          bodyChild.name = "promotion-card-category";
          await bindSolidFillPath(bodyChild, "color/secondary-tag");
          const chipText = bodyChild.findOne((n) => n.type === "TEXT");
          if (chipText) await bindTextPath(chipText, "color/secondary-tag-text");
        }

        if (bodyChild.name?.includes("Timer") || bodyChild.name === "countdown-timer") {
          bodyChild.name = "countdown-timer";
          const remaining = bodyChild.findOne(
            (n) => n.type === "TEXT" && /remaining time/i.test(n.characters || ""),
          );
          if (remaining) await bindTextPath(remaining, "color/text/subtle");

          const timerShell = bodyChild.findOne((n) => n.name?.includes("Background+Border"));
          if (timerShell) {
            timerShell.name = "countdown-timer__shell";
            await bindStrokePath(timerShell, "color/border/brand", 1);
          }

          for (const t of bodyChild.findAll((n) => n.type === "TEXT")) {
            const chars = (t.characters || "").trim();
            if (isCountdownNumber(chars)) await bindTextPath(t, "color/button/cta/end");
            else if (isCountdownUnitLabel(chars)) await bindTextPath(t, "color/text/subtle");
            else if (/promotion ended/i.test(chars)) await bindTextPath(t, "color/text/muted");
          }
        }

        if (bodyChild.name?.startsWith("Heading 3") || bodyChild.name === "promotion-card__title") {
          bodyChild.name = "promotion-card__title";
          await bindTextPath(bodyChild, "color/text/primary");
        }

        if (
          bodyChild.type === "TEXT" &&
          bodyChild.name !== "promotion-card__title" &&
          !/remaining|days|hours|mins|sec/i.test(bodyChild.characters || "") &&
          (bodyChild.characters || "").length > 40
        ) {
          bodyChild.name = "promotion-card__description";
          await bindTextPath(bodyChild, "color/text/muted");
        }

        if (bodyChild.name === "Button") {
          const label = bodyChild.findOne((n) => n.type === "TEXT");
          const text = (label?.characters || "").trim();
          if (/more info/i.test(text)) {
            bodyChild.name = "btn-more-info";
            await bindSolidFillPath(bodyChild, "color/surface/base");
            await bindStrokePath(bodyChild, "color/border/subtle", 1);
            if (label) await bindTextPath(label, "color/text/secondary");
          } else if (/join now|claim now/i.test(text)) {
            bodyChild.name = "btn-theme-cta";
            await bindGradientFill(
              bodyChild,
              "color/gradient/button/cta/start",
              "color/gradient/button/cta/end",
            );
            await bindStrokePath(bodyChild, "color/border/brand", 1);
            if (label) await bindTextPath(label, "color/text/card-text");
          }
        }
      }
    }
  }
}

async function bindCategoryTab(node, index) {
  if (!node || node.type !== "FRAME") return;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = index === 0;
  node.name = selected ? "btn-theme-tab-selected" : "promotion-style-tab";
  if (selected) {
    await bindGradientFill(node, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
    await bindStrokePath(node, "color/border/brand", 1);
    if (label) await bindTextPath(label, "color/text/cta-inverse");
  } else {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/subtle", 1);
    if (label) await bindTextPath(label, "color/text/secondary");
  }
}

const promotionsFrame = await figma.getNodeByIdAsync(PROMOTIONS_FRAME_ID);
if (!promotionsFrame) throw new Error(`Promotions frame ${PROMOTIONS_FRAME_ID} not found`);

const mainSection = await figma.getNodeByIdAsync(MAIN_SECTION_ID);
if (mainSection) mainSection.name = "promotion-page__main";

const pageTitle = await figma.getNodeByIdAsync("124:4245");
if (pageTitle) {
  pageTitle.name = "page-title";
  await bindTextPath(pageTitle, "color/text/primary");
}

const tabsPanel = await figma.getNodeByIdAsync("124:4246");
if (tabsPanel) {
  tabsPanel.name = "promotion-style-tabs-panel";
  await bindSolidFillPath(tabsPanel, "color/surface/base");
  await bindStrokePath(tabsPanel, "color/border/subtle", 1);
}

const tablist = await figma.getNodeByIdAsync("124:4247");
if (tablist) {
  tablist.name = "promotion-style-tabs";
  let tabIndex = 0;
  for (const child of tablist.children) {
    if (isCategoryTabButton(child) || child.name === "Button") {
      await bindCategoryTab(child, tabIndex++);
    }
  }
}

async function walkPromotions(node) {
  if (!node) return;

  if (node.id === PROMOTIONS_FRAME_ID || node.name === "promotion-page") {
    node.name = "promotion-page";
  }

  if (isPromotionCard(node)) await bindPromotionCard(node);

  if (node.type === "TEXT") {
    const t = (node.characters || "").trim();
    if (/^load more$/i.test(t)) {
      const btn = node.parent;
      if (btn?.name === "Button") {
        btn.name = "btn-theme-cta";
        await bindGradientFill(btn, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
        await bindStrokePath(btn, "color/border/brand", 1);
        await bindTextPath(node, "color/text/card-text");
      }
    }
  }

  if ("children" in node) {
    for (const child of node.children) await walkPromotions(child);
  }
}

for (const bgId of ["124:4242", "124:4243"]) {
  const bg = await figma.getNodeByIdAsync(bgId);
  if (bg?.name === "Background") {
    bg.name = "promotion-page__background";
    await bindSolidFillPath(bg, "color/surface/base");
  }
}

await walkPromotions(promotionsFrame);

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
audit(promotionsFrame);

return {
  frameId: promotionsFrame.id,
  frameName: promotionsFrame.name,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/surface/base (page + cards + tabs panel)",
    "color/text/primary (page-title + card titles)",
    "color/text/muted (card descriptions)",
    "color/text/secondary (inactive tabs + More Info)",
    "color/text/subtle (countdown labels)",
    "color/primary-tag(+text) (Conditions Required banner)",
    "color/secondary-tag(+text) (Available banner + category chip)",
    "color/gradient/button/cta + color/border/brand (selected tab + CTA)",
    "color/button/cta/end (countdown numbers)",
  ],
};
