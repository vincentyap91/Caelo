/**
 * Print a script file body for use_figma MCP (stdout).
 * Usage: node scripts/run-figma-mcp.mjs scripts/figma-build-home-ui.js
 */
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/run-figma-mcp.mjs <script.js>');
  process.exit(1);
}
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/^\/\*[\s\S]*?\*\/\s*/m, '');
const out = process.argv[3];
if (out) fs.writeFileSync(out, code, 'utf8');
else process.stdout.write(code);
