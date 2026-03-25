import React from 'react';
import RewardsSection from './RewardsSection';

export default function RewardsPage() {
    return (
        <div className="page-container">
            <h1 className="page-title mb-8">Rewards</h1>
            <RewardsSection embedInPage />
        </div>
    );
}
