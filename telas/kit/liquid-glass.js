/* Liquid Glass oficial (skill/liquid-glass.md); window.LG() reaplica as lentes */
(function () {
  var D = document, H = D.documentElement;
  /* ---------- Liquid Glass: refração na borda, miolo só desfocado ----------
     Cada card ganha um mapa de deslocamento do tamanho exato dele. Numa faixa fina junto
     à borda o vidro "puxa" o fundo de dentro pra fora, de um jeito que o conteúdo aparece
     espelhado (como a borda grossa de uma lupa). No miolo o deslocamento é zero: o fundo
     fica do mesmo tamanho, só desfocado. Chrome/Edge/Android aceitam isso; Safari ainda não. */
  var canRefract = CSS.supports('backdrop-filter', 'url(#a)');
  if (canRefract) {
    var NS = 'http://www.w3.org/2000/svg', defs = D.createElementNS(NS, 'svg'), cache = {}, uid = 0;
    defs.setAttribute('width', '0'); defs.setAttribute('height', '0'); defs.setAttribute('aria-hidden', 'true');
    defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    D.body.appendChild(defs);
    var MAX = 2.2; // quanto a borda "puxa" o fundo, em múltiplos da largura da borda
    var makeMap = function (w, h, r, bez) {
      var c = D.createElement('canvas'); c.width = w; c.height = h;
      var x = c.getContext('2d'), im = x.createImageData(w, h), d = im.data, c2 = D.createElement('canvas'), x2, im2, d2, hw = w / 2, hh = h / 2, off = MAX * bez;
      c2.width = w; c2.height = h; x2 = c2.getContext('2d'); im2 = x2.createImageData(w, h); d2 = im2.data;
      for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
        var px = i + .5 - hw, py = j + .5 - hh, ax = Math.abs(px), ay = Math.abs(py);
        var qx = ax - (hw - r), qy = ay - (hh - r);
        var ox = Math.max(qx, 0), oy = Math.max(qy, 0), ol = Math.hypot(ox, oy);
        var dist = r - (ol + Math.min(Math.max(qx, qy), 0));      // distância da borda pra dentro
        var k = (j * w + i) * 4, vx = 0, vy = 0, a = 0;
        if (dist > 0 && dist < bez) {
          var nx, ny;                                              // normal apontando pra dentro
          if (ol > 0) { nx = -ox / ol; ny = -oy / ol; } else if (qx > qy) { nx = -1; ny = 0; } else { nx = 0; ny = -1; }
          nx *= px < 0 ? -1 : 1; ny *= py < 0 ? -1 : 1;
          var t = 1 - dist / bez, m = t * t;                       // forte na quina, some no miolo
          vx = nx * m; vy = ny * m; a = Math.min(1, t * 1.6);
        }
        d[k] = 128 + vx * 127; d[k + 1] = 128 + vy * 127; d[k + 2] = 128; d[k + 3] = 255;
        d2[k] = d2[k + 1] = d2[k + 2] = 255; d2[k + 3] = a * 255;
      }
      x.putImageData(im, 0, 0); x2.putImageData(im2, 0, 0);
      return { url: c.toDataURL(), mask: c2.toDataURL(), scale: 2 * off };
    };
    var apply = function (el) {
      var b = el.getBoundingClientRect(), w = Math.round(b.width), h = Math.round(b.height);
      if (w < 8 || h < 8) return;
      var r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      var bez = Math.max(6, Math.min(22, Math.min(w, h) * 0.22));
      var key = w + 'x' + h + 'r' + Math.round(r);
      if (!cache[key]) {
        var m = makeMap(w, h, r, bez), id = 'lg' + (uid++);
        var f = D.createElementNS(NS, 'filter');
        f.setAttribute('id', id); f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('primitiveUnits', 'userSpaceOnUse');
        f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', w); f.setAttribute('height', h);
        f.setAttribute('color-interpolation-filters', 'sRGB');
        f.innerHTML = '<feImage href="' + m.url + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="map"/>' +
          '<feImage href="' + m.mask + '" x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none" result="rim"/>' +
          '<feGaussianBlur in="SourceGraphic" stdDeviation="' + (h < 90 ? 6 : 3.5) + '" edgeMode="duplicate" result="soft"/>' +
          '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + m.scale.toFixed(1) + '" xChannelSelector="R" yChannelSelector="G" result="lens"/>' +
          '<feGaussianBlur in="lens" stdDeviation="0.6" result="lens2"/>' +
          '<feComposite in="lens2" in2="rim" operator="in" result="edge"/>' +
          '<feMerge><feMergeNode in="soft"/><feMergeNode in="edge"/></feMerge>';
        defs.appendChild(f); cache[key] = id;
      }
      var v = 'url(#' + cache[key] + ') saturate(180%) brightness(1.06)';
      el.style.backdropFilter = v; el.style.webkitBackdropFilter = v;
    };
    var all = function () { D.querySelectorAll('.glass').forEach(function (el) { if (el.offsetParent !== null || el.closest('.modal')) apply(el); }); };
    H.classList.add('lg-refract');
    window.LG = all; all();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(all, 200); });
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(function (es) { es.forEach(function (e) { apply(e.target); }); }); D.querySelectorAll('.glass').forEach(function (el) { ro.observe(el); }); }
    D.querySelectorAll('details').forEach(function (d) { d.addEventListener('toggle', all); });
  }
})();
