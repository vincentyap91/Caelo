// ─── Theme Editor Configuration ──────────────────────────────────────────────
// Basic mode: high-level brand primitives
// Advanced mode: full semantic tokens grouped by category

export const BASIC_CONTROLS = [
  { label: 'Primary', variable: '--color-primary', defaultValue: '#123B94' },
  { label: 'Secondary', variable: '--color-button-hover', defaultValue: '#0d2a6a' },
  { label: 'Background', variable: '--color-surface-base', defaultValue: '#ffffff' },
  { label: 'Text', variable: '--color-text-primary', defaultValue: '#0f172a' },
  { label: 'CTA Accent', variable: '--color-button-cta-start', defaultValue: '#ffcf4a' },
];

export const ADVANCED_GROUPS = [
  {
    id: 'brand',
    label: 'Brand',
    variables: [
      { label: 'Brand Primary', variable: '--color-primary', defaultValue: '#123B94' },
      { label: 'Brand Secondary', variable: '--color-button-hover', defaultValue: '#0d2a6a' },
      { label: 'Brand Deep', variable: '--brand-700', defaultValue: '#01206C' },
      { label: 'Brand Soft', variable: '--color-surface-cool-light', defaultValue: '#E5F6FF' },
      { label: 'Brand Soft Border', variable: '--color-border-brand', defaultValue: '#CCEEFF' },
      { label: 'Brand Line', variable: '--color-border-brand', defaultValue: '#7AD0F5' },
    ],
  },
  {
    id: 'surfaces',
    label: 'Surfaces',
    variables: [
      { label: 'Surface Base', variable: '--color-surface-base', defaultValue: '#ffffff' },
      { label: 'Surface Muted', variable: '--color-surface-cool-light', defaultValue: '#f8fafc' },
      { label: 'Surface Subtle', variable: '--color-surface-subtle', defaultValue: '#f8fbff' },
      { label: 'Surface Panel', variable: '--color-surface-panel', defaultValue: '#f0f9ff' },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    variables: [
      { label: 'Text Strong', variable: '--color-text-primary', defaultValue: '#0f172a' },
      { label: 'Text Main', variable: '--color-text-secondary', defaultValue: '#334155' },
      { label: 'Text Subtle', variable: '--color-text-subtle', defaultValue: '#475569' },
      { label: 'Text Muted', variable: '--color-text-muted', defaultValue: '#64748b' },
      { label: 'Text Soft', variable: '--color-text-soft', defaultValue: '#94a3b8' },
      { label: 'Text Brand', variable: '--color-text-primary-card-title', defaultValue: '#123B94' },
    ],
  },
  {
    id: 'borders',
    label: 'Borders',
    variables: [
      { label: 'Border Default', variable: '--color-border-subtle', defaultValue: '#e2e8f0' },
      { label: 'Border Accent', variable: '--color-border-brand', defaultValue: '#dbeafe' },
      { label: 'Border Brand', variable: '--color-border-brand', defaultValue: '#cfe0f9' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    variables: [
      { label: 'Nav Top', variable: '--color-primary', defaultValue: '#123B94' },
      { label: 'Nav Main', variable: '--color-primary', defaultValue: '#123B94' },
      { label: 'Nav Gold', variable: '--color-accent', defaultValue: '#ffd84d' },
      { label: 'Nav Gold Soft', variable: '--color-accent-yellow', defaultValue: '#ffe27d' },
      { label: 'Nav Text Soft', variable: '--color-text-sticky-nav-text', defaultValue: '#d3eaff' },
      { label: 'Nav Text Accent', variable: '--color-text-sticky-nav-active', defaultValue: '#8ad4ff' },
      { label: 'Nav Blue Icon', variable: '--color-text-sticky-nav-text', defaultValue: '#1f83ff' },
      { label: 'Nav Badge', variable: '--color-primary', defaultValue: '#2c66c3' },
    ],
  },
  {
    id: 'cta',
    label: 'CTA & Actions',
    variables: [
      { label: 'CTA Start', variable: '--color-button-cta-start', defaultValue: '#ffcf4a' },
      { label: 'CTA End', variable: '--color-button-cta-end', defaultValue: '#ffb22d' },
      { label: 'CTA Strong Start', variable: '--color-button-cta-start', defaultValue: '#ffcc33' },
      { label: 'CTA Strong End', variable: '--color-button-cta-end', defaultValue: '#f29a00' },
      { label: 'CTA Border', variable: '--color-border-brand', defaultValue: '#f0bb3d' },
      { label: 'CTA Focus', variable: '--color-text-cta-inverse', defaultValue: '#ffd166' },
      { label: 'CTA Text', variable: '--color-text-cta-inverse', defaultValue: '#0c4a8e' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    variables: [
      { label: 'Success', variable: '--color-success', defaultValue: '#39B54A' },
      { label: 'Success Hover', variable: '--color-success-strong', defaultValue: '#2e9e3c' },
      { label: 'Danger', variable: '--color-danger', defaultValue: '#ff5b2e' },
    ],
  },
  {
    id: 'pages',
    label: 'Page Backgrounds',
    variables: [
      { label: 'Home Page', variable: '--color-surface-cool-light', defaultValue: '#e6f4fd' },
      { label: 'Register Page', variable: '--color-surface-cool-light', defaultValue: '#edf4ff' },
      { label: 'Account Page', variable: '--color-surface-cool-light', defaultValue: '#eaf1fb' },
      { label: 'Default Page', variable: '--color-surface-base', defaultValue: '#f2f4f8' },
    ],
  },
  {
    id: 'elevation',
    label: 'Elevation & Gradients',
    variables: [
      { label: 'Modal Header BG', variable: '--color-popup-head', defaultValue: '#e8eef6' },
      { label: 'CTA Gradient', variable: '--color-gradient-button-cta', defaultValue: 'linear-gradient(180deg, #ffcf4a 0%, #ffb22d 100%)' },
      { label: 'Register Page Gradient', variable: '--color-gradient-referral-panel', defaultValue: 'linear-gradient(180deg, #e8f4ff 0%, #f3f7ff 45%, #ecf3ff 100%)' },
      { label: 'Footer Gradient', variable: '--color-gradient-side-menu-brand', defaultValue: 'linear-gradient(180deg, #123B94 0%, #123B94 100%)' },
      { label: 'Side Menu Brand Gradient', variable: '--color-gradient-side-menu-brand', defaultValue: 'linear-gradient(180deg, #123B94 0%, #01206C 100%)' },
      { label: 'Referral Panel Gradient', variable: '--color-gradient-referral-panel', defaultValue: 'linear-gradient(180deg, #e8f4ff 0%, #f3f7ff 45%, #ecf3ff 100%)' },
      { label: 'Home CTA Gradient', variable: '--color-gradient-home-cta', defaultValue: 'linear-gradient(90deg, #123B94 0%, #0d2a6a 100%)' },
    ],
  },
];

// Collect ALL variables from both modes for persistence
export function getAllVariables() {
  const all = {};
  BASIC_CONTROLS.forEach(({ variable, defaultValue }) => { all[variable] = defaultValue; });
  ADVANCED_GROUPS.forEach((g) => g.variables.forEach(({ variable, defaultValue }) => { all[variable] = defaultValue; }));
  return all;
}

// ─── Smart Linking ──────────────────────────────────────────────────────────
// Given a hex color, derive related colors automatically.

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Derive linked variables from a basic-mode change.
 * Returns a map of { variableName: suggestedHexValue }.
 */
export function deriveLinkedColors(variable, hexValue) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hexValue)) return {};
  const [h, s, l] = hexToHSL(hexValue);
  const derived = {};

  if (variable === '--color-primary') {
    derived['--color-button-hover'] = hslToHex(h, s, Math.max(l - 12, 5));
    derived['--brand-700'] = hslToHex(h, s, Math.max(l - 20, 3));
    derived['--color-surface-cool-light'] = hslToHex(h, Math.min(s + 10, 100), Math.min(l + 55, 95));
    derived['--color-primary'] = hexValue;
    derived['--color-text-primary-card-title'] = hexValue;
    derived['--color-prime-light'] = hexValue;
    derived['--color-prime-dark'] = hslToHex(h, s, Math.max(l - 12, 5));
  }

  if (variable === '--color-surface-base') {
    const isLight = l > 50;
    if (isLight) {
      derived['--color-surface-cool-light'] = hslToHex(h, Math.max(s - 5, 0), Math.max(l - 2, 90));
      derived['--color-surface-subtle'] = hslToHex(h, Math.max(s - 3, 0), Math.max(l - 1, 92));
      derived['--color-surface-panel'] = hslToHex(h, Math.min(s + 5, 100), Math.max(l - 4, 88));
    }
  }

  if (variable === '--color-text-primary') {
    derived['--color-text-secondary'] = hslToHex(h, Math.max(s - 10, 0), Math.min(l + 14, 90));
    derived['--color-text-subtle'] = hslToHex(h, Math.max(s - 15, 0), Math.min(l + 22, 90));
    derived['--color-text-muted'] = hslToHex(h, Math.max(s - 20, 0), Math.min(l + 32, 90));
    derived['--color-text-soft'] = hslToHex(h, Math.max(s - 25, 0), Math.min(l + 45, 90));
  }

  if (variable === '--color-button-cta-start') {
    derived['--color-button-cta-end'] = hslToHex(h, Math.min(s + 5, 100), Math.max(l - 8, 10));
    derived['--color-border-brand'] = hslToHex(h, Math.max(s - 5, 0), Math.max(l - 5, 10));
    derived['--color-text-cta-inverse'] = hslToHex(h, Math.max(s - 10, 0), Math.min(l + 5, 95));
  }

  return derived;
}
