## 12. Código base

Helper de posição (todas as animações passam por ele):

```js
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), p=(t,s,d)=>cl((t-s)/d);
const eo=x=>1-Math.pow(1-x,3), eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2, lerp=(a,b,x)=>a+(b-a)*x;
const eb=x=>{if(x<=0)return 0;if(x>=1)return 1;const c1=1.9,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
function put(id,o){const e=typeof id==='string'?document.getElementById(id):id;
  const x=o.x??0,y=o.y??0,s=o.s??1,r=o.r??0,ax=o.ax??.5,ay=o.ay??.5;
  let tf=`translate(${x}px,${y}px) translate(${-ax*100}%,${-ay*100}%)`;
  if(o.rx||o.ry) tf+=` perspective(1800px) rotateX(${o.rx||0}deg) rotateY(${o.ry||0}deg)`;
  tf+=` rotate(${r}deg) scale(${s*(o.sx??1)},${s*(o.sy??1)})`;
  e.style.transform=tf; const op=o.o??1; e.style.opacity=op; e.style.visibility=op<=.002?'hidden':'visible';}
// câmera entre estações (STT = início de cada estação, em segundos)
const PAN=.36; function camX(t){let i=0;for(let k=0;k<STT.length;k++)if(t>=STT[k])i=k;
  if(i>0&&t<STT[i]+PAN)return lerp((i-1)*1080,i*1080,eio((t-STT[i])/PAN));return i*1080;}
// faixa rígida dentro de uma estação (SUB = instantes das trocas de etapa)
const sx=(t,lag=0)=>{let x=0;for(const s of SUB)x+=eio(p(t-lag,s,.3));return -1080*x;};
// barra dinâmica: rápida no começo, quase parando no fim (K = ln 25)
const K=Math.log(25), barra=u=>(1-Math.exp(-K*u))/(1-Math.exp(-K));
prog.style.width=(cl(barra(cl(t/TOTAL)))*850)+'px';
```

CSS dos componentes:

```css
:root{--bk:#0c0c0c;--ow:#F2EEE6;--rd:#FF2D2D;--or:#D97757}
.glass{background:linear-gradient(135deg,rgba(255,255,255,.09),rgba(255,255,255,.018));backdrop-filter:blur(9px) saturate(175%) brightness(1.05);box-shadow:0 30px 70px rgba(0,0,0,.42),inset 0 1px 1.5px rgba(255,255,255,.55),inset 0 -1px 1px rgba(255,255,255,.12),inset 10px 10px 24px rgba(255,255,255,.03)}
.glass::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:2px;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.75),rgba(255,255,255,.10) 30%,rgba(255,120,120,.06) 55%,rgba(255,255,255,.04) 70%,rgba(255,255,255,.45));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude}
.appic{border-radius:24%;position:relative;overflow:hidden;box-shadow:0 24px 60px rgba(217,119,87,.38),0 10px 24px rgba(0,0,0,.5)}
.appic::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(160deg,rgba(255,255,255,.5),rgba(255,255,255,0) 42%),linear-gradient(0deg,rgba(255,255,255,.14),rgba(255,255,255,0) 24%);box-shadow:inset 0 2px 2px rgba(255,255,255,.75),inset 0 -2px 4px rgba(0,0,0,.2),inset 0 0 0 1.5px rgba(255,255,255,.22)}
.stamp{font-family:Anton;color:var(--rd);border:12px solid var(--rd);border-radius:20px;padding:6px 34px 2px;white-space:nowrap;text-align:center;line-height:1;mix-blend-mode:screen;-webkit-mask-size:300px 300px;
 -webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.3'/></filter><rect width='300' height='300' filter='url(%23f)'/></svg>")}
#cap{position:absolute;left:90px;width:850px;top:1452px;text-align:center;font:800 46px/1.3 Inter;color:var(--ow)}
#cap span{display:inline-block;margin:0 4px;padding:0 3px;opacity:.8;text-shadow:0 2px 12px rgba(0,0,0,.9)}
#cap span.on{opacity:1;box-shadow:inset 0 -7px 0 var(--rd)}
```

Encode:

```bash
V="-c:v libx264 -preset slow -profile:v high -level 4.2 -pix_fmt yuv420p -g 60"
C="-color_primaries bt709 -color_trc bt709 -colorspace bt709"
ffmpeg -y -framerate 30 -i frames/%05d.jpg $V -b:v 8000k -maxrate 12000k -bufsize 16000k -pass 1 -an -t $T -f mp4 /dev/null
ffmpeg -y -framerate 30 -i frames/%05d.jpg -i mix_final.wav -map 0:v -map 1:a $V -b:v 8000k -maxrate 12000k -bufsize 16000k -pass 2 $C -c:a aac -b:a 256k -ar 48000 -ac 2 -t $T -movflags +faststart cobaia-diaNN.mp4
# leve: mesmo processo com o bitrate pela duração (62,5 s: 2900k / 4350k / 5800k) e AAC 160k
```

Fontes completas dos vídeos aprovados (páginas do Dia 1 v4 e do Dia 2, scripts de transcrição, corte, mix, render e encode, e as fontes tipográficas) ficam na pasta do projeto em `videos/fonte/`. Quando estiver disponível, parta delas. O Dia 3 também está lá (`videos/fonte/dia03/`, com voz editada, mix, músicas e efeitos usados e um LEIAME), com as fontes tipográficas em caminho relativo `../fonts/`.

