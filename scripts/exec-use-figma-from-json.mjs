#!/usr/bin/env node
/**
 * Execute use_figma by reading invoke JSON and printing args for agent MCP call.
 * Usage: node scripts/exec-use-figma-from-json.mjs scripts/.invoke-figma-combined-sync-1-js.json
 */
import fs from 'node:fs';
import path from 'node:path';

const invokePath = path.resolve(process.argv[2] || '');
if (!invokePath) {
  console.error('Usage: node scripts/exec-use-figma-from-json.mjs <invoke.json>');
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync(invokePath, 'utf8'));
const outPath = invokePath.replace(/\.json$/, '.result.json');
const args = {
  fileKey: payload.fileKey,
  skillNames: payload.skillNames,
  description: payload.description,
  code: payload.code,
};
fs.writeFileSync(outPath.replace('.result.json', '.args.json'), JSON.stringify(args));
console.log(JSON.stringify({ ready: true, codeLen: args.code.length, description: args.description }));
