import React from 'react';
import RewardsSection from './RewardsSection';

export default function RewardsPage({ guestPreview = false, onLoginClick }) {
    return (
        <div className="page-container">
            <h1 className="page-title mb-8">Rewards</h1>
            <RewardsSection embedInPage guestPreview={guestPreview} onLoginClick={onLoginClick} />
        </div>
    );
}
