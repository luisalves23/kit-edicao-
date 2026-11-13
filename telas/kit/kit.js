/* KIT DE IDENTIDADE · @cobaia.dev · peças animadas do padrão dos 30 dias (base: Dia 4 v4, HyperFrames + GSAP)
   Uso: inclua gsap.min.js, data.js (W, CH, HIDE, TOTAL), kit.css e este arquivo. Tudo entra numa timeline GSAP pausada.
   Regra: peça que existe aqui NÃO se reescreve no vídeo. Peça nova e reaproveitável volta para cá no fim do vídeo.
   API resumida (detalhes em kit/LEIAME.md):
     const k = KIT.montar({dia:6, estacoes:8});            // DOM do palco + timeline pausada (k.tl) já registrada no HyperFrames
     k.T(i), k.E(i)                                        // início/fim da palavra i (data.js)
     KIT.camera(k, ST)                                     // passagens de câmera nos tempos ST[1..]
     KIT.calendario(k, {est:1, t:k.T(8), tTrinta:k.T(11)}) // vinheta "Dia X de 30", logo depois do gancho
     KIT.contador(k, {em:'#e0', ate:19000, t:0, mais:true, rotulo:'E-MAILS'})
     KIT.carimbo(k, {em:'#e3', texto:'PRONTOS', x:540, y:300, t:12.3})
     KIT.tela(k, {em:'#e2', nome:'claude-chat', id:'t1'})  // tela da biblioteca, sem moldura, com foco inclinado e cursor
     KIT.cta(k, {est:7, palavra:'MCP', t:{...}, dm:{...}}) // chamada final padrão
     KIT.loop(k, 59.28)                                    // rebobina até o frame 0
     KIT.fechar(k)                                         // legendas + registro; chamar por último
   Sons: cada peça registra seus efeitos em window.SFX = [nome, tempo, dB]; o mix lê essa lista (audio/sons.json). */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(html)=>{const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;};
const CUR='<svg class="cur" viewBox="0 0 30 42"><path d="M2 2 L2 34 L10 26 L15 39 L21 36 L16 24 L27 24 Z" fill="#fff" stroke="#111" stroke-width="2.4" stroke-linejoin="round"/></svg>';
const K={};
window.SFX=window.SFX||[];
K.ev=(n,t,db=-12,d)=>{const e=[n,+(+t).toFixed(3),db]; if(d) e.push(d); window.SFX.push(e);};

/* ---------- palco ---------- */
K.montar=function(o){
  const root=$('#root'), TOTAL=o.total||window.TOTAL, W=window.W||[], n=o.estacoes||1, dia=String(o.dia).padStart(2,'0');
  root.setAttribute('data-composition-id','main'); root.setAttribute('data-start','0'); root.setAttribute('data-duration',String(TOTAL));
  root.setAttribute('data-width','1080'); root.setAttribute('data-height','1920');
  const conteudo=[...root.children].filter(c=>c.tagName!=='AUDIO');   // estações escritas no HTML (.st)
  const pre=el('<div><div id="dots" class="abs"></div><div id="b1" class="abs blob"></div><div id="b2" class="abs blob"></div><canvas id="fx" class="abs" width="1080" height="1090"></canvas><div id="vp" class="abs"><div id="cam" class="abs"></div></div></div>');
  const cam=$('#cam',pre); let i=0;
  conteudo.forEach(c=>{ if(c.classList.contains('st')){ c.style.left=(i*1080)+'px'; if(!c.id) c.id='e'+i; cam.appendChild(c); i++; } });
  for(;i<n;i++) cam.appendChild(el(`<div class="st" id="e${i}" style="left:${i*1080}px"></div>`));
  cam.style.width=(Math.max(n,i)*1080)+'px';
  root.prepend(...pre.children);
  root.append(el('<div id="vig" class="abs" data-layout-allow-occlusion></div>'), el('<div id="grain" class="abs" data-layout-allow-occlusion></div>'),
    el('<div id="track" class="abs"></div>'), el('<div id="fill" class="abs"></div>'), el(`<div id="badge" class="abs">DIA ${dia}/30</div>`),
    el('<div id="handle" class="abs">@cobaia.dev</div>'), el('<div id="cap" class="abs"></div>'));
  const tl=gsap.timeline({paused:true});
  const k={tl,TOTAL,W,dia:+o.dia,n:Math.max(n,i),T:i=>W[i][1],E:i=>W[i][2],hide:[...(window.HIDE||[])],ST:[0]};
  // fundo vivo
  tl.fromTo('#dots',{x:0,y:0},{x:-360,y:-360,duration:TOTAL,ease:'none'},0);
  tl.fromTo('#b1',{x:0,y:0},{x:140,y:-90,duration:TOTAL,ease:'sine.inOut'},0);
  tl.fromTo('#b2',{x:0,y:0},{x:-160,y:-60,duration:TOTAL,ease:'sine.inOut'},0);
  // barra dinâmica: rápida no começo, quase parando no fim (K = ln 25). Não é literal e nunca se explica no vídeo.
  const KK=Math.log(25), bar=u=>(1-Math.exp(-KK*u))/(1-Math.exp(-KK)), pr={u:0};
  tl.fromTo(pr,{u:0},{u:1,duration:TOTAL,ease:'none',onUpdate:()=>gsap.set('#fill',{scaleX:Math.min(1,Math.max(0,bar(pr.u)))})},0);
  gsap.set('#fill',{scaleX:0});
  if(o.tBadge!=null) K.pulsoBadge(k,o.tBadge);
  return k;
};
K.pulsoBadge=(k,t)=>{k.tl.fromTo('#badge',{scale:1},{keyframes:[{scale:1.25,duration:.12},{scale:1,duration:.3,ease:'back.out(2)'}],immediateRender:false},t); K.ev('pop2',t,-10);};

/* ---------- câmera entre estações: 0,36 s, borrão <= 5 px, da esquerda para a direita ---------- */
K.camera=function(k,ST,sons){
  k.ST=ST; const S=sons||['whoosh','swoosh2','whoosh_up'];   // varia o som a cada corte; nunca o mesmo duas vezes seguidas
  for(let i=1;i<ST.length;i++){
    k.tl.fromTo('#cam',{x:-(i-1)*1080},{x:-i*1080,duration:.36,ease:'power3.inOut',immediateRender:false},ST[i]-.18);
    k.tl.fromTo('#cam',{filter:'blur(0px)'},{keyframes:[{filter:'blur(5px)',duration:.1},{filter:'blur(0px)',duration:.12}],ease:'none',immediateRender:false},ST[i]-.1);
    K.ev(S[(i-1)%S.length],ST[i]-.28,-12);
  }
};
/* loop: rebobina a câmera até a composição do frame 0 */
K.loop=function(k,t){ const d=Math.max(.2,k.TOTAL-t-.01);
  k.tl.fromTo('#cam',{x:-(k.ST.length-1)*1080},{x:0,duration:d,ease:'power3.in',immediateRender:false},t);
  k.tl.fromTo('#cam',{filter:'blur(0px)'},{filter:'blur(5px)',duration:d,ease:'none',immediateRender:false},t);
  K.ev('whoosh',t-.08,-9); k.fimLegenda=Math.min(k.fimLegenda??1e9,t-.03); };

/* ---------- surgimento de texto e gestos ---------- */
K.blurIn=(L,s,t,st=.09)=>L.fromTo(s,{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration:.14,stagger:st,ease:'expo.out'},t);
K.greyIn=(L,s,t)=>L.fromTo(s,{opacity:0,color:'#555',filter:'blur(4px)'},{opacity:1,color:(i,e)=>e.classList.contains('red')?'#FF2D2D':'#F2EEE6',filter:'blur(0px)',duration:.14,stagger:.09,ease:'power4.out'},t);
K.pop=(L,s,t,d=.3)=>L.fromTo(s,{opacity:0,scale:.5},{opacity:1,scale:1,duration:d,ease:'back.out(2)'},t);
K.typeIn=(L,sel,txt,t,d)=>{const o={n:0},e=typeof sel==='string'?$(sel):sel;L.fromTo(o,{n:0},{n:txt.length,duration:d,ease:'none',onUpdate:()=>{e.textContent=txt.slice(0,Math.round(o.n));}},t);};
K.teclas=(t,d,n,db=-14)=>{for(let i=0;i<n;i++) K.ev('key',t+i*d/n,db);};
K.count=(L,sel,a,b,t,d,fmt)=>{const o={v:a},e=$(sel);L.fromTo(o,{v:a},{v:b,duration:d,ease:'expo.out',onUpdate:()=>{const s=Math.round(o.v).toLocaleString('pt-BR');e.textContent=fmt?fmt(s):s;}},t);};
K.press=(L,s,t)=>L.fromTo(s,{scale:1},{keyframes:[{scale:.88,duration:.07},{scale:1.06,duration:.12},{scale:1,duration:.12}],immediateRender:false},t);
K.swap=(L,a,b,t)=>{L.fromTo(a,{opacity:1},{opacity:0,duration:.16,immediateRender:false},t);L.fromTo(b,{opacity:0},{opacity:1,duration:.18,immediateRender:false},t+.06);};
K.shake=(L,s,t,a=14)=>L.fromTo(s,{x:0,y:0},{keyframes:[{x:-a,y:a*.6,duration:.04},{x:a*.8,y:-a*.5,duration:.05},{x:-a*.5,y:a*.3,duration:.05},{x:a*.25,y:0,duration:.05},{x:0,y:0,duration:.05}],immediateRender:false},t);
/* lettering em perspectiva leve (sempre legível) */
K.persp=(L,sel,t0,d,a=1)=>L.fromTo(sel,{rotationY:14*a,rotationX:10,transformPerspective:900},{rotationY:-8*a,rotationX:4,transformPerspective:900,duration:d,ease:'sine.inOut',immediateRender:t0===0},t0);
/* varredura de luz no vidro ao entrar (Liquid Glass) */
K.vidro=(L,sel,t)=>L.fromTo(sel,{'--lgx':'140%'},{'--lgx':'-40%',duration:1.1,ease:'power3.out',immediateRender:false},t);
/* esconde a legenda enquanto o texto falado já está grande na tela (índices de palavra, inclusive) */
K.semLegenda=(k,a,z)=>k.hide.push([a,z]);

/* ---------- calendário dos 30 dias (vinheta, logo depois do gancho) ---------- */
K.calendario=function(k,o){
  /* igual ao Dia 5 (padrão dos Dias 1 a 5): título DIA NN, grade 6x5 inclinada em 3D com os 30 dias já visíveis,
     dia atual vermelho saltando pra frente, brilho correndo na grade e "30 experimentos com [Claude]". */
  const st=$('#e'+o.est), d=k.dia, dd=String(d).padStart(2,'0'); let g='';
  for(let i=1;i<=30;i++) g+=`<div class="cell glass${i<d?' done':''}${i===d?' now':''}">${String(i).padStart(2,'0')}</div>`;
  st.appendChild(el(`<div class="k-cal"><div class="k-luz"><i class="l1"></i><i class="l3"></i><i class="l2"></i></div><div class="ttl k-dia">DIA <span class="red">${dd}</span></div><div class="k-persp"><div class="k-grid">${g}</div></div><div class="k-sub">30 experimentos com <span class="appic"><img src="assets/img/claude-icon.jpg" /></span> Claude</div></div>`));
  const r='#e'+o.est+' ', L=k.tl, t=o.t, tt=o.tTrinta??t+.6, tc=o.tClaude??tt+.8, fim=o.fim??tt+2.4;
  L.fromTo(r+'.k-dia',{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration:.16,ease:'expo.out'},t-.05); K.ev('whoosh_up',t-.1,-15);
  K.pulsoBadge(k,t+.02);
  /* os 30 dias carregando: cada peça de vidro cai no lugar com um tique de vidro */
  const pas=o.passo??.024;
  L.fromTo(r+'.cell',{opacity:0,scale:.55,y:-50,rotationX:-50},{opacity:1,scale:1,y:0,rotationX:0,duration:.34,ease:'back.out(2.6)',stagger:pas},t);
  for(let i=0;i<30;i++) K.ev('vidro'+(1+(i*7)%3),t+.12+i*pas,-23+((i%5)===0?3:0));
  L.fromTo(r+'.cell',{'--lgx':'140%'},{'--lgx':'-40%',duration:1.1,ease:'power3.out',stagger:pas,immediateRender:false},t+.1);
  /* luz atrás da grade sempre em movimento (a lente precisa de conteúdo e movimento) */
  const dur=Math.max(2,(o.fim??(o.tTrinta??t+.6)+2.4)-t+.6);
  L.fromTo(r+'.k-luz .l1',{x:-60,y:40},{x:420,y:200,duration:dur,ease:'sine.inOut'},t-.3);
  L.fromTo(r+'.k-luz .l2',{x:60,y:0},{x:-380,y:-220,duration:dur,ease:'sine.inOut'},t-.3);
  L.fromTo(r+'.k-luz .l3',{x:0,y:0},{x:-200,y:260,duration:dur,ease:'sine.inOut'},t-.3);
  /* depois de carregar: onda que sai do dia atual e as peças de vidro balançando de leve até o fim */
  const tOnda=t+.12+30*pas+.1, g6={grid:[5,6],from:d-1};
  L.fromTo(r+'.cell',{scale:1},{keyframes:[{scale:1.14,duration:.12,ease:'power2.out'},{scale:1,duration:.3,ease:'back.out(3)'}],stagger:{...g6,each:.05},immediateRender:false},tOnda);
  for(let i=0;i<6;i++) K.ev('vidro'+(1+i%3),tOnda+i*.05,-26);
  L.fromTo(r+'.cell',{rotationY:0,rotationX:0},{keyframes:[{rotationY:14,rotationX:-8,duration:.55,ease:'sine.inOut'},{rotationY:-10,rotationX:6,duration:.6,ease:'sine.inOut'},{rotationY:8,rotationX:-4,duration:.6,ease:'sine.inOut'},{rotationY:0,rotationX:0,duration:.5,ease:'sine.inOut'}],stagger:{...g6,each:.03},immediateRender:false},tOnda+.3);
  L.fromTo(r+'.cell.now',{scale:1},{keyframes:[{scale:1.45,duration:.12},{scale:1.15,duration:.35,ease:'elastic.out(1,.6)'}],immediateRender:false},t+.12+30*pas); K.ev('pop2',t+.12+30*pas,-10);
  L.fromTo(r+'.cell:not(.now)',{boxShadow:'0 0 0 rgba(255,45,45,0)'},{keyframes:[{boxShadow:'0 0 26px rgba(255,45,45,.55)',duration:.12},{boxShadow:'0 0 0 rgba(255,45,45,0)',duration:.3}],stagger:.01,immediateRender:false},tt); K.ev('sparkle',tt,-14);
  L.fromTo(r+'.k-grid',{rotationX:22,rotationY:-10,scale:1.08},{rotationX:14,rotationY:8,scale:1.12,duration:Math.max(1.5,fim-t+.3),ease:'sine.inOut'},t-.2);
  L.fromTo(r+'.k-sub',{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration:.16,ease:'expo.out'},tt+.1);
  L.fromTo(r+'.k-sub .appic',{opacity:0,scale:0,rotation:-30},{opacity:1,scale:1,rotation:0,duration:.35,ease:'back.out(2.5)'},tc-.04); K.ev('pop',tc,-10); K.ev('sparkle',tc+.05,-16);
};

/* ---------- contador gigante (número exagerado) ---------- */
K.contador=function(k,o){
  const st=$(o.em), id=o.id||'odo', ate=o.ate, nd=String(Math.round(ate)).length; let h='';
  for(let p=nd-1;p>=0;p--){ h+=`<div class="oc" data-p="${p}"><div class="sp">${[0,1,2,3,4,5,6,7,8,9,0].map(n=>`<div>${n}</div>`).join('')}</div></div>`; if(p%3===0&&p>0) h+='<div class="odot">.</div>'; }
  st.appendChild(el(`<div class="k-odo" id="${id}" style="top:${o.y??0}px">${h}<div class="oplus">+</div></div>`));
  if(o.rotulo) st.appendChild(el(`<div class="k-olab" id="${id}l" style="top:${(o.y??0)+290}px">${o.rotulo}</div>`));
  const cols=$$('#'+id+' .oc'), odo={v:0}, L=o.tl||k.tl, t=o.t, d=o.d||1.1;
  const up=()=>{const v=odo.v; cols.forEach(c=>{const p=+c.dataset.p,P10=Math.pow(10,p); let off; if(p===0) off=v%10; else {const dg=Math.floor(v/P10)%10,r=(v%P10)/P10; off=dg+Math.max(0,(r-.9)*10);}
    c.firstChild.style.transform=`translateY(${-off*1.2}em)`; c.style.opacity=(v>=P10||p<=0)?1:.22;}); if(o.aoContar) o.aoContar(Math.round(v));};
  L.fromTo(odo,{v:0},{v:ate,duration:d,ease:'power3.out',onUpdate:up},t); up();
  for(let i=0;i<18;i++) K.ev('tick',t+d*(1-Math.pow(1-i/18,1/3))*.98,-13);
  if(o.mais) L.fromTo('#'+id+' .oplus',{opacity:0,scale:2.4},{opacity:1,scale:1,duration:.16,ease:'power4.in'},t+d+.04);
  K.shake(L,o.em,t+d+.2,16); K.ev('impact',t+d+.18,-6); K.ev('boom',t+d+.18,-12);
  L.fromTo('#'+id,{textShadow:'0 0 0 rgba(255,45,45,0)'},{keyframes:[{textShadow:'0 0 60px rgba(255,45,45,.9)',duration:.08},{textShadow:'0 10px 40px rgba(0,0,0,.6)',duration:.4}],immediateRender:false},t+d+.2);
  return '#'+id;
};

/* ---------- carimbo gasto ---------- */
K.carimbo=function(k,o){
  const st=$(o.em), id=o.id||('cb'+(K._n=(K._n||0)+1));
  st.appendChild(el(`<div class="abs" style="left:${o.x??540}px;top:${o.y??300}px"><div id="${id}" class="stamp${o.papel?' ink':''}" style="font-size:${o.tam||120}px;opacity:0">${o.texto}</div></div>`));
  const L=o.tl||k.tl, r=o.giro??-8;
  L.fromTo('#'+id,{opacity:0,scale:2.4,xPercent:-50,rotation:r},{opacity:1,scale:1,xPercent:-50,rotation:r,duration:.13,ease:'power4.in'},o.t);
  K.shake(L,o.em,o.t+.13,12); K.ev('impact',o.t+.1,-6);
  return '#'+id;
};

/* ---------- selo ✕ ao lado do elemento ---------- */
K.seloX=function(k,o){
  const st=$(o.em), id=o.id||('sx'+(K._n=(K._n||0)+1));
  st.appendChild(el(`<div class="selox" id="${id}" style="left:${o.x}px;top:${o.y}px;opacity:0"><svg viewBox="0 0 110 110"><path d="M35 35 L75 75"/><path d="M75 35 L35 75"/></svg></div>`));
  const L=o.tl||k.tl; K.pop(L,'#'+id,o.t,.26); L.to('#'+id+' path',{strokeDashoffset:0,duration:.14,stagger:.08},o.t+.1); K.ev('pop',o.t,-11);
  return '#'+id;
};

/* ---------- tela simulada da biblioteca: só o conteúdo, sem moldura, zoom inclinado no ponto falado ---------- */
K.tela=function(k,o){
  const T=window.TELAS&&window.TELAS[o.nome]; if(!T) throw new Error('tela "'+o.nome+'" não está na biblioteca (rode scripts/biblioteca.cjs)');
  if(!$('style[data-tela="'+o.nome+'"]')){const s=document.createElement('style');s.dataset.tela=o.nome;s.textContent=T.css;document.head.appendChild(s);}
  const st=$(o.em), id=o.id, w=o.w, h=o.h;
  st.appendChild(el(`<div class="sw" id="${id}" style="width:${w}px;height:${h}px"><div class="tilt"><div class="scr" style="width:${w}px;height:${h}px;background:${o.fundo||'#fff'}">${T.html}${CUR}</div></div></div>`));
  const sw='#'+id, ti=sw+' .tilt', cur=sw+' .cur', B=o.base||(848/w*1.15), cx=w/2, cy=h/2;
  const KZ=s=>B*(1+(s-1)*.33), TY=px=>-(px-cx)/cx*(o.inclY??12), TX=py=>7+(py-cy)/cy*7;
  const api={sel:sw, raiz:$(sw+' .scr').firstElementChild, cur,
    /* centro de um elemento da tela, em px da tela */
    P(sel,dx=0,dy=0){let e=$(sw+' '+sel); let x=e.offsetWidth/2,y=e.offsetHeight/2; const scr=$(sw+' .scr'); while(e&&e!==scr){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent;} return [x+dx,y+dy];},
    /* a tela inteira corre e inclina até (px,py) com zoom s. Raramente s=1 (tela inteira): só para visão geral. */
    foco(px,py,s,t,d=.4,yc=545,L=k.tl){const z=KZ(s); L.to(sw,{x:540-px*z,y:yc-py*z,scale:z,duration:d,ease:'power3.inOut'},t); L.to(ti,{rotationY:TY(px),rotationX:TX(py),transformPerspective:1700,duration:d,ease:'power3.inOut'},t);},
    focoSet(px,py,s,t,yc=545,L=k.tl){const z=KZ(s); L.set(sw,{x:540-px*z,y:yc-py*z,scale:z},t); L.set(ti,{rotationY:TY(px),rotationX:TX(py),transformPerspective:1700},t);},
    /* entrada girada (rotateY 25–40°, escala .8) assentando inclinada */
    entra(px,py,s,t,L=k.tl){const z=KZ(s); L.fromTo(sw,{opacity:0,x:540-px*z+500,y:545-py*z,scale:z*.8},{opacity:1,x:540-px*z,y:545-py*z,scale:z,duration:.42,ease:'power3.out'},t); L.fromTo(ti,{rotationY:-34,rotationX:6,transformPerspective:1700},{rotationY:TY(px),rotationX:TX(py),transformPerspective:1700,duration:.42,ease:'power3.out'},t);},
    cursorPara(xy,t,d=.35,L=k.tl){L.to(cur,{x:xy[0]-4,y:xy[1]-3,duration:d,ease:'power2.inOut'},t);},
    clique(t,som=true,L=k.tl){L.fromTo(cur,{scale:1},{keyframes:[{scale:.8,duration:.07},{scale:1,duration:.12}],transformOrigin:'4px 3px',immediateRender:false},t); if(som) K.ev('click',t,-8);}
  };
  gsap.set(sw,{opacity:0});
  return api;
};

/* ---------- chamada final: SEMPRE a do Dia 3 ----------
   t = { quer, sobre, claude, segue, seguiu, curte, comenta, palavra, palavraFim, mando, fim }  (segundos; use k.T(i))
   pergunta = ['QUER FAZER','O MESMO COM O SEU']  (opcional: quando a fala não é "Quer saber mais sobre o Claude?"; sem ícone, porque o Claude não é falado)
   dm = { texto:'Toma os pedidos...', itens:[{ic:'🧹', titulo:'Pedido 1', sub:'...'}] }  (até 2 itens) */
K.cta=function(k,o){
  const st=$('#e'+o.est), t=o.t, L=k.tl, P=(o.palavra||'').toUpperCase(), dm=o.dm||{texto:'',itens:[]};
  const itens=(dm.itens||[]).slice(0,2).map((it,i)=>`<div class="k-pcd" style="top:${300+i*180}px"><div class="ic">${it.ic||'📄'}</div><div><b>${it.titulo}</b><span>${it.sub||''}</span></div><div class="cp">${it.botao||'Copiar'}</div></div>`).join('');
  st.appendChild(el(`<div class="k-cta">
    <div class="cx k-qa1">${o.pergunta?o.pergunta[0]:'QUER SABER MAIS'}</div>
    <div class="cx k-qa2">${o.pergunta?`<span>${o.pergunta[1]}<span class="red">?</span></span>`:'<span>SOBRE O</span><img class="k-qi" src="assets/img/claude-icon.jpg" /><span>CLAUDE<span class="red">?</span></span>'}</div>
    <div class="cx k-av"><img src="assets/img/avatar.jpg" /><div class="k-apl"><svg class="k-apli" viewBox="0 0 40 40"><path d="M20 6v28M6 20h28" stroke="#F2EEE6" stroke-width="7" stroke-linecap="round"/></svg><svg class="k-achk" viewBox="0 0 40 40" style="opacity:0"><path d="M8 21l8 8 16-17" fill="none" stroke="#FF2D2D" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
    <div class="cx k-ahd">@cobaia.dev</div>
    <svg class="k-hrt" viewBox="0 0 100 100"><path d="M50 86 C 18 64, 6 46, 10 30 C 14 14, 36 8, 50 26 C 64 8, 86 14, 90 30 C 94 46, 82 64, 50 86 Z" fill="none" stroke="#F2EEE6" stroke-width="7" stroke-linejoin="round"/></svg>
    <div class="cx glass k-cin"><div class="ph">Adicione um comentário...</div><div class="tx"></div><div class="k-send"><svg viewBox="0 0 42 42"><path d="M21 34V9M10 19l11-11 11 11" fill="none" stroke="#F2EEE6" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
    <div class="cx glass k-dm"><div class="k-dmh"><img src="assets/img/avatar.jpg" /><div><b>cobaia.dev</b><span>agora</span></div></div><div class="k-dbub">${dm.texto||''}</div>${itens}</div>
    <div class="cx k-ce1">COMENTA</div><div class="cx k-ce2">${P}</div></div>`));
  const r='#e'+o.est+' ';
  gsap.set(r+'.cx',{xPercent:-50,yPercent:-50}); gsap.set(r+'.k-av,'+r+'.k-ahd,'+r+'.k-hrt,'+r+'.k-cin,'+r+'.k-dm,'+r+'.k-ce1,'+r+'.k-ce2,'+r+'.k-qa1,'+r+'.k-qa2',{opacity:0});
  // "QUER SABER MAIS / SOBRE O [ícone] CLAUDE?"
  L.fromTo(r+'.k-qa1',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.14,ease:'expo.out'},t.quer-.04);
  L.fromTo(r+'.k-qa2',{opacity:0,y:30},{opacity:1,y:0,duration:.26,ease:'expo.out'},t.sobre-.06);
  if(!o.pergunta) L.fromTo(r+'.k-qi',{scale:0,rotation:-150,boxShadow:'0 0 0 rgba(217,119,87,0)'},{scale:1,rotation:0,boxShadow:'0 0 60px rgba(217,119,87,.5)',duration:.42,ease:'back.out(2)'},t.claude-.16); if(!o.pergunta) K.ev('pop2',t.claude-.12,-10);
  L.to(r+'.k-qa1,'+r+'.k-qa2',{y:-60,opacity:0,duration:.17,ease:'power2.in'},t.segue-.2);
  // seguir: avatar centralizado, "+" vira ✓
  L.fromTo(r+'.k-av',{opacity:0,scale:.5},{opacity:1,scale:1,duration:.36,ease:'back.out(1.8)'},t.segue-.05);
  L.fromTo(r+'.k-ahd',{opacity:0},{opacity:1,duration:.25},t.segue-.05);
  L.set(r+'.k-apli',{opacity:0},t.seguiu); L.set(r+'.k-achk',{opacity:1},t.seguiu); L.set(r+'.k-apl',{backgroundColor:'#F2EEE6'},t.seguiu);
  L.fromTo(r+'.k-apl',{scale:1},{keyframes:[{scale:1.35,duration:.08},{scale:1,duration:.2}],immediateRender:false},t.seguiu); K.ev('coin',t.seguiu,-8); K.ev('crackle',t.seguiu+.05,-12);
  // curtir: avatar desliza, coração branco fica vermelho
  L.to(r+'.k-av',{x:-240,scale:.78,duration:.3,ease:'power2.inOut'},t.curte-.06);
  L.to(r+'.k-ahd',{opacity:0,duration:.2},t.curte-.1);
  L.fromTo(r+'.k-hrt',{opacity:0,scale:0,xPercent:-50,yPercent:-50},{opacity:1,scale:1,xPercent:-50,yPercent:-50,duration:.32,ease:'back.out(2)'},t.curte-.02);
  L.set(r+'.k-hrt path',{attr:{fill:'#FF2D2D',stroke:'#FF2D2D'}},t.curte+.18);
  L.fromTo(r+'.k-hrt',{scale:1},{keyframes:[{scale:1.3,duration:.1},{scale:1,duration:.2}],immediateRender:false},t.curte+.18); K.ev('heart',t.curte+.18,-8);
  L.to(r+'.k-av,'+r+'.k-hrt',{opacity:0,scale:.5,duration:.16},t.comenta-.04);
  // comentar: só o campo de vidro digitando a palavra
  L.fromTo(r+'.k-cin',{opacity:0,y:60},{opacity:1,y:0,duration:.24,ease:'expo.out'},t.comenta+.06); K.vidro(L,r+'.k-cin',t.comenta+.06);
  L.set(r+'.k-cin .ph',{display:'none'},t.palavra);
  const dp=Math.max(.2,t.palavraFim-t.palavra-.05); K.typeIn(L,r+'.k-cin .tx',P,t.palavra,dp); K.teclas(t.palavra,dp,P.length,-13);
  L.set(r+'.k-send',{backgroundColor:'#FF2D2D'},t.palavraFim-.05);
  K.press(L,r+'.k-send',t.palavraFim+.08); K.ev('swoosh2',t.palavraFim+.08,-11);
  L.to(r+'.k-cin .tx',{y:-80,opacity:0,duration:.22},t.palavraFim+.1);
  // cartão da mensagem com o material
  L.to(r+'.k-cin',{y:-80,opacity:0,duration:.16},t.mando+.05);
  L.fromTo(r+'.k-dm',{opacity:0,y:120},{opacity:1,y:0,duration:.32,ease:'expo.out'},t.mando+.12); K.vidro(L,r+'.k-dm',t.mando+.12); K.ev('notification',t.mando+.12,-9);
  $$(r+'.k-pcd').forEach((e,i)=>{L.fromTo(e,{opacity:0,scale:.8},{opacity:1,scale:1,duration:.3,ease:'back.out(2)'},t.mando+.5+i*.25); K.ev('pop',t.mando+.5+i*.25,-11);});
  // "COMENTA / PALAVRA" gigante
  L.to(r+'.k-dm',{y:-200,scale:.75,opacity:0,duration:.2,ease:'power2.in'},t.fim-.1);
  L.fromTo(r+'.k-ce1',{opacity:0,scale:1.6},{opacity:1,scale:1,duration:.14,ease:'expo.out'},t.fim);
  L.fromTo(r+'.k-ce2',{opacity:0,scale:1.8,rotation:-3},{opacity:1,scale:1,rotation:-3,duration:.14,ease:'expo.out'},t.fim+.12); K.ev('impact',t.fim+.12,-9);
  L.fromTo(r+'.k-ce2',{rotation:-3},{keyframes:[{rotation:-1,duration:.12},{rotation:-4,duration:.12},{rotation:-3,duration:.1}],immediateRender:false},t.fim+.26);
  k.fimLegenda=Math.min(k.fimLegenda??1e9,t.fim);
  K.persp(L,r+'.k-qa1,'+r+'.k-qa2',t.quer-.04,1.3,1); K.persp(L,r+'.k-ce1,'+r+'.k-ce2',t.fim,1,-1);
};

/* ---------- legendas + registro no HyperFrames (chamar por último) ---------- */
K.fechar=function(k){
  const cap=$('#cap'), W=k.W, CH=window.CH||[], HIDE=k.hide, cs={t:0}, fim=k.fimLegenda??k.TOTAL;
  k.tl.fromTo(cs,{t:0},{t:k.TOTAL,duration:k.TOTAL,ease:'none',onUpdate:()=>{
    const t=cs.t; let html='';
    for(let b=0;b<CH.length;b++){const ws=CH[b], s=W[ws[0]][1]-.05, nx=b+1<CH.length?W[CH[b+1][0]][1]-.05:k.TOTAL;
      if(t>=s&&t<nx){ if(HIDE.some(([a,z])=>ws[0]>=a&&ws[0]<=z)) break;
        html=ws.map(i=>{const on=t>=W[i][1]-.03&&(t<W[i][2]||i===ws[ws.length-1]||t<W[i+1][1]);return `<span class="cw" style="opacity:${on?1:.8};box-shadow:${on?'inset 0 -7px 0 #FF2D2D':'none'}">${W[i][0]}</span>`;}).join('');
        break;}}
    if(t>fim) html='';
    if(cap.innerHTML!==html) cap.innerHTML=html;
  }},0);
  if(window.LG) window.LG();
  window.__timelines=window.__timelines||{}; window.__timelines['main']=k.tl; k.tl.seek(0);
  /* fora do HyperFrames: ?t=12.3 mostra o tempo 12,3 s (storyboard e conferência) */
  const q=new URLSearchParams(location.search); if(q.has('t')) k.tl.seek(+q.get('t'));
  window.renderAt=t=>k.tl.seek(t); window.READY=true;
};
window.KIT=K;
})();
