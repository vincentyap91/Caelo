/**
 * Compares component --color-* usage against riocity-figma shared semantics.
 * Run: node scripts/audit-figma-semantic-usage.mjs
 */
import fs from 'fs';
import path from 'path';

const FIGMA_URL =
  'https://raw.githubusercontent.com/vincentyap91/riocity-figma/main/theme.css';
const ROOT = path.resolve(import.meta.dirname, '..');

async function loadFigmaNames() {
  const res = await fetch(FIGMA_URL);
  if (!res.ok) throw new Error(`Failed to fetch Figma theme.css: ${res.status}`);
  const css = await res.text();
  const names = new Set();
  const re = /^\s*(--color-[a-z0-9-]+):/gm;
  let m;
  while ((m = re.exec(css))) names.add(m[1]);
  return names;
}

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') walk(p, acc);
    else if (/\.(jsx?|tsx?|css|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

function collectRefs(figma) {
  const used = new Set();
  const re = /var\(\s*(--color-[a-z0-9-]+)/g;
  const srcDir = path.join(ROOT, 'src');
  for (const file of walk(srcDir)) {
    if (file.endsWith(`${path.sep}theme.css`) && file.includes(`${path.sep}src${path.sep}theme.css`))
      continue;
    const text = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = re.exec(text))) used.add(m[1]);
  }
  const nonFigma = [...used].filter((n) => !figma.has(n)).sort();
  return { used: [...used].sort(), nonFigma };
}

function localExtras(figma) {
  const theme = fs.readFileSync(path.join(ROOT, 'src/theme.css'), 'utf8');
  const lines = theme.split(/\r?\n/);
  let marker = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*--color-table-highlight:/.test(lines[i])) {
      marker = i;
      break;
    }
  }
  const before = lines.slice(0, marker + 1).join('\n');
  const local = new Set();
  const re = /^\s*(--color-[a-z0-9-]+):/gm;
  let m;
  while ((m = re.exec(before))) local.add(m[1]);
  return [...local].filter((n) => !figma.has(n)).sort();
}

const MIGRATED_ALIASES = {
  '--color-gradient-nav-brand': '--color-gradient-menu-brand',
  '--color-gradient-table-head': '--color-surface-secondary-table-head',
  '--color-hot-main': '--color-danger',
  '--color-border-brand-soft': '--color-border-brand',
};

async function main() {
  const figma = await loadFigmaNames();
  const local = fs.readFileSync(path.join(ROOT, 'src/theme.css'), 'utf8');
  const missingDef = [...figma].filter((n) => !local.includes(`${n}:`)).sort();
  const { nonFigma } = collectRefs(figma);
  const extensionsInTheme = localExtras(figma);

  const report = {
    figmaSemanticCount: figma.size,
    missingInLocalThemeCss: missingDef,
    nonFigmaRefsInSrc: nonFigma,
    nonFigmaRefCount: nonFigma.length,
    caeloOnlySemanticsBeforeMarker: extensionsInTheme,
    caeloOnlyBeforeMarkerCount: extensionsInTheme.length,
    migratedAliases: MIGRATED_ALIASES,
    pendingFigmaPr: 'scripts/figma-pending-semantics.json',
  };

  console.log(JSON.stringify(report, null, 2));

  const fail =
    missingDef.length > 0 ||
    nonFigma.some((n) => Object.keys(MIGRATED_ALIASES).includes(n));
  if (fail) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
