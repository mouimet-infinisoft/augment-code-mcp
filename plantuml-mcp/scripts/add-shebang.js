#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to the compiled index.js file
const indexJsPath = path.join(__dirname, '..', 'dist', 'index.js');

// Read the current content
let content = fs.readFileSync(indexJsPath, 'utf8');

// Add shebang line if it doesn't exist
if (!content.startsWith('#!/usr/bin/env node')) {
  content = '#!/usr/bin/env node\n' + content;
  fs.writeFileSync(indexJsPath, content);
  console.log('Added shebang line to index.js');
} else {
  console.log('Shebang line already exists in index.js');
}
