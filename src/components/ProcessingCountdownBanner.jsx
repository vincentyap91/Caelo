import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ProcessingCountdownBanner({ secondsLeft, totalSeconds, type }) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const typeLabel = type === 'deposit' ? 'deposit' : 'withdrawal';
    const progressPercent = totalSeconds > 0 ? Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100) : 0;

    return (
        <div className="mb-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2">
                <Loader2 size={18} className="shrink-0 animate-spin text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Processing now
                </span>
            </div>
            <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">
                Please wait <span className="font-bold text-[var(--color-primary)]">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span> for {typeLabel} approval
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border-subtle)]">
                <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
        </div>
    );
}
