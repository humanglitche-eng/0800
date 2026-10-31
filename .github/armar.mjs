// Arma el sitio para GitHub Pages: copia el repo (sin lo interno) y escribe
// sitemap.xml con las páginas que Google puede indexar.
//
//   node .github/armar.mjs _sitio
//
// Hasta el 31/10/2026 este paso también generaba /o/<slug>/ por cada web de
// Oficios leyendo la API; Oficios salió del sitio y el build ya no depende de
// nada de afuera.

import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const SALIDA = process.argv[2] || '_sitio';
const SITIO = 'https://0800webs.com';
const FUERA = new Set(['.git', '.github', '.gitignore', '.DS_Store', 'CNAME', 'node_modules', SALIDA]);

await rm(SALIDA, { recursive: true, force: true });
// Entrada por entrada y no cp('.') entero: la salida suele estar adentro del
// repo, y cp se niega a copiar una carpeta dentro de sí misma.
const sinMd = (p) => !FUERA.has(basename(p)) && !p.endsWith('.md');
for (const e of await readdir('.')) {
  if (sinMd(e)) await cp(e, join(SALIDA, e), { recursive: true, filter: sinMd });
}

// sitemap.xml: las páginas del repo sin noindex (las rutas viejas que
// redirigen a la home llevan noindex y quedan afuera).
const urls = [];
for (const ruta of ['index.html', ...(await readdir('.', { recursive: true })).filter((p) => p.endsWith('/index.html'))]) {
  if (!sinMd(ruta.split('/')[0])) continue;
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(await readFile(ruta, 'utf8'))) continue;
  urls.push(`${SITIO}/${ruta.replace(/index\.html$/, '')}`);
}
await writeFile(join(SALIDA, 'sitemap.xml'), [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => `  <url><loc>${u}</loc></url>`),
  '</urlset>', '',
].join('\n'));
console.log(`sitio en ${SALIDA}/ · ${urls.length} URL(s) en el sitemap`);
