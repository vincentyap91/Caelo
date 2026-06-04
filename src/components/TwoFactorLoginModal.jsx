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
        <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-[var(--color-surface-darkest)]/70 backdrop-blur-[1px]"
            />
            <section
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className="relative z-[1] w-full max-w-[420px] rounded-2xl border border-[var(--color-border-brand)] bg-gradient-register-panel px-5 pb-6 pt-8 shadow-[var(--shadow-modal)] sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-accent-hover)] text-[var(--color-text-card-text)] transition hover:brightness-95"
                >
                    <X size={18} strokeWidth={3} />
                </button>

                <h2 className="text-center text-xl font-bold tracking-tight text-[var(--color-text-brand)] sm:text-2xl">
                    {title}
                </h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 123456"
                            className="flex-1 rounded-xl border border-[var(--color-border-accent)] bg-[var(--color-surface-base-80)] px-4 py-3 text-center text-lg font-mono tracking-code text-[var(--color-text-secondary)] shadow-[var(--inset-panel)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[var(--color-accent-400)]/20"
                        />
                        <button
                            type="button"
                            onClick={handlePaste}
                            className="rounded-xl border border-[var(--color-border-accent)] bg-[var(--color-surface-accent-hover)] px-4 py-3 text-sm font-semibold text-[var(--color-text-card-text)] transition hover:brightness-110"
                        >
                            Paste
                        </button>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            checked={trustDevice}
                            onChange={(e) => setTrustDevice(e.target.checked)}
                            className="h-4 w-4 rounded border-2 border-[var(--color-success)] text-[var(--color-success)] focus:ring-[var(--color-success)]"
                        />
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                            Trust this device for future logins
                        </span>
                    </label>

                    {error && (
                        <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-theme-cta w-full rounded-xl py-3.5 text-base font-bold shadow-[var(--shadow-cta)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {loading ? 'Verifying...' : 'Confirm'}
                    </button>
                </form>
            </section>
        </div>
    );
}
