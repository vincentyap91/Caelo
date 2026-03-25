/**
 * Client session persistence for demo auth. Real backends should use secure cookies + refresh tokens.
 * Session expires 24 hours after login (not extended on page refresh).
 */

const STORAGE_KEY = 'riocity_auth_session_v1';

/** One day from login */
export const AUTH_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

function readRaw() {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || typeof data.expiresAt !== 'number' || !data.user) return null;
        return data;
    } catch {
        return null;
    }
}

/** @returns {boolean} true if missing or past expiry */
export function isAuthSessionExpired() {
    const data = readRaw();
    if (!data) return true;
    return Date.now() >= data.expiresAt;
}

/** @returns {object|null} user object or null */
export function loadAuthSession() {
    const data = readRaw();
    if (!data) return null;
    if (Date.now() >= data.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
    }
    return data.user;
}

/** Persist login; expiry is set to now + AUTH_SESSION_DURATION_MS */
export function saveAuthSession(user) {
    if (typeof window === 'undefined' || !user) return;
    const payload = {
        user,
        expiresAt: Date.now() + AUTH_SESSION_DURATION_MS,
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // quota / private mode
    }
}

export function clearAuthSession() {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}
