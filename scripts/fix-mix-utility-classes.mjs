/**
 * Restore invalid *-mix-* Tailwind classes to arbitrary opacity syntax.
 * Migration produced classes like `bg-mix-surface-darkest-70` with no CSS definitions.
 *
 * Run: node scripts/fix-mix-utility-classes.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

const MIX_RE =
  /((?:[\w-]+:)*)((?:bg|text|border(?:-[trblxy])?|ring|divide))-mix-([a-z0-9-]+)-(\d+)\b/g;

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', 'dist', 'assets'].includes(e.name)) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let filesChanged = 0;
let totalReplacements = 0;

for (const file of walk(SRC)) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  text = text.replace(MIX_RE, (_match, prefix, util, token, pct) => {
    totalReplacements++;
    return `${prefix}${util}-[var(--color-${token})]/${pct}`;
  });
  if (text !== before) {
    fs.writeFileSync(file, text);
    filesChanged++;
  }
}

console.log(`Fixed ${totalReplacements} mix utility classes in ${filesChanged} files`);
