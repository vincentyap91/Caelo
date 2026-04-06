import React from 'react';
import FooterPaymentMethods from './FooterPaymentMethods';
import footerBeGambleAware from '../assets/footer/18_begambleaware.png';
import footerBmmTestlabs from '../assets/footer/bmmtestlabs.png';
import footerLogoGli from '../assets/footer/GLI-Logo-English.svg';
import footerLogoITech from '../assets/footer/iTech-Logo.svg';
import footerPagcor from '../assets/footer/PAGCORlogos.png';

/** Order: testing / compliance marks, then jurisdiction, then responsible-gaming mark â€” all from `src/assets/footer` */
const CERTIFICATION_LOGOS = [
    { key: 'itech', src: footerLogoITech, alt: 'iTech Labs' },
    { key: 'gli', src: footerLogoGli, alt: 'Gaming Laboratories International (GLI)' },
    { key: 'bmm', src: footerBmmTestlabs, alt: 'BMM Testlabs' },
    { key: 'pagcor', src: footerPagcor, alt: 'PAGCOR' },
    { key: 'begambleaware', src: footerBeGambleAware, alt: 'BeGambleAware' },
];

export default function Footer({ onNavigate, onLiveChatClick }) {
    const links = [
        { label: 'About Us', onClick: () => onNavigate?.('about') },
        { label: 'Live Chat', onClick: () => onLiveChatClick?.() },
        { label: 'Referral', onClick: () => onNavigate?.('referral') },
        { label: 'Terms & Conditions', onClick: () => onNavigate?.('help-center', { helpTab: 'tc' }) },
        { label: 'Follow Us', href: '#' },
    ];

    return (
        <footer className="relative flex w-full flex-col border-t border-[rgb(168_226_251)] bg-[linear-gradient(180deg,var(--gradient-footer-start)_0%,var(--gradient-footer-end)_100%)] pb-6 pt-12">
            <div className="page-container relative z-10 flex flex-col gap-8">

                {/* Huge opaque LOGO in center background of footer content */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
                    <h2 className="text-2xl font-bold italic text-white/50 drop-shadow-sm tracking-widest">LOGO</h2>
                </div>

                {/* Top Info & Links Row */}
                <div className="flex flex-col md:flex-row justify-between w-full pt-8 relative z-10 gap-6">
                    {/* Description Left */}
                    <div className="flex-1 max-w-[450px]">
                        <p className="text-xs font-semibold leading-relaxed tracking-wide text-[var(--color-brand-secondary)] opacity-90">
                            Riocity9 offer wide range of highest quality gaming products to our players. Our Customer Support Team is available to assist you 24 hours a day. All personal information will be treated and stored at the strictest and most confidential way.
                        </p>
                    </div>
                    {/* Navigation Right */}
                    <div className="flex-1 flex flex-wrap justify-end gap-x-2 gap-y-2 content-start self-start pt-1">
                        {links.map((link, idx) => (
                            <React.Fragment key={idx}>
                                <button
                                    type="button"
                                    onClick={link.onClick}
                                    className="text-xs font-semibold text-[var(--color-brand-secondary)] transition-colors hover:text-[var(--color-brand-primary)]"
                                >
                                    {link.label}
                                </button>
                                {idx < links.length - 1 && <span className="select-none text-xs text-[rgb(0_174_239_/_0.5)]">|</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="relative z-10 mt-6 flex w-full flex-col items-center gap-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">Payment Method</h4>
                    <FooterPaymentMethods />
                </div>

                {/* Certifications and Compliance */}
                <div className="w-full flex flex-col md:flex-row justify-center gap-12 md:gap-24 relative z-10 mt-4 border-t border-white/50 pt-8">

                    <div className="flex flex-col items-center gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">Certificated by</h4>
                        <div
                            className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-3.5 px-1 sm:gap-x-5 sm:gap-y-4 md:gap-x-6"
                            role="list"
                            aria-label="Certification badges"
                        >
                            {CERTIFICATION_LOGOS.map(({ key, src, alt }) => (
                                <div
                                    key={key}
                                    className="flex h-8 shrink-0 items-center justify-center sm:h-9 md:h-10"
                                    role="listitem"
                                >
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="h-full w-auto max-w-[5.25rem] object-contain object-center opacity-90 sm:max-w-[6rem] md:max-w-[6.75rem]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">Responsible Gaming</h4>
                        <div className="flex items-center gap-4 text-[var(--color-brand-secondary)] opacity-80 mix-blend-color-burn">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-[var(--color-brand-secondary)] text-lg font-bold">18+</div>
                            <div className="flex items-center gap-1 font-bold text-xs text-center leading-tight">
                                Be<br />Gamble<br />Aware
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="w-full text-center relative z-10 pb-4">
                    <p className="text-xs font-semibold tracking-wide text-[var(--color-brand-primary)]">
                        Copyright Riocity9 {'\u00A9'} 2026. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}

