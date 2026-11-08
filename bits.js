/* ══ BITS · treinta componentes de React Bits, portados a JS sin React ═══════
   Para la home de 0800webs.com (2026-11-07). El sitio es HTML estático sin
   build, así que no se suma React: se portó la idea y la matemática de cada
   componente a funciones planas, con la piel del manual (tinta y papel; azul
   sobre claro, lima sobre oscuro). Todos respetan prefers-reduced-motion y
   los que tienen bucle se duermen fuera de pantalla.

   Texto ........ partirLetras ← SplitText      desenfocar ← BlurText
                  descifrar ← DecryptedText     rotar ← RotatingText
                  tipear ← TextType             contar ← CountUp
                  rodillo ← Counter             enfocar ← TrueFocus
                  revelarScroll ← ScrollReveal  proximidad ← VariableProximity
                  circular ← CircularText       curva ← CurvedLoop
                  presion ← TextPressure        brilloTexto ← ShinyText
                  velocidad ← ScrollVelocity
   Animación .... chispas ← ClickSpark          iman ← Magnet
                  estrella ← StarBorder         reflejo ← GlareHover
                  bucle ← LogoLoop
   Componentes .. goo ← GooeyNav                bento ← MagicBento
                  lista ← AnimatedList          foco ← SpotlightCard
                  inclinar ← TiltedCard         croma ← ChromaGrid
                  fluir ← FlowingMenu           rebotar ← BounceCards
   Fondos ....... puntos ← DotGrid              hilos ← Threads

   ───────────────────────────────────────────────────────────────────────────
   React Bits — MIT + Commons Clause License Condition v1.0
   Copyright (c) 2026 David Haz — https://github.com/DavidHDev/react-bits
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to
   deal in the Software without restriction, including without limitation the
   rights to use, copy, modify, merge, publish, and distribute the Software as
   part of an application, website, or product, subject to the following
   conditions: The above copyright notice and this permission notice shall be
   included in all copies or substantial portions of the Software.
   Commons Clause: you may use this Software, including for any commercial
   purpose, so long as you do not sell, sublicense, or redistribute the
   components themselves, whether alone, in a bundle, or as a ported version.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
   (TextPressure viene a su vez de https://codepen.io/JuanFuentes/full/rgXKGQ)
   ─────────────────────────────────────────────────────────────────────────── */
(function () {
'use strict';
const QUIETO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINO = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const LIMA = [201, 247, 60], PAPEL = [244, 243, 240];

/* ── utilidades ────────────────────────────────────────────────────────────── */
function alVer(el, fn, margen = '0px 0px -10% 0px') {
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn(); } }, { rootMargin: margen });
  io.observe(el);
}
function mirar(el, cb) { const io = new IntersectionObserver(([e]) => cb(e.isIntersecting)); io.observe(el); return io; }
function sr(texto) { const s = document.createElement('span'); s.className = 'b-sr'; s.textContent = texto; return s; }
function limpio(el) { return el.textContent.replace(/\s+/g, ' ').trim(); }
/* Parte el texto en palabras (y letras). El texto entero queda para lectores
   de pantalla en un span oculto; lo que se anima va con aria-hidden. */
function partir(el, { letras = true } = {}) {
  const t = limpio(el);
  el.textContent = '';
  el.appendChild(sr(t));
  const pals = [], lets = [];
  t.split(' ').forEach((p, i, arr) => {
    const w = document.createElement('span'); w.className = 'b-pal'; w.setAttribute('aria-hidden', 'true');
    if (letras) [...p].forEach(ch => { const c = document.createElement('span'); c.className = 'b-let'; c.textContent = ch; w.appendChild(c); lets.push(c); });
    else w.textContent = p;
    el.appendChild(w); pals.push(w);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return { pals, lets };
}
function marcar(el, nombre) { if (el.dataset.bit) return false; el.dataset.bit = nombre; return true; }

/* ── SplitText: las letras suben una por una ──────────────────────────────── */
function partirLetras(el, { paso = 22, tope = 900 } = {}) {
  if (!marcar(el, 'split')) return;
  const { lets } = partir(el);
  el.classList.add('b-split');
  lets.forEach((c, i) => { c.style.transitionDelay = Math.min(i * paso, tope) + 'ms'; });
  if (QUIETO) { el.classList.add('b-ya'); return; }
  alVer(el, () => el.classList.add('b-ya'));
}

/* ── BlurText: las palabras se enfocan en cascada ─────────────────────────── */
function desenfocar(el, { paso = 55 } = {}) {
  if (!marcar(el, 'blur')) return;
  const { pals } = partir(el, { letras: false });
  el.classList.add('b-blur');
  pals.forEach((w, i) => { w.style.animationDelay = (i * paso) + 'ms'; });
  if (QUIETO) { el.classList.add('b-ya'); return; }
  alVer(el, () => el.classList.add('b-ya'));
}

/* ── DecryptedText: se descifra de izquierda a derecha ────────────────────── */
function descifrar(el, { vel = 32, juego = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>', alPasar = true } = {}) {
  if (!marcar(el, 'decrypt')) return;
  const final = el.textContent;
  const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true'); vis.textContent = final;
  el.textContent = ''; el.append(sr(final), vis);
  let t = 0, corriendo = false;
  const correr = () => {
    if (QUIETO || corriendo) return;
    corriendo = true;
    const largo = final.length, salto = Math.max(1, Math.round(largo / 20));
    let n = 0;
    t = setInterval(() => {
      n += salto;
      let s = '';
      for (let i = 0; i < largo; i++) { const ch = final[i]; s += (i < n || /[\s·.,+\-]/.test(ch)) ? ch : juego[Math.random() * juego.length | 0]; }
      vis.textContent = s;
      if (n >= largo) { clearInterval(t); vis.textContent = final; corriendo = false; }
    }, vel);
  };
  alVer(el, correr);
  if (alPasar && FINO) el.addEventListener('pointerenter', correr);
}

/* ── RotatingText: la palabra sale por arriba y entra la otra por abajo ───── */
function rotar(el, palabras, { cada = 2300, alCambiar } = {}) {
  el.classList.add('b-rota');
  el.setAttribute('aria-hidden', 'true');
  const ventana = document.createElement('span'); ventana.className = 'b-rota-v';
  el.textContent = ''; el.appendChild(ventana);
  const hacer = txt => {
    const w = document.createElement('span'); w.className = 'b-rota-pal';
    [...txt].forEach((ch, k) => { const c = document.createElement('span'); c.className = 'b-rota-let'; c.textContent = ch === ' ' ? ' ' : ch; c.style.transitionDelay = (k * 16) + 'ms'; w.appendChild(c); });
    return w;
  };
  let i = 0, actual = hacer(palabras[0]), t = 0, visible = false;
  actual.classList.add('b-dentro'); ventana.appendChild(actual);
  const medir = w => { ventana.style.width = Math.ceil(w.scrollWidth) + 'px'; };
  requestAnimationFrame(() => medir(actual));
  if (document.fonts) document.fonts.ready.then(() => medir(actual));
  function ir(n) {
    if (n === i) return;
    const sig = hacer(palabras[n]); ventana.appendChild(sig); medir(sig);
    const vieja = actual; vieja.classList.remove('b-dentro'); vieja.classList.add('b-sale');
    requestAnimationFrame(() => requestAnimationFrame(() => sig.classList.add('b-dentro')));
    setTimeout(() => vieja.remove(), 900);
    actual = sig; i = n;
    if (alCambiar) alCambiar(i);
  }
  const andar = () => { clearInterval(t); if (!QUIETO && visible && !document.hidden) t = setInterval(() => ir((i + 1) % palabras.length), cada); };
  mirar(el, v => { visible = v; andar(); });
  document.addEventListener('visibilitychange', andar);
  return { ir, actual: () => i, frenar: () => { clearInterval(t); t = 0; visible = false; } };
}

/* ── TextType: escribe letra por letra, con cursor ────────────────────────── */
function tipear(el, { vel = 26 } = {}) {
  el.classList.add('b-tipo');
  const lector = sr('');
  const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
  const cur = document.createElement('span'); cur.className = 'b-cursor'; cur.setAttribute('aria-hidden', 'true');
  el.append(lector, vis, cur);
  let t = 0, visible = false, pendiente = null;
  mirar(el, v => { visible = v; if (v && pendiente) { const p = pendiente; pendiente = null; escribir(p.txt, p.fin); } });
  /* fin (opcional) se llama cuando termina de escribir; si llega otro texto antes, ese fin no se llama */
  function escribir(txt, fin) {
    clearTimeout(t); lector.textContent = txt; pendiente = null;
    if (QUIETO || !txt) { vis.textContent = txt; el.classList.remove('b-escribe'); if (fin) fin(); return; }
    if (!visible) { pendiente = { txt, fin }; vis.textContent = ''; return; }
    let n = 0; vis.textContent = ''; el.classList.add('b-escribe');
    const paso = () => {
      n++; vis.textContent = txt.slice(0, n);
      if (n < txt.length) t = setTimeout(paso, vel + (/[,.!?]/.test(txt[n - 1]) ? 200 : 0) + Math.random() * vel);
      else { el.classList.remove('b-escribe'); if (fin) fin(); }
    };
    t = setTimeout(paso, 420);
  }
  return { poner: escribir };
}

/* ── CountUp: el número cuenta hasta su valor al aparecer ─────────────────── */
function contar(el, { dur = 1500 } = {}) {
  if (!marcar(el, 'count')) return;
  const m = el.textContent.match(/^(\D*?)(\d[\d.]*)([\s\S]*)$/);
  if (!m) return;
  const pre = m[1], fin = parseInt(m[2].replace(/\./g, ''), 10), suf = m[3];
  if (!isFinite(fin) || fin < 2 || QUIETO) return;
  const fmt = n => pre + Math.round(n).toLocaleString('es-AR') + suf;
  alVer(el, () => {
    const t0 = performance.now();
    el.textContent = fmt(0);
    const paso = ah => { const p = clamp((ah - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(fin * e); if (p < 1) requestAnimationFrame(paso); };
    requestAnimationFrame(paso);
  }, '0px 0px -8% 0px');
}

/* ── Counter: cada cifra es un rodillo que gira hasta su número ───────────── */
function rodillo(el, { pre = '$', suf = '' } = {}) {
  el.classList.add('b-rod');
  const lector = sr(''), vis = document.createElement('span');
  vis.className = 'b-rod-vis'; vis.setAttribute('aria-hidden', 'true');
  el.append(lector, vis);
  let cols = [], forma = '';
  const aplicar = s => { let k = 0; for (const ch of s) if (/\d/.test(ch)) { cols[k].style.transform = 'translateY(' + (-ch) + 'em)'; k++; } };
  function poner(valor) {
    const s = pre + Math.round(valor).toLocaleString('es-AR') + suf;
    lector.textContent = s;
    const f = s.replace(/\d/g, '0');
    if (f !== forma) {
      forma = f; vis.textContent = ''; cols = [];
      let k = 0;
      for (const ch of s) {
        if (/\d/.test(ch)) {
          const c = document.createElement('span'); c.className = 'b-rod-col';
          const tira = document.createElement('span'); tira.className = 'b-rod-tira';
          tira.style.transitionDelay = (k++ * 35) + 'ms';
          for (let d = 0; d < 10; d++) { const n = document.createElement('span'); n.textContent = d; tira.appendChild(n); }
          c.appendChild(tira); vis.appendChild(c); cols.push(tira);
        } else { const x = document.createElement('span'); x.className = 'b-rod-sep'; x.textContent = ch; vis.appendChild(x); }
      }
      requestAnimationFrame(() => requestAnimationFrame(() => aplicar(s)));
    } else aplicar(s);
  }
  return { poner };
}

/* ── TrueFocus: un marco de esquinas recorre las frases, el resto se nubla ── */
function enfocar(el, { cada = 1900, nublado = 4 } = {}) {
  if (!marcar(el, 'truefocus')) return;
  const t = limpio(el);
  const frases = (t.match(/[^.!?]+[.!?]*/g) || [t]).map(s => s.trim()).filter(Boolean);
  el.textContent = ''; el.appendChild(sr(t));
  el.classList.add('b-tf'); el.style.setProperty('--b-nublado', nublado + 'px');
  const spans = frases.map((f, i) => {
    const s = document.createElement('span'); s.className = 'b-tf-fr'; s.textContent = f; s.setAttribute('aria-hidden', 'true');
    el.appendChild(s); if (i < frases.length - 1) el.appendChild(document.createTextNode(' ')); return s;
  });
  if (QUIETO) return;
  const marco = document.createElement('span'); marco.className = 'b-tf-marco'; marco.setAttribute('aria-hidden', 'true');
  marco.innerHTML = '<i></i><i></i><i></i><i></i>'; el.appendChild(marco);
  let i = 0, t0 = 0, sobre = false, visible = false;
  const poner = n => {
    i = n; spans.forEach((s, k) => s.classList.toggle('b-activo', k === n));
    const r = spans[n].getBoundingClientRect(), b = el.getBoundingClientRect();
    marco.style.transform = `translate(${r.left - b.left}px,${r.top - b.top}px)`;
    marco.style.width = r.width + 'px'; marco.style.height = r.height + 'px';
  };
  const andar = () => { clearInterval(t0); if (visible && !sobre && !document.hidden) t0 = setInterval(() => poner((i + 1) % spans.length), cada); };
  el.classList.add('b-tf-vivo'); poner(0);
  new ResizeObserver(() => poner(i)).observe(el);
  if (FINO) spans.forEach((s, k) => {
    s.addEventListener('pointerenter', () => { sobre = true; clearInterval(t0); poner(k); });
    s.addEventListener('pointerleave', () => { sobre = false; andar(); });
  });
  mirar(el, v => { visible = v; andar(); });
  document.addEventListener('visibilitychange', andar);
}

/* ── ScrollReveal: las palabras se encienden a medida que bajás ───────────── */
function revelarScroll(el, { piso = 0.14, nublado = 5 } = {}) {
  if (!marcar(el, 'scrollreveal')) return;
  const { pals } = partir(el, { letras: false });
  el.classList.add('b-revela');
  if (QUIETO) return;
  let raf = 0, visible = false;
  const pintar = () => {
    raf = 0;
    const r = el.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh * 0.9 - r.top) / (vh * 0.45 + r.height * 0.5));
    const n = pals.length;
    pals.forEach((w, k) => {
      const q = clamp((p * (n + 3) - k) / 3);
      w.style.opacity = (piso + (1 - piso) * q).toFixed(3);
      w.style.filter = q >= 1 ? '' : `blur(${((1 - q) * nublado).toFixed(2)}px)`;
    });
  };
  const pedir = () => { if (!raf && visible) raf = requestAnimationFrame(pintar); };
  mirar(el, v => { visible = v; pedir(); });
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  pintar();
}

/* ── VariableProximity: las letras engordan cerca del puntero ─────────────── */
function proximidad(el, { radio = 120, desde = 400, hasta = 820 } = {}) {
  if (!FINO || QUIETO || !marcar(el, 'proximity')) return;
  const { lets } = partir(el);
  el.classList.add('b-prox');
  let centros = [], raf = 0, px = -1e4, py = -1e4, activo = false;
  const medir = () => { const b = el.getBoundingClientRect(); centros = lets.map(c => { const r = c.getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + r.height / 2]; }); };
  if (document.fonts) document.fonts.ready.then(medir); medir();
  new ResizeObserver(medir).observe(el);
  addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(cuadro); }, { passive: true });
  function cuadro() {
    raf = 0;
    const b = el.getBoundingClientRect();
    const cerca = px > b.left - radio && px < b.right + radio && py > b.top - radio && py < b.bottom + radio;
    if (!cerca && !activo) return;
    activo = cerca;
    const x = px - b.left, y = py - b.top;
    lets.forEach((c, i) => {
      const d = Math.hypot(x - centros[i][0], y - centros[i][1]);
      const t = cerca ? clamp(1 - d / radio) : 0;
      c.style.fontVariationSettings = t > 0 ? `'wght' ${Math.round(lerp(desde, hasta, t * t * (3 - 2 * t)))}` : '';
    });
  }
}

/* ── CircularText: un anillo de letras que gira; al pasar, acelera ────────── */
function circular(el, texto, { vuelta = 22 } = {}) {
  el.classList.add('b-circ'); el.setAttribute('aria-hidden', 'true');
  const letras = [...texto], n = letras.length;
  const anillo = document.createElement('span'); anillo.className = 'b-circ-anillo';
  letras.forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch; s.style.transform = `rotate(${(360 / n) * i}deg)`; anillo.appendChild(s); });
  el.prepend(anillo);
  if (QUIETO || !anillo.animate) return;
  const anim = anillo.animate([{ transform: 'rotate(0turn)' }, { transform: 'rotate(1turn)' }], { duration: vuelta * 1000, iterations: Infinity });
  if (FINO) {
    el.addEventListener('pointerenter', () => anim.updatePlaybackRate(4));
    el.addEventListener('pointerleave', () => anim.updatePlaybackRate(1));
  }
  mirar(el, v => { v ? anim.play() : anim.pause(); });
}

/* ── CurvedLoop: una cinta de texto sobre una curva; se arrastra ──────────── */
function curva(el, texto, { vel = 1.1, arco = 120 } = {}) {
  el.classList.add('b-curva'); el.setAttribute('aria-hidden', 'true');
  const id = 'b-curva-' + Math.random().toString(36).slice(2, 8);
  const txt = texto.toUpperCase().replace(/ /g, ' ');
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', `0 0 1440 ${arco + 110}`);
  const med = document.createElementNS(NS, 'text'); med.setAttribute('class', 'b-curva-txt'); med.setAttribute('x', '0'); med.setAttribute('y', '-200'); med.textContent = txt;
  const path = document.createElementNS(NS, 'path'); path.setAttribute('id', id); path.setAttribute('d', `M-100,60 Q720,${60 + arco} 1540,60`); path.setAttribute('fill', 'none');
  const t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'b-curva-txt');
  const tp = document.createElementNS(NS, 'textPath'); tp.setAttribute('href', '#' + id); t.appendChild(tp);
  const defs = document.createElementNS(NS, 'defs'); defs.appendChild(path);
  svg.append(med, defs, t); el.appendChild(svg);
  let paso = 0, off = 0, dir = -1, raf = 0, visible = false, arr = null;
  const armar = () => {
    paso = med.getComputedTextLength(); if (!paso) return;
    const veces = Math.ceil(path.getTotalLength() / paso) + 2;
    tp.textContent = Array(veces).fill(txt).join('');
    off = -paso; tp.setAttribute('startOffset', off + 'px');
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(armar);
  const envolver = () => { if (off <= -paso) off += paso; if (off > 0) off -= paso; };
  function cuadro() {
    raf = 0; if (!visible || !paso) return;
    if (!arr) { off += vel * dir; envolver(); tp.setAttribute('startOffset', off.toFixed(1) + 'px'); }
    raf = requestAnimationFrame(cuadro);
  }
  mirar(el, v => { visible = v; if (v && !raf && !QUIETO) raf = requestAnimationFrame(cuadro); });
  el.addEventListener('pointerdown', e => { arr = { x: e.clientX }; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove', e => {
    if (!arr || !paso) return;
    const esc = 1440 / el.getBoundingClientRect().width, dx = (e.clientX - arr.x) * esc;
    arr.x = e.clientX; off += dx; envolver(); tp.setAttribute('startOffset', off.toFixed(1) + 'px');
    if (dx) dir = dx > 0 ? 1 : -1;
  });
  const soltar = () => { arr = null; };
  el.addEventListener('pointerup', soltar); el.addEventListener('pointercancel', soltar);
}

/* ── TextPressure: cada letra se ensancha y engorda cerca del puntero ─────── */
function presion(el, { radio = 0.42, suavidad = 0.45, minW = 62, maxW = 125, minP = 220, maxP = 900, incl = 10 } = {}) {
  const texto = el.textContent.trim();
  el.textContent = ''; el.appendChild(sr(texto));
  const spans = [...texto].map(ch => {
    const s = document.createElement('span'); s.textContent = ch; s.setAttribute('aria-hidden', 'true');
    s.style.display = 'inline-block'; el.appendChild(s); return s;
  });
  /* El tamaño sale del ancho: la palabra ocupa siempre el ancho entero.
     Archivo no baja de 62 de ancho, así que la cuenta no es la de React Bits. */
  const ajustar = () => { const w = el.getBoundingClientRect().width; el.style.fontSize = Math.max(28, w / (spans.length * 0.86)) + 'px'; despertar(); };
  new ResizeObserver(ajustar).observe(el);
  const cur = { x: 0, y: 0, visto: false }, m = { x: 0, y: 0 };
  let raf = 0, ultimo = 0, reloj = 0, enganche = 0, visible = true;
  const ondas = [];
  addEventListener('pointermove', e => { cur.x = e.clientX; cur.y = e.clientY; cur.visto = e.pointerType !== 'touch'; despertar(); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { cur.visto = false; despertar(); });
  el.addEventListener('pointerdown', e => { ondas.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (ondas.length > 6) ondas.shift(); despertar(); });
  mirar(el, v => { visible = v; despertar(); });
  function cuadro(ah) {
    raf = 0;
    const dt = ultimo ? Math.min(ah - ultimo, 64) : 16; ultimo = ah;
    const k = 1 - Math.exp(-dt / (1000 * suavidad * suavidad));
    m.x += (cur.x - m.x) * k; m.y += (cur.y - m.y) * k;
    const r = el.getBoundingClientRect();
    const dentro = cur.visto && cur.y > r.top - r.height * 0.6 && cur.y < r.bottom + r.height * 0.6;
    enganche += ((dentro ? 1 : 0) - enganche) * (1 - Math.exp(-dt / 320));
    if (!QUIETO) reloj += dt / 1000;
    const maxD = Math.max(r.width * radio, 1);
    while (ondas.length && ah - ondas[0].t > 1300) ondas.shift();
    spans.forEach(s => {
      const b = s.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      let p = clamp(1 - Math.hypot(m.x - cx, m.y - cy) / maxD);
      const pos = (cx - r.left) / Math.max(r.width, 1);
      const cresta = 0.5 + 0.5 * Math.cos(Math.PI * 2 * (pos / 0.9 - reloj / 3.2));
      const reposo = QUIETO ? 0.25 : cresta * cresta * 0.85;
      p = reposo + (p - reposo) * enganche;
      for (const o of ondas) {
        const edad = (ah - o.t) / 1000, banda = Math.max(r.width * 0.14, 32);
        const d = (Math.hypot(o.x - cx, o.y - cy) - edad * r.width * 1.25) / banda;
        if (d > -1 && d < 1) { const sw = (1 - d * d) ** 2 * (1 - edad / 1.3) ** 2; p = 1 - (1 - p) * (1 - sw); }
      }
      s.style.fontVariationSettings = `'wdth' ${Math.round(minW + (maxW - minW) * p)}, 'wght' ${Math.round(minP + (maxP - minP) * p)}`;
      s.style.transform = `skewX(${(-incl * p).toFixed(2)}deg)`;
    });
    if (!QUIETO && visible) raf = requestAnimationFrame(cuadro); else ultimo = 0;
  }
  function despertar() { if (!raf && visible) raf = requestAnimationFrame(cuadro); }
  ajustar();
}

/* ── ShinyText: un brillo que cruza el texto ──────────────────────────────── */
function brilloTexto(el) { el.classList.add('b-brillo'); }

/* ── ScrollVelocity: la cinta corre más rápido (y al revés) según el scroll ─ */
function velocidad(el, { base = 60, factor = 0.9 } = {}) {
  const filas = [...el.querySelectorAll('[data-fila]')];
  const estado = filas.map(f => {
    const pista = f.querySelector('.pista');
    pista.innerHTML = pista.innerHTML.repeat(4);
    return { pista, x: 0, sentido: +f.dataset.fila || 1, ancho: 0 };
  });
  const medir = () => estado.forEach(s => { s.ancho = s.pista.scrollWidth / 4; });
  new ResizeObserver(medir).observe(el); medir();
  el.classList.add('b-vel');
  if (QUIETO) return;
  let visible = false, ultimo = 0, yPrev = scrollY, vel = 0, raf = 0;
  mirar(el, v => { visible = v; if (v && !raf) { ultimo = 0; raf = requestAnimationFrame(cuadro); } });
  function cuadro(ah) {
    raf = 0; if (!visible) return;
    const dt = ultimo ? Math.min((ah - ultimo) / 1000, 0.05) : 1 / 60; ultimo = ah;
    const dy = scrollY - yPrev; yPrev = scrollY;
    vel += ((dy / Math.max(dt, 0.001)) - vel) * 0.12;
    const dir = vel < -5 ? -1 : 1;
    for (const s of estado) {
      const v = (base + Math.abs(vel) * factor) * s.sentido * dir;
      s.x = (s.x - v * dt) % s.ancho; if (s.x > 0) s.x -= s.ancho;
      s.pista.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0) skewX(${clamp(-vel * 0.004, -12, 12).toFixed(2)}deg)`;
    }
    raf = requestAnimationFrame(cuadro);
  }
}

/* ── ClickSpark: chispas donde tocás (lima sobre oscuro, azul sobre claro) ── */
function chispas({ n = 8, radio = 24, largo = 12, dur = 420 } = {}) {
  if (QUIETO) return;
  const cv = document.createElement('canvas'); cv.className = 'b-chispas'; cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d'); let dpr = 1, lista = [], raf = 0;
  const medir = () => { dpr = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; };
  medir(); addEventListener('resize', medir);
  addEventListener('pointerdown', e => {
    const oscuro = !!(e.target.closest && e.target.closest('.oscura,.nav,.pie,.rubros'));
    const color = oscuro ? '#c9f73c' : '#2b3cff', t = performance.now();
    for (let i = 0; i < n; i++) lista.push({ x: e.clientX, y: e.clientY, a: (2 * Math.PI * i) / n, t, color });
    if (!raf) raf = requestAnimationFrame(cuadro);
  }, { passive: true });
  function cuadro(ah) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    lista = lista.filter(s => {
      const p = (ah - s.t) / dur; if (p >= 1) return false;
      const e = p * (2 - p), d = e * radio, l = largo * (1 - e), c = Math.cos(s.a), si = Math.sin(s.a);
      ctx.strokeStyle = s.color; ctx.beginPath();
      ctx.moveTo(s.x + d * c, s.y + d * si); ctx.lineTo(s.x + (d + l) * c, s.y + (d + l) * si); ctx.stroke();
      return true;
    });
    raf = lista.length ? requestAnimationFrame(cuadro) : 0;
  }
}

/* ── Magnet: el botón se deja tirar por el puntero ────────────────────────── */
function iman(el, { fuerza = 4, borde = 46 } = {}) {
  if (QUIETO || !FINO || el.dataset.iman) return;
  el.dataset.iman = '1';
  let raf = 0, tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(); if (!r.width) return;
    const cx = r.left + r.width / 2 - x, cy = r.top + r.height / 2 - y;
    const dentro = Math.abs(e.clientX - cx) < r.width / 2 + borde && Math.abs(e.clientY - cy) < r.height / 2 + borde;
    const ntx = dentro ? (e.clientX - cx) / fuerza : 0, nty = dentro ? (e.clientY - cy) / fuerza : 0;
    if (ntx !== tx || nty !== ty) { tx = ntx; ty = nty; if (!raf) raf = requestAnimationFrame(paso); }
  }, { passive: true });
  function paso() {
    x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.08 ? requestAnimationFrame(paso) : 0;
  }
}

/* ── StarBorder: dos estrellas recorren el borde ──────────────────────────── */
function estrella(el, { vel = 6, fuera = false } = {}) {
  if (el.querySelector(':scope > .b-estrella')) return;
  const s = document.createElement('span'); s.className = 'b-estrella' + (fuera ? ' b-fuera' : ''); s.setAttribute('aria-hidden', 'true');
  s.style.setProperty('--b-vel', vel + 's'); s.innerHTML = '<i class="ab"></i><i class="ar"></i>';
  el.classList.add('b-con-estrella'); el.appendChild(s);
}
function sinEstrella(el) { el.classList.remove('b-con-estrella'); el.querySelectorAll(':scope > .b-estrella').forEach(n => n.remove()); }

/* ── GlareHover: un reflejo cruza la tarjeta al pasar ─────────────────────── */
function reflejo(el) {
  if (!FINO || el.querySelector(':scope > .b-reflejo')) return;
  const g = document.createElement('span'); g.className = 'b-reflejo'; g.setAttribute('aria-hidden', 'true');
  el.classList.add('b-con-reflejo'); el.appendChild(g);
}

/* ── LogoLoop: una fila de nombres que corre sola; al pasar, frena ────────── */
function bucle(el, { vel = 46 } = {}) {
  const pista = el.querySelector('.b-bucle-pista'); if (!pista) return;
  const orig = [...pista.children];
  let ancho = 0;
  const llenar = () => {
    pista.querySelectorAll('[data-copia]').forEach(n => n.remove());
    ancho = pista.scrollWidth;
    const veces = Math.max(1, Math.ceil((el.clientWidth * 2) / Math.max(ancho, 1)));
    for (let v = 0; v < veces; v++) orig.forEach(n => {
      const c = n.cloneNode(true); c.dataset.copia = '1'; c.setAttribute('aria-hidden', 'true');
      c.querySelectorAll('a').forEach(a => a.tabIndex = -1); pista.appendChild(c);
    });
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(llenar);
  addEventListener('resize', () => { clearTimeout(llenar.t); llenar.t = setTimeout(llenar, 200); });
  el.classList.add('b-bucle');
  if (QUIETO) return;
  let x = 0, v = vel, obj = vel, raf = 0, ultimo = 0, visible = false;
  if (FINO) { el.addEventListener('pointerenter', () => { obj = 0; }); el.addEventListener('pointerleave', () => { obj = vel; }); }
  el.addEventListener('focusin', () => { obj = 0; }); el.addEventListener('focusout', () => { obj = vel; });
  mirar(el, s => { visible = s; if (s && !raf) { ultimo = 0; raf = requestAnimationFrame(cuadro); } });
  function cuadro(ah) {
    raf = 0; if (!visible) return;
    const dt = ultimo ? Math.min((ah - ultimo) / 1000, 0.05) : 1 / 60; ultimo = ah;
    v += (obj - v) * (1 - Math.exp(-dt / 0.25));
    if (ancho) { x -= v * dt; if (x <= -ancho) x += ancho; pista.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`; }
    raf = requestAnimationFrame(cuadro);
  }
}

/* ── GooeyNav: la pastilla salta al elegido con una nube de gotas ─────────── */
function goo(raiz, { alElegir, gotas = 14, distancias = [90, 10], giro = 100, dur = 600, variacion = 300 } = {}) {
  const lista = raiz.querySelector('[role="tablist"]');
  const botones = [...lista.querySelectorAll('[role="tab"]')];
  const filtro = document.createElement('span'); filtro.className = 'b-goo-ef b-goo-filtro'; filtro.setAttribute('aria-hidden', 'true');
  const texto = document.createElement('span'); texto.className = 'b-goo-ef b-goo-texto'; texto.setAttribute('aria-hidden', 'true');
  raiz.classList.add('b-goo'); raiz.append(filtro, texto);
  let activo = Math.max(0, botones.findIndex(b => b.getAttribute('aria-selected') === 'true'));
  const ruido = (n = 1) => n / 2 - Math.random() * n;
  const xy = (d, i, total) => { const a = ((360 + ruido(8)) / total) * i * (Math.PI / 180); return [d * Math.cos(a), d * Math.sin(a)]; };
  const ubicar = b => {
    const c = raiz.getBoundingClientRect(), r = b.getBoundingClientRect();
    [filtro, texto].forEach(e => { e.style.left = (r.left - c.left) + 'px'; e.style.top = (r.top - c.top) + 'px'; e.style.width = r.width + 'px'; e.style.height = r.height + 'px'; });
    texto.textContent = b.textContent;
  };
  const nube = () => {
    filtro.querySelectorAll('.b-goo-gota').forEach(g => g.remove());
    if (QUIETO) return;
    const tiempo = dur * 2 + variacion;
    filtro.style.setProperty('--time', tiempo + 'ms');
    for (let i = 0; i < gotas; i++) {
      const t = dur * 2 + ruido(variacion * 2), rot = ruido(giro / 10);
      const ini = xy(distancias[0], gotas - i, gotas), fin = xy(distancias[1] + ruido(7), gotas - i, gotas);
      const g = document.createElement('span'); g.className = 'b-goo-gota';
      g.style.cssText = `--start-x:${ini[0]}px;--start-y:${ini[1]}px;--end-x:${fin[0]}px;--end-y:${fin[1]}px;--time:${t}ms;--scale:${1 + ruido(0.2)};--rotate:${rot > 0 ? (rot + giro / 20) * 10 : (rot - giro / 20) * 10}deg`;
      g.innerHTML = '<i></i>';
      setTimeout(() => { filtro.appendChild(g); setTimeout(() => g.remove(), t); }, 30);
    }
  };
  function elegir(i, { foco = false, avisar = true } = {}) {
    activo = i;
    botones.forEach((b, k) => { const s = k === i; b.setAttribute('aria-selected', s ? 'true' : 'false'); b.tabIndex = s ? 0 : -1; b.classList.toggle('b-activo', s); });
    if (foco) botones[i].focus();
    ubicar(botones[i]);
    filtro.classList.remove('b-activo'); texto.classList.remove('b-activo');
    void filtro.offsetWidth;
    filtro.classList.add('b-activo'); texto.classList.add('b-activo');
    nube();
    if (avisar && alElegir) alElegir(i);
  }
  botones.forEach((b, i) => {
    b.addEventListener('click', () => { if (i !== activo) elegir(i); });
    b.addEventListener('keydown', e => {
      const n = botones.length;
      const mapa = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in mapa) { e.preventDefault(); elegir((activo + mapa[e.key] + n) % n, { foco: true }); }
      else if (e.key === 'Home') { e.preventDefault(); elegir(0, { foco: true }); }
      else if (e.key === 'End') { e.preventDefault(); elegir(n - 1, { foco: true }); }
    });
  });
  new ResizeObserver(() => ubicar(botones[activo])).observe(raiz);
  if (document.fonts) document.fonts.ready.then(() => ubicar(botones[activo]));
  ubicar(botones[activo]); filtro.classList.add('b-activo'); texto.classList.add('b-activo');
  botones.forEach((b, k) => { b.tabIndex = k === activo ? 0 : -1; b.classList.toggle('b-activo', k === activo); });
  return { elegir: (i, o) => elegir(i, o), activo: () => activo };
}

/* ── MagicBento: luz que sigue al puntero, borde que brilla, inclinación,
      estrellas adentro de la tarjeta y una onda al tocar ─────────────────── */
function bento(grilla, { radio = 280, estrellas = 14, inclinar = true } = {}) {
  const TILT = 5;
  grilla.classList.add('b-bento'); grilla.style.setProperty('--mb-r', radio + 'px');
  let cards = [], estados = [], rects = [], bounds = null, sucio = true, raf = 0, ultimo = 0, visible = false;
  const ptr = { x: -1e4, y: -1e4, dentro: false };
  const luz = { x: 0, y: 0, near: 0, listo: false };
  const ola = { x: 0, y: 0, t: -1, dur: 0.95, alcance: 0 };
  const w = (c, s, k, v) => { if (s[k] !== v) { s[k] = v; c.style.setProperty(k, v); } };
  function refrescar() {
    cards = [...grilla.querySelectorAll('.b-card')];
    estados = cards.map(c => ({ hot: 0, rx: 0, ry: 0, vrx: 0, vry: 0, est: 0, parts: null, cv: c.querySelector('canvas.b-est') }));
    sucio = true; despertar();
  }
  function medir() {
    bounds = grilla.getBoundingClientRect();
    rects = cards.map(c => c.getBoundingClientRect());
    const d = Math.min(devicePixelRatio || 1, 2);
    estados.forEach((s, i) => {
      if (!s.cv) return;
      const W = Math.round(rects[i].width * d), H = Math.round(rects[i].height * d);
      if (s.cv.width !== W || s.cv.height !== H) { s.cv.width = W; s.cv.height = H; s.parts = null; }
    });
    sucio = false;
  }
  const sembrar = (s, r) => {
    if (s.parts) return s.parts;
    s.parts = Array.from({ length: estrellas }, () => ({ x: Math.random() * r.width, y: Math.random() * r.height, vx: (Math.random() - 0.5) * 6, vy: -4 - Math.random() * 10, t: 0.6 + Math.random() * 1.1, f: Math.random() * 6.28, v: 1.2 + Math.random() * 2.4 }));
    return s.parts;
  };
  function dibujarEstrellas(s, r, lx, ly, dt, ah) {
    const ctx = s.cv.getContext('2d'), k = s.cv.width / Math.max(1, r.width);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, s.cv.width, s.cv.height);
    if (s.est < 0.004) return;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const alcance = radio * 0.75;
    for (const p of sembrar(s, r)) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y < -4) { p.y = r.height + 4; p.x = Math.random() * r.width; }
      if (p.x < -4) p.x = r.width + 4; if (p.x > r.width + 4) p.x = -4;
      const d = Math.hypot(p.x - lx, p.y - ly) / alcance; if (d >= 1) continue;
      const a = s.est * (1 - d * d * (3 - 2 * d)) * (0.55 + 0.45 * Math.sin(ah * 0.001 * p.v + p.f));
      if (a < 0.01) continue;
      ctx.fillStyle = `rgba(${LIMA[0]},${LIMA[1]},${LIMA[2]},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.t, 0, 6.2832); ctx.fill();
    }
  }
  function cuadro(ah) {
    raf = 0;
    const dt = ultimo ? Math.min(0.05, (ah - ultimo) / 1000) : 1 / 60; ultimo = ah;
    if (sucio) medir();
    let ocupado = false;
    const m = radio * 0.5;
    const near = ptr.dentro && bounds && ptr.x > bounds.left - m && ptr.x < bounds.right + m && ptr.y > bounds.top - m && ptr.y < bounds.bottom + m ? 1 : 0;
    if (!luz.listo && near) { luz.x = ptr.x; luz.y = ptr.y; luz.listo = true; }
    const seg = 1 - Math.exp(-dt / 0.05);
    luz.x += (ptr.x - luz.x) * seg; luz.y += (ptr.y - luz.y) * seg;
    luz.near += (near - luz.near) * (1 - Math.exp(-dt / (near > luz.near ? 0.12 : 0.4)));
    if (Math.abs(near - luz.near) < 0.002) luz.near = near; else ocupado = true;
    if (near && Math.abs(ptr.x - luz.x) + Math.abs(ptr.y - luz.y) > 0.3) ocupado = true;
    let wr = 0, wa = 0;
    if (ola.t >= 0) {
      ola.t += dt; const p = Math.min(1, ola.t / ola.dur);
      wr = ola.alcance * (1 - Math.pow(1 - p, 2.2)); wa = Math.pow(1 - p, 1.3);
      if (p >= 1) { ola.t = -1; wa = 0; } else ocupado = true;
    }
    const pasos = Math.max(1, Math.ceil(dt / (1 / 240))), h = dt / pasos;
    cards.forEach((c, i) => {
      const r = rects[i], s = estados[i]; if (!r) return;
      const lx = luz.x - r.left, ly = luz.y - r.top, px = ptr.x - r.left, py = ptr.y - r.top;
      const dentro = ptr.dentro && px >= 0 && py >= 0 && px <= r.width && py <= r.height;
      const hotT = dentro ? 1 : 0;
      s.hot += (hotT - s.hot) * (1 - Math.exp(-dt / (hotT > s.hot ? 0.14 : 0.32)));
      if (Math.abs(hotT - s.hot) < 0.002) s.hot = hotT; else ocupado = true;
      const u = clamp(px / Math.max(1, r.width)) - 0.5, v = clamp(py / Math.max(1, r.height)) - 0.5;
      const tilt = dentro && inclinar && !QUIETO;
      const obj = [tilt ? -v * 2 * TILT : 0, tilt ? u * 2 * TILT : 0];
      [['rx', 'vrx'], ['ry', 'vry']].forEach(([k, vk], j) => {
        for (let n = 0; n < pasos; n++) { s[vk] += (170 * (obj[j] - s[k]) - 20 * s[vk]) * h; s[k] += s[vk] * h; }
        if (Math.abs(obj[j] - s[k]) < 0.002 && Math.abs(s[vk]) < 0.01) { s[k] = obj[j]; s[vk] = 0; } else ocupado = true;
      });
      w(c, s, '--mb-x', lx.toFixed(1) + 'px'); w(c, s, '--mb-y', ly.toFixed(1) + 'px');
      w(c, s, '--mb-near', luz.near.toFixed(3)); w(c, s, '--mb-hot', s.hot.toFixed(3));
      w(c, s, '--mb-rx', s.rx.toFixed(3) + 'deg'); w(c, s, '--mb-ry', s.ry.toFixed(3) + 'deg');
      w(c, s, '--mb-wx', (ola.x - r.left).toFixed(1) + 'px'); w(c, s, '--mb-wy', (ola.y - r.top).toFixed(1) + 'px');
      w(c, s, '--mb-wr', wr.toFixed(1) + 'px'); w(c, s, '--mb-wa', wa.toFixed(3));
      if (s.cv) {
        const et = dentro && !QUIETO ? 1 : 0;
        s.est += (et - s.est) * (1 - Math.exp(-dt / (et ? 0.3 : 0.5)));
        if (s.est < 0.004 && !et) s.est = 0;
        if (s.est > 0 || et) { dibujarEstrellas(s, r, lx, ly, dt, ah); ocupado = true; }
        else if (s.dibujo) dibujarEstrellas(s, r, lx, ly, dt, ah);
        s.dibujo = s.est > 0;
      }
    });
    if (ocupado && visible) raf = requestAnimationFrame(cuadro); else ultimo = 0;
  }
  function despertar() { if (!raf && visible) raf = requestAnimationFrame(cuadro); }
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.dentro = e.pointerType !== 'touch'; despertar(); }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { ptr.dentro = false; despertar(); });
  addEventListener('scroll', () => { sucio = true; if (ptr.dentro) despertar(); }, { passive: true });
  addEventListener('resize', () => { sucio = true; despertar(); });
  grilla.addEventListener('pointerdown', e => {
    if (QUIETO) return;
    if (sucio) medir();
    const b = bounds; ola.x = e.clientX; ola.y = e.clientY; ola.t = 0;
    ola.alcance = Math.max(Math.hypot(e.clientX - b.left, e.clientY - b.top), Math.hypot(e.clientX - b.right, e.clientY - b.top), Math.hypot(e.clientX - b.left, e.clientY - b.bottom), Math.hypot(e.clientX - b.right, e.clientY - b.bottom)) + 140;
    despertar();
  });
  mirar(grilla, v => { visible = v; sucio = true; despertar(); });
  new ResizeObserver(() => { sucio = true; despertar(); }).observe(grilla);
  refrescar();
  return { refrescar };
}

/* ── AnimatedList: una lista viva; cada evento entra arriba y empuja ──────── */
function lista(el, { cada = 2000, max = 5, iniciales: arranque = 3 } = {}) {
  el.classList.add('b-lista');
  const ul = document.createElement('ul'); ul.className = 'b-lista-ul'; el.appendChild(ul);
  let items = [], k = 0, t = 0, visible = false, min = 0;
  const reloj = () => { const h = 12 * 60 + 40 + min; return String(Math.floor(h / 60) % 24).padStart(2, '0') + ':' + String(h % 60).padStart(2, '0'); };
  function crear(txt, animar) {
    const li = document.createElement('li'); li.className = 'b-lista-it' + (animar ? '' : ' b-ya');
    li.innerHTML = '<div class="b-lista-in"><span class="b-lista-pt"></span><span class="b-lista-tx"></span><span class="b-lista-h"></span></div>';
    li.querySelector('.b-lista-tx').textContent = txt;
    li.querySelector('.b-lista-h').textContent = reloj();
    return li;
  }
  function empujar(animar = true) {
    if (!items.length) return;
    min += 2 + (k * 7) % 6;
    const li = crear(items[k % items.length], animar); k++;
    ul.prepend(li);
    if (animar) requestAnimationFrame(() => requestAnimationFrame(() => li.classList.add('b-ya')));
    const sobran = [...ul.children].filter(n => !n.classList.contains('b-sale')).slice(max);
    sobran.forEach(n => { n.classList.add('b-sale'); setTimeout(() => n.remove(), animar ? 500 : 0); });
  }
  const andar = () => { clearInterval(t); if (!QUIETO && visible && !document.hidden && items.length) t = setInterval(() => empujar(true), cada); };
  mirar(el, v => { visible = v; andar(); });
  document.addEventListener('visibilitychange', andar);
  return {
    poner(nuevos) {
      items = nuevos.slice(); k = 0; min = 0; ul.textContent = '';
      const iniciales = Math.min(QUIETO ? max : arranque, items.length);
      for (let i = 0; i < iniciales; i++) empujar(false);
      andar();
    }
  };
}

/* ── SpotlightCard: un foco de luz sigue al puntero adentro de la tarjeta ─── */
function foco(el, { color } = {}) {
  if (!FINO || el.dataset.foco) return;
  el.dataset.foco = '1'; el.classList.add('b-spot');
  if (color) el.style.setProperty('--b-spot-c', color);
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', (e.clientX - r.left).toFixed(0) + 'px');
    el.style.setProperty('--sy', (e.clientY - r.top).toFixed(0) + 'px');
  });
}

/* ── TiltedCard: la tarjeta se inclina hacia el puntero, con su leyenda ──── */
function inclinar(el, { amp = 9, escala = 1.03, leyenda = '', contenedor = el } = {}) {
  if (!FINO || QUIETO || el.dataset.tilt) return;
  el.dataset.tilt = '1'; el.classList.add('b-tilt');
  let tip = null;
  if (leyenda) { tip = document.createElement('span'); tip.className = 'b-tilt-tip'; tip.textContent = leyenda; tip.setAttribute('aria-hidden', 'true'); contenedor.appendChild(tip); }
  const st = { rx: 0, ry: 0, s: 1, orx: 0, ory: 0, os: 1 };
  let raf = 0, ultimo = 0;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    st.orx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -amp;
    st.ory = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * amp;
    st.os = escala;
    if (tip) { const c = contenedor.getBoundingClientRect(); tip.style.translate = `${(e.clientX - c.left).toFixed(0)}px ${(e.clientY - c.top).toFixed(0)}px`; tip.classList.add('b-ver'); }
    if (!raf) raf = requestAnimationFrame(cuadro);
  });
  el.addEventListener('pointerleave', () => { st.orx = 0; st.ory = 0; st.os = 1; if (tip) tip.classList.remove('b-ver'); if (!raf) raf = requestAnimationFrame(cuadro); });
  function cuadro(ah) {
    const dt = ultimo ? Math.min((ah - ultimo) / 1000, 0.05) : 1 / 60; ultimo = ah;
    const k = 1 - Math.exp(-dt / 0.12);
    st.rx += (st.orx - st.rx) * k; st.ry += (st.ory - st.ry) * k; st.s += (st.os - st.s) * k;
    el.style.transform = `perspective(800px) rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg) scale(${st.s.toFixed(4)})`;
    if (Math.abs(st.orx - st.rx) + Math.abs(st.ory - st.ry) + Math.abs(st.os - st.s) > 0.01) raf = requestAnimationFrame(cuadro);
    else { raf = 0; ultimo = 0; }
  }
}

/* ── ChromaGrid: todo en gris; un foco que sigue al puntero devuelve el color ─ */
function croma(grilla, { radio = 300 } = {}) {
  grilla.style.setProperty('--croma-r', radio + 'px');
  grilla.classList.add('b-croma');
  if (!FINO) return { colocar() {} };
  const st = { x: 0, y: 0, tx: 0, ty: 0, pow: 0, obj: 0 }; let raf = 0, ultimo = 0;
  const colocar = () => {
    const b = grilla.getBoundingClientRect();
    grilla.querySelectorAll('[data-croma]').forEach(n => {
      const r = n.getBoundingClientRect();
      n.style.setProperty('--ox', (r.left - b.left) + 'px'); n.style.setProperty('--oy', (r.top - b.top) + 'px');
    });
  };
  new ResizeObserver(colocar).observe(grilla);
  grilla.addEventListener('pointerenter', colocar);
  grilla.addEventListener('pointermove', e => {
    const b = grilla.getBoundingClientRect(); st.tx = e.clientX - b.left; st.ty = e.clientY - b.top;
    if (!st.obj) { st.x = st.tx; st.y = st.ty; } st.obj = 1; mover();
  });
  grilla.addEventListener('pointerleave', () => { st.obj = 0; mover(); });
  function mover() { if (!raf) raf = requestAnimationFrame(cuadro); }
  function cuadro(ah) {
    raf = 0; const dt = ultimo ? Math.min((ah - ultimo) / 1000, 0.05) : 1 / 60; ultimo = ah;
    const k = QUIETO ? 1 : 1 - Math.exp(-dt / 0.14);
    st.x += (st.tx - st.x) * k; st.y += (st.ty - st.y) * k;
    st.pow += (st.obj - st.pow) * (QUIETO ? 1 : 1 - Math.exp(-dt / (st.obj ? 0.08 : 0.22)));
    grilla.style.setProperty('--mx', st.x.toFixed(1) + 'px'); grilla.style.setProperty('--my', st.y.toFixed(1) + 'px');
    grilla.style.setProperty('--pow', st.pow.toFixed(3));
    if (Math.abs(st.tx - st.x) > 0.3 || Math.abs(st.ty - st.y) > 0.3 || Math.abs(st.obj - st.pow) > 0.004) raf = requestAnimationFrame(cuadro);
    else ultimo = 0;
  }
  return { colocar };
}

/* ── FlowingMenu: al pasar, una cinta entra por el borde más cercano ──────── */
function fluir(raiz) {
  raiz.classList.add('b-flow');
  raiz.querySelectorAll('.b-flow-it').forEach(it => {
    const mq = it.querySelector('.b-flow-mq'), dentro = it.querySelector('.b-flow-mq-in');
    if (!mq || !dentro) return;
    const borde = e => { const r = it.getBoundingClientRect(); return (e.clientY - r.top) < r.height / 2 ? 'arriba' : 'abajo'; };
    const fijar = (a, b, anim) => {
      mq.style.transition = dentro.style.transition = anim ? 'transform .6s cubic-bezier(.2,.8,.2,1)' : 'none';
      mq.style.transform = `translateY(${a})`; dentro.style.transform = `translateY(${b})`;
    };
    it.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      const up = borde(e) === 'arriba';
      fijar(up ? '-101%' : '101%', up ? '101%' : '-101%', false);
      void mq.offsetWidth; fijar('0%', '0%', !QUIETO);
      it.classList.add('b-abierto');
    });
    it.addEventListener('pointerleave', e => {
      if (e.pointerType === 'touch') return;
      const up = borde(e) === 'arriba';
      fijar(up ? '-101%' : '101%', up ? '101%' : '-101%', !QUIETO);
      it.classList.remove('b-abierto');
    });
  });
}

/* ── BounceCards: las tarjetas entran con rebote y se abren al pasar ──────── */
function rebotar(el) {
  el.classList.add('b-rebote');
  let cartas = [], base = [];
  const rotaciones = [-7, 5, -3, 8, -5];
  /* el paso entre cartas sale del ancho real; la primera queda arriba (las obras vienen con las «en vivo» primero) */
  function medirPaso() {
    const n = cartas.length; if (n < 2) return 0;
    const cw = cartas[0].offsetWidth || 220;
    return Math.max(28, Math.min(110, (el.clientWidth - cw - 28) / (n - 1)));
  }
  let paso = 0, rt = 0;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (cartas.length) acomodar(); }, 150); });
  function acomodar() {
    const n = cartas.length; paso = medirPaso();
    base = cartas.map((c, i) => ({ x: (i - (n - 1) / 2) * paso, r: n > 1 ? rotaciones[i % 5] : -3 }));
    cartas.forEach((c, i) => { c.style.setProperty('--tx', base[i].x + 'px'); c.style.setProperty('--rot', base[i].r + 'deg'); c.style.zIndex = n - i; });
    return paso;
  }
  function empujar(h) {
    const n = cartas.length;
    cartas.forEach((c, i) => {
      if (h < 0) { c.style.setProperty('--tx', base[i].x + 'px'); c.style.setProperty('--rot', base[i].r + 'deg'); c.style.setProperty('--s', 1); c.style.transitionDelay = '0ms'; c.style.zIndex = n - i; return; }
      c.style.transitionDelay = (Math.abs(i - h) * 30) + 'ms';
      if (i === h) { c.style.setProperty('--rot', '0deg'); c.style.setProperty('--s', 1.06); c.style.zIndex = 50; }
      else { c.style.setProperty('--tx', (base[i].x + (i < h ? -1 : 1) * Math.max(paso, 40) * 1.1) + 'px'); c.style.setProperty('--s', 1); }
    });
  }
  return {
    poner(lista) {
      el.textContent = '';
      cartas = lista.map((o, i) => {
        const a = document.createElement('a'); a.className = 'b-carta'; a.href = o.href; a.target = '_blank'; a.rel = 'noopener';
        a.setAttribute('aria-label', `${o.nombre} (${o.estado === 'vivo' ? 'en vivo' : 'demo'}), se abre en otra pestaña`);
        a.innerHTML = `<img src="${o.img}" alt="" width="960" height="600" loading="lazy" decoding="async"><span class="b-carta-et ${o.estado}">${o.estado === 'vivo' ? 'En vivo' : 'Demo'}</span><span class="b-carta-nom"></span>`;
        a.querySelector('.b-carta-nom').textContent = o.nombre;
        a.style.transitionDelay = (i * 80) + 'ms';
        if (FINO) { a.addEventListener('pointerenter', () => empujar(i)); a.addEventListener('pointerleave', () => empujar(-1)); }
        a.addEventListener('focus', () => empujar(i)); a.addEventListener('blur', () => empujar(-1));
        el.appendChild(a); return a;
      });
      acomodar();
      if (QUIETO) { cartas.forEach(c => c.classList.add('b-ya')); return; }
      requestAnimationFrame(() => requestAnimationFrame(() => cartas.forEach(c => c.classList.add('b-ya'))));
      setTimeout(() => cartas.forEach(c => { c.style.transitionDelay = '0ms'; }), 80 * cartas.length + 700);
    },
    acomodar
  };
}

/* ── DotGrid: una trama de puntos que el puntero empuja y que vuelve sola ─── */
function puntos(cv, { gap = 28, r = 1.6, prox = 140, umbral = 160, choque = 5, radioChoque = 260, resorte = 0.07, amort = 0.86 } = {}) {
  const ctx = cv.getContext('2d');
  let dots = [], W = 0, H = 0, dpr = 1, raf = 0, visible = false, quietos = true;
  const ptr = { x: -1e4, y: -1e4, lx: 0, ly: 0, lt: 0, dentro: false };
  const BASE = 'rgba(244,243,240,.17)';
  function medir() {
    const b = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 1.75);
    W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const cols = Math.floor(W / gap), filas = Math.floor(H / gap);
    const ox = (W - (cols - 1) * gap) / 2, oy = (H - (filas - 1) * gap) / 2;
    dots = [];
    for (let j = 0; j < filas; j++) for (let i = 0; i < cols; i++) dots.push({ x: ox + i * gap, y: oy + j * gap, dx: 0, dy: 0, vx: 0, vy: 0 });
    pintar();
  }
  function pintar() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BASE; ctx.beginPath();
    const cerca = [];
    for (const d of dots) {
      const x = d.x + d.dx, y = d.y + d.dy;
      const dist = ptr.dentro ? Math.hypot(x - ptr.x, y - ptr.y) : 1e9;
      if (dist < prox) { cerca.push([x, y, 1 - dist / prox]); continue; }
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.2832);
    }
    ctx.fill();
    for (const [x, y, t] of cerca) {
      const c = PAPEL.map((v, i) => Math.round(lerp(v, LIMA[i], t)));
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${(0.17 + 0.83 * t).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, r * (1 + t * 0.6), 0, 6.2832); ctx.fill();
    }
  }
  function cuadro() {
    raf = 0; if (!visible) return;
    quietos = true;
    for (const d of dots) {
      d.vx += -d.dx * resorte; d.vy += -d.dy * resorte; d.vx *= amort; d.vy *= amort; d.dx += d.vx; d.dy += d.vy;
      if (Math.abs(d.dx) + Math.abs(d.dy) + Math.abs(d.vx) + Math.abs(d.vy) > 0.05) quietos = false; else { d.dx = d.dy = d.vx = d.vy = 0; }
    }
    pintar();
    if (!quietos) raf = requestAnimationFrame(cuadro);
  }
  const despertar = () => { if (!raf && visible) raf = requestAnimationFrame(cuadro); };
  new ResizeObserver(medir).observe(cv);
  mirar(cv, v => { visible = v; if (v) despertar(); });
  const zona = cv.parentElement;
  zona.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, ah = performance.now();
    const dt = Math.max(ah - ptr.lt, 8) / 1000, vx = (x - ptr.lx) / dt, vy = (y - ptr.ly) / dt, vel = Math.hypot(vx, vy);
    ptr.x = x; ptr.y = y; ptr.lx = x; ptr.ly = y; ptr.lt = ah; ptr.dentro = true;
    if (vel > umbral && !QUIETO) {
      const f = Math.min(vel, 2400) * 0.0016;
      for (const d of dots) {
        const ddx = d.x + d.dx - x, ddy = d.y + d.dy - y, dist = Math.hypot(ddx, ddy);
        if (dist < prox && dist > 0.01) { const k = (1 - dist / prox) * f; d.vx += (ddx / dist) * k + vx * 0.0006 * k; d.vy += (ddy / dist) * k + vy * 0.0006 * k; }
      }
    }
    if (QUIETO) pintar(); else despertar();
  });
  zona.addEventListener('pointerleave', () => { ptr.dentro = false; QUIETO ? pintar() : despertar(); });
  zona.addEventListener('pointerdown', e => {
    if (QUIETO) return;
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    for (const d of dots) {
      const ddx = d.x - x, ddy = d.y - y, dist = Math.hypot(ddx, ddy);
      if (dist < radioChoque && dist > 0.01) { const k = choque * (1 - dist / radioChoque); d.vx += (ddx / dist) * k; d.vy += (ddy / dist) * k; }
    }
    despertar();
  });
  medir();
}

/* ── Threads: hilos que se abren con ruido de Perlin y siguen al puntero ─── */
function hilos(cv, { color = LIMA, amplitud = 1, distancia = 0, lineas = 30 } = {}) {
  const gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
  if (!gl) { cv.remove(); return; }
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float iTime;uniform vec3 iResolution;uniform vec3 uColor;uniform float uAmplitude;uniform float uDistance;uniform vec2 uMouse;
#define PI 3.1415926538
const int LINEAS=${lineas|0};
const float ANCHO=7.0;const float BORRON=10.0;
float Perlin2D(vec2 P){
 vec2 Pi=floor(P);vec4 Pf=P.xyxy-vec4(Pi,Pi+1.0);vec4 Pt=vec4(Pi.xy,Pi.xy+1.0);
 Pt=Pt-floor(Pt*(1.0/71.0))*71.0;Pt+=vec2(26.0,161.0).xyxy;Pt*=Pt;Pt=Pt.xzxz*Pt.yyww;
 vec4 hx=fract(Pt*(1.0/951.135664));vec4 hy=fract(Pt*(1.0/642.949883));
 vec4 gx=hx-0.49999;vec4 gy=hy-0.49999;
 vec4 g=inversesqrt(gx*gx+gy*gy)*(gx*Pf.xzxz+gy*Pf.yyww);g*=1.4142135623730950;
 vec2 b=Pf.xy*Pf.xy*Pf.xy*(Pf.xy*(Pf.xy*6.0-15.0)+10.0);vec4 b2=vec4(b,vec2(1.0-b));
 return dot(g,b2.zxzx*b2.wwyy);}
float px(float c,vec2 r){return (1.0/max(r.x,r.y))*c;}
float linea(vec2 st,float w,float perc,vec2 m,float t,float amp,float dist){
 float sp=0.1+perc*0.4;float an=smoothstep(sp,0.7,st.x);
 float fa=an*0.5*amp*(1.0+(m.y-0.5)*0.2);float ts=t/10.0+(m.x-0.5);
 float bl=smoothstep(sp,sp+0.05,st.x)*perc;
 float xn=mix(Perlin2D(vec2(ts,st.x+perc)*2.5),Perlin2D(vec2(ts,st.x+ts)*3.5)/1.5,st.x*0.3);
 float y=0.5+(perc-0.5)*dist+xn/2.0*fa;
 float a=smoothstep(y+(w/2.0)+(BORRON*px(1.0,iResolution.xy)*bl),y,st.y);
 float b=smoothstep(y,y-(w/2.0)-(BORRON*px(1.0,iResolution.xy)*bl),st.y);
 return clamp((a-b)*(1.0-smoothstep(0.0,1.0,pow(perc,0.3))),0.0,1.0);}
void main(){
 vec2 uv=gl_FragCoord.xy/iResolution.xy;float s=1.0;
 for(int i=0;i<LINEAS;i++){float p=float(i)/float(LINEAS);s*=(1.0-linea(uv,ANCHO*px(1.0,iResolution.xy)*(1.0-p),p,uMouse,iTime,uAmplitude,uDistance));}
 float c=1.0-s;gl_FragColor=vec4(uColor*c,c);}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) { cv.remove(); return; }
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.remove(); return; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['iTime', 'iResolution', 'uColor', 'uAmplitude', 'uDistance', 'uMouse'].forEach(k => { U[k] = gl.getUniformLocation(pr, k); });
  gl.uniform3f(U.uColor, color[0] / 255, color[1] / 255, color[2] / 255);
  gl.uniform1f(U.uAmplitude, amplitud); gl.uniform1f(U.uDistance, distancia);
  gl.clearColor(0, 0, 0, 0);
  let raf = 0, visible = false; const t0 = performance.now(), m = [0.5, 0.5], obj = [0.5, 0.5];
  const medir = () => {
    const b = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1) * (b.width < 700 ? 0.7 : 1);
    cv.width = Math.max(1, Math.round(b.width * d)); cv.height = Math.max(1, Math.round(b.height * d));
    gl.viewport(0, 0, cv.width, cv.height); gl.uniform3f(U.iResolution, cv.width, cv.height, cv.width / cv.height);
  };
  const dibujar = ah => {
    m[0] += (obj[0] - m[0]) * 0.05; m[1] += (obj[1] - m[1]) * 0.05;
    gl.uniform2f(U.uMouse, m[0], m[1]); gl.uniform1f(U.iTime, (ah - t0) / 1000);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const cuadro = ah => { dibujar(ah); raf = visible && !document.hidden ? requestAnimationFrame(cuadro) : 0; };
  const arrancar = () => { if (!QUIETO && visible && !raf) raf = requestAnimationFrame(cuadro); };
  new ResizeObserver(() => { medir(); if (QUIETO || !raf) dibujar(t0 + 9000); }).observe(cv);
  cv.parentElement.addEventListener('pointermove', e => { const b = cv.getBoundingClientRect(); obj[0] = (e.clientX - b.left) / b.width; obj[1] = 1 - (e.clientY - b.top) / b.height; });
  cv.parentElement.addEventListener('pointerleave', () => { obj[0] = 0.5; obj[1] = 0.5; });
  mirar(cv, v => { visible = v; arrancar(); });
  document.addEventListener('visibilitychange', arrancar);
  medir(); dibujar(t0 + 9000);
}

window.BITS = {
  QUIETO, FINO,
  partirLetras, desenfocar, descifrar, rotar, tipear, contar, rodillo, enfocar, revelarScroll, proximidad,
  circular, curva, presion, brilloTexto, velocidad,
  chispas, iman, estrella, sinEstrella, reflejo, bucle,
  goo, bento, lista, foco, inclinar, croma, fluir, rebotar,
  puntos, hilos
};
})();
