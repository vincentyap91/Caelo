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

const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "01 Primitives");
const modeIds = [col.modes[0].modeId];
const ITEMS = [{"n":"mono/0","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-0)"},{"n":"mono/105","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-105)"},{"n":"mono/108","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-108)"},{"n":"mono/112","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-112)"},{"n":"mono/114","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-114)"},{"n":"mono/115","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-115)"},{"n":"mono/220","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-220)"},{"n":"mono/255","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-255)"},{"n":"mono/310","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-310)"},{"n":"mono/330","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-330)"},{"n":"mono/330-a0","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-330-a0)"},{"n":"mono/400","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-400)"},{"n":"mono/453","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-453)"},{"n":"mono/465","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-465)"},{"n":"mono/468","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-468)"},{"n":"mono/471","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-471)"},{"n":"mono/472","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-472)"},{"n":"mono/475","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-475)"},{"n":"mono/488","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-488)"},{"n":"mono/490","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-490)"},{"n":"mono/500","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-500)"},{"n":"mono/510","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-510)"},{"n":"mono/540","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-540)"},{"n":"mono/542","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-542)"},{"n":"mono/545","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-545)"},{"n":"mono/550","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-550)"},{"n":"mono/555","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-555)"},{"n":"mono/560","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-560)"},{"n":"mono/565","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-565)"},{"n":"mono/580","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-580)"},{"n":"mono/600","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-600)"},{"n":"mono/604","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-604)"},{"n":"mono/622","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-622)"},{"n":"mono/628","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-628)"},{"n":"mono/630","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-630)"},{"n":"mono/632","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-632)"},{"n":"mono/636","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-636)"},{"n":"mono/640","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-640)"},{"n":"mono/644","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-644)"},{"n":"mono/646","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-646)"},{"n":"mono/647","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-647)"},{"n":"mono/648","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-648)"},{"n":"mono/650","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-650)"},{"n":"mono/660","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-660)"},{"n":"mono/666","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-666)"},{"n":"mono/700","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-700)"},{"n":"mono/710","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-710)"},{"n":"mono/720","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-720)"},{"n":"mono/735","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-735)"},{"n":"mono/750","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-750)"},{"n":"mono/768","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-768)"},{"n":"mono/770","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-770)"},{"n":"mono/775","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-775)"},{"n":"mono/795","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-795)"},{"n":"mono/798","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-798)"},{"n":"mono/800","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-800)"},{"n":"mono/808","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-808)"},{"n":"mono/818","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-818)"},{"n":"mono/825","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-825)"},{"n":"mono/855","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-855)"},{"n":"mono/860","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-860)"},{"n":"mono/867","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-867)"},{"n":"mono/868","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-868)"},{"n":"mono/870","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-870)"},{"n":"mono/896","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-896)"},{"n":"mono/900","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-900)"},{"n":"mono/905","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-905)"},{"n":"mono/0909","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-0909)"},{"n":"mono/910","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-910)"},{"n":"mono/915","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-915)"},{"n":"mono/920","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-920)"},{"n":"mono/930","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-930)"},{"n":"mono/940","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-940)"},{"n":"mono/950","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-950)"},{"n":"mono/950-a25","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-950-a25)"},{"n":"mono/990","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--mono-990)"},{"n":"brand/400","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--brand-400)"},{"n":"brand/500","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--brand-500)"},{"n":"brand/500-soft","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--brand-500-soft)"},{"n":"brand/630","sc":["FRAME_FILL","SHAPE_FILL"],"web":"var(--brand-630)"}];
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
return { step: "01-primitives", batch: "01", created, skipped, total: ITEMS.length };
