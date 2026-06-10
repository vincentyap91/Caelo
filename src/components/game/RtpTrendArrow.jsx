import React from 'react';

/** Matches 12WIN game-card footer RTP arrows (vertical stem + chevron). */
export default function RtpTrendArrow({ direction = 'up', size = 13, className = '' }) {
    const isUp = direction === 'up';
    const height = Math.round(size * 1.154);

    return (
        <svg
            width={size}
            height={height}
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`rtp-trend-arrow shrink-0 ${isUp ? 'rtp-trend-arrow--up' : 'rtp-trend-arrow--down'} ${className}`.trim()}
            aria-hidden
        >
            {isUp ? (
                <>
                    <line x1="5" y1="10.5" x2="5" y2="4.25" />
                    <polyline points="2.25 5.5 5 2.5 7.75 5.5" />
                </>
            ) : (
                <>
                    <line x1="5" y1="1.5" x2="5" y2="7.75" />
                    <polyline points="2.25 6.5 5 9.5 7.75 6.5" />
                </>
            )}
        </svg>
    );
}
