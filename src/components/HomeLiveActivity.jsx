import React from 'react';
import LiveTransactionsPanel from './home/LiveTransactionsPanel';
import RecentBigWinsSection from './home/RecentBigWinsSection';

const liveActivityCardClass =
    'w-full overflow-hidden rounded-2xl border border-[var(--color-border-brand-soft)] bg-gradient-to-b from-white via-[var(--color-surface-subtle)] to-[var(--color-accent-50)]/50 p-6 shadow-[var(--shadow-card-soft)] md:p-8 lg:p-9';

/**
 * Homepage: two matching cards — stacked on small screens, live transactions left / big wins right from lg.
 */
export default function HomeLiveActivity() {
    return (
        <div className="flex w-full flex-col gap-5 md:gap-6 lg:flex-row lg:items-stretch lg:gap-6 xl:gap-8">
            <div className={`min-w-0 flex-1 ${liveActivityCardClass}`}>
                <LiveTransactionsPanel />
            </div>
            <div className={`min-w-0 flex-1 ${liveActivityCardClass}`}>
                <RecentBigWinsSection />
            </div>
        </div>
    );
}
