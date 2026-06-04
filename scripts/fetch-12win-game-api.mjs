const endpoints = [
    '/Game/RetrieveCategoryGroupedGame',
    '/Member/RetrieveMasterProductCategory',
    '/Member/RetrieveUserBanner',
    '/Game/GetHomepageProducts',
];

for (const path of endpoints) {
    for (const method of ['GET', 'POST']) {
        try {
            const res = await fetch(`https://12winkh.vip${path}`, {
                method,
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                body: method === 'POST' ? '{}' : undefined,
            });
            const text = await res.text();
            const snippet = text.slice(0, 500);
            console.log('\n', method, path, res.status, snippet.includes('casino') ? 'HAS casino' : '');
            if (/pksoftcdn|banner|live/i.test(text)) {
                const urls = text.match(/https?:\/\/[^"\\\s]+/g) ?? [];
                console.log(urls.filter((u) => /pksoft|banner|casino|live/i.test(u)).slice(0, 10));
            }
        } catch (e) {
            console.log(method, path, 'err', e.message);
        }
    }
}
