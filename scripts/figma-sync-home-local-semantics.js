/* use_figma - sync Home-page Caelo semantic variables from local src/theme.css */

(async () => {

const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];

async function getOrCreateCollection(name, modeNames) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  let col = all.find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modeNames.length; i += 1) {
    if (col.modes[i]) {
      col.renameMode(col.modes[i].modeId, modeNames[i]);
    } else if (i > 0) {
      col.addMode(modeNames[i]);
    }
  }
  return col;
}

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}

function webSyntax(name) {
  return `var(--${name.replace(/\//g, "-")})`;
}

function semanticSyntax(name) {
  return `var(--color-${name.replace(/^color\//, "").replace(/\//g, "-")})`;
}

const primCol = await getOrCreateCollection("01 Primitives", ["Value"]);
const semCol = await getOrCreateCollection("02 Semantic", ["Default", "CAM88"]);
const primModeId = primCol.modes[0].modeId;
const defaultModeId = semCol.modes.find((m) => m.name === "Default").modeId;
const cam88ModeId = semCol.modes.find((m) => m.name === "CAM88").modeId;

const primitives = [
  ["mono/0", { r: 1, g: 1, b: 1, a: 1 }],
  ["mono/255", { r: 0.8862745098, g: 0.9098039216, b: 0.9411764706, a: 1 }],
  ["mono/400", { r: 0.3921568627, g: 0.4549019608, b: 0.5450980392, a: 1 }],
  ["mono/510", { r: 0.2, g: 0.2549019608, b: 0.3333333333, a: 1 }],
  ["mono/950", { r: 0.0588235294, g: 0.0901960784, b: 0.1647058824, a: 1 }],
  ["brand/400", { r: 0.1019607843, g: 0.2941176471, b: 0.7215686275, a: 1 }],
  ["brand/500", { r: 0.0705882353, g: 0.231372549, b: 0.5803921569, a: 1 }],
  ["brand/500-soft", { r: 0.0705882353, g: 0.231372549, b: 0.5803921569, a: 0.2 }],
  ["brand/630", { r: 0.0509803922, g: 0.1647058824, b: 0.4156862745, a: 1 }],
  ["brand/700", { r: 0.0039215686, g: 0.1254901961, b: 0.4235294118, a: 1 }],
  ["accent/400", { r: 1, g: 0.8470588235, b: 0.3019607843, a: 1 }],
  ["accent/450", { r: 0.9568627451, g: 0.8117647059, b: 0.031372549, a: 1 }],
  ["support/success", { r: 0.2235294118, g: 0.7098039216, b: 0.2901960784, a: 1 }],
  ["overlay/strong", { r: 0, g: 0, b: 0, a: 0.8 }],
  ["raw/app/surface/base", { r: 1, g: 1, b: 1, a: 1 }],
  ["raw/app/text/primary", { r: 0.0588235294, g: 0.0901960784, b: 0.1647058824, a: 1 }],
  ["raw/app/text/secondary", { r: 0.2, g: 0.2549019608, b: 0.3333333333, a: 1 }],
  ["raw/app/border", { r: 0.8862745098, g: 0.9098039216, b: 0.9411764706, a: 1 }],
  ["raw/surface/muted", { r: 0.9725490196, g: 0.9803921569, b: 0.9882352941, a: 1 }],
  ["raw/surface/subtle", { r: 0.9725490196, g: 0.9843137255, b: 1, a: 1 }],
  ["raw/surface/muted-soft", { r: 0.9725490196, g: 0.9803921569, b: 0.9882352941, a: 0.8 }],
  ["raw/border/brand", { r: 0.8117647059, g: 0.8784313725, b: 0.9764705882, a: 1 }],
  ["raw/cta/start", { r: 1, g: 0.8117647059, b: 0.2901960784, a: 1 }],
  ["raw/cta/end", { r: 1, g: 0.6980392157, b: 0.1764705882, a: 1 }],
  ["raw/cta/text", { r: 0.0470588235, g: 0.2901960784, b: 0.5568627451, a: 1 }],
  ["raw/text/brand", { r: 0.0705882353, g: 0.231372549, b: 0.5803921569, a: 1 }],
  ["raw/gradient/accent/50", { r: 0.937254902, g: 0.9647058824, b: 1, a: 1 }],
  ["raw/gradient/accent/600", { r: 0.1450980392, g: 0.3882352941, b: 0.9215686275, a: 1 }],
];

let primitiveCreated = 0;
let primitiveUpdated = 0;
for (const [name, color] of primitives) {
  let v = await findVar(primCol.id, name);
  if (!v) {
    v = figma.variables.createVariable(name, primCol, "COLOR");
    primitiveCreated += 1;
  } else {
    primitiveUpdated += 1;
  }
  v.scopes = SC_FILL;
  v.setVariableCodeSyntax("WEB", webSyntax(name));
  v.setValueForMode(primModeId, color);
}

const semantics = [
  ["color/surface/base", "raw/app/surface/base", SC_FILL],
  ["color/text/primary", "raw/app/text/primary", SC_TEXT],
  ["color/text/secondary", "raw/app/text/secondary", SC_TEXT],
  ["color/border/subtle", "raw/app/border", SC_STROKE],
  ["color/button/nav", "raw/surface/muted-soft", SC_FILL],
  ["color/gradient/home/cta/start", "brand/630", SC_FILL],
  ["color/gradient/home/cta/end", "brand/500", SC_FILL],
  ["color/accent/pale", "raw/gradient/accent/50", SC_FILL],
  ["color/overlay/strong", "overlay/strong", SC_FILL],
  ["color/popup/body", "mono/0", SC_FILL],
  ["color/progress/bar/fill", "brand/500", SC_FILL],
  ["color/scrollbar", "brand/500", SC_FILL],
  ["color/effect/glow", "brand/500-soft", SC_FILL],
  ["color/sticky/nav", "brand/700", SC_FILL],
  ["color/primary", "brand/500", SC_FILL],
  ["color/button/hover", "raw/gradient/accent/600", SC_FILL],
  ["color/surface/cool/light", "raw/surface/muted", SC_FILL],
  ["color/surface/subtle", "raw/surface/subtle", SC_FILL],
  ["color/border/brand", "raw/border/brand", SC_STROKE],
  ["color/text/card/text", "mono/0", SC_TEXT],
  ["color/text/sticky/nav/text", "mono/0", SC_TEXT],
  ["color/surface/rtp/secondary/card", "accent/450", SC_FILL],
  ["color/surface/rtp/secondary/card/text", "mono/0", SC_FILL],
  ["color/button/disabled", "brand/630", SC_FILL],
  ["color/text/footer", "mono/0", SC_TEXT],
  ["color/success", "support/success", SC_FILL],
  ["color/accent", "accent/400", SC_FILL],
  ["color/border/danger", "brand/500", SC_STROKE],
  ["color/text/primary/card/title", "raw/text/brand", SC_TEXT],
  ["color/button/cta/start", "raw/cta/start", SC_FILL],
  ["color/button/cta/end", "raw/cta/end", SC_FILL],
  ["color/text/cta/inverse", "raw/cta/text", SC_TEXT],
];

let semanticCreated = 0;
let semanticUpdated = 0;
const errors = [];
for (const [name, targetName, scopes] of semantics) {
  const target = (await findVar(semCol.id, targetName)) ?? (await findVar(primCol.id, targetName));
  if (!target) {
    errors.push(`${name} -> missing ${targetName}`);
    continue;
  }
  let v = await findVar(semCol.id, name);
  if (!v) {
    v = figma.variables.createVariable(name, semCol, "COLOR");
    semanticCreated += 1;
  } else {
    semanticUpdated += 1;
  }
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", semanticSyntax(name));
  const alias = { type: "VARIABLE_ALIAS", id: target.id };
  v.setValueForMode(defaultModeId, alias);
  v.setValueForMode(cam88ModeId, alias);
}

const home = await figma.getNodeByIdAsync("33:2");
if (home?.type === "FRAME") home.setExplicitVariableModeForCollection(semCol.id, defaultModeId);

return {
  step: "home-local-semantic-sync",
  primitiveCreated,
  primitiveUpdated,
  semanticCreated,
  semanticUpdated,
  errors,
  homeModeApplied: home?.type === "FRAME",
};
})();
