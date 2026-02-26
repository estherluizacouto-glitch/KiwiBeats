const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    const logoutBtn = document.getElementById('logoutBtn');

    // Toggle sidebar
    if (sidebar && toggleBtn && toggleIcon) {
      toggleBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');

        toggleIcon.setAttribute(
          "data-lucide",
          isCollapsed ? "chevron-left" : "chevron-right"
        );

        lucide.createIcons();
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();

        localStorage.clear();
        sessionStorage.clear();

        window.location.href = '/KiwiBeats';
      });
    }

    // Carregar dados do usuário
    loadUserData();
  });

 // Carregar Music Player
fetch('components/music-player.html')
  .then(res => res.text())
  .then(data => {
    const container = document.getElementById('music-player-container');
    if (!container) return;

    container.innerHTML = data;

    lucide.createIcons();

    if (typeof initMusicPlayer === "function") {
      initMusicPlayer();
    }
  });

// Exemplo de músicas (depois você puxa do Supabase)
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



// Deletar música
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("delete-btn")) {
    const item = e.target.closest(".music-item");
    item.remove();
  }
});
