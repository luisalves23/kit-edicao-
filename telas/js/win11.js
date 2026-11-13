/* win11.js · tela do Windows 11 travado (genérica, sem prints): papel de parede azul, barra de tarefas centralizada,
   janela "Não está respondendo" esbranquiçada, cursor de carregamento girando e pop-ups de erro aparecendo. */
(function(){
  function rr(x,X,Y,W,H,R){ x.beginPath(); x.roundRect(X,Y,W,H,R); }
  let WP=null;
  function wallpaper(){ if(WP) return WP; const c=document.createElement('canvas'); c.width=1366; c.height=768; const x=c.getContext('2d');
    const g=x.createRadialGradient(683,420,40,683,420,900); g.addColorStop(0,'#cfe3ff'); g.addColorStop(.25,'#4d8fe6'); g.addColorStop(.6,'#0f3d91'); g.addColorStop(1,'#061a45'); x.fillStyle=g; x.fillRect(0,0,1366,768);
    // pétalas suaves (abstrato, no clima do tema padrão)
    x.globalCompositeOperation='screen';
    for(let i=0;i<7;i++){ const a=-1.2+i*.4; x.save(); x.translate(683,470); x.rotate(a); const pg=x.createLinearGradient(0,-330,0,0); pg.addColorStop(0,'rgba(120,180,255,0)'); pg.addColorStop(1,`rgba(${90+i*12},${150+i*8},255,.35)`);
      x.fillStyle=pg; x.beginPath(); x.moveTo(0,0); x.bezierCurveTo(-150,-120,-110,-300,0,-360); x.bezierCurveTo(110,-300,150,-120,0,0); x.fill(); x.restore(); }
    x.globalCompositeOperation='source-over'; WP=c; return c; }
  function startIcon(x,X,Y,s){ const q=s*.46,gap=s*.08; x.fillStyle='#2b8ef2'; [[0,0],[1,0],[0,1],[1,1]].forEach(([a,b])=>{ x.fillRect(X+a*(q+gap),Y+b*(q+gap),q,q); }); }
  function taskbar(x,t){ x.fillStyle='rgba(32,36,48,.82)'; x.fillRect(0,720,1366,48); x.fillStyle='rgba(255,255,255,.08)'; x.fillRect(0,720,1366,1);
    const icons=['start','search','folder','web','store','mail','office']; const w=40, x0=683-icons.length*w/2;
    icons.forEach((ic,i)=>{ const X=x0+i*w+6, Y=728;
      if(ic==='start') startIcon(x,X+5,Y+5,22);
      else if(ic==='search'){ x.strokeStyle='#e8e8e8'; x.lineWidth=2.2; x.beginPath(); x.arc(X+14,Y+14,7,0,7); x.stroke(); x.beginPath(); x.moveTo(X+19,Y+19); x.lineTo(X+24,Y+24); x.stroke(); }
      else if(ic==='folder'){ x.fillStyle='#f4c44b'; rr(x,X+3,Y+8,26,18,3); x.fill(); x.fillStyle='#e0a92c'; rr(x,X+3,Y+5,12,6,2); x.fill(); }
      else if(ic==='web'){ const g=x.createLinearGradient(X,Y,X+28,Y+28); g.addColorStop(0,'#33c3ff'); g.addColorStop(1,'#1a6fe0'); x.fillStyle=g; x.beginPath(); x.arc(X+16,Y+16,12,0,7); x.fill(); x.fillStyle='rgba(255,255,255,.85)'; x.beginPath(); x.arc(X+18,Y+18,5,0,7); x.fill(); }
      else if(ic==='store'){ x.fillStyle='#e8e8e8'; rr(x,X+4,Y+8,24,18,3); x.fill(); x.fillStyle='#2b8ef2'; x.fillRect(X+10,Y+12,5,5); x.fillRect(X+17,Y+12,5,5); x.fillRect(X+10,Y+19,5,5); x.fillRect(X+17,Y+19,5,5); }
      else if(ic==='mail'){ x.fillStyle='#2f7ce6'; rr(x,X+4,Y+8,24,17,3); x.fill(); x.strokeStyle='#fff'; x.lineWidth=1.6; x.beginPath(); x.moveTo(X+5,Y+10); x.lineTo(X+16,Y+18); x.lineTo(X+27,Y+10); x.stroke(); }
      else { x.fillStyle='#d9472b'; rr(x,X+6,Y+6,20,20,4); x.fill(); }
      if(i===2||i===3){ x.fillStyle='#9ec3ff'; rr(x,X+12,Y+33,8,3,1.5); x.fill(); } });
    x.fillStyle='#f0f0f0'; x.font='500 12px Inter'; x.textAlign='right'; x.fillText('10:02',1350,740); x.fillText('11/11/2026',1350,757);
    x.textAlign='left'; x.font='500 12px Inter'; x.fillText('⌃   ᯤ  🔊  🔋',1190,749); }
  function spinner(x,cx,cy,r,t,cor){ for(let i=0;i<5;i++){ const a=t*6-i*.38; x.fillStyle=cor||'#fff'; x.globalAlpha=1-i*.17; x.beginPath(); x.arc(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r*.16,0,7); x.fill(); } x.globalAlpha=1; }
  function janela(x,X,Y,W,H,titulo,branca){ x.save(); x.shadowColor='rgba(0,0,0,.45)'; x.shadowBlur=30; x.shadowOffsetY=8; x.fillStyle='#f3f3f3'; rr(x,X,Y,W,H,9); x.fill(); x.restore();
    x.fillStyle='#e9e9e9'; rr(x,X,Y,W,34,9); x.fill(); x.fillRect(X,Y+20,W,14);
    x.fillStyle='#1b1b1b'; x.font='400 13px Inter'; x.textAlign='left'; x.fillText(titulo,X+14,Y+22);
    x.font='400 15px Inter'; x.fillText('—',X+W-118,Y+22); x.fillText('▢',X+W-76,Y+22); x.fillText('✕',X+W-34,Y+22);
    if(branca){ x.fillStyle='rgba(255,255,255,.62)'; rr(x,X,Y+34,W,H-34,0); x.fill(); } }
  function erro(x,X,Y,titulo,msg,botao){ x.save(); x.shadowColor='rgba(0,0,0,.5)'; x.shadowBlur=36; x.shadowOffsetY=10; x.fillStyle='#fbfbfb'; rr(x,X,Y,420,170,10); x.fill(); x.restore();
    x.strokeStyle='rgba(0,0,0,.12)'; x.lineWidth=1; rr(x,X,Y,420,170,10); x.stroke();
    x.fillStyle='#1b1b1b'; x.font='400 12px Inter'; x.textAlign='left'; x.fillText(titulo,X+14,Y+22); x.fillText('✕',X+398,Y+22);
    x.fillStyle='#c42b1c'; x.beginPath(); x.arc(X+38,Y+70,16,0,7); x.fill(); x.fillStyle='#fff'; x.font='700 18px Inter'; x.textAlign='center'; x.fillText('✕',X+38,Y+76);
    x.fillStyle='#1b1b1b'; x.textAlign='left'; x.font='600 14px Inter'; x.fillText(msg[0],X+66,Y+64); x.font='400 13px Inter'; x.fillStyle='#444'; x.fillText(msg[1],X+66,Y+86);
    x.fillStyle='#eeeeee'; x.fillRect(X,Y+118,420,52); x.fillStyle='#0067c0'; rr(x,X+300,Y+130,104,30,5); x.fill(); x.fillStyle='#fff'; x.font='500 13px Inter'; x.textAlign='center'; x.fillText(botao,X+352,Y+150); }
  /* t: tempo em segundos (anima o carregamento e a entrada dos pop-ups) */
  window.pintaWin11=function(x,t){
    x.drawImage(wallpaper(),0,0);
    // ícones da área de trabalho
    x.font='400 12px Inter'; x.textAlign='center';
    ['Lixeira','Este Computador','Documentos'].forEach((n,i)=>{ x.fillStyle='rgba(255,255,255,.88)'; rr(x,30,26+i*92,40,36,6); x.fill(); x.fillStyle='#fff'; x.fillText(n,50,80+i*92); });
    janela(x,250,90,860,520,'Documentos - Explorador de Arquivos (Não está respondendo)',true);
    // conteúdo apagado da janela
    x.fillStyle='rgba(0,0,0,.08)'; for(let i=0;i<8;i++){ rr(x,280,150+i*48,360+(i*67)%300,22,4); x.fill(); }
    // cursor de carregamento (círculo de pontos do Windows)
    const pops=[[0,[360,170],'Explorador de Arquivos',['O Explorador de Arquivos não está respondendo','Se você fechar o programa, poderá perder informações.'],'Aguardar'],
                [.45,[520,300],'Aviso do sistema',['Memória insuficiente','Feche programas para liberar memória (4 GB).'],'OK'],
                [.9,[420,430],'Disco',['Uso do disco em 100%','O armazenamento de 64 GB está quase cheio.'],'Fechar']];
    pops.forEach(([d,[X,Y],ti,m,b])=>{ if(t>=d) erro(x,X,Y,ti,m,b); });
    taskbar(x,t);
    // cursor do mouse girando ao lado
    x.fillStyle='#fff'; x.beginPath(); x.moveTo(900,250); x.lineTo(900,272); x.lineTo(906,266); x.lineTo(911,277); x.lineTo(915,275); x.lineTo(910,264); x.lineTo(918,264); x.closePath(); x.fill(); x.strokeStyle='#000'; x.lineWidth=1; x.stroke();
    spinner(x,931,290,13,t,'#ffffff'); x.save(); x.shadowColor='rgba(0,0,0,.6)'; x.shadowBlur=8; spinner(x,931,290,13,t,'#ffffff'); x.restore();
  };

  function seta(x,X,Y){ x.fillStyle='#fff'; x.beginPath(); x.moveTo(X,Y); x.lineTo(X,Y+22); x.lineTo(X+6,Y+16); x.lineTo(X+11,Y+27); x.lineTo(X+15,Y+25); x.lineTo(X+10,Y+14); x.lineTo(X+18,Y+14); x.closePath(); x.fill(); x.strokeStyle='#000'; x.lineWidth=1.2; x.stroke(); }
  /* cena configurável: o = { t, cur:[x,y], busy, jan:{x,y,w,h,titulo,p,nr}, erro:{x,y,titulo,msg:[a,b],botao}, cont:'12 s', icones:true } */
  window.pintaWinCena=function(x,o){
    const t=o.t||0; x.drawImage(wallpaper(),0,0);
    x.font='400 12px Inter'; x.textAlign='center';
    const ics=[['Lixeira','#e9eef5'],['Este Computador','#9cc8ff'],['Documentos','#f4c44b'],['Navegador','#33c3ff'],['Fotos','#ff8a65']];
    ics.forEach(([n,c],i)=>{ x.fillStyle=c; rr(x,30,26+i*92,40,36,6); x.fill(); if(o.sel===i){ x.fillStyle='rgba(120,170,255,.35)'; rr(x,10,18+i*92,80,78,6); x.fill(); } x.fillStyle='#fff'; x.fillText(n,50,80+i*92); });
    if(o.jan&&o.jan.p>0){ const j=o.jan, q=Math.min(1,j.p); x.save(); x.globalAlpha=q; janela(x,j.x,j.y,j.w,j.h,j.titulo+(j.nr?' (Não está respondendo)':''),!!j.nr);
      if(!j.nr){ x.fillStyle='#fff'; x.fillRect(j.x,j.y+34,j.w,j.h-34); x.fillStyle='rgba(0,0,0,.18)'; x.font='400 14px Inter'; x.textAlign='center'; x.fillText('Carregando...',j.x+j.w/2,j.y+j.h/2+46); spinner(x,j.x+j.w/2,j.y+j.h/2,18,t,'#0067c0'); }
      x.restore(); }
    if(o.erro){ const e=o.erro; erro(x,e.x,e.y,e.titulo,e.msg,e.botao); }
    taskbar(x,t);
    if(o.cur){ const [X,Y]=o.cur; seta(x,X,Y); if(o.busy){ x.save(); x.shadowColor='rgba(0,0,0,.6)'; x.shadowBlur=8; spinner(x,X+31,Y+40,13,t,'#ffffff'); x.restore(); } }
  };
})();
