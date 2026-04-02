import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check } from 'lucide-react';

const DEFAULT_REDIRECT_SECONDS = 7;

/**
 * Post-verification success overlay: icon, title, message, primary CTA, auto-redirect countdown.
 * Reusable for registration or other flows that need the same pattern.
 *
 * @param {object} props
 * @param {() => void} props.onComplete - Called when user clicks the button or countdown ends (call login + navigate from parent).
 * @param {number} [props.redirectSeconds]
 * @param {string} [props.title]
 * @param {string} [props.message] - Single paragraph; use {'\n'} or split in parent if needed
 * @param {string} [props.primaryButtonLabel]
 */
export default function RegistrationCompletedModal({
    onComplete,
    redirectSeconds = DEFAULT_REDIRECT_SECONDS,
    title = 'Registration Completed!',
    message = 'Thank you for registering.\nYour account has been successfully created',
    primaryButtonLabel = 'Go to Home Page',
}) {
    const [secondsLeft, setSecondsLeft] = useState(redirectSeconds);
    const finishedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const finish = useCallback(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        onCompleteRef.current?.();
    }, []);

    useEffect(() => {
        const id = window.setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    window.clearInterval(id);
                    finish();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => window.clearInterval(id);
    }, [finish]);

    const messageLines = message.split('\n').filter(Boolean);

    const node = (
        <div className="fixed inset-0 z-[290] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[var(--color-nav-overlay)] backdrop-blur-[1px]" aria-hidden />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="registration-success-title"
                className="relative z-[1] mt-9 w-full max-w-[400px] rounded-2xl border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-6 pb-8 pt-[3.25rem] shadow-[var(--shadow-modal)] sm:mt-10 sm:max-w-[420px] sm:px-8 sm:pb-9 sm:pt-14"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <div
                        className="pointer-events-none flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border-2 border-[var(--color-border-brand)] bg-[var(--color-surface-base)] shadow-[var(--shadow-brand-card)] sm:h-16 sm:w-16"
                        aria-hidden
                    >
                        <div className="flex h-[2.85rem] w-[2.85rem] items-center justify-center rounded-full bg-[linear-gradient(180deg,rgb(240_253_245)_0%,rgb(220_252_231)_100%)] shadow-[var(--inset-panel)] ring-1 ring-[var(--color-success-main)]/20 sm:h-[3.25rem] sm:w-[3.25rem]">
                            <Check
                                className="text-[var(--color-success-main)]"
                                strokeWidth={2.5}
                                size={26}
                                aria-hidden
                            />
                        </div>
                    </div>
                </div>

                <h2
                    id="registration-success-title"
                    className="text-center text-xl font-bold tracking-tight text-[rgb(18_63_128)] sm:text-2xl"
                >
                    {title}
                </h2>

                <div className="mt-4 space-y-1.5 text-center sm:mt-5">
                    {messageLines.map((line) => (
                        <p
                            key={line}
                            className="text-sm font-medium leading-relaxed text-[rgb(35_64_106)] sm:text-base"
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={finish}
                    className="btn-theme-cta mt-8 w-full rounded-xl py-3.5 text-center text-base font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:mt-9 sm:py-4"
                >
                    {primaryButtonLabel}
                </button>

                <p className="mt-5 text-center text-xs font-medium leading-relaxed text-[var(--color-text-soft)] sm:mt-6 sm:text-sm">
                    You will be automatically redirected in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}.
                </p>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(node, document.body);
}

export { DEFAULT_REDIRECT_SECONDS };


