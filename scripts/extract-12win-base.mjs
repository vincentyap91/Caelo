import fs from 'fs';

const c = fs.readFileSync('tmp-12win-main.js', 'utf8');
const hosts = [...new Set(c.match(/https?:\/\/[a-z0-9.-]+\.(?:com|net|vip|io)[a-z0-9./_-]*/gi) ?? [])];
console.log(hosts.filter((h) => /api|cdn|i8|pksoft|azure|lb9/i.test(h)).slice(0, 40).join('\n'));
