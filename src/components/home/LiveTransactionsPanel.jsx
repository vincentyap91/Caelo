import React, { useMemo, useState } from 'react';
import SectionHeader from '../SectionHeader';
import { ArrowDownToLine, ArrowUpFromLine, Radio, User } from 'lucide-react';
import {
    HOME_LIVE_FEED_HEIGHT_CLASS,
    MOCK_LIVE_DEPOSITS,
    MOCK_LIVE_WITHDRAWALS,
    getUnifiedLiveTransactions,
    maskUsername,
} from '../../constants/homeLiveActivity';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

function LiveDot() {
    return (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success-main)] opacity-40" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-success-main)]" />
        </span>
    );
}

const TABS = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposit' },
    { id: 'withdrawal', label: 'Withdrawal' },
];

function TxRow({ row }) {
    const isDeposit = row.kind === 'deposit';
    const amountClass = isDeposit ? 'text-[var(--color-success-main)]' : 'text-[var(--color-brand-secondary)]';
    const avatarRing = isDeposit ? 'ring-[rgb(57_181_74_/_0.35)]' : 'ring-[rgb(0_114_188_/_0.35)]';

    return (
        <li className="flex items-center gap-3 py-3.5 md:gap-4 md:py-4">
            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(0_174_239_/_0.1)] text-[var(--color-brand-secondary)] ring-2 ring-inset ${avatarRing}`}
                aria-hidden
            >
                <User size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--color-text-strong)] md:text-base">
                    {maskUsername(row.user)}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[var(--color-text-soft)]">{row.timeAgo}</p>
            </div>
            <div
                className="flex shrink-0 items-center gap-1.5"
                title={isDeposit ? 'Deposit' : 'Withdrawal'}
            >
                {isDeposit ? (
                    <ArrowDownToLine
                        size={17}
                        strokeWidth={2.35}
                        className="shrink-0 text-[var(--color-success-main)]"
                        aria-hidden
                    />
                ) : (
                    <ArrowUpFromLine
                        size={17}
                        strokeWidth={2.35}
                        className="shrink-0 text-[var(--color-brand-secondary)]"
                        aria-hidden
                    />
                )}
                <span className={`text-sm font-bold tabular-nums md:text-base ${amountClass}`}>{row.amount}</span>
            </div>
        </li>
    );
}

function TxTrack({ rows }) {
    return (
        <ul className="m-0 list-none divide-y divide-[var(--color-border-default)]/90 p-0">
            {rows.map((row) => (
                <TxRow key={row.id} row={row} />
            ))}
        </ul>
    );
}

/**
 * Homepage: flat live transaction feed with All / Deposit / Withdrawal tabs (no inner cards).
 */
export default function LiveTransactionsPanel() {
    const [filter, setFilter] = useState('all');
    const reducedMotion = usePrefersReducedMotion();

    const rows = useMemo(() => {
        if (filter === 'deposit') return MOCK_LIVE_DEPOSITS.map((r) => ({ ...r, kind: 'deposit' }));
        if (filter === 'withdrawal') return MOCK_LIVE_WITHDRAWALS.map((r) => ({ ...r, kind: 'withdrawal' }));
        return getUnifiedLiveTransactions();
    }, [filter]);

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-col lg:h-full lg:min-h-0">
            <div className="shrink-0">
                <SectionHeader
                    title="Live Transactions"
                    icon={<Radio size={22} className="text-[var(--color-brand-secondary)]" strokeWidth={2.25} />}
                />
                <p className="-mt-1 mb-4 text-xs font-medium text-[var(--color-text-muted)] md:text-sm">
                    Real-time deposit &amp; withdrawal feed
                </p>

                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-full bg-[var(--color-surface-muted)]/90 p-1 ring-1 ring-[var(--color-border-default)]/60">
                    {TABS.map((t) => {
                        const active = filter === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setFilter(t.id)}
                                className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition md:text-sm ${
                                    active
                                        ? 'bg-[var(--color-brand-secondary)] text-white shadow-sm'
                                        : 'text-[var(--color-text-brand)] hover:bg-white/70'
                                }`}
                            >
                                {t.label}
                            </button>
                        );
                    })}
                    <div className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 py-1 pl-2 pr-2.5 ring-1 ring-[var(--color-border-default)]/50">
                        <LiveDot />
                        <span className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]">Live</span>
                    </div>
                </div>
            </div>

            <div className={`home-marquee-pausable shrink-0 overflow-hidden ${HOME_LIVE_FEED_HEIGHT_CLASS}`}>
                {reducedMotion ? (
                    <div className="h-full min-h-0 overflow-y-auto overscroll-contain pr-0.5">
                        <TxTrack rows={rows} />
                    </div>
                ) : (
                    <div className="animate-home-marquee-vertical-y will-change-transform">
                        <TxTrack rows={rows} />
                        <div aria-hidden>
                            <TxTrack rows={rows.map((r) => ({ ...r, id: `${r.id}__dup` }))} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


