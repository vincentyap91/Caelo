const STORAGE_KEY = 'riocity_notification_prefs_v1';

const DEFAULTS = {
    email: true,
    push: true,
    sms: true,
};

export function loadNotificationPreferences() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULTS };
        const parsed = JSON.parse(raw);
        return {
            ...DEFAULTS,
            ...parsed,
        };
    } catch {
        return { ...DEFAULTS };
    }
}

export function saveNotificationPreferences(prefs) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
        /* ignore quota */
    }
}

/** Used before showing in-app push-style toasts */
export function isPushNotificationsEnabled() {
    return loadNotificationPreferences().push === true;
}
