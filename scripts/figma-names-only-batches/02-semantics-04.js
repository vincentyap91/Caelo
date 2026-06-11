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

const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const modeIds = col.modes.map((m) => m.modeId);
const ITEMS = [{"n":"color/danger/maroon","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-danger-maroon)"},{"n":"color/danger/negative","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-danger-negative)"},{"n":"color/danger/red","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-danger-red)"},{"n":"color/danger/vivid","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-danger-vivid)"},{"n":"color/error/alert","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-alert)"},{"n":"color/error/bright","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-bright)"},{"n":"color/error/coral","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-coral)"},{"n":"color/error/crimson","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-crimson)"},{"n":"color/error/icon","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-icon)"},{"n":"color/error/medium","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-medium)"},{"n":"color/error/strong","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-strong)"},{"n":"color/error/warm","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-error-warm)"},{"n":"color/warning","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-warning)"},{"n":"color/overlay","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-overlay)"},{"n":"color/overlay/sports/card","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-overlay-sports-card)"},{"n":"color/overlay/sports/event","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-overlay-sports-event)"},{"n":"color/overlay/strong","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-overlay-strong)"},{"n":"color/muted","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-muted)"},{"n":"color/info/icon","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-info-icon)"},{"n":"color/info/steel/light","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-info-steel-light)"},{"n":"color/effect/glow","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-effect-glow)"},{"n":"color/effect/header/shadow","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-effect-header-shadow)"},{"n":"color/effect/shadow/soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-effect-shadow-soft)"},{"n":"color/icon/action","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-action)"},{"n":"color/icon/check/in/active","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-check-in-active)"},{"n":"color/icon/check/in/muted","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-check-in-muted)"},{"n":"color/icon/check/in/star/deep","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-check-in-star-deep)"},{"n":"color/icon/muted","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-muted)"},{"n":"color/icon/rank/alert/base","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-rank-alert-base)"},{"n":"color/icon/rank/alert/highlight","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-rank-alert-highlight)"},{"n":"color/icon/rank/first","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-rank-first)"},{"n":"color/icon/rank/second","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-rank-second)"},{"n":"color/icon/rank/third","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-rank-third)"},{"n":"color/icon/subtle","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-subtle)"},{"n":"color/icon/um","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-icon-um)"},{"n":"color/transparent","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-transparent)"},{"n":"color/bar","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-bar)"},{"n":"color/primary/tag","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-primary-tag)"},{"n":"color/primary/tag/text","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-primary-tag-text)"},{"n":"color/scrollbar","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-scrollbar)"},{"n":"color/secondary","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-secondary)"},{"n":"color/secondary/tag","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-secondary-tag)"},{"n":"color/secondary/tag/text","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-secondary-tag-text)"},{"n":"color/sticky/nav","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-sticky-nav)"},{"n":"color/thumbnail","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-thumbnail)"},{"n":"color/gradient/home/card","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-gradient-home-card)"},{"n":"color/gradient/referral/deposit","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-gradient-referral-deposit)"},{"n":"color/gradient/referral/icon","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--color-gradient-referral-icon)"}];
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
return { step: "02-semantics", batch: "04", created, skipped, total: ITEMS.length };
