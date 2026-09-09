# Ótica Vip — plano de implementação

Objetivo: site institucional em português para a Ótica Vip, com óculos 3D na abertura, categorias ilustrativas e contato por WhatsApp.

Direção aprovada: azul profundo e branco, composição editorial, movimento discreto, layout adaptável. Tipografia Georgia para títulos e sans-serif para leitura. O modelo 3D é uma ilustração original, não uma reprodução de produto em estoque.

Arquitetura: projeto independente em HTML/CSS/JavaScript, Vite para empacotamento e Three.js carregado sob demanda. Não acessa APIs, banco, autenticação ou arquivos da barbearia.

## Entregas e verificações

- [x] `src/business.js` e `tests/business.test.js`: dados fornecidos, links para WhatsApp e Maps, horário local de São Paulo; testar horários de abertura e fechamento, sábado, domingo e codificação da mensagem antes da implementação.
- [x] `index.html`, `src/main.js`, `src/style.css`: apresentação, navegação móvel, categorias, localização, horários e rodapé. Somente dados comerciais fornecidos; não inventar marcas, preços ou depoimentos.
- [x] `src/glasses.js`: modelo com aros, lentes, ponte e hastes; luzes de estúdio; rotação por arraste e teclado; seleção de acabamento; pausa; limite de resolução; pausa fora da viewport; limpeza e fallback estático.
- [x] Verificar build e testes; navegar em desktop e celular; testar controles, links, movimento reduzido e WebGL indisponível; conferir console e registrar limites em `README.md`.
- [x] Acrescentar a sequência da visita, perguntas frequentes, ação móvel do WhatsApp, navegação ativa e animações pontuais.
- [x] Refinar o modelo 3D com reação ao cursor, mudança de iluminação durante o scroll e transição entre acabamentos.

Contato autorizado: +55 62 9153-5619. Endereço: R. 7 de Setembro, 361 - St. Central, Anápolis - GO. Segunda a sexta 08:00–18:00; sábado 08:00–13:30; domingo fechado. Preservar o número exatamente como informado.
