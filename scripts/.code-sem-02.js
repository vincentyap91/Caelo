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
const NAMES = ["color/surface/code","color/surface/coloful/deep","color/surface/colorful","color/surface/cool/light","color/surface/darkest","color/surface/deep","color/surface/deep/dark","color/surface/filter","color/surface/filter/active","color/surface/filter/dark","color/surface/filter/deep","color/surface/float","color/surface/forest/1","color/surface/forest/2","color/surface/forest/3","color/surface/forest/4","color/surface/forest/5","color/surface/forest/accent","color/surface/forest/card","color/surface/forest/card/alt","color/surface/forest/darkest","color/surface/forest/deep","color/surface/game/stage","color/surface/high","color/surface/highlight","color/surface/info","color/surface/info/deep","color/surface/info/warning","color/surface/input","color/surface/input/color","color/surface/input/inverse","color/surface/input/light","color/surface/input/light/border","color/surface/input/muted","color/surface/input/muted/border","color/surface/inset","color/surface/light","color/surface/light/active","color/surface/low","color/surface/menu/active","color/surface/mid","color/surface/mid/dark","color/surface/mid/color","color/surface/mid/container","color/surface/mid/text","color/surface/nav","color/surface/navy","color/surface/near/black","color/surface/near/black/alt","color/surface/neutral/light","color/surface/notify","color/surface/overlay/dark","color/surface/pale/blue","color/surface/panel","color/surface/panel/border","color/surface/primary/shape","color/surface/qrcode","color/surface/referral/card","color/surface/referral/input","color/surface/rtp/card","color/surface/rtp/secondary/card","color/surface/rtp/secondary/card/text","color/surface/scrim/dark","color/surface/search","color/surface/secondary/chip","color/surface/secondary/shape","color/surface/secondary/table/head","color/surface/sheet","color/surface/sidebar","color/surface/slate","color/surface/start","color/surface/striped/even","color/surface/striped/odd","color/surface/subtle","color/surface/table","color/surface/table/head","color/surface/teal/dark","color/primary","color/border","color/border/brand"];
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
return { batch: "sem-02", created, skipped, total: NAMES.length };