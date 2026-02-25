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

document.getElementById('closePlayer').addEventListener('click', function() {
    const container = document.getElementById('music-player-container');
    
    // Adiciona um efeito de saída suave
    container.style.transition = 'all 0.4s ease';
    container.style.opacity = '0';
    container.style.transform = 'translate(-50%, 20px)'; // Desce um pouco ao sair
    
    // Remove do DOM após a animação
    setTimeout(() => {
        container.style.display = 'none';
    }, 400);
});
