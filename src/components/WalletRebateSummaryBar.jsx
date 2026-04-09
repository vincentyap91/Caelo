import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';

function SummaryItem({
    title,
    value,
    icon: Icon,
    valueClassName = 'text-[var(--color-brand-deep)]',
    iconClassName = 'text-[var(--color-text-soft)]',
    emphasis = 'default',
    compact = false,
}) {
    const isPrimary = emphasis === 'primary';

    return (
        <article
            className={`surface-card flex h-full min-w-0 items-center justify-between rounded-[var(--radius-panel)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(250,252,255,0.94)_100%)] shadow-[var(--shadow-subtle)] ${
                compact
                    ? 'min-h-[68px] gap-2.5 px-3 py-2.5 sm:min-h-[72px] sm:px-3.5'
                    : 'min-h-[86px] gap-3 px-4 py-3 sm:min-h-[92px] sm:px-4.5 sm:py-3.5'
            }`}
        >
            <div className="min-w-0 flex-1">
                <p className={`font-semibold tracking-[-0.01em] text-[var(--color-text-main)] ${compact ? 'text-xs sm:text-[13px]' : 'text-sm'}`}>
                    {title}
                </p>
                <p
                    className={`tabular-nums leading-none tracking-[-0.03em] ${valueClassName} ${
                        isPrimary
                            ? compact
                                ? 'text-xl font-bold sm:text-2xl'
                                : 'text-2xl font-bold sm:text-3xl'
                            : compact
                                ? 'text-xl font-bold sm:text-2xl'
                                : 'text-2xl font-bold sm:text-3xl'
                    }`}
                >
                    {value}
                </p>
            </div>

            <div className="flex shrink-0 items-start">
                <span
                    className={`inline-flex items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] ${iconClassName} ${
                        compact ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10'
                    }`}
                >
                    <Icon size={compact ? 15 : 17} strokeWidth={2} />
                </span>
            </div>
        </article>
    );
}

export default function WalletRebateSummaryBar({
    wallet = '251.00',
    membershipRebate = '0.00%',
    className = '',
    compact = false,
    embedded = false,
    stackOnMobile = false,
}) {
    return (
        <section
            aria-label="Wallet and membership rebate summary"
            className={`${
                embedded
                    ? ''
                    : `surface-panel rounded-[calc(var(--radius-shell)-4px)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(248,251,255,0.82)_100%)] shadow-[var(--shadow-subtle)] ${
                          compact ? 'p-2 sm:p-2.5' : 'p-2.5 sm:p-3'
                      }`
            } ${className}`}
        >
            <div
                className={`grid ${
                    stackOnMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'
                } ${compact ? 'gap-2' : 'gap-2.5 sm:gap-3'}`}
            >
                <SummaryItem
                    title="Wallet Balance"
                    value={wallet}
                    icon={RefreshCw}
                    emphasis="primary"
                    compact={compact}
                />
                <SummaryItem
                    title="Membership Rebate"
                    value={membershipRebate}
                    icon={Lock}
                    iconClassName="text-[var(--color-text-soft)]"
                    compact={compact}
                />
            </div>
        </section>
    );
}
