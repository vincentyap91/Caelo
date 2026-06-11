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

const ITEMS = [{"n":"color/gradient/nav/daily/bonus/start","web":"var(--color-gradient-nav-daily-bonus-start)"},{"n":"color/gradient/nav/daily/bonus/end","web":"var(--color-gradient-nav-daily-bonus-end)"},{"n":"color/gradient/nav/highlight/start","web":"var(--color-gradient-nav-highlight-start)"},{"n":"color/gradient/nav/highlight/end","web":"var(--color-gradient-nav-highlight-end)"},{"n":"color/gradient/nav/info/start","web":"var(--color-gradient-nav-info-start)"},{"n":"color/gradient/nav/info/end","web":"var(--color-gradient-nav-info-end)"},{"n":"color/gradient/slot/panel/start","web":"var(--color-gradient-slot-panel-start)"},{"n":"color/gradient/slot/panel/end","web":"var(--color-gradient-slot-panel-end)"},{"n":"color/gradient/sports/button/start","web":"var(--color-gradient-sports-button-start)"},{"n":"color/gradient/sports/button/end","web":"var(--color-gradient-sports-button-end)"},{"n":"color/gradient/sports/card/start","web":"var(--color-gradient-sports-card-start)"},{"n":"color/gradient/sports/card/end","web":"var(--color-gradient-sports-card-end)"},{"n":"color/gradient/table/start","web":"var(--color-gradient-table-start)"},{"n":"color/gradient/table/end","web":"var(--color-gradient-table-end)"},{"n":"color/gradient/tag/start","web":"var(--color-gradient-tag-start)"},{"n":"color/gradient/tag/end","web":"var(--color-gradient-tag-end)"},{"n":"color/table/highlight/start","web":"var(--color-table-highlight-start)"},{"n":"color/table/highlight/end","web":"var(--color-table-highlight-end)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "11", updated, missing, total: ITEMS.length };
