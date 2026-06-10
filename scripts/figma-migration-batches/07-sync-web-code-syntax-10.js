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

const ITEMS = [{"n":"color/overlay/strong","web":"var(--color-overlay-strong)"},{"n":"color/muted","web":"var(--color-muted)"},{"n":"color/info/icon","web":"var(--color-info-icon)"},{"n":"color/info/steel/light","web":"var(--color-info-steel-light)"},{"n":"color/effect/glow","web":"var(--color-effect-glow)"},{"n":"color/effect/header/shadow","web":"var(--color-effect-header-shadow)"},{"n":"color/effect/shadow/soft","web":"var(--color-effect-shadow-soft)"},{"n":"color/icon/action","web":"var(--color-icon-action)"},{"n":"color/icon/check/in/active","web":"var(--color-icon-check-in-active)"},{"n":"color/icon/check/in/muted","web":"var(--color-icon-check-in-muted)"},{"n":"color/icon/check/in/star/deep","web":"var(--color-icon-check-in-star-deep)"},{"n":"color/icon/muted","web":"var(--color-icon-muted)"},{"n":"color/icon/rank/alert/base","web":"var(--color-icon-rank-alert-base)"},{"n":"color/icon/rank/alert/highlight","web":"var(--color-icon-rank-alert-highlight)"},{"n":"color/icon/rank/first","web":"var(--color-icon-rank-first)"},{"n":"color/icon/rank/second","web":"var(--color-icon-rank-second)"},{"n":"color/icon/rank/third","web":"var(--color-icon-rank-third)"},{"n":"color/icon/subtle","web":"var(--color-icon-subtle)"},{"n":"color/icon/um","web":"var(--color-icon-um)"},{"n":"color/transparent","web":"var(--color-transparent)"},{"n":"color/bar","web":"var(--color-bar)"},{"n":"color/primary/tag","web":"var(--color-primary-tag)"},{"n":"color/primary/tag/text","web":"var(--color-primary-tag-text)"},{"n":"color/scrollbar","web":"var(--color-scrollbar)"},{"n":"color/secondary","web":"var(--color-secondary)"},{"n":"color/secondary/tag","web":"var(--color-secondary-tag)"},{"n":"color/secondary/tag/text","web":"var(--color-secondary-tag-text)"},{"n":"color/sticky/nav","web":"var(--color-sticky-nav)"},{"n":"color/thumbnail","web":"var(--color-thumbnail)"},{"n":"color/gradient/button/cta/start","web":"var(--color-gradient-button-cta-start)"},{"n":"color/gradient/button/cta/end","web":"var(--color-gradient-button-cta-end)"},{"n":"color/gradient/card/brand/start","web":"var(--color-gradient-card-brand-start)"},{"n":"color/gradient/card/brand/end","web":"var(--color-gradient-card-brand-end)"},{"n":"color/gradient/check/in/card/start","web":"var(--color-gradient-check-in-card-start)"},{"n":"color/gradient/check/in/card/end","web":"var(--color-gradient-check-in-card-end)"},{"n":"color/gradient/check/in/day/start","web":"var(--color-gradient-check-in-day-start)"},{"n":"color/gradient/check/in/day/end","web":"var(--color-gradient-check-in-day-end)"},{"n":"color/gradient/check/in/reward/start","web":"var(--color-gradient-check-in-reward-start)"},{"n":"color/gradient/check/in/reward/end","web":"var(--color-gradient-check-in-reward-end)"},{"n":"color/gradient/dashboard/warm/start","web":"var(--color-gradient-dashboard-warm-start)"},{"n":"color/gradient/dashboard/warm/end","web":"var(--color-gradient-dashboard-warm-end)"},{"n":"color/gradient/header/balance/start","web":"var(--color-gradient-header-balance-start)"},{"n":"color/gradient/header/balance/end","web":"var(--color-gradient-header-balance-end)"},{"n":"color/gradient/home/cta/start","web":"var(--color-gradient-home-cta-start)"},{"n":"color/gradient/home/cta/end","web":"var(--color-gradient-home-cta-end)"},{"n":"color/gradient/home/dashboard/start","web":"var(--color-gradient-home-dashboard-start)"},{"n":"color/gradient/home/dashboard/end","web":"var(--color-gradient-home-dashboard-end)"},{"n":"color/gradient/home/highlight/start","web":"var(--color-gradient-home-highlight-start)"},{"n":"color/gradient/home/highlight/end","web":"var(--color-gradient-home-highlight-end)"},{"n":"color/gradient/home/muted/start","web":"var(--color-gradient-home-muted-start)"},{"n":"color/gradient/home/muted/end","web":"var(--color-gradient-home-muted-end)"},{"n":"color/gradient/rank/first/start","web":"var(--color-gradient-rank-first-start)"},{"n":"color/gradient/rank/first/end","web":"var(--color-gradient-rank-first-end)"},{"n":"color/gradient/rank/second/start","web":"var(--color-gradient-rank-second-start)"},{"n":"color/gradient/rank/second/end","web":"var(--color-gradient-rank-second-end)"},{"n":"color/gradient/rank/third/start","web":"var(--color-gradient-rank-third-start)"},{"n":"color/gradient/rank/third/end","web":"var(--color-gradient-rank-third-end)"},{"n":"color/gradient/referral/card/start","web":"var(--color-gradient-referral-card-start)"},{"n":"color/gradient/referral/card/end","web":"var(--color-gradient-referral-card-end)"},{"n":"color/gradient/referral/commission/start","web":"var(--color-gradient-referral-commission-start)"},{"n":"color/gradient/referral/commission/end","web":"var(--color-gradient-referral-commission-end)"},{"n":"color/gradient/referral/panel/start","web":"var(--color-gradient-referral-panel-start)"},{"n":"color/gradient/referral/panel/end","web":"var(--color-gradient-referral-panel-end)"},{"n":"color/gradient/menu/brand/start","web":"var(--color-gradient-menu-brand-start)"},{"n":"color/gradient/menu/brand/end","web":"var(--color-gradient-menu-brand-end)"},{"n":"color/gradient/menu/warm/start","web":"var(--color-gradient-menu-warm-start)"},{"n":"color/gradient/menu/warm/end","web":"var(--color-gradient-menu-warm-end)"},{"n":"color/gradient/nav/daily/bonus/start","web":"var(--color-gradient-nav-daily-bonus-start)"},{"n":"color/gradient/nav/daily/bonus/end","web":"var(--color-gradient-nav-daily-bonus-end)"},{"n":"color/gradient/nav/highlight/start","web":"var(--color-gradient-nav-highlight-start)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "10", updated, missing, total: ITEMS.length };
