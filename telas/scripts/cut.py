import json,numpy as np,wave,re,subprocess,sys
TEMPO=float(sys.argv[1])
d=json.load(open('align.json'));W,M=d['W'],d['M']
w=wave.open('bruto.wav');a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768;sr=48000
out=[];maps=[];pos=0.0
for k,(s,e) in enumerate(M):
  s0=max(0,s-0.02);e0=e+0.05
  if k+1<len(M): e0=min(e0,(e+M[k+1][0])/2)
  if k>0: s0=max(s0,(M[k-1][1]+s)/2)
  # gap before this seg based on last word before s
  if k>0:
    prev=[x for x in W if x['e']<=s+0.01]; lw=prev[-1]['w'] if prev else ''
    g=0.17 if re.search(r'[.?!"]$',lw) else 0.09 if re.search(r'[,:]$',lw) else 0.02
    if lw.endswith('...'): g=0.22
    out.append(np.zeros(int(g*sr),np.float32));pos+=g
  seg=a[int(s0*sr):int(e0*sr)].copy();f=int(0.008*sr);seg[:f]*=np.linspace(0,1,f);seg[-f:]*=np.linspace(1,0,f)
  maps.append((s0,e0,pos));out.append(seg);pos+=len(seg)/sr
y=np.concatenate(out)
wv=wave.open('cut.wav','wb');wv.setnchannels(1);wv.setsampwidth(2);wv.setframerate(sr);wv.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes());wv.close()
def mp(t):
  for s0,e0,p in maps:
    if t<=e0: return (p+max(0,t-s0))/TEMPO
  return (maps[-1][2]+maps[-1][1]-maps[-1][0])/TEMPO
NW=[{'w':x['w'],'s':round(mp(x['s']),3),'e':round(mp(x['e']),3)} for x in W]
json.dump(NW,open('palavras.json','w'),ensure_ascii=False)
subprocess.run(['ffmpeg','-y','-v','error','-i','cut.wav','-af',f'highpass=f=80,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=4000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=3,atempo={TEMPO},loudnorm=I=-16:TP=-1.5','-ar','48000','voz_editada.wav'],check=True)
print('cut',pos,'final',pos/TEMPO,'last word end',NW[-1]['e'])
