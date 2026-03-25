import {
    CalendarCheck,
    CirclePercent,
    Dices,
    Gift,
    Receipt,
    Megaphone,
} from 'lucide-react';

/** Account sidebar / routing: History Record submenu. */
export const HISTORY_RECORD_NAV = [
    { id: 'transaction-record', label: 'Transaction Record', icon: Receipt },
    { id: 'bet-record', label: 'Bet Record', icon: Dices },
    { id: 'commission-record', label: 'Commission Record', icon: CirclePercent },
    { id: 'rebate-record', label: 'Rebate Record', icon: Gift },
    { id: 'daily-check-in-record', label: 'Daily Check In Record', icon: CalendarCheck },
    { id: 'promotion-record', label: 'Promotion Record', icon: Megaphone },
];

export const HISTORY_RECORD_PAGE_IDS = HISTORY_RECORD_NAV.map((i) => i.id);

const CLAIMDATE_LABELS = { start: 'Start Claim Date', end: 'End Claim Date' };

/** Panel config keyed by page id (columns + date labels). */
export const HISTORY_RECORD_PANEL_CONFIG = {
    'transaction-record': {
        title: 'Transaction Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'time', label: 'Time', align: 'left' },
            { key: 'type', label: 'Type', align: 'left' },
            { key: 'amount', label: 'Amount', align: 'right' },
        ],
    },
    'bet-record': {
        title: 'Bet Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'time', label: 'Bet Time', align: 'left' },
            { key: 'game', label: 'Game', align: 'left' },
            { key: 'stake', label: 'Stake', align: 'right' },
        ],
    },
    'commission-record': {
        title: 'Commission Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'claimed', label: 'Claimed Time', align: 'left' },
            { key: 'commission', label: 'Commission', align: 'right' },
            { key: 'bonus', label: 'Deposit Bonus', align: 'right' },
        ],
    },
    'rebate-record': {
        title: 'Rebate Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'time', label: 'Time', align: 'left' },
            { key: 'rebate', label: 'Rebate', align: 'right' },
            { key: 'status', label: 'Status', align: 'left' },
        ],
    },
    'daily-check-in-record': {
        title: 'Daily Check In Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'date', label: 'Date', align: 'left' },
            { key: 'reward', label: 'Reward', align: 'right' },
            { key: 'status', label: 'Status', align: 'left' },
        ],
    },
    'promotion-record': {
        title: 'Promotion Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'time', label: 'Time', align: 'left' },
            { key: 'promotion', label: 'Promotion', align: 'left' },
            { key: 'reward', label: 'Reward', align: 'right' },
        ],
    },
};
