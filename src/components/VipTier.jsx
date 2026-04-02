import React from 'react';
import SectionHeader from './SectionHeader';
import { Crown } from 'lucide-react';
import vipBgImage from '../assets/vip-bg.png';
import normalMedal from '../assets/Normal.png';
import bronzeMedal from '../assets/bronze.png';
import silverMedal from '../assets/silver.png';
import goldMedal from '../assets/gold.png';
import platinumMedal from '../assets/platinum.png';
import diamondMedal from '../assets/diamond.png';

function VipLevelCard({ vp, className }) {
    return (
        <div className={className}>
            <div className="flex flex-col items-center justify-center px-3 py-4">
                <div className="mb-3 flex w-full items-center justify-center gap-2 border-b border-[rgb(204_238_255_/_0.55)] pb-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[rgb(204_238_255_/_0.65)] bg-[linear-gradient(135deg,#d0f0ff_0%,#f0f8ff_100%)] shadow-[var(--shadow-subtle)]">
                        <img
                            src={vp.medal}
                            alt={`VIP ${vp.tier} medal`}
                            className="h-10 w-10 object-contain"
                            draggable={false}
                        />
                    </div>
                    <h3 className="whitespace-nowrap text-sm font-bold tracking-wide text-[var(--color-brand-secondary)]">
                        VIP {vp.tier}
                    </h3>
                </div>

                <div className="w-full space-y-1 text-center">
                    <p className="text-sm font-bold leading-tight text-[var(--color-brand-primary)]">
                        Valid Bet Point &gt; {vp.btn}
                    </p>
                    <p className="text-sm font-bold leading-tight text-[var(--color-brand-primary)]">
                        Deposit Point = {vp.dep}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VipTier({ onNavigate }) {
    const vipLevels = [
        // Normal, Bronze, Silver, Gold, Platinum, Diamond (from VIP Loyalty Tiers)
        { level: 1, tier: 'Normal', btn: '15,000', dep: '500', medal: normalMedal },
        { level: 2, tier: 'Bronze', btn: '50,000', dep: '2,000', medal: bronzeMedal },
        { level: 3, tier: 'Silver', btn: '120,000', dep: '5,000', medal: silverMedal },
        { level: 4, tier: 'Gold', btn: '180,000', dep: '8,000', medal: goldMedal },
        { level: 5, tier: 'Platinum', btn: '320,000', dep: '18,000', medal: platinumMedal },
        { level: 6, tier: 'Diamond', btn: '1,500,000', dep: '100,000', medal: diamondMedal },
    ];

    return (
        <section className="w-full pt-4 relative">
            <SectionHeader
                title="VIP Group"
                icon={<Crown size={22} fill="currentColor" className="text-[var(--color-brand-secondary)]" />}
                rightLink="More Details"
                rightLinkTo="vip"
                onNavigate={onNavigate}
            />

            <p className="mt-4 mb-8 max-w-[1000px] text-xs font-semibold leading-relaxed text-[var(--color-text-brand-soft)]">
                Join the Riocity9 VIP member group, you will receive many special privileges such as promotion bonus, monthly red envelope bonus, birthday bonus. All of these are special privileges for Riocity9 VIP customers only.
            </p>

            <div className="flex flex-col gap-4 items-center mt-4 md:flex-row">

                {/* Left Side VIP Visual */}
                <div className="relative flex min-h-[250px] w-full items-center justify-center md:w-1/3 lg:justify-start">
                    <img
                        src={vipBgImage}
                        alt="VIP Group"
                        className="h-auto w-[260px] select-none object-contain md:block md:w-[500px]"
                    />
                </div>

                {/* Mobile Slider */}
                <div className="-mx-4 w-screen overflow-x-auto px-4 pb-2 md:hidden">
                    <div className="flex snap-x snap-mandatory gap-3 pr-4">
                        {vipLevels.map((vp) => (
                            <VipLevelCard
                                key={vp.level}
                                vp={vp}
                                className="surface-card min-w-[288px] snap-center overflow-hidden rounded-[22px] border border-white/70 bg-white/90 shadow-[0_8px_20px_rgba(0,114,188,0.06)]"
                            />
                        ))}
                    </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden w-full gap-3 md:grid md:w-2/3 md:grid-cols-3 md:pl-10">
                    {vipLevels.map((vp) => (
                        <VipLevelCard
                            key={vp.level}
                            vp={vp}
                            className="surface-card overflow-hidden rounded-[22px] border border-white/70 bg-white/90 transition-all hover:border-[var(--color-brand-primary)] hover:shadow-[var(--shadow-card-hover)]"
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}


