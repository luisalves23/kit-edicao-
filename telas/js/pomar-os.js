/* Pomar OS simulado (Dia 6). Tela 1366x768 em DOM.
   uso: const os = POMAR.criar(container, {img:'assets/img/'});
   os.dock(mx|null)  lupa do dock pela posição x do mouse (px da tela)
   os.cursor(x,y,clique)  cursor branco (clique 0..1 encolhe)
   os.central(p)  central de controle 0..1
   os.janela(nome, p, opc)  abre janela 0..1 (escala + opacidade). nomes: term, claude, ff, arq, aj, mon, calc, play
   os.el  raiz */
(function(){
const CSS = `
.po{position:absolute;left:0;top:0;width:1366px;height:768px;overflow:hidden;font-family:Inter,system-ui,sans-serif;background:#2b2a8a;color:#1d1d1f;transform-origin:0 0}
.po *{box-sizing:border-box}
.po .wp{position:absolute;inset:0;background-size:cover;background-position:center}
.po .top{position:absolute;left:0;top:0;right:0;height:28px;display:flex;align-items:center;padding:0 14px 0 16px;font-size:13.5px;font-weight:500;color:#2a2a30;z-index:50}
.po .top .nm{font-weight:600}
.po .top .sp{flex:1}
.po .top .ic{display:flex;gap:15px;align-items:center;margin-right:16px}
.po .top svg{width:15px;height:15px;display:block}
.po .top .hr{font-weight:500;letter-spacing:.1px}
.po .dock{position:absolute;bottom:9px;left:50%;transform:translateX(-50%);height:66px;padding:0 9px;display:flex;align-items:flex-end;gap:7px;padding-bottom:8px;border-radius:20px;z-index:60;
  background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.2));border:1px solid rgba(255,255,255,.55);box-shadow:0 10px 30px rgba(20,10,60,.28),inset 0 1px 0 rgba(255,255,255,.7);backdrop-filter:blur(14px) saturate(1.4)}
.po .di{width:50px;height:50px;border-radius:12px;position:relative;flex:none;transform-origin:50% 100%;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 2px 5px rgba(0,0,0,.18)}
.po .di svg{width:62%;height:62%}
.po .di img{width:100%;height:100%;object-fit:cover}
.po .di .tip{display:none}
.po .dtip{position:absolute;bottom:92px;transform:translateX(-50%);padding:4px 10px;border-radius:8px;font-size:12.5px;font-weight:500;color:#222;background:rgba(255,255,255,.75);backdrop-filter:blur(10px);box-shadow:0 4px 14px rgba(0,0,0,.15);opacity:0;z-index:61;white-space:nowrap}
.po .dot{position:absolute;bottom:2px;width:4px;height:4px;border-radius:50%;background:rgba(30,30,40,.7);opacity:0}
.po .cc{position:absolute;right:10px;top:36px;width:344px;padding:12px;border-radius:22px;z-index:55;transform-origin:85% 0;
  background:linear-gradient(180deg,rgba(255,255,255,.42),rgba(235,232,255,.3));border:1px solid rgba(255,255,255,.6);box-shadow:0 18px 40px rgba(30,20,80,.3);backdrop-filter:blur(20px) saturate(1.5);opacity:0}
.po .cc .r1{display:flex;gap:8px}
.po .cc .bx{border-radius:16px;background:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.55)}
.po .cc .wf{width:150px;height:120px;padding:12px}
.po .cc .wf .bi{width:26px;height:26px;border-radius:50%;background:#1a73e8;display:flex;align-items:center;justify-content:center}
.po .cc .wf b{display:block;font-size:13px;font-weight:600;margin-top:10px}
.po .cc .wf span{font-size:11px;color:#6b6b74}
.po .cc .tg{flex:1;padding:6px 8px;display:flex;flex-direction:column;gap:5px}
.po .cc .tg div{display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:12.5px;font-weight:500;height:32px}
.po .cc .tg i{width:26px;height:26px;border-radius:8px;background:rgba(120,120,135,.18);display:flex;align-items:center;justify-content:center}
.po .cc .tg i.on{background:#1a73e8}
.po .cc .sl{margin-top:8px;padding:10px 12px;height:76px}
.po .cc .sl b{font-size:12.5px;font-weight:600}
.po .cc .sl .tr{margin-top:12px;display:flex;align-items:center;gap:10px}
.po .cc .sl .bar{flex:1;height:22px;border-radius:11px;background:rgba(255,255,255,.55);position:relative;border:1px solid rgba(255,255,255,.7)}
.po .cc .sl .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:11px;background:linear-gradient(90deg,#f6f5fa,#fff)}
.po .cc .sl .bar s{position:absolute;top:-1px;width:23px;height:23px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25)}
.po .cc .bt{margin-top:8px;padding:9px 12px;display:flex;gap:10px;align-items:center;font-size:12.5px;font-weight:600}
.po .cc .bt span{display:block;font-size:10.5px;font-weight:400;color:#6b6b74}
.po .cc .bs{margin-top:8px;display:flex;gap:6px}
.po .cc .bs div{flex:1;height:34px;border-radius:12px;background:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.55);font-size:11.5px;color:#55555e;display:flex;align-items:center;justify-content:center}
.po .w{position:absolute;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 22px 50px rgba(20,10,60,.38),0 0 0 1px rgba(0,0,0,.08);opacity:0;z-index:20;transform-origin:50% 100%}
.po .w .hd{height:32px;display:flex;align-items:center;padding:0 12px;gap:7px;background:#f3f3f5;border-bottom:1px solid #e3e3e8;font-size:12.5px;font-weight:600;color:#4a4a52;position:relative}
.po .w .hd i{width:12px;height:12px;border-radius:50%;background:#ff5f57}
.po .w .hd i:nth-child(2){background:#febc2e}.po .w .hd i:nth-child(3){background:#28c840}
.po .w .hd span{position:absolute;left:0;right:0;text-align:center;pointer-events:none}
.po .w.dk{background:#141416}.po .w.dk .hd{background:#232326;border-color:#000;color:#bbb}
.po .term{padding:12px 16px;font-family:Mono,monospace;font-size:13px;line-height:1.55;color:#e8e8e8}
.po .term .g{color:#7ee787}.po .term .o{color:#d97757}.po .term .m{color:#8b8b93}
.po .cur{position:absolute;width:22px;height:30px;z-index:90;pointer-events:none;transform-origin:3px 3px}
.po .cur svg{width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
.po .spin{position:absolute;width:18px;height:18px;border-radius:50%;border:3px solid rgba(0,0,0,.12);border-top-color:#1a73e8}

.po .ff{position:absolute;inset:0;background:#f9f9fb}
.po .ff .tabs{height:34px;background:#ecebf0;display:flex;align-items:flex-end;padding:0 8px;gap:4px}
.po .ff .tab{height:28px;padding:0 12px;border-radius:8px 8px 0 0;background:#fff;font-size:12px;display:flex;align-items:center;gap:7px;min-width:180px}
.po .ff .tab.o{background:transparent;color:#666}
.po .ff .url{height:38px;background:#fff;border-bottom:1px solid #e4e4ea;display:flex;align-items:center;padding:0 10px;gap:10px}
.po .ff .url div{flex:1;height:28px;border-radius:8px;background:#f0f0f4;font-size:12.5px;display:flex;align-items:center;padding:0 12px;color:#333}
.po .ff .pg{position:absolute;left:0;right:0;top:72px;bottom:0;padding:26px 40px}
.po .ff .hero{height:150px;border-radius:14px;background:linear-gradient(120deg,#1d1d1f,#3a1d22);color:#fff;padding:24px;font:700 26px Inter}
.po .ff .hero span{display:block;font:400 14px Inter;opacity:.7;margin-top:8px}
.po .ff .cards{display:flex;gap:14px;margin-top:16px}.po .ff .cards div{flex:1;height:110px;border-radius:12px;background:#eceaf2}
.po .arqb{position:absolute;inset:0;display:flex}
.po .arqb .sd{width:170px;background:#f2f2f6;padding:14px 10px;font-size:12.5px;color:#555;display:flex;flex-direction:column;gap:9px}
.po .arqb .sd b{color:#1a73e8;font-weight:600}
.po .arqb .gr{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:20px;align-content:start}
.po .arqb .gr div{display:flex;flex-direction:column;align-items:center;font-size:11.5px;gap:6px;color:#333}
.po .arqb .gr i{width:60px;height:46px;border-radius:8px;background:linear-gradient(180deg,#5aa8ff,#2b7cf0)}
.po .ajb{position:absolute;inset:0;display:flex}
.po .ajb .sd{width:180px;background:#f2f2f6;padding:12px 8px;display:flex;flex-direction:column;gap:4px;font-size:12.5px}
.po .ajb .sd div{padding:7px 10px;border-radius:8px}.po .ajb .sd .on{background:#1a73e8;color:#fff}
.po .ajb .ct{flex:1;padding:18px 22px}.po .ajb .rw{height:44px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;font-size:13px}
.po .ajb .tg{width:38px;height:22px;border-radius:11px;background:#34c759;position:relative}.po .ajb .tg:after{content:'';position:absolute;right:2px;top:2px;width:18px;height:18px;border-radius:50%;background:#fff}
.po .monb{position:absolute;inset:0;background:#151517;color:#ddd;padding:16px 18px;font-size:12px}
.po .monb .gf{height:70px;margin:6px 0 14px;border-radius:8px;background:#1f1f22;position:relative;overflow:hidden}
.po .monb .gf svg{position:absolute;inset:0;width:100%;height:100%}
.po .monb b{font-size:13px;color:#fff}.po .monb .v{float:right;color:#34d27a;font-weight:700}
.po .calcb{position:absolute;inset:0;background:#1c1c1e;padding:12px;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:70px repeat(5,1fr);gap:8px}
.po .calcb .d{grid-column:1/5;color:#fff;font:300 44px Inter;text-align:right;padding-right:6px}
.po .calcb div:not(.d){border-radius:50%;background:#333;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px}
.po .calcb .op{background:#ff9f0a!important}
.po .cine{position:absolute;inset:0;background:#0b0b0f;color:#fff;padding:18px 22px}
.po .cine h3{margin:0 0 12px;font:800 22px Inter;letter-spacing:.5px}
.po .cine .row{display:flex;gap:12px}.po .cine .pt{width:150px;height:210px;border-radius:10px;background-size:cover;background-position:center;flex:none;position:relative}
.po .cine .pt b{position:absolute;left:8px;bottom:8px;font:700 13px Inter;text-shadow:0 1px 4px #000}
.po .cine .lb{font:600 13px Inter;color:#aaa;margin:14px 0 8px}
.po .play{position:absolute;inset:0;background:#000;opacity:0;z-index:70}
.po .play video{position:absolute;left:0;top:50%;width:100%;transform:translateY(-50%)}
.po .play .hud{position:absolute;left:24px;right:24px;bottom:18px;height:4px;border-radius:2px;background:rgba(255,255,255,.25)}
.po .play .hud i{position:absolute;left:0;top:0;bottom:0;width:38%;background:#e50914;border-radius:2px}
.po .cc2{font-family:Mono,monospace;font-size:13px;line-height:1.6;color:#e8e8e8;padding:12px 16px}
.po .cc2 .bx{border:1px solid #d97757;border-radius:6px;padding:8px 12px;display:flex;gap:12px;align-items:center;margin-bottom:10px}
.po .cc2 .cr{width:34px;height:22px;background:#d97757;border-radius:3px;position:relative}
.po .cc2 .cr:before,.po .cc2 .cr:after{content:'';position:absolute;top:6px;width:4px;height:4px;background:#1a1a1a}.po .cc2 .cr:before{left:9px}.po .cc2 .cr:after{right:9px}
.po .cc2 .ln{display:flex;align-items:center;gap:10px;height:24px}
.po .cc2 .ln s{display:inline-block;height:9px;border-radius:3px;background:#5b5b63;text-decoration:none}
.po .cc2 .mk{width:14px;font-weight:800}
.po .cc2 .x{color:#ff5f57}.po .cc2 .ok{color:#28c840}
`;
const ic = {
  spark:'<svg viewBox="0 0 24 24"><path d="M12 2.5c.6 4.8 3.2 7.6 9.5 9.5-6.3 1.9-8.9 4.7-9.5 9.5-.6-4.8-3.2-7.6-9.5-9.5 6.3-1.9 8.9-4.7 9.5-9.5z" fill="#fff"/></svg>',
  ff:'<svg viewBox="0 0 48 48"><defs><radialGradient id="pof" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#ffe226"/><stop offset=".45" stop-color="#ff7139"/><stop offset=".8" stop-color="#e31587"/><stop offset="1" stop-color="#9059ff"/></radialGradient><radialGradient id="pog" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#7a4dff"/><stop offset="1" stop-color="#3b1ea3"/></radialGradient></defs><circle cx="24" cy="25" r="19" fill="url(#pof)"/><circle cx="25" cy="26" r="11" fill="url(#pog)"/><path d="M9 14c3 9 10 13 16 13 6 0 10-3 11-8 2 8-4 17-13 17-10 0-17-9-14-22z" fill="#ff8a1f" opacity=".95"/></svg>',
  g:'<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.6 7l7.4 5.8c4.3-4 6.9-9.9 6.9-17.3z"/><path fill="#FBBC05" d="M10.5 28.6A14.4 14.4 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.8c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>',
  yt:'<svg viewBox="0 0 48 48"><rect x="4" y="11" width="40" height="27" rx="8" fill="#ff0000"/><path d="M20 18l11 6.5L20 31z" fill="#fff"/></svg>',
  arq:'<svg viewBox="0 0 48 48"><path d="M5 13a4 4 0 0 1 4-4h10l4 4h16a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="#1b6fe0"/><path d="M5 19h38v18a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="#4fa3ff"/></svg>',
  term:'<svg viewBox="0 0 24 24"><path d="M5 7.5l4.5 3.5L5 14.5" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 15.5h6" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/></svg>',
  busca:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M14.6 14.6l4.6 4.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>',
  mon:'<svg viewBox="0 0 24 24"><path d="M2.5 12.5h4l2-5 3.5 10 3-8 1.8 3h4.7" fill="none" stroke="#34d27a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  aj:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="none" stroke="#5f6670" stroke-width="5" stroke-dasharray="4.2 2.4"/><circle cx="24" cy="24" r="12" fill="#c9ced5" stroke="#6f7680" stroke-width="2"/><circle cx="24" cy="24" r="4.5" fill="#6f7680"/><path d="M24 12v8M24 28v8M12 24h8M28 24h8" stroke="#6f7680" stroke-width="2"/></svg>'
};
const DOCK = [
  {id:'claude',  nome:'Claude',      bg:'linear-gradient(160deg,#e9875f,#c9643f)', h:ic.spark},
  {id:'code',    nome:'Claude Code', bg:'#d97757', img:'claude-icon.jpg'},
  {id:'ff',      nome:'Firefox',     bg:'linear-gradient(180deg,#fff,#eef0f4)', h:ic.ff},
  {id:'g',       nome:'Google',      bg:'linear-gradient(180deg,#fff,#eef0f4)', h:ic.g},
  {id:'yt',      nome:'YouTube',     bg:'linear-gradient(180deg,#fff,#eef0f4)', h:ic.yt},
  {id:'arq',     nome:'Arquivos',    bg:'linear-gradient(180deg,#e9f2ff,#cfe2ff)', h:ic.arq},
  {id:'term',    nome:'Terminal',    bg:'linear-gradient(180deg,#2a2a2e,#0d0d0f)', h:ic.term},
  {id:'busca',   nome:'Buscar',      bg:'linear-gradient(180deg,#5ab0ff,#1f6fe6)', h:ic.busca},
  {id:'mon',     nome:'Monitor',     bg:'linear-gradient(180deg,#26262a,#0c0c0e)', h:ic.mon},
  {id:'aj',      nome:'Ajustes',     bg:'linear-gradient(180deg,#e4e7eb,#aeb5be)', h:ic.aj}
];
const top = `<div class="top"><span class="nm">Pomar</span><span class="sp"></span><div class="ic">
<svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10L5 10H2z" fill="#333"/><path d="M11 5.5c1 1.4 1 3.6 0 5M12.8 4c1.8 2.3 1.8 5.7 0 8" stroke="#333" stroke-width="1.2" fill="none" stroke-linecap="round"/></svg>
<svg viewBox="0 0 16 16"><path d="M1 6.2a10 10 0 0 1 14 0M3.3 8.6a6.6 6.6 0 0 1 9.4 0M5.6 11a3.2 3.2 0 0 1 4.8 0" stroke="#333" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="8" cy="13.2" r="1.1" fill="#333"/></svg>
<svg viewBox="0 0 16 16"><rect x="5" y="1.5" width="6" height="13" rx="1.5" fill="none" stroke="#e0352b" stroke-width="1.3"/><rect x="6.5" y="10.5" width="3" height="2.6" fill="#e0352b"/></svg>
<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#333" stroke-width="1.3"/><path d="M8 2a6 6 0 0 1 0 12z" fill="#333"/></svg>
<svg viewBox="0 0 16 16"><rect x="1.5" y="5" width="13" height="6" rx="3" fill="#333"/><circle cx="11.5" cy="8" r="2.2" fill="#fff"/></svg>
</div><span class="hr">qua 11 nov&nbsp;&nbsp;15:29</span></div>`;
const cc = `<div class="cc"><div class="r1"><div class="bx wf"><div class="bi"><svg viewBox="0 0 16 16" width="15"><path d="M1 6.2a10 10 0 0 1 14 0M3.3 8.6a6.6 6.6 0 0 1 9.4 0M5.6 11a3.2 3.2 0 0 1 4.8 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="8" cy="13.2" r="1.2" fill="#fff"/></svg></div><b>Wi-Fi</b><span>Conectado</span></div>
<div class="bx tg"><div><i><svg viewBox="0 0 16 16" width="13"><path d="M10 2a6 6 0 1 0 4 10A5 5 0 0 1 10 2z" fill="#333"/></svg></i>Modo Escuro</div><div><i class="on"><svg viewBox="0 0 16 16" width="14"><rect x="2.5" y="3" width="11" height="9" rx="1.5" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M5 10h6" stroke="#fff" stroke-width="1.4"/></svg></i>Touchpad</div><div><i><svg viewBox="0 0 16 16" width="13"><path d="M4 11V7a4 4 0 0 1 8 0v4l1.5 1.5h-11zM2 2l12 12" stroke="#555" stroke-width="1.2" fill="none"/></svg></i>Não incomodar</div></div></div>
<div class="bx sl"><b>Tela</b><div class="tr"><svg viewBox="0 0 16 16" width="13"><circle cx="8" cy="8" r="3" fill="#333"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6L13 13M3 13l1.4-1.4M11.6 4.4L13 3" stroke="#333" stroke-width="1.2"/></svg><div class="bar"><i style="width:96%"></i><s style="left:calc(96% - 23px)"></s></div></div></div>
<div class="bx sl"><b>Som</b><div class="tr"><svg viewBox="0 0 16 16" width="13"><path d="M2 6h3l4-3v10L5 10H2z" fill="#333"/><path d="M11 5.5c1 1.4 1 3.6 0 5" stroke="#333" stroke-width="1.2" fill="none"/></svg><div class="bar"><i style="width:84%"></i><s style="left:calc(84% - 23px)"></s></div></div></div>
<div class="bx bt"><svg viewBox="0 0 20 12" width="20"><rect x=".7" y=".7" width="16" height="10.6" rx="2.5" fill="none" stroke="#333" stroke-width="1.2"/><rect x="2.3" y="2.3" width="4" height="7.4" rx="1" fill="#e0352b"/><rect x="17.5" y="4" width="1.8" height="4" rx=".8" fill="#333"/></svg><div>Bateria 100%<span>8h36 restantes</span></div></div>
<div class="bs"><div>Ajustes</div><div>Bloquear</div><div>Captura</div></div></div>`;
const cursor = `<div class="cur"><svg viewBox="0 0 22 30"><path d="M2 2v22l6-5.5 4 9 3.5-1.6-4-8.6H19z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg></div>`;
window.POMAR = { css:CSS, ic, DOCK,
 criar(host, o={}){
  const img=o.img||'assets/img/';
  if(!document.getElementById('po-css')){const s=document.createElement('style');s.id='po-css';s.textContent=CSS;document.head.appendChild(s);}
  const el=document.createElement('div');el.className='po';
  el.innerHTML=`<div class="wp" style="background-image:url(${img}pomar-ondas.jpg)"></div>${top}<div class="wins"></div>${cc}<div class="dtip"></div><div class="dock">${DOCK.map(d=>`<div class="di" data-id="${d.id}" style="background:${d.bg}">${d.img?`<img src="${img}${d.img}">`:d.h}<s class="dot"></s></div>`).join('')}</div>${cursor}`;
  host.appendChild(el);
  const dock=el.querySelector('.dock'), items=[...el.querySelectorAll('.di')], tip=el.querySelector('.dtip'), cur=el.querySelector('.cur'), ccEl=el.querySelector('.cc'), wins=el.querySelector('.wins');
  const base=50, gap=7, pad=9, W0=items.length*base+(items.length-1)*gap+pad*2;
  const api={el, wins,
   centro(id){const i=DOCK.findIndex(d=>d.id===id);return {x:683-W0/2+pad+i*(base+gap)+base/2, y:768-9-8-base/2};},
   dock(mx, mostraTip=true){
     let tot=pad*2-gap, best=-1,bs=0;
     const sc=items.map((it,i)=>{const cx=683-W0/2+pad+i*(base+gap)+base/2;const d=mx==null?999:Math.abs(mx-cx);const s=1+0.75*Math.max(0,Math.cos(Math.min(1,d/150)*Math.PI/2))**2;if(s>bs){bs=s;best=i;}return s;});
     sc.forEach(s=>tot+=base*s+gap);
     dock.style.width=Math.max(W0,tot)+'px';
     items.forEach((it,i)=>{it.style.width=it.style.height=(base*sc[i])+'px';it.style.borderRadius=(12*sc[i])+'px';});
     if(mostraTip&&mx!=null&&bs>1.5){const it=items[best];tip.textContent=DOCK[best].nome;const r=it.offsetLeft+dock.offsetLeft-dock.offsetWidth/2+it.offsetWidth/2;tip.style.left=r+'px';tip.style.bottom=(9+8+base*bs+18)+'px';tip.style.opacity=Math.min(1,(bs-1.5)*4);}else tip.style.opacity=0;
   },
   ponto(id,on=1){const it=items[DOCK.findIndex(d=>d.id===id)];it.querySelector('.dot').style.opacity=on;},
   pulo(id,p){const it=items[DOCK.findIndex(d=>d.id===id)];it.style.transform=`translateY(${-Math.sin(Math.PI*Math.min(1,p*2%1||0))*18*(p<1?1:0)}px)`;},
   cursor(x,y,cl=0,vis=1){cur.style.left=x+'px';cur.style.top=y+'px';cur.style.transform=`scale(${1-.18*cl})`;cur.style.opacity=vis;},
   central(p){ccEl.style.opacity=Math.min(1,p*1.6);ccEl.style.transform=`scale(${.92+.08*p}) translateY(${(1-p)*-8}px)`;},
   janela(w, p, de){ // de: {x,y} ponto do dock de onde a janela nasce
     w.style.opacity=Math.min(1,p*2.2);
     const q=1-Math.pow(1-Math.min(1,p),3);
     if(de){const r=w.getBoundingClientRect?null:null;const cx=parseFloat(w.style.left)+w.offsetWidth/2,cy=parseFloat(w.style.top)+w.offsetHeight;w.style.transform=`translate(${(de.x-cx)*(1-q)}px,${(de.y-cy)*(1-q)}px) scale(${.12+.88*q})`;}
     else w.style.transform=`scale(${.9+.1*q})`;
   },
   nova(cls, x,y,w,h, titulo, corpo){const d=document.createElement('div');d.className='w '+cls;Object.assign(d.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});d.innerHTML=`<div class="hd"><i></i><i></i><i></i><span>${titulo}</span></div><div class="bd" style="position:absolute;left:0;right:0;top:32px;bottom:0">${corpo||''}</div>`;wins.appendChild(d);return d;}
  };
  api.dock(null);api.cursor(700,400,0,0);api.central(0);
  return api;
 }
};
})();
