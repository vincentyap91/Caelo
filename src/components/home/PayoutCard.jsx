import React from 'react';
import { RECENT_PAYOUT_CARD_CLASS } from '../../constants/homeSections';
import { navigateToGameDetail } from '../../utils/gameDetailRoutes';

/**
 * Recent payout card — staging payout-list item (200×220 desktop).
 */
export default function PayoutCard({ item, onNavigate }) {
    const handleOpen = () => {
        if (item.provider && onNavigate) {
            navigateToGameDetail(onNavigate, item.game, item.provider);
        }
    };

    return (
        <article className={`${RECENT_PAYOUT_CARD_CLASS} bg-[var(--color-surface-panel)]`}>
            <button
                type="button"
                onClick={handleOpen}
                className="flex h-full w-full flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary-card-title)]"
                aria-label={`${item.game}, paid ${item.amount}`}
            >
                <div className="recent-payout-card__thumb">
                    {item.imgUrl ? (
                        <img src={item.imgUrl} alt="" loading="lazy" decoding="async" />
                    ) : null}
                </div>
                <div className="recent-payout-card__details">
                    <p className="recent-payout-card__title text-[var(--color-text-primary)]">{item.game}</p>
                    <p className="recent-payout-card__user text-[var(--color-text-primary)]">{item.user}</p>
                    <p className="recent-payout-card__amount text-[var(--color-text-recent-amount)]">{item.amount}</p>
                </div>
            </button>
        </article>
    );
}
