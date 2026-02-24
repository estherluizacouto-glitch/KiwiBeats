document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const playBtn = document.getElementById("playBtn");
    let isPlaying = false;

    playBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;

        playBtn.innerHTML = isPlaying
            ? '<i data-lucide="pause"></i>'
            : '<i data-lucide="play"></i>';

        lucide.createIcons();
    });
});
