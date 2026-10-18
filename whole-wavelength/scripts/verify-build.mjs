import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('dist');
const base = '/projektarbeit-test';
const files = fs.readdirSync(root, { recursive: true }).filter(file => file.endsWith('.html'));
assert.equal(files.length, 18, 'Expected home, 13 lessons, explorer, sources, code and 404');
let links = 0;
for (const file of files) {
  const absolute = path.join(root, file);
  const html = fs.readFileSync(absolute, 'utf8');
  assert.match(html, /<html[^>]+lang="de-CH"/, `${file}: German language`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${file}: one h1`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${file}: description`);
  assert.match(html, /<main id="main"/, `${file}: main landmark`);
  assert.ok(!html.includes('Astro Basics'), `${file}: no starter content`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: no duplicate IDs`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[1].replaceAll('&amp;', '&');
    if (/^(?:https?:|data:|mailto:)/.test(ref)) continue;
    assert.notEqual(ref, '#', `${file}: no placeholder links`);
    const parsed = new URL(ref, `https://example.com${base}/${file.replaceAll('\\', '/').replace(/index\.html$/, '')}`);
    assert.ok(parsed.pathname === base || parsed.pathname.startsWith(`${base}/`), `${file}: base prefix ${ref}`);
    let target = path.join(root, decodeURIComponent(parsed.pathname.slice(base.length)));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert.ok(fs.existsSync(target), `${file}: missing ${ref}`);
    if (parsed.hash && target.endsWith('.html')) {
      const body = target === absolute ? html : fs.readFileSync(target, 'utf8');
      const id = decodeURIComponent(parsed.hash.slice(1));
      assert.ok(body.includes(`id="${id}"`), `${file}: missing anchor ${ref}`);
    }
    links++;
  }
  if (file.startsWith('lernen')) {
    assert.equal([...html.matchAll(/data-quiz-answer="/g)].length, 3, `${file}: three quiz options`);
    assert.match(html, /data-mark-read=/, `${file}: progress control`);
    assert.match(html, /class="architecture-svg"/, `${file}: diagram`);
  }
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert.equal([...sitemap.matchAll(/<loc>/g)].length, 17, 'All public content pages in sitemap');
console.log(`Verified ${files.length} HTML pages, ${links} local links/assets and all anchors, quizzes, landmarks and sitemap entries.`);
