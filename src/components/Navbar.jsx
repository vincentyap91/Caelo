import React, { useEffect, useRef, useState } from 'react';
import {
    ChevronDown,
    CircleDollarSign,
    EllipsisVertical,
    Headset,
    Heart,
    LogOut,
    ScrollText,
    Settings,
    ShieldCheck,
    UserCircle2,
    UserRound
} from 'lucide-react';
import LiveCasinoMenu from './LiveCasinoMenu';
import { supportOptions } from '../constants/supportOptions';

export default function Navbar({ onNavigate, activePage = 'home', onLoginClick, onRegisterClick, authUser, onLogout, onAccountDetailsClick, onLiveChatClick, onCasinoProviderSelect }) {
    const [casinoMenuOpen, setCasinoMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [openProfileSection, setOpenProfileSection] = useState('account');
    const profileMenuRef = useRef(null);

    const mainLinks = [
        'Home', 'Casino', 'Slots', 'Sports', 'E-Sports', 'Lottery',
        'Fishing', 'Poker',
        'Promotion', 'VIP', 'More'
    ];
    const navTargets = { Home: 'home', Casino: 'live-casino', Slots: 'slots', Sports: 'sports', 'E-Sports': 'e-sports', Lottery: 'lottery', Fishing: 'fishing', Poker: 'poker', Promotion: 'promotion', VIP: 'vip' };
    const navHrefs = { Home: '/', Casino: '/casino', Slots: '/slots', Sports: '/sports', 'E-Sports': '/e-sports', Lottery: '/lottery', Fishing: '/fishing', Poker: '/poker', Promotion: '/promotion', VIP: '/vip' };
    const accountCards = [
        { label: 'Account Details', icon: UserRound },
        { label: 'Verification', icon: ShieldCheck },
        { label: 'Favourites', icon: Heart },
        { label: 'My Bets', icon: ScrollText }
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

    const toggleProfileSection = (sectionKey) => {
        setOpenProfileSection((current) => (current === sectionKey ? null : sectionKey));
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 w-full z-50 shadow-md"
            onMouseLeave={() => setCasinoMenuOpen(false)}
        >
            <div className="flex h-8 w-full items-center justify-between bg-[var(--color-nav-top)] px-4 text-xs text-white md:px-10">
                <div className="flex gap-4 items-center h-full">
                    <a href="#" className="flex h-full items-center gap-1 border-r border-[var(--color-brand-primary)] px-2 hover:text-white/80">
                        <span className="text-sm">Mobile</span>
                    </a>
                    <a href="#" className="flex items-center gap-1 hover:text-white/80 h-full">
                        <span className="text-sm">Affiliate</span>
                    </a>
                </div>

                <div className="flex items-center gap-2 h-full py-1">
                    {authUser ? (
                        <div
                            ref={profileMenuRef}
                            className="relative flex h-full items-center gap-1 rounded-[12px] px-1 py-0.5 shadow-[var(--shadow-nav-top)]"
                        >
                            <div className="flex h-7 items-center gap-1.5 rounded-[9px] border border-white/10 bg-[rgb(14_99_187)] px-3 text-white">
                                <span className="font-bold tracking-[0.01em]">{authUser.balance}</span>
                                <CircleDollarSign size={14} className="text-[var(--color-nav-gold)]" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setProfileMenuOpen((open) => !open)}
                                className="flex h-7 items-center gap-1.5 rounded-[9px] px-2 text-white transition hover:bg-white/10"
                                aria-haspopup="menu"
                                aria-expanded={profileMenuOpen}
                            >
                                <span className="font-bold text-[rgb(255_240_160)]">{authUser.name}</span>
                                <div className="relative">
                                    <UserCircle2 size={20} className="text-white/90" />
                                    {authUser.notifications > 0 && (
                                        <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-[10px] font-black text-white">
                                            {authUser.notifications}
                                        </span>
                                    )}
                                </div>
                                <ChevronDown
                                    size={13}
                                    className={`text-white/75 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <button
                                type="button"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-[9px] text-white/75 hover:bg-white/10 hover:text-white transition"
                                aria-label="More account options"
                            >
                                <EllipsisVertical size={15} />
                            </button>
                            <button
                                type="button"
                                className="btn-theme-cta-soft h-7 rounded-[9px] px-4 font-black tracking-wide transition hover:brightness-105"
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
                            <div className="flex h-7 items-center justify-center rounded-[9px] border border-white/18 bg-white/[0.03] px-2 text-white/90">
                                <span className="text-xs shadow-sm">TH</span>
                            </div>

                            {profileMenuOpen && (
                                <div className="dark-nav-shell absolute right-15 top-[calc(100%+10px)] z-[120] w-[312px] overflow-hidden rounded-[22px] p-4 text-white">
                                    <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,#29bbff55_0%,transparent_72%)] pointer-events-none" />

                                    <div className="relative flex items-start gap-3">
                                        <div className="relative shrink-0">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[rgb(86_185_255_/_0.3)] bg-[linear-gradient(180deg,#1a5bb1_0%,#0b3e80_100%)] shadow-[var(--inset-highlight-strong)]">
                                                <UserCircle2 size={40} className="text-white/90" />
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[var(--color-nav-badge)] text-white shadow-[0_6px_12px_rgba(0,0,0,0.22)]"
                                                aria-label="Edit profile"
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
                                            <div className="mt-2 inline-flex items-center rounded-full border border-[rgb(61_125_203)] bg-[linear-gradient(180deg,#143567_0%,#0e2547_100%)] px-2.5 py-1 text-xs font-bold text-[rgb(219_234_255)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                                Iron
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dark-nav-panel relative mt-4 rounded-[18px] p-3">
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
                                            <div className="mt-3 grid grid-cols-3 gap-3">
                                                {accountCards.map(({ label, icon: Icon }) => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);

                                                            if (label === 'Account Details') {
                                                                onAccountDetailsClick?.();
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

                                    <div className="dark-nav-panel relative mt-3 rounded-[18px] p-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleProfileSection('support')}
                                            className="flex w-full items-center justify-between transition hover:opacity-90"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[rgb(90_208_255)] shadow-[var(--shadow-nav-pill)]">
                                                    <Headset size={14} />
                                                </div>
                                                <span className="text-lg font-bold text-white">Support</span>
                                            </div>
                                            <ChevronDown
                                                size={16}
                                                className={`text-white/80 transition-transform ${openProfileSection === 'support' ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {openProfileSection === 'support' && (
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {supportOptions.map(({ label, icon: Icon }) => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => {
                                                            setProfileMenuOpen(false);
                                                            if (label === 'Live Chat') onLiveChatClick?.();
                                                            if (label === 'Share Feedback') onNavigate?.('feedback');
                                                            if (label === 'Help Center') onNavigate?.('help-center');
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

                                    <div className="dark-nav-panel mt-3 rounded-[18px] px-4 py-3 transition hover:border-[rgb(102_203_255_/_0.24)]">
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
                                            <div className="mt-3 rounded-[14px] border border-[var(--color-nav-tile-border)] bg-[linear-gradient(180deg,#092c5a_0%,#041c3b_100%)] px-3 py-3 text-sm text-[var(--color-nav-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                                Preferences, security and notification controls.
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
                                className="h-full px-6 rounded border border-white/50 hover:bg-white/10 transition-colors font-semibold"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => onRegisterClick?.()}
                                className="h-full rounded bg-[var(--color-success-main)] px-6 font-semibold shadow-[var(--shadow-success)] shadow-inner transition-colors hover:bg-[var(--color-success-hover)]"
                            >
                                Join Now
                            </button>
                            <button type="button" className="h-full px-2 border border-white/30 rounded flex items-center justify-center opacity-90 mx-1">
                                <span className="text-sm shadow-sm">TH</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex h-14 w-full items-center bg-[var(--color-nav-main)] px-4 md:px-10">
                <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => onNavigate?.('home')}
                        className="text-2xl font-black text-white/90 drop-shadow-sm tracking-wide mr-8 cursor-pointer hover:opacity-80"
                    >
                        LOGO
                    </button>

                    <div className="hidden lg:flex flex-1 justify-center items-center gap-x-[14px]">
                        {mainLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={navHrefs[link] ?? '#'}
                                onMouseEnter={() => {
                                    if (link === 'Casino') {
                                        setCasinoMenuOpen(true);
                                    } else {
                                        setCasinoMenuOpen(false);
                                    }
                                }}
                                onFocus={() => {
                                    if (link === 'Casino') {
                                        setCasinoMenuOpen(true);
                                    }
                                }}
                                onClick={(event) => {
                                    const target = navTargets[link];
                                    if (target) {
                                        event.preventDefault();
                                        onNavigate?.(target);
                                    }
                                }}
                                className={`text-white text-xs font-medium hover:text-yellow-300 transition-colors whitespace-nowrap drop-shadow-sm
                    ${link === 'More' ? 'flex items-center group' : ''}
                    ${activePage === 'home' && link === 'Home' ? 'text-yellow-300' : ''}
                    ${activePage === 'live-casino' && link === 'Casino' ? 'text-yellow-300' : ''}
                    ${activePage === 'slots' && link === 'Slots' ? 'text-yellow-300' : ''}
                    ${activePage === 'sports' && link === 'Sports' ? 'text-yellow-300' : ''}
                    ${activePage === 'e-sports' && link === 'E-Sports' ? 'text-yellow-300' : ''}
                    ${activePage === 'lottery' && link === 'Lottery' ? 'text-yellow-300' : ''}
                    ${activePage === 'fishing' && link === 'Fishing' ? 'text-yellow-300' : ''}
                    ${activePage === 'poker' && link === 'Poker' ? 'text-yellow-300' : ''}
                    ${activePage === 'promotion' && link === 'Promotion' ? 'text-yellow-300' : ''}
                    ${activePage === 'vip' && link === 'VIP' ? 'text-yellow-300' : ''}`}
                            >
                                {link}
                                {link === 'More' && <ChevronDown size={14} className="ml-0.5 group-hover:rotate-180 transition-transform" strokeWidth={3} />}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <LiveCasinoMenu
                open={casinoMenuOpen}
                onProviderClick={(provider) => {
                    onCasinoProviderSelect?.(provider);
                    setCasinoMenuOpen(false);
                }}
            />

            {casinoMenuOpen && (
                <div className="fixed inset-x-0 bottom-0 top-[88px] z-[70] bg-[var(--color-nav-overlay)] backdrop-blur-[1px] pointer-events-none" />
            )}
        </nav>
    );
}
