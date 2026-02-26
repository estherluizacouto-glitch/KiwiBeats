// Carregar componentes
fetch("components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;
  });

fetch("components/music-player.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("player-container").innerHTML = data;
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


// Abrir / fechar menu
document.addEventListener("click", function(e) {

  if (e.target.classList.contains("menu-btn")) {

    const dropdown = e.target.nextElementSibling;

    document.querySelectorAll(".dropdown")
      .forEach(d => d.style.display = "none");

    dropdown.style.display = "block";

  } else {

    document.querySelectorAll(".dropdown")
      .forEach(d => d.style.display = "none");

  }

});


// Deletar música
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("delete-btn")) {
    const item = e.target.closest(".music-item");
    item.remove();
  }
});
