const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  fileKey: 'J056FpXrIW4sDJtXNLsz0T',
  code: fs.readFileSync(path.join(__dirname, '.figma-payload-slots-bind.js'), 'utf8'),
  description: 'Bind Slots frame 124:3481 semantic variables per SlotsPage.jsx',
  skillNames: 'figma-use',
};
