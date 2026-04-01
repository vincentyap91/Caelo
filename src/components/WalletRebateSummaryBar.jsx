import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';

function SummaryItem({
    title,
    value,
    icon: Icon,
    valueClassName = 'text-[var(--color-brand-deep)]',
    iconClassName = 'text-[var(--color-text-soft)]',
    emphasis = 'default',
}) {
    const isPrimary = emphasis === 'primary';

    return (
        <article className="surface-card flex h-full min-h-[86px] min-w-0 items-center justify-between gap-3 rounded-[var(--radius-panel)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(250,252,255,0.94)_100%)] px-4 py-3 shadow-[var(--shadow-subtle)] sm:min-h-[92px] sm:px-4.5 sm:py-3.5">
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-text-main)] sm:text-[15px]">
                    {title}
                </p>
                <p
                    className={`mt-2 tabular-nums leading-none tracking-[-0.03em] ${valueClassName} ${
                        isPrimary
                            ? 'text-[1.7rem] font-bold sm:text-[1.85rem]'
                            : 'text-[1.6rem] font-bold sm:text-[1.72rem]'
                    }`}
                >
                    {value}
                </p>

            </div>

            <div className="flex shrink-0 items-start">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] sm:h-10 sm:w-10 ${iconClassName}`}>
                    <Icon size={17} strokeWidth={2} />
                </span>
            </div>
        </article>
    );
}

export default function WalletRebateSummaryBar({
    wallet = '251.00',
    membershipRebate = '0.00%',
    className = '',
}) {
    return (
        <section
            aria-label="Wallet and membership rebate summary"
            className={`surface-panel rounded-[calc(var(--radius-shell)-4px)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(248,251,255,0.82)_100%)] p-2.5 shadow-[var(--shadow-subtle)] sm:p-3 ${className}`}
        >
            <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                <SummaryItem
                    title="Wallet Balance"
                    value={wallet}
                    icon={RefreshCw}
                    emphasis="primary"
                />
                <SummaryItem
                    title="Membership Rebate"
                    value={membershipRebate}
                    icon={Lock}
                    iconClassName="text-[var(--color-text-soft)]"
                />
            </div>
        </section>
    );
}
