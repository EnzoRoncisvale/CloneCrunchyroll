// ==========================================================================
// Crunchyroll Clone (PT-BR) - Main Application Script
// Modo: 100% Fotos, Pôsteres Oficiais e Stills de Episódios (Zero Vídeos)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    catalog: typeof ANIME_DATA !== 'undefined' ? ANIME_DATA : [],
    currentGenre: 'all',
    searchQuery: '',
    watchlist: JSON.parse(localStorage.getItem('cr_watchlist') || '[]'),
    heroIndex: 0,
    heroTimer: null,
    lightboxImages: [],
    lightboxIndex: 0
  };

  // DOM Elements
  const heroContainer = document.getElementById('heroSlidesContainer');
  const heroDots = document.getElementById('heroDots');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const searchInput = document.getElementById('searchInput');
  const genrePills = document.getElementById('genrePills');
  const activeCount = document.getElementById('activeCount');
  const mainGrid = document.getElementById('mainGrid');
  const gridSectionTitle = document.getElementById('gridSectionTitle');
  const carouselPopular = document.getElementById('carouselPopular');
  const carouselSimulcasts = document.getElementById('carouselSimulcasts');
  const carouselDubbed = document.getElementById('carouselDubbed');
  const photoGalleryGrid = document.getElementById('photoGalleryGrid');
  const watchlistBtn = document.getElementById('watchlistBtn');
  const watchlistBadge = document.getElementById('watchlistBadge');
  const watchlistDrawer = document.getElementById('watchlistDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const watchlistContent = document.getElementById('watchlistContent');
  const clearWatchlistBtn = document.getElementById('clearWatchlistBtn');
  const mainHeader = document.getElementById('mainHeader');

  // Detail Modal Elements
  const detailModal = document.getElementById('detailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHeroBg = document.getElementById('modalHeroBg');
  const modalPoster = document.getElementById('modalPoster');
  const modalTitle = document.getElementById('modalTitle');
  const modalNative = document.getElementById('modalNative');
  const modalMetaRow = document.getElementById('modalMetaRow');
  const modalSynopsis = document.getElementById('modalSynopsis');
  const modalQueueBtn = document.getElementById('modalQueueBtn');
  const modalShareBtn = document.getElementById('modalShareBtn');
  const modalPhotosGrid = document.getElementById('modalPhotosGrid');
  const modalEpisodesList = document.getElementById('modalEpisodesList');
  const modalCharactersGrid = document.getElementById('modalCharactersGrid');
  const modalDubCastList = document.getElementById('modalDubCastList');
  const modalTabBtns = document.querySelectorAll('.cr-modal-tab-btn');
  const tabPanes = document.querySelectorAll('.cr-tab-pane');

  // Lightbox Elements
  const photoLightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // Currently active anime in modal
  let currentActiveAnime = null;

  // ========================================================================
  // Initialization
  // ========================================================================
  function init() {
    updateWatchlistBadge();
    renderHeroBanner();
    renderCarousels();
    renderPhotoSpotlight();
    renderMainGrid();
    setupEventListeners();
    setupHeaderScroll();
  }

  // ========================================================================
  // Header Scroll Effect
  // ========================================================================
  function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    });
  }

  // ========================================================================
  // Hero Showcase Banner
  // ========================================================================
  function renderHeroBanner() {
    const featuredList = state.catalog.filter(a => a.featured).slice(0, 5);
    if (!featuredList.length) return;

    heroContainer.innerHTML = '';
    heroDots.innerHTML = '';

    featuredList.forEach((anime, idx) => {
      const isSaved = state.watchlist.includes(anime.id);
      
      // Slide HTML
      const slide = document.createElement('div');
      slide.className = `cr-hero-slide ${idx === 0 ? 'active' : ''}`;
      slide.dataset.index = idx;
      slide.innerHTML = `
        <div class="cr-hero-bg" style="background-image: url('${anime.banner}');"></div>
        <div class="cr-hero-gradient-overlay"></div>
        <div class="cr-hero-content">
          <div class="cr-hero-badges">
            <span class="cr-badge cr-badge-orange">${anime.badge}</span>
            <span class="cr-badge cr-badge-score">★ ${anime.rating}</span>
            <span class="cr-badge cr-badge-dark">${anime.year}</span>
            <span class="cr-badge cr-badge-dark">${anime.episodes} Episódios</span>
          </div>
          <h1 class="cr-hero-title">${anime.title}</h1>
          <div class="cr-hero-subtitle">${anime.native || anime.romaji}</div>
          <p class="cr-hero-synopsis">${anime.synopsis}</p>
          <div class="cr-hero-actions">
            <button class="cr-btn-primary" onclick="window.crApp.openAnimeModal(${anime.id})">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
              <span>Ver Fotos & Detalhes</span>
            </button>
            <button class="cr-btn-secondary ${isSaved ? 'in-watchlist' : ''}" onclick="window.crApp.toggleWatchlist(${anime.id}, this)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
              <span>${isSaved ? 'Na Minha Fila' : '+ Adicionar à Fila'}</span>
            </button>
          </div>
        </div>
      `;
      heroContainer.appendChild(slide);

      // Dot Indicator
      const dot = document.createElement('div');
      dot.className = `cr-dot ${idx === 0 ? 'active' : ''}`;
      dot.title = anime.title;
      dot.addEventListener('click', () => setHeroSlide(idx));
      heroDots.appendChild(dot);
    });

    startHeroAutoRotation();
  }

  function setHeroSlide(index) {
    const slides = document.querySelectorAll('.cr-hero-slide');
    const dots = document.querySelectorAll('.cr-dot');
    if (!slides.length) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    state.heroIndex = (index + slides.length) % slides.length;
    slides[state.heroIndex].classList.add('active');
    dots[state.heroIndex].classList.add('active');
  }

  function startHeroAutoRotation() {
    clearInterval(state.heroTimer);
    state.heroTimer = setInterval(() => {
      setHeroSlide(state.heroIndex + 1);
    }, 7000);
  }

  // ========================================================================
  // Card Creation Component
  // ========================================================================
  function createAnimeCard(anime) {
    const isSaved = state.watchlist.includes(anime.id);
    const card = document.createElement('div');
    card.className = 'cr-card';
    card.dataset.id = anime.id;

    card.innerHTML = `
      <div class="cr-card-poster-wrap">
        <img src="${anime.cover}" alt="${anime.title}" class="cr-card-poster" loading="lazy">
        <div class="cr-card-overlay"></div>
        <span class="cr-card-badge-top">${anime.badge.split(' ')[0]}</span>
        <div class="cr-card-rating">
          <span>★</span> ${anime.rating}
        </div>
        <div class="cr-card-quick-actions">
          <button class="cr-card-btn-action" onclick="event.stopPropagation(); window.crApp.openAnimeModal(${anime.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            Fotos
          </button>
          <button class="cr-card-btn-queue ${isSaved ? 'active' : ''}" title="${isSaved ? 'Remover da Fila' : 'Salvar na Fila'}" onclick="event.stopPropagation(); window.crApp.toggleWatchlist(${anime.id}, this)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          </button>
        </div>
      </div>
      <div class="cr-card-info">
        <h3 class="cr-card-title">${anime.title}</h3>
        <div class="cr-card-meta">
          <span>${anime.episodes} Eps • ${anime.year}</span>
          <div class="cr-card-tags">
            <span class="cr-card-tag">${anime.genres[0] || 'Anime'}</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAnimeModal(anime.id));
    return card;
  }

  // ========================================================================
  // Carousels Rendering
  // ========================================================================
  function renderCarousels() {
    // 1. Popular
    const popularList = state.catalog.slice(0, 8);
    carouselPopular.innerHTML = '';
    popularList.forEach(anime => carouselPopular.appendChild(createAnimeCard(anime)));

    // 2. Simulcasts
    const simulcastsList = state.catalog.filter(a => a.badge.includes('Simulcast') || a.badge.includes('Novo') || a.badge.includes('Arco')).concat(state.catalog.slice(4, 9));
    const uniqueSimulcasts = Array.from(new Set(simulcastsList)).slice(0, 8);
    carouselSimulcasts.innerHTML = '';
    uniqueSimulcasts.forEach(anime => carouselSimulcasts.appendChild(createAnimeCard(anime)));

    // 3. Dubbed
    const dubbedList = state.catalog.filter(a => a.badge.includes('Dublado') || a.dubActors.length > 1).concat(state.catalog.slice(2, 8));
    const uniqueDubbed = Array.from(new Set(dubbedList)).slice(0, 8);
    carouselDubbed.innerHTML = '';
    uniqueDubbed.forEach(anime => carouselDubbed.appendChild(createAnimeCard(anime)));
  }

  // Carousel horizontal scroll buttons
  document.querySelectorAll('.cr-carousel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const direction = parseInt(btn.dataset.dir, 10);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollBy({ left: direction * 460, behavior: 'smooth' });
      }
    });
  });

  // ========================================================================
  // Photo Spotlight Section (100% Photos Only)
  // ========================================================================
  function renderPhotoSpotlight() {
    photoGalleryGrid.innerHTML = '';
    const spotlightItems = [];

    state.catalog.forEach(anime => {
      if (anime.banner) {
        spotlightItems.push({
          img: anime.banner,
          title: `Cena Oficial Panorâmica`,
          animeName: anime.title,
          animeId: anime.id
        });
      }
    });

    // Display first 8 stunning landscape stills
    spotlightItems.slice(0, 8).forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'cr-photo-card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.title}" class="cr-photo-img" loading="lazy">
        <div class="cr-photo-overlay">
          <div class="cr-photo-anime">${item.animeName}</div>
          <div class="cr-photo-title">${item.title}</div>
        </div>
        <div class="cr-photo-zoom-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"/></svg>
        </div>
      `;
      card.addEventListener('click', () => {
        openLightbox(spotlightItems.map(s => s.img), idx, `${item.animeName} - ${item.title}`);
      });
      photoGalleryGrid.appendChild(card);
    });
  }

  // ========================================================================
  // Main Filtered Grid
  // ========================================================================
  function renderMainGrid() {
    mainGrid.innerHTML = '';

    let filtered = state.catalog.filter(anime => {
      // Filter by genre / category
      let matchGenre = true;
      if (state.currentGenre === 'all') {
        matchGenre = true;
      } else if (state.currentGenre === 'dublado') {
        matchGenre = anime.badge.toLowerCase().includes('dublado') || anime.dubActors.length > 1;
      } else if (state.currentGenre === 'top') {
        matchGenre = parseFloat(anime.rating) >= 4.8;
      } else {
        matchGenre = anime.genres.some(g => g.toLowerCase().includes(state.currentGenre.toLowerCase()));
      }

      // Filter by search query
      let matchSearch = true;
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        matchSearch = anime.title.toLowerCase().includes(q) ||
                      (anime.romaji && anime.romaji.toLowerCase().includes(q)) ||
                      (anime.native && anime.native.toLowerCase().includes(q)) ||
                      anime.genres.some(g => g.toLowerCase().includes(q)) ||
                      anime.synopsis.toLowerCase().includes(q);
      }

      return matchGenre && matchSearch;
    });

    activeCount.textContent = `${filtered.length} título${filtered.length === 1 ? '' : 's'}`;

    if (state.searchQuery) {
      gridSectionTitle.textContent = `Resultados para "${state.searchQuery}"`;
    } else if (state.currentGenre !== 'all') {
      const activeBtn = document.querySelector(`.cr-pill[data-genre="${state.currentGenre}"]`);
      gridSectionTitle.textContent = activeBtn ? activeBtn.textContent : 'Catálogo Filtrado';
    } else {
      gridSectionTitle.textContent = 'Catálogo Completo';
    }

    if (filtered.length === 0) {
      mainGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--cr-text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 12px; color: var(--cr-orange);">🔍</div>
          <h3 style="font-size: 1.3rem; color: #fff; margin-bottom: 6px;">Nenhum anime encontrado</h3>
          <p>Tente buscar por outro termo ou selecione a categoria "Todos".</p>
        </div>
      `;
      return;
    }

    filtered.forEach(anime => {
      mainGrid.appendChild(createAnimeCard(anime));
    });
  }

  // ========================================================================
  // Detail Modal (100% Photos, Zero Videos)
  // ========================================================================
  function openAnimeModal(animeId) {
    const anime = state.catalog.find(a => a.id === animeId);
    if (!anime) return;
    currentActiveAnime = anime;

    modalHeroBg.style.backgroundImage = `url('${anime.banner}')`;
    modalPoster.src = anime.cover;
    modalPoster.alt = anime.title;
    modalTitle.textContent = anime.title;
    modalNative.textContent = `${anime.romaji} • ${anime.native || ''}`;

    // Meta row badges
    modalMetaRow.innerHTML = `
      <span class="cr-badge cr-badge-orange">${anime.badge}</span>
      <span class="cr-badge cr-badge-score">★ ${anime.rating}</span>
      <span class="cr-badge cr-badge-dark">${anime.year}</span>
      <span class="cr-badge cr-badge-dark">${anime.episodes} Episódios</span>
      ${anime.genres.map(g => `<span class="cr-badge cr-badge-dark">${g}</span>`).join('')}
    `;

    modalSynopsis.textContent = anime.synopsis;

    // Watchlist button in modal
    const isSaved = state.watchlist.includes(anime.id);
    modalQueueBtn.className = `cr-modal-btn-queue ${isSaved ? 'active' : ''}`;
    modalQueueBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
      <span>${isSaved ? 'Na Minha Fila (Salvo)' : 'Adicionar à Minha Fila'}</span>
    `;

    // 1. Photos Tab (High-resolution stills, NO VIDEOS)
    modalPhotosGrid.innerHTML = '';
    const photos = anime.gallery || [anime.banner, anime.cover];
    photos.forEach((photoUrl, pIdx) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'cr-modal-gallery-item';
      photoItem.innerHTML = `
        <img src="${photoUrl}" alt="${anime.title} foto ${pIdx + 1}" class="cr-modal-gallery-img" loading="lazy">
        <div class="cr-modal-gallery-overlay">🔍</div>
      `;
      photoItem.addEventListener('click', () => {
        openLightbox(photos, pIdx, `${anime.title} - Foto ${pIdx + 1}`);
      });
      modalPhotosGrid.appendChild(photoItem);
    });

    // 2. Episodes Tab (Thumbnails / Stills with summary)
    modalEpisodesList.innerHTML = '';
    const episodes = anime.episodesList || [];
    episodes.forEach(ep => {
      const epRow = document.createElement('div');
      epRow.className = 'cr-episode-row';
      epRow.innerHTML = `
        <img src="${anime.banner}" alt="Episódio ${ep.num}" class="cr-episode-thumb" loading="lazy">
        <div class="cr-episode-content">
          <div class="cr-episode-num">Episódio ${ep.num}</div>
          <div class="cr-episode-title">${ep.title}</div>
          <div class="cr-episode-desc">${ep.desc}</div>
        </div>
        <div class="cr-episode-duration">${ep.duration}</div>
      `;
      modalEpisodesList.appendChild(epRow);
    });

    // 3. Characters & Dubbing Tab
    modalDubCastList.innerHTML = '';
    anime.dubActors.forEach(actor => {
      const actorTag = document.createElement('span');
      actorTag.style.cssText = 'background: var(--cr-bg-card); border: 1px solid var(--cr-border); padding: 4px 10px; border-radius: var(--cr-radius-pill);';
      actorTag.textContent = actor;
      modalDubCastList.appendChild(actorTag);
    });

    modalCharactersGrid.innerHTML = '';
    anime.characters.forEach(char => {
      const charCard = document.createElement('div');
      charCard.className = 'cr-character-card';
      charCard.innerHTML = `
        <img src="${char.image || anime.cover}" alt="${char.name}" class="cr-char-img" loading="lazy">
        <div>
          <div class="cr-char-name">${char.name}</div>
          <div class="cr-char-va">Voz: ${char.voiceActor}</div>
        </div>
      `;
      modalCharactersGrid.appendChild(charCard);
    });

    // Reset to first tab
    setModalTab('tabPhotos');

    // Show modal
    detailModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAnimeModal() {
    detailModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setModalTab(tabId) {
    modalTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  // ========================================================================
  // Fullscreen Photo Lightbox
  // ========================================================================
  function openLightbox(images, startIndex, caption) {
    state.lightboxImages = images;
    state.lightboxIndex = startIndex;
    updateLightboxUI(caption);
    photoLightbox.classList.add('open');
  }

  function updateLightboxUI(caption) {
    if (!state.lightboxImages.length) return;
    lightboxImg.src = state.lightboxImages[state.lightboxIndex];
    lightboxCounter.textContent = `${state.lightboxIndex + 1} / ${state.lightboxImages.length}`;
    if (caption) lightboxTitle.textContent = caption;
  }

  function nextLightboxPhoto() {
    state.lightboxIndex = (state.lightboxIndex + 1) % state.lightboxImages.length;
    updateLightboxUI();
  }

  function prevLightboxPhoto() {
    state.lightboxIndex = (state.lightboxIndex - 1 + state.lightboxImages.length) % state.lightboxImages.length;
    updateLightboxUI();
  }

  function closeLightbox() {
    photoLightbox.classList.remove('open');
  }

  // ========================================================================
  // Watchlist Management
  // ========================================================================
  function toggleWatchlist(animeId, btnElement) {
    const idx = state.watchlist.indexOf(animeId);
    const anime = state.catalog.find(a => a.id === animeId);
    const animeTitle = anime ? anime.title : 'Anime';

    if (idx > -1) {
      state.watchlist.splice(idx, 1);
      showToast(`"${animeTitle}" removido da sua fila.`);
      if (btnElement) {
        btnElement.classList.remove('active', 'in-watchlist');
        const span = btnElement.querySelector('span');
        if (span) span.textContent = '+ Adicionar à Fila';
      }
    } else {
      state.watchlist.push(animeId);
      showToast(`"${animeTitle}" adicionado à sua fila!`);
      if (btnElement) {
        btnElement.classList.add('active', 'in-watchlist');
        const span = btnElement.querySelector('span');
        if (span) span.textContent = 'Na Minha Fila';
      }
    }

    localStorage.setItem('cr_watchlist', JSON.stringify(state.watchlist));
    updateWatchlistBadge();
    renderWatchlistDrawer();

    // If modal is open for this anime, update its button too
    if (currentActiveAnime && currentActiveAnime.id === animeId) {
      const isSaved = state.watchlist.includes(animeId);
      modalQueueBtn.className = `cr-modal-btn-queue ${isSaved ? 'active' : ''}`;
      modalQueueBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
        <span>${isSaved ? 'Na Minha Fila (Salvo)' : 'Adicionar à Minha Fila'}</span>
      `;
    }
  }

  function updateWatchlistBadge() {
    watchlistBadge.textContent = state.watchlist.length;
    watchlistBadge.style.display = state.watchlist.length > 0 ? 'flex' : 'none';
  }

  function renderWatchlistDrawer() {
    watchlistContent.innerHTML = '';
    const savedAnimes = state.catalog.filter(a => state.watchlist.includes(a.id));

    if (savedAnimes.length === 0) {
      watchlistContent.innerHTML = `
        <div class="cr-drawer-empty">
          <div class="cr-drawer-empty-icon">📁</div>
          <h4 style="color: #fff; margin-bottom: 6px;">Sua fila está vazia</h4>
          <p style="font-size: 0.85rem;">Adicione animes clicando no botão "+ Adicionar à Fila" para acompanhar suas fotos e lançamentos.</p>
        </div>
      `;
      return;
    }

    savedAnimes.forEach(anime => {
      const item = document.createElement('div');
      item.className = 'cr-drawer-item';
      item.innerHTML = `
        <img src="${anime.cover}" alt="${anime.title}" class="cr-drawer-thumb">
        <div class="cr-drawer-info">
          <div class="cr-drawer-item-title">${anime.title}</div>
          <div class="cr-drawer-item-meta">${anime.episodes} Episódios • ★ ${anime.rating}</div>
        </div>
        <div class="cr-drawer-item-actions">
          <button class="cr-drawer-btn-view" onclick="window.crApp.openAnimeModal(${anime.id})">Fotos</button>
          <button class="cr-drawer-btn-remove" onclick="window.crApp.toggleWatchlist(${anime.id})">Remover</button>
        </div>
      `;
      watchlistContent.appendChild(item);
    });
  }

  // ========================================================================
  // Event Listeners
  // ========================================================================
  function setupEventListeners() {
    // Hero Controls
    heroPrevBtn.addEventListener('click', () => {
      setHeroSlide(state.heroIndex - 1);
      startHeroAutoRotation();
    });
    heroNextBtn.addEventListener('click', () => {
      setHeroSlide(state.heroIndex + 1);
      startHeroAutoRotation();
    });

    const heroBanner = document.getElementById('heroBanner');
    heroBanner.addEventListener('mouseenter', () => clearInterval(state.heroTimer));
    heroBanner.addEventListener('mouseleave', () => startHeroAutoRotation());

    // Search Input
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderMainGrid();
    });

    // Genre Pills
    genrePills.addEventListener('click', (e) => {
      if (e.target.classList.contains('cr-pill')) {
        document.querySelectorAll('.cr-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        state.currentGenre = e.target.dataset.genre;
        renderMainGrid();
      }
    });

    // Watchlist Drawer Triggers
    watchlistBtn.addEventListener('click', () => {
      renderWatchlistDrawer();
      watchlistDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    closeDrawerBtn.addEventListener('click', () => {
      watchlistDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });

    watchlistDrawer.addEventListener('click', (e) => {
      if (e.target === watchlistDrawer) {
        watchlistDrawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    clearWatchlistBtn.addEventListener('click', () => {
      if (state.watchlist.length > 0) {
        state.watchlist = [];
        localStorage.setItem('cr_watchlist', JSON.stringify([]));
        updateWatchlistBadge();
        renderWatchlistDrawer();
        renderCarousels();
        renderMainGrid();
        showToast('Minha Fila foi limpa.');
      }
    });

    // Modal Events
    modalCloseBtn.addEventListener('click', closeAnimeModal);
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) closeAnimeModal();
    });

    modalTabBtns.forEach(btn => {
      btn.addEventListener('click', () => setModalTab(btn.dataset.tab));
    });

    modalQueueBtn.addEventListener('click', () => {
      if (currentActiveAnime) {
        toggleWatchlist(currentActiveAnime.id);
      }
    });

    modalShareBtn.addEventListener('click', () => {
      if (currentActiveAnime) {
        navigator.clipboard.writeText(window.location.href);
        showToast(`Link de "${currentActiveAnime.title}" copiado com sucesso!`);
      }
    });

    // Lightbox Events
    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxNextBtn.addEventListener('click', nextLightboxPhoto);
    lightboxPrevBtn.addEventListener('click', prevLightboxPhoto);
    photoLightbox.addEventListener('click', (e) => {
      if (e.target === photoLightbox) closeLightbox();
    });

    // Keyboard Shortcuts (Esc, Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (photoLightbox.classList.contains('open')) {
          closeLightbox();
        } else if (detailModal.classList.contains('open')) {
          closeAnimeModal();
        } else if (watchlistDrawer.classList.contains('open')) {
          watchlistDrawer.classList.remove('open');
          document.body.style.overflow = '';
        }
      } else if (photoLightbox.classList.contains('open')) {
        if (e.key === 'ArrowRight') nextLightboxPhoto();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
      }
    });

    // Hamburger Mobile Menu
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    hamburgerBtn.addEventListener('click', () => {
      const nav = document.querySelector('.cr-nav');
      if (nav.style.display === 'flex') {
        nav.style.display = '';
      } else {
        nav.style.cssText = 'display: flex; position: absolute; top: 100%; left: 0; right: 0; background: var(--cr-bg-black); flex-direction: column; padding: 20px; border-bottom: 1px solid var(--cr-border);';
      }
    });

    // Login profile button
    document.getElementById('loginBtn').addEventListener('click', () => {
      showToast('Login simulado: Usuário Brasil conectado!');
    });
  }

  // ========================================================================
  // Global Exposure for Inline Handlers
  // ========================================================================
  window.crApp = {
    openAnimeModal,
    toggleWatchlist,
    openLightbox
  };

  // Expose global showToast
  window.showToast = function(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // Start app
  init();
});
