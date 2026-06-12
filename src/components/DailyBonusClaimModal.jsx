import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import UniversalModal from './ui/UniversalModal';
import CheckInCongratsModal from './CheckInCongratsModal';
import CheckInTicketIcon from './icons/CheckInTicketIcon';
import {
    DAILY_CHECKIN_CYCLE_DAYS,
    getDailyCheckInDaysFromStorage,
    saveDailyCheckInClaim,
} from '../constants/dailyCheckIn';

function DailyBonusDayCard({ day }) {
    const isFinished = day.status === 'claimed';
    const isActive = day.status === 'claimable';
    const isUpcoming = !isFinished && !isActive;

    const cardClass = [
        'daily-bonus-claim-modal__day-card',
        isFinished && 'is-finished',
        isActive && 'is-active',
        isUpcoming && 'is-upcoming',
    ]
        .filter(Boolean)
        .join(' ');

    const stateLabel = isFinished ? 'claimed' : isActive ? 'active today' : 'upcoming';

    return (
        <article
            className={cardClass}
            data-state={isFinished ? 'finished' : isActive ? 'active' : 'upcoming'}
            aria-label={`${day.label}, ${day.reward}, ${stateLabel}`}
            aria-current={isActive ? 'step' : undefined}
        >
            <span className="daily-bonus-claim-modal__day-pill">{day.label}</span>
            <CheckInTicketIcon
                className={`daily-bonus-claim-modal__day-ticket daily-bonus-claim-modal__day-ticket--${
                    isFinished ? 'finished' : isActive ? 'active' : 'upcoming'
                }`}
            />
            <p className="daily-bonus-claim-modal__day-reward">{day.reward}</p>
        </article>
    );
}

/**
 * Daily Bonus Claim — Figma 12win / 459:7976
 * UniversalModal shell + color/popup/* + color/surface/check-in/* semantics (§13.11).
 */
export default function DailyBonusClaimModal({
    open,
    onClose,
    guestPreview = false,
    onLoginClick,
}) {
    const [days, setDays] = useState(() => getDailyCheckInDaysFromStorage());
    const [congratsAmount, setCongratsAmount] = useState(null);

    useEffect(() => {
        if (open) {
            setDays(getDailyCheckInDaysFromStorage());
        }
    }, [open]);

    const todayIdx = days.findIndex((d) => d.status === 'claimable');
    const todayDay = todayIdx >= 0 ? days[todayIdx] : null;
    const remainingDays = useMemo(
        () => days.filter((d) => d.status !== 'claimed').length,
        [days]
    );

    const handleCheckIn = () => {
        if (guestPreview) {
            onLoginClick?.();
            return;
        }
        if (todayIdx < 0) return;

        const reward = days[todayIdx].reward;
        const nextClaimedThrough = days[todayIdx].day;
        setDays((prev) =>
            prev.map((d, i) => (i === todayIdx ? { ...d, status: 'claimed' } : d))
        );
        saveDailyCheckInClaim(nextClaimedThrough);
        setCongratsAmount(reward);
        onClose?.();
    };

    return (
        <>
            <UniversalModal
                isOpen={open}
                onClose={onClose}
                type="custom"
                title="Daily Bonus Claim"
                ariaLabel="Daily Bonus Claim"
                containerClassName="daily-bonus-claim-modal max-w-[700px]"
                headerClassName="daily-bonus-claim-modal__header"
                contentClassName="daily-bonus-claim-modal__content !p-0"
            >
                <div className="daily-bonus-claim-modal__body">
                    <div className="daily-bonus-claim-modal__meta">
                        <p className="daily-bonus-claim-modal__refresh">
                            <Clock className="daily-bonus-claim-modal__refresh-icon" strokeWidth={2} aria-hidden />
                            Refresh Time: Daily 00:00 - 23:59 GMT+7
                        </p>
                        <p className="daily-bonus-claim-modal__remaining">
                            You have{' '}
                            <span className="daily-bonus-claim-modal__remaining-count">{remainingDays}</span>
                            {' '}days remaining to claim.
                        </p>
                    </div>

                    <div
                        className="daily-bonus-claim-modal__grid"
                        role="list"
                        aria-label={`${DAILY_CHECKIN_CYCLE_DAYS}-day daily bonus rewards`}
                    >
                        {days.map((day) => (
                            <div key={day.id} role="listitem">
                                <DailyBonusDayCard day={day} />
                            </div>
                        ))}
                    </div>

                    <div className="daily-bonus-claim-modal__actions">
                        <button
                            type="button"
                            onClick={handleCheckIn}
                            disabled={!guestPreview && !todayDay}
                            className="daily-bonus-claim-modal__cta universal-modal-btn-primary w-full"
                        >
                            {guestPreview ? 'Login to Check In' : 'Check In Now'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="daily-bonus-claim-modal__close-link"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </UniversalModal>

            {!guestPreview && (
                <CheckInCongratsModal
                    open={Boolean(congratsAmount)}
                    amount={congratsAmount}
                    onClose={() => setCongratsAmount(null)}
                />
            )}
        </>
    );
}
