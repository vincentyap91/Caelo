import React from 'react';
import LiveTransactionsPanel from './home/LiveTransactionsPanel';
import RecentBigWinsSection from './home/RecentBigWinsSection';

const liveActivityCardClass =
    'home-live-activity-card w-full overflow-hidden rounded-2xl bg-gradient-home-dashboard p-6 shadow-[var(--shadow-card-soft)] md:p-8 lg:p-9';

/**
 * Homepage: Live Transactions and Recent Big Wins — each full-width row, stacked.
 */
export default function HomeLiveActivity({ onNavigate }) {
    return (
        <div className="home-live-activity flex w-full flex-col gap-5 md:gap-6 xl:gap-8">
            <div className={liveActivityCardClass}>
                <LiveTransactionsPanel />
            </div>
            <div className={liveActivityCardClass}>
                <RecentBigWinsSection onNavigate={onNavigate} />
            </div>
        </div>
    );
}
