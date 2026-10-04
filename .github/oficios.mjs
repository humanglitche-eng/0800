// Arma el sitio para GitHub Pages: copia el repo y le agrega una carpeta por
// oficio publicado.
//
//   node .github/oficios.mjs _sitio
//
// En la VPS, Caddy reescribía 0800webs.com/o/<slug> a la plantilla
// (oficios/sitio/index.html). Pages no reescribe, así que acá se genera
// o/<slug>/index.html para cada publicado del directorio: la misma plantilla,
// con título, descripción y canónica ya escritos para que Google los lea sin JS.
// Lo que no está en el directorio (vista previa con ?llave=, alguien publicado
// después del último build) lo atiende 404.html, que carga la misma plantilla.
//
// Si la API no responde, el build falla a propósito: mejor que quede publicado
// el sitio anterior que uno sin las webs de los oficios.

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const SALIDA = process.argv[2] || '_sitio';
const API = (process.env.OFICIOS_API || 'https://api.hg-vl.com') + '/v1/_oficios';
const SITIO = 'https://0800webs.com';
const FUERA = new Set(['.git', '.github', '.gitignore', '.DS_Store', 'CNAME', 'node_modules', SALIDA]);

async function pedir(ruta) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(API + ruta, { headers: { 'user-agent': '0800webs-pages' } });
      if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === 3) throw e;
      await new Promise((ok) => setTimeout(ok, 2000 * i));
    }
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function pagina(plantilla, f) {
  const oficio = f.rubro === 'tatuaje' ? 'Tatuador' : 'Barbero';
  const titulo = `${f.nombre} — ${oficio} en ${f.barrio || f.ciudad}`;
  const desc = (f.bio || `${f.nombre}, ${oficio.toLowerCase()} en ${[f.barrio, f.ciudad].filter(Boolean).join(', ')}. Sacá turno online.`).slice(0, 160);
  const url = `${SITIO}/o/${f.slug}/`;
  const meta = [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(titulo)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    f.foto ? `<meta property="og:image" content="${esc(f.foto)}">` : '',
  ].filter(Boolean).join('\n');
  return plantilla
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(titulo)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${esc(desc)}">\n${meta}`);
}

await rm(SALIDA, { recursive: true, force: true });
await cp('.', SALIDA, {
  recursive: true,
  filter: (p) => !FUERA.has(basename(p)) && !(p !== '.' && p.endsWith('.md')),
});

const plantilla = await readFile('oficios/sitio/index.html', 'utf8');
const { lista } = await pedir('/directorio');
let hechas = 0;
for (const item of lista) {
  if (!/^[a-z0-9-]+$/.test(item.slug || '')) continue;
  // La ficha completa trae la bio; si falla, alcanza con lo del directorio.
  const ficha = await pedir(`/sitio/${item.slug}`).catch(() => ({}));
  const dir = join(SALIDA, 'o', item.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), pagina(plantilla, { ...item, ...ficha, foto: item.foto }));
  hechas++;
}
console.log(`sitio en ${SALIDA}/ · ${hechas} web(s) de oficios`);
