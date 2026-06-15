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
const NAMES = ["color/button/cta/end","color/button/cta/start","color/text/accent","color/text/accent/deep","color/text/accent/light","color/text/card/text","color/text/check/in/day/active","color/text/check/in/day/muted","color/text/check/in/day/past","color/text/check/in/reward","color/text/cta/inverse","color/text/cta/transparent","color/text/dim","color/text/disabled","color/text/download","color/text/faded","color/text/fifth","color/text/fifth/title","color/text/footer","color/text/four/title","color/text/fourth","color/text/game/title","color/text/highlight","color/text/hover","color/text/label","color/text/light","color/text/link","color/text/link/danger","color/text/link/inverse","color/text/mid","color/text/mid/alt","color/text/mid/neutral","color/text/muted","color/text/placeholder","color/text/primary","color/text/primary/card/title","color/text/recent/amount","color/text/referral/accent","color/text/secondary","color/text/secondary/card/title","color/text/small","color/text/soft","color/text/sports/muted","color/text/sports/primary","color/text/sticky/nav/active","color/text/sticky/nav/text","color/text/sub/highlight","color/text/sub/title","color/text/subtle","color/text/subtle/dark","color/text/tertiary","color/text/third/title","color/text/title","color/text/warm","color/surface","color/surface/accent","color/surface/accent/hover","color/surface/base","color/surface/base/dark","color/surface/border","color/surface/card/container","color/surface/card/dark","color/surface/card/light","color/surface/cat/navigation","color/surface/chatbox","color/surface/check/in/cell","color/surface/check/in/cell/active","color/surface/check/in/cell/alt","color/surface/check/in/cell/hover","color/surface/check/in/cta","color/surface/check/in/day/bg","color/surface/check/in/day/current","color/surface/check/in/footer","color/surface/check/in/icon","color/surface/check/in/inverse","color/surface/check/in/text","color/surface/chip","color/surface/chip/hover","color/surface/chip/info","color/surface/chip/muted"];
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
return { batch: "sem-01", created, skipped, total: NAMES.length };