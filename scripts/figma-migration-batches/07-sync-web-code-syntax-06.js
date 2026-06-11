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

const ITEMS = [{"n":"raw/payout/highlight","web":"var(--raw-payout-highlight)"},{"n":"raw/payout/amount","web":"var(--raw-payout-amount)"},{"n":"raw/cta/start","web":"var(--raw-cta-start)"},{"n":"raw/cta/end","web":"var(--raw-cta-end)"},{"n":"raw/cta/auth/start","web":"var(--raw-cta-auth-start)"},{"n":"raw/cta/auth/end","web":"var(--raw-cta-auth-end)"},{"n":"raw/cta/border","web":"var(--raw-cta-border)"},{"n":"raw/cta/focus","web":"var(--raw-cta-focus)"},{"n":"raw/cta/text","web":"var(--raw-cta-text)"},{"n":"raw/nav/border","web":"var(--raw-nav-border)"},{"n":"raw/nav/border/soft","web":"var(--raw-nav-border-soft)"},{"n":"raw/nav/tile/border","web":"var(--raw-nav-tile-border)"},{"n":"raw/nav/tile/border/hover","web":"var(--raw-nav-tile-border-hover)"},{"n":"raw/nav/text/soft","web":"var(--raw-nav-text-soft)"},{"n":"raw/nav/text/accent","web":"var(--raw-nav-text-accent)"},{"n":"raw/nav/accent/soft","web":"var(--raw-nav-accent-soft)"},{"n":"raw/nav/icon","web":"var(--raw-nav-icon)"},{"n":"raw/nav/icon/hover","web":"var(--raw-nav-icon-hover)"},{"n":"raw/nav/badge","web":"var(--raw-nav-badge)"},{"n":"raw/nav/overlay","web":"var(--raw-nav-overlay)"},{"n":"raw/scrim/game/launch/start","web":"var(--raw-scrim-game-launch-start)"},{"n":"raw/scrim/game/launch/mid","web":"var(--raw-scrim-game-launch-mid)"},{"n":"raw/scrim/game/launch/end","web":"var(--raw-scrim-game-launch-end)"},{"n":"raw/scrim/game/launch/end/soft","web":"var(--raw-scrim-game-launch-end-soft)"},{"n":"raw/universal/modal/header/bg","web":"var(--raw-universal-modal-header-bg)"},{"n":"color/button/cta/end","web":"var(--color-button-cta-end)"},{"n":"color/button/cta/start","web":"var(--color-button-cta-start)"},{"n":"color/text/accent","web":"var(--color-text-accent)"},{"n":"color/text/accent/deep","web":"var(--color-text-accent-deep)"},{"n":"color/text/accent/light","web":"var(--color-text-accent-light)"},{"n":"color/text/card/text","web":"var(--color-text-card-text)"},{"n":"color/text/check/in/day/active","web":"var(--color-text-check-in-day-active)"},{"n":"color/text/check/in/day/muted","web":"var(--color-text-check-in-day-muted)"},{"n":"color/text/check/in/day/past","web":"var(--color-text-check-in-day-past)"},{"n":"color/text/check/in/reward","web":"var(--color-text-check-in-reward)"},{"n":"color/text/cta/inverse","web":"var(--color-text-cta-inverse)"},{"n":"color/text/cta/transparent","web":"var(--color-text-cta-transparent)"},{"n":"color/text/dim","web":"var(--color-text-dim)"},{"n":"color/text/disabled","web":"var(--color-text-disabled)"},{"n":"color/text/download","web":"var(--color-text-download)"},{"n":"color/text/faded","web":"var(--color-text-faded)"},{"n":"color/text/fifth","web":"var(--color-text-fifth)"},{"n":"color/text/fifth/title","web":"var(--color-text-fifth-title)"},{"n":"color/text/footer","web":"var(--color-text-footer)"},{"n":"color/text/four/title","web":"var(--color-text-four-title)"},{"n":"color/text/fourth","web":"var(--color-text-fourth)"},{"n":"color/text/game/title","web":"var(--color-text-game-title)"},{"n":"color/text/highlight","web":"var(--color-text-highlight)"},{"n":"color/text/hover","web":"var(--color-text-hover)"},{"n":"color/text/label","web":"var(--color-text-label)"},{"n":"color/text/light","web":"var(--color-text-light)"},{"n":"color/text/link","web":"var(--color-text-link)"},{"n":"color/text/link/danger","web":"var(--color-text-link-danger)"},{"n":"color/text/link/inverse","web":"var(--color-text-link-inverse)"},{"n":"color/text/mid","web":"var(--color-text-mid)"},{"n":"color/text/mid/alt","web":"var(--color-text-mid-alt)"},{"n":"color/text/mid/neutral","web":"var(--color-text-mid-neutral)"},{"n":"color/text/muted","web":"var(--color-text-muted)"},{"n":"color/text/placeholder","web":"var(--color-text-placeholder)"},{"n":"color/text/primary","web":"var(--color-text-primary)"},{"n":"color/text/primary/card/title","web":"var(--color-text-primary-card-title)"},{"n":"color/text/recent/amount","web":"var(--color-text-recent-amount)"},{"n":"color/text/referral/accent","web":"var(--color-text-referral-accent)"},{"n":"color/text/secondary","web":"var(--color-text-secondary)"},{"n":"color/text/secondary/card/title","web":"var(--color-text-secondary-card-title)"},{"n":"color/text/small","web":"var(--color-text-small)"},{"n":"color/text/soft","web":"var(--color-text-soft)"},{"n":"color/text/sports/muted","web":"var(--color-text-sports-muted)"},{"n":"color/text/sports/primary","web":"var(--color-text-sports-primary)"},{"n":"color/text/sticky/nav/active","web":"var(--color-text-sticky-nav-active)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "06", updated, missing, total: ITEMS.length };
