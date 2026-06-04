import React from 'react';
import { GameCardFavouriteButton } from '../game/GameCardActions';

/**
 * 12WIN GameLobby provider card: square dealer tile + white name bar below.
 */
export default function LiveCasinoProviderTile({
    provider,
    selected,
    onSelect,
    index = 0,
    onNavigate,
}) {
    const img = provider.tileImage ?? provider.src;
    const label = provider.cardLabel ?? provider.name;
    const hot = Boolean(provider.featured);

    return (
        <article
            className={`live-casino-provider-card group relative flex flex-col overflow-hidden rounded-2xl border bg-[var(--color-surface-mid-color)] shadow-[var(--shadow-live-provider)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-live-provider-hover)] ${
                selected
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/25'
                    : 'border-[var(--color-border-subtle)] hover:border-[var(--color-border-accent)]'
            }`}
        >
            <button
                type="button"
                onClick={() => onSelect(provider)}
                className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface-mid-color)] text-left"
                aria-label={`Open ${label}`}
                aria-pressed={selected}
            >
                {img ? (
                    <img
                        src={img}
                        alt=""
                        loading={index < 12 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-fill transition duration-500 group-hover:scale-[1.02]"
                    />
                ) : null}
                {hot ? (
                    <span className="absolute right-2 top-2 z-10 rounded-full bg-[var(--color-danger)] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[var(--color-text-card-text)] shadow-[var(--shadow-hot)]">
                        HOT
                    </span>
                ) : null}
            </button>

            <div className="live-casino-provider-card__label flex min-h-[40px] items-center justify-center border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-2 py-2">
                <p className="line-clamp-2 text-center text-xs font-semibold leading-tight text-[var(--color-text-tertiary)] md:text-sm">
                    {label}
                </p>
            </div>

            <GameCardFavouriteButton
                category="live-casino"
                name={provider.name}
                provider=""
                imgUrl={typeof provider.src === 'string' ? provider.src : ''}
                navigatePage="live-casino"
                onNavigate={onNavigate}
                size="sm"
                className="absolute right-1.5 top-1.5 z-20 rounded-lg"
            />
        </article>
    );
}
