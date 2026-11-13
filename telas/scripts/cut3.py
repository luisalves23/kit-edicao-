# usage: cut3.py in48.wav words.json out.wav words_out.json cfg.json
# cfg: thr, gap, speed, pauses{idx:sec}, drop[[a,b],...] (word index ranges, inclusive)
import sys,json,wave,subprocess,numpy as np
src,wj,out,wout,cfgp=sys.argv[1:6]; cfg=json.load(open(cfgp))
w=wave.open(src);sr=w.getframerate();x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
words=json.load(open(wj))
drops=[(words[a]["s"]-0.06, words[b]["e"]+cfg.get("droppad",0.08)) for a,b in cfg.get("drop",[])]
drops+=[tuple(d) for d in cfg.get("droptime",[])]
keepw=[v for i,v in enumerate(words) if not any(a<=i<=b for a,b in cfg.get("drop",[]))]
hop=int(sr*0.01);n=len(x)//hop
db=20*np.log10(np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1))+1e-9)
sp=db>cfg.get("thr",-40)
segs=[];i=0
while i<n:
  if sp[i]:
    j=i
    while j<n and sp[j]: j+=1
    segs.append([i*0.01,j*0.01]); i=j
  else: i+=1
segs=[s for s in segs if s[1]-s[0]>=0.06]
# clip out drop intervals
def clip(s):
  res=[s]
  for a,b in drops:
    nr=[]
    for u,v in res:
      if v<=a or u>=b: nr.append([u,v])
      else:
        if u<a: nr.append([u,a])
        if v>b: nr.append([b,v])
    res=nr
  return [r for r in res if r[1]-r[0]>=0.05]
segs=[c for s in segs for c in clip(s)]
segs=[s for s in segs if any(s[0]<v["e"]+0.12 and s[1]>v["s"]-0.08 for v in keepw)]
m=[]
for s in segs:
  if m and s[0]-m[-1][1]<0.12: m[-1][1]=s[1]
  else: m.append(s)
PRE,POST=0.05,0.09
keep=[]
for s,e in m:
  s,e=max(0,s-PRE),min(len(x)/sr,e+POST)
  for a,b in drops:  # don't let padding bleed into dropped audio
    if a<s<b: s=b
    if a<e<b: e=a
  if keep and s<=keep[-1][1]: keep[-1][1]=e
  else: keep.append([s,e])
dram={words[int(k)]["e"]:v for k,v in cfg["pauses"].items()}
def fade(a):
  f=int(sr*0.008)
  if len(a)>2*f: a=a.copy(); a[:f]*=np.linspace(0,1,f); a[-f:]*=np.linspace(1,0,f)
  return a
outbuf=[];pmap=[];t=0
for k,(s,e) in enumerate(keep):
  if k>0:
    pe=keep[k-1][1]; g=s-pe
    tg=min(g,0.12) if g<0.35 else cfg.get("gap",0.16)
    for we,v in dram.items():
      if pe-0.6<=we<=s+0.05: tg=v
    outbuf.append(np.zeros(int(sr*tg))); t+=tg
  a=fade(x[int(s*sr):int(e*sr)]); pmap.append((s,e,t)); outbuf.append(a); t+=len(a)/sr
  print(f"keep {s:6.2f}-{e:6.2f} -> {t-len(a)/sr:6.2f}")
y=np.concatenate(outbuf); tmp=out+".tmp.wav"
wo=wave.open(tmp,"w");wo.setnchannels(1);wo.setsampwidth(2);wo.setframerate(sr);wo.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());wo.close()
sp_=cfg.get("speed",1.08)
chain=f"highpass=f=80,afftdn=nf=-30,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=4000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,atempo={sp_},loudnorm=I=-16:TP=-1.5:LRA=7"
subprocess.run(["ffmpeg","-loglevel","error","-y","-i",tmp,"-af",chain,"-ar","48000",out],check=True)
def remap(tt):
  for s,e,o in pmap:
    if s-0.001<=tt<=e+0.001: return (o+tt-s)/sp_
  best=min(pmap,key=lambda p:min(abs(tt-p[0]),abs(tt-p[1]))); s,e,o=best
  return (o+min(max(tt,s),e)-s)/sp_
for k,v in cfg.get("fix",{}).items(): words[int(k)]["s"]=v
def snap(tt):
  for s_,e_,o in pmap:
    if s_-0.001<=tt<=e_+0.001: return tt
  nxt=[p[0] for p in pmap if p[0]>tt]
  return min(nxt)+0.04 if nxt else tt
for v in words:
  if v in keepw: v["s"]=min(snap(v["s"]),v["e"]-0.05)
ow=[dict(w=v["w"],s=round(remap(v["s"]),3),e=round(remap(v["e"]),3),i=i) for i,v in enumerate(words) if v in keepw]
json.dump({"words":ow,"dur":round(len(y)/sr/sp_,3),"orig":round(len(x)/sr,2)},open(wout,"w"),ensure_ascii=False)
print("orig",round(len(x)/sr,2),"out",round(len(y)/sr/sp_,2))
