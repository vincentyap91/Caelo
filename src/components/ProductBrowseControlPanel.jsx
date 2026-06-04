import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { BROWSE_MEMBERSHIP_REBATE, BROWSE_WALLET_BALANCE } from '../constants/browseWalletSummary';
import WalletRebateSummaryBar, { WALLET_REBATE_BROWSE_PANEL_CLASS } from './WalletRebateSummaryBar';
import SearchProvider from './SearchProvider';

export default function ProductBrowseControlPanel({
    category,
    searchPlaceholder = 'Search games or providers',
    query,
    onQueryChange,
    searchScope,
    onSearchScopeChange,
    scopes,
    onOpenFilterModal,
    resultSummary,
    providerSummaryText,
    promoSection = null,
    showWalletSummary = true,
}) {
    return (
        <section className="mt-1.5 md:mt-3">
            <div className={WALLET_REBATE_BROWSE_PANEL_CLASS}>
                {showWalletSummary ? (
                    <WalletRebateSummaryBar
                        wallet={BROWSE_WALLET_BALANCE}
                        membershipRebate={BROWSE_MEMBERSHIP_REBATE}
                        compact
                        bare
                        denseMobile
                    />
                ) : null}

                {promoSection ? (
                    <div className={showWalletSummary ? 'mt-2 md:mt-3' : ''}>{promoSection}</div>
                ) : null}

                <div
                    className={
                        showWalletSummary
                            ? 'mt-2 border-t border-[var(--color-border-subtle)] pt-2 md:mt-3.5 md:pt-3.5'
                            : promoSection
                              ? 'mt-2 md:mt-2.5'
                              : 'pt-0.5 md:pt-1'
                    }
                >
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                        <div className="hidden min-h-10 min-w-0 w-full md:flex md:flex-1">
                            <SearchProvider
                                value={query}
                                onChange={onQueryChange}
                                category={category}
                                placeholder={searchPlaceholder}
                                ariaLabel={`Search ${searchScope === 'all' ? 'games or providers' : searchScope}`}
                                widthClassName="w-full"
                            />
                        </div>
                        <div className="flex w-full flex-col gap-1.5 md:flex-row md:w-auto md:items-center md:gap-3">
                            <button
                                type="button"
                                onClick={onOpenFilterModal}
                                aria-label="Open filters: search games or providers, filter by type, and choose a provider"
                                className="inline-flex h-10 min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/85 px-3 text-sm font-bold text-[var(--color-text-secondary)] shadow-[var(--shadow-input)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-accent-50)] md:w-auto md:px-4"
                            >
                                <SlidersHorizontal size={16} aria-hidden />
                                Filter
                            </button>

                            <div
                                className="hidden w-full items-center gap-1 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]/75 p-1 shadow-[var(--shadow-input)]"
                                role="tablist"
                                aria-label="Search result filters"
                            >
                                {scopes.map((scope) => {
                                    const selected = searchScope === scope.id;
                                    return (
                                        <button
                                            key={scope.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={selected}
                                            onClick={() => onSearchScopeChange(scope.id)}
                                            className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 md:flex-none ${selected
                                                    ? 'btn-theme-tab-selected'
                                                    : 'border border-transparent bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-base)] hover:text-[var(--color-text-primary)]'
                                                }`}
                                        >
                                            {scope.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] font-medium leading-snug text-[var(--color-text-muted)] md:mt-2.5 md:flex-row md:items-center md:justify-between md:gap-2 md:text-xs">
                        <p className="truncate md:overflow-visible md:whitespace-normal">{resultSummary}</p>
                        <p className="hidden truncate md:block md:max-w-[55%] md:text-right">{providerSummaryText}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
