import fs from 'node:fs';
import path from 'node:path';

const dir = 'scripts/figma-migration-batches';
const outDir = 'scripts/figma-value-invokes';
const ORDER = [
  '00-setup-collections',
  '01-primitives-01',
  '01-primitives-02',
  '01-primitives-03',
  '01-primitives-04',
  '01-primitives-05',
  '01-primitives-06',
  '02-semantics-01',
  '02-semantics-02',
  '02-semantics-03',
  '02-semantics-04',
  '02-semantics-05',
  '03-gradient-stops-01',
  '07-sync-web-code-syntax-01',
  '07-sync-web-code-syntax-02',
  '07-sync-web-code-syntax-03',
  '07-sync-web-code-syntax-04',
  '07-sync-web-code-syntax-05',
  '07-sync-web-code-syntax-06',
  '07-sync-web-code-syntax-07',
  '07-sync-web-code-syntax-08',
  '07-sync-web-code-syntax-09',
  '07-sync-web-code-syntax-10',
  '07-sync-web-code-syntax-11',
  '05-audit',
];

fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const name of ORDER) {
  const file = path.join(dir, `${name}.js`);
  if (!fs.existsSync(file)) continue;
  const code = fs.readFileSync(file, 'utf8');
  const out = path.join(outDir, `${name}.json`);
  fs.writeFileSync(
    out,
    JSON.stringify({
      fileKey: 'J056FpXrIW4sDJtXNLsz0T',
      skillNames: 'figma-use',
      description: `Figma values: ${name}`,
      code,
    }),
  );
  manifest.push({ name, bytes: code.length });
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(manifest.map((m) => `${m.name}: ${m.bytes}b`).join('\n'));
