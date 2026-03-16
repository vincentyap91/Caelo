import React from 'react';
import { Volume2 } from 'lucide-react';
import homeBanner from '../assets/homebanner.jpg';

export default function HeroSection() {
    return (
        <div className="relative w-full overflow-hidden bg-[var(--color-brand-primary)]">
            {/* Main Hero Container */}
            <div className="w-full relative flex flex-col justify-end">
                <img
                    src={homeBanner}
                    alt="Hero Banner"
                    className="w-full h-auto object-cover"
                />

                {/* Carousel indicator bar inside hero */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30">
                    <div className="w-8 h-10 border-b-4 border-white"></div>
                    <div className="w-8 h-10 border-b-4 border-white/40"></div>
                    <div className="w-8 h-10 border-b-4 border-white/40"></div>
                </div>
            </div>

            {/* Marquee row immediately under hero */}
            <div className="relative z-20 flex h-[35px] w-full items-center border-t border-[rgb(52_196_249)] border-b border-b-2 border-white bg-[var(--color-brand-primary)] shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center px-4 md:px-8">
                    <div className="flex items-center justify-center shrink-0 pr-4 text-white">
                        <Volume2 size={16} fill="currentColor" strokeWidth={1} />
                    </div>
                    <div className="flex-1 overflow-hidden h-full flex items-center relative">
                        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] text-xs text-white/90">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
