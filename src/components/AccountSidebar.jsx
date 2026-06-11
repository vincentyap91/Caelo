import React, { useEffect, useState } from 'react';
import {
    ChevronDown,
    Heart,
    History,
    PencilLine,
    Settings,
    ShieldCheck,
    UserCircle2,
    UserRound,
    Wallet,
    ArrowDownToLine,
    ArrowUpFromLine,
    Users,
    Percent,
    Trophy,
} from 'lucide-react';
import { HISTORY_RECORD_NAV } from '../constants/historyRecordPages';
import { settingsOptions } from '../constants/settingsOptions';
import { REWARDS_NAV_ICONS, REWARDS_PROGRAMS, parseRewardsTabFromHash } from '../constants/rewardsPrograms';
import { PROFILE_NEXT_VIP_TIER, PROFILE_VIP_PROGRESS_PERCENT, PROFILE_VIP_TIER } from '../constants/profileVipTier';
import VipTierProgressCard from './VipTierProgressCard';

const accountLinks = [
    { id: 'profile', label: 'Account Details', icon: UserRound },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'favourites', label: 'Favourites', icon: Heart },
];

const cashierLinks = [
    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
    { id: 'withdrawal', label: 'Withdrawal', icon: ArrowUpFromLine },
    { id: 'referral-commission', label: 'Referral Commission', icon: Users },
    { id: 'rebate', label: 'Rebate', icon: Percent },
];

const MENU_BY_PAGE = {
    profile: 'account',
    verification: 'account',
    favourites: 'account',
    'loyalty-rewards': 'loyaltyRewards',
    feedback: 'settings',
    'help-center': 'settings',
    security: 'settings',
    notifications: 'settings',
    rebate: 'cashier',
    'referral-commission': 'cashier',
    deposit: 'cashier',
    withdrawal: 'cashier',
    ...Object.fromEntries(HISTORY_RECORD_NAV.map(({ id }) => [id, 'historyRecord'])),
};

export default function AccountSidebar({
    activePage = 'profile',
    authUser,
    guestPreview = false,
    onNavigate,
    onLogout,
    onLoginClick,
    onLiveChatClick,
}) {
    const [openMenus, setOpenMenus] = useState({
        cashier: false,
        account: false,
        loyaltyRewards: false,
        historyRecord: false,
        settings: false,
    });
    const [rewardsNavTab, setRewardsNavTab] = useState(parseRewardsTabFromHash);
    const activeMenuKey = MENU_BY_PAGE[activePage] ?? null;

    useEffect(() => {
        setOpenMenus({
            cashier: activeMenuKey === 'cashier',
            account: activeMenuKey === 'account',
            loyaltyRewards: activeMenuKey === 'loyaltyRewards',
            historyRecord: activeMenuKey === 'historyRecord',
            settings: activeMenuKey === 'settings',
        });
    }, [activeMenuKey]);

    useEffect(() => {
        const syncRewardsHash = () => setRewardsNavTab(parseRewardsTabFromHash());
        syncRewardsHash();
        window.addEventListener('hashchange', syncRewardsHash);
        window.addEventListener('popstate', syncRewardsHash);
        return () => {
            window.removeEventListener('hashchange', syncRewardsHash);
            window.removeEventListener('popstate', syncRewardsHash);
        };
    }, [activePage]);

    const toggleMenu = (menuKey) => {
        if (menuKey === activeMenuKey) {
            return;
        }

        setOpenMenus((current) => {
            const nextIsOpen = !current[menuKey];

            return nextIsOpen
                ? {
                    cashier: false,
                    account: false,
                    loyaltyRewards: false,
                    historyRecord: false,
                    settings: false,
                    [menuKey]: true,
                }
                : {
                    cashier: false,
                    account: false,
                    loyaltyRewards: false,
                    historyRecord: false,
                    settings: false,
                };
        });
    };

    const isMenuOpen = (menuKey) => menuKey === activeMenuKey || openMenus[menuKey];

    const handleNavClick = (pageId) => {
        const pageMap = { profile: 'profile', verification: 'verification', favourites: 'favourites' };
        onNavigate?.(pageMap[pageId] ?? pageId);
    };

    const handleCashierClick = (pageId) => {
        if (pageId === 'rebate') onNavigate?.('rebate');
        if (pageId === 'referral-commission') onNavigate?.('referral-commission');
        if (pageId === 'deposit') onNavigate?.('deposit');
        if (pageId === 'withdrawal') onNavigate?.('withdrawal', { openRolloverModal: true, source: 'account-sidebar' });
    };

    const username = guestPreview ? 'Guest' : (authUser?.name || 'demo');

    return (
        <>
            <aside
                className="user-dashboard-sidebar relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain border-r border-[var(--color-accent-glow)] bg-[var(--color-surface-base)] p-3.5 text-[var(--color-text-primary)] shadow-[var(--shadow-sidebar)] transition-transform duration-300 lg:sticky lg:top-24 lg:h-auto lg:max-h-none lg:w-[320px] lg:flex-none lg:overflow-visible lg:rounded-[24px] lg:border lg:border-[var(--color-border-subtle)] lg:p-6 lg:shadow-[var(--shadow-card-raised)] w-full max-w-[88vw] lg:max-w-none"
            >
                <div>
                    <div className="flex items-start gap-3 pt-0 lg:gap-4 lg:pt-1">
                        <div className="relative ml-0 mt-0 shrink-0 lg:ml-1 lg:mt-1">
                            <div className="blue-accent-avatar flex aspect-square h-14 w-14 items-center justify-center overflow-hidden rounded-full lg:h-16 lg:w-16">
                                <UserCircle2 className="block h-8 w-8 text-[var(--color-button-hover)] lg:h-10 lg:w-10" />
                            </div>
                            {!guestPreview && (
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('profile')}
                                    className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-surface-base)] text-[var(--color-button-hover)] shadow-sm transition hover:scale-105 hover:bg-[var(--color-accent-pale)] lg:h-7 lg:w-7"
                                    aria-label="Edit profile"
                                >
                                    <PencilLine className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                                </button>
                            )}
                        </div>
                        <div className="min-w-0 flex-1 pt-0 lg:pt-1">
                            <p className="text-xl font-bold leading-tight text-[var(--color-text-primary-card-title)] lg:text-2xl">{username}</p>
                            {!guestPreview && authUser?.phone && (
                                <p className="mt-1.5 text-xs font-medium text-[var(--color-text-small)] lg:mt-2 lg:text-sm">
                                    {authUser.phone}
                                </p>
                            )}
                            {guestPreview && (
                                <p className="mt-1.5 text-xs font-medium text-[var(--color-text-small)] lg:mt-2 lg:text-sm">
                                    Sign in to claim rewards and save your progress.
                                </p>
                            )}
                        </div>
                    </div>
                    {!guestPreview && (
                        <VipTierProgressCard
                            currentTier={PROFILE_VIP_TIER.toUpperCase()}
                            targetTier={PROFILE_NEXT_VIP_TIER}
                            progressPercent={PROFILE_VIP_PROGRESS_PERCENT}
                            className="mt-3 lg:hidden"
                        />
                    )}
                </div>

                <div className="mt-5 space-y-3 lg:mt-8 lg:space-y-5">
                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-3 lg:rounded-[20px] lg:p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('cashier')}
                            className="flex min-h-[44px] w-full items-center justify-between gap-2.5 text-left lg:min-h-0 lg:gap-3"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-cool-light)] text-[var(--color-button-hover)] lg:h-10 lg:w-10">
                                    <Wallet className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                                </span>
                                <span className="text-base font-bold text-[var(--color-text-primary-card-title)] lg:text-lg">Cashier</span>
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 transition-transform lg:h-[18px] lg:w-[18px] ${openMenus.cashier ? 'rotate-180 text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)]'}`}
                            />
                        </button>
                        {isMenuOpen('cashier') && (
                            <div className="mt-2.5 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1 lg:mt-4">
                                {cashierLinks.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleCashierClick(id)}
                                            className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-all lg:min-h-[48px] lg:gap-3 lg:px-4 lg:py-3.5 ${
                                                isActive
                                                    ? 'border-l-[var(--color-border-brand)] bg-[var(--color-accent-pale)] text-[var(--color-button-hover)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-small)] hover:scale-[1.02] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-button-hover)]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px] ${isActive ? 'text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-border-brand)]'}`}
                                            />
                                            <span className="text-sm font-normal lg:text-base">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-3 lg:rounded-[20px] lg:p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('account')}
                            className="flex min-h-[44px] w-full items-center justify-between gap-2.5 text-left lg:min-h-0 lg:gap-3"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-cool-light)] text-[var(--color-button-hover)] lg:h-10 lg:w-10">
                                    <UserRound className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                                </span>
                                <span className="text-base font-bold text-[var(--color-text-primary-card-title)] lg:text-lg">My Account</span>
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform lg:h-[18px] lg:w-[18px] ${isMenuOpen('account') ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isMenuOpen('account') && (
                            <div className="mt-2.5 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1 lg:mt-4">
                                {accountLinks.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleNavClick(id)}
                                            className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-all lg:min-h-[48px] lg:gap-3 lg:px-4 lg:py-3.5 ${
                                                isActive
                                                    ? 'border-l-[var(--color-border-brand)] bg-[var(--color-accent-pale)] text-[var(--color-button-hover)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-small)] hover:scale-[1.02] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-button-hover)]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px] ${isActive ? 'text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-border-brand)]'}`}
                                            />
                                            <span className="text-sm font-normal lg:text-base">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-3 lg:rounded-[20px] lg:p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('loyaltyRewards')}
                            className="flex min-h-[44px] w-full items-center justify-between gap-2.5 text-left lg:min-h-0 lg:gap-3"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-cool-light)] text-[var(--color-button-hover)] lg:h-10 lg:w-10">
                                    <Trophy className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                                </span>
                                <span className="text-base font-bold text-[var(--color-text-primary-card-title)] lg:text-lg">Rewards</span>
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform lg:h-[18px] lg:w-[18px] ${isMenuOpen('loyaltyRewards') ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isMenuOpen('loyaltyRewards') && (
                            <div className="mt-2.5 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1 lg:mt-4">
                                {REWARDS_PROGRAMS.map(({ id, label }) => {
                                    const NavIcon = REWARDS_NAV_ICONS[id] ?? Trophy;
                                    const isActive =
                                        activePage === 'loyalty-rewards' && rewardsNavTab === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => onNavigate?.('loyalty-rewards', { rewardsTab: id })}
                                            className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-all lg:min-h-[48px] lg:gap-3 lg:px-4 lg:py-3.5 ${
                                                isActive
                                                    ? 'border-l-[var(--color-border-brand)] bg-[var(--color-accent-pale)] text-[var(--color-button-hover)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-small)] hover:scale-[1.02] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-button-hover)]'
                                            }`}
                                        >
                                            <NavIcon
                                                className={`h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px] ${
                                                    isActive
                                                        ? 'text-[var(--color-button-hover)]'
                                                        : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-border-brand)]'
                                                }`}
                                            />
                                            <span className="text-sm font-normal lg:text-base">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-3 lg:rounded-[20px] lg:p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('historyRecord')}
                            className="flex min-h-[44px] w-full items-center justify-between gap-2.5 text-left lg:min-h-0 lg:gap-3"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-cool-light)] text-[var(--color-button-hover)] lg:h-10 lg:w-10">
                                    <History className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                                </span>
                                <span className="text-base font-bold text-[var(--color-text-primary-card-title)] lg:text-lg">History Record</span>
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform lg:h-[18px] lg:w-[18px] ${isMenuOpen('historyRecord') ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isMenuOpen('historyRecord') && (
                            <div className="mt-2.5 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1 lg:mt-4">
                                {HISTORY_RECORD_NAV.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => onNavigate?.(id)}
                                            className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-all hover:scale-[1.02] lg:min-h-[48px] lg:gap-3 lg:px-4 lg:py-3.5 ${
                                                isActive
                                                    ? 'border-l-[var(--color-border-brand)] bg-[var(--color-accent-pale)] text-[var(--color-button-hover)]'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-small)] hover:border-l-[var(--color-border-brand)] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-button-hover)]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px] ${isActive ? 'text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-border-brand)]'}`}
                                            />
                                            <span className="text-sm font-normal lg:text-base">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-3 lg:rounded-[20px] lg:p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('settings')}
                            className="flex min-h-[44px] w-full items-center justify-between gap-2.5 text-left lg:min-h-0 lg:gap-3"
                        >
                            <span className="flex min-w-0 items-center gap-2.5 lg:gap-3">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-cool-light)] text-[var(--color-button-hover)] lg:h-10 lg:w-10">
                                    <Settings className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
                                </span>
                                <span className="text-base font-bold text-[var(--color-text-primary-card-title)] lg:text-lg">Settings</span>
                            </span>
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform lg:h-[18px] lg:w-[18px] ${isMenuOpen('settings') ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isMenuOpen('settings') && (
                            <div className="mt-2.5 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1 lg:mt-4">
                                {settingsOptions.map(({ id, label, icon: Icon, action }) => {
                                    const isActive = activePage === id;
                                    const isLiveChat = action === 'liveChat';
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => {
                                                if (isLiveChat) {
                                                    onLiveChatClick?.();
                                                    return;
                                                }
                                                onNavigate?.(id);
                                            }}
                                            className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border-l-4 px-3 py-2.5 text-left transition-all hover:scale-[1.02] lg:min-h-[48px] lg:gap-3 lg:px-4 lg:py-3.5 ${
                                                isActive && !isLiveChat
                                                    ? 'border-l-[var(--color-border-brand)] bg-[var(--color-accent-pale)] text-[var(--color-button-hover)]'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-small)] hover:border-l-[var(--color-border-brand)] hover:bg-[var(--color-accent-pale)] hover:text-[var(--color-button-hover)]'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px] ${isActive && !isLiveChat ? 'text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-border-brand)]'}`}
                                            />
                                            <span className="text-sm font-normal lg:text-base">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {guestPreview ? (
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="btn-theme-primary mt-1.5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold shadow-sm transition hover:brightness-105 lg:mt-2 lg:min-h-[48px] lg:text-base"
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="profile-menu-logout mt-1.5 lg:mt-2"
                        >
                            <ShieldCheck className="h-[18px] w-[18px] shrink-0" strokeWidth={2.25} />
                            <span>Secure Logout</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
}

