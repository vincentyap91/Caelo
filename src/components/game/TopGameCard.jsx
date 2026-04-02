import React from 'react';
import { GameCardFavouriteButton, GameCardPlayBar } from './GameCardActions';
import { navigateToGameDetail } from '../../utils/gameDetailRoutes';
import { getTopGameFavouriteCategory } from '../../constants/topGamesCatalog';

export default function TopGameCard({
    game,
    onNavigate,
    className = '',
    imageFit = 'cover',
    imageStageClassName = '',
}) {
    if (!game) {
        return null;
    }

    const resolvedFit =
        game.imageFit === 'cover' || game.imageFit === 'contain' ? game.imageFit : imageFit;

    const imageClassName =
        resolvedFit === 'contain'
            ? 'absolute inset-0 h-full w-full rounded-[inherit] object-contain p-4 transition-transform duration-500 ease-out md:group-hover:scale-[1.03]'
            : 'absolute inset-0 h-full w-full rounded-[inherit] object-cover object-center transition-transform duration-500 ease-out md:group-hover:scale-[1.05]';

    return (
        <div
            className={`group relative flex flex-col overflow-hidden rounded-xl border-b-4 border-[var(--color-brand-primary)] bg-[var(--color-surface-base)] shadow-[var(--shadow-brand-card)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform md:hover:-translate-y-0.5 md:hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)] ${className}`.trim()}
        >
            <button
                type="button"
                onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                className="absolute inset-0 z-[5] md:hidden"
                aria-label={`Open ${game.name}`}
            />
            <div className={`relative isolate aspect-square w-full overflow-hidden rounded-t-xl bg-[var(--color-surface-muted)] ${imageStageClassName}`.trim()}>
                <img
                    src={game.imgUrl}
                    alt={game.name}
                    loading="lazy"
                    className={imageClassName}
                />

                <GameCardPlayBar
                    showOnHover
                    className="overflow-hidden rounded-t-xl"
                    gameName={game.name}
                    gameProvider={game.provider}
                    onNavigate={onNavigate}
                />

                <div className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center rounded-br-lg bg-white px-2 py-0.5 shadow-sm">
                    <span className="text-xs font-bold italic text-[var(--color-brand-secondary)]">{game.provider}</span>
                </div>

                <GameCardFavouriteButton
                    category={getTopGameFavouriteCategory(game.page)}
                    name={game.name}
                    provider={game.provider}
                    imgUrl={game.imgUrl}
                    navigatePage={game.page}
                    size="sm"
                />
            </div>

            <div className="flex min-h-[40px] w-full shrink-0 items-center justify-center bg-[var(--color-brand-primary)] px-2 py-2">
                <span className="block truncate text-center text-xs font-bold text-white">{game.name}</span>
            </div>
        </div>
    );
}

