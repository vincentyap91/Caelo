import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Check, ChevronDown, Clock, HelpCircle, Info, Zap } from 'lucide-react';
import fpxLogo from '../assets/fpx-logo.svg';
import eWalletImg from '../assets/e-wallet.png';
import instantDepositImg from '../assets/instant-deposit.png';
import CopyInputField from './security/CopyInputField';
import PaymentConfirmModal from './PaymentConfirmModal';
import ProcessingCountdownBanner from './ProcessingCountdownBanner';
import RolloverStatusCard from './RolloverStatusCard';
import PaymentFlowStepper from './payment/PaymentFlowStepper';
import ReceiptUploadField, { ReceiptPreviewModal, ReceiptFileCard } from './payment/ReceiptUploadField';
import { useActionNotifications } from '../context/ActionNotificationsContext';
import { PUSH_EVENT } from '../constants/pushNotificationCopy';
import { DEMO_ROLLOVER_STATUS } from '../constants/rolloverStatus';

const DEPOSIT_STEPS = [
    { id: 1, label: 'Choose Deposit Type' },
    { id: 2, label: 'Bank & Amount' },
    { id: 3, label: 'Confirm & Pay' },
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

const DEPOSIT_SPEED_TABS = [
    { id: 'fast', label: 'Fast Deposit', time: '1 minute' },
    { id: 'normal', label: 'Normal Deposit', time: '5 minutes' },
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
    const [depositSpeedTab, setDepositSpeedTab] = useState('fast');
    const [depositOptionType, setDepositOptionType] = useState('instant');
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

    const canProceedStep1 = !(claimBonus && !selectedBonus);

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
        <div className="page-container">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="page-title">Deposit</h1>
                    <p className="mt-1 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                        Complete your deposit in just a few simple steps.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onNavigate?.('help-center')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent-600)] transition hover:text-[var(--color-accent-700)]"
                >
                    <HelpCircle size={18} />
                    How to deposit?
                </button>
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
                    step={step}
                    steps={DEPOSIT_STEPS.map((s) => ({
                        id: s.id,
                        label: s.id === 3 && isNormal ? 'Confirm & Submit' : s.label,
                    }))}
                />
            </div>

            <div className="surface-card overflow-visible rounded-2xl shadow-[var(--shadow-card-soft)]">
                {/* Step 1: Choose deposit type */}
                {step === 1 && (
                    <div>
                        <div className="flex">
                            {DEPOSIT_SPEED_TABS.map(({ id, label, time }, idx) => {
                                const isActive = depositSpeedTab === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setDepositSpeedTab(id)}
                                        className={`min-w-0 flex-1 px-3 py-2.5 text-center transition sm:px-6 sm:py-4 ${
                                            idx === 0 ? 'rounded-tl-2xl' : 'rounded-tr-2xl'
                                        } ${
                                            isActive
                                                ? 'bg-gradient-to-b from-[var(--color-accent-400)] to-[var(--color-accent-600)] text-white shadow-none sm:shadow-sm'
                                                : 'bg-[var(--color-surface-muted)] text-[var(--color-text-strong)] hover:bg-[var(--color-surface-subtle)]'
                                        }`}
                                    >
                                        <p className="text-sm font-bold leading-tight sm:text-base sm:leading-normal">{label}</p>
                                        <p
                                            className={`mt-0.5 flex items-center justify-center gap-0.5 text-xs leading-tight sm:mt-1 sm:gap-1 sm:leading-normal ${
                                                isActive ? 'text-white/90' : 'text-[var(--color-text-muted)]'
                                            }`}
                                        >
                                            <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
                                            {time}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="space-y-4 p-5 sm:space-y-6 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                1
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Deposit Options <span className="text-[var(--color-danger-main)]">*</span></h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">Select your preferred deposit method.</p>
                            </div>
                        </div>

                        {depositSpeedTab === 'normal' ? (
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <button
                                    type="button"
                                    className="relative col-span-2 flex min-h-[7.25rem] flex-col items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-accent-500)] bg-[var(--color-accent-50)] p-4 text-center transition sm:min-h-0 sm:gap-3 sm:p-6"
                                >
                                    <img
                                        src={instantDepositImg}
                                        alt="Normal Deposit"
                                        className="h-12 w-auto object-contain sm:h-14"
                                    />
                                    <p className="text-sm font-bold leading-tight text-[var(--color-text-strong)] sm:text-base">
                                        Normal Deposit
                                    </p>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                {DEPOSIT_OPTION_TYPES.map(({ id, label, badge, image }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setDepositOptionType(id)}
                                        className={`relative flex h-full min-h-[7.25rem] flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition sm:min-h-0 sm:gap-3 sm:p-6 ${
                                            depositOptionType === id
                                                ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)]'
                                                : 'border-[var(--color-border-default)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-200)]'
                                        }`}
                                    >
                                        {badge && (
                                            <span className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-0.5 truncate rounded bg-gradient-to-r from-amber-400 to-red-500 px-1.5 py-0.5 text-xs font-bold text-white sm:left-3 sm:top-3 sm:gap-1 sm:px-2">
                                                <Zap size={12} className="shrink-0" />
                                                {badge}
                                            </span>
                                        )}
                                        <img
                                            src={image}
                                            alt={label}
                                            className="h-12 w-auto max-w-full object-contain sm:h-14"
                                        />
                                        <p className="line-clamp-2 text-sm font-bold leading-tight text-[var(--color-text-strong)] sm:text-base">
                                            {label}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}

                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                type="checkbox"
                                checked={claimBonus}
                                onChange={(e) => setClaimBonus(e.target.checked)}
                                className="h-5 w-5 rounded border-[var(--color-border-default)] text-[var(--color-accent-600)] focus:ring-[var(--color-accent-400)]"
                            />
                            <span className="text-sm font-semibold text-[var(--color-text-strong)]">Do you want to claim bonus?</span>
                        </label>

                        {claimBonus && (
                            <div>
                                <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Bonus <span className="text-[var(--color-danger-main)]">*</span></p>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setBonusDropdownOpen((o) => !o)}
                                        className="flex h-12 w-full items-center justify-between rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                    >
                                        <span className={selectedBonus ? 'font-medium text-[var(--color-text-strong)]' : 'text-[var(--color-text-soft)]'}>
                                            {selectedBonus ? BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.label ?? 'Select Bonus' : 'Select Bonus'}
                                        </span>
                                        <ChevronDown size={18} className={`text-[var(--color-text-muted)] transition ${bonusDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {bonusDropdownOpen && (
                                        <>
                                            <div className="absolute inset-0 z-10" onClick={() => setBonusDropdownOpen(false)} aria-hidden />
                                            <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                {BONUS_OPTIONS.map((b) => (
                                                    <button
                                                        key={b.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedBonus(b.id);
                                                            setBonusDropdownOpen(false);
                                                        }}
                                                        className="flex w-full px-4 py-2.5 text-left text-sm font-medium text-[var(--color-text-strong)] hover:bg-[var(--color-surface-muted)]"
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
                                <div className="rounded-xl border-2 border-dashed border-[var(--color-accent-300)] bg-[var(--color-accent-50)]/50 p-4">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-white">
                                            <Info size={14} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-bold text-[var(--color-accent-600)]">Bonus Info</span>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Rollover :</span>
                                            <span className="text-[var(--color-text-strong)]">{info.rollover}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Claim :</span>
                                            <span className="text-[var(--color-text-strong)]">{info.claim}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Minimum Deposit :</span>
                                            <span className="text-[var(--color-text-strong)]">{info.minDeposit}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Percentage Bonus Reward :</span>
                                            <span className="text-[var(--color-text-strong)]">{info.percentageBonus}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="font-medium text-[var(--color-text-muted)]">Maximum Bonus :</span>
                                            <span className="text-[var(--color-text-strong)]">{info.maxBonus}</span>
                                        </p>
                                        <p className="flex gap-2">
                                            <span className="shrink-0 font-medium text-[var(--color-text-muted)]">Game (Provider) :</span>
                                            <span className="font-bold text-[var(--color-text-strong)]">
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
                    </div>
                )}

                {/* Step 2: Bank & Amount (combined) */}
                {step === 2 && (
                    <div className="space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                2
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">
                                    {isNormal ? 'Bank Account & Amount' : 'Bank, Provider & Amount'}
                                </h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">
                                    {isNormal ? 'Choose your bank account and enter the amount.' : 'Choose your bank, provider and enter the amount.'}
                                </p>
                            </div>
                        </div>

                        {isNormal ? (
                            <>
                                <div>
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Bank Account <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setNormalBankDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {selectedNormalAccount ? (
                                                <span className="flex items-center gap-2.5">
                                                    {selectedNormalAccount.image ? (
                                                        <img src={selectedNormalAccount.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                    ) : (
                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                        </span>
                                                    )}
                                                    <span className="font-medium text-[var(--color-text-strong)]">{selectedNormalAccount.label}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-soft)]">Select Bank Account</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${normalBankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {normalBankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setNormalBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[300px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {NORMAL_BANK_ACCOUNTS.map((a) => (
                                                        <button
                                                            key={a.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedNormalBankAccount(a.id);
                                                                setNormalBankDropdownOpen(false);
                                                            }}
                                                            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                        >
                                                            {a.image ? (
                                                                <img src={a.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                                            ) : (
                                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                                </span>
                                                            )}
                                                            <span className="font-normal text-[var(--color-text-strong)]">{a.label}</span>
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
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Bank <span className="text-[var(--color-danger-main)]">*</span></p>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setBankDropdownOpen((o) => !o)}
                                            className="flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-left text-sm shadow-[var(--shadow-subtle)]"
                                        >
                                            {depositOptionType === 'ewallet' && selectedTng ? (
                                                <span className="flex items-center gap-2.5">
                                                    <img
                                                        src={TOUCH_N_GO_OPTIONS.find((t) => t.id === selectedTng)?.image}
                                                        alt=""
                                                        className="h-6 w-6 object-contain"
                                                    />
                                                    <span className="font-medium text-[var(--color-text-strong)]">
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
                                                    <span className="font-medium text-[var(--color-text-strong)]">{selectedBankLabel}</span>
                                                </span>
                                            ) : (
                                                <span className="text-[var(--color-text-soft)]">Select Bank Account</span>
                                            )}
                                            <ChevronDown size={18} className={`shrink-0 text-[var(--color-text-muted)] transition ${bankDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {bankDropdownOpen && (
                                            <>
                                                <div className="absolute inset-0 z-10" onClick={() => setBankDropdownOpen(false)} aria-hidden />
                                                <div className="absolute top-full left-0 right-0 z-20 mt-1.5 max-h-[500px] overflow-y-auto rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] py-1 shadow-lg">
                                                    {depositOptionType === 'ewallet' ? (
                                                        TOUCH_N_GO_OPTIONS.map((t) => (
                                                            <button
                                                                key={t.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedTng(t.id);
                                                                    setBankDropdownOpen(false);
                                                                }}
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                            >
                                                                <img src={t.image} alt={t.label} className="h-6 w-6 shrink-0 object-contain" />
                                                                <span className="font-normal text-[var(--color-text-strong)]">{t.label}</span>
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
                                                                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm hover:bg-[var(--color-surface-muted)]"
                                                            >
                                                                <img src={b.image} alt={b.label} className="h-6 w-6 shrink-0 object-contain" />
                                                                <span className="font-normal text-[var(--color-text-strong)]">{b.label}</span>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className={canSelectChannel ? '' : 'opacity-60'}>
                                    <p className="mb-3 text-sm font-semibold text-[var(--color-text-strong)]">
                                        Provider Channel <span className="text-[var(--color-danger-main)]">*</span>
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
                                                className={`relative flex min-h-[8.5rem] flex-col items-center gap-2 rounded-xl border p-3 text-center transition sm:min-h-0 sm:flex-row sm:items-center sm:gap-4 sm:p-4 sm:text-left ${
                                                    selectedChannel === id
                                                        ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-50)]'
                                                        : 'border-[var(--color-border-default)] bg-[var(--color-surface-base)] hover:border-[var(--color-accent-200)]'
                                                } ${!canSelectChannel ? 'cursor-not-allowed' : ''}`}
                                            >
                                                {selectedChannel === id && (
                                                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-white sm:right-3 sm:top-3 sm:h-6 sm:w-6">
                                                        <Check size={12} strokeWidth={2.5} />
                                                    </div>
                                                )}
                                                <img
                                                    src={fpxLogo}
                                                    alt="FPX"
                                                    className="h-8 w-auto shrink-0 object-contain sm:h-10"
                                                />
                                                <div className="min-w-0 flex-1 sm:text-left">
                                                    <p className="border-b border-[var(--color-border-default)] pb-1 text-xs font-bold leading-snug text-[var(--color-text-strong)] sm:pb-1.5 sm:text-sm">
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
                                                onClick={() => (isNormal ? setPresetAmount(val) : addPreset(val))}
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
                            <p className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${isNormal ? 'italic text-[var(--color-accent-600)]' : 'text-[var(--color-text-muted)]'}`}>
                                {isNormal && <Info size={14} className="shrink-0 text-[var(--color-accent-600)]" />}
                                Min/Max Limit {minAmount.toFixed(2)} / {maxAmount.toLocaleString()}
                            </p>
                            {!isValidAmount && amount && (
                                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-danger-main)]">
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
                                    <p className="mb-2 text-xs font-semibold text-[var(--color-text-strong)] md:text-sm">Remark</p>
                                    <input
                                        type="text"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Optional remark"
                                        className="h-12 w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 text-sm text-[var(--color-text-strong)] outline-none placeholder:text-[var(--color-text-soft)] focus:border-[var(--color-accent-400)] focus:ring-2 focus:ring-[rgb(96_165_250_/_0.2)]"
                                    />
                                </div>
                            </>
                        )}

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
                    <div className="space-y-6 p-5 md:p-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-sm font-bold text-white">
                                3
                            </span>
                            <div>
                                <h2 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">
                                    {isNormal ? 'Confirm & Submit' : 'Transaction Summary'}
                                </h2>
                                <p className="text-xs leading-snug text-[var(--color-text-muted)] md:text-sm">
                                    {isNormal ? 'Review your deposit details and submit.' : 'Review your deposit details before confirming.'}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] shadow-[var(--shadow-card-soft)]">
                            <div className="border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-5 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Payment Details</p>
                            </div>
                            <div className="divide-y divide-[var(--color-border-default)]">
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="text-sm font-medium text-[var(--color-text-muted)]">Deposit Type</span>
                                    <span className="text-sm font-semibold text-[var(--color-text-strong)]">
                                        {DEPOSIT_SPEED_TABS.find((t) => t.id === depositSpeedTab)?.label ?? depositSpeedTab}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="text-sm font-medium text-[var(--color-text-muted)]">Deposit Option</span>
                                    <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--color-text-strong)]">
                                        {!isNormal && DEPOSIT_OPTION_TYPES.find((o) => o.id === depositOptionType)?.image && (
                                            <img src={DEPOSIT_OPTION_TYPES.find((o) => o.id === depositOptionType)?.image} alt="" className="h-6 w-6 shrink-0 object-contain" />
                                        )}
                                        {isNormal ? 'Normal Deposit' : (DEPOSIT_OPTION_TYPES.find((o) => o.id === depositOptionType)?.label ?? depositOptionType)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-4">
                                    <span className="text-sm font-medium text-[var(--color-text-muted)]">{isNormal ? 'Bank Account' : 'Bank'}</span>
                                    <span className="flex items-center gap-2.5 text-sm font-semibold text-[var(--color-text-strong)]">
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
                                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Channel</span>
                                        <span className="text-right text-sm font-semibold text-[var(--color-text-strong)]">
                                            {selectedChannelLabel}
                                            <span className="block text-xs font-normal text-[var(--color-text-muted)]">{selectedChannelDesc}</span>
                                        </span>
                                    </div>
                                )}
                                {claimBonus && selectedBonus && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Bonus</span>
                                        <span className="text-sm font-semibold text-[var(--color-success-main)]">
                                            {BONUS_OPTIONS.find((b) => b.id === selectedBonus)?.label ?? 'Selected'}
                                        </span>
                                    </div>
                                )}
                                {isNormal && remark && (
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <span className="text-sm font-medium text-[var(--color-text-muted)]">Remark</span>
                                        <span className="text-sm font-semibold text-[var(--color-text-strong)]">{remark}</span>
                                    </div>
                                )}
                                {isNormal && uploadedReceipt && receiptPreviewUrl && (
                                    <div className="px-5 py-4">
                                        <span className="mb-3 block text-sm font-medium text-[var(--color-text-muted)]">Upload receipt</span>
                                        <ReceiptFileCard
                                            file={uploadedReceipt}
                                            previewUrl={receiptPreviewUrl}
                                            onPreview={() => setReceiptPreviewOpen(true)}
                                            showRemove={false}
                                            className="border-[var(--color-border-default)] bg-[var(--color-surface-muted)]/50"
                                        />
                                    </div>
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
