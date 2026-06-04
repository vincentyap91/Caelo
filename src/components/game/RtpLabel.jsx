import React from 'react';
import RtpTrendArrow from './RtpTrendArrow';

export const RTP_HIGH_THRESHOLD = 96.5;

export default function RtpLabel({ value, className = '', variant = 'pill', compact = false }) {
    if (typeof value !== 'number') {
        return null;
    }

    const highRtp = value >= RTP_HIGH_THRESHOLD;
    const direction = highRtp ? 'up' : 'down';

    if (variant === 'footer') {
        return (
            <span
                className={`inline-flex items-center justify-center gap-1 text-xs font-medium leading-tight text-[var(--color-nav-text-soft)] ${className}`.trim()}
            >
                <span className="font-normal text-[var(--color-text-card-text)]/75">RTP:</span>
                <span className="text-[var(--color-text-card-text)]">{value.toFixed(2)}%</span>
                <RtpTrendArrow direction={direction} size={compact ? 12 : 13} />
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-50)] px-2.5 py-1 text-[11px] font-bold leading-none text-[var(--color-accent-700)] ${className}`.trim()}
        >
            RTP {value.toFixed(2)}%
            <RtpTrendArrow direction={direction} size={13} />
        </span>
    );
}
