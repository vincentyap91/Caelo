import React from 'react';
import LiveTransactionsPanel from './home/LiveTransactionsPanel';
import RecentBigWinsSection from './home/RecentBigWinsSection';

const liveActivityCardClass =
    'w-full overflow-hidden rounded-2xl border border-[var(--color-border-brand-soft)] bg-gradient-to-b from-white via-[var(--color-surface-subtle)] to-[var(--color-accent-50)]/50 p-6 shadow-[var(--shadow-card-soft)] md:p-8 lg:p-9';

/**
 * Homepage: two stacked cards (live transactions, then recent big wins) with matching shell styling.
 */
export default function HomeLiveActivity() {
    return (
        <div className="flex w-full flex-col gap-5 md:gap-6 lg:gap-8">
            <div className={liveActivityCardClass}>
                <LiveTransactionsPanel />
            </div>
            <div className={liveActivityCardClass}>
                <RecentBigWinsSection />
            </div>
        </div>
    );
}
