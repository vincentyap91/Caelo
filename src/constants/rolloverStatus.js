export const DEMO_ROLLOVER_STATUS = {
    title: 'Deposit Rollover',
    targetAmount: 1200,
    completedAmount: 460,
    remainingAmount: 740,
    latestQualifiedAmount: 100,
    updatedAt: '24 Mar 2026, 4:14 PM',
    requirementMet: false,
};

export function getRolloverProgressPercent(status = DEMO_ROLLOVER_STATUS) {
    if (status?.requirementMet) return 100;

    const target = Number(status?.targetAmount) || 0;
    const completed = Number(status?.completedAmount) || 0;

    if (target <= 0) return 0;
    return Math.min(100, Math.max(0, (completed / target) * 100));
}

export function formatRolloverAmount(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return '0.00';

    return amount.toLocaleString('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
