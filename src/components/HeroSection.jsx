import React from 'react';
import { Volume2 } from 'lucide-react';
import homeBanner from '../assets/homebanner.jpg';
import { PAGE_BANNER_IMG } from '../constants/pageBannerClasses';

export default function HeroSection() {
    return (
        <div className="relative w-full overflow-hidden bg-[var(--color-brand-primary)]">
            {/* Main Hero Container — mobile fixed height matches site-wide banners */}
            <div className="relative flex w-full max-md:h-[135px] max-md:overflow-hidden flex-col justify-end">
                <img
                    src={homeBanner}
                    alt="Hero Banner"
                    className={PAGE_BANNER_IMG}
                />

                {/* Carousel indicator bar inside hero */}
                <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 md:bottom-6">
                    <div className="h-8 w-8 border-b-[3px] border-white md:h-10 md:w-8 md:border-b-4"></div>
                    <div className="h-8 w-8 border-b-[3px] border-white/40 md:h-10 md:w-8 md:border-b-4"></div>
                    <div className="h-8 w-8 border-b-[3px] border-white/40 md:h-10 md:w-8 md:border-b-4"></div>
                </div>
            </div>

            {/* Marquee row immediately under hero */}
            <div className="relative z-20 flex h-[35px] w-full items-center border-t border-[rgb(52_196_249)] border-b border-b-2 border-white bg-[var(--color-brand-primary)] shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center px-4 md:px-8">
                    <div className="flex items-center justify-center shrink-0 pr-4 text-white">
                        <Volume2 size={16} fill="currentColor" strokeWidth={1} />
                    </div>
                    <div className="relative flex h-full flex-1 items-center overflow-hidden">
                        <div className="inline-block whitespace-nowrap animate-marquee text-xs font-medium text-white/90 will-change-transform">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
