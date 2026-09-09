# Ótica Vip — Anápolis

Site independente em HTML, CSS e JavaScript com Three.js. A pasta não utiliza o backend, banco de dados ou sessões da barbearia.

## Uso local

Com Node.js 22.12+ ou 24+, execute `npm ci` e `npm run dev`. Para gerar os arquivos publicáveis, execute `npm run build`; o resultado fica em `dist/`. `npm run preview` abre uma prévia desse resultado. Publique somente o conteúdo de `dist/`, nunca a pasta da barbearia.

## Conteúdo

- Dados comerciais fornecidos pelo usuário: Ótica Vip, +55 62 9153-5619, R. 7 de Setembro, 361 - St. Central, Anápolis - GO.
- Segunda a sexta 08:00–18:00, sábado 08:00–13:30, domingo fechado.
- O indicador de horário usa America/Sao_Paulo. Feriados não são inferidos; a página orienta confirmar com a loja.
- O número foi preservado exatamente como fornecido, sem adicionar dígitos. Os links foram verificados, mas a existência da conta no WhatsApp e o recebimento de mensagens não foram confirmados.
- Categorias e renders são ilustrativos; não há preços, marcas, depoimentos ou estoque inventados.

## Óculos 3D

Modelo original criado em `src/glasses.js` com geometria Three.js: aros extrudados, lentes, ponte, hastes e detalhes metálicos. Materiais e iluminação de estúdio. A pessoa pode arrastar, usar as setas do teclado ou os botões de rotação; Home restaura o ângulo. Três acabamentos com transição de cor e botão de pausa. O modelo responde suavemente à posição do cursor e a iluminação acompanha um pequeno trecho do scroll.

Three.js é carregado por importação dinâmica. A resolução é limitada a 1,75 vezes a resolução CSS. A animação para quando a seção sai da tela ou a aba fica oculta. A preferência por movimento reduzido inicia o modelo parado, remove as entradas de conteúdo e interrompe as interpolações em andamento. Listeners, observadores e recursos gráficos são liberados no descarte. Falha de WebGL mostra um render estático local.

`public/images/` contém quatro renders próprios do modelo, sem fotografias de terceiros. A tipografia DM Sans vem do Google Fonts, com fonte local alternativa. O logo tipográfico foi criado para esta proposta e pode ser substituído pela marca oficial.

## Validação

`npm test`: testes de limites dos horários, fuso, número e mensagens do WhatsApp e destino do Maps.

`scripts/verify-browser.cjs`: usa o pacote Playwright disponível no ambiente; para um pacote fora da resolução padrão, informe seu caminho em `PLAYWRIGHT_PACKAGE`. Testa conteúdo da visita e FAQ, ação móvel do WhatsApp, WebGL, imagens, acabamento animado, reação ao cursor, luz durante o scroll, rotação por teclado, arraste e botões, navegação ativa, larguras de 320 a 1440 px, movimento reduzido e fallback sem WebGL. Salva evidências locais em `output/`.

`scripts/render-assets.cjs` recria os renders originais com o servidor de desenvolvimento em http://127.0.0.1:5187/. Também usa `PLAYWRIGHT_PACKAGE` quando necessário.

O site é independente e não altera os arquivos existentes da barbearia. A validação foi feita em Chromium automatizado; aparelhos físicos, Safari e desempenho em celulares modestos ainda precisam de verificação. Não há formulários, pagamentos, banco ou coleta de dados no site. WhatsApp e Maps abrem serviços externos somente por ação do visitante.
