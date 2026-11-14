// Aumente o número da versão sempre que mudar dados, fontes, ícones ou o index.html.
const V="pipq-v5",SHELL=["./", "index.html", "manifest.webmanifest", "icons/logo-mark.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.png","fonts/fraunces-latin-600-normal.woff2","fonts/literata-latin-400-normal.woff2","fonts/literata-latin-400-italic.woff2","fonts/literata-latin-600-normal.woff2",       ],DATA=["data/biblia-ara.js", "data/novo-cantico.js", "data/breve.js", "data/maior.js", "data/confissao.js", "data/biblia-naa.js"];
const clean=async r=>r.redirected?new Response(await r.blob(),{status:200,statusText:"OK",headers:r.headers}):r;
const put=async(c,u)=>{try{const r=await fetch(u,{cache:"reload"});if(!r.ok)return false;await c.put(u,await clean(r));return true}catch(e){return false}};
// Instalação rápida: só o essencial (a tela inicial, ícones e fontes). Os dados são baixados em seguida, pelo app.
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>put(c,u)))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data!=="cache-data")return;e.waitUntil((async()=>{const c=await caches.open(V);let ok=true;for(const u of [...SHELL,...DATA]){if(!(await c.match(u)))ok=(await put(c,u))&&ok}if(e.source)e.source.postMessage({offline:ok})})())});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){e.respondWith((async()=>{
    const c=await caches.open(V),shell=await c.match("index.html");
    const upd=fetch(r).then(async x=>{if(x.ok&&x.type==="basic")await c.put("index.html",await clean(x.clone()));return x}).catch(()=>null);
    if(shell){e.waitUntil(upd);return shell}
    return (await upd)||new Response("Sem conexão. Abra o app uma vez com internet.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8"}})})());return}
  e.respondWith((async()=>{
    const hit=await caches.match(r,{ignoreSearch:true});if(hit)return hit;
    try{const n=await fetch(r);if(n.ok&&n.type==="basic"){const c=await caches.open(V);c.put(r,n.clone())}return n}catch(x){return Response.error()}})())});
