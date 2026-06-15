const PLACEHOLDER = { r: 0.8, g: 0.8, b: 0.8, a: 1 };
async function getCol(name, modes) {
  let col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === name);
  if (!col) col = figma.variables.createVariableCollection(name);
  for (let i = 0; i < modes.length; i++) {
    if (col.modes[i]) col.renameMode(col.modes[i].modeId, modes[i]);
    else if (i > 0) col.addMode(modes[i]);
  }
  return col;
}
async function findVar(colId, name) {
  return (await figma.variables.getLocalVariablesAsync("COLOR")).find((v) => v.variableCollectionId === colId && v.name === name) ?? null;
}
function scopes(n){if(n.startsWith("color/text/"))return["TEXT_FILL"];if(n.startsWith("color/border/"))return["STROKE_COLOR"];return["FRAME_FILL","SHAPE_FILL"];}function web(n){return "var(--color-"+n.slice(6).replace(/\//g,"-")+")";}
await getCol("01 Primitives", ["Value"]);
await getCol("02 Semantic", ["Default", "CAM88"]);
const col = (await figma.variables.getLocalVariableCollectionsAsync()).find((c) => c.name === "02 Semantic");
const modeIds = col.modes.map((m) => m.modeId);
const NAMES = ["color/border/danger","color/border/divider","color/border/line","color/border/sports/card","color/border/sports/market","color/border/strong","color/border/subtle","color/border/tabs","color/accent","color/accent/check/in/reward","color/accent/chip","color/accent/glow","color/accent/gold","color/accent/gold/light","color/accent/gold/mid","color/accent/gold/muted","color/accent/khaki","color/accent/pale","color/accent/yellow","color/button/accent","color/button/accent/deep","color/button/accordian/head","color/button/back","color/button/cta","color/button/cta/arrow","color/button/cta/arrow/selected","color/button/cta/category","color/button/cta/category/text","color/button/cta/fifth","color/button/cta/fifth/text","color/button/cta/fourth","color/button/cta/fourth/text","color/button/cta/pagination","color/button/cta/pagination/selected","color/button/cta/primary","color/button/cta/secondary","color/button/cta/secondary/text","color/button/cta/tertiary","color/button/cta/tertiary/text","color/button/dashboard/primary/end","color/button/dashboard/primary/start","color/button/disabled","color/button/dot","color/button/hover","color/button/hover/text","color/button/lang/border","color/button/lang/icon","color/button/lang/text","color/button/menu/active","color/button/muted","color/button/muted/text","color/button/nav","color/button/pagination","color/button/pagination/arrow","color/button/pagination/disabled","color/button/referral/cta","color/button/referral/cta/text","color/button/nav/text","color/button/sports","color/button/tabs","color/button/tabs/muted","color/button/tabs/muted/text","color/button/tabs/text","color/popup/body","color/popup/head","color/progress/bar/bg","color/progress/bar/fill","color/success","color/success/light","color/success/lime/bright","color/success/lime/deep","color/success/lime/medium","color/success/mid","color/success/positive","color/success/strong","color/success/vivid","color/success/vivid/green","color/danger","color/danger/accent","color/danger/deep"];
let created = 0, skipped = 0;
for (const n of NAMES) {
  let v = await findVar(col.id, n);
  if (v) { skipped++; continue; }
  v = figma.variables.createVariable(n, col, "COLOR");
  v.scopes = scopes(n);
  v.setVariableCodeSyntax("WEB", web(n));
  for (const m of modeIds) v.setValueForMode(m, PLACEHOLDER);
  created++;
}
return { batch: "sem-03", created, skipped, total: NAMES.length };