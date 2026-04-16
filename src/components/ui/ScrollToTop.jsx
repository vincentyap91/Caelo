import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Floating "Back to Top" button for mobile/desktop.
 * Appears after scrolling down a bit.
 */
export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrolled > 400) {
                setVisible(true);
            } else if (scrolled <= 400) {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisible, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(180deg,var(--color-brand-primary)_0%,var(--color-brand-secondary)_100%)] text-white shadow-[0_8px_16px_rgba(0,114,188,0.24)] ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95 md:bottom-[11.5rem] md:right-6 md:z-[140] md:h-14 md:w-14 active:brightness-95"
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} strokeWidth={2.5} />
        </button>
    );
}
