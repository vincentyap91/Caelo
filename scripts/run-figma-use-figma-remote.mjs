#!/usr/bin/env node
/**
 * Call Figma remote MCP use_figma with args from a .cjs module.
 * Usage: node scripts/run-figma-use-figma-remote.mjs scripts/.use-figma-args-sync1.cjs
 */
import { createRequire } from 'node:module';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const require = createRequire(import.meta.url);
const argsPath = process.argv[2];
if (!argsPath) {
  console.error('Usage: node scripts/run-figma-use-figma-remote.mjs <args.cjs>');
  process.exit(1);
}

const args = require(argsPath);
const client = new Client({ name: 'caelo-figma-sync', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(new URL('https://mcp.figma.com/mcp'));

try {
  await client.connect(transport);
  const result = await client.callTool({
    name: 'use_figma',
    arguments: args,
  });
  const text = (result.content || [])
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text, isError: result.isError };
  }
  console.log(JSON.stringify(parsed, null, 2));
} catch (err) {
  console.error(JSON.stringify({ error: String(err?.message || err) }));
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
