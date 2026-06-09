/** Sports lobby providers — cdn.ike4.com card artwork (12WIN sports page). */
const IKE4 = 'https://cdn.ike4.com/media';

/** @typedef {{ id: string, name: string, cardLabel?: string, src: string }} SportsProvider */

/** @type {SportsProvider[]} */
export const SPORTS_PROVIDERS = [
    {
        id: 'fb-sports',
        name: 'FB Sports',
        cardLabel: 'FB Sports',
        src: `${IKE4}/fb_sports-202605141510128424.webp`,
    },
    {
        id: 'sbo-sports',
        name: 'SBO Sports',
        cardLabel: 'SBO Sports',
        src: `${IKE4}/sbobet_sports-202605201053296017.webp`,
    },
    {
        id: 'cmd-sports',
        name: 'CMD Sports',
        cardLabel: 'CMD Sport',
        src: `${IKE4}/cmd_sports-202605141128235876.webp`,
    },
    {
        id: 'm8bet',
        name: 'M8Bet',
        cardLabel: 'M8Bet',
        src: `${IKE4}/m8bet_sports-202605200724495652.webp`,
    },
    {
        id: 'saba-sports',
        name: 'SABA Sports',
        cardLabel: 'SABA Sport',
        src: `${IKE4}/sabasports_sports-202605200638252720.webp`,
    },
    {
        id: 'ug-sports',
        name: 'UG Sports',
        cardLabel: 'UG Sport',
        src: `${IKE4}/unitedgaming_sports-202605200702006931.webp`,
    },
];
