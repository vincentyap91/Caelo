import React, { useState } from 'react';
import AccountHistoryRecordPanel from './AccountHistoryRecordPanel';
import SegmentedTabs from './ui/SegmentedTabs';
import {
    HISTORY_RECORD_PANEL_CONFIG,
    TRANSACTION_RECORD_ROWS,
    TRANSACTION_RECORD_TABS,
} from '../constants/historyRecordPages';

export default function HistoryRecordPage({ activePage }) {
    const config = HISTORY_RECORD_PANEL_CONFIG[activePage];
    const [transactionType, setTransactionType] = useState('all');
    const isTransactionRecord = activePage === 'transaction-record';
    const transactionRows = isTransactionRecord
        ? transactionType === 'all'
            ? TRANSACTION_RECORD_ROWS
            : TRANSACTION_RECORD_ROWS.filter((row) => row.kind === transactionType)
        : [];

    if (!config) {
        return null;
    }

    return (
        <div className="page-container">
            <h1 className="page-title mb-8">{config.title}</h1>
            <AccountHistoryRecordPanel
                startDateLabel={config.startDateLabel}
                endDateLabel={config.endDateLabel}
                columns={config.columns}
                rows={isTransactionRecord ? transactionRows : []}
                rowDateKey="date"
                filterSlot={
                    isTransactionRecord ? (
                        <SegmentedTabs
                            value={transactionType}
                            onChange={setTransactionType}
                            items={TRANSACTION_RECORD_TABS}
                        />
                    ) : null
                }
                emptyMessage={
                    isTransactionRecord
                        ? transactionType === 'all'
                            ? 'No transaction records found'
                            : `No ${transactionType} records found`
                        : undefined
                }
            />
        </div>
    );
}
