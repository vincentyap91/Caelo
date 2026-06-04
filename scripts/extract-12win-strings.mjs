import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
for (const term of ['GameLobby', 'gameLobby', 'game-lobby', 'liveCasino', 'live_casino', 'providerBanner', 'categoryBanner', 'getGameProviders']) {
    const i = c.indexOf(term);
    if (i >= 0) console.log(term, 'at', i, c.substring(i, i + 200));
}
