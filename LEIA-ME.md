# App PIPQ

Arquivos: `index.html` (o app), `data/` (Bíblia ARA, NAA e Novo Cântico, em arquivos .js gerados a partir dos seus JSONs), `icons/`, `manifest.webmanifest` e `sw.js` (modo offline).

## 1. Editar dados da igreja
No `index.html`, procure `EDITE AQUI` e troque WhatsApp, chave PIX, endereço e horários.

## 2. Testar no computador
Dá para abrir o `index.html` com duplo clique (Bíblia e hinário funcionam). O modo offline/instalação só ativa quando o site está publicado em HTTPS. Para testar tudo no computador: `python3 -m http.server 8000` e abra http://localhost:8000

## 3. Publicar (necessário HTTPS para o offline)
Suba a pasta inteira em um hospedeiro gratuito: GitHub Pages, Netlify (arrastar a pasta) ou Cloudflare Pages.

## 4. Instalar e usar offline
- Android (Chrome): abra o site, aguarde "Pronto para usar offline" e toque em "Instalar no celular" (aba Igreja).
- iPhone (Safari): Compartilhar > Adicionar à Tela de Início.

## 5. Atualizar depois de mudar algo
Altere o número em `sw.js` (`pipq-v1` para `pipq-v2`) e publique de novo. Os celulares atualizam sozinhos.

## 6. App nas lojas (opcional, com Capacitor)
1. `npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init PIPQ br.org.pipq --web-dir=www`
3. Copie index.html, data, icons, manifest.webmanifest e sw.js para uma pasta `www`
4. `npx cap add android && npx cap sync && npx cap open android` (gera o APK/AAB no Android Studio)
Para iOS use `@capacitor/ios` num Mac com Xcode. Este passo não foi testado aqui.

## Aba Estudo
Dados em `data/`: `confissao.js` (35 capítulos), `maior.js` (193 perguntas) e `breve.js` (107 perguntas, mais Dez Mandamentos, Resumo, Oração Dominical e Credo).
- A Confissão veio de um PDF escaneado e foi lida por OCR: pode haver pequenas falhas de texto. Revise antes de divulgar.
- O PDF do Catecismo Maior não contém as perguntas 176, 177 e 192.
- A Confissão está sem as "Referências" bíblicas (o OCR não as lia bem); os catecismos mantêm as referências.

## Canal do YouTube e horários
Link em `youtube` e horários em `horarios` (bloco `EDITE AQUI` do index.html). Os horários vieram da página do canal @pipqueimados.
As perguntas 176, 177 e 192 do Catecismo Maior vieram da apostila do Rev. Olivar Alves Pereira (outra tradução) e aparecem com aviso.

## Fontes e offline (versão 4)
- Fontes locais na pasta `fonts/` (Fraunces nos títulos; Literata nos subtítulos e na leitura). Funcionam offline, sem depender do Google.
- O modo offline instala primeiro só o essencial e depois baixa a Bíblia, o hinário e o estudo (aba Igreja mostra o andamento).
- Se o app instalado antes abria em branco: desinstale o ícone antigo, abra o site no navegador, aguarde "Pronto para usar offline" e instale de novo. Se mudar qualquer arquivo, aumente `pipq-v5` em `sw.js`.

## Atualizações (versão 6)
- O app instalado procura versão nova sozinho (ao abrir e a cada poucas horas) e mostra "Nova versão do app disponível. Atualizar agora".
- Em `sw.js` há dois números: `V` (aumente quando mudar o app, fontes ou ícones) e `DV` (aumente só quando mudar Bíblia, hinário ou estudo). Assim, uma correção pequena não obriga o celular a baixar tudo de novo.
- A versão aparece na aba Igreja ("Versão do app: v6"), para conferir se o celular atualizou.

## Avisos, versículo do dia, temas e tela acesa (versão 7)
- **Avisos:** edite o arquivo `avisos.json` (só dados, sem código) ou use a Área administrativa. Cada aviso tem `titulo` (obrigatório), `quando`, `texto`, `ate` (AAAA-MM-DD; depois dessa data o aviso some) e `imagem` (caminho `avisos/nome.jpg`). Basta publicar o arquivo novo: os avisos atualizam sozinhos nos celulares, sem mexer no número da versão. O app valida tudo antes de mostrar: ignora campos desconhecidos, limita tamanhos e só aceita imagens da pasta `avisos/`.
- **Versículo do dia:** 60 versículos (ARA), um por dia, em `data/versiculos.js`.
- **Palavras-chave na Bíblia (botão abaixo da busca):** 12 temas em `data/temas.js` (Ansiedade, Perdão, Fé, Esperança, Amor, Oração, Gratidão, Sabedoria, Salvação, Coragem, Consolo, Família). O texto vem da própria Bíblia do app, na versão escolhida.
- **Tela acesa:** botão na leitura da Bíblia e dos hinos (aparece onde o aparelho permite).
- Se mudar `temas.js` ou `versiculos.js`, aumente o `DV` em `sw.js`.

## Área administrativa (como funciona hoje)
Aba **Igreja** > rodapé > "Área administrativa". Serve para criar, editar, reordenar e excluir avisos, com imagem, sem editar arquivos à mão.
- **O painel não publica nada e não guarda senha nem token.** Ele só monta o `avisos.json` no seu aparelho. Você baixa o arquivo (e as imagens) e publica pelo próprio GitHub (lápis > Commit changes). Quem pode publicar é quem tem acesso ao repositório: **a segurança do app é a segurança da sua conta do GitHub**.
- As alterações em andamento ficam como rascunho no aparelho (sem dados sensíveis) até você descartar.
- As imagens são reduzidas automaticamente (até 1200 px) e vão para a pasta `avisos/`.
- **Não volte a guardar token do GitHub dentro do app.** Qualquer coisa que roda no navegador pode ser lida por quem abrir o app. Se um dia quiser publicar direto do painel, use um servidor intermediário (ex.: Cloudflare Worker) que guarda o token como segredo, ou um CMS pronto (Decap CMS, Pages CMS).

## Segurança (versão 12)
- **Proteja a conta do GitHub:** ative verificação em duas etapas (de preferência chave de acesso/passkey), ative a proteção do branch `main` e não dê acesso de escrita a mais ninguém sem necessidade. Quem escreve no repositório controla o que roda no celular de todos (inclusive a chave PIX).
- **Content-Security-Policy:** o `index.html` traz uma CSP (meta tag) que só deixa rodar scripts do próprio site. Por isso o JavaScript foi para `app.js` e `theme.js`. **Não coloque `<script>` ou `onclick="..."` direto no HTML**, pois a CSP bloqueia.
- **Cabeçalhos HTTP:** o arquivo `_headers` vale para Netlify e Cloudflare Pages (HSTS, anti-clickjacking, nosniff etc.). O GitHub Pages ignora esse arquivo e não permite cabeçalhos próprios; se a segurança for prioridade, prefira Cloudflare Pages ou Netlify.
- **Atualização do app:** a versão nova só assume quando a pessoa toca em "Atualizar agora" (antes ela assumia sozinha no meio do uso).
- **Ao mudar arquivos:** lembre de aumentar `V` em `sw.js` (agora `pipq-v12`). `app.js`, `theme.js` e `avisos.json` já estão na lista de arquivos guardados.
