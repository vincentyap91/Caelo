/**
 * Run all names-only variable batches against Figma via MCP invoke JSON files.
 * Agent: read each scripts/.mcp-*.json and call use_figma with parsed contents.
 * Or run batches manually in Figma plugin console.
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = 'scripts/figma-names-only-batches';
const batches = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.js') && f !== '00-setup.js')
  .sort();

for (const f of batches) {
  const code = fs.readFileSync(path.join(dir, f), 'utf8');
  const out = `scripts/.mcp-${f.replace('.js', '.json')}`;
  fs.writeFileSync(
    out,
    JSON.stringify({
      fileKey: 'J056FpXrIW4sDJtXNLsz0T',
      skillNames: 'figma-use',
      description: `Create variable names: ${f}`,
      code,
    }),
  );
}

console.log(
  batches.map((f) => `${f} → scripts/.mcp-${f.replace('.js', '.json')}`).join('\n'),
);
