export const DAILY_CHECKIN_CYCLE_DAYS = 10;
export const DAILY_CHECKIN_CURRENT_DAY = 1;
export const DAILY_CHECKIN_STORAGE_KEY = 'caelo-daily-check-in-v1';

/** Figma 459:7976 — Daily Bonus Claim Modal reward ladder */
export function rewardForDay(day) {
    if (day <= 5) return 'USD 1';
    if (day <= 8) return 'USD 2';
    if (day === 9) return 'USD 3';
    if (day === 10) return 'USD 5';
    return `USD ${day}`;
}

export function buildDailyCheckinDays(
    total = DAILY_CHECKIN_CYCLE_DAYS,
    currentDay = DAILY_CHECKIN_CURRENT_DAY,
    claimedThrough = 0
) {
    return Array.from({ length: total }, (_, i) => {
        const day = i + 1;
        let status = 'locked';
        if (day <= claimedThrough) status = 'claimed';
        else if (day === currentDay) status = 'claimable';
        return {
            id: `d${day}`,
            day,
            label: `Day ${day}`,
            reward: rewardForDay(day),
            status,
        };
    });
}

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

export function loadDailyCheckInState() {
    if (typeof localStorage === 'undefined') {
        return { claimedThrough: 0, lastClaimDate: null };
    }
    try {
        const raw = localStorage.getItem(DAILY_CHECKIN_STORAGE_KEY);
        if (!raw) return { claimedThrough: 0, lastClaimDate: null };
        const parsed = JSON.parse(raw);
        return {
            claimedThrough: Number(parsed.claimedThrough) || 0,
            lastClaimDate: parsed.lastClaimDate || null,
        };
    } catch {
        return { claimedThrough: 0, lastClaimDate: null };
    }
}

export function saveDailyCheckInClaim(claimedThrough) {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(
            DAILY_CHECKIN_STORAGE_KEY,
            JSON.stringify({ claimedThrough, lastClaimDate: todayKey() })
        );
    } catch {
        /* ignore quota errors */
    }
}

export function shouldPromptDailyBonusClaim() {
    const { lastClaimDate } = loadDailyCheckInState();
    return lastClaimDate !== todayKey();
}

export function getDailyCheckInDaysFromStorage() {
    const { claimedThrough } = loadDailyCheckInState();
    const currentDay = Math.min(claimedThrough + 1, DAILY_CHECKIN_CYCLE_DAYS);
    return buildDailyCheckinDays(DAILY_CHECKIN_CYCLE_DAYS, currentDay, claimedThrough);
}
