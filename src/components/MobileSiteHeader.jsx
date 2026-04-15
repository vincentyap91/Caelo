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
        <div className="relative z-[300] flex min-h-[56px] w-full items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-1.5 text-slate-900 md:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                    aria-label="Open mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={16} />
                </button>
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="flex shrink-0 items-center justify-center py-1"
                >
                    <img src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp" alt="12WIN Logo" className="h-[32px] w-auto object-contain block" />
                </button>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
                {authUser ? (
                    <>
                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="flex h-10 min-w-0 max-w-[10.75rem] shrink items-center gap-1.5 rounded-xl border border-white/10 bg-[var(--color-brand-primary)] px-1.5 shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-slate-300/70"
                            aria-label={`Open profile - ${authUser.name}, ${authUser.balance}`}
                        >
                            <img
                                src={getVipStatus(vipLevel).medal}
                                alt=""
                                className="h-7 w-7 shrink-0 rounded-full border border-white/20 bg-white/10 object-contain"
                            />
                            <div className="min-w-0 flex-1 text-left leading-[1.05]">
                                <p className="truncate text-[11px] font-bold text-white">{authUser.name}</p>
                                <p className="mt-0.5 flex items-center gap-0.5 truncate text-[11px] font-bold tabular-nums text-white/90">
                                    <span className="truncate">{authUser.balance}</span>
                                    <CircleDollarSign size={11} className="shrink-0 text-white/90" />
                                </p>
                            </div>
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2.5"
                            tone="light"
                        />
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-[linear-gradient(180deg,#ffcf59_0%,#ffb62d_100%)] px-3 text-xs font-bold text-[#0c3f7e] shadow-[0_4px_12px_rgba(242,154,0,0.18)] transition hover:border-slate-400 hover:brightness-105"
                        >
                            Join
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2.5"
                            tone="light"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
