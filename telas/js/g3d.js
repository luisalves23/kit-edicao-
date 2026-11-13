/* g3d.js · biblioteca 3D do @cobaia.dev (three.js r160, script clássico, global G3D)
   - Um único WebGLRenderer compartilhado; cada cena desenha num <canvas> 2D próprio (sem limite de contextos).
   - Supersampling 2x por padrão (sem serrilhado).
   - Tudo determinístico: nada de Math.random sem semente.
   Peças: clawd (mascote do Claude Code em voxels), tomada NBR 14136 + plugue macho + benjamim,
   ícone de app 3D (Claude, Canva...), notebook, pão de queijo. */
(function () {
  const T = THREE;
  let R = null, ENV = null;
  const G = {};

  /* ---------- infraestrutura ---------- */
  G.renderer = function () {
    if (R) return R;
    R = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    R.setPixelRatio(1);
    R.outputColorSpace = T.SRGBColorSpace;
    R.toneMapping = T.ACESFilmicToneMapping;
    R.toneMappingExposure = 1.0;
    R.shadowMap.enabled = true;
    R.shadowMap.type = T.PCFSoftShadowMap;
    return R;
  };
  /* ambiente de estúdio (softboxes) para reflexos realistas */
  G.env = function () {
    if (ENV) return ENV;
    const r = G.renderer(), s = new T.Scene();
    s.background = new T.Color(0x202020);
    const room = new T.Mesh(new T.BoxGeometry(20, 12, 20), new T.MeshBasicMaterial({ color: 0x1a1a1a, side: T.BackSide }));
    s.add(room);
    const box = (w, h, x, y, z, c, i, ry = 0, rx = 0) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(i), side: T.DoubleSide }));
      m.position.set(x, y, z); m.rotation.y = ry; m.rotation.x = rx; s.add(m);
    };
    box(10, 4, 0, 5.9, 0, 0xffffff, 2.2, 0, Math.PI / 2);       // teto
    box(4, 6, -9.9, 1, 2, 0xfff1e0, 3.0, Math.PI / 2);         // softbox esquerda (quente)
    box(3, 5, 9.9, 0, -3, 0xe8f0ff, 1.6, -Math.PI / 2);        // softbox direita (fria)
    box(6, 2, 0, 1, 9.9, 0xffffff, 1.2, Math.PI);              // frente
    box(12, 1.2, 0, -2, -9.9, 0xff5040, 0.9, 0);               // faixa vermelha atrás (identidade)
    const pm = new T.PMREMGenerator(r);
    ENV = pm.fromScene(s, 0.035).texture;
    return ENV;
  };
  /* palco: cena + câmera + luzes de estúdio */
  G.stage = function (o = {}) {
    const scene = new T.Scene();
    scene.environment = G.env();
    const cam = new T.PerspectiveCamera(o.fov || 30, (o.w || 1) / (o.h || 1), 0.05, 200);
    const key = new T.DirectionalLight(o.keyColor || 0xfff0e0, o.key ?? 2.4);
    key.position.set(-4, 7, 6); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0004;
    const sc = key.shadow.camera; sc.left = -8; sc.right = 8; sc.top = 8; sc.bottom = -8; sc.near = 0.5; sc.far = 40;
    scene.add(key);
    const rim = new T.DirectionalLight(o.rimColor || 0xff6a50, o.rim ?? 1.6); rim.position.set(5, 3, -6); scene.add(rim);
    const fill = new T.HemisphereLight(0xfff6ea, 0x1a1010, o.fill ?? 0.55); scene.add(fill);
    const st = { scene, cam, key, rim, fill, ss: o.ss || 2, exposure: o.exposure || 1 };
    st.look = (p, t) => { cam.position.set(p[0], p[1], p[2]); cam.lookAt(t[0], t[1], t[2]); };
    /* sombra no chão sem chão visível */
    st.ground = (y = 0, op = 0.35, size = 40) => {
      const g = new T.Mesh(new T.PlaneGeometry(size, size), new T.ShadowMaterial({ opacity: op }));
      g.rotation.x = -Math.PI / 2; g.position.y = y; g.receiveShadow = true; scene.add(g); return g;
    };
    st.draw = (canvas) => G.draw(canvas, st);
    return st;
  };
  G.draw = function (canvas, st) {
    const r = G.renderer(), w = canvas.width, h = canvas.height, ss = st.ss;
    r.setSize(w * ss, h * ss, false);
    r.toneMappingExposure = st.exposure;
    st.cam.aspect = w / h; st.cam.updateProjectionMatrix();
    r.setClearColor(0x000000, 0);
    r.render(st.scene, st.cam);
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, w, h);
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
    c.drawImage(r.domElement, 0, 0, w * ss, h * ss, 0, 0, w, h);
  };
  const shadowAll = (o, cast = true, rec = true) => o.traverse(m => { if (m.isMesh) { m.castShadow = cast; m.receiveShadow = rec; } });

  /* ---------- formas ---------- */
  G.roundRect = function (w, h, r) {
    const s = new T.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  };
  /* "squircle" do iOS (superelipse) */
  G.squircle = function (w, h, n = 5, seg = 96) {
    const s = new T.Shape();
    for (let i = 0; i <= seg; i++) {
      const a = i / seg * Math.PI * 2, c = Math.cos(a), si = Math.sin(a);
      const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / n) * w / 2, y = Math.sign(si) * Math.pow(Math.abs(si), 2 / n) * h / 2;
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    } return s;
  };
  /* hexágono da tomada brasileira (topo e base retos, pontas laterais arredondadas) */
  G.hexBR = function (w, h, r = 0.08, path) {
    const s = path || new T.Shape(), a = w * 0.24, pts = [[-w / 2 + a, h / 2], [w / 2 - a, h / 2], [w / 2, 0], [w / 2 - a, -h / 2], [-w / 2 + a, -h / 2], [-w / 2, 0]];
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], pp = pts[(i + n - 1) % n], pn = pts[(i + 1) % n];
      const d1 = Math.hypot(p[0] - pp[0], p[1] - pp[1]), d2 = Math.hypot(pn[0] - p[0], pn[1] - p[1]);
      const A = [p[0] + (pp[0] - p[0]) * r / d1, p[1] + (pp[1] - p[1]) * r / d1], B = [p[0] + (pn[0] - p[0]) * r / d2, p[1] + (pn[1] - p[1]) * r / d2];
      i ? s.lineTo(A[0], A[1]) : s.moveTo(A[0], A[1]); s.quadraticCurveTo(p[0], p[1], B[0], B[1]);
    } s.closePath(); return s;
  };
  /* UV 0..1 na tampa da extrusão (para textura de ícone) */
  const capUV = (w, h) => ({
    generateTopUV(g, v, a, b, c) { return [a, b, c].map(i => new T.Vector2(v[i * 3] / w + .5, v[i * 3 + 1] / h + .5)); },
    generateSideWallUV(g, v, a, b, c, d) { return [new T.Vector2(0, 0), new T.Vector2(1, 0), new T.Vector2(1, 1), new T.Vector2(0, 1)]; }
  });
  G.extrude = function (shape, depth, bevel = 0.04, seg = 4, uv) {
    const g = new T.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: seg, curveSegments: 48, UVGenerator: uv });
    g.computeVertexNormals(); return g;
  };
  G.tex = function (src, cb) {
    const t = new T.TextureLoader().load(src, cb); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
  };
  G.canvasTex = function (w, h, fn) {
    const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
  };
  const plastic = (c, r = 0.32, extra = {}) => new T.MeshPhysicalMaterial(Object.assign({ color: c, roughness: r, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.25 }, extra));
  const metal = (c, r = 0.22) => new T.MeshStandardMaterial({ color: c, roughness: r, metalness: 1 });

  /* ---------- Clawd (mascote do Claude Code) em voxels ----------
     Grade fiel ao ícone oficial (claudecode-color.svg): corpo 12x8, braços 2x2, olhos 1x2, 4 pernas 1x2.
     Poses: idle, nod (k = 0..1 de inclinação), type (digitando), write (escrevendo com caneta). */
  G.CLAWD = '#E8603A';
  G.clawd = function (o = {}) {
    const V = o.voxel || 0.1, D = o.depth || 6, col = new T.Color(o.color || G.CLAWD);
    const root = new T.Group(), body = new T.Group(), armL = new T.Group(), armR = new T.Group(), legs = new T.Group();
    root.add(legs); root.add(body); body.add(armL); body.add(armR);
    const cubeG = G.extrude(G.roundRect(V * 0.95, V * 0.95, V * 0.06), V * 0.9, V * 0.025, 2);
    cubeG.translate(0, 0, -V * 0.45);
    const mat = plastic(col, 0.5, { clearcoat: 0.12 });
    const dark = new T.MeshStandardMaterial({ color: 0x1b1210, roughness: 0.35 });
    const lists = { b: [], e: [], l: [], al: [], ar: [] };
    const X = x => (x - 7.5) * V, Y = y => (9.5 - y) * V; // x 0..15, y 0..9 (topo = 0)
    for (let x = 2; x <= 13; x++) for (let y = 0; y <= 7; y++) for (let z = 0; z < D; z++) {
      const eye = (x === 4 || x === 11) && (y === 2 || y === 3);
      if (eye && z === D - 1) { lists.e.push([X(x), Y(y), (z - D / 2 + .5) * V - V * 0.35]); continue; }
      // só a casca (economia)
      if (x > 2 && x < 13 && y > 0 && y < 7 && z > 0 && z < D - 1) continue;
      lists.b.push([X(x), Y(y), (z - D / 2 + .5) * V]);
    }
    const armDepth = o.armDepth || 2;
    for (let x = 0; x <= 1; x++) for (let y = 4; y <= 5; y++) for (let z = 0; z < armDepth; z++) lists.al.push([X(x) - X(1), Y(y) - Y(4.5), (z - armDepth / 2 + .5) * V]);
    for (let x = 14; x <= 15; x++) for (let y = 4; y <= 5; y++) for (let z = 0; z < armDepth; z++) lists.ar.push([X(x) - X(14), Y(y) - Y(4.5), (z - armDepth / 2 + .5) * V]);
    [3, 5, 10, 12].forEach(x => { for (let y = 8; y <= 9; y++) for (let z = 1; z < D - 1; z += 1) if (z === 1 || z === D - 2) lists.l.push([X(x), Y(y), (z - D / 2 + .5) * V]); });
    const inst = (arr, m, parent) => {
      const im = new T.InstancedMesh(cubeG, m, arr.length), M = new T.Matrix4();
      arr.forEach((p, i) => { M.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(i, M); });
      im.castShadow = im.receiveShadow = true; parent.add(im); return im;
    };
    inst(lists.b, mat, body); inst(lists.e, dark, body); inst(lists.l, mat, legs);
    inst(lists.al, mat, armL); inst(lists.ar, mat, armR);
    armL.position.set(X(1) - V * 0.5 + V, Y(4.5), 0); armR.position.set(X(14) + V * 0.5 - V, Y(4.5), 0);
    // os braços giram a partir do ombro
    armL.children[0].position.x = -V * 0.5; armR.children[0].position.x = V * 0.5;
    body.position.y = 0;
    root.userData = { body, armL, armR, legs, V, D };
    G.pose(root, o.pose || 'idle', o.k ?? 1);
    return root;
  };
  G.pose = function (c, pose, k = 1) {
    const { body, armL, armR, V } = c.userData;
    body.rotation.set(0, 0, 0); armL.rotation.set(0, 0, 0); armR.rotation.set(0, 0, 0);
    if (pose === 'nod') { body.position.z = 0; body.rotation.x = 0.32 * k; }
    if (pose === 'type') { armL.rotation.set(-0.0, 0.9, -0.15 + 0.12 * k); armR.rotation.set(0.0, -0.9, 0.15 - 0.12 * (1 - k)); body.rotation.x = 0.12; }
    if (pose === 'write') { armR.rotation.set(0, -0.6, -0.55 + 0.25 * k); armL.rotation.set(0, 0.5, 0.25); body.rotation.x = 0.16; }
    if (pose === 'wave') { armR.rotation.z = 1.1 + 0.3 * k; }
  };

  /* ---------- notebook ---------- */
  /* o = { w, d, color, screen (textura), open (rad), esp (espessura da base: .05 fino, .13 grosso/antigo),
           tampa (espessura da tampa), moldura (cor da borda da tela; antigo = mesma cor do corpo), metal (0..1) } */
  G.laptop = function (o = {}) {
    const w = o.w || 3.2, d = o.d || 2.1, g = new T.Group(), h = o.esp || 0.05, hz = h + 0.042, tz = o.tampa || 0.04;
    const alu = new T.MeshPhysicalMaterial({ color: o.color || 0x2a2a2d, metalness: o.metal ?? 0.85, roughness: o.rough ?? 0.32, clearcoat: 0.4 });
    const base = new T.Mesh(G.extrude(G.roundRect(w, d, 0.14), h, 0.02, 3), alu);
    base.rotation.x = -Math.PI / 2; g.add(base);
    const kb = new T.Mesh(new T.PlaneGeometry(w * 0.86, d * 0.42), new T.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.7 }));
    kb.rotation.x = -Math.PI / 2; kb.position.set(0, hz, -d * 0.12); g.add(kb);
    const keyG = new T.BoxGeometry(w * 0.86 / 14 * 0.84, 0.014, d * 0.42 / 5 * 0.8), keyM = new T.MeshStandardMaterial({ color: 0x1f1f22, roughness: 0.55 });
    const keys = new T.InstancedMesh(keyG, keyM, 70), M = new T.Matrix4(); let n = 0;
    for (let r = 0; r < 5; r++) for (let q = 0; q < 14; q++) { M.makeTranslation(-w * 0.43 + (q + .5) * w * 0.86 / 14, hz + 0.008, -d * 0.12 - d * 0.21 + (r + .5) * d * 0.42 / 5); keys.setMatrixAt(n++, M); }
    g.add(keys);
    const pad = new T.Mesh(G.extrude(G.roundRect(w * 0.3, d * 0.22, 0.05), 0.002, 0, 1), new T.MeshStandardMaterial({ color: o.pad || 0x38383c, roughness: 0.4, metalness: .5 }));
    pad.rotation.x = -Math.PI / 2; pad.position.set(0, hz + 0.001, d * 0.3); g.add(pad);
    /* botão de ligar (canto superior direito do teclado) e LED */
    const btn = new T.Mesh(new T.BoxGeometry(w * 0.05, 0.02, d * 0.05), new T.MeshStandardMaterial({ color: 0x18181a, roughness: 0.5 }));
    btn.position.set(w * 0.40, hz + 0.01, -d * 0.40); g.add(btn);
    const led = new T.Mesh(new T.SphereGeometry(0.018, 12, 8), new T.MeshBasicMaterial({ color: 0x222222 }));
    led.position.set(-w * 0.1, hz, -d * 0.40); g.add(led);
    const lid = new T.Group(); lid.position.set(0, h + 0.04, -d / 2 + 0.02); g.add(lid);
    const lidM = new T.Mesh(G.extrude(G.roundRect(w, d * 0.98, 0.14), tz, 0.02, 3), alu);
    lidM.position.set(0, d * 0.49, -0.06 - (tz - 0.04)); lid.add(lidM);
    const scrW = w * (o.moldura ? 0.88 : 0.94), scrH = d * (o.moldura ? 0.8 : 0.9);
    const scr = new T.Mesh(new T.PlaneGeometry(scrW, scrH), new T.MeshBasicMaterial({ map: o.screen || null, color: o.screen ? 0xffffff : 0x111111, toneMapped: false }));
    scr.position.set(0, d * 0.49 + (o.moldura ? d * 0.035 : 0), 0.002); lid.add(scr);
    const bez = new T.Mesh(G.extrude(G.roundRect(w * 0.985, d * 0.965, 0.12), 0.001, 0, 1), o.moldura ? alu : new T.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 }));
    bez.position.set(0, d * 0.49, -0.004); lid.add(bez);
    lid.rotation.x = -(o.open ?? 0.28);
    shadowAll(g); scr.castShadow = false;
    g.userData = { lid, scr, scrW, scrH, btn, led };
    return g;
  };

  /* ---------- tomada NBR 14136 (fêmea) ----------
     Face na direção +z. Placa 2x2 com cantos arredondados, poço sextavado, 3 furos (ou 2).
     userData.holes: posições (x,y) dos furos na face do poço; userData.wellZ: profundidade da face do poço. */
  G.socket = function (o = {}) {
    const g = new T.Group(), white = plastic(o.color || 0xf3f0ea, 0.36, { clearcoat: 0.6, clearcoatRoughness: 0.18 });
    const P = o.size || 2, th = 0.32, ww = 1.36, wh = 0.98, depth = o.depth || 0.26;
    const plate = G.squircle(P, P, 4.2);
    const hole = G.hexBR(ww, wh, 0.14, new T.Path()); plate.holes.push(hole);
    const pm = new T.Mesh(G.extrude(plate, th, 0.07, 6), white); pm.position.z = -th; g.add(pm);
    // parede do poço
    const wall = G.hexBR(ww, wh, 0.14); wall.holes.push(G.hexBR(ww - 0.002, wh - 0.002, 0.14, new T.Path()));
    const floorM = plastic(0xe9e4da, 0.5, { clearcoat: 0.2 });
    const wellWall = new T.Mesh(new T.ExtrudeGeometry(G.hexBR(ww, wh, 0.14), { depth: depth, bevelEnabled: false, curveSegments: 48 }), new T.MeshStandardMaterial({ color: 0xd9d3c6, roughness: 0.6, side: T.BackSide }));
    wellWall.position.z = -th - depth + 0.01; g.add(wellWall); wellWall.userData.noShadow = 1;
    const holesXY = o.pins === 2 ? [[-0.36, 0], [0.36, 0]] : [[-0.36, 0.04], [0, -0.16], [0.36, 0.04]];
    const fl = G.hexBR(ww - 0.01, wh - 0.01, 0.14);
    const floor = new T.Mesh(new T.ExtrudeGeometry(fl, { depth: 0.5, bevelEnabled: false, curveSegments: 48 }), floorM); floor.position.z = -th - depth - 0.5 + 0.0; g.add(floor);
    // interior escuro dos furos (disco + anel de sombra, sempre visível)
    holesXY.forEach(([x, y]) => {
      const ring = new T.Mesh(new T.RingGeometry(0.085, 0.12, 40), new T.MeshBasicMaterial({ color: 0x8a8478, transparent: true, opacity: .45 }));
      ring.position.set(x, y - 0.006, -th - depth + 0.016); g.add(ring);
      const disc = new T.Mesh(new T.CircleGeometry(0.086, 40), new T.MeshBasicMaterial({ color: 0x050505 }));
      disc.position.set(x, y, -th - depth + 0.018); disc.userData.hole = 1; g.add(disc);
      const tube = new T.Mesh(new T.CylinderGeometry(0.086, 0.086, 0.5, 32, 1, true), new T.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8, side: T.BackSide }));
      tube.rotation.x = Math.PI / 2; tube.position.set(x, y, -th - depth - 0.25); g.add(tube);
      const bot = new T.Mesh(new T.CircleGeometry(0.086, 32), new T.MeshStandardMaterial({ color: 0x050505 }));
      bot.position.set(x, y, -th - depth - 0.49); g.add(bot);
    });
    // corpo atrás (caixa embutida)
    const back = new T.Mesh(G.extrude(G.squircle(P * 0.94, P * 0.94, 4.2), 0.6, 0.05, 3), white); back.position.z = -th - depth - 0.5 - 0.66; if (o.back !== false) g.add(back);
    shadowAll(g); wellWall.castShadow = false;
    g.userData = { holes: holesXY, wellZ: -th - depth + 0.0, faceZ: 0.07, ww, wh };
    return g;
  };
  /* ---------- plugue macho NBR (pinos redondos), eixo -z. Logo opcional no fundo. ---------- */
  G.plug = function (o = {}) {
    const g = new T.Group(), col = o.color || 0x1d1d1f;
    const bodyM = plastic(col, 0.34, { clearcoat: 0.7, clearcoatRoughness: 0.2 });
    const ww = 1.36 - 0.06, wh = 0.98 - 0.06, nose = 0.24;
    // nariz sextavado que entra no poço
    const n = new T.Mesh(G.extrude(G.hexBR(ww, wh, 0.12), nose, 0.03, 3), bodyM); g.add(n);
    // corpo cilíndrico achatado
    const bl = o.len || 1.15;
    const body = new T.Mesh(G.extrude(G.squircle(1.5, 1.14, 2.4), bl, 0.12, 6), bodyM); body.position.z = nose + 0.06; g.add(body);
    // tampa com logo
    if (o.logo) {
      const cap = new T.Mesh(new T.CircleGeometry(0.5, 64), new T.MeshPhysicalMaterial({ map: o.logo, roughness: 0.3, clearcoat: 1, transparent: true }));
      cap.position.z = nose + 0.06 + bl + 0.122; g.add(cap);
    }
    if (o.topLogo) { // logo em cima do corpo (visível de cima/de frente)
      const d = new T.Mesh(new T.CircleGeometry(0.46, 64), new T.MeshPhysicalMaterial({ map: o.topLogo, roughness: 0.3, clearcoat: 1 }));
      d.rotation.x = -Math.PI / 2; d.position.set(0, 0.72, nose + 0.06 + bl * 0.5); g.add(d);
    }
    // anel (alívio de tensão) e cabo
    const cableM = plastic(o.cable || col, 0.5);
    const ring = new T.Mesh(new T.CylinderGeometry(0.22, 0.3, 0.4, 40), cableM); ring.rotation.x = Math.PI / 2;
    const cz = nose + 0.06 + bl + 0.12 + 0.2;
    if (o.cableOut !== false) {
      ring.position.set(0, -0.3, cz - 0.05); ring.rotation.x = Math.PI / 2;
      // cabo sai por baixo em curva
      const curve = new T.CatmullRomCurve3([new T.Vector3(0, -0.5, nose + bl * 0.7), new T.Vector3(0, -0.95, nose + bl * 0.75), new T.Vector3(0, -1.6, nose + bl + 0.8), new T.Vector3(0, -2.6, nose + bl + 1.6), new T.Vector3(0, -5, nose + bl + 2)]);
      const cable = new T.Mesh(new T.TubeGeometry(curve, 80, 0.12, 20, false), cableM); g.add(cable);
    }
    // pinos
    const pinM = metal(o.pinColor || 0xd8d8d8, 0.18);
    const pins = o.pins === 2 ? [[-0.36, 0], [0.36, 0]] : [[-0.36, 0.04], [0, -0.16], [0.36, 0.04]];
    pins.forEach(([x, y]) => {
      const L = 0.62, p = new T.Mesh(new T.CylinderGeometry(0.068, 0.068, L, 32), pinM);
      p.rotation.x = Math.PI / 2; p.position.set(x, y, -L / 2 + 0.01); g.add(p);
      const tip = new T.Mesh(new T.SphereGeometry(0.068, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), pinM);
      tip.rotation.x = -Math.PI / 2; tip.position.set(x, y, -L + 0.01); g.add(tip);
    });
    shadowAll(g);
    return g;
  };
  /* ---------- benjamim (T): pinos atrás, 3 saídas (frente, esquerda, direita) ---------- */
  G.benjamim = function (o = {}) {
    const g = new T.Group(), white = plastic(o.color || 0xf3f0ea, 0.35, { clearcoat: 0.6 });
    const S = 1.9;
    const cube = new T.Mesh(G.extrude(G.squircle(S, S, 4.5), S, 0.12, 6), white); cube.position.z = 0.15; g.add(cube);
    const outs = [];
    const addWell = (pos, rotY) => {
      const w = new T.Group(); w.position.copy(pos); w.rotation.y = rotY; g.add(w);
      const fl = G.hexBR(1.3, 0.92, 0.13);
      [[-0.34, 0.04], [0, -0.15], [0.34, 0.04]].forEach(([x, y]) => { const h = new T.Path(); h.absarc(x, y, 0.08, 0, Math.PI * 2, true); fl.holes.push(h); });
      const face = new T.Mesh(new T.ShapeGeometry(fl, 48), new T.MeshStandardMaterial({ color: 0xe6e1d6, roughness: 0.5 })); face.position.z = -0.18; w.add(face);
      const wall = new T.Mesh(new T.ExtrudeGeometry(G.hexBR(1.3, 0.92, 0.13), { depth: 0.18, bevelEnabled: false, curveSegments: 48 }), new T.MeshStandardMaterial({ color: 0xd2ccbf, roughness: 0.6, side: T.BackSide })); wall.position.z = -0.18; w.add(wall);
      [[-0.34, 0.04], [0, -0.15], [0.34, 0.04]].forEach(([x, y]) => { const d = new T.Mesh(new T.CircleGeometry(0.08, 24), new T.MeshBasicMaterial({ color: 0x050505 })); d.position.set(x, y, -0.181); w.add(d); });
      outs.push(w);
    };
    // frente (z+) e laterais (x±); as faces ficam "dentro" do cubo com um rebaixo
    const half = S / 2 + 0.12;
    addWell(new T.Vector3(0, 0, 0.15 + S + 0.12 + 0.001), 0);
    addWell(new T.Vector3(-half - 0.001, 0, 0.15 + S / 2 + 0.06), -Math.PI / 2);
    addWell(new T.Vector3(half + 0.001, 0, 0.15 + S / 2 + 0.06), Math.PI / 2);
    // recorte visual: anéis sextavados em relevo em volta das saídas
    outs.forEach(w => { const r = G.hexBR(1.5, 1.12, 0.16); r.holes.push(G.hexBR(1.3, 0.92, 0.13, new T.Path())); const m = new T.Mesh(G.extrude(r, 0.02, 0.02, 2), white); w.add(m); });
    // pinos de trás (entram na tomada)
    const pinM = metal(0xd8d8d8, 0.2);
    [[-0.36, 0.04], [0, -0.16], [0.36, 0.04]].forEach(([x, y]) => { const p = new T.Mesh(new T.CylinderGeometry(0.068, 0.068, 0.62, 24), pinM); p.rotation.x = Math.PI / 2; p.position.set(x, y, -0.2); g.add(p); });
    const nose = new T.Mesh(G.extrude(G.hexBR(1.3, 0.92, 0.12), 0.2, 0.02, 2), white); nose.position.z = -0.08; g.add(nose);
    shadowAll(g);
    g.userData = { outs };
    return g;
  };

  /* ---------- ícone de app 3D (squircle com profundidade e reflexo de vidro) ---------- */
  G.appIcon = function (texture, o = {}) {
    const s = o.size || 2, d = o.depth || 0.34, g = new T.Group();
    const sh = G.squircle(s, s, 5);
    const geo = G.extrude(sh, d, 0.1, 8, capUV(s + 0.2, s + 0.2));
    // materiais: [tampas, laterais]
    const face = new T.MeshPhysicalMaterial({ map: texture, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 });
    const side = new T.MeshPhysicalMaterial({ color: o.side || 0xd98a6c, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.1 });
    const m = new T.Mesh(geo, [face, side]); m.position.z = -d; g.add(m);
    // lâmina de vidro (reflexo diagonal do liquid glass)
    const gl = G.canvasTex(512, 512, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, w, h);
      gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(.18, 'rgba(255,255,255,.10)'); gr.addColorStop(.42, 'rgba(255,255,255,0)');
      gr.addColorStop(.78, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.28)');
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
    });
    const glass = new T.Mesh(new T.ShapeGeometry(G.squircle(s * 0.985, s * 0.985, 5), 64), new T.MeshBasicMaterial({ map: gl, transparent: true, depthWrite: false, toneMapped: false }));
    // UV da lâmina
    const pa = glass.geometry.attributes.position, uv = new Float32Array(pa.count * 2);
    for (let i = 0; i < pa.count; i++) { uv[i * 2] = pa.getX(i) / s + .5; uv[i * 2 + 1] = pa.getY(i) / s + .5; }
    glass.geometry.setAttribute('uv', new T.BufferAttribute(uv, 2));
    glass.position.z = 0.102; g.add(glass);
    shadowAll(g); glass.castShadow = false;
    return g;
  };
  /* textura do ícone do Canva (gradiente oficial + marca "Canva" em branco) */
  G.canvaTex = function (path) {
    return G.canvasTex(1024, 1024, (c, w, h) => {
      const gr = c.createLinearGradient(0, h, w, 0);
      gr.addColorStop(0, '#00C4CC'); gr.addColorStop(.52, '#5B5BF6'); gr.addColorStop(1, '#7D2AE8');
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      // texto = círculo XOR caminho oficial
      const o = document.createElement('canvas'); o.width = w; o.height = h; const x = o.getContext('2d');
      x.setTransform(w / 26, 0, 0, h / 26, w / 26, h / 26);
      x.fillStyle = '#fff'; x.fill(new Path2D(path), 'evenodd');
      x.globalCompositeOperation = 'xor'; x.beginPath(); x.arc(12, 12, 11.98, 0, Math.PI * 2); x.fill();
      c.drawImage(o, 0, 0);
    });
  };
  /* aura de conexão (sprite sempre de frente pra câmera, anéis que se expandem; k = 0..1) */
  G.aura = function (color = '#FF6A3D', size = 3) {
    const tex = G.canvasTex(512, 512, (c, w, h) => {
      const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, 'rgba(255,200,160,.9)'); g.addColorStop(.18, color); g.addColorStop(.5, 'rgba(255,80,40,.18)'); g.addColorStop(1, 'rgba(255,60,30,0)');
      c.fillStyle = g; c.fillRect(0, 0, w, h);
      [.55, .72, .88].forEach((r, i) => { c.strokeStyle = `rgba(255,140,100,${.75 - i * .22})`; c.lineWidth = 7 - i * 2; c.beginPath(); c.arc(w / 2, h / 2, r * w / 2, 0, 7); c.stroke(); });
    });
    const sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, blending: T.AdditiveBlending, depthWrite: false, depthTest: false, toneMapped: false }));
    sp.scale.setScalar(size); sp.renderOrder = 5; return sp;
  };
  /* tampa de plugue com logo (fundo branco ou cor) */
  G.logoTex = function (path, fg, bg, pad = 0.22, evenodd) {
    return G.canvasTex(512, 512, (c, w, h) => {
      c.fillStyle = bg; c.beginPath(); c.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2); c.fill();
      const s = w * (1 - pad * 2) / 24; c.setTransform(s, 0, 0, s, w * pad, h * pad);
      c.fillStyle = fg; c.fill(new Path2D(path), evenodd ? 'evenodd' : 'nonzero');
    });
  };

  /* ---------- pão de queijo (procedural, semente fixa) ---------- */
  const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
  const vnoise = (x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
    const f = t => t * t * (3 - 2 * t), u = f(xf), v = f(yf), w = f(zf);
    const L = (a, b, t) => a + (b - a) * t;
    const c = (i, j, k) => hash(xi + i, yi + j, zi + k);
    return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w);
  };
  const fbm = (x, y, z) => { let a = 0, s = 1, t = 0; for (let i = 0; i < 5; i++) { a += vnoise(x * s, y * s, z * s) / s; t += 1 / s; s *= 2.03; } return a / t; };
  G.paoDeQueijo = function (seed = 1, o = {}) {
    const geo = new T.SphereGeometry(1, 160, 110), p = geo.attributes.position, cols = new Float32Array(p.count * 3);
    const top = new T.Color(o.top || '#b5691c'), mid = new T.Color(o.mid || '#dc9a3a'), low = new T.Color(o.low || '#eec474'), crack = new T.Color('#efcf86'), burnt = new T.Color('#9a5418');
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = fbm(x * 2.2 + seed * 3.1, y * 2.2 + seed, z * 2.2 - seed * 1.7);
      const n2 = fbm(x * 7 + seed, y * 7, z * 7 - seed);
      // rachaduras: vales estreitos de um ruído
      const cr = Math.abs(vnoise(x * 3.4 + seed * 5, y * 3.4, z * 3.4 + seed) - 0.5);
      const cw = 0.012 * Math.max(0, y - 0.2), isCrack = cr < cw ? Math.pow((cw - cr) / cw, .7) : 0;
      let r = 1 + (n - 0.5) * 0.16 + (n2 - 0.5) * 0.025 - isCrack * 0.025;
      x *= r; y *= r; z *= r;
      // achata a base e "derrama" um pouco
      if (y < -0.35) { const k = (-0.35 - y); y = -0.35 - k * 0.3; x *= 1 + k * 0.18; z *= 1 + k * 0.18; }
      y *= 0.9;
      p.setXYZ(i, x, y, z);
      const h = (y / 0.9 + 1) / 2; // 0 base .. 1 topo
      const c = new T.Color();
      if (h > 0.55) c.lerpColors(mid, top, Math.min(1, (h - 0.55) / 0.4)); else c.lerpColors(low, mid, Math.max(0, (h - 0.12) / 0.43));
      c.lerp(burnt, Math.min(.7, Math.max(0, n - 0.5) * 2.2 * h * h));
      c.lerp(crack, isCrack * 0.6);
      const sp = hash(Math.floor(x * 40), Math.floor(y * 40), Math.floor(z * 40));
      if (sp > 0.93) c.offsetHSL(0, 0.05, -0.08); // pontinhos de queijo tostado
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new T.BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    const m = new T.Mesh(geo, new T.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.55, sheen: 0.6, sheenRoughness: 0.6, sheenColor: new T.Color('#ffe2a0') }));
    m.castShadow = m.receiveShadow = true;
    return m;
  };
  /* toalha xadrez (padaria) e tábua */
  G.gingham = function (c1 = '#c8322c', c2 = '#f7efe2', n = 18) {
    const t = G.canvasTex(1024, 1024, (c, w, h) => {
      c.fillStyle = c2; c.fillRect(0, 0, w, h); const s = w / n;
      c.globalAlpha = .72; c.fillStyle = c1; for (let i = 0; i < n; i += 2) { c.fillRect(i * s, 0, s, h); c.fillRect(0, i * s, w, s); }
      c.globalAlpha = .05; for (let i = 0; i < 4000; i++) { c.fillStyle = i % 2 ? '#000' : '#fff'; c.fillRect(hash(i, 1, 2) * w, hash(i, 3, 4) * h, 2, 2); }
    }); t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  };
  G.woodTex = function () {
    return G.canvasTex(1024, 512, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#9a6236'); g.addColorStop(1, '#7a4724'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 160; i++) { const y = hash(i, 9, 1) * h; c.strokeStyle = `rgba(${hash(i, 2, 2) > .5 ? '60,30,10' : '190,130,80'},${.08 + hash(i, 5, 5) * .14})`; c.lineWidth = 1 + hash(i, 7, 7) * 3; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 32) c.lineTo(x, y + Math.sin(x / 90 + i) * 6 * hash(i, 8, 8)); c.stroke(); }
    });
  };
  G.plate = function (r = 2.4, color = 0xf6f2ea) {
    const pts = [[0, 0], [r * .62, 0], [r * .7, .06], [r * .74, .14], [r * .92, .22], [r, .3], [r * 1.0, .33], [r * .93, .3], [r * .73, .2], [r * .62, .12], [0, .12]].map(([x, y]) => new T.Vector2(x, y));
    const m = new T.Mesh(new T.LatheGeometry(pts, 96), new T.MeshPhysicalMaterial({ color, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, side: T.DoubleSide }));
    m.castShadow = m.receiveShadow = true; return m;
  };

  window.G3D = G;
})();
