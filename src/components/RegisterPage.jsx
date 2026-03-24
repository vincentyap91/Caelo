import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Lock, Mail, Phone, Send, UserRound } from 'lucide-react';
import promoImage from '../assets/register-banner.jpg';
import promoImageMobile from '../assets/register-banner-mobile.jpg';
import { PAGE_BANNER_IMG } from '../constants/pageBannerClasses';

export default function RegisterPage({ onLoginClick }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="w-full bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-page-mid)_45%,var(--gradient-register-page-end)_100%)] py-6 md:py-10">
            <section className="page-container">
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[var(--shadow-register-card)]">
                    <div className="grid lg:grid-cols-[1.05fr_1fr]">
                        <article className="relative max-md:h-[150px] max-md:overflow-hidden text-white">
                            <div className="h-full min-h-0 overflow-hidden rounded-t-2xl md:rounded-l-xl">
                                <picture className="contents">
                                    <source media="(max-width: 767px)" srcSet={promoImageMobile} />
                                    <img
                                        src={promoImage}
                                        alt="Member benefit"
                                        className={PAGE_BANNER_IMG}
                                        decoding="async"
                                    />
                                </picture>
                            </div>
                        </article>

                        <article className="bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] p-4 text-white md:p-6">
                            <div className="mx-auto w-full max-w-[420px]">
                                <button
                                    type="button"
                                    className="mx-auto inline-flex h-10 items-center gap-2 rounded-md border border-[rgb(152_198_238)] bg-[var(--color-brand-deep)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
                                >
                                    <Send size={14} fill="currentColor" className="-rotate-12" />
                                    Telegram
                                </button>

                                <div className="mt-4 flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                                    <div className="h-px flex-1 bg-[rgb(171_204_235)]" />
                                    <span>or</span>
                                    <div className="h-px flex-1 bg-[rgb(171_204_235)]" />
                                </div>

                                <form className="mt-4 space-y-3">
                                    <label className="block">
                                        <span className="sr-only">Username</span>
                                        <div className="flex h-11 items-center gap-2 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 shadow-[var(--inset-panel)]">
                                            <UserRound size={16} className="text-[rgb(79_125_183)]" />
                                            <input
                                                placeholder="Username *"
                                                className="w-full bg-transparent text-sm text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                            />
                                        </div>
                                    </label>

                                    <label className="block">
                                        <span className="sr-only">New Password</span>
                                        <div className="flex h-11 items-center gap-2 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 shadow-[var(--inset-panel)]">
                                            <Lock size={16} className="text-[rgb(79_125_183)]" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="New Password *"
                                                className="w-full bg-transparent text-sm text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((value) => !value)}
                                                className="text-[rgb(111_133_168)] hover:text-[rgb(35_64_106)]"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </label>

                                    <div className="grid grid-cols-[84px_1fr] gap-2">
                                        <label className="block">
                                            <span className="sr-only">Country code</span>
                                            <div className="flex h-11 items-center justify-between rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 text-sm text-[rgb(35_64_106)] shadow-[var(--inset-panel)]">
                                                +60
                                                <ChevronDown size={14} />
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="sr-only">Telephone number</span>
                                            <div className="flex h-11 items-center gap-2 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 shadow-[var(--inset-panel)]">
                                                <Phone size={16} className="text-[rgb(79_125_183)]" />
                                                <input
                                                    placeholder="Telephone Number *"
                                                    className="w-full bg-transparent text-sm text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="sr-only">Full Name</span>
                                        <div className="flex h-11 items-center gap-2 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 shadow-[var(--inset-panel)]">
                                            <UserRound size={16} className="text-[rgb(79_125_183)]" />
                                            <input
                                                placeholder="Full Name *"
                                                className="w-full bg-transparent text-sm text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                            />
                                        </div>
                                    </label>

                                    <label className="block">
                                        <span className="sr-only">Email</span>
                                        <div className="flex h-11 items-center gap-2 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 shadow-[var(--inset-panel)]">
                                            <Mail size={16} className="text-[rgb(79_125_183)]" />
                                            <input
                                                placeholder="Email *"
                                                className="w-full bg-transparent text-sm text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                            />
                                        </div>
                                    </label>

                                    <label className="block">
                                        <span className="sr-only">Currency</span>
                                        <div className="flex h-11 items-center justify-between rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 text-sm text-[rgb(35_64_106)] shadow-[var(--inset-panel)]">
                                            Malaysian Ringgit (MYR)
                                            <ChevronDown size={14} />
                                        </div>
                                    </label>

                                    <label className="block">
                                        <span className="sr-only">Affiliate ID</span>
                                        <div className="flex h-11 items-center justify-between rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 text-sm text-[rgb(35_64_106)] shadow-[var(--inset-panel)]">
                                            Affiliate ID / Referral (Optional)
                                            <ChevronDown size={14} />
                                        </div>
                                    </label>

                                    <button
                                        type="button"
                                        className="btn-theme-auth h-11 w-full rounded-md text-base font-black tracking-wide transition hover:brightness-105"
                                    >
                                        REGISTER
                                    </button>
                                </form>

                                <p className="mt-3 text-xs text-[rgb(80_105_141)]">
                                    By clicking the <span className="font-bold text-[rgb(255_185_104)]">REGISTER</span> button, I acknowledge that I am above 18 years old and have read and accepted your Terms &amp; Conditions.
                                </p>
                                <p className="mt-3 text-sm text-[rgb(80_105_141)]">
                                    Already have account?{' '}
                                    <button type="button" onClick={() => onLoginClick?.()} className="font-bold text-[rgb(255_185_104)] hover:underline">
                                        LOGIN
                                    </button>
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}
