function initMusicPlayer() {
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("playBtn");
  const progressFill = document.querySelector(".progress-fill");
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeEl = document.querySelectorAll(".time")[0];
  const durationEl = document.querySelectorAll(".time")[1];
  const coverEl = document.querySelector(".music-cover");
  const titleEl = document.querySelector(".music-title");
  const artistEl = document.querySelector(".music-artist");
  const playerContainer = document.getElementById("music-player-container");
  const closeBtn = document.getElementById("closePlayer");
  const volumeBar = document.querySelector(".volume-bar");
  const volumeFill = document.querySelector(".volume-fill");

  let isPlaying = false;

  audio.volume = 1;

  
  // ▶ Play / Pause
  playBtn.addEventListener("click", () => {
    if (!audio.src) return;
    isPlaying ? audio.pause() : audio.play();
  });

  audio.addEventListener("play", () => {
    isPlaying = true;
    playBtn.innerHTML = '<i data-lucide="pause"></i>';
    lucide.createIcons();
  });

  audio.addEventListener("pause", () => {
    isPlaying = false;
    playBtn.innerHTML = '<i data-lucide="play"></i>';
    lucide.createIcons();
    saveState();
  });

  
  // ⏱ Progresso
  let progressDragging = false;

  function getProgressPercent(e) {
    const rect = progressBar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }
  
  function setProgressVisual(e) {
    const percent = getProgressPercent(e);
    progressFill.style.width = (percent * 100) + "%";
  }
  
  function commitProgress(e) {
    const percent = getProgressPercent(e);
    progressFill.style.width = (percent * 100) + "%";
    audio.currentTime = percent * audio.duration;
    progressDragging = false;
  }
  
  progressBar.addEventListener("mousedown", (e) => { progressDragging = true; setProgressVisual(e); });
  progressBar.addEventListener("touchstart", (e) => { progressDragging = true; setProgressVisual(e); });
  document.addEventListener("mousemove", (e) => { if (progressDragging) setProgressVisual(e); });
  document.addEventListener("touchmove", (e) => { if (progressDragging) setProgressVisual(e); });
  document.addEventListener("mouseup", (e) => { if (progressDragging) commitProgress(e); });
  document.addEventListener("touchend", (e) => { if (progressDragging) commitProgress(e); });
  
  // ⏱ timeupdate — respeita o drag
  audio.addEventListener("timeupdate", () => {
    if (!progressDragging) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + "%";
    }
    currentTimeEl.textContent = formatTime(audio.currentTime);
    saveState();
  });

  
  // 🎤 Botão de letras
  document.querySelector('[title="Letras"]').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('playerState') || '{}');
    if (!state.song) return;
    if (window.openLyricsSidebar) {
      window.openLyricsSidebar(state.song);
    } else {
      console.warn("openLyricsSidebar ainda não está disponível");
    }
  });

  
  // 🔊 Volume
  (function() {
    let dragging = false;
  
    function setVolume(e) {
      const rect = volumeBar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const vol = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      audio.volume = vol;
      volumeFill.style.width = (vol * 100) + "%";
    }

    volumeBar.addEventListener("mousedown", (e) => { dragging = true; setVolume(e); });
    volumeBar.addEventListener("touchstart", (e) => { dragging = true; setVolume(e); });
    document.addEventListener("mousemove", (e) => { if (dragging) setVolume(e); });
    document.addEventListener("touchmove", (e) => { if (dragging) setVolume(e); });
    document.addEventListener("mouseup", () => dragging = false);
    document.addEventListener("touchend", () => dragging = false);
  })();

  
  // ❌ Fechar player
  closeBtn.addEventListener("click", () => {
    audio.pause();
    audio.src = "";
    playerContainer.classList.remove("player-visible");
    localStorage.removeItem("playerState");
  });

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  
  // 💾 Salvar estado
  function saveState() {
    const state = JSON.parse(localStorage.getItem("playerState") || "{}");
    if (state.song) {
      state.currentTime = audio.currentTime;
      localStorage.setItem("playerState", JSON.stringify(state));
    }
  }

  
  // 🔄 Retomar estado ao carregar
  function restoreState() {
    const state = JSON.parse(localStorage.getItem("playerState") || "{}");
    if (!state.song) return;
    applySongToPlayer(state.song);
    audio.currentTime = state.currentTime || 0;
    playerContainer.classList.add("player-visible");
  }

  function applySongToPlayer(song) {
    audio.src = song.audio_url;
    titleEl.textContent = song.title;
    artistEl.textContent = song.style;
    coverEl.style.backgroundImage = `url(${song.cover_url})`;
    coverEl.style.backgroundSize = "cover";
    coverEl.style.backgroundPosition = "center";
  }

  
  // 🎵 Função global chamada pela biblioteca
  window.setPlayerSong = function(song) {
    applySongToPlayer(song);
    audio.play();
    playerContainer.classList.add("player-visible");
    localStorage.setItem("playerState", JSON.stringify({ song, currentTime: 0 }));

    
    // Abre a sidebar de letras automaticamente ao dar play
    setTimeout(() => {
      if (window.openLyricsSidebar) {
        window.openLyricsSidebar(song);
      }
    }, 300);
  };

  restoreState();
}
