/* Escena de 0800 Content: «Una foto entra. Una campaña sale.»
   El scroll recorre la transformación cuadro a cuadro y después arma las piezas.
   Sin JS o con movimiento reducido queda la composición final, quieta y completa. */
(function () {
  'use strict';
  var esc = document.getElementById('escena');
  if (!esc || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var pin = esc.querySelector('.esc-pin');
  var grilla = esc.querySelector('.esc-grilla');
  var hueco = esc.querySelector('.esc-t.sq');
  var lienzo = esc.querySelector('.esc-lienzo');
  var cv = lienzo.querySelector('canvas');
  var ctx = cv.getContext('2d');
  var fase = esc.querySelector('.esc-fase');
  var tit2 = esc.querySelector('.esc-tit .b');
  var piezas = [].slice.call(esc.querySelectorAll('.esc-t:not(.sq)'));
  var capSq = hueco.querySelector('figcaption');
  var videos = [].slice.call(esc.querySelectorAll('video'));

  var FASES = [
    [0, 'IMG_4213.jpg · La foto de todos los días'],
    [0.14, 'Se ilumina, se limpia y se revisa contra el producto'],
    [0.58, fase.textContent]
  ];

  var movil = matchMedia('(max-width:720px)').matches;
  var carpeta = 'img/muestra/' + (movil ? 'fm/' : 'f/');
  var N = +esc.getAttribute(movil ? 'data-nm' : 'data-n');
  var cuadros = new Array(N);
  var dibujado = -1;

  esc.classList.add('esc-viva');

  var num = function (i) { return ('00' + (i + 1)).slice(-3) + '.webp'; };
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var suave = function (t) { return t * t * (3 - 2 * t); };

  function cargar(i) {
    if (cuadros[i]) return;
    var im = new Image();
    im.decoding = 'async';
    cuadros[i] = { im: im, ok: false };
    im.onload = function () {
      cuadros[i].ok = true;
      if (dibujado < 0 || Math.abs(i - objetivo) < Math.abs(dibujado - objetivo)) pintar();
    };
    im.src = carpeta + num(i);
  }
  /* de grueso a fino: la transformación se puede recorrer antes de que baje todo */
  function cargarTodo() { [8, 4, 2, 1].forEach(function (p) { for (var i = 0; i < N; i += p) cargar(i); }); cargar(N - 1); }

  var objetivo = 0;
  function pintar() {
    var mejor = -1, dist = 1e9;
    for (var i = 0; i < N; i++) {
      if (cuadros[i] && cuadros[i].ok) {
        var d = Math.abs(i - objetivo);
        if (d < dist) { dist = d; mejor = i; }
      }
    }
    if (mejor < 0 || mejor === dibujado) return;
    var im = cuadros[mejor].im;
    if (cv.width !== im.naturalWidth) { cv.width = im.naturalWidth; cv.height = im.naturalHeight; }
    ctx.drawImage(im, 0, 0);
    dibujado = mejor;
  }

  var ini = null, fin = null;
  function medir() {
    var p = pin.getBoundingClientRect();
    var g = grilla.getBoundingClientRect();
    var h = hueco.getBoundingClientRect();
    var lado = Math.min(g.height, g.width);
    ini = { x: g.left - p.left + (g.width - lado) / 2, y: g.top - p.top + (g.height - lado) / 2, l: lado };
    fin = { x: h.left - p.left, y: h.top - p.top, l: h.width };
    lienzo.style.width = lienzo.style.height = ini.l + 'px';
    aplicar(actual);
  }

  var faseI = -1;
  var sonando = false;
  function aplicar(p) {
    objetivo = Math.round(clamp((p - 0.1) / 0.46) * (N - 1));
    pintar();

    var m = suave(clamp((p - 0.58) / 0.2));
    var l = ini.l + (fin.l - ini.l) * m;
    var x = ini.x + (fin.x - ini.x) * m;
    var y = ini.y + (fin.y - ini.y) * m;
    lienzo.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + (l / ini.l).toFixed(4) + ')';

    piezas.forEach(function (t, i) {
      var q = suave(clamp((p - 0.62 - i * 0.045) / 0.14));
      t.style.opacity = q.toFixed(3);
      t.style.transform = 'translate3d(0,' + ((1 - q) * 28).toFixed(1) + 'px,0)';
    });
    capSq.style.opacity = clamp((p - 0.74) / 0.08).toFixed(3);
    tit2.style.opacity = (0.22 + 0.78 * suave(clamp((p - 0.5) / 0.14))).toFixed(3);

    var f = 0;
    FASES.forEach(function (x, i) { if (p >= x[0]) f = i; });
    if (f !== faseI) { fase.textContent = FASES[f][1]; faseI = f; }

    var suenan = p > 0.6 && visible;
    if (suenan !== sonando) {
      sonando = suenan;
      videos.forEach(function (v) {
        if (suenan) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          var pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else {
          v.pause();
        }
      });
    }
  }

  var actual = 0, meta = 0, raf = 0, visible = false;
  function leer() {
    var r = esc.getBoundingClientRect();
    var tramo = esc.offsetHeight - pin.offsetHeight;
    meta = tramo > 0 ? clamp(-r.top / tramo) : 0;
    /* en teléfonos bajos el botón flotante taparía la nota de «generado con IA» */
    marcarAdentro(r.top < innerHeight / 2 && r.bottom > innerHeight / 2);
  }
  var adentro = false;
  function marcarAdentro(si) {
    if (si === adentro) return;
    adentro = si;
    document.body.classList.toggle('en-escena', si);
  }
  function cuadro() {
    raf = 0;
    leer();
    actual += (meta - actual) * 0.2;
    if (Math.abs(meta - actual) < 0.0006) actual = meta;
    aplicar(actual);
    if (actual !== meta) raf = requestAnimationFrame(cuadro);
  }
  function pedir() { if (!raf && visible) raf = requestAnimationFrame(cuadro); }

  addEventListener('scroll', pedir, { passive: true });
  var espera = 0;
  addEventListener('resize', function () { clearTimeout(espera); espera = setTimeout(function () { medir(); pedir(); }, 120); });

  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting;
    if (visible) { cargarTodo(); pedir(); } else { marcarAdentro(false); aplicar(actual); }
  }, { rootMargin: '120% 0px' }).observe(esc);

  medir();
  leer();
  actual = meta;
  aplicar(actual);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir);
})();
