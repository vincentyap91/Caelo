import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
for (const term of ['API_URL', 'apiUrl', 'baseURL', 'BASE_URL', 'holiao', '12winkh', 'i8global', 'pksoft']) {
    let idx = 0;
    let n = 0;
    while (n < 5) {
        idx = c.indexOf(term, idx);
        if (idx < 0) break;
        console.log(c.substring(Math.max(0, idx - 40), idx + 120).replace(/\s+/g, ' '));
        idx += term.length;
        n++;
    }
}
