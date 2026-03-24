import React from 'react';

/**
 * Referral “how it works” icons — same visual language as FeaturesRow (Outstanding Functions):
 * viewBox 80×80, brand blues #00AEEF / #0070C0, highlights #7AD9FF, gold #FFB800 / #FFE566,
 * feDropShadow floodColor #00AEEF44, white gloss ellipses.
 */

/** Step 1 — share / network (brand spheres + link curves, matches game-mode cube palette) */
export function ReferralShare3dIcon({ className = '' }) {
    const u = React.useId().replace(/:/g, 'rs');
    return (
        <svg className={className} viewBox="0 0 80 80" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
                <filter id={`${u}-sd`} x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00AEEF" floodOpacity="0.27" />
                </filter>
                <radialGradient id={`${u}-n1`} cx="36%" cy="28%" r="68%">
                    <stop offset="0%" stopColor="#7AD9FF" />
                    <stop offset="50%" stopColor="#00AEEF" />
                    <stop offset="100%" stopColor="#0070C0" />
                </radialGradient>
                <radialGradient id={`${u}-n2`} cx="34%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#6FE4FF" />
                    <stop offset="100%" stopColor="#0090D8" />
                </radialGradient>
                <radialGradient id={`${u}-n3`} cx="32%" cy="28%" r="66%">
                    <stop offset="0%" stopColor="#FFE566" />
                    <stop offset="55%" stopColor="#FFB800" />
                    <stop offset="100%" stopColor="#CC8800" />
                </radialGradient>
                <linearGradient id={`${u}-ln`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#C8E9FF" stopOpacity="0.55" />
                </linearGradient>
            </defs>
            <g filter={`url(#${u}-sd)`}>
                <path d="M16 48 Q 40 34 64 48" stroke={`url(#${u}-ln)`} strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M24 26 Q 40 42 56 26" stroke={`url(#${u}-ln)`} strokeWidth="2.8" strokeLinecap="round" fill="none" />
                <circle cx="40" cy="56" r="14" fill={`url(#${u}-n1)`} />
                <ellipse cx="34" cy="49" rx="8" ry="5" fill="rgba(255,255,255,0.28)" transform="rotate(-16 34 49)" />
                <circle cx="22" cy="28" r="10" fill={`url(#${u}-n2)`} />
                <ellipse cx="19" cy="23" rx="4" ry="2.5" fill="rgba(255,255,255,0.32)" />
                <circle cx="58" cy="28" r="10" fill={`url(#${u}-n3)`} />
                <ellipse cx="55" cy="23" rx="4" ry="2.5" fill="rgba(255,255,255,0.28)" />
            </g>
        </svg>
    );
}

/** Step 2 — registered (teal/cyan card + gold verify badge, matches cube-cyan + doc star) */
export function ReferralRegistered3dIcon({ className = '' }) {
    const u = React.useId().replace(/:/g, 'rg');
    return (
        <svg className={className} viewBox="0 0 80 80" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
                <filter id={`${u}-sd`} x="-35%" y="-35%" width="170%" height="170%">
                    <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#00AEEF" floodOpacity="0.22" />
                </filter>
                <linearGradient id={`${u}-card`} x1="10" y1="16" x2="58" y2="64">
                    <stop offset="0%" stopColor="#AAFFEE" />
                    <stop offset="45%" stopColor="#00CFAA" />
                    <stop offset="100%" stopColor="#009977" />
                </linearGradient>
                <radialGradient id={`${u}-bd`} cx="32%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#FFE566" />
                    <stop offset="55%" stopColor="#FFB800" />
                    <stop offset="100%" stopColor="#CC8800" />
                </radialGradient>
            </defs>
            <g filter={`url(#${u}-sd)`}>
                <rect x="10" y="18" width="48" height="44" rx="11" fill={`url(#${u}-card)`} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                <rect x="14" y="22" width="40" height="34" rx="7" fill="rgba(255,255,255,0.18)" />
                <circle cx="34" cy="40" r="8" fill="white" fillOpacity="0.95" />
                <path d="M34 49c-4.5 0-8 2.5-8 6h16c0-3.5-3.5-6-8-6z" fill="white" fillOpacity="0.92" />
                <circle cx="56" cy="30" r="13" fill={`url(#${u}-bd)`} stroke="#FFF8E1" strokeWidth="1.8" />
                <ellipse cx="52" cy="25" rx="6" ry="3.5" fill="rgba(255,255,255,0.4)" />
                <path d="M50 31l3.5 3.5 7.5-8" stroke="#0C4A8E" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
}

/** Step 3 — earnings (blue wallet + yellow coins, matches bar + arrow palette from Fast action) */
export function ReferralEarnings3dIcon({ className = '' }) {
    const u = React.useId().replace(/:/g, 're');
    return (
        <svg className={className} viewBox="0 0 80 80" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
                <filter id={`${u}-sd`} x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#00AEEF" floodOpacity="0.25" />
                </filter>
                <linearGradient id={`${u}-wal`} x1="12" y1="22" x2="62" y2="68">
                    <stop offset="0%" stopColor="#7AE4FF" />
                    <stop offset="40%" stopColor="#00AEEF" />
                    <stop offset="100%" stopColor="#0070C0" />
                </linearGradient>
                <radialGradient id={`${u}-c1`} cx="35%" cy="32%" r="68%">
                    <stop offset="0%" stopColor="#FFF8E1" />
                    <stop offset="45%" stopColor="#FFD740" />
                    <stop offset="100%" stopColor="#FF8F00" />
                </radialGradient>
                <radialGradient id={`${u}-c2`} cx="38%" cy="30%" r="62%">
                    <stop offset="0%" stopColor="#FFE566" />
                    <stop offset="100%" stopColor="#FFB800" />
                </radialGradient>
            </defs>
            <g filter={`url(#${u}-sd)`}>
                <path
                    d="M12 30c0-3.5 2.8-5.5 6-5.5h38c5.5 0 10 4.5 10 10v26c0 4.5-3.5 8-8 8H20c-3.5 0-6-2.8-6-6.5V30z"
                    fill={`url(#${u}-wal)`}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.2"
                />
                <path d="M12 34h48v7H12v-7z" fill="#004EA0" fillOpacity="0.35" />
                <rect x="48" y="42" width="20" height="12" rx="2.5" fill="#E3F2FD" fillOpacity="0.95" />
                <rect x="50" y="44" width="16" height="8" rx="1.5" fill="#BBDEFB" fillOpacity="0.5" />
                <circle cx="26" cy="22" r="10" fill={`url(#${u}-c1)`} stroke="#FFFDE7" strokeWidth="1.4" />
                <ellipse cx="22" cy="17" rx="4.5" ry="2.8" fill="rgba(255,255,255,0.45)" />
                <circle cx="26" cy="22" r="5" fill="none" stroke="#B45309" strokeWidth="1.1" opacity="0.6" />
                <circle cx="62" cy="20" r="8" fill={`url(#${u}-c2)`} stroke="#FFF8E1" strokeWidth="1.2" />
                <ellipse cx="59" cy="16" rx="3.5" ry="2.2" fill="rgba(255,255,255,0.42)" />
            </g>
        </svg>
    );
}
