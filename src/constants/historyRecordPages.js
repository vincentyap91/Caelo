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

export const TRANSACTION_RECORD_TABS = [
    { id: 'all', label: 'All' },
    { id: 'deposit', label: 'Deposits' },
    { id: 'withdrawal', label: 'Withdrawals' },
];

export const TRANSACTION_RECORD_ROWS = [
    {
        id: 'dep-0',
        kind: 'deposit',
        date: '02-04-2026 09:15:00',
        amount: '75.00',
        status: 'Approved',
        description: 'Deposit - Bank Transfer',
    },
    {
        id: 'wd-0',
        kind: 'withdrawal',
        date: '02-04-2026 11:20:00',
        amount: '180.00',
        status: 'Pending',
        description: 'Withdrawal - E-Wallet',
    },
    {
        id: 'dep-1',
        kind: 'deposit',
        date: '01-04-2026 10:11:00',
        amount: '50.00',
        status: 'Approved',
        description: 'Deposit - Bank Transfer',
    },
    {
        id: 'dep-2',
        kind: 'deposit',
        date: '31-03-2026 15:42:00',
        amount: '120.00',
        status: 'Approved',
        description: 'Deposit - E-Wallet',
    },
    {
        id: 'dep-3',
        kind: 'deposit',
        date: '30-03-2026 09:18:00',
        amount: '1,000.00',
        status: 'Pending',
        description: 'Deposit - Bank Transfer',
    },
    {
        id: 'dep-4',
        kind: 'deposit',
        date: '29-03-2026 21:04:00',
        amount: '250.00',
        status: 'Approved',
        description: 'Deposit - Quick Pay',
    },
    {
        id: 'dep-5',
        kind: 'deposit',
        date: '28-03-2026 13:27:00',
        amount: '80.00',
        status: 'Approved',
        description: 'Deposit - Bank Transfer',
    },
    {
        id: 'dep-6',
        kind: 'deposit',
        date: '27-03-2026 08:59:00',
        amount: '600.00',
        status: 'Rejected',
        description: 'Deposit - E-Wallet',
    },
    {
        id: 'wd-1',
        kind: 'withdrawal',
        date: '01-04-2026 16:47:00',
        amount: '300.00',
        status: 'Pending',
        description: 'Withdrawal - Bank Transfer',
    },
    {
        id: 'wd-2',
        kind: 'withdrawal',
        date: '31-03-2026 12:26:00',
        amount: '150.00',
        status: 'Approved',
        description: 'Withdrawal - E-Wallet',
    },
    {
        id: 'wd-3',
        kind: 'withdrawal',
        date: '29-03-2026 20:11:00',
        amount: '800.00',
        status: 'Rejected',
        description: 'Withdrawal - Bank Transfer',
    },
    {
        id: 'wd-4',
        kind: 'withdrawal',
        date: '28-03-2026 11:03:00',
        amount: '450.00',
        status: 'Approved',
        description: 'Withdrawal - Quick Pay',
    },
    {
        id: 'wd-5',
        kind: 'withdrawal',
        date: '27-03-2026 17:25:00',
        amount: '200.00',
        status: 'Pending',
        description: 'Withdrawal - Bank Transfer',
    },
    {
        id: 'wd-6',
        kind: 'withdrawal',
        date: '26-03-2026 09:48:00',
        amount: '1,200.00',
        status: 'Approved',
        description: 'Withdrawal - E-Wallet',
    },
];

/** Panel config keyed by page id (columns + date labels). */
export const HISTORY_RECORD_PANEL_CONFIG = {
    'transaction-record': {
        title: 'Transaction Record',
        startDateLabel: CLAIMDATE_LABELS.start,
        endDateLabel: CLAIMDATE_LABELS.end,
        columns: [
            { key: 'date', label: 'Date', align: 'left' },
            { key: 'amount', label: 'Amount', align: 'right' },
            { key: 'status', label: 'Status', align: 'left' },
            { key: 'description', label: 'Description', align: 'left' },
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
