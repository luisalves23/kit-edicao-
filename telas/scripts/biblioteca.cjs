// Liga um projeto de vídeo à biblioteca do @cobaia.dev. Rode no início e sempre que a biblioteca mudar.
// uso (na pasta do projeto): node <biblioteca>/scripts/biblioteca.cjs [<biblioteca>]
//   padrão da biblioteca: /mnt/project-files/telas
// copia para o projeto: assets/telas.js (todas as telas *.html), assets/kit/, assets/img/, assets/fonts/, assets/fonts.css,
//   assets/js/ (gsap, three, g3d), assets/audio/ (sfx e músicas) e assets/scripts/ (mix.py etc.)
const fs=require('fs'),path=require('path');
const P=process.cwd(), L=path.resolve(process.argv[2]||'/mnt/project-files/telas');
const out={};
for(const f of fs.readdirSync(L).filter(f=>f.endsWith('.html'))){
  const s=fs.readFileSync(path.join(L,f),'utf8');
  const css=(s.match(/<style data-tela="([^"]+)">([\s\S]*?)<\/style>/)||[]);
  const html=(s.match(/<!--tela-->([\s\S]*?)<!--\/tela-->/)||[])[1];
  if(!css[1]||!html) continue;
  const fix=x=>x.replace(/(src=|url\()(["']?)img\//g,'$1$2assets/img/');
  out[css[1]]={css:fix(css[2]),html:fix(html.trim())};
}
fs.mkdirSync(path.join(P,'assets'),{recursive:true});
fs.writeFileSync(path.join(P,'assets/telas.js'),'window.TELAS='+JSON.stringify(out)+';\n');
const cp=(a,b)=>{fs.mkdirSync(b,{recursive:true});for(const f of fs.readdirSync(a)){const s=path.join(a,f),d=path.join(b,f);if(fs.statSync(s).isDirectory())cp(s,d);else fs.copyFileSync(s,d);}};
for(const [a,b] of [['img','assets/img'],['fonts','assets/fonts'],['js','assets/js'],['kit','assets/kit'],['audio','assets/audio'],['scripts','assets/scripts']])
  if(fs.existsSync(path.join(L,a))) cp(path.join(L,a),path.join(P,b));
fs.copyFileSync(path.join(L,'fonts.css'),path.join(P,'assets/fonts.css'));
console.log('biblioteca:',L,'\ntelas:',Object.keys(out).join(', '));
