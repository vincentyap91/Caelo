/**
 * Replace Tailwind palette color classes with theme.css semantic var() utilities.
 * Run: node scripts/migrate-tailwind-palette-to-semantic.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src', 'components');

/** Longest-first replacement keys */
const REPLACEMENTS = [
  // Composite gradients → semantic utility classes
  [
    /bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100/g,
    'bg-gradient-soft-blue-panel',
  ],
  [
    /bg-gradient-to-b from-slate-950\/90 via-slate-900\/85 to-slate-900\/70/g,
    'bg-gradient-game-card-overlay',
  ],
  [
    /md:bg-gradient-to-r md:from-slate-950\/90 md:via-slate-900\/75 md:to-slate-900\/40/g,
    'md:bg-gradient-sidenav-scrim',
  ],
  [
    /bg-gradient-to-b from-white via-\[var\(--color-surface-subtle\)\] to-\[var\(--color-accent-50\)\]\/50/g,
    'bg-gradient-home-dashboard',
  ],

  // white with opacity (nav / dark chrome)
  ['hover:border-white/50', 'hover:border-[var(--color-nav-tile-border-hover)]'],
  ['border-white/35', 'border-[var(--color-nav-tile-border-hover)]'],
  ['border-white/15', 'border-[var(--color-nav-border)]'],
  ['border-white/10', 'border-[var(--color-nav-border-soft)]'],
  ['hover:bg-white/15', 'hover:bg-[var(--color-nav-border-soft)]'],
  ['hover:bg-white/10', 'hover:bg-[var(--color-nav-border-soft)]'],
  ['hover:bg-white/[0.08]', 'hover:bg-[var(--color-surface-light-active)]'],
  ['hover:bg-white/[0.06]', 'hover:bg-[var(--color-nav-tile-border)]'],
  ['bg-white/[0.08]', 'bg-[var(--color-surface-light-active)]'],
  ['bg-white/20', 'bg-[var(--color-nav-border)]'],
  ['bg-white/10', 'bg-[var(--color-nav-border-soft)]'],
  ['bg-white/5', 'bg-[var(--color-nav-tile-border)]'],
  ['text-white/90', 'text-[var(--color-nav-text-soft)]'],
  ['text-white/80', 'text-[var(--color-nav-text-soft)]'],
  ['hover:text-white', 'hover:text-[var(--color-tertiery)]'],

  // white / black solids
  ['bg-transparent', 'bg-transparent'],
  ['text-white', 'text-[var(--color-tertiery)]'],
  ['bg-white', 'bg-[var(--color-tertiery)]'],
  ['border-white', 'border-[var(--color-nav-border)]'],
  ['text-black', 'text-[var(--color-text-primary)]'],
  ['bg-black', 'bg-[var(--color-surface-darkest)]'],

  // blue (light theme accents)
  ['text-blue-900', 'text-[var(--color-text-brand)]'],
  ['text-blue-800', 'text-[var(--color-text-brand)]'],
  ['text-blue-700', 'text-[var(--color-accent-700)]'],
  ['text-blue-600', 'text-[var(--color-accent-600)]'],
  ['text-blue-500', 'text-[var(--color-accent-500)]'],
  ['text-blue-400', 'text-[var(--color-accent-400)]'],
  ['text-blue-300', 'text-[var(--color-accent-300)]'],
  ['text-blue-200', 'text-[var(--color-accent-200)]'],
  ['text-blue-100', 'text-[var(--color-accent-100)]'],
  ['text-blue-50', 'text-[var(--color-accent-50)]'],
  ['bg-blue-900', 'bg-[var(--color-primary)]'],
  ['bg-blue-800', 'bg-[var(--color-secondary)]'],
  ['bg-blue-700', 'bg-[var(--color-accent-700)]'],
  ['bg-blue-600', 'bg-[var(--color-accent-600)]'],
  ['bg-blue-500', 'bg-[var(--color-accent-500)]'],
  ['bg-blue-400', 'bg-[var(--color-accent-400)]'],
  ['bg-blue-300', 'bg-[var(--color-accent-300)]'],
  ['bg-blue-200', 'bg-[var(--color-accent-200)]'],
  ['bg-blue-100', 'bg-[var(--color-accent-100)]'],
  ['bg-blue-50', 'bg-[var(--color-accent-50)]'],
  ['border-blue-500', 'border-[var(--color-border-brand)]'],
  ['border-blue-400', 'border-[var(--color-border-accent)]'],
  ['border-blue-300', 'border-[var(--color-border-accent)]'],
  ['border-blue-200', 'border-[var(--color-border-subtle)]'],
  ['border-blue-100', 'border-[var(--color-border-subtle)]'],
  ['from-blue-50', 'from-[var(--color-accent-50)]'],
  ['via-blue-50', 'via-[var(--color-accent-50)]'],
  ['to-blue-50', 'to-[var(--color-accent-50)]'],
  ['ring-blue-500', 'ring-[var(--color-accent-500)]'],
  ['ring-blue-400', 'ring-[var(--color-accent-400)]'],
  ['ring-blue-300', 'ring-[var(--color-accent-300)]'],
  ['focus:ring-blue-500', 'focus:ring-[var(--color-accent-500)]'],
  ['focus:ring-blue-400', 'focus:ring-[var(--color-accent-400)]'],
  ['focus:border-blue-500', 'focus:border-[var(--color-accent-500)]'],
  ['focus:border-blue-400', 'focus:border-[var(--color-accent-400)]'],
  ['hover:text-blue-600', 'hover:text-[var(--color-accent-600)]'],
  ['hover:text-blue-700', 'hover:text-[var(--color-accent-700)]'],
  ['hover:bg-blue-50', 'hover:bg-[var(--color-accent-50)]'],
  ['hover:bg-blue-100', 'hover:bg-[var(--color-accent-100)]'],

  // slate
  ['text-slate-900', 'text-[var(--color-text-primary)]'],
  ['text-slate-800', 'text-[var(--color-text-primary)]'],
  ['text-slate-700', 'text-[var(--color-text-secondary)]'],
  ['text-slate-600', 'text-[var(--color-text-secondary)]'],
  ['text-slate-500', 'text-[var(--color-text-muted)]'],
  ['text-slate-400', 'text-[var(--color-text-soft)]'],
  ['text-slate-300', 'text-[var(--color-text-soft)]'],
  ['bg-slate-900', 'bg-[var(--color-surface-darkest)]'],
  ['bg-slate-800', 'bg-[var(--color-surface-deep)]'],
  ['bg-slate-100', 'bg-[var(--color-surface-subtle)]'],
  ['bg-slate-50', 'bg-[var(--color-surface-muted)]'],
  ['border-slate-900', 'border-[var(--color-border-strong)]'],
  ['border-slate-800', 'border-[var(--color-border-strong)]'],
  ['border-slate-700', 'border-[var(--color-border-line)]'],
  ['border-slate-600', 'border-[var(--color-border-line)]'],
  ['border-slate-500', 'border-[var(--color-border-subtle)]'],
  ['border-slate-400', 'border-[var(--color-border-subtle)]'],
  ['border-slate-300', 'border-[var(--color-border-subtle)]'],
  ['border-slate-200', 'border-[var(--color-border-subtle)]'],
  ['border-slate-100', 'border-[var(--color-border-subtle)]'],
  ['border-slate-50', 'border-[var(--color-border-subtle)]'],
  ['from-slate-50', 'from-[var(--color-surface-muted)]'],
  ['via-slate-50', 'via-[var(--color-surface-muted)]'],
  ['to-slate-100', 'to-[var(--color-surface-subtle)]'],
  ['from-white', 'from-[var(--color-tertiery)]'],
  ['via-white', 'via-[var(--color-tertiery)]'],
  ['to-white', 'to-[var(--color-tertiery)]'],
  ['ring-slate-200', 'ring-[var(--color-border-subtle)]'],
  ['ring-slate-300', 'ring-[var(--color-border-subtle)]'],
  ['divide-slate-200', 'divide-[var(--color-border-subtle)]'],
  ['hover:bg-slate-50', 'hover:bg-[var(--color-surface-muted)]'],
  ['hover:bg-slate-100', 'hover:bg-[var(--color-surface-subtle)]'],
  ['hover:text-slate-900', 'hover:text-[var(--color-text-primary)]'],
  ['hover:text-slate-700', 'hover:text-[var(--color-text-secondary)]'],
  ['hover:border-slate-300', 'hover:border-[var(--color-border-subtle)]'],

  // gray (alias slate)
  ['text-gray-900', 'text-[var(--color-text-primary)]'],
  ['text-gray-600', 'text-[var(--color-text-secondary)]'],
  ['text-gray-500', 'text-[var(--color-text-muted)]'],
  ['text-gray-400', 'text-[var(--color-text-soft)]'],
  ['bg-gray-100', 'bg-[var(--color-surface-subtle)]'],
  ['bg-gray-50', 'bg-[var(--color-surface-muted)]'],
  ['border-gray-200', 'border-[var(--color-border-subtle)]'],
  ['border-gray-300', 'border-[var(--color-border-subtle)]'],

  // red / green / amber feedback
  ['text-red-600', 'text-[var(--color-danger)]'],
  ['text-red-500', 'text-[var(--color-danger)]'],
  ['text-red-400', 'text-[var(--color-danger)]'],
  ['bg-red-50', 'bg-[var(--color-surface-subtle)]'],
  ['bg-red-500', 'bg-[var(--color-danger)]'],
  ['bg-red-600', 'bg-[var(--color-danger)]'],
  ['border-red-200', 'border-[var(--color-danger)]'],
  ['border-red-500', 'border-[var(--color-danger)]'],
  ['text-green-600', 'text-[var(--color-success)]'],
  ['text-green-500', 'text-[var(--color-success)]'],
  ['bg-green-500', 'bg-[var(--color-success)]'],
  ['bg-green-600', 'bg-[var(--color-success)]'],
  ['text-amber-600', 'text-[var(--color-warning)]'],
  ['text-amber-500', 'text-[var(--color-warning)]'],
  ['bg-amber-50', 'bg-[var(--color-accent-50)]'],
  ['text-yellow-500', 'text-[var(--color-warning)]'],
  ['bg-amber-400', 'bg-[var(--color-warning)]'],
  ['text-amber-900', 'text-[var(--color-cta-text)]'],
  ['bg-orange-500', 'bg-[var(--color-danger)]'],
  ['from-amber-400 to-red-500', 'from-[var(--color-warning)] to-[var(--color-danger)]'],
  ['bg-emerald-100', 'bg-[var(--color-success-light)]'],
  ['bg-emerald-500', 'bg-[var(--color-success)]'],
  ['text-emerald-700', 'text-[var(--color-success-strong)]'],
  ['text-emerald-600', 'text-[var(--color-success)]'],
  ['text-emerald-300', 'text-[var(--color-success-light)]'],
  ['border-green-500', 'border-[var(--color-success)]'],
  ['bg-slate-950', 'bg-[var(--color-surface-start)]'],
  ['bg-slate-200', 'bg-[var(--color-border-subtle)]'],
  ['bg-slate-600', 'bg-[var(--color-button-muted)]'],
  ['bg-slate-700', 'bg-[var(--color-surface-mid-dark)]'],
  ['hover:bg-slate-700', 'hover:bg-[var(--color-surface-mid-dark)]'],
  ['bg-slate-400/0', 'bg-[var(--color-text-soft)]/0'],
  ['group-hover:bg-slate-400/30', 'group-hover:bg-[var(--color-text-soft)]/30'],
  ['border-gray-100', 'border-[var(--color-border-subtle)]'],
  ['bg-gray-200', 'bg-[var(--color-border-subtle)]'],
  ['bg-[#123B94]', 'bg-[var(--color-primary)]'],
  ['hover:bg-[#0d2a6a]', 'hover:bg-[var(--color-secondary)]'],

  // zinc/neutral
  ['text-zinc-900', 'text-[var(--color-text-primary)]'],
  ['text-zinc-600', 'text-[var(--color-text-secondary)]'],
  ['text-zinc-500', 'text-[var(--color-text-muted)]'],
  ['bg-zinc-100', 'bg-[var(--color-surface-subtle)]'],
  ['bg-zinc-50', 'bg-[var(--color-surface-muted)]'],
  ['border-zinc-200', 'border-[var(--color-border-subtle)]'],
  ['text-neutral-600', 'text-[var(--color-text-secondary)]'],
  ['text-neutral-500', 'text-[var(--color-text-muted)]'],
  ['bg-neutral-100', 'bg-[var(--color-surface-subtle)]'],
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx|js)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

let filesChanged = 0;
let totalReplacements = 0;

for (const file of walk(SRC)) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of REPLACEMENTS) {
    if (typeof from === 'string') {
      if (text.includes(from)) {
        const parts = text.split(from);
        totalReplacements += parts.length - 1;
        text = parts.join(to);
      }
    } else {
      const next = text.replace(from, to);
      if (next !== text) {
        const matches = text.match(from);
        totalReplacements += matches ? matches.length : 1;
        text = next;
      }
    }
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    filesChanged++;
  }
}

console.log(`Updated ${filesChanged} files, ~${totalReplacements} replacements.`);
