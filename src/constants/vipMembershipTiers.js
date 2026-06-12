import normalMedal from '../assets/Normal.png';
import bronzeMedal from '../assets/bronze.png';
import silverMedal from '../assets/silver.png';
import goldMedal from '../assets/gold.png';
import platinumMedal from '../assets/platinum.png';
import diamondMedal from '../assets/diamond.png';

const TRANSACTION_PRIORITY_LABELS = {
    0: 'Low Priority',
    1: 'High Priority',
    2: 'First Priority',
};

const REBATE_ROWS = [
    { key: 'rebateSport', label: 'Sport' },
    { key: 'rebateCasino', label: 'Live Casino' },
    { key: 'rebateSlot', label: 'Slot' },
    { key: 'rebateFish', label: 'Fish Hunt' },
    { key: 'rebateESport', label: 'ESport' },
];

function formatVipAmount(value) {
    if (value == null || Number(value) === 0) {
        return '0';
    }

    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

function formatWithdrawalLimit(maxWithdrawalAmount) {
    if (!maxWithdrawalAmount || Number(maxWithdrawalAmount) === 0) {
        return 'No Limit';
    }

    return formatVipAmount(maxWithdrawalAmount);
}

function formatDepositRequirement(obtainMinDeposit, isDefault) {
    if (isDefault && Number(obtainMinDeposit) === 0) {
        return 'First Deposit';
    }

    if (!obtainMinDeposit || Number(obtainMinDeposit) === 0) {
        return 'N/A';
    }

    return `$${formatVipAmount(obtainMinDeposit)}`;
}

function formatRetentionRequirement(maintainDeposit) {
    if (!maintainDeposit || Number(maintainDeposit) === 0) {
        return 'N/A';
    }

    return `$${formatVipAmount(maintainDeposit)}`;
}

function formatMembershipRenewal(isDowngrable) {
    return isDowngrable ? 'Monthly' : 'Lifetime';
}

function mapTierRecord(record) {
    const { vipModel } = record;
    const tierName = (vipModel.name || vipModel.defaultName || '').trim();

    return {
        id: tierName,
        tier: tierName,
        medal: {
            Normal: normalMedal,
            Bronze: bronzeMedal,
            Silver: silverMedal,
            Gold: goldMedal,
            Platinum: platinumMedal,
            Diamond: diamondMedal,
        }[tierName],
        benefits: [
            {
                label: 'Deposits and Withdrawals',
                value: TRANSACTION_PRIORITY_LABELS[record.vipModel.transactionPriority] ?? 'High Priority',
            },
            {
                label: 'Daily Withdrawal Limitation',
                value: formatWithdrawalLimit(record.maxWithdrawalAmount),
            },
            {
                label: 'Birthday Bonus',
                value: formatVipAmount(record.birthdayBonus),
            },
        ],
        rebates: REBATE_ROWS.map(({ key, label }) => ({
            label,
            value: `${formatVipAmount(record[key])}%`,
        })),
        requirements: [
            {
                label: 'Monthly Level Upgrade Requirement',
                value: formatDepositRequirement(record.obtainMinDeposit, record.isDefault),
            },
            {
                label: 'Monthly Level Retention Requirement',
                value: formatRetentionRequirement(record.maintainDeposit),
            },
            {
                label: 'Membership Renewal',
                value: formatMembershipRenewal(record.isDowngrable),
            },
        ],
    };
}

/** Tier data aligned with 12winkh.vip /Member/RetrieveAllVipCriteriaByCompany */
const VIP_CRITERIA = [
    {
        isDefault: true,
        maxWithdrawalAmount: 0,
        birthdayBonus: 0,
        rebateCasino: 5,
        rebateSlot: 5,
        rebateSport: 5,
        rebateFish: 5,
        rebateESport: 5,
        maintainDeposit: 0,
        isDowngrable: false,
        obtainMinDeposit: 0,
        vipModel: { name: 'Normal', transactionPriority: 1 },
    },
    {
        isDefault: false,
        maxWithdrawalAmount: 20000,
        birthdayBonus: 58,
        rebateCasino: 6,
        rebateSlot: 6,
        rebateSport: 6,
        rebateFish: 6,
        rebateESport: 6,
        maintainDeposit: 0,
        isDowngrable: false,
        obtainMinDeposit: 15000,
        vipModel: { name: 'Bronze', transactionPriority: 1 },
    },
    {
        isDefault: false,
        maxWithdrawalAmount: 30000,
        birthdayBonus: 188,
        rebateCasino: 7,
        rebateSlot: 7,
        rebateSport: 7,
        rebateFish: 7,
        rebateESport: 7,
        maintainDeposit: 0,
        isDowngrable: false,
        obtainMinDeposit: 30000,
        vipModel: { name: 'Silver', transactionPriority: 1 },
    },
    {
        isDefault: false,
        maxWithdrawalAmount: 50000,
        birthdayBonus: 388,
        rebateCasino: 8,
        rebateSlot: 8,
        rebateSport: 8,
        rebateFish: 8,
        rebateESport: 8,
        maintainDeposit: 0,
        isDowngrable: true,
        obtainMinDeposit: 50000,
        vipModel: { name: 'Gold', transactionPriority: 1 },
    },
    {
        isDefault: false,
        maxWithdrawalAmount: 80000,
        birthdayBonus: 588,
        rebateCasino: 9,
        rebateSlot: 9,
        rebateSport: 9,
        rebateFish: 9,
        rebateESport: 9,
        maintainDeposit: 0,
        isDowngrable: true,
        obtainMinDeposit: 80000,
        vipModel: { name: 'Platinum', transactionPriority: 1 },
    },
    {
        isDefault: false,
        maxWithdrawalAmount: 100000,
        birthdayBonus: 888,
        rebateCasino: 10,
        rebateSlot: 10,
        rebateSport: 10,
        rebateFish: 10,
        rebateESport: 10,
        maintainDeposit: 0,
        isDowngrable: true,
        obtainMinDeposit: 100000,
        vipModel: { name: 'Diamond', transactionPriority: 1 },
    },
];

export const VIP_MEMBERSHIP_TIERS = VIP_CRITERIA.map(mapTierRecord);

export const VIP_MEMBERSHIP_TABS = [
    { id: 'benefits', label: 'Membership Benefits' },
    { id: 'requirements', label: 'Requirements' },
];
