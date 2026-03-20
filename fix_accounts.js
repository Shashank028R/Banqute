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
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/ombis/Desktop/Banqute/client/components/Accounts');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace mockData import
  const mockRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\/mockData['"];?/g;
  let match;
  let importsList = [];
  while ((match = mockRegex.exec(content)) !== null) {
      importsList.push(match[1].trim());
  }
  
  if (importsList.length > 0) {
    const combinedImports = importsList.join(', ');
    
    // Check how many levels deep we are to import correctly
    const relativeDepth = file.split('Accounts')[1].split(path.sep).length - 2;
    const importPrefix = relativeDepth === 1 ? '../../' : (relativeDepth === 0 ? '../' : '../../../');
    
    content = content.replace(mockRegex, `import { useFinanceData } from '${importPrefix}hooks/useFinanceData';`);
    
    const compRegex = /(export\s+const\s+\w+\s*(:\s*React\.FC(?:<[^>]*>)?\s*)?=\s*(async\s*)?\([^)]*\)\s*=>\s*\{)/;
    
    content = content.replace(compRegex, `$1 \n  const { ${combinedImports} } = useFinanceData();`);
    
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
