import fs from 'node:fs';

const chunks = JSON.parse(fs.readFileSync('scripts/.home-chunks.json', 'utf8'));
chunks.forEach((chunk, i) => {
  const code =
    `figma.root.setSharedPluginData("caelo", "homeBuild${i}", ${JSON.stringify(chunk)});\n` +
    `return { stored: ${i}, len: ${chunk.length} };`;
  fs.writeFileSync(`scripts/.store-chunk-${i}.js`, code);
});
const exec =
  'const code = [0,1,2].map(i => figma.root.getSharedPluginData("caelo", "homeBuild" + i)).join("");\n' +
  'const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;\n' +
  'const fn = new AsyncFunction("figma", code);\n' +
  'return await fn(figma);';
fs.writeFileSync('scripts/.exec-home-build.js', exec);
console.log('chunks', chunks.map((c) => c.length));
