import React from 'react';
import { GameCardFavouriteButton, GameCardPlayBar } from './GameCardActions';

/**
 * Lobby provider tile (Live Casino pattern): banner tap target, mobile bottom Play + md hover Play,
 * favourite heart, optional HOT � shared across live casino, sports, e-sports, lottery, poker.
 */
export default function LobbyProviderCard({
    provider,
    selected,
    onSelect,
    index = 0,
    /** Passed to game-detail slug builder, e.g. "Live Casino", "Sportsbook". */
    gameProvider,
    favouriteCategory,
    navigatePage,
    onNavigate,
    /** Override HOT visibility; default uses `provider.featured`. */
    showHotBadge,
    /** When set, Play CTA runs this instead of navigating to game detail (e.g. launch modal). */
    onPlayClick,
}) {
    const hot = showHotBadge ?? Boolean(provider.featured);
    const imgUrl = typeof provider.src === 'string' ? provider.src : '';

    return (
        <div
            className={`group relative flex min-h-[168px] flex-col overflow-hidden rounded-3xl border bg-[var(--color-surface-base)] shadow-[var(--shadow-live-provider)] transition duration-300 md:hover:-translate-y-1 md:hover:shadow-[var(--shadow-live-provider-hover)] md:min-h-0 md:h-[104px] md:flex-row md:items-center md:justify-center ${
                selected
                    ? 'border-[var(--color-surface-accent)] ring-2 ring-[var(--color-primary)]/25'
                    : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-brand)]'
            }`}
        >
            <button
                type="button"
                onClick={() => onSelect(provider)}
                className="absolute inset-0 z-0 rounded-3xl"
                aria-label={`Show ${provider.name} in banner`}
            />
            <GameCardPlayBar
                showOnHover
                mobileBottomBar
                gameName={provider.name}
                gameProvider={gameProvider}
                onNavigate={onNavigate}
                onPlayClick={onPlayClick}
            />
            {hot && (
                <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-[var(--color-danger)] px-2 py-0.5 text-xs font-bold tracking-wide text-[var(--color-text-card-text)] shadow-[var(--shadow-hot)] md:text-xs">
                    HOT
                </span>
            )}
            <GameCardFavouriteButton
                category={favouriteCategory}
                name={provider.name}
                provider=""
                imgUrl={imgUrl}
                navigatePage={navigatePage}
                size="sm"
                className="rounded-lg"
            />
            <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-3 pb-[4.25rem] pt-7 md:h-full md:flex-none md:py-2 md:pb-2 md:pt-2">
                <img
                    src={provider.src}
                    alt={provider.name}
                    loading={index < 12 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="max-h-[52px] w-full max-w-[min(100%,9.5rem)] object-contain object-center saturate-110 contrast-110 drop-shadow-[var(--shadow-subtle)] transition duration-300 md:group-hover:scale-[1.04] sm:max-h-[56px] md:max-h-[40px] md:max-w-full md:drop-shadow-none"
                />
            </div>
        </div>
    );
}


