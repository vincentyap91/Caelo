import React from 'react';

/**
 * Centered status panel (e.g. registration failed) inside the game container.
 * @param {Object} props
 * @param {string} props.message
 * @param {import('react').ReactNode} [props.actions] — primary/secondary buttons
 */
export default function GameDetailFallbackPanel({ message, actions = null }) {
    return (
        <div
            role="status"
            className="max-w-md rounded-2xl border border-white/10 bg-[rgb(30_41_59_/_0.95)] px-6 py-8 text-center shadow-xl backdrop-blur-sm md:px-10"
        >
            <p className="text-base font-semibold text-white md:text-lg">{message}</p>
            {actions ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
        </div>
    );
}
