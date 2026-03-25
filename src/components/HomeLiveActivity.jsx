import React from 'react';
import LiveTransactionsPanel from './home/LiveTransactionsPanel';
import RecentBigWinsSection from './home/RecentBigWinsSection';

/**
 * Homepage block: one outer shell, two flat columns (live feed + big wins).
 */
export default function HomeLiveActivity() {
    return (
        <div className="w-full overflow-hidden rounded-2xl border border-[var(--color-border-brand-soft)] bg-gradient-to-b from-white via-[var(--color-surface-subtle)] to-[var(--color-accent-50)]/50 p-6 shadow-[var(--shadow-card-soft)] md:p-8 lg:p-9">
            <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[var(--color-border-accent)]">
                <div className="flex min-h-0 min-w-0 flex-col lg:h-full lg:pr-8 xl:pr-10">
                    <LiveTransactionsPanel />
                </div>
                <div className="flex min-h-0 min-w-0 flex-col lg:h-full lg:pl-8 xl:pl-10">
                    <RecentBigWinsSection />
                </div>
            </div>
        </div>
    );
}
