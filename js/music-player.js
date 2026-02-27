document.addEventListener('click', function(e) {

    // PLAY
    if (e.target.closest('#playBtn')) {
        const playBtn = e.target.closest('#playBtn');
        const isPlaying = playBtn.classList.toggle('playing');

        playBtn.innerHTML = isPlaying
            ? '<i data-lucide="pause"></i>'
            : '<i data-lucide="play"></i>';

        if (window.lucide) lucide.createIcons();
    }

    // CLOSE
    if (e.target.closest('#closePlayer')) {
        const container = document.getElementById('music-player-container');
        if (!container) return;
    
        container.classList.add('hide-player');
    
        setTimeout(() => {
            container.style.display = 'none';
        }, 400);
    }

});
