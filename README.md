# 🧡 Crunchyroll Clone (Brasil - PT-BR)

Uma cópia simples, moderna e fiel da interface da **[Crunchyroll Brasil](https://www.crunchyroll.com/pt-br/)**, desenvolvida sob a especificação restrita: **sem nenhum vídeo de anime, apenas fotos, pôsteres e capturas de tela em alta resolução**.

---

## ✨ Características Principais

### 1. 📷 Modo Exclusivo de Fotos (Zero Vídeos)
* **Pôsteres Oficiais:** Capas verticais em proporção 2:3 com alta fidelidade visual.
* **Panorâmicas de Destaque:** Banners widescreen oficiais de fundo para cada anime.
* **Galeria de Imagens & Stills de Cena:** Capturas oficiais dos episódios e ilustrações conceituais.
* **Visualizador Lightbox em Tela Cheia:** Clique em qualquer imagem para abrir um visualizador ampliado com navegação anterior/próxima e atalhos de teclado (Setas e `Esc`).
* **Cartões de Personagens e Dubladores:** Fotos de retratos dos personagens principais acompanhadas dos nomes de seus dubladores brasileiros oficiais (como Guilherme Briggs, Charles Emmanuel, Wendel Bezerra, etc.).

### 2. 🎨 Identidade Visual Fiel da Crunchyroll
* **Paleta Dark Theme Oficial:** Fundo preto absoluto (`#000000`), camadas de superfície `#141519` e `#1a1c22`.
* **Laranja Crunchyroll:** Cor de destaque vibrante (`#f47521`) com efeitos de brilho (glow) e botões arredondados em pílula.
* **Dourado de Avaliação:** Estrelas e pontuações no padrão Crunchyroll (`★ 4.9`).
* **Tipografia e Badges:** Selos como `DUBLADO PT-BR`, `LEGENDADO`, `SIMULCAST`, `16+`.

### 3. 🚀 Funcionalidades Interativas
* **Hero Showcase Carousel:** Banner superior com rotação automática a cada 7 segundos, pausa ao passar o mouse, setas de controle e paginação por pontos.
* **Carrosséis de Conteúdo:**
  * *Mais Populares no Brasil*
  * *Lançamentos & Simulcasts*
  * *Dublados em Português*
  * *Galeria Exclusiva de Fotos dos Animes*
* **Filtro Dinâmico por Categorias:** Abas em pílula para filtrar instantaneamente entre *Todos, Ação & Shonen, Sobrenatural, Fantasia, Comédia, Aventura, Dublados e Top Avaliados*.
* **Busca Instantânea em Tempo Real:** Barra de pesquisa no cabeçalho que filtra o catálogo conforme você digita por título, nome em japonês ou gênero.
* **Modal de Detalhes Completo:**
  * Banner widescreen com gradiente suave
  * Pôster vertical em relevo
  * Sinopse oficial traduzida em Português
  * 3 abas de conteúdo: **Galeria de Fotos**, **Episódios & Stills** e **Personagens & Elenco de Dublagem**
* **Minha Fila (Watchlist):**
  * Salve seus animes favoritos com o botão "+ Adicionar à Fila"
  * Persistência automática no `localStorage` do navegador
  * Gaveta lateral animada para visualizar todos os animes salvos e contador dinâmico no cabeçalho
* **Planos Crunchyroll Premium:** Comparativo detalhado dos planos oficiais no Brasil (*Fan - R$ 14,99*, *Mega Fan - R$ 19,99* e *Mega Fan Anual - R$ 199,99*).
* **Seção de Dispositivos e Rodapé Oficial PT-BR:** Navegação, redes sociais e avisos legais.

---

## 📁 Estrutura de Arquivos

```text
crunchyroll-clone/
├── index.html        # Estrutura HTML5 semântica e acessível
├── styles.css        # CSS3 moderno com variáveis de design, responsividade e animações
├── app.js            # Lógica interativa modular em Vanilla JS (ES6+)
├── anime-data.js     # Catálogo com 16 animes, fotos em alta resolução e dublagem PT-BR
├── server.js         # Servidor local Node.js integrado (zero dependências externas)
├── package.json      # Configuração de scripts npm
└── README.md         # Documentação do projeto
```

---

## 💻 Como Executar

### Opção 1: Diretamente no Navegador (Mais Rápido)
Basta dar dois cliques no arquivo `index.html` ou abri-lo em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

### Opção 2: Via Servidor Local Node.js
No terminal, entre na pasta do projeto e execute:
```bash
node server.js
```
Ou com npm:
```bash
npm start
```
Em seguida, abra o endereço no seu navegador:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Tecnologias Utilizadas
* **HTML5**: Semântico com suporte a SVG e meta tags de compartilhamento.
* **CSS3**: Variáveis CSS customizadas, Flexbox, Grid, Backdrop-Filter e animações suaves.
* **JavaScript (Vanilla ES6+)**: Manipulação de DOM reativa, sem necessidade de frameworks pesados.
* **Node.js**: Servidor HTTP estático nativo.
