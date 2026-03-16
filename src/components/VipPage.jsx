import React, { useState } from 'react';
import { ChevronRight, Crown, Gift, ShieldCheck, Sparkles, Users } from 'lucide-react';
import normalMedal from '../assets/Normal.png';
import bronzeMedal from '../assets/bronze.png';
import silverMedal from '../assets/silver.png';
import goldMedal from '../assets/gold.png';
import platinumMedal from '../assets/platinum.png';
import sapphireMedal from '../assets/sapphire.png';
import diamondMedal from '../assets/diamond.png';
import headsetImage from '../assets/headset.png';
import vipBanner from '../assets/vip-banner.jpg';

const vipTabs = ['Upgrade', 'Privileges', 'Referral'];

const vipLevels = [
    { tier: 'Normal', medal: normalMedal, monthlyReload: '$8,000', annualReward: '$20,000', depositPoint: '$500', validBetPoint: '$15,000' },
    { tier: 'Bronze', medal: bronzeMedal, monthlyReload: '$20,000', annualReward: '$50,000', depositPoint: '$2,000', validBetPoint: '$50,000' },
    { tier: 'Silver', medal: silverMedal, monthlyReload: '$35,000', annualReward: '$90,000', depositPoint: '$5,000', validBetPoint: '$120,000' },
    { tier: 'Gold', medal: goldMedal, monthlyReload: '$50,000', annualReward: '$120,000', depositPoint: '$8,000', validBetPoint: '$180,000' },
    { tier: 'Platinum', medal: platinumMedal, monthlyReload: '$200,000', annualReward: '$240,000', depositPoint: '$18,000', validBetPoint: '$320,000' },
    { tier: 'Sapphire', medal: sapphireMedal, monthlyReload: '$350,000', annualReward: '$360,000', depositPoint: '$30,000', validBetPoint: '$500,000' },
    { tier: 'Diamond', medal: diamondMedal, monthlyReload: '$1,000,000', annualReward: '$1,200,000', depositPoint: '$100,000', validBetPoint: '$1,500,000' },
];

const privilegeCards = [
    {
        title: 'Priority Withdrawals',
        description: 'Enjoy a faster review queue with dedicated handling for eligible VIP members.',
        icon: ShieldCheck,
    },
    {
        title: 'Exclusive Bonuses',
        description: 'Unlock reload offers, birthday rewards, and campaign access reserved for VIP members.',
        icon: Gift,
    },
    {
        title: 'Dedicated Host Support',
        description: 'Receive one-to-one support for account assistance, promotions, and event invitations.',
        icon: Users,
    },
    {
        title: 'Tailored Reward Journey',
        description: 'Progress through higher tiers with better limits, stronger promotions, and premium perks.',
        icon: Sparkles,
    },
];

const referralBenefits = [
    'Invite qualified players and earn extra bonus rewards once they successfully register and deposit.',
    'Referral campaigns may include cashback, limited seasonal prizes, and upgraded VIP access reviews.',
    'Customer service can assist with campaign eligibility and tracking for active referral requests.',
];

const tabButtonClasses = (selected) =>
    `inline-flex min-h-[44px] items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-all md:text-sm ${
        selected
            ? 'border-[rgb(255_191_83)] bg-[linear-gradient(180deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)] text-[var(--color-cta-text)] shadow-[0_8px_18px_rgba(242,154,0,0.2)]'
            : 'border-[var(--color-border-live)] bg-[var(--color-surface-base)] text-[rgb(64_81_114)] hover:border-[rgb(184_198_226)] hover:text-[rgb(34_51_90)]'
    }`;

function VipMedal({ src, alt, className = '' }) {
    if (!src) {
        return (
            <span
                aria-label={alt}
                title={alt}
                className={`inline-flex items-center justify-center rounded-full border border-[rgb(201_208_224)] bg-[linear-gradient(180deg,#eef2f7_0%,#cfd7e6_100%)] text-[10px] font-black uppercase tracking-[0.08em] text-[rgb(67_84_114)] shadow-[0_6px_14px_rgba(148,163,184,0.18)] ${className}`}
            >
                SV
            </span>
        );
    }

    return <img src={src} alt={alt} className={`object-contain ${className}`} />;
}

function UpgradeContent() {
    return (
        <div className="space-y-6">
            <div className="surface-card rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-extrabold text-[rgb(28_40_65)] md:text-xl">How Does It Work?</h3>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-[rgb(78_94_122)]">
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-black text-white">1</span>
                        <span>Members apply to become VIP after reaching the required deposit and valid bet targets within the promotion cycle.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-black text-white">2</span>
                        <span>The VIP team reviews the account performance and may contact the member for profile verification.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-black text-white">3</span>
                        <span>Successful applicants receive tier confirmation, monthly reward eligibility, and access to premium member privileges.</span>
                    </li>
                </ol>
            </div>

            <div className="surface-card overflow-hidden rounded-2xl">
                <div className="border-b border-[rgb(219_228_243)] px-4 py-4 md:px-5">
                    <h3 className="text-lg font-extrabold text-[rgb(28_40_65)] md:text-xl">How to Become Our VIP?</h3>
                    <p className="mt-1 text-sm text-[rgb(93_103_128)]">
                        Move through each level by increasing your qualifying deposits and valid bets.
                    </p>
                </div>

                <div className="hidden md:block">
                    <div className="grid grid-cols-5 bg-[linear-gradient(180deg,#1c63b9_0%,#0f4f9f_100%)] text-center text-xs font-black uppercase tracking-[0.08em] text-white">
                        <div className="border-r border-[rgb(113_154_210)] px-4 py-4">VIP Level</div>
                        <div className="border-r border-[rgb(113_154_210)] px-4 py-4">Monthly Reload</div>
                        <div className="border-r border-[rgb(113_154_210)] px-4 py-4">Annual Reward</div>
                        <div className="border-r border-[rgb(113_154_210)] px-4 py-4">Deposit Point</div>
                        <div className="px-4 py-4">Valid Bet Point</div>
                    </div>

                    {vipLevels.map((level, index) => (
                        <div
                            key={level.tier}
                            className={`grid grid-cols-5 text-center text-sm font-semibold text-[rgb(42_58_88)] ${
                                index % 2 === 0 ? 'bg-[rgb(248_251_255)]' : 'bg-[rgb(240_246_255)]'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2 border-r border-t border-[rgb(219_228_243)] px-4 py-4">
                                <VipMedal src={level.medal} alt={`${level.tier} medal`} className="h-10 w-10 shrink-0 md:h-11 md:w-11" />
                                <span>{level.tier}</span>
                            </div>
                            <div className="border-r border-t border-[rgb(219_228_243)] px-4 py-4">{level.monthlyReload}</div>
                            <div className="border-r border-t border-[rgb(219_228_243)] px-4 py-4">{level.annualReward}</div>
                            <div className="border-r border-t border-[rgb(219_228_243)] px-4 py-4">{level.depositPoint}</div>
                            <div className="border-t border-[rgb(219_228_243)] px-4 py-4">{level.validBetPoint}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 p-4 md:hidden">
                    {vipLevels.map((level) => (
                        <div key={level.tier} className="surface-card rounded-xl p-4">
                            <div className="flex items-center gap-3 text-[rgb(28_40_65)]">
                                <VipMedal src={level.medal} alt={`${level.tier} medal`} className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
                                <h4 className="text-base font-extrabold">{level.tier}</h4>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-lg bg-white p-3 text-[rgb(42_58_88)] shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgb(100_116_139)]">Monthly Reload</p>
                                    <p className="mt-1 font-semibold">{level.monthlyReload}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 text-[rgb(42_58_88)] shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgb(100_116_139)]">Annual Reward</p>
                                    <p className="mt-1 font-semibold">{level.annualReward}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 text-[rgb(42_58_88)] shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgb(100_116_139)]">Deposit Point</p>
                                    <p className="mt-1 font-semibold">{level.depositPoint}</p>
                                </div>
                                <div className="rounded-lg bg-white p-3 text-[rgb(42_58_88)] shadow-[0_4px_12px_rgba(15,23,42,0.04)]">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[rgb(100_116_139)]">Valid Bet Point</p>
                                    <p className="mt-1 font-semibold">{level.validBetPoint}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PrivilegesContent() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {privilegeCards.map(({ title, description, icon: Icon }) => (
                <div
                    key={title}
                    className="surface-card rounded-2xl p-6 md:p-7"
                >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#ffd86f_0%,#ffb038_100%)] text-[var(--color-cta-text)] shadow-[0_8px_14px_rgba(242,154,0,0.22)]">
                        <Icon size={20} strokeWidth={2.25} />
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-[rgb(28_40_65)]">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[rgb(93_103_128)]">{description}</p>
                </div>
            ))}
        </div>
    );
}

function ReferralContent() {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="surface-card rounded-2xl p-6 md:p-7">
                <h3 className="text-lg font-extrabold text-[rgb(28_40_65)] md:text-xl">Referral Rewards</h3>
                <div className="mt-4 space-y-3">
                    {referralBenefits.map((item, index) => (
                        <div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[rgb(93_103_128)]">
                            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgb(24_114_214)] text-xs font-black text-white">
                                {index + 1}
                            </span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="surface-card rounded-2xl p-6 md:p-7">
                <h3 className="text-lg font-extrabold text-[rgb(28_40_65)]">Contact VIP Team</h3>
                <p className="mt-3 text-sm leading-relaxed text-[rgb(93_103_128)]">
                    Need assistance with account review, benefits, or VIP eligibility? Our support team can help you verify your requirements.
                </p>
                <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-[rgb(219_228_243)] bg-[var(--color-surface-subtle)] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgb(100_116_139)]">Email</p>
                        <p className="mt-1 font-semibold text-[rgb(28_40_65)]">vip@riocity.example</p>
                    </div>
                    <div className="rounded-xl border border-[rgb(219_228_243)] bg-[var(--color-surface-subtle)] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgb(100_116_139)]">Support Hours</p>
                        <p className="mt-1 font-semibold text-[rgb(28_40_65)]">24/7 Live Chat Assistance</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn-theme-cta mt-5 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-black tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                >
                    Contact Support
                </button>
            </div>
        </div>
    );
}

export default function VipPage() {
    const [activeTab, setActiveTab] = useState('Upgrade');

    return (
        <main className="w-full bg-[var(--color-page-default)] pb-14">
            <section className="w-full">
                <div className="w-full mx-auto">
                    <div className="relative overflow-hidden shadow-[var(--shadow-live-banner)]">
                        <img
                            src={vipBanner}
                            alt="VIP Banner"
                            className="block h-auto w-full bg-[rgb(216_227_242)]"
                        />
                        <div className="absolute inset-y-0 right-0 flex w-full items-center justify-start md:w-[52%]">
                            <div className="w-full max-w-[520px] px-4 py-4 text-center md:px-8 md:py-7">
                                <h1 className="text-base font-black uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:text-2xl">
                                    VIP Programme
                                </h1>
                                <p className="mx-auto mt-3 max-w-[420px] text-sm font-semibold leading-[1.35] text-[rgb(25_41_71)] md:mt-4 md:text-lg">
                                    Unlock premium rewards, tailored bonuses, and priority support with every VIP tier.
                                </p>
                                <a
                                    href="/register"
                                    className="btn-theme-cta mt-4 inline-flex h-10 min-w-[170px] items-center justify-center rounded-[10px] px-7 text-sm font-black tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] md:mt-6 md:h-14 md:min-w-[240px] md:px-12 md:text-lg"
                                    aria-label="Join VIP now"
                                >
                                    JOIN NOW
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full border-y border-[rgb(219_226_240)] bg-[var(--color-surface-base-85)] backdrop-blur">
                <div className="mx-auto flex h-12 w-full max-w-screen-2xl items-center justify-between px-4 md:px-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(102_112_134)]">
                        Premium VIP Programme
                    </div>
                    <div className="hidden items-center gap-3 text-xs font-semibold text-[rgb(83_96_122)] sm:flex">
                        <span>Exclusive Benefits</span>
                        <span className="h-1 w-1 rounded-full bg-[rgb(153_166_190)]"></span>
                        <span>Priority Support</span>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="soft-blue-panel rounded-[28px] p-4 shadow-[var(--shadow-card-raised)] md:p-6">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-base)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-700)] shadow-[var(--shadow-subtle)]">
                            <Crown size={14} className="text-[var(--color-nav-gold)]" />
                            VIP Group
                        </span>
                        <h1 className="mt-4 text-2xl font-black tracking-tight text-[var(--color-text-strong)] md:text-3xl">
                            Premium rewards for our most active members
                        </h1>
                        <p className="mt-3 max-w-[760px] text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                            Join the VIP programme to unlock monthly reload rewards, exclusive promotions, higher service priority, and a tailored premium experience across the platform.
                        </p>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Starting Tier</p>
                                    <p className="mt-1.5 text-xl font-extrabold text-[var(--color-text-strong)]">Normal</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={normalMedal} alt="Normal medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Top Reward Tier</p>
                                    <p className="mt-1.5 text-xl font-extrabold text-[var(--color-text-strong)]">Diamond</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={diamondMedal} alt="Diamond medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-accent-600)]">Member Support</p>
                                    <p className="mt-1.5 text-xl font-extrabold text-[var(--color-text-strong)]">24 / 7</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-100)] bg-[var(--color-surface-subtle)] p-2 shadow-[var(--shadow-subtle)]">
                                    <img
                                        src={headsetImage}
                                        alt="Headset support"
                                        className="h-11 w-11 object-contain sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 border-t border-[rgb(219_228_243)] pt-5">
                        <div className="flex flex-wrap gap-3">
                        {vipTabs.map((tab) => (
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
                    </div>

                    <div className="mt-6">
                        {activeTab === 'Upgrade' ? <UpgradeContent /> : activeTab === 'Privileges' ? <PrivilegesContent /> : <ReferralContent />}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base)] p-5 shadow-[0_6px_18px_rgba(20,43,87,0.08)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xl font-extrabold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">VIP Highlights</p>
                            <p className="mt-1 text-sm leading-relaxed text-[rgb(93_103_128)]">
                                Monthly reloads, special campaigns, birthday treats, and tailored support designed for loyal members.
                            </p>
                        </div>

                        <a
                            href="/register"
                            className="btn-theme-cta inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            Join Now
                            <ChevronRight size={16} />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
