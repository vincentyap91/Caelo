import React from 'react';
import { CircleDollarSign, Menu } from 'lucide-react';

import LanguageSwitcher from './LanguageSwitcher';
import { getVipStatus } from '../constants/vipStatus';

export default function MobileSiteHeader({
    authUser,
    vipLevel = 'Diamond',
    language,
    onLanguageChange,
    mobileMenuOpen = false,
    onMenuToggle,
    onNavigateHome,
    onProfileClick,
    onLoginClick,
    onRegisterClick,
}) {
    return (
        <div className="relative z-[300] flex w-full items-center justify-between gap-2 border-b border-white/10 bg-[var(--color-nav-top)] px-3 py-2 text-white md:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white/15"
                    aria-label="Open mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={16} />
                </button>
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="min-w-0 truncate text-left text-base font-bold tracking-wide text-white"
                >
                    LOGO
                </button>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
                {authUser ? (
                    <>
                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="flex h-10 min-w-0 max-w-[10.75rem] shrink items-center gap-1.5 rounded-xl border border-white/15 bg-[linear-gradient(180deg,#16508f_0%,#0d3562_100%)] px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:brightness-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white/40"
                            aria-label={`Open profile - ${authUser.name}, ${authUser.balance}`}
                        >
                            <img
                                src={getVipStatus(vipLevel).medal}
                                alt=""
                                className="h-7 w-7 shrink-0 rounded-full border border-white/20 bg-black/10 object-contain"
                            />
                            <div className="min-w-0 flex-1 text-left leading-[1.05]">
                                <p className="truncate text-[11px] font-bold text-[rgb(255_240_160)]">{authUser.name}</p>
                                <p className="mt-0.5 flex items-center gap-0.5 truncate text-[11px] font-bold tabular-nums text-white">
                                    <span className="truncate">{authUser.balance}</span>
                                    <CircleDollarSign size={11} className="shrink-0 text-[var(--color-nav-gold)]" />
                                </p>
                            </div>
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2.5"
                        />
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/35 bg-white/5 px-3 text-xs font-semibold text-white transition hover:bg-white/10"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="btn-theme-cta-soft inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-3 text-xs font-bold"
                        >
                            Join
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2.5"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
