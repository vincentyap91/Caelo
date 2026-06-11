#!/usr/bin/env node
/**
 * Read invoke JSON and print MCP tool arguments as JSON to stdout.
 * Usage: node scripts/run-use-figma-invoke.mjs scripts/.invoke-figma-combined-sync-1-js.json
 */
import fs from 'node:fs';

const invokePath = process.argv[2];
if (!invokePath) {
  console.error('Usage: node scripts/run-use-figma-invoke.mjs <invoke.json>');
  process.exit(1);
}
const payload = JSON.parse(fs.readFileSync(invokePath, 'utf8'));
process.stdout.write(
  JSON.stringify({
    fileKey: payload.fileKey,
    skillNames: payload.skillNames,
    description: payload.description,
    code: payload.code,
  }),
);
