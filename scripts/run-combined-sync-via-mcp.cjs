#!/usr/bin/env node
/**
 * Sequential use_figma runner: reads .invoke-*.json and prints one JSON line per step
 * for an external MCP caller. Usage: node scripts/run-combined-sync-via-mcp.cjs list|get <name>
 */
const fs = require('node:fs');
const path = require('node:path');

const STEPS = ['sync1', 'sync2', 'sync3', 'sync4', 'audit'];

function invokePath(name) {
  return path.join(__dirname, `.invoke-${name}.json`);
}

const cmd = process.argv[2];
const arg = process.argv[3];

if (cmd === 'list') {
  console.log(JSON.stringify(STEPS));
  process.exit(0);
}

if (cmd === 'get' && arg) {
  const p = invokePath(arg);
  if (!fs.existsSync(p)) {
    console.error('missing', p);
    process.exit(1);
  }
  process.stdout.write(fs.readFileSync(p, 'utf8'));
  process.exit(0);
}

console.error('Usage: node scripts/run-combined-sync-via-mcp.cjs list|get <sync1|sync2|sync3|sync4|audit>');
process.exit(1);
