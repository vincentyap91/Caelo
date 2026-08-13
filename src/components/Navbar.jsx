import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock,
    RefreshCw,
    Crown,
    Dices,
    Fish,
    Gamepad2,
    Gift,
    Grid3x3,
    HelpCircle,
    House,
    Info,
    LayoutGrid,
    Megaphone,
    Smartphone,
    Star,
    Ticket,
    X,
    Headset,
    History,
    Heart,
    LogOut,
    Settings,
    ShieldCheck,
    Trophy,
    UserCircle2,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import BalanceDetailDropdown from './BalanceDetailDropdown';
import CasinoChipIcon from './ui/CasinoChipIcon';
import RebateIcon from './ui/RebateIcon';
import LiveCasinoMenu from './LiveCasinoMenu';
import NavProviderDropdownPanel from './NavProviderDropdownPanel';
import { slotProvidersForNavDropdown } from '../constants/matchedSlotProviders';
import LanguageSwitcher from './LanguageSwitcher';
import { HISTORY_RECORD_NAV } from '../constants/historyRecordPages';
import { settingsOptions } from '../constants/settingsOptions';
import { REWARDS_NAV_ICONS, REWARDS_PROGRAMS, parseRewardsTabFromHash } from '../constants/rewardsPrograms';
import { getVipStatus } from '../constants/vipStatus';
import VipStatusPill from './VipStatusPill';
import MobileSiteHeader from './MobileSiteHeader';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { NAV_STICKY_SUBHEADER_TOP_CLASS } from '../constants/navStickyOffsets';

const slotsNavDropdownProviders = slotProvidersForNavDropdown();

/** Desktop white nav row — 12WIN reference order. */
const DESKTOP_MAIN_LINKS = [
    'Home',
    'All',
    'Sports',
    'Live',
    'Esports',
    'Live Casino',
    'Slots',
    'Fish Hunt',
    'Promotion',
    'Referral',
    'Membership',
];

const DESKTOP_SPORTS_MENU = [
    { label: 'Sports', page: 'sports', href: '/sports' },
    { label: 'Sportsbook', page: 'sportsbook', href: '/sportsbook' },
    { label: 'Bet on Your National Team', page: 'sportsbook-national-team', href: '/sportsbook/national-team' },
    { label: 'Bet on Big Tournaments', page: 'sportsbook-big-tournaments', href: '/sportsbook/big-tournaments' },
    { label: 'Long-term bets', page: 'sportsbook-long-term-bets', href: '/sportsbook/long-term-bets' },
];

const DESKTOP_LIVE_MENU = [
    { label: 'Multi-LIVE', page: 'sportsbook-multi-live', href: '/sportsbook/multi-live' },
    { label: 'Bet on Your National Team', page: 'sportsbook-live-national-team', href: '/sportsbook/live-national-team' },
    { label: 'Marble-Live', page: 'sportsbook-marble-live', href: '/sportsbook/marble-live' },
    { label: 'Fast bet', page: 'sportsbook-fast-bet', href: '/sportsbook/fast-bet' },
];

const DESKTOP_ESPORTS_MENU = [
    { label: 'All Esports', page: 'e-sports', href: '/e-sports' },
    { label: 'CS2', page: 'sportsbook', href: '/sportsbook' },
    { label: 'Dota 2', page: 'sportsbook', href: '/sportsbook' },
    { label: 'LoL', page: 'sportsbook', href: '/sportsbook' },
];

const DESKTOP_SPORTS_PAGES = new Set([
    'sports',
    'sportsbook',
    'sportsbook-event',
    'sportsbook-sports',
    'sportsbook-national-team',
    'sportsbook-big-tournaments',
    'sportsbook-long-term-bets',
    'sportsbook-favourites',
    'sportsbook-search',
]);

const DESKTOP_LIVE_PAGES = new Set([
    'sportsbook-live-national-team',
    'sportsbook-multi-live',
    'sportsbook-marble-live',
    'sportsbook-fast-bet',
]);

const DESKTOP_SPORTSBOOK_HOME_PAGES = new Set([
    'sportsbook',
    'sportsbook-event',
    'sportsbook-sports',
    'sportsbook-favourites',
    'sportsbook-search',
]);

/** More dropdown — Recent Game, Rebate, E-Sports. */
const DESKTOP_MORE_LINKS = ['Recent Game', 'Rebate', 'E-Sports'];

const NAV_TARGETS = {
    Home: 'home',
    All: 'all-games',
    Sports: 'sports',
    Sportsbook: 'sportsbook',
    'Live Casino': 'live-casino',
    Slots: 'slots',
    'Fish Hunt': 'fishing',
    Promotion: 'promotion',
    Referral: 'referral',
    Membership: 'vip',
    'Recent Game': 'hot-games',
    Rebate: 'rebate',
    'E-Sports': 'e-sports',
};

const NAV_HREFS = {
    Home: '/',
    All: '/all-games',
    Sports: '/sports',
    Sportsbook: '/sportsbook',
    'Live Casino': '/casino',
    Slots: '/slots',
    'Fish Hunt': '/fishing',
    Promotion: '/promotion',
    Referral: '/referral',
    Membership: '/vip',
    'Recent Game': '/hot-games',
    Rebate: '/rebate',
    'E-Sports': '/e-sports',
};

function isDesktopSportsActive(activePage) {
    return DESKTOP_SPORTS_PAGES.has(activePage);
}

function isDesktopLiveActive(activePage) {
    return DESKTOP_LIVE_PAGES.has(activePage);
}

function isDesktopEsportsActive(activePage) {
    return activePage === 'e-sports';
}

function isDesktopSportsItemActive(item, activePage) {
    if (item.page === 'sportsbook') {
        return DESKTOP_SPORTSBOOK_HOME_PAGES.has(activePage);
    }
    return activePage === item.page;
}

function isDesktopLiveItemActive(item, activePage) {
    if (item.page === 'sportsbook') return false;
    return activePage === item.page;
}

function isDesktopEsportsItemActive(item, activePage) {
    return item.page === 'e-sports' && activePage === 'e-sports';
}

function isDesktopMoreActive(activePage) {
    return DESKTOP_MORE_LINKS.some((link) => NAV_TARGETS[link] === activePage);
}
const MOBILE_PRIMARY_ITEMS = [
    { id: 'home', label: 'Home', page: 'home', icon: House },
    { id: 'promotions', label: 'Promotions', page: 'promotion', icon: Megaphone },
    { id: 'games', label: 'Games', page: 'all-games', icon: Gamepad2 },
    { id: 'referral', label: 'Referral', page: 'referral', icon: Users },
    { id: 'more', label: 'More', icon: LayoutGrid },
];
const MOBILE_GAMES_SUB_ITEMS = [
    { id: 'all-games', label: 'All Games', page: 'all-games', icon: Grid3x3 },
    { id: 'hot-games', label: 'Hot Games', page: 'hot-games', icon: Star },
    { id: 'recent-games', label: 'Recent Games', page: 'recent-games', icon: Clock },
    { id: 'casino', label: 'Casino', page: 'live-casino', icon: CasinoChipIcon },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'sportsbook', label: 'Sportsbook', page: 'sportsbook', icon: Trophy },
    { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Gamepad2 },
    { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
];

const MOBILE_MORE_SECTIONS = [
    {
        id: 'wallet',
        label: 'Wallet',
        icon: Wallet,
        items: [
            { id: 'deposit', label: 'Deposit', page: 'deposit', icon: ArrowDownToLine },
            { id: 'withdrawal', label: 'Withdrawal', page: 'withdrawal', icon: ArrowUpFromLine },
            { id: 'referral-commission', label: 'Referral Commission', page: 'referral-commission', icon: Users },
            { id: 'rebate', label: 'Rebate', page: 'rebate', icon: RebateIcon },
        ],
    },
    {
        id: 'rewards',
        label: 'Rewards',
        icon: Gift,
        items: REWARDS_PROGRAMS.map(({ id, label }) => ({
            id,
            label,
            page: 'loyalty-rewards',
            rewardsTab: id,
            icon: REWARDS_NAV_ICONS[id] ?? Trophy,
        })),
    },
    {
        id: 'history',
        label: 'History',
        icon: History,
        items: HISTORY_RECORD_NAV.map(({ id, label, icon }) => ({
            id,
            label,
            page: id,
            icon,
        })),
    },
    {
        id: 'account',
        label: 'Account',
        icon: UserRound,
        items: [
            { id: 'profile', label: 'Profile', page: 'profile', icon: UserRound },
            { id: 'my-account', label: 'My Account', page: 'profile', icon: UserCircle2, activePages: ['profile'] },
            { id: 'verification', label: 'Verification', page: 'verification', icon: ShieldCheck },
            { id: 'favourites', label: 'Favourites', page: 'favourites', icon: Heart },
            { id: 'vip', label: 'Memberships', page: 'vip', icon: Crown },
            { id: 'settings', label: 'Settings', page: 'security', icon: Settings, activePages: ['security', 'notifications'] },
        ],
    },
    {
        id: 'support',
        label: 'Support',
        icon: Headset,
        items: [
            { id: 'live-chat', label: 'Live Chat', icon: Headset, action: 'liveChat' },
            { id: 'help-center', label: 'Help Center', page: 'help-center', icon: HelpCircle },
            { id: 'feedback', label: 'Feedback', page: 'feedback', icon: Star },
            { id: 'app-download', label: 'App Download', icon: Smartphone, action: 'download' },
            { id: 'log-out', label: 'Log Out', icon: LogOut, action: 'logout' },
        ],
    },
];
const MOBILE_MORE_ACTIVE_PAGES = new Set([
    'e-sports',
    'lottery',
    'fishing',
    'poker',
    'deposit',
    'withdrawal',
    'referral-commission',
    'rebate',
    'loyalty-rewards',
    'transaction-record',
    'bet-record',
    'commission-record',
    'rebate-record',
    'daily-check-in-record',
    'promotion-record',
    'profile',
    'verification',
    'favourites',
    'vip',
    'security',
    'notifications',
    'help-center',
    'feedback',
    'my-bets',
]);
const MOBILE_MORE_SECTION_BY_PAGE = MOBILE_MORE_SECTIONS.reduce((accumulator, section) => {
    section.items.forEach(({ page, activePages }) => {
        if (page) {
            accumulator[page] = section.id;
        }
        activePages?.forEach((pageId) => {
            accumulator[pageId] = section.id;
        });
    });
    return accumulator;
}, {});

export default function Navbar({
    onNavigate,
    onDownloadAppClick,
    activePage = 'home',
    onLoginClick,
    onRegisterClick,
    authUser,
    onLogout,
    onAccountDetailsClick,
    onLiveChatClick,
    onTopLiveChatClick,
    onCasinoProviderSelect,
    onSlotsProviderSelect,
    onRefreshBalance,
    balanceRefreshing = false,
}) {
    const vipLevel = authUser?.vipLevel || 'Diamond';
    const profileTierLabel = String(authUser?.vipTier ?? authUser?.vipLevel ?? 'Normal');
    /** `null` | `'casino'` | `'slots'` ΓÇö shared mega-menu pattern */
    const [navProviderDropdown, setNavProviderDropdown] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [balanceDropdownOpen, setBalanceDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
    const [openMobileMoreSection, setOpenMobileMoreSection] = useState(null);
    const [language, setLanguage] = useState('en-us');
    const [openProfileSection, setOpenProfileSection] = useState('account');
    const [rewardsNavTab, setRewardsNavTab] = useState(parseRewardsTabFromHash);
    const profileMenuRef = useRef(null);
    const accountCards = [
        { id: 'profile', label: 'Account Details', icon: UserRound },
        { id: 'verification', label: 'Verification', icon: ShieldCheck },
        { id: 'favourites', label: 'Favourites', icon: Heart },
    ];
    const cashierPageById = {
        deposit: 'deposit',
        withdrawal: 'withdrawal',
        'referral-commission': 'referral-commission',
        rebate: 'rebate',
    };
    const cashierItems = [
        { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
        { id: 'withdrawal', label: 'Withdrawal', icon: ArrowUpFromLine },
        { id: 'referral-commission', label: 'Referral Commission', icon: Users },
        { id: 'rebate', label: 'Rebate', icon: RebateIcon },
    ];

    useBodyScrollLock(mobileMenuOpen);

    useEffect(() => {
        if (!profileMenuOpen && !balanceDropdownOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false);
                setBalanceDropdownOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [profileMenuOpen, balanceDropdownOpen]);

    useEffect(() => {
        const syncRewardsTab = () => setRewardsNavTab(parseRewardsTabFromHash());
        syncRewardsTab();
        window.addEventListener('hashchange', syncRewardsTab);
        window.addEventListener('popstate', syncRewardsTab);
        return () => {
            window.removeEventListener('hashchange', syncRewardsTab);
            window.removeEventListener('popstate', syncRewardsTab);
        };
    }, [activePage]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobileMenuOpen((prev) => (prev ? false : prev));
    }, [activePage]);

    useEffect(() => {
        if (!mobileMenuOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMobileMoreOpen(false);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMobileGamesOpen(false);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenMobileMoreSection(null);
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        document.body.dataset.mobileMenuOpen = mobileMenuOpen ? 'true' : 'false';

        return () => {
            delete document.body.dataset.mobileMenuOpen;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const closeIfDesktop = (event) => {
            if (event.matches) setMobileMenuOpen(false);
        };
        mq.addEventListener('change', closeIfDesktop);
        return () => mq.removeEventListener('change', closeIfDesktop);
    }, []);

    const toggleProfileSection = (sectionKey) => {
        setOpenProfileSection((current) => (current === sectionKey ? null : sectionKey));
    };

    const handleMobileNavigate = (targetPage, options) => {
        setMobileMenuOpen(false);
        onNavigate?.(targetPage, options);
    };

    const handleMobileDownloadApp = () => {
        setMobileMenuOpen(false);
        onDownloadAppClick?.();
    };

    const getMobileMoreDefaultSection = () => MOBILE_MORE_SECTION_BY_PAGE[activePage] ?? null;

    const handleMobileMoreToggle = () => {
        if (mobileMoreOpen) {
            setMobileMoreOpen(false);
            setOpenMobileMoreSection(null);
            return;
        }

        setMobileMoreOpen(true);
        setOpenMobileMoreSection((current) => current ?? getMobileMoreDefaultSection());
    };

    const handleMobileMoreSectionToggle = (sectionId) => {
        setOpenMobileMoreSection((current) => (current === sectionId ? null : sectionId));
    };

    const isMobileMoreItemActive = ({ page, activePages, rewardsTab }) => {
        if (activePages?.includes(activePage)) {
            return true;
        }

        if (page !== activePage) {
            return false;
        }

        if (page === 'loyalty-rewards' && rewardsTab && typeof window !== 'undefined') {
            return window.location.hash.slice(1) === rewardsTab;
        }

        return true;
    };

    const handleMobileMoreItemClick = ({ page, rewardsTab, action }) => {
        if (action === 'liveChat') {
            setMobileMenuOpen(false);
            onLiveChatClick?.();
            return;
        }

        if (action === 'download') {
            handleMobileDownloadApp();
            return;
        }

        if (action === 'logout') {
            setMobileMenuOpen(false);
            onLogout?.();
            return;
        }

        if (page === 'profile') {
            handleMobileNavigate('profile');
            return;
        }

        if (page === 'loyalty-rewards' && rewardsTab) {
            handleMobileNavigate('loyalty-rewards', { rewardsTab });
            return;
        }

        if (page) {
            handleMobileNavigate(page);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 w-full shadow-[var(--shadow-nav-top)] ${mobileMenuOpen ? 'z-[400]' : 'z-50'}`}
            onMouseLeave={() => setNavProviderDropdown(null)}
        >
            <MobileSiteHeader
                authUser={authUser}
                language={language}
                onLanguageChange={setLanguage}
                mobileMenuOpen={mobileMenuOpen}
                onMenuToggle={() => setMobileMenuOpen((open) => !open)}
                onNavigateHome={() => onNavigate?.('home')}
                onProfileClick={() => onNavigate?.('profile')}
                onRefreshBalance={onRefreshBalance}
                balanceRefreshing={balanceRefreshing}
                onLoginClick={() => onLoginClick?.()}
                onRegisterClick={() => onRegisterClick?.()}
                onLiveChatClick={onLiveChatClick}
            />


            <div className="top-sticky-nav-bar relative z-[110] hidden h-9 w-full items-center border-b bg-[var(--color-sticky-nav)] px-4 text-xs text-[var(--color-tertiery)] lg:flex lg:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex gap-4 items-center h-full">
                        <button
                            type="button"
                            onClick={() => onDownloadAppClick?.()}
                            className="nav-top-pill nav-top-pill--icon shrink-0"
                        >
                            <Smartphone size={14} className="shrink-0 text-[var(--color-tertiery)]" />
                            <span>Download App</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1 h-full">
                        {authUser ? (
                            <div
                                ref={profileMenuRef}
                                className="relative flex h-full items-center gap-1 rounded-[12px] px-1 py-0.5"
                            >
                                <div className="relative">
                                    <div className="top-sticky-balance-chip flex h-8 min-w-0 max-w-[13rem] items-stretch overflow-hidden rounded-lg text-[var(--color-tertiery)]">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setBalanceDropdownOpen((prev) => !prev);
                                                setProfileMenuOpen(false);
                                            }}
                                            className="flex min-w-0 flex-1 items-center gap-1.5 px-2.5 text-xs font-bold transition hover:bg-[var(--color-surface-light-active)]"
                                        >
                                            <span className="min-w-0 truncate tabular-nums">{authUser.balance}</span>
                                            <ChevronDown size={13} className={`transition-transform ${balanceDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                onRefreshBalance?.();
                                            }}
                                            disabled={!onRefreshBalance || balanceRefreshing}
                                            className="top-sticky-balance-chip__refresh inline-flex h-full w-7 min-w-7 shrink-0 touch-manipulation items-center justify-center transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
                                            aria-label="Refresh balance"
                                            title="Refresh balance"
                                        >
                                            <RefreshCw
                                                size={13}
                                                strokeWidth={2.25}
                                                className={`shrink-0 ${balanceRefreshing ? 'animate-spin' : ''}`}
                                                aria-hidden
                                            />
                                        </button>
                                    </div>

                                    {balanceDropdownOpen && (
                                        <BalanceDetailDropdown
                                            onRefreshBalance={onRefreshBalance}
                                            balanceRefreshing={balanceRefreshing}
                                            className="absolute left-0 top-[calc(100%+12px)] z-[150]"
                                        />
                                    )}
                                </div>
                                <div className="top-sticky-profile-chip flex h-8 shrink-0 items-stretch overflow-hidden rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileMenuOpen(false);
                                            onNavigate?.('profile');
                                        }}
                                        className="flex min-w-0 max-w-[min(100%,15rem)] items-center gap-1.5 px-2 text-[var(--color-tertiery)] transition hover:bg-[var(--color-surface-light-active)]"
                                        aria-label="My profile"
                                    >
                                        <UserRound size={16} className="shrink-0 text-[var(--color-tertiery)]" strokeWidth={2.25} />
                                        <span className="truncate text-xs font-bold text-[var(--color-accent)]">
                                            {authUser.name}
                                        </span>
                                        <span className="top-sticky-profile-badge shrink-0 rounded px-1 py-0.5 text-[9px] font-bold leading-none uppercase">
                                            {profileTierLabel}
                                        </span>
                                    </button>
                                    <span className="top-sticky-profile-chip__divider w-px shrink-0 self-stretch" aria-hidden />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setProfileMenuOpen((open) => !open);
                                            setBalanceDropdownOpen(false);
                                        }}
                                        className="inline-flex w-7 shrink-0 items-center justify-center text-[var(--color-tertiery)] transition hover:bg-[var(--color-surface-light-active)]"
                                        aria-haspopup="menu"
                                        aria-expanded={profileMenuOpen}
                                        aria-label="Account menu"
                                    >
                                        <ChevronDown
                                            size={13}
                                            className={`transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        onNavigate?.('deposit');
                                    }}
                                    className="btn-theme-cta-soft h-8 shrink-0 rounded-lg px-4 text-xs font-bold transition hover:brightness-105"
                                >
                                    DEPOSIT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onLogout?.()}
                                    className="nav-top-pill shrink-0 uppercase"
                                >
                                    LOGOUT
                                </button>
                                <LanguageSwitcher
                                    value={language}
                                    onChange={setLanguage}
                                    buttonClassName="nav-top-pill nav-top-pill--icon shrink-0"
                                    showShortLabel={false}
                                    showFullLabel
                                />

                                {profileMenuOpen && (
                                    <div className="profile-menu-dropdown dark-nav-shell absolute right-25 top-[calc(100%+10px)] z-[120] flex max-h-[calc(100vh-5rem)] w-[280px] flex-col overflow-hidden rounded-[24px] p-2.5">
                                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-nav-radial-top pointer-events-none" />

                                        <div className="relative shrink-0">
                                            <div className="relative flex items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <div className="profile-menu-avatar flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[var(--color-border-subtle)] bg-[var(--color-surface-colorful)] shadow-[var(--inset-highlight-strong)]">
                                                        <UserCircle2 size={36} className="profile-menu-avatar-icon" />
                                                    </div>
                                                </div>

                                                <div className="min-w-0 pt-1">
                                                    <p className="profile-menu-username truncate text-xl font-bold leading-none">
                                                        Hi, {authUser.name}
                                                    </p>
                                                    <VipStatusPill level={vipLevel} theme="dark" className="profile-menu-vip-pill mt-2" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-menu-scroll relative mt-2 min-h-0 flex-1 overflow-y-auto pr-1">
                                            <div className="dark-nav-panel relative rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('cashier')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-menu-brand profile-menu-section-icon shadow-[var(--shadow-nav-pill)]">
                                                            <Wallet size={14} />
                                                        </div>
                                                        <span className="profile-menu-section-label text-lg font-bold">Cashier</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`profile-menu-chevron transition-transform ${openProfileSection === 'cashier' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'cashier' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {/* eslint-disable-next-line no-unused-vars */}
                                                        {cashierItems.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    const page = cashierPageById[id];
                                                                    if (page) onNavigate?.(page);
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-top-pill-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="profile-menu-tile-icon mb-1.5" />
                                                                <span className="profile-menu-tile-label text-xs font-bold leading-tight">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('account')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-menu-brand profile-menu-section-icon shadow-[var(--shadow-nav-pill)]">
                                                            <UserRound size={14} />
                                                        </div>
                                                        <span className="profile-menu-section-label text-lg font-bold">My Account</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`profile-menu-chevron transition-transform ${openProfileSection === 'account' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>

                                                {openProfileSection === 'account' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {/* eslint-disable-next-line no-unused-vars */}
                                                        {accountCards.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    if (id === 'profile') {
                                                                        onAccountDetailsClick?.();
                                                                    } else {
                                                                        onNavigate?.(id);
                                                                    }
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-top-pill-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="profile-menu-tile-icon mb-1.5" />
                                                                <span className="profile-menu-tile-label text-xs font-bold leading-tight">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('rewards')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-menu-brand profile-menu-section-icon shadow-[var(--shadow-nav-pill)]">
                                                            <Trophy size={14} />
                                                        </div>
                                                        <span className="profile-menu-section-label text-lg font-bold">Rewards</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`profile-menu-chevron transition-transform ${openProfileSection === 'rewards' ? 'rotate-90' : ''}`}
                                                    />
                                                </button>

                                                {openProfileSection === 'rewards' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {REWARDS_PROGRAMS.map(({ id, label }) => {
                                                            const NavIcon = REWARDS_NAV_ICONS[id] ?? Trophy;
                                                            return (
                                                                <button
                                                                    key={id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setProfileMenuOpen(false);
                                                                        onNavigate?.('loyalty-rewards', { rewardsTab: id });
                                                                    }}
                                                                    className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-top-pill-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                                >
                                                                    <NavIcon
                                                                        size={18}
                                                                        className="profile-menu-tile-icon mb-1.5"
                                                                    />
                                                                    <span className="profile-menu-tile-label text-xs font-bold leading-tight">{label}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel relative mt-3 rounded-[22px] p-3">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('historyRecord')}
                                                    className="flex w-full items-center justify-between transition hover:opacity-90"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-menu-brand profile-menu-section-icon shadow-[var(--shadow-nav-pill)]">
                                                            <History size={14} />
                                                        </div>
                                                        <span className="profile-menu-section-label text-lg font-bold">History Record</span>
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`profile-menu-chevron transition-transform ${openProfileSection === 'historyRecord' ? 'rotate-90' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'historyRecord' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        {/* eslint-disable-next-line no-unused-vars */}
                                                        {HISTORY_RECORD_NAV.map(({ id, label, icon: Icon }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    onNavigate?.(id);
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-border-brand)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="profile-menu-tile-icon mb-1.5" />
                                                                <span className="profile-menu-tile-label text-xs font-bold leading-tight">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="dark-nav-panel mt-3 rounded-[22px] px-4 py-3 transition hover:border-[var(--color-border-brand)]">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProfileSection('settings')}
                                                    className="flex w-full items-center justify-between text-left"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-menu-brand profile-menu-section-icon shadow-[var(--shadow-nav-pill)]">
                                                            <Settings size={14} />
                                                        </span>
                                                        <span className="profile-menu-section-label text-base font-bold">Settings</span>
                                                    </span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`profile-menu-chevron transition-transform ${openProfileSection === 'settings' ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                {openProfileSection === 'settings' && (
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        {/* eslint-disable-next-line no-unused-vars */}
                                                        {settingsOptions.map(({ id, label, icon: Icon, action }) => (
                                                            <button
                                                                key={id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setProfileMenuOpen(false);
                                                                    if (action === 'liveChat') {
                                                                        onLiveChatClick?.();
                                                                    } else {
                                                                        onNavigate?.(id);
                                                                    }
                                                                }}
                                                                className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-border-brand)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                            >
                                                                <Icon size={18} className="profile-menu-tile-icon mb-1.5" />
                                                                <span className="profile-menu-tile-label text-xs font-bold leading-tight">{label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileMenuOpen(false);
                                                    onLogout?.();
                                                }}
                                                className="profile-menu-logout mt-3"
                                            >
                                                <LogOut size={18} className="shrink-0" strokeWidth={2.25} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onLoginClick?.()}
                                    className="nav-top-pill shrink-0 uppercase"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRegisterClick?.()}
                                    className="btn-theme-cta-soft h-8 shrink-0 rounded-lg px-4 text-xs font-bold uppercase transition hover:brightness-105"
                                >
                                    Join Now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => (onTopLiveChatClick ?? onLiveChatClick)?.()}
                                    className="nav-top-pill nav-top-pill--icon shrink-0 uppercase"
                                >
                                    <Headset size={14} />
                                    <span>Live Chat</span>
                                </button>
                                <LanguageSwitcher
                                    value={language}
                                    onChange={setLanguage}
                                    buttonClassName="nav-top-pill nav-top-pill--icon shrink-0 uppercase"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* TWO-TONE HEADER: Main Navigation Row (Lower) */}
            <div className="top-nav-shell relative z-[100] hidden h-16 w-full items-center px-4 shadow-sm lg:flex lg:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('home')}
                            className="flex shrink-0 items-center justify-center py-1 transition-opacity hover:opacity-90"
                        >
                            <img src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp" alt="12WIN Logo" className="h-[36px] md:h-[40px] w-auto object-contain block" />
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-end items-center gap-x-1">
                        {DESKTOP_MAIN_LINKS.map((link) => {
                            if (link === 'Sports' || link === 'Live' || link === 'Esports') {
                                const items =
                                    link === 'Sports'
                                        ? DESKTOP_SPORTS_MENU
                                        : link === 'Live'
                                          ? DESKTOP_LIVE_MENU
                                          : DESKTOP_ESPORTS_MENU;
                                const parentActive =
                                    link === 'Sports'
                                        ? isDesktopSportsActive(activePage)
                                        : link === 'Live'
                                          ? isDesktopLiveActive(activePage)
                                          : isDesktopEsportsActive(activePage);
                                const itemActiveFn =
                                    link === 'Sports'
                                        ? isDesktopSportsItemActive
                                        : link === 'Live'
                                          ? isDesktopLiveItemActive
                                          : isDesktopEsportsItemActive;
                                return (
                                    <div
                                        key={link}
                                        className="relative group"
                                        onMouseEnter={() => setNavProviderDropdown(null)}
                                        onMouseLeave={() => setNavProviderDropdown(null)}
                                    >
                                        <button
                                            type="button"
                                            className={`top-nav-more-trigger relative flex items-center gap-1 rounded-lg border border-transparent px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                                                parentActive ? 'nav-desktop-link-active' : ''
                                            }`}
                                            aria-haspopup="menu"
                                        >
                                            {link} <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                                        </button>

                                        <div className="absolute left-0 top-full pt-1 z-[130] min-w-[13.75rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="top-nav-more-menu rounded-xl py-2 shadow-[var(--shadow-nav-dropdown)]">
                                                {items.map((item) => (
                                                    <a
                                                        key={`${link}-${item.page}-${item.label}`}
                                                        href={item.href}
                                                        role="menuitem"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            if (item.page) onNavigate?.(item.page);
                                                        }}
                                                        className={`top-nav-more-item block px-5 py-2.5 text-sm font-bold transition-colors ${
                                                            itemActiveFn(item, activePage) ? 'top-nav-more-item--active' : ''
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            const targetId = NAV_TARGETS[link];
                            const isActive = activePage === targetId;
                            return (
                                <a
                                    key={link}
                                    href={NAV_HREFS[link] ?? '#'}
                                    onMouseEnter={() => {
                                        if (link === 'Live Casino') setNavProviderDropdown('casino');
                                        else if (link === 'Slots') setNavProviderDropdown('slots');
                                        else setNavProviderDropdown(null);
                                    }}
                                    onFocus={() => {
                                        if (link === 'Live Casino') setNavProviderDropdown('casino');
                                        else if (link === 'Slots') setNavProviderDropdown('slots');
                                        else setNavProviderDropdown(null);
                                    }}
                                    onClick={(event) => {
                                        if (targetId) {
                                            event.preventDefault();
                                            onNavigate?.(targetId);
                                        }
                                    }}
                                    className={`top-nav-link relative rounded-lg border border-transparent px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                                        isActive ? 'nav-desktop-link-active' : ''
                                    }`}
                                >
                                    {link}
                                </a>
                            );
                        })}

                        <div
                            className="relative group"
                            onMouseEnter={() => setNavProviderDropdown(null)}
                            onMouseLeave={() => setNavProviderDropdown(null)}
                        >
                            <button
                                type="button"
                                className={`top-nav-more-trigger relative flex items-center gap-1 rounded-lg border border-transparent px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${
                                    isDesktopMoreActive(activePage) ? 'nav-desktop-link-active' : ''
                                }`}
                            >
                                More <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                            </button>

                            <div className="absolute right-0 top-full pt-1 z-[130] w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="top-nav-more-menu rounded-xl py-2 shadow-[var(--shadow-nav-dropdown)]">
                                    {DESKTOP_MORE_LINKS.map((subLink) => {
                                        const targetId = NAV_TARGETS[subLink];
                                        return (
                                            <a
                                                key={subLink}
                                                href={NAV_HREFS[subLink]}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    if (targetId) {
                                                        onNavigate?.(targetId);
                                                    }
                                                }}
                                                className={`top-nav-more-item block px-5 py-2.5 text-sm font-bold transition-colors ${
                                                    activePage === targetId ? 'top-nav-more-item--active' : ''
                                                }`}
                                            >
                                                {subLink}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Provider mega menus: anchor directly under the white nav row */}
                <LiveCasinoMenu
                    open={navProviderDropdown === 'casino'}
                    onProviderClick={(provider) => {
                        onCasinoProviderSelect?.(provider);
                        setNavProviderDropdown(null);
                    }}
                />

                <NavProviderDropdownPanel
                    open={navProviderDropdown === 'slots'}
                    providers={slotsNavDropdownProviders}
                    onProviderClick={(provider) => {
                        onSlotsProviderSelect?.(provider);
                        setNavProviderDropdown(null);
                    }}
                />
            </div>

            <button
                type="button"
                className={`fixed inset-x-0 bottom-0 top-0 z-[380] bg-[var(--color-overlay-strong)] backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
                aria-hidden={!mobileMenuOpen}
                tabIndex={mobileMenuOpen ? 0 : -1}
            />
            <aside
                className={`sidenav-shell fixed inset-y-0 left-0 z-[390] flex w-full max-w-[360px] min-h-0 flex-col overflow-hidden border-r shadow-[var(--shadow-sidebar)] transition-transform duration-300 ease-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full'
                    }`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="sidenav-header relative border-b px-3.5 py-3">
                    <div className="min-w-0">
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => handleMobileNavigate('profile')}
                                className="w-full pr-12 text-left text-2xl font-bold leading-tight text-[var(--color-text-primary-card-title)] transition hover:opacity-90"
                            >
                                Hi, {authUser.name}
                            </button>
                        ) : (
                            <div className="pr-12">
                                <h2 className="text-xl font-bold leading-tight text-[var(--color-text-primary-card-title)]">Play Anywhere</h2>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Your essentials stay up top. Everything else is tucked into More.</p>
                            </div>
                        )}

                        {authUser ? (
                            <div className="mt-2.5 space-y-2.5">
                                <span className="sidenav-tier-badge inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
                                    {profileTierLabel}
                                </span>
                                <div className="w-full rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] p-3.5 shadow-[var(--shadow-card-soft)]">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                                            Balance
                                        </p>
                                        <div className="sidenav-balance-pill flex h-9 shrink-0 items-stretch overflow-hidden rounded-xl">
                                        <span className="flex min-w-0 items-center px-3 text-sm font-bold tabular-nums">
                                            {authUser.balance}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                onRefreshBalance?.();
                                            }}
                                            disabled={!onRefreshBalance || balanceRefreshing}
                                            className="sidenav-balance-pill__refresh inline-flex w-10 shrink-0 items-center justify-center transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
                                            aria-label="Refresh balance"
                                            title="Refresh balance"
                                        >
                                            <RefreshCw
                                                size={15}
                                                strokeWidth={2.25}
                                                className={balanceRefreshing ? 'animate-spin' : ''}
                                                aria-hidden
                                            />
                                        </button>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('deposit')}
                                            className="btn-theme-cta-soft inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold"
                                        >
                                            <ArrowDownToLine size={15} />
                                            Deposit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('withdrawal')}
                                            className="sidenav-secondary-action inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-bold"
                                        >
                                            <ArrowUpFromLine size={15} />
                                            Withdrawal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onLoginClick?.();
                                    }}
                                    className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[var(--color-border-brand)] bg-[var(--color-tertiery)] px-4 text-sm font-semibold text-[var(--color-text-secondary)] shadow-[var(--shadow-input)] transition hover:bg-[var(--color-surface-subtle)]"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onRegisterClick?.();
                                    }}
                                    className="btn-theme-cta-soft inline-flex min-h-[42px] items-center justify-center rounded-xl px-4 text-sm font-bold"
                                >
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute right-3.5 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] text-[var(--color-text-primary-card-title)] shadow-[var(--shadow-card-soft)] transition hover:bg-[var(--color-surface-subtle)]"
                        aria-label="Close mobile menu"
                    >
                        <X size={16} />
                    </button>

                </div>

                <div className="sidenav-body min-h-0 flex-1 overflow-y-auto px-3.5 py-3">
                    <div className="space-y-2">
                        {/* eslint-disable-next-line no-unused-vars */}
                        {MOBILE_PRIMARY_ITEMS.map(({ id, label, page, icon: Icon }) => {
                            const isMoreRow = id === 'more';
                            const isGamesRow = id === 'games';
                            const isActive = isMoreRow
                                ? MOBILE_MORE_ACTIVE_PAGES.has(activePage)
                                : isGamesRow
                                    ? MOBILE_GAMES_SUB_ITEMS.some((item) => item.page === activePage)
                                    : activePage === page;

                            const isOpen = isMoreRow ? mobileMoreOpen : isGamesRow ? mobileGamesOpen : false;

                            return (
                                <div
                                    key={id}
                                    className={
                                        isGamesRow
                                            ? `overflow-hidden rounded-xl border transition ${isActive
                                                ? 'sidenav-group sidenav-group--active'
                                                : 'sidenav-group'
                                            }`
                                            : "overflow-hidden rounded-xl"
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isMoreRow) {
                                                handleMobileMoreToggle();
                                                return;
                                            }
                                            if (isGamesRow) {
                                                setMobileGamesOpen((open) => !open);
                                                return;
                                            }

                                            handleMobileNavigate(page);
                                        }}
                                        className={`flex min-h-[48px] w-full items-center gap-3 px-3.5 py-2.5 text-left transition ${isGamesRow
                                            ? ''
                                            : `rounded-xl ${isActive ? 'sidenav-item sidenav-item--active' : 'sidenav-item'}`
                                            }`}
                                        aria-expanded={isOpen}
                                    >
                                        <span className="sidenav-item__icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
                                            <Icon size={16} />
                                        </span>
                                        <span className="min-w-0 flex-1 text-base font-bold" style={{ fontFamily: 'var(--base-font-family)' }}>{label}</span>
                                        <ChevronRight
                                            size={17}
                                            className={`shrink-0 text-[var(--color-text-primary-card-title)] transition-transform ${(isMoreRow || isGamesRow) && isOpen ? 'rotate-90' : ''}`}
                                        />
                                    </button>

                                    {isGamesRow && mobileGamesOpen && (
                                        <div className="space-y-1 border-t border-[var(--color-border-brand)] px-1.5 pb-1.5 pt-1">
                                            <div className="mb-1 px-2 pt-1.5">
                                                <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-muted)]" style={{ fontFamily: 'var(--base-font-family)' }}>
                                                    GAME CATEGORIES
                                                </p>
                                            </div>
                                            {MOBILE_GAMES_SUB_ITEMS.map((item) => {
                                                const itemActive = activePage === item.page;
                                                const ItemIcon = item.icon;

                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => handleMobileNavigate(item.page)}
                                                        className={`sidenav-subitem flex min-h-[42px] w-full items-center gap-2.5 rounded-xl pl-3 pr-3 py-2 text-left ${itemActive
                                                            ? 'sidenav-subitem--active'
                                                            : ''
                                                            }`}
                                                        style={{ fontFamily: 'var(--base-font-family)' }}
                                                    >
                                                        <span className="sidenav-subitem__icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                                                            <ItemIcon size={14} />
                                                        </span>
                                                        <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
                                                        <ChevronRight size={14} className="shrink-0 opacity-70" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {isMoreRow && mobileMoreOpen && (
                                        <div className="sidenav-more-panel mt-1.5 space-y-1.5 rounded-xl border p-2">
                                            {/* eslint-disable-next-line no-unused-vars */}
                                            {MOBILE_MORE_SECTIONS.map(({ id: sectionId, label: sectionLabel, icon: SectionIcon, items }) => {
                                                const sectionHasActiveItem = items.some((item) => isMobileMoreItemActive(item));
                                                const sectionOpen = openMobileMoreSection === sectionId;

                                                return (
                                                    <div
                                                        key={sectionId}
                                                        className={`overflow-hidden rounded-xl border transition ${sectionHasActiveItem
                                                            ? 'sidenav-group sidenav-group--active'
                                                            : 'sidenav-group'
                                                            }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMobileMoreSectionToggle(sectionId)}
                                                            className="flex min-h-[44px] w-full items-center gap-2.5 px-3.5 py-2.5 text-left"
                                                            aria-expanded={sectionOpen}
                                                        >
                                                            <span
                                                                className="sidenav-item__icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
                                                            >
                                                                <SectionIcon size={15} />
                                                            </span>
                                                            <span className="min-w-0 flex-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-subtle)]" style={{ fontFamily: 'var(--base-font-family)' }}>
                                                                {sectionLabel}
                                                            </span>
                                                            <ChevronRight
                                                                size={15}
                                                                className={`shrink-0 text-[var(--color-text-soft)] transition-transform ${sectionOpen ? 'rotate-90' : ''}`}
                                                            />
                                                        </button>

                                                        {sectionOpen && (
                                                            <div className="space-y-1 border-t border-[var(--color-border-brand)] px-1.5 pb-1.5 pt-1">
                                                                {items.map((item) => {
                                                                    const itemActive = isMobileMoreItemActive(item);
                                                                    const ItemIcon = item.icon;

                                                                    return (
                                                                        <button
                                                                            key={item.id}
                                                                            type="button"
                                                                            onClick={() => handleMobileMoreItemClick(item)}
                                                                            className={`sidenav-subitem flex min-h-[42px] w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left ${itemActive
                                                                                ? 'sidenav-subitem--active'
                                                                                : ''
                                                                                }`}
                                                                        >
                                                                            <span className="sidenav-subitem__icon inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
                                                                                <ItemIcon size={14} />
                                                                            </span>
                                                                            <span className="min-w-0 flex-1 text-sm font-semibold" style={{ fontFamily: 'var(--base-font-family)' }}>{item.label}</span>
                                                                            <ChevronRight size={14} className="shrink-0 opacity-70" />
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="sidenav-footer border-t px-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3">
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onLiveChatClick?.();
                            }}
                            className="sidenav-live-chat inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition"
                        >
                            <Headset size={16} />
                            Live Chat
                        </button>
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLogout?.();
                                }}
                                className="sidenav-secondary-action inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMobileDownloadApp}
                                className="sidenav-secondary-action inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold"
                            >
                                <Smartphone size={15} />
                                App Download
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {navProviderDropdown != null && (
                <div
                    className={`fixed inset-x-0 bottom-0 z-[70] bg-[var(--color-overlay-strong)] backdrop-blur-[1px] pointer-events-none ${NAV_STICKY_SUBHEADER_TOP_CLASS}`}
                />
            )}
        </nav>
    );
}
