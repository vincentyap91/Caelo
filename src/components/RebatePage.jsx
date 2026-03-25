import React, { useState } from 'react';
import { Star } from 'lucide-react';
import CalendarDateInput from './CalendarDateInput';
import SecurityTabs from './security/SecurityTabs';

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

const REBATE_TABS = [
    { id: 'unclaim', label: 'Unclaim' },
    { id: 'history', label: 'History' },
    { id: 'benefit', label: 'Rebate Benefit' },
];

const BENEFIT_CATEGORY_TABS = [
    { id: 'all', label: 'All' },
    { id: 'slots', label: 'Slots' },
    { id: 'casino', label: 'Casino' },
    { id: 'sports', label: 'Sports' },
    { id: 'fishing', label: 'Fishing' },
    { id: 'rng', label: 'RNG' },
    { id: 'lottery', label: 'Lottery' },
];

const REBATE_BENEFIT_ROWS = [
    { provider: 'JDB', category: 'Slots', rebate: '1.30%' },
    { provider: 'Joker', category: 'Slots', rebate: '1.30%' },
    { provider: 'Pragmatic Play', category: 'Slots', rebate: '1.30%' },
    { provider: 'Funky Games', category: 'Slots', rebate: '1.20%' },
    { provider: 'AFB Slot', category: 'Slots', rebate: '1.20%' },
    { provider: 'SBO Sports', category: 'Sports', rebate: '1.10%' },
    { provider: 'SABA Sports', category: 'Sports', rebate: '1.10%' },
    { provider: 'Evo888SG', category: 'Slots', rebate: '0.90%' },
    { provider: 'SimplePlay', category: 'Slots', rebate: '0.90%' },
    { provider: 'Yggdrasil', category: 'Slots', rebate: '0.90%' },
    { provider: 'Microgaming', category: 'Slots', rebate: '0.90%' },
    { provider: 'IA Gaming', category: 'Slots', rebate: '0.90%' },
    { provider: 'JDB Fishing', category: 'Fishing', rebate: '0.90%' },
    { provider: 'JILI RNG', category: 'RNG', rebate: '0.90%' },
    { provider: 'Pragmatic Play Live Casino', category: 'Casino', rebate: '0.75%' },
    { provider: 'Sexy Gaming', category: 'Casino', rebate: '0.75%' },
    { provider: 'Evolution Gaming', category: 'Casino', rebate: '0.70%' },
    { provider: 'Big Gaming', category: 'Casino', rebate: '0.70%' },
    { provider: 'Playtech LiveCasino', category: 'Casino', rebate: '0.50%' },
    { provider: 'Lottery Provider', category: 'Lottery', rebate: '0.80%' },
];

const HISTORY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: '3days', label: 'In 3 days' },
    { id: 'week', label: 'In a week' },
    { id: 'month', label: 'In a month' },
];

export default function RebatePage({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('unclaim');
    const [benefitCategory, setBenefitCategory] = useState('all');
    const today = new Date();
    const [historyStart, setHistoryStart] = useState(formatDateForInput(today));
    const [historyEnd, setHistoryEnd] = useState(formatDateForInput(new Date(today.getTime() + 86400000)));
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
        <div className="page-container">
            <h1 className="page-title mb-8">Rebate</h1>

            <div className="mb-8">
                <SecurityTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={REBATE_TABS} />
            </div>

            <div className="space-y-6">
                {activeTab === 'unclaim' && (
                    <>
                        <div className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                            <div className="flex items-center gap-4">
                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)]">
                                    <Star size={24} strokeWidth={2} />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-text-muted)]">Total Rebate Earned</p>
                                    <p className="mt-1 text-xl font-bold text-[var(--color-accent-600)] md:text-2xl">MYR 0.000</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-theme-primary inline-flex h-11 min-w-[120px] items-center justify-center rounded-xl px-6 text-sm font-bold shadow-sm transition hover:scale-[1.02]"
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
                                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2} className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]">
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
                    <div className="space-y-6">
                        <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <CalendarDateInput
                                    label="Start Claim Date"
                                    value={historyStart}
                                    onChange={(e) => setHistoryStart(e.target.value)}
                                />
                                <CalendarDateInput
                                    label="End Claim Date"
                                    value={historyEnd}
                                    onChange={(e) => setHistoryEnd(e.target.value)}
                                />
                            </div>
                            <div className="mt-4 flex gap-2">
                                {HISTORY_QUICK_RANGES.map(({ id, label }) => (
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
                                <table className="w-full min-w-[320px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Claimed Time</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2} className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]">
                                                No data found
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'benefit' && (
                    <div className="space-y-6">
                        <div className="flex gap-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-1 shadow-[var(--shadow-subtle)]">
                            {BENEFIT_CATEGORY_TABS.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setBenefitCategory(id)}
                                    className={`min-w-0 flex-1 rounded-lg px-2 py-2.5 text-sm font-semibold transition sm:px-4 ${
                                        benefitCategory === id
                                            ? 'btn-theme-primary shadow-sm'
                                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[400px] border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Game Provider</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Category</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Rebate Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {REBATE_BENEFIT_ROWS.filter(
                                            (row) => benefitCategory === 'all' || row.category.toLowerCase() === benefitCategory.toLowerCase()
                                        ).map((row) => (
                                            <tr
                                                key={`${row.provider}-${row.category}`}
                                                className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                            >
                                                <td className="px-4 py-3.5 font-medium text-[var(--color-text-strong)]">{row.provider}</td>
                                                <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.category}</td>
                                                <td className="px-4 py-3.5 text-right font-semibold text-[var(--color-accent-600)]">{row.rebate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
