import React, { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Bell, Inbox, Loader2 } from 'lucide-react';
import { loadNotificationPreferences, saveNotificationPreferences } from '../utils/notificationPreferences';
import {
    clearRecentNotifications,
    formatNotificationTime,
    loadRecentNotifications,
} from '../utils/recentNotifications';

const NOTIFICATION_OPTIONS = [
    { id: 'email', label: 'Allow E-Mail Notifications' },
    { id: 'push', label: 'Allow Push Notifications' },
    { id: 'sms', label: 'Allow SMS Notifications' },
];

const RECENT_UPDATED = 'riocity-recent-notifications-updated';

function ToggleRow({ label, checked, onChange }) {
    return (
        <div className="surface-card flex min-h-[56px] items-center justify-between gap-4 rounded-2xl px-4 py-4 transition hover:border-[var(--color-accent-200)] md:px-6">
            <span className="text-sm font-medium text-[var(--color-text-strong)] md:text-base">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    checked
                        ? 'bg-[var(--color-success-main)]'
                        : 'bg-[var(--color-border-default)] hover:bg-[var(--color-accent-200)]'
                }`}
            >
                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
                        checked ? 'left-[22px]' : 'left-1'
                    }`}
                />
            </button>
        </div>
    );
}

function RecentNotificationCard({ item }) {
    const Icon =
        item.kind === 'deposit'
            ? ArrowDownToLine
            : item.kind === 'withdrawal'
              ? ArrowUpFromLine
              : Bell;
    const status = item.status ?? 'ongoing';
    const isLive = status === 'ongoing';
    const statusLabel =
        typeof status === 'string' && ['success', 'error', 'warning', 'info'].includes(status)
            ? status
            : isLive
              ? 'ongoing'
              : String(status);

    return (
        <div className="surface-card flex gap-4 rounded-2xl px-4 py-4 transition hover:border-[var(--color-accent-200)] md:px-5 md:py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                <Icon size={20} strokeWidth={2.25} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-bold text-[var(--color-text-strong)] md:text-base">{item.title}</p>
                    <time
                        className="shrink-0 text-xs font-semibold text-[var(--color-text-soft)]"
                        dateTime={item.createdAt}
                    >
                        {formatNotificationTime(item.createdAt)}
                    </time>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-muted)] md:text-sm">{item.message}</p>
                <div
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                        status === 'success'
                            ? 'bg-[rgb(220_252_231)] text-[var(--color-success-main)]'
                            : status === 'error'
                              ? 'bg-[rgb(254_226_226)] text-[var(--color-danger-main)]'
                              : status === 'warning'
                                ? 'bg-[rgb(254_249_195)] text-[var(--color-hot-main)]'
                                : 'bg-[var(--color-accent-100)] text-[var(--color-accent-700)]'
                    }`}
                >
                    {isLive ? <Loader2 size={12} className="animate-spin" aria-hidden /> : null}
                    {isLive ? 'Pending' : statusLabel}
                </div>
            </div>
        </div>
    );
}

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState(() => loadNotificationPreferences());
    const [recent, setRecent] = useState(() => loadRecentNotifications());

    useEffect(() => {
        const sync = () => setRecent(loadRecentNotifications());
        sync();
        window.addEventListener(RECENT_UPDATED, sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener(RECENT_UPDATED, sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const handleToggle = (id) => {
        setPreferences((prev) => {
            const next = { ...prev, [id]: !prev[id] };
            if (id === 'push' && next.push && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission().catch(() => {});
            }
            saveNotificationPreferences(next);
            return next;
        });
    };

    const handleClearRecent = () => {
        clearRecentNotifications();
        setRecent([]);
    };

    return (
        <div className="page-container">
            <h1 className="page-title mb-6 md:mb-8">Notifications</h1>

            <section aria-labelledby="notifications-prefs-heading">
                <h2 id="notifications-prefs-heading" className="sr-only">
                    Notification channel preferences
                </h2>
                <div className="space-y-4">
                    {NOTIFICATION_OPTIONS.map(({ id, label }) => (
                        <ToggleRow
                            key={id}
                            label={label}
                            checked={preferences[id]}
                            onChange={() => handleToggle(id)}
                        />
                    ))}
                </div>
            </section>

            <section className="mt-10 md:mt-12" aria-labelledby="recent-notifications-heading">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-muted)] text-[var(--color-accent-600)]">
                            <Bell size={18} strokeWidth={2.25} aria-hidden />
                        </span>
                        <h2
                            id="recent-notifications-heading"
                            className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl"
                        >
                            Recent notifications
                        </h2>
                    </div>
                    {recent.length > 0 ? (
                        <button
                            type="button"
                            onClick={handleClearRecent}
                            className="text-sm font-semibold text-[var(--color-accent-600)] transition hover:text-[var(--color-accent-700)]"
                        >
                            Clear all
                        </button>
                    ) : null}
                </div>

                {recent.length === 0 ? (
                    <div className="surface-card flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center md:py-16">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-text-soft)]">
                            <Inbox size={28} strokeWidth={1.75} aria-hidden />
                        </span>
                        <p className="mt-4 text-sm font-semibold text-[var(--color-text-strong)] md:text-base">
                            No recent notifications
                        </p>
                        <p className="mt-2 max-w-sm text-xs leading-relaxed text-[var(--color-text-muted)] md:text-sm">
                            Deposit and withdrawal updates will appear here after you submit a transaction.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 md:space-y-4">
                        {recent.map((item) => (
                            <RecentNotificationCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}


