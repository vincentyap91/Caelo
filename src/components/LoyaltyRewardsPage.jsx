import React from 'react';
import LoyaltyRewardsSection from './LoyaltyRewardsSection';

export default function LoyaltyRewardsPage() {
    return (
        <div className="page-container">
            <h1 className="page-title mb-8">Rewards</h1>
            <LoyaltyRewardsSection embedInPage />
        </div>
    );
}
