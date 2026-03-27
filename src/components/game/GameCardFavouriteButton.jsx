import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../../context/FavouritesContext';
import { buildFavouriteGameId } from '../../utils/favouriteGames';

/**
 * Heart overlay — top-right on game cards. Stops propagation so parent tiles don’t fire.
 * Reusable anywhere you have category, name, provider (same id as Favourites list).
 *
 * @param {'md'|'sm'} size
 */
export default function GameCardFavouriteButton({
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
