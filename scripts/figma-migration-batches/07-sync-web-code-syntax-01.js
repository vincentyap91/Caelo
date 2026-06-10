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

const ITEMS = [{"n":"mono/0","web":"var(--mono-0)"},{"n":"mono/105","web":"var(--mono-105)"},{"n":"mono/108","web":"var(--mono-108)"},{"n":"mono/112","web":"var(--mono-112)"},{"n":"mono/114","web":"var(--mono-114)"},{"n":"mono/115","web":"var(--mono-115)"},{"n":"mono/220","web":"var(--mono-220)"},{"n":"mono/255","web":"var(--mono-255)"},{"n":"mono/310","web":"var(--mono-310)"},{"n":"mono/330","web":"var(--mono-330)"},{"n":"mono/330-a0","web":"var(--mono-330-a0)"},{"n":"mono/400","web":"var(--mono-400)"},{"n":"mono/453","web":"var(--mono-453)"},{"n":"mono/465","web":"var(--mono-465)"},{"n":"mono/468","web":"var(--mono-468)"},{"n":"mono/471","web":"var(--mono-471)"},{"n":"mono/472","web":"var(--mono-472)"},{"n":"mono/475","web":"var(--mono-475)"},{"n":"mono/488","web":"var(--mono-488)"},{"n":"mono/490","web":"var(--mono-490)"},{"n":"mono/500","web":"var(--mono-500)"},{"n":"mono/510","web":"var(--mono-510)"},{"n":"mono/540","web":"var(--mono-540)"},{"n":"mono/542","web":"var(--mono-542)"},{"n":"mono/545","web":"var(--mono-545)"},{"n":"mono/550","web":"var(--mono-550)"},{"n":"mono/555","web":"var(--mono-555)"},{"n":"mono/560","web":"var(--mono-560)"},{"n":"mono/565","web":"var(--mono-565)"},{"n":"mono/580","web":"var(--mono-580)"},{"n":"mono/600","web":"var(--mono-600)"},{"n":"mono/604","web":"var(--mono-604)"},{"n":"mono/622","web":"var(--mono-622)"},{"n":"mono/628","web":"var(--mono-628)"},{"n":"mono/630","web":"var(--mono-630)"},{"n":"mono/632","web":"var(--mono-632)"},{"n":"mono/636","web":"var(--mono-636)"},{"n":"mono/640","web":"var(--mono-640)"},{"n":"mono/644","web":"var(--mono-644)"},{"n":"mono/646","web":"var(--mono-646)"},{"n":"mono/647","web":"var(--mono-647)"},{"n":"mono/648","web":"var(--mono-648)"},{"n":"mono/650","web":"var(--mono-650)"},{"n":"mono/660","web":"var(--mono-660)"},{"n":"mono/666","web":"var(--mono-666)"},{"n":"mono/700","web":"var(--mono-700)"},{"n":"mono/710","web":"var(--mono-710)"},{"n":"mono/720","web":"var(--mono-720)"},{"n":"mono/735","web":"var(--mono-735)"},{"n":"mono/750","web":"var(--mono-750)"},{"n":"mono/768","web":"var(--mono-768)"},{"n":"mono/770","web":"var(--mono-770)"},{"n":"mono/775","web":"var(--mono-775)"},{"n":"mono/795","web":"var(--mono-795)"},{"n":"mono/798","web":"var(--mono-798)"},{"n":"mono/800","web":"var(--mono-800)"},{"n":"mono/808","web":"var(--mono-808)"},{"n":"mono/818","web":"var(--mono-818)"},{"n":"mono/825","web":"var(--mono-825)"},{"n":"mono/855","web":"var(--mono-855)"},{"n":"mono/860","web":"var(--mono-860)"},{"n":"mono/867","web":"var(--mono-867)"},{"n":"mono/868","web":"var(--mono-868)"},{"n":"mono/870","web":"var(--mono-870)"},{"n":"mono/896","web":"var(--mono-896)"},{"n":"mono/900","web":"var(--mono-900)"},{"n":"mono/905","web":"var(--mono-905)"},{"n":"mono/0909","web":"var(--mono-0909)"},{"n":"mono/910","web":"var(--mono-910)"},{"n":"mono/915","web":"var(--mono-915)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "01", updated, missing, total: ITEMS.length };
