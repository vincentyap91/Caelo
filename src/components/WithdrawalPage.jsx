import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, ChevronDown, HelpCircle } from 'lucide-react';
import PaymentConfirmModal from './PaymentConfirmModal';
import RolloverRequirementModal from './RolloverRequirementModal';
import ProcessingCountdownBanner from './ProcessingCountdownBanner';
import RolloverStatusCard from './RolloverStatusCard';
import PaymentFlowStepper from './payment/PaymentFlowStepper';
import { useActionNotifications } from '../context/ActionNotificationsContext';
import { PUSH_EVENT } from '../constants/pushNotificationCopy';
import { DEMO_ROLLOVER_STATUS, getRolloverProgressPercent } from '../constants/rolloverStatus';
import eWalletImg from '../assets/e-wallet.png';
import instantDepositImg from '../assets/instant-deposit.png';

const WITHDRAWAL_STEPS = [
    { id: 1, label: 'Choose Method' },
    { id: 2, label: 'Account & Amount' },
    { id: 3, label: 'Confirm & Withdraw' },
];

const WITHDRAWAL_METHODS = [
    { id: 'ewallet', label: 'E-Wallet', image: eWalletImg },
    { id: 'bank', label: 'Bank Transfer', image: instantDepositImg },
];

const E_WALLET_OPTIONS = [
    { id: 'bkash', label: 'Bkash', image: 'https://pksoftcdn.azureedge.net/media/bkash-202502091728502140-202503251036219126.png', min: 100, max: 1000 },
    { id: 'jazzcash', label: 'Jazzcash', image: 'https://pksoftcdn.azureedge.net/media/jazzcash_wicon-202505081346058397.png', min: 100, max: 10000 },
    { id: 'easypaisa', label: 'EasyPaisa', image: 'https://pksoftcdn.azureedge.net/media/easypaisa_wicon-202505140932274142.png', min: 100, max: 1000 },
    { id: 'other', label: 'Other Wallet', image: 'https://pksoftcdn.azureedge.net/media/600x400-202602121348375675.png', min: 1, max: 999999 },
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

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
const PROCESSING_COUNTDOWN_SECONDS = 5 * 60;

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
    const minAmount = withdrawalMethod === 'ewallet' && selectedEwalletOption
        ? selectedEwalletOption.min
        : 100;
    const maxAmount = withdrawalMethod === 'ewallet' && selectedEwalletOption
        ? selectedEwalletOption.max
        : 100000;
    const isValidAmount = amountNum >= minAmount && amountNum <= maxAmount;

    const addPreset = (val) => {
        setAmount(String((amountNum + val)));
    };

    const setPresetAmount = (val) => {
        setAmount(String(val));
    };

    const selectedBankLabel = selectedBank ? BANKS.find((b) => b.id === selectedBank)?.label ?? 'Select Bank' : 'Select Bank';

    const canProceedStep1 = true;
    const canProceedStep2 =
        (withdrawalMethod === 'ewallet'
            ? selectedEwallet && phoneNumber.trim().length > 0
            : selectedBank && bankAccountName.trim() && bankAccountNumber.trim()) && isValidAmount;

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
        <div className="page-container">
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
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="page-title">Withdrawal</h1>
                    <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                        Complete your withdrawal in a few simple steps.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onNavigate?.('help-center')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-600)] transition hover:text-[var(--color-accent-700)]"
                >
                    <HelpCircle size={18} />
                    How to withdraw?
                </button>
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
                <PaymentFlowStepper step={step} steps={WITHDRAWAL_STEPS} />
            </div>

            <div className="surface-card overflow-visible rounded-2xl shadow-[var(--shadow-card-soft)]">
                {/* Step 1: Choose method */}
                {step === 1 && (
                    <div className="space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                1
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Withdrawal Method <span className="text-[var(--color-danger-main)]">*</span></h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">Select E-Wallet or Bank Transfer.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {WITHDRAWAL_METHODS.map(({ id, label, image }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setWithdrawalMethod(id)}
                                    className={`flex h-full min-h-[7.25rem] flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition sm:min-h-0 sm:gap-3 sm:p-6 ${
                                        withdrawalMethod === id
                                            ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)]'
                                            : 'border-[var(--color-border-default)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-200)]'
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={label}
                                        className="h-12 w-auto max-w-full object-contain sm:h-14"
                                    />
                                    <p className="text-sm font-bold leading-tight text-[var(--color-text-strong)] sm:text-base">{label}</p>
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
                {step === 2 && (
                    <div className="space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                2
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Account & Amount</h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">
                                    {withdrawalMethod === 'ewallet' ? 'Select E-Wallet, enter phone number and amount.' : 'Enter your bank account details and amount.'}
                                </p>
                            </div>
                        </div>

                        {withdrawalMethod === 'ewallet' ? (
                            <>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Select E-Wallet <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setEwalletDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {selectedEwallet && selectedEwalletOption ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img src={selectedEwalletOption.image} alt="" className="h-6 w-6 object-contain" />
                                                    <span className="font-medium text-[var(--color-text-strong)]">
                                                        {selectedEwalletOption.label} ({selectedEwalletOption.min} - {selectedEwalletOption.max.toLocaleString()})
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-soft)]">Select E-Wallet</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${ewalletDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {ewalletDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setEwalletDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {E_WALLET_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedEwallet(opt.id);
                                                                setEwalletDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                        >
                                                            <img src={opt.image} alt={opt.label} className="h-6 w-6 shrink-0 object-contain" />
                                                            <span className="font-normal text-[var(--color-text-strong)]">{opt.label} ({opt.min} - {opt.max.toLocaleString()})</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Phone Number <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Bank <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setBankDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {selectedBank && BANKS.find((b) => b.id === selectedBank)?.image ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img src={BANKS.find((b) => b.id === selectedBank)?.image} alt="" className="h-6 w-6 object-contain" />
                                                    <span className="font-medium text-[var(--color-text-strong)]">{selectedBankLabel}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-soft)]">Select Bank</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {bankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {BANKS.map((b) => (
                                                        <button
                                                            key={b.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedBank(b.id);
                                                                setBankDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                        >
                                                            <img src={b.image} alt={b.label} className="h-6 w-6 shrink-0 object-contain" />
                                                            <span className="font-normal text-[var(--color-text-strong)]">{b.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Account Name <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <input
                                        type="text"
                                        value={bankAccountName}
                                        onChange={(e) => setBankAccountName(e.target.value)}
                                        placeholder="Enter account holder name"
                                        className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                    />
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Account Number <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <input
                                        type="text"
                                        value={bankAccountNumber}
                                        onChange={(e) => setBankAccountNumber(e.target.value)}
                                        placeholder="Enter account number"
                                        className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Amount <span className="text-[var(--color-danger-main)]">*</span></p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex flex-1 overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] shadow-[var(--shadow-subtle)]">
                                    <span className="flex items-center justify-center bg-[var(--color-accent-100)] px-4 text-sm font-bold text-[var(--color-accent-700)]">
                                        MYR
                                    </span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        min={minAmount}
                                        max={maxAmount}
                                        className="h-12 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)]"
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
                                                className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${
                                                    isActive
                                                        ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-500)] text-white'
                                                        : 'border-[var(--color-accent-300)] bg-[var(--color-surface-base)] text-[var(--color-accent-600)] hover:bg-[var(--color-accent-50)]'
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
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger-main)]">
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
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-6 text-sm font-bold text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface-subtle)]"
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
                    <div className="space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                3
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Confirm & Withdraw</h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">Review your withdrawal details before confirming.</p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
                            <div className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-5 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Withdrawal Details</p>
                            </div>
                            <div className="divide-y divide-[var(--color-border-default)]">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="text-sm font-medium text-[var(--color-text-muted)]">Method</span>
                                    <span className="text-sm font-semibold text-[var(--color-text-strong)]">
                                        {withdrawalMethod === 'ewallet' ? 'E-Wallet' : 'Bank Transfer'}
                                    </span>
                                </div>
                                {withdrawalMethod === 'ewallet' ? (
                                    <>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">E-Wallet</span>
                                            <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--color-text-strong)]">
                                                {selectedEwalletOption?.image && (
                                                    <img src={selectedEwalletOption.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                )}
                                                {selectedEwalletOption?.label ?? '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Phone Number</span>
                                            <span className="text-sm font-semibold text-[var(--color-text-strong)]">{phoneNumber}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Bank</span>
                                            <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--color-text-strong)]">
                                                {selectedBank && BANKS.find((b) => b.id === selectedBank)?.image && (
                                                    <img src={BANKS.find((b) => b.id === selectedBank)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                )}
                                                {selectedBankLabel}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Account Name</span>
                                            <span className="text-sm font-semibold text-[var(--color-text-strong)]">{bankAccountName}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 px-5 py-4">
                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">Account Number</span>
                                            <span className="text-sm font-semibold text-[var(--color-text-strong)]">{bankAccountNumber}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="border-t-2 border-[var(--color-border-default)] bg-[var(--color-accent-50)] px-5 py-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-bold text-[var(--color-text-strong)]">Total Amount</span>
                                    <span className="text-xl font-bold text-[var(--color-accent-600)]">
                                        RM {amountNum.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-6 text-sm font-bold text-[var(--color-text-strong)] transition hover:bg-[var(--color-surface-subtle)]"
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
