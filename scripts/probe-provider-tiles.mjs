const providers = [
    'evolution',
    'evolutiongaming',
    'wmcasino',
    'wm_casino',
    'pragmatic',
    'pragmaticplay',
    'sagaming',
    'sa_gaming',
    'sexygaming',
    'sexybaccarat',
    'ct855',
    'playace',
    'playtech',
    'gameplay',
];
const prefixes = ['200x200px_provider_icon_', '300x300px_provider_icon_', 'provider_icon_'];
const suffixes = ['', '-202503190916141518', '-202408150923116133'];

const found = [];
for (const p of providers) {
    for (const pre of prefixes) {
        for (const suf of suffixes) {
            const url = `https://pksoftcdn.azureedge.net/media/${pre}${p}${suf}.png`;
            try {
                const res = await fetch(url, { method: 'HEAD' });
                if (res.ok) found.push(url);
            } catch {
                /* */
            }
        }
    }
}
console.log(found.join('\n'));
