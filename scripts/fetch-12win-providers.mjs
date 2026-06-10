const endpoints = [
    ['/Game/GetHotProviders', {}],
    ['/Game/RetrieveMasterProductGroupedGame', { categoryId: 2 }],
    ['/Game/RetrieveMasterProductGroupedGame', { productCategory: 'Live Casino' }],
    ['/Game/RetrieveMasterProductGroupedGame', {}],
    ['/Member/RetrieveMasterProductCategory', {}],
    ['/Game/GetDashboardCacheProductList', {}],
];

for (const [path, body] of endpoints) {
    try {
        const res = await fetch(`https://12winkh.vip${path}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(body),
        });
        const text = await res.text();
        if (text.startsWith('{') || text.startsWith('[')) {
            const urls = text.match(/https:\/\/pksoftcdn[^"\\]+/g) ?? [];
            const live = urls.filter((u) => /casino|live|evolution|wm|pragmatic|sagam|sexy|ct855|play/i.test(u));
            if (live.length) {
                console.log('\n', path, JSON.stringify(body));
                console.log(live.slice(0, 30).join('\n'));
            }
        }
    } catch (e) {
        console.log(path, e.message);
    }
}
