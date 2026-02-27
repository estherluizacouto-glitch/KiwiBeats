document.addEventListener('DOMContentLoaded', () => {
    const musicList = document.getElementById("music-list");

    // Lista de músicas
    const musics = [
        {
            name: "Posso até não te dar flores",
            duration: "02:08",
            style: "Funk Carioca 150 BPM",
            cover: "assets/capa1.jpg"
        },
        {
            name: "Eu aplico o chá, tu aplica a xota",
            duration: "01:29",
            style: "Funk MG",
            cover: "assets/capa2.jpg"
        }
    ];

    if (musicList) {
        musics.forEach(music => {
            const item = document.createElement("div");
            item.classList.add("music-item");

            // AJUSTE AQUI: Mudamos o ícone e o texto do botão
            item.innerHTML = `
                <div class="music-left">
                    <img src="${music.cover}" class="music-cover">
                    <div class="music-info">
                        <div class="music-name">${music.name}</div>
                        <div class="music-meta">${music.duration} • ${music.style}</div>
                    </div>
                </div>

                <div class="menu-container">
                    <button class="menu-btn"><i data-lucide="more-vertical"></i></button>
                    <div class="dropdown">
                        <button class="delete-btn">
                            <i data-lucide="trash-2"></i> Deletar
                        </button>
                    </div>
                </div>
            `;

            musicList.appendChild(item);
        });

        // IMPORTANTE: Inicializa os ícones APÓS criar a lista
        lucide.createIcons();
    }

    // Função para abrir/fechar o menu
    document.addEventListener('click', (e) => {
        const isMenuBtn = e.target.closest('.menu-btn');
        
        if (isMenuBtn) {
            const container = isMenuBtn.closest('.menu-container');
            const dropdown = container.querySelector('.dropdown');
            
            document.querySelectorAll('.dropdown.active').forEach(openMenu => {
                if (openMenu !== dropdown) openMenu.classList.remove('active');
            });

            dropdown.classList.toggle('active');
        } 
        else {
            document.querySelectorAll('.dropdown.active').forEach(openMenu => {
                openMenu.classList.remove('active');
            });
        }
    });

    // Lógica para deletar com animação
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (btn) {
            const item = btn.closest('.music-item');
            if (confirm('Deseja realmente deletar esta música?')) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                setTimeout(() => item.remove(), 300);
            }
        }
    });
});
