/* use_figma — Caelo – Home UI with 1:1 semantic variable bindings (localhost parity) */

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const homePage = figma.root.children.find((p) => p.name === "Caelo – Home");
if (!homePage) throw new Error('Missing page "Caelo – Home"');
await figma.setCurrentPageAsync(homePage);

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

function sectionShell(name, padY = 32) {
  const s = figma.createFrame();
  s.name = name;
  s.layoutMode = "VERTICAL";
  s.primaryAxisSizingMode = "AUTO";
  s.counterAxisSizingMode = "FIXED";
  s.resize(1440, 100);
  s.paddingLeft = s.paddingRight = 64;
  s.paddingTop = s.paddingBottom = padY;
  s.itemSpacing = 24;
  s.fills = [];
  return s;
}

async function sectionHeader(title) {
  const row = figma.createFrame();
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 10;
  row.fills = [];
  row.counterAxisSizingMode = "AUTO";
  row.primaryAxisSizingMode = "AUTO";
  row.appendChild(await makeText("♛", 18, "Regular", "color/button/hover"));
  row.appendChild(await makeText(title, 20, "Bold", "color/primary"));
  const bars = figma.createFrame();
  bars.layoutMode = "HORIZONTAL";
  bars.itemSpacing = 4;
  bars.fills = [];
  for (const w of [16, 8, 4]) {
    const bar = figma.createRectangle();
    bar.resize(w, 20);
    bar.rotation = -20;
    await bindFillPath(bar, "color/primary");
    bars.appendChild(bar);
  }
  row.appendChild(bars);
  return row;
}

homePage.findAll((n) => n.name === "Caelo – Home — UI").forEach((n) => n.remove());

const createdNodeIds = [];
const ui = figma.createFrame();
ui.name = "Caelo – Home — UI";
ui.layoutMode = "VERTICAL";
ui.primaryAxisSizingMode = "AUTO";
ui.counterAxisSizingMode = "FIXED";
ui.resize(1440, 100);
ui.itemSpacing = 0;
ui.clipsContent = false;
await bindFillPath(ui, "color/surface/base");
ui.setExplicitVariableModeForCollection(semCol.id, defaultModeId);
homePage.insertChild(0, ui);
createdNodeIds.push(ui.id);

async function makePill(name, label, icon = "") {
  const pill = figma.createFrame();
  pill.name = name;
  pill.layoutMode = "HORIZONTAL";
  pill.itemSpacing = 6;
  pill.paddingLeft = 14;
  pill.paddingRight = 14;
  pill.paddingTop = pill.paddingBottom = 6;
  pill.cornerRadius = 8;
  pill.fills = [];
  if (icon) pill.appendChild(await makeText(icon, 11, "Regular", "color/text/sticky/nav/text"));
  pill.appendChild(await makeText(label, 11, "Bold", "color/text/sticky/nav/text"));
  return pill;
}

// ── Navbar (Navbar.jsx guest header — 1:1 semantic bindings) ──
const navWrap = figma.createFrame();
navWrap.name = "Navbar";
navWrap.layoutMode = "VERTICAL";
navWrap.itemSpacing = 0;
navWrap.fills = [];
navWrap.resize(1440, 100);
navWrap.primaryAxisSizingMode = "AUTO";
ui.appendChild(navWrap);

const stickyBar = figma.createFrame();
stickyBar.name = "top-sticky-nav-bar";
stickyBar.layoutMode = "HORIZONTAL";
stickyBar.resize(1440, 36);
stickyBar.paddingLeft = stickyBar.paddingRight = 40;
stickyBar.counterAxisAlignItems = "CENTER";
stickyBar.primaryAxisAlignItems = "SPACE_BETWEEN";
await bindFillPath(stickyBar, "color/sticky/nav");
await bindStrokePath(stickyBar, "color/border/subtle");
stickyBar.strokeTopWeight = stickyBar.strokeLeftWeight = stickyBar.strokeRightWeight = 0;
stickyBar.strokeBottomWeight = 1;
navWrap.appendChild(stickyBar);

const stickyLeft = figma.createFrame();
stickyLeft.layoutMode = "HORIZONTAL";
stickyLeft.fills = [];
stickyBar.appendChild(stickyLeft);
stickyLeft.appendChild(await makePill("nav-top-pill nav-top-pill--icon", "Download App", "📱"));

const stickyRight = figma.createFrame();
stickyRight.layoutMode = "HORIZONTAL";
stickyRight.itemSpacing = 8;
stickyRight.fills = [];
stickyBar.appendChild(stickyRight);
stickyRight.appendChild(await makePill("nav-top-pill", "LOGIN"));

const joinBtn = figma.createFrame();
joinBtn.name = "btn-theme-cta-soft";
joinBtn.layoutMode = "HORIZONTAL";
joinBtn.paddingLeft = joinBtn.paddingRight = 14;
joinBtn.paddingTop = joinBtn.paddingBottom = 6;
joinBtn.cornerRadius = 8;
await bindGradientFill(joinBtn, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
await bindStrokePath(joinBtn, "color/border/brand");
joinBtn.appendChild(await makeText("JOIN NOW", 11, "Bold", "color/text/cta/inverse"));
stickyRight.appendChild(joinBtn);
stickyRight.appendChild(await makePill("nav-top-pill nav-top-pill--icon", "LIVE CHAT", "🎧"));
stickyRight.appendChild(await makePill("nav-top-pill nav-top-pill--icon", "EN ▾", "🇬🇧"));

const mainNav = figma.createFrame();
mainNav.name = "top-nav-shell";
mainNav.layoutMode = "HORIZONTAL";
mainNav.resize(1440, 64);
mainNav.paddingLeft = mainNav.paddingRight = 40;
mainNav.counterAxisAlignItems = "CENTER";
mainNav.itemSpacing = 24;
await bindFillPath(mainNav, "color/surface/base");
await bindStrokePath(mainNav, "color/border/subtle");
mainNav.strokeTopWeight = mainNav.strokeLeftWeight = mainNav.strokeRightWeight = 0;
mainNav.strokeBottomWeight = 1;
navWrap.appendChild(mainNav);
mainNav.appendChild(await makeText("12WIN", 20, "Bold", "color/text/primary/card/title"));

const navLinks = figma.createFrame();
navLinks.name = "top-nav-links";
navLinks.layoutMode = "HORIZONTAL";
navLinks.itemSpacing = 4;
navLinks.fills = [];
mainNav.appendChild(navLinks);
navLinks.layoutSizingHorizontal = "FILL";

const labels = [
  "Home",
  "All",
  "Sports",
  "Live Casino",
  "Slots",
  "Fish Hunt",
  "Promotion",
  "Referral",
  "Membership",
  "More ▾",
];
for (const label of labels) {
  const link = figma.createFrame();
  const isActive = label === "Home";
  link.name = isActive ? "top-nav-link nav-desktop-link-active" : "top-nav-link";
  link.layoutMode = "HORIZONTAL";
  link.paddingLeft = link.paddingRight = 14;
  link.paddingTop = link.paddingBottom = 8;
  link.cornerRadius = 8;
  if (isActive) {
    await bindGradientFill(link, "color/gradient/button/cta/start", "color/gradient/button/cta/end");
    await bindStrokePath(link, "color/border/brand");
    // .top-nav-link { color: button-nav-text } wins over nav-desktop-link-active for text
    link.appendChild(await makeText(label, 13, "Semi Bold", "color/text/primary/card/title"));
  } else {
    link.fills = [];
    link.appendChild(await makeText(label, 13, "Bold", "color/text/primary/card/title"));
  }
  navLinks.appendChild(link);
}

// ── Hero + Marquee (HeroSection.jsx) ──
const hero = figma.createFrame();
hero.name = "Hero + Marquee";
hero.layoutMode = "VERTICAL";
hero.primaryAxisSizingMode = "AUTO";
hero.counterAxisSizingMode = "FIXED";
hero.resize(1440, 100);
hero.itemSpacing = 0;
await bindFillPath(hero, "color/primary");
ui.appendChild(hero);

const heroImg = figma.createFrame();
heroImg.name = "Hero banner";
heroImg.resize(1440, 280);
await bindFillPath(heroImg, "color/surface/cool/light");
hero.appendChild(heroImg);
heroImg.appendChild(await makeText("homebanner.jpg", 14, "Regular", "color/text/card/text"));

const marquee = figma.createFrame();
marquee.name = "Announcement marquee";
marquee.layoutMode = "HORIZONTAL";
marquee.resize(1440, 44);
marquee.paddingLeft = marquee.paddingRight = 64;
marquee.counterAxisAlignItems = "CENTER";
marquee.itemSpacing = 12;
await bindFillPath(marquee, "color/primary");
await bindStrokePath(marquee, "color/border/brand");
marquee.strokeTopWeight = 1;
marquee.strokeBottomWeight = 0;
marquee.strokeLeftWeight = 0;
marquee.strokeRightWeight = 0;
hero.appendChild(marquee);
marquee.appendChild(await makeText("📣", 14, "Regular", "color/text/card/text"));
marquee.appendChild(
  await makeText(
    "Dear valued customer — promotions and VIP rewards available daily.",
    12,
    "Regular",
    "color/text/sticky/nav/text",
  ),
);

// ── Home content ──
const content = figma.createFrame();
content.name = "Home content";
content.layoutMode = "VERTICAL";
content.primaryAxisSizingMode = "AUTO";
content.counterAxisSizingMode = "FIXED";
content.resize(1440, 100);
content.paddingLeft = content.paddingRight = 64;
content.paddingTop = content.paddingBottom = 40;
content.itemSpacing = 48;
content.fills = [];
ui.appendChild(content);

// Features row (FeaturesRow.jsx)
const features = sectionShell("Features row", 32);
content.appendChild(features);
features.appendChild(await sectionHeader("Outstanding Functions"));

const featGrid = figma.createFrame();
featGrid.layoutMode = "HORIZONTAL";
featGrid.itemSpacing = 16;
featGrid.fills = [];
features.appendChild(featGrid);
featGrid.layoutSizingHorizontal = "FILL";

for (const title of ["Prestigious Brands", "Game Modes", "Guaranteed safety", "Fast action"]) {
  const card = figma.createFrame();
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 10;
  card.paddingLeft = card.paddingRight = 16;
  card.paddingTop = card.paddingBottom = 16;
  card.cornerRadius = 12;
  card.resize(300, 120);
  await bindFillPath(card, "color/surface/base");
  await bindStrokePath(card, "color/border/brand");
  featGrid.appendChild(card);
  card.layoutSizingHorizontal = "FILL";

  const iconCircle = figma.createFrame();
  iconCircle.resize(52, 52);
  iconCircle.cornerRadius = 999;
  await bindFillPath(iconCircle, "color/surface/base");
  await bindStrokePath(iconCircle, "color/surface/cool/light");
  card.appendChild(iconCircle);

  card.appendChild(await makeText(title, 13, "Semi Bold", "color/button/hover"));
}

// Popular Category (GameCategories.jsx)
const cats = sectionShell("Popular Category");
content.appendChild(cats);
cats.appendChild(await sectionHeader("Popular Category"));

const catGrid = figma.createFrame();
catGrid.layoutMode = "HORIZONTAL";
catGrid.itemSpacing = 16;
catGrid.fills = [];
cats.appendChild(catGrid);
catGrid.layoutSizingHorizontal = "FILL";

for (const name of ["Slots", "Casino", "Sports", "Fishing", "E-Sports", "Lottery"]) {
  const card = figma.createFrame();
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 8;
  card.paddingTop = 28;
  card.paddingBottom = 12;
  card.paddingLeft = card.paddingRight = 8;
  card.cornerRadius = 15;
  await bindFillPath(card, "color/surface/cool/light");
  await bindStrokePath(card, "color/border/brand");
  catGrid.appendChild(card);
  card.layoutSizingHorizontal = "FILL";

  const ribbon = figma.createFrame();
  ribbon.cornerRadius = 10;
  ribbon.paddingLeft = ribbon.paddingRight = 10;
  ribbon.paddingTop = ribbon.paddingBottom = 6;
  await bindFillPath(ribbon, "color/primary");
  await bindStrokePath(ribbon, "color/border/brand");
  ribbon.appendChild(await makeText(name.toUpperCase(), 10, "Bold", "color/text/card/text"));
  card.appendChild(ribbon);

  const thumb = figma.createFrame();
  thumb.resize(180, 200);
  thumb.cornerRadius = 10;
  await bindFillPath(thumb, "color/surface/cool/light");
  card.appendChild(thumb);
}

// Top Games (TopGames.jsx + TopGameCard compact)
const topGames = sectionShell("Top Games");
content.appendChild(topGames);
topGames.appendChild(await sectionHeader("Top Games"));

const gameRow = figma.createFrame();
gameRow.layoutMode = "HORIZONTAL";
gameRow.itemSpacing = 16;
gameRow.fills = [];
topGames.appendChild(gameRow);
gameRow.layoutSizingHorizontal = "FILL";

for (let i = 1; i <= 6; i++) {
  const card = figma.createFrame();
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 0;
  card.cornerRadius = 16;
  card.resize(200, 240);
  await bindFillPath(card, "color/surface/base");
  gameRow.appendChild(card);

  const art = figma.createFrame();
  art.resize(200, 160);
  art.cornerRadius = 16;
  await bindFillPath(art, "color/surface/cool/light");
  card.appendChild(art);

  const gameFooter = figma.createFrame();
  gameFooter.layoutMode = "VERTICAL";
  gameFooter.itemSpacing = 4;
  gameFooter.paddingLeft = gameFooter.paddingRight = 8;
  gameFooter.paddingTop = gameFooter.paddingBottom = 8;
  gameFooter.resize(200, 80);
  await bindFillPath(gameFooter, "color/surface/rtp/card");
  await bindStrokePath(gameFooter, "color/border/subtle", 1);
  card.appendChild(gameFooter);
  gameFooter.appendChild(await makeText(`Game ${i}`, 11, "Bold", "color/text/card/text"));

  const rtp = figma.createFrame();
  rtp.cornerRadius = 999;
  rtp.paddingLeft = rtp.paddingRight = 10;
  rtp.paddingTop = rtp.paddingBottom = 4;
  await bindFillPath(rtp, "color/surface/rtp/secondary/card");
  rtp.appendChild(await makeText("RTP 96.5%", 10, "Bold", "color/surface/rtp/secondary/card/text"));
  gameFooter.appendChild(rtp);

  const primaryBorder = figma.createRectangle();
  primaryBorder.resize(200, 4);
  await bindFillPath(primaryBorder, "color/primary");
  card.appendChild(primaryBorder);
}

// Live activity (HomeLiveActivity.jsx — bg-gradient-home-dashboard)
const live = sectionShell("Live activity");
content.appendChild(live);
live.appendChild(await sectionHeader("Live Transactions"));

for (const panelName of ["Live Transactions", "Recent Big Wins"]) {
  const panel = figma.createFrame();
  panel.name = panelName;
  panel.layoutMode = "VERTICAL";
  panel.itemSpacing = 16;
  panel.paddingLeft = panel.paddingRight = 32;
  panel.paddingTop = panel.paddingBottom = 32;
  panel.cornerRadius = 20;
  await bindGradientFill(panel, "color/gradient/home/dashboard/start", "color/gradient/home/dashboard/end");
  await bindStrokePath(panel, "color/border/brand");
  live.appendChild(panel);
  panel.layoutSizingHorizontal = "FILL";
  panel.appendChild(await makeText(panelName + " panel", 14, "Regular", "color/text/secondary"));
}

// Footer (Footer.jsx — site-footer)
const footer = figma.createFrame();
footer.name = "Footer";
footer.layoutMode = "VERTICAL";
footer.itemSpacing = 12;
footer.paddingLeft = footer.paddingRight = 64;
footer.paddingTop = footer.paddingBottom = 48;
footer.resize(1440, 160);
await bindFillPath(footer, "color/surface/low");
await bindStrokePath(footer, "color/border/line");
footer.strokeTopWeight = 1;
footer.strokeBottomWeight = 0;
footer.strokeLeftWeight = 0;
footer.strokeRightWeight = 0;
ui.appendChild(footer);
footer.appendChild(
  await makeText(
    "© 2026 12WIN · 18+ · Responsible gaming",
    12,
    "Semi Bold",
    "color/text/footer",
  ),
);

const ann = homePage.findOne((n) => n.name.startsWith("[Color Tokens"));
if (ann) ann.y = ui.height + 48;

return {
  step: "home-ui-1to1",
  uiFrameId: ui.id,
  uiHeight: ui.height,
  semanticBindings: [
    "color/surface/base",
    "color/sticky/nav",
    "color/border/subtle",
    "color/text/sticky/nav/text",
    "color/gradient/button/cta/start",
    "color/gradient/button/cta/end",
    "color/text/cta/inverse",
    "color/surface/base",
    "color/text/primary/card/title",
    "color/primary",
    "color/text/card/text",
    "color/border/brand",
    "color/surface/cool/light",
    "color/button/hover",
    "color/surface/rtp/card",
    "color/surface/rtp/secondary/card",
    "color/surface/rtp/secondary/card/text",
    "color/gradient/home/dashboard/start",
    "color/gradient/home/dashboard/end",
    "color/surface/low",
    "color/border/line",
    "color/text/footer",
  ],
};
