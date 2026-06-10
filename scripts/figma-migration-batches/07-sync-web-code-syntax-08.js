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

const ITEMS = [{"n":"color/surface/light","web":"var(--color-surface-light)"},{"n":"color/surface/light/active","web":"var(--color-surface-light-active)"},{"n":"color/surface/low","web":"var(--color-surface-low)"},{"n":"color/surface/menu/active","web":"var(--color-surface-menu-active)"},{"n":"color/surface/mid","web":"var(--color-surface-mid)"},{"n":"color/surface/mid/dark","web":"var(--color-surface-mid-dark)"},{"n":"color/surface/mid/color","web":"var(--color-surface-mid-color)"},{"n":"color/surface/mid/container","web":"var(--color-surface-mid-container)"},{"n":"color/surface/mid/text","web":"var(--color-surface-mid-text)"},{"n":"color/surface/nav","web":"var(--color-surface-nav)"},{"n":"color/surface/navy","web":"var(--color-surface-navy)"},{"n":"color/surface/near/black","web":"var(--color-surface-near-black)"},{"n":"color/surface/near/black/alt","web":"var(--color-surface-near-black-alt)"},{"n":"color/surface/neutral/light","web":"var(--color-surface-neutral-light)"},{"n":"color/surface/notify","web":"var(--color-surface-notify)"},{"n":"color/surface/overlay/dark","web":"var(--color-surface-overlay-dark)"},{"n":"color/surface/pale/blue","web":"var(--color-surface-pale-blue)"},{"n":"color/surface/panel","web":"var(--color-surface-panel)"},{"n":"color/surface/panel/border","web":"var(--color-surface-panel-border)"},{"n":"color/surface/primary/shape","web":"var(--color-surface-primary-shape)"},{"n":"color/surface/qrcode","web":"var(--color-surface-qrcode)"},{"n":"color/surface/referral/card","web":"var(--color-surface-referral-card)"},{"n":"color/surface/referral/input","web":"var(--color-surface-referral-input)"},{"n":"color/surface/rtp/card","web":"var(--color-surface-rtp-card)"},{"n":"color/surface/rtp/secondary/card","web":"var(--color-surface-rtp-secondary-card)"},{"n":"color/surface/rtp/secondary/card/text","web":"var(--color-surface-rtp-secondary-card-text)"},{"n":"color/surface/scrim/dark","web":"var(--color-surface-scrim-dark)"},{"n":"color/surface/search","web":"var(--color-surface-search)"},{"n":"color/surface/secondary/chip","web":"var(--color-surface-secondary-chip)"},{"n":"color/surface/secondary/shape","web":"var(--color-surface-secondary-shape)"},{"n":"color/surface/secondary/table/head","web":"var(--color-surface-secondary-table-head)"},{"n":"color/surface/sheet","web":"var(--color-surface-sheet)"},{"n":"color/surface/sidebar","web":"var(--color-surface-sidebar)"},{"n":"color/surface/slate","web":"var(--color-surface-slate)"},{"n":"color/surface/start","web":"var(--color-surface-start)"},{"n":"color/surface/striped/even","web":"var(--color-surface-striped-even)"},{"n":"color/surface/striped/odd","web":"var(--color-surface-striped-odd)"},{"n":"color/surface/subtle","web":"var(--color-surface-subtle)"},{"n":"color/surface/table","web":"var(--color-surface-table)"},{"n":"color/surface/table/head","web":"var(--color-surface-table-head)"},{"n":"color/surface/teal/dark","web":"var(--color-surface-teal-dark)"},{"n":"color/primary","web":"var(--color-primary)"},{"n":"color/border","web":"var(--color-border)"},{"n":"color/border/brand","web":"var(--color-border-brand)"},{"n":"color/border/danger","web":"var(--color-border-danger)"},{"n":"color/border/divider","web":"var(--color-border-divider)"},{"n":"color/border/line","web":"var(--color-border-line)"},{"n":"color/border/sports/card","web":"var(--color-border-sports-card)"},{"n":"color/border/sports/market","web":"var(--color-border-sports-market)"},{"n":"color/border/strong","web":"var(--color-border-strong)"},{"n":"color/border/subtle","web":"var(--color-border-subtle)"},{"n":"color/border/tabs","web":"var(--color-border-tabs)"},{"n":"color/accent","web":"var(--color-accent)"},{"n":"color/accent/check/in/reward","web":"var(--color-accent-check-in-reward)"},{"n":"color/accent/chip","web":"var(--color-accent-chip)"},{"n":"color/accent/glow","web":"var(--color-accent-glow)"},{"n":"color/accent/gold","web":"var(--color-accent-gold)"},{"n":"color/accent/gold/light","web":"var(--color-accent-gold-light)"},{"n":"color/accent/gold/mid","web":"var(--color-accent-gold-mid)"},{"n":"color/accent/gold/muted","web":"var(--color-accent-gold-muted)"},{"n":"color/accent/khaki","web":"var(--color-accent-khaki)"},{"n":"color/accent/pale","web":"var(--color-accent-pale)"},{"n":"color/accent/yellow","web":"var(--color-accent-yellow)"},{"n":"color/button/accent","web":"var(--color-button-accent)"},{"n":"color/button/accent/deep","web":"var(--color-button-accent-deep)"},{"n":"color/button/accordian/head","web":"var(--color-button-accordian-head)"},{"n":"color/button/back","web":"var(--color-button-back)"},{"n":"color/button/cta","web":"var(--color-button-cta)"},{"n":"color/button/cta/arrow","web":"var(--color-button-cta-arrow)"},{"n":"color/button/cta/arrow/selected","web":"var(--color-button-cta-arrow-selected)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "08", updated, missing, total: ITEMS.length };
