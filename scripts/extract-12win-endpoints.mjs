import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
const paths = [...new Set(c.match(/["'](\/[a-zA-Z0-9_\-/.]+)["']/g) ?? [])]
    .map((s) => s.slice(1, -1))
    .filter((p) => p.startsWith('/') && p.length < 80 && /game|provider|category|banner|lobby|casino/i.test(p));
console.log(paths.slice(0, 80).join('\n'));
