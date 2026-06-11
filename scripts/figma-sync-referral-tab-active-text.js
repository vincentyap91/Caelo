/* use_figma — Bind color/surface/menu/active on referral-page active section tab label only */

const ACTIVE_TAB_ID = "131:5293";
const INACTIVE_TAB_IDS = ["131:5295", "131:5297", "131:5299"];

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!semCol) throw new Error('Missing collection "02 Semantic"');

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

function bindFill(node, variable) {
  if (!node) return false;
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

const menuActiveVar = await getVar("color/surface/menu/active");
const mutedVar = await getVar("color/text/muted");
if (!menuActiveVar || !mutedVar) throw new Error("Missing semantic variables");

const scopes = new Set(menuActiveVar.scopes || []);
scopes.add("TEXT_FILL");
menuActiveVar.scopes = [...scopes];

const bound = { active: [], inactive: [] };

const activeTab = await figma.getNodeByIdAsync(ACTIVE_TAB_ID);
if (activeTab) {
  activeTab.name = "referral-section-tab--active";
  for (const node of activeTab.findAll((n) => n.type === "VECTOR" || n.type === "TEXT")) {
    if (bindFill(node, menuActiveVar)) {
      bound.active.push({ id: node.id, name: node.name, type: node.type });
    }
  }
}

for (const tabId of INACTIVE_TAB_IDS) {
  const tab = await figma.getNodeByIdAsync(tabId);
  if (!tab) continue;
  tab.name = "referral-section-tab";
  const label = tab.findOne((n) => n.type === "TEXT");
  if (label && bindFill(label, mutedVar)) {
    bound.inactive.push({ id: label.id, name: label.characters });
  }
}

return {
  semantic: "color/surface/menu/active",
  scopes: menuActiveVar.scopes,
  activeBound: bound.active.length,
  inactiveBound: bound.inactive.length,
  bound,
};
