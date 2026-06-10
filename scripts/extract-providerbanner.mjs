import fs from 'fs';

const c = [
    fs.readFileSync('tmp-12win-main.js', 'utf8'),
    fs.existsSync('tmp-12win-chunk45.js') ? fs.readFileSync('tmp-12win-chunk45.js', 'utf8') : '',
].join('\n');
const re = /providerbanner[a-zA-Z0-9_\-./]*\.(?:jpg|png|webp)/gi;
const m = [...new Set(c.match(re) ?? [])];
console.log(m.join('\n'));

const re2 = /1029[a-zA-Z0-9_\-./]*\.(?:jpg|png|webp)/gi;
const m2 = [...new Set(c.match(re2) ?? [])];
console.log('\n1029:', m2.slice(0, 30).join('\n'));

const re3 = /200x200[a-zA-Z0-9_\-./]*\.(?:jpg|png|webp)/gi;
console.log('\n200:', [...new Set(c.match(re3) ?? [])].slice(0, 30).join('\n'));
