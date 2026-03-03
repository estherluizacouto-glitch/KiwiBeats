// ============================================================
//  queueSidebar.js  —  Vanilla JS + Supabase
// ============================================================

import { supabase } from "./supabaseClient.js"; // ajuste o caminho se necessário

const QueueSidebar = (() => {

  // ---------- estado interno ----------
  let _queue        = [];
  let _currentIndex = 0;
  let _shuffleOn    = false;
  let _isOpen       = false;

  // ---------- elementos do DOM ----------
  const sidebar    = document.getElementById("queueSidebar");
  const listEl     = document.getElementById("queueList");
  const closeBtn   = document.getElementById("queueCloseBtn");
  const shuffleBtn = document.getElementById("queueShuffleBtn");

  // ---------- busca músicas do Supabase ----------
  async function loadFromSupabase() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn("QueueSidebar: nenhum usuário logado.");
      return;
    }

    const { data, error } = await supabase
      .from("songs")
      .select("id, title, cover_url, audio_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("QueueSidebar: erro ao buscar músicas:", error.message);
      return;
    }

    // Mapeia para o formato interno do componente
    const songs = data.map(s => ({
      id:       s.id,
      title:    s.title,
      cover:    s.cover_url  ?? null,
      audioUrl: s.audio_url  ?? null,
    }));

    setQueue(songs, 0);
  }

  // ---------- helpers de HTML ----------
  function getBadgeClass(version) {
    if (!version) return "";
    const v = version.toLowerCase();
    if (v.includes("preview")) return "v8preview";
    if (v.includes("v8"))      return "v8";
    return "v7";
  }

  function thumbHTML(song) {
    if (song.cover) {
      return `<div class="queue-item-thumb"><img src="${song.cover}" alt="${song.title}"></div>`;
    }
    return `
      <div class="queue-thumb-placeholder">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
      </div>`;
  }

  function playingIndicatorHTML() {
    return `
      <div class="queue-playing-indicator">
        <span></span><span></span><span></span>
      </div>`;
  }

  function dragHandleHTML() {
    return `
      <div class="queue-item-drag">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="9"  y1="5"  x2="9"  y2="19"/>
          <line x1="15" y1="5"  x2="15" y2="19"/>
        </svg>
      </div>`;
  }

  // ---------- renderização ----------
  function render() {
    listEl.innerHTML = "";

    if (_queue.length === 0) {
      listEl.innerHTML = `<p class="queue-empty">A fila está vazia</p>`;
      return;
    }

    // Tocando agora
    const current = _queue[_currentIndex];
    if (current) {
      const label = document.createElement("p");
      label.className = "queue-section-label";
      label.textContent = "Tocando agora";
      listEl.appendChild(label);

      const item = document.createElement("div");
      item.className = "queue-item active";
      item.innerHTML = `
        ${thumbHTML(current)}
        <div class="queue-item-info">
          <span class="queue-item-title">${current.title}</span>
          ${current.artist ? `<span class="queue-item-artist">${current.artist}</span>` : ""}
        </div>
        ${current.version ? `<span class="queue-item-badge ${getBadgeClass(current.version)}">${current.version}</span>` : ""}
        ${playingIndicatorHTML()}
      `;
      listEl.appendChild(item);

      const divider = document.createElement("div");
      divider.className = "queue-divider";
      listEl.appendChild(divider);
    }

    // A seguir
    const upNext = _queue.slice(_currentIndex + 1);
    if (upNext.length > 0) {
      const label = document.createElement("p");
      label.className = "queue-section-label";
      label.textContent = "A seguir";
      listEl.appendChild(label);

      upNext.forEach((song, i) => {
        const realIndex = _currentIndex + 1 + i;
        const item = document.createElement("div");
        item.className = "queue-item";
        item.dataset.index = realIndex;
        item.innerHTML = `
          ${thumbHTML(song)}
          <div class="queue-item-info">
            <span class="queue-item-title">${song.title}</span>
            ${song.artist ? `<span class="queue-item-artist">${song.artist}</span>` : ""}
          </div>
          ${song.version ? `<span class="queue-item-badge ${getBadgeClass(song.version)}">${song.version}</span>` : ""}
          ${dragHandleHTML()}
        `;
        item.addEventListener("click", () => selectSong(realIndex));
        listEl.appendChild(item);
      });
    }
  }

  // ---------- ações públicas ----------
  function open() {
    _isOpen = true;
    sidebar.classList.add("open");
  }

  function close() {
    _isOpen = false;
    sidebar.classList.remove("open");
  }

  function toggle() {
    _isOpen ? close() : open();
  }

  function setQueue(songs, startIndex = 0) {
    _queue        = songs;
    _currentIndex = startIndex;
    render();
  }

  function selectSong(index) {
    if (index < 0 || index >= _queue.length) return;
    _currentIndex = index;
    render();
    // Dispara evento customizado para o player principal ouvir
    sidebar.dispatchEvent(new CustomEvent("queueSelect", {
      detail: { index, song: _queue[index] }
    }));
  }

  function next() {
    if (_queue.length === 0) return;
    if (_shuffleOn) {
      let n;
      do { n = Math.floor(Math.random() * _queue.length); }
      while (n === _currentIndex && _queue.length > 1);
      selectSong(n);
    } else {
      selectSong((_currentIndex + 1) % _queue.length);
    }
  }

  function prev() {
    selectSong((_currentIndex - 1 + _queue.length) % _queue.length);
  }

  function addSong(song) {
    _queue.push(song);
    render();
  }

  function removeSong(index) {
    _queue.splice(index, 1);
    if (_currentIndex >= _queue.length) _currentIndex = _queue.length - 1;
    render();
  }

  function setCurrentIndex(index) {
    _currentIndex = index;
    render();
  }

  // ---------- eventos internos ----------
  closeBtn.addEventListener("click", close);

  shuffleBtn.addEventListener("click", () => {
    _shuffleOn = !_shuffleOn;
    shuffleBtn.classList.toggle("active", _shuffleOn);
  });

  // ---------- API pública ----------
  return {
    open,
    close,
    toggle,
    loadFromSupabase,   // chame isso na inicialização da página
    setQueue,
    selectSong,
    setCurrentIndex,
    next,
    prev,
    addSong,
    removeSong,
    get currentIndex() { return _currentIndex; },
    get queue()        { return _queue; },
    get shuffleOn()    { return _shuffleOn; },
  };

})();

window.QueueSidebar = QueueSidebar;

// ============================================================
//  Como usar no seu player (ex: main.js ou player.js):
//
//  import QueueSidebar from "./js/queueSidebar.js";
//
//  // Carrega músicas do Supabase ao abrir a página:
//  QueueSidebar.loadFromSupabase();
//
//  // Botão de abrir/fechar:
//  document.getElementById("btnQueue")
//    .addEventListener("click", QueueSidebar.toggle);
//
//  // Ouvir quando o usuário clica em uma música na fila:
//  document.getElementById("queueSidebar")
//    .addEventListener("queueSelect", (e) => {
//      const { index, song } = e.detail;
//      tocarMusica(song.audioUrl); // sua função de tocar
//    });
//
//  // Sincronizar ao trocar de faixa no player:
//  QueueSidebar.setCurrentIndex(novoIndice);
//
//  // Avançar/voltar faixa:
//  QueueSidebar.next();
//  QueueSidebar.prev();
// ============================================================
