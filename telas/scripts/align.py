import re,json,numpy as np,wave
txt=open('texto.txt').read().split()
V='aeiouáéíóúâêôãõày'
def syl(w):
  if w.startswith('MCP'):return 3
  if w.startswith('OpenAI'):return 4
  x=re.sub('[^a-zçáéíóúâêôãõàü]','',w.lower());g=len(re.findall('[%s]+'%V,x));return max(1,g)+0.3
# phrases split after punctuation
P=[];cur=[]
for w in txt:
  cur.append(w)
  if re.search(r'[.,?!:…"]$',w): P.append(cur);cur=[]
if cur:P.append(cur)
w=wave.open('bruto.wav');a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
h=480;n=len(a)//h;db=20*np.log10(np.array([np.sqrt(np.mean(a[i*h:(i+1)*h]**2))+1e-9 for i in range(n)]))
on=db>-40;S=[];i=0
while i<n:
  if on[i]:
    j=i
    while j<n and on[j]:j+=1
    S.append([i/100,j/100]);i=j
  else:i+=1
M=[]
for s in S:
  if M and s[0]-M[-1][1]<0.12:M[-1][1]=s[1]
  else:M.append(s)
M=[s for s in M if s[1]-s[0]>0.08]
ps=[sum(syl(x) for x in p) for p in P]
speech=sum(e-s for s,e in M);rate=speech/sum(ps)
NP,NS=len(P),len(M);INF=1e18
D=np.full((NP+1,NS+1),INF);B={};D[0,0]=0
for i in range(1,NP+1):
  for j in range(1,NS+1):
    for k in range(max(0,i-4),i):
      for l in range(max(0,j-5),j):
        if D[k,l]>=INF:continue
        dur=sum(M[q][1]-M[q][0] for q in range(l,j));exp=sum(ps[k:i])*rate
        c=D[k,l]+((dur-exp)/ (exp**0.5))**2 + 0.3*(i-k-1)
        if c<D[i,j]:D[i,j]=c;B[i,j]=(k,l)
i,j=NP,NS;blocks=[]
while i>0:
  k,l=B[i,j];blocks.append((k,i,l,j));i,j=k,l
blocks.reverse();W=[]
for k,i,l,j in blocks:
  segs=M[l:j];words=[x for p in P[k:i] for x in p];ws=[syl(x) for x in words];tot=sum(ws);dur=sum(e-s for s,e in segs)
  def tm(u):
    for s,e in segs:
      if u<=e-s+1e-9:return s+u
      u-=e-s
    return segs[-1][1]
  acc=0
  for x,wt in zip(words,ws):
    s=tm(acc/tot*dur);acc+=wt;e=tm(acc/tot*dur-0.001)
    W.append({'w':x,'s':round(s,3),'e':round(e,3)})
  print(f"{segs[0][0]:6.2f}-{segs[-1][1]:6.2f} {' '.join(words)}")
json.dump({'W':W,'M':M},open('align.json','w'),ensure_ascii=False)
