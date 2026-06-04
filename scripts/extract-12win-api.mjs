import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
const apis = [...new Set(c.match(/\/api\/[a-zA-Z0-9_\-/]+/g) ?? [])];
console.log(apis.filter((a) => /game|provider|lobby|casino|banner|category/i.test(a)).slice(0, 50).join('\n'));
