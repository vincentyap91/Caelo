# Caelo Theme Reference (local snapshot)

> **Before `git pull` / merge:** Keep these values. Do **not** overwrite the current correct Caelo theme with older or generic colors from incoming changes. If a conflict appears in `src/styles/theme.css` or promo-related files, prefer **this document** and the local working copy you verified in the UI.

**Primary source of truth:** `src/styles/theme.css`  
**File snapshot:** `docs/caelo-theme.css.snapshot`  
**Git tag:** `caelo-theme-stable` · **branch:** `caelo-theme-colors`  
**Theme editor defaults:** `src/components/theme-editor/ThemeEditorConfig.js`  
**Figma sync scripts:** `scripts/figma-sync-caelo-theme.*.js`

---

## Restore after `git pull`

Use when colors look wrong after pulling (green brand, dark progress tracks, unexpected `src/theme.css`, etc.).

```powershell
# From repo root — restores theme files from the saved tag
git checkout caelo-theme-stable -- src/styles/theme.css src/index.css src/components/ui/ProgressBar.jsx

# If pull added migration theme files you do not want:
git rm -f src/theme.css src/theme-cam88.css 2>$null
git checkout caelo-theme-stable -- src/index.css
```

Or restore from the snapshot file:

```powershell
Copy-Item docs/caelo-theme.css.snapshot src/styles/theme.css -Force
```

Quick verify in `src/styles/theme.css`: `--color-brand-primary: #123B94`, `--color-accent-100: #dbeafe`, `--color-nav-accent: #ffd84d`.

```powershell
git show caelo-theme-stable:src/styles/theme.css
git diff caelo-theme-stable -- src/styles/theme.css
```

---

## Brand core

| Token | Hex / value | Usage |
|-------|-------------|--------|
| `--color-brand-primary` | `#123B94` | Nav, headings, promo title highlight, payout border |
| `--color-brand-secondary` | `#0d2a6a` | Balance modal item bg, gradients |
| `--color-brand-deep` | `#01206C` | Deep nav gradients, browse value text |
| `--color-brand-soft` | `#E5F6FF` | Soft panels, icons |
| `--color-brand-soft-border` | `#CCEEFF` | Category chips |
| `--color-brand-line` | `#7AD0F5` | Accent lines |

---

## Accent scale (blue UI)

| Token | Hex | Usage |
|-------|-----|--------|
| `--color-accent-50` | `#eff6ff` | Payout card bg, soft hovers |
| `--color-accent-100` | **`#dbeafe`** | **Progress bar track** (VIP tier + Current Promo), borders, chips |
| `--color-accent-200` | `#bfdbfe` | Borders, hovers |
| `--color-accent-300` | `#93c5fd` | Focus rings |
| `--color-accent-400` | `#60a5fa` | Progress bar fill start |
| `--color-accent-500` | `#3b82f6` | — |
| `--color-accent-600` | `#2563eb` | Progress bar fill end, links |
| `--color-accent-700` | `#1d4ed8` | Badge text |

**Important:** Current Promo and “Progress to next tier” both use **`--color-accent-100` (`#dbeafe`)** for the **unfilled** progress track. Do not revert to `--color-surface-muted` (`#f8fafc`) — it is too faint on white cards.

---

## Semantic aliases

| Token | Maps to |
|-------|---------|
| `--base-paper` | `var(--color-tertiery)` → `#ffffff` |
| `--base-ink` | `var(--color-text-strong)` → `#0f172a` |

---

## Text & surfaces

| Token | Value |
|-------|--------|
| `--color-text-strong` | `#0f172a` |
| `--color-text-main` | `#334155` |
| `--color-text-muted` | `#64748b` |
| `--color-surface-base` | `#ffffff` |
| `--color-surface-muted` | `#f8fafc` |
| `--color-border-default` | `#e2e8f0` |
| `--color-border-brand` | `#cfe0f9` |

---

## Dark nav / balance dropdown

| Token | Value |
|-------|--------|
| `--color-nav-top` / `--color-nav-main` | `#123B94` |
| `--color-nav-text-accent` | `#8ad4ff` | Active promo eyebrow in balance dropdown |
| `--color-nav-accent` | `#ffd84d` | Gold balances, CTA accents |
| `--color-nav-border-soft` | `rgb(106 200 255 / 0.12)` |
| `--balance-item-bg` | `var(--color-brand-secondary)` |

---

## CTA (gold buttons)

| Token | Value |
|-------|--------|
| `--color-cta-start` | `#ffcf4a` |
| `--color-cta-end` | `#ffb22d` |
| `--color-cta-text` | `#0c4a8e` |

`btn-theme-cta-soft` → End Promo button (slots, profile, balance dropdown).

---

## Recent Payout (home)

| Token | Value |
|-------|--------|
| `--color-payout-panel-border` | `var(--color-brand-primary)` |
| `--color-payout-card-bg` | `var(--color-accent-50)` |
| `--color-payout-highlight` | `#123b94` |
| `--color-payout-amount` | `#dd6044` |

---

## Progress bar component

**File:** `src/components/ui/ProgressBar.jsx`

| Variant | Track | Fill |
|---------|-------|------|
| `default` | `--color-surface-muted` | accent 400 → 600 gradient |
| `slot-promo` | **`--color-accent-100` (`#dbeafe`)** | accent 400 → 600 gradient |
| `dark` | `white/10` | CTA gold gradient (balance dropdown) |

**Current Promo** (slots + profile) uses `slot-promo` via `PromoProgressRow.jsx`.

**VIP progress** (`ProfilePage.jsx`, `VipTierProgressCard.jsx`): track `bg-[var(--color-accent-100)]`, fill `--gradient-cta` or brand styling — track color must stay **`#dbeafe`**.

---

## Current Promo UI

### Feature flags (`src/constants/slotCurrentPromo.js`)

| Flag | Intended local state | Location |
|------|----------------------|----------|
| `BALANCE_DROPDOWN_SHOW_ACTIVE_PROMO` | `false` (hidden for now) | Navbar balance dropdown |
| `PROFILE_SHOW_ACTIVE_PROMO` | check local file before pull | Account Details page |

Slots browse: always shown when promo is active (no flag).

### Typography colors

| Surface | Label | Promo name |
|---------|-------|------------|
| Slots browse | `--color-text-muted` | `--color-brand-primary` |
| Profile | `--base-ink` | `--color-brand-primary` (`profile-current-promo__name`) |
| Balance dropdown | `--color-nav-text-accent` | white (`balance-modal-text-primary`) |

### Theme classes (`theme.css`)

- `.slot-current-promo` — browse panel border `--color-border-brand`
- `.profile-current-promo` — bg `--base-paper`, name `--color-brand-primary`
- `.balance-modal-promo__eyebrow` — `--color-nav-text-accent`
- `.balance-modal-promo__bar` — track `rgb(255 255 255 / 0.1)`

### Key files

- `src/components/slots/CurrentPromoSection.jsx`
- `src/components/promo/PromoProgressRow.jsx`
- `src/components/promo/PromoSummaryDropdown.jsx`
- `src/hooks/useSlotCurrentPromo.js`

---

## Soft browse panel

```css
.soft-blue-panel {
  border: 1px solid var(--color-accent-100);
  background-image: linear-gradient(180deg, var(--gradient-soft-panel-start) 0%, var(--gradient-soft-panel-end) 100%);
}
```

`--gradient-soft-panel-start`: `#ffffff`  
`--gradient-soft-panel-end`: `#f8fbff`

---

## Git pull checklist

When merging or pulling:

1. **`src/styles/theme.css`** — preserve `--color-accent-100: #dbeafe`, brand primary `#123B94`, payout tokens, promo/balance classes above.
2. **`src/components/ui/ProgressBar.jsx`** — keep `slot-promo` track as `var(--color-accent-100)`.
3. **`src/components/promo/PromoProgressRow.jsx`** — keep `variant="slot-promo"` for light surfaces (not `default`).
4. **`src/constants/slotCurrentPromo.js`** — re-apply feature flags if overwritten.
5. **Do not** replace Caelo blues with riocity/staging grays or near-white progress tracks.

After pull, spot-check:

- Slots → Current Promo progress track visible (`#dbeafe`)
- Account Details → VIP “Progress to next tier” track matches promo track
- Recent Payout cards → accent-50 background, brand-primary border
- Navbar → `#123B94` header, gold nav accent `#ffd84d`

---

## Sportsbook skins

White is the **default** sportsbook chrome. Switch day/night with the sun/moon toggle: desktop next to **Download App**; mobile next to the Sports tab flyout **close** control. Preference is stored as `caelo-sportsbook-skin` (`light` | `dark`). Sports / Live / Esports menus list each page once — they follow the toggle instead of duplicate “(Light)” links.

| Route | Skin | CSS |
|-------|------|-----|
| `/sportsbook/light` and `/sportsbook/light/<slug>` | **Default** white Caelo chrome | `caelo-palette.css` + `caelo-light.css` last |
| `/sportsbook` and `/sportsbook/<slug>` | Dark 1xbet chrome, Caelo retint | `caelo-palette.css` last |

White routes: `/sportsbook/light`, `/sportsbook/light/national-team`, `/sportsbook/light/live-national-team`, `/sportsbook/light/big-tournaments`, `/sportsbook/light/long-term-bets`, `/sportsbook/light/multi-live`, `/sportsbook/light/marble-live`, `/sportsbook/light/fast-bet`, `/sportsbook/light/esports`.

Dark originals stay on `/sportsbook/<slug>` (national-team, big-tournaments, long-term-bets, multi-live, live-national-team, marble-live, fast-bet, esports). Do not fold the light skin into `caelo-palette.css`.

Load order for **white** routes: page CSS → `caelo-palette.css` → **`caelo-light.css` last**.

Hook: pathname `/sportsbook/light` or `/sportsbook/light/<slug>` sets `light` on `SportsbookPage`, which adds `body.sportsbook-light` and `.sportsbook-root.sportsbook-light-chrome`. Dark `/sportsbook` does **not** load `caelo-light.css`.

### Light sportsbook tokens (`caelo-light.css`)

| Role | Token | Hex |
|------|-------|-----|
| Page / cards | `--page-bg` / `--surface-primary` | `#f8fafc` / `#ffffff` |
| Soft panels | `--page-bg-secondary` / `--surface-tertiary` / `--league-header` | `#eff6ff` / `#eff6ff` / `#dbeafe` |
| Ink / muted | `--text-primary` / `--text-muted` | `#0f172a` / `#64748b` |
| Brand / headers | `--sb-brand` / `--section-blue` | `#123B94` |
| Borders | `--border-light` / `--border-dark` | `#e2e8f0` / `#cfe0f9` |
| CTA | `--sb-cta-start` → `--sb-cta-end` + `--sb-cta-text` | `#ffcf4a` → `#ffb22d` + `#0c4a8e` |
| Selected odds | `--odds-selected` | `#e89a12` |
| Win / success | `--success` | `#65a30d` |

Table heads, toolbars, and tabs use white/soft panels with navy text and a gold CTA. Inactive tabs stay muted (`--text-muted`) so they remain readable on white — not navy-on-navy and not white type on a white bar. On mobile, Live / Sports / star / search pills and popular-sport cards follow the same contract: white/soft inactive, gold CTA selected, muted labels. Page-specific prefixes (`.nt-*`, `.bt-*`, `.lt-*`, `.ml-*`, `.fb-*`, `.es-*`) are retinted in the same stylesheet.

Esports exception: photo hero / competition overlays keep light type on the image. The rest of the lobby and the shared bet slip use white chrome like `/sportsbook/light`.

---

*Last updated from local working tree. Regenerate or amend this file after intentional theme changes.*
