import React from 'react';
import SectionHeader from '../SectionHeader';
import { Clock, Trophy } from 'lucide-react';
import { HOME_LIVE_BIG_WINS_FEED_HEIGHT_CLASS, MOCK_RECENT_BIG_WINS, maskUsername } from '../../constants/homeLiveActivity';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

function WinRow({ item }) {
    const badge = item.badge || item.provider;

    return (
        <li className="py-4 first:pt-0 md:py-[18px]">
            <div className="flex gap-3 md:gap-4">
                <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] ring-1 ring-[var(--color-border-accent)] md:h-[5rem] md:w-[5rem]">
                    <img src={item.imgUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex flex-1 flex-col">
                    <span className="inline-flex w-fit max-w-full rounded-md bg-[var(--color-surface-muted)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--color-text-subtle)] ring-1 ring-[var(--color-border-default)]/80">
                        {badge}
                    </span>
                    <p className="mt-2 line-clamp-2 text-sm font-extrabold leading-snug text-[var(--color-text-strong)] md:text-[15px]">
                        {item.game}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">{maskUsername(item.user)}</p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                        <span className="text-lg font-black tabular-nums tracking-tight text-[var(--color-brand-secondary)] md:text-xl">
                            {item.amount}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-brand-secondary)]">
                            <Clock size={12} className="shrink-0 opacity-80" aria-hidden />
                            {item.timeAgo}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
}

function WinsTrack({ items }) {
    return (
        <ul className="m-0 list-none divide-y divide-[var(--color-border-default)]/90 p-0">
            {items.map((item) => (
                <WinRow key={item.id} item={item} />
            ))}
        </ul>
    );
}

/**
 * Homepage: flat recent wins list (no inner cards); optional infinite vertical scroll.
 */
export default function RecentBigWinsSection() {
    const items = MOCK_RECENT_BIG_WINS;
    const reducedMotion = usePrefersReducedMotion();

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-col lg:h-full lg:min-h-0">
            <div className="shrink-0">
                <SectionHeader
                    title="Recent Big Wins"
                    icon={<Trophy size={22} className="text-[var(--color-nav-gold)]" fill="currentColor" strokeWidth={1.75} />}
                />
                <p className="-mt-1 mb-4 text-xs font-medium text-[var(--color-text-muted)] md:text-sm">
                    Latest player jackpot moments
                </p>
            </div>

            <div className={`home-marquee-pausable shrink-0 overflow-hidden ${HOME_LIVE_BIG_WINS_FEED_HEIGHT_CLASS}`}>
                {reducedMotion ? (
                    <div className="h-full min-h-0 overflow-y-auto overscroll-contain pr-0.5">
                        <WinsTrack items={items} />
                    </div>
                ) : (
                    <div className="animate-home-marquee-vertical-y will-change-transform">
                        <WinsTrack items={items} />
                        <div aria-hidden>
                            <WinsTrack items={items.map((i) => ({ ...i, id: `${i.id}__dup` }))} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
