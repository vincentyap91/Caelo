import React from 'react';

export default function MaybankIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 28" className={props.className} aria-hidden>
            <rect x="0.75" y="2.75" width="22.5" height="22.5" rx="5" fill="#FFCD00" stroke="#E5B800" strokeWidth="1.5" />
            <path
                d="M6.5 18.5 9 9.5h1.9l2.1 5.5 2.1-5.5H17l2.5 9h-1.8l-1.4-5.5-2 5.1h-1.3l-2-5.1-1.4 5.5z"
                fill="#111827"
            />
            <text x="30" y="18.2" fill="#1F2937" fontFamily="Poppins, sans-serif" fontSize="12.5" fontWeight="700">
                Maybank
            </text>
        </svg>
    );
}
