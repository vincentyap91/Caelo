/** E-Sports lobby providers — cdn.ike4.com card artwork (12WIN e-sports page). */
const IKE4 = 'https://cdn.ike4.com/media';

/** @typedef {{ id: string, name: string, cardLabel?: string, src: string }} EsportsProvider */

/** @type {EsportsProvider[]} */
export const ESPORTS_PROVIDERS = [
    {
        id: 'tf-gaming',
        name: 'TF Gaming',
        cardLabel: 'TF Gaming',
        src: `${IKE4}/tfgaming_esports-202605141743405544.webp`,
    },
];
