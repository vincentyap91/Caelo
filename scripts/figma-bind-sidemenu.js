/* use_figma — Bind sidenav semantics on Sidemenu frame 471:9583 (Mobile page) */

const SIDEMENU_ID = "471:9583";

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
  if (!node) return false;
  return bindFill(node, await getVar(path));
}

async function bindStrokePath(node, path, weight = 1) {
  if (!node) return false;
  return bindStroke(node, await getVar(path), weight);
}

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) return;
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
  if (!node || node.type !== "TEXT") return false;
  const variable = await getVar(path);
  if (!variable) return false;
  return bindFill(node, variable);
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

const sidemenu = await figma.getNodeByIdAsync(SIDEMENU_ID);
if (!sidemenu || sidemenu.type !== "FRAME") {
  throw new Error(`Sidemenu frame ${SIDEMENU_ID} not found`);
}
sidemenu.name = "Sidemenu";
sidemenu.setExplicitVariableModeForCollection(semCol.id, semCol.modes[0].modeId);

const mutatedNodeIds = [];

// Shell + sections
await bindFillPath(sidemenu, "color/surface/base");
await bindStrokePath(sidemenu, "color/border/subtle");

const header = await figma.getNodeByIdAsync("471:9653");
if (header) {
  header.name = "sidenav-header";
  await bindFillPath(header, "color/surface/base");
  await bindStrokePath(header, "color/border/subtle");
  mutatedNodeIds.push(header.id);
}

const body = await figma.getNodeByIdAsync("471:9584");
if (body) {
  body.name = "sidenav-body";
  await bindFillPath(body, "color/surface/subtle");
  mutatedNodeIds.push(body.id);
}

const footer = await figma.getNodeByIdAsync("471:9640");
if (footer) {
  footer.name = "sidenav-footer";
  await bindFillPath(footer, "color/surface/base");
  await bindStrokePath(footer, "color/border/line");
  mutatedNodeIds.push(footer.id);
}

// Greeting
await bindTextPath(await figma.getNodeByIdAsync("471:9656"), "color/text/primary/card/title");

// Tier badge (DIAMOND)
const tierBadge = await figma.getNodeByIdAsync("471:9658");
if (tierBadge) {
  tierBadge.name = "sidenav-tier-badge";
  await bindFillPath(tierBadge, "color/surface/sidenav/tier-badge");
  await bindStrokePath(tierBadge, "color/border/sidenav/tier-badge");
  await bindTextPath(await figma.getNodeByIdAsync("471:9659"), "color/text/primary/card/title");
  mutatedNodeIds.push(tierBadge.id);
}

// Balance card
const balanceCard = await figma.getNodeByIdAsync("471:9660");
if (balanceCard) {
  balanceCard.name = "sidenav-balance-card";
  await bindFillPath(balanceCard, "color/surface/base");
  await bindStrokePath(balanceCard, "color/border/subtle");
  mutatedNodeIds.push(balanceCard.id);
}
await bindTextPath(await figma.getNodeByIdAsync("471:9663"), "color/text/secondary");

// Balance pill
const balancePill = await figma.getNodeByIdAsync("471:9664");
if (balancePill) {
  balancePill.name = "sidenav-balance-pill";
  await bindFillPath(balancePill, "color/surface/high");
  mutatedNodeIds.push(balancePill.id);
}
await bindTextPath(await figma.getNodeByIdAsync("471:9666"), "color/text/sticky/nav/text");
const refreshBtn = await figma.getNodeByIdAsync("471:9667");
if (refreshBtn) {
  refreshBtn.name = "sidenav-balance-pill__refresh";
  await bindFillPath(refreshBtn, "color/surface/high");
  await bindIconSubtree(refreshBtn, "color/text/sticky/nav/text");
  mutatedNodeIds.push(refreshBtn.id);
}

// Deposit / Withdrawal
const depositBtn = await figma.getNodeByIdAsync("471:9674");
if (depositBtn) {
  depositBtn.name = "sidenav-deposit-button";
  await bindGradientFill(depositBtn, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
  await bindStrokePath(depositBtn, "color/border/brand");
  await bindTextPath(await figma.getNodeByIdAsync("471:9679"), "color/text/cta/inverse");
  await bindIconSubtree(depositBtn, "color/text/cta/inverse");
  mutatedNodeIds.push(depositBtn.id);
}

const withdrawalBtn = await figma.getNodeByIdAsync("471:9680");
if (withdrawalBtn) {
  withdrawalBtn.name = "sidenav-secondary-action";
  await bindFillPath(withdrawalBtn, "color/button/sidenav/secondary");
  await bindStrokePath(withdrawalBtn, "color/border/sidenav/secondary");
  await bindTextPath(await figma.getNodeByIdAsync("471:9685"), "color/button/sidenav/secondary/text");
  await bindIconSubtree(withdrawalBtn, "color/button/sidenav/secondary/text");
  mutatedNodeIds.push(withdrawalBtn.id);
}

// Nav rows
const navRows = [
  { row: "471:9586", icon: "471:9587", label: "471:9592", chevron: "471:9593" },
  { row: "471:9595", icon: "471:9596", label: "471:9602", chevron: "471:9603" },
  { row: "471:9606", icon: "471:9607", label: "471:9615", chevron: "471:9616", wrap: "471:9605" },
  { row: "471:9618", icon: "471:9619", label: "471:9626", chevron: "471:9627" },
  { row: "471:9629", icon: "471:9630", label: "471:9637", chevron: "471:9638" },
];

for (const item of navRows) {
  const rowNode = await figma.getNodeByIdAsync(item.row);
  if (rowNode) {
    rowNode.name = "sidenav-item";
    await bindFillPath(rowNode, "color/button/nav");
    await bindStrokePath(rowNode, "color/border/subtle");
    mutatedNodeIds.push(rowNode.id);
  }
  if (item.wrap) {
    const wrap = await figma.getNodeByIdAsync(item.wrap);
    if (wrap) {
      wrap.name = "sidenav-group";
      await bindStrokePath(wrap, "color/border/subtle");
      mutatedNodeIds.push(wrap.id);
    }
  }
  const iconChip = await figma.getNodeByIdAsync(item.icon);
  if (iconChip) {
    iconChip.name = "sidenav-item__icon";
    await bindFillPath(iconChip, "color/surface/sidenav/icon");
    await bindStrokePath(iconChip, "color/border/subtle");
    await bindIconSubtree(iconChip, "color/text/primary/card/title");
    mutatedNodeIds.push(iconChip.id);
  }
  await bindTextPath(await figma.getNodeByIdAsync(item.label), "color/text/primary/card/title");
  const chevron = await figma.getNodeByIdAsync(item.chevron);
  if (chevron) await bindIconSubtree(chevron, "color/text/primary/card/title");
}

// Footer actions
const liveChat = await figma.getNodeByIdAsync("471:9642");
if (liveChat) {
  liveChat.name = "sidenav-live-chat";
  await bindFillPath(liveChat, "color/button/sidenav/live-chat");
  await bindStrokePath(liveChat, "color/button/sidenav/live-chat");
  await bindTextPath(await figma.getNodeByIdAsync("471:9646"), "color/button/sidenav/live-chat/text");
  await bindIconSubtree(liveChat, "color/button/sidenav/live-chat/text");
  mutatedNodeIds.push(liveChat.id);
}

const logoutBtn = await figma.getNodeByIdAsync("471:9647");
if (logoutBtn) {
  logoutBtn.name = "sidenav-secondary-action";
  await bindFillPath(logoutBtn, "color/button/sidenav/secondary");
  await bindStrokePath(logoutBtn, "color/border/sidenav/secondary");
  await bindTextPath(await figma.getNodeByIdAsync("471:9652"), "color/button/sidenav/secondary/text");
  await bindIconSubtree(logoutBtn, "color/button/sidenav/secondary/text");
  mutatedNodeIds.push(logoutBtn.id);
}

return {
  frameId: sidemenu.id,
  frameName: sidemenu.name,
  mutatedNodeIds,
  bindings: [
    "color/surface/base, color/border/subtle (shell)",
    "color/surface/sidenav/tier-badge + /border (DIAMOND)",
    "color/surface/high + color/text/sticky/nav/text (balance pill)",
    "color/gradient/button/cta (deposit)",
    "color/button/sidenav/secondary + /text + /border (withdrawal, logout)",
    "color/button/nav + color/surface/sidenav/icon (nav rows)",
    "color/button/sidenav/live-chat + /text (live chat)",
  ],
};
