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
const NAMES = ["color/danger/maroon","color/danger/negative","color/danger/red","color/danger/vivid","color/error/alert","color/error/bright","color/error/coral","color/error/crimson","color/error/icon","color/error/medium","color/error/strong","color/error/warm","color/warning","color/overlay","color/overlay/sports/card","color/overlay/sports/event","color/overlay/strong","color/muted","color/info/icon","color/info/steel/light","color/effect/glow","color/effect/header/shadow","color/effect/shadow/soft","color/icon/action","color/icon/check/in/active","color/icon/check/in/muted","color/icon/check/in/star/deep","color/icon/muted","color/icon/rank/alert/base","color/icon/rank/alert/highlight","color/icon/rank/first","color/icon/rank/second","color/icon/rank/third","color/icon/subtle","color/icon/um","color/transparent","color/bar","color/primary/tag","color/primary/tag/text","color/scrollbar","color/secondary","color/secondary/tag","color/secondary/tag/text","color/sticky/nav","color/thumbnail","color/gradient/home/card","color/gradient/referral/deposit","color/gradient/referral/icon"];
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
return { batch: "sem-04", created, skipped, total: NAMES.length };