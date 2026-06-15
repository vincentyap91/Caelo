const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];
const PLACEHOLDER = { r: 0.8, g: 0.8, b: 0.8, a: 1 };

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) col.renameMode(col.modes[i].modeId, modeNames[i]);
    else if (i > 0) col.addMode(modeNames[i]);
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

const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
const modeIds = [col.modes[0].modeId];
const ITEMS = [{"n":"raw/gradient/sports/card/end","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-gradient-sports-card-end)"},{"n":"raw/gradient/sports/card/start","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-gradient-sports-card-start)"},{"n":"raw/icon/rank/alert/base","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-icon-rank-alert-base)"},{"n":"raw/icon/rank/alert/highlight","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-icon-rank-alert-highlight)"},{"n":"raw/icon/rank/first/mark","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-icon-rank-first-mark)"},{"n":"raw/icon/rank/second/mark","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-icon-rank-second-mark)"},{"n":"raw/icon/rank/third/mark","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-icon-rank-third-mark)"},{"n":"raw/promo/date","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-promo-date)"},{"n":"raw/surface/game/stage","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-game-stage)"},{"n":"raw/surface/sports/button","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-sports-button)"},{"n":"raw/text/sports/muted","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-text-sports-muted)"},{"n":"raw/text/sports/primary","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-text-sports-primary)"},{"n":"raw/brand/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-brand-soft)"},{"n":"raw/brand/soft/border","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-brand-soft-border)"},{"n":"raw/brand/line","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-brand-line)"},{"n":"raw/page/home","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-page-home)"},{"n":"raw/page/register","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-page-register)"},{"n":"raw/page/account","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-page-account)"},{"n":"raw/page/default","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-page-default)"},{"n":"raw/surface/muted","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-muted)"},{"n":"raw/surface/muted/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-muted-soft)"},{"n":"raw/surface/base/80","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-base-80)"},{"n":"raw/surface/base/85","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-surface-base-85)"},{"n":"raw/text/brand","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-text-brand)"},{"n":"raw/text/brand/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-text-brand-soft)"},{"n":"raw/text/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-text-soft)"},{"n":"raw/border/accent","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-border-accent)"},{"n":"raw/border/live","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-border-live)"},{"n":"raw/wash/400","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-wash-400)"},{"n":"raw/payout/title","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-payout-title)"},{"n":"raw/payout/highlight","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-payout-highlight)"},{"n":"raw/payout/amount","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-payout-amount)"},{"n":"raw/cta/start","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-start)"},{"n":"raw/cta/end","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-end)"},{"n":"raw/cta/auth/start","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-auth-start)"},{"n":"raw/cta/auth/end","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-auth-end)"},{"n":"raw/cta/border","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-border)"},{"n":"raw/cta/focus","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-focus)"},{"n":"raw/cta/text","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-cta-text)"},{"n":"raw/nav/border","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-border)"},{"n":"raw/nav/border/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-border-soft)"},{"n":"raw/nav/tile/border","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-tile-border)"},{"n":"raw/nav/tile/border/hover","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-tile-border-hover)"},{"n":"raw/nav/text/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-text-soft)"},{"n":"raw/nav/text/accent","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-text-accent)"},{"n":"raw/nav/accent/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-accent-soft)"},{"n":"raw/nav/icon","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-icon)"},{"n":"raw/nav/icon/hover","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-icon-hover)"},{"n":"raw/nav/badge","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-badge)"},{"n":"raw/nav/overlay","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-nav-overlay)"},{"n":"raw/scrim/game/launch/start","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-scrim-game-launch-start)"},{"n":"raw/scrim/game/launch/mid","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-scrim-game-launch-mid)"},{"n":"raw/scrim/game/launch/end","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-scrim-game-launch-end)"},{"n":"raw/scrim/game/launch/end/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-scrim-game-launch-end-soft)"},{"n":"raw/universal/modal/header/bg","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--raw-universal-modal-header-bg)"}];
let created = 0, skipped = 0;
for (const item of ITEMS) {
  let v = await findVar(col.id, item.n);
  if (v) { skipped++; continue; }
  v = figma.variables.createVariable(item.n, col, "COLOR");
  v.scopes = item.sc;
  v.setVariableCodeSyntax("WEB", item.web);
  for (const modeId of modeIds) v.setValueForMode(modeId, PLACEHOLDER);
  created++;
}
return { step: "01-primitives", batch: "05", created, skipped, total: ITEMS.length };
