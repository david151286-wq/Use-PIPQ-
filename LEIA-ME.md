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
