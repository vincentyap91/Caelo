/**
 * Primary promotion CTA: guests → register; members → deposit (optional pre-selected bonus).
 * Pair with `PromotionCtaButton` or call from other promotion UIs.
 *
 * @param {object} params
 * @param {object|null} params.authUser
 * @param {function(string, object|undefined): void} params.onNavigate
 * @param {{ claimDepositBonusId?: string }} params.promotion
 */
export function runPromotionPrimaryCta({ authUser, onNavigate, promotion }) {
    if (!onNavigate) return;
    if (!authUser) {
        onNavigate('register');
        return;
    }
    const bonusId = promotion?.claimDepositBonusId;
    if (bonusId) {
        onNavigate('deposit', { depositBonusId: bonusId });
    } else {
        onNavigate('deposit');
    }
}
