/**
 * Provider / lobby rows for `/game/:slug` resolution (name + vertical disambiguates slug).
 * imgUrl: resolved URL strings from Vite asset imports or CDN.
 */
import wcasinoLogo from '../assets/wcasino-2x-min-202505280008599013-202506250016539240.png';
import sagamingLogo from '../assets/sagaming2025_wh-202510270604321830.png';
import playtechLogo from '../assets/playtech-202505140443475046-202506242335087315.svg';
import sexygamingLogo from '../assets/sexygaming-202505140447445395-202506240659312869.svg';
import dreamgamingLogo from '../assets/dreamgaming-min-202506201545375005-202506250034043371.png';
import evolutionLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticLiveLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';
import wmcasinoLogo from '../assets/wmcasino-202505140442522647-202506242346230340.svg';
import biggamingLogo from '../assets/biggaming-min-202506201446479379-202506250032270399.png';
import allbetLogo from '../assets/allbet-1-202505132310053829-202506250015492361.svg';
import yeebetLogo from '../assets/yeebet-min-202506201536311077-202506250033163315.png';
import wecasinoLogo from '../assets/worldent-min-202507141449569526-202507170806057662.png';
import mtLogo from '../assets/download-202506250034489694.png';
import tfGamingLogo from '../assets/tf-gaming.webp';
import { ezugiMenuTile } from './liveCasinoMenuTileAssets';
import evolutionPokerLogo from '../assets/evolution-202505140444284259-202506242322200281.svg';
import pragmaticPokerLogo from '../assets/pp-live-casino-202505140447187176-202506240700358930.svg';

const CDN = 'https://cdn.i8global.com/lb9/master';

/** @typedef {{ name: string, provider: string, imgUrl: string, categoryLabel: string, categoryPage: string, kind: 'lobby' }} LobbyGame */

/** @type {LobbyGame[]} */
export const LIVE_CASINO_LOBBIES = [
    { name: 'W Casino', provider: 'Live Casino', imgUrl: wcasinoLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'SA Gaming', provider: 'Live Casino', imgUrl: sagamingLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Playtech LiveCasino', provider: 'Live Casino', imgUrl: playtechLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Sexy Gaming', provider: 'Live Casino', imgUrl: sexygamingLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'DreamGaming', provider: 'Live Casino', imgUrl: dreamgamingLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Evolution Gaming', provider: 'Live Casino', imgUrl: evolutionLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Pragmatic Play Live Casino', provider: 'Live Casino', imgUrl: pragmaticLiveLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'WM Casino', provider: 'Live Casino', imgUrl: wmcasinoLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Big Gaming', provider: 'Live Casino', imgUrl: biggamingLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'AllBet', provider: 'Live Casino', imgUrl: allbetLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'YeeBet', provider: 'Live Casino', imgUrl: yeebetLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'WECasino', provider: 'Live Casino', imgUrl: wecasinoLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'MT', provider: 'Live Casino', imgUrl: mtLogo, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
    { name: 'Ezugi', provider: 'Live Casino', imgUrl: ezugiMenuTile, categoryLabel: 'Live Casino', categoryPage: 'live-casino', kind: 'lobby' },
];

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
