import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Menu, RefreshCw, ChevronDown, Headset } from 'lucide-react';
import BalanceDetailDropdown from './BalanceDetailDropdown';
import LanguageSwitcher from './LanguageSwitcher';

/** When balance is long, show currency on line 1 and amount on line 2 (same string if no space). */
function getMobileBalanceLayout(balance) {
    const raw = String(balance ?? '').trim();
    const m = raw.match(/^(\S+)\s+(.+)$/);
    if (!m) {
        return { variant: 'single', text: raw };
    }
    const currency = m[1];
    const amount = m[2].trim();
    const long = raw.length > 14 || amount.length > 9;
    if (!long) {
        return { variant: 'single', text: raw };
    }
    return { variant: 'split', currency, amount };
}

export default function MobileSiteHeader({
    authUser,
    language,
    onLanguageChange,
    mobileMenuOpen = false,
    onMenuToggle,
    onNavigateHome,
    onProfileClick,
    onRefreshBalance,
    balanceRefreshing = false,
    onLoginClick,
    onRegisterClick,
    onLiveChatClick,
}) {
    const [balanceDropdownOpen, setBalanceDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const balanceLayout = useMemo(
        () => (authUser ? getMobileBalanceLayout(authUser.balance) : null),
        [authUser]
    );

    useEffect(() => {
        if (!balanceDropdownOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setBalanceDropdownOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [balanceDropdownOpen]);

    return (
        <div className="mobile-site-header relative z-[300] flex min-h-[56px] w-full items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-tertiery)] px-3 py-1.5 text-[var(--color-primary)] lg:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-button-nav)] text-[var(--color-primary)] transition hover:bg-[var(--color-surface-cool-light)]"
                    aria-label="Open mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={16} />
                </button>
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="flex shrink-0 items-center py-1"
                >
                    <img
                        src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp"
                        alt="12WIN Logo"
                        className="block h-[32px] w-auto max-w-[100px] object-contain object-left"
                    />
                </button>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
                {authUser ? (
                    <>
                        <div
                            ref={containerRef}
                            className="mobile-sticky-balance relative inline-flex h-10 min-w-0 max-w-[min(13.75rem,calc(100vw-9.25rem))] shrink items-stretch overflow-hidden rounded-lg"
                        >
                            <button
                                type="button"
                                onClick={() => setBalanceDropdownOpen(!balanceDropdownOpen)}
                                className={`mobile-sticky-balance__toggle flex min-w-0 flex-1 touch-manipulation items-center gap-1 text-left transition focus-visible:z-10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--color-border-subtle)]/70 focus-visible:ring-offset-0 ${balanceLayout?.variant === 'split'
                                        ? 'justify-center py-0.5 pl-2.5 pr-1.5'
                                        : 'h-full py-0 pl-2.5 pr-1.5'
                                    }`}
                                aria-label={`Open balance detail — ${authUser.balance} (${authUser.name})`}
                                title={authUser.name}
                            >
                                {balanceLayout?.variant === 'split' ? (
                                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-px leading-none">
                                        <span className="text-[9px] font-semibold leading-none tracking-wide text-[var(--color-tertiery)]">
                                            {balanceLayout.currency}
                                        </span>
                                        <span className="min-w-0 w-full truncate whitespace-nowrap text-[clamp(10px,2.9vw,12px)] font-extrabold tabular-nums leading-none tracking-tight text-[var(--color-tertiery)]">
                                            {balanceLayout.amount}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[clamp(11px,3.15vw,14px)] font-extrabold tabular-nums leading-none tracking-tight text-[var(--color-tertiery)]">
                                        {balanceLayout?.text ?? authUser.balance}
                                    </span>
                                )}
                                <ChevronDown
                                    size={13}
                                    className={`shrink-0 text-[var(--color-tertiery)] transition-transform ${balanceDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onRefreshBalance?.();
                                }}
                                disabled={!onRefreshBalance || balanceRefreshing}
                                className="mobile-sticky-balance__refresh inline-flex h-full w-10 min-w-10 shrink-0 touch-manipulation items-center justify-center self-stretch px-0.5 transition disabled:pointer-events-none disabled:opacity-40"
                                aria-label="Refresh balance"
                                title="Refresh balance"
                            >
                                <RefreshCw
                                    size={14}
                                    strokeWidth={2.25}
                                    className={`shrink-0 ${balanceRefreshing ? 'animate-spin' : ''}`}
                                    aria-hidden
                                />
                            </button>

                            {balanceDropdownOpen && (
                                <BalanceDetailDropdown
                                    onRefreshBalance={onRefreshBalance}
                                    balanceRefreshing={balanceRefreshing}
                                    className="absolute right-0 top-[calc(100%+8px)] z-[350]"
                                />
                            )}
                        </div>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2"
                            tone="light"
                            showShortLabel={false}
                        />

                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-button-nav)] px-3 text-xs font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-surface-cool-light)]"
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="btn-theme-cta-soft inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-3 text-xs font-bold transition hover:brightness-105"
                        >
                            Join Now
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2"
                            tone="light"
                            showShortLabel={false}
                        />

                    </>
                )}
            </div>
        </div>
    );
}
