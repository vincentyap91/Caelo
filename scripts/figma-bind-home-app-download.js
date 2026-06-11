/* use_figma — Bind App Download APK card on Home - 1 (VARIABLE-RULES.en.md §6 / §13.11) */

const SECTION_ID = "174:3541";
const APK_SHELL_ID = "174:3632";

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
if (!semCol) throw new Error('Missing collection "02 Semantic"');

async function getVar(path) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return (
    vars.find((v) => v.variableCollectionId === semCol.id && v.name === path) ||
    vars.find((v) => v.name === path)
  );
}

function solidFill(hex = { r: 1, g: 1, b: 1 }) {
  return [{ type: "SOLID", color: hex }];
}

function bindFill(node, variable) {
  if (!variable || !node) return false;
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    variable,
  );
  node.fills = [paint];
  return true;
}

function bindStroke(node, variable, weight) {
  if (!variable || !node) return false;
  if (weight != null) node.strokeWeight = weight;
  const paint = figma.variables.setBoundVariableForPaint(
    { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
    "color",
    variable,
  );
  node.strokes = [paint];
  return true;
}

async function bindFillPath(node, path) {
  if (!node) return;
  bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight, dashed = false) {
  if (!node) return;
  if (dashed) node.dashPattern = [4, 4];
  bindStroke(node, await getVar(path), weight);
}

async function bindGradientFill(node, startPath, endPath, horizontal = false) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) return;
  node.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: horizontal
        ? [
            [1, 0, 0],
            [0, 1, 0],
          ]
        : [
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
    if (node.fills?.length) await bindFillPath(node, path);
    if (node.strokes?.length) await bindStrokePath(node, path);
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

const HI = ["color/gradient/home/highlight/start", "color/gradient/home/highlight/end"];
const APK_BTN = ["raw/gradient/app/download/button/start", "color/primary"];

const section = await figma.getNodeByIdAsync(SECTION_ID);
if (!section) throw new Error(`App Download section ${SECTION_ID} not found`);
section.name = "app-download-section";

await bindGradientFill(section, ...HI);
await bindStrokePath(section, "color/surface/base");

const shell = await figma.getNodeByIdAsync(APK_SHELL_ID);
if (shell) {
  shell.name = "app-download-shell";
  await bindFillPath(shell, "color/surface/base");
  await bindStrokePath(shell, "color/border/brand");
}

const badgeBorder = await figma.getNodeByIdAsync("174:3635");
if (badgeBorder) {
  badgeBorder.name = "app-download-apk-badge-border";
  await bindStrokePath(badgeBorder, "color/border/brand");
}

const badge = await figma.getNodeByIdAsync("174:3649");
if (badge) {
  badge.name = "app-download-apk-badge";
  await bindTextPath(badge, "color/button/hover");
}

const inner = await figma.getNodeByIdAsync("174:3650");
if (inner) {
  inner.name = "app-download-inner";
  await bindFillPath(inner, "color/surface/base");
  await bindStrokePath(inner, "color/border/subtle");
}

const qrWrap = await figma.getNodeByIdAsync("174:3652");
if (qrWrap) {
  qrWrap.name = "app-download-qr-wrap";
  await bindFillPath(qrWrap, "color/surface/base");
  await bindStrokePath(qrWrap, "color/border/brand", 1, true);
}

for (const [id, label] of [
  ["174:3656", "Scan Ready"],
  ["174:3658", "Direct APK"],
]) {
  const chip = await figma.getNodeByIdAsync(id);
  if (chip) {
    chip.name = "app-download-chip";
    await bindFillPath(chip, "color/accent/pale");
    await bindStrokePath(chip, "color/border/brand");
  }
}

await bindTextPath(await figma.getNodeByIdAsync("174:3657"), "color/text/secondary");
await bindTextPath(await figma.getNodeByIdAsync("174:3659"), "color/text/secondary");
await bindTextPath(await figma.getNodeByIdAsync("174:3655"), "color/text/secondary");

const apkBtn = await figma.getNodeByIdAsync("174:3660");
if (apkBtn) {
  apkBtn.name = "app-download-apk-button";
  await bindGradientFill(apkBtn, ...APK_BTN, true);
  await bindIconSubtree(apkBtn, "color/text/card/text");
}

await bindTextPath(await figma.getNodeByIdAsync("174:3665"), "color/text/card/text");
await bindTextPath(await figma.getNodeByIdAsync("174:3666"), "color/text/muted");

return {
  sectionId: section.id,
  sectionName: section.name,
  apkShell: shell?.name,
  bindings: [
    "color/surface/base (shell + inner)",
    "color/border/brand (shell, badge, chips, dashed QR)",
    "color/border/subtle (inner panel)",
    "color/button/hover (ANDROID APK badge)",
    "color/text/secondary (heading + chips)",
    "color/accent/pale (chips)",
    "raw/gradient/app/download/button/start + color/primary (APK button)",
    "color/text/card/text (button label + icon)",
    "color/text/muted (helper copy)",
  ],
};
