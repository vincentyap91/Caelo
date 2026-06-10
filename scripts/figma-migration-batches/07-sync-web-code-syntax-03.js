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

const ITEMS = [{"n":"raw/scrim/shine/end","web":"var(--raw-scrim-shine-end)"},{"n":"raw/scrim/white/55","web":"var(--raw-scrim-white-55)"},{"n":"raw/scrim/white/14","web":"var(--raw-scrim-white-14)"},{"n":"raw/scrim/white/04","web":"var(--raw-scrim-white-04)"},{"n":"raw/scrim/slate/04","web":"var(--raw-scrim-slate-04)"},{"n":"raw/scrim/slate/01","web":"var(--raw-scrim-slate-01)"},{"n":"raw/scrim/brand/deep/08","web":"var(--raw-scrim-brand-deep-08)"},{"n":"raw/scrim/brand/mid/06","web":"var(--raw-scrim-brand-mid-06)"},{"n":"raw/scrim/brand/cyan/12","web":"var(--raw-scrim-brand-cyan-12)"},{"n":"raw/scrim/brand/cyan/14","web":"var(--raw-scrim-brand-cyan-14)"},{"n":"raw/scrim/brand/cyan/18","web":"var(--raw-scrim-brand-cyan-18)"},{"n":"raw/scrim/brand/cyan/16","web":"var(--raw-scrim-brand-cyan-16)"},{"n":"raw/scrim/accent/blue/16","web":"var(--raw-scrim-accent-blue-16)"},{"n":"raw/scrim/accent/blue/14","web":"var(--raw-scrim-accent-blue-14)"},{"n":"raw/scrim/accent/blue/10","web":"var(--raw-scrim-accent-blue-10)"},{"n":"raw/scrim/accent/blue/08","web":"var(--raw-scrim-accent-blue-08)"},{"n":"raw/scrim/gold/22","web":"var(--raw-scrim-gold-22)"},{"n":"raw/scrim/gold/12","web":"var(--raw-scrim-gold-12)"},{"n":"raw/scrim/panel/45","web":"var(--raw-scrim-panel-45)"},{"n":"raw/scrim/panel/65","web":"var(--raw-scrim-panel-65)"},{"n":"raw/scrim/panel/96","web":"var(--raw-scrim-panel-96)"},{"n":"raw/scrim/panel/98","web":"var(--raw-scrim-panel-98)"},{"n":"raw/scrim/panel/50","web":"var(--raw-scrim-panel-50)"},{"n":"raw/scrim/hero/edge","web":"var(--raw-scrim-hero-edge)"},{"n":"raw/scrim/hero/stop/99","web":"var(--raw-scrim-hero-stop-99)"},{"n":"raw/scrim/hero/stop/96","web":"var(--raw-scrim-hero-stop-96)"},{"n":"raw/scrim/hero/stop/82","web":"var(--raw-scrim-hero-stop-82)"},{"n":"raw/scrim/hero/stop/74","web":"var(--raw-scrim-hero-stop-74)"},{"n":"raw/scrim/hero/stop/35","web":"var(--raw-scrim-hero-stop-35)"},{"n":"raw/scrim/hero/stop/20","web":"var(--raw-scrim-hero-stop-20)"},{"n":"raw/scrim/hero/stop/06","web":"var(--raw-scrim-hero-stop-06)"},{"n":"raw/scrim/hero/clear","web":"var(--raw-scrim-hero-clear)"},{"n":"raw/scrim/hero/blob/start","web":"var(--raw-scrim-hero-blob-start)"},{"n":"raw/scrim/hero/blob/mid","web":"var(--raw-scrim-hero-blob-mid)"},{"n":"raw/scrim/hero/spot/full","web":"var(--raw-scrim-hero-spot-full)"},{"n":"raw/scrim/hero/spot/mid","web":"var(--raw-scrim-hero-spot-mid)"},{"n":"raw/scrim/hero/spot/soft","web":"var(--raw-scrim-hero-spot-soft)"},{"n":"raw/scrim/app/shell/start","web":"var(--raw-scrim-app-shell-start)"},{"n":"raw/scrim/app/shell/end","web":"var(--raw-scrim-app-shell-end)"},{"n":"raw/scrim/app/inner/start","web":"var(--raw-scrim-app-inner-start)"},{"n":"raw/scrim/app/inner/end","web":"var(--raw-scrim-app-inner-end)"},{"n":"raw/scrim/success/start","web":"var(--raw-scrim-success-start)"},{"n":"raw/scrim/success/end","web":"var(--raw-scrim-success-end)"},{"n":"raw/scrim/fav/inactive/start","web":"var(--raw-scrim-fav-inactive-start)"},{"n":"raw/scrim/fav/inactive/end","web":"var(--raw-scrim-fav-inactive-end)"},{"n":"raw/scrim/fav/hover/start","web":"var(--raw-scrim-fav-hover-start)"},{"n":"raw/scrim/fav/hover/end","web":"var(--raw-scrim-fav-hover-end)"},{"n":"raw/scrim/fav/active/start","web":"var(--raw-scrim-fav-active-start)"},{"n":"raw/scrim/fav/active/mid","web":"var(--raw-scrim-fav-active-mid)"},{"n":"raw/scrim/fav/active/end","web":"var(--raw-scrim-fav-active-end)"},{"n":"raw/scrim/fav/active/hover/start","web":"var(--raw-scrim-fav-active-hover-start)"},{"n":"raw/scrim/fav/active/hover/mid","web":"var(--raw-scrim-fav-active-hover-mid)"},{"n":"raw/scrim/fav/active/hover/end","web":"var(--raw-scrim-fav-active-hover-end)"},{"n":"raw/scrim/game/overlay/start","web":"var(--raw-scrim-game-overlay-start)"},{"n":"raw/scrim/game/overlay/mid","web":"var(--raw-scrim-game-overlay-mid)"},{"n":"raw/scrim/game/overlay/end","web":"var(--raw-scrim-game-overlay-end)"},{"n":"raw/scrim/game/glow/soft","web":"var(--raw-scrim-game-glow-soft)"},{"n":"raw/scrim/game/glow/faint","web":"var(--raw-scrim-game-glow-faint)"},{"n":"raw/scrim/game/glow/strong","web":"var(--raw-scrim-game-glow-strong)"},{"n":"raw/scrim/game/glow/mid","web":"var(--raw-scrim-game-glow-mid)"},{"n":"raw/scrim/toast/shine","web":"var(--raw-scrim-toast-shine)"},{"n":"raw/gradient/home/cta/edge","web":"var(--raw-gradient-home-cta-edge)"},{"n":"raw/gradient/home/highlight/end","web":"var(--raw-gradient-home-highlight-end)"},{"n":"raw/gradient/home/highlight/start","web":"var(--raw-gradient-home-highlight-start)"},{"n":"raw/gradient/soft/panel/start","web":"var(--raw-gradient-soft-panel-start)"},{"n":"raw/gradient/soft/panel/end","web":"var(--raw-gradient-soft-panel-end)"},{"n":"raw/gradient/blue/panel/start","web":"var(--raw-gradient-blue-panel-start)"},{"n":"raw/gradient/blue/panel/end","web":"var(--raw-gradient-blue-panel-end)"},{"n":"raw/gradient/account/shell/start","web":"var(--raw-gradient-account-shell-start)"},{"n":"raw/gradient/account/shell/mid","web":"var(--raw-gradient-account-shell-mid)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "03", updated, missing, total: ITEMS.length };
