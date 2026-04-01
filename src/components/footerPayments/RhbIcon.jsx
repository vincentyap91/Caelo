import React from 'react';

export default function RhbIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 28" className={props.className} aria-hidden>
            <g transform="translate(1 3)">
                <rect x="0" y="0" width="9" height="9" transform="rotate(45 4.5 4.5)" fill="#D71920" />
                <rect x="7.8" y="0" width="9" height="9" transform="rotate(45 12.3 4.5)" fill="#D71920" />
                <rect x="15.6" y="0" width="9" height="9" transform="rotate(45 20.1 4.5)" fill="#D71920" />
            </g>
            <text x="33" y="18.2" fill="#1F2937" fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="700">
                RHB
            </text>
        </svg>
    );
}
