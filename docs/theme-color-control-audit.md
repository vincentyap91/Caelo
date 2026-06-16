# Theme color control audit

**Migration rules:** [VARIABLE-RULES.en.md §13](../VARIABLE-RULES.en.md#13-caelo-integration-riocity-semantic-names--caelo-values) (EN) · [VARIABLE-RULES.md §13](../VARIABLE-RULES.md#13-caelo-接入riocity-semantic-名字--caelo-色值) (中文)

**Generated:** 2026-06-05  
**Scope:** `src/**/*.{jsx,tsx,css}` (207 files)  
**Token source of truth:** `src/theme.css` (`--color-*` semantics) + `src/styles/theme.css` (utilities, `--shadow-*`, gradient classes)  
**Machine-readable data:** `docs/theme-color-audit-data.json` (from `node scripts/audit-theme-color-control.mjs`)

---

## Executive summary

| Metric | Count |
|--------|------:|
| Files scanned | 207 |
| Files using `--color-*` semantics | 117 |
| Total `--color-*` references | 3,303 |
| Files with any bypass pattern (raw scan) | 88 |
| **Production files needing migration (estimated)** | **~42** |

**Overall:** Semantic token adoption is strong across layout, nav, account, and game surfaces. Remaining bypasses cluster in four areas: **inline `style={{}}` colors**, **arbitrary Tailwind shadows/rings**, **illustrative inline SVGs**, and **shared constants** (`navStickyOffsets.js`, `pageBannerClasses.js`). Dev-only **Theme Editor** files account for ~200 raw findings and are intentionally deprioritized.

**False positives excluded from issue counts below:**
- `bg-gradient-*` utility classes defined in `src/styles/theme.css` (they map to `var(--color-gradient-*)`)
- `src/theme.css` and `src/styles/theme.css` (token / utility definition layers)
- `src/assets/**` static brand SVGs (third-party logos, clip rects)
- Percentage strings mistaken for colors (e.g. VIP rebate `"0.55%"`)

---

## Findings by category

### 1. Inline styles with hardcoded colors — **P0 (highest priority)**

Inline styles bypass Tailwind and are hardest to theme centrally.

| File | Literals | Suggested tokens |
|------|----------|------------------|
| `src/components/ErrorBoundary.jsx` | `#fff`, `#0f172a`, `#64748b`, `#334155`, `#e2e8f0`, `#cbd5e1`, `#f8fafc`, `rgba(15,23,42,0.10)` | `--color-surface-base`, `--color-text-tertiary`, `--color-text-muted`, `--color-text-secondary`, `--color-border-subtle`, `--color-surface-muted`, `--shadow-card-raised` |
| `src/components/ui/CountdownTimer.jsx` | `rgba(0,0,0,0.10)` divider, gold panel `rgba(255,255,255,0.72)` / `rgba(255,248,230,0.55)`, border `rgba(255,200,60,0.5)`, `drop-shadow(…rgba(242,154,0,0.30))` | `--color-border-subtle`, `--color-gradient-countdown-panel` (new alias), `--shadow-cta-soft` |
| `src/components/referral/DownlineDetailModal.jsx` | `rgba(0,0,0,0.55)` backdrop | `--color-overlay-backdrop` (new alias, see §4) |
| `src/components/theme-editor/ThemeEditorShowcase.jsx` | `#0f172a`, `#e2e8f0` in dark preview | `--color-surface-base-dark`, `--color-border-subtle` |
| `src/components/ThemeEditor.jsx` | ~88 slate/indigo/amber hex literals | Dev tool — migrate last; use editor chrome tokens |

**Count:** 6 production files + 1 dev file.

---

### 2. Arbitrary Tailwind shadows with embedded rgba — **P1**

These duplicate values already defined as `--shadow-*` in `src/styles/theme.css`.

| Literal (repeated) | Existing token | Files |
|--------------------|----------------|-------|
| `shadow-[0_4px_12px_rgba(15,23,42,0.04)]` | `--shadow-subtle` (close) / new `--shadow-control-bar` | `AccountSidebar.jsx`, `FavouritesPage.jsx` |
| `shadow-[0_2px_10px_rgba(15,23,42,0.04)]` | `--shadow-subtle` | `SlotBrowseFilterModal.jsx` |
| `shadow-[0_6px_14px_rgba(15,23,42,0.08)]` | `--shadow-card-raised` | `LanguageSwitcher.jsx` |
| `shadow-[0_4px_12px_rgba(0,0,0,0.1)]` | `--shadow-card-soft` | `HeroSection.jsx` |
| `shadow-[0_8px_16px_rgba(0,114,188,0.24)]` | `--shadow-nav-top` | `ScrollToTop.jsx` |
| `shadow-[0_5px_15px_rgba(0,174,239,0.05)]` | `--shadow-brand-soft` | `FeaturesRow.jsx` |
| `shadow-[inset_0_1px_0_rgba(255,255,255,0.38/0.45/0.06/0.08)]` | `--inset-white-glow`, `--inset-highlight-soft/strong` | `RolloverStatusCard.jsx`, `VipStatusPill.jsx` |
| `shadow-[0_12px_24px_rgba(255,178,45,0.16)]` | `--shadow-cta-soft` | `PromotionWarningModal.jsx` |
| WhatsApp button shadows | `--shadow-success` (partial) | `LoginModal.jsx`, `RegisterPage.jsx` |
| Nav provider glow composite | new `--shadow-nav-provider-tile` | `NavProviderDropdownPanel.jsx` |
| Referral icon drops | `--shadow-accent-avatar`, `--shadow-cta-soft` | `referral.jsx` |
| Sticky nav bar shadows | `--shadow-live-banner` / new aliases | `constants/navStickyOffsets.js` |

**Count:** 25 instances across 15 files.

---

### 3. `ring-white/*` and Tailwind palette literals — **P1**

| Pattern | Files | Replacement |
|---------|-------|-------------|
| `ring-white/10` | `GameCategoryNavigation.jsx`, `LanguageSwitcher.jsx` | `ring-[var(--color-ring-on-dark)]/10` or `--color-ring-subtle` utility |
| `ring-white/20` | `ScrollToTop.jsx` | `--color-ring-highlight` |
| `ring-white/70` | `PushNotificationToast.jsx` | `--color-ring-panel` |
| `ring-2 ring-white` | `MobileHomeBottomNav.jsx` | `ring-[var(--color-tertiery)]` |
| `outline-white/60` | `GameDetailPlayModal.jsx` | `outline-[var(--color-ring-on-dark)]/60` |
| `border-slate-200/90` | `constants/navStickyOffsets.js` | `border-[var(--color-border-subtle)]/90` |

**Count:** 8 Tailwind white/black utility hits (5 ring + 1 outline + 1 border-slate + 1 in constants). No `bg-red-500` / `text-slate-700` palette literals found in JSX.

---

### 4. Arbitrary gradient/color in components — **P1**

| File | Literal | Suggested token |
|------|---------|-----------------|
| `RewardsSection.jsx` | `bg-[repeating-linear-gradient(…,rgb(255_255_255_/_0.06)…)]` | `--color-surface-scratch-stripe` (alias to `--raw-scrim-white-04` or similar) |

### 5. Arbitrary `bg-[rgb(...)]` in constants — **P1**

| File | Literal | Suggested token |
|------|---------|-----------------|
| `constants/navStickyOffsets.js` | `bg-[rgb(255_255_255_/_0.98)]`, `0.95` | `--raw-scrim-panel-98`, `--raw-scrim-panel-96` via `--color-surface-sticky-nav` |
| `constants/pageBannerClasses.js` | `bg-[rgb(221_232_248)]`, `bg-[rgb(216_227_242)]` | `--color-surface-banner-placeholder` (alias to existing raw blue-gray) |

---

### 6. Legacy `styles/theme.css` color aliases in components — **P2**

Some components reference non-semantic color vars defined only in `src/styles/theme.css` (not `src/theme.css`):

| Legacy var | Suggested semantic |
|------------|-------------------|
| `--base-ink` | `--color-text-primary` |
| `--base-paper`, `--surface-base` | `--color-surface-base` |
| `--border-default` | `--color-border-subtle` |
| `--text-muted` | `--color-text-muted` |
| `--ref-10`, `--ref-30` | `--color-surface-muted`, `--color-border-subtle` |

Direct `--brand-*` in components is rare (mostly `ThemeEditor*`).

### 7. CSS keyframe / animation literals — **P2**

| File | Literals | Notes |
|------|----------|-------|
| `src/index.css` | `rgba(255, 189, 59, 0.12/0.35)` in `@keyframes riocity-claim-pulse` | Move to `--shadow-cta-pulse-start/end` aliases |
| `src/styles/theme.css` | rgba inside `--shadow-*` definitions | **Expected** at token layer — do not migrate components |

---

### 8. Direct primitive `var(--mono-*)` / `var(--brand-*)` in components — **P2**

Only **2** component hits (prefer `--color-*` wrappers):

- Grep found minimal direct primitive usage in JSX; most code already uses semantics.
- Watch for new code using `--gradient-cta` vs `--color-gradient-button-cta` — both exist; standardize on `--color-gradient-*` in class utilities.

---

### 9. `bg-gradient-to-*` with semantic stops — **acceptable**

Patterns like `from-[var(--color-accent-400)] to-[var(--color-accent-600)]` in `DepositPage.jsx` and `AppDownload.jsx` are **controlled** (stops use `--color-*`). No change required unless a named gradient utility exists (`bg-gradient-cta` preferred for consistency).

---

## SVG color audit

### Components with hardcoded `stopColor` / `fill` / `stroke` (migrate)

| File | Issue count | Approach |
|------|------------:|----------|
| `FeaturesRow.jsx` | ~59 hex + rgba | Extract gradient defs to CSS vars: `stopColor="var(--color-accent-400)"`; highlights `fill="var(--raw-scrim-white-55)"`; prefer `currentColor` on monochrome paths |
| `ReferralStep3dIcons.jsx` | ~37 hex | Map gold/cyan stops to `--color-cta-*` / `--color-primary` chain |
| `AppDownload.jsx` | ~13 hex + `fill="white"` | Badge SVG: `fill="var(--color-tertiery)"`; stops → `--color-accent-*`, `--color-primary` |
| `ui/RebateIcon.jsx` | clip `fill="white"` | `fill="currentColor"` + parent `text-[var(--color-tertiery)]` |
| `ui/CasinoChipIcon.jsx` | clip `fill="white"` | Same as RebateIcon |
| `FeaturesRow.jsx` | `fill="white" stroke="#00E676"` status dot | `fill="var(--color-tertiery)" stroke="var(--color-success)"` |

### Payment / brand footer icons (optional — **P3**)

`src/components/footerPayments/*.jsx` (14 files): hardcoded brand colors (Maybank red, TnG blue, crypto orange, etc.). These mirror official brand guidelines.

**Recommendation:** Keep brand literals OR introduce `--color-icon-payment-{provider}` aliases pointing to fixed raw values so they're at least named in `theme.css`. Do **not** remap to Caelo palette — that would change brand recognition.

### Already correct patterns (reference)

- `RtpTrendArrow.jsx` — `fill="none"`, colors via `className` + CSS
- `CasinoChipIcon.jsx` paths — `fill="currentColor"`
- `GameCategories.jsx`, `SlotsPage.jsx` — Lucide `fill="currentColor"`
- `SlotBrowseFilterModal.jsx` — `stroke="currentColor"`

### Static assets (`src/assets/**`)

Logo SVGs (`footer/iTech-Logo.svg`, provider tiles, etc.) contain `fill="white"` clip rects. **Out of scope** for component migration unless inlined into JSX.

---

## Proposed alias tokens (`src/theme.css`)

Add **names only** — each must alias an existing primitive so rendered colors stay unchanged.

```css
/* Overlays */
--color-overlay-backdrop: rgb(0 0 0 / 0.55);           /* DownlineDetailModal — no exact match today */
--color-overlay-backdrop: var(--overlay-default);       /* OR accept 60% vs 55% if close enough */

/* Rings (white on dark UI) */
--color-ring-on-dark: var(--mono-0);
--color-ring-subtle: var(--overlay-hairline);           /* white / 10% equivalent */
--color-ring-panel: var(--overlay-inverse);             /* white / 60–70% equivalent */

/* Sticky / banner surfaces */
--color-surface-sticky-nav: var(--raw-scrim-panel-98);
--color-surface-sticky-nav-md: var(--raw-scrim-panel-96);
--color-surface-banner-placeholder: rgb(221 232 248);   /* alias to nearest raw if exists */
--color-surface-banner-placeholder-alt: rgb(216 227 242);

/* Countdown panel */
--color-gradient-countdown-panel: linear-gradient(
  135deg,
  var(--raw-scrim-panel-65) 0%,
  var(--raw-scrim-gold-12) 100%
);
--color-border-countdown: color-mix(in srgb, var(--color-cta-start) 50%, transparent);

/* Error boundary card (if moving off inline styles) */
--color-surface-error-card: var(--mono-0);
--color-border-error-card: var(--mono-255);
--shadow-error-card: var(--shadow-card-raised);

/* Nav provider tile glow (composite — define once in styles/theme.css) */
--shadow-nav-provider-tile: 0 0 0 1px rgb(120 178 255 / 0.45),
  0 14px 24px rgb(7 19 44 / 0.75),
  0 0 24px rgb(97 156 255 / 0.35);

/* SVG illustration stops (FeaturesRow / Referral icons) */
--color-gradient-illustration-cyan-start: var(--support-steel-light);  /* map per-stop after visual QA */
--color-gradient-illustration-gold-end: var(--accent-310);
/* Prefer reusing existing --color-gradient-* where visuals match */
```

**Reuse before adding:** Many ErrorBoundary literals already exist as Caelo primitives (`--mono-950` = `#0f172a`, `--mono-400` = `#64748b`, etc.) — use existing `--color-text-*` / `--color-border-*` names first.

---

## Prioritized migration plan

### Phase 1 — Quick wins (1–2 PRs, no visual change)

| Priority | File(s) | Action |
|----------|---------|--------|
| P0 | `ErrorBoundary.jsx` | Replace inline hex/rgba with `var(--color-*)` / move to `.error-boundary-*` classes in `styles/theme.css` |
| P0 | `DownlineDetailModal.jsx` | `background: var(--color-overlay-backdrop)` |
| P1 | `constants/navStickyOffsets.js` | Replace `border-slate-200`, `bg-[rgb(...)]`, shadow literals with semantic tokens |
| P1 | `constants/pageBannerClasses.js` | Banner placeholder backgrounds → `--color-surface-banner-placeholder` |
| P1 | `ring-white/*` (5 files) | → `--color-ring-on-dark` with opacity modifiers |

### Phase 2 — Shadow deduplication (1 PR)

Replace all `shadow-[…rgba(…)]` in components with existing `--shadow-*` tokens (see §2 table). Add only missing composites (`--shadow-nav-provider-tile`, `--shadow-control-bar`) to `styles/theme.css`.

**Files:** `AccountSidebar`, `FavouritesPage`, `SlotBrowseFilterModal`, `LanguageSwitcher`, `HeroSection`, `ScrollToTop`, `FeaturesRow`, `RolloverStatusCard`, `VipStatusPill`, `PromotionWarningModal`, `LoginModal`, `RegisterPage`, `NavProviderDropdownPanel`, `referral.jsx`, `VipTier.jsx`.

### Phase 3 — Countdown & motion (1 PR)

| File | Action |
|------|--------|
| `CountdownTimer.jsx` | Panel gradient/border/shadow → `--color-gradient-countdown-panel`, `--color-border-countdown`, `--shadow-cta-soft` |
| `index.css` | Pulse keyframes → `var(--shadow-cta-pulse-*)` aliases |

### Phase 4 — Illustration SVGs (2 PRs)

1. `AppDownload.jsx` + `FeaturesRow.jsx` — stop colors → CSS variables; text `fill` → `var(--color-tertiery)`
2. `ReferralStep3dIcons.jsx` — same pattern; extract shared `<IllustrationDefs />` if gradients repeat

### Phase 5 — Icon hygiene (1 PR)

`CasinoChipIcon.jsx`, `RebateIcon.jsx` — clip rects: `fill="currentColor"` or remove clip if redundant.

### Phase 6 — Dev tooling (optional)

`ThemeEditor.jsx`, `ThemeEditorConfig.js`, `ThemeEditorShowcase.jsx` — use `--color-editor-*` chrome tokens so the editor itself demonstrates best practice.

### Phase 7 — Payment icons (optional, brand-sensitive)

Add `--color-icon-payment-*` aliases in `theme.css` without changing values; swap JSX fills to `var(--color-icon-payment-maybank)` etc.

---

## Top repeated literals (production components only)

| Literal | Occurrences | Maps to |
|---------|------------:|---------|
| `#00AEEF` / cyan stops | 40+ | `--color-primary`, `--color-accent-*` |
| `#FFB800` / gold stops | 30+ | `--color-cta-start`, `--color-accent-310` |
| `rgba(255,255,255,0.18–0.45)` | 25+ | `--raw-scrim-white-*`, `--overlay-inverse` |
| `rgba(15,23,42,0.04–0.10)` | 15+ | `--shadow-subtle`, `--shadow-card-*` |
| `#fff` / `white` (SVG) | 12+ | `--color-text-card-text`, `currentColor` |
| `rgba(0,0,0,0.55)` | 1 | `--color-overlay-backdrop` (new) |

---

## Files already clean (semantic-only sample)

54 files pass with semantic usage and no bypass patterns. Examples:

- `src/components/game/GameCardActions.jsx`
- `src/components/game/RtpTrendArrow.jsx`
- `src/components/home/ReferralBannerSection.jsx`
- `src/components/Navbar.jsx` (13 minor shadow/ring items remain)
- Most account/security form components

---

## How to re-run

```bash
node scripts/audit-theme-color-control.mjs
```

Output: `docs/theme-color-audit-data.json` + console summary.

---

## Safe migration checklist (per file)

1. Identify literal → look up existing `--color-*` / `--shadow-*` in `theme.css` / `styles/theme.css`
2. If no semantic name exists, add **alias only** in `src/theme.css` (no value edits to primitives)
3. Replace literal in JSX/CSS; avoid changing class structure
4. Visual QA: error page, modals, countdown, sticky nav, illustration rows
5. Re-run audit script; confirm file drops from offender list
