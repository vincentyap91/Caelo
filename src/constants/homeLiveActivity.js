/** Mask display names for privacy (e.g. homepage activity feeds). */
export function maskUsername(displayName) {
    const trimmed = (displayName || '').trim();
    if (!trimmed) return '***';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
        const a = parts[0];
        const b = parts[1];
        const left = a.length <= 2 ? `${a.charAt(0)}*` : `${a.slice(0, 2)}***`;
        const right = b.length <= 1 ? '*' : `${b.charAt(0)}***`;
        return `${left} ${right}`;
    }
    const p = parts[0];
    if (p.length <= 2) return `${p.charAt(0)}***`;
    return `${p.slice(0, 2)}***`;
}

/** Live Transactions list viewport. */
export const HOME_LIVE_FEED_HEIGHT_CLASS = 'h-[min(28rem,34vh)]';

/** Recent Big Wins: taller clip so 4+ full rows fit (rows are much taller than tx lines). */
export const HOME_LIVE_BIG_WINS_FEED_HEIGHT_CLASS = 'h-[min(36rem,40vh)]';

export const MOCK_LIVE_DEPOSITS = [
    { id: 'd1', user: 'Daniel N.', amount: 'MYR 2,450', timeAgo: '12 secs ago' },
    { id: 'd2', user: 'Michelle T.', amount: 'MYR 500', timeAgo: '28 secs ago' },
    { id: 'd3', user: 'Wei K.', amount: 'MYR 8,200', timeAgo: '45 secs ago' },
    { id: 'd4', user: 'Priya S.', amount: 'MYR 1,200', timeAgo: '1 min ago' },
    { id: 'd5', user: 'James L.', amount: 'MYR 15,000', timeAgo: '2 mins ago' },
    { id: 'd6', user: 'Hannah R.', amount: 'MYR 640', timeAgo: '3 mins ago' },
];

export const MOCK_LIVE_WITHDRAWALS = [
    { id: 'w1', user: 'Omar F.', amount: 'MYR 3,100', timeAgo: '18 secs ago' },
    { id: 'w2', user: 'Lisa C.', amount: 'MYR 920', timeAgo: '33 secs ago' },
    { id: 'w3', user: 'Kevin B.', amount: 'MYR 22,500', timeAgo: '52 secs ago' },
    { id: 'w4', user: 'Nur A.', amount: 'MYR 4,800', timeAgo: '1 min ago' },
    { id: 'w5', user: 'Tom W.', amount: 'MYR 1,350', timeAgo: '2 mins ago' },
    { id: 'w6', user: 'Yuki M.', amount: 'MYR 7,200', timeAgo: '4 mins ago' },
];

/** Alternating deposit/withdrawal rows for “All” feed (newest feel). */
export function getUnifiedLiveTransactions() {
    const d = MOCK_LIVE_DEPOSITS.map((r) => ({ ...r, kind: 'deposit' }));
    const w = MOCK_LIVE_WITHDRAWALS.map((r) => ({ ...r, kind: 'withdrawal' }));
    const out = [];
    const n = Math.max(d.length, w.length);
    for (let i = 0; i < n; i++) {
        if (d[i]) out.push(d[i]);
        if (w[i]) out.push(w[i]);
    }
    return out;
}

/** Matches slots imagery used elsewhere on the site */
export const MOCK_RECENT_BIG_WINS = [
    {
        id: 'bw6',
        user: 'Chloe W.',
        game: 'Sugar Rush',
        provider: 'Pragmatic Play',
        badge: 'PRAGMATIC PLAY',
        imgUrl: 'https://zd3rmimelg.iwzphbojix.net/game_pic/square/200/vs20olympx.png',
        amount: 'MYR 19,400',
        timeAgo: '31 mins ago',
    },
    {
        id: 'bw1',
        user: 'Alex M.',
        game: 'Great Blue Jackpot',
        provider: 'PlayTech Slots',
        badge: 'PLAYTECH SLOTS',
        imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/grbjp.png',
        amount: 'MYR 67,450',
        timeAgo: '2 mins ago',
    },
    {
        id: 'bw2',
        user: 'Sarah K.',
        game: 'Fire Blaze: Blue Wizard',
        provider: 'PlayTech Slots',
        badge: 'FIRE BLAZE',
        imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_bwizard_pop.png',
        amount: 'MYR 52,300',
        timeAgo: '5 mins ago',
    },
    {
        id: 'bw3',
        user: 'John D.',
        game: 'Archer',
        provider: 'PlayTech Slots',
        badge: 'PLAYTECH SLOTS',
        imgUrl: 'https://lb9.azureedge.net/media/playtech/slots/en/gpas_archer_pop.png',
        amount: 'MYR 120,500',
        timeAgo: '9 mins ago',
    },
    {
        id: 'bw4',
        user: 'Elena V.',
        game: 'Gates of Olympus 1000',
        provider: 'Pragmatic Play',
        badge: 'PRAGMATIC PLAY',
        imgUrl: 'https://zd3rmimelg.iwzphbojix.net/game_pic/square/200/vs20olympx.png',
        amount: 'MYR 41,880',
        timeAgo: '14 mins ago',
    },
    {
        id: 'bw5',
        user: 'Marcus P.',
        game: 'Zeus vs Hades — Gods of War',
        provider: 'Pragmatic Play',
        badge: 'PRAGMATIC PLAY',
        imgUrl: 'https://zd3rmimelg.iwzphbojix.net/game_pic/square/200/vs15godsofwar.png',
        amount: 'MYR 88,200',
        timeAgo: '22 mins ago',
    },
];
