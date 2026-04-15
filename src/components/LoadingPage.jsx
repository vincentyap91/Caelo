import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { NAV_STICKY_SUBHEADER_TOP_CLASS } from '../constants/navStickyOffsets';

/**
 * General loading page – shows when content loads slowly.
 * Uses minDelay to avoid flashing on fast loads (only appears if loading exceeds minDelay).
 * Keeps UI consistent with app theme.
 *
 * @param {string} message - Loading message
 * @param {boolean|'overlay'} fullPage - true: card-style block; 'overlay': full viewport overlay; false: inline
 * @param {number} minDelay - ms before showing (avoids flash on fast loads)
 */
export default function LoadingPage({ message = 'Loading...', fullPage = true, minDelay = 200 }) {
    const [show, setShow] = useState(minDelay <= 0);

    useEffect(() => {
        if (minDelay <= 0) return undefined;
        const t = setTimeout(() => setShow(true), minDelay);
        return () => clearTimeout(t);
    }, [minDelay]);

    if (!show) return null;

    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-50)] text-[var(--color-brand-primary)]">
                <Loader2 size={32} className="animate-spin" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">{message}</p>
        </div>
    );

    if (fullPage === 'overlay') {
        return (
            <div
                className={`fixed left-0 right-0 bottom-0 z-[100] flex items-center justify-center bg-[var(--color-surface-base)]/90 backdrop-blur-sm ${NAV_STICKY_SUBHEADER_TOP_CLASS}`}
                role="status"
                aria-live="polite"
                aria-label={message}
            >
                <div className="surface-card flex min-h-[200px] min-w-[200px] items-center justify-center rounded-2xl border border-[var(--color-border-default)] p-8 shadow-[var(--shadow-card-soft)]">
                    {content}
                </div>
            </div>
        );
    }

    if (fullPage) {
        return (
            <div
                className="flex min-h-[min(400px,50vh)] w-full items-center justify-center rounded-2xl border border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--gradient-account-shell-start)_0%,var(--gradient-account-shell-mid)_38%,var(--gradient-account-shell-end)_100%)] p-8 shadow-[var(--shadow-card-soft)]"
                role="status"
                aria-live="polite"
                aria-label={message}
            >
                {content}
            </div>
        );
    }

    return (
        <div
            className="flex min-h-[120px] w-full items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] p-6"
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            {content}
        </div>
    );
}
