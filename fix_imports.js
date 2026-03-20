const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
       if(!file.includes('node_modules')) results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') && !file.includes('contexts')) { // dont mess with contexts file
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/ombis/Desktop/Banqute/client/components/Accounts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Find out how deep this file is relative to 'Accounts' folder
  const relativePath = file.split(/Accounts[\\/]/)[1];
  const depth = relativePath.split(/[\\/]/).length - 1;

  let correctImportPrefix = '';
  if (depth === 0) correctImportPrefix = './';
  else if (depth === 1) correctImportPrefix = '../';
  else if (depth === 2) correctImportPrefix = '../../';

  const badImport = /import\s+\{\s*useFinanceData\s*\}\s+from\s+['"][./]*hooks\/useFinanceData['"];/g;
  
  if (badImport.test(content)) {
    content = content.replace(badImport, `import { useFinanceData } from '${correctImportPrefix}hooks/useFinanceData';`);
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
