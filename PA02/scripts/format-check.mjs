import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function find(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? find(path) : entry.name.endsWith('.mjs') ? [path] : [];
  }))).flat();
}

const targets = (await Promise.all(['src', 'test', 'scripts'].map(find))).flat();
const invalid = [];
for (const file of targets) {
  const source = await readFile(file, 'utf8');
  if (!source.endsWith('\n') || /\r\n/.test(source)) invalid.push(file);
}
if (invalid.length) throw new Error(`Files must use LF and end in a newline:\n${invalid.join('\n')}`);
console.log(`Format check passed for ${targets.length} JavaScript files.`);
