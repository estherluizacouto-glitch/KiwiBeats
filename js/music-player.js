function initMusicPlayer() {

    const playBtn = document.getElementById("playBtn");

    if (!playBtn) return;

    let isPlaying = false;

    playBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;

        playBtn.innerHTML = isPlaying
            ? '<i data-lucide="pause"></i>'
            : '<i data-lucide="play"></i>';

        if (window.lucide) {
            lucide.createIcons();
        }
    });

}
