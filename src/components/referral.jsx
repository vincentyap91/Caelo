import React, { useState } from 'react';
import {
    Copy,
    Check,
    Share2,
    Info,
    ChevronDown,
    ChevronRight,
    Gamepad2,
    Dices,
    Fish,
    Trophy,
    Ticket,
    Swords,
    CircleDollarSign,
    TrendingUp,
    Gift,
    Users,
    Zap,
} from 'lucide-react';
import affiliateBanner from '../assets/affiliate-banner.jpg';
import step1Image from '../assets/step1.jpg';
import step2Image from '../assets/step2.jpg';
import step3Image from '../assets/step3.jpg';
import { PAGE_BANNER_IMG, PAGE_BANNER_WRAP } from '../constants/pageBannerClasses';
import { useReferralData } from '../context/ReferralDataContext';
import DownlineReferralsPanel from './referral/DownlineReferralsPanel';

const affiliateTabs = ['Invite friends', 'My referrals', 'How it works'];

// Placeholder data – replace with real user data when integrated
const REFERRAL_CODE = '589092';
const REFERRAL_URL = `${typeof window !== 'undefined' ? window.location.origin : ''}/register?code=${REFERRAL_CODE}`;

const depositCommissionTiers = [
    { tier: 'Tier 1', rate: 'PKR 2' },
    { tier: 'Tier 2', rate: '3%' },
    { tier: 'Tier 3', rate: '4%' },
    { tier: 'Tier 4', rate: 'PKR 5' },
    { tier: 'Tier 5', rate: 'PKR 5' },
    { tier: 'Tier 6', rate: '7%' },
];

const gameCommissionItems = [
    { id: 'slots', name: 'Slots', icon: Dices },
    { id: 'live-casino', name: 'Live Casino', icon: CircleDollarSign },
    { id: 'fish-hunt', name: 'Fish Hunt', icon: Fish },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'lottery', name: 'Lottery', icon: Ticket },
    { id: 'all', name: 'All', icon: Gamepad2 },
    { id: 'esport', name: 'ESport', icon: Swords },
    { id: 'poker', name: 'Poker', icon: CircleDollarSign },
    { id: 'crash', name: 'Crash', icon: TrendingUp },
];

const tabButtonClasses = (selected) =>
    `inline-flex min-h-[44px] items-center justify-center rounded-t-xl border-b-0 border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-all md:text-sm ${
        selected
            ? 'border-[var(--color-border-default)] border-b-transparent bg-[var(--color-surface-base)] text-[var(--color-accent-600)] shadow-[0_-2px_8px_rgba(15,23,42,0.04)]'
            : 'border-transparent bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-strong)]'
    }`;

function InviteFriendsContent({ onSwitchTab }) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const { totalCommissionBonus, totalDepositBonus } = useReferralData();

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_CODE);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch {
            setCopiedCode(false);
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(REFERRAL_URL);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        } catch {
            setCopiedLink(false);
        }
    };

    const handleShare = (type) => {
        if (navigator.share) {
            navigator.share({
                title: 'Join me on RioCity',
                text: `Use my referral code ${REFERRAL_CODE} when you sign up!`,
                url: REFERRAL_URL,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(type === 'code' ? REFERRAL_CODE : REFERRAL_URL);
        }
    };

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(REFERRAL_URL)}`;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--color-text-strong)] md:text-2xl">Invite friends now to get more reward</h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                        Invite your friends to join through our referral program! Share your unique code or link and earn rewards as they sign up and engage with our platform.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Gift size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Commission on deposits</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Users size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Unlimited referrals</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-2.5">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                                <Zap size={16} />
                            </span>
                            <span className="text-sm font-medium text-[var(--color-text-strong)]">Earn from game play</span>
                        </div>
                    </div>
                </div>
                <div className="surface-card flex flex-col gap-4 rounded-2xl p-5 shadow-[var(--shadow-card-soft)]">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Commission Bonus</span>
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Commission earned from downline activity">
                                <Info size={12} />
                            </span>
                        </div>
                        <p className="mt-1 text-xl font-bold text-[var(--color-cta-text)] md:text-2xl">{totalCommissionBonus}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-[var(--color-text-muted)]">Total Referral Deposit Bonus</span>
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent-100)] text-[var(--color-accent-600)]" title="Bonus from referred deposits">
                                <Info size={12} />
                            </span>
                        </div>
                        <p className="mt-1 text-xl font-bold text-[var(--color-cta-text)] md:text-2xl">{totalDepositBonus}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => onSwitchTab?.('My referrals')}
                        className="btn-theme-cta mt-auto inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-black tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                        Downlines
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Card 1: Copy My Referral Code */}
                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Copy My Referral Code</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-subtle)]">
                            <input
                                type="text"
                                value={REFERRAL_CODE}
                                readOnly
                                className="flex-1 bg-transparent text-sm font-mono font-medium text-[var(--color-text-strong)] outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                                aria-label="Copy referral code"
                            >
                                {copiedCode ? <Check size={16} className="text-[var(--color-success-main)]" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('code')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your code
                        </button>
                    </div>
                </div>

                {/* Card 2: Copy My Referral Link */}
                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:p-6">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Copy My Referral Link</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-subtle)]">
                            <input
                                type="text"
                                value={REFERRAL_URL}
                                readOnly
                                className="min-w-0 flex-1 bg-transparent text-xs font-mono font-medium text-[var(--color-text-strong)] outline-none md:text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-base)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent-200)] hover:bg-[var(--color-accent-50)] hover:text-[var(--color-accent-600)]"
                                aria-label="Copy referral link"
                            >
                                {copiedLink ? <Check size={16} className="text-[var(--color-success-main)]" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('link')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your link
                        </button>
                    </div>
                </div>

                {/* Card 3: Scan my Referral QR Code */}
                <div className="surface-card flex flex-col rounded-2xl p-5 shadow-[var(--shadow-card-soft)] md:col-span-2 lg:col-span-1 md:p-6">
                    <h3 className="text-base font-bold text-[var(--color-text-strong)] md:text-lg">Scan my Referral QR Code</h3>
                    <div className="mt-4 flex flex-1 flex-col gap-4">
                        <div className="flex items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-white p-4 shadow-[var(--shadow-subtle)]">
                            <img
                                src={qrCodeUrl}
                                alt="Referral QR Code"
                                className="h-[140px] w-[140px] object-contain md:h-[150px] md:w-[150px]"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleShare('qr')}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-accent-600)]"
                        >
                            <Share2 size={14} />
                            Share your QR code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MyReferralsContent() {
    return <DownlineReferralsPanel />;
}

function GameCommissionRow({ item, isOpen, onToggle }) {
    const Icon = item.icon;
    return (
        <div className="border-b border-[var(--color-border-default)] last:border-b-0">
            <button
                type="button"
                onClick={() => onToggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition hover:bg-[var(--color-surface-subtle)]"
            >
                <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-50)] text-[var(--color-accent-600)]">
                        <Icon size={18} />
                    </span>
                    <span className="font-medium text-[var(--color-text-strong)]">{item.name}</span>
                </div>
                {isOpen ? <ChevronDown size={18} className="text-[var(--color-text-muted)]" /> : <ChevronRight size={18} className="text-[var(--color-text-muted)]" />}
            </button>
            {isOpen && (
                <div className="border-t border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    Commission rates vary by provider. Contact support for detailed breakdown.
                </div>
            )}
        </div>
    );
}

function HowItWorksContent() {
    const [expandedGame, setExpandedGame] = useState(null);
    const steps = [
        { num: '01', title: 'Share your Registration Link or Referral Code', image: step1Image },
        { num: '02', title: 'Friends Registered Successfully', image: step2Image },
        { num: '03', title: 'Earn Bonus from Your Downlines', image: step3Image },
    ];

    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-6 md:p-8">
                <h3 className="text-center text-xl font-bold text-[var(--color-text-strong)] md:text-2xl">Invite Your Friends to Earn Passive Income</h3>
                <div className="mt-8 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
                    {steps.map((step) => (
                            <div
                                key={step.num}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[linear-gradient(180deg,var(--color-surface-base)_0%,var(--color-surface-subtle)_100%)] shadow-[var(--shadow-subtle)]"
                            >
                                <span className="absolute left-4 top-4 z-10 rounded-md bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--color-cta-text)] shadow-sm">
                                    Step {step.num}
                                </span>
                                <div className="flex flex-1 flex-col items-center px-4 pb-7 pt-14 text-center md:px-5 md:pb-8">
                                    <div
                                        className="mb-5 flex w-full max-w-[280px] flex-1 items-center justify-center md:max-w-[300px]"
                                        aria-hidden
                                    >
                                        <div className="relative w-full overflow-hidden rounded-xl px-2 py-3 md:py-4">
                                            <img
                                                src={step.image}
                                                alt=""
                                                className="mx-auto h-auto max-h-[200px] w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.02] sm:max-h-[220px] md:max-h-[240px]"
                                                loading="lazy"
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                    <p className="max-w-[16rem] text-sm font-bold leading-snug text-[var(--color-text-strong)] md:max-w-none md:text-[0.95rem] md:leading-relaxed">
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="border-b border-[var(--color-border-default)] px-5 py-4 md:px-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl">Deposit Commission Rate</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Minimum Deposit PKR 30.00</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-sm">
                        <thead>
                            <tr>
                                {depositCommissionTiers.map((t) => (
                                    <th key={t.tier} className="border-b border-r border-white/20 bg-[#1c63b9] px-4 py-3 text-center font-bold text-white last:border-r-0">{t.tier}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {depositCommissionTiers.map((t) => (
                                    <td key={t.tier} className="border-b border-[var(--color-border-default)] bg-white px-4 py-3 text-center font-medium text-[var(--color-text-strong)]">{t.rate}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl shadow-[var(--shadow-card-soft)]">
                <div className="border-b border-[var(--color-border-default)] px-5 py-4 md:px-6">
                    <h3 className="text-lg font-bold text-[var(--color-text-strong)] md:text-xl">Game Commission Rate</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Listing of commission rates you earn from your downlines&apos; bets by game type and provider.</p>
                </div>
                <div className="divide-y divide-[var(--color-border-default)]">
                    {gameCommissionItems.map((item) => (
                        <GameCommissionRow key={item.id} item={item} isOpen={expandedGame === item.id} onToggle={(id) => setExpandedGame((prev) => (prev === id ? null : id))} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ReferralPage() {
    const [activeTab, setActiveTab] = useState('Invite friends');

    return (
        <main className="w-full bg-[var(--color-page-default)] pb-14">
            {/* Top bar — matches Live Casino strip */}
            <section className="w-full border-y border-[rgb(219_226_240)] bg-[var(--color-surface-base-85)] backdrop-blur">
                <div className="mx-auto flex h-12 w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(102_112_134)]">
                        Referral &amp; Rewards
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-[rgb(83_96_122)] sm:flex">
                        <span>Share &amp; earn</span>
                        <span className="h-1 w-1 rounded-full bg-[rgb(153_166_190)]" />
                        <span>Unlimited referrals</span>
                    </div>
                </div>
            </section>

            {/* Hero — Live Casino layout, no CTA / no provider logo */}
            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className={PAGE_BANNER_WRAP}>
                        <img
                            src={affiliateBanner}
                            alt="Referral"
                            className={PAGE_BANNER_IMG}
                        />
                        <div className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[50%] md:justify-start md:pr-0">
                            <div className="flex w-full max-w-[500px] flex-col items-center justify-center px-2 py-2 text-center max-md:justify-center md:block md:px-8 md:py-7 md:text-center">
                                <h1 className="text-base font-black uppercase tracking-[0.03em] text-white sm:text-xl md:mt-5 md:text-3xl">
                                    Referral
                                </h1>
                                <p className="mx-auto mt-1 hidden max-w-[420px] text-xs font-semibold leading-[1.35] text-white sm:flex sm:mt-3 sm:text-sm md:mt-4 md:text-base">
                                    Invite friends, earn rewards. Share your referral code and grow together.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content with tabs */}
            <section className="mx-auto mt-6 w-full max-w-screen-2xl px-4 md:mt-8 md:px-8">
                <div className="soft-blue-panel overflow-hidden rounded-[28px] shadow-[var(--shadow-card-raised)]">
                    {/* Tab bar */}
                    <div className="flex gap-1 border-b border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-4 pt-4 md:px-6">
                        {affiliateTabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={tabButtonClasses(activeTab === tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="p-4 md:p-6 lg:p-8">
                        {activeTab === 'Invite friends' && <InviteFriendsContent onSwitchTab={setActiveTab} />}
                        {activeTab === 'My referrals' && <MyReferralsContent />}
                        {activeTab === 'How it works' && <HowItWorksContent />}
                    </div>
                </div>
            </section>
        </main>
    );
}
