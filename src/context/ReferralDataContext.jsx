import React, { createContext, useContext, useState } from 'react';

const ReferralDataContext = createContext(null);

const MOCK_SHARED_DOWNLINES = [
    {
        id: '1',
        username: 'damrefer',
        contact: '********112',
        joinedAt: '2025-10-15',
        registerDate: '2025-10-15 08:32:00',
        createdDate: '15-10-2025',
        totalDeposit: 'PKR 1,200',
        deposit: '500.00',
        commission: 'PKR 36.00',
        active: true,
        remark: '',
    },
    {
        id: '2',
        username: 'player_beta',
        contact: '********901',
        joinedAt: '2025-11-02',
        registerDate: '2025-11-02 14:20:00',
        createdDate: '02-11-2025',
        totalDeposit: 'PKR 800',
        deposit: '120.00',
        commission: 'PKR 24.00',
        active: false,
        remark: '',
    },
];

export function ReferralDataProvider({ children }) {
    const [totalCommissionBonus, setTotalCommissionBonus] = useState('PKR 0.000');
    const [totalDepositBonus, setTotalDepositBonus] = useState('PKR 0.000');
    const [downlines, setDownlines] = useState(MOCK_SHARED_DOWNLINES);

    function handleSaveRemark(id, remark) {
        setDownlines((prev) => prev.map((d) => (d.id === id ? { ...d, remark } : d)));
    }

    const value = {
        totalCommissionBonus,
        totalDepositBonus,
        setTotalCommissionBonus,
        setTotalDepositBonus,
        downlines,
        handleSaveRemark,
    };

    return (
        <ReferralDataContext.Provider value={value}>
            {children}
        </ReferralDataContext.Provider>
    );
}

export function useReferralData() {
    const ctx = useContext(ReferralDataContext);
    if (!ctx) {
        return {
            totalCommissionBonus: 'PKR 0.000',
            totalDepositBonus: 'PKR 0.000',
            setTotalCommissionBonus: () => {},
            setTotalDepositBonus: () => {},
            downlines: [],
            handleSaveRemark: () => {},
        };
    }
    return ctx;
}
