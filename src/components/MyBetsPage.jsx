import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, ReceiptText, Search } from 'lucide-react';

const betStatusTabs = [
    { id: 'pending', label: 'Pending' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' },
    { id: 'returned', label: 'Returned' },
    { id: 'cashed-out', label: 'Cashed Out' },
    { id: 'all', label: 'All Bets' },
];

const dateRangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'];

export default function MyBetsPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState('Last 7 days');
    const [setAsDefault, setSetAsDefault] = useState(false);
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

    return (
        <div className="page-container">
                <h1 className="page-title">My Bets</h1>

                <div className="mb-6 mt-8 flex flex-wrap gap-3">
                    {betStatusTabs.map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setActiveTab(id)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                activeTab === id
                                    ? 'bg-[var(--color-button-hover)] text-[var(--color-text-card-text)] shadow-sm'
                                    : 'bg-[var(--color-surface-base)] text-[var(--color-text-muted)] ring-1 ring-[var(--color-border-subtle)] hover:ring-[var(--color-border-subtle)] hover:text-[var(--color-button-hover)]'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <label className="relative flex-1">
                        <span className="sr-only">Search bets</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="e.g. Real Madrid"
                            className="h-12 w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] pl-4 pr-12 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-soft)] ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
                        />
                        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-soft)]" />
                    </label>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setDateDropdownOpen((o) => !o)}
                            className="flex h-12 min-w-[160px] items-center gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] px-4 text-sm font-medium text-[var(--color-text-secondary)] shadow-[var(--shadow-subtle)]"
                        >
                            <Calendar size={18} className="text-[var(--color-text-muted)]" />
                            {dateRange}
                            <ChevronDown size={16} className="ml-auto text-[var(--color-text-soft)]" />
                        </button>
                        {dateDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    aria-hidden="true"
                                    onClick={() => setDateDropdownOpen(false)}
                                />
                                <div className="absolute left-0 top-full z-20 mt-1 min-w-[180px] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-2 shadow-lg">
                                    {dateRangeOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => {
                                                setDateRange(opt);
                                                setDateDropdownOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-sm font-medium ${
                                                dateRange === opt ? 'bg-[var(--color-accent-pale)] text-[var(--color-button-hover)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-cool-light)]'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <label className="flex cursor-pointer items-center gap-2">
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={setAsDefault}
                            onClick={() => setSetAsDefault((v) => !v)}
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition ${
                                setAsDefault ? 'border-[var(--color-success)] bg-[var(--color-success)]' : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-base)]'
                            }`}
                        >
                            {setAsDefault && <Check size={12} className="text-[var(--color-text-card-text)]" strokeWidth={3} />}
                        </button>
                        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Set this search as Default</span>
                    </label>
                </div>

                <div className="surface-card flex min-h-[320px] flex-col items-center justify-center rounded-2xl p-12">
                    <div className="relative">
                        <ReceiptText size={64} className="text-[var(--color-text-soft)]" strokeWidth={1.5} />
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-text-soft)] text-xs font-bold text-[var(--color-text-card-text)]">
                            1
                        </span>
                    </div>
                    <p className="mt-6 text-base font-semibold text-[var(--color-text-secondary)]">No bets placed yet.</p>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">Your bet history will appear here once you place a bet.</p>
                </div>
        </div>
    );
}
