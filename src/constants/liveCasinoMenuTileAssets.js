/**
 * Live Casino “menu / hero” tiles — navbar dropdown, home Top Games, game-detail lobby rows, etc.
 *
 * Rule: any provider image used *outside* the Live Casino grid page must come from
 * `src/assets/live-casino/` (add new files there, then import below). The Live Casino page
 * grid keeps its own flat logo marks via `LiveCasinoPage.jsx` imports.
 *
 * Naming: prefer stable imports (`ezugi-hero.png`, `sexy-gaming.png`, …). Hash-named files
 * remain where no cleaned duplicate exists yet.
 */
import sexyBaccaratImage from '../assets/live-casino/0c18a14e6167ec42bcf217a4281816aa37029ff4-hn68wwhU.png';
import yeebetLiveImage from '../assets/live-casino/11b3a08ee3b214daab6882a4382a2db797b54ae5-CmmdDJHQ.png';
import gameplayInteractiveImage from '../assets/live-casino/1b526547f23589a0effd96c6158392e2d6fb3935-CJWQcfSu.png';
import afb777Image from '../assets/live-casino/8b952f4f8efc7ab9452d911891a11049cf045587-B7NtWx9i.png';
import wCasinoImage from '../assets/live-casino/809fa51dd86ce47eaf28b331fe1d6bbd63e199cd-qJzlSpbk.png';
import afbSexyCasinoImage from '../assets/live-casino/afb_casino-202603031128335784.png';
import bigGamingImage from '../assets/live-casino/cb906b3bf03cc6acfcb7ea2ab7374623421bb8cc-CBcBnR99.png';
import dreamGamingImage from '../assets/live-casino/dream gaming_casino-202603051120541084.png';
import allbetImage from '../assets/live-casino/e7bffee978d2e07b7503abbca2bba3aa68d0f266-CyMbS0oy.png';
import veryGoodImage from '../assets/live-casino/e4f88b3752ff1601da28db10545c860015afa477-DKaq8d8M.png';
import saGamingImage from '../assets/live-casino/f63292375b3d6510a02ecd0751e8fefb6c545a34-ClN-a0_K.png';
import ct855Image from '../assets/live-casino/f63800b44ca9b6f3d38f0aac7dfd1f2ec040af43-CtCycX3u.png';
import pragmaticPlayImage from '../assets/live-casino/d962173d340d1f347cd214f08272d88852cf6e32-D12hrNcd.png';
import ezugiMenuTile from '../assets/live-casino/ezugi-hero.png';
import playtechCasinoTile from '../assets/live-casino/playtech-casino.png';
import afbGamingMenuTile from '../assets/live-casino/afb-gaming.png';

export {
    sexyBaccaratImage,
    yeebetLiveImage,
    gameplayInteractiveImage,
    afb777Image,
    wCasinoImage,
    afbSexyCasinoImage,
    bigGamingImage,
    dreamGamingImage,
    allbetImage,
    veryGoodImage,
    saGamingImage,
    ct855Image,
    pragmaticPlayImage,
    ezugiMenuTile,
    playtechCasinoTile,
    afbGamingMenuTile,
};

/** Lookup for optional programmatic use (e.g. future nav entries). */
export const LIVE_CASINO_MENU_TILE_BY_ID = {
    'sexy-gaming': sexyBaccaratImage,
    'yeebet-live': yeebetLiveImage,
    'big-gaming': bigGamingImage,
    playtech: playtechCasinoTile,
    'dream-gaming': dreamGamingImage,
    'pragmatic-play': pragmaticPlayImage,
    ezugi: ezugiMenuTile,
    'afb-gaming': afbGamingMenuTile,
    sagaming: saGamingImage,
    ct855: ct855Image,
    allbet: allbetImage,
    'wm-casino': afbSexyCasinoImage,
    'world-entertainment': gameplayInteractiveImage,
    'gameplay-lottery': gameplayInteractiveImage,
    casino: wCasinoImage,
    'mt-live': veryGoodImage,
};
