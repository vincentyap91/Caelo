import React from 'react';

/**
 * Centered status panel (e.g. registration failed) inside the game container.
 * Uses the same surface + spacing tokens as other cards on the site.
 *
 * @param {Object} props
 * @param {string} props.message
 * @param {import('react').ReactNode} [props.actions] — primary/secondary buttons
 */
export default function GameDetailFallbackPanel({ message, actions = null }) {
    return (
        <div
            role="status"
            className="w-full max-w-md rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-5 py-7 text-center shadow-[var(--shadow-card-raised)] sm:px-7 sm:py-8"
        >
            <p className="text-sm font-bold leading-snug tracking-tight text-[var(--color-text-strong)] sm:text-base">
                {message}
            </p>
            {actions ? (
                <div className="mt-6 flex w-full flex-row flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
                    {actions}
                </div>
            ) : null}
        </div>
    );
}
