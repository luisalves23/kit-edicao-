/* positivo3d.js · Positivo Motion Plus Q464B (vermelho) em escala real (metros): 328 x 220 x 17 mm, tela 14" 16:9.
   Referência: foto real do notebook (videos/fonte/dia06-pomar/entrada/foto-notebook-real.jpg) e ficha técnica.
   Origem: centro da base, embaixo. Frente (touchpad) para +z. userData: { lid, scr, scrTex, setOpen(rad) }. */
(function(){
  const T=THREE, Q={};
  const RED=0xa3323d;
  function rr(x,X,Y,W,H,R){ x.beginPath(); x.roundRect(X,Y,W,H,R); }
  function rbox(w,h,d,r,seg=4){ // caixa arredondada (cantos em planta) extrudada em y
    const s=new T.Shape(), x=-w/2, z=-d/2;
    s.moveTo(x+r,z); s.lineTo(x+w-r,z); s.quadraticCurveTo(x+w,z,x+w,z+r); s.lineTo(x+w,z+d-r); s.quadraticCurveTo(x+w,z+d,x+w-r,z+d);
    s.lineTo(x+r,z+d); s.quadraticCurveTo(x,z+d,x,z+d-r); s.lineTo(x,z+r); s.quadraticCurveTo(x,z,x+r,z);
    const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelThickness:Math.min(.0015,h*.2),bevelSize:.0015,bevelSegments:3,curveSegments:seg*3});
    g.rotateX(Math.PI/2); g.translate(0,h,0); g.computeVertexNormals(); return g;
  }
  /* textura do tampo: teclado ABNT2 preto com legendas brancas, grade do alto-falante, LEDs, DualPad com teclado numérico */
  function tampo(){
    const W=2048, H=Math.round(2048*220/328), c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d');
    const s=W/328; // px por mm
    const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#b03a46'); g.addColorStop(1,'#9e2f3a'); x.fillStyle=g; x.fillRect(0,0,W,H);
    // escovado leve
    for(let i=0;i<H;i+=2){ x.fillStyle=`rgba(255,255,255,${.012+.012*Math.sin(i*1.7)})`; x.fillRect(0,i,W,1); }
    // faixa do alto-falante
    x.fillStyle='rgba(0,0,0,.22)'; rr(x,40*s,8*s,248*s,4.2*s,2*s); x.fill();
    x.fillStyle='rgba(0,0,0,.35)'; for(let i=0;i<120;i++){ x.beginPath(); x.arc((44+i*2.02)*s,10.1*s,.45*s,0,7); x.fill(); }
    // LEDs
    [[107,16.5],[113,16.5],[119,16.5]].forEach(([a,b],i)=>{ x.fillStyle=i===0?'#d9d9d9':'#7d1f28'; x.beginPath(); x.arc(a*s,b*s,.9*s,0,7); x.fill(); });
    // teclado
    const kx=24*s, ky=21*s, kw=280*s, u=kw/15.2;
    const rows=[
      [['Esc',1],['F1',1],['F2',1],['F3',1],['F4',1],['F5',1],['F6',1],['F7',1],['F8',1],['F9',1],['F10',1],['F11',1],['F12',1],['Delete',1.2],['⏻',1]],
      [["'",1],['1',1],['2',1],['3',1],['4',1],['5',1],['6',1],['7',1],['8',1],['9',1],['0',1],['-',1],['=',1],['←',1.6],['Home',1]],
      [['Tab',1.5],['Q',1],['W',1],['E',1],['R',1],['T',1],['Y',1],['U',1],['I',1],['O',1],['P',1],['´',1],['[',1],['',1.1],['PgUp',1]],
      [['Caps Lock',1.8],['A',1],['S',1],['D',1],['F',1],['G',1],['H',1],['J',1],['K',1],['L',1],['Ç',1],['~',1],['↵',1.8],['PgDn',1]],
      [['Shift',1.4],['\\',1],['Z',1],['X',1],['C',1],['V',1],['B',1],['N',1],['M',1],[',',1],['.',1],[';',1],['Shift',1.5],['↑',1],['End',1]],
      [['Ctrl',1.2],['Fn',1],['⊞',1],['Alt',1.1],['',4.6],['AltGr',1.1],['▤',1],['Ctrl',1.1],['←',1],['↓',1],['→',1]]
    ];
    const rh=[.62,1,1,1,1,1];
    let y=ky;
    rows.forEach((r,ri)=>{ const tot=r.reduce((a,k)=>a+k[1],0), sc=15.2/tot; let xx=kx; const h=u*rh[ri]*.9;
      r.forEach(([lb,w])=>{ const ww=w*sc*u; 
        x.fillStyle='rgba(0,0,0,.35)'; rr(x,xx+.06*u,y+.08*u,ww-.12*u,h-.04*u,.12*u); x.fill();
        const kg=x.createLinearGradient(0,y,0,y+h); kg.addColorStop(0,'#1d1d1f'); kg.addColorStop(1,'#0e0e10'); x.fillStyle=kg; rr(x,xx+.06*u,y+.02*u,ww-.12*u,h-.1*u,.1*u); x.fill();
        x.strokeStyle='rgba(255,255,255,.06)'; x.lineWidth=2; x.stroke();
        if(ri===0&&/^F\d/.test(lb)){ const sec=['☀-','☀+','⊘','▭','🔈','🔊','🔇','⏯','⏮','⏭','Pause','Ins','Prt Sc'][+lb.slice(1)-1]||''; x.fillStyle='#e0323c'; x.font=`600 ${.2*u}px Inter, Arial`; x.textAlign='right'; x.textBaseline='middle'; x.fillText(sec, xx+ww-.18*u, y+h*.68); }
        if(lb){ x.fillStyle='#f2f2f2'; const fs=(lb.length>3?.22:lb.length>1?.26:.34)*u; x.font=`500 ${fs}px Inter, Arial`; x.textAlign=lb.length>1&&ri>0?'left':(ri===0?'left':'center'); x.textBaseline='middle';
          x.fillText(lb, x.textAlign==='left'?xx+.22*u:xx+ww/2, y+h*(lb.length>1&&ri>0?.62:ri===0?.38:.48)); if(lb==='Fn'){} }
        xx+=ww; });
      y+=u*rh[ri]; });
    // DualPad: touchpad grande com teclado numérico impresso
    const px=(328/2-62)*s, py=(y/s+3.5)*s, pw=124*s, ph=(220-4-y/s-3.5)*s;
    x.fillStyle='rgba(0,0,0,.10)'; rr(x,px,py,pw,ph,2.5*s); x.fill(); x.strokeStyle='rgba(255,210,215,.35)'; x.lineWidth=2.2; rr(x,px,py,pw,ph,2.5*s); x.stroke();
    x.fillStyle='rgba(255,225,228,.55)'; x.font=`500 ${3.2*s}px Inter`; x.textAlign='center'; x.textBaseline='middle';
    x.fillText('<<<   Deslize   >>>',px+pw/2,py+4.5*s);
    const nums=[['7','8','9','—'],['4','5','6','x'],['1','2','3','+'],['','0','Enter','']];
    nums.forEach((r,i)=>r.forEach((n,j)=>{ x.font=`400 ${(n.length>1?2.8:4.2)*s}px Inter`; x.fillText(n,px+pw*(.16+j*.23),py+ph*(.27+i*.2)); }));
    x.strokeStyle='rgba(255,225,228,.25)'; x.lineWidth=2; x.beginPath(); x.moveTo(px,py+9*s); x.lineTo(px+pw,py+9*s); x.stroke();
    // adesivos originais (réplica genérica): selo colorido de recursos + etiqueta preta do modelo + hdmi
    { const ax=40*s, ay=py+8*s, aw=50*s, ah=30*s, cw=aw/4, chh=ah/2;
      x.save(); x.shadowColor='rgba(0,0,0,.35)'; x.shadowBlur=6; x.fillStyle='#fff'; rr(x,ax-1*s,ay-1*s,aw+2*s,ah+2*s,1.6*s); x.fill(); x.restore();
      const P=[['Quad','Core','#1e5bd8','#6aa8ff'],['4GB','MEMÓRIA','#e8452c','#ff9a3c'],['64GB','ARMAZEN.','#ff7a1a','#ffc53c'],['+Cloud','','#f2b705','#ffe45c'],['6h','DE BATERIA','#1e9e5a','#7be07a'],['2.0+3.0','USB','#0f9aa8','#54e0d9'],['ULTRA','FINO','#2350c8','#7c8dff'],['DualPad','','#7a3cc8','#c27bff']];
      P.forEach(([a,b,c1,c2],i)=>{ const cx=ax+(i%4)*cw, cy=ay+Math.floor(i/4)*chh; const gg=x.createLinearGradient(cx,cy,cx+cw,cy+chh); gg.addColorStop(0,c1); gg.addColorStop(1,c2); x.fillStyle=gg; x.fillRect(cx+.2*s,cy+.2*s,cw-.4*s,chh-.4*s);
        x.fillStyle='rgba(255,255,255,.18)'; x.beginPath(); x.moveTo(cx,cy); x.lineTo(cx+cw*.6,cy); x.lineTo(cx,cy+chh*.7); x.fill();
        x.fillStyle='#fff'; x.textAlign='center'; x.textBaseline='middle'; x.font=`800 ${(a.length>5?2.6:3.6)*s}px Inter`; x.fillText(a,cx+cw/2,cy+chh*(b?.4:.5)); if(b){ x.font=`700 ${1.55*s}px Inter`; x.fillText(b,cx+cw/2,cy+chh*.74);} });
      const lx=ax-14*s; x.fillStyle='#111'; rr(x,lx,ay,12*s,ah,1*s); x.fill(); x.fillStyle='#fff'; x.textAlign='left'; x.font=`800 ${2.2*s}px Inter`; x.fillText('POSITIVO',lx+1.2*s,ay+5*s); x.font=`600 ${1.6*s}px Inter`; ['MOTION','PLUS RED','Q464B'].forEach((t,i)=>x.fillText(t,lx+1.2*s,ay+(9+i*2.6)*s));
      x.fillStyle='#111'; rr(x,lx,ay+ah+2*s,12*s,5*s,.8*s); x.fill(); x.fillStyle='#fff'; x.font=`800 ${2.4*s}px Inter`; x.fillText('hdmi',lx+1.6*s,ay+ah+4.6*s); }
    const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=16; return t;
  }
  function logoLid(){ const c=document.createElement('canvas'); c.width=1024; c.height=1024*214/324; const x=c.getContext('2d');
    x.fillStyle='#a3323d'; x.fillRect(0,0,c.width,c.height);
    for(let i=0;i<c.height;i+=2){ x.fillStyle=`rgba(255,255,255,${.01+.01*Math.sin(i*1.3)})`; x.fillRect(0,i,c.width,1); }
    x.fillStyle='rgba(235,200,205,.75)'; x.font='700 46px Inter'; x.textAlign='center'; x.textBaseline='middle'; x.fillText('POSITIVO',c.width/2,c.height/2);
    const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=8; return t; }
  function moldura(){ const W=1024, H=Math.round(1024*214/324), c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'), s=W/324;
    x.fillStyle='#a8343f'; x.fillRect(0,0,W,H);
    for(let i=0;i<H;i+=2){ x.fillStyle=`rgba(255,255,255,${.01+.012*Math.sin(i*2.1)})`; x.fillRect(0,i,W,1); }
    // borda interna escura em volta do painel
    x.fillStyle='#160c0e'; rr(x,6.5*s,7.5*s,311*s,176.5*s,1*s); x.fill();
    // câmera e marca
    x.fillStyle='#0e0809'; rr(x,150*s,1.6*s,24*s,5*s,1.2*s); x.fill(); x.fillStyle='#3a1a1e'; rr(x,155*s,2.3*s,14*s,3.6*s,.8*s); x.fill();
    x.strokeStyle='rgba(255,255,255,.35)'; x.lineWidth=1.4; for(let i=0;i<4;i++){ x.beginPath(); x.moveTo((160.5+i*1.1)*s,3*s); x.lineTo((160.5+i*1.1)*s,5.2*s); x.stroke(); }
    x.fillStyle='#f4eeee'; x.font=`800 ${6.4*s}px Montserrat, Inter`; x.textAlign='center'; x.textBaseline='middle'; x.fillText('POSITIVO',162*s,(184+15.5)*s);
    // borrachas quadradas pretas nos cantos
    x.fillStyle='#141012'; [[4,4],[320,4],[4,203],[320,203]].forEach(([a,b])=>{ rr(x,(a-2)*s,(b-2)*s,4*s,4*s,.6*s); x.fill(); });
    const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=8; return t; }

  Q.notebook=function(o={}){
    const W=.328, D=.22, HB=.0092, HL=.0042, g=new T.Group();
    const met=new T.MeshPhysicalMaterial({color:RED,metalness:.55,roughness:.38,clearcoat:.25,clearcoatRoughness:.4});
    // base (corpo) com tampo texturizado
    const base=new T.Mesh(rbox(W,HB,D,.008),met); g.add(base);
    const top=new T.Mesh(new T.PlaneGeometry(W-.004,D-.004),new T.MeshPhysicalMaterial({map:tampo(),metalness:.4,roughness:.45,clearcoat:.2}));
    top.rotation.x=-Math.PI/2; top.position.y=HB+.0016; g.add(top);
    // pés de borracha
    const pm=new T.MeshStandardMaterial({color:0x1a1a1a,roughness:.9});
    [[-.13,-.08],[.13,-.08],[-.13,.08],[.13,.08]].forEach(([a,b])=>{ const p=new T.Mesh(new T.CylinderGeometry(.006,.006,.002,16),pm); p.position.set(a,-.001,b); g.add(p); });
    // dobradiça
    const hin=new T.Mesh(new T.CylinderGeometry(.0055,.0055,W*.86,24),new T.MeshPhysicalMaterial({color:0x8e2832,metalness:.6,roughness:.35})); hin.rotation.z=Math.PI/2; hin.position.set(0,HB+.002,-D/2+.006); g.add(hin);
    // tampa
    const lid=new T.Group(); lid.position.set(0,HB+.002,-D/2+.006); g.add(lid);
    const LW=W-.004, LH=.214;
    const shell=new T.Mesh(rbox(LW,HL,LH,.008),met); shell.rotation.x=Math.PI/2; shell.position.set(0,LH/2,-HL); lid.add(shell);
    const back=new T.Mesh(new T.PlaneGeometry(LW-.004,LH-.004),new T.MeshPhysicalMaterial({map:logoLid(),metalness:.55,roughness:.38,clearcoat:.25})); back.rotation.y=Math.PI; back.position.set(0,LH/2,-HL-.0017); lid.add(back);
    const fr=new T.Mesh(new T.PlaneGeometry(LW-.002,LH-.002),new T.MeshPhysicalMaterial({map:moldura(),metalness:.45,roughness:.42})); fr.position.set(0,LH/2,.0019); lid.add(fr);
    // painel: 14" 16:9 (309 x 174 mm), um pouco recuado
    const sc=document.createElement('canvas'); sc.width=1366; sc.height=768; const st=new T.CanvasTexture(sc); st.colorSpace=T.SRGBColorSpace; st.anisotropy=8;
    const scr=new T.Mesh(new T.PlaneGeometry(.309,.174),new T.MeshBasicMaterial({map:st,toneMapped:false})); scr.position.set(0,LH/2+.0112,.0023); lid.add(scr);
    // vidro antirreflexo por cima (reflexo sutil)
    const gl=new T.Mesh(new T.PlaneGeometry(.309,.174),new T.MeshPhysicalMaterial({color:0x000000,transparent:true,opacity:.08,roughness:.15,metalness:0,clearcoat:1})); gl.position.copy(scr.position); gl.position.z+=.0004; lid.add(gl);
    g.traverse(m=>{ if(m.isMesh){ m.castShadow=true; m.receiveShadow=true; } }); scr.castShadow=false; gl.castShadow=false;
    const setOpen=a=>{ lid.rotation.x=-(a-Math.PI/2); }; // a = ângulo entre tampa e base (rad); 1.9 ≈ 110°
    setOpen(o.abre??1.92);
    g.userData={lid,scr,scrTex:st,scrCanvas:sc,setOpen,W,D,HB};
    return g;
  };
  window.POSITIVO=Q;
})();
