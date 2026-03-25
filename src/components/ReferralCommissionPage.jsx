import React, { useState } from 'react';
import { Info, Star, Users } from 'lucide-react';
import SecurityTabs from './security/SecurityTabs';
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

export default function ReferralCommissionPage({ onNavigate }) {
    const { totalCommissionBonus, totalDepositBonus, setTotalCommissionBonus, setTotalDepositBonus } = useReferralData();
    const [activeTab, setActiveTab] = useState('unclaim');

    const hasDownlines = MOCK_DOWNLINES.length > 0;

    const handleClaim = () => {
        setTotalCommissionBonus('PKR 0.000');
        setTotalDepositBonus('PKR 0.000');
    };

    const hasClaimable = totalCommissionBonus !== 'PKR 0.000' || totalDepositBonus !== 'PKR 0.000';

    return (
        <div className="page-container">
            <h1 className="page-title mb-8">Referral Commission</h1>

            <div className="mb-8">
                <SecurityTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={REFERRAL_TABS} />
            </div>

            <div className="space-y-6">
                {activeTab === 'unclaim' && (
                    <>
                        <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                            <div className="flex flex-wrap items-center gap-6 md:gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)]">
                                        <Star size={24} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Commission Bonus</span>
                                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Commission earned from downline activity">
                                                <Info size={12} />
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xl font-bold text-[var(--color-accent-600)] md:text-2xl">{totalCommissionBonus}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px shrink-0 bg-[var(--color-border-default)]" aria-hidden />
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]">
                                        <Users size={24} strokeWidth={2} />
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Deposit Bonus</span>
                                            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Bonus from referred deposits">
                                                <Info size={12} />
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xl font-bold text-[var(--color-accent-600)] md:text-2xl">{totalDepositBonus}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleClaim}
                                disabled={!hasClaimable}
                                className="btn-theme-primary inline-flex h-11 min-w-[120px] shrink-0 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Claim
                            </button>
                        </div>

                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[320px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Date</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Commission</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Deposit Bonus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]">
                                                No data found
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
                    <div className="space-y-6">
                        <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h3 className="text-lg font-bold text-[var(--color-text-strong)]">My Downlines</h3>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('referral')}
                                    className="btn-theme-cta inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02]"
                                >
                                    View on Affiliate
                                </button>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                                Track your referred friends and earned rewards. Referral history will appear once you start inviting.
                            </p>
                        </div>
                        {hasDownlines ? (
                            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[480px] border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Username</th>
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Joined</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Total Deposit</th>
                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Commission</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {MOCK_DOWNLINES.map((row) => (
                                                <tr
                                                    key={row.id}
                                                    className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                                >
                                                    <td className="px-4 py-3.5 font-medium text-[var(--color-text-strong)]">{row.username}</td>
                                                    <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.joinedAt}</td>
                                                    <td className="px-4 py-3.5 text-right font-medium text-[var(--color-text-strong)]">{row.totalDeposit}</td>
                                                    <td className="px-4 py-3.5 text-right font-semibold text-[var(--color-accent-600)]">{row.commission}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="surface-card flex flex-col items-center justify-center rounded-2xl p-12 shadow-[var(--shadow-card-soft)]">
                                <p className="text-sm font-medium text-[var(--color-text-muted)]">No downlines yet</p>
                                <p className="mt-1 text-xs text-[var(--color-text-soft)]">Share your referral code or link to get started</p>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('referral')}
                                    className="btn-theme-cta mt-4 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02]"
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
