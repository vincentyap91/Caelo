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
import gameplayLightmodeLogo from '../assets/gameplay-lightmode.png';
import veryGoodBetLogo from '../assets/very-good-bet.png';
import ezugiLogo from '../assets/live-casino/ezugi.webp';
import afbGamingLogo from '../assets/live-casino/afb-logo.png';
import ct855Logo from '../assets/live-casino/ct855.png';
import {
    sexyBaccaratImage,
    yeebetLiveImage,
    gameplayInteractiveImage,
    wCasinoImage,
    bigGamingImage,
    dreamGamingImage,
    allbetImage,
    saGamingImage,
    ct855Image,
    pragmaticPlayImage,
    veryGoodImage,
    ezugiMenuTile,
    playtechCasinoTile,
    afbGamingMenuTile,
} from './liveCasinoMenuTileAssets';

export const EZUGI_PROVIDER_ID = 'ezugi';
export const AFB_PROVIDER_ID = 'afb-gaming';
export const CT855_PROVIDER_ID = 'ct855';
export const GAMEPLAY_PROVIDER_ID = 'gameplay-lottery';
export const VERY_GOOD_BET_PROVIDER_ID = 'mt-live';
const WM_CASINO_MENU_IMAGE = 'https://pksoftcdn.azureedge.net/media/200x200px_provider_icon_wmcasino-202503190916141518.png';

const LIVE_CASINO_PROVIDER_SOURCE = [
    {
        id: CT855_PROVIDER_ID,
        name: 'CT855',
        navLabel: 'CT855',
        menuImage: ct855Image,
        pageImage: ct855Logo,
        categories: ['Baccarat', 'Roulette', 'Dragon Tiger'],
        featured: true,
        navHot: false,
        navOrder: 1,
        pageOrder: 10,
        launchConfig: {
            title: 'CT855',
            bannerImage: 'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_ct855-202409021036566678.jpg',
            wallet: '201.00',
            membershipRebate: '0.00%',
        },
    },
    {
        id: 'casino',
        name: 'W Casino',
        navLabel: 'W Casino',
        menuImage: wCasinoImage,
        pageImage: wcasinoLogo,
        categories: ['Baccarat', 'Game Shows'],
        featured: true,
        navHot: false,
        navOrder: 13,
        pageOrder: 1,
        launchConfig: {
            title: 'W Casino',
            bannerImage: 'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_wcasino-202408150923116133.jpg',
            wallet: '201.00',
            membershipRebate: '0.00%',
        },
    },
    {
        id: 'sagaming',
        name: 'SA Gaming',
        navLabel: 'SA Gaming',
        menuImage: saGamingImage,
        pageImage: sagamingLogo,
        categories: ['Baccarat', 'Dragon Tiger'],
        featured: true,
        navHot: true,
        navOrder: 9,
        pageOrder: 2,
    },
    {
        id: 'playtech',
        name: 'Playtech LiveCasino',
        navLabel: 'Playtech',
        menuImage: playtechCasinoTile,
        pageImage: playtechLogo,
        categories: ['Roulette', 'Blackjack'],
        featured: true,
        navHot: true,
        navOrder: 4,
        pageOrder: 3,
    },
    {
        id: 'sexy-gaming',
        name: 'Sexy Gaming',
        navLabel: 'Sexy Baccarat',
        menuImage: sexyBaccaratImage,
        pageImage: sexygamingLogo,
        categories: ['Baccarat', 'Blackjack'],
        featured: true,
        navHot: true,
        navOrder: 2,
        pageOrder: 4,
    },
    {
        id: 'dream-gaming',
        name: 'DreamGaming',
        navLabel: 'DreamGaming',
        menuImage: dreamGamingImage,
        pageImage: dreamgamingLogo,
        categories: ['Baccarat', 'Roulette'],
        featured: true,
        navHot: true,
        navOrder: 5,
        pageOrder: 5,
    },
    {
        id: 'evolution',
        name: 'Evolution Gaming',
        navLabel: 'Evolution Gaming',
        menuImage: ct855Image,
        pageImage: evolutionLogo,
        categories: ['Roulette', 'Game Shows'],
        featured: true,
        navHot: false,
        navOrder: 10,
        pageOrder: 6,
    },
    {
        id: 'pragmatic-play',
        name: 'Pragmatic Play Live Casino',
        navLabel: 'Pragmatic Play',
        menuImage: pragmaticPlayImage,
        pageImage: pragmaticLiveLogo,
        categories: ['Game Shows', 'Roulette'],
        featured: true,
        navHot: true,
        navOrder: 6,
        pageOrder: 7,
    },
    {
        id: EZUGI_PROVIDER_ID,
        name: 'Ezugi',
        navLabel: 'Ezugi',
        menuImage: ezugiMenuTile,
        pageImage: ezugiLogo,
        categories: ['Baccarat', 'Roulette', 'Game Shows'],
        featured: true,
        navHot: true,
        navOrder: 7,
        pageOrder: 8,
        launchConfig: {
            title: 'Ezugi',
            bannerImage: 'https://pksoftcdn.azureedge.net/media/ezugi_cam88_providerbanner_1029pxx420px-202601301129537731.jpg',
            wallet: '201.00',
            membershipRebate: '0.00%',
        },
    },
    {
        id: AFB_PROVIDER_ID,
        name: 'AFB Gaming',
        navLabel: 'AFB Gaming',
        menuImage: afbGamingMenuTile,
        pageImage: afbGamingLogo,
        categories: ['Baccarat', 'Roulette', 'Blackjack'],
        featured: true,
        navHot: true,
        navOrder: 8,
        pageOrder: 9,
        launchConfig: {
            title: 'AFB Gaming',
            bannerImage: 'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_afbcasino-202408151024208680-202408151200309656.jpg',
            wallet: '201.00',
            membershipRebate: '0.00%',
        },
    },
    {
        id: 'wm-casino',
        name: 'WM Casino',
        navLabel: 'WM Casino',
        menuImage: WM_CASINO_MENU_IMAGE,
        pageImage: wmcasinoLogo,
        categories: ['Baccarat'],
        featured: false,
        navHot: false,
        navOrder: 15,
        pageOrder: 11,
    },
    {
        id: 'big-gaming',
        name: 'Big Gaming',
        navLabel: 'Big Gaming',
        menuImage: bigGamingImage,
        pageImage: biggamingLogo,
        categories: ['Game Shows'],
        featured: false,
        navHot: true,
        navOrder: 3,
        pageOrder: 12,
    },
    {
        id: 'allbet',
        name: 'AllBet',
        navLabel: 'AllBet',
        menuImage: allbetImage,
        pageImage: allbetLogo,
        categories: ['Blackjack', 'Baccarat'],
        featured: false,
        navHot: false,
        navOrder: 11,
        pageOrder: 13,
    },
    {
        id: 'yeebet-live',
        name: 'YeeBet',
        navLabel: 'YB Live',
        menuImage: yeebetLiveImage,
        pageImage: yeebetLogo,
        categories: ['Baccarat'],
        featured: false,
        navHot: true,
        navOrder: 12,
        pageOrder: 14,
    },
    {
        id: GAMEPLAY_PROVIDER_ID,
        name: 'Lottery GamePlay',
        navLabel: 'Gameplay Interactive',
        menuImage: gameplayInteractiveImage,
        pageImage: gameplayLightmodeLogo,
        categories: ['Game Shows'],
        featured: false,
        navHot: false,
        navOrder: 14,
        pageOrder: 15,
    },
    {
        id: VERY_GOOD_BET_PROVIDER_ID,
        name: 'MT',
        navLabel: 'Very Good',
        menuImage: veryGoodImage,
        pageImage: veryGoodBetLogo,
        categories: ['Dragon Tiger'],
        featured: false,
        navHot: false,
        navOrder: 17,
        pageOrder: 16,
    },
];

function sortByOrder(entries, key) {
    return [...entries].sort((a, b) => (a[key] ?? Number.MAX_SAFE_INTEGER) - (b[key] ?? Number.MAX_SAFE_INTEGER));
}

export const LIVE_CASINO_PAGE_PROVIDERS = sortByOrder(LIVE_CASINO_PROVIDER_SOURCE, 'pageOrder').map(
    ({ id, name, pageImage, categories, featured }) => ({
        id,
        name,
        src: pageImage,
        categories,
        featured,
    }),
);

export const defaultLiveCasinoNavProviders = sortByOrder(LIVE_CASINO_PROVIDER_SOURCE, 'navOrder')
    .filter((provider) => provider.menuImage)
    .map(({ id, name, navLabel, menuImage, navHot }) => ({
        id,
        name: navLabel ?? name,
        image: menuImage,
        hot: navHot ?? false,
    }));

export const LIVE_CASINO_LOBBIES = LIVE_CASINO_PAGE_PROVIDERS.map(({ name, src }) => ({
    name,
    provider: 'Live Casino',
    imgUrl: src,
    categoryLabel: 'Live Casino',
    categoryPage: 'live-casino',
    kind: 'lobby',
}));

export const LIVE_CASINO_LAUNCH_MODAL_BY_PROVIDER_ID = Object.fromEntries(
    LIVE_CASINO_PROVIDER_SOURCE.filter((provider) => provider.launchConfig).map((provider) => [
        provider.id,
        provider.launchConfig,
    ]),
);

export const menuToPageProviderName = Object.fromEntries(
    LIVE_CASINO_PROVIDER_SOURCE.map((provider) => [provider.navLabel ?? provider.name, provider.name]),
);
