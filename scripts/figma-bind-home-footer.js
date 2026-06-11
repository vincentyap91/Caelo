/* use_figma — Bind Footer semantics on Home - 1 (VARIABLE-RULES.en.md §13.11 / Footer example) */

const HOME_FRAME_ID = "174:2285";
const FOOTER_ID = "174:3815";

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

function bindFill(node, variable) {
  if (!variable || !node) return false;
  if (!node.fills?.length) node.fills = solidFill();
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

function bindStroke(node, variable) {
  if (!variable || !node) return false;
  if (!node.strokes?.length) node.strokes = solidFill();
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFillPath(node, path) {
  if (!node) return;
  bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight) {
  if (!node) return;
  if (weight != null) node.strokeWeight = weight;
  bindStroke(node, await getVar(path));
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

const footer = await figma.getNodeByIdAsync(FOOTER_ID);
if (!footer) throw new Error(`Footer ${FOOTER_ID} not found`);

footer.name = "site-footer";
await bindFillPath(footer, "color/surface/low");
await bindStrokePath(footer, "color/border/line");

const logoChip = await figma.getNodeByIdAsync("174:3816");
if (logoChip) {
  logoChip.name = "site-footer__logo-chip";
  await bindFillPath(logoChip, "color/surface/base");
  await bindStrokePath(logoChip, "color/border/line");
}

const footerTextIds = ["174:3818", "174:3819", "174:3879", "174:3925", "174:3929"];
for (const id of footerTextIds) {
  await bindTextPath(await figma.getNodeByIdAsync(id), "color/text/footer");
}

const navLinkIds = ["174:3869", "174:3871", "174:3873", "174:3875", "174:3877"];
for (const id of navLinkIds) {
  const node = await figma.getNodeByIdAsync(id);
  if (node) await bindTextPath(node, "color/text/light");
}

const dividerIds = ["174:3870", "174:3872", "174:3874", "174:3876"];
for (const id of dividerIds) {
  const node = await figma.getNodeByIdAsync(id);
  if (node) {
    node.name = "site-footer__menu-divider";
    await bindTextPath(node, "color/border/line");
  }
}

const paymentRow = await figma.getNodeByIdAsync("174:3820");
if (paymentRow) paymentRow.name = "footer-payment-methods-container";

async function bindPaymentChips(node) {
  if (!node) return;
  if (node.name.includes("Background+Border+OverlayBlur")) {
    await bindFillPath(node, "color/surface");
    await bindStrokePath(node, "color/border/line");
  }
  if ("children" in node) {
    for (const child of node.children) await bindPaymentChips(child);
  }
}
await bindPaymentChips(footer);

const sectionBorder = await figma.getNodeByIdAsync("174:3878");
if (sectionBorder) {
  sectionBorder.name = "site-footer__section-divider";
  await bindStrokePath(sectionBorder, "color/border/line");
}

const ageRing = await figma.getNodeByIdAsync("174:3926");
if (ageRing) {
  await bindStrokePath(ageRing, "color/border/line", 2);
  await bindTextPath(await figma.getNodeByIdAsync("174:3927"), "color/text/light");
}
await bindTextPath(await figma.getNodeByIdAsync("174:3928"), "color/text/light");

let bound = 0;
let raw = 0;
function audit(node) {
  if ("fills" in node && node.fills?.length) {
    const f = node.fills[0];
    if (f.visible !== false && f.type === "SOLID") {
      if (f.boundVariables?.color) bound++;
      else if (f.color) raw++;
    }
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
audit(footer);

return {
  frame: (await figma.getNodeByIdAsync(HOME_FRAME_ID))?.name,
  footerId: footer.id,
  footerName: footer.name,
  bound,
  rawFillsStrokes: raw,
  bindings: [
    "color/surface/low",
    "color/surface/base",
    "color/surface",
    "color/text/footer",
    "color/text/light",
    "color/border/line",
  ],
};
