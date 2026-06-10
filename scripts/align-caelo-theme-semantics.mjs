/**
 * Align src/theme.css semantic block to theme-riocity.css --color-* names only.
 * Preserves Caelo values; merges Caelo-only gradients into nearest Riocity names.
 * Run: node scripts/align-caelo-theme-semantics.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const RIO_PATH = path.join(ROOT, 'src/theme-riocity.css');
const CAELO_PATH = path.join(ROOT, 'src/theme.css');

function parseColorVars(text) {
  const map = new Map();
  for (const m of text.matchAll(/^\s*(--color-[^:]+):\s*(.+?);\s*$/gm)) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

function parseRiocitySections(text) {
  const start = text.indexOf('  /* text */');
  if (start < 0) throw new Error('Could not find semantic /* text */ block in theme-riocity.css');
  const end = text.indexOf('--color-table-highlight:');
  const block = text.slice(start, end);
  const sections = [];
  let current = null;
  for (const line of block.split('\n')) {
    const sec = line.match(/^\s*\/\* ([^*]+) \*\/\s*$/);
    if (sec) {
      current = { title: sec[1].trim(), vars: [] };
      sections.push(current);
      continue;
    }
    const varMatch = line.match(/^\s*(--color-[^:]+):\s*(.+?);\s*$/);
    if (varMatch && current) {
      current.vars.push({ name: varMatch[1], value: varMatch[2].trim() });
    }
  }
  return sections;
}

const rioText = fs.readFileSync(RIO_PATH, 'utf8');
const caeloText = fs.readFileSync(CAELO_PATH, 'utf8');
const rioSections = parseRiocitySections(rioText);
const caeloAll = parseColorVars(caeloText);

const rioNames = new Set();
for (const s of rioSections) for (const v of s.vars) rioNames.add(v.name);

// Caelo-only → Riocity gradient value merge (keep Caelo formula on Riocity name)
const gradientMerge = {
  '--color-gradient-home-dashboard':
    caeloAll.get('--color-gradient-home-dashboard') ||
    'linear-gradient(180deg, var(--raw-gradient-account-shell-start) 0%, var(--raw-gradient-account-shell-mid) 38%, var(--raw-gradient-account-shell-end) 100%)',
  '--color-gradient-referral-panel':
    caeloAll.get('--color-gradient-referral-panel') ||
    'linear-gradient(180deg, var(--raw-gradient-register-page-start) 0%, var(--raw-gradient-register-page-mid) 45%, var(--raw-gradient-register-page-end) 100%)',
  '--color-gradient-card-brand':
    caeloAll.get('--color-gradient-live-page') ||
    'linear-gradient(180deg, var(--raw-gradient-live-page-start) 0%, var(--raw-gradient-live-page-mid) 36%, var(--raw-gradient-live-page-end) 100%)',
  '--color-gradient-home-muted':
    caeloAll.get('--color-gradient-soft-panel') ||
    'linear-gradient(180deg, var(--raw-gradient-soft-panel-start) 0%, var(--raw-gradient-soft-panel-end) 100%)',
  '--color-gradient-home-cta':
    caeloAll.get('--color-gradient-nav-cta') ||
    caeloAll.get('--color-gradient-home-cta') ||
    'linear-gradient(90deg, var(--brand-630) 0%, var(--brand-500) 100%)',
  '--color-gradient-menu-brand':
    caeloAll.get('--color-gradient-vip-nav-pill') ||
    caeloAll.get('--color-gradient-menu-brand') ||
    caeloAll.get('--color-gradient-side-menu-brand') ||
    'linear-gradient(180deg, var(--raw-gradient-vip-nav-pill-start) 0%, var(--raw-gradient-vip-nav-pill-end) 100%)',
  '--color-gradient-home-highlight':
    caeloAll.get('--color-gradient-app-download-section') ||
    caeloAll.get('--color-gradient-home-highlight') ||
    'linear-gradient(180deg, var(--raw-gradient-app-download-section-start) 0%, var(--raw-gradient-app-download-section-end) 100%)',
  '--color-gradient-home-card':
    caeloAll.get('--color-gradient-content-hero-top') ||
    caeloAll.get('--color-gradient-home-card') ||
    'radial-gradient(circle at top, var(--raw-scrim-accent-blue-16) 0%, transparent 72%)',
  '--color-gradient-sports-card':
    caeloAll.get('--color-gradient-favourite-inactive') ||
    caeloAll.get('--color-gradient-sports-card') ||
    'linear-gradient(180deg, var(--raw-scrim-fav-inactive-start) 0%, var(--raw-scrim-fav-inactive-end) 100%)',
  '--color-gradient-table':
    caeloAll.get('--color-gradient-scrollbar-track') ||
    caeloAll.get('--color-gradient-table') ||
    'linear-gradient(180deg, var(--raw-gradient-scrollbar-track-start) 0%, var(--raw-gradient-scrollbar-track-end) 100%)',
  '--color-gradient-tag':
    caeloAll.get('--color-gradient-logout-hover') ||
    caeloAll.get('--color-gradient-tag') ||
    'linear-gradient(90deg, var(--raw-gradient-logout-hover-start) 0%, var(--raw-gradient-logout-hover-mid) 52%, var(--raw-gradient-logout-hover-end) 100%)',
};

// Legacy Caelo-only name → Riocity semantic value source
const legacyValue = {
  '--color-text-primary': 'var(--raw-app-text-primary)',
  '--color-text-primary-card-title': 'var(--raw-text-brand)',
  '--color-text-secondary': 'var(--raw-app-text-secondary)',
  '--color-text-muted': 'var(--raw-app-text-muted)',
  '--color-text-soft': 'var(--raw-app-text-soft)',
  '--color-text-subtle': 'var(--raw-app-text-subtle)',
  '--color-text-cta-inverse': 'var(--raw-cta-text)',
  '--color-accent-pale': 'var(--raw-gradient-accent-50)',
  '--color-accent-glow': 'var(--raw-gradient-accent-100)',
  '--color-button-hover': 'var(--raw-gradient-accent-600)',
  '--color-surface-cool-light': 'var(--raw-surface-muted)',
  '--color-surface-float': 'var(--raw-surface-muted-soft)',
  '--color-surface-subtle': 'var(--raw-surface-subtle)',
  '--color-sticky-nav': 'var(--brand-700)',
  '--color-text-sticky-nav-text': 'var(--raw-nav-text-soft)',
  '--color-text-sticky-nav-active': 'var(--raw-nav-text-accent)',
  '--color-button-nav': 'var(--raw-surface-muted-soft)',
  '--color-border-brand': 'var(--raw-border-brand)',
  '--color-border-subtle': 'var(--raw-app-border)',
  '--color-border': 'var(--raw-app-border)',
  '--color-popup-head': 'var(--raw-universal-modal-header-bg)',
  '--color-popup-body': 'var(--mono-0)',
  '--color-text-recent-amount': 'var(--raw-payout-amount)',
  '--color-button-cta': 'var(--raw-app-button-cta)',
  '--color-button-cta-start': 'var(--raw-cta-start)',
  '--color-button-cta-end': 'var(--raw-cta-end)',
  '--color-button-cta-arrow': 'var(--brand-500)',
  '--color-button-cta-arrow-selected': 'var(--mono-0)',
  '--color-button-cta-category': 'var(--mono-510)',
  '--color-button-cta-category-text': 'var(--raw-text-brand)',
  '--color-button-cta-pagination': 'var(--mono-310)',
  '--color-button-cta-pagination-selected': 'var(--brand-700)',
  '--color-primary-tag': 'var(--support-error-medium)',
  '--color-primary-tag-text': 'var(--mono-0)',
  '--color-secondary-tag': 'var(--raw-gradient-accent-50)',
  '--color-secondary-tag-text': 'var(--support-success-vivid)',
  '--color-surface-rtp-secondary-card-text': 'var(--raw-app-text-secondary)',
  '--color-thumbnail': 'var(--mono-950)',
  '--color-gradient-button-cta':
    'linear-gradient(180deg, var(--raw-cta-start) 0%, var(--raw-cta-end) 100%)',
};

function resolveValue(name, rioDefault) {
  if (legacyValue[name]) return legacyValue[name];
  if (gradientMerge[name]) return gradientMerge[name];
  if (caeloAll.has(name)) return caeloAll.get(name);
  return rioDefault;
}

const lines = [];
lines.push('  /* ---------------------------------------------------------------------------');
lines.push('     02 Semantic — role tokens (use in application code)');
lines.push('     Names: 1:1 with src/theme-riocity.css | Values: Caelo palette');
lines.push('     --------------------------------------------------------------------------- */');

for (const section of rioSections) {
  lines.push(`  /* ${section.title} */`);
  for (const v of section.vars) {
    const value = resolveValue(v.name, v.value);
    const pad = v.name.length < 42 ? ' '.repeat(42 - v.name.length) : ' ';
    lines.push(`  ${v.name}:${pad}${value};`);
  }
  lines.push('');
}

lines.push('  /* table */');
lines.push('  --color-table-highlight: var(--color-gradient-table);');

const markerStart = caeloText.indexOf('  /* ---------------------------------------------------------------------------\n     Caelo primitive overrides');
const semanticStart = caeloText.indexOf('  /* ---------------------------------------------------------------------------\n     02 Semantic');

if (semanticStart < 0 || markerStart < 0) {
  console.error('Could not find semantic or marker blocks');
  process.exit(1);
}

// Remove post-marker Caelo-only --color-* block (keep only primitives)
let primitiveBlock = caeloText.slice(markerStart);
const caeloSemanticFooter = primitiveBlock.indexOf(
  '  /* ---------------------------------------------------------------------------\n     Caelo app-specific semantics'
);
if (caeloSemanticFooter >= 0) {
  const beforeFooter = primitiveBlock.slice(0, caeloSemanticFooter).trimEnd();
  primitiveBlock = beforeFooter.endsWith('}')
    ? beforeFooter + '\n'
    : `${beforeFooter}\n}\n`;
}

const header = caeloText.slice(0, semanticStart);

// Riocity primitive-section color stops (before 02 Semantic)
const primitiveColorPatch = `  /* color — Riocity semantic names (Caelo values) */
  --color-button-cta-end: var(--raw-cta-end);
  --color-button-cta-start: var(--raw-cta-start);

`;

const headerWithPrimitiveColors = header.includes('--color-button-cta-start:')
  ? header
  : header.replace(
      /(\/\* raw-gradient \*\/\n(?:.*\n)*?)(\n  \/\* KH168 \*\/)/,
      `$1\n${primitiveColorPatch}$2`
    );

const newSemantic = lines.join('\n') + '\n\n';
const out = headerWithPrimitiveColors + newSemantic + primitiveBlock;

fs.writeFileSync(CAELO_PATH, out);

const outMap = parseColorVars(out);
const onlyC = [...outMap.keys()].filter((n) => !rioNames.has(n));
const onlyR = [...rioNames].filter((n) => !outMap.has(n));
console.log('Written', CAELO_PATH);
console.log('Semantic --color-* count:', outMap.size);
console.log('Riocity count:', rioNames.size);
console.log('Caelo-only remaining:', onlyC.length, onlyC.slice(0, 10));
console.log('Missing from Caelo:', onlyR.length, onlyR);
