import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Building2, Check, ChevronDown, HelpCircle, Info, Wallet } from 'lucide-react';
import fpxLogo from '../assets/fpx-logo.svg';
import eWalletImg from '../assets/e-wallet.png';
import instantDepositImg from '../assets/instant-deposit.png';
import CopyInputField from './security/CopyInputField';
import PaymentConfirmModal from './PaymentConfirmModal';
import ProcessingCountdownBanner from './ProcessingCountdownBanner';
import RolloverStatusCard from './RolloverStatusCard';
import CashierModeTabs from './payment/CashierModeTabs';
import PaymentFlowStepper from './payment/PaymentFlowStepper';
import ReceiptUploadField, { ReceiptPreviewModal, ReceiptFileCard } from './payment/ReceiptUploadField';
import { useActionNotifications } from '../context/ActionNotificationsContext';
import { PUSH_EVENT } from '../constants/pushNotificationCopy';
import { DEMO_ROLLOVER_STATUS } from '../constants/rolloverStatus';

const DEPOSIT_STEPS = [
    { id: 1, label: 'Choose Method' },
    { id: 2, label: 'Deposit' },
    { id: 3, label: 'Completed' },
];

const DEPOSIT_RELOAD_BANKS = [
    {
        id: 'aba',
        label: 'ABA BANK',
        min: 3,
        max: 100000,
        image: 'https://assets.cambodiachoice.com/v1/image/resize?url=%2Faba-bank-logo.png&width=384&quality=75&format=webp',
    },
    {
        id: 'wing',
        label: 'WING BANK',
        min: 3,
        max: 100000,
        image: 'https://assets.cambodiachoice.com/v1/image/resize?url=%2Fwing-bank-logo.svg&width=384&quality=75&format=webp',
    },
    {
        id: 'acleda',
        label: 'ACLEDA BANK',
        min: 3,
        max: 100000,
        image: 'https://assets.cambodiachoice.com/v1/image/resize?url=%2Facleda-bank-logo.jpg&width=384&quality=75&format=webp',
    },
];

const DEPOSIT_OPTION_TYPES = [
    { id: 'ewallet', label: 'E-Wallet', badge: '5 SEC', image: eWalletImg },
    { id: 'instant', label: 'Instant Deposit', image: instantDepositImg },
];

const TOUCH_N_GO_OPTIONS = [
    { id: 'tng', label: 'TNG', image: 'https://cdn.i8global.com/lb9/tng_small-202510170553571671.svg' },
];

const BONUS_INFO_DEFAULT = {
    rollover: '38x',
    claim: '1 Only',
    minDeposit: '50',
    percentageBonus: '288%',
    maxBonus: '1000',
    gameProviders: ['KA Gaming', 'YGR', 'Yggdrasil', 'Fat Panda', 'RelaxGaming', 'Pragmatic Play', 'AFB Slot', '568WinGames', 'AdvantPlay'],
};

const BONUS_OPTIONS = [
    { id: 'w288', label: 'Welcome Bonus 288% (Slots)', info: BONUS_INFO_DEFAULT },
    { id: 'w100s', label: 'Welcome Bonus 100% (Slots)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '100%', maxBonus: '500' } },
    { id: 'w100f', label: 'Welcome Bonus 100% (Fishing)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '100%' } },
    { id: 'w100sp', label: 'Welcome Bonus 100% (Sports)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '100%' } },
    { id: 'w100rl', label: 'Welcome Bonus 100% (RNG, Lottery)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '100%' } },
    { id: 'w50', label: 'Welcome Bonus 50% (Live Casino)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '50%', minDeposit: '30' } },
    { id: 'd70-10', label: 'Daily Bonus 70 - MYR 10 (Slots)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '70%', minDeposit: '10', maxBonus: '100' } },
    { id: 'd70-20', label: 'Daily Bonus 70 - MYR 20 (Slots)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '70%', minDeposit: '20', maxBonus: '200' } },
    { id: 'd70-40', label: 'Daily Bonus 70 - MYR 40 (Slots)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '70%', minDeposit: '40', maxBonus: '400' } },
    { id: 'dr10s', label: 'Daily Reload Bonus 10% (Slots)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '10%', rollover: '15x' } },
    { id: 'dr10l', label: 'Daily Reload Bonus 10% (Live Casino)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '10%', rollover: '15x' } },
    { id: 'dr10sp', label: 'Daily Reload Bonus 10% (Sports)', info: { ...BONUS_INFO_DEFAULT, percentageBonus: '10%', rollover: '15x' } },
];

const BANKS = [
    { id: 'affin', label: 'AFFIN BANK', image: 'https://cdn.i8global.com/lb9/affin-202504290525533163-202506170620081032.svg' },
    { id: 'alliance', label: 'ALLIANCE BANK', image: 'https://cdn.i8global.com/lb9/alliance-202504290525435488-202506170619387678.svg' },
    { id: 'ambank', label: 'AMBANK', image: 'https://cdn.i8global.com/lb9/ambank-202504290525160695-202506170618501744.svg' },
    { id: 'islam', label: 'BANK ISLAM', image: 'https://cdn.i8global.com/lb9/bankislam-202504290511437178-202506170618225212.svg' },
    { id: 'muamalat', label: 'Bank Muamalat', image: 'https://cdn.i8global.com/lb9/download-202511120751485725-202511190502581066.png' },
    { id: 'rakyat', label: 'BANK RAKYAT', image: 'https://cdn.i8global.com/lb9/brakyat-202504290511272701-202506170617527173.svg' },
    { id: 'bsn', label: 'BANK SIMPANAN NASIONAL', image: 'https://cdn.i8global.com/lb9/bsn-202504290511050175-202506170617232555.svg' },
    { id: 'cimb', label: 'CIMB', image: 'https://cdn.i8global.com/lb9/cimb%20thai-202308031239061464-202412231441264270-202506170616362890.png' },
    { id: 'hongleong', label: 'HONG LEONG BANK', image: 'https://cdn.i8global.com/lb9/hong%20leong%20bank-202307211346127077-202412231443043953-202506170547122116.png' },
    { id: 'hsbc', label: 'HSBC', image: 'https://cdn.i8global.com/lb9/hsbc-202307211348497167-202412231448456546-202506170546413237.png' },
    { id: 'maybank', label: 'MAYBANK', image: "https://cdn.i8global.com/lb9/mbb'-202504290507220417-202506170546160406.svg" },
    { id: 'ocbc', label: 'OCBC', image: 'https://cdn.i8global.com/lb9/ocbc-202504290507050668-202506170545581986.svg' },
    { id: 'public', label: 'PUBLIC BANK', image: 'https://cdn.i8global.com/lb9/pbe-202504290506535986-202506170545292269.svg' },
    { id: 'rhb', label: 'RHB', image: 'https://cdn.i8global.com/lb9/rhb-202504290506435286-202506170545039303.svg' },
    { id: 'standard', label: 'STANDARD CHARTERED BANK', image: 'https://cdn.i8global.com/lb9/standard-202504290506217726-202506170544281612.svg' },
    { id: 'uob', label: 'UOB', image: 'https://cdn.i8global.com/lb9/uob-202504290506049294-202506170544077762.svg' },
];

const CHANNELS = [
    { id: 'fpx1', label: 'FPX Channel 1', desc: 'Online Banking Payments' },
    { id: 'fpx2', label: 'FPX Channel 2', desc: 'Online Banking Payments' },
];

const NORMAL_BANK_ACCOUNTS = [
    { id: 'demo1', label: 'First Deposit Account demo - 188818881887', accountName: 'First Deposit Account demo', accountNumber: '188818881887', image: BANKS[0]?.image },
    { id: 'demo2', label: 'Maybank Deposit Account - 123456789012', accountName: 'Maybank Deposit Account', accountNumber: '123456789012', image: BANKS.find((b) => b.id === 'maybank')?.image },
    { id: 'demo3', label: 'CIMB Deposit Account - 987654321098', accountName: 'CIMB Deposit Account', accountNumber: '987654321098', image: BANKS.find((b) => b.id === 'cimb')?.image },
    { id: 'demo4', label: 'Public Bank Deposit Account - 555566667777', accountName: 'Public Bank Deposit Account', accountNumber: '555566667777', image: BANKS.find((b) => b.id === 'public')?.image },
];

const PRESET_AMOUNTS = [30, 50, 100, 200, 500, 1000];
const PROCESSING_COUNTDOWN_SECONDS = 5 * 60;
const MIN_AMOUNT = 20;
const MAX_AMOUNT = 10000;
const MIN_AMOUNT_NORMAL = 50;
const MAX_AMOUNT_NORMAL = 10000;

export default function DepositPage({ onNavigate }) {
    const { showTransactionNotification, showPushNotification } = useActionNotifications();
    const [step, setStep] = useState(1);
    const [depositSpeedTab, setDepositSpeedTab] = useState('normal');
    const [depositOptionType, setDepositOptionType] = useState('ewallet');
    const [reloadSelection, setReloadSelection] = useState('');
    const [selectedReloadBank, setSelectedReloadBank] = useState('');
    const [selectedNormalBankAccount, setSelectedNormalBankAccount] = useState('');
    const [remark, setRemark] = useState('');
    const [normalBankDropdownOpen, setNormalBankDropdownOpen] = useState(false);
    const [uploadedReceipt, setUploadedReceipt] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [receiptPreviewOpen, setReceiptPreviewOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [processingCountdown, setProcessingCountdown] = useState(null);
    const fileInputRef = useRef(null);
    const lastSubmittedAmountRef = useRef(null);
    const prevCountdownRef = useRef(null);

    const MAX_UPLOAD_SIZE = 2 * 1024 * 1024; // 2MB
    const receiptPreviewUrl = useMemo(() => (uploadedReceipt ? URL.createObjectURL(uploadedReceipt) : null), [uploadedReceipt]);

    useEffect(() => () => { if (receiptPreviewUrl) URL.revokeObjectURL(receiptPreviewUrl); }, [receiptPreviewUrl]);

    useEffect(() => {
        setReceiptPreviewOpen(false);
    }, [step]);
    const [claimBonus, setClaimBonus] = useState(false);
    const [selectedBonus, setSelectedBonus] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedTng, setSelectedTng] = useState('');
    const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
    const [bonusDropdownOpen, setBonusDropdownOpen] = useState(false);

    useEffect(() => {
        const syncBonusFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            const bonus = params.get('bonus');
            if (bonus && BONUS_OPTIONS.some((b) => b.id === bonus)) {
                setClaimBonus(true);
                setSelectedBonus(bonus);
            }
        };
        syncBonusFromUrl();
        window.addEventListener('popstate', syncBonusFromUrl);
        return () => window.removeEventListener('popstate', syncBonusFromUrl);
    }, []);

    const amountNum = parseFloat(amount) || 0;
    const isNormal = depositSpeedTab === 'normal';
    const minAmount = isNormal ? MIN_AMOUNT_NORMAL : MIN_AMOUNT;
    const maxAmount = isNormal ? MAX_AMOUNT_NORMAL : MAX_AMOUNT;
    const isValidAmount = amountNum >= minAmount && amountNum <= maxAmount;

    const addPreset = (val) => {
        setAmount(String((amountNum + val)));
    };

    const setPresetAmount = (val) => {
        setAmount(String(val));
    };

    const selectedNormalAccount = NORMAL_BANK_ACCOUNTS.find((a) => a.id === selectedNormalBankAccount);

    const selectedReloadBankOption = DEPOSIT_RELOAD_BANKS.find((b) => b.id === selectedReloadBank);
    const canProceedStep1 =
        ((reloadSelection === 'bank' && selectedReloadBank) || reloadSelection === 'ewallet')
        && !(claimBonus && !selectedBonus);

    const selectReloadBank = (bankId) => {
        setReloadSelection('bank');
        setSelectedReloadBank(bankId);
        setDepositSpeedTab('normal');
    };

    const toggleReloadBankSection = () => {
        if (reloadSelection === 'bank') {
            setReloadSelection('');
            return;
        }
        setReloadSelection('bank');
        setDepositSpeedTab('normal');
    };

    const toggleReloadEwalletSection = () => {
        if (reloadSelection === 'ewallet') {
            setReloadSelection('');
            return;
        }
        setReloadSelection('ewallet');
        setSelectedReloadBank('');
        setDepositSpeedTab('fast');
        setDepositOptionType('ewallet');
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setUploadError('');
        if (!file) {
            setUploadedReceipt(null);
            return;
        }
        if (file.size > MAX_UPLOAD_SIZE) {
            setUploadError('File size exceeds 2MB limit');
            setUploadedReceipt(null);
            e.target.value = '';
            return;
        }
        setUploadedReceipt(file);
        e.target.value = '';
    };

    const handleRemoveReceipt = () => {
        setUploadedReceipt(null);
        setUploadError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmitStep2 = () => {
        if (isValidAmount) setStep(3);
    };

    const handleConfirmPay = () => {
        setConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        lastSubmittedAmountRef.current = amountNum;
        showTransactionNotification({ kind: 'deposit', amount: amountNum });
        setConfirmModalOpen(false);
        setStep(1);
        setAmount('');
        setSelectedNormalBankAccount('');
        setUploadedReceipt(null);
        setRemark('');
        setSelectedBank('');
        setSelectedChannel('');
        setSelectedTng('');
        setClaimBonus(false);
        setSelectedBonus('');
        setReloadSelection('');
        setSelectedReloadBank('');
        setProcessingCountdown(PROCESSING_COUNTDOWN_SECONDS);
    };

    useEffect(() => {
        if (processingCountdown == null || processingCountdown <= 0) return undefined;
        const t = setInterval(() => {
            setProcessingCountdown((prev) => (prev <= 1 ? null : prev - 1));
        }, 1000);
        return () => clearInterval(t);
    }, [processingCountdown]);

    useEffect(() => {
        const prev = prevCountdownRef.current;
        if (prev != null && prev > 0 && processingCountdown === null && lastSubmittedAmountRef.current != null) {
            showPushNotification({
                event: PUSH_EVENT.DEPOSIT_SUCCESS,
                amount: lastSubmittedAmountRef.current,
            });
            lastSubmittedAmountRef.current = null;
        }
        prevCountdownRef.current = processingCountdown;
    }, [processingCountdown, showPushNotification]);

    const selectedBankLabel = selectedBank ? BANKS.find((b) => b.id === selectedBank)?.label ?? 'Select Bank Account' : 'Select Bank Account';
    const canSelectChannel = (depositOptionType === 'ewallet' && selectedTng) || (depositOptionType === 'instant' && selectedBank);
    const canProceedStep2 =
        isNormal
            ? selectedNormalBankAccount && isValidAmount && !!uploadedReceipt
            : canSelectChannel && selectedChannel && isValidAmount;
    const selectedChannelLabel = CHANNELS.find((c) => c.id === selectedChannel)?.label ?? '';
    const selectedChannelDesc = CHANNELS.find((c) => c.id === selectedChannel)?.desc ?? '';

    return (
        <div className="page-container cashier-flow-page">
            <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="page-title">Deposit / Withdrawal</h1>
                    <button
                        type="button"
                        onClick={() => onNavigate?.('help-center')}
                        className="cashier-help-link inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition"
                    >
                        <HelpCircle size={18} />
                        How to deposit?
                    </button>
                </div>
                <CashierModeTabs activeMode="deposit" onNavigate={onNavigate} />
            </div>

            <div className="mb-3 md:mb-4">
                <RolloverStatusCard status={DEMO_ROLLOVER_STATUS} variant="summary-inline" />
            </div>

            {processingCountdown != null && processingCountdown > 0 ? (
                <ProcessingCountdownBanner
                    secondsLeft={processingCountdown}
                    totalSeconds={PROCESSING_COUNTDOWN_SECONDS}
                    type="deposit"
                />
            ) : (
            <>
            <div className="mb-3 sm:mb-4">
                <PaymentFlowStepper
                    variant="cashier"
                    className="cashier-flow-stepper"
                    step={step}
                    steps={DEPOSIT_STEPS}
                />
            </div>

            <div className="surface-card overflow-visible rounded-2xl shadow-[var(--shadow-card-soft)]">
                {/* Step 1: Choose deposit type */}
                {step === 1 && (
                    <div className="cashier-deposit-step1 space-y-4 p-5 md:p-6">
                        <div className="flex items-start gap-3">
                            <span className="cashier-step-badge">1</span>
                            <div className="min-w-0 pt-0.5">
                                <h2 className="cashier-section-title text-base leading-snug md:text-lg">
                                    Select a reload option from the available options.
                                </h2>
                                <p className="cashier-section-subtitle mt-1 text-xs leading-snug md:text-sm">
                                    Choose one from the available options
                                </p>
                            </div>
                        </div>

                        <div
                            className={`cashier-method-section${reloadSelection === 'bank' ? ' is-selected is-expanded' : ''}`}
                        >
                            <button
                                type="button"
                                className="cashier-method-section-header cashier-method-section-toggle"
                                onClick={toggleReloadBankSection}
                                aria-expanded={reloadSelection === 'bank'}
                            >
                                <span className="cashier-method-section-icon" aria-hidden>
                                    <Building2 size={20} strokeWidth={2.25} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="cashier-method-section-title">Bank</p>
                                    <p className="cashier-method-section-subtitle">Normal Bank Transfer</p>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`cashier-method-section-chevron shrink-0${reloadSelection === 'bank' ? ' is-expanded' : ''}`}
                                    aria-hidden
                                />
                            </button>
                            {reloadSelection === 'bank' && (
                                <>
                                    <div className="cashier-method-section-divider" aria-hidden />
                                    <div className="cashier-bank-cards">
                                        {DEPOSIT_RELOAD_BANKS.map(({ id, label, min, max, image }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => selectReloadBank(id)}
                                                className={`cashier-bank-card${selectedReloadBank === id ? ' is-selected' : ''}`}
                                            >
                                                <img src={image} alt={label} className="cashier-bank-card-logo" />
                                                <span className="cashier-bank-card-body">
                                                    <span className="cashier-bank-card-label">{label}</span>
                                                    <span className="cashier-bank-card-range">{min} - {max.toLocaleString()}</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={toggleReloadEwalletSection}
                            aria-expanded={reloadSelection === 'ewallet'}
                            className={`cashier-method-section cashier-method-section-action w-full text-left${
                                reloadSelection === 'ewallet' ? ' is-selected is-expanded' : ''
                            }`}
                        >
                            <div className="cashier-method-section-header">
                                <span className="cashier-method-section-icon" aria-hidden>
                                    <Wallet size={20} strokeWidth={2.25} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="cashier-method-section-title">E-Wallet</p>
                                    <p className="cashier-method-section-subtitle">E-Wallet (Manual)</p>
                                </div>
                                <ChevronDown
                                    size={18}
                                    className={`cashier-method-section-chevron shrink-0${reloadSelection === 'ewallet' ? ' is-expanded' : ''}`}
                                    aria-hidden
                                />
                            </div>
                        </button>

                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={claimBonus}
                                onChange={(e) => setClaimBonus(e.target.checked)}
                                className="h-5 w-5 rounded border-[var(--color-border-subtle)] text-[var(--color-button-hover)] focus:ring-[var(--color-border-brand)]"
                            />
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Do you want to claim bonus?</span>
                        </label>

                        {claimBonus && (
                            <div>
                                <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Bonus <span className="text-[var(--color-danger)]">*</span></p>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setBonusDropdownOpen((o) => !o)}
                                        className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                    >
                                        <span className={selectedBonus ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}>
                                            {selectedBonus ? BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.label ?? 'Select Bonus' : 'Select Bonus'}
                                        </span>
                                        <ChevronDown size={18} className={`text-[var(--color-text-muted)] transition ${bonusDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {bonusDropdownOpen && (
                                        <>
                                            <div className="absolute inset-0 z-10" onClick={() => setBonusDropdownOpen(false)} aria-hidden />
                                            <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                {BONUS_OPTIONS.map((b) => (
                                                    <button
                                                        key={b.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBonus(b.id);
                                                            setBonusDropdownOpen(false);
                                                        }}
                                                        className="flex w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-input-light)]"
                                                    >
                                                        {b.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {claimBonus && selectedBonus && (() => {
                            const info = BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.info ?? BONUS_INFO_DEFAULT;
                            return (
                                <div className="rounded-xl border-2 border-dashed border-[var(--color-border-subtle)] bg-[var(--color-accent-pale)]/50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-button-hover)] text-[var(--color-text-card-text)]">
                                            <Info size={14} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-[var(--color-button-hover)]">Bonus Info</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Rollover :</span>
                                            <span className="text-[var(--color-text-primary)]">{info.rollover}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Claim :</span>
                                            <span className="text-[var(--color-text-primary)]">{info.claim}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Minimum Deposit :</span>
                                            <span className="text-[var(--color-text-primary)]">{info.minDeposit}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Percentage Bonus Reward :</span>
                                            <span className="text-[var(--color-text-primary)]">{info.percentageBonus}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Maximum Bonus :</span>
                                            <span className="text-[var(--color-text-primary)]">{info.maxBonus}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="shrink-0 font-medium text-[var(--color-text-muted)]">Game (Provider) :</span>
                                            <span className="font-bold text-[var(--color-text-primary)]">
                                                {info.gameProviders.join(', ')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={!canProceedStep1}
                            className="btn-theme-cta inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl px-6 text-base font-bold shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Next
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}

                {/* Step 2: Bank & Amount (combined) */}
                {step === 2 && (
                    <div className="cashier-flow-step space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="cashier-step-badge">2</span>
                            <div>
                                <h2 className="cashier-section-title text-base md:text-lg">
                                    {isNormal ? 'Bank Account & Amount' : 'Bank, Provider & Amount'}
                                </h2>
                                <p className="cashier-section-subtitle text-xs leading-snug md:text-sm">
                                    {isNormal ? 'Choose your bank account and enter the amount.' : 'Choose your bank, provider and enter the amount.'}
                                </p>
                            </div>
                        </div>

                        {isNormal ? (
                            <>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Bank Account <span className="text-[var(--color-danger)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setNormalBankDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {selectedNormalAccount ? (
                                                <span className="flex items-center gap-2.5">
                                                    {selectedNormalAccount.image ? (
                                                        <img src={selectedNormalAccount.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                    ) : (
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-light)]">
                                                            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                                                        </span>
                                                    )}
                                                    <span className="font-medium text-[var(--color-text-primary)]">{selectedNormalAccount.label}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-muted)]">Select Bank Account</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${normalBankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {normalBankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setNormalBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {NORMAL_BANK_ACCOUNTS.map((a) => (
                                                        <button
                                                            key={a.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedNormalBankAccount(a.id);
                                                                setNormalBankDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-input-light)]"
                                                        >
                                                            {a.image ? (
                                                                <img src={a.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                            ) : (
                                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-success-light)]">
                                                                    <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                                                                </span>
                                                            )}
                                                            <span className="font-normal text-[var(--color-text-primary)]">{a.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {selectedNormalAccount && (
                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <CopyInputField value={selectedNormalAccount.accountName} label="" />
                                            <CopyInputField value={selectedNormalAccount.accountNumber} label="" />
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Bank <span className="text-[var(--color-danger)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setBankDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {depositOptionType === 'ewallet' && selectedTng ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img
                                                        src={TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.image}
                                                        alt=""
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                    <span className="font-medium text-[var(--color-text-primary)]">
                                                        {TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.label}
                                                    </span>
                                                </span>
                                            ) : depositOptionType === 'instant' && selectedBank && BANKS.find((b) => b.id === selectedBank)?.image ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img
                                                        src={BANKS.find((b) => b.id === selectedBank)?.image}
                                                        alt=""
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                    <span className="font-medium text-[var(--color-text-primary)]">{selectedBankLabel}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-muted)]">Select Bank Account</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {bankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[500px] overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {depositOptionType === 'ewallet' ? (
                                                        TOUCH_N_GO_OPTIONS.map((t) => (
                                                            <button
                                                                key={t.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedTng(t.id);
                                                                    setBankDropdownOpen(false);
                                                                }}
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-input-light)]"
                                                            >
                                                                <img src={t.image} alt={t.label} className="h-6 w-6 shrink-0 object-contain" />
                                                                <span className="font-normal text-[var(--color-text-primary)]">{t.label}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        BANKS.map((b) => (
                                                            <button
                                                                key={b.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedBank(b.id);
                                                                    setBankDropdownOpen(false);
                                                                }}
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-input-light)]"
                                                            >
                                                                <img src={b.image} alt={b.label} className="h-6 w-6 shrink-0 object-contain" />
                                                                <span className="font-normal text-[var(--color-text-primary)]">{b.label}</span>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={canSelectChannel ? '' : 'opacity-60'}>
                                    <p className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
                                        Provider Channel <span className="text-[var(--color-danger)]">*</span>
                                        {!canSelectChannel && (
                                            <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">(Select a bank first)</span>
                                        )}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                        {CHANNELS.map(({ id, label, desc }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                disabled={!canSelectChannel}
                                                onClick={() => canSelectChannel && setSelectedChannel(id)}
                                                className={`cashier-channel-card relative flex min-h-[8.5rem] flex-col items-center gap-2 rounded-xl border p-3 text-center transition sm:min-h-0 sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:text-left ${
                                                    selectedChannel === id ? 'is-selected' : ''
                                                } ${!canSelectChannel ? 'cursor-not-allowed' : ''}`}
                                            >
                                                {selectedChannel === id && (
                                                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-button-hover)] text-[var(--color-text-card-text)] sm:right-3 sm:top-3 sm:h-6 sm:w-6">
                                                        <Check size={12} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                                <img
                                                    src={fpxLogo}
                                                    alt="FPX"
                                                    className="h-8 w-auto shrink-0 object-contain sm:h-10"
                                                />
                                                <div className="min-w-0 flex-1 sm:text-left">
                                                    <p className="border-b border-[var(--color-border-subtle)] pb-1 text-xs font-bold leading-snug text-[var(--color-text-primary)] sm:pb-1.5 sm:text-sm">
                                                        {label}
                                                    </p>
                                                    <p className="mt-1 line-clamp-3 text-xs leading-snug text-[var(--color-text-muted)] sm:mt-1.5 sm:line-clamp-none">
                                                        {desc}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Amount <span className="text-[var(--color-danger)]">*</span></p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex flex-1 overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] shadow-[var(--shadow-subtle)]">
                                    <span className="flex items-center justify-center bg-[var(--color-accent-glow)] px-4 text-sm font-bold text-[var(--color-button-hover)]">
                                        MYR
                                    </span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        min={minAmount}
                                        max={maxAmount}
                                        className="h-12 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_AMOUNTS.map((val) => {
                                        const isActive = amountNum === val;
                                        return (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => (isNormal ? setPresetAmount(val) : addPreset(val))}
                                                className={`cashier-preset-chip rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${
                                                    isActive ? 'is-active' : ''
                                                }`}
                                            >
                                                +{val}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <p className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${isNormal ? 'italic text-[var(--color-button-hover)]' : 'text-[var(--color-text-muted)]'}`}>
                                {isNormal && <Info size={14} className="shrink-0 text-[var(--color-button-hover)]" />}
                                Min/Max Limit {minAmount.toFixed(2)} / {maxAmount.toLocaleString()}
                            </p>
                            {!isValidAmount && amount && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)]">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {amountNum < minAmount
                                        ? `Minimum amount is MYR ${minAmount.toFixed(2)}`
                                        : `Maximum amount is MYR ${maxAmount.toLocaleString()}`
                                    }
                                </p>
                            )}
                        </div>

                        {isNormal && (
                            <>
                                <div>
                                    <ReceiptUploadField
                                        file={uploadedReceipt}
                                        previewUrl={receiptPreviewUrl}
                                        onFileChange={handleFileChange}
                                        onRemove={handleRemoveReceipt}
                                        fileInputRef={fileInputRef}
                                        onPreview={() => setReceiptPreviewOpen(true)}
                                        error={uploadError}
                                    />
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Remark</p>
                                    <input
                                        type="text"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Optional remark"
                                        className="h-12 w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-brand)] focus:ring-2 focus:ring-[var(--color-border-brand)]/20"
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-6 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)]"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitStep2}
                                disabled={!canProceedStep2}
                                className="btn-theme-cta inline-flex h-12 min-w-[140px] items-center justify-center gap-2 rounded-xl px-6 text-base font-bold shadow-sm transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Transaction Summary */}
                {step === 3 && (
                    <div className="cashier-flow-step space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="cashier-step-badge">3</span>
                            <div>
                                <h2 className="cashier-section-title text-base md:text-lg">
                                    {isNormal ? 'Confirm & Submit' : 'Transaction Summary'}
                                </h2>
                                <p className="cashier-section-subtitle text-xs leading-snug md:text-sm">
                                    {isNormal ? 'Review your deposit details and submit.' : 'Review your deposit details before confirming.'}
                                </p>
                            </div>
                        </div>

                        <div className="cashier-summary-card overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
                            <div className="cashier-summary-card__header border-b px-5 py-3">
                                <p className="cashier-summary-card__header-label text-xs font-bold uppercase tracking-wide">Payment Details</p>
                            </div>
                            <div className="divide-y divide-[var(--color-border-subtle)]">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">Deposit Type</span>
                                    <span className="cashier-summary-card__row-value text-sm font-semibold">
                                        {reloadSelection === 'bank' ? 'Bank' : reloadSelection === 'ewallet' ? 'E-Wallet' : '—'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">Deposit Option</span>
                                    <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                        {reloadSelection === 'bank' && selectedReloadBankOption?.image && (
                                            <img src={selectedReloadBankOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {reloadSelection === 'ewallet' && (
                                            <img src={eWalletImg} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {reloadSelection === 'bank'
                                            ? (selectedReloadBankOption?.label ?? 'Bank Transfer')
                                            : reloadSelection === 'ewallet'
                                                ? 'E-Wallet (Manual)'
                                                : (isNormal ? 'Normal Deposit' : (DEPOSIT_OPTION_TYPES.find((o) => o.id === depositOptionType)?.label ?? depositOptionType))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">{isNormal ? 'Bank Account' : 'Bank'}</span>
                                    <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                        {isNormal && selectedNormalAccount?.image && (
                                            <img src={selectedNormalAccount.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {!isNormal && depositOptionType === 'ewallet' && selectedTng && TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.image && (
                                            <img src={TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {!isNormal && depositOptionType === 'instant' && selectedBank && BANKS.find((b) => b.id === selectedBank)?.image && (
                                            <img src={BANKS.find((b) => b.id === selectedBank)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {isNormal
                                            ? (selectedNormalAccount?.label ?? '—')
                                            : depositOptionType === 'ewallet'
                                                ? TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.label ?? 'TNG'
                                                : selectedBankLabel}
                                    </span>
                                </div>
                                {!isNormal && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="cashier-summary-card__row-label text-sm font-medium">Channel</span>
                                        <span className="cashier-summary-card__row-value text-right text-sm font-semibold">
                                            {selectedChannelLabel}
                                            <span className="block text-xs font-normal text-[var(--color-text-muted)]">{selectedChannelDesc}</span>
                                        </span>
                                    </div>
                                )}
                                {claimBonus && selectedBonus && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="cashier-summary-card__row-label text-sm font-medium">Bonus</span>
                                        <span className="text-sm font-semibold text-[var(--color-success)]">
                                            {BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.label ?? 'Selected'}
                                        </span>
                                    </div>
                                )}
                                {isNormal && remark && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="cashier-summary-card__row-label text-sm font-medium">Remark</span>
                                        <span className="cashier-summary-card__row-value text-sm font-semibold">{remark}</span>
                                    </div>
                                )}
                                {isNormal && uploadedReceipt && receiptPreviewUrl && (
                                    <div className="px-5 py-4">
                                        <span className="cashier-summary-card__row-label mb-3 block text-sm font-medium">Upload receipt</span>
                                        <ReceiptFileCard
                                            file={uploadedReceipt}
                                            previewUrl={receiptPreviewUrl}
                                            onPreview={() => setReceiptPreviewOpen(true)}
                                            showRemove={false}
                                            className="border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)]/50"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="cashier-summary-card__total border-t-2 px-5 py-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="cashier-summary-card__total-label text-sm font-bold">Total Amount</span>
                                    <span className="cashier-summary-card__total-value text-xl font-bold">
                                        RM {amountNum.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-6 text-sm font-bold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-subtle)]"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmPay}
                                className="btn-theme-cta inline-flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-xl px-6 text-base font-bold shadow-sm transition hover:scale-[1.02]"
                            >
                                {isNormal ? 'Confirm & Submit' : 'Confirm & Pay'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-6 text-center text-xs font-medium text-[var(--color-text-muted)]">
                Transactions are encrypted for your protection.
            </p>
            </>
            )}

            <PaymentConfirmModal
                open={confirmModalOpen}
                onClose={handleCloseConfirmModal}
                type="deposit"
            />

            <ReceiptPreviewModal
                open={receiptPreviewOpen && !!uploadedReceipt && !!receiptPreviewUrl}
                onClose={() => setReceiptPreviewOpen(false)}
                file={uploadedReceipt}
                previewUrl={receiptPreviewUrl}
            />
        </div>
    );
}
