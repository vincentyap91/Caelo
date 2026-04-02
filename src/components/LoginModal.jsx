import React, { useEffect, useState } from 'react';
import { Lock, Send, UserRound, X } from 'lucide-react';
import TwoFactorLoginModal from './TwoFactorLoginModal';
import { verifyLogin, verify2FALogin } from '../services/authService';

export default function LoginModal({ open, onClose, logoText = 'LOGO', onRegisterClick, onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show2FA, setShow2FA] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setShow2FA(false);
            setSessionId(null);
            setLoginError('');
        }
    }, [open]);

    useEffect(() => {
        if (!open) return undefined;
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                if (show2FA) setShow2FA(false);
                else onClose?.();
            }
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
        };
    }, [open, onClose, show2FA]);

    if (!open) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
        setLoginLoading(true);
        try {
            const result = await verifyLogin(username.trim(), password);
            if (!result.success) {
                setLoginError(result.error || 'Login failed');
                return;
            }
            if (result.requires2FA && result.sessionId) {
                setSessionId(result.sessionId);
                setShow2FA(true);
            } else {
                onLogin?.(result.username || username.trim());
                onClose?.();
            }
        } finally {
            setLoginLoading(false);
        }
    };

    const handle2FASuccess = (user) => {
        onLogin?.(user);
        onClose?.();
    };

    const handle2FAClose = () => {
        setShow2FA(false);
        setSessionId(null);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close login modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Login"
                className="relative z-[1] w-full max-w-[600px] rounded-2xl border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 pb-6 pt-8 shadow-[var(--shadow-modal)] sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-deep)] text-white transition hover:brightness-95"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <h1 className="text-center text-2xl sm:text-2xl font-bold tracking-tight text-[rgb(18_63_128)]">
                    {logoText}
                </h1>

                <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-[420px]">
                    <label className="flex items-center gap-3 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 py-2 shadow-[var(--inset-panel)]">
                        <span className="inline-flex h-8 w-9 items-center justify-center rounded-full bg-[var(--color-brand-deep)] text-white">
                            <UserRound size={16} />
                        </span>
                        <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Username"
                            className="w-full bg-transparent text-lg font-semibold text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                            autoComplete="username"
                        />
                    </label>

                    <div className="mt-4">
                        <label className="flex items-center gap-3 rounded-md border border-[rgb(159_201_238)] bg-[var(--color-surface-base-80)] px-3 py-2 shadow-[var(--inset-panel)]">
                            <span className="inline-flex h-8 w-9 items-center justify-center rounded-full bg-[var(--color-brand-deep)] text-white">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                                className="w-full bg-transparent text-lg font-semibold text-[rgb(35_64_106)] outline-none placeholder:text-[rgb(111_133_168)]"
                                autoComplete="current-password"
                            />
                        </label>
                        {loginError && (
                            <p className="mt-2 text-sm font-medium text-[var(--color-danger-main)]">{loginError}</p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <button type="button" className="text-sm sm:text-base font-semibold text-[rgb(53_91_143)] hover:underline">
                                Forgot Password?
                            </button>

                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="btn-theme-auth h-10 min-w-[100px] rounded-md px-5 text-sm sm:text-base font-bold tracking-[0.03em] transition hover:brightness-105 disabled:opacity-70"
                            >
                                {loginLoading ? 'Logging in...' : 'LOGIN'}
                            </button>
                        </div>
                    </div>
                </form>

                <TwoFactorLoginModal
                    open={show2FA}
                    onClose={handle2FAClose}
                    onSuccess={handle2FASuccess}
                    verifyCode={(code, trustDevice) => verify2FALogin(sessionId, code, trustDevice)}
                />

                <div className="mx-auto mt-7 flex w-full max-w-[420px] items-center gap-4 text-base sm:text-lg font-medium text-[var(--color-text-muted)]">
                    <div className="h-px flex-1 bg-[rgb(171_204_235)]" />
                    <span>or</span>
                    <div className="h-px flex-1 bg-[rgb(171_204_235)]" />
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        className="inline-flex h-12 items-center gap-3 rounded-lg border border-[rgb(152_198_238)] bg-[var(--color-brand-deep)] px-7 text-base sm:text-lg font-semibold text-white transition hover:brightness-110"
                    >
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(55_174_226)] text-white">
                            <Send size={18} fill="currentColor" className="-rotate-12" />
                        </span>
                        Telegram
                    </button>
                </div>

                <p className="mx-auto mt-8 max-w-[480px] text-center text-sm sm:text-base font-medium text-[rgb(80_105_141)]">
                    Don't have an account yet? Click{' '}
                    <button
                        type="button"
                        onClick={() => {
                            onClose?.();
                            onRegisterClick?.();
                        }}
                        className="text-[rgb(255_82_0)] hover:underline"
                    >
                        here
                    </button>{' '}
                    to register now!
                </p>

                <div className="mx-auto mt-4 h-px w-full max-w-[520px] bg-[rgb(171_204_235)]" />

                <p className="mx-auto mt-4 max-w-[520px] text-center text-sm sm:text-base font-medium leading-[1.35] text-[rgb(80_105_141)]">
                    If you encounter any issues while logging in,
                    <br />
                    Please contact our{' '}
                    <button type="button" className="text-[rgb(255_82_0)] hover:underline">
                        Customer Service
                    </button>{' '}
                    for further assistance
                </p>
            </section>
        </div>
    );
}

