const candidates = [
    'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_livecasino-202408150923116133.jpg',
    'https://pksoftcdn.azureedge.net/media/1029x420_livecasino-202408150923116133.jpg',
    'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_live-casino.jpg',
    'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_casino-202408150923116133.jpg',
    'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_game-lobby.jpg',
    'https://pksoftcdn.azureedge.net/media/1029x420_providerbanner_livecasino.jpg',
    'https://cdn.i8global.com/lb9/master/livecasino/live-casino-banner.jpg',
];

for (const url of candidates) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log(res.status, url);
    } catch (e) {
        console.log('err', url, e.message);
    }
}
