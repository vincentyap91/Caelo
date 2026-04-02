import React from 'react';
import { buildGameDetailPath, buildGameDetailSlug } from '../../utils/gameDetailRoutes';

export { default as GameCardFavouriteButton } from './GameCardFavouriteButton';

/**
 * Hover overlay: brand tint + centered gold â€œPlay Nowâ€ (site CTA tokens). No title text.
 * Parent card must use `group`. showOnHover: overlay only from md+ (hidden on mobile â€” use full-card tap to navigate).
 *
 * SPA routing: pass `onNavigate` + `gameName`/`gameProvider` or `gameSlug` â€” primary click calls
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

    const layerCls = showOnHover ? 'game-card-play-hover max-md:hidden' : 'opacity-100';

    const ctaPointerCls = showOnHover ? 'game-card-play-hover__cta' : 'pointer-events-auto';

    const handleClick = (e) => {
        e.stopPropagation();
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (onPlayClick) {
            e.preventDefault();
            onPlayClick(e);
            return;
        }
        if (onNavigate && resolvedSlug) {
            e.preventDefault();
            onNavigate('game-detail', { gameSlug: resolvedSlug });
            return;
        }
    };

    const ctaBase =
        'z-[2] flex items-center justify-center rounded-full border border-[var(--color-cta-border)] bg-[linear-gradient(180deg,var(--color-cta-strong-start)_0%,var(--color-cta-strong-end)_100%)] text-center font-bold tracking-wide text-[var(--color-cta-text)] shadow-[0_6px_20px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:brightness-[1.05] active:scale-[0.98] active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-focus)]';

    if (mobileBottomBar && showOnHover) {
        return (
            <>
                <div
                    className={`pointer-events-none absolute inset-x-0 bottom-0 z-[15] flex flex-col justify-end md:hidden ${className}`}
                >
                    <div className="pointer-events-auto relative px-2 pb-2.5 pt-1">
                        <a
                            href={playHref}
                            onClick={handleClick}
                            className={`relative mx-auto flex min-h-[40px] w-full max-w-[11.5rem] items-center justify-center rounded-full px-4 text-xs ${ctaBase}`}
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
            className={`pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-[inherit] ${layerCls} ${className}`}
        >
            <div
                className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(4,22,55,0.2)_0%,rgba(9,43,96,0.44)_36%,rgba(12,56,122,0.74)_100%)]"
                aria-hidden
            />
            <div
                className="absolute inset-x-[14%] top-[18%] h-24 rounded-full bg-[radial-gradient(circle,rgba(53,152,255,0.24)_0%,rgba(53,152,255,0.08)_48%,transparent_78%)] blur-2xl"
                aria-hidden
            />
            <div
                className="absolute inset-x-[18%] top-1/2 z-[1] h-16 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(51,153,255,0.58)_0%,rgba(29,104,219,0.26)_46%,transparent_76%)] blur-xl"
                aria-hidden
            />
            <a
                href={playHref}
                onClick={handleClick}
                className={`${ctaPointerCls} absolute left-1/2 top-1/2 z-[2] flex w-[min(88%,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-cta-border)] bg-[linear-gradient(180deg,var(--color-cta-strong-start)_0%,var(--color-cta-strong-end)_100%)] px-5 py-2.5 text-center text-xs font-bold tracking-wide text-[var(--color-cta-text)] shadow-[0_6px_20px_rgba(15,23,42,0.28),0_0_0_1px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:brightness-[1.05] active:scale-[0.98] active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-focus)] sm:min-h-[44px] sm:px-6 sm:text-sm`}
            >
                Play Now
            </a>
        </div>
    );
}


