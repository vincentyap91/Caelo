import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable 2FA login modal – enter 6-digit code to complete login.
 * Matches site modal theme (LoginModal gradient, borders, shadows).
 * @param {Function} verifyCode - async (code, trustDevice) => { success, user?, error? }
 * @param {Function} onSuccess - (user) => void, called when verification succeeds
 */
export default function TwoFactorLoginModal({
    open,
    onClose,
    onSuccess,
    title = 'Enter 6-Digit Login Code',
    verifyCode,
}) {
    const [code, setCode] = useState('');
    const [trustDevice, setTrustDevice] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setCode('');
            setTrustDevice(false);
            setError('');
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const digits = text.replace(/\D/g, '').slice(0, 6);
            setCode(digits);
            setError('');
        } catch {
            setError('Could not read clipboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!/^\d{6}$/.test(code)) {
            setError('Please enter a valid 6-digit code');
            return;
        }
        if (!verifyCode) {
            setError('Verification not configured');
            return;
        }
        setLoading(true);
        try {
            const result = await verifyCode(code, trustDevice);
            if (result?.success && result?.user) {
                onSuccess?.(result.user);
                onClose?.();
            } else {
                setError(result?.error || 'Verification failed');
            }
        } catch (err) {
            setError(err?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="login-modal-root fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-overlay-strong)] backdrop-blur-[1px]"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="auth-modal-shell login-modal-panel relative z-[1] w-full max-w-[420px] rounded-2xl px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="login-modal-close absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full transition hover:brightness-95"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <h2 className="auth-modal-register-done__title text-center text-xl font-bold tracking-tight sm:text-2xl">
                    {title}
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="flex gap-2">
                        <label className="auth-modal-field flex-1 rounded-xl">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 123456"
                                className="auth-modal-input text-center text-lg font-mono tracking-code"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={handlePaste}
                            className="auth-modal-btn auth-modal-btn--secondary rounded-xl px-4 py-3 text-sm"
                        >
                            Paste
                        </button>
                    </div>

                    <label className="auth-modal-remember flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={trustDevice}
                            onChange={(e) => setTrustDevice(e.target.checked)}
                            className="auth-modal-checkbox h-4 w-4 rounded border-2 border-[var(--color-success)] text-[var(--color-success)] focus:ring-[var(--color-success)]"
                        />
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Trust this device for future logins
                        </span>
                    </label>

                    {error && (
                        <p className="auth-modal-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-modal-btn auth-modal-btn--primary w-full py-3.5 text-base disabled:opacity-70"
                    >
                        {loading ? 'Verifying...' : 'Confirm'}
                    </button>
                </form>
            </section>
        </div>
    );
}
