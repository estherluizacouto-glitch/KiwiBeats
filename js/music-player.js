/**
 * Gerenciador do Music Player - KiwiBeats
 */

function initMusicPlayer() {

    const container = document.getElementById('music-player');
    if (!container) return;

    const playBtn = container.querySelector('#playBtn');
    const closeBtn = container.querySelector('#closePlayer');

    // 🎵 Play / Pause
    if (playBtn) {
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;

            playBtn.innerHTML = isPlaying 
                ? '<i data-lucide="pause"></i>' 
                : '<i data-lucide="play"></i>';

            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    // ❌ Fechar Player
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {

            container.style.transition = 'all 0.4s ease';
            container.style.opacity = '0';
            container.style.transform = 'translate(-50%, 20px)';

            setTimeout(() => {
                container.style.display = 'none';
            }, 400);
        });
    }

    // Renderiza ícones
    if (window.lucide) {
        lucide.createIcons();
    }
}
