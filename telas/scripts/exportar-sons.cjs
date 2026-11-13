// Exporta a lista de efeitos da página (window.SFX, preenchida pelo kit e pelas cenas) para mix/sons.json.
// uso (na pasta do projeto): node assets/scripts/exportar-sons.cjs
const {chromium}=require('playwright'),http=require('http'),fs=require('fs'),path=require('path');
const P=process.cwd(), MT={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.json':'application/json'};
const srv=http.createServer((q,r)=>{const f=path.join(P,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':MT[path.extname(f)]||'application/octet-stream'});r.end(d);});});
srv.listen(0,async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.log('ERRO',e.message));
  await p.goto('http://localhost:'+srv.address().port+'/index.html');await p.waitForFunction(()=>window.READY,null,{timeout:120000});
  const s=await p.evaluate(()=>window.SFX); fs.mkdirSync(path.join(P,'mix'),{recursive:true});
  fs.writeFileSync(path.join(P,'mix/sons.json'),JSON.stringify(s));
  const c={}; s.forEach(e=>c[e[0]]=(c[e[0]]||0)+1); console.log(s.length,'efeitos',JSON.stringify(c));
  await b.close(); srv.close();});
