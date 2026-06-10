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

const ITEMS = [{"n":"color/text/sub/highlight","web":"var(--color-text-sub-highlight)"},{"n":"color/text/sub/title","web":"var(--color-text-sub-title)"},{"n":"color/text/subtle","web":"var(--color-text-subtle)"},{"n":"color/text/subtle/dark","web":"var(--color-text-subtle-dark)"},{"n":"color/text/tertiary","web":"var(--color-text-tertiary)"},{"n":"color/text/third/title","web":"var(--color-text-third-title)"},{"n":"color/text/title","web":"var(--color-text-title)"},{"n":"color/text/warm","web":"var(--color-text-warm)"},{"n":"color/surface","web":"var(--color-surface)"},{"n":"color/surface/accent","web":"var(--color-surface-accent)"},{"n":"color/surface/accent/hover","web":"var(--color-surface-accent-hover)"},{"n":"color/surface/base","web":"var(--color-surface-base)"},{"n":"color/surface/base/dark","web":"var(--color-surface-base-dark)"},{"n":"color/surface/border","web":"var(--color-surface-border)"},{"n":"color/surface/card/container","web":"var(--color-surface-card-container)"},{"n":"color/surface/card/dark","web":"var(--color-surface-card-dark)"},{"n":"color/surface/card/light","web":"var(--color-surface-card-light)"},{"n":"color/surface/cat/navigation","web":"var(--color-surface-cat-navigation)"},{"n":"color/surface/chatbox","web":"var(--color-surface-chatbox)"},{"n":"color/surface/check/in/cell","web":"var(--color-surface-check-in-cell)"},{"n":"color/surface/check/in/cell/active","web":"var(--color-surface-check-in-cell-active)"},{"n":"color/surface/check/in/cell/alt","web":"var(--color-surface-check-in-cell-alt)"},{"n":"color/surface/check/in/cell/hover","web":"var(--color-surface-check-in-cell-hover)"},{"n":"color/surface/check/in/cta","web":"var(--color-surface-check-in-cta)"},{"n":"color/surface/check/in/day/bg","web":"var(--color-surface-check-in-day-bg)"},{"n":"color/surface/check/in/day/current","web":"var(--color-surface-check-in-day-current)"},{"n":"color/surface/check/in/footer","web":"var(--color-surface-check-in-footer)"},{"n":"color/surface/check/in/icon","web":"var(--color-surface-check-in-icon)"},{"n":"color/surface/check/in/inverse","web":"var(--color-surface-check-in-inverse)"},{"n":"color/surface/check/in/text","web":"var(--color-surface-check-in-text)"},{"n":"color/surface/chip","web":"var(--color-surface-chip)"},{"n":"color/surface/chip/hover","web":"var(--color-surface-chip-hover)"},{"n":"color/surface/chip/info","web":"var(--color-surface-chip-info)"},{"n":"color/surface/chip/muted","web":"var(--color-surface-chip-muted)"},{"n":"color/surface/code","web":"var(--color-surface-code)"},{"n":"color/surface/coloful/deep","web":"var(--color-surface-coloful-deep)"},{"n":"color/surface/colorful","web":"var(--color-surface-colorful)"},{"n":"color/surface/cool/light","web":"var(--color-surface-cool-light)"},{"n":"color/surface/darkest","web":"var(--color-surface-darkest)"},{"n":"color/surface/deep","web":"var(--color-surface-deep)"},{"n":"color/surface/deep/dark","web":"var(--color-surface-deep-dark)"},{"n":"color/surface/filter","web":"var(--color-surface-filter)"},{"n":"color/surface/filter/active","web":"var(--color-surface-filter-active)"},{"n":"color/surface/filter/dark","web":"var(--color-surface-filter-dark)"},{"n":"color/surface/filter/deep","web":"var(--color-surface-filter-deep)"},{"n":"color/surface/float","web":"var(--color-surface-float)"},{"n":"color/surface/forest/1","web":"var(--color-surface-forest-1)"},{"n":"color/surface/forest/2","web":"var(--color-surface-forest-2)"},{"n":"color/surface/forest/3","web":"var(--color-surface-forest-3)"},{"n":"color/surface/forest/4","web":"var(--color-surface-forest-4)"},{"n":"color/surface/forest/5","web":"var(--color-surface-forest-5)"},{"n":"color/surface/forest/accent","web":"var(--color-surface-forest-accent)"},{"n":"color/surface/forest/card","web":"var(--color-surface-forest-card)"},{"n":"color/surface/forest/card/alt","web":"var(--color-surface-forest-card-alt)"},{"n":"color/surface/forest/darkest","web":"var(--color-surface-forest-darkest)"},{"n":"color/surface/forest/deep","web":"var(--color-surface-forest-deep)"},{"n":"color/surface/game/stage","web":"var(--color-surface-game-stage)"},{"n":"color/surface/high","web":"var(--color-surface-high)"},{"n":"color/surface/highlight","web":"var(--color-surface-highlight)"},{"n":"color/surface/info","web":"var(--color-surface-info)"},{"n":"color/surface/info/deep","web":"var(--color-surface-info-deep)"},{"n":"color/surface/info/warning","web":"var(--color-surface-info-warning)"},{"n":"color/surface/input","web":"var(--color-surface-input)"},{"n":"color/surface/input/color","web":"var(--color-surface-input-color)"},{"n":"color/surface/input/inverse","web":"var(--color-surface-input-inverse)"},{"n":"color/surface/input/light","web":"var(--color-surface-input-light)"},{"n":"color/surface/input/light/border","web":"var(--color-surface-input-light-border)"},{"n":"color/surface/input/muted","web":"var(--color-surface-input-muted)"},{"n":"color/surface/input/muted/border","web":"var(--color-surface-input-muted-border)"},{"n":"color/surface/inset","web":"var(--color-surface-inset)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "07", updated, missing, total: ITEMS.length };
