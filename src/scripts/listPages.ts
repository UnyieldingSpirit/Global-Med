// scripts/listPages.ts
import fs from 'fs';
import path from 'path';

const pages: string[] = [];
const appDir = path.join(__dirname, '../src/app');

function traverse(dir: string, prefix: string = '') {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverse(filePath, `${prefix}/${file}`);
    } else if (file === 'page.tsx') {
      pages.push(prefix || '/');
    }
  });
}

traverse(appDir);

console.log('Sahifalar ro‘yxati:');
pages.forEach(page => console.log(page));
