/**
 * Replace hardcoded hex/rgb in className with theme semantic variables.
 */
import fs from 'fs';
import path from 'path';

const REPLACEMENTS = [
  ['bg-[#fff1cc]', 'bg-[var(--color-accent-pale)]'],
  ['text-[#b7791f]', 'text-[var(--color-text-sub-title)]'],
  ['border-[#f3d28b]', 'border-[var(--color-warning)]'],
  ['bg-[#1c63b9]', 'bg-[var(--color-primary)]'],
  ['bg-[#4ade80]', 'bg-[var(--color-success-vivid)]'],
  ['bg-[#f8f9fc]', 'bg-[var(--color-page-default)]'],
  ['bg-[#f1f5f9]', 'bg-[var(--color-surface-muted)]'],
  ['text-[#94a3b8]', 'text-[var(--color-text-soft)]'],
  ['placeholder:text-[#94a3b8]', 'placeholder:text-[var(--color-text-soft)]'],
  ['text-[#0c3f7e]', 'text-[var(--color-cta-text)]'],
  ['text-[#7dd3fc]', 'text-[var(--color-nav-text-accent)]'],
  ['border-[#1da851]', 'border-[var(--color-success-strong)]'],
  ['bg-[#25D366]', 'bg-[var(--color-success-strong)]'],
  ['hover:bg-[#20bd5a]', 'hover:bg-[var(--color-success-hover)]'],
  ['text-[rgb(25_41_71)]', 'text-[var(--color-text-primary)]'],
  ['text-[rgb(28_40_65)]', 'text-[var(--color-text-primary)]'],
  ['text-[rgb(43_58_87)]', 'text-[var(--color-text-secondary)]'],
  ['text-[rgb(42_53_72)]', 'text-[var(--color-text-secondary)]'],
  ['text-[rgb(93_103_128)]', 'text-[var(--color-text-muted)]'],
  ['text-[rgb(106_117_144)]', 'text-[var(--color-text-soft)]'],
  ['text-[rgb(35_64_106)]', 'text-[var(--color-text-secondary)]'],
  ['text-[rgb(18_63_128)]', 'text-[var(--color-text-brand)]'],
  ['hover:text-[rgb(18_63_128)]', 'hover:text-[var(--color-text-brand)]'],
  ['border-[rgb(226_232_240)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(159_201_238)]', 'border-[var(--color-border-accent)]'],
  ['bg-[rgb(220_252_231)]', 'bg-[var(--color-success-light)]'],
  ['bg-[rgb(254_226_226)]', 'bg-[var(--color-surface-subtle)]'],
  ['bg-[rgb(254_249_195)]', 'bg-[var(--color-accent-50)]'],
  ['bg-[rgb(18_59_148_/_0.35)]', 'bg-[var(--color-primary)]/35'],
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.jsx$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let n = 0;
for (const file of walk(path.join(import.meta.dirname, '..', 'src', 'components'))) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [a, b] of REPLACEMENTS) {
    if (text.includes(a)) text = text.split(a).join(b);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    n++;
  }
}
console.log(`Updated ${n} files.`);
