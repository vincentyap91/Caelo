import React from 'react';

/**
 * Compact game header for mobile detail: thumb, title, provider, Play Now.
 * Uses the same surface / button tokens as other mobile cards (e.g. ranking tables).
 */
export default function GameDetailMobileInfoCard({
    gameTitle,
    providerName,
    imageUrl,
    onPlayNow,
    onProviderClick = null,
}) {
    const hasImage = Boolean(imageUrl);

    return (
        <div className="surface-card overflow-hidden rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-3.5 sm:gap-4">
                <div
                    className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)]"
                    aria-hidden={!hasImage}
                >
                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt=""
                            className="h-full w-full object-contain object-center p-1.5"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-accent-50)] to-[var(--color-accent-100)] text-lg font-bold text-[var(--color-accent-700)]">
                            {gameTitle?.slice(0, 1)?.toUpperCase() ?? '?'}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <h2 className="text-base font-bold leading-snug tracking-tight text-[var(--color-text-strong)] sm:text-lg">
                        {gameTitle}
                    </h2>
                    <p className="mt-1.5 text-xs font-medium leading-snug text-[var(--color-text-muted)]">
                        Provider:{' '}
                        {onProviderClick ? (
                            <button
                                type="button"
                                onClick={onProviderClick}
                                className="font-semibold text-[var(--color-accent-600)] underline decoration-[var(--color-accent-200)] underline-offset-2 transition hover:text-[var(--color-accent-700)] hover:decoration-[var(--color-accent-400)]"
                            >
                                {providerName}
                            </button>
                        ) : (
                            <span className="font-semibold text-[var(--color-text-strong)]">{providerName}</span>
                        )}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={onPlayNow}
                className="btn-theme-primary mt-4 flex min-h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-bold shadow-sm transition hover:scale-[1.02] hover:brightness-[1.02] active:scale-[0.99]"
            >
                Play Now
            </button>
        </div>
    );
}
