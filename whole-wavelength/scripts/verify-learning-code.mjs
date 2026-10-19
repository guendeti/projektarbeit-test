// Keep excerpts in the learning path tied to the executable Java reference.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const lessons = path.join(root, 'whole-wavelength/src/content/lernen');
const normalize = text => text.replace(/\s+/g, '');
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(name));
    else if (entry.name.endsWith('.md')) result.push(name);
  }
  return result;
}
let count = 0;
for (const lesson of await files(lessons)) {
  const markdown = await readFile(lesson, 'utf8');
  for (const match of markdown.matchAll(/^```java source=([^\r\n]+)\r?\n([\s\S]*?)^```/gm)) {
    const sourcePath = path.resolve(root, match[1].trim());
    assert.ok(sourcePath.startsWith(root + path.sep), 'Excerpt source must stay in the repository');
    const source = await readFile(sourcePath, 'utf8');
    assert.ok(normalize(source).includes(normalize(match[2])),
      `Java excerpt differs from ${match[1]} in ${path.relative(root, lesson)}`);
    count++;
  }
}
assert.ok(count >= 9, 'Expected source-linked Java excerpts in the learning path');
console.log(`${count} Java excerpts match the executable reference sources.`);
