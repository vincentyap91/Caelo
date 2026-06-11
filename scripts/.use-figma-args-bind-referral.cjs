const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  fileKey: 'J056FpXrIW4sDJtXNLsz0T',
  code: fs.readFileSync(path.join(__dirname, '.figma-payload-referral-bind.js'), 'utf8'),
  description: 'Bind Referral - Invite Friends frame 131:5287 per referral.jsx',
  skillNames: 'figma-use',
};
