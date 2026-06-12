/* use_figma — Bind all commission table td text to color/text/primary on Referral - How It Works */

const FRAME_ID = "132:6569";

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!semCol) throw new Error('Missing collection "02 Semantic"');

async function getVar(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === semCol.id && v.name === path,
  );
}

async function bindTextPath(node, path) {
  if (!node || node.type !== "TEXT") return false;
  const variable = await getVar(path);
  if (!variable) throw new Error(`Missing semantic ${path}`);
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    variable,
  );
  node.setRangeFills(0, node.characters.length, [paint]);
  return true;
}

const primaryVar = await getVar("color/text/primary");
if (!primaryVar) throw new Error("Missing color/text/primary");

const frame = await figma.getNodeByIdAsync(FRAME_ID);
if (!frame) throw new Error("Referral - How It Works not found");

const bound = [];

for (const table of frame.findAll((n) => n.name === "Table")) {
  for (const row of table.findAll((n) => n.name === "Row")) {
    for (const cell of row.findAll((n) => n.type === "TEXT")) {
      await bindTextPath(cell, "color/text/primary");
      bound.push({
        id: cell.id,
        name: cell.name,
        chars: cell.characters?.slice(0, 30),
        tableId: table.id,
      });
    }
  }
  for (const dataCell of table.findAll(
    (n) =>
      n.type === "TEXT" &&
      (n.parent?.name === "Data" || n.name?.startsWith("Data")),
  )) {
    if (!bound.some((b) => b.id === dataCell.id)) {
      await bindTextPath(dataCell, "color/text/primary");
      bound.push({
        id: dataCell.id,
        name: dataCell.name,
        chars: dataCell.characters?.slice(0, 30),
        tableId: table.id,
      });
    }
  }
}

return {
  semantic: "color/text/primary",
  frame: { id: frame.id, name: frame.name },
  boundCount: bound.length,
  bound,
};
