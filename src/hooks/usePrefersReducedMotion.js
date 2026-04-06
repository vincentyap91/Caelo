import { useEffect, useState } from 'react';

function readPrefersReducedMotion() {
    if (typeof window === 'undefined') return false;
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
}

/** Tracks prefers-reduced-motion; initial state matches the OS on first client paint (no one-frame marquee flash). */
export function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(readPrefersReducedMotion);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    return reduced;
}
