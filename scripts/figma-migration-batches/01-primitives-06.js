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

const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
if (!primCol) throw new Error("Run 00-setup-collections first");
const modeId = primCol.modes[0].modeId;
const ITEMS = [{"n":"raw/payout/highlight","c":{"r":0.07058823529411765,"g":0.23137254901960785,"b":0.5803921568627451,"a":1},"web":"var(--raw-payout-highlight)"},{"n":"raw/payout/amount","c":{"r":0.8666666666666667,"g":0.3764705882352941,"b":0.26666666666666666,"a":1},"web":"var(--raw-payout-amount)"},{"n":"raw/cta/start","c":{"r":1,"g":0.8117647058823529,"b":0.2901960784313726,"a":1},"web":"var(--raw-cta-start)"},{"n":"raw/cta/end","c":{"r":1,"g":0.6980392156862745,"b":0.17647058823529413,"a":1},"web":"var(--raw-cta-end)"},{"n":"raw/cta/auth/start","c":{"r":1,"g":0.6980392156862745,"b":0.3333333333333333,"a":1},"web":"var(--raw-cta-auth-start)"},{"n":"raw/cta/auth/end","c":{"r":1,"g":0.5568627450980392,"b":0.1411764705882353,"a":1},"web":"var(--raw-cta-auth-end)"},{"n":"raw/cta/border","c":{"r":0.9411764705882353,"g":0.7333333333333333,"b":0.23921568627450981,"a":1},"web":"var(--raw-cta-border)"},{"n":"raw/cta/focus","c":{"r":1,"g":0.8196078431372549,"b":0.4,"a":1},"web":"var(--raw-cta-focus)"},{"n":"raw/cta/text","c":{"r":0.047058823529411764,"g":0.2901960784313726,"b":0.5568627450980392,"a":1},"web":"var(--raw-cta-text)"},{"n":"raw/nav/border","c":{"r":1,"g":1,"b":1,"a":0.15},"web":"var(--raw-nav-border)"},{"n":"raw/nav/border/soft","c":{"r":1,"g":1,"b":1,"a":0.1},"web":"var(--raw-nav-border-soft)"},{"n":"raw/nav/tile/border","c":{"r":1,"g":1,"b":1,"a":0.05},"web":"var(--raw-nav-tile-border)"},{"n":"raw/nav/tile/border/hover","c":{"r":1,"g":1,"b":1,"a":0.35},"web":"var(--raw-nav-tile-border-hover)"},{"n":"raw/nav/text/soft","c":{"r":1,"g":1,"b":1,"a":0.9},"web":"var(--raw-nav-text-soft)"},{"n":"raw/nav/text/accent","c":{"r":0.49019607843137253,"g":0.8274509803921568,"b":0.9882352941176471,"a":1},"web":"var(--raw-nav-text-accent)"},{"n":"raw/nav/accent/soft","c":{"r":1,"g":0.8862745098039215,"b":0.49019607843137253,"a":1},"web":"var(--raw-nav-accent-soft)"},{"n":"raw/nav/icon","c":{"r":0.12156862745098039,"g":0.5137254901960784,"b":1,"a":1},"web":"var(--raw-nav-icon)"},{"n":"raw/nav/icon/hover","c":{"r":0.3607843137254902,"g":0.7686274509803922,"b":1,"a":1},"web":"var(--raw-nav-icon-hover)"},{"n":"raw/nav/badge","c":{"r":0.17254901960784313,"g":0.4,"b":0.7647058823529411,"a":1},"web":"var(--raw-nav-badge)"},{"n":"raw/nav/overlay","c":{"r":0.00784313725490196,"g":0.043137254901960784,"b":0.12156862745098039,"a":0.75},"web":"var(--raw-nav-overlay)"},{"n":"raw/scrim/game/launch/start","c":{"r":0.00784313725490196,"g":0.023529411764705882,"b":0.09019607843137255,"a":0.9},"web":"var(--raw-scrim-game-launch-start)"},{"n":"raw/scrim/game/launch/mid","c":{"r":0.058823529411764705,"g":0.09019607843137255,"b":0.16470588235294117,"a":0.85},"web":"var(--raw-scrim-game-launch-mid)"},{"n":"raw/scrim/game/launch/end","c":{"r":0.058823529411764705,"g":0.09019607843137255,"b":0.16470588235294117,"a":0.7},"web":"var(--raw-scrim-game-launch-end)"},{"n":"raw/scrim/game/launch/end/soft","c":{"r":0.058823529411764705,"g":0.09019607843137255,"b":0.16470588235294117,"a":0.4},"web":"var(--raw-scrim-game-launch-end-soft)"},{"n":"raw/universal/modal/header/bg","c":{"r":0.9098039215686274,"g":0.9333333333333333,"b":0.9647058823529412,"a":1},"web":"var(--raw-universal-modal-header-bg)"}];
let created = 0, updated = 0;
for (const item of ITEMS) {
  let v = await findVar(primCol.id, item.n);
  if (!v) { v = figma.variables.createVariable(item.n, primCol, "COLOR"); created++; }
  else updated++;
  v.scopes = SC_FILL;
  v.setVariableCodeSyntax("WEB", item.web);
  v.setValueForMode(modeId, item.c);
}
return { step: "primitives", batch: "06", created, updated, total: ITEMS.length };
