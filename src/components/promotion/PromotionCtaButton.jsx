import React from 'react';
import { runPromotionPrimaryCta } from '../../utils/promotionCta';

const DEFAULT_CLASS =
    'btn-theme-cta inline-flex h-10 min-w-[100px] flex-1 items-center justify-center rounded-xl px-5 text-sm font-black tracking-wide shadow-[0_6px_14px_rgba(242,154,0,0.28)] transition hover:-translate-y-0.5 hover:brightness-105';

/**
 * Join Now (guest) → register. Claim Now (logged in) → deposit with optional bonus pre-select.
 * Reuse on any promotion card; keep “More Info” as a separate control.
 */
export default function PromotionCtaButton({ authUser, onNavigate, promotion, className }) {
    const loggedIn = Boolean(authUser);
    const title = promotion?.title ?? 'promotion';

    return (
        <button
            type="button"
            className={className ?? DEFAULT_CLASS}
            aria-label={loggedIn ? `Claim offer: ${title}` : `Join now: ${title}`}
            onClick={() => runPromotionPrimaryCta({ authUser, onNavigate, promotion })}
        >
            {loggedIn ? 'Claim Now' : 'Join Now'}
        </button>
    );
}
