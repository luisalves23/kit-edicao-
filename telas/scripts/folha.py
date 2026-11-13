# folha de contato: python3 scripts/folha.py <pasta> <saida.jpg> [colunas=8] [largura=216]  (usa os .jpg da pasta, em ordem, com rótulo)
import sys,glob,os
from PIL import Image,ImageDraw
d,out=sys.argv[1],sys.argv[2]; C=int(sys.argv[3]) if len(sys.argv)>3 else 8; w=int(sys.argv[4]) if len(sys.argv)>4 else 216; h=w*16//9
fs=sorted(glob.glob(os.path.join(d,'*.jpg'))); R=(len(fs)+C-1)//C
im=Image.new('RGB',(C*(w+6)+6,R*(h+24)+6),(17,17,17)); dr=ImageDraw.Draw(im)
for i,f in enumerate(fs):
  x,y=6+(i%C)*(w+6),6+(i//C)*(h+24); im.paste(Image.open(f).convert('RGB').resize((w,h)),(x,y))
  n=os.path.basename(f)[:-4]; lab=n[2:]+'s' if n.startswith('t_') else f'{int(n)/30:.2f}s'
  dr.text((x+2,y+h+4),lab,fill=(230,230,230))
im.save(out,quality=85); print(out,len(fs))
