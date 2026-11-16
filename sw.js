// COMO ATUALIZAR: mudou o app (index.html, fontes, ícones)? Aumente V. Mudou Bíblia, hinário ou estudo? Aumente DV também.
const V="pipq-v9",DV="pipq-dados-v2",SHELL=["./", "index.html", "manifest.webmanifest","avisos.js", "icons/logo-mark.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.png", "fonts/fraunces-latin-600-normal.woff2", "fonts/literata-latin-400-normal.woff2", "fonts/literata-latin-400-italic.woff2", "fonts/literata-latin-600-normal.woff2"],DATA=["data/biblia-ara.js", "data/novo-cantico.js", "data/breve.js", "data/maior.js", "data/confissao.js","data/temas.js","data/versiculos.js", "data/biblia-naa.js"];
const clean=async r=>r.redirected?new Response(await r.blob(),{status:200,statusText:"OK",headers:r.headers}):r;
const put=async(c,u)=>{try{const r=await fetch(u,{cache:"reload"});if(!r.ok)return false;await c.put(u,await clean(r));return true}catch(e){return false}};
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>put(c,u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==DV).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{
  if(e.data==="version"&&e.source)e.source.postMessage({version:V});
  if(e.data!=="cache-data")return;
  e.waitUntil((async()=>{let ok=true;const a=await caches.open(V),d=await caches.open(DV);
    for(const u of SHELL)if(!(await a.match(u)))ok=(await put(a,u))&&ok;
    for(const u of DATA)if(!(await d.match(u)))ok=(await put(d,u))&&ok;
    if(e.source)e.source.postMessage({offline:ok})})())});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){e.respondWith((async()=>{ // tela inicial: tenta a internet por 4 s (versão nova); sem sinal, usa a guardada
    const c=await caches.open(V);
    const net=fetch(r).then(async x=>{if(x.ok&&x.type==="basic")await c.put("index.html",await clean(x.clone()));return x});
    e.waitUntil(net.catch(()=>0));
    try{const x=await Promise.race([net,new Promise(s=>setTimeout(()=>s(null),4000))]);if(x)return x}catch(x){}
    return (await c.match("index.html"))||(await net.catch(()=>null))||new Response("Sem conexão. Abra o app uma vez com internet.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})})());return}
  if(u.pathname.endsWith("/avisos.js")){e.respondWith(fetch(r,{cache:"no-cache"}).then(async x=>{if(x.ok)(await caches.open(V)).put(r,x.clone());return x}).catch(async()=>(await caches.match(r,{ignoreSearch:true}))||new Response("window.AVISOS=[]",{headers:{"Content-Type":"text/javascript"}})));return}
  if(u.pathname.includes("/data/")){e.respondWith((async()=>{ // dados: guardados até DV mudar
    const c=await caches.open(DV),hit=await c.match(r);if(hit)return hit;
    try{const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n}catch(x){return Response.error()}})());return}
  e.respondWith((async()=>{
    const hit=await caches.match(r,{ignoreSearch:true});if(hit)return hit;
    try{const n=await fetch(r);if(n.ok&&n.type==="basic"){const c=await caches.open(V);c.put(r,n.clone())}return n}catch(x){return Response.error()}})())});
