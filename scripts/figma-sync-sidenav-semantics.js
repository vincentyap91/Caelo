/* use_figma — Create 02 Semantic sidenav tokens (VARIABLE-RULES.en.md §6 / §13.11) */

const SC_FILL = ["FRAME_FILL", "SHAPE_FILL"];
const SC_TEXT = ["TEXT_FILL"];
const SC_STROKE = ["STROKE_COLOR"];

const semCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "02 Semantic",
);
const primCol = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === "01 Primitives",
);
if (!semCol || !primCol) throw new Error("Missing 01 Primitives or 02 Semantic");

const defaultModeId = semCol.modes[0].modeId;
const primModeId = primCol.modes[0].modeId;

async function findVar(collectionId, name) {
  const vars = await figma.variables.getLocalVariablesAsync("COLOR");
  return vars.find((v) => v.variableCollectionId === collectionId && v.name === name) ?? null;
}

async function resolveTarget(item) {
  const col = item.col === "02 Semantic" ? semCol : primCol;
  return findVar(col.id, item.a);
}

function hexToRgb(hex) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
    a: 1,
  };
}

/** Ensure Caelo primitive values used by sidenav aliases (src/theme.css bottom). */
const PRIMITIVE_UPDATES = [
  ["accent/pale-100", "#fffd90"],
  ["raw/surface/panel", "#f0f9ff"],
  ["raw/cta/border", "#f0bb3d"],
];

let primUpdated = 0;
for (const [name, hex] of PRIMITIVE_UPDATES) {
  let v = await findVar(primCol.id, name);
  if (!v) {
    v = figma.variables.createVariable(name, primCol, "COLOR");
    v.scopes = SC_FILL;
    v.setVariableCodeSyntax("WEB", `var(--${name.replace(/\//g, "-")})`);
  }
  v.setValueForMode(primModeId, hexToRgb(hex));
  primUpdated += 1;
}

const ITEMS = [
  {
    n: "color/surface/sidenav/tier-badge",
    a: "accent/pale-100",
    col: "01 Primitives",
    sc: SC_FILL,
    web: "var(--color-surface-sidenav-tier-badge)",
  },
  {
    n: "color/border/sidenav/tier-badge",
    a: "raw/cta/border",
    col: "01 Primitives",
    sc: SC_STROKE,
    web: "var(--color-border-sidenav-tier-badge)",
  },
  {
    n: "color/surface/sidenav/icon",
    a: "raw/surface/panel",
    col: "01 Primitives",
    sc: SC_FILL,
    web: "var(--color-surface-sidenav-icon)",
  },
  {
    n: "color/border/sidenav/item-hover",
    a: "color/accent/glow",
    col: "02 Semantic",
    sc: SC_STROKE,
    web: "var(--color-border-sidenav-item-hover)",
  },
  {
    n: "color/surface/sidenav/subitem-hover",
    a: "color/accent/pale",
    col: "02 Semantic",
    sc: SC_FILL,
    web: "var(--color-surface-sidenav-subitem-hover)",
  },
  {
    n: "color/button/sidenav/live-chat",
    a: "brand/500",
    col: "01 Primitives",
    sc: SC_FILL,
    web: "var(--color-button-sidenav-live-chat)",
  },
  {
    n: "color/button/sidenav/live-chat/text",
    a: "mono/0",
    col: "01 Primitives",
    sc: SC_TEXT,
    web: "var(--color-button-sidenav-live-chat-text)",
  },
  {
    n: "color/button/sidenav/secondary",
    a: "mono/0",
    col: "01 Primitives",
    sc: SC_FILL,
    web: "var(--color-button-sidenav-secondary)",
  },
  {
    n: "color/button/sidenav/secondary/text",
    a: "color/text/primary/card/title",
    col: "02 Semantic",
    sc: SC_TEXT,
    web: "var(--color-button-sidenav-secondary-text)",
  },
  {
    n: "color/border/sidenav/secondary",
    a: "color/border/subtle",
    col: "02 Semantic",
    sc: SC_STROKE,
    web: "var(--color-border-sidenav-secondary)",
  },
];

let created = 0;
let updated = 0;
const errors = [];

for (const item of ITEMS) {
  const target = await resolveTarget(item);
  if (!target) {
    errors.push(`${item.n} -> missing ${item.a}`);
    continue;
  }
  let v = await findVar(semCol.id, item.n);
  if (!v) {
    v = figma.variables.createVariable(item.n, semCol, "COLOR");
    created += 1;
  } else {
    updated += 1;
  }
  v.scopes = item.sc;
  v.setVariableCodeSyntax("WEB", item.web);
  const alias = { type: "VARIABLE_ALIAS", id: target.id };
  v.setValueForMode(defaultModeId, alias);
}

return {
  step: "sidenav-semantic-sync",
  primUpdated,
  created,
  updated,
  errors,
  tokens: ITEMS.map((i) => i.n),
};
