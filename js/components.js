document.addEventListener("DOMContentLoaded", () => {

  // 🔹 Função genérica para carregar componentes
  function loadComponent(containerId, filePath, callback = null) {
    const container = document.getElementById(containerId);

    if (!container) return; // Se a página não tiver o container, ignora

    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar ${filePath}`);
        }
        return response.text();
      })
      .then(data => {
        container.innerHTML = data;

        // Recria ícones do Lucide após inserir HTML
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }

        // Executa callback se existir (ex: iniciar player)
        if (typeof callback === "function") {
          callback();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // 🔹 Carregar Sidebar
  loadComponent(
    "sidebar-container",
    "components/sidebar.html"
  );

  // 🔹 Carregar Music Player
  loadComponent(
    "music-player-container",
    "components/music-player.html",
    () => {
      if (typeof initMusicPlayer === "function") {
        initMusicPlayer();
      }
    }
  );

});
