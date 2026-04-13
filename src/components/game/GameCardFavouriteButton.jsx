import React from 'react';
import { Heart } from 'lucide-react';
import { useFavourites } from '../../context/FavouritesContext';
import { buildFavouriteGameId } from '../../utils/favouriteGames';

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
    const id = buildFavouriteGameId(category, name, provider);
    const active = isFavourite(id);
    const dim =
        size === 'sm'
            ? 'h-[34px] w-[34px] min-h-[34px] min-w-[34px]'
            : 'h-[38px] w-[38px] min-h-[38px] min-w-[38px] sm:h-[42px] sm:w-[42px] sm:min-h-[42px] sm:min-w-[42px]';

    const inactiveClasses = `${TRANSITION} border border-white/20 bg-[var(--color-brand-primary)]/40 text-white backdrop-blur-md shadow-sm hover:scale-105 hover:bg-[var(--color-brand-primary)]/60 active:scale-[0.98]`;

    const activeClasses = `${TRANSITION} scale-[1.02] border-2 border-white/95 bg-[linear-gradient(163deg,rgb(255_92_132)_0%,rgb(251_46_95)_42%,rgb(225_29_72)_100%)] text-white shadow-[0_10px_28px_rgba(190_24_63_0.55),0_0_0_1px_rgba(255_255_255_0.5),inset_0_1px_0_rgba(255_255_255_0.38),0_0_20px_rgba(251_113_133_0.45)] backdrop-blur-md hover:scale-[1.08] hover:border-white hover:bg-[linear-gradient(163deg,rgb(255_112_148)_0%,rgb(251_55_105)_45%,rgb(200_30_72)_100%)] hover:shadow-[0_14px_36px_rgba(159_18_57_0.55),0_0_0_1px_rgba(255_255_255_0.55),inset_0_1px_0_rgba(255_255_255_0.45),0_0_26px_rgba(251_146_166_0.55)] active:scale-[0.97] md:group-hover:border-white md:group-hover:bg-[linear-gradient(163deg,rgb(255_112_148)_0%,rgb(251_55_105)_45%,rgb(200_30_72)_100%)] md:group-hover:shadow-[0_14px_36px_rgba(159_18_57_0.55),0_0_0_1px_rgba(255_255_255_0.55),inset_0_1px_0_rgba(255_255_255_0.45),0_0_26px_rgba(251_146_166_0.55)]`;

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle({ id, category, name, provider, imgUrl, navigatePage });
                e.currentTarget.blur();
            }}
            className={`absolute right-2 top-2 z-30 flex ${dim} items-center justify-center rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(117_207_255)] ${active ? activeClasses : inactiveClasses} ${className}`}
            aria-pressed={active}
            aria-label={active ? 'Remove from favourites' : 'Add to favourites'}
        >
            <Heart
                size={size === 'sm' ? 15.5 : 18.5}
                strokeWidth={active ? 2.15 : 2.35}
                className={
                    active
                        ? 'fill-white text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]'
                        : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)]'
                }
            />
        </button>
    );
}
