import React from 'react';
import FooterPaymentMethods from './FooterPaymentMethods';
import footerBeGambleAware from '../assets/footer/18_begambleaware.png';
import footerBmmTestlabs from '../assets/footer/bmmtestlabs.png';
import footerLogoGli from '../assets/footer/GLI-Logo-English.svg';

/** Order: testing / compliance marks, then jurisdiction, then responsible-gaming mark — all from `src/assets/footer` */
const CERTIFICATION_LOGOS = [
    { key: 'gli', src: footerLogoGli, alt: 'Gaming Laboratories International (GLI)' },
    { key: 'bmm', src: footerBmmTestlabs, alt: 'BMM Testlabs' },
    { key: 'begambleaware', src: footerBeGambleAware, alt: 'BeGambleAware' },
];

export default function Footer({ onNavigate, onLiveChatClick, mobileVisualTone = 'default', className = '' }) {
    const softerMobile = mobileVisualTone === 'softer';

    const links = [
        { label: 'About Us', onClick: () => onNavigate?.('about') },
        { label: 'Live Chat', onClick: () => onLiveChatClick?.() },
        { label: 'Referral', onClick: () => onNavigate?.('referral') },
        { label: 'Terms & Conditions', onClick: () => onNavigate?.('help-center', { helpTab: 'tc' }) },
        { label: 'Follow Us', href: '#' },
    ];

    return (
        <footer
            className={`relative flex w-full flex-col border-t border-[rgb(168_226_251)] bg-[linear-gradient(180deg,var(--gradient-footer-start)_0%,var(--gradient-footer-end)_100%)] pb-6 pt-12 ${
                softerMobile ? 'max-md:pt-9 max-md:pb-5' : ''
            } ${className}`.trim()}
        >
            <div className={`page-container relative z-10 flex flex-col gap-6 ${softerMobile ? 'max-md:gap-4' : ''}`}>
                {/* Responsive upper section sharing components between Mobile & Desktop */}
                <div className="relative z-10 flex w-full flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
                    
                    {/* Branding: Logo & Blurb */}
                    <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <div className="inline-flex items-center justify-center rounded-[18px] border border-white/20 bg-white px-4 py-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.14)] md:rounded-[20px] md:px-5 md:py-3 md:translate-y-2">
                            <img
                                src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp"
                                alt="12WIN Logo"
                                className="h-7 w-auto object-contain md:h-8"
                            />
                        </div>
                        <p className="max-w-[28rem] text-xs font-semibold leading-relaxed tracking-wide text-white/90">
                            12WIN offer wide range of highest quality gaming products to our players. Our Customer Support Team is available to assist you 24 hours a day. All personal information will be treated and stored at the strictest and most confidential way.
                        </p>
                    </div>

                    {/* Utilities: Payment Methods & Links (Swapped position: Payment on Top) */}
                    <div className="flex w-full flex-col items-center gap-6 md:w-auto md:items-end md:gap-5">
                        {/* PAYMENT METHOD section */}
                        <div className="flex flex-col items-center gap-2.5 md:items-end">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment Method</h4>
                            <FooterPaymentMethods />
                        </div>

                        {/* About Us Links */}
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-center md:justify-end md:gap-x-2 md:text-right">
                            {links.map((link, idx) => (
                                <React.Fragment key={idx}>
                                    {link.onClick ? (
                                        <button
                                            type="button"
                                            onClick={link.onClick}
                                            className="text-xs font-bold text-white transition-colors hover:text-white/80"
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-xs font-bold text-white transition-colors hover:text-white/80"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                    {idx < links.length - 1 && <span className="select-none text-xs text-white/40">|</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Certifications and Compliance */}
                <div
                    className={`relative z-10 mt-3 flex w-full flex-col justify-center gap-10 border-t border-white/20 pt-6 md:flex-row md:items-center md:gap-20 ${
                        softerMobile ? 'max-md:mt-2 max-md:gap-7 max-md:pt-5' : ''
                    }`}
                >

                    <div className="flex flex-col items-center gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Certificated by</h4>
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
                                        className="h-full w-auto max-w-[5.25rem] object-contain object-center opacity-100 brightness-0 invert sm:max-w-[6rem] md:max-w-[6.75rem]"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Responsible Gaming</h4>
                        <div className="flex items-center gap-4 text-white opacity-95">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-white text-lg font-bold">18+</div>
                            <div className="flex items-center gap-1 font-bold text-xs text-center leading-tight">
                                Be<br />Gamble<br />Aware
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="relative z-10 w-full pb-3 text-center">
                    <p className="text-xs font-bold tracking-wide text-white/70">
                        Copyright 12WIN {'\u00A9'} 2026. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}
