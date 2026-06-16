import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';

import useBodyScrollLock from '../hooks/useBodyScrollLock';

function buildBrowseSummary({ query, scope, provider, allProvidersValue, visibleProviders, visibleGames }) {
    const text = query.trim();

    if (text) {
        if (scope === 'providers') {
            return `${visibleProviders.length} matching provider${visibleProviders.length === 1 ? '' : 's'}`;
        }
        if (scope === 'games') {
            return `${visibleGames.length} matching game${visibleGames.length === 1 ? '' : 's'}`;
        }
        return `${visibleProviders.length} matching provider${visibleProviders.length === 1 ? '' : 's'} | ${visibleGames.length} matching game${visibleGames.length === 1 ? '' : 's'}`;
    }

    if (provider !== allProvidersValue) {
        return `${visibleGames.length} game${visibleGames.length === 1 ? '' : 's'} in ${provider}`;
    }

    return `${visibleProviders.length} provider${visibleProviders.length === 1 ? '' : 's'} | ${visibleGames.length} game${visibleGames.length === 1 ? '' : 's'}`;
}

export default function SlotBrowseFilterModal({
    open,
    onClose,
    providers,
    games,
    scopes,
    initialQuery,
    initialScope,
    initialProvider,
    allProvidersValue,
    onApply,
}) {
    const [draftQuery, setDraftQuery] = useState(initialQuery);
    const [draftScope, setDraftScope] = useState(initialScope);
    const [draftProvider, setDraftProvider] = useState(initialProvider);
    const [providersExpanded, setProvidersExpanded] = useState(false);

    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) return;
        setDraftQuery(initialQuery);
        setDraftScope(initialScope);
        setDraftProvider(initialProvider);
        setProvidersExpanded(false);
    }, [open, initialProvider, initialQuery, initialScope]);

    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose]);

    const providerGameCounts = useMemo(() => {
        return games.reduce((accumulator, game) => {
            accumulator[game.provider] = (accumulator[game.provider] ?? 0) + 1;
            return accumulator;
        }, {});
    }, [games]);

    const getProviderLogo = (provider) => provider.src || provider.logo || provider.image || provider.imgUrl || null;

    const visibleProviders = useMemo(() => {
        const text = draftQuery.trim().toLowerCase();
        if (!text) return providers;

        return providers.filter((provider) => {
            const providerNameMatch = provider.name.toLowerCase().includes(text);
            const providerHasMatchingGame = games.some(
                (game) => game.provider === provider.name && game.name.toLowerCase().includes(text)
            );

            if (draftScope === 'providers') return providerNameMatch;
            if (draftScope === 'games') return providerHasMatchingGame;
            return providerNameMatch || providerHasMatchingGame;
        });
    }, [draftQuery, draftScope, games, providers]);

    const visibleGames = useMemo(() => {
        const text = draftQuery.trim().toLowerCase();

        return games.filter((game) => {
            const providerMatch = draftProvider === allProvidersValue || game.provider === draftProvider;
            if (!providerMatch) return false;
            if (!text) return true;

            const matchesGame = game.name.toLowerCase().includes(text);
            const matchesProvider = game.provider.toLowerCase().includes(text);

            if (draftScope === 'games') return matchesGame;
            if (draftScope === 'providers') return matchesProvider;
            return matchesGame || matchesProvider;
        });
    }, [allProvidersValue, draftProvider, draftQuery, draftScope, games]);

    const browseSummary = buildBrowseSummary({
        query: draftQuery,
        scope: draftScope,
        provider: draftProvider,
        allProvidersValue,
        visibleProviders,
        visibleGames,
    });

    const handleReset = () => {
        setDraftQuery('');
        setDraftScope('all');
        setDraftProvider(allProvidersValue);
    };

    const handleApply = () => {
        onApply?.({
            query: draftQuery,
            scope: draftScope,
            provider: draftProvider,
        });
        onClose?.();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[240] flex items-end justify-center p-0 sm:items-center sm:p-4">
            <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-overlay-strong)] backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Filter games and providers"
                className="relative z-[1] flex max-h-[min(96dvh,820px)] w-full flex-col overflow-hidden rounded-t-[24px] border border-[var(--color-border-subtle)] bg-gradient-modal-shell shadow-[var(--shadow-modal)] max-lg:max-h-[96dvh] sm:max-h-[min(88dvh,820px)] sm:max-w-[1040px] sm:rounded-[28px] lg:rounded-[28px]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3 max-lg:gap-2 sm:px-6 sm:py-4">
                    <div className="min-w-0 pr-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-soft)] max-lg:tracking-wide sm:text-[11px] sm:tracking-wide">
                            Browse Control
                        </p>
                        <h2 className="mt-0.5 text-base font-bold leading-tight tracking-tight text-[var(--color-text-primary)] max-lg:line-clamp-2 sm:mt-1 sm:text-lg lg:text-xl">
                            Filter Games & Providers
                        </h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="inline-flex h-11 min-h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-glow)] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-secondary)] lg:h-10 lg:min-h-0 lg:w-10"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 pb-4 sm:px-6 sm:py-5 lg:overflow-hidden">
                    <div className="shrink-0 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)]/80 p-3 shadow-[var(--shadow-live-card)] max-lg:rounded-[20px] sm:rounded-[24px] sm:p-4">
                        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-2.5">
                            <label className="flex h-11 min-h-11 w-full items-center gap-2 rounded-xl border border-[var(--color-border-subtle)]/90 bg-[var(--color-surface-input-light)] px-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)] lg:h-10 lg:min-h-0 lg:flex-1">
                                <Search size={16} className="shrink-0 text-[var(--color-text-muted)]" />
                                <input
                                    value={draftQuery}
                                    onChange={(event) => setDraftQuery(event.target.value)}
                                    placeholder="Search games or providers"
                                    aria-label="Search games or providers"
                                    className="min-h-0 w-full bg-transparent text-sm font-semibold text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                />
                            </label>

                            <div
                                className="inline-flex w-full min-h-11 items-stretch gap-0.5 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)]/85 p-1 shadow-[var(--shadow-input)] lg:min-h-0 lg:w-auto lg:shrink-0"
                                role="tablist"
                                aria-label="Filter by result type"
                            >
                                {scopes.map((scope) => {
                                    const selected = draftScope === scope.id;
                                    return (
                                        <button
                                            key={scope.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={selected}
                                            onClick={() => setDraftScope(scope.id)}
                                            className={`flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-2 py-2 text-xs font-bold transition-all duration-200 lg:min-h-0 lg:px-3 lg:flex-none ${selected
                                                ? 'btn-theme-tab-selected'
                                                : 'border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-tertiery)] hover:text-[var(--color-text-primary)]'
                                                }`}
                                        >
                                            {scope.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-2 flex flex-col gap-1 text-[var(--color-text-muted)] max-lg:mt-2 sm:mt-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                            <p className="text-xs font-semibold leading-snug text-[var(--color-text-secondary)] sm:text-sm">{browseSummary}</p>
                            <p className="text-[10px] font-medium leading-snug text-[var(--color-text-soft)] sm:text-xs">
                                Apply changes to update the main browse results.
                            </p>
                        </div>
                    </div>

                    {/* On mobile: simple flex column stack. On desktop (lg): side-by-side panels with independent scroll. */}
                    <div className="mt-3 flex flex-col gap-3 lg:mt-4 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:grid-rows-1 lg:items-stretch lg:gap-4 lg:overflow-hidden">
                        <section className="surface-card flex flex-col rounded-2xl p-3 shadow-[var(--shadow-card-soft)] sm:rounded-[24px] sm:p-4 lg:h-full lg:min-h-0">
                            <div className="flex shrink-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[var(--color-text-primary)]">Providers</p>
                                    <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-text-muted)] max-lg:line-clamp-2 sm:mt-1 sm:text-xs">
                                        Select one provider or browse across all providers.
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-accent-pale)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-soft)] sm:px-2.5 sm:py-1 sm:text-[11px]">
                                    {visibleProviders.length}
                                </span>
                            </div>

                            <div className="mt-3 sm:mt-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
                                <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 lg:[scrollbar-gutter:stable]">
                                    {/* Mobile: slice to 6 unless expanded or selected provider is beyond slot 6 */}
                                    {(() => {
                                        const MOBILE_LIMIT = 4;
                                        const selectedIndex = visibleProviders.findIndex((p) => p.name === draftProvider);
                                        const mustExpand = selectedIndex >= MOBILE_LIMIT;
                                        const isExpanded = providersExpanded || mustExpand;
                                        const displayedProviders = isExpanded ? visibleProviders : visibleProviders.slice(0, MOBILE_LIMIT);
                                        const hasMore = visibleProviders.length > MOBILE_LIMIT;
                                        return (
                                            <>
                                                <div className="grid grid-cols-2 gap-2 lg:gap-x-3 lg:gap-y-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDraftProvider(allProvidersValue)}
                                                        className={`col-span-full w-full min-w-0 rounded-xl border px-3 py-2 text-center text-sm font-semibold transition sm:text-left ${draftProvider === allProvidersValue
                                                            ? 'btn-theme-tab-selected'
                                                            : 'border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]'
                                                            }`}
                                                    >
                                                        <span className="block text-[13px] sm:text-sm">All Providers</span>
                                                        <span className="mt-0.5 block text-[10px] font-medium text-[var(--color-text-soft)] sm:mt-1 sm:text-[11px]">
                                                            {providers.length} total
                                                        </span>
                                                    </button>

                                                    {displayedProviders.map((provider) => {
                                                        const selected = draftProvider === provider.name;
                                                        const providerLogo = getProviderLogo(provider);
                                                        return (
                                                            <button
                                                                key={provider.name}
                                                                type="button"
                                                                onClick={() => setDraftProvider(provider.name)}
                                                                className={`flex min-h-[90px] w-full min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition lg:min-h-[120px] lg:px-3 lg:py-2.5 ${selected
                                                                    ? 'border-[var(--color-primary)] bg-[var(--color-accent-pale)] text-[var(--color-surface-accent)] shadow-[var(--shadow-brand-soft)]'
                                                                    : 'border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-pale)]'
                                                                    }`}
                                                            >
                                                                {providerLogo && (
                                                                    <span className="mb-2 flex h-8 w-full max-w-full shrink-0 items-center justify-center overflow-hidden lg:mb-2.5 lg:h-12">
                                                                        <img
                                                                            src={providerLogo}
                                                                            alt=""
                                                                            className="max-h-full max-w-full object-contain object-center"
                                                                            loading="lazy"
                                                                            draggable={false}
                                                                        />
                                                                    </span>
                                                                )}
                                                                <span className="flex min-w-0 flex-col items-center">
                                                                    <span className="block line-clamp-1 text-[11px] font-bold leading-tight sm:text-xs lg:text-sm lg:line-clamp-2">{provider.name}</span>
                                                                    <span className="mt-0.5 block text-[9px] font-medium text-[var(--color-text-soft)] lg:mt-1.5 lg:text-[11px]">
                                                                        {providerGameCounts[provider.name] ?? 0} games
                                                                    </span>
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* View More / Show Less — mobile only */}
                                                {hasMore && !mustExpand && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setProvidersExpanded((prev) => !prev)}
                                                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-pale)] lg:hidden"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                                                                Show Less
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                                                View More ({visibleProviders.length - MOBILE_LIMIT} more)
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </section>

                        <section className="surface-card flex flex-col rounded-2xl p-3 shadow-[var(--shadow-card-soft)] sm:rounded-[24px] sm:p-4 lg:h-full lg:min-h-0">
                            <div className="flex shrink-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-[var(--color-text-primary)]">Matching Games</p>
                                    <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-text-muted)] max-lg:line-clamp-2 sm:mt-1 sm:text-xs">
                                        Browse the games that match your current search and provider filter.
                                    </p>
                                </div>
                                <span className="shrink-0 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-accent-pale)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-soft)] sm:px-2.5 sm:py-1 sm:text-[11px]">
                                    {visibleGames.length}
                                </span>
                            </div>

                            {visibleGames.length > 0 ? (
                                <>
                                    <div className="mt-3 sm:mt-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
                                        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1 lg:[scrollbar-gutter:stable]">
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                                {visibleGames.slice(0, 24).map((game) => (
                                                    <article
                                                        key={`${game.provider}-${game.name}`}
                                                        className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)]/90 p-2 shadow-[var(--shadow-subtle)] sm:rounded-2xl sm:p-3"
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-subtle)] sm:h-12 sm:w-12">
                                                                <img
                                                                    src={game.imgUrl}
                                                                    alt={game.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="line-clamp-1 text-[11px] font-bold leading-tight text-[var(--color-text-primary)] sm:text-xs sm:leading-snug">
                                                                    {game.name}
                                                                </p>
                                                                <p className="mt-0.5 truncate text-[9px] font-medium leading-tight text-[var(--color-text-muted)] sm:text-[10px]">
                                                                    {game.provider}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {visibleGames.length > 24 && (
                                        <p className="mt-2 shrink-0 text-[10px] font-medium leading-snug text-[var(--color-text-soft)] sm:mt-3 sm:text-xs">
                                            Showing the first 24 matches in the popup. Apply the filter to browse the full result set on the page.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="mt-3 sm:mt-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
                                    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-accent-pale)] px-3 py-6 text-center sm:rounded-2xl sm:px-4 sm:py-8">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--color-text-primary)]">
                                                No games or providers found
                                            </p>
                                            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                                Try searching a different game or provider.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-tertiery)]/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:px-6 lg:py-4 lg:pb-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] px-4 text-sm font-bold text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-pale)] lg:h-11 lg:min-h-0 lg:w-auto"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleApply}
                        className="btn-theme-cta inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold shadow-[var(--shadow-cta-soft)] lg:h-11 lg:min-h-0 lg:w-auto lg:shadow-none"
                    >
                        <SlidersHorizontal size={16} />
                        Apply Filters
                    </button>
                </div>
            </section>
        </div>
    );
}
