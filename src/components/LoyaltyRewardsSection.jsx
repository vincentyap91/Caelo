import React, { useEffect, useState } from 'react';
import {
    Calendar,
    Clock,
    Coins,
    Lock,
    Trophy,
    Wallet,
} from 'lucide-react';
import SecurityTabs from './security/SecurityTabs';
import { REWARDS_PROGRAM_IDS, REWARDS_PROGRAMS, REWARDS_SUB_TABS } from '../constants/rewardsPrograms';

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const REWARDS_HISTORY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: '3days', label: 'In 3 days' },
    { id: 'week', label: 'In a week' },
    { id: 'month', label: 'In a month' },
];

/** Demo reward history rows (replace with API). Dates: DD-MM-YYYY HH:mm:ss per product spec */
const MOCK_REWARDS_HISTORY_ROWS = [
    { id: '4548', campaign: 'Test1', createdAt: '09-02-2026 12:44:11', status: 'Expired', claimedAt: null, reward: null },
    { id: '4547', campaign: 'Test1', createdAt: '09-02-2026 12:44:11', status: 'Expired', claimedAt: null, reward: null },
    { id: '4481', campaign: 'Test1', createdAt: '04-02-2026 14:59:48', status: 'Expired', claimedAt: null, reward: null },
    { id: '4480', campaign: 'Test1', createdAt: '04-02-2026 14:59:48', status: 'Expired', claimedAt: null, reward: null },
];

/** Demo main wallet balance shown on every Rewards programme */
const REWARDS_WALLET_BALANCE = '200.00';

const DAILY_CHECKIN_DAYS = [
    { id: 'mon', label: 'Mon', reward: 'MYR 5', status: 'locked' },
    { id: 'tue', label: 'Tue', reward: 'MYR 5', status: 'claimable' },
    { id: 'wed', label: 'Wed', reward: 'MYR 10', status: 'locked' },
    { id: 'thu', label: 'Thu', reward: 'MYR 15', status: 'locked' },
    { id: 'fri', label: 'Fri', reward: 'MYR 5', status: 'locked' },
    { id: 'sat', label: 'Sat', reward: 'MYR 20', status: 'locked' },
    { id: 'sun', label: 'Sun', reward: 'MYR 25', status: 'locked' },
];

const VOUCHERS = [
    { id: 'v1', title: 'Scratch RM 5', value: '5' },
    { id: 'v2', title: 'Scratch RM 28', value: '28' },
    { id: 'v3', title: 'Scratch RM 150', value: '150' },
];

const SPIN_OFFERS = [
    { id: 'sp1', title: 'Daily free spin', value: '5', blurb: '1 free spin per day · MYR credits to wallet' },
    { id: 'sp2', title: 'Lucky wheel', value: '88', blurb: 'Boosted segments during live promos' },
    { id: 'sp3', title: 'Mega spin', value: '500', blurb: 'VIP eligible · rollover may apply' },
];

const PRIZE_ITEMS = [
    {
        id: '4551',
        campaign: 'VW Shiro Test',
        expires: 'No Expiry',
        available: false,
        amount: '50',
    },
    {
        id: '4552',
        campaign: 'Weekend Boost',
        expires: 'Expires in 3d',
        available: false,
        amount: '120',
    },
];

function parseRewardsProgramFromLocation() {
    if (typeof window === 'undefined') return 'daily-bonus';
    if (window.location.pathname !== '/loyalty-rewards') return 'daily-bonus';
    const h = window.location.hash.slice(1);
    return REWARDS_PROGRAM_IDS.includes(h) ? h : 'daily-bonus';
}

function useRewardsProgramFromHash() {
    const [program, setProgram] = useState(parseRewardsProgramFromLocation);
    useEffect(() => {
        const sync = () => setProgram(parseRewardsProgramFromLocation());
        window.addEventListener('hashchange', sync);
        window.addEventListener('popstate', sync);
        return () => {
            window.removeEventListener('hashchange', sync);
            window.removeEventListener('popstate', sync);
        };
    }, []);
    return program;
}

function TermsBlock({ title, subtitle, children }) {
    return (
        <div className="mt-8 border-t border-[var(--color-border-default)] pt-6">
            <h3 className="text-base font-bold text-[var(--color-text-strong)]">{title}</h3>
            {subtitle && (
                <p className="mt-1 text-sm font-semibold text-[var(--color-accent-700)] underline decoration-[var(--color-accent-200)] underline-offset-2">
                    {subtitle}
                </p>
            )}
            <div className="mt-4 text-xs leading-relaxed text-[var(--color-text-muted)]">{children}</div>
        </div>
    );
}

/** Shared “scratch voucher” visual: neon gradient hero, scan lines, corner badge, footer CTA */
function ScratchStyleRewardCard({
    badge,
    heroCenter,
    metaTopLeft,
    metaTopRight,
    title,
    description,
    ctaLabel,
    ctaDisabled = false,
}) {
    return (
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] shadow-sm transition hover:border-[var(--color-accent-200)]">
            <div className="relative aspect-[16/10] bg-[linear-gradient(145deg,rgb(15_23_42)_0%,rgb(30_58_138)_50%,rgb(59_130_246)_100%)]">
                {metaTopLeft ? (
                    <div className="absolute left-2 top-2 z-10 max-w-[58%]">{metaTopLeft}</div>
                ) : null}
                {metaTopRight ? (
                    <div className="absolute right-2 top-2 z-10 max-w-[58%] text-right">{metaTopRight}</div>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">{heroCenter}</div>
                <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgb(255_255_255_/_0.06)_2px,rgb(255_255_255_/_0.06)_4px)] opacity-80" />
                <span className="absolute bottom-2 left-2 z-10 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {badge}
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="font-bold text-[var(--color-text-strong)]">{title}</p>
                {description ? (
                    <p className="text-xs font-medium text-[var(--color-text-muted)]">{description}</p>
                ) : null}
                <button
                    type="button"
                    disabled={ctaDisabled}
                    className="mt-auto w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-2.5 text-sm font-bold text-[var(--color-text-strong)] transition hover:bg-[var(--color-accent-50)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}

function RewardsWalletBar({ balance }) {
    return (
        <div className="surface-card flex flex-wrap items-center gap-4 rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <div className="flex min-w-0 items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgb(250_204_21)_0%,rgb(234_179_8)_100%)] text-amber-950 shadow-sm">
                    <Wallet className="h-6 w-6" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">Wallet balance</p>
                    <p className="mt-1 text-xl font-bold text-[var(--color-accent-600)] md:text-2xl">{balance} MYR</p>
                </div>
            </div>
        </div>
    );
}

function RewardsHistoryPanel() {
    const today = new Date();
    const [historyStart, setHistoryStart] = useState(() => formatDateForInput(today));
    const [historyEnd, setHistoryEnd] = useState(() => formatDateForInput(new Date(today.getTime() + 86400000)));
    const [historyQuickRange, setHistoryQuickRange] = useState('today');

    const setHistoryRangeFromQuick = (id) => {
        setHistoryQuickRange(id);
        const end = new Date();
        let start = new Date();
        if (id === 'today') {
            start = new Date(end);
        } else if (id === '3days') {
            start.setDate(start.getDate() - 2);
        } else if (id === 'week') {
            start.setDate(start.getDate() - 6);
        } else if (id === 'month') {
            start.setDate(start.getDate() - 29);
        }
        setHistoryStart(formatDateForInput(start));
        setHistoryEnd(formatDateForInput(end));
    };

    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--color-text-strong)]">Start date</span>
                        <div className="relative flex items-center">
                            <input
                                type="date"
                                value={historyStart}
                                onChange={(e) => setHistoryStart(e.target.value)}
                                className="date-input-single-icon h-11 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                            />
                            <Calendar size={18} className="pointer-events-none absolute right-3 text-[var(--color-accent-600)]" />
                        </div>
                    </label>
                    <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-[var(--color-text-strong)]">End date</span>
                        <div className="relative flex items-center">
                            <input
                                type="date"
                                value={historyEnd}
                                onChange={(e) => setHistoryEnd(e.target.value)}
                                className="date-input-single-icon h-11 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                            />
                            <Calendar size={18} className="pointer-events-none absolute right-3 text-[var(--color-accent-600)]" />
                        </div>
                    </label>
                </div>
                <div className="mt-4 flex gap-2">
                    {REWARDS_HISTORY_QUICK_RANGES.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setHistoryRangeFromQuick(id)}
                            className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                                historyQuickRange === id
                                    ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)]'
                                    : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="mt-4">
                    <button
                        type="button"
                        className="btn-theme-cta inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02]"
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-sm">
                        <thead>
                            <tr className="divide-x divide-[var(--color-border-default)] border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    ID
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    Campaign
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    Created Date
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    Status
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    Claimed Date
                                </th>
                                <th className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-text-strong)] sm:px-4">
                                    Reward
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_REWARDS_HISTORY_ROWS.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                MOCK_REWARDS_HISTORY_ROWS.map((row) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                    >
                                        <td className="px-3 py-3.5 text-center font-medium tabular-nums text-[var(--color-text-strong)] sm:px-4">
                                            {row.id}
                                        </td>
                                        <td className="px-3 py-3.5 text-center font-medium text-[var(--color-text-strong)] sm:px-4">
                                            {row.campaign}
                                        </td>
                                        <td className="px-3 py-3.5 text-center text-[var(--color-text-muted)] sm:px-4">
                                            {row.createdAt}
                                        </td>
                                        <td
                                            className={`px-3 py-3.5 text-center font-semibold sm:px-4 ${
                                                row.status === 'Expired'
                                                    ? 'text-[var(--color-danger-main)]'
                                                    : 'text-[var(--color-text-strong)]'
                                            }`}
                                        >
                                            {row.status}
                                        </td>
                                        <td className="px-3 py-3.5 text-center text-[var(--color-text-muted)] sm:px-4">
                                            {row.claimedAt ?? '-'}
                                        </td>
                                        <td className="px-3 py-3.5 text-center text-[var(--color-text-muted)] sm:px-4">
                                            {row.reward ?? '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function BenefitsList({ title, items }) {
    return (
        <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <h3 className="text-base font-bold text-[var(--color-text-strong)]">{title}</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
                {items.map((t) => (
                    <li key={t}>{t}</li>
                ))}
            </ul>
        </div>
    );
}

function RewardsBenefitsPanel({ programId }) {
    const byProgram = {
        'daily-bonus': {
            title: 'Daily Bonus benefits',
            items: [
                'Stack consecutive check-ins for bigger MYR rewards on peak days.',
                'All displayed values credit to your main wallet when claimed.',
                'Promotional top-ups may run during holidays — watch announcements.',
            ],
        },
        'spin-wheel': {
            title: 'Spin Wheel benefits',
            items: [
                'Daily free spin with MYR outcomes.',
                'Instant visibility of what you can claim to wallet.',
                'Limited-time multipliers during campaigns.',
            ],
        },
        'voucher-scratch': {
            title: 'Voucher Scratch benefits',
            items: [
                'Multiple scratch themes with clear MYR face values.',
                'Wallet credit after successful claim.',
                'Stack with other Rewards programmes where allowed.',
            ],
        },
        'prize-box': {
            title: 'Prize Box benefits',
            items: [
                'Campaign tokens with clear MYR value and wallet credit path.',
                'Record export for your account statements.',
                'Combine with Daily Bonus and Spin wins where eligible.',
            ],
        },
    };
    const { title, items } = byProgram[programId] ?? byProgram['daily-bonus'];
    return <BenefitsList title={title} items={items} />;
}

function DailyBonusPanel() {
    const [days, setDays] = useState(DAILY_CHECKIN_DAYS);
    const streakDays = 0;

    const handleClaimDay = (id) => {
        setDays((prev) =>
            prev.map((d) => (d.id === id && d.status === 'claimable' ? { ...d, status: 'claimed' } : d))
        );
    };

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border-accent)] bg-[linear-gradient(135deg,var(--color-accent-50)_0%,rgb(219_234_254)_45%,var(--color-surface-base)_100%)] shadow-[var(--shadow-subtle)]">
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-[var(--color-text-strong)]">Daily Check In</h3>
                                <p className="mt-2 text-sm text-[var(--color-text-main)]">
                                    You have accumulated{' '}
                                    <span className="font-bold text-amber-600">Day {streakDays}</span> check-in
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--color-border-accent)] bg-[var(--color-surface-base)]/80 px-5 py-5 sm:px-6">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,rgb(250_204_21)_0%,rgb(234_179_8)_100%)] shadow-md">
                                <Trophy className="h-10 w-10 text-amber-950/90" strokeWidth={1.5} />
                            </div>
                            <p className="min-w-0 flex-1 text-sm font-medium text-[var(--color-text-muted)]">
                                Claim MYR rewards each day. Some days may require minimum valid turnover on your main wallet.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
                        <div className="flex min-w-0 gap-2 sm:grid sm:grid-cols-7 sm:gap-3">
                            {days.map((d) => (
                                <div
                                    key={d.id}
                                    className="flex w-[104px] shrink-0 flex-col rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-3 shadow-sm sm:w-auto sm:min-w-0"
                                >
                                    <p className="text-center text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
                                        {d.label}
                                    </p>
                                    <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-1">
                                        <Coins className="h-6 w-6 text-amber-600" />
                                        <p className="text-center text-[11px] font-bold leading-tight text-[var(--color-text-strong)] sm:text-xs">
                                            {d.reward}
                                        </p>
                                    </div>
                                    <div className="mt-3">
                                        {d.status === 'claimable' && (
                                            <button
                                                type="button"
                                                onClick={() => handleClaimDay(d.id)}
                                                className="btn-theme-primary w-full rounded-lg py-2 text-xs font-bold"
                                            >
                                                Claim
                                            </button>
                                        )}
                                        {d.status === 'locked' && (
                                            <div className="flex items-center justify-center gap-1 rounded-lg bg-[var(--color-surface-muted)] py-2 text-[var(--color-text-soft)]">
                                                <Lock size={14} />
                                                <span className="text-[10px] font-semibold uppercase">Locked</span>
                                            </div>
                                        )}
                                        {d.status === 'claimed' && (
                                            <p className="rounded-lg bg-[var(--color-accent-50)] py-2 text-center text-[10px] font-bold text-[var(--color-accent-800)]">
                                                Claimed
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

            <TermsBlock title="Terms & Condition" subtitle="Daily Check-In T&C">
                <ol className="list-decimal space-y-2 pl-4">
                    <li>Daily rewards are paid in MYR to your main wallet after you claim.</li>
                    <li>Selected days may require minimum valid turnover before the reward unlocks.</li>
                    <li>Only bets from your main wallet count toward turnover unless stated otherwise.</li>
                    <li>Unclaimed rewards may expire per campaign rules.</li>
                    <li>Claimed amounts may carry a one-time rollover before withdrawal.</li>
                </ol>
            </TermsBlock>
        </div>
    );
}

function SpinWheelPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Spin offers</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Same scratch-card look — spin for random MYR; prizes credit to your wallet after claim.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SPIN_OFFERS.map((s) => (
                        <ScratchStyleRewardCard
                            key={s.id}
                            badge="Spin"
                            heroCenter={
                                <span className="text-4xl font-black text-white/90 drop-shadow-lg">
                                    RM {s.value}
                                </span>
                            }
                            title={s.title}
                            description={s.blurb}
                            ctaLabel="Spin now"
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Spin Wheel T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Spins are tied to your verified account.</li>
                    <li>MYR prizes must be claimed to your main wallet from this area.</li>
                    <li>Bonus winnings may require rollover before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

function VoucherScratchPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Scratch &amp; redeem</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Reveal vouchers — MYR credit applies to your main wallet when you complete redemption.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VOUCHERS.map((v) => (
                        <ScratchStyleRewardCard
                            key={v.id}
                            badge="Scratch"
                            heroCenter={
                                <span className="text-4xl font-black text-white/90 drop-shadow-lg">
                                    RM {v.value}
                                </span>
                            }
                            title={v.title}
                            description={`Win up to MYR ${v.value} · Credit to wallet after claim`}
                            ctaLabel="Scratch & claim"
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Voucher &amp; scratch T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Scratch outcomes pay MYR to your main wallet when claimed.</li>
                    <li>Redemptions are final once confirmed.</li>
                    <li>Rollover may apply before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

function PrizeBoxPanel() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-strong)]">Your rewards</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Campaign items appear here when available for claim.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PRIZE_ITEMS.map((item) => (
                        <ScratchStyleRewardCard
                            key={item.id}
                            badge="Prize"
                            metaTopLeft={
                                <span className="rounded-md bg-black/45 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                                    Reward #{item.id}
                                </span>
                            }
                            metaTopRight={
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                    <Clock size={11} className="shrink-0 opacity-90" />
                                    {item.expires}
                                </span>
                            }
                            heroCenter={
                                <span className="text-4xl font-black text-white/90 drop-shadow-lg">
                                    RM {item.amount}
                                </span>
                            }
                            title={item.campaign}
                            description="Campaign reward · MYR credits main wallet when claimed"
                            ctaLabel={item.available ? 'Claim to wallet' : 'Unavailable'}
                            ctaDisabled={!item.available}
                        />
                    ))}
                </div>
            </div>

            <TermsBlock title="Terms & Condition" subtitle="Prize Box T&C">
                <ul className="list-disc space-y-2 pl-4">
                    <li>Rewards follow campaign rules; MYR credits the main wallet when claimed.</li>
                    <li>Expiry dates apply per item.</li>
                    <li>Rollover may apply before withdrawal.</li>
                </ul>
            </TermsBlock>
        </div>
    );
}

export default function LoyaltyRewardsSection({ embedInPage = false }) {
    const activeProgram = useRewardsProgramFromHash();
    const [rewardsViewTab, setRewardsViewTab] = useState('unclaimed');

    const setProgramHash = (id) => {
        if (typeof window === 'undefined') return;
        window.location.hash = id;
    };

    return (
        <section id="loyalty-rewards" className="surface-card rounded-2xl p-6 transition-all md:p-8">
            {!embedInPage && (
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                            <Trophy size={22} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-strong)] md:text-xl">
                                Rewards
                            </h2>
                            <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                                Check in, spin, scratch, and open prizes — claim MYR to your wallet.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {embedInPage && (
                <div
                    className="mb-6 flex flex-wrap gap-2 lg:hidden"
                    role="tablist"
                    aria-label="Rewards programmes"
                >
                    {REWARDS_PROGRAMS.map(({ id, label }) => {
                        const selected = activeProgram === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => setProgramHash(id)}
                                className={`min-h-[44px] rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                                    selected
                                        ? 'border-[var(--color-accent-300)] bg-[var(--color-accent-50)] text-[var(--color-accent-800)] shadow-sm ring-1 ring-[var(--color-accent-100)]'
                                        : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:text-[var(--color-text-strong)]'
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className={`${embedInPage ? 'mt-0' : 'mt-6'} mb-6`}>
                <RewardsWalletBar balance={REWARDS_WALLET_BALANCE} />
            </div>

            <div className="mb-8">
                <SecurityTabs activeTab={rewardsViewTab} onTabChange={setRewardsViewTab} tabs={REWARDS_SUB_TABS} />
            </div>

            <div className="space-y-6" role="tabpanel">
                {rewardsViewTab === 'history' && <RewardsHistoryPanel />}
                {rewardsViewTab === 'benefits' && <RewardsBenefitsPanel programId={activeProgram} />}
                {rewardsViewTab === 'unclaimed' && (
                    <>
                        {activeProgram === 'daily-bonus' && <DailyBonusPanel />}
                        {activeProgram === 'spin-wheel' && <SpinWheelPanel />}
                        {activeProgram === 'voucher-scratch' && <VoucherScratchPanel />}
                        {activeProgram === 'prize-box' && <PrizeBoxPanel />}
                    </>
                )}
            </div>
        </section>
    );
}
