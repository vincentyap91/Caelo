import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../../context/FavouritesContext';
import { buildFavouriteGameId } from '../../utils/favouriteGames';

/**
 * Heart overlay — top-right. Stops propagation so parent tiles/buttons don’t fire.
 * @param {'md'|'sm'} size
 */
export function GameCardFavouriteButton({
    category,
    name,
    provider = '',
    imgUrl = '',
    navigatePage = null,
    size = 'md',
    className = '',
}) {
    const { toggle, isFavourite } = useFavourites();
    const id = buildFavouriteGameId(category, name, provider);
    const active = isFavourite(id);
    const dim =
        size === 'sm'
            ? 'h-8 w-8 min-h-[32px] min-w-[32px]'
            : 'h-9 w-9 min-h-[36px] min-w-[36px] sm:h-10 sm:w-10 sm:min-h-[40px] sm:min-w-[40px]';

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle({ id, category, name, provider, imgUrl, navigatePage });
            }}
            className={`absolute right-2 top-2 z-30 flex ${dim} items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)]/95 text-[var(--color-accent-600)] shadow-md backdrop-blur-sm transition hover:scale-105 hover:border-[var(--color-accent-300)] hover:text-[var(--color-accent-700)] active:scale-[0.98] ${active ? 'border-red-300 text-red-600' : ''} ${className}`}
            aria-pressed={active}
            aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
        >
            <Heart
                size={size === 'sm' ? 15 : 18}
                strokeWidth={2.25}
                className={active ? 'fill-red-500 text-red-600' : ''}
            />
        </button>
    );
}

/**
 * Hover overlay: brand tint + centered gold “Play Now” (site CTA tokens). No title text.
 * Parent card must use `group`. showOnHover: md+ hides until hover/focus-within; below md stays visible for touch.
 */
export function GameCardPlayBar({ href = '#', onPlayClick, showOnHover = false, className = '' }) {
    const layerCls = showOnHover
        ? 'max-md:opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:ease-out md:group-hover:opacity-100 md:group-focus-within:opacity-100'
        : 'opacity-100';

    const linkPointer = showOnHover
        ? 'max-md:pointer-events-auto md:pointer-events-none md:group-hover:pointer-events-auto md:group-focus-within:pointer-events-auto'
        : 'pointer-events-auto';

    return (
        <div className={`pointer-events-none absolute inset-0 z-[15] ${layerCls} ${className}`}>
            <div className="absolute inset-0 bg-[var(--color-brand-secondary)]/60" aria-hidden />
            <a
                href={href}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onPlayClick) {
                        e.preventDefault();
                        onPlayClick(e);
                    }
                }}
                className={`${linkPointer} absolute left-1/2 top-1/2 z-[2] flex w-[min(88%,12rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-cta-border)] bg-[linear-gradient(180deg,var(--color-cta-strong-start)_0%,var(--color-cta-strong-end)_100%)] px-5 py-2.5 text-center text-xs font-black tracking-wide text-[var(--color-cta-text)] shadow-[0_6px_20px_rgba(15,23,42,0.28),inset_0_1px_0_rgba(255,255,255,0.42)] transition hover:brightness-[1.05] active:scale-[0.98] active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-cta-focus)] sm:min-h-[44px] sm:px-6 sm:text-sm`}
            >
                Play Now
            </a>
        </div>
    );
}
