import React, { useState } from 'react';
import { Info, Star, Users } from 'lucide-react';
import SegmentedTabs from './ui/SegmentedTabs';

import AccountHistoryRecordPanel from './AccountHistoryRecordPanel';
import { useReferralData } from '../context/ReferralDataContext';

const REFERRAL_TABS = [
    { id: 'unclaim', label: 'Unclaim' },
    { id: 'history', label: 'History' },
    { id: 'downlines', label: 'Downlines' },
];

const REFERRAL_HISTORY_COLUMNS = [
    { key: 'claimed', label: 'Claimed Time', align: 'left' },
    { key: 'commission', label: 'Commission', align: 'right' },
    { key: 'bonus', label: 'Deposit Bonus', align: 'right' },
];

// Mock downlines – replace with real data
const MOCK_DOWNLINES = [
    { id: '1', username: 'player_001', joinedAt: '2026-01-15', totalDeposit: 'PKR 1,200', commission: 'PKR 36.00' },
    { id: '2', username: 'player_002', joinedAt: '2026-02-01', totalDeposit: 'PKR 800', commission: 'PKR 24.00' },
];

function CommissionStatBlock({ icon: Icon, iconWrapClassName, label, infoTitle, value }) {
    return (
        <div className="flex items-start gap-3 sm:gap-4">
            <span
                className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${iconWrapClassName}`}
            >
                <Icon className="h-[22px] w-[22px] sm:h-6 sm:w-6" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-start gap-1.5">
                    <span className="text-xs font-semibold leading-snug text-[var(--color-text-muted)] sm:text-sm">{label}</span>
                    <span
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]"
                        title={infoTitle}
                    >
                        <Info className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                    </span>
                </div>
                <p className="mt-1 break-words text-lg font-bold tabular-nums text-[var(--color-accent-600)] sm:text-xl md:text-2xl">{value}</p>
            </div>
        </div>
    );
}

export default function ReferralCommissionPage({ onNavigate }) {
    const { totalCommissionBonus, totalDepositBonus, setTotalCommissionBonus, setTotalDepositBonus } = useReferralData();
    const [activeTab, setActiveTab] = useState('unclaim');

    const hasDownlines = MOCK_DOWNLINES.length > 0;

    const handleClaim = () => {
        setTotalCommissionBonus('PKR 0.000');
        setTotalDepositBonus('PKR 0.000');
    };

    const hasClaimable = totalCommissionBonus !== 'PKR 0.000' || totalDepositBonus !== 'PKR 0.000';

    const claimButtonClass =
        'btn-theme-primary inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 md:min-h-11 md:w-auto md:min-w-[120px]';

    return (
        <div className="page-container">
            <h1 className="page-title mb-5 md:mb-8">Referral Commission</h1>

            <div className="mb-5 md:mb-8">
                <SegmentedTabs items={REFERRAL_TABS} value={activeTab} onChange={setActiveTab} />
            </div>

            <div className="space-y-4 md:space-y-6">
                {activeTab === 'unclaim' && (
                    <>
                        {/* Mobile: stacked stats + full-width Claim; desktop: unchanged row + side Claim */}
                        <div className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
                            <div className="flex flex-col gap-4 md:hidden">
                                <CommissionStatBlock
                                    icon={Star}
                                    iconWrapClassName="bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)]"
                                    label="Total Referral Commission Bonus"
                                    infoTitle="Commission earned from downline activity"
                                    value={totalCommissionBonus}
                                />
                                <div className="h-px w-full bg-[var(--color-border-default)]" aria-hidden />
                                <CommissionStatBlock
                                    icon={Users}
                                    iconWrapClassName="bg-[var(--color-accent-100)] text-[var(--color-accent-600)]"
                                    label="Total Referral Deposit Bonus"
                                    infoTitle="Bonus from referred deposits"
                                    value={totalDepositBonus}
                                />
                                <button type="button" onClick={handleClaim} disabled={!hasClaimable} className={claimButtonClass}>
                                    Claim
                                </button>
                            </div>

                            <div className="hidden flex-wrap items-center justify-between gap-4 md:flex">
                                <div className="flex flex-wrap items-center gap-6 md:gap-8">
                                    <CommissionStatBlock
                                        icon={Star}
                                        iconWrapClassName="bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)]"
                                        label="Total Referral Commission Bonus"
                                        infoTitle="Commission earned from downline activity"
                                        value={totalCommissionBonus}
                                    />
                                    <div className="hidden h-10 w-px shrink-0 bg-[var(--color-border-default)] md:block" aria-hidden />
                                    <CommissionStatBlock
                                        icon={Users}
                                        iconWrapClassName="bg-[var(--color-accent-100)] text-[var(--color-accent-600)]"
                                        label="Total Referral Deposit Bonus"
                                        infoTitle="Bonus from referred deposits"
                                        value={totalDepositBonus}
                                    />
                                </div>
                                <button type="button" onClick={handleClaim} disabled={!hasClaimable} className={claimButtonClass}>
                                    Claim
                                </button>
                            </div>
                        </div>

                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[280px] border-collapse text-sm md:min-w-[320px]">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] sm:px-4 sm:py-3 md:text-[var(--color-text-muted)]">
                                                Date
                                            </th>
                                            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] sm:px-4 sm:py-3 md:text-[var(--color-text-muted)]">
                                                Commission
                                            </th>
                                            <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] sm:px-4 sm:py-3 md:text-[var(--color-text-muted)]">
                                                Deposit Bonus
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="px-4 py-10 md:px-4 md:py-12">
                                                <div className="mx-auto flex max-w-[20rem] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/50 px-4 py-6">
                                                    <p className="text-center text-sm font-semibold text-[var(--color-text-strong)]">No data found</p>
                                                    <p className="mt-1 text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
                                                        Commission lines will show here when available.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'history' && (
                    <AccountHistoryRecordPanel
                        startDateLabel="Start Claim Date"
                        endDateLabel="End Claim Date"
                        columns={REFERRAL_HISTORY_COLUMNS}
                    />
                )}

                {activeTab === 'downlines' && (
                    <div className="space-y-4 md:space-y-6">
                        <div className="surface-card rounded-2xl p-4 shadow-[var(--shadow-card-soft)] sm:p-5 md:p-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                                <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">My Downlines</h3>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('referral')}
                                    className="btn-theme-cta inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:min-h-11 sm:w-auto sm:min-w-[120px]"
                                >
                                    View on Affiliate
                                </button>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:mt-3">
                                Track your referred friends and earned rewards. Referral history will appear once you start inviting.
                            </p>
                        </div>
                        {hasDownlines ? (
                            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[480px] border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                                <th className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] md:px-4 md:py-3 md:text-[var(--color-text-muted)]">
                                                    Username
                                                </th>
                                                <th className="px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] md:px-4 md:py-3 md:text-[var(--color-text-muted)]">
                                                    Joined
                                                </th>
                                                <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] md:px-4 md:py-3 md:text-[var(--color-text-muted)]">
                                                    Total Deposit
                                                </th>
                                                <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-accent-600)] md:px-4 md:py-3 md:text-[var(--color-text-muted)]">
                                                    Commission
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_DOWNLINES.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                                >
                                                    <td className="px-3 py-3 text-sm font-medium text-[var(--color-text-strong)] md:px-4 md:py-3.5">{row.username}</td>
                                                    <td className="px-3 py-3 text-sm text-[var(--color-text-muted)] md:px-4 md:py-3.5">{row.joinedAt}</td>
                                                    <td className="px-3 py-3 text-right text-sm font-medium text-[var(--color-text-strong)] md:px-4 md:py-3.5">
                                                        {row.totalDeposit}
                                                    </td>
                                                    <td className="px-3 py-3 text-right text-sm font-semibold text-[var(--color-accent-600)] md:px-4 md:py-3.5">
                                                        {row.commission}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="surface-card flex flex-col items-center justify-center rounded-2xl px-4 py-10 shadow-[var(--shadow-card-soft)] sm:p-12">
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">No downlines yet</p>
                                <p className="mt-1 text-center text-xs text-[var(--color-text-soft)]">
                                    Share your referral code or link to get started
                                </p>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('referral')}
                                    className="btn-theme-cta mt-5 inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] sm:mt-4 sm:min-h-11 sm:w-auto"
                                >
                                    Go to Affiliate
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
