import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import AccountHistoryRecordPanel from './AccountHistoryRecordPanel';
import SegmentedTabs from './ui/SegmentedTabs';
import {
    HISTORY_RECORD_PANEL_CONFIG,
    TRANSACTION_RECORD_ROWS,
    TRANSACTION_RECORD_TABS,
    BET_RECORD_TYPE_OPTIONS,
    BET_RECORD_STATUS_OPTIONS,
    BET_RECORD_VIEW_TABS,
    BET_RECORD_DETAIL_COLUMNS,
    BET_RECORD_SUMMARY_COLUMNS,
} from '../constants/historyRecordPages';
import {
    aggregateProviderSummary,
    betMatchesStatus,
    betMatchesType,
    computeBetKpis,
    formatSignedMoney,
    loadBetRecordSource,
    toBetDetailRow,
} from '../utils/betRecord';

const SELECT_CLASS =
    'h-11 w-full appearance-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 pr-10 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-subtle)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20';

function HistorySelect({ label, value, onChange, options, id }) {
    return (
        <label className="block" htmlFor={id}>
            <span className="mb-2 block text-xs font-semibold text-[var(--color-text-muted)] md:text-sm">
                {label}
            </span>
            <div className="relative flex items-center">
                <select id={id} className={SELECT_CLASS} value={value} onChange={(e) => onChange(e.target.value)}>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-3 text-[var(--color-secondary)]"
                    aria-hidden
                />
            </div>
        </label>
    );
}

function BetSlipIdButton({ slip }) {
    const [copied, setCopied] = useState(false);

    const copySlip = async () => {
        try {
            await navigator.clipboard.writeText(String(slip));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            className="bet-record-slip-id"
            title="Copy bet slip ID"
            onClick={copySlip}
        >
            {copied ? 'Copied' : slip}
        </button>
    );
}

function betStatusPillClass(statusKey) {
    const key = String(statusKey || '').toLowerCase();
    const base = 'bet-record-status';
    if (key === 'won') return `${base} ${base}--won`;
    if (key === 'lost' || key === 'loss') return `${base} ${base}--lost`;
    if (key === 'open' || key === 'running' || key === 'unsettled') return `${base} ${base}--open`;
    return `${base} ${base}--muted`;
}

function amountToneClass(tone) {
    if (tone === 'pos') return 'bet-record-amount is-pos';
    if (tone === 'neg') return 'bet-record-amount is-neg';
    if (tone === 'open') return 'bet-record-amount is-open';
    return 'bet-record-amount';
}

function formatPlacedLabel(date) {
    return String(date || '').replace(/^(\d{2})\/(\d{2})\/(\d{4})\s*\/\s*/, (_, d, m) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${Number(d)} ${months[Number(m) - 1] || m}, `;
    });
}

function BetSlipCard({ row }) {
    const payoutTone =
        row.payoutTone === 'pos' ? ' is-pos' : row.payoutTone === 'neg' ? ' is-neg' : row.payoutTone === 'open' ? ' is-open' : '';
    const payout = row.payoutStrike ? (
        <span className="bet-record-win-strike">MYR {row.payout}</span>
    ) : (
        `MYR ${row.payout}`
    );

    return (
        <article className="bet-record-slip-card">
            <header className="bet-record-slip-card__head">
                <div className="bet-record-slip-card__league">
                    <span className="bet-record-slip-card__icon">
                        <img src={row.icon} alt="" width={16} height={16} />
                    </span>
                    <span className="bet-record-slip-card__league-name">{row.league || 'Sports'}</span>
                </div>
                <span className={betStatusPillClass(row.statusKey)}>{row.status}</span>
            </header>
            <h3 className="bet-record-slip-card__match">{row.match}</h3>
            <div className="bet-record-slip-card__grid">
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Type</span>
                    <strong className="bet-record-slip-card__value">{row.betType}</strong>
                </div>
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Odds</span>
                    <strong className="bet-record-slip-card__value">{row.odds}</strong>
                </div>
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Stake</span>
                    <strong className="bet-record-slip-card__value">MYR {row.stake}</strong>
                </div>
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Payout</span>
                    <strong className={`bet-record-slip-card__value${payoutTone}`}>{payout}</strong>
                </div>
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Bet ID</span>
                    <BetSlipIdButton slip={row.slip} />
                </div>
                <div className="bet-record-slip-card__field">
                    <span className="bet-record-slip-card__label">Placed</span>
                    <span className="bet-record-slip-card__meta">
                        {row.placedLabel || formatPlacedLabel(row.date) || row.date}
                    </span>
                </div>
            </div>
        </article>
    );
}

function BetRecordMobileList({ paginatedRows, filteredRows }) {
    const kpis = computeBetKpis(filteredRows);
    const tone = kpis.net < 0 ? 'neg' : kpis.net > 0 ? 'pos' : '';

    return (
        <>
            <div className="bet-record-slip-cards">
                {paginatedRows.map((row) => (
                    <BetSlipCard key={row.id} row={row} />
                ))}
            </div>
            <div className="bet-record-mobile-total">
                <div className="bet-record-mobile-total-label">Filter total</div>
                <div className="bet-record-mobile-total-grid">
                    <div>
                        <span className="bet-record-total-cap">Stake</span>
                        <strong className="bet-record-mobile-total-value">{kpis.totalStake.toFixed(2)}</strong>
                    </div>
                    <div className="bet-record-mobile-total-win">
                        <span className="bet-record-total-cap">Win/Loss</span>
                        <strong className={`bet-record-mobile-total-value ${amountToneClass(tone)}`}>
                            {formatSignedMoney(kpis.net)}
                        </strong>
                    </div>
                </div>
            </div>
        </>
    );
}

function BetRecordResultsHeader({ view, onViewChange, filteredRows }) {
    const kpis = computeBetKpis(filteredRows);
    const netClass =
        kpis.net > 0 ? 'is-pos' : kpis.net < 0 ? 'is-neg' : 'is-zero';

    return (
        <div className="bet-record-results-head">
            <div className="bet-record-view-tabs" role="tablist" aria-label="Bet history view">
                {BET_RECORD_VIEW_TABS.map((tab) => {
                    const active = view === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            className={`bet-record-view-tab${active ? ' is-active' : ''}`}
                            onClick={() => onViewChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>
            <div className="bet-record-kpi" aria-live="polite">
                <div className="bet-record-kpi-item">
                    <span className="bet-record-kpi-label">
                        Total Stake <small className="bet-record-kpi-note">All bets</small>
                    </span>
                    <strong className="bet-record-kpi-value">{kpis.totalStake.toFixed(2)}</strong>
                </div>
                <div className="bet-record-kpi-item">
                    <span className="bet-record-kpi-label">Settled Stake</span>
                    <strong className="bet-record-kpi-value">{kpis.settledStake.toFixed(2)}</strong>
                </div>
                <div className="bet-record-kpi-item bet-record-kpi-item--net">
                    <span className="bet-record-kpi-label">Win / Loss</span>
                    <strong className={`bet-record-kpi-value ${netClass}`}>
                        {formatSignedMoney(kpis.net)}
                    </strong>
                </div>
            </div>
        </div>
    );
}

export default function HistoryRecordPage({ activePage }) {
    const config = HISTORY_RECORD_PANEL_CONFIG[activePage];
    const [transactionType, setTransactionType] = useState('all');
    const [betType, setBetType] = useState('all');
    const [betStatus, setBetStatus] = useState('all');
    const [betView, setBetView] = useState('details');
    const [betSource, setBetSource] = useState(() => loadBetRecordSource());
    const isTransactionRecord = activePage === 'transaction-record';
    const isBetRecord = activePage === 'bet-record';

    useEffect(() => {
        if (!isBetRecord) return undefined;
        const refresh = () => setBetSource(loadBetRecordSource());
        refresh();
        window.addEventListener('focus', refresh);
        window.addEventListener('storage', refresh);
        return () => {
            window.removeEventListener('focus', refresh);
            window.removeEventListener('storage', refresh);
        };
    }, [isBetRecord]);

    const transactionRows = isTransactionRecord
        ? transactionType === 'all'
            ? TRANSACTION_RECORD_ROWS
            : TRANSACTION_RECORD_ROWS.filter((row) => row.kind === transactionType)
        : [];

    const betDetailRows = useMemo(() => {
        if (!isBetRecord) return [];
        return betSource
            .filter((bet) => betMatchesType(bet, betType) && betMatchesStatus(bet, betStatus))
            .map(toBetDetailRow);
    }, [isBetRecord, betSource, betType, betStatus]);

    const renderBetCell = useCallback((col, row) => {
        if (col.key === 'event') {
            return (
                <div className="bet-record-event">
                    <span className="bet-record-event-icon">
                        <img src={row.icon} alt="" width={16} height={16} />
                    </span>
                    <span className="bet-record-event-text">
                        <strong className="bet-record-event-match">{row.match}</strong>
                        {row.league ? <small className="bet-record-event-league">{row.league}</small> : null}
                    </span>
                </div>
            );
        }
        if (col.key === 'slip') {
            return <BetSlipIdButton slip={row.slip} />;
        }
        if (col.key === 'status') {
            return <span className={betStatusPillClass(row.statusKey)}>{row.status}</span>;
        }
        if (col.key === 'payout') {
            return (
                <span className={`${amountToneClass(row.payoutTone)}${row.payoutStrike ? ' is-strike' : ''}`}>
                    {row.payout}
                </span>
            );
        }
        if (col.key === 'winLoss') {
            return <span className={amountToneClass(row.amountTone)}>{row.winLoss}</span>;
        }
        return row?.[col.key] ?? '—';
    }, []);

    const renderBetFooter = useCallback(
        ({ filteredRows, tableRows }) => {
            if (betView === 'summary') {
                const turnover = tableRows.reduce((sum, row) => sum + row.turnoverValue, 0);
                const winLoss = tableRows.reduce((sum, row) => sum + row.winLossValue, 0);
                const tone = winLoss < 0 ? 'neg' : winLoss > 0 ? 'pos' : '';
                return (
                    <tr className="bet-record-total-row">
                        <td className="px-4 py-3.5 text-sm font-bold text-[var(--color-text-primary)]">Total</td>
                        <td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums text-[var(--color-text-primary)]">
                            {turnover.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3.5 text-right text-sm font-bold tabular-nums ${amountToneClass(tone)}`}>
                            {formatSignedMoney(winLoss)}
                        </td>
                    </tr>
                );
            }

            const kpis = computeBetKpis(filteredRows);
            const tone = kpis.net < 0 ? 'neg' : kpis.net > 0 ? 'pos' : '';
            return (
                <tr className="bet-record-total-row">
                    <td className="px-4 py-3.5 text-sm font-bold text-[var(--color-text-primary)]">Filter total</td>
                    <td colSpan={3} aria-hidden="true" />
                    <td className="px-4 py-3.5 text-right">
                        <span className="bet-record-total-cap">Stake</span>
                        <strong className="block tabular-nums text-[var(--color-text-primary)]">
                            {kpis.totalStake.toFixed(2)}
                        </strong>
                    </td>
                    <td colSpan={2} aria-hidden="true" />
                    <td className="px-4 py-3.5 text-right">
                        <span className="bet-record-total-cap">Win/Loss</span>
                        <strong className={`block tabular-nums ${amountToneClass(tone)}`}>
                            {formatSignedMoney(kpis.net)}
                        </strong>
                    </td>
                </tr>
            );
        },
        [betView],
    );

    if (!config) {
        return null;
    }

    const betEmptyMessage =
        betType === 'all' ? 'No bets found' : `No ${betType} bets found`;

    return (
        <div className={`history-record-page page-container${isBetRecord ? ' history-record-page--bet' : ''}`}>
            <h1 className="page-title mb-8">{config.title}</h1>
            <AccountHistoryRecordPanel
                key={activePage}
                startDateLabel={config.startDateLabel}
                endDateLabel={config.endDateLabel}
                columns={
                    isBetRecord
                        ? betView === 'summary'
                            ? BET_RECORD_SUMMARY_COLUMNS
                            : BET_RECORD_DETAIL_COLUMNS
                        : config.columns
                }
                rows={isTransactionRecord ? transactionRows : isBetRecord ? betDetailRows : []}
                rowDateKey={isBetRecord ? 'dateKey' : 'date'}
                defaultQuickRange={isBetRecord ? 'week' : 'today'}
                resetPageKey={isBetRecord ? `${betType}-${betStatus}-${betView}` : transactionType}
                pageSize={isBetRecord ? 8 : 5}
                tableClassName={isBetRecord && betView === 'details' ? 'bet-record-details-table' : ''}
                dateGridClassName={isBetRecord ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}
                submitClassName={isBetRecord ? 'history-record-submit--bet' : ''}
                transformRows={isBetRecord && betView === 'summary' ? aggregateProviderSummary : null}
                renderCell={isBetRecord ? renderBetCell : null}
                renderTableFooter={isBetRecord ? renderBetFooter : null}
                renderMobileList={
                    isBetRecord && betView === 'details'
                        ? ({ paginatedRows, filteredRows }) => (
                              <BetRecordMobileList paginatedRows={paginatedRows} filteredRows={filteredRows} />
                          )
                        : null
                }
                resultsHeader={
                    isBetRecord
                        ? ({ filteredRows }) => (
                              <BetRecordResultsHeader
                                  view={betView}
                                  onViewChange={setBetView}
                                  filteredRows={filteredRows}
                              />
                          )
                        : null
                }
                filterSlot={
                    isTransactionRecord ? (
                        <SegmentedTabs
                            className="history-record-type-tabs"
                            value={transactionType}
                            onChange={setTransactionType}
                            items={TRANSACTION_RECORD_TABS}
                        />
                    ) : isBetRecord ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <HistorySelect
                                id="bet-record-type"
                                label="Type"
                                value={betType}
                                onChange={setBetType}
                                options={BET_RECORD_TYPE_OPTIONS}
                            />
                            <HistorySelect
                                id="bet-record-status"
                                label="Status"
                                value={betStatus}
                                onChange={setBetStatus}
                                options={BET_RECORD_STATUS_OPTIONS}
                            />
                        </div>
                    ) : null
                }
                emptyMessage={
                    isTransactionRecord
                        ? transactionType === 'all'
                            ? 'No transaction records found'
                            : `No ${transactionType} records found`
                        : isBetRecord
                          ? betEmptyMessage
                          : undefined
                }
            />
        </div>
    );
}
