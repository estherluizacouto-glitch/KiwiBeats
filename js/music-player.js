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


  // ⏱ timeupdate
  audio.addEventListener("timeupdate", () => {
    if (!progressDragging) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = percent + "%";
    }
    currentTimeEl.textContent = formatTime(audio.currentTime);
    saveState();
  });


  // ⏱ Duração
  function updateDuration() {
    if (!isNaN(audio.duration)) {
      durationEl.textContent = formatTime(audio.duration);
    }
  }
  audio.addEventListener("loadedmetadata", updateDuration);
  audio.addEventListener("durationchange", updateDuration);


  // 🎤 Botão de letras
  document.querySelector('[title="Letras"]').addEventListener('click', () => {
    const state = JSON.parse(localStorage.getItem('playerState') || '{}');
    if (window.openLyricsSidebar && state.song) {
      window.openLyricsSidebar(state.song);
    }
  });

  
  // 🎵 Botão de fila
  document.getElementById("btnQueue").addEventListener("click", () => {
    if (window.QueueSidebar) window.QueueSidebar.toggle();
  });

  // Ouve quando o usuário clica em uma música na fila
  document.addEventListener("queueSelect", (e) => {
    const { song, index } = e.detail;
    applySongToPlayer({
      audio_url: song.audioUrl,
      title:     song.title,
      cover_url: song.cover,
      style:     song.artist ?? "",
    });
    audio.play();
    playerContainer.classList.add("player-visible");
    // Salva estado com a música correta
    localStorage.setItem("playerState", JSON.stringify({
      song: {
        audio_url: song.audioUrl,
        title:     song.title,
        cover_url: song.cover,
        style:     song.artist ?? "",
      },
      currentTime: 0,
    }));
  });


  // ⏭ Próxima música
  document.querySelector('[data-lucide="skip-forward"]').closest('button').addEventListener("click", () => {
    if (window.QueueSidebar) window.QueueSidebar.next();
  });


  // ⏮ Música anterior
  document.querySelector('[data-lucide="skip-back"]').closest('button').addEventListener("click", () => {
    if (window.QueueSidebar) window.QueueSidebar.prev();
  });


  // 🔀 Shuffle
  const shuffleBtn = document.querySelector('[data-lucide="shuffle"]').closest('button');
  shuffleBtn.addEventListener("click", () => {
    if (!window.QueueSidebar) return;
    document.getElementById("queueShuffleBtn")?.click();
    const isOn = window.QueueSidebar.shuffleOn;
    shuffleBtn.style.color = isOn ? "#88C549" : "";
  });


  // 🔁 Repeat
  let repeatMode = 0; // 0 = off, 1 = fila, 2 = música
  const repeatBtn = document.querySelector('[data-lucide="repeat"]').closest('button');

  repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;

    repeatBtn.style.color = repeatMode > 0 ? "#88C549" : "";

    // remove bolinha se existir
    repeatBtn.querySelector(".repeat-dot")?.remove();

    if (repeatMode === 2) {
      const dot = document.createElement("span");
      dot.className = "repeat-dot";
      dot.style.cssText = "position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:#88C549;";
      repeatBtn.style.position = "relative";
      repeatBtn.appendChild(dot);
    }
  });


  // Quando música termina
  audio.addEventListener("ended", () => {
    if (repeatMode === 2) {
      // Repete só essa música
      audio.currentTime = 0;
      audio.play();
    } else if (repeatMode === 1) {
      // Repete a fila — avança, e se for a última volta ao início
      if (window.QueueSidebar) {
        const q = window.QueueSidebar;
        if (q.currentIndex < q.queue.length - 1) {
          q.next();
        } else {
          q.selectSong(0); // volta ao início da fila
        }
      }
    } else {
      // Sem repeat — avança só se não for a última
      if (window.QueueSidebar) {
        const q = window.QueueSidebar;
        if (q.currentIndex < q.queue.length - 1) {
          q.next();
        }
      }
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
  window.setPlayerSong = async function(song) {
    applySongToPlayer(song);
    audio.play();
    playerContainer.classList.add("player-visible");
    localStorage.setItem("playerState", JSON.stringify({ song, currentTime: 0 }));

    // Sincroniza a fila com a música tocando agora
    if (window.QueueSidebar) {
      const idx = window.QueueSidebar.queue.findIndex(
        s => s.audioUrl === song.audio_url
      );
      if (idx !== -1) {
        window.QueueSidebar.setCurrentIndex(idx);
      } else {
        // Se não achou, recarrega a fila e tenta de novo
        await window.QueueSidebar.loadFromSupabase();
        const idx2 = window.QueueSidebar.queue.findIndex(
          s => s.audioUrl === song.audio_url
        );
        if (idx2 !== -1) window.QueueSidebar.setCurrentIndex(idx2);
      }
    }

    setTimeout(() => {
      if (window.openLyricsSidebar) window.openLyricsSidebar(song);
    }, 300);
  };


  // 🎶 Carrega músicas do Supabase na fila ao iniciar
  if (window.QueueSidebar) window.QueueSidebar.loadFromSupabase();

  restoreState();
}
