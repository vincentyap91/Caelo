import React from 'react';
import AccountHistoryRecordPanel from './AccountHistoryRecordPanel';
import { HISTORY_RECORD_PANEL_CONFIG } from '../constants/historyRecordPages';

export default function HistoryRecordPage({ activePage }) {
    const config = HISTORY_RECORD_PANEL_CONFIG[activePage];
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
            />
        </div>
    );
}
