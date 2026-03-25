/**
 * Matched slot providers (source: matched_slot_providers.txt).
 * `label` is the display/marketing name; `gameProvider` must match `slotGames[].provider` in SlotsPage.
 */
export const MATCHED_SLOT_PROVIDERS = [
    {
        id: 'pragmatic-play-slot',
        label: 'Pragmatic Play Slot',
        gameProvider: 'Pragmatic Play',
        image: 'https://riocity-cdn.azureedge.net/riocity/1-202312201452295687 (1)-202404091259347153.png',
        hot: true,
    },
    {
        id: 'playtech-slots',
        label: 'PlayTech Slots',
        gameProvider: 'PlayTech Slots',
        image: 'https://pksoftcdn.azureedge.net/media/kh168_playtech_providericon_200x200px-202510131026033251.png',
        hot: true,
    },
    {
        id: 'advantplay',
        label: 'AdvantPlay',
        gameProvider: 'AdvantPlay',
        /* Navbar Slots dropdown only — SlotsPage horizontal strip uses CDN in `slotProviders`, not this URL. */
        image: 'https://pksoftcdn.azureedge.net/media/200x200_providerbanner_advantplay-202408221112018566.png',
        hot: true,
    },
    {
        id: 'jili-slot',
        label: 'JILI Slot',
        gameProvider: 'JiLi',
        image: 'https://pksoftcdn.azureedge.net/media/200x200_providerbanner_jili-202411051000500092.png',
        hot: true,
    },
    {
        id: 'mega888-h5',
        label: 'Mega888 H5',
        gameProvider: 'Mega888 H5',
        image: 'https://pksoftcdn.azureedge.net/media/200x200px_provider_icon_mega888 (1)-202504251125148653.png',
        hot: false,
    },
    {
        id: 'joker-slot',
        label: 'Joker Slot',
        gameProvider: 'Joker',
        image: 'https://pksoftcdn.azureedge.net/media/200x200_providerbanner_joker-202410170917012571.png',
        hot: false,
    },
    {
        id: 'habanero-slots',
        label: 'Habanero Slots',
        gameProvider: 'Habanero',
        image: 'https://pksoftcdn.azureedge.net/media/habanero-202509081531116458-202510091550114534.png',
        hot: false,
    },
];

/** `{ id, name, image, hot }` for `NavProviderDropdownPanel` — `gameProvider` kept for navigation callbacks. */
export function slotProvidersForNavDropdown() {
    return MATCHED_SLOT_PROVIDERS.map((p) => ({
        id: p.id,
        name: p.label,
        image: p.image,
        hot: p.hot,
        gameProvider: p.gameProvider,
    }));
}
