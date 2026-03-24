import React, { useEffect, useState } from 'react';
import {
    ChevronDown,
    Headset,
    Heart,
    LogOut,
    PencilLine,
    ScrollText,
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
import { supportOptions } from '../constants/supportOptions';
import { settingsOptions } from '../constants/settingsOptions';
import { REWARDS_NAV_ICONS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';
import VipStatusPill from './VipStatusPill';

const accountLinks = [
    { id: 'profile', label: 'Account Details', icon: UserRound },
    { id: 'verification', label: 'Verification', icon: ShieldCheck },
    { id: 'favourites', label: 'Favourites', icon: Heart },
    { id: 'my-bets', label: 'My Bets', icon: ScrollText },
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
    'my-bets': 'account',
    'loyalty-rewards': 'loyaltyRewards',
    feedback: 'support',
    'help-center': 'support',
    security: 'settings',
    notifications: 'settings',
    rebate: 'cashier',
    'referral-commission': 'cashier',
    deposit: 'cashier',
    withdrawal: 'cashier',
};

function parseRewardsTabFromHash() {
    if (typeof window === 'undefined') return 'daily-bonus';
    if (window.location.pathname !== '/loyalty-rewards') return 'daily-bonus';
    const h = window.location.hash.slice(1);
    const ids = REWARDS_PROGRAMS.map((p) => p.id);
    return ids.includes(h) ? h : 'daily-bonus';
}

export default function AccountSidebar({
    activePage = 'profile',
    authUser,
    onNavigate,
    onLogout,
    onLiveChatClick,
}) {
    const vipLevel = authUser?.vipLevel || 'Diamond';
    const [openMenus, setOpenMenus] = useState({
        cashier: false,
        account: false,
        loyaltyRewards: false,
        support: false,
        settings: false,
    });
    const [rewardsNavTab, setRewardsNavTab] = useState(parseRewardsTabFromHash);
    const activeMenuKey = MENU_BY_PAGE[activePage] ?? null;

    useEffect(() => {
        setOpenMenus({
            cashier: activeMenuKey === 'cashier',
            account: activeMenuKey === 'account',
            loyaltyRewards: activeMenuKey === 'loyaltyRewards',
            support: activeMenuKey === 'support',
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
                    support: false,
                    settings: false,
                    [menuKey]: true,
                }
                : {
                    cashier: false,
                    account: false,
                    loyaltyRewards: false,
                    support: false,
                    settings: false,
                };
        });
    };

    const isMenuOpen = (menuKey) => menuKey === activeMenuKey || openMenus[menuKey];

    const handleNavClick = (pageId) => {
        const pageMap = { profile: 'profile', verification: 'verification', favourites: 'favourites', 'my-bets': 'my-bets' };
        onNavigate?.(pageMap[pageId] ?? pageId);
    };

    const handleCashierClick = (pageId) => {
        if (pageId === 'rebate') onNavigate?.('rebate');
        if (pageId === 'referral-commission') onNavigate?.('referral-commission');
        if (pageId === 'deposit') onNavigate?.('deposit');
        if (pageId === 'withdrawal') onNavigate?.('withdrawal');
    };

    const username = authUser?.name || 'demo';

    return (
        <>
            <aside
                className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain border-r border-[var(--color-accent-100)] bg-[var(--color-surface-base)] p-5 text-[var(--color-text-strong)] shadow-[var(--shadow-sidebar)] transition-transform duration-300 lg:sticky lg:top-24 lg:h-auto lg:max-h-none lg:w-[320px] lg:flex-none lg:overflow-visible lg:rounded-[24px] lg:border lg:border-[var(--color-border-default)] lg:p-6 lg:shadow-[var(--shadow-card-raised)] w-full max-w-[88vw] lg:max-w-none"
            >
                <div>
                    <div className="flex items-start gap-4 pt-1">
                        <div className="relative shrink-0 mt-1 ml-1">
                            <div className="blue-accent-avatar flex aspect-square h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                                <UserCircle2 size={40} className="block text-[var(--color-accent-600)]" />
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-sm transition hover:scale-105 hover:bg-[var(--color-accent-50)]"
                                aria-label="Edit profile"
                            >
                                <PencilLine size={12} />
                            </button>
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                            <p className="text-[1.6rem] font-bold leading-tight text-[var(--color-text-strong)]">Hi, {username}</p>
                            <div className="mt-2 space-y-1 text-sm font-medium text-[var(--color-text-muted)]">
                                <p>Joined: 08/01/2026</p>
                                <p>Player ID: 679129</p>
                            </div>
                            <VipStatusPill level={vipLevel} className="mt-3" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-5">
                    <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('cashier')}
                            className="flex w-full items-center justify-between gap-3 text-left"
                        >
                            <span className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <Wallet size={18} />
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text-strong)]">Cashier</span>
                            </span>
                            <ChevronDown size={18} className={`text-[var(--color-text-soft)] transition-transform ${openMenus.cashier ? 'rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen('cashier') && (
                            <div className="mt-4 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1">
                                {cashierLinks.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleCashierClick(id)}
                                            className={`group flex min-h-[48px] w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3.5 text-left transition-all ${
                                                isActive
                                                    ? 'border-l-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:scale-[1.02] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]'
                                            }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`} />
                                            <span className="text-base font-normal">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('account')}
                            className="flex w-full items-center justify-between gap-3 text-left"
                        >
                            <span className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <UserRound size={18} />
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text-strong)]">My Account</span>
                            </span>
                            <ChevronDown size={18} className={`text-[var(--color-text-soft)] transition-transform ${isMenuOpen('account') ? 'rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen('account') && (
                            <div className="mt-4 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1">
                                {accountLinks.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => handleNavClick(id)}
                                            className={`group flex min-h-[48px] w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3.5 text-left transition-all ${
                                                isActive
                                                    ? 'border-l-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:scale-[1.02] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]'
                                            }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`} />
                                            <span className="text-base font-normal">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('loyaltyRewards')}
                            className="flex w-full items-center justify-between gap-3 text-left"
                        >
                            <span className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <Trophy size={18} />
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text-strong)]">Rewards</span>
                            </span>
                            <ChevronDown
                                size={18}
                                className={`text-[var(--color-text-soft)] transition-transform ${isMenuOpen('loyaltyRewards') ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isMenuOpen('loyaltyRewards') && (
                            <div className="mt-4 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1">
                                {REWARDS_PROGRAMS.map(({ id, label }) => {
                                    const NavIcon = REWARDS_NAV_ICONS[id] ?? Trophy;
                                    const isActive =
                                        activePage === 'loyalty-rewards' && rewardsNavTab === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => onNavigate?.('loyalty-rewards', { rewardsTab: id })}
                                            className={`group flex min-h-[48px] w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3.5 text-left transition-all ${
                                                isActive
                                                    ? 'border-l-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)] shadow-sm'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:scale-[1.02] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]'
                                            }`}
                                        >
                                            <NavIcon
                                                size={18}
                                                className={`${
                                                    isActive
                                                        ? 'text-[var(--color-accent-600)]'
                                                        : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'
                                                }`}
                                            />
                                            <span className="text-base font-normal">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('support')}
                            className="flex w-full items-center justify-between gap-3 text-left"
                        >
                            <span className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <Headset size={18} />
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text-strong)]">Support</span>
                            </span>
                            <ChevronDown size={18} className={`text-[var(--color-text-soft)] transition-transform ${isMenuOpen('support') ? 'rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen('support') && (
                            <div className="mt-4 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1">
                                {supportOptions.map(({ label, icon: Icon }) => {
                                    const isActive =
                                        (activePage === 'feedback' && label === 'Share Feedback') ||
                                        (activePage === 'help-center' && label === 'Help Center');
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => {
                                                if (label === 'Live Chat') onLiveChatClick?.();
                                                if (label === 'Share Feedback') onNavigate?.('feedback');
                                                if (label === 'Help Center') onNavigate?.('help-center');
                                            }}
                                            className={`group flex min-h-[48px] w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3.5 text-left transition-all hover:scale-[1.02] ${
                                                isActive
                                                    ? 'border-l-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:border-l-[var(--color-accent-500)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]'
                                            }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`} />
                                            <span className="text-base font-normal">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[20px] border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] p-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu('settings')}
                            className="flex w-full items-center justify-between gap-3 text-left"
                        >
                            <span className="flex items-center gap-3">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                    <Settings size={18} />
                                </span>
                                <span className="text-lg font-bold text-[var(--color-text-strong)]">Settings</span>
                            </span>
                            <ChevronDown size={18} className={`text-[var(--color-text-soft)] transition-transform ${isMenuOpen('settings') ? 'rotate-180' : ''}`} />
                        </button>
                        {isMenuOpen('settings') && (
                            <div className="mt-4 space-y-1 overflow-hidden rounded-xl bg-[var(--color-surface-base)] p-1">
                                {settingsOptions.map(({ id, label, icon: Icon }) => {
                                    const isActive = activePage === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => onNavigate?.(id)}
                                            className={`group flex min-h-[48px] w-full items-center gap-3 rounded-xl border-l-4 px-4 py-3.5 text-left transition-all hover:scale-[1.02] ${
                                                isActive
                                                    ? 'border-l-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-700)]'
                                                    : 'border-l-transparent bg-[var(--color-surface-base)] text-[var(--color-text-muted)] hover:border-l-[var(--color-accent-500)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]'
                                            }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-[var(--color-accent-600)]' : 'text-[var(--color-text-soft)] group-hover:text-[var(--color-accent-500)]'}`} />
                                            <span className="text-base font-normal">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="mt-2 inline-flex min-h-[48px] w-full items-center gap-3 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-4 py-3.5 text-left text-sm font-semibold text-[var(--color-text-main)] shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition-all hover:scale-[1.02] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-700)]"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}
