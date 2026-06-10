/**
 * Parse src/theme.css into Figma variable migration data.
 * Run: node scripts/parse-theme-css-for-figma.mjs
 *
 * Output: scripts/figma-theme-token-data.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themePath = path.join(__dirname, '../src/theme.css');
const outPath = path.join(__dirname, 'figma-theme-token-data.json');

const PRIMITIVE_RE = /^--(mono|brand|accent|support|overlay|raw)-/;
const SEMANTIC_RE = /^--color-/;
const SKIP_RE = /^--(shadow|radius|tracking|inset|nav)-/;

function parseDeclarations(css) {
  const map = new Map();
  for (const line of css.split('\n')) {
    const m = line.match(/^\s*(--[\w-]+):\s*(.+?);\s*(?:\/\*.*)?$/);
    if (!m) continue;
    const [, name, rawValue] = m;
    map.set(name, rawValue.trim());
  }
  return map;
}

function isPrimitive(name) {
  return PRIMITIVE_RE.test(name);
}

function isSemantic(name) {
  return SEMANTIC_RE.test(name);
}

function isOutOfScope(name) {
  return SKIP_RE.test(name);
}

function cssNameToFigmaPath(cssName) {
  const body = cssName.replace(/^--/, '');

  if (body.startsWith('color-')) {
    const rest = body.slice('color-'.length);
    if (rest.startsWith('gradient-')) {
      const grad = rest.slice('gradient-'.length);
      return `color/gradient/${grad.replace(/-/g, '/')}`;
    }
    return `color/${rest.replace(/-/g, '/')}`;
  }

  const rawGradStart = body.match(/^raw-gradient-(.+)-start$/);
  if (rawGradStart) {
    return `raw/gradient/${rawGradStart[1].replace(/-/g, '/')}/start`;
  }
  const rawGradEnd = body.match(/^raw-gradient-(.+)-end$/);
  if (rawGradEnd) {
    return `raw/gradient/${rawGradEnd[1].replace(/-/g, '/')}/end`;
  }
  const rawScrim = body.match(/^raw-scrim-(.+)$/);
  if (rawScrim) {
    return `raw/scrim/${rawScrim[1].replace(/-/g, '/')}`;
  }
  if (body.startsWith('raw-')) {
    return `raw/${body.slice(4).replace(/-/g, '/')}`;
  }

  const numericGroups = ['mono', 'brand', 'accent', 'overlay'];
  for (const g of numericGroups) {
    if (body.startsWith(`${g}-`)) {
      return `${g}/${body.slice(g.length + 1)}`;
    }
  }
  if (body.startsWith('support-')) {
    return `support/${body.slice(8)}`;
  }
  if (body.startsWith('accent-brown-')) {
    return `accent/brown/${body.slice('accent-brown-'.length)}`;
  }

  throw new Error(`Unmapped primitive: ${cssName}`);
}

function parseColorLiteral(value) {
  const s = value.trim();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const n = parseInt(hex.slice(0, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return {
      r: ((n >> 16) & 255) / 255,
      g: ((n >> 8) & 255) / 255,
      b: (n & 255) / 255,
      a,
      hex: `#${hex.slice(0, 6)}${hex.length === 8 ? hex.slice(6, 8) : ''}`.toLowerCase(),
    };
  }
  const modern = s.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (modern) {
    return {
      r: Number(modern[1]) / 255,
      g: Number(modern[2]) / 255,
      b: Number(modern[3]) / 255,
      a: modern[4] === undefined ? 1 : Number(modern[4]),
      hex: null,
    };
  }
  const legacy = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (legacy) {
    return {
      r: Number(legacy[1]) / 255,
      g: Number(legacy[2]) / 255,
      b: Number(legacy[3]) / 255,
      a: legacy[4] === undefined ? 1 : Number(legacy[4]),
      hex: null,
    };
  }
  return null;
}

function extractGradientStops(value) {
  const vars = [...value.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]);
  if (vars.length >= 2) {
    return { startCss: vars[0], endCss: vars[vars.length - 1] };
  }
  return null;
}

function resolveRef(name, map, stack = []) {
  if (stack.includes(name)) throw new Error(`Circular ref: ${stack.join(' -> ')} -> ${name}`);
  const value = map.get(name);
  if (!value) throw new Error(`Missing token: ${name}`);

  if (name.startsWith('--color-gradient-') && value.startsWith('linear-gradient')) {
    const stops = extractGradientStops(value);
    if (stops) {
      return {
        type: 'gradient',
        start: { cssName: stops.startCss, figmaPath: cssNameToFigmaPath(stops.startCss) },
        end: { cssName: stops.endCss, figmaPath: cssNameToFigmaPath(stops.endCss) },
      };
    }
  }

  const varMatch = value.match(/^var\((--[\w-]+)\)$/);
  if (varMatch) {
    const resolved = resolveRef(varMatch[1], map, [...stack, name]);
    return { ...resolved, cssName: varMatch[1], figmaPath: cssNameToFigmaPath(varMatch[1]) };
  }
  const color = parseColorLiteral(value);
  if (color) return { type: 'color', cssName: name, figmaPath: cssNameToFigmaPath(name), ...color, cssValue: value };
  throw new Error(`Unresolved value for ${name}: ${value}`);
}

function semanticScope(figmaPath) {
  if (figmaPath.startsWith('color/text/')) return ['TEXT_FILL'];
  if (figmaPath.startsWith('color/border/')) return ['STROKE_COLOR'];
  return ['FRAME_FILL', 'SHAPE_FILL'];
}

function buildData(map) {
  const primitives = [];
  const semantics = [];
  const gradientComposites = [];

  for (const [name, value] of map) {
    if (isOutOfScope(name)) continue;
    if (isPrimitive(name)) {
      const figmaPath = cssNameToFigmaPath(name);
      try {
        const resolved = resolveRef(name, map);
        if (resolved.type === 'color') {
          primitives.push({
            cssName: name,
            figmaPath,
            rgba: { r: resolved.r, g: resolved.g, b: resolved.b, a: resolved.a },
            hex: resolved.hex,
            cssValue: value,
          });
        }
      } catch (e) {
        primitives.push({ cssName: name, figmaPath, error: String(e.message), cssValue: value });
      }
      continue;
    }
    if (!isSemantic(name)) continue;

    const figmaPath = cssNameToFigmaPath(name);
    try {
      const resolved = resolveRef(name, map);
      if (resolved.type === 'gradient') {
        gradientComposites.push({
          cssName: name,
          figmaPath: resolved.start?.figmaPath ? cssNameToFigmaPath(name) : cssNameToFigmaPath(name),
          startCss: resolved.start.cssName,
          endCss: resolved.end.cssName,
          startFigma: resolved.start.figmaPath,
          endFigma: resolved.end.figmaPath,
          startSemantic: `${cssNameToFigmaPath(name)}/start`,
          endSemantic: `${cssNameToFigmaPath(name)}/end`,
        });
        continue;
      }

      let aliasCss = value.match(/^var\((--[\w-]+)\)$/)?.[1] ?? null;
      if (!aliasCss) {
        let cur = name;
        const v = map.get(cur);
        aliasCss = v?.match(/^var\((--[\w-]+)\)$/)?.[1] ?? null;
      }

      const aliasFigma = aliasCss ? cssNameToFigmaPath(aliasCss) : null;

      semantics.push({
        cssName: name,
        figmaPath,
        aliasCss,
        aliasFigma,
        aliasCollection: aliasCss?.startsWith('--color-') ? '02 Semantic' : '01 Primitives',
        scopes: semanticScope(figmaPath),
        resolvedHex: resolved.hex,
      });
    } catch (e) {
      semantics.push({ cssName: name, figmaPath, error: String(e.message), cssValue: value });
    }
  }

  return { primitives, semantics, gradientComposites };
}

const css = fs.readFileSync(themePath, 'utf8');
const map = parseDeclarations(css);
const data = buildData(map);

const primErrors = data.primitives.filter((p) => p.error);
const semErrors = data.semantics.filter((s) => s.error);

const summary = {
  generatedAt: new Date().toISOString(),
  source: 'src/theme.css',
  primitiveCount: data.primitives.length,
  semanticCount: data.semantics.length,
  gradientCompositeCount: data.gradientComposites.length,
  primitiveErrors: primErrors.length,
  semanticErrors: semErrors.length,
};

fs.writeFileSync(outPath, JSON.stringify({ summary, ...data }, null, 2));

console.log(JSON.stringify(summary, null, 2));
if (primErrors.length) {
  console.error('Primitive errors:', primErrors.slice(0, 5));
}
if (semErrors.length) {
  console.error('Semantic errors:', semErrors.slice(0, 5));
}
