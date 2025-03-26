import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

async function findJsFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...(await findJsFiles(fullPath)));
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.mjs'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function fixImports() {
  const nodeModulesPath = './node_modules';
  const files = await findJsFiles(nodeModulesPath);
  let fixedCount = 0;
  
  for (const file of files) {
    try {
      let content = await readFile(file, 'utf8');
      const oldPattern = /import\s+(\w+)\s+from\s+(['"])([^'"]+\.json)(['"])\s+assert\s+\{\s*type\s*:\s*(['"])json(['"])\s*\}/g;
      const newContent = content.replace(oldPattern, 'import $1 from $2$3$4 with { type: $5json$6 }');
      
      if (content !== newContent) {
        await writeFile(file, newContent, 'utf8');
        fixedCount++;
        console.log(`Fixed: ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }
  
  console.log(`Total files fixed: ${fixedCount}`);
}

fixImports().catch(console.error);