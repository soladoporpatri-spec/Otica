# Ótica VIP — Anápolis 👓✨

Uma experiência web imersiva e interativa desenvolvida para o setor ótico, combinando design moderno com modelagem 3D em tempo real.

### 🚀 Sobre o Projeto
O projeto **Ótica VIP** é uma landing page / vitrine virtual construída para oferecer aos clientes uma visualização detalhada de produtos. A principal funcionalidade é o uso da biblioteca **Three.js** para renderizar modelos de óculos em 3D, permitindo rotação, zoom e interação dinâmica diretamente do navegador sem necessidade de plugins.

### 🛠️ Tecnologias Utilizadas
- **JavaScript Moderno (ES6+)**
- **Three.js**: Motor 3D WebGL para a renderização do modelo de óculos interativo.
- **Vite**: Ferramenta de build super-rápida.
- **Playwright**: Automação de testes End-to-End no navegador (cross-browser).
- **Node.js**: Test runner integrado.

---

### 🌟 Destaques e Funcionalidades
- **Experiência 3D Interativa:** O modelo `glasses.js` desenha a geometria do zero, com controle total de iluminação de estúdio e materiais. O usuário pode interagir por mouse ou teclado, e a luz reage dinamicamente ao scroll da página.
- **Performance e Acessibilidade:** 
  - Limite de resolução (1.75x) configurado para garantir 60fps constantes.
  - Carregamento assíncrono (Dynamic Import) do WebGL.
  - Pausa automática do modelo quando a janela não está visível para economizar recursos da máquina do usuário.
  - Suporte à preferência de `prefers-reduced-motion` do sistema operacional.
- **Testes Automatizados:** Script para validar integrações do WhatsApp, fallback de falha do WebGL, interações móveis e limites de fuso horário.

---

### ⚙️ Como Executar Localmente

**Pré-requisitos:** Node.js v22.12+ ou v24+

1. **Instale as dependências:**
   ```bash
   npm ci
   ```
2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Build para Produção:**
   Para criar os arquivos otimizados e minificados para deploy:
   ```bash
   npm run build
   ```
   (Os arquivos finais estarão disponíveis na pasta `dist/`).

### 🧪 Testes e Validação
Para executar os testes locais e gerar assets automatizados via Playwright:
```bash
npm test
npm run verify-browser # Verifica responsividade, performance do WebGL e interações.
```
