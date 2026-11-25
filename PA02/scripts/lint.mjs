import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : entry.name.endsWith('.mjs') ? [path] : [];
  }))).flat();
}

const targets = (await Promise.all(['src', 'test', 'scripts'].map(files))).flat();
const violations = [];
for (const file of targets) {
  const source = await readFile(file, 'utf8');
  source.split(/\r?\n/).forEach((line, index) => {
    if (/\s+$/.test(line)) violations.push(`${file}:${index + 1}: trailing whitespace`);
    if (/\bvar\s|\beval\s*\(/.test(line)) violations.push(`${file}:${index + 1}: forbidden var/eval`);
  });
}
if (violations.length) throw new Error(violations.join('\n'));
console.log(`Lint passed for ${targets.length} JavaScript files.`);
