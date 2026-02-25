/**
 * Gerenciador do Music Player - KiwiBeats
 */

function initMusicPlayer() {
    // 1. Seleção de Elementos
    const container = document.getElementById('music-player-container');
    const playBtn = document.getElementById('playBtn');
    const closeBtn = document.getElementById('closePlayer');
    
    if (!container) return; // Segurança caso o container não exista na página

    // --- Lógica de Play / Pause ---
    if (playBtn) {
        let isPlaying = false;

        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;

            // Altera o ícone internamente
            playBtn.innerHTML = isPlaying 
                ? '<i data-lucide="pause"></i>' 
                : '<i data-lucide="play"></i>';

            // Recarrega os ícones do Lucide para renderizar o novo SVG
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }

    // --- Lógica de Fechar o Player ---
    document.getElementById('closePlayer').addEventListener('click', function() {
    const container = document.getElementById('music-player-container');
    
    container.style.transition = 'all 0.5s ease-in-out'; 
    container.style.transform = 'translate(-50%, 0) scaleX(0)'; // Enche a largura em zero
    container.style.opacity = '0';

    setTimeout(() => { container.style.display = 'none'; }, 500);
});

    // Inicializa os ícones assim que o player carregar
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initMusicPlayer);

// Se você carrega o player via fetch/innerHTML, chame initMusicPlayer() 
// logo após inserir o HTML no container.
