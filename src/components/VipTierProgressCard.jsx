import React from 'react';
import { getVipStatus } from '../constants/vipStatus';
import ProgressBar from './ui/ProgressBar';

export default function VipTierProgressCard({
    currentTier = 'Platinum',
    targetTier = 'Diamond',
    progressPercent = 75,
    className = '',
}) {
    const safeProgress = Math.max(0, Math.min(100, Number(progressPercent) || 0));
    const vip = getVipStatus(currentTier);

    return (
        <div
            className={`vip-tier-progress-card w-full rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-card-light)] px-4 py-3.5 text-[var(--color-text-primary)] shadow-[var(--shadow-card-soft)] ${className}`}
        >
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                    <img src={vip.medal} alt={`${vip.tier} medal`} className="h-12 w-12 shrink-0 object-contain" />
                    <div className="min-w-0">
                        <p className="vip-tier-progress-card__tier text-sm font-extrabold uppercase text-[var(--color-text-primary)]">
                            {currentTier}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-[var(--color-primary)] px-4 py-1.5 text-[11px] font-extrabold uppercase text-[var(--color-tertiery)] shadow-[var(--shadow-subtle)]">
                    TARGET: {targetTier}
                </span>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{safeProgress}%</span>
            </div>

            <ProgressBar percent={safeProgress} variant="profile-vip" className="mt-3 h-3" />

            <p className="vip-tier-progress-card__caption mt-3 text-center text-sm font-medium text-[var(--color-text-small)]">
                Progress to next tier: {safeProgress}%
            </p>
        </div>
    );
}
