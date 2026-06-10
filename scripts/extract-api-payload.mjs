import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
const term = 'RetrieveCategoryGroupedGame';
let idx = 0;
let n = 0;
while (n < 8) {
    idx = c.indexOf(term, idx);
    if (idx < 0) break;
    console.log('\n---', n);
    console.log(c.substring(idx - 120, idx + 280).replace(/\s+/g, ' '));
    idx += term.length;
    n++;
}
