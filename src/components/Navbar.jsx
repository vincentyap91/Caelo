import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ChevronDown,
    ChevronRight,
    CircleDollarSign,
    Dices,
    Fish,
    Gamepad2,
    Gift,
    HelpCircle,
    House,
    Landmark,
    LayoutGrid,
    Menu,
    Megaphone,
    Smartphone,
    Star,
    Ticket,
    X,
    Headset,
    History,
    Heart,
    LogOut,
    Percent,
    ScrollText,
    Settings,
    ShieldCheck,
    Trophy,
    UserCircle2,
    UserRound,
    Users,
    Wallet,
} from 'lucide-react';
import LiveCasinoMenu from './LiveCasinoMenu';
import NavProviderDropdownPanel from './NavProviderDropdownPanel';
import { slotProvidersForNavDropdown } from '../constants/matchedSlotProviders';
import LanguageSwitcher from './LanguageSwitcher';
import { HISTORY_RECORD_NAV } from '../constants/historyRecordPages';
import { settingsOptions } from '../constants/settingsOptions';
import { REWARDS_NAV_ICONS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';
import { getVipStatus } from '../constants/vipStatus';
import VipStatusPill from './VipStatusPill';

const slotsNavDropdownProviders = slotProvidersForNavDropdown();
const DESKTOP_MAIN_LINKS = [
    'Home', 'Casino', 'Slots', 'Sports', 'E-Sports', 'Lottery',
    'Fishing', 'Poker', 'Promotion', 'Referral', 'VIP',
];
const NAV_TARGETS = {
    Home: 'home',
    Casino: 'live-casino',
    Slots: 'slots',
    Sports: 'sports',
    'E-Sports': 'e-sports',
    Lottery: 'lottery',
    Fishing: 'fishing',
    Poker: 'poker',
    Promotion: 'promotion',
    Referral: 'referral',
    VIP: 'vip',
};
const NAV_HREFS = {
    Home: '/',
    Casino: '/casino',
    Slots: '/slots',
    Sports: '/sports',
    'E-Sports': '/e-sports',
    Lottery: '/lottery',
    Fishing: '/fishing',
    Poker: '/poker',
    Promotion: '/promotion',
    Referral: '/referral',
    VIP: '/vip',
};
const MOBILE_PRIMARY_ITEMS = [
    { id: 'home', label: 'Home', page: 'home', icon: House },
    { id: 'casino', label: 'Casino', page: 'live-casino', icon: Landmark },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'promotions', label: 'Promotions', page: 'promotion', icon: Megaphone },
    { id: 'more', label: 'More', icon: LayoutGrid },
];
const MOBILE_MORE_SECTIONS = [
    {
        id: 'games',
        label: 'Games',
        icon: Gamepad2,
        items: [
            { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Trophy },
            { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
            { id: 'fishing', label: 'Fishing', page: 'fishing', icon: Fish },
            { id: 'poker', label: 'Poker', page: 'poker', icon: Dices },
        ],
    },
    {
        id: 'wallet',
        label: 'Wallet',
        icon: Wallet,
        items: [
            { id: 'deposit', label: 'Deposit', page: 'deposit', icon: ArrowDownToLine },
            { id: 'withdrawal', label: 'Withdrawal', page: 'withdrawal', icon: ArrowUpFromLine },
            { id: 'referral-commission', label: 'Referral Commission', page: 'referral-commission', icon: Users },
            { id: 'rebate', label: 'Rebate', page: 'rebate', icon: Percent },
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
            { id: 'vip', label: 'VIP', page: 'vip', icon: Trophy },
            { id: 'referral', label: 'Referral', page: 'referral', icon: Users },
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
    'referral',
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

export default function Navbar({ onNavigate, onDownloadAppClick, activePage = 'home', onLoginClick, onRegisterClick, authUser, onLogout, onAccountDetailsClick, onLiveChatClick, onCasinoProviderSelect, onSlotsProviderSelect }) {
    const vipLevel = authUser?.vipLevel || 'Diamond';
    /** `null` | `'casino'` | `'slots'` — shared mega-menu pattern */
    const [navProviderDropdown, setNavProviderDropdown] = useState(null);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [openMobileMoreSection, setOpenMobileMoreSection] = useState(null);
    const [language, setLanguage] = useState('en-us');
    const [openProfileSection, setOpenProfileSection] = useState('account');
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
        { id: 'rebate', label: 'Rebate', icon: Percent },
    ];

    useEffect(() => {
        if (!profileMenuOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [profileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activePage]);

    useEffect(() => {
        if (mobileMenuOpen) {
            return undefined;
        }

        setMobileMoreOpen(false);
        setOpenMobileMoreSection(null);
        return undefined;
    }, [mobileMenuOpen]);

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
            className="fixed top-0 left-0 right-0 w-full z-50 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            onMouseLeave={() => setNavProviderDropdown(null)}
        >
            <div className="relative z-[300] flex md:hidden w-full items-center justify-between gap-2 border-b border-white/10 bg-[var(--color-nav-top)] px-3 py-2 text-white">
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen((open) => !open)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white/15"
                    aria-label="Open mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={16} />
                </button>
                <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                    {authUser && (
                        <VipStatusPill
                            level={vipLevel}
                            theme="dark"
                            size="header"
                            username={authUser.name}
                        />
                    )}
                    <LanguageSwitcher
                        value={language}
                        onChange={setLanguage}
                        buttonClassName="h-10 shrink-0 rounded-xl px-3"
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={() => onDownloadAppClick?.()}
                className="fixed bottom-24 right-6 z-[110] inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(90deg,var(--color-brand-secondary)_0%,var(--color-brand-primary)_100%)] text-white shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition hover:brightness-105 md:hidden"
                aria-label="Download app"
            >
                <Smartphone size={18} className="shrink-0" />
            </button>

            <div className="hidden h-9 w-full items-center border-b border-white/10 bg-[var(--color-nav-top)] px-4 text-xs text-white md:flex md:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
                    <div className="flex gap-4 items-center h-full">
                        <button
                            type="button"
                            onClick={() => onDownloadAppClick?.()}
                            className="flex h-7 items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 hover:bg-white/10 hover:border-white/35 transition-all"
                        >
                            <Smartphone size={14} className="shrink-0 text-white/90" />
                            <span className="text-sm font-medium">Download App</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2.5 h-full">
                    {authUser ? (
                        <div
                            ref={profileMenuRef}
                            className="relative flex h-full items-center gap-1 rounded-[12px] px-1 py-0.5 shadow-[var(--shadow-nav-top)]"
                        >
                            <div className="flex h-7 items-center gap-1.5 rounded-[9px] border border-white/10 bg-[rgb(14_99_187)] px-3 text-white">
                                <span className="font-bold tracking-[0.01em]">{authUser.balance}</span>
                                <CircleDollarSign size={14} className="text-[var(--color-nav-gold)]" />
                            </div>
                            <div className="flex h-7 shrink-0 items-stretch overflow-hidden rounded-[9px] border border-white/15 bg-[linear-gradient(180deg,#16508f_0%,#0d3562_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        onNavigate?.('profile');
                                    }}
                                    className="flex min-w-0 max-w-[min(100%,15rem)] items-center gap-1.5 px-2 text-white transition hover:bg-white/[0.06]"
                                    aria-label="My profile"
                                >
                                    <img
                                        src={getVipStatus(vipLevel).medal}
                                        alt=""
                                        className="h-5 w-5 shrink-0 object-contain"
                                    />
                                    <span className="truncate text-xs font-bold tracking-[0.02em] text-[rgb(255_240_160)]">
                                        {authUser.name}
                                    </span>
                                    <UserCircle2 size={18} className="shrink-0 text-white/90" />
                                </button>
                                <span className="w-px shrink-0 self-stretch bg-white/20" aria-hidden />
                                <button
                                    type="button"
                                    onClick={() => setProfileMenuOpen((open) => !open)}
                                    className="inline-flex w-7 shrink-0 items-center justify-center text-white/80 transition hover:bg-white/[0.06] hover:text-white"
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
                                className="btn-theme-cta-soft h-7 shrink-0 rounded-[9px] px-4 font-black tracking-wide transition hover:brightness-105"
                            >
                                DEPOSIT
                            </button>
                            <button
                                type="button"
                                onClick={() => onLogout?.()}
                                className="h-7 rounded-[9px] border border-white/40 bg-white/[0.03] px-4 font-bold text-white hover:bg-white/10 transition"
                            >
                                LOGOUT
                            </button>
                            <LanguageSwitcher value={language} onChange={setLanguage} />

                            {profileMenuOpen && (
                                <div className="dark-nav-shell absolute right-25 top-[calc(100%+10px)] z-[120] w-[312px] overflow-hidden rounded-[30px] p-3.5 text-white">
                                    <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,#29bbff55_0%,transparent_72%)] pointer-events-none" />

                                    <div className="relative flex items-start gap-3">
                                        <div className="relative shrink-0">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[rgb(86_185_255_/_0.5)] bg-[linear-gradient(180deg,#1a5bb1_0%,#0b3e80_100%)] shadow-[var(--inset-highlight-strong)]">
                                                <UserCircle2 size={40} className="text-white/90" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileMenuOpen(false);
                                                    onAccountDetailsClick?.();
                                                }}
                                                className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[var(--color-nav-badge)] text-white shadow-[0_6px_12px_rgba(0,0,0,0.22)] transition hover:brightness-110"
                                                aria-label="Account details"
                                            >
                                                <ScrollText size={12} />
                                            </button>
                                        </div>

                                        <div className="min-w-0 pt-1">
                                            <p className="truncate text-xl font-extrabold leading-none text-white">
                                                Hi, {authUser.name}
                                            </p>
                                            <div className="mt-1.5 space-y-1 text-xs text-[var(--color-nav-text-soft)]">
                                                <p className="flex items-center gap-2">
                                                    <span className="text-[var(--color-nav-text-accent)]">Joined:</span>
                                                    <span className="font-semibold">08/01/2026</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="text-[var(--color-nav-text-accent)]">Player ID:</span>
                                                    <span className="font-semibold">679129</span>
                                                </p>
                                            </div>
                                            <VipStatusPill level={vipLevel} theme="dark" className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="dark-nav-panel relative mt-4 rounded-[22px] p-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleProfileSection('cashier')}
                                            className="flex w-full items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                    <Wallet size={14} />
                                                </div>
                                                <span className="text-lg font-bold text-white">Cashier</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'cashier' ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openProfileSection === 'cashier' && (
                                            <div className="mt-3 grid grid-cols-2 gap-3">
                                                {cashierItems.map(({ id, label, icon: Icon }) => (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);
                                                            const page = cashierPageById[id];
                                                            if (page) onNavigate?.(page);
                                                        }}
                                                        className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                    >
                                                        <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                        <span className="text-xs font-bold leading-tight text-white">{label}</span>
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
                                                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                    <UserRound size={14} />
                                                </div>
                                                <span className="text-lg font-bold text-white">My Account</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'account' ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {openProfileSection === 'account' && (
                                            <div className="mt-3 grid grid-cols-2 gap-3">
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
                                                        className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                    >
                                                        <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                        <span className="text-xs font-bold leading-tight text-white">{label}</span>
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
                                                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                                    <Trophy size={14} />
                                                </div>
                                                <span className="text-lg font-bold text-white">Rewards</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'rewards' ? 'rotate-180' : ''}`}
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
                                                            className="dark-nav-tile group flex min-h-[72px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                        >
                                                            <NavIcon
                                                                size={18}
                                                                className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]"
                                                            />
                                                            <span className="text-xs font-bold leading-tight text-white">{label}</span>
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
                                                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[rgb(90_208_255)] shadow-[var(--shadow-nav-pill)]">
                                                    <History size={14} />
                                                </div>
                                                <span className="text-lg font-bold text-white">History Record</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'historyRecord' ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openProfileSection === 'historyRecord' && (
                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                {HISTORY_RECORD_NAV.map(({ id, label, icon: Icon }) => (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);
                                                            onNavigate?.(id);
                                                        }}
                                                        className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                    >
                                                        <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                        <span className="text-xs font-bold leading-tight text-white">{label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="dark-nav-panel mt-3 rounded-[22px] px-4 py-3 transition hover:border-[rgb(102_203_255_/_0.24)]">
                                        <button
                                            type="button"
                                            onClick={() => toggleProfileSection('settings')}
                                            className="flex w-full items-center justify-between text-left"
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[rgb(75_141_255)]">
                                                    <Settings size={14} />
                                                </span>
                                                <span className="text-base font-bold text-white">Settings</span>
                                            </span>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'settings' ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openProfileSection === 'settings' && (
                                            <div className="mt-3 grid grid-cols-2 gap-2">
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
                                                        className="dark-nav-tile group flex min-h-[64px] flex-col items-center justify-center rounded-[14px] px-2 text-center transition hover:-translate-y-0.5 hover:border-[var(--color-nav-tile-border-hover)] hover:shadow-[var(--shadow-nav-tile-hover)]"
                                                    >
                                                        <Icon size={18} className="mb-1.5 text-[var(--color-nav-blue-icon)] group-hover:text-[var(--color-nav-blue-icon-hover)]" />
                                                        <span className="text-xs font-bold leading-tight text-white">{label}</span>
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
                                        className="mt-4 inline-flex items-center gap-2.5 text-base font-extrabold text-[var(--color-nav-gold)] transition hover:text-[var(--color-nav-gold-soft)]"
                                    >
                                        <LogOut size={16} />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => onLoginClick?.()}
                                className="h-7 rounded-lg border border-white/40 px-4 text-xs font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => onRegisterClick?.()}
                                className="h-7 rounded-lg bg-[var(--color-success-main)] px-4 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(57,181,74,0.35)] transition-all hover:bg-[var(--color-success-hover)] hover:shadow-[0_2px_10px_rgba(57,181,74,0.4)]"
                            >
                                Join Now
                            </button>
                            <LanguageSwitcher value={language} onChange={setLanguage} />
                        </>
                    )}
                    </div>
                </div>
            </div>

            <div className="flex h-14 w-full items-center bg-[var(--color-nav-main)] px-4 md:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => onNavigate?.('home')}
                            className="text-lg font-black text-white tracking-wide cursor-pointer hover:opacity-90 transition-opacity md:text-xl"
                        >
                            LOGO
                        </button>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-end items-center gap-x-1">
                        {DESKTOP_MAIN_LINKS.map((link, idx) => {
                            const isActive = (activePage === 'home' && link === 'Home') ||
                                (activePage === 'live-casino' && link === 'Casino') ||
                                (activePage === 'slots' && link === 'Slots') ||
                                (activePage === 'sports' && link === 'Sports') ||
                                (activePage === 'e-sports' && link === 'E-Sports') ||
                                (activePage === 'lottery' && link === 'Lottery') ||
                                (activePage === 'fishing' && link === 'Fishing') ||
                                (activePage === 'poker' && link === 'Poker') ||
                                (activePage === 'promotion' && link === 'Promotion') ||
                                (activePage === 'referral' && link === 'Referral') ||
                                (activePage === 'vip' && link === 'VIP');
                            return (
                                <a
                                    key={idx}
                                    href={NAV_HREFS[link] ?? '#'}
                                    onMouseEnter={() => {
                                        if (link === 'Casino') setNavProviderDropdown('casino');
                                        else if (link === 'Slots') setNavProviderDropdown('slots');
                                        else setNavProviderDropdown(null);
                                    }}
                                    onFocus={() => {
                                        if (link === 'Casino') setNavProviderDropdown('casino');
                                        if (link === 'Slots') setNavProviderDropdown('slots');
                                    }}
                                    onClick={(event) => {
                                        const target = NAV_TARGETS[link];
                                        if (target) {
                                            event.preventDefault();
                                            onNavigate?.(target);
                                        }
                                    }}
                                    className={`relative px-4 py-2.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all border border-transparent
                                        ${isActive
                                            ? 'btn-theme-cta-soft border-amber-300 text-amber-950 shadow-[0_6px_12px_rgba(255,174,39,0.18)] hover:brightness-105'
                                            : 'text-white/90 hover:text-white hover:bg-white/10 hover:border-white/20'}`}
                                >
                                    {link}
                                </a>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        {authUser ? (
                            <>
                                <div className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
                                    <span className="truncate">{authUser.balance}</span>
                                    <CircleDollarSign size={14} className="shrink-0 text-[var(--color-nav-gold)]" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('deposit')}
                                    className="btn-theme-cta-soft inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl px-3.5 text-sm font-black tracking-wide"
                                >
                                    Deposit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('profile')}
                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                                    aria-label="My profile"
                                >
                                    <UserCircle2 size={20} className="text-white/90" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => onLoginClick?.()}
                                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/35 bg-white/5 px-3.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/50"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRegisterClick?.()}
                                    className="btn-theme-cta-soft inline-flex min-h-10 items-center justify-center rounded-xl px-3.5 text-sm font-black"
                                >
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                className={`fixed inset-x-0 bottom-0 top-0 z-[380] bg-[var(--color-nav-overlay)] backdrop-blur-[1px] transition-opacity duration-300 md:hidden ${
                    mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
                aria-hidden={!mobileMenuOpen}
                tabIndex={mobileMenuOpen ? 0 : -1}
            />
            <aside
                className={`fixed left-0 top-0 z-[390] flex h-[calc(100vh-96px)] w-full max-w-[360px] h-full flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0d3f83_0%,#062754_100%)] text-white shadow-[var(--shadow-nav-dropdown)] transition-transform duration-300 ease-out md:hidden ${
                    mobileMenuOpen ? 'translate-x-0' : 'pointer-events-none -translate-x-full'
                }`}
                aria-hidden={!mobileMenuOpen}
            >
                <div className="relative border-b border-white/10 px-4 py-4">
                    <div className="min-w-0">
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => handleMobileNavigate('profile')}
                                className="w-full pr-14 text-left text-2xl font-black leading-tight transition hover:opacity-90"
                            >
                                Hi, {authUser.name}
                            </button>
                        ) : (
                            <div className="pr-14">
                                <h2 className="text-2xl font-black leading-tight">Play Anywhere</h2>
                                <p className="mt-1 text-sm text-white/70">Your essentials stay up top. Everything else is tucked into More.</p>
                            </div>
                        )}

                        {authUser ? (
                            <div className="mt-3 space-y-3">
                                <VipStatusPill level={vipLevel} theme="dark" />
                                <div className="w-full rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.04)_100%)] p-4 shadow-[0_16px_28px_rgba(1,12,33,0.24)]">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--color-nav-text-accent)]">
                                                Balance
                                            </p>
                                            <p className="mt-1 text-lg font-black text-white">{authUser.balance}</p>
                                        </div>
                                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgb(255_216_77_/_0.22)] bg-[rgb(255_216_77_/_0.08)] text-[var(--color-nav-gold)]">
                                            <CircleDollarSign size={18} />
                                        </span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('deposit')}
                                            className="btn-theme-cta-soft inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black"
                                        >
                                            <ArrowDownToLine size={16} />
                                            Deposit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleMobileNavigate('withdrawal')}
                                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15"
                                        >
                                            <ArrowUpFromLine size={16} />
                                            Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onLoginClick?.();
                                    }}
                                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/30 bg-white/5 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                                >
                                    Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        onRegisterClick?.();
                                    }}
                                    className="btn-theme-cta-soft inline-flex min-h-12 items-center justify-center rounded-2xl px-4 text-sm font-black"
                                >
                                    Join Now
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                        aria-label="Close mobile menu"
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="space-y-2.5">
                        {MOBILE_PRIMARY_ITEMS.map(({ id, label, page, icon: Icon }) => {
                            const isMoreRow = id === 'more';
                            const isActive = isMoreRow ? MOBILE_MORE_ACTIVE_PAGES.has(activePage) : activePage === page;

                            return (
                                <div key={id} className="overflow-hidden rounded-[22px]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isMoreRow) {
                                                handleMobileMoreToggle();
                                                return;
                                            }

                                            handleMobileNavigate(page);
                                        }}
                                        className={`flex min-h-[58px] w-full items-center gap-3 rounded-[22px] border px-4 py-4 text-left transition ${
                                            isActive
                                                ? 'border-amber-300 bg-[linear-gradient(180deg,rgba(255,212,74,0.98)_0%,rgba(255,181,44,0.96)_100%)] text-[var(--color-cta-text)] shadow-[0_14px_26px_rgba(255,174,39,0.22)]'
                                                : 'border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]'
                                        }`}
                                        aria-expanded={isMoreRow ? mobileMoreOpen : undefined}
                                    >
                                        <span
                                            className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                                                isActive
                                                    ? 'border-amber-950/10 bg-amber-950/10 text-[var(--color-cta-text)]'
                                                    : 'border-white/10 bg-white/10 text-[var(--color-nav-gold)]'
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <span className="min-w-0 flex-1 text-base font-bold">{label}</span>
                                        <ChevronRight
                                            size={18}
                                            className={`shrink-0 transition-transform ${mobileMoreOpen && isMoreRow ? 'rotate-90' : ''}`}
                                        />
                                    </button>

                                    {isMoreRow && mobileMoreOpen && (
                                        <div className="mt-2 space-y-2 rounded-[22px] border border-white/10 bg-white/[0.04] p-2.5">
                                            {MOBILE_MORE_SECTIONS.map(({ id: sectionId, label: sectionLabel, icon: SectionIcon, items }) => {
                                                const sectionHasActiveItem = items.some((item) => isMobileMoreItemActive(item));
                                                const sectionOpen = openMobileMoreSection === sectionId;

                                                return (
                                                    <div
                                                        key={sectionId}
                                                        className={`overflow-hidden rounded-[20px] border transition ${
                                                            sectionHasActiveItem
                                                                ? 'border-[rgb(255_216_77_/_0.28)] bg-[rgb(255_216_77_/_0.08)]'
                                                                : 'border-white/10 bg-white/[0.05]'
                                                        }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMobileMoreSectionToggle(sectionId)}
                                                            className="flex min-h-[54px] w-full items-center gap-3 px-4 py-3.5 text-left"
                                                            aria-expanded={sectionOpen}
                                                        >
                                                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[var(--color-nav-gold)]">
                                                                <SectionIcon size={17} />
                                                            </span>
                                                            <span className="min-w-0 flex-1 text-sm font-black uppercase tracking-[0.16em] text-white/88">
                                                                {sectionLabel}
                                                            </span>
                                                            <ChevronRight
                                                                size={17}
                                                                className={`shrink-0 text-white/75 transition-transform ${sectionOpen ? 'rotate-90' : ''}`}
                                                            />
                                                        </button>

                                                        {sectionOpen && (
                                                            <div className="space-y-1.5 border-t border-white/10 px-2 pb-2 pt-1.5">
                                                                {items.map((item) => {
                                                                    const itemActive = isMobileMoreItemActive(item);
                                                                    const ItemIcon = item.icon;

                                                                    return (
                                                                        <button
                                                                            key={item.id}
                                                                            type="button"
                                                                            onClick={() => handleMobileMoreItemClick(item)}
                                                                            className={`flex min-h-[52px] w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-left transition ${
                                                                                itemActive
                                                                                    ? 'bg-[linear-gradient(180deg,rgba(255,212,74,0.94)_0%,rgba(255,181,44,0.9)_100%)] text-[var(--color-cta-text)] shadow-[0_10px_18px_rgba(255,174,39,0.18)]'
                                                                                    : 'bg-transparent text-white/88 hover:bg-white/[0.08] hover:text-white'
                                                                            }`}
                                                                        >
                                                                            <span
                                                                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                                                                                    itemActive
                                                                                        ? 'bg-amber-950/10 text-[var(--color-cta-text)]'
                                                                                        : 'bg-white/10 text-[var(--color-nav-gold)]'
                                                                                }`}
                                                                            >
                                                                                <ItemIcon size={16} />
                                                                            </span>
                                                                            <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
                                                                            <ChevronRight size={16} className="shrink-0 opacity-70" />
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
                <div className="border-t border-white/10 px-4 py-4">
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onLiveChatClick?.();
                            }}
                            className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-[rgb(255_216_77_/_0.24)] bg-[linear-gradient(180deg,rgba(255,216,77,0.18)_0%,rgba(255,216,77,0.08)_100%)] px-4 text-sm font-black text-[var(--color-nav-gold)] transition hover:bg-[linear-gradient(180deg,rgba(255,216,77,0.22)_0%,rgba(255,216,77,0.12)_100%)]"
                        >
                            <Headset size={17} />
                            Live Chat
                        </button>
                        {authUser ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    onLogout?.();
                                }}
                                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-sm font-semibold text-white/88 transition hover:bg-white/[0.09] hover:text-white"
                            >
                                <LogOut size={16} />
                                Log Out
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMobileDownloadApp}
                                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-4 text-sm font-semibold text-white/88 transition hover:bg-white/[0.09] hover:text-white"
                            >
                                <Smartphone size={16} />
                                App Download
                            </button>
                        )}
                    </div>
                </div>
            </aside>

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

            {navProviderDropdown != null && (
                <div className="fixed inset-x-0 bottom-0 top-[92px] z-[70] bg-[var(--color-nav-overlay)] backdrop-blur-[1px] pointer-events-none" />
            )}
        </nav>
    );
}
