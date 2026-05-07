import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

/**
 * AnnouncementModal - A premium pop-up component for site-wide announcements.
 * Strictly uses theme.css tokens and follows the "Compact and Tidy" principle.
 */
export default function AnnouncementModal({ isOpen, onClose }) {
    // Prevent body scroll when modal is active
    useBodyScrollLock(isOpen);

    // Escape key listener for accessibility
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 backdrop-blur-[1px]">
            {/* Backdrop Button (Click outside to close) */}
            <div 
                className="fixed inset-0 cursor-default" 
                onClick={onClose} 
                aria-hidden="true" 
            />

            <div className="flex min-h-full items-center justify-center p-4 py-10 sm:py-20">
                {/* Modal Container - Natural height, scrolls with parent */}
                <section
                    role="dialog"
                    aria-modal="true"
                    aria-label="Announcement"
                    className="relative z-10 w-full max-w-[520px] rounded-2xl border border-[var(--color-border-brand)] bg-[linear-gradient(180deg,var(--gradient-register-page-start)_0%,var(--gradient-register-panel-mid)_52%,var(--gradient-register-panel-end)_100%)] px-5 pb-6 pt-8 shadow-[var(--shadow-modal)] sm:px-8 sm:pb-8 sm:pt-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-deep)] text-white transition hover:brightness-95 shadow-md"
                    >
                        <X size={18} strokeWidth={3} />
                    </button>

                    {/* Logo Section */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp" 
                            alt="Logo" 
                            className="h-[32px] sm:h-[40px] w-auto object-contain" 
                        />
                    </div>

                    {/* Body Content (The Flyer) - Full length, no internal scroll */}
                    <div className="w-full overflow-hidden rounded-xl border border-[var(--color-border-brand)] bg-white/10 shadow-sm">
                        <img
                            src="https://pksoftcdn.azureedge.net/media/photo_2025-11-28_14-33-32-202511281531246740-202512081112519749-202604010908201320.webp"
                            alt="Announcement Flyer"
                            className="block h-auto w-full"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex flex-col gap-4">
                        <label className="flex cursor-pointer items-center gap-3">
                            <div className="relative flex h-5 items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-[var(--color-border-brand)] text-[var(--color-brand-deep)] focus:ring-0"
                                />
                            </div>
                            <span className="text-sm font-semibold text-[rgb(35_64_106)] select-none">
                                Do not show again for the next hour
                            </span>
                        </label>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-theme-cta-soft flex w-full items-center justify-center rounded-xl py-3.5 text-base font-bold shadow-md transition-all hover:brightness-105 active:scale-[0.98]"
                        >
                            CLOSE
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
