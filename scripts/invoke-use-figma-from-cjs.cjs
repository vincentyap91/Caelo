#!/usr/bin/env node
/**
 * Print use_figma MCP arguments JSON to stdout for agent CallMcpTool.
 * Usage: node scripts/invoke-use-figma-from-cjs.cjs scripts/.use-figma-args-sync1.cjs
 */
const fs = require('node:fs');
const path = process.argv[2];
if (!path) {
  console.error('Usage: node scripts/invoke-use-figma-from-cjs.cjs <args.cjs>');
  process.exit(1);
}
const args = require(path.startsWith('/') || /^[A-Za-z]:/.test(path) ? path : require('node:path').resolve(path));
process.stdout.write(JSON.stringify(args));
