/**
 * Replace Caelo-only semantic aliases with existing Figma/shared names.
 * Run: node scripts/consolidate-semantic-aliases.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');

/** Longest keys first to avoid partial replacements */
const VAR_REPLACEMENTS = [
  ['--color-text-on-primary-muted', '--color-nav-text-soft'],
  ['--color-text-on-primary-soft', '--color-nav-text-soft'],
  ['--color-text-on-primary', '--color-text-card-text'],
  ['--color-border-on-primary-strong', '--color-nav-tile-border-hover'],
  ['--color-border-on-primary-subtle', '--color-nav-border-soft'],
  ['--color-border-on-primary', '--color-nav-border'],
  ['--color-surface-on-primary-hover', '--color-surface-light-active'],
  ['--color-surface-on-primary-muted', '--color-nav-border-soft'],
  ['--color-surface-on-primary-glass', '--color-nav-border-soft'],
  ['--color-surface-on-primary-faint', '--color-nav-tile-border'],
  ['--color-surface-on-primary-ghost', '--color-nav-tile-border'],
  ['--color-divider-on-primary', '--color-nav-border'],
  ['--color-rollover-warn-border', '--color-warning'],
  ['--color-rollover-warn-surface', '--color-accent-pale'],
  ['--color-rollover-warn-text', '--color-text-sub-title'],
  ['--color-brand-whatsapp-border', '--color-success-strong'],
  ['--color-brand-whatsapp-hover', '--color-success-hover'],
  ['--color-brand-whatsapp', '--color-success-strong'],
  ['--color-vip-table-head', '--color-primary'],
  ['--color-live-online', '--color-success-vivid'],
  ['--color-live-chat-shell', '--color-page-default'],
  ['--color-live-chat-input', '--color-surface-muted'],
  ['--color-nav-cta-text', '--color-cta-text'],
  ['--color-referral-highlight', '--color-nav-text-accent'],
];

const CLASS_REPLACEMENTS = [
  ['md:bg-gradient-game-launch-scrim-md', 'md:bg-gradient-sidenav-scrim'],
  ['bg-gradient-game-launch-scrim', 'bg-gradient-game-card-overlay'],
  ['bg-gradient-home-live-panel', 'bg-gradient-home-dashboard'],
];

const DIRS = [
  path.join(ROOT, 'src', 'components'),
  path.join(ROOT, 'src', 'styles'),
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(jsx|tsx|js|ts|css)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function applyReplacements(content) {
  let out = content;
  for (const [from, to] of VAR_REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  for (const [from, to] of CLASS_REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

const themePath = path.join(ROOT, 'src', 'theme.css');
let theme = fs.readFileSync(themePath, 'utf8');
theme = applyReplacements(theme);

// Remove duplicate Caelo alias block (lines were re-mapped above)
theme = theme.replace(
  /\n  --color-text-on-primary: var\(--mono-0\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-text-on-primary-muted: var\(--raw-text-on-primary-muted\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-text-on-primary-soft: var\(--raw-text-on-primary-soft\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-border-on-primary: var\(--raw-scrim-on-primary-15\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-border-on-primary-subtle: var\(--raw-scrim-on-primary-10\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-border-on-primary-strong: var\(--raw-scrim-on-primary-35\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-surface-on-primary-ghost: var\(--raw-scrim-on-primary-05\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-surface-on-primary-hover: var\(--raw-scrim-on-primary-08\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-surface-on-primary-muted: var\(--raw-scrim-on-primary-10\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-surface-on-primary-glass: var\(--raw-scrim-on-primary-10\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-surface-on-primary-faint: var\(--raw-scrim-on-primary-06\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-divider-on-primary: var\(--raw-scrim-on-primary-20\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-rollover-warn-border: var\(--raw-rollover-warn-border\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-rollover-warn-surface: var\(--raw-rollover-warn-surface\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-rollover-warn-text: var\(--raw-rollover-warn-text\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-vip-table-head: var\(--raw-vip-table-head\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-brand-whatsapp: var\(--raw-brand-whatsapp\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-brand-whatsapp-border: var\(--raw-brand-whatsapp-border\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-brand-whatsapp-hover: var\(--raw-brand-whatsapp-hover\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-live-online: var\(--raw-live-online\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-live-chat-shell: var\(--raw-live-chat-shell\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-live-chat-input: var\(--raw-live-chat-input\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-nav-cta-text: var\(--raw-nav-cta-text\);\n/g,
  '\n',
);
theme = theme.replace(
  /\n  --color-referral-highlight: var\(--raw-referral-highlight\);\n/g,
  '\n',
);

// Repoint shared gradients; values live on existing tokens + Caelo overrides below
theme = theme.replace(
  /\n  --color-gradient-game-launch-scrim:.*\n  --color-gradient-game-launch-scrim-md:.*\n  --color-gradient-home-live-panel:.*\n/,
  '\n',
);

// Caelo overrides: nav scrims (white on primary chrome) + game/home gradients
const caeloNavPatch = `  --raw-nav-border: rgb(255 255 255 / 0.15);
  --raw-nav-border-soft: rgb(255 255 255 / 0.1);
  --raw-nav-tile-border: rgb(255 255 255 / 0.05);
  --raw-nav-tile-border-hover: rgb(255 255 255 / 0.35);
  --raw-nav-text-soft: rgb(255 255 255 / 0.9);
  --raw-nav-text-accent: #7dd3fc;
  --raw-scrim-game-overlay-start: var(--raw-scrim-game-launch-start);
  --raw-scrim-game-overlay-mid: var(--raw-scrim-game-launch-mid);
  --raw-scrim-game-overlay-end: var(--raw-scrim-game-launch-end);
`;

if (!theme.includes('--raw-scrim-game-overlay-start: var(--raw-scrim-game-launch-start)')) {
  theme = theme.replace(
    '  --raw-nav-border: rgb(106 200 255 / 0.18);\n  --raw-nav-border-soft: rgb(106 200 255 / 0.12);\n  --raw-nav-tile-border: rgb(87 181 255 / 0.1);\n  --raw-nav-tile-border-hover: rgb(102 203 255 / 0.3);\n  --raw-nav-text-soft: #d3eaff;\n  --raw-nav-text-accent: #8ad4ff;\n',
    caeloNavPatch,
  );
}

const caeloSemanticsPatch = `  --color-surface-light-active: rgb(255 255 255 / 0.08);
  --color-gradient-sidenav-scrim: linear-gradient(90deg, var(--raw-scrim-game-launch-start) 0%, var(--raw-scrim-game-launch-mid) 45%, var(--raw-scrim-game-launch-end-soft) 100%);
  --color-gradient-home-dashboard: linear-gradient(180deg, var(--color-tertiery) 0%, var(--color-surface-subtle) 45%, color-mix(in srgb, var(--color-accent-50) 50%, transparent) 100%);
`;

if (!theme.includes('--color-gradient-home-dashboard: linear-gradient(180deg, var(--color-tertiery)')) {
  theme = theme.replace(
    '  --color-payout-panel-bg: var(--mono-0);',
    `${caeloSemanticsPatch}  --color-payout-panel-bg: var(--mono-0);`,
  );
}

fs.writeFileSync(themePath, theme);

let changed = 0;
for (const dir of DIRS) {
  for (const file of walk(dir)) {
    const before = fs.readFileSync(file, 'utf8');
    const after = applyReplacements(before);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed += 1;
    }
  }
}

console.log(`Updated theme.css and ${changed} files under src/components + src/styles`);
