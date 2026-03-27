import React from 'react';
import { buildGameDetailPath, buildGameDetailSlug } from '../../utils/gameDetailRoutes';

export { default as GameCardFavouriteButton } from './GameCardFavouriteButton';

/**
 * Hover overlay: brand tint + centered gold “Play Now” (site CTA tokens). No title text.
 * Parent card must use `group`. showOnHover: overlay only from md+ (hidden on mobile — use full-card tap to navigate).
 *
 * SPA routing: pass `onNavigate` + `gameName`/`gameProvider` or `gameSlug` — primary click calls
 * `onNavigate('game-detail', { gameSlug })` while `href` is set for open-in-new-tab / share.
 */
export function GameCardPlayBar({
    href = '#',
    onPlayClick,
    showOnHover = false,
    /** When true with showOnHover: small screens use a bottom strip CTA; md+ has no Play overlay (desktop relies on card / other actions). */
    mobileBottomBar = false,
    className = '',
    onNavigate,
    gameSlug,
    gameName,
    gameProvider,
}) {
    const resolvedSlug =
        gameSlug ?? (gameName != null && gameName !== '' ? buildGameDetailSlug(gameName, gameProvider ?? '') : null);
    const playHref = resolvedSlug ? buildGameDetailPath(resolvedSlug) : href;

    const layerCls = showOnHover
        ? 'md:opacity-0 md:transition-opacity md:duration-200 md:ease-out md:group-hover:opacity-100 md:group-focus-within:opacity-100'
        : 'opacity-100';

    const linkPointer = showOnHover
        ? 'pointer-events-none md:group-hover:pointer-events-auto md:group-focus-within:pointer-events-auto'
        : 'pointer-events-auto';

    const handleClick = (e) => {
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (onNavigate && resolvedSlug) {
            e.preventDefault();
            onNavigate('game-detail', { gameSlug: resolvedSlug });
            return;
        }
        if (onPlayClick) {
            e.preventDefault();
            onPlayClick(e);
        }
    };

    const ctaBase =
        'z-[2] flex items-center justify-center rounded-full border border-[var(--color-cta-border)] bg-[linear-gradient(180deg,var(--color-cta-strong-start)_0%,var(--color-cta-strong-end)_100%)] text-center font-black tracking-wide text-[var(--color-cta-text)] shadow-[0_6px_20px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:brightness-[1.05] active:scale-[0.98] active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-focus)]';

    if (mobileBottomBar && showOnHover) {
        return (
            <>
                <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 z-[15] flex flex-col justify-end md:hidden ${className}`}
                >
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] rounded-b-3xl bg-[linear-gradient(180deg,transparent_0%,rgb(29_78_140_/_0.12)_35%,var(--color-brand-secondary)_/_0.78_100%)]"
                        aria-hidden
                    />
                    <div className="pointer-events-auto relative px-2 pb-2.5 pt-1">
                        <a
                            href={playHref}
                            onClick={handleClick}
                            className={`mx-auto flex min-h-[40px] w-full max-w-[11.5rem] items-center justify-center rounded-full px-4 text-[11px] ${ctaBase}`}
                        >
                            Play Now
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div
            className={`pointer-events-none absolute inset-0 z-[15] ${showOnHover ? 'hidden md:block' : ''} ${layerCls} ${className}`}
        >
            <div className="absolute inset-0 bg-[var(--color-brand-secondary)]/60" aria-hidden />
            <a
                href={playHref}
                onClick={handleClick}
                className={`${linkPointer} absolute left-1/2 top-1/2 z-[2] flex w-[min(88%,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-cta-border)] bg-[linear-gradient(180deg,var(--color-cta-strong-start)_0%,var(--color-cta-strong-end)_100%)] px-5 py-2.5 text-center text-xs font-black tracking-wide text-[var(--color-cta-text)] shadow-[0_6px_20px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:brightness-[1.05] active:scale-[0.98] active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-focus)] sm:min-h-[44px] sm:px-6 sm:text-sm`}
            >
                Play Now
            </a>
        </div>
    );
}
