import React from 'react';
import { Megaphone } from 'lucide-react';
import homeBanner from '../assets/homebanner.jpg';
import { PAGE_BANNER_IMG } from '../constants/pageBannerClasses';

export default function HeroSection() {
    return (
        <div className="relative w-full overflow-hidden bg-[var(--color-brand-primary)]">
            <div className="relative flex w-full flex-col justify-end pt-1 md:pt-0">
                <img
                    src={homeBanner}
                    alt="Hero Banner"
                    className="block w-full h-auto min-h-[170px] object-cover object-center"
                />

                {/* Carousel indicator bar inside hero */}
                <div className="absolute bottom-1 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 md:bottom-4">
                    <div className="h-1.5 w-6 rounded-full bg-white md:h-2 md:w-8"></div>
                    <div className="h-1.5 w-6 rounded-full bg-white/40 md:h-2 md:w-8"></div>
                    <div className="h-1.5 w-6 rounded-full bg-white/40 md:h-2 md:w-8"></div>
                </div>
            </div>

            {/* Marquee row immediately under hero */}
            <div className="relative z-20 flex min-h-9 w-full items-center border-t border-[rgb(52_196_249)] border-b-2 border-white bg-[var(--color-brand-primary)] py-1 shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-2 px-3 md:gap-3 md:px-8">
                    <div className="flex shrink-0 items-center justify-center text-white">
                        <Megaphone size={16} strokeWidth={2} className="opacity-95" aria-hidden />
                    </div>
                    <div className="relative flex min-h-8 flex-1 items-center overflow-hidden md:min-h-9">
                        <div className="inline-block whitespace-nowrap animate-marquee text-xs font-medium text-white/90 will-change-transform">
                            Dear valued customer, we are upgrading our payment channels for faster deposits. Promotions and VIP rewards are available daily — play responsibly and enjoy your experience.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
