import fs from 'fs';

const css = fs.readFileSync('tmp-12win-css.css', 'utf8');
const terms = ['t3-provider', 'provider-item', 'game-lobby', 'lobby-banner', 'category-banner', 'provider-card', 'provider-name', 'provider-image'];
for (const term of terms) {
    let idx = 0;
    let count = 0;
    while (count < 3) {
        idx = css.indexOf(term, idx);
        if (idx < 0) break;
        console.log('\n---', term, idx);
        console.log(css.substring(idx, idx + 400));
        idx += term.length;
        count++;
    }
}
