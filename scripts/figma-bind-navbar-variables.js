/* use_figma — Bind 1:1 semantic variables on Navbar frame (guest header, riocity parity) */

const NAVBAR_ID = "33:2480";

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
  if (!variable || !node.fills?.length) return false;
  const paint = node.fills[0];
  if (paint.type !== "SOLID") return false;
  node.fills = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

function bindStroke(node, variable) {
  if (!variable || !node.strokes?.length) return false;
  const paint = node.strokes[0];
  if (paint.type !== "SOLID") return false;
  node.strokes = [figma.variables.setBoundVariableForPaint(paint, "color", variable)];
  return true;
}

async function bindFillPath(node, path) {
  node.fills = solidFill();
  return bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight = 1) {
  node.strokes = solidFill({ r: 0, g: 0, b: 0 });
  node.strokeWeight = weight;
  return bindStroke(node, await getVar(path));
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

async function bindTextPath(node, path) {
  if (node.type !== "TEXT") return false;
  node.fills = solidFill();
  return bindFill(node, await getVar(path));
}

async function bindSubtreeFills(node, path) {
  if ("fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
    const visible = node.fills.some((p) => p.visible !== false);
    if (visible || node.fills.length === 0) {
      if (node.type === "TEXT") await bindTextPath(node, path);
      else if (node.fills.length === 0 || node.fills[0]?.type === "SOLID") {
        await bindFillPath(node, path);
      }
    }
  }
  if ("children" in node) {
    for (const child of node.children) await bindSubtreeFills(child, path);
  }
}

const navbar = await figma.getNodeByIdAsync(NAVBAR_ID);
if (!navbar || navbar.type !== "FRAME") throw new Error(`Navbar frame ${NAVBAR_ID} not found`);

// ── Layer map (from Figma metadata + Navbar.jsx / theme.css) ──
const stickyBar = await figma.getNodeByIdAsync("33:2481");
const mainNav = await figma.getNodeByIdAsync("33:2514");

// top-sticky-nav-bar
await bindFillPath(stickyBar, "color/sticky/nav");
await bindStrokePath(stickyBar, "color/border/subtle");
stickyBar.strokeTopWeight = stickyBar.strokeLeftWeight = stickyBar.strokeRightWeight = 0;
stickyBar.strokeBottomWeight = 1;

// nav-top-pill buttons (guest): text only on dark bar — Download, Login, Live Chat, EN
const stickyNavText = "color/text/sticky/nav/text";
for (const id of ["33:2489", "33:2493", "33:2503", "33:2509"]) {
  await bindTextPath(await figma.getNodeByIdAsync(id), stickyNavText);
}
// pill icon frames inherit sticky nav text
for (const id of ["33:2485", "33:2499", "33:2511"]) {
  const icon = await figma.getNodeByIdAsync(id);
  if (icon) await bindSubtreeFills(icon, stickyNavText);
}

// btn-theme-cta-soft — Join Now
const joinBtn = await figma.getNodeByIdAsync("33:2495");
await bindGradientFill(joinBtn, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
await bindStrokePath(joinBtn, "color/border/brand");
joinBtn.cornerRadius = 8;
await bindTextPath(await figma.getNodeByIdAsync("33:2496"), "color/text/cta/inverse");

// top-nav-shell
await bindFillPath(mainNav, "color/surface/base");
await bindStrokePath(mainNav, "color/border/subtle");
mainNav.strokeTopWeight = mainNav.strokeLeftWeight = mainNav.strokeRightWeight = 0;
mainNav.strokeBottomWeight = 1;

// nav links — default text
const linkText = "color/text/primary/card/title";
const inactiveLinkIds = [
  "33:2524",
  "33:2527",
  "33:2530",
  "33:2533",
  "33:2536",
  "33:2539",
  "33:2542",
  "33:2545",
  "33:2549",
];
for (const id of inactiveLinkIds) {
  await bindTextPath(await figma.getNodeByIdAsync(id), linkText);
}

// Home — nav-desktop-link-active (gradient + brand border)
const homeLink = await figma.getNodeByIdAsync("33:2520");
await bindGradientFill(homeLink, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
await bindStrokePath(homeLink, "color/border/brand");
homeLink.cornerRadius = 8;
await bindTextPath(await figma.getNodeByIdAsync("33:2521"), linkText);

// More chevron icon
const moreIcon = await figma.getNodeByIdAsync("33:2551");
if (moreIcon) await bindSubtreeFills(moreIcon, linkText);

// nav-top-pill: transparent fill, glass border (--nav-top-pill-border ≈ white 16% → raw/scrim/white/14)
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
async function getPrim(path) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find(
    (v) => v.variableCollectionId === primCol.id && v.name === path,
  );
}
async function bindPrimStroke(node, path) {
  const v = await getPrim(path);
  if (!v || !node) return;
  node.strokes = solidFill();
  bindStroke(node, v);
}
for (const id of ["33:2484", "33:2492", "33:2498", "33:2506"]) {
  const pill = await figma.getNodeByIdAsync(id);
  if (!pill) continue;
  if ("fills" in pill) pill.fills = [];
  await bindPrimStroke(pill, "raw/scrim/white/14");
}

// Inactive links use border-transparent in code — remove raw stroke paints
for (const id of [
  "33:2523",
  "33:2526",
  "33:2529",
  "33:2532",
  "33:2535",
  "33:2538",
  "33:2541",
  "33:2544",
  "33:2548",
]) {
  const link = await figma.getNodeByIdAsync(id);
  if (link && "strokes" in link) link.strokes = [];
}

let bound = 0;
let raw = 0;
function audit(node) {
  if ("fills" in node && Array.isArray(node.fills) && node.fills.length) {
    const p = node.fills[0];
    if (p.type === "SOLID" && p.visible !== false) {
      if (p.boundVariables?.color) bound++;
      else if (p.color) raw++;
    }
    if (p.type === "GRADIENT_LINEAR" && p.visible !== false) bound++;
  }
  if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length) {
    const s = node.strokes[0];
    if (s.visible !== false && s.type === "SOLID") {
      if (s.boundVariables?.color) bound++;
      else if (s.color) raw++;
    }
  }
  if ("children" in node) node.children.forEach(audit);
}
audit(navbar);

return {
  frame: navbar.name,
  frameId: navbar.id,
  bound,
  rawFillsStrokes: raw,
  pass: raw === 0,
};
