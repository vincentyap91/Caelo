import React, { useEffect, useState } from 'react';
import {
    ChevronDown,
    Clock,
    Coins,
    History,
    Lock,
    Trophy,
    Wallet,
} from 'lucide-react';
import RewardsActivityRecordModal from './RewardsActivityRecordModal';
import { REWARDS_ACTIVITY_RECORD_TYPES, REWARDS_PROGRAM_IDS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';

/** Demo main wallet balance (Spin / Voucher / Prize rewards area — hidden on Daily Bonus) */
const REWARDS_WALLET_BALANCE = '201.00';

const REWARDS_RECORD_COLUMNS = [
    { key: 'time', label: 'Time', align: 'left' },
    { key: 'type', label: 'Type', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
];

const ACTIVITY_PROGRAM_IDS = new Set(REWARDS_ACTIVITY_RECORD_TYPES.map((p) => p.id));

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

function RewardsWalletBar({ balance, onRecordClick }) {
    return (
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)] shadow-[var(--shadow-cta-soft)] ring-1 ring-[var(--color-cta-border)]/60">
                    <Wallet className="h-6 w-6" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-main)]">Wallet Balance:</p>
                    <p className="mt-0.5 text-xl font-bold leading-tight text-[var(--color-accent-600)] md:text-2xl tabular-nums">{balance}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onRecordClick}
                className="btn-theme-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:min-w-[148px]"
            >
                <History size={18} strokeWidth={2.5} className="shrink-0 text-white" aria-hidden />
                Record
            </button>
        </div>
    );
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

export default function RewardsSection({ embedInPage = false }) {
    const activeProgram = useRewardsProgramFromHash();
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    const [recordActivityType, setRecordActivityType] = useState('spin-wheel');

    const setProgramHash = (id) => {
        if (typeof window === 'undefined') return;
        window.location.hash = id;
    };

    useEffect(() => {
        if (activeProgram === 'daily-bonus') {
            setRecordModalOpen(false);
        }
    }, [activeProgram]);

    useEffect(() => {
        if (recordModalOpen && ACTIVITY_PROGRAM_IDS.has(activeProgram)) {
            setRecordActivityType(activeProgram);
        }
    }, [recordModalOpen, activeProgram]);

    const openRecordModal = () => {
        if (ACTIVITY_PROGRAM_IDS.has(activeProgram)) {
            setRecordActivityType(activeProgram);
        } else {
            setRecordActivityType('spin-wheel');
        }
        setRecordModalOpen(true);
    };

    const showWalletBar = activeProgram !== 'daily-bonus';

    const recordTypeLabel = REWARDS_ACTIVITY_RECORD_TYPES.find((t) => t.id === recordActivityType)?.label ?? '';

    const recordTypeFilterSlot = (
        <label className="block w-full">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text-strong)]">Type</span>
            <div className="relative">
                <select
                    value={recordActivityType}
                    onChange={(e) => setRecordActivityType(e.target.value)}
                    aria-label="Record type"
                    className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none transition focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                >
                    {REWARDS_ACTIVITY_RECORD_TYPES.map(({ id, label }) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-600)]"
                    aria-hidden
                />
            </div>
        </label>
    );

    return (
        <>
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

            {showWalletBar && (
                <div className={`${embedInPage ? 'mt-0' : 'mt-6'} mb-6`}>
                    <RewardsWalletBar balance={REWARDS_WALLET_BALANCE} onRecordClick={openRecordModal} />
                </div>
            )}

            <div className="space-y-6">
                {activeProgram === 'daily-bonus' && <DailyBonusPanel />}
                {activeProgram === 'spin-wheel' && <SpinWheelPanel />}
                {activeProgram === 'voucher-scratch' && <VoucherScratchPanel />}
                {activeProgram === 'prize-box' && <PrizeBoxPanel />}
            </div>
        </section>

        <RewardsActivityRecordModal
            open={recordModalOpen}
            onClose={() => setRecordModalOpen(false)}
            filterSlot={recordTypeFilterSlot}
            columns={REWARDS_RECORD_COLUMNS}
            recordContextKey={recordActivityType}
            tableEmptyMessage={recordTypeLabel ? `No data found for ${recordTypeLabel}` : 'No data found'}
        />
        </>
    );
}
