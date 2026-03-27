/**
 * Demo payload for `GameDetailLayout` / `GameDetailPage` — replace with API data per game.
 */
export const gameDetailDemo = {
    categoryLabel: 'Live Casino',
    categoryPage: 'live-casino',
    gameTitle: 'Ezugi',
    providerName: 'Ezugi',
    iframeUrl: '',
    iframeTitle: 'Ezugi Live',
    showGameFallback: true,
    fallbackMessage: 'Registration Failed',
    rankingSectionTitle: 'Ranking',
    rankingColumns: [
        { key: 'rank', label: 'Rank', align: 'center' },
        { key: 'username', label: 'Username' },
        { key: 'date', label: 'Date' },
        { key: 'betAmount', label: 'Bet Amount', align: 'right', highlight: true },
        { key: 'payout', label: 'Payout', align: 'right', highlight: true },
        { key: 'winAmount', label: 'Win Amount', align: 'right', highlight: true },
    ],
    rankingRows: [
        {
            id: 'r1',
            rank: '1',
            username: 'player***01',
            date: '2025-03-20',
            betAmount: 'MYR 500',
            payout: 'MYR 480',
            winAmount: 'MYR 12,400',
        },
        {
            id: 'r2',
            rank: '2',
            username: 'player***88',
            date: '2025-03-20',
            betAmount: 'MYR 200',
            payout: 'MYR 190',
            winAmount: 'MYR 8,200',
        },
        {
            id: 'r3',
            rank: '3',
            username: 'player***42',
            date: '2025-03-19',
            betAmount: 'MYR 1,000',
            payout: 'MYR 950',
            winAmount: 'MYR 6,100',
        },
    ],
    latestBetsColumns: [
        { key: 'betId', label: 'Bet ID' },
        { key: 'username', label: 'Username' },
        { key: 'dateTime', label: 'Date / Time' },
        { key: 'betAmount', label: 'Bet Amount', align: 'right', highlight: true },
    ],
    latestBetsRows: [
        { id: 'b1', betId: '#892341', username: 'user***21', dateTime: '2025-03-20 14:32', betAmount: 'MYR 50' },
        { id: 'b2', betId: '#892340', username: 'user***07', dateTime: '2025-03-20 14:30', betAmount: 'MYR 120' },
        { id: 'b3', betId: '#892339', username: 'user***55', dateTime: '2025-03-20 14:28', betAmount: 'MYR 25' },
    ],
    recommendedGames: [
        {
            id: 'g1',
            name: 'Gates of Olympus',
            provider: 'Pragmatic Play',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/PragmaticPlayT/vs20olympgate.png',
        },
        {
            id: 'g2',
            name: 'Sweet Bonanza',
            provider: 'Pragmatic Play',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/PragmaticPlayT/vs20olympgate.png',
        },
        {
            id: 'g3',
            name: 'Pyramid King',
            provider: 'Pragmatic Play',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/PragmaticPlayT/vs20olympgate.png',
        },
        {
            id: 'g4',
            name: 'The Dog House',
            provider: 'Pragmatic Play',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/PragmaticPlayT/vs20olympgate.png',
        },
    ],
};
