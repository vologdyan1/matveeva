const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');
const minified = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\n\s*/g, ' ')
  .replace(/\s*([{}:;,>~+])\s*/g, '$1')
  .replace(/;\}/g, '}')
  .trim();
fs.writeFileSync('css/style.min.css', minified);
console.log('Done. Size:', minified.length, 'chars');
