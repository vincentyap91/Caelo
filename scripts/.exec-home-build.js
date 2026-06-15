const code = [0,1,2].map(i => figma.root.getSharedPluginData("caelo", "homeBuild" + i)).join("");
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const fn = new AsyncFunction("figma", code);
return await fn(figma);