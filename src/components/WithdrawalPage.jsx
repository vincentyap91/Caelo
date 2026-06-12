import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Building2, ChevronDown, HelpCircle, Wallet } from 'lucide-react';
import PaymentConfirmModal from './PaymentConfirmModal';
import RolloverRequirementModal from './RolloverRequirementModal';
import ProcessingCountdownBanner from './ProcessingCountdownBanner';
import RolloverStatusCard from './RolloverStatusCard';
import CashierModeTabs from './payment/CashierModeTabs';
import PaymentFlowStepper from './payment/PaymentFlowStepper';
import { useActionNotifications } from '../context/ActionNotificationsContext';
import { PUSH_EVENT } from '../constants/pushNotificationCopy';
import { DEMO_ROLLOVER_STATUS, getRolloverProgressPercent } from '../constants/rolloverStatus';

const WITHDRAWAL_STEPS = [
    { id: 1, label: 'Choose Method' },
    { id: 2, label: 'Withdrawal' },
    { id: 3, label: 'Completed' },
];

const WITHDRAWAL_METHODS = [
    { id: 'bank', label: 'Bank Transfer', subtitle: 'Normal Bank Transfer', icon: Building2 },
    { id: 'ewallet', label: 'E-Wallet', subtitle: null, icon: Wallet },
];

const E_WALLET_OPTIONS = [
    { id: 'bkash', label: 'Bkash', image: 'https://pksoftcdn.azureedge.net/media/bkash-202502091728502140-202503251036219126.png', min: 100, max: 1000 },
    { id: 'jazzcash', label: 'Jazzcash', image: 'https://pksoftcdn.azureedge.net/media/jazzcash_wicon-202505081346058397.png', min: 100, max: 10000 },
    { id: 'easypaisa', label: 'EasyPaisa', image: 'https://pksoftcdn.azureedge.net/media/easypaisa_wicon-202505140932274142.png', min: 100, max: 1000 },
    { id: 'other', label: 'Other Wallet', image: 'https://pksoftcdn.azureedge.net/media/600x400-202602121348375675.png', min: 1, max: 999999 },
];

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
const CASHIER_CURRENCY = 'USD';
const DEMO_BALANCE = 0;
const PROCESSING_COUNTDOWN_SECONDS = 5 * 60;

const WITHDRAWAL_BANKS = [
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

export default function WithdrawalPage({ onNavigate, navigationState }) {
    const { showTransactionNotification, showPushNotification } = useActionNotifications();
    const rolloverStatus = DEMO_ROLLOVER_STATUS;
    const isRolloverRequirementMet = rolloverStatus.requirementMet;
    const [step, setStep] = useState(1);
    const [withdrawalMethod, setWithdrawalMethod] = useState('ewallet');
    const [selectedEwallet, setSelectedEwallet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [bankAccountName, setBankAccountName] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
    const [ewalletDropdownOpen, setEwalletDropdownOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [rolloverWarningOpen, setRolloverWarningOpen] = useState(false);
    const [processingCountdown, setProcessingCountdown] = useState(null);
    const lastSubmittedAmountRef = useRef(null);
    const prevCountdownRef = useRef(null);

    const amountNum = parseFloat(amount) || 0;
    const selectedEwalletOption = E_WALLET_OPTIONS.find((e) => e.id === selectedEwallet);
    const selectedWithdrawalBank = WITHDRAWAL_BANKS.find((b) => b.id === selectedBank);
    const minAmount = withdrawalMethod === 'ewallet' && selectedEwalletOption
        ? selectedEwalletOption.min
        : selectedWithdrawalBank?.min ?? 3;
    const maxAmount = withdrawalMethod === 'ewallet' && selectedEwalletOption
        ? selectedEwalletOption.max
        : selectedWithdrawalBank?.max ?? 100000;
    const isValidAmount = amountNum >= minAmount && amountNum <= maxAmount;

    const addPreset = (val) => {
        setAmount(String((amountNum + val)));
    };

    const setPresetAmount = (val) => {
        setAmount(String(val));
    };

    const selectedBankLabel = selectedBank
        ? WITHDRAWAL_BANKS.find((b) => b.id === selectedBank)?.label ?? 'Please Select Bank'
        : 'Please Select Bank';

    const canProceedStep1 = true;
    const canProceedStep2 = withdrawalMethod === 'ewallet'
        ? selectedEwallet && phoneNumber.trim().length > 0 && isValidAmount
        : selectedBank && bankAccountName.trim() && bankAccountNumber.trim() && isValidAmount && DEMO_BALANCE > 0;

    const handleConfirmWithdraw = () => {
        if (!isRolloverRequirementMet) {
            setRolloverWarningOpen(true);
            return;
        }
        setConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        lastSubmittedAmountRef.current = amountNum;
        showTransactionNotification({ kind: 'withdrawal', amount: amountNum });
        setConfirmModalOpen(false);
        setStep(1);
        setAmount('');
        setWithdrawalMethod('ewallet');
        setSelectedEwallet('');
        setPhoneNumber('');
        setSelectedBank('');
        setBankAccountName('');
        setBankAccountNumber('');
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
                event: PUSH_EVENT.WITHDRAWAL_SUCCESS,
                amount: lastSubmittedAmountRef.current,
            });
            lastSubmittedAmountRef.current = null;
        }
        prevCountdownRef.current = processingCountdown;
    }, [processingCountdown, showPushNotification]);

    useEffect(() => {
        if (navigationState?.openRolloverModal && !isRolloverRequirementMet) {
            setRolloverWarningOpen(true);
        }
    }, [navigationState, isRolloverRequirementMet]);

    return (
        <div className="page-container cashier-flow-page">
            <PaymentConfirmModal
                open={confirmModalOpen}
                onClose={handleCloseConfirmModal}
                type="withdrawal"
            />
            <RolloverRequirementModal
                open={rolloverWarningOpen}
                onClose={() => setRolloverWarningOpen(false)}
                progressSectionTitle={`${rolloverStatus.title} Progress`}
                progressPercent={getRolloverProgressPercent(rolloverStatus)}
                latestTopUpBonus={rolloverStatus.latestQualifiedAmount}
                latestEventAt={rolloverStatus.updatedAt}
                remainingCurrent={rolloverStatus.remainingAmount}
                remainingTarget={rolloverStatus.targetAmount}
            />
            <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <h1 className="page-title">Deposit / Withdrawal</h1>
                    <button
                        type="button"
                        onClick={() => onNavigate?.('help-center')}
                        className="cashier-help-link inline-flex shrink-0 items-center gap-2 text-sm font-semibold transition"
                    >
                        <HelpCircle size={18} />
                        How to withdraw?
                    </button>
                </div>
                <CashierModeTabs activeMode="withdrawal" onNavigate={onNavigate} />
            </div>

            {!isRolloverRequirementMet && (
                <div className="mb-3 md:mb-4">
                    <RolloverStatusCard status={rolloverStatus} variant="warning" />
                </div>
            )}

            {processingCountdown != null && processingCountdown > 0 ? (
                <ProcessingCountdownBanner
                    secondsLeft={processingCountdown}
                    totalSeconds={PROCESSING_COUNTDOWN_SECONDS}
                    type="withdrawal"
                />
            ) : (
            <>
            <div className="mb-3 sm:mb-4">
                <PaymentFlowStepper variant="cashier" className="cashier-flow-stepper" step={step} steps={WITHDRAWAL_STEPS} />
            </div>

            <div className="surface-card overflow-visible rounded-2xl shadow-[var(--shadow-card-soft)]">
                {/* Step 1: Choose method */}
                {step === 1 && (
                    <div className="space-y-5 p-5 sm:space-y-6 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="cashier-step-badge">1</span>
                            <div>
                                <h2 className="cashier-section-title text-base md:text-lg">Withdrawal Method</h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">
                                    Choose one from the available options
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {WITHDRAWAL_METHODS.map(({ id, label, subtitle, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setWithdrawalMethod(id)}
                                    className={`cashier-method-row${withdrawalMethod === id ? ' is-selected' : ''}`}
                                >
                                    <span className="cashier-method-section-icon" aria-hidden>
                                        <Icon size={20} strokeWidth={2.25} />
                                    </span>
                                    <div className="min-w-0 text-left">
                                        <p className="cashier-method-section-title text-sm md:text-base">{label}</p>
                                        {subtitle && (
                                            <p className="cashier-method-section-subtitle">{subtitle}</p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

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

                {/* Step 2: Account info & Amount (combined) */}
                {step === 2 && withdrawalMethod === 'bank' && (
                    <div className="cashier-flow-step cashier-step2-normal p-5 md:p-6">
                        <div className="flex items-start gap-3">
                            <span className="cashier-step-badge">2</span>
                            <div className="min-w-0 pt-0.5">
                                <h2 className="cashier-section-title text-base md:text-lg">Normal Bank Transfer</h2>
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
                                <span>Min Withdrawal</span>
                                <span>{selectedWithdrawalBank ? minAmount : '-'}</span>
                            </div>
                        </div>

                        <div className="cashier-step2-notes">
                            <p className="cashier-step2-notes-title">Notes :</p>
                            <ul className="cashier-step2-notes-list">
                                <li>Bank transfer takes up to 24 hours to reflect in your bank account</li>
                                <li>If the entered and bank account are inconsistent, the company reserves the right to reject the application..</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="cashier-step2-section-title">Bank Account Info</h3>
                            <div className="cashier-step2-form">
                                <div className="cashier-step2-form-row">
                                    <span className="cashier-step2-form-label">Bank Name</span>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setBankDropdownOpen((o) => !o)}
                                            className="cashier-step2-form-select-btn"
                                        >
                                            {selectedBank && selectedWithdrawalBank ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img src={selectedWithdrawalBank.image} alt="" className="h-5 w-5 object-contain" />
                                                    <span>{selectedWithdrawalBank.label}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-muted)]">Please Select Bank</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {bankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[240px] overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {WITHDRAWAL_BANKS.map((b) => (
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
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="cashier-step2-form-row">
                                    <span className="cashier-step2-form-label">Account Name</span>
                                    <input
                                        type="text"
                                        value={bankAccountName}
                                        onChange={(e) => setBankAccountName(e.target.value)}
                                        placeholder="Enter Your Account Name"
                                        disabled={!selectedBank}
                                        className="cashier-step2-form-input"
                                    />
                                </div>

                                {DEMO_BALANCE <= 0 && (
                                    <div className="cashier-step2-alert">
                                        <AlertCircle size={16} className="shrink-0" />
                                        Your Account Balance is {DEMO_BALANCE.toFixed(2)}
                                    </div>
                                )}

                                <div className="cashier-step2-form-row">
                                    <span className="cashier-step2-form-label">Account Number</span>
                                    <input
                                        type="text"
                                        value={bankAccountNumber}
                                        onChange={(e) => setBankAccountNumber(e.target.value)}
                                        placeholder="Enter Your Account Number"
                                        disabled={!selectedBank}
                                        className="cashier-step2-form-input"
                                    />
                                </div>

                                <div className="cashier-step2-form-row">
                                    <span className="cashier-step2-form-label">Amount</span>
                                    <div className="cashier-step2-currency-input">
                                        <span className="cashier-step2-currency-prefix">{CASHIER_CURRENCY}</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Please Enter Amount"
                                            min={minAmount}
                                            max={maxAmount}
                                            disabled={!selectedBank}
                                        />
                                    </div>
                                </div>
                            </div>
                            {!isValidAmount && amount && (
                                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)]">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {amountNum < minAmount
                                        ? `Minimum amount is ${CASHIER_CURRENCY} ${minAmount}`
                                        : `Maximum amount is ${CASHIER_CURRENCY} ${maxAmount.toLocaleString()}`
                                    }
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => canProceedStep2 && setStep(3)}
                            disabled={!canProceedStep2}
                            className="cashier-step2-submit"
                        >
                            Withdraw
                        </button>
                    </div>
                )}

                {step === 2 && withdrawalMethod === 'ewallet' && (
                    <div className="cashier-flow-step space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="cashier-step-badge">2</span>
                            <div>
                                <h2 className="cashier-section-title text-base md:text-lg">Account & Amount</h2>
                                <p className="cashier-section-subtitle text-xs leading-snug md:text-sm">
                                    Select E-Wallet, enter phone number and amount.
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Select E-Wallet <span className="text-[var(--color-danger)]">*</span></p>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setEwalletDropdownOpen((o) => !o)}
                                    className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                >
                                    {selectedEwallet && selectedEwalletOption ? (
                                        <span className="flex items-center gap-2.5">
                                            <img src={selectedEwalletOption.image} alt="" className="h-6 w-6 object-contain" />
                                            <span className="font-medium text-[var(--color-text-primary)]">
                                                {selectedEwalletOption.label} ({selectedEwalletOption.min} - {selectedEwalletOption.max.toLocaleString()})
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-[var(--color-text-muted)]">Select E-Wallet</span>
                                    )}
                                    <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${ewalletDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {ewalletDropdownOpen && (
                                    <>
                                        <div className="absolute inset-0 z-10" onClick={() => setEwalletDropdownOpen(false)} aria-hidden />
                                        <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                            {E_WALLET_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedEwallet(opt.id);
                                                        setEwalletDropdownOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-input-light)]"
                                                >
                                                    <img src={opt.image} alt={opt.label} className="h-6 w-6 shrink-0 object-contain" />
                                                    <span className="font-normal text-[var(--color-text-primary)]">{opt.label} ({opt.min} - {opt.max.toLocaleString()})</span>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="mb-2 text-xs font-semibold text-[var(--color-text-primary)] md:text-sm">Phone Number <span className="text-[var(--color-danger)]">*</span></p>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number"
                                className="h-12 w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-input-light)] px-4 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-brand)] focus:ring-2 focus:ring-[var(--color-border-brand)]/20"
                            />
                        </div>

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
                                                onClick={() => setPresetAmount(val)}
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
                            <p className="mt-2 text-xs font-medium text-[var(--color-text-muted)]">
                                Min/Max Limit {minAmount.toLocaleString()} / {maxAmount.toLocaleString()}
                            </p>
                            {!isValidAmount && amount && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger)]">
                                    <AlertCircle size={14} className="shrink-0" />
                                    {amountNum < minAmount
                                        ? `Minimum amount is MYR ${minAmount.toLocaleString()}`
                                        : `Maximum amount is MYR ${maxAmount.toLocaleString()}`
                                    }
                                </p>
                            )}
                        </div>

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
                                onClick={() => canProceedStep2 && setStep(3)}
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
                                <h2 className="cashier-section-title text-base md:text-lg">Confirm & Withdraw</h2>
                                <p className="cashier-section-subtitle text-xs leading-snug md:text-sm">Review your withdrawal details before confirming.</p>
                            </div>
                        </div>

                        <div className="cashier-summary-card overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
                            <div className="cashier-summary-card__header border-b px-5 py-3">
                                <p className="cashier-summary-card__header-label text-xs font-bold uppercase tracking-wide">Withdrawal Details</p>
                            </div>
                            <div className="divide-y divide-[var(--color-border-subtle)]">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="cashier-summary-card__row-label text-sm font-medium">Method</span>
                                    <span className="cashier-summary-card__row-value text-sm font-semibold">
                                        {withdrawalMethod === 'ewallet' ? 'E-Wallet' : 'Bank Transfer'}
                                    </span>
                                </div>
                                {withdrawalMethod === 'ewallet' ? (
                                    <>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="cashier-summary-card__row-label text-sm font-medium">E-Wallet</span>
                                            <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                                {selectedEwalletOption?.image && (
                                                    <img src={selectedEwalletOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                )}
                                                {selectedEwalletOption?.label ?? '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="cashier-summary-card__row-label text-sm font-medium">Phone Number</span>
                                            <span className="cashier-summary-card__row-value text-sm font-semibold">{phoneNumber}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="cashier-summary-card__row-label text-sm font-medium">Bank</span>
                                            <span className="cashier-summary-card__row-value flex items-center gap-2.5 text-sm font-semibold">
                                                {selectedWithdrawalBank?.image && (
                                                    <img src={selectedWithdrawalBank.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                )}
                                                {selectedBankLabel}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="cashier-summary-card__row-label text-sm font-medium">Account Name</span>
                                            <span className="cashier-summary-card__row-value text-sm font-semibold">{bankAccountName}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="cashier-summary-card__row-label text-sm font-medium">Account Number</span>
                                            <span className="cashier-summary-card__row-value text-sm font-semibold">{bankAccountNumber}</span>
                                        </div>
                                    </>
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
                                onClick={handleConfirmWithdraw}
                                className="btn-theme-cta inline-flex h-12 min-w-[160px] items-center justify-center gap-2 rounded-xl px-6 text-base font-bold shadow-sm transition hover:scale-[1.02]"
                            >
                                Confirm & Withdraw
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
        </div>
    );
}
