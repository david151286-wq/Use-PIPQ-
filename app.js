// ===== EDITE AQUI: dados da igreja (valores de exemplo) =====
const C={
  whatsapp:"552126651760",tel:"(21) 2665-1760",youtube:"https://www.youtube.com/@pipqueimados",maps:"https://maps.app.goo.gl/JsT5JFqkQQJJhv1FA",
  pix:"INSERIR-CHAVE-PIX",
  endereco:"Av. Dr. Pedro Jorge, 95 — Parque, Queimados — RJ, 26383-060",
  horarios:[["Domingo 09:00","Culto Matutino"],["Após o culto","Escola Bíblica Dominical"],["Domingo 19:00","Culto Noturno"],["Terça 20:00","Culto de Oração"],["Quinta 20:00","Estudo Bíblico"]]
};
const AT="Gênesis:50,Êxodo:40,Levítico:27,Números:36,Deuteronômio:34,Josué:24,Juízes:21,Rute:4,1 Samuel:31,2 Samuel:24,1 Reis:22,2 Reis:25,1 Crônicas:29,2 Crônicas:36,Esdras:10,Neemias:13,Ester:10,Jó:42,Salmos:150,Provérbios:31,Eclesiastes:12,Cantares:8,Isaías:66,Jeremias:52,Lamentações:5,Ezequiel:48,Daniel:12,Oseias:14,Joel:3,Amós:9,Obadias:1,Jonas:4,Miqueias:7,Naum:3,Habacuque:3,Sofonias:3,Ageu:2,Zacarias:14,Malaquias:4";
const NT="Mateus:28,Marcos:16,Lucas:24,João:21,Atos:28,Romanos:16,1 Coríntios:16,2 Coríntios:13,Gálatas:6,Efésios:6,Filipenses:4,Colossenses:4,1 Tessalonicenses:5,2 Tessalonicenses:3,1 Timóteo:6,2 Timóteo:4,Tito:3,Filemom:1,Hebreus:13,Tiago:5,1 Pedro:5,2 Pedro:3,1 João:5,2 João:1,3 João:1,Judas:1,Apocalipse:22";

const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400)}

// Tema
const root=document.documentElement,sv=store.get("pipq-theme");
if(sv==="dark"||sv==="light")root.dataset.theme=sv;
const dark=()=>root.dataset.theme?root.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
const meta=()=>{$('meta[name="theme-color"]').content=dark()?"#0f1626":"#f5f3ed"};
$("#theme").onclick=()=>{const t=dark()?"light":"dark";root.dataset.theme=t;store.set("pipq-theme",t);meta()};meta();

// Dados da igreja
$$(".hor").forEach(el=>el.innerHTML=C.horarios.map(h=>`<div class="row"><span>${h[0]}</span><span>${h[1]}</span></div>`).join(""));
const wa="https://wa.me/"+C.whatsapp;$("#wa1").href=wa;$("#wa2").href=wa;
$("#end").textContent=C.endereco;const okp=!/^INSERIR/.test(C.pix);$("#pixk").textContent=okp?C.pix:"Ainda não cadastrada. Fale com a gente pelo WhatsApp que enviamos.";$("#pix").hidden=!okp;
$("#map").href=C.maps;$$(".yt").forEach(a=>a.href=C.youtube);$("#tel").href="tel:+"+C.whatsapp;$("#tel").textContent="Ligar: "+C.tel;
$("#pix").onclick=async()=>{try{await navigator.clipboard.writeText(C.pix);toast("Chave PIX copiada.")}catch(e){toast("Copie manualmente: "+C.pix)}};

// Dados (JSON em /data) e utilidades
const D={},enc=encodeURIComponent,esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const load=f=>D[f]||(D[f]=new Promise((ok,no)=>{const e=document.createElement("script");e.src="data/"+f+".js";e.onload=()=>window.__D&&window.__D[f]?ok(window.__D[f]):no();e.onerror=no;document.head.append(e)}).catch(e=>{delete D[f];throw e}));
const fail=el=>el.innerHTML='<p class="empty">Não foi possível carregar os dados. Confira se a pasta data está junto do index.html ou conecte-se à internet.</p>';
const share=async t=>{try{await navigator.share({text:t})}catch(e){}};const copy=async t=>{try{await navigator.clipboard.writeText(t);toast("Copiado.")}catch(e){toast("Não foi possível copiar.")}};
const fsz=d=>{const v=Math.min(30,Math.max(14,(+store.get("pipq-fs")||18)+d));store.set("pipq-fs",v);root.style.setProperty("--fs",v)};
root.style.setProperty("--fs",+store.get("pipq-fs")||18);
document.addEventListener("click",e=>{const b=e.target.closest("[data-fs]");if(b)fsz(+b.dataset.fs);const f=e.target.closest(".star");if(f)fav(f.dataset.id)});

// Bíblia (ARA e NAA)
const CC=(AT+","+NT).split(",").map(x=>+x.split(":")[1]),BN=(AT+","+NT).split(",").map(x=>x.split(":")[0]);
const VN={ara:"Almeida Revista e Atualizada",naa:"Nova Almeida Atualizada"};
let bv=store.get("pipq-ver")==="naa"?"naa":"ara";
const ref=(i,c,v)=>`#biblia/${i}/${c}`+(v?"/"+v:"");
const bh=(t,a,b)=>`<h2>${t}</h2>`+BN.slice(a,b).map((n,k)=>{const i=a+k;return `<details data-n="${n}"><summary>${n}<small>${CC[i]} cap.</small></summary><div class="ch">${Array.from({length:CC[i]},(_,c)=>`<a href="${ref(i,c+1)}">${c+1}</a>`).join("")}</div></details>`}).join("");
$("#bl").innerHTML=bh("Antigo Testamento",0,39)+bh("Novo Testamento",39,66);
$$("#bvs .chip").forEach(b=>b.onclick=()=>{bv=b.dataset.v;store.set("pipq-ver",bv);route()});
const NX={};
const kwOpen=o=>{$("#tm").hidden=!o;$("#kwb").setAttribute("aria-expanded",o)};
function kwClear(){$("#br").innerHTML="";$$("#bl details,#bl h2").forEach(x=>x.hidden=false);$$("#tm .chip").forEach(b=>b.setAttribute("aria-pressed","false"))}
async function tema(n){const R=$("#br"),L=$$("#bl details,#bl h2");$("#bq").value="";$$("#tm .chip").forEach(b=>b.setAttribute("aria-pressed",b.textContent===n));
  try{const [d,T]=await Promise.all([load("biblia-"+bv),load("temas")]);L.forEach(x=>x.hidden=true);kwOpen(false);
    R.innerHTML=`<div class="tools" style="justify-content:space-between"><h2 style="margin:0">${esc(n)}</h2><button class="chip" data-kx>Limpar</button></div>`+T[n].map(([i,c,v1,v2])=>`<a class="res" href="${ref(i,c,v1)}"><b>${BN[i]} ${c}:${v1}${v2?"-"+v2:""}</b><span>${esc(d[i].chapters[c-1].slice(v1-1,v2||v1).join(" "))}</span></a>`).join("");scrollTo(0,0)}catch(e){fail(R)}}
$("#kwb").onclick=()=>kwOpen($("#tm").hidden);
document.addEventListener("click",e=>{if(e.target.closest("[data-kx]"))kwClear()});
load("temas").then(T=>{$("#tm").innerHTML='<div class="tg">'+Object.keys(T).map(k=>`<button class="chip" aria-pressed="false">${k}</button>`).join("")+"</div>";$$("#tm .chip").forEach(b=>b.onclick=()=>tema(b.textContent))}).catch(()=>{$("#kwb").hidden=true});let bt;$("#bq").oninput=()=>{clearTimeout(bt);bt=setTimeout(bsearch,200)};
async function bsearch(){kwOpen(false);$$("#tm .chip").forEach(b=>b.setAttribute("aria-pressed","false"));
  const q=norm($("#bq").value.trim()),R=$("#br"),H=$$("#bl h2"),L=$$("#bl details");R.innerHTML="";L.forEach(d=>d.hidden=false);H.forEach(h=>h.hidden=false);
  if(!q)return;
  const m=q.match(/^(.+?)\s+(\d+)(?:[:.,\s]+(\d+))?$/),find=t=>t==="jo"?42:BN.findIndex(n=>norm(n).startsWith(t));
  if(m){const i=find(m[1]),c=+m[2];if(i>=0&&c>=1&&c<=CC[i]){R.innerHTML=`<a class="act" href="${ref(i,c,+m[3]||0)}">${BN[i]} ${c}${m[3]?":"+m[3]:""}</a>`;L.forEach(d=>d.hidden=true);H.forEach(h=>h.hidden=true);return}}
  let n=0;L.forEach(d=>{const ok=norm(d.dataset.n).includes(q);d.hidden=!ok;n+=ok});H.forEach(h=>h.hidden=true);
  if(n||q.length<3)return;
  try{const d=await load("biblia-"+bv),out=[];let more=false;const nx=NX[bv]||(NX[bv]=d.map(b=>b.chapters.map(c=>c.map(norm))));
    d.forEach((b,i)=>b.chapters.forEach((c,j)=>c.forEach((v,k)=>{if(nx[i][j][k].includes(q)){if(out.length<50)out.push(`<a class="res" href="${ref(i,j+1,k+1)}"><b>${BN[i]} ${j+1}:${k+1}</b><span>${esc(v)}</span></a>`);else more=true}})));
    if(norm($("#bq").value.trim())!==q)return;
    R.innerHTML=out.length?out.join("")+(more?'<p class="note">Mostrando os 50 primeiros resultados.</p>':""):'<p class="empty">Nada encontrado.</p>'}catch(e){fail(R)}}
async function bible(p){
  const i=p[1],home=i===undefined;$("#bhome").hidden=!home;$("#bc").hidden=home;
  $("#bver").textContent=VN[bv];$$("#bvs .chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===bv));
  if(home){const l=store.get("pipq-last");$("#bcont").innerHTML=l?`<a class="act" href="#biblia/${l}">Continuar: ${BN[l.split("/")[0]]} ${l.split("/")[1]}</a>`:"";return}
  const bi=+i,ch=+p[2],v=+p[3],el=$("#bc");
  if(!(bi>=0&&bi<66&&ch>=1&&ch<=CC[bi])){location.hash="#biblia";return}
  el.innerHTML='<p class="empty">Carregando…</p>';
  try{const d=await load("biblia-"+bv),t=d[bi].chapters[ch-1];store.set("pipq-last",bi+"/"+ch);
    const pv=ch>1?[bi,ch-1]:bi>0?[bi-1,CC[bi-1]]:null,nx=ch<CC[bi]?[bi,ch+1]:bi<65?[bi+1,1]:null,nv=(x,l)=>x?`<a class="chip" href="${ref(x[0],x[1])}">${l}</a>`:"<span></span>";
    el.innerHTML=`<h2 class="rt">${BN[bi]} ${ch}</h2><div class="tools"><a class="chip" href="#biblia">Livros</a><button class="chip" data-fs="-2" aria-label="Diminuir letra">A−</button><button class="chip" data-fs="2" aria-label="Aumentar letra">A+</button>${wlbtn()}<button class="chip" id="cp" hidden>Copiar versículos</button><button class="chip" id="sh" hidden>Compartilhar</button></div><div class="vs">${t.map((x,k)=>`<p data-v="${k+1}"><sup>${k+1}</sup>${esc(x)}</p>`).join("")}</div><div class="pn">${nv(pv,"‹ Anterior")}${nv(nx,"Próximo ›")}</div>`;
    const vs=$(".vs",el);vs.onclick=e=>{const q=e.target.closest("p");if(!q)return;q.classList.toggle("sel");const on=!!$(".sel",vs);$("#cp").hidden=!on;$("#sh").hidden=!(on&&navigator.share)};
    const vt=()=>{const s=$$(".sel",vs);return s.map(q=>q.lastChild.textContent).join(" ")+`\n${BN[bi]} ${ch}:${s.map(q=>q.dataset.v).join(",")} (${bv.toUpperCase()})`};$("#cp").onclick=()=>copy(vt());$("#sh").onclick=()=>share(vt());
    const hl=v&&$(`.vs p[data-v="${v}"]`,el);if(hl){hl.classList.add("hl");hl.scrollIntoView({block:"center"})}
  }catch(e){fail(el)}}

// Hinário (Novo Cântico) - favoritos guardados pelo número
let HY,HX,onlyFav=false,favs=[];try{favs=JSON.parse(store.get("pipq-fav")||"[]").map(x=>String(x).replace(/^0+(?=\d)/,""))}catch(e){}
const ti=h=>{const t=h.titulo.replace(/\.$/,"");return t[0].toUpperCase()+t.slice(1)};
const star='<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';
const sbtn=h=>`<button class="star" data-id="${esc(h.numero)}" aria-label="Favoritar ${esc(ti(h))}" aria-pressed="${favs.includes(h.numero)}">${star}</button>`;
function fav(id){const on=!favs.includes(id);favs=on?[...favs,id]:favs.filter(x=>x!==id);store.set("pipq-fav",JSON.stringify(favs));$$(`.star[data-id="${id}"]`).forEach(b=>b.setAttribute("aria-pressed",on));toast(on?"Adicionado aos favoritos.":"Removido dos favoritos.");if(onlyFav&&HY)hymns()}
function hymns(){const q=norm($("#hq").value.trim()),num=/^\d+$/.test(q);let n=0;$$("#hl li").forEach((li,k)=>{const ok=(num?HY[k].numero.startsWith(q):HX[k].includes(q))&&(!onlyFav||favs.includes(li.dataset.n));li.hidden=!ok;n+=ok});$("#hempty").hidden=n>0}
$("#hq").oninput=()=>HY&&hymns();
$("#fav").onclick=e=>{onlyFav=!onlyFav;e.currentTarget.setAttribute("aria-pressed",onlyFav);HY&&hymns()};
async function hymn(p){
  const home=p[1]===undefined;$("#hhome").hidden=!home;$("#hd").hidden=home;
  try{if(!HY){HY=await load("novo-cantico");HX=HY.map(h=>norm(h.numero+" "+h.titulo+" "+h.letra));
    $("#hl").innerHTML=HY.map(h=>`<li class="song" data-n="${esc(h.numero)}"><a href="#hinario/${enc(h.numero)}"><span class="num">${esc(h.numero)}</span><div><strong>${esc(ti(h))}</strong><small>${esc(h.letra.split("\n")[0])}</small></div></a>${sbtn(h)}</li>`).join("")}}catch(e){fail($(home?"#hl":"#hd"));return}
  if(home)return hymns();
  const k=HY.findIndex(h=>h.numero===p[1]);if(k<0){location.hash="#hinario";return}
  const h=HY[k],nb=(x,l)=>x?`<a class="chip" href="#hinario/${enc(x.numero)}">${l}</a>`:"<span></span>";
  $("#hd").innerHTML=`<h2 class="rt">${esc(h.numero)} · ${esc(ti(h))}</h2><div class="tools"><a class="chip" href="#hinario">Hinos</a><button class="chip" data-fs="-2" aria-label="Diminuir letra">A−</button><button class="chip" data-fs="2" aria-label="Aumentar letra">A+</button>${sbtn(h)}${wlbtn()}<button class="chip" id="hc">Copiar</button>${navigator.share?'<button class="chip" id="hs">Compartilhar</button>':""}</div><div class="lyr">${esc(h.letra)}</div><div class="pn">${nb(HY[k-1],"‹ "+(HY[k-1]||{}).numero)}${nb(HY[k+1],(HY[k+1]||{}).numero+" ›")}</div>`;
  $("#hc").onclick=()=>copy(h.numero+" - "+ti(h)+"\n\n"+h.letra);if($("#hs"))$("#hs").onclick=()=>share(h.numero+" - "+ti(h)+"\n\n"+h.letra)}


// Estudo: Confissão de Fé e Catecismos de Westminster
const DOCS={conf:["Confissão de Fé de Westminster","confissao","35 capítulos","Texto transcrito automaticamente do PDF; em caso de dúvida, confira o original."],maior:["Catecismo Maior","maior","196 perguntas e respostas","As perguntas 176, 177 e 192 não constam no PDF principal e foram completadas a partir de outra tradução (apostila do Rev. Olivar Alves Pereira)."],breve:["Breve Catecismo","breve","107 perguntas e respostas",""]};
$("#elist").innerHTML=Object.entries(DOCS).map(([k,d])=>`<a class="row" href="#estudo/${k}"><span>${d[0]}<br><small>${d[2]}</small></span><span aria-hidden="true">›</span></a>`).join("");
const para=t=>esc(t).split("\n").filter(Boolean).map(x=>`<p>${x}</p>`).join("");
async function study(p){
  const k=p[1],id=p[2],el=$("#ed"),d=DOCS[k];$("#ehome").hidden=!!k;el.hidden=!k;
  if(!k)return;if(!d){location.hash="#estudo";return}
  el.innerHTML='<p class="empty">Carregando…</p>';
  let X;try{X=await load(d[1])}catch(e){fail(el);return}
  const fsb='<button class="chip" data-fs="-2" aria-label="Diminuir letra">A−</button><button class="chip" data-fs="2" aria-label="Aumentar letra">A+</button>',
    nb=(i,l)=>X[i]?`<a class="chip" href="#estudo/${k}/${i+1}">${l}</a>`:"<span></span>";
  if(!id){
    el.innerHTML=`<h2 class="rt">${d[0]}</h2><div class="tools"><a class="chip" href="#estudo">Estudo</a></div>${d[3]?`<p class="note">${d[3]}</p>`:""}`+(k==="conf"?"":'<label class="search"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="sq" type="search" placeholder="Buscar pergunta ou resposta" aria-label="Buscar"></label>')+`<ul>${X.map((x,i)=>`<li class="song"><a href="#estudo/${k}/${i+1}"><span class="num">${k==="conf"?x.n:/^\d+$/.test(x.n)?x.n:"•"}</span><div><strong>${esc(k==="conf"?x.t:x.q)}</strong></div></a></li>`).join("")}</ul><p class="empty" id="sqe" hidden>Nada encontrado.</p>`;
    if(k!=="conf"){const ix=X.map(x=>norm(x.n+" "+x.q+" "+x.a));$("#sq").oninput=e=>{const q=norm(e.target.value.trim());let n=0;$$("li.song",el).forEach((li,i)=>{const ok=/^\d+$/.test(q)?X[i].n.startsWith(q):ix[i].includes(q);li.hidden=!ok;n+=ok});$("#sqe").hidden=n>0}}
    return}
  const i=+id-1,x=X[i];if(!x){location.hash="#estudo/"+k;return}
  const nav=`<div class="pn">${nb(i-1,"‹ Anterior")}${nb(i+1,"Próximo ›")}</div>`,top=`<div class="tools"><a class="chip" href="#estudo/${k}">Lista</a>${fsb}`;
  if(k==="conf")el.innerHTML=`<h2 class="rt">Capítulo ${x.n} · ${esc(x.t)}</h2>${top}</div>${x.i?`<p class="note">${esc(x.i)}</p>`:""}<div class="vs">${x.s.map((t,j)=>`<div><p><sup>${j+1}</sup>${esc(t).split("\n\n").join("</p><p>")}</p></div>`).join("")}</div>${nav}`;
  else{const num=/^\d+$/.test(x.n);el.innerHTML=`<h2 class="rt">${num?"Pergunta "+x.n:esc(x.q)}</h2>${top}<button class="chip" id="cc">Copiar</button></div>${num?`<p class="q">${esc(x.q)}</p>`:""}<div class="lyr">${esc(x.a)}</div>${x.x?`<p class="note">Texto de outra tradução (apostila do Rev. Olivar Alves Pereira).</p>`:""}${x.r?`<p class="note">Referências: ${esc(x.r)}</p>`:""}${nav}`;$("#cc").onclick=()=>copy((num?x.n+". "+x.q+"\n":x.q+"\n")+x.a)}
  scrollTo(0,0)}

// Tela acesa durante a leitura
let wl=null,wlOn=false;
async function wake(on){wlOn=on;try{if(on){wl=await navigator.wakeLock.request("screen");wl.addEventListener("release",()=>{wl=null})}else if(wl){await wl.release();wl=null}}catch(e){wlOn=false}return wlOn===on}
const wlbtn=()=>"wakeLock"in navigator?'<button class="chip" data-wl aria-pressed="false">Tela acesa</button>':"";
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&wlOn&&!wl)wake(true)});
document.addEventListener("click",async e=>{const b=e.target.closest("[data-wl]");if(!b)return;const want=b.getAttribute("aria-pressed")!=="true",ok=await wake(want);b.setAttribute("aria-pressed",ok?want:!want);toast(!ok?"Não foi possível manter a tela acesa.":want?"A tela ficará acesa.":"Tela acesa desativada.")});

// Início: avisos da igreja e versículo do dia
function avisos(){const hoje=new Date().toLocaleDateString("sv-SE"),L=(window.AVISOS||[]).filter(a=>a&&a.titulo&&(!a.ate||a.ate>=hoje));if(!L.length)return;
  $("#inicio .hero").insertAdjacentHTML("afterend",`<h2>Recados da nossa igreja</h2><div class="card">${L.map(a=>`<div class="av"><b>${esc(a.titulo)}</b>${a.quando?`<small>${esc(a.quando)}</small>`:""}${a.texto?`<p class="note" style="margin:4px 0 0">${esc(a.texto)}</p>`:""}${a.imagem?`<img class="avimg" src="${esc(a.imagem)}" alt="${esc(a.titulo)}" loading="lazy">`:""}</div>`).join("")}</div>`)}
async function vdia(){try{const V=await load("versiculos"),d=new Date(),n=Math.floor((Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(d.getFullYear(),0,0))/864e5),x=V[(n+d.getFullYear())%V.length];
  $("#inicio").insertAdjacentHTML("beforeend",`<h2>Versículo do dia</h2><div class="card"><p class="vdt">“${esc(x.t)}”</p><p class="vdr">${x.r} (ARA)</p><div class="tools" style="margin:0"><a class="chip" href="#biblia/${x.i}/${x.c}/${x.v}">Ler no capítulo</a><button class="chip" id="vc">Copiar</button>${navigator.share?'<button class="chip" id="vs2">Compartilhar</button>':""}</div></div>`);
  const tx=`“${x.t}”\n${x.r} (ARA)`;$("#vc").onclick=()=>copy(tx);if($("#vs2"))$("#vs2").onclick=()=>share(tx)}catch(e){}}
// Avisos: arquivo avisos.json (somente dados, nunca código). Tudo é validado antes de aparecer.
const SAFE_IMG=/^avisos\/[\w.-]+\.(jpe?g|png|webp)$/i,SAFE_DATE=/^\d{4}-\d{2}-\d{2}$/;
const avisosValidos=j=>(Array.isArray(j)?j:[]).slice(0,50).map(a=>{
  if(!a||typeof a!=="object"||typeof a.titulo!=="string"||!a.titulo.trim())return null;
  const o={titulo:a.titulo.slice(0,80)};
  if(typeof a.quando==="string"&&a.quando)o.quando=a.quando.slice(0,60);
  if(typeof a.texto==="string"&&a.texto)o.texto=a.texto.slice(0,400);
  if(typeof a.ate==="string"&&SAFE_DATE.test(a.ate))o.ate=a.ate;
  if(typeof a.imagem==="string"&&SAFE_IMG.test(a.imagem))o.imagem=a.imagem;
  return o}).filter(Boolean);
window.AVISOS=[];
async function carregarAvisos(){try{const r=await fetch("avisos.json",{cache:"no-cache"});if(!r.ok)throw 0;window.AVISOS=avisosValidos(await r.json())}catch(e){window.AVISOS=[]}avisos()}
const AVP=carregarAvisos();vdia();

// Administração dos avisos: monta os avisos no aparelho e gera o avisos.json para publicar no GitHub.
// Nenhuma chave de acesso é guardada no navegador: quem publica é você, pelo próprio GitHub.
const AD={list:[],edit:-1,f:{imagem:null,_d:null},repo:null};
const DRAFT="pipq-avisos-rascunho",REPO="pipq-repo";
const clone=a=>JSON.parse(JSON.stringify(a||[]));
const repoGet=()=>{try{return JSON.parse(store.get(REPO)||"null")}catch(e){return null}};
const adClean=a=>{const o={titulo:a.titulo};["quando","texto","ate","imagem"].forEach(k=>{if(a[k])o[k]=a[k]});return o};
const avisosTxt=()=>JSON.stringify(AD.list.map(adClean),null,2)+"\n";
const saveDraft=()=>store.set(DRAFT,JSON.stringify(AD.list.map(adClean)));
const ghUrl=(p,kind)=>AD.repo?"https://github.com/"+AD.repo.repo+"/"+kind+"/"+encodeURIComponent(AD.repo.branch||"main")+"/"+(AD.repo.dir?AD.repo.dir+"/":"")+p:"";
const dl=(n,d)=>{const a=document.createElement("a");a.href=d;a.download=n;a.click()};
async function shrink(file,max=1200){let bm;try{bm=await createImageBitmap(file)}catch(e){bm=await new Promise((ok,no)=>{const i=new Image;i.onload=()=>ok(i);i.onerror=no;i.src=URL.createObjectURL(file)})}
  const w=bm.width||bm.naturalWidth,h=bm.height||bm.naturalHeight,k=Math.min(1,max/Math.max(w,h)),c=document.createElement("canvas");c.width=Math.round(w*k);c.height=Math.round(h*k);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bm,0,0,c.width,c.height);return c.toDataURL("image/jpeg",.82)}
const msg=(t,ok)=>{const e=$("#am");if(e){e.textContent=t;e.style.color=ok?"var(--pine)":"#b3261e"}};
function adView(){const el=$("#adm"),L=AD.list,ed=AD.edit>=0?L[AD.edit]:null,r=AD.repo;
  el.innerHTML=`<p class="note">Aqui você monta os avisos e gera o arquivo <b>avisos.json</b>. Nada é publicado automaticamente e nenhuma senha ou chave fica guardada neste aparelho. As imagens valem só nesta sessão: baixe-as e envie para a pasta <b>avisos/</b>.</p>
  <h2>Avisos</h2><div class="card">${L.length?L.map((a,i)=>`<div class="av"><b>${esc(a.titulo)}</b>${a.quando?`<small>${esc(a.quando)}</small>`:""}${a.ate?`<small> · até ${esc(a.ate)}</small>`:""}${a._d?`<img class="avimg" style="max-height:120px;width:auto" alt="" src="${esc(a._d)}">`:a.imagem?`<p class="note" style="margin:4px 0 0">Imagem: ${esc(a.imagem)}</p>`:""}<div class="tools" style="margin:8px 0 0"><button class="chip" data-a="up" data-i="${i}" aria-label="Subir">↑</button><button class="chip" data-a="dn" data-i="${i}" aria-label="Descer">↓</button><button class="chip" data-a="ed" data-i="${i}">Editar</button><button class="chip" data-a="rm" data-i="${i}">Excluir</button>${a._d?`<button class="chip" data-a="img" data-i="${i}">Baixar imagem</button>`:""}</div></div>`).join(""):'<p class="note">Nenhum aviso. Adicione o primeiro abaixo.</p>'}</div>
  <h2>${ed?"Editar aviso":"Novo aviso"}</h2><div class="card"><div class="f"><label for="ft">Título</label><input class="in" id="ft" maxlength="80" value="${esc(ed?ed.titulo:"")}"></div><div class="f"><label for="fq">Quando (opcional)</label><input class="in" id="fq" maxlength="60" placeholder="Domingo, 22/11" value="${esc(ed&&ed.quando||"")}"></div><div class="f"><label for="fx">Detalhes (opcional)</label><textarea class="in" id="fx" rows="3" maxlength="400">${esc(ed&&ed.texto||"")}</textarea></div><div class="f"><label for="fa">Mostrar até (opcional)</label><input class="in" id="fa" type="date" value="${esc(ed&&ed.ate||"")}"></div><div class="f"><label for="fi">Imagem (opcional)</label><input id="fi" type="file" accept="image/*"><img id="pv" class="avimg" style="max-height:160px;width:auto" alt="" ${AD.f._d?`src="${esc(AD.f._d)}"`:"hidden"}>${AD.f.imagem&&!AD.f._d?`<p class="note">Imagem já publicada: ${esc(AD.f.imagem)}</p>`:""}<button class="chip" data-a="rmimg" ${AD.f._d||AD.f.imagem?"":"hidden"}>Remover imagem</button></div><div class="tools"><button class="act" data-a="save">${ed?"Salvar alterações do aviso":"Adicionar aviso"}</button>${ed?'<button class="chip" data-a="cancel">Cancelar</button>':""}</div></div>
  <h2>Publicar</h2><div class="card"><div class="tools" style="margin:0 0 8px"><button class="act" data-a="baixar">Baixar avisos.json</button><button class="chip" data-a="copiar">Copiar conteúdo</button></div><p id="am" class="note" role="status"></p>
    <details style="margin:0"><summary>Como publicar no GitHub</summary><ol class="note"><li>Toque em “Baixar avisos.json” (e baixe também as imagens, se houver).</li><li>Abra o repositório do site no GitHub, na pasta do app.</li><li>No arquivo <b>avisos.json</b>, use o lápis (Edit) e cole o conteúdo novo, ou envie o arquivo baixado por cima.</li><li>Confirme em “Commit changes”. Em 1 a 2 minutos os avisos aparecem para todos.</li><li>As imagens vão para a pasta <b>avisos/</b>, com o mesmo nome de arquivo.</li></ol></details>
    <div class="f"><label for="ar">Repositório (opcional, só para atalhos)</label><input class="in" id="ar" placeholder="usuario/repositorio" value="${esc(r?r.repo:"")}" autocapitalize="off"></div><div class="f"><label for="ab">Ramo (branch)</label><input class="in" id="ab" value="${esc(r?r.branch:"main")}" autocapitalize="off"></div><div class="f"><label for="ad">Pasta do app (vazio se for a raiz)</label><input class="in" id="ad" value="${esc(r?r.dir||"":"")}" autocapitalize="off"></div><button class="chip" data-a="repo">Salvar atalhos</button>${r?`<div class="tools" style="margin-top:12px"><a class="chip" href="${esc(ghUrl("avisos.json","edit"))}" target="_blank" rel="noopener">Abrir avisos.json no GitHub</a><a class="chip" href="${esc(ghUrl("avisos","upload"))}" target="_blank" rel="noopener">Abrir a pasta avisos</a></div>`:""}
  </div>
  <p class="note"><button class="chip" data-a="rascunho">Descartar rascunho e recomeçar dos avisos publicados</button></p>`;
  $("#fi").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const d=await shrink(f);AD.f={imagem:"avisos/aviso-"+Date.now()+".jpg",_d:d};adView();msg("Imagem pronta. Ela será baixada junto com o avisos.json.",1)}catch(x){msg("Não consegui ler essa imagem.")}}}
$("#adm").addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;e.preventDefault();const a=b.dataset.a,i=+b.dataset.i,L=AD.list;
  if(a==="up"&&i>0){[L[i-1],L[i]]=[L[i],L[i-1]];saveDraft();adView()}
  else if(a==="dn"&&i<L.length-1){[L[i+1],L[i]]=[L[i],L[i+1]];saveDraft();adView()}
  else if(a==="rm"){if(confirm("Excluir este aviso?")){L.splice(i,1);AD.edit=-1;saveDraft();adView()}}
  else if(a==="ed"){AD.edit=i;AD.f={imagem:L[i].imagem||null,_d:L[i]._d||null};adView();scrollTo(0,document.body.scrollHeight)}
  else if(a==="cancel"){AD.edit=-1;AD.f={imagem:null,_d:null};adView()}
  else if(a==="rmimg"){AD.f={imagem:null,_d:null};adView()}
  else if(a==="img"){if(L[i]._d)dl((L[i].imagem||"aviso.jpg").split("/").pop(),L[i]._d)}
  else if(a==="save"){const t=$("#ft").value.trim();if(!t){msg("Escreva o título do aviso.");return}const n={titulo:t,quando:$("#fq").value.trim(),texto:$("#fx").value.trim(),ate:$("#fa").value,imagem:AD.f.imagem||undefined,_d:AD.f._d||undefined};if(AD.edit>=0)L[AD.edit]=n;else L.push(n);AD.edit=-1;AD.f={imagem:null,_d:null};saveDraft();adView();msg("Aviso salvo neste aparelho. Baixe o avisos.json para publicar.",1)}
  else if(a==="baixar"){try{const u=URL.createObjectURL(new Blob([avisosTxt()],{type:"application/json;charset=utf-8"}));dl("avisos.json",u);setTimeout(()=>URL.revokeObjectURL(u),4000);L.forEach(x=>{if(x._d)dl((x.imagem||"aviso.jpg").split("/").pop(),x._d)});toast("Baixado. Envie para o site no GitHub.")}catch(x){msg("Não foi possível baixar neste aparelho.")}}
  else if(a==="copiar"){copy(avisosTxt())}
  else if(a==="repo"){const n={repo:$("#ar").value.trim(),branch:$("#ab").value.trim()||"main",dir:$("#ad").value.trim().replace(/^\/|\/$/g,"")};if(n.repo&&!/^[^\s/]+\/[^\s/]+$/.test(n.repo)){msg("Escreva o repositório no formato usuario/repositorio.");return}store.set(REPO,JSON.stringify(n));AD.repo=n.repo?n:null;adView();msg("Atalhos salvos neste aparelho.",1)}
  else if(a==="rascunho"){if(confirm("Descartar as alterações não publicadas?")){try{localStorage.removeItem(DRAFT)}catch(x){}AD.list=clone(window.AVISOS||[]);AD.edit=-1;AD.f={imagem:null,_d:null};adView()}}});
let admOk=0;function admInit(){if(admOk)return;admOk=1;AD.repo=repoGet();AVP.then(()=>{let d=null;try{d=JSON.parse(store.get(DRAFT)||"null")}catch(e){}AD.list=Array.isArray(d)?avisosValidos(d):clone(window.AVISOS||[]);adView()})}

// Instalação e modo offline (PWA)
let dp;addEventListener("beforeinstallprompt",e=>{e.preventDefault();dp=e;$("#inst").hidden=false});
$("#inst").onclick=async()=>{dp.prompt();await dp.userChoice;dp=null;$("#inst").hidden=true};
const off=$("#off"),hint="<br><small>No iPhone: Compartilhar › Adicionar à Tela de Início.</small>",st=t=>off.innerHTML=t+hint;let offDone=store.get("pipq-off")==="1";
if(offDone)st("Pronto para uso sem internet.");
if("serviceWorker"in navigator&&/^https?:/.test(location.protocol)){
  const sm=navigator.serviceWorker,showUpd=()=>$("#upd").hidden=false;
  sm.addEventListener("message",e=>{const d=e.data||{};if(d.version)$("#ver").textContent="Versão do app: "+d.version.replace("pipq-","");if(!("offline"in d))return;if(d.offline){st("Pronto para uso sem internet.");if(!offDone){store.set("pipq-off","1");offDone=1;toast("Pronto para usar offline.")}}else st("Não foi possível guardar tudo para uso offline. Abra com Wi-Fi e tente de novo.")});
  let swr=null;$("#updb").onclick=()=>{if(swr&&swr.waiting){sm.addEventListener("controllerchange",()=>location.reload(),{once:true});swr.waiting.postMessage("skip")}else location.reload()};
  addEventListener("load",()=>sm.register("sw.js").then(r=>{swr=r;
    if(r.waiting&&sm.controller)showUpd();
    r.addEventListener("updatefound",()=>{const w=r.installing;w&&w.addEventListener("statechange",()=>{if(w.state==="installed"&&sm.controller)showUpd()})});
    document.addEventListener("visibilitychange",()=>{if(!document.hidden)r.update().catch(()=>{})});setInterval(()=>r.update().catch(()=>{}),6*36e5);
    return sm.ready}).then(r=>{if(!offDone)st("Baixando Bíblia e hinário para uso offline…");const w=r.active||sm.controller;w.postMessage("version");w.postMessage("cache-data")}).catch(()=>st("Não foi possível ativar o modo offline neste aparelho.")))
}else st("O modo offline só funciona com o site publicado em um endereço https.");

// Navegação por #hash (o botão voltar funciona)
const T=[["inicio","Início","M3 11l9-8 9 8v10H3z"],["biblia","Bíblia","M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"],["hinario","Hinário","M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm11-2a3 3 0 11-6 0 3 3 0 016 0z"],["estudo","Estudo","M12 3L2 8l10 5 10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"],["igreja","Igreja","M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12zM12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"]];
$("#nav").innerHTML=T.map(([id,l,p])=>`<a href="#${id}" data-id="${id}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="${p}"/></svg>${l}</a>`).join("");
function route(){if(wlOn)wake(false);const p=location.hash.slice(1).split("/").map(decodeURIComponent);let id=p[0];if(!T.some(t=>t[0]===id)&&id!=="admin")id="inicio";$$("main>section").forEach(s=>s.hidden=s.id!==id);$$("#nav a").forEach(a=>a.dataset.id===id?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));scrollTo(0,0);if(id==="admin")admInit();if(id==="biblia")bible(p);if(id==="hinario")hymn(p);if(id==="estudo")study(p)}
addEventListener("hashchange",route);route();
