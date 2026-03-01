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
  let isPlaying = false;

  playBtn.addEventListener("click", () => {
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
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
  });

  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  progressBar.addEventListener("click", (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  }

  window.setPlayerSong = function(song) {
    audio.src = song.audio_url;
    audio.play();
    titleEl.textContent = song.title;
    artistEl.textContent = song.style;
    coverEl.style.backgroundImage = `url(${song.cover_url})`;
    coverEl.style.backgroundSize = "cover";
    coverEl.style.backgroundPosition = "center";
  };
}
