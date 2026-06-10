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

const ITEMS = [{"n":"mono/920","web":"var(--mono-920)"},{"n":"mono/930","web":"var(--mono-930)"},{"n":"mono/940","web":"var(--mono-940)"},{"n":"mono/950","web":"var(--mono-950)"},{"n":"mono/950-a25","web":"var(--mono-950-a25)"},{"n":"mono/990","web":"var(--mono-990)"},{"n":"brand/400","web":"var(--brand-400)"},{"n":"brand/500","web":"var(--brand-500)"},{"n":"brand/500-soft","web":"var(--brand-500-soft)"},{"n":"brand/630","web":"var(--brand-630)"},{"n":"brand/700","web":"var(--brand-700)"},{"n":"accent/200","web":"var(--accent-200)"},{"n":"accent/280","web":"var(--accent-280)"},{"n":"accent/310","web":"var(--accent-310)"},{"n":"accent/330","web":"var(--accent-330)"},{"n":"accent/340","web":"var(--accent-340)"},{"n":"accent/360","web":"var(--accent-360)"},{"n":"accent/400","web":"var(--accent-400)"},{"n":"accent/420","web":"var(--accent-420)"},{"n":"accent/450","web":"var(--accent-450)"},{"n":"accent/460","web":"var(--accent-460)"},{"n":"accent/470","web":"var(--accent-470)"},{"n":"accent/475","web":"var(--accent-475)"},{"n":"accent/476","web":"var(--accent-476)"},{"n":"accent/brown-700","web":"var(--accent-brown-700)"},{"n":"accent/brown-800","web":"var(--accent-brown-800)"},{"n":"accent/khaki-900","web":"var(--accent-khaki-900)"},{"n":"accent/orange-500","web":"var(--accent-orange-500)"},{"n":"accent/orange-700","web":"var(--accent-orange-700)"},{"n":"accent/pale-100","web":"var(--accent-pale-100)"},{"n":"support/danger","web":"var(--support-danger)"},{"n":"support/danger-maroon","web":"var(--support-danger-maroon)"},{"n":"support/danger-red","web":"var(--support-danger-red)"},{"n":"support/danger-vivid","web":"var(--support-danger-vivid)"},{"n":"support/error","web":"var(--support-error)"},{"n":"support/error-bright","web":"var(--support-error-bright)"},{"n":"support/error-coral","web":"var(--support-error-coral)"},{"n":"support/error-crimson","web":"var(--support-error-crimson)"},{"n":"support/error-medium","web":"var(--support-error-medium)"},{"n":"support/error-strong","web":"var(--support-error-strong)"},{"n":"support/error-vivid","web":"var(--support-error-vivid)"},{"n":"support/error-warm","web":"var(--support-error-warm)"},{"n":"support/info","web":"var(--support-info)"},{"n":"support/info-strong","web":"var(--support-info-strong)"},{"n":"support/lime-bright","web":"var(--support-lime-bright)"},{"n":"support/lime-deep","web":"var(--support-lime-deep)"},{"n":"support/lime-medium","web":"var(--support-lime-medium)"},{"n":"support/lime-vivid","web":"var(--support-lime-vivid)"},{"n":"support/link","web":"var(--support-link)"},{"n":"support/link-danger","web":"var(--support-link-danger)"},{"n":"support/navy","web":"var(--support-navy)"},{"n":"support/navy-deep","web":"var(--support-navy-deep)"},{"n":"support/navy-mid","web":"var(--support-navy-mid)"},{"n":"support/negative","web":"var(--support-negative)"},{"n":"support/steel-light","web":"var(--support-steel-light)"},{"n":"support/success","web":"var(--support-success)"},{"n":"support/success-bright","web":"var(--support-success-bright)"},{"n":"support/success-light","web":"var(--support-success-light)"},{"n":"support/success-mid","web":"var(--support-success-mid)"},{"n":"support/success-strong","web":"var(--support-success-strong)"},{"n":"support/success-vivid","web":"var(--support-success-vivid)"},{"n":"support/teal-dark","web":"var(--support-teal-dark)"},{"n":"support/warning","web":"var(--support-warning)"},{"n":"support/warning-surface","web":"var(--support-warning-surface)"},{"n":"overlay/default","web":"var(--overlay-default)"},{"n":"overlay/shadow-soft","web":"var(--overlay-shadow-soft)"},{"n":"overlay/sports-card","web":"var(--overlay-sports-card)"},{"n":"overlay/sports-event","web":"var(--overlay-sports-event)"},{"n":"overlay/strong","web":"var(--overlay-strong)"},{"n":"raw/scrim/shine/start","web":"var(--raw-scrim-shine-start)"}];
let updated = 0, missing = [];
const all = await figma.variables.getLocalVariablesAsync("COLOR");
for (const item of ITEMS) {
  const v = all.find((x) => x.name === item.n);
  if (!v) { missing.push(item.n); continue; }
  v.setVariableCodeSyntax("WEB", item.web);
  updated++;
}
return { step: "sync-web-code-syntax", batch: "02", updated, missing, total: ITEMS.length };
