const STORAGE_KEY = 'riocity_recent_notifications_v1';
const MAX_ITEMS = 40;

export const TRANSACTION_NOTIFICATION_COPY = {
    deposit: {
        title: 'Deposit',
        message: 'We are processing your deposit. You will be notified when your balance updates.',
    },
    withdrawal: {
        title: 'Withdrawal',
        message: 'We are processing your withdrawal. This may take a few minutes.',
    },
};

export function loadRecentNotifications() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

/** Append a transaction-line item (newest first). Safe to call even when push toasts are off. */
export function recordTransactionNotification({ kind }) {
    if (kind !== 'deposit' && kind !== 'withdrawal') return;
    const copy = TRANSACTION_NOTIFICATION_COPY[kind];
    if (!copy) return;

    const entry = {
        id: `${Date.now()}-${kind}-${Math.random().toString(36).slice(2, 10)}`,
        kind,
        title: copy.title,
        message: copy.message,
        status: 'ongoing',
        createdAt: new Date().toISOString(),
    };

    try {
        const prev = loadRecentNotifications();
        const next = [entry, ...prev].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('riocity-recent-notifications-updated'));
    } catch {
        /* quota */
    }
}

export function clearRecentNotifications() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('riocity-recent-notifications-updated'));
    } catch {
        /* ignore */
    }
}

export function formatNotificationTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 10) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;

    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;

    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
