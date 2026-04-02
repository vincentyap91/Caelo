import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildFavouriteGameId, normalizeFavouriteCategory } from '../utils/favouriteGames';

const STORAGE_KEY = 'riocity_favourite_games_v1';

function normalizeEntry(raw) {
    const category = normalizeFavouriteCategory(raw?.category, raw?.name);
    const name = raw?.name != null ? String(raw.name) : '';
    const provider = raw?.provider != null ? String(raw.provider) : '';

    return {
        id: buildFavouriteGameId(category, name, provider),
        category,
        name,
        provider,
        imgUrl: raw?.imgUrl != null ? String(raw.imgUrl) : '',
        navigatePage: raw?.navigatePage ?? null,
    };
}

function dedupeEntries(entries) {
    const seen = new Set();
    return entries.filter((entry) => {
        if (!entry.id || seen.has(entry.id)) return false;
        seen.add(entry.id);
        return true;
    });
}

function loadFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return dedupeEntries(parsed.map(normalizeEntry).filter((entry) => entry.category && entry.name));
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
        const entry = normalizeEntry(raw);
        if (!entry.id || !entry.category || !entry.name) return;
        setItems((prev) => {
            const exists = prev.some((x) => x.id === entry.id);
            if (exists) return prev.filter((x) => x.id !== entry.id);
            return dedupeEntries([...prev, entry]);
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
