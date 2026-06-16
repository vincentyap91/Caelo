import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../../context/FavouritesContext';
import { buildFavouriteGameId, normalizeFavouriteCategory } from '../../utils/favouriteGames';

/** Shared motion — smooth handoff between default and favourited. */
const TRANSITION =
    'transition-[background,background-image,box-shadow,border-color,transform,filter] duration-300 ease-out motion-reduce:duration-150 motion-reduce:transition-none';

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
    const normalizedCategory = normalizeFavouriteCategory(category, name);
    const id = buildFavouriteGameId(normalizedCategory, name, provider);
    const active = isFavourite(id);
    const dim =
        size === 'sm'
            ? 'h-[34px] w-[34px] min-h-[34px] min-w-[34px]'
            : 'h-[38px] w-[38px] min-h-[38px] min-w-[38px] sm:h-[42px] sm:w-[42px] sm:min-h-[42px] sm:min-w-[42px]';

    const inactiveClasses = `${TRANSITION} game-fav-btn-inactive border border-[var(--color-border-brand)]/20 bg-gradient-favourite-inactive text-[var(--color-tertiery)] backdrop-blur-md hover:scale-105 hover:border-[var(--color-text-sticky-nav-active)]/70 hover:text-[var(--color-tertiery)] active:scale-[0.98] md:group-hover:border-[var(--color-text-sticky-nav-active)]/75 md:group-hover:bg-gradient-favourite-inactive-hover md:group-hover:text-[var(--color-tertiery)]`;

    const activeClasses = `${TRANSITION} game-fav-btn-active scale-[1.02] border-2 border-[var(--color-border-brand)]/95 bg-gradient-favourite-active text-[var(--color-tertiery)] backdrop-blur-md hover:scale-[1.08] hover:border-[var(--color-border-brand)] hover:bg-gradient-favourite-active-hover active:scale-[0.97] md:group-hover:border-[var(--color-border-brand)] md:group-hover:bg-gradient-favourite-active-hover`;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle({ id, category, name, provider, imgUrl, navigatePage });
                e.currentTarget.blur();
            }}
            className={`absolute right-2 top-2 z-30 flex ${dim} items-center justify-center rounded-xl pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-sticky-nav-active)] ${active ? activeClasses : inactiveClasses} ${className}`}
            aria-pressed={active}
            aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
        >
            <Heart
                size={size === 'sm' ? 15.5 : 18.5}
                strokeWidth={active ? 2.15 : 2.35}
                className={
                    active
                        ? 'fill-[var(--color-tertiery)] text-[var(--color-tertiery)] drop-shadow-[var(--shadow-subtle)]'
                        : 'text-[var(--color-tertiery)] drop-shadow-[var(--shadow-subtle)]'
                }
            />
        </button>
    );
}
