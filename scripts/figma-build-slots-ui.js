/* use_figma — Caelo – Slots UI with 1:1 semantic bindings (SlotsPage.jsx) */

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const page = figma.root.children.find((p) => p.name === "Caelo – Slots");
if (!page) throw new Error('Missing page "Caelo – Slots"');
await figma.setCurrentPageAsync(page);

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

function solidFill(hex = { r: 1, g: 1, b: 1 }) {
  return [{ type: "SOLID", color: hex }];
}

function bindFill(node, variable) {
  if (!variable || !node.fills?.length) return;
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
}

function bindStroke(node, variable) {
  if (!variable || !node.strokes?.length) return;
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
}

async function bindFillPath(node, path) {
  node.fills = solidFill();
  bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight = 2) {
  node.strokes = solidFill({ r: 0, g: 0, b: 0 });
  node.strokeWeight = weight;
  bindStroke(node, await getVar(path));
}

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar) {
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

async function makeText(content, size, weight, colorPath) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: weight };
  t.fontSize = size;
  t.characters = content;
  t.fills = solidFill();
  bindFill(t, await getVar(colorPath));
  return t;
}

page.findAll((n) => n.name === "Caelo – Slots — UI").forEach((n) => n.remove());

const ui = figma.createFrame();
ui.name = "Caelo – Slots — UI";
ui.layoutMode = "VERTICAL";
ui.primaryAxisSizingMode = "AUTO";
ui.counterAxisSizingMode = "FIXED";
ui.resize(1440, 100);
ui.itemSpacing = 0;
await bindGradientFill(ui, "color/gradient/home/muted/start", "color/gradient/home/muted/end");
ui.setExplicitVariableModeForCollection(semCol.id, defaultModeId);
page.insertChild(0, ui);

const hero = figma.createFrame();
hero.name = "page-hero-banner";
hero.resize(1440, 200);
await bindFillPath(hero, "color/surface/cool-light");
ui.appendChild(hero);

const tabs = figma.createFrame();
tabs.name = "slots-provider-tabs";
tabs.layoutMode = "HORIZONTAL";
tabs.itemSpacing = 8;
tabs.paddingLeft = tabs.paddingRight = 64;
tabs.paddingTop = tabs.paddingBottom = 16;
tabs.fills = [];
ui.appendChild(tabs);

for (let i = 0; i < 5; i++) {
  const tab = figma.createFrame();
  tab.name = i === 0 ? "slots-provider-tab--active" : "slots-provider-tab";
  tab.resize(140, 56);
  tab.cornerRadius = 16;
  if (i === 0) {
    await bindFillPath(tab, "color/button/tabs");
    await bindStrokePath(tab, "color/border/tabs");
  } else {
    await bindFillPath(tab, "color/surface");
    await bindStrokePath(tab, "color/border/tabs");
  }
  tabs.appendChild(tab);
}

const titleRow = figma.createFrame();
titleRow.name = "section title";
titleRow.paddingLeft = titleRow.paddingRight = 64;
titleRow.fills = [];
ui.appendChild(titleRow);
titleRow.appendChild(await makeText("Slot Games", 22, "Bold", "color/text/primary"));

const gameGrid = figma.createFrame();
gameGrid.name = "slots-game-card grid";
gameGrid.layoutMode = "HORIZONTAL";
gameGrid.itemSpacing = 16;
gameGrid.paddingLeft = gameGrid.paddingRight = 64;
gameGrid.paddingBottom = 48;
gameGrid.fills = [];
gameGrid.wrap = true;
ui.appendChild(gameGrid);

for (let i = 1; i <= 6; i++) {
  const card = figma.createFrame();
  card.name = "slots-game-card";
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 0;
  card.cornerRadius = 16;
  card.resize(200, 260);
  await bindFillPath(card, "color/surface/base");
  gameGrid.appendChild(card);

  const thumb = figma.createFrame();
  thumb.name = "slots-game-card__thumb";
  thumb.resize(200, 176);
  thumb.cornerRadius = 16;
  await bindFillPath(thumb, "color/surface/cool-light");
  await bindStrokePath(thumb, "color/border/danger", 1);
  card.appendChild(thumb);

  const badge = figma.createFrame();
  badge.cornerRadius = 999;
  badge.paddingLeft = badge.paddingRight = 8;
  badge.paddingTop = badge.paddingBottom = 4;
  await bindFillPath(badge, "color/danger");
  badge.appendChild(await makeText("HOT", 9, "Bold", "color/text/card-text"));
  thumb.appendChild(badge);

  const meta = figma.createFrame();
  meta.name = "game meta";
  meta.layoutMode = "VERTICAL";
  meta.itemSpacing = 4;
  meta.paddingLeft = meta.paddingRight = 12;
  meta.paddingTop = meta.paddingBottom = 12;
  meta.fills = [];
  card.appendChild(meta);
  meta.appendChild(await makeText(`Game ${i}`, 12, "Bold", "color/text/primary"));
  meta.appendChild(await makeText("Pragmatic Play", 11, "Regular", "color/text/secondary"));

  const rtp = figma.createFrame();
  rtp.cornerRadius = 999;
  rtp.paddingLeft = rtp.paddingRight = 10;
  rtp.paddingTop = rtp.paddingBottom = 4;
  await bindFillPath(rtp, "color/surface/rtp-secondary-card");
  await bindStrokePath(rtp, "color/border/brand", 1);
  rtp.appendChild(await makeText("RTP 96.5%", 10, "Bold", "color/surface/rtp-secondary-card-text"));
  meta.appendChild(rtp);
}

const ann = page.findOne((n) => n.name.startsWith("[Color Tokens"));
if (ann) ann.y = ui.height + 48;

return {
  step: "slots-ui-1to1",
  uiFrameId: ui.id,
  uiHeight: ui.height,
  bindings: [
    "color/gradient/home/muted/start",
    "color/gradient/home/muted/end",
    "color/button/tabs",
    "color/border/tabs",
    "color/surface",
    "color/text/primary",
    "color/text/secondary",
    "color/surface/base",
    "color/border/danger",
    "color/danger",
    "color/text/card-text",
    "color/surface/rtp-secondary-card",
    "color/surface/rtp-secondary-card-text",
    "color/border/brand",
  ],
};
