document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('music-player-container');
    const closeBtn = document.getElementById('closePlayer');
    const playBtn = document.getElementById('playBtn');

    if (!container) return;

    if (playBtn) {
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            playBtn.innerHTML = isPlaying
                ? '<i data-lucide="pause"></i>'
                : '<i data-lucide="play"></i>';

            if (window.lucide) lucide.createIcons();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.opacity = '0';
            setTimeout(() => {
                container.style.display = 'none';
            }, 400);
        });
    }
});


closeBtn.addEventListener('click', () => {
    console.log("CLIQUEI NO X");
});
