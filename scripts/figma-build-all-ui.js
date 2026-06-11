/* use_figma — Caelo – All UI with 1:1 semantic bindings (AllGamesPage.jsx) */

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const page = figma.root.children.find((p) => p.name === "Caelo – All");
if (!page) throw new Error('Missing page "Caelo – All"');
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

async function bindStrokePath(node, path, weight = 1) {
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

page.findAll((n) => n.name === "Caelo – All — UI").forEach((n) => n.remove());

const ui = figma.createFrame();
ui.name = "Caelo – All — UI";
ui.layoutMode = "VERTICAL";
ui.primaryAxisSizingMode = "AUTO";
ui.counterAxisSizingMode = "FIXED";
ui.resize(1440, 100);
ui.itemSpacing = 0;
await bindGradientFill(ui, "color/gradient/card/brand/start", "color/gradient/card/brand/end");
ui.setExplicitVariableModeForCollection(semCol.id, defaultModeId);
page.insertChild(0, ui);

const hero = figma.createFrame();
hero.name = "Hero banner";
hero.resize(1440, 220);
await bindFillPath(hero, "color/surface/cool-light");
ui.appendChild(hero);
hero.appendChild(await makeText("All Games hero banner", 14, "Regular", "color/text/card-text"));

const gridSection = figma.createFrame();
gridSection.name = "Provider grid";
gridSection.layoutMode = "VERTICAL";
gridSection.paddingLeft = gridSection.paddingRight = 64;
gridSection.paddingTop = gridSection.paddingBottom = 32;
gridSection.itemSpacing = 24;
gridSection.fills = [];
gridSection.resize(1440, 100);
gridSection.primaryAxisSizingMode = "AUTO";
ui.appendChild(gridSection);

const grid = figma.createFrame();
grid.name = "provider-lobby-card grid";
grid.layoutMode = "HORIZONTAL";
grid.itemSpacing = 16;
grid.fills = [];
grid.wrap = true;
gridSection.appendChild(grid);
grid.layoutSizingHorizontal = "FILL";

for (let i = 1; i <= 8; i++) {
  const card = figma.createFrame();
  card.name = "provider-lobby-card";
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 0;
  card.cornerRadius = 16;
  card.resize(200, 240);
  await bindFillPath(card, "color/surface/mid-color");
  await bindStrokePath(card, "color/border/subtle");
  grid.appendChild(card);

  const thumb = figma.createFrame();
  thumb.name = "provider-lobby-card__thumb";
  thumb.resize(200, 180);
  await bindFillPath(thumb, "color/surface/mid-color");
  card.appendChild(thumb);

  const hot = figma.createFrame();
  hot.cornerRadius = 999;
  hot.paddingLeft = hot.paddingRight = 8;
  hot.paddingTop = hot.paddingBottom = 4;
  await bindFillPath(hot, "color/danger");
  hot.appendChild(await makeText("HOT", 9, "Bold", "color/text/card-text"));
  thumb.appendChild(hot);

  const label = figma.createFrame();
  label.name = "provider-lobby-card__label";
  label.layoutMode = "HORIZONTAL";
  label.paddingLeft = label.paddingRight = 8;
  label.paddingTop = label.paddingBottom = 8;
  label.resize(200, 60);
  await bindFillPath(label, "color/surface/cool/light");
  await bindStrokePath(label, "color/border/subtle");
  label.strokeTopWeight = 1;
  label.strokeBottomWeight = label.strokeLeftWeight = label.strokeRightWeight = 0;
  card.appendChild(label);
  label.appendChild(await makeText(`Game ${i}`, 11, "Semi Bold", "color/text/tertiary"));
}

const ann = page.findOne((n) => n.name.startsWith("[Color Tokens"));
if (ann) ann.y = ui.height + 48;

return {
  step: "all-ui-1to1",
  uiFrameId: ui.id,
  uiHeight: ui.height,
  bindings: [
    "color/gradient/card/brand/start",
    "color/gradient/card/brand/end",
    "color/surface/mid-color",
    "color/border/subtle",
    "color/danger",
    "color/text/card-text",
    "color/surface/input-light",
    "color/text/tertiary",
  ],
};
