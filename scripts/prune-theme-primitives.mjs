import fs from 'fs';
import path from 'path';

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') walk(p, acc);
    else if (/\.(jsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let theme = fs.readFileSync('src/theme.css', 'utf8');

const brandRemap = {
  '--brand-600': '--brand-500',
  '--brand-646': '--mono-112',
  '--brand-750': '--brand-630',
  '--brand-761': '--brand-500',
  '--brand-762': '--brand-630',
  '--brand-809': '--brand-700',
  '--brand-810': '--brand-700',
  '--brand-811': '--brand-630',
  '--brand-812': '--brand-700',
  '--brand-815': '--brand-700',
  '--brand-820': '--brand-700',
  '--brand-822': '--brand-700',
  '--brand-823': '--brand-630',
  '--brand-824': '--brand-700',
  '--brand-826': '--brand-630',
  '--brand-827': '--brand-700',
  '--brand-828': '--brand-500',
  '--brand-830': '--brand-630',
  '--brand-831': '--brand-630',
  '--brand-832': '--brand-630',
  '--brand-833': '--brand-700',
  '--brand-839': '--brand-630',
  '--brand-845': '--brand-500',
  '--brand-846': '--brand-500',
  '--brand-847': '--brand-500',
  '--brand-850': '--raw-brand-soft',
  '--brand-856': '--brand-400',
  '--brand-862': '--brand-400',
};

const marker = '  /* ---------------------------------------------------------------------------\n     02 Semantic';
const semIdx = theme.indexOf(marker);
if (semIdx < 0) throw new Error('Semantic section not found');

let semSection = theme.slice(semIdx);
const primSection = theme.slice(0, semIdx);

for (const [from, to] of Object.entries(brandRemap)) {
  semSection = semSection.split(`var(${from})`).join(`var(${to})`);
}
semSection = semSection.split('var(--raw-gradient-brand-soft)').join('var(--raw-brand-soft)');

theme = primSection + semSection;

let allCode = '';
for (const f of walk('src')) {
  if (f.replace(/\\/g, '/').endsWith('src/theme.css')) continue;
  allCode += fs.readFileSync(f, 'utf8');
}
allCode += theme;

const defs = new Map();
for (const m of theme.matchAll(/^\s*(--[a-zA-Z0-9-]+):\s*([^;]+);/gm)) {
  if (!m[1].startsWith('--color-')) defs.set(m[1], m[2].trim());
}

const entryUsed = new Set([...allCode.matchAll(/var\((--[a-zA-Z0-9-]+)\)/g)].map((m) => m[1]));
const needed = new Set();
const q = [...entryUsed];
while (q.length) {
  const name = q.pop();
  if (needed.has(name)) continue;
  needed.add(name);
  const val = defs.get(name);
  if (!val) continue;
  for (const m of val.matchAll(/var\((--[a-zA-Z0-9-]+)\)/g)) {
    if (!needed.has(m[1])) q.push(m[1]);
  }
}

const keepBrand = new Set(['--brand-400', '--brand-500', '--brand-500-soft', '--brand-630', '--brand-700']);
const primPrefixes = ['--mono-', '--brand-', '--accent-', '--support-', '--overlay-', '--raw-', '--Surface-'];

const lines = theme.split('\n');
const out = [];
let inPrimitives = false;
let inBrandBlock = false;
let removed = 0;

for (const line of lines) {
  if (line.includes('01 Primitives')) inPrimitives = true;
  if (line.includes('02 Semantic')) {
    inPrimitives = false;
    inBrandBlock = false;
  }
  if (line.trim() === '/* brand */') inBrandBlock = true;
  if (inBrandBlock && line.trim().startsWith('/* ') && !line.includes('brand')) inBrandBlock = false;

  const def = line.match(/^\s*(--[a-zA-Z0-9-]+):/);
  if (def && inPrimitives) {
    const name = def[1];
    if (inBrandBlock && name.startsWith('--brand-') && !keepBrand.has(name)) {
      removed++;
      continue;
    }
    if (primPrefixes.some((p) => name.startsWith(p)) && !needed.has(name)) {
      removed++;
      continue;
    }
  }
  out.push(line);
}

theme = out.join('\n');

theme = theme.replace(
  /--raw-gradient-home-cta-edge: #0d2a6a;/,
  '--raw-gradient-home-cta-edge: var(--brand-630);'
);
theme = theme.replace(/\n  --raw-gradient-brand-soft: #e5f6ff;/, '');

// Merge Caelo primitive sections comment
theme = theme.replace(
  /  \/\* Caelo-only raw primitives \*\/\n/,
  '  /* Caelo site primitives (shared names) */\n'
);
theme = theme.replace(
  /  \/\* Caelo raw primitive value overrides \(shared names, site-specific hex\) \*\/\n/,
  '  /* Caelo gradient + accent primitives */\n'
);

fs.writeFileSync('src/theme.css', theme);
console.log(`Removed ${removed} unused primitive lines`);
console.log(`Lines: ${theme.split('\n').length}`);
