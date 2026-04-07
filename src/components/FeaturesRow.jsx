import React from 'react';
import SectionHeader from './SectionHeader';
import { Crown } from 'lucide-react';

/* ─── 3D SVG Icon: Prestigious Brands ─── person holding document */
const IconPrestigiousBrands = () => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <defs>
            <radialGradient id="pb-body" cx="38%" cy="28%" r="65%">
                <stop offset="0%" stopColor="#7AD9FF" />
                <stop offset="55%" stopColor="#00AEEF" />
                <stop offset="100%" stopColor="#0070C0" />
            </radialGradient>
            <radialGradient id="pb-head" cx="38%" cy="30%" r="62%">
                <stop offset="0%" stopColor="#8ADEFF" />
                <stop offset="55%" stopColor="#29B6F6" />
                <stop offset="100%" stopColor="#0277BD" />
            </radialGradient>
            <radialGradient id="pb-doc" cx="30%" cy="25%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#C8E9FF" />
            </radialGradient>
            <filter id="pb-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00AEEF55" />
            </filter>
        </defs>
        {/* Body */}
        <ellipse cx="32" cy="62" rx="18" ry="11" fill="url(#pb-body)" filter="url(#pb-shadow)" />
        <rect x="20" y="38" width="24" height="26" rx="8" fill="url(#pb-body)" />
        {/* Head */}
        <circle cx="32" cy="30" r="13" fill="url(#pb-head)" filter="url(#pb-shadow)" />
        <ellipse cx="29" cy="25" rx="5" ry="3" fill="rgba(255,255,255,0.30)" transform="rotate(-25 29 25)" />
        {/* Document held in right hand */}
        <rect x="44" y="32" width="22" height="28" rx="4" fill="url(#pb-doc)" stroke="#90CAF9" strokeWidth="1.5" filter="url(#pb-shadow)" />
        {/* Lines on doc */}
        <rect x="48" y="38" width="13" height="2" rx="1" fill="#90CAF9" />
        <rect x="48" y="43" width="10" height="2" rx="1" fill="#90CAF9" />
        <rect x="48" y="48" width="13" height="2" rx="1" fill="#90CAF9" />
        <rect x="48" y="53" width="8" height="2" rx="1" fill="#90CAF9" />
        {/* Star badge on doc */}
        <polygon points="57,33 58.2,36.3 61.8,36.3 59,38.4 60.2,41.7 57,39.6 53.8,41.7 55,38.4 52.2,36.3 55.8,36.3"
            fill="#FFB800" />
        {/* Arm */}
        <path d="M44 46 Q40 44 44 38" stroke="#00AEEF" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
);

/* ─── 3D SVG Icon: Variety of game modes ─── isometric cubes */
const IconGameModes = () => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <defs>
            <linearGradient id="cube-blue-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6FE4FF" />
                <stop offset="100%" stopColor="#00AEEF" />
            </linearGradient>
            <linearGradient id="cube-blue-left" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00AEEF" />
                <stop offset="100%" stopColor="#0070C0" />
            </linearGradient>
            <linearGradient id="cube-blue-right" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5BBFE8" />
                <stop offset="100%" stopColor="#007BBF" />
            </linearGradient>
            <linearGradient id="cube-yellow-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE566" />
                <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
            <linearGradient id="cube-yellow-left" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFB800" />
                <stop offset="100%" stopColor="#CC8800" />
            </linearGradient>
            <linearGradient id="cube-yellow-right" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD740" />
                <stop offset="100%" stopColor="#CC9900" />
            </linearGradient>
            <linearGradient id="cube-cyan-top" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#AAFFEE" />
                <stop offset="100%" stopColor="#00CFAA" />
            </linearGradient>
            <linearGradient id="cube-cyan-left" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00CFAA" />
                <stop offset="100%" stopColor="#009977" />
            </linearGradient>
            <filter id="cube-shadow">
                <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#00000022" />
            </filter>
        </defs>

        {/* Bottom-left cube (blue) */}
        <g filter="url(#cube-shadow)" transform="translate(4, 28)">
            {/* top face */}
            <polygon points="18,0 36,9 18,18 0,9" fill="url(#cube-blue-top)" />
            {/* left face */}
            <polygon points="0,9 18,18 18,36 0,27" fill="url(#cube-blue-left)" />
            {/* right face */}
            <polygon points="18,18 36,9 36,27 18,36" fill="url(#cube-blue-right)" />
            <polygon points="18,0 36,9 18,18 0,9" fill="rgba(255,255,255,0.18)" />
        </g>

        {/* Top-center cube (yellow) */}
        <g filter="url(#cube-shadow)" transform="translate(22, 10)">
            <polygon points="18,0 36,9 18,18 0,9" fill="url(#cube-yellow-top)" />
            <polygon points="0,9 18,18 18,36 0,27" fill="url(#cube-yellow-left)" />
            <polygon points="18,18 36,9 36,27 18,36" fill="url(#cube-yellow-right)" />
            <polygon points="18,0 36,9 18,18 0,9" fill="rgba(255,255,255,0.20)" />
        </g>

        {/* Bottom-right cube (cyan) */}
        <g filter="url(#cube-shadow)" transform="translate(40, 28)">
            <polygon points="18,0 36,9 18,18 0,9" fill="url(#cube-cyan-top)" />
            <polygon points="0,9 18,18 18,36 0,27" fill="url(#cube-cyan-left)" />
            <polygon points="18,18 36,9 36,27 18,36" fill="url(#cube-cyan-left)" />
            <polygon points="18,0 36,9 18,18 0,9" fill="rgba(255,255,255,0.18)" />
        </g>
    </svg>
);

/* ─── 3D SVG Icon: Guaranteed safety ─── glossy blue shield + checkmark */
const IconGuaranteedSafety = () => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <defs>
            <radialGradient id="sh-outer" cx="36%" cy="24%" r="68%">
                <stop offset="0%" stopColor="#7AE4FF" />
                <stop offset="45%" stopColor="#00AEEF" />
                <stop offset="100%" stopColor="#005596" />
            </radialGradient>
            <radialGradient id="sh-inner" cx="36%" cy="28%" r="65%">
                <stop offset="0%" stopColor="#50D4FF" />
                <stop offset="55%" stopColor="#0090D8" />
                <stop offset="100%" stopColor="#004A88" />
            </radialGradient>
            <filter id="sh-shadow">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#00AEEF44" />
            </filter>
        </defs>
        {/* Outer shield */}
        <path d="M40 8 L10 20 L10 42 C10 58 24 70 40 74 C56 70 70 58 70 42 L70 20 Z"
            fill="url(#sh-outer)" filter="url(#sh-shadow)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        {/* Inner shield panel */}
        <path d="M40 16 L17 26 L17 43 C17 55 27 65 40 68 C53 65 63 55 63 43 L63 26 Z"
            fill="url(#sh-inner)" />
        {/* Checkmark */}
        <path d="M27 42 L35 52 L55 30" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Highlight gloss */}
        <ellipse cx="32" cy="22" rx="10" ry="5" fill="rgba(255,255,255,0.28)" transform="rotate(-18 32 22)" />
    </svg>
);

/* ─── 3D SVG Icon: Fast action ─── analytics growth chart + upward arrow */
const IconFastAction = () => (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <defs>
            {/* Bar gradients */}
            <linearGradient id="fa-bar1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7AE4FF" />
                <stop offset="100%" stopColor="#0070C0" />
            </linearGradient>
            <linearGradient id="fa-bar2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#50CFFF" />
                <stop offset="100%" stopColor="#0090D8" />
            </linearGradient>
            <linearGradient id="fa-bar3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00AEEF" />
                <stop offset="100%" stopColor="#004EA0" />
            </linearGradient>
            <linearGradient id="fa-bar4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#29B6F6" />
                <stop offset="100%" stopColor="#003580" />
            </linearGradient>
            {/* Arrow gradient */}
            <linearGradient id="fa-arrow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD740" />
                <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
            <filter id="fa-glow">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00AEEF44" />
            </filter>
            <filter id="fa-arrow-glow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FFB80066" />
            </filter>
        </defs>

        {/* ── Base / floor line ── */}
        <rect x="8" y="64" width="64" height="3" rx="1.5" fill="#C8E9FF" />

        {/* ── Chart bars (rising left to right) ── */}
        {/* Bar 1 */}
        <rect x="10" y="50" width="11" height="14" rx="3" fill="url(#fa-bar1)" filter="url(#fa-glow)" />
        <rect x="11" y="51" width="4" height="4" rx="1.5" fill="rgba(255,255,255,0.30)" />
        {/* Bar 2 */}
        <rect x="25" y="40" width="11" height="24" rx="3" fill="url(#fa-bar2)" filter="url(#fa-glow)" />
        <rect x="26" y="41" width="4" height="5" rx="1.5" fill="rgba(255,255,255,0.30)" />
        {/* Bar 3 */}
        <rect x="40" y="28" width="11" height="36" rx="3" fill="url(#fa-bar3)" filter="url(#fa-glow)" />
        <rect x="41" y="29" width="4" height="6" rx="1.5" fill="rgba(255,255,255,0.30)" />
        {/* Bar 4 */}
        <rect x="55" y="16" width="11" height="48" rx="3" fill="url(#fa-bar4)" filter="url(#fa-glow)" />
        <rect x="56" y="17" width="4" height="7" rx="1.5" fill="rgba(255,255,255,0.30)" />

        {/* ── Trend line across bar tops ── */}
        <polyline
            points="15,50 30,40 45,28 60,16"
            stroke="#00E676"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        {/* Trend dots */}
        <circle cx="15" cy="50" r="2.5" fill="#00E676" />
        <circle cx="30" cy="40" r="2.5" fill="#00E676" />
        <circle cx="45" cy="28" r="2.5" fill="#00E676" />
        <circle cx="60" cy="16" r="2.5" fill="white" stroke="#00E676" strokeWidth="2" />

        {/* ── Upward arrow (top-right) ── */}
        <g filter="url(#fa-arrow-glow)">
            {/* Arrow shaft */}
            <rect x="61" y="8" width="4" height="14" rx="2" fill="url(#fa-arrow)" />
            {/* Arrow head */}
            <polygon points="57,14 63,4 69,14" fill="url(#fa-arrow)" />
        </g>

        {/* ── Y-axis line ── */}
        <rect x="7" y="10" width="2.5" height="54" rx="1.25" fill="#C8E9FF" />
    </svg>
);

/* ─── Feature row items ─────────────────────────── */
/* NBSP keeps short phrases together so wrapping looks intentional on narrow cards */
const features = [
    { title: 'Prestigious\u00a0Brands', icon: <IconPrestigiousBrands /> },
    { title: 'Variety of game\u00a0modes', icon: <IconGameModes /> },
    { title: 'Guaranteed\u00a0safety', icon: <IconGuaranteedSafety /> },
    { title: 'Fast\u00a0action', icon: <IconFastAction /> },
];

export default function FeaturesRow() {
    return (
        <section className="w-full pt-8">
            <SectionHeader
                title="Outstanding Functions"
                icon={<Crown size={22} fill="currentColor" className="text-[var(--color-brand-secondary)]" />}
            />

            <div className="mt-8 grid grid-cols-2 items-stretch gap-3.5 px-4 sm:gap-4 lg:flex lg:items-center lg:justify-between lg:gap-4">
                {features.map((item, idx) => (
                    <div
                        key={idx}
                        className="group flex h-full min-h-[7.5rem] min-w-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-white bg-[rgb(255_255_255_/_0.4)] px-3 py-4 text-center shadow-[0_5px_15px_rgba(0,174,239,0.05)] transition-transform hover:-translate-y-1 sm:gap-3 sm:px-3.5 sm:py-[1.125rem] lg:min-h-0 lg:min-w-[200px] lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-3 lg:px-4 lg:py-3 lg:text-left"
                    >
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-soft)] bg-[var(--color-surface-base)] p-1 shadow-sm transition-transform group-hover:scale-110 lg:h-auto lg:w-auto lg:p-2">
                            {item.icon}
                        </div>
                        <span className="w-full text-pretty text-xs font-semibold leading-snug tracking-tight text-[var(--color-brand-secondary)] sm:text-sm lg:max-w-[120px] lg:flex-none lg:font-bold lg:leading-tight lg:tracking-normal">
                            {item.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
