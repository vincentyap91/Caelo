/**
 * Replace remaining hardcoded hex/rgb and primitive var(--brand-*) in UI
 * with existing --color-* semantic tokens from theme.css.
 * Run: node scripts/migrate-remaining-colors-to-semantic.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TARGETS = [
  path.join(ROOT, 'src', 'components'),
  path.join(ROOT, 'src', 'styles'),
];

/** Longest match first */
const REPLACEMENTS = [
  // --- brand primitives → semantics ---
  ['var(--brand-700)', 'var(--color-surface-accent-hover)'],
  ['var(--brand-630)', 'var(--color-surface-mid-color)'],
  ['var(--brand-500)', 'var(--color-primary)'],

  // --- borders (panel / card chrome) ---
  ['border-[rgb(228_234_243)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(219_228_243)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(220_228_242)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(220_228_239)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(225_232_242)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(226_232_240)]', 'border-[var(--color-border-subtle)]'],
  ['border-t border-[rgb(229_235_244)]', 'border-t border-[var(--color-border-subtle)]'],
  ['border-b border-[rgb(228_234_243)]', 'border-b border-[var(--color-border-subtle)]'],
  ['border-r border-[rgb(214_188_113)]', 'border-r border-[var(--color-cta-border)]'],
  ['border-r border-[rgb(228_234_243)]', 'border-r border-[var(--color-border-subtle)]'],
  ['border-[rgb(214_188_113)]', 'border-[var(--color-cta-border)]'],
  ['border-[rgb(209_216_229)]', 'border-[var(--color-border-subtle)]'],
  ['hover:border-[rgb(183_194_215)]', 'hover:border-[var(--color-border-accent)]'],
  ['border-[rgb(171_204_235)]', 'border-[var(--color-border-accent)]'],
  ['border-[rgb(168_226_251)]', 'border-[var(--color-border-brand)]'],
  ['border-t border-[rgb(26_59_114)]', 'border-t border-[var(--color-surface-mid-container)]'],
  ['border-[rgb(61_125_203)]', 'border-[var(--color-border-brand)]'],
  ['divide-y divide-[rgb(228_234_243)]', 'divide-y divide-[var(--color-border-subtle)]'],

  // --- danger / warning tints ---
  ['border-[rgb(255_91_46_/_0.2)]', 'border-[var(--color-danger)]/20'],
  ['bg-[rgb(255_91_46_/_0.06)]', 'bg-[var(--color-danger)]/6'],
  ['bg-[rgb(255_91_46_/_0.12)]', 'bg-[var(--color-danger)]/12'],
  ['border-[rgb(57_181_74_/_0.24)] bg-[rgb(57_181_74_/_0.12)]', 'border-[var(--color-success)]/25 bg-[var(--color-success)]/12'],
  ['border-[rgb(245_194_66_/_0.28)] bg-[rgb(245_194_66_/_0.14)]', 'border-[var(--color-warning)]/30 bg-[var(--color-warning)]/15'],
  ['text-[rgb(179_121_16)]', 'text-[var(--color-text-sub-title)]'],
  ['border-[rgb(239_68_68_/_0.22)] bg-[rgb(239_68_68_/_0.1)]', 'border-[var(--color-danger)]/22 bg-[var(--color-danger)]/10'],
  ['text-[rgb(185_28_28)]', 'text-[var(--color-danger-red)]'],
  ['text-[rgb(173_49_24)]', 'text-[var(--color-danger-deep)]'],

  // --- overlays / surfaces ---
  ['bg-[rgb(2_11_31_/_0.68)]', 'bg-[var(--color-nav-overlay)]'],
  ['bg-[rgb(15_23_42_/_0.45)]', 'bg-[var(--color-overlay)]'],
  ['bg-[rgb(10_28_63)]', 'bg-[var(--color-surface-mid-color)]'],
  ['hover:bg-[rgb(8_26_66)]', 'hover:bg-[var(--color-surface-mid-container)]'],
  ['hover:border-[rgb(158_199_255_/_0.7)]', 'hover:border-[var(--color-nav-icon-hover)]/70'],
  ['hover:bg-[rgb(248_251_255)]', 'hover:bg-[var(--color-accent-50)]'],
  ['bg-[rgb(239_246_255_/_0.8)]', 'bg-[var(--color-accent-50)]/80'],
  ['bg-[rgb(239_246_255_/_0.5)]', 'bg-[var(--color-accent-50)]/50'],
  ['bg-[rgb(255_255_255_/_0.4)]', 'bg-[var(--color-tertiery)]/40'],
  ['bg-[#222222]', 'bg-[var(--color-surface-card-container)]'],
  ['bg-[#39FF88]', 'bg-[var(--color-success-vivid)]'],
  ['bg-[rgb(0_174_239_/_0.16)]', 'bg-[var(--color-accent-glow)]/40'],

  // --- text ---
  ['placeholder:text-[rgb(111_133_168)]', 'placeholder:text-[var(--color-text-soft)]'],
  ['text-[rgb(111_133_168)]', 'text-[var(--color-text-soft)]'],
  ['text-[rgb(79_125_183)]', 'text-[var(--color-text-brand-soft)]'],
  ['text-[rgb(42_58_88)]', 'text-[var(--color-text-secondary)]'],
  ['placeholder:text-[rgb(139_151_174)]', 'placeholder:text-[var(--color-text-soft)]'],
  ['text-[rgb(139_151_174)]', 'text-[var(--color-text-soft)]'],
  ['text-[rgb(95_110_139)]', 'text-[var(--color-text-muted)]'],
  ['text-[rgb(80_105_141)]', 'text-[var(--color-text-muted)]'],
  ['text-[rgb(255_185_104)]', 'text-[var(--color-warning)]'],
  ['font-bold text-[rgb(255_185_104)]', 'font-bold text-[var(--color-warning)]'],
  ['text-[rgb(133_72_20)]', 'text-[var(--color-text-warm)]'],
  ['text-[rgb(219_234_255)]', 'text-[var(--color-nav-text-soft)]'],
  ['text-[rgb(255_240_160)]', 'text-[var(--color-nav-accent-soft)]'],

  // --- focus rings ---
  ['focus-within:ring-[rgb(96_165_250_/_0.2)]', 'focus-within:ring-[var(--color-accent-400)]/20'],
  ['focus:ring-[rgb(96_165_250_/_0.25)]', 'focus:ring-[var(--color-accent-400)]/25'],
  ['focus:ring-[rgb(96_165_250_/_0.2)]', 'focus:ring-[var(--color-accent-400)]/20'],
  ['ring-[rgb(96_165_250_/_0.22)]', 'ring-[var(--color-accent-400)]/22'],
  ['ring-[rgb(31_93_168_/_0.25)]', 'ring-[var(--color-primary)]/25'],
  ['ring-offset-[rgb(29_51_84)]', 'ring-offset-[var(--color-surface-mid-container)]'],
  ['focus-visible:outline-[rgb(117_207_255)]', 'focus-visible:outline-[var(--color-nav-icon-hover)]'],
  ['hover:border-[rgb(111_197_255_/_0.75)]', 'hover:border-[var(--color-nav-icon-hover)]/75'],
  ['hover:border-[rgb(111_197_255_/_0.7)]', 'hover:border-[var(--color-nav-icon-hover)]/70'],

  // --- common shadows → theme utilities ---
  ['shadow-[0_6px_18px_rgba(20,43,87,0.09)]', 'shadow-[var(--shadow-live-card)]'],
  ['shadow-[0_6px_18px_rgba(15,23,42,0.05)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_4px_16px_rgba(15,23,42,0.05)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_4px_16px_rgba(15,23,42,0.04)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_4px_14px_rgba(15,23,42,0.04)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_4px_14px_rgba(255,91,46,0.06)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_2px_10px_rgba(15,23,42,0.03)]', 'shadow-[var(--shadow-input)]'],
  ['shadow-[0_2px_8px_rgba(15,23,42,0.04)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_8px_24px_rgba(15,23,42,0.08)]', 'shadow-[var(--shadow-card-soft)]'],
  ['shadow-[0_10px_24px_rgba(57_255_136_0.35)]', 'shadow-[var(--shadow-success)]'],
  ['shadow-[0_10px_24px_rgba(0,0,0,0.14)]', 'shadow-[var(--shadow-nav-pill)]'],
  ['shadow-[0_-4px_20px_rgba(0,0,0,0.15)]', 'shadow-[var(--shadow-nav-dropdown)]'],
  ['shadow-[0_24px_60px_rgba(0_0_0_0.45)]', 'shadow-[var(--shadow-modal)]'],
  ['shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)]', 'shadow-[var(--inset-panel)]'],
  ['shadow-[inset_0_1px_2px_rgba(9,30,66,0.06)]', 'shadow-[var(--inset-panel)]'],
  ['shadow-[inset_0_1px_2px_rgba(31,93,168,0.08)]', 'shadow-[var(--inset-panel)]'],
  ['drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]', 'drop-shadow-[var(--shadow-nav-pill)]'],
  ['drop-shadow-[0_1px_2px_rgba(15,23,42,0.12)]', 'drop-shadow-[var(--shadow-subtle)]'],
  ['drop-shadow-[0_2px_8px_rgba(15,35,72,0.12)]', 'drop-shadow-[var(--shadow-subtle)]'],

  // --- hex (from migrate-hex, extended) ---
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

  // --- second pass ---
  ['border-[rgb(223_231_242)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(201_208_224)]', 'border-[var(--color-border-subtle)]'],
  ['text-[rgb(67_84_114)]', 'text-[var(--color-text-secondary)]'],
  ['text-[rgb(78_94_122)]', 'text-[var(--color-text-muted)]'],
  ['text-[rgb(51_65_85)]', 'text-[var(--color-text-primary)]'],
  ['text-[rgb(100_116_139)]', 'text-[var(--color-text-muted)]'],
  ['text-[rgb(15_23_42)]', 'text-[var(--color-text-primary)]'],
  ['text-[rgb(118_129_151)]', 'text-[var(--color-text-soft)]'],
  ['text-[rgb(113_126_150)]', 'text-[var(--color-text-soft)]'],
  ['text-[rgb(77_114_145)]', 'text-[var(--color-text-brand-soft)]'],
  ['text-[rgb(53_91_143)]', 'text-[var(--color-text-brand)]'],
  ['text-[rgb(255_82_0)]', 'text-[var(--color-danger)]'],
  ['text-[rgb(173,49,24)]', 'text-[var(--color-danger-deep)]'],
  ['bg-[rgb(24_114_214)]', 'bg-[var(--color-secondary)]'],
  ['bg-[rgb(241_245_252)]', 'bg-[var(--color-surface-muted)]'],
  ['bg-[rgb(248_251_255)]', 'bg-[var(--color-accent-50)]'],
  ['bg-[rgb(247_250_255)]', 'bg-[var(--color-accent-50)]'],
  ['bg-[rgb(249_251_255)]', 'bg-[var(--color-accent-50)]'],
  ['bg-[rgb(244_251_255)]', 'bg-[var(--color-accent-50)]'],
  ['bg-[rgb(239_246_255)]', 'bg-[var(--color-accent-50)]'],
  ['border-[rgb(229_235_244)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(226_233_242)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(218_236_247)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(214_228_240)]', 'border-[var(--color-border-subtle)]'],
  ['border-[rgb(202_227_244)]', 'border-[var(--color-border-accent)]'],
  ['divide-y divide-[rgb(226_232_240)]', 'divide-y divide-[var(--color-border-subtle)]'],
  ['bg-[rgb(171_204_235)]', 'bg-[var(--color-border-accent)]'],
  ['border-[rgb(59_130_246_/_0.22)]', 'border-[var(--color-accent-500)]/22'],
  ['hover:bg-[rgb(0_174_239_/_0.1)]', 'hover:bg-[var(--color-brand-soft)]'],
  ['bg-[rgb(0_174_239_/_0.1)]', 'bg-[var(--color-brand-soft)]'],
  ['bg-[rgb(0_174_239_/_0.12)]', 'bg-[var(--color-brand-soft)]'],
  ['bg-[rgb(255_211_74)]', 'bg-[var(--color-accent-400)]'],
  ['border-[rgb(204_238_255_/_0.55)]', 'border-[var(--color-nav-border-soft)]'],
  ['border-[rgb(204_238_255_/_0.65)]', 'border-[var(--color-nav-border)]'],
  ['ring-[rgb(57_181_74_/_0.35)]', 'ring-[var(--color-success)]/35'],
  ['ring-[rgb(0_114_188_/_0.35)]', 'ring-[var(--color-primary)]/35'],
  ['bg-[#FFB800]', 'bg-[var(--color-accent-400)]'],
  ['bg-[#c6eeff]/75', 'bg-[var(--color-accent-100)]/75'],
  ['from-[#0080C8] to-[#005090]', 'from-[var(--color-primary)] to-[var(--color-surface-accent-hover)]'],
  ['bg-[rgb(255_91_46_/_0.05)]', 'bg-[var(--color-danger)]/5'],
  ['hover:bg-[rgb(255_91_46_/_0.08)]', 'hover:bg-[var(--color-danger)]/8'],
  ['bg-[rgb(57_181_74_/_0.12)]', 'bg-[var(--color-success)]/12'],
  ['bg-[rgb(236_253_245)]', 'bg-[var(--color-success-light)]'],
  ['ring-[rgb(57_181_74_/_0.12)]', 'ring-[var(--color-success)]/12'],
  ['bg-[rgb(57_181_74_/_0.1)]', 'bg-[var(--color-success)]/10'],
  ['bg-[rgb(255_241_237)]', 'bg-[var(--color-surface-subtle)]'],
  ['ring-[rgb(255_91_46_/_0.14)]', 'ring-[var(--color-danger)]/14'],
  ['bg-[rgb(255_91_46_/_0.1)]', 'bg-[var(--color-danger)]/10'],
  ['bg-[rgb(255_247_237)]', 'bg-[var(--color-accent-50)]'],
  ['ring-[rgb(255_77_0_/_0.14)]', 'ring-[var(--color-danger)]/14'],
  ['bg-[rgb(255_77_0_/_0.1)]', 'bg-[var(--color-danger)]/10'],
  ['ring-[rgb(59_130_246_/_0.14)]', 'ring-[var(--color-accent-500)]/14'],
  ['bg-[rgb(59_130_246_/_0.1)]', 'bg-[var(--color-accent-500)]/10'],
  ['shadow-[0_8px_24px_rgba(20,43,87,0.06)]', 'shadow-[var(--shadow-live-card)]'],
  ['shadow-[0_6px_14px_rgba(148,163,184,0.18)]', 'shadow-[var(--shadow-subtle)]'],
  ['shadow-[0_6px_14px_rgba(0,114,188,0.12)]', 'shadow-[var(--shadow-brand-soft)]'],
  ['shadow-[0_8px_18px_rgba(0,114,188,0.10)]', 'shadow-[var(--shadow-brand-soft)]'],
  ['shadow-[0_18px_36px_rgba(255,178,45,0.4)]', 'shadow-[var(--shadow-cta)]'],
  ['shadow-[0_10px_24px_rgba(57,181,74,0.14)]', 'shadow-[var(--shadow-success)]'],
  ['shadow-[0_10px_24px_rgba(255,91,46,0.14)]', 'shadow-[var(--shadow-hot)]'],
  ['shadow-[0_10px_24px_rgba(255,77,0,0.12)]', 'shadow-[var(--shadow-hot)]'],
  ['shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_22px_rgba(0,114,188,0.08)]', 'shadow-[var(--inset-white-glow),var(--shadow-brand-soft)]'],
  ['shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]', 'shadow-[var(--inset-highlight-soft)]'],
  ['shadow-[0_8px_14px_rgba(242,154,0,0.22)]', 'shadow-[var(--shadow-cta-soft)]'],
  ['shadow-[0_6px_18px_rgba(20,43,87,0.08)]', 'shadow-[var(--shadow-live-card)]'],
  ['shadow-[0_8px_24px_rgba(20,43,87,0.05)]', 'shadow-[var(--shadow-live-card)]'],
  ['shadow-[0_4px_14px_rgba(255,174,39,0.22)]', 'shadow-[var(--shadow-cta-soft)]'],
  ['shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]', 'shadow-[var(--inset-highlight-soft)]'],
  ['shadow-[0_20px_44px_rgba(0,16,56,0.45)]', 'shadow-[var(--shadow-nav-dropdown)]'],
  ['shadow-[0_4px_12px_rgba(242,154,0,0.18)]', 'shadow-[var(--shadow-cta-soft)]'],
  ['shadow-[0_5px_15px_rgba(0,174,239,0.1)]', 'shadow-[var(--shadow-brand-soft)]'],
  ['shadow-[0_8px_14px_rgba(18,59,148,0.35)]', 'shadow-[var(--shadow-nav-pill)]'],
  ['shadow-[0_8px_20px_rgba(0,114,188,0.08)]', 'shadow-[var(--shadow-brand-soft)]'],
  ['shadow-[0_10px_24px_rgba(0,114,188,0.12)]', 'shadow-[var(--shadow-brand-soft)]'],
  ['shadow-[0_6px_14px_rgba(242,154,0,0.28)]', 'shadow-[var(--shadow-cta-soft)]'],
  ['shadow-[0_4px_10px_rgba(255,77,0,0.4)]', 'shadow-[var(--shadow-hot)]'],
  ['shadow-[0_6px_14px_rgba(37,99,235,0.18)]', 'shadow-[var(--shadow-accent)]'],
  ['shadow-[0_2px_12px_rgba(15,23,42,0.1)]', 'shadow-[var(--shadow-card-soft)]'],
  ['shadow-[inset_0_1px_0_rgba(15,23,42,0.04)]', 'shadow-[var(--inset-panel)]'],
  ['shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]', 'shadow-[var(--inset-highlight-soft)]'],
  ['shadow-[0_0_0_4px_rgba(37,99,235,0.12)]', 'shadow-[0_0_0_4px_var(--color-accent-500)]/12'],
  ['shadow-[0_0_0_4px_rgba(255,216,77,0.18)]', 'shadow-[0_0_0_4px_var(--color-accent-400)]/18'],
  ['drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)]', 'drop-shadow-[var(--shadow-nav-pill)]'],
  ['drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]', 'drop-shadow-[var(--shadow-subtle)]'],
  ['drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]', 'drop-shadow-[var(--shadow-subtle)]'],
  ['drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]', 'drop-shadow-[var(--shadow-subtle)]'],
  ['drop-shadow-[0_2px_3px_rgba(8,26,66,0.35)]', 'drop-shadow-[var(--shadow-nav-pill)]'],
  ['shadow-[0_0_15px_rgba(255,255,255,0.4)]', 'shadow-[var(--inset-white-glow)]'],
  ['fill-white', 'fill-[var(--color-tertiery)]'],
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(jsx|tsx|css)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

let changed = 0;
for (const dir of TARGETS) {
  for (const file of walk(dir)) {
    if (file.includes('ReferralStep3dIcons')) continue;
    let text = fs.readFileSync(file, 'utf8');
    const before = text;
    for (const [from, to] of REPLACEMENTS) {
      if (text.includes(from)) text = text.split(from).join(to);
    }
    if (text !== before) {
      fs.writeFileSync(file, text);
      changed += 1;
      console.log(path.relative(ROOT, file));
    }
  }
}

console.log(`\nUpdated ${changed} files.`);
