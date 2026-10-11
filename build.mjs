// サキドリ ホームページのビルド
// content/site.json と content/blog/*.md を読み込み、dist/ にサイトを書き出します。
// Netlify が公開のたびに自動で実行します（追加のインストールは不要です）。
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, 'dist');

function readJson(p) { return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')); }

// --- very small YAML front matter reader (flat "key: value" lines) ---
function parseScalar(v) {
  v = v.trim();
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v.startsWith('"') && v.endsWith('"')) { try { return JSON.parse(v); } catch { return v.slice(1, -1); } }
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}
function parsePost(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  const meta = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split('\n')) {
      const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
      if (kv) meta[kv[1]] = parseScalar(kv[2]);
    }
  }
  const id = path.basename(file, path.extname(file)).replace(/[^\w-]/g, '-');
  const date = meta.date instanceof Date ? meta.date.toISOString() : String(meta.date || '');
  return {
    id,
    title: String(meta.title || ''),
    date: date.slice(0, 10),
    image: meta.image ? String(meta.image) : '',
    published: meta.published !== false,
    body: body.trim(),
  };
}

const site = readJson('content/site.json');
const blogDir = path.join(root, 'content/blog');
const posts = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter((f) => f.endsWith('.md')).map((f) => parsePost(path.join(blogDir, f)))
  : [];
// 下書き（published: false）はサイトに含めません
site.posts = posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let html = fs.readFileSync(path.join(root, 'src/template.html'), 'utf8');
html = html
  .replaceAll('__TITLE__', esc(site.meta?.title || '結婚相談所サキドリ'))
  .replaceAll('__DESC__', esc(site.meta?.description || ''))
  .replace('__CONTENT__', () => JSON.stringify(site).replace(/</g, '\\u003c'));

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.cpSync(path.join(root, 'images'), path.join(out, 'images'), { recursive: true });
fs.cpSync(path.join(root, 'admin'), path.join(out, 'admin'), { recursive: true });
fs.writeFileSync(path.join(out, 'robots.txt'), 'User-agent: *\nAllow: /\nDisallow: /admin/\n');

console.log(`built: ${site.posts.length} published post(s), ${posts.length - site.posts.length} draft(s)`);
