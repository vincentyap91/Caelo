import { MessageCircle } from 'lucide-react';
import rewardButtonImage from '../assets/reward.png';

// Keep this label as a plain string for easier future multilingual updates.
const CLAIM_REWARDS_LABEL = 'Rewards';

export default function FloatingSocials({ authUser, onLiveChatClick, onClaimRewardsClick, className = '' }) {
    const unreadCount = 2;
    const showRewardsButton = Boolean(authUser);

    return (
        <>
            {/* Mobile: Rewards only (after login) */}
            {showRewardsButton && (
                <button
                    type="button"
                    onClick={onClaimRewardsClick}
                    className="claim-rewards-pulse fixed bottom-24 right-4 z-[130] inline-flex h-[72px] w-[72px] items-center justify-center transition-all hover:brightness-105 active:scale-95 md:hidden"
                    aria-label={CLAIM_REWARDS_LABEL}
                    title={CLAIM_REWARDS_LABEL}
                >
                    <img
                        src={rewardButtonImage}
                        alt={CLAIM_REWARDS_LABEL}
                        className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                    />
                    <span className="pointer-events-none absolute bottom-[11px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold leading-none text-[rgb(133_72_20)]">
                        {CLAIM_REWARDS_LABEL}
                    </span>
                </button>
            )}

            {/* Desktop: Rewards + Live chat stack */}
            <div className={`fixed bottom-20 md:bottom-6 right-5 z-[130] hidden md:flex flex-col gap-3 items-center ${className}`.trim()}>
                {showRewardsButton && (
                    <button
                        type="button"
                        onClick={onClaimRewardsClick}
                        className="claim-rewards-pulse relative inline-flex h-[82px] w-[82px] items-center justify-center hover:brightness-105 transition-all hover:scale-105 active:scale-95"
                        aria-label={CLAIM_REWARDS_LABEL}
                        title={CLAIM_REWARDS_LABEL}
                    >
                        <img
                            src={rewardButtonImage}
                            alt={CLAIM_REWARDS_LABEL}
                            className="h-full w-full object-contain drop-shadow-[0_8px_14px_rgba(0,0,0,0.2)]"
                        />
                        <span className="pointer-events-none absolute bottom-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[12px] font-bold leading-none text-[rgb(133_72_20)]">
                            {CLAIM_REWARDS_LABEL}
                        </span>
                    </button>
                )}

                {/* Live Chat - Bottom */}
                <button
                    type="button"
                    onClick={onLiveChatClick}
                    className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-brand-deep)_100%)] text-white shadow-[var(--shadow-nav-pill)] transition hover:brightness-110"
                    title="Live Chat"
                    aria-label="Open live chat"
                >
                    <MessageCircle size={24} />
                    <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 -translate-y-1 translate-x-1 items-center justify-center rounded-full bg-[var(--color-danger-main)] px-1 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                </button>
            </div>
        </>
    );
}

