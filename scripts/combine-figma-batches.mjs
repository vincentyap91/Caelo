/**
 * Combine migration batches into groups for use_figma (max ~50k chars each).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'figma-migration-batches');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
const names = manifest
  .map((m) => m.name)
  .filter((n) => /^(01-primitives|02-semantics|03-gradient|07-sync)/.test(n));

function splitBody(code) {
  for (const marker of ['const primCol', 'const semCol', 'const ITEMS', 'const allVars']) {
    const idx = code.indexOf(marker);
    if (idx >= 0) {
      let body = code.slice(idx);
      body = body.replace(/\nreturn \{[^]*?\};\s*$/m, '');
      return { header: code.slice(0, idx), body };
    }
  }
  throw new Error('No split marker in batch');
}

const chunks = [];
let current = { header: null, bodies: [], size: 0 };
const MAX = 48000;

for (const name of names) {
  const code = fs.readFileSync(path.join(dir, `${name}.js`), 'utf8');
  const { header, body } = splitBody(code);
  const piece = `// ${name}\n${body}`;
  if (!current.header) current.header = header;
  if (current.size + piece.length > MAX && current.bodies.length > 0) {
    chunks.push(current);
    current = { header, bodies: [], size: header.length };
  }
  current.bodies.push(`{\n${piece}\n}`);
  current.size += piece.length;
}
if (current.bodies.length) chunks.push(current);

chunks.forEach((chunk, i) => {
  const combined =
    chunk.header +
    chunk.bodies.join('\n\n') +
    `\nreturn { step: "combined-sync-${i + 1}", batches: ${chunk.bodies.length} };`;
  const out = path.join(__dirname, `figma-combined-sync-${i + 1}.js`);
  fs.writeFileSync(out, combined);
  console.log(out, combined.length);
});
