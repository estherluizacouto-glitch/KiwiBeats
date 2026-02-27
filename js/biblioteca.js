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

