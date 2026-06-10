/**
 * Replace Caelo-only --color-* refs with Riocity semantic names in src/.
 * Run: node scripts/migrate-caelo-token-refs.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const ALLOW = new Set(
  [...fs.readFileSync(path.join(SRC, 'theme-riocity.css'), 'utf8').matchAll(/^\s*(--color-[^:]+):/gm)].map(
    (m) => m[1]
  )
);

const REPLACEMENTS = [
  ['--color-text-brand-soft', '--color-text-secondary'],
  ['--color-text-brand', '--color-text-primary-card-title'],
  ['--color-accent-800', '--color-accent'],
  ['--color-accent-700', '--color-button-hover'],
  ['--color-accent-600', '--color-button-hover'],
  ['--color-accent-500', '--color-accent'],
  ['--color-accent-400', '--color-accent'],
  ['--color-accent-300', '--color-border-subtle'],
  ['--color-accent-200', '--color-accent-glow'],
  ['--color-accent-100', '--color-accent-glow'],
  ['--color-accent-50', '--color-accent-pale'],
  ['--gradient-cta', '--color-gradient-button-cta'],
  ['--color-cta-text', '--color-text-cta-inverse'],
  ['--color-cta-focus', '--color-text-cta-inverse'],
  ['--color-cta-border', '--color-border-brand'],
  ['--color-cta-strong-end', '--color-button-cta-end'],
  ['--color-cta-strong-start', '--color-button-cta-start'],
  ['--color-cta-auth-end', '--color-button-cta-end'],
  ['--color-cta-auth-start', '--color-button-cta-start'],
  ['--color-cta-end', '--color-button-cta-end'],
  ['--color-cta-start', '--color-button-cta-start'],
  ['--color-button-menu-selected-text', '--color-text-cta-inverse'],
  ['--color-button-menu-selected-border', '--color-border-brand'],
  ['--color-button-menu-selected-bg', '--color-gradient-button-cta'],
  ['--color-button-menu-hover-shadow', '--color-effect-glow'],
  ['--color-button-menu-hover-text', '--color-text-card-text'],
  ['--color-button-menu-hover-bg', '--color-surface-accent-hover'],
  ['--color-nav-surface', '--color-sticky-nav'],
  ['--color-nav-overlay', '--color-overlay-strong'],
  ['--color-nav-badge', '--color-primary'],
  ['--color-nav-icon-hover', '--color-text-sticky-nav-active'],
  ['--color-nav-icon', '--color-text-sticky-nav-text'],
  ['--color-nav-text-accent', '--color-text-sticky-nav-active'],
  ['--color-nav-text-soft', '--color-text-sticky-nav-text'],
  ['--color-nav-accent-soft', '--color-accent-yellow'],
  ['--color-nav-tile-border-hover', '--color-border-brand'],
  ['--color-nav-tile-border', '--color-border-subtle'],
  ['--color-nav-border-soft', '--color-border-subtle'],
  ['--color-nav-border', '--color-border-brand'],
  ['--color-page-default', '--color-surface-base'],
  ['--color-page-account', '--color-surface-cool-light'],
  ['--color-page-register', '--color-surface-cool-light'],
  ['--color-page-home', '--color-surface-cool-light'],
  ['--color-surface-subtle-app', '--color-surface-subtle'],
  ['--color-surface-muted-soft', '--color-surface-float'],
  ['--color-surface-muted', '--color-surface-cool-light'],
  ['--color-surface-base-85', '--color-surface-base'],
  ['--color-surface-base-80', '--color-surface-base'],
  ['--color-brand-soft-border', '--color-border-brand'],
  ['--color-brand-soft', '--color-surface-cool-light'],
  ['--color-brand-line', '--color-border-brand'],
  ['--color-border-accent', '--color-border-brand'],
  ['--color-border-live', '--color-border-subtle'],
  ['--color-wash-400', '--color-surface-cool-light'],
  ['--color-success-hover', '--color-success-strong'],
  ['--color-payout-amount', '--color-text-recent-amount'],
  ['--color-payout-highlight', '--color-text-primary-card-title'],
  ['--color-payout-title', '--color-text-primary'],
  ['--color-payout-card-bg', '--color-accent-pale'],
  ['--color-payout-panel-shadow', '--color-effect-glow'],
  ['--color-payout-panel-border', '--color-border-brand'],
  ['--color-payout-panel-bg', '--color-surface-base'],
  ['--color-universal-modal-card-border', '--color-border-brand'],
  ['--color-universal-modal-game-body-bg', '--color-popup-body'],
  ['--color-universal-modal-header-text', '--color-text-primary-card-title'],
  ['--color-universal-modal-header-bg', '--color-popup-head'],
  ['--color-scrim-rollover-panel', '--color-overlay'],
  ['--color-icon-rtp-trend-down', '--color-danger-red'],
  ['--color-icon-rtp-trend-up', '--color-success'],
  // gradient utilities → nearest Riocity gradient
  ['--color-gradient-register-panel', '--color-gradient-referral-panel'],
  ['--color-gradient-register-page', '--color-gradient-referral-panel'],
  ['--color-gradient-account-shell', '--color-gradient-home-dashboard'],
  ['--color-gradient-live-page-content', '--color-gradient-card-brand'],
  ['--color-gradient-live-page', '--color-gradient-card-brand'],
  ['--color-gradient-soft-blue-panel', '--color-gradient-home-muted'],
  ['--color-gradient-blue-panel', '--color-gradient-home-muted'],
  ['--color-gradient-soft-panel', '--color-gradient-home-muted'],
  ['--color-gradient-brand-soft-horizontal', '--color-gradient-home-muted'],
  ['--color-gradient-brand-soft-panel-alt', '--color-gradient-home-muted'],
  ['--color-gradient-brand-soft-panel', '--color-gradient-home-muted'],
  ['--color-gradient-nav-cta', '--color-gradient-home-cta'],
  ['--color-gradient-mobile-cta', '--color-gradient-home-cta'],
  ['--color-gradient-button-cta-strong', '--color-gradient-button-cta'],
  ['--color-gradient-vip-nav-pill-hover', '--color-gradient-menu-brand'],
  ['--color-gradient-vip-nav-pill', '--color-gradient-menu-brand'],
  ['--color-gradient-language-nav', '--color-gradient-menu-brand'],
  ['--color-gradient-app-download-inner', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-shell', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-qr', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-preview', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-button', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-section', '--color-gradient-home-highlight'],
  ['--color-gradient-app-download-phone', '--color-gradient-home-highlight'],
  ['--color-gradient-promo-card-desktop', '--color-gradient-home-highlight'],
  ['--color-gradient-promo-card', '--color-gradient-home-highlight'],
  ['--color-gradient-content-hero-mobile-fade', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-spotlight', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-bottom', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-scrim-md', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-scrim', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-blob', '--color-gradient-home-card'],
  ['--color-gradient-content-hero-top', '--color-gradient-home-card'],
  ['--color-gradient-referral-glow-top', '--color-gradient-home-card'],
  ['--color-gradient-referral-glow-right', '--color-gradient-home-card'],
  ['--color-gradient-referral-glow-left', '--color-gradient-home-card'],
  ['--color-gradient-favourite-active-hover', '--color-gradient-sports-card'],
  ['--color-gradient-favourite-active', '--color-gradient-sports-card'],
  ['--color-gradient-favourite-inactive-hover', '--color-gradient-sports-card'],
  ['--color-gradient-favourite-inactive', '--color-gradient-sports-card'],
  ['--color-gradient-game-card-glow-strong', '--color-gradient-sports-card'],
  ['--color-gradient-game-card-glow-soft', '--color-gradient-sports-card'],
  ['--color-gradient-game-card-overlay', '--color-gradient-sports-card'],
  ['--color-gradient-scrollbar-thumb-active', '--color-gradient-table'],
  ['--color-gradient-scrollbar-thumb-hover', '--color-gradient-table'],
  ['--color-gradient-scrollbar-thumb', '--color-gradient-table'],
  ['--color-gradient-scrollbar-track', '--color-gradient-table'],
  ['--color-gradient-logout-hover', '--color-gradient-tag'],
  ['--color-gradient-logout-default', '--color-gradient-tag'],
  ['--color-gradient-accent-tab', '--color-gradient-menu-brand'],
  ['--color-gradient-accent-avatar', '--color-gradient-home-muted'],
  ['--color-gradient-surface-accent', '--color-gradient-home-muted'],
  ['--color-gradient-surface-muted', '--color-gradient-home-muted'],
  ['--color-gradient-surface-card', '--color-gradient-home-muted'],
  ['--color-gradient-scroll-top', '--color-gradient-home-cta'],
  ['--color-gradient-error-action', '--color-gradient-button-cta'],
  ['--color-gradient-error-icon', '--color-gradient-home-muted'],
  ['--color-gradient-error-shell', '--color-gradient-home-muted'],
  ['--color-gradient-rewards-highlight', '--color-gradient-home-muted'],
  ['--color-gradient-rewards-footer', '--color-gradient-home-muted'],
  ['--color-gradient-rewards-accent-footer', '--color-gradient-home-muted'],
  ['--color-gradient-rewards-panel', '--color-gradient-home-muted'],
  ['--color-gradient-wallet-shell', '--color-gradient-home-muted'],
  ['--color-gradient-wallet-panel', '--color-gradient-home-muted'],
  ['--color-gradient-wallet-glass', '--color-gradient-home-muted'],
  ['--color-gradient-rollover-warn', '--color-gradient-home-muted'],
  ['--color-gradient-modal-shell', '--color-gradient-home-muted'],
  ['--color-gradient-game-stage', '--color-gradient-home-muted'],
  ['--color-gradient-hero-fade-left', '--color-gradient-home-muted'],
  ['--color-gradient-lottery-header', '--color-gradient-card-brand'],
  ['--color-gradient-progress-fill', '--color-gradient-home-cta'],
  ['--color-gradient-success-icon', '--color-gradient-home-highlight'],
  ['--color-gradient-language-option-active', '--color-gradient-menu-brand'],
  ['--color-gradient-language-panel-radial-light', '--color-gradient-home-card'],
  ['--color-gradient-language-panel-radial', '--color-gradient-home-card'],
  ['--color-gradient-language-panel-top-light', '--color-gradient-home-card'],
  ['--color-gradient-language-panel-top', '--color-gradient-home-card'],
  ['--color-gradient-promo-bottom-glow-soft', '--color-gradient-home-card'],
  ['--color-gradient-promo-bottom-glow', '--color-gradient-home-card'],
  ['--color-gradient-promo-overlay', '--color-gradient-home-card'],
  ['--color-gradient-card-shine', '--color-gradient-home-card'],
  ['--color-gradient-footer', '--color-gradient-menu-brand'],
  ['--color-gradient-floating-social', '--color-gradient-menu-brand'],
  ['--color-gradient-vip-tier-avatar', '--color-gradient-home-highlight'],
  ['--color-gradient-vip-tier-muted', '--color-gradient-home-muted'],
  ['--color-gradient-vip-badge', '--color-gradient-home-highlight'],
  ['--color-gradient-rewards-scratch', '--color-gradient-card-brand'],
  ['--color-gradient-live-chat-header', '--color-gradient-home-card'],
  ['--color-gradient-nav-radial-top', '--color-gradient-home-card'],
  ['--color-gradient-notification-shine', '--color-gradient-home-card'],
];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', 'dist', 'assets'].includes(e.name)) walk(p, acc);
    else if (/\.(jsx?|tsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const SKIP = new Set([
  path.join(SRC, 'theme.css'),
  path.join(SRC, 'theme-riocity.css'),
]);

let filesChanged = 0;
let totalReplacements = 0;

for (const file of walk(SRC).filter((f) => !SKIP.has(f))) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of REPLACEMENTS) {
    if (!text.includes(from)) continue;
    const n = text.split(from).length - 1;
    text = text.split(from).join(to);
    totalReplacements += n;
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    filesChanged++;
  }
}

// Report remaining disallowed tokens
const remaining = {};
for (const file of walk(SRC).filter((f) => !SKIP.has(f))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/var\(\s*(--color-[a-z0-9-]+)/g)) {
    const name = m[1];
    if (!ALLOW.has(name)) {
      remaining[name] = remaining[name] || [];
      remaining[name].push(path.relative(ROOT, file).replace(/\\/g, '/'));
    }
  }
}

console.log(`Updated ${filesChanged} files, ${totalReplacements} replacements`);
const bad = Object.entries(remaining).sort((a, b) => b[1].length - a[1].length);
console.log(`Remaining disallowed tokens: ${bad.length}`);
for (const [name, files] of bad.slice(0, 40)) {
  console.log(`  ${name} (${files.length}): ${files.slice(0, 3).join(', ')}${files.length > 3 ? '…' : ''}`);
}
