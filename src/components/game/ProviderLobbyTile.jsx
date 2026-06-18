import React from 'react';
import { GameCardFavouriteButton, GameCardPlayBar } from './GameCardActions';
import {
    GAME_CARD_HOVER_CLASS,
    GAME_CARD_IMAGE_HOVER_CONTAIN_CLASS,
    GAME_CARD_IMAGE_HOVER_COVER_CLASS,
} from './gameCardHover';

/**
 * Shared lobby provider tile: square artwork + name bar (12WIN casino/sports grid).
 * Hover + play overlay match homepage TopGameCard. Semantic tokens per VARIABLE-RULES §13.11;
 * page-scoped thumb overrides via `.sports-page .provider-lobby-card__thumb`, etc.
 */
export default function ProviderLobbyTile({
    provider,
    onSelect,
    index = 0,
    onNavigate,
    favouriteCategory,
    navigatePage,
    gameProvider,
    selected = false,
    onPlayClick,
}) {
    const img = provider.tileImage ?? provider.src;
    const label = provider.cardLabel ?? provider.name;
    const hot = Boolean(provider.featured);
    const imgUrl = typeof provider.src === 'string' ? provider.src : '';
    const resolvedFit =
        provider.imageFit === 'cover' || provider.imageFit === 'contain' ? provider.imageFit : 'cover';
    const imageClassName =
        resolvedFit === 'contain'
            ? `h-full w-full object-contain p-2 ${GAME_CARD_IMAGE_HOVER_CONTAIN_CLASS}`
            : `h-full w-full object-fill ${GAME_CARD_IMAGE_HOVER_COVER_CLASS}`;

    const handleActivate = (event) => {
        if (onPlayClick) {
            onPlayClick(event, provider);
            return;
        }
        onSelect(provider);
    };

    return (
        <article
            className={`provider-lobby-card group relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-surface-mid-color)] shadow-[var(--shadow-live-provider)] ${GAME_CARD_HOVER_CLASS} ${
                selected
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25'
                    : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-brand)]'
            }`}
            aria-current={selected ? 'true' : undefined}
        >
            <button
                type="button"
                onClick={() => onSelect(provider)}
                className="absolute inset-0 z-[5] md:hidden"
                aria-label={`Open ${label}`}
            />

            <div className="provider-lobby-card__thumb pointer-events-none relative aspect-square w-full overflow-hidden bg-[var(--color-surface-mid-color)]">
                {img ? (
                    <img
                        src={img}
                        alt=""
                        loading={index < 12 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                        className={imageClassName}
                    />
                ) : null}

                <GameCardPlayBar
                    showOnHover
                    gameName={provider.name}
                    gameProvider={gameProvider}
                    onNavigate={onNavigate}
                    onPlayClick={handleActivate}
                />

                {hot ? (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-[var(--color-danger)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--color-text-card-text)] shadow-[var(--shadow-hot)]">
                        HOT
                    </span>
                ) : null}
            </div>

            <div className="provider-lobby-card__label flex min-h-[40px] items-center justify-center border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-mid-color)] px-2 py-2">
                <p className="line-clamp-2 text-center text-xs font-semibold leading-tight text-[var(--color-text-tertiary)] md:text-sm">
                    {label}
                </p>
            </div>

            <GameCardFavouriteButton
                category={favouriteCategory}
                name={provider.name}
                provider=""
                imgUrl={imgUrl}
                navigatePage={navigatePage}
                onNavigate={onNavigate}
                size="sm"
                className="absolute right-1.5 top-1.5 z-20 rounded-lg"
            />
        </article>
    );
}
