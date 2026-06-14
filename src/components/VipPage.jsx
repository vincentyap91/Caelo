import React, { useRef, useState } from 'react';
import { ChevronRight, Crown } from 'lucide-react';
import normalMedal from '../assets/Normal.png';
import diamondMedal from '../assets/diamond.png';
import headsetImage from '../assets/headset.png';
import vipBanner from '../assets/vip-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { VIP_MEMBERSHIP_TABS, VIP_MEMBERSHIP_TIERS } from '../constants/vipMembershipTiers';
import { scrollTabIntoViewSmooth } from './HorizontalScrollTabRow';

function VipMedal({ src, alt, className = '' }) {
    if (!src) {
        return (
            <span
                aria-label={alt}
                title={alt}
                className={`inline-flex items-center justify-center rounded-full border border-[var(--color-border-subtle)] bg-gradient-vip-tier-muted text-xs font-bold uppercase tracking-wide text-[var(--color-text-secondary)] shadow-[var(--shadow-subtle)] ${className}`}
            >
                VIP
            </span>
        );
    }

    return <img src={src} alt={alt} className={`object-contain ${className}`} />;
}

function MembershipDataTable({ title, rows }) {
    return (
        <div className="vip-membership-table">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="vip-membership-brand-gradient">
                        <th colSpan={2} className="vip-membership-table__head">
                            {title}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label}>
                            <td className="vip-membership-table__label">{row.label}</td>
                            <td className="vip-membership-table__value">{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function MembershipBenefitsContent({ tier }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <MembershipDataTable title="Membership Benefits" rows={tier.benefits} />
            <MembershipDataTable title="Member Rebates" rows={tier.rebates} />
        </div>
    );
}

function MembershipRequirementsContent({ tier }) {
    return <MembershipDataTable title="Requirements" rows={tier.requirements} />;
}

function MembershipSectionTabs({ items, value, onChange }) {
    const tabRefs = useRef({});

    return (
        <div className="vip-membership-tabs" role="tablist" aria-label="Membership sections">
            {items.map((item) => {
                const active = value === item.id;

                return (
                    <button
                        key={item.id}
                        ref={(el) => {
                            if (el) tabRefs.current[item.id] = el;
                            else delete tabRefs.current[item.id];
                        }}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => {
                            onChange(item.id);
                            scrollTabIntoViewSmooth(tabRefs.current[item.id]);
                        }}
                        className={`vip-membership-tabs__tab ${active ? 'vip-membership-tabs__tab--active' : ''}`}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}

function VipTierSelector({ tiers, value, onChange }) {
    return (
        <div>
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] md:text-xl">VIP Privileges</h2>
            <div className="vip-tier-grid mt-4">
                {tiers.map((tier) => {
                    const selected = value === tier.id;

                    return (
                        <button
                            key={tier.id}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => onChange(tier.id)}
                            className={`vip-tier-card ${selected ? 'vip-tier-card--selected vip-membership-brand-gradient' : ''}`}
                        >
                            <VipMedal src={tier.medal} alt={`${tier.tier} medal`} className="h-11 w-11" />
                            <span className="text-sm font-bold">{tier.tier}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function VipPage({ authUser }) {
    const [selectedTierId, setSelectedTierId] = useState(VIP_MEMBERSHIP_TIERS[0].id);
    const [activeTab, setActiveTab] = useState(VIP_MEMBERSHIP_TABS[0].id);
    const selectedTier = VIP_MEMBERSHIP_TIERS.find((tier) => tier.id === selectedTierId) ?? VIP_MEMBERSHIP_TIERS[0];
    const showBannerCta = !authUser;

    return (
        <main className="vip-page w-full bg-[var(--color-surface-base)] pb-14">
            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={vipBanner}
                            alt="VIP Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[52%] md:justify-start md:pr-0">
                            <div className="flex w-full max-w-[500px] flex-col items-center justify-center px-2 py-2 text-center max-md:justify-center md:max-w-[520px] md:px-8 md:py-7">
                                <h1
                                    className="bg-gradient-vip-badge bg-clip-text text-lg font-bold uppercase tracking-wide text-transparent max-md:leading-tight md:text-3xl md:tracking-wide"
                                    style={{
                                        textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(0,0,0,0.3), 0 4px 16px rgba(230,168,0,0.25)',
                                    }}
                                >
                                    VIP Programme
                                </h1>
                                <p className="mx-auto mt-2 hidden max-w-[420px] text-base font-medium leading-relaxed text-[var(--color-text-primary)] md:mt-5 md:block">
                                    Unlock premium rewards, tailored bonuses, and priority support with every VIP tier.
                                </p>
                                {showBannerCta && (
                                    <a
                                        href="/register"
                                        className="btn-theme-cta mt-2 inline-flex h-9 min-w-[150px] items-center justify-center rounded-[10px] px-5 text-xs font-bold transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-cta-inverse)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-mid-container)] md:mt-6 md:h-14 md:min-w-[240px] md:px-12 md:text-lg"
                                        aria-label="Join VIP now"
                                    >
                                        JOIN NOW
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="soft-blue-panel rounded-[28px] p-4 shadow-[var(--shadow-card-raised)] md:p-6">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-surface-base)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-text-title)] shadow-[var(--shadow-subtle)]">
                            <Crown size={14} className="text-[var(--color-accent)]" />
                            VIP Club
                        </span>
                        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
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
                                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-title)]">Starting Tier</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-primary)]">Normal</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={normalMedal} alt="Normal medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-title)]">Top Reward Tier</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-primary)]">Diamond</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-surface-subtle)] p-1.5 shadow-[var(--shadow-subtle)]">
                                    <VipMedal src={diamondMedal} alt="Diamond medal" className="h-12 w-12 sm:h-11 sm:w-11 lg:h-12 lg:w-12" />
                                </div>
                            </div>
                        </div>
                        <div className="surface-card rounded-2xl px-4 py-4 md:px-5 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-text-title)]">Member Support</p>
                                    <p className="mt-1.5 text-xl font-bold text-[var(--color-text-primary)]">24 / 7</p>
                                </div>
                                <div className="shrink-0 rounded-full border border-[var(--color-accent-glow)] bg-[var(--color-surface-subtle)] p-2 shadow-[var(--shadow-subtle)]">
                                    <img
                                        src={headsetImage}
                                        alt="Headset support"
                                        className="h-11 w-11 object-contain sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <VipTierSelector tiers={VIP_MEMBERSHIP_TIERS} value={selectedTierId} onChange={setSelectedTierId} />
                    </div>

                    <div className="mt-5 border-t border-[var(--color-border-subtle)] pt-5">
                        <MembershipSectionTabs items={VIP_MEMBERSHIP_TABS} value={activeTab} onChange={setActiveTab} />
                    </div>

                    <div className="mt-5">
                        {activeTab === 'benefits' ? (
                            <MembershipBenefitsContent tier={selectedTier} />
                        ) : (
                            <MembershipRequirementsContent tier={selectedTier} />
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-base)] p-5 shadow-[var(--shadow-live-card)]">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xl font-bold text-[var(--color-text-primary)] md:text-2xl">VIP Highlights</p>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                                Monthly reloads, special campaigns, birthday treats, and tailored support designed for loyal members.
                            </p>
                        </div>

                        <a
                            href="/register"
                            className="btn-theme-cta inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:brightness-105"
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
