import React, { useEffect, useRef, useState } from 'react';
import {
    ChevronDown,
    Clock,
    History,
    Trophy,
    Wallet,
} from 'lucide-react';
import DailyBonusClaimModal from './DailyBonusClaimModal';
import RewardsActivityRecordModal from './RewardsActivityRecordModal';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';
import { filterPillClassName } from './ui/filterPillClasses';
import { DAILY_CHECKIN_CYCLE_DAYS } from '../constants/dailyCheckIn';
import { REWARDS_ACTIVITY_RECORD_TYPES, REWARDS_PROGRAM_IDS, REWARDS_PROGRAMS } from '../constants/rewardsPrograms';

/** Demo main wallet balance (Spin / Voucher / Prize rewards area — hidden on Daily Bonus) */
const REWARDS_WALLET_BALANCE = '201.00';

const REWARDS_RECORD_COLUMNS = [
    { key: 'time', label: 'Time', align: 'left' },
    { key: 'type', label: 'Type', align: 'left' },
    { key: 'amount', label: 'Amount', align: 'right' },
];

const ACTIVITY_PROGRAM_IDS = new Set(REWARDS_ACTIVITY_RECORD_TYPES.map((p) => p.id));

const VOUCHERS = [
    { id: 'v1', title: 'Scratch RM 5', value: '5' },
    { id: 'v2', title: 'Scratch RM 28', value: '28' },
    { id: 'v3', title: 'Scratch RM 150', value: '150' },
];

const SPIN_OFFERS = [
    { id: 'sp1', title: 'Daily free spin', value: '5', blurb: '1 free spin per day \u00B7 MYR credits to wallet' },
    { id: 'sp2', title: 'Lucky wheel', value: '88', blurb: 'Boosted segments during live promos' },
    { id: 'sp3', title: 'Mega spin', value: '500', blurb: 'VIP eligible \u00B7 rollover may apply' },
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
        <div className="mt-8 border-t border-[var(--color-border-subtle)] pt-6">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h3>
            {subtitle && (
                <p className="mt-1 text-sm font-semibold text-[var(--color-button-hover)] underline decoration-[var(--color-accent-glow)] underline-offset-2">
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
    onCtaClick,
    variant = 'default',
}) {
    const isSpinWheel = variant === 'spin-wheel';

    const shellClass = isSpinWheel
        ? 'spin-wheel-card flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-accent)] shadow-sm transition hover:border-[var(--color-accent-glow)]'
        : 'flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-cool-light)] shadow-sm transition hover:border-[var(--color-accent-glow)]';

    const heroClass = isSpinWheel
        ? 'spin-wheel-card-hero relative aspect-[16/10] bg-gradient-rewards-scratch'
        : 'relative aspect-[16/10] bg-gradient-rewards-scratch';

    const badgeClass = isSpinWheel
        ? 'absolute bottom-2 left-2 z-10 rounded bg-[var(--color-surface-card-dark)]/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--color-text-light)]'
        : 'absolute bottom-2 left-2 z-10 rounded bg-[var(--color-surface-darkest)]/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[var(--color-text-card-text)]';

    const titleClass = isSpinWheel
        ? 'spin-wheel-card-title font-bold text-[var(--color-primary)]'
        : 'font-bold text-[var(--color-text-primary)]';

    const descriptionClass = isSpinWheel
        ? 'spin-wheel-card-description text-xs font-medium text-[var(--color-text-primary)]'
        : 'text-xs font-medium text-[var(--color-text-muted)]';

    const ctaClass = isSpinWheel
        ? 'spin-wheel-card-cta mt-auto w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-button-cta)] py-2.5 text-sm font-bold text-[var(--color-button-cta-primary)] transition hover:bg-[var(--color-accent-pale)] disabled:cursor-not-allowed disabled:opacity-60'
        : 'mt-auto w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-2.5 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-[var(--color-accent-pale)] disabled:cursor-not-allowed disabled:opacity-60';

    return (
        <div className={shellClass}>
            <div className={heroClass}>
                {metaTopLeft ? (
                    <div className="absolute left-2 top-2 z-10 max-w-[58%]">{metaTopLeft}</div>
                ) : null}
                {metaTopRight ? (
                    <div className="absolute right-2 top-2 z-10 max-w-[58%] text-right">{metaTopRight}</div>
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">{heroCenter}</div>
                <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgb(255_255_255_/_0.06)_2px,rgb(255_255_255_/_0.06)_4px)] opacity-80" />
                <span className={badgeClass}>
                    {badge}
                </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
                <p className={titleClass}>{title}</p>
                {description ? (
                    <p className={descriptionClass}>{description}</p>
                ) : null}
                <button
                    type="button"
                    disabled={ctaDisabled && !onCtaClick}
                    onClick={onCtaClick}
                    className={ctaClass}
                >
                    {ctaLabel}
                </button>
            </div>
        </div>
    );
}

function RewardsWalletBar({ balance, onRecordClick }) {
    return (
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-cta text-[var(--color-text-cta-inverse)] shadow-[var(--shadow-cta-soft)] ring-1 ring-[var(--color-border-brand)]/60">
                    <Wallet className="h-6 w-6" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Wallet Balance:</p>
                    <p className="mt-0.5 text-xl font-bold leading-tight text-[var(--color-button-hover)] md:text-2xl tabular-nums">{balance}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onRecordClick}
                className="btn-theme-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:min-w-[148px]"
            >
                <History size={18} strokeWidth={2.5} className="shrink-0 text-[var(--color-text-card-text)]" aria-hidden />
                Record
            </button>
        </div>
    );
}

function GuestPreviewBanner({ onLoginClick }) {
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-control)] border border-[var(--color-accent-glow)] bg-[var(--color-accent-pale)] px-4 py-3 sm:px-5">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                Preview mode — sign in to claim rewards and track your check-in streak.
            </p>
            {onLoginClick ? (
                <button
                    type="button"
                    onClick={onLoginClick}
                    className="btn-theme-primary inline-flex h-10 shrink-0 items-center justify-center rounded-xl px-5 text-sm font-bold text-[var(--color-text-card-text)] shadow-sm transition hover:brightness-105"
                >
                    Login
                </button>
            ) : null}
        </div>
    );
}

function DailyBonusPanel({ guestPreview = false, onLoginClick }) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="daily-check-in-panel surface-card flex flex-col gap-4 rounded-[var(--radius-panel-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-popup-body)] p-5 shadow-[var(--shadow-card-soft)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[var(--color-surface-check-in-text)] md:text-xl">Daily Bonus Claim</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text-check-in-day-active)]">
                        <Clock className="h-4 w-4 shrink-0" strokeWidth={2.25} aria-hidden />
                        Refresh Time: Daily 00:00 - 23:59 GMT+7
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {DAILY_CHECKIN_CYCLE_DAYS}-day streak &mdash; open the claim window to check in and collect USD rewards.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="btn-theme-primary inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold text-[var(--color-text-card-text)] shadow-sm transition hover:brightness-105"
                >
                    {guestPreview ? 'Preview claim modal' : 'Open daily claim'}
                </button>
            </div>

            <DailyBonusClaimModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                guestPreview={guestPreview}
                onLoginClick={onLoginClick}
            />

            <TermsBlock title="Terms & Condition" subtitle="Daily Check-In T&C">
                <ol className="list-decimal space-y-2 pl-4">
                    <li>Daily rewards are paid in USD to your main wallet after you claim.</li>
                    <li>Selected days may require minimum valid turnover before the reward unlocks.</li>
                    <li>Only bets from your main wallet count toward turnover unless stated otherwise.</li>
                    <li>Unclaimed rewards may expire per campaign rules.</li>
                    <li>Claimed amounts may carry a one-time rollover before withdrawal.</li>
                </ol>
            </TermsBlock>
        </div>
    );
}

function SpinWheelPanel({ guestPreview = false, onLoginClick }) {
    return (
        <div className="spin-wheel-panel space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">Spin offers</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Same scratch-card look — spin for random MYR; prizes credit to your wallet after claim.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SPIN_OFFERS.map((s) => (
                        <ScratchStyleRewardCard
                            key={s.id}
                            variant="spin-wheel"
                            badge="Spin"
                            heroCenter={
                                <span className="text-4xl font-bold text-[var(--color-text-light)] drop-shadow-lg">
                                    RM {s.value}
                                </span>
                            }
                            title={s.title}
                            description={s.blurb}
                            ctaLabel={guestPreview ? 'Login to spin' : 'Spin now'}
                            onCtaClick={guestPreview ? onLoginClick : undefined}
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

function VoucherScratchPanel({ guestPreview = false, onLoginClick }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">Scratch &amp; redeem</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Reveal vouchers — MYR credit applies to your main wallet when you complete redemption.
                </p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {VOUCHERS.map((v) => (
                        <ScratchStyleRewardCard
                            key={v.id}
                            badge="Scratch"
                            heroCenter={
                                <span className="text-4xl font-bold text-[var(--color-text-sticky-nav-text)] drop-shadow-lg">
                                    RM {v.value}
                                </span>
                            }
                            title={v.title}
                            description={`Win up to MYR ${v.value} \u00B7 Credit to wallet after claim`}
                            ctaLabel={guestPreview ? 'Login to claim' : 'Scratch & claim'}
                            onCtaClick={guestPreview ? onLoginClick : undefined}
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

function PrizeBoxPanel({ guestPreview = false, onLoginClick }) {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">Your rewards</h3>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Campaign items appear here when available for claim.</p>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {PRIZE_ITEMS.map((item) => (
                        <ScratchStyleRewardCard
                            key={item.id}
                            badge="Prize"
                            metaTopLeft={
                                <span className="rounded-md bg-[var(--color-surface-darkest)]/45 px-2 py-1 text-xs font-bold text-[var(--color-text-card-text)] backdrop-blur-sm">
                                    Reward #{item.id}
                                </span>
                            }
                            metaTopRight={
                                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-brand)]/25 bg-[var(--color-surface-darkest)]/40 px-2.5 py-1 text-xs font-semibold text-[var(--color-text-card-text)] backdrop-blur-sm">
                                    <Clock size={11} className="shrink-0 opacity-90" />
                                    {item.expires}
                                </span>
                            }
                            heroCenter={
                                <span className="text-4xl font-bold text-[var(--color-text-sticky-nav-text)] drop-shadow-lg">
                                    RM {item.amount}
                                </span>
                            }
                            title={item.campaign}
                            description="Campaign reward \u00B7 MYR credits main wallet when claimed"
                            ctaLabel={
                                guestPreview
                                    ? 'Login to claim'
                                    : item.available
                                      ? 'Claim to wallet'
                                      : 'Unavailable'
                            }
                            ctaDisabled={!guestPreview && !item.available}
                            onCtaClick={guestPreview ? onLoginClick : undefined}
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

export default function RewardsSection({ embedInPage = false, guestPreview = false, onLoginClick }) {
    const programTabRefs = useRef({});
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

    const showWalletBar = !guestPreview && activeProgram !== 'daily-bonus';

    const recordTypeLabel = REWARDS_ACTIVITY_RECORD_TYPES.find((t) => t.id === recordActivityType)?.label ?? '';

    const recordTypeFilterSlot = (
        <label className="claim-record-filter-field block w-full">
            <span className="mb-2 block text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Type</span>
            <div className="relative">
                <select
                    value={recordActivityType}
                    onChange={(e) => setRecordActivityType(e.target.value)}
                    aria-label="Record type"
                    className="claim-record-type-select h-11 w-full cursor-pointer appearance-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] pl-4 pr-10 text-sm font-medium text-[var(--color-text-fourth)] shadow-[var(--shadow-subtle)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                >
                    {REWARDS_ACTIVITY_RECORD_TYPES.map(({ id, label }) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-info-icon)]"
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
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-pale)] text-[var(--color-button-hover)]">
                            <Trophy size={22} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold tracking-tight text-[var(--color-text-primary)] md:text-xl">
                                Rewards
                            </h2>
                            <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                                Check in, spin, scratch, and open prizes — claim MYR to your wallet.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {embedInPage && (
                <>
                    <div className="mb-6 md:hidden">
                        <label htmlFor="rewards-program-select" className="block">
                            <span className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
                                Program
                            </span>
                            <div className="relative">
                                <select
                                    id="rewards-program-select"
                                    value={activeProgram}
                                    onChange={(e) => setProgramHash(e.target.value)}
                                    aria-label="Rewards programme"
                                    className="h-11 w-full cursor-pointer appearance-none rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] pl-4 pr-10 text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-subtle)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                                >
                                    {REWARDS_PROGRAMS.map(({ id, label }) => (
                                        <option key={id} value={id}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={18}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-button-hover)]"
                                    aria-hidden
                                />
                            </div>
                        </label>
                    </div>

                    <HorizontalScrollTabRow
                        className="mb-6 hidden md:block lg:hidden"
                        wrapBreakpoint="lg"
                        innerListProps={{ role: 'tablist', 'aria-label': 'Rewards programmes' }}
                    >
                        {REWARDS_PROGRAMS.map(({ id, label }) => {
                            const selected = activeProgram === id;
                            return (
                                <button
                                    key={id}
                                    ref={(el) => {
                                        if (el) programTabRefs.current[id] = el;
                                        else delete programTabRefs.current[id];
                                    }}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => {
                                        setProgramHash(id);
                                        scrollTabIntoViewSmooth(programTabRefs.current[id]);
                                    }}
                                    className={filterPillClassName(selected, {
                                        shape: 'rounded-full',
                                        extraClass: 'max-lg:snap-start min-h-[44px]',
                                    })}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </HorizontalScrollTabRow>
                </>
            )}

            {showWalletBar && (
                <div className={`${embedInPage ? 'mt-0' : 'mt-6'} mb-6`}>
                    <RewardsWalletBar balance={REWARDS_WALLET_BALANCE} onRecordClick={openRecordModal} />
                </div>
            )}

            {guestPreview && <GuestPreviewBanner onLoginClick={onLoginClick} />}

            <div className="space-y-6">
                {activeProgram === 'daily-bonus' && (
                    <DailyBonusPanel guestPreview={guestPreview} onLoginClick={onLoginClick} />
                )}
                {activeProgram === 'spin-wheel' && (
                    <SpinWheelPanel guestPreview={guestPreview} onLoginClick={onLoginClick} />
                )}
                {activeProgram === 'voucher-scratch' && (
                    <VoucherScratchPanel guestPreview={guestPreview} onLoginClick={onLoginClick} />
                )}
                {activeProgram === 'prize-box' && (
                    <PrizeBoxPanel guestPreview={guestPreview} onLoginClick={onLoginClick} />
                )}
            </div>
        </section>

        {!guestPreview && (
            <RewardsActivityRecordModal
                open={recordModalOpen}
                onClose={() => setRecordModalOpen(false)}
                filterSlot={recordTypeFilterSlot}
                columns={REWARDS_RECORD_COLUMNS}
                recordContextKey={recordActivityType}
                tableEmptyMessage={recordTypeLabel ? `No data found for ${recordTypeLabel}` : 'No data found'}
            />
        )}
        </>
    );
}


