import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
const urls = [...new Set(c.match(/https?:\/\/[^"'\\\s]+\.(?:jpg|jpeg|png|webp|svg)/gi) ?? [])];
const filtered = urls.filter((u) =>
    /casino|live|evolution|wm|pragmatic|sagam|sexy|ct855|playace|playtech|lobby|1029|game|provider|banner/i.test(u)
);
console.log(filtered.slice(0, 100).join('\n'));
console.log('\n--- total', filtered.length);
