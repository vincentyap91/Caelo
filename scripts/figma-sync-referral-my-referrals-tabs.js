/* use_figma — Bind referral section tabs on Referral - My Referrals (active: My Referrals → color/surface/menu/active) */

const MY_REFERRALS_FRAMES = [
  {
    frameId: "131:5663",
    tabBarId: "131:5668",
    sectionTabIds: ["131:5669", "131:5671", "131:5673", "131:5675"],
  },
  {
    frameId: "131:5879",
    tabBarId: "131:5884",
    sectionTabIds: ["131:5885", "131:5887", "131:5889", "131:5891"],
  },
];

const ACTIVE_LABEL = /my referrals/i;

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

async function bindSolidFillPath(node, path) {
  const variable = await getVar(path);
  if (!variable || !node) return;
  node.fills = [
    figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    ),
  ];
}

async function bindStrokePath(node, path, weight) {
  const variable = await getVar(path);
  if (!variable || !node) return;
  if (weight != null) node.strokeWeight = weight;
  if (!node.strokes?.length) node.strokes = solidFill();
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
}

function bindFill(node, variable) {
  if (!node || !variable) return false;
  if (node.type === "TEXT") {
    const paint = figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    );
    node.setRangeFills(0, node.characters.length, [paint]);
    return true;
  }
  if (!node.fills?.length) node.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  const paint = node.fills[0];
  if (paint?.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindSectionTab(node) {
  if (!node || node.type !== "FRAME") return null;
  const label = node.findOne((n) => n.type === "TEXT");
  const selected = ACTIVE_LABEL.test(label?.characters || "");
  node.name = selected ? "referral-section-tab--active" : "referral-section-tab";

  if (selected) {
    await bindSolidFillPath(node, "color/surface/base");
    await bindStrokePath(node, "color/border/brand", 1);
    const menuActiveVar = await getVar("color/surface/menu/active");
    if (label) {
      bindFill(label, menuActiveVar);
    } else {
      for (const vector of node.findAll((n) => n.type === "VECTOR")) {
        bindFill(vector, menuActiveVar);
      }
    }
  } else {
    node.fills = [];
    const mutedVar = await getVar("color/text/muted");
    if (label) bindFill(label, mutedVar);
  }

  return {
    id: node.id,
    name: node.name,
    text: label?.characters,
    selected,
  };
}

const menuActiveVar = await getVar("color/surface/menu/active");
if (!menuActiveVar) throw new Error("Missing color/surface/menu/active");

const scopes = new Set(menuActiveVar.scopes || []);
scopes.add("TEXT_FILL");
menuActiveVar.scopes = [...scopes];

const results = [];

for (const { frameId, tabBarId, sectionTabIds } of MY_REFERRALS_FRAMES) {
  const frame = await figma.getNodeByIdAsync(frameId);
  if (!frame) continue;
  frame.name = "Referral - My Referrals";

  const tabBar = await figma.getNodeByIdAsync(tabBarId);
  if (tabBar) tabBar.name = "referral-tab-bar";

  const boundTabs = [];
  for (const tabId of sectionTabIds) {
    const tab = await figma.getNodeByIdAsync(tabId);
    const info = await bindSectionTab(tab);
    if (info) boundTabs.push(info);
  }

  results.push({
    frameId,
    frameName: frame.name,
    tabBarId,
    boundTabs,
    activeTab: boundTabs.find((t) => t.selected),
  });
}

return {
  semantic: "color/surface/menu/active",
  activeLabel: "My Referrals",
  scopes: menuActiveVar.scopes,
  frames: results,
};
