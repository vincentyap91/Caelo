import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';

function formatPercent(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '0.00';
    return Math.min(100, Math.max(0, n)).toFixed(2);
}

function formatDisplay(value) {
    if (value == null) return 'â€”';
    if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
    return String(value);
}

function ProgressRing({ percent }) {
    const p = Math.min(100, Math.max(0, Number(percent) || 0));
    const size = 88;
    const stroke = 5;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - p / 100);

    return (
        <div className="relative flex h-[88px] w-[88px] shrink-0 items-center justify-center">
            <svg
                width={size}
                height={size}
                className="absolute inset-0 -rotate-90"
                aria-hidden
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="var(--color-border-default)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="var(--color-accent-600)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-500"
                />
            </svg>
            <div className="relative z-[1] text-center leading-none">
                <span className="text-base font-bold tabular-nums text-[var(--color-text-strong)]">
                    {formatPercent(p)}
                </span>
                <span className="text-xs font-bold text-[var(--color-text-muted)]">%</span>
            </div>
        </div>
    );
}

/**
 * Rollover / turnover requirement not met â€” blocks withdraw or similar actions until OK.
 * Shell matches TacErrorModal: overlay, panel radius, shadow, primary OK CTA.
 */
export default function RolloverRequirementModal({
    open,
    onClose,
    titleId = 'rollover-requirement-title',
    mainMessage = 'Rollover requirement is not achieved. Please fulfil all the requirements before proceeding.',
    progressSectionTitle = 'Latest Rollover Progress',
    progressPercent = 0,
    latestTopUpBonus = '0.00',
    latestEventAt = '',
    remainingCurrent = '0.00',
    remainingTarget = '1.00',
    warningMessage = 'Unable to withdraw funds due to incomplete rollover progress.',
}) {
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    const remainingLine = (
        <>
            You have{' '}
            <span className="font-bold text-[var(--color-accent-600)]">
                {formatDisplay(remainingCurrent)} / {formatDisplay(remainingTarget)}
            </span>{' '}
            to go!
        </>
    );

    return (
        <div className="fixed inset-0 z-[280] flex items-center justify-center p-4 sm:p-6">
            <button
                type="button"
                aria-label="Dismiss"
                className="absolute inset-0 bg-[var(--color-nav-overlay)] backdrop-blur-[1px]"
                onClick={onClose}
            />
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-[1] flex max-h-[min(92vh,calc(100vh-2rem))] w-full max-w-[420px] flex-col rounded-2xl border border-[var(--color-border-brand)] bg-white px-6 pb-6 pt-8 shadow-[var(--shadow-modal)] sm:px-8 sm:pb-8 sm:pt-10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-danger-main)_30%,var(--color-border-brand))] bg-[color-mix(in_srgb,var(--color-danger-main)_10%,var(--color-surface-base))] shadow-[var(--shadow-subtle)]">
                            <AlertTriangle
                                className="text-[var(--color-danger-main)]"
                                size={44}
                                strokeWidth={1.7}
                                aria-hidden
                            />
                        </div>
                        <p
                            id={titleId}
                            className="mt-5 max-w-[20rem] text-base font-bold leading-snug text-[var(--color-text-strong)] sm:max-w-[22rem] sm:text-lg"
                        >
                            {mainMessage}
                        </p>
                    </div>

                    <div className="mt-6 text-left">
                        <h2 className="text-sm font-bold text-[var(--color-text-strong)] sm:text-base">
                            {progressSectionTitle}
                        </h2>
                        <div className="surface-card soft-blue-panel mt-3 flex gap-4 rounded-2xl p-4 sm:gap-5 sm:p-5">
                            <ProgressRing percent={progressPercent} />
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 text-sm">
                                <p className="font-bold leading-tight text-[var(--color-text-strong)]">
                                    Latest Top-Up/Bonus :{' '}
                                    <span className="tabular-nums">{formatDisplay(latestTopUpBonus)}</span>
                                </p>
                                {latestEventAt ? (
                                    <p className="text-xs font-medium text-[var(--color-text-soft)] sm:text-sm">
                                        {latestEventAt}
                                    </p>
                                ) : null}
                                <p className="text-sm font-semibold leading-snug text-[var(--color-text-main)]">
                                    {remainingLine}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mt-5 flex gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--color-danger-main)_32%,var(--color-border-brand))] bg-[color-mix(in_srgb,var(--color-danger-main)_8%,var(--color-surface-base))] px-4 py-3.5 shadow-[var(--shadow-subtle)] sm:px-5"
                        role="status"
                    >
                        <AlertCircle
                            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-danger-main)]"
                            strokeWidth={2}
                            aria-hidden
                        />
                        <p className="text-left text-sm font-medium leading-snug text-[var(--color-text-main)]">
                            {warningMessage}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn-theme-cta mt-7 min-w-[160px] shrink-0 self-center rounded-xl px-10 py-3 text-center text-sm font-bold uppercase tracking-wide transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
                >
                    OK
                </button>
            </div>
        </div>
    );
}


