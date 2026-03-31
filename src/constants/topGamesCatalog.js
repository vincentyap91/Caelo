import { SLOT_GAMES, FISHING_GAMES, EXTRA_GAME_DETAIL_ENTRIES } from './gameCatalogs';
import { ALL_LOBBY_GAMES } from './lobbyRegistry';
import { wCasinoImage, dreamGamingImage, ezugiMenuTile } from './liveCasinoMenuTileAssets';
import gameplayLightmodeLogo from '../assets/gameplay-lightmode.png';

function findEntry(entries, name, provider) {
    return entries.find((entry) => entry.name === name && entry.provider === provider) ?? null;
}

function withPage(entry, page, overrides = {}) {
    return {
        ...(entry ?? {}),
        ...overrides,
        page,
    };
}

export const TOP_GAMES = [
    withPage(findEntry(SLOT_GAMES, 'Gates of Olympus Super Scatter', 'Pragmatic Play'), 'slots'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'W Casino', 'Live Casino'), 'live-casino', { imgUrl: wCasinoImage }),
    withPage(findEntry(ALL_LOBBY_GAMES, 'DreamGaming', 'Live Casino'), 'live-casino', { imgUrl: dreamGamingImage }),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Ezugi', 'Live Casino'), 'live-casino', { imgUrl: ezugiMenuTile }),
    withPage(findEntry(EXTRA_GAME_DETAIL_ENTRIES, "Dragon's Luck", 'Pragmatic Play'), 'slots'),
    withPage(findEntry(EXTRA_GAME_DETAIL_ENTRIES, 'Nomikai Fever', 'Pragmatic Play'), 'slots'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Lucky Sports', 'Sportsbook'), 'sports'),
    withPage(findEntry(FISHING_GAMES, 'Ocean King', 'JiLi Fishing'), 'fishing'),
    withPage(findEntry(FISHING_GAMES, 'Mermaid Treasure', 'Funky Games Fishing'), 'fishing'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'TF Gaming', 'E-Sports'), 'e-sports'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Playtech Poker', 'Poker'), 'poker'),
    withPage(
        {
            name: 'GamePlay Lottery',
            provider: 'Lottery',
            imgUrl: gameplayLightmodeLogo,
        },
        'lottery',
    ),
    withPage(
        {
            name: '93Connect',
            provider: 'Lottery',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/93Connect/LOBBY.png',
            /** Wide lobby art — same as LotteryPage; overrides All Games `contain` for lottery tiles. */
            imageFit: 'cover',
        },
        'lottery',
    ),
].filter((entry) => entry?.name && entry?.provider && entry?.imgUrl);

export const TOP_GAMES_DEFAULT_VISIBLE = 6;

export const TOP_GAME_PAGE_LABELS = {
    slots: 'Slots',
    fishing: 'Fishing',
    'live-casino': 'Live Casino',
    poker: 'Poker',
    sports: 'Sports',
    'e-sports': 'E-Sports',
    lottery: 'Lottery',
};

export function getTopGameFavouriteCategory(page) {
    return TOP_GAME_PAGE_LABELS[page] ? page : 'home-top';
}
