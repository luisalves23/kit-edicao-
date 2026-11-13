# Liquid Glass do @cobaia.dev (aprovado pelo criador em 09/11/2026)

Referência aprovada: a barra do topo do site cobaia-dev.vercel.app ("@cobaia.dev ... 30 dias").
Use em todo cartão, modal, bolha, campo e caixa que abre, nos vídeos e no site.

## Como o efeito funciona
- **Miolo:** só desfocado (blur de 3,5 px; 6 px em barras com menos de 90 px de altura). O fundo NÃO aumenta.
- **Borda:** faixa fina (22% do menor lado, entre 6 e 22 px) que funciona como a borda grossa de uma lupa: puxa o fundo de dentro pra fora com força 2,2× a largura da faixa, então o conteúdo aparece espelhado (de ponta-cabeça em cima, invertido nas laterais) e nítido.
- **Reflexos:** anel com gradiente diagonal (claro no canto de cima-esquerda e no de baixo-direita), brilho fino em cima e embaixo, varredura de luz ao entrar na tela ou passar o mouse.
- **Preenchimento:** quase transparente (branco de 1,5% a 7%). Nada de cinza fosco.
- **Precisa de algo atrás:** o efeito só aparece quando o vidro passa por cima de texto, imagem, pontilhado ou luz. Em vídeo, sempre deixe conteúdo da cena atrás do cartão (texto, grade, glow) e anime o cartão ou o fundo para a borda "correr".
- **Nunca** coloque `backdrop-filter` num elemento pai do vidro (ex.: o fundo escuro de um modal): isso corta o que o vidro enxerga e ele vira só um borrão.
- Funciona no Chromium (render dos vídeos com Playwright, Chrome, Android). No Safari cai para blur + reflexos.

## CSS
```css
/* ===== LIQUID GLASS =====
   1) fundo: blur + saturação; no Chrome/Edge/Android, refração real via SVG (html.lg-refract)
   2) borda: anel com gradiente diagonal (claro no canto de cima-esquerda e de baixo-direita)
   3) brilho: reflexo especular em cima e embaixo + varredura de luz */
.glass{position:relative;isolation:isolate;border-radius:24px;
  background:linear-gradient(135deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.015) 45%,rgba(255,255,255,.04) 100%);
  -webkit-backdrop-filter:blur(14px) saturate(180%) brightness(1.06);backdrop-filter:blur(14px) saturate(180%) brightness(1.06);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(255,255,255,.10),inset 0 0 24px rgba(255,255,255,.04),0 18px 50px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.3)}
.glass::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1.4px;pointer-events:none;z-index:2;
  background:linear-gradient(135deg,rgba(255,255,255,.75),rgba(255,255,255,.12) 22%,rgba(255,255,255,0) 45%,rgba(255,255,255,0) 60%,rgba(255,255,255,.14) 80%,rgba(255,255,255,.55));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0)}
.glass::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:1;
  background:
    radial-gradient(120% 60% at 12% 0%,rgba(255,255,255,.16),transparent 55%),
    radial-gradient(90% 50% at 92% 105%,rgba(255,255,255,.09),transparent 60%),
    linear-gradient(to top,rgba(255,255,255,.09),rgba(255,255,255,0) 14px),
    linear-gradient(to bottom,rgba(255,255,255,.07),rgba(255,255,255,0) 10px),
    linear-gradient(115deg,transparent 30%,rgba(255,255,255,.13) 45%,transparent 58%) no-repeat;
  background-size:100% 100%,100% 100%,100% 100%,100% 100%,260% 100%;background-position:0 0,0 0,0 0,0 0,140% 0;transition:background-position 1.1s cubic-bezier(.2,.8,.2,1)}
.glass:hover::after,.glass.in::after{background-position:0 0,0 0,0 0,0 0,-40% 0}
.glass>*{position:relative;z-index:3}
.glass.red{background:linear-gradient(135deg,rgba(255,45,45,.22),rgba(255,45,45,.05) 50%,rgba(255,45,45,.12))}
```

## JS (gera a lente do tamanho exato de cada `.glass`)
```js
(function () {
  var D = document, H = D.documentElement;
  /* ---------- Liquid Glass: refração na borda, miolo só desfocado ----------
     Cada card ganha um mapa de deslocamento do tamanho exato dele. Numa faixa fina junto
     à borda o vidro "puxa" o fundo de dentro pra fora, de um jeito que o conteúdo aparece
     espelhado (como a borda grossa de uma lupa). No miolo o deslocamento é zero: o fundo
     fica do mesmo tamanho, só desfocado. Chrome/Edge/Android aceitam isso; Safari ainda não. */
  var canRefract = !!(navigator.userAgentData) && CSS.supports('backdrop-filter', 'url(#a)');
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
    all();
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(all, 200); });
    if ('ResizeObserver' in window) { var ro = new ResizeObserver(function (es) { es.forEach(function (e) { apply(e.target); }); }); D.querySelectorAll('.glass').forEach(function (el) { ro.observe(el); }); }
    D.querySelectorAll('details').forEach(function (d) { d.addEventListener('toggle', all); });
  }
})();
```

## Animações que acompanham o vidro
- **Brilho que passa (varredura de luz):** já está no CSS acima (`.glass::after`, terceira camada do gradiente). Dispara quando o cartão ganha a classe `in`: a faixa de luz atravessa na diagonal em 1,1 s (`cubic-bezier(.2,.8,.2,1)`). No site, a classe entra quando o cartão aparece na tela ao rolar. **No vídeo, adicione `in` no frame em que o cartão entra em cena** (ou anime `background-position` do `::after` de `140% 0` para `-40% 0` na timeline do GSAP).
- **Entrada ao rolar:** o cartão sobe 26 px e aparece em 0,8 s com a mesma curva; irmãos com atraso de 0,08 s entre si (`.rv`, `.rv-d1`, `.rv-d2`).
- **Luzes de fundo:** três glows desfocados (vermelho, laranja do Claude e off-white) flutuando devagar (26 a 38 s, ida e volta). Dão o que a borda do vidro refratar e fazem o reflexo "correr".
- **Números contando:** de um valor ao outro em 1,6 s com desaceleração (ease-out cúbico), formatados em pt-BR.
- **Modal:** entra subindo 20 px e saindo de 96% de escala, com leve quique (`cubic-bezier(.2,1.3,.4,1)`, 0,45 s).
```css
html.js .rv{opacity:0;transform:translateY(26px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
html.js .rv.in{opacity:1;transform:none}
html.js .rv-d1{transition-delay:.08s}html.js .rv-d2{transition-delay:.16s}
```
