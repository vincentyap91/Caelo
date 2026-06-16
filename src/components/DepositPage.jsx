import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Building2, Check, ChevronDown, Clock, Copy, HelpCircle, Upload, Wallet } from 'lucide-react';
import eWalletImg from '../assets/e-wallet.png';
import PaymentConfirmModal from './PaymentConfirmModal';
import ProcessingCountdownBanner from './ProcessingCountdownBanner';
import RolloverStatusCard from './RolloverStatusCard';
import CashierModeTabs from './payment/CashierModeTabs';
import PaymentFlowStepper from './payment/PaymentFlowStepper';
import { ReceiptPreviewModal, ReceiptFileCard } from './payment/ReceiptUploadField';
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

const DEPOSIT_RELOAD_EWALLETS = [
    {
        id: 'wing-weluy',
        label: 'WING WELUY',
        min: 3,
        max: 100000,
        image: 'https://assets.cambodiachoice.com/v1/image/resize?url=%2Fwing-bank-logo.svg&width=384&quality=75&format=webp',
    },
    {
        id: 'true-money',
        label: 'TRUE MONEY',
        min: 3,
        max: 100000,
        image: eWalletImg,
    },
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

/** Instant vs normal deposit — top tabs on step 1 (Caelo cashier-speed-tab). */
const DEPOSIT_SPEED_TABS = [
    { id: 'fast', label: 'Instant Payment', time: '~1 Mins' },
    { id: 'normal', label: 'Normal Deposit', time: '~5 Mins' },
];

const NORMAL_DEPOSIT_PRESETS = [5, 10, 50, 100, 500, 1000];
const CASHIER_CURRENCY = 'USD';
const DEMO_BALANCE = 0;
const PROCESSING_COUNTDOWN_SECONDS = 5 * 60;
const MIN_AMOUNT = 20;
const MAX_AMOUNT = 10000;
const MIN_AMOUNT_NORMAL = 3;
const MAX_AMOUNT_NORMAL = 100000;

const DESTINATION_BANK_ACCOUNTS = {
    aba: { bankName: 'ABA BANK', accountNumber: '013374386', accountName: 'CHON NAM' },
    wing: { bankName: 'WING BANK', accountNumber: '012345678', accountName: 'CHON NAM' },
    acleda: { bankName: 'ACLEDA BANK', accountNumber: '987654321', accountName: 'CHON NAM' },
};

const DESTINATION_EWALLET_ACCOUNTS = {
    'wing-weluy': { providerName: 'WING WELUY', accountNumber: '098765432', accountName: 'CHON NAM' },
    'true-money': { providerName: 'TRUE MONEY', accountNumber: '087654321', accountName: 'CHON NAM' },
};

function CopyDestValue({ value }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };
    return (
        <span className="cashier-step2-dest-value">
            {value}
            <button type="button" className="cashier-step2-copy-btn" onClick={handleCopy} aria-label="Copy">
                {copied ? <Check size={14} className="text-[var(--color-success)]" /> : <Copy size={14} />}
            </button>
        </span>
    );
}

export default function DepositPage({ onNavigate }) {
    const { showTransactionNotification, showPushNotification } = useActionNotifications();
    const [step, setStep] = useState(1);
    const [depositSpeedTab, setDepositSpeedTab] = useState('fast');
    const [reloadSelection, setReloadSelection] = useState('ewallet');
    const [selectedReloadBank, setSelectedReloadBank] = useState('');
    const [remark, setRemark] = useState('');
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
    const [amount, setAmount] = useState('');
    const [selectedReloadEwallet, setSelectedReloadEwallet] = useState('');

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
    const selectedReloadBankOption = DEPOSIT_RELOAD_BANKS.find((b) => b.id === selectedReloadBank);
    const selectedReloadEwalletOption = DEPOSIT_RELOAD_EWALLETS.find((e) => e.id === selectedReloadEwallet);
    const selectedStep2MethodOption = isNormal ? selectedReloadBankOption : selectedReloadEwalletOption;
    const destinationAccount = isNormal && selectedReloadBank
        ? DESTINATION_BANK_ACCOUNTS[selectedReloadBank]
        : !isNormal && selectedReloadEwallet
            ? DESTINATION_EWALLET_ACCOUNTS[selectedReloadEwallet]
            : null;
    const minAmount = selectedStep2MethodOption
        ? selectedStep2MethodOption.min
        : isNormal ? MIN_AMOUNT_NORMAL : MIN_AMOUNT;
    const maxAmount = selectedStep2MethodOption
        ? selectedStep2MethodOption.max
        : isNormal ? MAX_AMOUNT_NORMAL : MAX_AMOUNT;
    const step2Methods = isNormal ? DEPOSIT_RELOAD_BANKS : DEPOSIT_RELOAD_EWALLETS;
    const selectedStep2MethodId = isNormal ? selectedReloadBank : selectedReloadEwallet;
    const isValidAmount = amountNum >= minAmount && amountNum <= maxAmount;

    const setPresetAmount = (val) => {
        setAmount(String(val));
    };

    const selectReloadBank = (bankId) => {
        setReloadSelection('bank');
        setSelectedReloadBank(bankId);
        setSelectedReloadEwallet('');
        setDepositSpeedTab('normal');
        setStep(2);
    };

    const selectReloadEwallet = (ewalletId) => {
        setReloadSelection('ewallet');
        setSelectedReloadEwallet(ewalletId);
        setSelectedReloadBank('');
        setDepositSpeedTab('fast');
        setStep(2);
    };

    const toggleReloadBankSection = () => {
        if (reloadSelection === 'bank') {
            setReloadSelection('');
            return;
        }
        setReloadSelection('bank');
        setSelectedReloadEwallet('');
        setDepositSpeedTab('normal');
    };

    const toggleReloadEwalletSection = () => {
        if (reloadSelection === 'ewallet') {
            setReloadSelection('');
            return;
        }
        setReloadSelection('ewallet');
        setSelectedReloadBank('');
        setSelectedReloadEwallet('');
        setDepositSpeedTab('fast');
    };

    const selectDepositSpeedTab = (id) => {
        setDepositSpeedTab(id);
        if (id === 'normal') {
            setReloadSelection('bank');
            setSelectedReloadBank('');
            setSelectedReloadEwallet('');
        } else {
            setReloadSelection('ewallet');
            setSelectedReloadBank('');
            setSelectedReloadEwallet('');
        }
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
        setUploadedReceipt(null);
        setRemark('');
        setClaimBonus(false);
        setSelectedBonus('');
        setReloadSelection('');
        setSelectedReloadBank('');
        setSelectedReloadEwallet('');
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

    const selectBankOnStep2 = (bankId) => {
        setSelectedReloadBank(bankId);
        setReloadSelection('bank');
    };

    const selectEwalletOnStep2 = (ewalletId) => {
        setSelectedReloadEwallet(ewalletId);
        setReloadSelection('ewallet');
    };

    const selectStep2Method = (methodId) => {
        if (isNormal) selectBankOnStep2(methodId);
        else selectEwalletOnStep2(methodId);
    };

    const canProceedStep2 = isNormal
        ? selectedStep2MethodId && isValidAmount && !!uploadedReceipt
        : selectedStep2MethodId && isValidAmount;

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

            <div className="cashier-flow-surface-card surface-card overflow-visible rounded-2xl">
                {/* Step 1: Choose deposit type */}
                {step === 1 && (
                    <div className="cashier-deposit-step1-card">
                        <div className="cashier-deposit-step1-card__speed-tabs" role="tablist" aria-label="Deposit speed">
                            {DEPOSIT_SPEED_TABS.map(({ id, label, time }, idx) => {
                                const isActive = depositSpeedTab === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => selectDepositSpeedTab(id)}
                                        className={`cashier-speed-tab min-w-0 flex-1 px-3 py-2.5 text-center transition sm:px-6 sm:py-4 ${
                                            idx === 0 ? 'rounded-tl-2xl' : 'rounded-tr-2xl'
                                        }${isActive ? ' is-active' : ''}`}
                                    >
                                        <p className="text-sm font-bold leading-tight sm:text-base sm:leading-normal">{label}</p>
                                        <p className="cashier-speed-tab-sub mt-0.5 flex items-center justify-center gap-0.5 text-xs leading-tight sm:mt-1 sm:gap-1 sm:leading-normal">
                                            <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
                                            {time}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

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

                        {depositSpeedTab === 'normal' && (
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
                        )}

                        {depositSpeedTab === 'fast' && (
                        <div
                            className={`cashier-method-section${reloadSelection === 'ewallet' ? ' is-selected is-expanded' : ''}`}
                        >
                            <button
                                type="button"
                                className="cashier-method-section-header cashier-method-section-toggle"
                                onClick={toggleReloadEwalletSection}
                                aria-expanded={reloadSelection === 'ewallet'}
                            >
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
                            </button>
                            {reloadSelection === 'ewallet' && (
                                <>
                                    <div className="cashier-method-section-divider" aria-hidden />
                                    <div className="cashier-bank-cards">
                                        {DEPOSIT_RELOAD_EWALLETS.map(({ id, label, min, max, image }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => selectReloadEwallet(id)}
                                                className={`cashier-bank-card${selectedReloadEwallet === id ? ' is-selected' : ''}`}
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
                        )}
                    </div>
                    </div>
                )}

                {/* Step 2: Method & Amount (normal bank transfer + instant e-wallet) */}
                {step === 2 && (
                    <div className="cashier-flow-step cashier-step2-normal p-5 md:p-6">
                        <div className="flex items-start gap-3">
                            <span className="cashier-step-badge">2</span>
                            <div className="min-w-0 pt-0.5">
                                <h2 className="cashier-section-title text-base md:text-lg">
                                    {isNormal ? 'Normal Bank Transfer' : 'E-Wallet'}
                                </h2>
                                <p className="cashier-section-subtitle mt-1 text-xs leading-snug md:text-sm">
                                    Please Select or Enter Deposit Amount
                                </p>
                            </div>
                        </div>

                        <button type="button" onClick={() => setStep(1)} className="cashier-step2-back">
                            Back
                        </button>

                        <div className="cashier-step2-meta">
                            <div className="cashier-step2-meta-row">
                                <span>Balance</span>
                                <span>{DEMO_BALANCE.toFixed(2)}</span>
                            </div>
                            <div className="cashier-step2-meta-row">
                                <span>Min Deposit</span>
                                <span>{minAmount}</span>
                            </div>
                        </div>

                        {isNormal && (
                        <div className="cashier-step2-notes">
                            <p className="cashier-step2-notes-title">Notes :</p>
                            <p>Upload a screenshot of your payment receipt to notify us of your payment.</p>
                        </div>
                        )}

                        <div>
                            <h3 className="cashier-step2-section-title">{isNormal ? 'Select Bank' : 'Select E-Wallet'}</h3>
                            <div className="cashier-bank-cards">
                                {step2Methods.map(({ id, label, min, max, image }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => selectStep2Method(id)}
                                        className={`cashier-bank-card${selectedStep2MethodId === id ? ' is-selected' : ''}`}
                                    >
                                        <img src={image} alt={label} className="cashier-bank-card-logo" />
                                        <span className="cashier-bank-card-label">{label}</span>
                                        <span className="cashier-bank-card-range">{min} - {max.toLocaleString()}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="cashier-step2-section-title">Please Select or Enter Deposit Amount</h3>
                            <div className="cashier-step2-preset-grid">
                                {NORMAL_DEPOSIT_PRESETS.map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setPresetAmount(val)}
                                        className={`cashier-step2-preset-btn${amountNum === val ? ' is-active' : ''}`}
                                    >
                                        {val >= 1000 ? '1k' : val}
                                    </button>
                                ))}
                            </div>
                            <div className="cashier-step2-currency-input">
                                <span className="cashier-step2-currency-prefix">{CASHIER_CURRENCY}</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder={`Enter the amount (${CASHIER_CURRENCY} ${minAmount} - ${CASHIER_CURRENCY} ${maxAmount.toLocaleString()})`}
                                    min={minAmount}
                                    max={maxAmount}
                                />
                            </div>
                            <p className="cashier-step2-limit-hint">
                                {CASHIER_CURRENCY} {minAmount} - {CASHIER_CURRENCY} {maxAmount.toLocaleString()}
                            </p>
                            {!isValidAmount && amount && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)]">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {amountNum < minAmount
                                        ? `Minimum amount is ${CASHIER_CURRENCY} ${minAmount}`
                                        : `Maximum amount is ${CASHIER_CURRENCY} ${maxAmount.toLocaleString()}`
                                    }
                                </p>
                            )}
                        </div>

                        <div className="cashier-step2-amount-display">
                            <span className="cashier-step2-amount-display-label">Deposit Amount</span>
                            <div className="cashier-step2-amount-display-row">
                                <span className="cashier-step2-currency-prefix cashier-step2-currency-prefix--display">{CASHIER_CURRENCY}</span>
                                <span className="cashier-step2-amount-display-value">{amountNum.toFixed(2)}</span>
                            </div>
                        </div>

                        {destinationAccount && (
                            <div className="cashier-step2-dest-card">
                                <div className="cashier-step2-dest-row">
                                    <span className="cashier-step2-dest-label">{isNormal ? 'Bank Name' : 'E-Wallet'}</span>
                                    <span className="cashier-step2-dest-value">
                                        {isNormal ? destinationAccount.bankName : destinationAccount.providerName}
                                    </span>
                                </div>
                                <div className="cashier-step2-dest-row">
                                    <span className="cashier-step2-dest-label">Account Number</span>
                                    <CopyDestValue value={destinationAccount.accountNumber} />
                                </div>
                                <div className="cashier-step2-dest-row">
                                    <span className="cashier-step2-dest-label">Account Name</span>
                                    <CopyDestValue value={destinationAccount.accountName} />
                                </div>
                            </div>
                        )}

                        {isNormal && (
                        <div>
                            <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">
                                Reference / Transaction ID (Optional)
                            </p>
                            <input
                                type="text"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                placeholder="Reference / Transaction ID (Optional)"
                                className="cashier-step2-form-input"
                            />
                        </div>
                        )}

                        {isNormal && (
                        <div className="cashier-step2-upload-wrap">
                            <p className="cashier-step2-upload-label">
                                Upload a screenshot or PDF of your payment receipt to notify us of your payment <span className="text-[var(--color-danger)]">*</span>
                            </p>
                            <input ref={fileInputRef} type="file" accept="image/*,.pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                            {!uploadedReceipt ? (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cashier-step2-upload-trigger"
                                >
                                    <Upload size={18} strokeWidth={2.25} />
                                    Tap to upload file
                                </button>
                            ) : (
                                <ReceiptFileCard
                                    file={uploadedReceipt}
                                    previewUrl={receiptPreviewUrl}
                                    onPreview={() => setReceiptPreviewOpen(true)}
                                    onRemove={handleRemoveReceipt}
                                />
                            )}
                            {uploadError && (
                                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)]">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {uploadError}
                                </p>
                            )}
                        </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmitStep2}
                            disabled={!canProceedStep2}
                            className="cashier-step2-submit"
                        >
                            Submit
                        </button>
                    </div>
                )}

                {/* Step 3: Transaction Summary */}
                {step === 3 && (
                    <div className="cashier-flow-step space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="cashier-step-badge">3</span>
                            <div>
                                <h2 className="cashier-section-title text-base md:text-lg">Confirm & Submit</h2>
                                <p className="cashier-section-subtitle text-xs leading-snug md:text-sm">
                                    Review your deposit details and submit.
                                </p>
                            </div>
                        </div>

                        <div className="cashier-summary-card overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-tertiery)] shadow-[var(--shadow-card-soft)]">
                            <div className="cashier-summary-card__header border-b px-5 py-3">
                                <p className="cashier-summary-card__header-label text-xs font-bold uppercase tracking-wide">Payment Details</p>
                            </div>
                            <div className="divide-y divide-[var(--color-border-subtle)]">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">Deposit Type</span>
                                    <span className="cashier-summary-card__row-value text-sm font-semibold">
                                        {DEPOSIT_SPEED_TABS.find((t) => t.id === depositSpeedTab)?.label ?? depositSpeedTab}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">Deposit Option</span>
                                    <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                        {reloadSelection === 'bank' && selectedReloadBankOption?.image && (
                                            <img src={selectedReloadBankOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {reloadSelection === 'ewallet' && selectedReloadEwalletOption?.image && (
                                            <img src={selectedReloadEwalletOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {reloadSelection === 'bank'
                                            ? (selectedReloadBankOption?.label ?? 'Bank Transfer')
                                            : (selectedReloadEwalletOption?.label ?? 'E-Wallet')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">
                                        {isNormal ? 'Bank' : 'E-Wallet'}
                                    </span>
                                    <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                        {isNormal && selectedReloadBankOption?.image && (
                                            <img src={selectedReloadBankOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {!isNormal && selectedReloadEwalletOption?.image && (
                                            <img src={selectedReloadEwalletOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {isNormal
                                            ? (selectedReloadBankOption?.label ?? '—')
                                            : (selectedReloadEwalletOption?.label ?? '—')}
                                    </span>
                                </div>
                                {claimBonus && selectedBonus && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="cashier-summary-card__row-label text-sm font-medium">Bonus</span>
                                        <span className="text-sm font-semibold text-[var(--color-success)]">
                                            {BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.label ?? 'Selected'}
                                        </span>
                                    </div>
                                )}
                                {remark && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="cashier-summary-card__row-label text-sm font-medium">Reference</span>
                                        <span className="cashier-summary-card__row-value text-sm font-semibold">{remark}</span>
                                    </div>
                                )}
                                {uploadedReceipt && receiptPreviewUrl && (
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
                                        {CASHIER_CURRENCY} {amountNum.toLocaleString()}
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
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="cashier-flow-page__footer-note">
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
