import React, { useEffect, useState } from 'react';
import { HISTORY_RECORD_NAV } from '../../constants/historyRecordPages';
import { settingsOptions } from '../../constants/settingsOptions';
import { REWARDS_PROGRAMS, parseRewardsTabFromHash } from '../../constants/rewardsPrograms';

const ACCOUNT_TAB_ITEMS = [
    { id: 'profile', label: 'Profile', page: 'profile' },
    { id: 'verification', label: 'Verification', page: 'verification' },
    { id: 'favourites', label: 'Favourites', page: 'favourites' },
    { id: 'deposit', label: 'Deposit', page: 'deposit' },
    { id: 'withdrawal', label: 'Withdrawal', page: 'withdrawal' },
    { id: 'referral-commission', label: 'Referral Commission', page: 'referral-commission' },
    { id: 'rebate', label: 'Rebate', page: 'rebate' },
    ...REWARDS_PROGRAMS.map(({ id, label }) => ({
        id: `rewards-${id}`,
        label,
        page: 'loyalty-rewards',
        rewardsTab: id,
    })),
    ...HISTORY_RECORD_NAV.map(({ id, label }) => ({
        id,
        label,
        page: id,
    })),
    ...settingsOptions.map(({ id, label, action }) => ({
        id,
        label,
        page: action === 'liveChat' ? null : id,
        action,
    })),
];

function isTabActive(activePage, rewardsNavTab, item) {
    if (item.action === 'liveChat') {
        return false;
    }

    if (item.page === 'loyalty-rewards' && item.rewardsTab) {
        return activePage === 'loyalty-rewards' && rewardsNavTab === item.rewardsTab;
    }

    return activePage === item.page;
}

export default function AccountTabBar({
    activePage,
    onNavigate,
    onLiveChatClick,
    className = '',
}) {
    const [rewardsNavTab, setRewardsNavTab] = useState(parseRewardsTabFromHash);

    useEffect(() => {
        const sync = () => setRewardsNavTab(parseRewardsTabFromHash());
        sync();
        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        return () => {
            window.removeEventListener('hashchange', sync);
            window.removeEventListener('popstate', sync);
        };
    }, [activePage]);

    const handleClick = (item) => {
        if (item.action === 'liveChat') {
            onLiveChatClick?.();
            return;
        }

        if (item.page === 'loyalty-rewards' && item.rewardsTab) {
            onNavigate?.('loyalty-rewards', { rewardsTab: item.rewardsTab });
            return;
        }

        if (item.page) {
            onNavigate?.(item.page);
        }
    };

    return (
        <nav
            aria-label="Account navigation"
            className={`account-tab-bar -mx-4 mb-5 hidden overflow-x-auto px-4 scrollbar-thin lg:mx-0 lg:mb-6 lg:flex lg:rounded-xl lg:px-2 lg:py-2 ${className}`.trim()}
        >
            <div className="flex min-w-0 gap-1.5 lg:flex-wrap">
                {ACCOUNT_TAB_ITEMS.map((item) => {
                    const active = isTabActive(activePage, rewardsNavTab, item);
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => handleClick(item)}
                            className={`account-tab shrink-0 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap transition-all lg:text-sm ${active ? 'account-tab--active' : ''}`}
                            aria-current={active ? 'page' : undefined}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
