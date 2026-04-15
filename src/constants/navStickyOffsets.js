/**
 * `top` offset for fixed UI that should sit flush under the main navbar.
 * - Mobile: one row (`MobileSiteHeader` min-h 56px) — matches `App` main `pt-14`.
 * - md+: dark strip (36px) + main nav (64px) = 100px.
 */
export const NAV_STICKY_SUBHEADER_TOP_CLASS = 'top-14 md:top-[100px]';

/** Shared shell for sticky provider + CTA bars (Live Casino / Poker hero, Sports, E-Sports). */
export const NAV_STICKY_QUICK_PLAY_BAR_CLASS = `fixed left-0 right-0 z-40 ${NAV_STICKY_SUBHEADER_TOP_CLASS} border-b border-slate-200/90 bg-[rgb(255_255_255_/_0.98)] backdrop-blur-md shadow-[0_6px_18px_rgba(16,32,72,0.08)] md:border-b-0 md:bg-[rgb(255_255_255_/_0.95)] md:shadow-[0_8px_24px_rgba(16,32,72,0.12)]`;
