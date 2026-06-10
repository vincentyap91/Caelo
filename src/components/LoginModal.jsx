import React, { useEffect, useState } from 'react';
import { Lock, UserRound, X } from 'lucide-react';
import TwoFactorLoginModal from './TwoFactorLoginModal';
import WhatsAppIcon from './WhatsAppIcon';
import { loginWithWhatsApp, verifyLogin, verify2FALogin } from '../services/authService';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

export default function LoginModal({
    open,
    onClose,
    logoText = 'LOGO',
    onRegisterClick,
    onLogin,
    onCustomerServiceClick,
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show2FA, setShow2FA] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [whatsappLoading, setWhatsappLoading] = useState(false);

    useBodyScrollLock(open);

    useEffect(() => {
        if (!open) {
            setShow2FA(false);
            setSessionId(null);
            setLoginError('');
            setWhatsappLoading(false);
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
        window.addEventListener('keydown', handleEscape);
        return () => {
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
        } catch (err) {
            console.error('Login error:', err);
            setLoginError('An unexpected error occurred. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleWhatsAppLogin = async () => {
        setLoginError('');
        setWhatsappLoading(true);
        try {
            const result = await loginWithWhatsApp();
            if (!result.success) {
                setLoginError(result.error || 'WhatsApp login failed');
                return;
            }
            onLogin?.(result.user || result.username || username.trim() || 'demo');
            onClose?.();
        } catch (err) {
            console.error('WhatsApp login error:', err);
            setLoginError('Could not connect to WhatsApp. Please try again later.');
        } finally {
            setWhatsappLoading(false);
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
        <div className="login-modal-root fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close login modal"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-overlay-strong)] backdrop-blur-[1px]"
            />

            <section
                role="dialog"
                aria-modal="true"
                aria-label="Login"
                className="login-modal-shell login-modal-panel relative z-[1] w-full max-w-[600px] rounded-2xl px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="login-modal-close absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:brightness-95"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <div className="flex justify-center">
                    <img src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp" alt="12WIN Logo" className="h-[32px] sm:h-[40px] w-auto object-contain" />
                </div>

                <form onSubmit={handleSubmit} className="mx-auto mt-6 w-full max-w-[420px]">
                    <label className="login-modal-field">
                        <span className="login-modal-field__icon">
                            <UserRound size={16} />
                        </span>
                        <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Username"
                            className="login-modal-input"
                            autoComplete="username"
                        />
                    </label>

                    <div className="mt-4">
                        <label className="login-modal-field">
                            <span className="login-modal-field__icon">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                                className="login-modal-input"
                                autoComplete="current-password"
                            />
                        </label>
                        {loginError && (
                            <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">{loginError}</p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <button type="button" className="text-sm font-semibold text-[var(--color-text-primary-card-title)] hover:underline sm:text-base">
                                Forgot Password?
                            </button>

                            <button
                                type="submit"
                                disabled={loginLoading}
                                className="btn-theme-cta-soft inline-flex h-10 min-w-[100px] items-center justify-center rounded-xl px-5 text-sm font-bold transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base"
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

                <div className="mx-auto mt-7 flex w-full max-w-[420px] items-center gap-4 text-base font-medium login-modal-footer-text sm:text-lg">
                    <div className="login-modal-divider h-px flex-1" />
                    <span>or</span>
                    <div className="login-modal-divider h-px flex-1" />
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={handleWhatsAppLogin}
                        disabled={whatsappLoading}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--color-success-strong)] bg-[var(--color-success-strong)] px-4 text-sm font-semibold text-[var(--color-text-card-text)] shadow-[0_1px_2px_rgb(0_0_0_/_10%)] transition hover:bg-[var(--color-success-strong)] hover:shadow-[0_2px_5px_rgb(37_211_102_/_28%)] active:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <WhatsAppIcon size={16} className="shrink-0 opacity-95" />
                        {whatsappLoading ? 'Connecting...' : 'WhatsApp'}
                    </button>
                </div>

                <p className="mx-auto mt-8 max-w-[480px] text-center text-sm font-medium login-modal-footer-text sm:text-base">
                    Don't have an account yet? Click{' '}
                    <button
                        type="button"
                        onClick={() => {
                            onClose?.();
                            onRegisterClick?.();
                        }}
                        className="login-modal-link font-semibold"
                    >
                        here
                    </button>{' '}
                    to register now!
                </p>

                <div className="login-modal-divider mx-auto mt-4 h-px w-full max-w-[520px]" />

                <p className="mx-auto mt-4 max-w-[520px] text-center text-sm font-medium leading-snug login-modal-footer-text sm:text-base">
                    If you encounter any issues while logging in,
                    <br />
                    Please contact our{' '}
                    <button
                        type="button"
                        onClick={onCustomerServiceClick}
                        className="login-modal-link font-semibold"
                    >
                        Customer Service
                    </button>{' '}
                    for further assistance
                </p>
            </section>
        </div>
    );
}
