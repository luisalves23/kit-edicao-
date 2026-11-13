# Mede BPM, volume, brilho e pulso das faixas p*.mp3 da pasta atual (primeiro minuto) -> feat.json. Uso: baixar trechos com curl -r 0-1400000 e rodar aqui.
import numpy as np,subprocess,glob,json,sys
SR=22050;out=[]
for f in sorted(glob.glob('p*.mp3'),key=lambda x:int(x[1:-4])):
  raw=subprocess.run(['ffmpeg','-v','quiet','-i',f,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
  x=np.frombuffer(raw,np.int16).astype(np.float32)/32768
  if len(x)<SR*20: continue
  x=x[:SR*60]; H=512; n=len(x)//H
  fr=x[:n*H].reshape(n,H); rms=np.sqrt((fr**2).mean(1)+1e-12)
  S=np.abs(np.fft.rfft(fr*np.hanning(H),axis=1)); fq=np.fft.rfftfreq(H,1/SR)
  cen=(S*fq).sum(1)/(S.sum(1)+1e-9)
  lo=S[:,fq<150].sum(1)/(S.sum(1)+1e-9)
  fl=np.maximum(0,np.diff(np.log(S+1e-6),axis=0)).sum(1); fl-=fl.mean()
  ac=np.correlate(fl,fl,'full')[len(fl)-1:]; fps=SR/H
  lags=np.arange(len(ac)); bpm=60*fps/np.maximum(lags,1); m=(bpm>70)&(bpm<180)
  L=lags[m][np.argmax(ac[m])]; puls=ac[L]/ac[0]
  db=20*np.log10(rms+1e-9)
  out.append(dict(id=int(f[1:-4]),dur=len(x)/SR,loud=round(float(np.percentile(db,50)),1),dyn=round(float(np.percentile(db,95)-np.percentile(db,20)),1),cen=int(np.median(cen)),low=round(float(np.median(lo)),2),bpm=round(float(60*fps/L)),pulse=round(float(puls),2),
   rise=round(float(db[int(40*fps):].mean()-db[:int(10*fps)].mean()),1) if len(db)>45*fps else 0))
json.dump(out,open('feat.json','w'))
for o in out: print(o)
