const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i++) {
    if (col.modes[i]) {
      col.renameMode(col.modes[i].modeId, modeNames[i]);
    } else if (i > 0) {
      col.addMode(modeNames[i]);
    }
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

const ITEMS = [{"n":"raw/gradient/accent/200","web":"var(--raw-gradient-accent-200)"},{"n":"raw/gradient/accent/300","web":"var(--raw-gradient-accent-300)"},{"n":"raw/gradient/accent/400","web":"var(--raw-gradient-accent-400)"},{"n":"raw/gradient/accent/500","web":"var(--raw-gradient-accent-500)"},{"n":"raw/gradient/accent/600","web":"var(--raw-gradient-accent-600)"},{"n":"raw/gradient/accent/700","web":"var(--raw-gradient-accent-700)"},{"n":"raw/gradient/lottery/header/start","web":"var(--raw-gradient-lottery-header-start)"},{"n":"raw/gradient/lottery/header/end","web":"var(--raw-gradient-lottery-header-end)"},{"n":"raw/gradient/hero/fade/left/start","web":"var(--raw-gradient-hero-fade-left-start)"},{"n":"raw/gradient/hero/fade/left/mid","web":"var(--raw-gradient-hero-fade-left-mid)"},{"n":"raw/gradient/game/stage/start","web":"var(--raw-gradient-game-stage-start)"},{"n":"raw/gradient/game/stage/end","web":"var(--raw-gradient-game-stage-end)"},{"n":"raw/gradient/modal/shell/start","web":"var(--raw-gradient-modal-shell-start)"},{"n":"raw/gradient/modal/shell/end","web":"var(--raw-gradient-modal-shell-end)"},{"n":"raw/cta/strong/start","web":"var(--raw-cta-strong-start)"},{"n":"raw/cta/strong/end","web":"var(--raw-cta-strong-end)"},{"n":"raw/app/surface","web":"var(--raw-app-surface)"},{"n":"raw/app/surface/base","web":"var(--raw-app-surface-base)"},{"n":"raw/app/text/primary","web":"var(--raw-app-text-primary)"},{"n":"raw/app/text/secondary","web":"var(--raw-app-text-secondary)"},{"n":"raw/app/text/subtle","web":"var(--raw-app-text-subtle)"},{"n":"raw/app/text/muted","web":"var(--raw-app-text-muted)"},{"n":"raw/app/text/soft","web":"var(--raw-app-text-soft)"},{"n":"raw/app/border","web":"var(--raw-app-border)"},{"n":"raw/app/button/cta","web":"var(--raw-app-button-cta)"},{"n":"raw/surface/subtle","web":"var(--raw-surface-subtle)"},{"n":"raw/surface/panel","web":"var(--raw-surface-panel)"},{"n":"raw/border/brand","web":"var(--raw-border-brand)"},{"n":"raw/bar","web":"var(--raw-bar)"},{"n":"raw/border/sports/card","web":"var(--raw-border-sports-card)"},{"n":"raw/border/sports/market","web":"var(--raw-border-sports-market)"},{"n":"raw/gradient/rank/first/end","web":"var(--raw-gradient-rank-first-end)"},{"n":"raw/gradient/rank/first/start","web":"var(--raw-gradient-rank-first-start)"},{"n":"raw/gradient/rank/second/end","web":"var(--raw-gradient-rank-second-end)"},{"n":"raw/gradient/rank/second/start","web":"var(--raw-gradient-rank-second-start)"},{"n":"raw/gradient/rank/third/end","web":"var(--raw-gradient-rank-third-end)"},{"n":"raw/gradient/rank/third/start","web":"var(--raw-gradient-rank-third-start)"},{"n":"raw/gradient/sports/button/end","web":"var(--raw-gradient-sports-button-end)"},{"n":"raw/gradient/sports/button/start","web":"var(--raw-gradient-sports-button-start)"},{"n":"raw/gradient/sports/card/end","web":"var(--raw-gradient-sports-card-end)"},{"n":"raw/gradient/sports/card/start","web":"var(--raw-gradient-sports-card-start)"},{"n":"raw/icon/rank/alert/base","web":"var(--raw-icon-rank-alert-base)"},{"n":"raw/icon/rank/alert/highlight","web":"var(--raw-icon-rank-alert-highlight)"},{"n":"raw/icon/rank/first/mark","web":"var(--raw-icon-rank-first-mark)"},{"n":"raw/icon/rank/second/mark","web":"var(--raw-icon-rank-second-mark)"},{"n":"raw/icon/rank/third/mark","web":"var(--raw-icon-rank-third-mark)"},{"n":"raw/promo/date","web":"var(--raw-promo-date)"},{"n":"raw/surface/game/stage","web":"var(--raw-surface-game-stage)"},{"n":"raw/surface/sports/button","web":"var(--raw-surface-sports-button)"},{"n":"raw/text/sports/muted","web":"var(--raw-text-sports-muted)"},{"n":"raw/text/sports/primary","web":"var(--raw-text-sports-primary)"},{"n":"raw/brand/soft","web":"var(--raw-brand-soft)"},{"n":"raw/brand/soft/border","web":"var(--raw-brand-soft-border)"},{"n":"raw/brand/line","web":"var(--raw-brand-line)"},{"n":"raw/page/home","web":"var(--raw-page-home)"},{"n":"raw/page/register","web":"var(--raw-page-register)"},{"n":"raw/page/account","web":"var(--raw-page-account)"},{"n":"raw/page/default","web":"var(--raw-page-default)"},{"n":"raw/surface/muted","web":"var(--raw-surface-muted)"},{"n":"raw/surface/muted/soft","web":"var(--raw-surface-muted-soft)"},{"n":"raw/surface/base/80","web":"var(--raw-surface-base-80)"},{"n":"raw/surface/base/85","web":"var(--raw-surface-base-85)"},{"n":"raw/text/brand","web":"var(--raw-text-brand)"},{"n":"raw/text/brand/soft","web":"var(--raw-text-brand-soft)"},{"n":"raw/text/soft","web":"var(--raw-text-soft)"},{"n":"raw/border/accent","web":"var(--raw-border-accent)"},{"n":"raw/border/live","web":"var(--raw-border-live)"},{"n":"raw/wash/400","web":"var(--raw-wash-400)"},{"n":"raw/payout/title","web":"var(--raw-payout-title)"},{"n":"raw/payout/highlight","web":"var(--raw-payout-highlight)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "05", updated, missing, total: ITEMS.length };
