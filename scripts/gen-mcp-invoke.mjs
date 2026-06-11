import fs from 'node:fs';

const names = [
  '.store-chunk-0.js',
  '.store-chunk-1.js',
  '.store-chunk-2.js',
  '.exec-home-build.js',
];
for (const name of names) {
  const code = fs.readFileSync(`scripts/${name}`, 'utf8');
  const out = `scripts/.mcp-${name.replace('.js', '.json')}`;
  fs.writeFileSync(
    out,
    JSON.stringify({
      fileKey: 'J056FpXrIW4sDJtXNLsz0T',
      skillNames: 'figma-use',
      description: name,
      code,
    }),
  );
  console.log(name, code.length, fs.statSync(out).size);
}
