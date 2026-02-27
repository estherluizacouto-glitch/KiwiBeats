document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os ícones do Lucide
    lucide.createIcons();

    // Função para abrir/fechar o menu
    document.addEventListener('click', (e) => {
        const isMenuBtn = e.target.closest('.menu-btn');
        
        // Se clicou no botão de três pontos
        if (isMenuBtn) {
            const container = isMenuBtn.closest('.menu-container');
            const dropdown = container.querySelector('.dropdown');
            
            // Fecha outros menus abertos antes de abrir este
            document.querySelectorAll('.dropdown.active').forEach(openMenu => {
                if (openMenu !== dropdown) openMenu.classList.remove('active');
            });

            dropdown.classList.toggle('active');
        } 
        // Se clicou fora, fecha todos os menus
        else {
            document.querySelectorAll('.dropdown.active').forEach(openMenu => {
                openMenu.classList.remove('active');
            });
        }
    });

    // Lógica para o botão deletar (exemplo)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const item = e.target.closest('.music-item');
            if (confirm('Deseja realmente deletar esta música?')) {
                item.style.opacity = '0';
                item.style.transform = 'translateX(20px)';
                setTimeout(() => item.remove(), 300);
            }
        }
    });
});

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

  const musicList = document.getElementById("music-list");

  if (musicList) {
    musics.forEach(music => {
      const item = document.createElement("div");
      item.classList.add("music-item");

      item.innerHTML = `
        <div class="music-left">
          <img src="${music.cover}" class="music-cover">
          <div class="music-info">
            <div class="music-name">${music.name}</div>
            <div class="music-meta">${music.duration} • ${music.style}</div>
          </div>
        </div>

        <div class="menu-container">
          <button class="menu-btn">⋮</button>
          <div class="dropdown">
            <button class="delete-btn">Deletar música</button>
          </div>
        </div>
      `;

      musicList.appendChild(item);
    });
  }

  // Deletar música
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
      const item = e.target.closest(".music-item");
      if (item) item.remove();
    }
  });

