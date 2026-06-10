const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) {
      col.renameMode(col.modes[i].modeId, modeNames[i]);
    } else if (i > 0) {
      col.addMode(modeNames[i]);
    }
  }
  return col;
}

function scopeFor(path) {
  if (path.startsWith("color/text/")) return SC_TEXT;
  if (path.startsWith("color/border/")) return SC_STROKE;
  return SC_FILL;
}

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;

function bindFill(node, varName) {
  const v = figma.variables.getLocalVariables("COLOR").find((x) => x.name === varName && x.variableCollectionId === semCol.id);
  if (!v) return false;
  node.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, boundVariables: { color: { type: "VARIABLE_ALIAS", id: v.id } } }];
  return true;
}

const PAGE_TOKENS = {"Caelo – Site Name":["color/surface/base","color/surface/float","color/text/primary","color/text/secondary","color/border/subtle","color/button/primary","color/primary","color/icon/default","color/sticky-nav/bg","color/error/main","color/success/main"],"Caelo – Home":["color/surface/base","color/text/primary","color/text/secondary","color/border/subtle","color/button/nav","color/gradient/home/cta/start","color/gradient/home/cta/end","color/accent/pale","color/overlay/strong","color/popup/body","color/progress/bar/fill","color/scrollbar/thumb","color/effect/glow"],"Caelo – All":["color/surface/base","color/surface/card","color/text/primary","color/border/subtle","color/button/tabs","color/gradient/card/brand/start","color/gradient/card/brand/end","color/table/header","color/overlay/medium","color/scrollbar/track"],"Caelo – Slots":["color/surface/base","color/surface/input-inverse","color/button/tabs","color/border/tabs","color/text/primary","color/primary","color/surface/rtp-secondary-card","color/border/danger","color/info/icon","color/progress/bar/bg","color/progress/bar/fill","color/button/cta-fourth"]};
const createdNodeIds = [];
const pageNames = Object.keys(PAGE_TOKENS);

for (const pageName of pageNames) {
  let page = figma.root.children.find((p) => p.name === pageName);
  if (!page) { page = figma.createPage(); page.name = pageName; }
  await figma.setCurrentPageAsync(page);

  let frame = page.children.find((n) => n.type === "FRAME" && n.name === pageName);
  if (!frame) {
    frame = figma.createFrame();
    frame.name = pageName;
    frame.resize(1440, 900);
    frame.x = 0;
    frame.y = 0;
    page.appendChild(frame);
    createdNodeIds.push(frame.id);
  }
  bindFill(frame, "color/surface/base");

  const annName = "[Color Tokens – " + pageName.replace("Caelo – ", "") + "]";
  let ann = page.children.find((n) => n.type === "FRAME" && n.name === annName);
  if (!ann) {
    ann = figma.createFrame();
    ann.name = annName;
    ann.layoutMode = "VERTICAL";
    ann.primaryAxisSizingMode = "AUTO";
    ann.counterAxisSizingMode = "FIXED";
    ann.resize(1440, 100);
    ann.x = 0;
    ann.y = 960;
    ann.itemSpacing = 8;
    ann.paddingTop = ann.paddingBottom = ann.paddingLeft = ann.paddingRight = 24;
    page.appendChild(ann);
    createdNodeIds.push(ann.id);
  }
  bindFill(ann, "color/surface/float");

  const tokens = PAGE_TOKENS[pageName];
  while (ann.children.length > tokens.length) ann.children[ann.children.length - 1].remove();
  tokens.forEach((tokenPath, i) => {
    let row = ann.children[i];
    if (!row || row.type !== "TEXT") {
      row = figma.createText();
      ann.appendChild(row);
      createdNodeIds.push(row.id);
    }
    row.fontName = { family: "Inter", style: "Regular" };
    row.fontSize = 12;
    row.characters = tokenPath + "  →  (see 02 Semantic / Default)";
    row.layoutSizingHorizontal = "FILL";
  });
}

return { step: "pages", createdNodeIds, pages: pageNames };
