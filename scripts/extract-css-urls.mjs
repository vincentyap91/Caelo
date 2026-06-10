import fs from 'fs';

const css = fs.readFileSync('tmp-12win-css.css', 'utf8');
const urls = [...new Set(css.match(/url\([^)]+\)/g) ?? [])];
const filtered = urls.filter((u) => /casino|live|lobby|provider|banner|1029|pksoft|cdn/i.test(u));
console.log(filtered.slice(0, 60).join('\n'));
console.log('count', filtered.length);
