import React from 'react';

export function GameProviderCard({ provider, active, onSelect }) {
    return (
        <button
            type="button"
            onClick={() => onSelect?.(provider)}
            className={`relative flex h-14 min-w-[calc((100%-0.5rem)/2.35)] shrink-0 items-center justify-center rounded-2xl border-2 bg-[var(--color-tertiery)] px-2 shadow-[var(--shadow-card-soft)] transition sm:min-w-[calc((100%-0.75rem)/3.35)] md:h-[4.5rem] md:min-w-[8.5rem] lg:min-w-[9.5rem] ${active
                ? 'border-[var(--color-surface-accent)] ring-2 ring-[var(--color-primary)]/25'
                : 'border-[var(--color-border-subtle)] hover:border-[var(--color-accent-glow)] hover:bg-[var(--color-surface-subtle)]'
            }`}
            aria-pressed={active}
        >
            {(provider.featured || provider.new) && (
                <span
                    className={`absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold text-[var(--color-tertiery)] shadow-[var(--shadow-hot)] ${provider.new ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-danger)]'}`}
                >
                    {provider.new ? 'New' : 'Hot'}
                </span>
            )}
            <img
                src={provider.src}
                alt={provider.name}
                className="max-h-8 w-full max-w-[7.5rem] object-contain object-center md:max-h-10"
                draggable={false}
            />
        </button>
    );
}

export default function GameProviderRail({
    providers,
    activeProvider,
    onProviderChange,
    className = '',
}) {
    if (!providers?.length) {
        return null;
    }

    return (
        <div
            className={`flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-3 md:gap-3 ${className}`.trim()}
            aria-label="Game providers"
        >
            {providers.map((provider) => (
                <GameProviderCard
                    key={provider.name}
                    provider={provider}
                    active={activeProvider === provider.name}
                    onSelect={(item) => onProviderChange?.(item.name)}
                />
            ))}
        </div>
    );
}
