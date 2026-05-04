import React, { useMemo, useRef, useState } from 'react';
import { ArrowDownUp, Search } from 'lucide-react';
import CalendarDateInput from '../CalendarDateInput';
import SegmentedTabs from '../ui/SegmentedTabs';
import PromotionStyleTabs from '../PromotionStyleTabs';
import HorizontalScrollTabRow, { scrollTabIntoViewSmooth } from '../HorizontalScrollTabRow';
import DownlineDetailModal from './DownlineDetailModal';
import { useReferralData } from '../../context/ReferralDataContext';

/** Same tab chrome as Referral Commission (`ReferralCommissionPage` → `SecurityTabs`). */
const DOWNLINE_VIEW_TABS = [
    { id: 'summary', label: 'Downline Summary' },
    { id: 'kpis', label: 'Downlines KPIs' },
];

const SUMMARY_QUICK_RANGES = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'thisWeek', label: 'This Week' },
    { id: 'lastWeek', label: 'Last Week' },
    { id: 'thisMonth', label: 'This Month' },
    { id: 'lastMonth', label: 'Last Month' },
];

const KPI_SUB_TABS = [
    { id: 'active', label: 'Active Downlines' },
    { id: 'inactive', label: 'Inactive Downlines' },
];

/** Same chrome as summary “Today / Yesterday / …” quick range buttons (`HorizontalScrollTabRow` on mobile). */
function quickRangePillClassName(selected, smMinWidthClass = 'sm:min-w-[96px]') {
    return `max-sm:snap-start shrink-0 whitespace-nowrap rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${smMinWidthClass} sm:px-4 sm:text-sm ${
        selected
            ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)] text-[var(--color-accent-600)]'
            : 'border-[var(--color-border-default)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]'
    }`;
}

function formatDateForInput(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function startOfWeekMonday(reference) {
    const date = new Date(reference);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date;
}

function applySummaryQuickRange(id, setStart, setEnd, setQuickId) {
    setQuickId(id);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let start = new Date(now);
    let end = new Date(now);

    if (id === 'today') {
        // start, end = today
    } else if (id === 'yesterday') {
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
    } else if (id === 'thisWeek') {
        start = startOfWeekMonday(now);
        end = new Date(now);
    } else if (id === 'lastWeek') {
        const thisMonday = startOfWeekMonday(now);
        end = new Date(thisMonday);
        end.setDate(end.getDate() - 1);
        start = new Date(end);
        start.setDate(start.getDate() - 6);
    } else if (id === 'thisMonth') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now);
    } else if (id === 'lastMonth') {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    setStart(formatDateForInput(start));
    setEnd(formatDateForInput(end));
}



function StatTile({ label, value }) {
    return (
        <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
            <p className="text-sm font-semibold text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--color-accent-600)] md:text-3xl">{value}</p>
        </div>
    );
}

/** Compact metric for grouped summary panel */
function SummaryMetricCard({ label, value }) {
    return (
        <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">{label}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--color-accent-600)] md:text-3xl">{value}</p>
        </div>
    );
}

export default function DownlineReferralsPanel() {
    const summaryQuickTabRefs = useRef({});
    const today = new Date();
    const [view, setView] = useState('summary');
    const [summaryStart, setSummaryStart] = useState(() => formatDateForInput(today));
    const [summaryEnd, setSummaryEnd] = useState(() => formatDateForInput(today));
    const [summaryQuickId, setSummaryQuickId] = useState('today');

    const [kpiSubTab, setKpiSubTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const { downlines: kpiDownlines, handleSaveRemark: globalSaveRemark } = useReferralData();
    const [selectedDownlineId, setSelectedDownlineId] = useState(null);

    const selectedDownline = kpiDownlines.find((d) => d.id === selectedDownlineId) || null;

    const activeCount = useMemo(() => kpiDownlines.filter((r) => r.active).length, [kpiDownlines]);
    const inactiveCount = useMemo(() => kpiDownlines.filter((r) => !r.active).length, [kpiDownlines]);

    const filteredKpiRows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return kpiDownlines.filter((row) => {
            const matchesTab = kpiSubTab === 'active' ? row.active : !row.active;
            const matchesSearch = !q || row.username.toLowerCase().includes(q);
            return matchesTab && matchesSearch;
        });
    }, [kpiDownlines, kpiSubTab, searchQuery]);

    const onSummaryQuickClick = (id) => {
        applySummaryQuickRange(id, setSummaryStart, setSummaryEnd, setSummaryQuickId);
    };

    function handleSaveRemark(id, remark) {
        globalSaveRemark(id, remark);
    }

    return (
        <>
        <div>
            <div className="mb-8">
                <SegmentedTabs value={view} onChange={setView} items={DOWNLINE_VIEW_TABS} />
            </div>

            <div className="space-y-6">
            {view === 'summary' && (
                <>
                    <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CalendarDateInput
                                label="Start Date"
                                value={summaryStart}
                                onChange={(e) => {
                                    setSummaryStart(e.target.value);
                                    setSummaryQuickId('');
                                }}
                            />
                            <CalendarDateInput
                                label="End Date"
                                value={summaryEnd}
                                onChange={(e) => {
                                    setSummaryEnd(e.target.value);
                                    setSummaryQuickId('');
                                }}
                            />
                        </div>
                        <HorizontalScrollTabRow className="mt-4">
                            {SUMMARY_QUICK_RANGES.map(({ id, label }) => (
                                <button
                                    key={id}
                                    ref={(el) => {
                                        if (el) summaryQuickTabRefs.current[id] = el;
                                        else delete summaryQuickTabRefs.current[id];
                                    }}
                                    type="button"
                                    onClick={() => {
                                        onSummaryQuickClick(id);
                                        scrollTabIntoViewSmooth(summaryQuickTabRefs.current[id]);
                                    }}
                                    className={quickRangePillClassName(summaryQuickId === id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </HorizontalScrollTabRow>
                        <div className="mt-4">
                            <button
                                type="button"
                                className="btn-theme-cta inline-flex h-11 min-w-[120px] items-center justify-center rounded-[var(--radius-control)] px-6 text-sm font-bold text-white shadow-[var(--shadow-cta)] transition hover:scale-[1.02] hover:brightness-[1.02]"
                            >
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="surface-card rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Selected period</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <SummaryMetricCard label="New Downline L1" value="0" />
                            <SummaryMetricCard label="New All Downlines" value="0" />
                        </div>

                        <div className="my-6 border-t border-dashed border-[var(--color-border-default)]" />

                        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-muted)]">Up to now</p>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <SummaryMetricCard label="Total Downline L1" value="2" />
                            <SummaryMetricCard label="Total All Downlines" value="2" />
                            <SummaryMetricCard label="Number of Downlines" value="1" />
                        </div>
                    </div>
                </>
            )}

            {view === 'kpis' && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <StatTile label="Total Active Downlines" value={String(activeCount)} />
                        <StatTile label="Total Inactive Downlines" value={String(inactiveCount)} />
                    </div>

                    <div>
                        <h4 className="text-base font-bold text-[var(--color-text-strong)]">Downline L1 KPIs</h4>
                        <PromotionStyleTabs
                            className="mt-4"
                            items={KPI_SUB_TABS}
                            value={kpiSubTab}
                            onChange={setKpiSubTab}
                            ariaLabel="Downline list filter"
                        />
                    </div>

                    <label className="block">
                        <span className="sr-only">Search downline username</span>
                        <div className="relative">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-600)]"
                                aria-hidden
                            />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search downline username"
                                className="h-11 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] py-2 pl-10 pr-4 text-sm font-medium text-[var(--color-text-strong)] shadow-[var(--shadow-subtle)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                            />
                        </div>
                    </label>

                    <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)]">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                                            Username
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                                            Register Date
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                                            <span className="inline-flex items-center justify-end gap-1">
                                                <ArrowDownUp size={14} className="shrink-0 opacity-70" aria-hidden />
                                                Deposit
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredKpiRows.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-12 text-center text-sm font-medium text-[var(--color-text-muted)]"
                                            >
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredKpiRows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-[var(--color-border-default)] transition hover:bg-[var(--color-surface-subtle)]"
                                            >
                                                <td className="px-4 py-3.5 text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedDownlineId(row.id)}
                                                        className="font-semibold text-[var(--color-text-brand)] underline-offset-2 transition hover:underline"
                                                    >
                                                        {row.username}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3.5 text-[var(--color-text-muted)]">{row.contact}</td>
                                                <td className="px-4 py-3.5 tabular-nums text-[var(--color-text-muted)]">{row.registerDate}</td>
                                                <td className="px-4 py-3.5 text-right font-medium tabular-nums text-[var(--color-text-strong)]">
                                                    {row.deposit}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            </div>
        </div>

        {selectedDownline && (
            <DownlineDetailModal
                downline={selectedDownline}
                onClose={() => setSelectedDownlineId(null)}
                onSaveRemark={handleSaveRemark}
            />
        )}
        </>
    );
}
