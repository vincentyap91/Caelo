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

const ITEMS = [{"n":"color/button/cta/category","web":"var(--color-button-cta-category)"},{"n":"color/button/cta/category/text","web":"var(--color-button-cta-category-text)"},{"n":"color/button/cta/fifth","web":"var(--color-button-cta-fifth)"},{"n":"color/button/cta/fifth/text","web":"var(--color-button-cta-fifth-text)"},{"n":"color/button/cta/fourth","web":"var(--color-button-cta-fourth)"},{"n":"color/button/cta/fourth/text","web":"var(--color-button-cta-fourth-text)"},{"n":"color/button/cta/pagination","web":"var(--color-button-cta-pagination)"},{"n":"color/button/cta/pagination/selected","web":"var(--color-button-cta-pagination-selected)"},{"n":"color/button/cta/primary","web":"var(--color-button-cta-primary)"},{"n":"color/button/cta/secondary","web":"var(--color-button-cta-secondary)"},{"n":"color/button/cta/secondary/text","web":"var(--color-button-cta-secondary-text)"},{"n":"color/button/cta/tertiary","web":"var(--color-button-cta-tertiary)"},{"n":"color/button/cta/tertiary/text","web":"var(--color-button-cta-tertiary-text)"},{"n":"color/button/dashboard/primary/end","web":"var(--color-button-dashboard-primary-end)"},{"n":"color/button/dashboard/primary/start","web":"var(--color-button-dashboard-primary-start)"},{"n":"color/button/disabled","web":"var(--color-button-disabled)"},{"n":"color/button/dot","web":"var(--color-button-dot)"},{"n":"color/button/hover","web":"var(--color-button-hover)"},{"n":"color/button/hover/text","web":"var(--color-button-hover-text)"},{"n":"color/button/lang/border","web":"var(--color-button-lang-border)"},{"n":"color/button/lang/icon","web":"var(--color-button-lang-icon)"},{"n":"color/button/lang/text","web":"var(--color-button-lang-text)"},{"n":"color/button/menu/active","web":"var(--color-button-menu-active)"},{"n":"color/button/muted","web":"var(--color-button-muted)"},{"n":"color/button/muted/text","web":"var(--color-button-muted-text)"},{"n":"color/button/nav","web":"var(--color-button-nav)"},{"n":"color/button/pagination","web":"var(--color-button-pagination)"},{"n":"color/button/pagination/arrow","web":"var(--color-button-pagination-arrow)"},{"n":"color/button/pagination/disabled","web":"var(--color-button-pagination-disabled)"},{"n":"color/button/referral/cta","web":"var(--color-button-referral-cta)"},{"n":"color/button/referral/cta/text","web":"var(--color-button-referral-cta-text)"},{"n":"color/button/nav/text","web":"var(--color-button-nav-text)"},{"n":"color/button/sports","web":"var(--color-button-sports)"},{"n":"color/button/tabs","web":"var(--color-button-tabs)"},{"n":"color/button/tabs/muted","web":"var(--color-button-tabs-muted)"},{"n":"color/button/tabs/muted/text","web":"var(--color-button-tabs-muted-text)"},{"n":"color/button/tabs/text","web":"var(--color-button-tabs-text)"},{"n":"color/popup/body","web":"var(--color-popup-body)"},{"n":"color/popup/head","web":"var(--color-popup-head)"},{"n":"color/progress/bar/bg","web":"var(--color-progress-bar-bg)"},{"n":"color/progress/bar/fill","web":"var(--color-progress-bar-fill)"},{"n":"color/success","web":"var(--color-success)"},{"n":"color/success/light","web":"var(--color-success-light)"},{"n":"color/success/lime/bright","web":"var(--color-success-lime-bright)"},{"n":"color/success/lime/deep","web":"var(--color-success-lime-deep)"},{"n":"color/success/lime/medium","web":"var(--color-success-lime-medium)"},{"n":"color/success/mid","web":"var(--color-success-mid)"},{"n":"color/success/positive","web":"var(--color-success-positive)"},{"n":"color/success/strong","web":"var(--color-success-strong)"},{"n":"color/success/vivid","web":"var(--color-success-vivid)"},{"n":"color/success/vivid/green","web":"var(--color-success-vivid-green)"},{"n":"color/danger","web":"var(--color-danger)"},{"n":"color/danger/accent","web":"var(--color-danger-accent)"},{"n":"color/danger/deep","web":"var(--color-danger-deep)"},{"n":"color/danger/maroon","web":"var(--color-danger-maroon)"},{"n":"color/danger/negative","web":"var(--color-danger-negative)"},{"n":"color/danger/red","web":"var(--color-danger-red)"},{"n":"color/danger/vivid","web":"var(--color-danger-vivid)"},{"n":"color/error/alert","web":"var(--color-error-alert)"},{"n":"color/error/bright","web":"var(--color-error-bright)"},{"n":"color/error/coral","web":"var(--color-error-coral)"},{"n":"color/error/crimson","web":"var(--color-error-crimson)"},{"n":"color/error/icon","web":"var(--color-error-icon)"},{"n":"color/error/medium","web":"var(--color-error-medium)"},{"n":"color/error/strong","web":"var(--color-error-strong)"},{"n":"color/error/warm","web":"var(--color-error-warm)"},{"n":"color/warning","web":"var(--color-warning)"},{"n":"color/overlay","web":"var(--color-overlay)"},{"n":"color/overlay/sports/card","web":"var(--color-overlay-sports-card)"},{"n":"color/overlay/sports/event","web":"var(--color-overlay-sports-event)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "09", updated, missing, total: ITEMS.length };
