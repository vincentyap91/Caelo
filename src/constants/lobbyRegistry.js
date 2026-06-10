/**
 * Provider / lobby rows for `/game/:slug` resolution (name + vertical disambiguates slug).
 * imgUrl: resolved URL strings from Vite asset imports or CDN.
 */
import { ESPORTS_PROVIDERS } from './esportsProviders';
import { LIVE_CASINO_LOBBIES } from './liveCasinoProviders';
import evolutionPokerLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticPokerLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';
import playtechLogo from '../assets/playtech-202505140443475046-202506242335087315.svg';
import mtLogo from '../assets/download-202506250034489694.png';

import { SPORTS_PROVIDERS } from './sportsProviders';

const CDN = 'https://cdn.i8global.com/lb9/master';

/** @typedef {{ name: string, provider: string, imgUrl: string, categoryLabel: string, categoryPage: string, kind: 'lobby' }} LobbyGame */

/** @type {LobbyGame[]} */
export const E_SPORTS_LOBBIES = ESPORTS_PROVIDERS.map((provider) => ({
    name: provider.name,
    provider: 'E-Sports',
    imgUrl: provider.src,
    categoryLabel: 'E-Sports',
    categoryPage: 'e-sports',
    kind: 'lobby',
    imageFit: 'cover',
}));

/** @type {LobbyGame[]} */
export const SPORTS_LOBBIES = SPORTS_PROVIDERS.map((provider) => ({
    name: provider.name,
    provider: 'Sportsbook',
    imgUrl: provider.src,
    categoryLabel: 'Sports',
    categoryPage: 'sports',
    kind: 'lobby',
    imageFit: 'cover',
}));

/** @type {LobbyGame[]} */
export const LOTTERY_LOBBIES = [
    {
        name: 'MEGATOTO',
        provider: 'Lottery',
        imgUrl: `${CDN}/megatoto/download-202510090223015529-202510262311216262.png`,
        categoryLabel: 'Lottery',
        categoryPage: 'lottery',
        kind: 'lobby',
        imageFit: 'contain',
    },
];

/** @type {LobbyGame[]} */
export const POKER_LOBBIES = [
    { name: 'Playtech Poker', provider: 'Poker', imgUrl: playtechLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby', imageFit: 'contain' },
    { name: 'Evolution Poker', provider: 'Poker', imgUrl: evolutionPokerLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby', imageFit: 'contain' },
    { name: 'Pragmatic Poker', provider: 'Poker', imgUrl: pragmaticPokerLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby', imageFit: 'contain' },
    { name: 'MT Poker', provider: 'Poker', imgUrl: mtLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby', imageFit: 'contain' },
];

/** @type {LobbyGame[]} */
export const ALL_LOBBY_GAMES = [
    ...LIVE_CASINO_LOBBIES,
    ...E_SPORTS_LOBBIES,
    ...SPORTS_LOBBIES,
    ...LOTTERY_LOBBIES,
    ...POKER_LOBBIES,
];
