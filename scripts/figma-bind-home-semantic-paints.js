/* use_figma - bind existing Home frame paints to Caelo 02 Semantic variables.
 *
 * Target file: J056FpXrIW4sDJtXNLsz0T / 12win
 * Target frame: Page 1 > Home, node 33:2
 */

(async () => {
  const HOME_NODE_ID = "33:2";
  const SUMMARY_NAME = "[Caelo Variable Bindings - Home]";

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const semCol = collections.find((collection) => collection.name === "02 Semantic");
  const primCol = collections.find((collection) => collection.name === "01 Primitives");
  if (!semCol || !primCol) {
    throw new Error("Missing 01 Primitives or 02 Semantic collection");
  }

  const defaultModeId = semCol.modes.find((mode) => mode.name === "Default")?.modeId;
  const primModeId = primCol.modes.find((mode) => mode.name === "Value")?.modeId ?? primCol.modes[0]?.modeId;
  if (!defaultModeId || !primModeId) {
    throw new Error("Missing expected Default or Value variable mode");
  }

  const home = await figma.getNodeByIdAsync(HOME_NODE_ID);
  if (!home || home.type !== "FRAME") {
    throw new Error(`Missing Home frame ${HOME_NODE_ID}`);
  }

  home.setExplicitVariableModeForCollection(semCol.id, defaultModeId);

  const allColorVars = await figma.variables.getLocalVariablesAsync("COLOR");
  const varsById = new Map(allColorVars.map((variable) => [variable.id, variable]));
  const semanticVars = allColorVars.filter((variable) => variable.variableCollectionId === semCol.id);

  function rgbaKey(color) {
    const a = color.a == null ? 1 : color.a;
    return [color.r, color.g, color.b, a].map((value) => Math.round(value * 255)).join(",");
  }

  function resolveVariable(variable, seen = new Set()) {
    if (!variable || seen.has(variable.id)) return null;
    seen.add(variable.id);

    const collection = collections.find((item) => item.id === variable.variableCollectionId);
    const modeId = collection?.id === semCol.id ? defaultModeId : primModeId;
    const value = variable.valuesByMode[modeId] ?? Object.values(variable.valuesByMode)[0];
    if (!value) return null;

    if (value.type === "VARIABLE_ALIAS") {
      return resolveVariable(varsById.get(value.id), seen);
    }

    if (
      typeof value.r === "number" &&
      typeof value.g === "number" &&
      typeof value.b === "number"
    ) {
      return value;
    }

    return null;
  }

  function priority(name) {
    if (name.startsWith("color/text/")) return 10;
    if (name.startsWith("color/border/")) return 20;
    if (name.startsWith("color/surface/")) return 30;
    if (name.startsWith("color/button/")) return 40;
    if (name === "color/primary") return 50;
    if (name.startsWith("color/accent/") || name === "color/accent") return 60;
    return 100;
  }

  const semanticByColor = new Map();
  for (const variable of semanticVars) {
    const resolved = resolveVariable(variable);
    if (!resolved) continue;
    const key = rgbaKey(resolved);
    const existing = semanticByColor.get(key);
    if (!existing || priority(variable.name) < priority(existing.name)) {
      semanticByColor.set(key, variable);
    }
  }

  const used = new Map();
  const counts = {
    nodesVisited: 0,
    fillBindings: 0,
    strokeBindings: 0,
    skippedImages: 0,
    skippedNoMatch: 0,
  };

  function remember(variable) {
    used.set(variable.name, (used.get(variable.name) ?? 0) + 1);
  }

  function bindPaints(node, prop, fieldName) {
    const paints = node[prop];
    if (!Array.isArray(paints) || paints.length === 0) return;

    let changed = false;
    const next = paints.map((paint) => {
      if (paint.type !== "SOLID") {
        if (paint.type === "IMAGE") counts.skippedImages += 1;
        return paint;
      }

      const variable = semanticByColor.get(rgbaKey({ ...paint.color, a: paint.opacity ?? 1 }));
      if (!variable) {
        counts.skippedNoMatch += 1;
        return paint;
      }

      changed = true;
      remember(variable);
      if (fieldName === "fills") counts.fillBindings += 1;
      if (fieldName === "strokes") counts.strokeBindings += 1;
      return figma.variables.setBoundVariableForPaint(paint, "color", variable);
    });

    if (changed) node[prop] = next;
  }

  function processNode(node) {
    counts.nodesVisited += 1;
    if ("fills" in node) bindPaints(node, "fills", "fills");
    if ("strokes" in node) bindPaints(node, "strokes", "strokes");
    if ("children" in node) {
      for (const child of node.children) processNode(child);
    }
  }

  processNode(home);

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

  let summary = home.parent.children.find(
    (node) => node.type === "FRAME" && node.name === SUMMARY_NAME,
  );

  if (!summary) {
    summary = figma.createFrame();
    summary.name = SUMMARY_NAME;
    summary.x = home.x;
    summary.y = home.y + home.height + 48;
    summary.resize(760, 360);
    summary.layoutMode = "VERTICAL";
    summary.primaryAxisSizingMode = "AUTO";
    summary.counterAxisSizingMode = "FIXED";
    summary.paddingLeft = 24;
    summary.paddingRight = 24;
    summary.paddingTop = 24;
    summary.paddingBottom = 24;
    summary.itemSpacing = 8;
    home.parent.appendChild(summary);
  }

  const surfaceVar =
    semanticVars.find((variable) => variable.name === "color/surface/float") ??
    semanticVars.find((variable) => variable.name === "color/surface/base");
  if (surfaceVar) {
    summary.fills = [
      figma.variables.setBoundVariableForPaint(
        { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
        "color",
        surfaceVar,
      ),
    ];
  }

  while (summary.children.length > 0) summary.children[0].remove();

  const title = figma.createText();
  title.fontName = { family: "Inter", style: "Semi Bold" };
  title.fontSize = 16;
  title.characters = "Caelo semantic variable bindings - Home";
  summary.appendChild(title);

  const rows = [...used.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 30);

  for (const [name, count] of rows) {
    const row = figma.createText();
    row.fontName = { family: "Inter", style: "Regular" };
    row.fontSize = 12;
    row.characters = `${name} x${count}`;
    summary.appendChild(row);
  }

  console.log({
    step: "home-semantic-paint-bindings",
    homeNodeId: home.id,
    counts,
    uniqueVariablesUsed: used.size,
    topVariables: rows.slice(0, 12),
  });
})();
