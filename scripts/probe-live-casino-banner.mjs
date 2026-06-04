import fs from 'fs';

const bases = [
    '1029x420_providerbanner_livecasino',
    '1029x420_providerbanner_live_casino',
    '1029x420_providerbanner_casino',
    '1029x420_providerbanner_gamecasino',
    '1029x420_providerbanner_cam88livecasino',
    '1029x420_12winkh_livecasino',
    '1029x420_12winkh_gamecasino',
    '1029x420_providerbanner_12winkh_livecasino',
    '1029x420_providerbanner_12winkh_casino',
    '1029x420_providerbanner_evolution',
    '1029x420_providerbanner_evolutiongaming',
    'cam88_livecasino_providerbanner_1029pxx420px',
    '12winkh_livecasino_providerbanner_1029pxx420px',
    '12winkh_casino_providerbanner_1029pxx420px',
];
const suffixes = [
    '',
    '-202408150923116133',
    '-202409021036566678',
    '-202601301129537731',
    '-202605140848333320',
];

const found = [];
for (const base of bases) {
    for (const suffix of suffixes) {
        const name = `${base}${suffix}.jpg`;
        const url = `https://pksoftcdn.azureedge.net/media/${name}`;
        try {
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) found.push(url);
        } catch {
            /* ignore */
        }
    }
}
console.log(found.join('\n') || 'none');
if (found[0]) {
    const res = await fetch(found[0]);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync('src/assets/live-casino', { recursive: true });
    fs.writeFileSync('src/assets/live-casino/12win-hero-banner.jpg', buf);
    console.log('saved', buf.length);
}
