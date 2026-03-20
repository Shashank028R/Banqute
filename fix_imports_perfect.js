const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
       if(!file.includes('node_modules')) results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') && !file.includes('contexts') && !file.includes('hooks')) { 
        results.push(file);
    }
  });
  return results;
}

const dirAccounts = path.resolve('c:/Users/ombis/Desktop/Banqute/client/components/Accounts');
const files = walk(dirAccounts);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let relDir = path.relative(dirAccounts, path.dirname(file));
  
  let depth = relDir ? relDir.split(path.sep).length : 0;
  let importPrefix = '';
  if (depth === 0) importPrefix = './';
  else if (depth === 1) importPrefix = '../';
  else if (depth === 2) importPrefix = '../../';
  else if (depth === 3) importPrefix = '../../../';
  
  const badImport = /import\s+\{\s*useFinanceData\s*\}\s+from\s+['"][^'"]+['"];?/g;
  if (badImport.test(content)) {
    content = content.replace(badImport, `import { useFinanceData } from '${importPrefix}hooks/useFinanceData';`);
    fs.writeFileSync(file, content);
    console.log('Fixed', file, 'with', importPrefix);
  }
});
