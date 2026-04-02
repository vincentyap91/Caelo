import React, { useState } from 'react';
import SecurityTabs from './security/SecurityTabs';
import TwoFactorPanel from './security/TwoFactorPanel';
import PasswordResetPanel from './security/PasswordResetPanel';

const SECURITY_TABS = [
    { id: '2fa', label: 'Two Factor Authentication' },
    { id: 'password', label: 'Password Reset' },
];

export default function SecurityPage({ authUser }) {
    const [activeTab, setActiveTab] = useState('2fa');
    const accountName = authUser?.name || authUser?.username || 'your account';

    return (
        <div className="page-container">
            <h1 className="page-title mb-8">Security</h1>

            <div className="mb-8">
                <SecurityTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={SECURITY_TABS}
                />
            </div>

            <div className="min-h-[320px]">
                {activeTab === '2fa' && <TwoFactorPanel accountName={accountName} />}
                {activeTab === 'password' && <PasswordResetPanel />}
            </div>
        </div>
    );
}
