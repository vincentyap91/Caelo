import React from 'react';
import { Play } from 'lucide-react';
import { buildGameDetailPath, buildGameDetailSlug } from '../../utils/gameDetailRoutes';

export { default as GameCardFavouriteButton } from './GameCardFavouriteButton';

/**
 * Hover overlay: dark scrim + centered white play disc (primary icon).
 * Parent card must use `group`. showOnHover: overlay only from md+ (hidden on mobile — use full-card tap to navigate).
 */
export function GameCardPlayBar({
    href = '#',
    onPlayClick,
    showOnHover = false,
    /** When true with showOnHover: small screens use a bottom play CTA; md+ uses hover overlay only. */
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
        }
    };

    const playButton = (
        <a
            href={playHref}
            onClick={handleClick}
            aria-label="Play game"
            className={`${ctaPointerCls} game-card-play-button absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2`}
        >
            <Play size={24} className="ml-0.5 fill-current" strokeWidth={0} aria-hidden />
        </a>
    );

    if (mobileBottomBar && showOnHover) {
        return (
            <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 z-[15] flex flex-col justify-end md:hidden ${className}`}
            >
                <div className="pointer-events-auto relative flex justify-center px-2 pb-3 pt-2">
                    <a
                        href={playHref}
                        onClick={handleClick}
                        aria-label="Play game"
                        className="game-card-play-button pointer-events-auto"
                    >
                        <Play size={24} className="ml-0.5 fill-current" strokeWidth={0} aria-hidden />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`pointer-events-none absolute inset-0 z-[15] overflow-hidden rounded-[inherit] ${layerCls} ${className}`}
        >
            <div className="game-card-play-overlay absolute inset-0 rounded-[inherit]" aria-hidden />
            {playButton}
        </div>
    );
}
