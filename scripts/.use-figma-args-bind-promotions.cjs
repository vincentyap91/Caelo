const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  fileKey: 'J056FpXrIW4sDJtXNLsz0T',
  code: fs.readFileSync(path.join(__dirname, '.figma-payload-promotions-bind.js'), 'utf8'),
  description: 'Bind Promotions frame 124:4241 semantic variables per PromotionPage.jsx',
  skillNames: 'figma-use',
};
