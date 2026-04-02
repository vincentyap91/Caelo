import React from 'react';
import SectionHeader from './SectionHeader';
import { Crown } from 'lucide-react';
import slotsImage from '../assets/slots.jpg';
import casinoImage from '../assets/casino.jpg';
import sportsImage from '../assets/sports.jpg';
import fishingImage from '../assets/fishing.png';
import eSportsImage from '../assets/e-sports.png';
import lotteryImage from '../assets/lottery.jpg';

const CATEGORY_PAGES = {
    Slots: 'slots',
    Casino: 'live-casino',
    Sports: 'sports',
    Fishing: 'fishing',
    'E-Sports': 'e-sports',
    Lottery: 'lottery',
};

export default function GameCategories({ onNavigate }) {
    const categories = [
        { name: 'Slots', icon: '\u{1F3B0}', bgUrl: slotsImage },
        { name: 'Casino', icon: '\u{1F0CF}', bgUrl: casinoImage },
        { name: 'Sports', icon: '\u{26BD}', bgUrl: sportsImage },
        { name: 'Fishing', icon: '\u{1F41F}', bgUrl: fishingImage },
        { name: 'E-Sports', icon: '\u{1F3AE}', bgUrl: eSportsImage },
        { name: 'Lottery', icon: '\u{1F3AB}', bgUrl: lotteryImage }
    ];

    return (
        <section className="w-full pt-4">
            <SectionHeader
                title="Popular Category"
                icon={<Crown size={22} fill="currentColor" className="text-[var(--color-brand-secondary)]" />}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
                {categories.map((cat, idx) => {
                    const page = CATEGORY_PAGES[cat.name];
                    return (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => page && onNavigate?.(page)}
                        className="group relative flex flex-col rounded-[15px] border border-white bg-[var(--color-brand-soft)] p-1.5 shadow-[0_5px_15px_rgba(0,174,239,0.1)] transition-transform hover:-translate-y-1 text-left w-full"
                    >
                        {/* Title Ribbon - overlaps top edge */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-[86%]">
                            <div className="relative w-full">
                                <div className="absolute inset-x-2 -bottom-1.5 h-2 rounded-full bg-[rgb(0_114_188_/_0.35)] blur-sm"></div>
                                <div className="relative overflow-hidden rounded-[10px] border border-[rgb(140_230_255)] bg-[linear-gradient(90deg,var(--color-brand-secondary)_0%,var(--color-brand-primary)_55%,#00bdf9_100%)] px-2 py-1.5 shadow-[0_8px_14px_rgba(0,114,188,0.35)]">
                                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.4),rgba(255,255,255,0)_45%)]"></div>
                                    <span className="relative block text-center text-white text-xs uppercase font-bold tracking-[0.14em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
                                        {cat.name}
                                    </span>
                                </div>
                                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-y-[11px] border-y-transparent border-l-[12px] border-l-[#46d1ff] drop-shadow-[0_2px_3px_rgba(0,95,158,0.35)]"></div>
                            </div>
                        </div>

                        {/* Image Container - portrait aspect scales with grid cell width */}
                        <div className="relative w-full aspect-[3/4] min-h-[160px] rounded-[10px] overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.bgUrl})` }}
                            />

                            {/* Center Icon */}
                            <div className="absolute bottom-3 left-3 w-9 h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg md:text-xl shadow-[0_0_15px_rgba(255,255,255,0.4)] border border-white/40">
                                {cat.icon}
                            </div>
                        </div>
                    </button>
                    );
                })}
            </div>
        </section>
    );
}

