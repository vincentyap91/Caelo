import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'riocity_favourite_games_v1';

function loadFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const FavouritesContext = createContext(null);

/**
 * @typedef {{ id: string, category: string, name: string, provider: string, imgUrl: string, navigatePage: string|null }} FavouriteGame
 */

export function FavouritesProvider({ children }) {
    const [items, setItems] = useState(loadFromStorage);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // private mode / quota
        }
    }, [items]);

    const toggle = useCallback((raw) => {
        const entry = {
            id: raw.id,
            category: raw.category,
            name: raw.name,
            provider: raw.provider ?? '',
            imgUrl: raw.imgUrl != null ? String(raw.imgUrl) : '',
            navigatePage: raw.navigatePage ?? null,
        };
        if (!entry.id || !entry.category || !entry.name) return;
        setItems((prev) => {
            const exists = prev.some((x) => x.id === entry.id);
            if (exists) return prev.filter((x) => x.id !== entry.id);
            return [...prev, entry];
        });
    }, []);

    const isFavourite = useCallback((id) => items.some((x) => x.id === id), [items]);

    const remove = useCallback((id) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const value = useMemo(
        () => ({
            items,
            toggle,
            isFavourite,
            remove,
        }),
        [items, toggle, isFavourite, remove]
    );

    return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites() {
    const ctx = useContext(FavouritesContext);
    if (!ctx) {
        throw new Error('useFavourites must be used within FavouritesProvider');
    }
    return ctx;
}
