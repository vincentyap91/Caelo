import React, { useCallback, useState } from 'react';
import { ChevronDown, Eye, EyeOff, Lock, Mail, Phone, UserRound } from 'lucide-react';
import promoImage from '../assets/register-banner.jpg';
import promoImageMobile from '../assets/register-banner-mobile.jpg';
import { PAGE_BANNER_IMG } from '../constants/pageBannerClasses';
import VerifyPhoneNumberStep from './verification/VerifyPhoneNumberStep';
import RegistrationCompletedModal from './verification/RegistrationCompletedModal';
import WhatsAppIcon from './WhatsAppIcon';

export default function RegisterPage({ onLoginClick, onRegisterSuccess, onContactCustomerService }) {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [phase, setPhase] = useState('form');
    const [verifyKey, setVerifyKey] = useState(0);

    const handleRegister = (e) => {
        e.preventDefault();
        setVerifyKey((k) => k + 1);
        setPhase('verify');
    };

    const handleVerified = useCallback(() => {
        setPhase('success');
    }, []);

    const handleRegistrationFlowComplete = useCallback(() => {
        onRegisterSuccess?.(username.trim() || 'Member');
    }, [username, onRegisterSuccess]);

    return (
        <main className="w-full bg-gradient-register-page py-6 md:py-10">
            <section className="page-container">
                <div className="overflow-hidden rounded-2xl border border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[var(--shadow-register-card)]">
                    <div className="grid lg:grid-cols-[1.05fr_1fr]">
                        <article className="relative max-md:h-[135px] max-md:overflow-hidden text-[var(--color-text-card-text)]">
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

                        <article className="bg-gradient-register-panel p-4 text-[var(--color-text-card-text)] md:p-6">
                            <div className="mx-auto w-full max-w-[420px]">
                                {phase === 'success' ? (
                                    <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 px-2 py-10 text-center sm:min-h-[300px]">
                                        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Finishing your registration…</p>
                                    </div>
                                ) : phase === 'verify' ? (
                                    <VerifyPhoneNumberStep
                                        key={verifyKey}
                                        phoneRaw={phone}
                                        onVerified={handleVerified}
                                        onBack={() => setPhase('form')}
                                        onContactCustomerService={onContactCustomerService}
                                    />
                                ) : (
                                    <>
                                        <form className="space-y-3" onSubmit={handleRegister} noValidate>
                                            <label className="block">
                                                <span className="sr-only">Username</span>
                                                <div className="flex h-11 items-center gap-2 rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)]">
                                                    <UserRound size={16} className="text-[var(--color-text-secondary)]" />
                                                    <input
                                                        name="username"
                                                        value={username}
                                                        onChange={(ev) => setUsername(ev.target.value)}
                                                        placeholder="Username *"
                                                        autoComplete="username"
                                                        className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                                    />
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="sr-only">New Password</span>
                                                <div className="flex h-11 items-center gap-2 rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)]">
                                                    <Lock size={16} className="text-[var(--color-text-secondary)]" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="New Password *"
                                                        className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((value) => !value)}
                                                        className="text-[var(--color-text-soft)] hover:text-[var(--color-text-secondary)]"
                                                        aria-label="Toggle password visibility"
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </label>

                                            <div className="grid grid-cols-[84px_1fr] gap-2">
                                                <label className="block">
                                                    <span className="sr-only">Country code</span>
                                                    <div className="flex h-11 items-center justify-between rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 text-sm text-[var(--color-text-secondary)] shadow-[var(--inset-panel)]">
                                                        +60
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </label>
                                                <label className="block">
                                                    <span className="sr-only">Telephone number</span>
                                                    <div className="flex h-11 items-center gap-2 rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)]">
                                                        <Phone size={16} className="text-[var(--color-text-secondary)]" />
                                                        <input
                                                            placeholder="Telephone Number *"
                                                            value={phone}
                                                            onChange={(ev) => setPhone(ev.target.value)}
                                                            inputMode="tel"
                                                            autoComplete="tel"
                                                            className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                                        />
                                                    </div>
                                                </label>
                                            </div>

                                            <label className="block">
                                                <span className="sr-only">Full Name</span>
                                                <div className="flex h-11 items-center gap-2 rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)]">
                                                    <UserRound size={16} className="text-[var(--color-text-secondary)]" />
                                                    <input
                                                        placeholder="Full Name *"
                                                        className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                                    />
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="sr-only">Email</span>
                                                <div className="flex h-11 items-center gap-2 rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 shadow-[var(--inset-panel)]">
                                                    <Mail size={16} className="text-[var(--color-text-secondary)]" />
                                                    <input
                                                        placeholder="Email *"
                                                        className="w-full bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-soft)]"
                                                    />
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="sr-only">Currency</span>
                                                <div className="flex h-11 items-center justify-between rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 text-sm text-[var(--color-text-secondary)] shadow-[var(--inset-panel)]">
                                                    Malaysian Ringgit (MYR)
                                                    <ChevronDown size={14} />
                                                </div>
                                            </label>

                                            <label className="block">
                                                <span className="sr-only">Affiliate ID</span>
                                                <div className="flex h-11 items-center justify-between rounded-md border border-[var(--color-border-brand)] bg-[var(--color-surface-input-light)] px-3 text-sm text-[var(--color-text-secondary)] shadow-[var(--inset-panel)]">
                                                    Affiliate ID / Referral (Optional)
                                                    <ChevronDown size={14} />
                                                </div>
                                            </label>

                                            <button
                                                type="submit"
                                                className="btn-theme-auth h-11 w-full rounded-md text-base font-bold transition hover:brightness-105"
                                            >
                                                REGISTER
                                            </button>
                                        </form>

                                        <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                                            By clicking the <span className="font-bold text-[var(--color-warning)]">REGISTER</span> button, I acknowledge that I am above 18 years old and have read and accepted your Terms &amp; Conditions.
                                        </p>
                                        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                                            Already have account?{' '}
                                            <button type="button" onClick={() => onLoginClick?.()} className="font-bold text-[var(--color-warning)] hover:underline">
                                                LOGIN
                                            </button>
                                        </p>

                                        <div className="mt-5 flex w-full flex-col items-center border-t border-[var(--color-border-brand)] pt-5 text-center">
                                            <h2 className="text-xs font-medium leading-snug tracking-tight text-[var(--color-text-soft)] sm:text-sm">
                                                Register with WhatsApp
                                            </h2>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-[var(--color-success-strong)] bg-[var(--color-success-strong)] px-4 text-sm font-semibold text-[var(--color-text-card-text)] shadow-[0_1px_2px_rgb(0_0_0_/_10%)] transition hover:bg-[var(--color-success-strong)] hover:shadow-[0_2px_5px_rgb(37_211_102_/_28%)] active:brightness-[0.97]"
                                            >
                                                <WhatsAppIcon size={16} className="shrink-0 opacity-95" />
                                                WhatsApp
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </article>
                    </div>
                </div>
            </section>
            {phase === 'success' ? (
                <RegistrationCompletedModal onComplete={handleRegistrationFlowComplete} />
            ) : null}
        </main>
    );
}

