// Downloads every asset listed in docs/research/assets.json into public/ (4 parallel workers).
import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const list = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/assets.json'), 'utf8'));
const failures = []; let done = 0, skipped = 0;
async function worker(items) {
  for (const a of items) {
    const dest = path.join(root, 'public', a.local);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { skipped++; continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      const res = await fetch(a.remote, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh)' }, redirect: 'follow' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) throw new Error('empty');
      fs.writeFileSync(dest, buf); done++;
    } catch (e) { failures.push({ ...a, error: String(e.message || e) }); }
  }
}
const N = 6; const buckets = Array.from({ length: N }, () => []);
list.forEach((a, i) => buckets[i % N].push(a));
await Promise.all(buckets.map(worker));
fs.writeFileSync(path.join(root, 'docs/research/assets-failures.json'), JSON.stringify(failures, null, 1));
console.log(JSON.stringify({ total: list.length, downloaded: done, skipped, failed: failures.length }));
