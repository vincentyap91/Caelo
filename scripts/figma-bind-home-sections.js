/* use_figma — Bind Home - 1 section semantics (VARIABLE-RULES.en.md §6 / §13.11) */

const HOME_FRAME_ID = "174:2285";
const SECTIONS = {
  hotProviders: "174:3420",
  appDownload: "174:3541",
  recentPayout: "174:3667",
  homePromos: "174:3807",
  welcomePromo: "174:3808",
  referralPromo: "174:3811",
};

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

async function bindGradientFill(node, startPath, endPath) {
  const startVar = await getVar(startPath);
  const endVar = await getVar(endPath);
  if (!startVar || !endVar || !node) {
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

async function bindTextSplit(node, parts) {
  if (!node || node.type !== "TEXT") return;
  const chars = node.characters;
  for (const { start, end, path } of parts) {
    const variable = await getVar(path);
    if (!variable) continue;
    const paint = figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: { r: 0, g: 0, b: 0 } },
      "color",
      variable,
    );
    node.setRangeFills(start, end, [paint]);
  }
}

async function bindIconSubtree(node, path) {
  if (!node) return;
  if (node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION") {
    if (node.fills?.length && node.fills[0].type === "SOLID") await bindFillPath(node, path);
    if (node.strokes?.length && node.strokes[0].type === "SOLID") await bindStrokePath(node, path);
  }
  if ("children" in node) {
    for (const child of node.children) await bindIconSubtree(child, path);
  }
}

const HI = ["color/gradient/home/highlight/start", "color/gradient/home/highlight/end"];
const REF_CARD = ["color/gradient/referral/card/start", "color/gradient/referral/card/end"];
const REF_COMM = ["color/gradient/referral/commission/start", "color/gradient/referral/commission/end"];
const NAV_HI = ["color/gradient/nav/highlight/start", "color/gradient/nav/highlight/end"];

// —— Hot Providers ——
const hot = await figma.getNodeByIdAsync(SECTIONS.hotProviders);
if (hot) {
  hot.name = "home-hot-providers-section";
  const title = await figma.getNodeByIdAsync("174:3421");
  if (title) {
    title.name = "home-section-title";
    await bindTextPath(title, "color/text/third/title");
  }
}

// —— App Download ——
const app = await figma.getNodeByIdAsync(SECTIONS.appDownload);
if (app) {
  app.name = "app-download-section";
  await bindGradientFill(app, ...HI);
  await bindStrokePath(app, "color/surface/base");

  await bindStrokePath(await figma.getNodeByIdAsync("174:3544"), "color/surface/base");
  await bindTextPath(await figma.getNodeByIdAsync("174:3545"), "color/button/hover");

  const heading = await figma.getNodeByIdAsync("174:3546");
  if (heading?.type === "TEXT") {
    const chars = heading.characters;
    const idx = chars.indexOf("12WIN");
    if (idx >= 0) {
      await bindTextSplit(heading, [
        { start: 0, end: idx, path: "color/text/secondary" },
        { start: idx, end: chars.length, path: "color/primary" },
      ]);
    } else {
      await bindTextPath(heading, "color/text/secondary");
    }
  }

  await bindTextPath(await figma.getNodeByIdAsync("174:3547"), "color/button/hover");
  await bindGradientFill(await figma.getNodeByIdAsync("174:3558"), ...HI);
  await bindGradientFill(await figma.getNodeByIdAsync("174:3579"), ...HI);
  await bindGradientFill(await figma.getNodeByIdAsync("174:3585"), ...HI);
  await bindGradientFill(await figma.getNodeByIdAsync("174:3632"), ...HI);
  await bindStrokePath(await figma.getNodeByIdAsync("174:3632"), "color/surface/base");

  await bindStrokePath(await figma.getNodeByIdAsync("174:3635"), "color/surface/base");
  await bindTextPath(await figma.getNodeByIdAsync("174:3649"), "color/button/hover");

  await bindGradientFill(await figma.getNodeByIdAsync("174:3650"), ...HI);
  await bindStrokePath(await figma.getNodeByIdAsync("174:3650"), "color/border/subtle");
  await bindGradientFill(await figma.getNodeByIdAsync("174:3652"), ...HI);
  await bindStrokePath(await figma.getNodeByIdAsync("174:3652"), "color/border/subtle");

  for (const id of ["174:3656", "174:3658"]) {
    await bindFillPath(await figma.getNodeByIdAsync(id), "color/accent/pale");
    await bindStrokePath(await figma.getNodeByIdAsync(id), "color/border/brand");
  }
  await bindTextPath(await figma.getNodeByIdAsync("174:3657"), "color/text/secondary");
  await bindTextPath(await figma.getNodeByIdAsync("174:3659"), "color/text/secondary");
  await bindTextPath(await figma.getNodeByIdAsync("174:3655"), "color/text/secondary");

  await bindGradientFill(await figma.getNodeByIdAsync("174:3660"), ...HI);
  await bindTextPath(await figma.getNodeByIdAsync("174:3665"), "color/text/card/text");
  await bindTextPath(await figma.getNodeByIdAsync("174:3666"), "color/button/hover");
  await bindIconSubtree(await figma.getNodeByIdAsync("174:3660"), "color/text/card/text");
}

// —— Recent Payout ——
const payout = await figma.getNodeByIdAsync(SECTIONS.recentPayout);
if (payout) {
  payout.name = "recent-payout-section";
  await bindFillPath(payout, "color/surface/base");
  await bindStrokePath(payout, "color/border/brand");

  await bindIconSubtree(await figma.getNodeByIdAsync("174:3669"), "color/accent");

  const payoutTitle = await figma.getNodeByIdAsync("174:3676");
  if (payoutTitle?.type === "TEXT") {
    const chars = payoutTitle.characters;
    const idx = chars.indexOf("PAYOUT");
    if (idx >= 0) {
      await bindTextSplit(payoutTitle, [
        { start: 0, end: idx, path: "color/text/primary" },
        { start: idx, end: chars.length, path: "color/text/recent/amount" },
      ]);
    } else {
      await bindTextPath(payoutTitle, "color/text/primary");
    }
  }

  async function bindPayoutText(node) {
    if (!node) return;
    if (node.type === "TEXT") {
      const t = node.characters || "";
      if (/^\$/.test(t)) await bindTextPath(node, "color/text/recent/amount");
      else await bindTextPath(node, "color/text/primary");
    }
    if ("children" in node) {
      for (const child of node.children) await bindPayoutText(child);
    }
  }

  async function bindPayoutCard(node) {
    if (!node || node.name !== "Article") return;
    node.name = "recent-payout-card";
    await bindFillPath(node, "color/surface/panel");
    await bindPayoutText(node);
  }

  async function walkPayout(node) {
    if (!node) return;
    await bindPayoutCard(node);
    if ("children" in node) {
      for (const child of node.children) await walkPayout(child);
    }
  }
  await walkPayout(payout);
}

// —— Home promos ——
const promos = await figma.getNodeByIdAsync(SECTIONS.homePromos);
if (promos) promos.name = "home-promos-section";

const welcome = await figma.getNodeByIdAsync(SECTIONS.welcomePromo);
if (welcome) {
  welcome.name = "home-promo-card home-promo-card--desktop";
  await bindGradientFill(welcome, ...REF_CARD);
  await bindStrokePath(welcome, "color/border/brand", 2);
  await bindTextPath(await figma.getNodeByIdAsync("174:3809"), "color/button/hover");
}

const referral = await figma.getNodeByIdAsync(SECTIONS.referralPromo);
if (referral) {
  referral.name = "home-promo-card home-promo-card--desktop";
  await bindGradientFill(referral, ...REF_COMM);
  await bindStrokePath(referral, "color/border/brand", 2);
  await bindTextPath(await figma.getNodeByIdAsync("174:3813"), "color/button/hover");
  await bindGradientFill(await figma.getNodeByIdAsync("174:3812"), ...NAV_HI);
}

function auditSection(node) {
  let bound = 0;
  let raw = 0;
  function walk(n) {
    if ("fills" in n && n.fills?.length) {
      const f = n.fills[0];
      if (f.visible !== false && f.type === "SOLID") {
        if (f.boundVariables?.color) bound++;
        else if (f.color) raw++;
      }
      if (f.type === "GRADIENT_LINEAR" && f.visible !== false) bound++;
    }
    if (n.type === "TEXT") {
      for (const seg of n.getStyledTextSegments(["fills"])) {
        const f = seg.fills?.[0];
        if (f?.type === "SOLID") {
          if (f.boundVariables?.color) bound++;
          else if (f.color) raw++;
        }
      }
    }
    if ("strokes" in n && n.strokes?.length) {
      const s = n.strokes[0];
      if (s.visible !== false && s.type === "SOLID") {
        if (s.boundVariables?.color) bound++;
        else if (s.color) raw++;
      }
    }
    if ("children" in n) n.children.forEach(walk);
  }
  walk(node);
  return { bound, raw };
}

const home = await figma.getNodeByIdAsync(HOME_FRAME_ID);
const results = {};
for (const [key, id] of Object.entries(SECTIONS)) {
  const node = await figma.getNodeByIdAsync(id);
  if (node) results[key] = { name: node.name, ...auditSection(node) };
}

return { frame: home?.name, results };
