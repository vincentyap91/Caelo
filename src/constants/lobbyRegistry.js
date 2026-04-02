/**
 * Provider / lobby rows for `/game/:slug` resolution (name + vertical disambiguates slug).
 * imgUrl: resolved URL strings from Vite asset imports or CDN.
 */
import tfGamingLogo from '../assets/tf-gaming.webp';
import { LIVE_CASINO_LOBBIES } from './liveCasinoProviders';
import evolutionPokerLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticPokerLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';
import playtechLogo from '../assets/playtech-202505140443475046-202506242335087315.svg';
import mtLogo from '../assets/download-202506250034489694.png';

const CDN = 'https://cdn.i8global.com/lb9/master';

/** @typedef {{ name: string, provider: string, imgUrl: string, categoryLabel: string, categoryPage: string, kind: 'lobby' }} LobbyGame */

/** @type {LobbyGame[]} */
export const E_SPORTS_LOBBIES = [
    { name: 'TF Gaming', provider: 'E-Sports', imgUrl: tfGamingLogo, categoryLabel: 'E-Sports', categoryPage: 'e-sports', kind: 'lobby' },
];

/** @type {LobbyGame[]} */
export const SPORTS_LOBBIES = [
    {
        name: 'SABA Sports',
        provider: 'Sportsbook',
        imgUrl: `${CDN}/sabasports/sabasports_wh-202507150659307576-202507172158490800.png`,
        categoryLabel: 'Sports',
        categoryPage: 'sports',
        kind: 'lobby',
    },
    {
        name: 'SBO Sports',
        provider: 'Sportsbook',
        imgUrl: `${CDN}/sbosports/sbobet-202505140446487117-202506242314511303.svg`,
        categoryLabel: 'Sports',
        categoryPage: 'sports',
        kind: 'lobby',
    },
    {
        name: 'Pragmatic Play Virtual Sports',
        provider: 'Sportsbook',
        imgUrl: `${CDN}/pragmaticplayvirtualsports/pragmaticvs_wh-202507101340022927-202507101413412524.png`,
        categoryLabel: 'Sports',
        categoryPage: 'sports',
        kind: 'lobby',
    },
    {
        name: 'SBO Virtual Sports',
        provider: 'Sportsbook',
        imgUrl: `${CDN}/sbovirtualsports/sbobet_vsport-202505140510055251-202506242315525359.svg`,
        categoryLabel: 'Sports',
        categoryPage: 'sports',
        kind: 'lobby',
    },
    {
        name: 'Lucky Sports',
        provider: 'Sportsbook',
        imgUrl: 'https://pksoftcdn.azureedge.net/media/200x200_providerbanner_luckysport-202407260917076261-202408060821509512-202410241125136236.png',
        categoryLabel: 'Sports',
        categoryPage: 'sports',
        kind: 'lobby',
    },
];

/** @type {LobbyGame[]} */
export const LOTTERY_LOBBIES = [
    {
        name: 'MEGATOTO',
        provider: 'Lottery',
        imgUrl: `${CDN}/megatoto/download-202510090223015529-202510262311216262.png`,
        categoryLabel: 'Lottery',
        categoryPage: 'lottery',
        kind: 'lobby',
    },
];

/** @type {LobbyGame[]} */
export const POKER_LOBBIES = [
    { name: 'Playtech Poker', provider: 'Poker', imgUrl: playtechLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby' },
    { name: 'Evolution Poker', provider: 'Poker', imgUrl: evolutionPokerLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby' },
    { name: 'Pragmatic Poker', provider: 'Poker', imgUrl: pragmaticPokerLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby' },
    { name: 'MT Poker', provider: 'Poker', imgUrl: mtLogo, categoryLabel: 'Poker', categoryPage: 'poker', kind: 'lobby' },
];

/** @type {LobbyGame[]} */
export const ALL_LOBBY_GAMES = [
    ...LIVE_CASINO_LOBBIES,
    ...E_SPORTS_LOBBIES,
    ...SPORTS_LOBBIES,
    ...LOTTERY_LOBBIES,
    ...POKER_LOBBIES,
];
